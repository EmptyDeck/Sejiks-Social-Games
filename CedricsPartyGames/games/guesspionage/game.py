"""Guesspionage — a faithful recreation of Jackbox's Poll Position (Guesspionage).
Questions, audio IDs, and bonus data come verbatim from PollPosition content.
Rules: two rounds of Higher/Lower turns (each started by the current player picking
a category), one bonus round at the end where everyone picks the top answer.
"""
import importlib.util
import random
from pathlib import Path

_spec = importlib.util.spec_from_file_location("guesspionage_data", Path(__file__).with_name("_data.py"))
_d = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_d)
QUESTIONS, BONUSES = _d.QUESTIONS, _d.BONUSES

META = {
    "id": "guesspionage",
    "title": {"en": "Guesspionage", "ko": "게스피오나지"},
    "tagline": {
        "en": "Guess what percent of people do it. Everyone bets higher or lower.",
        "ko": "몇 퍼센트나 그럴까요? 맞히거나, 높다 낮다에 걸어 보세요.",
    },
    "emoji": "🕵️",
    "theme": {"bg": "#0d1b2a", "accent": "#00aaff"},
}

GUESS_SECS, CALL_SECS, BONUS_SECS = 45, 20, 45
MAX_PTS, MAX_ERR = 3000, 30
CALL_PTS, MUCH_PTS, MUCH_GAP = 1000, 2000, 15
BONUS_PAY = 2000
MAX_TURNS = 6
MUCH_MAX_PLAYERS = 5
SHRUG = 50
REVEAL_SFX_MS = 2600
DIRS = ("hi", "lo", "mhi", "mlo")

BOTS = [
    {"id": "b0", "name": {"en": "Agent Fennel", "ko": "요원 페넬"}},
    {"id": "b1", "name": {"en": "Agent Moth", "ko": "요원 나방"}},
    {"id": "b2", "name": {"en": "Agent Quill", "ko": "요원 깃펜"}},
]


def guess_points(guess, real):
    d = abs(guess - real)
    if d > MAX_ERR:
        return 0
    return int(round(MAX_PTS * (1 - d / MAX_ERR) / 10.0)) * 10


def call_points(direction, guess, real):
    if guess == real or direction not in DIRS:
        return 0
    up, gap = real > guess, abs(real - guess)
    if direction == "hi":
        return CALL_PTS if up else 0
    if direction == "lo":
        return CALL_PTS if not up else 0
    if direction == "mhi":
        return MUCH_PTS if up and gap > MUCH_GAP else 0
    return MUCH_PTS if (not up) and gap > MUCH_GAP else 0


def _int(v, lo, hi):
    if isinstance(v, bool):
        return None
    if isinstance(v, float) and v.is_integer():
        v = int(v)
    if isinstance(v, int) and lo <= v <= hi:
        return v
    return None


def _categories(pool, used_ids, family_ok):
    seen_cats = {}
    for q in pool:
        if q["id"] in used_ids:
            continue
        if not family_ok and not q["x"]:
            continue
        if family_ok and q["x"]:
            continue
        cat = q["cat"]
        if cat and cat not in seen_cats:
            seen_cats[cat] = q
    return seen_cats  # cat -> first available question


class Game:
    def __init__(self, room):
        self.room = room
        self.rng = random.Random()
        self.screen = "setup"
        self.opt_timers = True
        self.opt_family = True
        self.ids = []
        self.first = None
        self.scores = {}
        self.used_q, self.used_b = set(), set()
        self.step = 0
        self._lt = None
        self._reset()

    def _reset(self):
        self.order, self.k, self.per_round = [], 0, 0
        self.turn = None
        self.bonus = None
        self.bots = []
        self.deadline, self.total = None, 0
        self.sfx_at = None
        self.ending = False
        self.deltas = {}
        self.cats = []     # available categories for current picker
        self.picked_cat = None

    def start(self):
        self.ids = [p.id for p in self.room.active_players()]
        self.first = self.ids[0] if self.ids else None
        self.scores = {i: 0 for i in self.ids}

    def _enter(self, screen, secs=None):
        self.screen = screen
        self.step += 1
        self.ending = False
        self.sfx_at = None
        if self.opt_timers and secs:
            self.deadline, self.total = self.room.now() + secs * 1000, secs * 1000
        else:
            self.deadline, self.total = None, 0

    def _round_of(self, k):
        return 1 if k < self.per_round else 2

    def _much(self):
        return self._round_of(self.k) == 2 and len(self.ids) <= MUCH_MAX_PLAYERS

    def _callers(self):
        return [i for i in self.ids if i != self.turn["guesser"]]

    def _connected(self, pid):
        p = self.room.players.get(pid)
        return bool(p and p.connected)

    def _picker(self):
        return self.order[self.k % len(self.order)]

    def _ranking(self):
        rows = sorted(self.ids, key=lambda i: -self.scores.get(i, 0))
        out, prev, rank = [], None, 0
        for n, pid in enumerate(rows, 1):
            s = self.scores.get(pid, 0)
            if s != prev:
                rank, prev = n, s
            out.append({"id": pid, "score": s, "rank": rank})
        return out

    def _build_cats(self):
        pool = QUESTIONS
        used = self.used_q
        cats = {}
        for q in pool:
            if q["id"] in used:
                continue
            if self.opt_family and q["x"]:
                continue
            cat = q.get("cat", "")
            if cat and cat not in cats:
                cats[cat] = q["id"]
        # return sorted list of cat names
        return sorted(cats.keys())

    def _pick_question_for_cat(self, cat):
        cands = [q for q in QUESTIONS
                 if q.get("cat") == cat
                 and q["id"] not in self.used_q
                 and (not self.opt_family or not q["x"])]
        if not cands:
            cands = [q for q in QUESTIONS if q.get("cat") == cat and (not self.opt_family or not q["x"])]
            self.used_q.difference_update(q["id"] for q in cands)
        if not cands:
            cands = QUESTIONS
        return self.rng.choice(cands)

    def on_action(self, player, a):
        if not isinstance(a, dict) or player.id not in self.ids:
            return
        kind, pid = a.get("type"), player.id
        if kind == "pick_cat" and self.screen == "category":
            return self._pick_category(pid, a.get("cat"))
        if kind == "guess" and self.screen == "guess":
            return self._guess(pid, a.get("value"))
        if kind == "call" and self.screen == "call":
            return self._call(pid, a.get("dir"))
        if kind == "pick_bonus" and self.screen == "bonus":
            return self._pick_bonus(pid, a.get("i"))
        if kind == "lock_bonus" and self.screen == "bonus":
            return self._lock_bonus(pid)
        if self.room.is_leader(player):
            self._leader(kind, a)

    def on_host_action(self, a):
        if isinstance(a, dict):
            self._leader(a.get("type"), a)

    def _leader(self, kind, a):
        s = self.screen
        if s == "setup":
            if kind == "toggle_timers":
                self.opt_timers = not self.opt_timers
            elif kind == "toggle_family":
                self.opt_family = not self.opt_family
            elif kind == "first_random" and self.ids:
                self.first = self.rng.choice(self.ids)
            elif kind == "first_set" and isinstance(a.get("id"), str) and a["id"] in self.ids:
                self.first = a["id"]
            elif kind == "begin":
                self._begin()
            elif kind == "lobby":
                self.room.to_lobby()
            return
        if s == "end":
            if kind == "again":
                self._reset()
                self.scores = {i: 0 for i in self.ids}
                self._enter("setup")
            elif kind == "lobby":
                self.room.to_lobby()
            return
        if a.get("step") != self.step:
            return
        if kind == "end_ask":
            self.ending = True
        elif kind == "end_cancel":
            self.ending = False
        elif kind == "end":
            if self.ending:
                self._to_end()
        elif kind == "next":
            if s == "category":
                self._category_timeout()
            elif s == "guess":
                self._guess_timeout("skip")
            elif s == "call":
                self._reveal()
            elif s == "reveal":
                self._next_turn()
            elif s == "bonus":
                self._bonus_reveal()
            elif s == "bonusreveal":
                self._to_end()

    def _begin(self):
        n = len(self.ids)
        if n == 0:
            return
        if self.first not in self.ids:
            self.first = self.ids[0]
        i = self.ids.index(self.first)
        self.order = self.ids[i:] + self.ids[:i]
        self.scores = {p: 0 for p in self.ids}
        self.per_round = 2 if n == 1 else min(n, MAX_TURNS)
        self.bots = BOTS if n == 1 else []
        self.k = 0
        self._start_category()

    def _start_category(self):
        self.cats = self._build_cats()
        self.picked_cat = None
        self.deltas = {}
        self._enter("category", CALL_SECS)

    def _pick_category(self, pid, cat):
        if pid != self._picker() and not (self.bots and pid == self.bots[0]["id"]):
            return
        if cat not in self.cats:
            return
        self.picked_cat = cat
        self._start_turn_for_cat(cat)

    def _category_timeout(self):
        if not self.cats:
            self.cats = self._build_cats()
        cat = self.rng.choice(self.cats) if self.cats else None
        if cat:
            self.picked_cat = cat
            self._start_turn_for_cat(cat)

    def _start_turn_for_cat(self, cat):
        q = self._pick_question_for_cat(cat)
        self.used_q.add(q["id"])
        guesser = self.order[self.k % len(self.order)]
        bot = bool(self.bots) and self.k % 2 == 1
        if bot:
            guesser = self.bots[(self.k // 2) % len(self.bots)]["id"]
        self.turn = {
            "q": q, "guesser": guesser,
            "guess": None, "shrug": False, "why": None,
            "calls": {}, "result": None,
        }
        self.deltas = {}
        if bot:
            real = q["pct"]
            self.turn["guess"] = max(0, min(100, real + self.rng.choice((-1, 1)) * self.rng.randint(3, 38)))
            self._enter("call", CALL_SECS)
        else:
            self._enter("guess", GUESS_SECS)

    def _guess(self, pid, v):
        t = self.turn
        g = _int(v, 0, 100)
        if pid != t["guesser"] or t["guess"] is not None or g is None:
            return
        t["guess"] = g
        self._after_guess()

    def _guess_timeout(self, why="time"):
        t = self.turn
        if t["guess"] is None:
            t["guess"], t["shrug"], t["why"] = SHRUG, True, why
        self._after_guess()

    def _after_guess(self):
        if self._callers():
            self._enter("call", CALL_SECS)
        else:
            self._reveal()

    def _call(self, pid, d):
        t = self.turn
        allowed = DIRS if self._much() else DIRS[:2]
        if pid == t["guesser"] or pid in t["calls"] or d not in allowed:
            return
        t["calls"][pid] = d
        self._auto()

    def _auto(self):
        if self.screen == "call":
            live = [c for c in self._callers() if self._connected(c)]
            if live and all(c in self.turn["calls"] for c in live):
                self._reveal()
                return True
        elif self.screen == "bonus":
            live = [c for c in self.ids if self._connected(c)]
            if live and all(c in self.bonus["locked"] for c in live):
                self._bonus_reveal()
                return True
        return False

    def on_leave(self, player):
        if player.id in self.ids:
            self._auto()

    def _reveal(self):
        t = self.turn
        if t["guess"] is None:
            t["guess"], t["shrug"], t["why"] = SHRUG, True, "skip"
        real, guess, guesser = t["q"]["pct"], t["guess"], t["guesser"]
        gpts = 0 if t["shrug"] else guess_points(guess, real)
        deltas = {guesser: gpts} if guesser in self.ids else {}
        rows = []
        for pid in self._callers():
            if pid in t["calls"]:
                p = call_points(t["calls"][pid], guess, real)
                deltas[pid] = p
                rows.append({"id": pid, "dir": t["calls"][pid], "pts": p, "bot": False})
        for b in (self.bots if guesser in self.ids else []):
            d = self.rng.choice(DIRS if self._much() else DIRS[:2])
            rows.append({"id": b["id"], "dir": d, "pts": call_points(d, guess, real), "bot": True, "name": b["name"]})
        for pid, p in deltas.items():
            self.scores[pid] = self.scores.get(pid, 0) + p
        t["result"] = {"real": real, "gpts": gpts, "calls": rows}
        self.deltas = deltas
        self._enter("reveal")
        self.sfx_at = self.room.now() + REVEAL_SFX_MS

    def _next_turn(self):
        self.k += 1
        if self.k >= 2 * self.per_round:
            self._start_bonus()
        else:
            self._start_category()

    def _start_bonus(self):
        cands = [b for b in BONUSES
                 if b["id"] not in self.used_b
                 and b["choices"] and b["vals"]
                 and (not self.opt_family or not b["x"])]
        if not cands:
            self.used_b.clear()
            cands = [b for b in BONUSES if b["choices"] and b["vals"] and (not self.opt_family or not b["x"])]
        if not cands:
            self._to_end()
            return
        b = self.rng.choice(cands)
        self.used_b.add(b["id"])
        # Sort choices by val descending, then shuffle display order
        pairs = sorted(zip(b["vals"], b["choices"]), reverse=True)
        all_vals = [v for v, _ in pairs]
        all_choices = [c for _, c in pairs]
        disp = list(range(len(all_choices)))
        self.rng.shuffle(disp)
        self.bonus = {
            "b": b, "choices": all_choices, "vals": all_vals,
            "disp": disp, "picks": {}, "locked": set(), "result": None
        }
        self.deltas = {}
        self._enter("bonus", BONUS_SECS)

    def _pick_bonus(self, pid, i):
        B = self.bonus
        i = _int(i, 0, len(B["disp"]) - 1)
        if i is None or pid in B["locked"]:
            return
        cur = B["picks"].setdefault(pid, [])
        if i in cur:
            cur.remove(i)
        elif len(cur) < 1:
            cur.append(i)

    def _lock_bonus(self, pid):
        B = self.bonus
        if pid in B["locked"] or len(B["picks"].get(pid, [])) != 1:
            return
        B["locked"].add(pid)
        self._auto()

    def _bonus_reveal(self):
        B = self.bonus
        # winner = choice with highest val (index 0 in sorted choices)
        winner_sorted_idx = 0  # index 0 = highest %
        deltas = {}
        for pid in self.ids:
            picks = B["picks"].get(pid, [])
            won = any(B["disp"][d] == winner_sorted_idx for d in picks) if picks else False
            p = BONUS_PAY if won else 0
            deltas[pid] = p
            self.scores[pid] = self.scores.get(pid, 0) + p
        self.deltas = deltas
        B["result"] = True
        self._enter("bonusreveal")
        self.sfx_at = self.room.now() + REVEAL_SFX_MS + 2000

    def _to_end(self):
        self._enter("end")
        self.deltas = {}

    def tick(self, now):
        changed = False
        dt, self._lt = (now - self._lt if self._lt else 0), now
        if self.deadline and not self.room.connected_players():
            self.deadline += dt
        if self._auto():
            changed = True
        if self.sfx_at and now >= self.sfx_at:
            self.sfx_at = None
            for pid, p in self.deltas.items():
                if self._connected(pid):
                    self.room.sfx("ding" if p > 0 else "buzz", to=pid)
        if self.deadline and now >= self.deadline and self.room.connected_players():
            s = self.screen
            self.deadline = None
            if s == "category":
                self._category_timeout()
            elif s == "guess":
                self._guess_timeout()
            elif s == "call":
                self._reveal()
            elif s == "bonus":
                self._bonus_reveal()
            changed = True
        return changed

    def view(self, player):
        pid = player.id if player else None
        s = self.screen
        v = {
            "screen": s, "round": self.step, "ids": self.ids, "scores": dict(self.scores),
            "opts": {"timers": self.opt_timers, "family": self.opt_family},
            "solo": len(self.ids) == 1,
            "ending": self.ending, "timer": None, "ranking": self._ranking(),
        }
        if self.deadline and s in ("category", "guess", "call", "bonus"):
            v["timer"] = {"deadline": self.deadline, "total": self.total}

        if s == "setup":
            v["first"] = self.first
            return v

        if s == "end":
            top = v["ranking"][0]["score"] if v["ranking"] else 0
            v["winners"] = [r["id"] for r in v["ranking"] if r["rank"] == 1]
            v["topScore"] = top
            return v

        if s == "category":
            v["picker"] = self._picker()
            v["cats"] = self.cats
            v["stage"] = {"round": self._round_of(self.k), "turn": self.k % self.per_round + 1, "of": self.per_round}
            return v

        if s in ("guess", "call", "reveal"):
            t = self.turn
            v["stage"] = {"round": self._round_of(self.k), "turn": self.k % self.per_round + 1, "of": self.per_round}
            v["q"] = {"text": t["q"]["text"], "cat": t["q"]["cat"],
                      "qa": t["q"].get("qa", ""), "ia": t["q"].get("ia", ""), "ra": t["q"].get("ra", "")}
            v["guesser"] = t["guesser"]
            v["botGuesser"] = next((b["name"] for b in BOTS if b["id"] == t["guesser"]), None)
            v["much"] = self._much()
            if s in ("call", "reveal"):
                v["guess"], v["shrug"], v["why"] = t["guess"], t["shrug"], t["why"]
            if s == "call":
                v["called"] = [c for c in self._callers() if c in t["calls"]]
                v["mine"] = t["calls"].get(pid) if pid else None
            if s == "reveal":
                r = t["result"]
                v["real"], v["gpts"], v["calls"], v["deltas"] = r["real"], r["gpts"], r["calls"], dict(self.deltas)
                # response audio
                v["q"]["ra"] = t["q"].get("ra", "")
            return v

        B = self.bonus
        v["stage"] = {"round": 3}
        v["prompt"] = B["b"]["text"]
        v["cat"] = B["b"].get("cat", "")
        if s == "bonus":
            v["answers"] = [B["choices"][B["disp"][d]] for d in range(len(B["disp"]))]
            v["locked"] = [c for c in self.ids if c in B["locked"]]
            v["mine"] = list(B["picks"].get(pid, [])) if pid else []
            v["myLocked"] = bool(pid and pid in B["locked"])
        else:  # bonusreveal
            # Build items in display order (original bonus screen order), carrying disp_idx for client pick matching
            items = []
            pct_list = [B["vals"][B["disp"][d]] for d in range(len(B["disp"]))]
            # compute rank based on pct (1 = highest)
            sorted_pcts = sorted(set(pct_list), reverse=True)
            pct_rank = {p: i + 1 for i, p in enumerate(sorted_pcts)}
            for d in range(len(B["disp"])):
                sorted_idx = B["disp"][d]
                pct = B["vals"][sorted_idx]
                items.append({
                    "text": B["choices"][sorted_idx],
                    "pct": pct,
                    "rank": pct_rank[pct],
                    "winner": sorted_idx == 0,
                    "disp_idx": d,  # original bonus screen index, for client pick highlighting
                })
            # sort by pct descending for reveal animation
            items.sort(key=lambda x: -x["pct"])
            v["answers"] = items
            v["picks"] = {c: list(B["picks"].get(c, [])) for c in self.ids}
            v["deltas"] = dict(self.deltas)
        return v

"""Spy Poll - a pollster's guessing game (mechanics inspired by party poll games, original spy-agency theme).

One agent per turn estimates what percent of people something is true for; everybody else secretly calls
HIGHER or LOWER; then the real number is revealed. Two rounds of turns, then a final 3-of-9 round.
Owner decisions for THIS game (see DESIGN-NOTES.md): timers are allowed (optional, default on), no minimum/maximum
players, solo test mode with three virtual agents, no audience. Server-authoritative: the real percentage and other
players' calls / picks are never in a view before the reveal.
"""
import importlib.util
import random
from pathlib import Path

_spec = importlib.util.spec_from_file_location("spy_poll_questions", Path(__file__).with_name("questions.py"))
_q = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_q)
QUESTIONS, FINALS = _q.QUESTIONS, _q.FINALS

META = {
    "id": "spy-poll",
    "title": {"en": "Spy Poll", "ko": "스파이 여론조사"},
    "tagline": {
        "en": "Guess what percent of people do it. Everyone else bets higher or lower.",
        "ko": "몇 퍼센트일까요? 맞히거나, 높다 낮다에 걸어 보세요.",
    },
    "emoji": "🕵️",
    "theme": {"bg": "#0e1a1f", "accent": "#f2c14e"},
}

# ── rules / numbers ──
GUESS_SECS, CALL_SECS, FINAL_SECS = 45, 20, 60
MAX_PTS, MAX_ERR = 3000, 30          # guesser: 3000 when exact, linear down to 0 at 30 points off
CALL_PTS, MUCH_PTS, MUCH_GAP = 1000, 2000, 15
FINAL_PAY = (4000, 2000, 1000)
MAX_TURNS = 6                        # turns per round (bigger groups continue the rotation in round 2)
MUCH_MAX_PLAYERS = 5
SHRUG = 50
REVEAL_SFX_MS = 2600                 # per-player ding/buzz, timed to the staged reveal in the client
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
        return 0                      # an exact guess beats every caller; equal never counts as higher/lower
    up, gap = real > guess, abs(real - guess)
    if direction == "hi":
        return CALL_PTS if up else 0
    if direction == "lo":
        return CALL_PTS if not up else 0
    if direction == "mhi":
        return MUCH_PTS if up and gap > MUCH_GAP else 0
    return MUCH_PTS if (not up) and gap > MUCH_GAP else 0


def _int(v, lo, hi):
    """Validate, don't coerce: ints (or integral floats) in range, never bools/strings."""
    if isinstance(v, bool):
        return None
    if isinstance(v, float) and v.is_integer():
        v = int(v)
    if isinstance(v, int) and lo <= v <= hi:
        return v
    return None


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
        self.used_q, self.used_f = set(), set()
        self.step = 0
        self._lt = None
        self._reset()

    def _reset(self):
        self.order, self.k, self.per_round = [], 0, 0
        self.turn = None
        self.final = None
        self.bots = []
        self.deadline, self.total = None, 0
        self.sfx_at = None
        self.ending = False
        self.deltas = {}

    def start(self):
        self.ids = [p.id for p in self.room.active_players()]
        self.first = self.ids[0] if self.ids else None
        self.scores = {i: 0 for i in self.ids}

    # ── helpers ──
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

    def _draw(self, pool, used, key_ok):
        cand = [x for x in pool if key_ok(x)]
        fresh = [x for x in cand if x["id"] not in used]
        if not fresh:
            used.difference_update(x["id"] for x in cand)
            fresh = cand
        pick = self.rng.choice(fresh)
        used.add(pick["id"])
        return pick

    def _ranking(self):
        rows = sorted(self.ids, key=lambda i: -self.scores.get(i, 0))      # stable: ties keep join order
        out, prev, rank = [], None, 0
        for n, pid in enumerate(rows, 1):
            s = self.scores.get(pid, 0)
            if s != prev:
                rank, prev = n, s
            out.append({"id": pid, "score": s, "rank": rank})
        return out

    # ── input ──
    def on_action(self, player, a):
        if not isinstance(a, dict) or player.id not in self.ids:
            return
        kind, pid = a.get("type"), player.id
        if kind == "guess" and self.screen == "guess":
            return self._guess(pid, a.get("value"))
        if kind == "call" and self.screen == "call":
            return self._call(pid, a.get("dir"))
        if kind == "pick" and self.screen == "final":
            return self._pick(pid, a.get("i"))
        if kind == "lock" and self.screen == "final":
            return self._lock(pid)
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
        # every in-game leader action must name the screen it was tapped on (data-step): a double tap, or the phone and
        # the laptop tapping together, then acts once and the late copy is dropped instead of hitting the NEXT screen
        if a.get("step") != self.step:
            return
        if kind == "end_ask":
            self.ending = True
        elif kind == "end_cancel":
            self.ending = False
        elif kind == "end":
            if self.ending:                      # only honoured after the two-step confirm
                self._to_end()
        elif kind == "next":
            if s == "guess":
                self._guess_timeout("skip")
            elif s == "call":
                self._reveal()
            elif s == "reveal":
                self._next_turn()
            elif s == "final":
                self._final_reveal()
            elif s == "finalreveal":
                self._to_end()

    # ── turns ──
    def _begin(self):
        n = len(self.ids)
        if n == 0:
            return
        if self.first not in self.ids:
            self.first = self.ids[0]
        i = self.ids.index(self.first)
        self.order = self.ids[i:] + self.ids[:i]
        self.scores = {p: 0 for p in self.ids}
        self.per_round = 2 if n == 1 else min(n, MAX_TURNS)      # solo: 2 turns a round (you guess, then a bot guesses)
        self.bots = BOTS if n == 1 else []
        self.k = 0
        self._start_turn()

    def _start_turn(self):
        fam = self.opt_family
        q = self._draw(QUESTIONS, self.used_q, lambda x: x["family"] or not fam)
        guesser = self.order[self.k % len(self.order)]
        bot = bool(self.bots) and self.k % 2 == 1
        if bot:                                  # solo test mode: a virtual agent guesses so YOU get to make the call
            guesser = self.bots[(self.k // 2) % len(self.bots)]["id"]
        self.turn = {"q": q, "guesser": guesser, "guess": None, "shrug": False, "why": None,
                     "calls": {}, "result": None}
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
        """Advance when every CONNECTED player has acted (never when nobody is connected). Returns True if it moved on."""
        if self.screen == "call":
            live = [c for c in self._callers() if self._connected(c)]
            if live and all(c in self.turn["calls"] for c in live):
                self._reveal()
                return True
        elif self.screen == "final":
            live = [c for c in self.ids if self._connected(c)]
            if live and all(c in self.final["locked"] for c in live):
                self._final_reveal()
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
        gpts = 0 if t["shrug"] else guess_points(guess, real)     # a shrug (50) is a non-answer: it never pays the guesser
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
            self._start_final()
        else:
            self._start_turn()

    # ── final round ──
    def _start_final(self):
        fam = self.opt_family
        f = self._draw(FINALS, self.used_f, lambda x: x["family"] or not fam)
        disp = list(range(len(f["answers"])))
        self.rng.shuffle(disp)
        self.final = {"f": f, "disp": disp, "picks": {}, "locked": set(), "result": None}
        self.deltas = {}
        self._enter("final", FINAL_SECS)

    def _pick(self, pid, i):
        F = self.final
        i = _int(i, 0, len(F["disp"]) - 1)
        if i is None or pid in F["locked"]:
            return
        cur = F["picks"].setdefault(pid, [])
        if i in cur:
            cur.remove(i)
        elif len(cur) < 3:
            cur.append(i)

    def _lock(self, pid):
        F = self.final
        if pid in F["locked"] or len(F["picks"].get(pid, [])) != 3:
            return
        F["locked"].add(pid)
        self._auto()

    def _final_ranks(self):
        """display index -> rank (1 = highest percentage)."""
        F = self.final
        pct = [F["f"]["answers"][o]["pct"] for o in F["disp"]]
        order = sorted(range(len(pct)), key=lambda d: -pct[d])
        return {d: r + 1 for r, d in enumerate(order)}, pct

    def _final_reveal(self):
        F = self.final
        ranks, _ = self._final_ranks()
        deltas = {}
        for pid in self.ids:
            deltas[pid] = sum(FINAL_PAY[ranks[d] - 1] for d in F["picks"].get(pid, []) if ranks[d] <= 3)
            self.scores[pid] = self.scores.get(pid, 0) + deltas[pid]
        self.deltas = deltas
        F["result"] = True
        self._enter("finalreveal")
        self.sfx_at = self.room.now() + REVEAL_SFX_MS + 5200

    def _to_end(self):
        self._enter("end")
        self.deltas = {}

    # ── clock ──
    def tick(self, now):
        changed = False
        dt, self._lt = (now - self._lt if self._lt else 0), now
        if self.deadline and not self.room.connected_players():
            self.deadline += dt                   # the clock does not run while nobody is there
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
            if s == "guess":
                self._guess_timeout()
            elif s == "call":
                self._reveal()
            elif s == "final":
                self._final_reveal()
            changed = True
        return changed

    # ── what each screen sees ──
    def view(self, player):
        pid = player.id if player else None
        s = self.screen
        v = {"screen": s, "round": self.step, "ids": self.ids, "scores": dict(self.scores),
             "opts": {"timers": self.opt_timers, "family": self.opt_family}, "solo": len(self.ids) == 1,
             "ending": self.ending, "timer": None, "ranking": self._ranking()}
        if self.deadline and s in ("guess", "call", "final"):
            v["timer"] = {"deadline": self.deadline, "total": self.total}
        if s == "setup":
            v["first"] = self.first
            return v
        if s == "end":
            top = v["ranking"][0]["score"] if v["ranking"] else 0
            v["winners"] = [r["id"] for r in v["ranking"] if r["rank"] == 1]
            v["topScore"] = top
            return v
        if s in ("guess", "call", "reveal"):
            t = self.turn
            v["stage"] = {"round": self._round_of(self.k), "turn": self.k % self.per_round + 1, "of": self.per_round}
            v["q"] = {"text": t["q"]["text"]}
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
            return v
        F = self.final
        v["stage"] = {"round": 3}
        v["prompt"] = F["f"]["prompt"]
        if s == "final":
            v["answers"] = [{"text": F["f"]["answers"][o]["text"]} for o in F["disp"]]
            v["locked"] = [c for c in self.ids if c in F["locked"]]
            v["mine"] = list(F["picks"].get(pid, [])) if pid else []
            v["myLocked"] = bool(pid and pid in F["locked"])
        else:
            ranks, pct = self._final_ranks()
            v["answers"] = [{"text": F["f"]["answers"][o]["text"], "pct": pct[d], "rank": ranks[d]} for d, o in enumerate(F["disp"])]
            v["order"] = sorted(range(len(pct)), key=lambda d: pct[d])        # 9th place first
            v["picks"] = {c: list(F["picks"].get(c, [])) for c in self.ids}
            v["deltas"] = dict(self.deltas)
            v["pay"] = list(FINAL_PAY)
        return v

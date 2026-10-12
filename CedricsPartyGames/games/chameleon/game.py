"""Chameleon — everyone but the chameleon(s) knows the secret word; players take turns describing it OUT LOUD
while sitting together. The phones only carry the category's word grid, the hidden role, and the leader's controls.

Design notes (owner feedback v2, see DESIGN-NOTES.md):
  * NO timers, NO rounds, NO scores — a sofa game; the leader decides when to move on.
  * EVERY phone looks and behaves the same (same grid, same hold-to-reveal), so nobody can spot the chameleon by
    watching who keeps staring at their phone.
  * Leader (the phone that entered the PIN, or the laptop) controls: options, who speaks first, vote / reveal, next word.
"""
import importlib.util
import os
import random
from pathlib import Path

_spec = importlib.util.spec_from_file_location("chameleon_words", Path(__file__).with_name("words.py"))
_words = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_words)
CATEGORIES = _words.CATEGORIES            # (id, en, ko, [(en, ko) x 36])
CAT = {c[0]: c for c in CATEGORIES}

META = {
    "id": "chameleon",
    "title": {"en": "Chameleon", "ko": "카멜레온"},
    "tagline": {
        "en": "One of you has no idea what the word is. Describe it. Blend in.",
        "ko": "한 명은 단어를 모릅니다. 돌아가며 설명하고, 들키지 말고 섞여 드세요.",
    },
    "emoji": "🦎",
    "theme": {"bg": "#06140d", "accent": "#b6ff3b"},
}


GRID_SIZE = 20                     # words on every screen (owner: "within 20")
# Voting + the caught-chameleon guess are built and tested but HIDDEN for now (owner will decide after playing with friends).
# Turn on with CHAMELEON_VOTING=1 (or set True): the setup toggle, vote screen, guess screen and result tally all come back.
VOTING_ENABLED = os.environ.get("CHAMELEON_VOTING") == "1"


def L(en, ko):
    return {"en": en, "ko": ko}


class Game:
    def __init__(self, room):
        self.room = room
        self.screen = "setup"
        # options (leader edits on the setup screen)
        self.opt_vote = VOTING_ENABLED
        self.opt_k = 1
        self.enabled = [c[0] for c in CATEGORIES]
        self.ids = []                 # players in this game (snapshot at start)
        self.used = set()             # (category, word index) already played this session
        self.words_played = 0
        self.grid = []
        self._reset()

    def _reset(self):
        self.cat = None
        self.word_i = None
        self.chameleons = []
        self.seen = set()
        self.first = None
        self.votes = {}
        self.guesses = {}
        self.caught = []

    # ── helpers ──
    def _k_max(self):
        return max(1, len(self.ids) - 1)          # keep at least one insider; a solo test may still pick 1

    def _grid(self):
        return self.grid

    def start(self):
        self.ids = [p.id for p in self.room.active_players()]
        self.opt_k = min(self.opt_k, self._k_max())

    # ── input ──
    def on_action(self, player, a):
        kind, pid = a.get("type"), player.id
        if self.screen == "play" and kind == "seen":
            self.seen.add(pid)
        elif self.screen == "vote" and kind == "vote":
            t = a.get("id")
            if isinstance(t, str) and t in self.ids and t != pid:
                self.votes[pid] = t
        elif self.screen == "guess" and kind == "guess" and pid in self.caught:
            i = a.get("i")
            if isinstance(i, int) and 0 <= i < len(self._grid()):
                self.guesses[pid] = i
        elif self.room.is_leader(player):
            self._leader(kind, a)

    def on_host_action(self, a):          # the laptop's big screen has the same controls as the leader
        self._leader(a.get("type"), a)

    def _leader(self, kind, a):
        if self.screen == "setup":
            if kind == "toggle_cat" and a.get("id") in CAT:
                cid = a["id"]
                if cid in self.enabled:
                    if len(self.enabled) > 1:
                        self.enabled.remove(cid)
                else:
                    self.enabled = [c[0] for c in CATEGORIES if c[0] in self.enabled or c[0] == cid]
            elif kind == "all_cats":
                self.enabled = [c[0] for c in CATEGORIES]
            elif kind == "toggle_vote" and VOTING_ENABLED:
                self.opt_vote = not self.opt_vote
            elif kind == "chameleons" and isinstance(a.get("n"), int):
                self.opt_k = max(0 if len(self.ids) < 2 else 1, min(self._k_max(), a["n"]))
            elif kind == "begin":
                self._deal()
        elif self.screen == "play":
            if kind == "first_random":
                self.first = random.choice(self.ids)
            elif kind == "first_set" and a.get("id") in self.ids:
                self.first = a["id"]
            elif kind == "to_vote" and VOTING_ENABLED:
                self.votes = {}
                self.screen = "vote"
            elif kind == "reveal":
                self._finish()
        elif self.screen == "vote":
            if kind == "reveal":
                self._finish()
        elif self.screen == "guess":
            if kind == "show_answer":
                self.screen = "result"
                self.room.sfx("reveal")
        elif self.screen == "result":
            if kind == "next_word":
                self._deal()
            elif kind == "options":
                self._reset()
                self.screen = "setup"
            elif kind == "reset":                      # start the whole game over: forget used words, back to setup
                self.used.clear()
                self.words_played = 0
                self._reset()
                self.screen = "setup"
            elif kind == "lobby":
                self.room.to_lobby()

    # ── transitions ──
    def _deal(self):
        self._reset()
        pool = [(c, i) for c in self.enabled for i in range(36) if (c, i) not in self.used]
        if not pool:
            self.used.clear()
            pool = [(c, i) for c in self.enabled for i in range(36)]
        self.cat, orig_i = random.choice(pool)
        self.used.add((self.cat, orig_i))
        self.words_played += 1
        words = CAT[self.cat][3]
        others = [w for j, w in enumerate(words) if j != orig_i]
        self.grid = random.sample(others, min(GRID_SIZE, len(words)) - 1) + [words[orig_i]]
        random.shuffle(self.grid)
        self.word_i = self.grid.index(words[orig_i])
        self.chameleons = random.sample(self.ids, min(self.opt_k, len(self.ids)))
        self.screen = "play"
        self.room.sfx("whoosh")

    def _finish(self):
        """Leader reveals. With voting on, caught chameleons get one guess; otherwise straight to the result."""
        self.caught = []
        if self.opt_vote and self.screen == "vote" and self.chameleons:
            tally = self._tally()
            ranked = sorted(tally.values(), reverse=True)
            k = len(self.chameleons)
            threshold = ranked[k - 1] if len(ranked) >= k and ranked[k - 1] > 0 else 1
            self.caught = [c for c in self.chameleons if tally.get(c, 0) >= threshold and tally.get(c, 0) > 0]
        if self.caught:
            self.guesses = {}
            self.screen = "guess"
            self.room.sfx("drumroll")
        else:
            self.screen = "result"
            self.room.sfx("reveal")

    def _tally(self):
        t = {pid: 0 for pid in self.ids}
        for target in self.votes.values():
            t[target] = t.get(target, 0) + 1
        return t

    # ── what each screen sees ──
    def view(self, player):
        pid = player.id if player else None
        v = {"screen": self.screen, "votingEnabled": VOTING_ENABLED,
             "options": {"vote": self.opt_vote, "k": self.opt_k, "kMax": self._k_max()},
             "key": self.words_played, "ids": self.ids}
        if self.screen == "setup":
            v["categories"] = [{"id": c[0], "name": L(c[1], c[2])} for c in CATEGORIES]
            v["enabled"] = self.enabled
            return v
        v["category"] = L(CAT[self.cat][1], CAT[self.cat][2])
        v["grid"] = [L(*w) for w in self._grid()]            # the SAME for every phone and the big screen
        v["first"] = self.first
        if self.screen == "play":
            v["seen"] = sorted(self.seen)
        if self.screen == "vote":
            v["voted"] = sorted(self.votes)
            v["myVote"] = self.votes.get(pid)
        if self.screen == "guess":
            v["caught"] = self.caught
            v["guessed"] = sorted(self.guesses)
        # the secret: ONLY in the viewer's own view (never the big screen); revealed to everyone at the end
        if pid is not None and self.screen in ("play", "vote", "guess"):
            if pid in self.chameleons:
                v["role"] = "chameleon"
            else:
                v["role"] = "insider"
                v["secret"] = self.word_i
        if self.screen == "result":
            v["secret"] = self.word_i
            v["chameleons"] = self.chameleons
            v["tally"] = self._tally() if self.opt_vote and self.votes else None
            v["guesses"] = self.guesses
            v["caught"] = self.caught
        return v

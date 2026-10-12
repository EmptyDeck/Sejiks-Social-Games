"""NEON BUZZ — 80s arcade reaction game. Every phone goes dark, then flashes NOW; fastest tap wins.

Server-authoritative timing: reaction = (server time the tap arrived) - (server time the flash was
broadcast). Client timestamps are never used. The real flash moment is never sent before it happens.
"""
import random

META = {
    "id": "neon-buzz",
    "title": {"en": "Neon Buzz", "ko": "네온 버저"},
    "tagline": {
        "en": "Screen goes dark. It flashes. Tap first. Don't jump the gun.",
        "ko": "화면이 꺼지고, 번쩍하면, 제일 먼저 누르세요. 성급하면 감점!",
    },
    "emoji": "🕹️",
    "min_players": 3,
    "max_players": 8,
    "theme": {"bg": "#150a2e", "accent": "#ff2fb3"},
}

ROUNDS = 5
READY_MS = 2800
WAIT_MIN_MS, WAIT_MAX_MS = 2000, 6000
GO_WINDOW_MS = 3000          # how long after the flash a tap still counts
RESULT_MS = 7500
FALSE_START_PENALTY = 50
POINTS = [100, 70, 50, 35, 25, 15, 10, 5]   # by rank


class Game:
    def __init__(self, room):
        self.room = room
        self.screen = "ready"
        self.round = 0
        self.scores = {}
        self.best = {}            # player id -> best valid reaction ms this session
        self.deadline = 0
        self.flash_at = 0         # PRIVATE: when the flash is due (never in a view)
        self.go_at = 0            # server time the flash was actually broadcast
        self.taps = {}            # pid -> ms (valid, after flash)
        self.false = set()        # pids that tapped too early this round
        self.results = []

    # ── lifecycle ──
    def start(self):
        self.scores = {p.id: 0 for p in self.room.active_players()}
        self.best = {}
        self.round = 0
        self.next_round()

    def next_round(self):
        self.round += 1
        self.taps, self.false, self.results = {}, set(), []
        self.screen = "ready"
        self.deadline = self.room.now() + READY_MS
        self.room.sfx("whoosh")

    # ── input ──
    def on_action(self, player, a):
        kind = a.get("type")
        pid = player.id
        if pid not in self.scores:
            return
        now = self.room.now()
        if kind == "tap":
            if pid in self.taps or pid in self.false:
                return
            if self.screen == "wait":
                if now < self.flash_at:                 # jumped the gun
                    self.false.add(pid)
                    self.room.sfx("buzz", to=player)
                # else: flash is due but not broadcast yet: nobody could have seen it, ignore
            elif self.screen == "go":
                self.taps[pid] = max(0, now - self.go_at)
        elif kind == "again" and self.screen == "final":
            self.room.to_lobby()

    def on_host_action(self, a):
        if a.get("type") == "skip" and self.screen in ("result", "ready"):
            self.deadline = 0

    # ── time ──
    def _players(self):
        return [p.id for p in self.room.connected_players() if p.id in self.scores]

    def tick(self, now):
        s = self.screen
        if s == "ready":
            if now >= self.deadline:
                self.screen = "wait"
                self.flash_at = now + random.randint(WAIT_MIN_MS, WAIT_MAX_MS)
                self.deadline = 0
                return True
        elif s == "wait":
            ids = self._players()
            if ids and all(i in self.false for i in ids):
                return self.finish_round()             # everybody jumped: no flash
            if now >= self.flash_at:
                self.screen = "go"
                self.go_at = now
                self.deadline = now + GO_WINDOW_MS
                return True
        elif s == "go":
            ids = self._players()
            done = all(i in self.taps or i in self.false for i in ids)
            if now >= self.deadline or done:
                return self.finish_round()
        elif s == "result":
            if now >= self.deadline:
                if self.round >= ROUNDS:
                    self.screen = "final"
                    self.room.sfx("fanfare")
                else:
                    self.next_round()
                return True
        return False

    def finish_round(self):
        ranked = sorted(self.taps.items(), key=lambda kv: kv[1])
        res = []
        for rank, (pid, ms) in enumerate(ranked):
            pts = POINTS[min(rank, len(POINTS) - 1)]
            self.scores[pid] += pts
            if ms < self.best.get(pid, 10 ** 9):
                self.best[pid] = ms
            res.append({"id": pid, "ms": ms, "rank": rank + 1, "points": pts, "status": "ok"})
        for pid in self.scores:
            if pid in self.false:
                loss = min(FALSE_START_PENALTY, self.scores[pid])
                self.scores[pid] -= loss
                res.append({"id": pid, "ms": None, "rank": None, "points": -loss, "status": "false"})
            elif pid not in self.taps:
                res.append({"id": pid, "ms": None, "rank": None, "points": 0, "status": "miss"})
        self.results = res
        self.screen = "result"
        self.deadline = self.room.now() + RESULT_MS
        if ranked:
            self.room.sfx("win", to=ranked[0][0])
            self.room.sfx("cheer")
        else:
            self.room.sfx("lose")
        for r in res:
            if r["status"] == "false":
                self.room.sfx("lose", to=r["id"])
        return True

    # ── views ──
    def ranking(self):
        rows = [{"id": pid, "score": s, "best": self.best.get(pid)} for pid, s in self.scores.items()]
        return sorted(rows, key=lambda r: -r["score"])

    def view(self, player):
        v = {"screen": self.screen, "round": self.round, "rounds": ROUNDS}
        pid = player.id if player else None
        s = self.screen
        if s == "ready":
            v["deadline"], v["total"] = self.deadline, READY_MS
            v["ranking"] = self.ranking()
        elif s == "wait":
            v["false"] = sorted(self.false)
            v["mine"] = "false" if pid in self.false else None
        elif s == "go":
            v["tapped"] = sorted(self.taps)              # who is in, never the times
            v["false"] = sorted(self.false)
            v["mine"] = ("false" if pid in self.false else "tap" if pid in self.taps else None)
            v["myMs"] = self.taps.get(pid)               # own time only
        elif s == "result":
            v["deadline"], v["total"] = self.deadline, RESULT_MS
            v["results"] = self.results
            v["ranking"] = self.ranking()
        elif s == "final":
            v["ranking"] = self.ranking()
        return v

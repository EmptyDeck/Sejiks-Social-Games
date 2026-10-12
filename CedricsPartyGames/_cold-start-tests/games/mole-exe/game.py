"""MOLE.EXE — hidden-role bluffing. Everyone knows the secret word except one mole.

Concept: 4-8 players, 3 rounds. Agents see the secret word, the mole only the category. Everyone types a
one-word clue, then votes for the mole. A caught mole gets one shot at guessing the word; an uncaught
mole wins the round. Server-side rules only; hidden info (role, word) lives only in per-player views.
"""
import random

META = {
    "id": "mole-exe",
    "title": {"en": "MOLE.EXE", "ko": "두더지.exe"},
    "tagline": {
        "en": "One of you has no idea what the password is. Find the mole.",
        "ko": "한 명만 암호를 모릅니다. 침입자를 찾아내세요.",
    },
    "emoji": "🕶️",
    "min_players": 4,
    "max_players": 8,
    "theme": {"bg": "#030a05", "accent": "#39ff6a"},
}

ROUNDS = 3
BRIEF_SECONDS = 7
CLUE_SECONDS = 40
VOTE_SECONDS = 30
REVEAL_SECONDS = 8
GUESS_SECONDS = 20
RESULT_SECONDS = 10
MAX_CLUE = 16
MAX_GUESS = 30

PTS_CORRECT_VOTE = 100      # anyone who voted for the real mole
PTS_MOLE_ESCAPES = 300      # mole not caught
PTS_MOLE_STEALS = 200       # mole caught but guessed the word
PTS_AGENTS_HOLD = 100       # every agent when a caught mole misses the word
PTS_BET = 50                # correct bet on the mole's guess


def W(en, ko):
    return {"en": en, "ko": ko}


CATEGORIES = [
    {"name": W("Animals", "동물"), "words": [
        W("Penguin", "펭귄"), W("Giraffe", "기린"), W("Octopus", "문어"), W("Kangaroo", "캥거루"),
        W("Hedgehog", "고슴도치"), W("Dolphin", "돌고래"), W("Panda", "판다"), W("Chameleon", "카멜레온")]},
    {"name": W("Food", "음식"), "words": [
        W("Pizza", "피자"), W("Sushi", "초밥"), W("Kimchi", "김치"), W("Pancake", "팬케이크"),
        W("Ramen", "라면"), W("Hamburger", "햄버거"), W("Tteokbokki", "떡볶이"), W("Ice cream", "아이스크림")]},
    {"name": W("Places", "장소"), "words": [
        W("Library", "도서관"), W("Airport", "공항"), W("Beach", "해변"), W("Hospital", "병원"),
        W("Karaoke", "노래방"), W("Zoo", "동물원"), W("Subway", "지하철"), W("Cinema", "영화관")]},
    {"name": W("Jobs", "직업"), "words": [
        W("Astronaut", "우주비행사"), W("Chef", "요리사"), W("Firefighter", "소방관"), W("Teacher", "선생님"),
        W("Pilot", "조종사"), W("Detective", "탐정"), W("Magician", "마술사"), W("Barber", "이발사")]},
    {"name": W("Things", "물건"), "words": [
        W("Umbrella", "우산"), W("Toothbrush", "칫솔"), W("Telescope", "망원경"), W("Backpack", "배낭"),
        W("Mirror", "거울"), W("Scissors", "가위"), W("Headphones", "헤드폰"), W("Candle", "양초")]},
    {"name": W("Fun & Games", "놀이"), "words": [
        W("Chess", "체스"), W("Fireworks", "불꽃놀이"), W("Roller coaster", "롤러코스터"), W("Karaoke night", "회식"),
        W("Hide and seek", "숨바꼭질"), W("Bowling", "볼링"), W("Camping", "캠핑"), W("Birthday party", "생일파티")]},
]


def norm(s):
    return "".join(ch for ch in str(s).lower() if ch.isalnum())


def lev(a, b):
    prev = list(range(len(b) + 1))
    for i, ca in enumerate(a, 1):
        cur = [i]
        for j, cb in enumerate(b, 1):
            cur.append(min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (ca != cb)))
        prev = cur
    return prev[-1]


def guess_matches(guess, word):
    g = norm(guess)
    if not g:
        return False
    for lang in ("en", "ko"):
        w = norm(word[lang])
        if g == w or (lang == "en" and len(w) >= 5 and lev(g, w) <= 1):
            return True
    return False


class Game:
    def __init__(self, room):
        self.room = room
        self.screen = "briefing"
        self.round = 0
        self.deadline = 0
        self.scores = {}
        self.pids = []
        self.moles = []
        self.cats_left = []
        self.category = None
        self.word = None
        self.mole = None
        self.clues = {}
        self.warn = {}
        self.votes = {}
        self.caught = False
        self.tally = {}
        self.guess = None
        self.guess_ok = False
        self.guess_at = 0
        self.picks = []
        self.bets = {}
        self.delta = {}
        self.outcome = None

    # ── lifecycle ──
    def start(self):
        self.pids = [p.id for p in self.room.active_players()]
        self.scores = {pid: 0 for pid in self.pids}
        self.moles = random.sample(self.pids, min(ROUNDS, len(self.pids)))
        pool = [(c, w) for c in CATEGORIES for w in c["words"]]
        self.picks = random.sample(pool, min(ROUNDS, len(pool)))
        self.round = 0
        self.next_round()

    def next_round(self):
        self.round += 1
        cat, word = self.picks[(self.round - 1) % len(self.picks)]
        self.category, self.word = cat["name"], word
        self.mole = self.moles[(self.round - 1) % len(self.moles)]
        self.clues, self.warn, self.votes, self.bets, self.delta = {}, {}, {}, {}, {}
        self.caught, self.tally, self.guess, self.guess_ok, self.outcome = False, {}, None, False, None
        self.go("briefing", BRIEF_SECONDS)
        for pid in self.pids:
            p = self.room.players.get(pid)
            if p:
                self.room.sfx("buzz" if pid == self.mole else "ding", to=p)

    def go(self, screen, seconds):
        self.screen = screen
        self.deadline = self.room.now() + seconds * 1000

    # ── input ──
    def on_action(self, player, a):
        if not isinstance(a, dict) or player.id not in self.pids:
            return
        kind, pid = a.get("type"), player.id
        if kind == "clue" and self.screen == "clue" and pid not in self.clues:
            raw = str(a.get("value", "")).strip()
            val = raw.split()
            clue = val[0][:MAX_CLUE] if val else ""
            if not clue:
                return
            if pid != self.mole and (norm(clue) in (norm(self.word["en"]), norm(self.word["ko"])) or norm(raw) in (norm(self.word["en"]), norm(self.word["ko"]))):
                self.warn[pid] = True
                self.room.sfx("error", to=player)
                return
            self.warn.pop(pid, None)
            self.clues[pid] = clue
            self.room.sfx("pop", to=player)
        elif kind == "vote" and self.screen == "vote" and pid not in self.votes:
            t = a.get("p")
            if isinstance(t, str) and t in self.pids and t != pid:
                self.votes[pid] = t
                self.room.sfx("tap", to=player)
        elif kind == "guess" and self.screen == "guess" and pid == self.mole and self.guess is None:
            g = str(a.get("value", "")).strip()[:MAX_GUESS]
            if g:
                self.guess = g
                self.guess_at = self.room.now()
                self.guess_ok = guess_matches(g, self.word)
        elif kind == "bet" and self.screen == "guess" and pid != self.mole and pid not in self.bets:
            if a.get("v") in (0, 1):
                self.bets[pid] = int(a["v"])
                self.room.sfx("tap", to=player)
        elif kind == "again" and self.screen == "final":
            self.room.to_lobby()

    def on_host_action(self, a):
        if isinstance(a, dict) and a.get("type") == "skip":
            self.deadline = 0

    # ── time ──
    def _connected(self):
        return [p.id for p in self.room.connected_players() if p.id in self.pids]

    def tick(self, now):
        conn = self._connected()
        s = self.screen
        if s == "briefing" and now >= self.deadline:
            self.go("clue", CLUE_SECONDS)
            return True
        if s == "clue" and (now >= self.deadline or (conn and all(c in self.clues for c in conn))):
            self.go("vote", VOTE_SECONDS)
            return True
        if s == "vote" and (now >= self.deadline or (conn and all(c in self.votes for c in conn))):
            return self.begin_reveal()
        if s == "reveal" and now >= self.deadline:
            if self.caught:
                self.go("guess", GUESS_SECONDS)
                self.room.sfx("drumroll")
                return True
            return self.begin_result()
        if s == "guess":
            others = [c for c in conn if c != self.mole]
            if self.guess is not None and (now >= self.guess_at + 4000 or all(c in self.bets for c in others)):
                return self.begin_result()
            if now >= self.deadline or self.mole not in conn:
                return self.begin_result()
        if s == "result" and now >= self.deadline:
            if self.round >= ROUNDS:
                self.go("final", 0)
                self.room.sfx("fanfare")
            else:
                self.next_round()
            return True
        return False

    def begin_reveal(self):
        self.tally = {}
        for t in self.votes.values():
            self.tally[t] = self.tally.get(t, 0) + 1
        top = max(self.tally.values(), default=0)
        leaders = [t for t, n in self.tally.items() if n == top]
        self.caught = top > 0 and leaders == [self.mole]
        self.go("reveal", REVEAL_SECONDS)
        return True

    def begin_result(self):
        d = {pid: 0 for pid in self.pids}
        for v, t in self.votes.items():
            if t == self.mole:
                d[v] += PTS_CORRECT_VOTE
        if not self.caught:
            d[self.mole] += PTS_MOLE_ESCAPES
            self.outcome = "escaped"
        elif self.guess_ok:
            d[self.mole] += PTS_MOLE_STEALS
            self.outcome = "stolen"
        else:
            for pid in self.pids:
                if pid != self.mole:
                    d[pid] += PTS_AGENTS_HOLD
            self.outcome = "busted"
        if self.caught:
            for pid, v in self.bets.items():
                if bool(v) == self.guess_ok:
                    d[pid] += PTS_BET
        for pid, n in d.items():
            self.scores[pid] = self.scores.get(pid, 0) + n
        self.delta = d
        self.go("result", RESULT_SECONDS)
        mole = self.room.players.get(self.mole)
        if mole:
            self.room.sfx("win" if self.outcome != "busted" else "lose", to=mole)
        return True

    # ── views ──
    def ranking(self):
        return sorted(({"id": pid, "score": s} for pid, s in self.scores.items()), key=lambda r: -r["score"])

    def view(self, player):
        pid = player.id if player else None
        s = self.screen
        v = {"screen": s, "round": self.round, "rounds": ROUNDS, "category": self.category, "deadline": self.deadline}
        if s == "final":
            v["ranking"] = self.ranking()
            return v
        if player:
            v["role"] = "mole" if pid == self.mole else "agent"
            v["spectator"] = pid not in self.pids
            if pid != self.mole and s in ("briefing", "clue", "vote", "guess"):
                v["word"] = self.word          # agents only; never in view(None)
        if s == "briefing":
            v["total"] = BRIEF_SECONDS * 1000
        elif s == "clue":
            v["total"] = CLUE_SECONDS * 1000
            v["submitted"] = list(self.clues)
            v["mine"] = self.clues.get(pid)
            v["warn"] = bool(self.warn.get(pid))
        elif s == "vote":
            v["total"] = VOTE_SECONDS * 1000
            v["clues"] = [{"id": p, "clue": self.clues.get(p)} for p in self.pids]
            v["voted"] = list(self.votes)
            v["myVote"] = self.votes.get(pid)
        elif s == "reveal":
            v["total"] = REVEAL_SECONDS * 1000
            v["mole"] = self.mole
            v["caught"] = self.caught
            v["votes"] = dict(self.votes)
            v["tally"] = dict(self.tally)
        elif s == "guess":
            v["total"] = GUESS_SECONDS * 1000
            v["mole"] = self.mole
            v["guessed"] = self.guess is not None
            v["bets"] = list(self.bets)
            v["myBet"] = self.bets.get(pid)
        elif s == "result":
            v["total"] = RESULT_SECONDS * 1000
            v.update({"word": self.word, "mole": self.mole, "caught": self.caught, "guess": self.guess,
                      "guessOk": self.guess_ok, "outcome": self.outcome, "delta": self.delta,
                      "bets": dict(self.bets), "ranking": self.ranking(),
                      "clues": {p: c for p, c in self.clues.items()}})
        return v

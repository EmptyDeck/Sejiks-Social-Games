"""Gilded Takes — everyone answers a prompt, everyone votes for the wittiest.

Reference game for RULEBOOK.md: copy this folder to start a new game.
Server-side rules only. Nothing here is ever sent to a browser except what view() returns.
"""
import random

META = {
    "id": "gilded-takes",
    "title": {"en": "Gilded Takes", "ko": "황금빛 한마디"},
    "tagline": {
        "en": "Answer the prompt. Vote for the wittiest. Old money only.",
        "ko": "질문에 답하고, 가장 재치 있는 답에 투표하세요. 올드머니 전용.",
    },
    "emoji": "🥂",
    "theme": {"bg": "#0f1b2d", "accent": "#c9a24b"},     # colours of the launcher card
}

MAX_ANSWER = 80
POINTS_PER_VOTE = 100
UNANIMOUS_BONUS = 150
# No timers and no fixed number of rounds (owner rule): phases end when everybody acted, or when the leader says so.

# User-visible text comes in both languages. Players' own answers stay as typed.
PROMPTS = [
    {"en": "The real reason the yacht is late", "ko": "요트가 늦어지는 진짜 이유"},
    {"en": "A terrible name for a family crest", "ko": "가문의 문장에 붙이면 최악인 이름"},
    {"en": "What the butler whispers when nobody is listening", "ko": "아무도 안 들을 때 집사가 중얼거리는 말"},
    {"en": "A suspiciously cheap thing to find in a mansion", "ko": "대저택에서 발견되면 수상한 싸구려"},
    {"en": "The worst possible toast at a gala", "ko": "만찬에서 할 수 있는 최악의 건배사"},
    {"en": "An inheritance nobody wants", "ko": "아무도 받고 싶지 않은 유산"},
    {"en": "Why the polo pony was disqualified", "ko": "폴로 말이 실격당한 이유"},
    {"en": "A secret ingredient in grandmother's famous caviar dip", "ko": "할머니의 유명한 캐비어 소스의 비밀 재료"},
    {"en": "The title of the memoir nobody asked for", "ko": "아무도 청하지 않은 회고록의 제목"},
    {"en": "What is really inside the locked wing", "ko": "잠긴 별관 안에 진짜 들어 있는 것"},
    {"en": "A very rich person's idea of 'roughing it'", "ko": "엄청난 부자가 말하는 '고생스러운 여행'"},
    {"en": "The most embarrassing thing in the family portrait", "ko": "가족 초상화에서 가장 민망한 부분"},
    {"en": "An unsettling lawn ornament", "ko": "왠지 섬뜩한 정원 장식물"},
    {"en": "What the swan said to the duke", "ko": "백조가 공작에게 한 말"},
    {"en": "A new rule at the country club", "ko": "컨트리클럽의 새로운 규칙"},
    {"en": "The last words of a very dramatic chandelier", "ko": "엄청 극적인 샹들리에의 마지막 한마디"},
    {"en": "A scandalous thing to find in a monogrammed handkerchief", "ko": "이니셜 손수건에서 나오면 스캔들이 될 것"},
    {"en": "Why the will was rewritten at midnight", "ko": "유언장이 한밤중에 다시 쓰인 이유"},
    {"en": "A hobby that gives away you are secretly poor", "ko": "사실 가난하다는 걸 들키게 하는 취미"},
    {"en": "The vintage that ruined the dinner party", "ko": "만찬을 망쳐 버린 빈티지"},
]


class Game:
    def __init__(self, room):
        self.room = room
        self.screen = "write"
        self.round = 0
        self.scores = {}
        self.prompt = None
        self.answers = {}        # player id -> text
        self.options = []        # [{"text", "by"}] shuffled for voting
        self.votes = {}          # voter id -> option index
        self.results = []
        self.prompts_left = []

    # ── lifecycle ──
    def start(self):
        self.scores = {p.id: 0 for p in self.room.active_players()}
        self.prompts_left = random.sample(PROMPTS, len(PROMPTS))
        self.round = 0
        self.next_prompt()

    def next_prompt(self):
        if not self.prompts_left:
            self.prompts_left = random.sample(PROMPTS, len(PROMPTS))
        self.round += 1
        self.prompt = self.prompts_left.pop()
        self.answers, self.votes, self.options, self.results = {}, {}, [], []
        self.screen = "write"
        self.room.sfx("whoosh")

    # ── input ──
    def on_action(self, player, a):
        kind = a.get("type")
        if kind == "answer" and self.screen == "write":
            text = a.get("value")
            text = text.strip()[:MAX_ANSWER] if isinstance(text, str) else ""
            if text:
                self.answers[player.id] = text
                self.room.sfx("pop", to=player)
                self._maybe_advance()
        elif kind == "vote" and self.screen == "vote":
            i = a.get("i")
            if isinstance(i, int) and 0 <= i < len(self.options) and self.options[i]["by"] != player.id:
                self.votes[player.id] = i
                self._maybe_advance()
        elif self.room.is_leader(player):
            self._leader(kind)

    def on_host_action(self, a):
        self._leader(a.get("type"))

    def _leader(self, kind):
        if kind == "next":
            if self.screen == "write":
                self.begin_vote()
            elif self.screen == "vote":
                self.begin_reveal()
            elif self.screen == "reveal":
                self.next_prompt()
        elif kind == "finish" and self.screen == "reveal":
            self.screen = "final"
            self.room.sfx("fanfare")
        elif kind == "lobby" and self.screen == "final":
            self.room.to_lobby()

    def _maybe_advance(self):
        """Move on by itself once everybody connected has acted (the leader can always force it)."""
        who = [p.id for p in self.room.connected_players()]
        if self.screen == "write" and who and all(w in self.answers for w in who):
            self.begin_vote()
        elif self.screen == "vote" and who and all(w in self.votes for w in who if any(o["by"] != w for o in self.options)):
            self.begin_reveal()

    def begin_vote(self):
        self.options = [{"text": t, "by": pid} for pid, t in self.answers.items()]
        random.shuffle(self.options)
        if len(self.options) < 2:                  # nothing to vote on (e.g. playing alone): skip ahead
            return self.begin_reveal()
        self.screen = "vote"
        self.room.sfx("drumroll")

    def begin_reveal(self):
        tally = [0] * len(self.options)
        for i in self.votes.values():
            tally[i] += 1
        total = len(self.votes)
        self.results = []
        for i, o in enumerate(self.options):
            pts = tally[i] * POINTS_PER_VOTE
            if total >= 2 and tally[i] == total:
                pts += UNANIMOUS_BONUS
            self.scores[o["by"]] = self.scores.get(o["by"], 0) + pts
            self.results.append({"text": o["text"], "by": o["by"], "votes": tally[i], "points": pts})
        self.results.sort(key=lambda r: -r["votes"])
        self.screen = "reveal"
        self.room.sfx("reveal")

    # ── what each screen sees ──
    def ranking(self):
        return sorted(({"id": pid, "score": s} for pid, s in self.scores.items()), key=lambda r: -r["score"])

    def view(self, player):
        v = {"screen": self.screen, "round": self.round, "prompt": self.prompt}
        pid = player.id if player else None
        if self.screen == "write":
            v["submitted"] = list(self.answers)
            v["mine"] = self.answers.get(pid)
        elif self.screen == "vote":
            # authors are NOT sent during voting; only the voter's own answer is flagged
            v["options"] = [{"i": i, "text": o["text"], "own": o["by"] == pid} for i, o in enumerate(self.options)]
            v["voted"] = list(self.votes)
            v["myVote"] = self.votes.get(pid)
        elif self.screen == "reveal":
            v["results"] = self.results
            v["ranking"] = self.ranking()
        elif self.screen == "final":
            v["ranking"] = self.ranking()
        return v

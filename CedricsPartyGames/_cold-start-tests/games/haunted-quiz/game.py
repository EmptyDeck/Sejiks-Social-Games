"""Haunted Quiz — a spooky multiple-choice trivia race.

8 questions, 4 answers each, 20 s. Everyone answers on their phone; correct answers score more the
faster they are (timed on the SERVER when the tap arrives) plus a streak bonus.
Screens: intro -> question -> reveal -> standings (-> next intro ...) -> final.
Server-side rules only; only view() output ever reaches a browser.
"""
import random

META = {
    "id": "haunted-quiz",
    "title": {"en": "Haunted Quiz", "ko": "유령의 저택 퀴즈"},
    "tagline": {
        "en": "Answer fast before the ghosts do. Trivia in a haunted mansion.",
        "ko": "유령보다 먼저 맞혀라. 으스스한 저택에서 벌어지는 상식 퀴즈.",
    },
    "emoji": "👻",
    "min_players": 2,
    "max_players": 10,
    "theme": {"bg": "#150a22", "accent": "#ff8a1f"},
}

ROUNDS = 8
INTRO_SECONDS = 3
QUESTION_SECONDS = 20
REVEAL_SECONDS = 9
STANDINGS_SECONDS = 5
BASE_POINTS = 500          # for any correct answer
SPEED_POINTS = 500         # extra, scaled by the fraction of time left
STREAK_STEP = 50           # per correct answer in a row beyond the first
STREAK_CAP = 200


def Q(en, ko, answers):
    """answers = [(en, ko), ...]; the FIRST one is the correct one (shuffled when asked)."""
    return {"q": {"en": en, "ko": ko}, "a": [{"en": e, "ko": k} for e, k in answers]}


QUESTIONS = [
    Q("What colour do you get by mixing blue and yellow?", "파랑과 노랑을 섞으면 무슨 색이 될까?",
      [("Green", "초록"), ("Orange", "주황"), ("Purple", "보라"), ("Brown", "갈색")]),
    Q("How many legs does a spider have?", "거미의 다리는 몇 개일까?",
      [("8", "8개"), ("6", "6개"), ("10", "10개"), ("12", "12개")]),
    Q("Which planet is known as the Red Planet?", "붉은 행성이라고 불리는 것은?",
      [("Mars", "화성"), ("Venus", "금성"), ("Jupiter", "목성"), ("Mercury", "수성")]),
    Q("What is the capital of Japan?", "일본의 수도는?",
      [("Tokyo", "도쿄"), ("Kyoto", "교토"), ("Osaka", "오사카"), ("Nagoya", "나고야")]),
    Q("Which animal is famous for sleeping upside down?", "거꾸로 매달려 자는 걸로 유명한 동물은?",
      [("Bat", "박쥐"), ("Owl", "부엉이"), ("Cat", "고양이"), ("Frog", "개구리")]),
    Q("How many days are in a leap year?", "윤년은 며칠일까?",
      [("366", "366일"), ("365", "365일"), ("364", "364일"), ("367", "367일")]),
    Q("What do bees make?", "벌이 만드는 것은?",
      [("Honey", "꿀"), ("Milk", "우유"), ("Silk", "비단"), ("Sugar", "설탕")]),
    Q("Which ocean is the largest?", "가장 큰 바다는?",
      [("Pacific", "태평양"), ("Atlantic", "대서양"), ("Indian", "인도양"), ("Arctic", "북극해")]),
    Q("What vegetable is traditionally carved for Halloween?", "핼러윈에 전통적으로 깎아서 만드는 채소는?",
      [("Pumpkin", "호박"), ("Cabbage", "양배추"), ("Potato", "감자"), ("Radish", "무")]),
    Q("How many strings does a standard guitar have?", "일반적인 기타의 줄은 몇 개일까?",
      [("6", "6개"), ("4", "4개"), ("5", "5개"), ("8", "8개")]),
    Q("Which gas do plants take in from the air?", "식물이 공기 중에서 들이마시는 기체는?",
      [("Carbon dioxide", "이산화탄소"), ("Oxygen", "산소"), ("Helium", "헬륨"), ("Nitrogen", "질소")]),
    Q("Who painted the Mona Lisa?", "모나리자를 그린 사람은?",
      [("Leonardo da Vinci", "레오나르도 다 빈치"), ("Picasso", "피카소"), ("Van Gogh", "반 고흐"), ("Monet", "모네")]),
    Q("What is frozen water called?", "물이 얼면 무엇이 될까?",
      [("Ice", "얼음"), ("Steam", "수증기"), ("Fog", "안개"), ("Dew", "이슬")]),
    Q("Which country is home to the kangaroo?", "캥거루의 고향은?",
      [("Australia", "호주"), ("Brazil", "브라질"), ("India", "인도"), ("Canada", "캐나다")]),
    Q("How many sides does a hexagon have?", "육각형의 변은 몇 개일까?",
      [("6", "6개"), ("5", "5개"), ("7", "7개"), ("8", "8개")]),
    Q("What is the hardest natural substance?", "자연에서 가장 단단한 물질은?",
      [("Diamond", "다이아몬드"), ("Gold", "금"), ("Iron", "철"), ("Quartz", "수정")]),
    Q("In which country would you find the Eiffel Tower?", "에펠탑이 있는 나라는?",
      [("France", "프랑스"), ("Italy", "이탈리아"), ("Spain", "스페인"), ("Germany", "독일")]),
    Q("What is the largest mammal in the world?", "세상에서 가장 큰 포유류는?",
      [("Blue whale", "대왕고래"), ("Elephant", "코끼리"), ("Giraffe", "기린"), ("Hippo", "하마")]),
    Q("What do you call a baby cat?", "아기 고양이를 뭐라고 부를까?",
      [("Kitten", "새끼 고양이"), ("Cub", "새끼 사자"), ("Pup", "강아지"), ("Calf", "송아지")]),
    Q("How many players are on the pitch for one football (soccer) team?", "축구 한 팀은 경기장에 몇 명이 나올까?",
      [("11", "11명"), ("9", "9명"), ("10", "10명"), ("12", "12명")]),
    Q("Which fairy-tale character left a glass slipper behind?", "유리 구두를 두고 간 동화 속 인물은?",
      [("Cinderella", "신데렐라"), ("Snow White", "백설공주"), ("Rapunzel", "라푼젤"), ("Belle", "벨")]),
    Q("What is the chemical symbol for water?", "물의 화학식은?",
      [("H2O", "H2O"), ("CO2", "CO2"), ("O2", "O2"), ("NaCl", "NaCl")]),
    Q("Which season comes after summer?", "여름 다음 계절은?",
      [("Autumn", "가을"), ("Spring", "봄"), ("Winter", "겨울"), ("Monsoon", "장마철")]),
    Q("Which instrument has black and white keys?", "검은 건반과 흰 건반이 있는 악기는?",
      [("Piano", "피아노"), ("Violin", "바이올린"), ("Flute", "플루트"), ("Drum", "드럼")]),
    Q("What is the fastest land animal?", "육지에서 가장 빠른 동물은?",
      [("Cheetah", "치타"), ("Lion", "사자"), ("Horse", "말"), ("Greyhound", "그레이하운드")]),
    Q("How many continents are there?", "대륙은 모두 몇 개일까?",
      [("7", "7개"), ("5", "5개"), ("6", "6개"), ("8", "8개")]),
    Q("Which planet has famous rings?", "유명한 고리를 가진 행성은?",
      [("Saturn", "토성"), ("Mars", "화성"), ("Earth", "지구"), ("Mercury", "수성")]),
    Q("Which fruit keeps the doctor away, says the proverb?", "속담에서 의사를 멀리하게 해 준다는 과일은?",
      [("Apple", "사과"), ("Banana", "바나나"), ("Grape", "포도"), ("Pear", "배")]),
    Q("What do vampires famously dislike?", "흡혈귀가 싫어하기로 유명한 것은?",
      [("Garlic", "마늘"), ("Chocolate", "초콜릿"), ("Music", "음악"), ("Rain", "비")]),
    Q("What is the capital of South Korea?", "대한민국의 수도는?",
      [("Seoul", "서울"), ("Busan", "부산"), ("Incheon", "인천"), ("Daegu", "대구")]),
    Q("Which animal is the symbol of the WWF?", "WWF(세계자연기금)의 상징 동물은?",
      [("Giant panda", "자이언트 판다"), ("Tiger", "호랑이"), ("Polar bear", "북극곰"), ("Koala", "코알라")]),
    Q("How many minutes are in two hours?", "두 시간은 몇 분일까?",
      [("120", "120분"), ("100", "100분"), ("90", "90분"), ("150", "150분")]),
    Q("What is a group of crows called?", "까마귀 떼를 부르는 영어 표현은?",
      [("A murder", "머더(murder)"), ("A flock of joy", "기쁨의 무리"), ("A choir", "합창단"), ("A parade", "퍼레이드")]),
    Q("Which famous monster was created by Dr. Frankenstein?", "프랑켄슈타인 박사가 만들어 낸 것은?",
      [("A creature stitched from parts", "이어 붙인 몸의 괴물"), ("A werewolf", "늑대인간"), ("A mummy", "미라"), ("A ghost", "유령")]),
    Q("What is the largest planet in our solar system?", "태양계에서 가장 큰 행성은?",
      [("Jupiter", "목성"), ("Saturn", "토성"), ("Neptune", "해왕성"), ("Earth", "지구")]),
    Q("Which sport uses a shuttlecock?", "셔틀콕을 사용하는 운동은?",
      [("Badminton", "배드민턴"), ("Tennis", "테니스"), ("Squash", "스쿼시"), ("Golf", "골프")]),
    Q("What is sushi traditionally wrapped in?", "김밥·스시를 전통적으로 말아 싸는 재료는?",
      [("Seaweed (nori)", "김"), ("Lettuce", "상추"), ("Cabbage", "배추"), ("Paper", "종이")]),
    Q("Which bird is a symbol of wisdom?", "지혜를 상징하는 새는?",
      [("Owl", "부엉이"), ("Parrot", "앵무새"), ("Pigeon", "비둘기"), ("Penguin", "펭귄")]),
    Q("How many hours are in a day?", "하루는 몇 시간일까?",
      [("24", "24시간"), ("12", "12시간"), ("20", "20시간"), ("48", "48시간")]),
    Q("What is the main ingredient of guacamole?", "과카몰리의 주재료는?",
      [("Avocado", "아보카도"), ("Tomato", "토마토"), ("Pea", "완두콩"), ("Cucumber", "오이")]),
    Q("Which creature is said to howl at the full moon?", "보름달을 보고 울부짖는다고 하는 괴물은?",
      [("Werewolf", "늑대인간"), ("Zombie", "좀비"), ("Mummy", "미라"), ("Skeleton", "해골")]),
    Q("What is the boiling point of water at sea level?", "해수면에서 물이 끓는 온도는?",
      [("100 °C", "100도"), ("90 °C", "90도"), ("120 °C", "120도"), ("80 °C", "80도")]),
    Q("Which planet do we live on?", "우리가 살고 있는 행성은?",
      [("Earth", "지구"), ("Mars", "화성"), ("Moon", "달"), ("Pluto", "명왕성")]),
    Q("Who is the famous wizard with a lightning-bolt scar?", "번개 모양 흉터를 가진 유명한 마법사는?",
      [("Harry Potter", "해리 포터"), ("Merlin", "멀린"), ("Gandalf", "간달프"), ("Dumbledore", "덤블도어")]),
    Q("What do caterpillars turn into?", "애벌레는 자라서 무엇이 될까?",
      [("Butterflies (or moths)", "나비(또는 나방)"), ("Beetles", "딱정벌레"), ("Bees", "벌"), ("Spiders", "거미")]),
    Q("How many letters are in the English alphabet?", "영어 알파벳은 모두 몇 글자일까?",
      [("26", "26자"), ("24", "24자"), ("28", "28자"), ("30", "30자")]),
    Q("Which famous ship sank after hitting an iceberg in 1912?", "1912년 빙산에 부딪혀 가라앉은 유명한 배는?",
      [("Titanic", "타이타닉"), ("Black Pearl", "블랙 펄"), ("Mayflower", "메이플라워"), ("Poseidon", "포세이돈")]),
]
LETTERS = ["🦇", "🎃", "👻", "🕷️"]


class Game:
    def __init__(self, room):
        self.room = room
        self.screen = "intro"
        self.round = 0
        self.deadline = 0
        self.scores = {}
        self.streak = {}
        self.q = None            # {"q": {...}, "a": [{...}], "c": index of correct}
        self.picks = {}          # pid -> option index
        self.at = {}             # pid -> ms when answer arrived (server clock)
        self.started_at = 0
        self.results = {}        # pid -> {"pick", "ok", "pts", "streak"} (after reveal)
        self.left = []

    # ── lifecycle ──
    def start(self):
        self.scores = {p.id: 0 for p in self.room.active_players()}
        self.streak = {pid: 0 for pid in self.scores}
        self.left = random.sample(QUESTIONS, len(QUESTIONS))
        self.round = 0
        self.next_round()

    def next_round(self):
        self.round += 1
        src = self.left.pop()
        order = list(range(len(src["a"])))
        random.shuffle(order)
        self.q = {"q": src["q"], "a": [src["a"][i] for i in order], "c": order.index(0)}
        self.picks, self.at, self.results = {}, {}, {}
        self.screen = "intro"
        self.deadline = self.room.now() + INTRO_SECONDS * 1000
        self.room.sfx("whoosh")

    # ── input ──
    def on_action(self, player, a):
        if not isinstance(a, dict):
            return
        kind = a.get("type")
        if kind == "answer" and self.screen == "question":
            i = a.get("i")
            if player.id in self.scores and isinstance(i, int) and not isinstance(i, bool) \
                    and 0 <= i < len(self.q["a"]) and player.id not in self.picks:
                now = self.room.now()
                if now > self.deadline:          # too late; the tick will close the round
                    return
                self.picks[player.id] = i
                self.at[player.id] = now
                self.room.sfx("pop", to=player)
        elif kind == "again" and self.screen == "final":
            self.room.to_lobby()

    def on_host_action(self, a):
        if isinstance(a, dict) and a.get("type") == "skip" and self.screen != "final":
            self.deadline = 0

    # ── time ──
    def tick(self, now):
        if self.screen == "intro" and now >= self.deadline:
            self.screen = "question"
            self.started_at = now
            self.deadline = now + QUESTION_SECONDS * 1000
            return True
        if self.screen == "question":
            alive = [p.id for p in self.room.connected_players() if p.id in self.scores]
            if now >= self.deadline or (alive and all(pid in self.picks for pid in alive)):
                return self.begin_reveal(now)
        elif self.screen == "reveal" and now >= self.deadline:
            self.screen = "standings"
            self.deadline = now + STANDINGS_SECONDS * 1000
            self.room.sfx("ding")
            return True
        elif self.screen == "standings" and now >= self.deadline:
            if self.round >= ROUNDS:
                self.screen = "final"
                self.room.sfx("fanfare")
            else:
                self.next_round()
            return True
        return False

    def begin_reveal(self, now):
        total = QUESTION_SECONDS * 1000
        for pid in self.scores:
            pick = self.picks.get(pid)
            ok = pick == self.q["c"]
            pts = 0
            if ok:
                left = max(0.0, min(1.0, (self.started_at + total - self.at[pid]) / total))
                self.streak[pid] += 1
                bonus = min(STREAK_CAP, STREAK_STEP * (self.streak[pid] - 1))
                pts = BASE_POINTS + round(SPEED_POINTS * left) + bonus
                self.scores[pid] += pts
            else:
                self.streak[pid] = 0
            self.results[pid] = {"pick": pick, "ok": ok, "pts": pts, "streak": self.streak[pid]}
        self.screen = "reveal"
        self.deadline = now + REVEAL_SECONDS * 1000
        self.room.sfx("reveal")
        for p in self.room.connected_players():
            r = self.results.get(p.id)
            if r:
                self.room.sfx("aha" if r["ok"] else "buzz", to=p)
        return True

    # ── views ──
    def ranking(self):
        return sorted(({"id": pid, "score": s, "streak": self.streak.get(pid, 0)} for pid, s in self.scores.items()),
                      key=lambda r: -r["score"])

    def view(self, player):
        v = {"screen": self.screen, "round": self.round, "rounds": ROUNDS, "deadline": self.deadline,
             "letters": LETTERS}
        pid = player.id if player else None
        if self.screen in ("intro", "question", "reveal"):
            v["q"] = self.q["q"]
            v["options"] = self.q["a"]
        if self.screen == "intro":
            v.pop("q"); v.pop("options")
            v["total"] = INTRO_SECONDS * 1000
        elif self.screen == "question":
            v["total"] = QUESTION_SECONDS * 1000
            v["answered"] = list(self.picks)                 # who answered, never what
            v["mine"] = self.picks.get(pid)                  # only the viewer's own pick
            v["inGame"] = pid in self.scores
        elif self.screen == "reveal":
            v["correct"] = self.q["c"]
            v["picks"] = {str(i): [p for p, k in self.picks.items() if k == i] for i in range(len(self.q["a"]))}
            v["results"] = self.results                      # picks are public at the reveal
            v["ranking"] = self.ranking()
            v["total"] = REVEAL_SECONDS * 1000
            v["mine"] = self.picks.get(pid)
        elif self.screen in ("standings", "final"):
            v["ranking"] = self.ranking()
            v["total"] = STANDINGS_SECONDS * 1000
        return v

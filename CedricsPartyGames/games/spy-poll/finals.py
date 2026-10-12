# Spy Poll - final round sets. Original content. Each set: 9 answers, distinct pct.
# Compact form: (family, prompt_en, prompt_ko, [(answer_en, answer_ko, pct) x 9])
_RAW = [
 (True, "Which of these do the most people do every single day?", "다음 중 매일 하는 사람이 가장 많은 것은?", [
  ("Check their phone", "휴대폰 확인하기", 93), ("Brush their teeth", "양치하기", 84), ("Drink water", "물 마시기", 78),
  ("Eat breakfast", "아침 먹기", 52), ("Make the bed", "이불 정리하기", 36), ("Exercise", "운동하기", 27),
  ("Read a book", "책 읽기", 17), ("Write in a diary", "일기 쓰기", 8), ("Meditate", "명상하기", 5)]),
 (True, "Which of these snacks do the most people enjoy at the movies?", "영화관에서 가장 많은 사람이 즐기는 간식은?", [
  ("Popcorn", "팝콘", 88), ("Soda", "탄산음료", 71), ("Candy", "사탕·젤리", 55),
  ("Nachos", "나초", 33), ("Ice cream", "아이스크림", 26), ("Hot dog", "핫도그", 20),
  ("Pretzel", "프레첼", 14), ("Fruit cup", "과일 컵", 9), ("Sandwich", "샌드위치", 6)]),
 (True, "Which of these have the most people owned at some point in life?", "다음 중 살면서 가져 본 사람이 가장 많은 것은?", [
  ("A bicycle", "자전거", 89), ("A teddy bear", "곰 인형", 80), ("A skateboard", "스케이트보드", 43),
  ("A goldfish", "금붕어", 50), ("A hamster", "햄스터", 31), ("A guitar", "기타", 29),
  ("A telescope", "망원경", 15), ("A parrot", "앵무새", 11), ("A drone", "드론", 7)]),
 (True, "Which of these chores do the most people dislike?", "다음 중 가장 싫어하는 사람이 많은 집안일은?", [
  ("Cleaning the toilet", "화장실 청소", 82), ("Washing dishes", "설거지", 64), ("Folding laundry", "빨래 개기", 58),
  ("Taking out trash", "쓰레기 버리기", 41), ("Vacuuming", "청소기 돌리기", 34), ("Cooking", "요리하기", 22),
  ("Watering plants", "화분에 물 주기", 13), ("Feeding the pet", "반려동물 밥 주기", 8), ("Grocery shopping", "장보기", 45)]),
 (True, "Which of these have the most people been afraid of?", "다음 중 무서워해 본 사람이 가장 많은 것은?", [
  ("Spiders", "거미", 76), ("Heights", "높은 곳", 68), ("The dark", "어둠", 49),
  ("Thunderstorms", "천둥번개", 38), ("Clowns", "광대", 30), ("Deep water", "깊은 물", 57),
  ("Dogs", "개", 18), ("Elevators", "엘리베이터", 10), ("Balloons", "풍선", 5)]),
 (True, "Which of these pizza toppings do the most people like?", "다음 중 가장 많은 사람이 좋아하는 피자 토핑은?", [
  ("Cheese", "치즈", 86), ("Pepperoni", "페퍼로니", 74), ("Mushrooms", "버섯", 52),
  ("Sausage", "소시지", 46), ("Onions", "양파", 35), ("Olives", "올리브", 28),
  ("Pineapple", "파인애플", 40), ("Anchovies", "안초비", 7), ("Eggplant", "가지", 12)]),
 (True, "Which of these places have the most people visited?", "다음 중 가 본 사람이 가장 많은 곳은?", [
  ("A beach", "바닷가", 87), ("A zoo", "동물원", 79), ("A museum", "박물관", 72),
  ("An amusement park", "놀이공원", 63), ("A castle", "성", 31), ("A ski resort", "스키장", 25),
  ("A desert", "사막", 12), ("A volcano", "화산", 6), ("A rainforest", "열대우림", 5)]),
 (True, "Which of these do the most people do while waiting in line?", "줄 서서 기다릴 때 가장 많은 사람이 하는 것은?", [
  ("Scroll their phone", "휴대폰 보기", 83), ("Sigh loudly", "한숨 쉬기", 47), ("Chat with someone", "대화하기", 54),
  ("People-watch", "사람 구경하기", 61), ("Check the time", "시계 보기", 70), ("Read something", "뭔가 읽기", 22),
  ("Hum a tune", "콧노래 부르기", 14), ("Do stretches", "스트레칭하기", 8), ("Write a to-do list", "할 일 목록 쓰기", 5)]),
 (True, "Which of these hot drinks do the most people like?", "다음 중 가장 많은 사람이 좋아하는 따뜻한 음료는?", [
  ("Coffee", "커피", 85), ("Hot chocolate", "핫초코", 69), ("Green tea", "녹차", 51),
  ("Black tea", "홍차", 44), ("Herbal tea", "허브차", 33), ("Hot apple cider", "따뜻한 사과차", 16),
  ("Chai latte", "차이 라테", 24), ("Hot milk", "따뜻한 우유", 38), ("Bone broth", "사골 국물", 7)]),
 (True, "Which of these have the most people experienced at least once?", "다음 중 한 번이라도 겪어 본 사람이 가장 많은 일은?", [
  ("Sent a text to the wrong person", "엉뚱한 사람에게 문자 보내기", 87), ("Walked into a glass door", "유리문에 부딪히기", 58),
  ("Fallen asleep in a car", "차에서 잠들기", 95), ("Missed a bus or train", "버스·기차 놓치기", 76),
  ("Locked keys inside", "열쇠를 안에 두고 문 잠그기", 49), ("Got lost with a map", "지도 보고도 길 잃기", 53),
  ("Won a raffle", "경품 추첨 당첨", 19), ("Met a celebrity", "연예인 만나기", 21), ("Been on TV", "TV 출연", 9)]),
 (True, "Which of these animals do the most people think are cute?", "다음 중 귀엽다고 생각하는 사람이 가장 많은 동물은?", [
  ("Puppies", "강아지", 92), ("Kittens", "새끼 고양이", 81), ("Pandas", "판다", 72),
  ("Penguins", "펭귄", 62), ("Otters", "수달", 55), ("Hedgehogs", "고슴도치", 38),
  ("Sloths", "나무늘보", 29), ("Frogs", "개구리", 17), ("Bats", "박쥐", 6)]),
 (True, "Which of these do the most people look forward to every year?", "다음 중 해마다 기다리는 사람이 가장 많은 것은?", [
  ("Summer vacation", "여름휴가", 84), ("Winter holidays", "연말 연휴", 78), ("Spring blossoms", "봄꽃 구경", 63),
  ("The first snowfall", "첫눈", 55), ("Autumn leaves", "단풍 구경", 47), ("Rainy-day naps", "비 오는 날 낮잠", 31),
  ("Fireworks nights", "불꽃놀이", 26), ("A new calendar", "새 달력 받기", 14), ("Spring cleaning", "봄맞이 대청소", 8)]),
 (False, "Which of these have the most people pretended to do?", "다음 중 그런 척해 본 사람이 가장 많은 것은?", [
  ("Be asleep", "자는 척하기", 77), ("Be on a call", "통화하는 척하기", 62), ("Laugh at a joke they missed", "못 알아들은 농담에 웃는 척하기", 91),
  ("Like a gift", "선물 좋아하는 척하기", 81), ("Not see someone", "아는 사람 못 본 척하기", 66), ("Be busy", "바쁜 척하기", 71),
  ("Know a song", "아는 노래인 척하기", 44), ("Be sick", "아픈 척하기", 36), ("Be a spy", "스파이인 척하기", 18)]),
 (True, "Which of these school subjects did the most people enjoy?", "다음 중 학창 시절 좋아한 사람이 가장 많은 과목은?", [
  ("Lunch break", "점심시간", 82), ("Art", "미술", 63), ("Gym class", "체육", 70),
  ("Music", "음악", 51), ("Science", "과학", 40), ("History", "역사", 28),
  ("Math", "수학", 19), ("Grammar", "문법", 11), ("Typing", "타자", 7)]),
 (True, "Which of these do the most people keep in their bag or pocket?", "다음 중 가방이나 주머니에 가지고 다니는 사람이 가장 많은 것은?", [
  ("Phone", "휴대폰", 94), ("Keys", "열쇠", 86), ("Wallet", "지갑", 77),
  ("Tissues", "휴지", 61), ("Earbuds", "이어폰", 69), ("Lip balm", "립밤", 43),
  ("Mints", "박하사탕", 35), ("A pen", "펜", 47), ("A tiny notebook", "작은 수첩", 14)]),
 (True, "Which of these would the most people take on a long trip?", "긴 여행에 가져갈 사람이 가장 많은 것은?", [
  ("Phone charger", "충전기", 84), ("Comfortable shoes", "편한 신발", 73), ("Snacks", "간식", 66),
  ("Sunglasses", "선글라스", 55), ("Travel pillow", "목베개", 37), ("A book", "책", 32),
  ("Playing cards", "카드 게임", 18), ("A journal", "여행 일기장", 11), ("A hammock", "해먹", 5)]),
 (True, "Which of these do the most people think is relaxing?", "다음 중 편안하다고 느끼는 사람이 가장 많은 것은?", [
  ("A hot bath", "따뜻한 목욕", 87), ("Listening to music", "음악 듣기", 79), ("Napping", "낮잠", 74),
  ("A walk outside", "산책", 62), ("Cooking", "요리", 28), ("Gardening", "정원 가꾸기", 24),
  ("Puzzles", "퍼즐", 20), ("Knitting", "뜨개질", 9), ("Cleaning the house", "집 청소", 13)]),
 (True, "Which of these breakfast foods do the most people like?", "다음 중 가장 많은 사람이 좋아하는 아침 음식은?", [
  ("Toast", "토스트", 82), ("Eggs", "달걀 요리", 76), ("Cereal", "시리얼", 64),
  ("Pancakes", "팬케이크", 59), ("Yogurt", "요거트", 46), ("Fruit", "과일", 41),
  ("Oatmeal", "오트밀", 25), ("Leftover pizza", "남은 피자", 17), ("Soup", "수프", 8)]),
 (False, "Which of these have the most people done in the shower?", "다음 중 샤워하면서 해 본 사람이 가장 많은 것은?", [
  ("Sing", "노래 부르기", 87), ("Think about life", "인생 생각하기", 78), ("Plan the day", "하루 계획 세우기", 66),
  ("Rehearse a speech", "발표 연습하기", 40), ("Dance", "춤추기", 52), ("Cry", "울기", 29),
  ("Talk to themselves", "혼잣말하기", 71), ("Eat a snack", "간식 먹기", 6), ("Use a phone", "휴대폰 쓰기", 20)]),
 (True, "Which of these hobbies have the most people tried?", "다음 중 해 본 사람이 가장 많은 취미는?", [
  ("Drawing", "그림 그리기", 82), ("Photography", "사진 찍기", 70), ("Cooking", "요리", 62),
  ("Playing an instrument", "악기 연주", 57), ("Gardening", "원예", 46), ("Pottery", "도자기", 18),
  ("Chess", "체스", 53), ("Fencing", "펜싱", 6), ("Archery", "양궁", 5)]),
 (True, "Which of these do the most people do before leaving the house?", "집을 나서기 전에 가장 많은 사람이 하는 것은?", [
  ("Check for keys", "열쇠 챙겼나 확인", 86), ("Check the mirror", "거울 보기", 77), ("Check for the phone", "휴대폰 챙겼나 확인", 94),
  ("Turn off lights", "불 끄기", 66), ("Look at the weather", "날씨 확인", 60), ("Check the stove", "가스레인지 확인", 49),
  ("Say goodbye to a pet", "반려동물에게 인사", 27), ("Take a selfie", "셀카 찍기", 14), ("Stretch", "스트레칭", 9)]),
 (False, "Which of these have the most people lied about?", "다음 중 거짓말해 본 사람이 가장 많은 것은?", [
  ("Being fine", "괜찮다고 말하기", 90), ("Being on the way", "가는 중이라고 말하기", 84), ("Having read the terms", "약관 읽었다고 하기", 79),
  ("Liking a meal", "음식이 맛있다고 하기", 68), ("Being late because of traffic", "차 막혀서 늦었다고 하기", 61), ("Remembering a name", "이름 기억한다고 하기", 55),
  ("Their age", "나이", 22), ("Their height", "키", 31), ("Being a secret agent", "비밀 요원이라고 하기", 8)]),
 (True, "Which of these sounds do the most people find annoying?", "다음 중 짜증난다고 느끼는 사람이 가장 많은 소리는?", [
  ("Chalk on a board", "칠판 긁는 소리", 72), ("A mosquito buzzing", "모기 소리", 88), ("Loud chewing", "쩝쩝 먹는 소리", 79),
  ("An alarm clock", "알람 소리", 65), ("A dripping tap", "물 떨어지는 소리", 41), ("A car horn", "자동차 경적", 54),
  ("A baby crying", "아기 울음", 20), ("Rain on a roof", "지붕에 비 오는 소리", 5), ("Bird song", "새소리", 7)]),
 (True, "Which of these have the most people forgotten at home?", "다음 중 집에 두고 와 본 사람이 가장 많은 것은?", [
  ("Phone", "휴대폰", 79), ("Umbrella", "우산", 88), ("Charger", "충전기", 70),
  ("Wallet", "지갑", 63), ("Keys", "열쇠", 56), ("Lunch", "도시락", 38),
  ("Glasses", "안경", 27), ("Passport", "여권", 12), ("Shoes", "신발", 5)]),
 (True, "Which of these sweets do the most people like?", "다음 중 가장 많은 사람이 좋아하는 디저트는?", [
  ("Chocolate", "초콜릿", 93), ("Ice cream", "아이스크림", 84), ("Cake", "케이크", 74),
  ("Cookies", "쿠키", 66), ("Donuts", "도넛", 49), ("Pudding", "푸딩", 33),
  ("Candy floss", "솜사탕", 21), ("Marshmallows", "마시멜로", 28), ("Fruitcake", "과일 케이크", 11)]),
 (False, "Which of these have the most people done while on a phone call?", "다음 중 통화 중에 해 본 사람이 가장 많은 것은?", [
  ("Walk around", "걸어 다니기", 85), ("Doodle", "낙서하기", 62), ("Scroll the internet", "인터넷 보기", 58),
  ("Mute and cough", "음소거하고 기침하기", 47), ("Make faces", "얼굴 찡그리기", 71), ("Eat something", "뭔가 먹기", 53),
  ("Do dishes", "설거지하기", 39), ("Take a nap", "잠깐 졸기", 12), ("Hide in a closet", "옷장에 숨기", 5)]),
 (True, "Which of these do the most people say they are good at?", "다음 중 자기가 잘한다고 말하는 사람이 가장 많은 것은?", [
  ("Finding things online", "인터넷으로 물건 찾기", 76), ("Giving directions", "길 알려주기", 64), ("Making friends", "친구 사귀기", 69),
  ("Cooking eggs", "달걀 요리", 81), ("Parallel parking", "평행 주차", 40), ("Telling jokes", "농담하기", 45),
  ("Singing", "노래", 23), ("Juggling", "저글링", 8), ("Keeping secrets", "비밀 지키기", 88)]),
 (True, "Which of these do the most people do on a rainy day?", "비 오는 날 가장 많은 사람이 하는 것은?", [
  ("Stay indoors", "집에 있기", 86), ("Watch a show", "드라마·영상 보기", 78), ("Drink something warm", "따뜻한 음료 마시기", 67),
  ("Take a nap", "낮잠 자기", 54), ("Bake something", "빵·과자 굽기", 21), ("Read a book", "책 읽기", 33),
  ("Play a board game", "보드게임 하기", 24), ("Jump in puddles", "물웅덩이 첨벙거리기", 12), ("Go for a run", "달리기", 6)]),
 (True, "Which of these would the most people want as a superpower?", "다음 중 가장 갖고 싶은 초능력으로 꼽는 사람이 많은 것은?", [
  ("Flying", "하늘을 나는 능력", 88), ("Invisibility", "투명 인간", 74), ("Time travel", "시간 여행", 81),
  ("Mind reading", "독심술", 52), ("Super speed", "초고속 이동", 47), ("Teleportation", "순간 이동", 63),
  ("Talking to animals", "동물과 대화", 30), ("Controlling weather", "날씨 조종", 16), ("Growing plants fast", "식물 빨리 키우기", 6)]),
 (False, "Which of these have the most people done to avoid a chore?", "다음 중 집안일을 피하려고 해 본 사람이 가장 많은 것은?", [
  ("Said they were busy", "바쁘다고 하기", 84), ("Waited for someone else", "남이 하길 기다리기", 77), ("Pretended not to see it", "못 본 척하기", 70),
  ("Started something else", "다른 일 시작하기", 58), ("Hid in another room", "다른 방에 숨기", 31), ("Paid someone else", "돈 주고 맡기기", 24),
  ("Faked a headache", "두통인 척하기", 15), ("Made a chore chart", "집안일 당번표 만들기", 5), ("Called in a favor", "부탁 카드 쓰기", 39)]),
]

FINALS = []
for _i, (_fam, _pe, _pk, _ans) in enumerate(_RAW, 1):
    FINALS.append({
        "id": "f%02d" % _i,
        "prompt": {"en": _pe, "ko": _pk},
        "family": _fam,
        "answers": [{"text": {"en": e, "ko": k}, "pct": p} for (e, k, p) in _ans],
    })

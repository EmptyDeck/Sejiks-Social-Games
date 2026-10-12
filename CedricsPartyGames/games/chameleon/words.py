"""Word bank for Chameleon: 14 categories x 36 words, each word as (English, Korean).
Source: the owner's paper game (Cameleon.pptx). Typos fixed; a few duplicates/odd entries replaced
(see DESIGN-NOTES.md). Private: this file is never served to browsers.
"""

CATEGORIES = [
    ("race", "Race", "인종·민족", [
        ("Australian", "호주인"), ("Italian", "이탈리아인"), ("Dutch", "네덜란드인"), ("Japanese", "일본인"), ("Swedish", "스웨덴인"), ("Spanish", "스페인인"),
        ("Jewish", "유대인"), ("Hispanic", "히스패닉"), ("Egyptian", "이집트인"), ("Scottish", "스코틀랜드인"), ("Greek", "그리스인"), ("Vietnamese", "베트남인"),
        ("Malaysian", "말레이시아인"), ("Ethiopian", "에티오피아인"), ("Korean", "한국인"), ("British", "영국인"), ("Indonesian", "인도네시아인"), ("Filipino", "필리핀인"),
        ("Norwegian", "노르웨이인"), ("North Korean", "북한 사람"), ("Thai", "태국인"), ("Russian", "러시아인"), ("German", "독일인"), ("Persian", "페르시아인"),
        ("Polish", "폴란드인"), ("French", "프랑스인"), ("Mexican", "멕시코인"), ("Arab", "아랍인"), ("Indian", "인도인"), ("Chinese", "중국인"),
        ("Brazilian", "브라질인"), ("Irish", "아일랜드인"), ("Native American", "아메리카 원주민"), ("African American", "아프리카계 미국인"), ("Turkish", "튀르키예인"), ("Somali", "소말리아인"),
    ]),
    ("food", "Food", "음식", [
        ("Kimchi", "김치"), ("Rice", "밥"), ("Seaweed", "김"), ("Shrimp", "새우"), ("Spam", "스팸"), ("Sushi", "초밥"),
        ("Tacos", "타코"), ("Doughnuts", "도넛"), ("Churros", "츄러스"), ("Croissant", "크루아상"), ("Egg", "계란"), ("Kebab", "케밥"),
        ("Ramen", "라멘"), ("Steak", "스테이크"), ("Soup", "수프"), ("Waffles", "와플"), ("Brownies", "브라우니"), ("Cheesecake", "치즈케이크"),
        ("Pretzels", "프레첼"), ("Ice Cream", "아이스크림"), ("Lasagna", "라자냐"), ("Nachos", "나초"), ("Bagel", "베이글"), ("Fried Chicken", "치킨"),
        ("Pho", "쌀국수"), ("Sandwich", "샌드위치"), ("Salad", "샐러드"), ("Hot Dog", "핫도그"), ("Crab", "게"), ("Pasta", "파스타"),
        ("Pancakes", "팬케이크"), ("Chocolate", "초콜릿"), ("Pizza", "피자"), ("Burger", "햄버거"), ("Curry", "카레"), ("Spring Rolls", "스프링롤"),
    ]),
    ("drinks", "Drinks", "음료", [
        ("Sparkling Water", "탄산수"), ("Green Tea", "녹차"), ("Orange Juice", "오렌지 주스"), ("Water", "물"), ("Frappuccino", "프라푸치노"), ("Latte", "라떼"),
        ("Espresso", "에스프레소"), ("Black Tea", "홍차"), ("Gin and Tonic", "진토닉"), ("Soju", "소주"), ("Bubble Tea", "버블티"), ("Mojito", "모히토"),
        ("Champagne", "샴페인"), ("Rum", "럼"), ("Whiskey", "위스키"), ("Coffee", "커피"), ("Smoothie", "스무디"), ("Wine", "와인"),
        ("Energy Drink", "에너지 드링크"), ("Cranberry Juice", "크랜베리 주스"), ("Dr. Pepper", "닥터 페퍼"), ("Lemonade", "레모네이드"), ("Cola", "콜라"), ("Margarita", "마가리타"),
        ("Milkshake", "밀크셰이크"), ("Tea", "차"), ("Beer", "맥주"), ("Milk", "우유"), ("Vodka", "보드카"), ("Soda", "사이다"),
        ("Pina Colada", "피나콜라다"), ("Chai", "차이"), ("Iced Tea", "아이스티"), ("Hot Chocolate", "핫초코"), ("Apple Juice", "사과 주스"), ("Cappuccino", "카푸치노"),
    ]),
    ("games", "Games", "게임", [
        ("Mario Party", "마리오 파티"), ("Super Mario", "슈퍼 마리오"), ("NBA 2K", "NBA 2K"), ("Street Fighter", "스트리트 파이터"), ("The Legend of Zelda", "젤다의 전설"), ("Tekken", "철권"),
        ("Final Fantasy", "파이널 판타지"), ("Mario Kart", "마리오 카트"), ("Halo", "헤일로"), ("Cyberpunk 2077", "사이버펑크 2077"), ("World of Warcraft", "월드 오브 워크래프트"), ("God of War", "갓 오브 워"),
        ("Animal Crossing", "동물의 숲"), ("Pokemon", "포켓몬"), ("Dota", "도타"), ("Valorant", "발로란트"), ("Red Dead Redemption", "레드 데드 리뎀션"), ("League of Legends", "리그 오브 레전드"),
        ("Fall Guys", "폴 가이즈"), ("Battlefield", "배틀필드"), ("Fortnite", "포트나이트"), ("Resident Evil", "바이오하자드"), ("Apex Legends", "에이펙스 레전드"), ("Dark Souls", "다크 소울"),
        ("Super Mario Bros", "슈퍼 마리오 브라더스"), ("Skyrim", "스카이림"), ("FIFA", "피파"), ("Counter-Strike", "카운터 스트라이크"), ("Minecraft", "마인크래프트"), ("Among Us", "어몽 어스"),
        ("Destiny", "데스티니"), ("The Witcher", "위쳐"), ("Mortal Kombat", "모탈 컴뱃"), ("Call of Duty", "콜 오브 듀티"), ("Assassin's Creed", "어쌔신 크리드"), ("GTA", "GTA"),
    ]),
    ("people", "People", "인물", [
        ("Mark Zuckerberg", "마크 저커버그"), ("Cleopatra", "클레오파트라"), ("Abraham Lincoln", "에이브러햄 링컨"), ("Yoon Suk Yeol", "윤석열"), ("Queen Elizabeth II", "엘리자베스 2세"), ("Marie Curie", "마리 퀴리"),
        ("MrBeast", "미스터비스트"), ("Joseph Stalin", "이오시프 스탈린"), ("Barack Obama", "버락 오바마"), ("Vladimir Putin", "블라디미르 푸틴"), ("Donald Trump", "도널드 트럼프"), ("Isaac Newton", "아이작 뉴턴"),
        ("Osama bin Laden", "오사마 빈 라덴"), ("Nelson Mandela", "넬슨 만델라"), ("Taylor Swift", "테일러 스위프트"), ("Madonna", "마돈나"), ("Emma Watson", "엠마 왓슨"), ("Rihanna", "리한나"),
        ("Steve Jobs", "스티브 잡스"), ("Adolf Hitler", "아돌프 히틀러"), ("Elon Musk", "일론 머스크"), ("Albert Einstein", "알베르트 아인슈타인"), ("Bill Gates", "빌 게이츠"), ("Kim Jong-un", "김정은"),
        ("George Washington", "조지 워싱턴"), ("Marilyn Monroe", "마릴린 먼로"), ("Beyoncé", "비욘세"), ("Winston Churchill", "윈스턴 처칠"), ("Bruno Mars", "브루노 마스"), ("Alexander the Great", "알렉산더 대왕"),
        ("Joe Biden", "조 바이든"), ("Napoleon Bonaparte", "나폴레옹"), ("Michael Jackson", "마이클 잭슨"), ("Julius Caesar", "율리우스 카이사르"), ("Mahatma Gandhi", "마하트마 간디"), ("Leonardo da Vinci", "레오나르도 다 빈치"),
    ]),
    ("movies", "Movies", "영화", [
        ("Star Wars", "스타워즈"), ("Iron Man", "아이언맨"), ("Home Alone", "나 홀로 집에"), ("E.T.", "E.T."), ("Saving Private Ryan", "라이언 일병 구하기"), ("Captain America", "캡틴 아메리카"),
        ("Alien", "에이리언"), ("The Dark Knight", "다크 나이트"), ("Jaws", "죠스"), ("Avatar", "아바타"), ("Casablanca", "카사블랑카"), ("Back to the Future", "백 투 더 퓨처"),
        ("Inception", "인셉션"), ("Pulp Fiction", "펄프 픽션"), ("Toy Story", "토이 스토리"), ("The Matrix", "매트릭스"), ("Avengers: Endgame", "어벤져스: 엔드게임"), ("Forrest Gump", "포레스트 검프"),
        ("The Lord of the Rings", "반지의 제왕"), ("Gone with the Wind", "바람과 함께 사라지다"), ("Rocky", "록키"), ("Gladiator", "글래디에이터"), ("Interstellar", "인터스텔라"), ("Black Panther", "블랙 팬서"),
        ("Spider-Man", "스파이더맨"), ("Fight Club", "파이트 클럽"), ("Frozen", "겨울왕국"), ("Harry Potter", "해리 포터"), ("The Godfather", "대부"), ("Titanic", "타이타닉"),
        ("The Lion King", "라이온 킹"), ("Goodfellas", "좋은 친구들"), ("Jurassic Park", "쥬라기 공원"), ("The Shawshank Redemption", "쇼생크 탈출"), ("The Wizard of Oz", "오즈의 마법사"), ("Up", "업"),
    ]),
    ("country", "Country", "나라", [
        ("Nigeria", "나이지리아"), ("Russia", "러시아"), ("New Zealand", "뉴질랜드"), ("Netherlands", "네덜란드"), ("Egypt", "이집트"), ("Denmark", "덴마크"),
        ("France", "프랑스"), ("Australia", "호주"), ("South Korea", "대한민국"), ("South Africa", "남아프리카공화국"), ("Sweden", "스웨덴"), ("Spain", "스페인"),
        ("Italy", "이탈리아"), ("Iran", "이란"), ("Germany", "독일"), ("United Kingdom", "영국"), ("Belgium", "벨기에"), ("Mexico", "멕시코"),
        ("United States", "미국"), ("Austria", "오스트리아"), ("Israel", "이스라엘"), ("China", "중국"), ("Brazil", "브라질"), ("Norway", "노르웨이"),
        ("Thailand", "태국"), ("Argentina", "아르헨티나"), ("Turkey", "튀르키예"), ("Saudi Arabia", "사우디아라비아"), ("Canada", "캐나다"), ("India", "인도"),
        ("Portugal", "포르투갈"), ("Kenya", "케냐"), ("Switzerland", "스위스"), ("Japan", "일본"), ("Vietnam", "베트남"), ("Greece", "그리스"),
    ]),
    ("cities", "Cities", "도시", [
        ("Seoul", "서울"), ("Busan", "부산"), ("Jeju", "제주"), ("Incheon", "인천"), ("Gyeongju", "경주"), ("Tokyo", "도쿄"),
        ("Osaka", "오사카"), ("Kyoto", "교토"), ("Beijing", "베이징"), ("Shanghai", "상하이"), ("Hong Kong", "홍콩"), ("Singapore", "싱가포르"),
        ("Bangkok", "방콕"), ("Hanoi", "하노이"), ("Da Nang", "다낭"), ("Taipei", "타이베이"), ("Dubai", "두바이"), ("Istanbul", "이스탄불"),
        ("Cairo", "카이로"), ("Moscow", "모스크바"), ("Paris", "파리"), ("London", "런던"), ("Rome", "로마"), ("Venice", "베네치아"),
        ("Barcelona", "바르셀로나"), ("Amsterdam", "암스테르담"), ("Berlin", "베를린"), ("Prague", "프라하"), ("Vienna", "빈"), ("Zurich", "취리히"),
        ("New York", "뉴욕"), ("Los Angeles", "로스앤젤레스"), ("Las Vegas", "라스베이거스"), ("San Francisco", "샌프란시스코"), ("Hawaii", "하와이"), ("Sydney", "시드니"),
    ]),
    ("weapons", "Weapons", "무기", [
        ("Spear", "창"), ("Rope", "밧줄"), ("Slingshot", "새총"), ("Brick", "벽돌"), ("Rifle", "소총"), ("Catapult", "투석기"),
        ("Chainsaw", "전기톱"), ("Crossbow", "석궁"), ("Net", "그물"), ("Spike", "가시못"), ("Trap", "덫"), ("Pistol", "권총"),
        ("Stick", "몽둥이"), ("Whip", "채찍"), ("Axe", "도끼"), ("Hammer", "망치"), ("Shotgun", "산탄총"), ("Shield", "방패"),
        ("Knife", "칼"), ("Bow", "활"), ("Mace", "철퇴"), ("Grenade", "수류탄"), ("Trident", "삼지창"), ("Dagger", "단검"),
        ("Hook", "갈고리"), ("Blade", "날붙이"), ("Bat", "야구 방망이"), ("Cannon", "대포"), ("Swordfish", "황새치"), ("Bomb", "폭탄"),
        ("Arrow", "화살"), ("Club", "곤봉"), ("Rock", "돌멩이"), ("Sword", "검"), ("Boomerang", "부메랑"), ("Gun", "총"),
    ]),
    ("death", "Cause of Death", "사망 원인", [
        ("Murder", "살인"), ("Fire", "화재"), ("Thirst", "갈증"), ("Heart Attack", "심장마비"), ("Lost in the Woods", "숲에서 길을 잃음"), ("Illness", "병"),
        ("Broken Bone", "골절"), ("Accident", "사고"), ("Tornado", "토네이도"), ("Earthquake", "지진"), ("Cold Weather", "추위"), ("Lightning", "낙뢰"),
        ("Drowning", "익사"), ("Starvation", "굶주림"), ("Volcano", "화산"), ("Explosion", "폭발"), ("Choking", "질식"), ("Fever", "고열"),
        ("Hot Weather", "더위"), ("War", "전쟁"), ("Old Age", "노환"), ("Poison", "독"), ("Snake Bite", "뱀에 물림"), ("Heatstroke", "열사병"),
        ("Infection", "감염"), ("Hit by a Car", "교통사고"), ("Hurt by Someone", "누군가에게 다침"), ("Burn", "화상"), ("Frostbite", "동상"), ("Animal Attack", "동물의 공격"),
        ("Fall", "추락"), ("Storm", "폭풍"), ("Flood", "홍수"), ("Fight", "싸움"), ("Hypothermia", "저체온증"), ("Lack of Air", "산소 부족"),
    ]),
    ("crime", "Crime", "범죄", [
        ("Manslaughter", "과실치사"), ("Vandalism", "기물 파손"), ("Treason", "반역"), ("Carjacking", "차량 강탈"), ("Extortion", "갈취"), ("Burglary", "주거침입 절도"),
        ("Arson", "방화"), ("Assault", "폭행"), ("Harassment", "괴롭힘"), ("Stalking", "스토킹"), ("Blackmail", "협박"), ("Hacking", "해킹"),
        ("Human Trafficking", "인신매매"), ("Animal Cruelty", "동물 학대"), ("Bribery", "뇌물"), ("Forgery", "위조"), ("Kidnapping", "납치"), ("Illegal Weapons", "불법 무기 소지"),
        ("Battery", "구타"), ("Tax Evasion", "탈세"), ("Counterfeiting", "위폐 제조"), ("Public Intoxication", "공공장소 음주 소란"), ("Smuggling", "밀수"), ("Espionage", "스파이 행위"),
        ("Embezzlement", "횡령"), ("Armed Robbery", "무장 강도"), ("Drug Trafficking", "마약 밀매"), ("Fraud", "사기"), ("Money Laundering", "돈세탁"), ("Cybercrime", "사이버 범죄"),
        ("Theft", "절도"), ("Identity Theft", "신분 도용"), ("Robbery", "강도"), ("Murder", "살인"), ("Domestic Violence", "가정폭력"), ("Piracy", "불법 복제"),
    ]),
    ("jobs", "Jobs", "직업", [
        ("Police Officer", "경찰관"), ("Dentist", "치과의사"), ("Architect", "건축가"), ("Teacher", "교사"), ("Pharmacist", "약사"), ("Pilot", "조종사"),
        ("Marketing Manager", "마케팅 매니저"), ("Chef", "요리사"), ("Accountant", "회계사"), ("Photographer", "사진작가"), ("Doctor", "의사"), ("Scientist", "과학자"),
        ("Lawyer", "변호사"), ("Engineer", "엔지니어"), ("Nurse", "간호사"), ("Director", "감독"), ("Actor", "배우"), ("Financial Analyst", "금융 애널리스트"),
        ("Editor", "편집자"), ("Salesperson", "영업사원"), ("Project Manager", "프로젝트 매니저"), ("Paramedic", "응급구조사"), ("Flight Attendant", "승무원"), ("Researcher", "연구원"),
        ("Business Consultant", "경영 컨설턴트"), ("Civil Engineer", "토목 기사"), ("Writer", "작가"), ("Journalist", "기자"), ("Translator", "번역가"), ("Artist", "화가"),
        ("Firefighter", "소방관"), ("Software Developer", "소프트웨어 개발자"), ("Entrepreneur", "사업가"), ("Musician", "음악가"), ("Investment Banker", "투자은행가"), ("Data Scientist", "데이터 과학자"),
    ]),
    ("majors", "Majors", "전공", [
        ("Physics", "물리학"), ("Chemistry", "화학"), ("Economics", "경제학"), ("Medicine", "의학"), ("Psychology", "심리학"), ("Pharmacy", "약학"),
        ("Nursing", "간호학"), ("Law", "법학"), ("Mathematics", "수학"), ("Electrical Engineering", "전기공학"), ("Art and Design", "예술·디자인"), ("Mechanical Engineering", "기계공학"),
        ("Philosophy", "철학"), ("Linguistics", "언어학"), ("Computer Science", "컴퓨터공학"), ("Theater", "연극영화"), ("Journalism", "신문방송학"), ("Civil Engineering", "토목공학"),
        ("Management", "경영학"), ("Environmental Science", "환경과학"), ("Chemical Engineering", "화학공학"), ("Education", "교육학"), ("Data Science", "데이터사이언스"), ("History", "사학"),
        ("Finance", "금융학"), ("International Relations", "국제관계학"), ("Accounting", "회계학"), ("Music", "음악"), ("Marketing", "마케팅"), ("Film Studies", "영화학"),
        ("English Literature", "영문학"), ("Sociology", "사회학"), ("Business", "경영대"), ("Architecture", "건축학"), ("Biology", "생물학"), ("Communications", "커뮤니케이션학"),
    ]),
    ("apps", "Apps", "앱", [
        ("Facebook", "페이스북"), ("Twitter", "트위터"), ("Google Maps", "구글 지도"), ("Spotify", "스포티파이"), ("Notion", "노션"), ("Discord", "디스코드"),
        ("Amazon", "아마존"), ("Twitch", "트위치"), ("Tinder", "틴더"), ("eBay", "이베이"), ("Apple Music", "애플 뮤직"), ("Netflix", "넷플릭스"),
        ("Uber", "우버"), ("Microsoft Teams", "마이크로소프트 팀즈"), ("App Store", "앱스토어"), ("PayPal", "페이팔"), ("Google Drive", "구글 드라이브"), ("YouTube", "유튜브"),
        ("Reddit", "레딧"), ("Snapchat", "스냅챗"), ("WhatsApp", "왓츠앱"), ("Bumble", "범블"), ("Zoom", "줌"), ("Airbnb", "에어비앤비"),
        ("Google Photos", "구글 포토"), ("LinkedIn", "링크드인"), ("Instagram", "인스타그램"), ("KakaoTalk", "카카오톡"), ("Dropbox", "드롭박스"), ("Telegram", "텔레그램"),
        ("iMessage", "아이메시지"), ("TikTok", "틱톡"), ("Memo", "메모"), ("Evernote", "에버노트"), ("Pinterest", "핀터레스트"), ("Lyft", "리프트"),
    ]),
    ("hobbies", "Hobbies", "취미", [
        ("Snowboarding", "스노보드"), ("Skiing", "스키"), ("Crafting", "공예"), ("Playing Piano", "피아노 연주"), ("Painting", "그림 그리기"), ("Camping", "캠핑"),
        ("Video Gaming", "비디오 게임"), ("Chess", "체스"), ("Yoga", "요가"), ("Woodworking", "목공"), ("Traveling", "여행"), ("Baking", "베이킹"),
        ("Fishing", "낚시"), ("Cooking", "요리"), ("Gardening", "원예"), ("Puzzle Solving", "퍼즐 맞추기"), ("Scrapbooking", "다이어리 꾸미기"), ("Drawing", "드로잉"),
        ("Swimming", "수영"), ("Writing", "글쓰기"), ("Knitting", "뜨개질"), ("Singing", "노래"), ("Hiking", "등산"), ("Skating", "스케이트"),
        ("Dancing", "춤"), ("Playing Guitar", "기타 연주"), ("Bird Watching", "탐조"), ("Photography", "사진 촬영"), ("Running", "달리기"), ("Fitness Training", "헬스"),
        ("Sewing", "바느질"), ("Cycling", "자전거"), ("Reading", "독서"), ("Meditation", "명상"), ("Jogging", "조깅"), ("Board Games", "보드게임"),
    ]),
]

assert len(CATEGORIES) == 15
for _id, _en, _ko, _words in CATEGORIES:
    assert len(_words) == 36, (_id, len(_words))

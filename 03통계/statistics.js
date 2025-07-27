//Statistics/
//    ├── common.css
//    ├── common.js
//    ├── statistics.js - here
//    ├── abs-gen-game.js
//    ├── index.html
//    ├── index.css
//    ├── index.js
//    ├── relative.html
//    ├── relative.css
//    ├── relative.js
//    ├── absolute.html
//    ├── absolute.css
//    ├── absolute.js
//    ├── host.html
//    ├── host.css
//    ├── host.js
//    ├── join.html
//    ├── join.css
//    ├── join.js
//    ├── play.html
//    ├── play.css
//    ├── play.js
const statisticsData = [
    {
        question: "미국 성인 중 UFO를 직접 목격한 적이 있는 사람의 비율은?",
        source: "미국, Ipsos/1,019명",
        answer: 10
    },
    {
        question: "미국 성인 중 UFO의 존재를 믿는 사람의 비율은?",
        source: "미국, Ipsos/1,019명",
        answer: 42
    },
    {
        question: "전 세계 인구 중 스마트폰을 소유한 사람의 비율은?",
        source: "글로벌, Statista/국가별 추정",
        answer: 54
    },
    {
        question: "미국 운전자 중 한 번이라도 교통사고를 낸 적이 있는 사람의 비율은?",
        source: "미국, Esurance/대형 표본",
        answer: 77
    },
    {
        question: "미국인 중 평생 한 번 이상 자살을 시도한 적이 있는 사람의 비율은?",
        source: "미국, JAMA Psychiatry/36,309명",
        answer: 5
    },
    {
        question: "미국인 중 지구가 납작하다고 강하게 믿는 사람의 비율은?",
        source: "미국, YouGov/8,215명",
        answer: 2
    },
    {
        question: "미국인 중 지구가 납작하다고 의심하는 사람의 비율은?",
        source: "미국, YouGov/8,215명",
        answer: 5
    },
    {
        question: "거짓말 탐지기(모션캡쳐)에서 거짓말이 들키는 확률은?",
        source: "영국, Cambridge/180명",
        answer: 75
    },
    {
        question: "거짓말 탐지기(폴리그래프)에서 거짓말이 들키는 확률은?",
        source: "영국, Cambridge/180명",
        answer: 60
    },
    {
        question: "미국 직장인 중 병가나 거짓 결근을 해본 적이 있는 사람의 비율은?",
        source: "미국, CareerBuilder/3,697명",
        answer: 40
    },
    {
        question: "전 세계적으로 '123456'이나 'password' 같은 단순 비밀번호를 사용하는 사람의 비율은?",
        source: "글로벌, NordPass/Sweclockers/970만 케이스",
        answer: 8
    },
    {
        question: "미국인 중 스스로 운전 실력이 평균 이상이라고 믿는 사람의 비율은?",
        source: "미국, AAA 등/1,000명 이상",
        answer: 70
    },
    {
        question: "한국인 중 공공장소 화장실에서 손을 제대로 씻지 않고 나오는 사람의 비율은?",
        source: "한국, 질병청/4,269명(2022)",
        answer: 34
    },
    {
        question: "한국인 중 공공장소 화장실에서 30초 이상 비누로 손을 씻는 사람의 비율은?",
        source: "한국, 질병청/4,269명(2022)",
        answer: 2
    },
    {
        question: "한국인 중 '나는 특별하다'고 답한 사람의 비율은?",
        source: "한국, kslrp/1,000명",
        answer: 45
    },
    {
        question: "해외에서 '나는 특별하다'고 답한 사람의 비율은?",
        source: "해외설문",
        answer: 45
    },
    {
        question: "한국 저소득층 중 자신을 중산층이라고 여기는 사람의 비율은?",
        source: "한국, KDI/3,000명",
        answer: 76
    },
    {
        question: "미국인 중 애완동물과 진심으로 대화한다고 믿는 사람의 비율은?",
        source: "미국, Gallup 등",
        answer: 60
    },
    {
        question: "영국인 중 좀비 아포칼립스에서 살아남을 거라고 믿는 사람의 비율은?",
        source: "영국, YouGov/1,000명",
        answer: 15
    },
    {
        question: "미국인 중 연예인과 언젠가 사귈 수 있다고 생각해본 적이 있는 사람의 비율은?",
        source: "미국, YouGov/2,300명",
        answer: 10
    },
    {
        question: "영국 여성 중 거짓말을 안 한다고 답했지만 실제로는 거짓말을 하는 사람의 비율은?",
        source: "영국, 텔레그래프/3,000여성",
        answer: 90
    },
    {
        question: "자기 집에 귀신이 있다고 느껴본 적이 있는 사람의 비율은?",
        source: "국내외 여론·기사",
        answer: 25
    },
    {
        question: "한국인 중 파트너의 휴대폰을 몰래 본 적이 있는 사람의 비율은?",
        source: "한국, 리서치/3,038명",
        answer: 24
    },
    {
        question: "미국인 중 파트너의 휴대폰을 몰래 본 적이 있는 사람의 비율은?",
        source: "미국 YouGov",
        answer: 34
    },
    {
        question: "미국인 중 자신이 평균 이상의 지능을 가졌다고 믿는 사람의 비율은?",
        source: "미국, PLOS One/2,821명",
        answer: 65
    },
    {
        question: "미국인 중 알람을 껐는지 재확인한 경험이 있는 사람의 비율은?",
        source: "미국, Notre Dame/450명",
        answer: 57
    },
    {
        question: "영국 남성 중 전 애인의 SNS를 몰래 본 적이 있는 사람의 비율은?",
        source: "영국, Reboot Online/2,000명",
        answer: 26
    },
    {
        question: "영국 여성 중 전 애인의 SNS를 몰래 본 적이 있는 사람의 비율은?",
        source: "영국, Reboot Online/2,000명",
        answer: 23
    },
    {
        question: "미국 직장인 중 출근길에 '사표를 낼까' 생각해본 적이 있는 사람의 비율은?",
        source: "미국, FlexJobs/2,600명",
        answer: 42
    },
    {
        question: "영국인 중 위치추적앱을 몰래 설치해본 적이 있는 사람의 비율은?",
        source: "영국, NortonLifeLock",
        answer: 8
    },
    {
        question: "전 세계 사람들 중 소개팅 전 상대방의 SNS나 사진을 미리 파본 경험이 있는 사람의 비율은?",
        source: "글로벌, Avast/15,000명",
        answer: 50
    },
    {
        question: "뉴질랜드인 중 '내가 암에 걸렸나?' 검색해본 경험이 있는 사람의 비율은?",
        source: "뉴질랜드, Auckland/277명",
        answer: 64
    },
    {
        question: "미국인 중 자신의 외모가 평균 이상이라고 믿는 사람의 비율은?",
        source: "미국, Pew 등",
        answer: 50
    },
    {
        question: "미국/독일/폴란드 부모 중 자녀를 몰래 후회한 적이 있다고 고백한 부모의 비율은?",
        source: "미/독/폴, 1,000~2,000명",
        answer: 14
    },
    {
        question: "폴란드 부모 중 자녀를 몰래 후회한 적이 있다고 고백한 부모의 비율은?",
        source: "폴란드, 1,000~2,000명",
        answer: 22
    },
    {
        question: "미국인 중 성형수술을 한 번 이상 받은 적이 있는 사람의 비율은?",
        source: "미국, Statista/2,002명",
        answer: 15
    },
    {
        question: "미국인 중 쓰러진 사람을 그냥 지나친다고 응답한 사람의 비율은?",
        source: "미국, Cornell/1,000여 명",
        answer: 3
    },
    {
        question: "한국 노숙자 중 과거 중산층이었던 경험이 있는 사람의 비율은?",
        source: "한국쉼터/1,000명",
        answer: 20
    },
    {
        question: "미국 노숙자 중 과거 중산층이었던 경험이 있는 사람의 비율은?",
        source: "미국",
        answer: 45
    },
    {
        question: "영국인 중 한 달 이상 타인과 대화하지 않은 경험이 있는 사람의 비율은?",
        source: "영국, Age UK/1,896명",
        answer: 12
    },
    {
        question: "미국/영국 성인 중 인형 등과 함께 자는 사람의 비율은?",
        source: "미국DRG/영국/1,000명",
        answer: 21
    },
    {
        question: "미국인 중 홈쇼핑을 보고 직접 구매한 적이 있는 사람의 비율은?",
        source: "미국, Shopsense AI/1,152명",
        answer: 18
    },
    {
        question: "미국인 중 비데를 절대 사용하지 않는 사람의 비율은?",
        source: "미국, Bio Bidet/1,000명",
        answer: 71
    },
    {
        question: "전 세계 사람들 중 가위눌림을 경험한 적이 있는 사람의 비율은?",
        source: "글로벌, 연구종합",
        answer: 8
    },
    {
        question: "미국인 중 산 책을 1년 이상 개봉하지 않고 둔 적이 있는 사람의 비율은?",
        source: "미국, WordsRated/2,003, YouGov/1,500",
        answer: 52
    },
    {
        question: "금연을 결심한 사람 중 성공한 사람의 비율은?",
        source: "미국 등 보건기관",
        answer: 8
    },
    {
        question: "한국인 중 외국인과 교제할 의향이 있는 사람의 비율은?",
        source: "한국, 기사·연구",
        answer: 35
    },
    {
        question: "한국 혼인 중 국제결혼의 비율은?",
        source: "한국, 통계청 등",
        answer: 11
    },
    {
        question: "영국인 중 노숙자에게 돈을 준 적이 있는 사람의 비율은? (2023년)",
        source: "영국, Beam/2,000명",
        answer: 4
    },
    {
        question: "영국인 중 노숙자에게 돈을 준 적이 있는 사람의 비율은? (2021년)",
        source: "영국, Beam/2,000명",
        answer: 11
    },
    {
        question: "영국인 중 노숙자에게 돈을 준 적이 있는 사람의 비율은? (2022년)",
        source: "영국, Beam/2,000명",
        answer: 9
    },
    {
        question: "한국인 중 애완동물을 키운 경험이 있는 사람의 비율은?",
        source: "한국, KB금융(2025)",
        answer: 30
    },
    {
        question: "미국 밀레니얼 세대 중 자기 돈으로 첫 차를 구입한 사람의 비율은?",
        source: "미국, Breakfast Leadership/1,000명",
        answer: 39
    },
    {
        question: "미국 베이비붐 세대 중 자기 돈으로 첫 차를 구입한 사람의 비율은?",
        source: "미국, Breakfast Leadership/1,000명",
        answer: 56
    },
    {
        question: "한국인 중 최근 1년간 시위나 행진에 참여한 경험이 있는 사람의 비율은?",
        source: "한국, 서울연구원(2020)",
        answer: 8
    },
    {
        question: "미국인 중 바닥에 떨어진 동전을 절대 줍지 않는 사람의 비율은?",
        source: "미국, YouGov/1,225명",
        answer: 6
    },
    {
        question: "영국 여성 중 나쁜 머리를 자르고 울어본 경험이 있는 사람의 비율은?",
        source: "영국Voucher/2,395명",
        answer: 23
    },
    {
        question: "미국 여성 중 나쁜 머리를 자르고 울어본 경험이 있는 사람의 비율은?",
        source: "미국Essence/1,000명",
        answer: 26
    },
    {
        question: "미국인 중 영화관에서 팝콘을 절대 먹지 않는 사람의 비율은?",
        source: "미국, UCOP/온라인(2021)",
        answer: 5
    },
    {
        question: "미국 남성 중 매일 우유를 1잔 이상 마시는 사람의 비율은?",
        source: "미국, USDA/2,000명",
        answer: 24
    },
    {
        question: "미국 여성 중 매일 우유를 1잔 이상 마시는 사람의 비율은?",
        source: "미국, USDA/2,000명",
        answer: 23
    },
    {
        question: "일본인 중 민트초코를 좋아하는 사람의 비율은?",
        source: "일본, At Home/1,457명",
        answer: 36
    },
    {
        question: "미국인 중 샤워 중 소변을 매일 보는 사람의 비율은?",
        source: "미국, Talker/2,000명",
        answer: 24
    },
    {
        question: "미국인 중 샤워 중 소변을 1년 내 경험한 적이 있는 사람의 비율은?",
        source: "미국, Talker/2,000명",
        answer: 45
    },
    {
        question: "미국인 중 누드 셀카를 보낸 적이 있는 사람의 비율은?",
        source: "미국, Bad Girls Bible/1,058명",
        answer: 40
    },
    {
        question: "전 세계 사람들 중 와이파이 농담 네임을 설정한 경험이 있는 사람의 비율은?",
        source: "글로벌, ExpressVPN/5,000명+",
        answer: 12
    },
    {
        question: "영국인 중 외출 시 불을 끄지 않고 나가는 사람의 비율은?",
        source: "영국, Utility Design/대표집단",
        answer: 21
    },
    {
        question: "전 세계 스마트폰 사용자 중 아이폰을 사용하는 사람의 비율은?",
        source: "글로벌, Statista(2025)",
        answer: 29
    },
    {
        question: "미국 성인 중 치아 미백 경험이 있는 사람의 비율은?",
        source: "미국, ALPINE White/Racounter(2023)",
        answer: 32
    },
    {
        question: "미국 남성 중 범퍼스티커를 부착한 경험이 있는 사람의 비율은?",
        source: "미국, Cheap Car Insurance/2,000명",
        answer: 50
    },
    {
        question: "미국 여성 중 범퍼스티커를 부착한 경험이 있는 사람의 비율은?",
        source: "미국, Cheap Car Insurance/2,000명",
        answer: 63
    },
    {
        question: "미국 남부 지역 사람들 중 범퍼스티커를 부착한 경험이 있는 사람의 비율은?",
        source: "미국, Cheap Car Insurance/2,000명",
        answer: 68
    },
    {
        question: "미국 어린이/청소년 중 SNS에서 낯선 사람과 온라인 대화를 해본 경험이 있는 사람의 비율은?",
        source: "미국, Center for Cyber Safety 등",
        answer: 40
    },
    {
        question: "영국인 중 일기나 다이어리를 쓰는 사람의 비율은?",
        source: "영국, Literacy Trust/70,000명",
        answer: 30
    },
    {
        question: "영국인 중 매일 일기나 다이어리를 쓰는 사람의 비율은?",
        source: "영국, Literacy Trust/70,000명",
        answer: 24
    },
    {
        question: "영국 18~24세 중 술집에서 쫓겨난 경험이 있는 사람의 비율은?",
        source: "영국, Drinkaware/1,100명(18~24세)",
        answer: 5
    },
    {
        question: "미국인 중 1년 내 경찰서에 간 적이 있는 사람의 비율은?",
        source: "미국, BJS/49,200,000명",
        answer: 19
    },
    {
        question: "영국인 중 고환 요리를 먹겠다고 답한 사람의 비율은?",
        source: "영국, YouGov/2,000명",
        answer: 10
    },
    {
        question: "전 세계 사람들 중 최근 1달 내 인터넷 기록을 삭제한 적이 있는 사람의 비율은?",
        source: "글로벌, NordVPN/1,000명+",
        answer: 33
    },
    {
        question: "미국인 중 크록스를 소유한 경험이 있는 사람의 비율은?",
        source: "미국, FreakyShoes(2024)",
        answer: 19
    },
    {
        question: "미국인 중 하루 이상 농장 일을 해본 경험이 있는 사람의 비율은?",
        source: "미국, USDA(2022)",
        answer: 40
    },
    {
        question: "미국인 중 카지노에 가본 경험이 있는 사람의 비율은?",
        source: "미국, American Gaming Assoc./2,000명",
        answer: 55
    },
    {
        question: "영국 18~22세 중 리얼리티쇼에 투표한 경험이 있는 사람의 비율은?",
        source: "영국, 방송사/2015",
        answer: 33
    },
    {
        question: "미국인 중 집이 지저분해서 집 데이트를 피한 경험이 있는 사람의 비율은?",
        source: "미국, Essence·UC Berkley/2,000명",
        answer: 15
    },
    {
        question: "미국인 중 악기 연주가 가능한 사람의 비율은?",
        source: "미국, 각 설문",
        answer: 66
    },
    {
        question: "영국인 중 악기 연주가 가능한 사람의 비율은?",
        source: "영국, 각 설문",
        answer: 74
    },
    {
        question: "미국인 중 펫과 입맞춤한 경험이 있는 사람의 비율은?",
        source: "미국, 조사(2022)",
        answer: 52
    },
    {
        question: "미국인 중 모르는 번호 전화를 자주 받는 사람의 비율은?",
        source: "미국, Pew/YouGov",
        answer: 19
    },
    {
        question: "미국인 중 모르는 번호 전화를 절대 받지 않는 사람의 비율은?",
        source: "미국, Pew/YouGov",
        answer: 41
    },
    {
        question: "미국 MMO 게임 플레이어 중 현질(현금결제) 경험이 있는 사람의 비율은?",
        source: "미국, Top Dollar/1,000명",
        answer: 89
    },
    {
        question: "미국 모바일 게임 플레이어 중 현질(현금결제) 경험이 있는 사람의 비율은?",
        source: "미국, SuperData/3,000명",
        answer: 51
    },
    {
        question: "미국인 중 보드게임을 선호하는 사람의 비율은?",
        source: "미국, YouGov·Board Game Stats",
        answer: 21
    },
    {
        question: "미국인 중 광대를 싫어하는 사람의 비율은?",
        source: "미국, Rasmussen/1,000명, Vox/1,999명",
        answer: 43
    },
    {
        question: "미국인 중 광대를 무서워하는 사람의 비율은?",
        source: "미국, Rasmussen/1,000명, Vox/1,999명",
        answer: 12
    },
    {
        question: "미국인 중 결혼할 계획이 없는 사람의 비율은?",
        source: "미국, Pew/1,003명",
        answer: 23
    },
    {
        question: "영국 미혼자 중 결혼할 계획이 없는 사람의 비율은?",
        source: "영국 BBC",
        answer: 38
    },
    {
        question: "전 세계 사람들 중 휘파람을 못 부는 사람의 비율은?",
        source: "글로벌 추정",
        answer: 28
    },
    {
        question: "미국인 중 달 착륙이 가짜라고 믿는 사람의 비율은?",
        source: "미국, Gallup/1,002명",
        answer: 6
    },
    {
        question: "전 세계 사람들 중 달 착륙이 가짜라고 믿는 사람의 비율은?",
        source: "글로벌, YouGov",
        answer: 9
    },
    {
        question: "미국 가정 중 수족관(어항)을 보유하고 있는 가정의 비율은?",
        source: "미국, APPA/30,000가구",
        answer: 6
    },
];

function getStatisticByIndex(index) {
    if (index >=0 && index < statisticsData.length) {
        return statisticsData[index];
    }
    return statisticsData[0]; // fallback
}

function getTotalQuestions() {
    return statisticsData.length;
}

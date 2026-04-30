/**
 * questions.js - Fakeit2
 *
 * 총 80개 질문 (Fakeit의 2배)
 * 번호 체계:
 *   10-29: 입력형  (type 1) - 20개
 *   30-49: 그림형  (type 2) - 20개
 *   50-69: 선택형  (type 3) - 20개
 *   70-89: 이모티콘형 (type 4) - 20개
 */

window.questionDatabase = {

    // ===== 입력형 (10-29) =====
    10: { main: "가장 좋아하는 음식은?", fake: "가장 싫어하는 음식은?", mode: "입력형", type: 1 },
    11: { main: "가장 특이하게 쓰는 이모티콘은? (이모티콘만)", fake: "아주 가끔만 쓰는 이모티콘은?", mode: "입력형", type: 1 },
    12: { main: "가장 기억에 남는 여행지는?", fake: "유명한 관광 명소 하나 입력", mode: "입력형", type: 1 },
    13: { main: "키우고 싶은 애완동물은?", fake: "무서운 동물 하나 입력", mode: "입력형", type: 1 },
    14: { main: "가장 자주 듣는 노래 제목은?", fake: "오래된 유행가 제목 입력", mode: "입력형", type: 1 },
    15: { main: "아직 못봤지만 보고싶은 영화는?", fake: "유명한 영화 제목 하나 입력", mode: "입력형", type: 1 },
    16: { main: "사람을 죽일 수 있는 물건은?", fake: "요리할 때 자주 쓰는 도구는?", mode: "입력형", type: 1 },
    17: { main: "가장 기억에 남는 선생님 이름은?", fake: "아무 이름이나 입력", mode: "입력형", type: 1 },
    18: { main: "좋아하는 프랜차이즈는?", fake: "가장 최근에 간 음식점 이름", mode: "입력형", type: 1 },
    19: { main: "읽어본 책 제목은?", fake: "영화로 만들어진 책 제목", mode: "입력형", type: 1 },
    20: { main: "가장 최근에 산 물건은?", fake: "온라인으로 자주 사는 것은?", mode: "입력형", type: 1 },
    21: { main: "핸드폰 잠금화면은 어떤 이미지인가요?", fake: "핸드폰 바탕화면에 뭐가 있나요?", mode: "입력형", type: 1 },
    22: { main: "인생에서 가장 후회하는 일은?", fake: "인생에서 가장 잘한 결정은?", mode: "입력형", type: 1 },
    23: { main: "가장 무서웠던 공포영화 제목은?", fake: "재미있었던 코미디 영화 제목은?", mode: "입력형", type: 1 },
    24: { main: "지금 당장 먹고 싶은 음식은?", fake: "어제 먹은 음식은?", mode: "입력형", type: 1 },
    25: { main: "좋아하는 유튜버 이름은?", fake: "자주 보는 유튜브 채널 종류는?", mode: "입력형", type: 1 },
    26: { main: "가장 오래된 친구의 이름은?", fake: "가장 최근에 사귄 친구의 특징은?", mode: "입력형", type: 1 },
    27: { main: "어릴 때 별명은?", fake: "지금도 불리는 별명은?", mode: "입력형", type: 1 },
    28: { main: "가장 이상한 나만의 습관은?", fake: "가장 좋은 나만의 습관은?", mode: "입력형", type: 1 },
    29: { main: "죽기 전에 꼭 하고 싶은 일은?", fake: "올해 꼭 하고 싶은 일은?", mode: "입력형", type: 1 },

    // ===== 그림형 (30-49) =====
    30: { main: "파인애플을 그려보세요", fake: "과일을 하나 그려보세요", mode: "그림형", type: 2 },
    31: { main: "집을 그려보세요", fake: "예쁜 상자를 그려보세요", mode: "그림형", type: 2 },
    32: { main: "공룡을 그려보세요", fake: "동물을 하나 그려보세요", mode: "그림형", type: 2 },
    33: { main: "모나리자를 그려보세요", fake: "자신의 초상화를 그려보세요", mode: "그림형", type: 2 },
    34: { main: "자신의 방을 그려보세요", fake: "꿈꾸는 방을 그려보세요", mode: "그림형", type: 2 },
    35: { main: "가장 좋아하는 꽃을 그려보세요", fake: "독이 있는 식물을 그려보세요", mode: "그림형", type: 2 },
    36: { main: "자신의 자동차(또는 원하는 차)를 그려보세요", fake: "미래의 자동차를 그려보세요", mode: "그림형", type: 2 },
    37: { main: "가족 구성원을 그려보세요", fake: "이상적인 가족 모습을 그려보세요", mode: "그림형", type: 2 },
    38: { main: "자주 입는 옷을 그려보세요", fake: "입고 싶은 옷을 그려보세요", mode: "그림형", type: 2 },
    39: { main: "좋아하는 스포츠를 그려보세요", fake: "극한 스포츠를 하나 그려보세요", mode: "그림형", type: 2 },
    40: { main: "가장 좋아하는 음식을 그려보세요", fake: "맛없어 보이는 음식을 그려보세요", mode: "그림형", type: 2 },
    41: { main: "꿈에 자주 등장하는 장소를 그려보세요", fake: "무서운 장소를 그려보세요", mode: "그림형", type: 2 },
    42: { main: "완벽한 날씨를 그림으로 표현해보세요", fake: "최악의 날씨를 그려보세요", mode: "그림형", type: 2 },
    43: { main: "이상적인 데이트 장소를 그려보세요", fake: "최악의 데이트 장소를 그려보세요", mode: "그림형", type: 2 },
    44: { main: "지금 기분을 그림으로 표현해보세요", fake: "한 달 뒤 기분을 그림으로 표현해보세요", mode: "그림형", type: 2 },
    45: { main: "좋아하는 캐릭터를 그려보세요", fake: "악당 캐릭터를 그려보세요", mode: "그림형", type: 2 },
    46: { main: "바다 생물을 하나 그려보세요", fake: "외계 생물을 그려보세요", mode: "그림형", type: 2 },
    47: { main: "지금 있는 방에서 가장 마음에 드는 것을 그려보세요", fake: "방에서 가장 필요 없는 것을 그려보세요", mode: "그림형", type: 2 },
    48: { main: "영웅을 그려보세요", fake: "슈퍼빌런을 그려보세요", mode: "그림형", type: 2 },
    49: { main: "현재 자신의 표정을 그려보세요", fake: "상대방의 현재 표정을 그려보세요", mode: "그림형", type: 2 },

    // ===== 선택형 (50-69) =====
    50: { main: "이 중에서 가장 웃긴 사람은?", fake: "이 중에서 가장 무서운 사람은?", mode: "선택형", type: 3, placeholder: "플레이어 이름 입력" },
    51: { main: "게임을 가장 잘할 것 같은 사람은?", fake: "게임을 가장 못할 것 같은 사람은?", mode: "선택형", type: 3, placeholder: "플레이어 이름 입력" },
    52: { main: "요리를 가장 잘할 것 같은 사람은?", fake: "요리를 가장 못할 것 같은 사람은?", mode: "선택형", type: 3, placeholder: "플레이어 이름 입력" },
    53: { main: "가장 착한 사람은?", fake: "가장 이기적인 사람은?", mode: "선택형", type: 3, placeholder: "플레이어 이름 입력" },
    54: { main: "노래를 가장 잘 부를 것 같은 사람은?", fake: "노래를 가장 못할 것 같은 사람은?", mode: "선택형", type: 3, placeholder: "플레이어 이름 입력" },
    55: { main: "가장 인기가 많을 것 같은 사람은?", fake: "가장 소심한 것 같은 사람은?", mode: "선택형", type: 3, placeholder: "플레이어 이름 입력" },
    56: { main: "가장 운동을 잘할 것 같은 사람은?", fake: "가장 체력이 없을 것 같은 사람은?", mode: "선택형", type: 3, placeholder: "플레이어 이름 입력" },
    57: { main: "가장 리더십이 있는 사람은?", fake: "가장 말이 없을 것 같은 사람은?", mode: "선택형", type: 3, placeholder: "플레이어 이름 입력" },
    58: { main: "가장 패션센스가 좋은 사람은?", fake: "가장 개성 있는 옷을 입을 것 같은 사람은?", mode: "선택형", type: 3, placeholder: "플레이어 이름 입력" },
    59: { main: "가장 똑똑한 사람은?", fake: "가장 엉뚱한 사람은?", mode: "선택형", type: 3, placeholder: "플레이어 이름 입력" },
    60: { main: "가장 돈을 잘 모을 것 같은 사람은?", fake: "가장 돈을 잘 쓸 것 같은 사람은?", mode: "선택형", type: 3, placeholder: "플레이어 이름 입력" },
    61: { main: "가장 일찍 일어날 것 같은 사람은?", fake: "가장 늦게까지 잘 것 같은 사람은?", mode: "선택형", type: 3, placeholder: "플레이어 이름 입력" },
    62: { main: "가장 오래 살 것 같은 사람은?", fake: "가장 건강에 신경 안 쓸 것 같은 사람은?", mode: "선택형", type: 3, placeholder: "플레이어 이름 입력" },
    63: { main: "가장 요즘 스트레스를 많이 받을 것 같은 사람은?", fake: "가장 행복해 보이는 사람은?", mode: "선택형", type: 3, placeholder: "플레이어 이름 입력" },
    64: { main: "가장 외국어를 잘할 것 같은 사람은?", fake: "가장 해외여행을 좋아할 것 같은 사람은?", mode: "선택형", type: 3, placeholder: "플레이어 이름 입력" },
    65: { main: "가장 나쁜 비밀이 많을 것 같은 사람은?", fake: "가장 솔직한 사람은?", mode: "선택형", type: 3, placeholder: "플레이어 이름 입력" },
    66: { main: "가장 늦게 결혼할 것 같은 사람은?", fake: "가장 좋은 배우자가 될 것 같은 사람은?", mode: "선택형", type: 3, placeholder: "플레이어 이름 입력" },
    67: { main: "좀비 아포칼립스에서 가장 오래 살 것 같은 사람은?", fake: "좀비 아포칼립스에서 가장 먼저 당할 것 같은 사람은?", mode: "선택형", type: 3, placeholder: "플레이어 이름 입력" },
    68: { main: "무인도에 갈 때 데려가고 싶은 사람은?", fake: "무인도에 혼자 남겨도 잘 살 것 같은 사람은?", mode: "선택형", type: 3, placeholder: "플레이어 이름 입력" },
    69: { main: "가장 유명인이 될 것 같은 사람은?", fake: "가장 평범하게 살 것 같은 사람은?", mode: "선택형", type: 3, placeholder: "플레이어 이름 입력" },

    // ===== 이모티콘형 (70-89) =====
    70: { main: "자신이 갖고 싶어하는 가장 큰 능력은?", fake: "벌거벗고 하면 안 되는 것은?", mode: "이모티콘형", type: 4, placeholder: "자유롭게 입력" },
    71: { main: "가장 좋아하는 야외 활동은?", fake: "죽었을 때 하고 있으면 부끄러운 행동은?", mode: "이모티콘형", type: 4, placeholder: "자유롭게 입력" },
    72: { main: "사랑을 나눌 때 외칠 법한 말은?", fake: "교회에서 할 법한 말은?", mode: "이모티콘형", type: 4, placeholder: "자유롭게 입력" },
    73: { main: "어릴 때 꿈꿨던 직업은?", fake: "가장 AI에 대체될 것 같은 직업은?", mode: "이모티콘형", type: 4, placeholder: "자유롭게 입력" },
    74: { main: "데이트를 마무리하기 가장 좋은 방법은?", fake: "첫 데이트에 하면 안 되는 것은?", mode: "이모티콘형", type: 4, placeholder: "자유롭게 입력" },
    75: { main: "사랑 노래 가사 한 구절은?", fake: "가장 끔찍한 플러팅 멘트는?", mode: "이모티콘형", type: 4, placeholder: "자유롭게 입력" },
    76: { main: "가장 좋아하는 나라 음식은? (나라 이름 포함, 자국 제외)", fake: "가장 가기 싫은 나라는?", mode: "이모티콘형", type: 4, placeholder: "자유롭게 입력" },
    77: { main: "특이한 피자 토핑은?", fake: "냉장고에 항상 있는 것은?", mode: "이모티콘형", type: 4, placeholder: "자유롭게 입력" },
    78: { main: "오늘 저녁에 하기로 한 것은?", fake: "로또에 당첨된다면 하고 싶은 일은?", mode: "이모티콘형", type: 4, placeholder: "자유롭게 입력" },
    79: { main: "만난 적 있는 유명인 중 가장 유명한 사람은?", fake: "좋아하는 연예인 이름은?", mode: "이모티콘형", type: 4, placeholder: "자유롭게 입력" },
    80: { main: "가장 이상한 음식 조합은?", fake: "가장 흔한 음식 조합은?", mode: "이모티콘형", type: 4, placeholder: "자유롭게 입력" },
    81: { main: "10억이 생기면 처음으로 할 것은?", fake: "100만원이 생기면 처음으로 할 것은?", mode: "이모티콘형", type: 4, placeholder: "자유롭게 입력" },
    82: { main: "가장 좋아하는 계절과 그 이유는?", fake: "가장 싫어하는 계절과 그 이유는?", mode: "이모티콘형", type: 4, placeholder: "자유롭게 입력" },
    83: { main: "새벽 3시에 혼자 있을 때 뭐 하나요?", fake: "자기 전에 주로 뭐 하나요?", mode: "이모티콘형", type: 4, placeholder: "자유롭게 입력" },
    84: { main: "친구에게 절대 말 못할 비밀이 있다면 힌트만?", fake: "가족에게 절대 말 못할 것이 있다면 힌트만?", mode: "이모티콘형", type: 4, placeholder: "자유롭게 입력" },
    85: { main: "10년 후 나는 어떤 모습일까요?", fake: "1년 후 나는 어떤 모습일까요?", mode: "이모티콘형", type: 4, placeholder: "자유롭게 입력" },
    86: { main: "가장 두려운 것은?", fake: "가장 흥미로운 것은?", mode: "이모티콘형", type: 4, placeholder: "자유롭게 입력" },
    87: { main: "지금 이 순간 가장 갖고 싶은 것은?", fake: "지금 당장 먹고 싶은 것은?", mode: "이모티콘형", type: 4, placeholder: "자유롭게 입력" },
    88: { main: "나만의 특기는?", fake: "남들이 보는 나의 특기는?", mode: "이모티콘형", type: 4, placeholder: "자유롭게 입력" },
    89: { main: "마지막 생일에 받고 싶었던 선물은?", fake: "마지막 생일에 실제로 받은 선물은?", mode: "이모티콘형", type: 4, placeholder: "자유롭게 입력" },
};

window.getQuestionByNumber = function (n) {
    return window.questionDatabase[n] || {
        main: "질문을 찾을 수 없습니다",
        fake: "질문을 찾을 수 없습니다",
        mode: "입력형",
        type: 1
    };
};

window.isQuestionsLoaded = function () {
    return window.questionDatabase &&
        Object.keys(window.questionDatabase).length === 80;
};

window.getCurrentQuestion = function (inviteCode, gameNumber, round, isFaker) {
    try {
        const questionNumber = window.getQuestionForRound(inviteCode, gameNumber, round);
        const question = window.getQuestionByNumber(questionNumber);
        return {
            ...question,
            questionNumber,
            text: isFaker ? question.fake : question.main
        };
    } catch (e) {
        console.error('질문 가져오기 오류:', e);
        return { main: "기본 질문", fake: "기본 라이어 질문", mode: "입력형", type: 1, questionNumber: 10, text: "기본 질문" };
    }
};

console.log('Fakeit2 질문 데이터베이스 로드 완료 - 총 80개');

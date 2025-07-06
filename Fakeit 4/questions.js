/**
 * 페이커 게임 질문 데이터베이스
 * 문제 유형별 5개씩 총 20개 문제
 * 
 * 문제 번호 체계:
 * 1x: 입력형 (11-15)
 * 2x: 그림형 (21-25) 
 * 3x: 플레이어선택형 (31-35) - 다른 플레이어를 선택하는 문제
 * 4x: 이모티콘형 (41-45)
 */

// 전역 질문 데이터베이스
window.questionDatabase = {
    // === 입력형 문제 (10-19) ===
    10: { main: "가장 좋아하는 음식은?", fake: "음식 하나 입력", mode: "입력형", type: 1 },
    11: { main: "가장 특이한 이모티콘 입력(이모티콘만)", fake: "아주 가끔 쓰는 이모티콘 입력", mode: "입력형", type: 1 },
    12: { main: "가장 기억에 남는 여행지는?", fake: "유명한 장소 입력", mode: "입력형", type: 1 },
    13: { main: "키우고 싶은 애완동물은?", fake: "동물 입력", mode: "입력형", type: 1 },
    14: { main: "가장 자주 듣는 노래 제목은?", fake: "노래 제목 입력", mode: "입력형", type: 1 },
    15: { main: "아직 못봤지만 보고싶은 영화는?", fake: "영화제목 입력", mode: "입력형", type: 1 },
    16: { main: "사람을 죽일 수 있는 물건은?", fake: "요리할때 자주쓰는 도구는?", mode: "입력형", type: 1 },
    17: { main: "가장 기억에 남는 선생님 이름은?", fake: "이름 입력", mode: "입력형", type: 1 },
    18: { main: "좋아하는 프랜차이즈는?", fake: "가장 최근에 간 음식점 이름", mode: "입력형", type: 1 },
    19: { main: "읽어본 책 이름", fake: "영화화된 책 이름", mode: "입력형", type: 1 },

    // === 그림형 문제 (20-29) ===
    20: { main: "파인애플을 그려보세요", fake: "과일을 그려보세요", mode: "그림형", type: 2 },
    21: { main: "집을 그려보세요", fake: "예쁜 상자를 그려보세요", mode: "그림형", type: 2 },
    22: { main: "공룡을 그려보세요", fake: "동물을 그려보세요", mode: "그림형", type: 2 },
    23: { main: "모나리자를 그려보세요", fake: "자신의 초상화를 그려보세요", mode: "그림형", type: 2 },
    24: { main: "자신의 방을 그려보세요", fake: "감옥 안을 그려보세요", mode: "그림형", type: 2 },
    25: { main: "가장 좋아하는 꽃을 그려보세요", fake: "독이 있는 식물을 그려보세요", mode: "그림형", type: 2 },
    26: { main: "자신의 자동차를 그려보세요", fake: "우주선을 그려보세요", mode: "그림형", type: 2 },
    27: { main: "가족 구성원을 그려보세요", fake: "로봇 가족을 그려보세요", mode: "그림형", type: 2 },
    28: { main: "자주 입는 옷을 그려보세요", fake: "중세시대 의상을 그려보세요", mode: "그림형", type: 2 },
    29: { main: "좋아하는 스포츠를 그려보세요", fake: "위험한 극한스포츠를 그려보세요", mode: "그림형", type: 2 },

    // === 플레이어선택형 문제 (30-39) ===
    30: { main: "이 중에서 가장 웃긴 사람은?", fake: "이 중에서 가장 무서운 사람은?", mode: "플레이어선택형", type: 3, placeholder: "플레이어1 또는 이름" },
    31: { main: "게임을 가장 잘할 것 같은 사람은?", fake: "게임을 가장 못할 것 같은 사람은?", mode: "플레이어선택형", type: 3, placeholder: "플레이어2 또는 이름" },
    32: { main: "요리를 가장 잘할 것 같은 사람은?", fake: "요리를 가장 못할 것 같은 사람은?", mode: "플레이어선택형", type: 3, placeholder: "플레이어3 또는 이름" },
    33: { main: "가장 착한 사람은?", fake: "가장 나쁜 사람은?", mode: "플레이어선택형", type: 3, placeholder: "호스트 또는 이름" },
    34: { main: "노래를 가장 잘 부를 것 같은 사람은?", fake: "노래를 가장 못할 것 같은 사람은?", mode: "플레이어선택형", type: 3, placeholder: "플레이어1 또는 이름" },
    35: { main: "가장 인기가 많을 것 같은 사람은?", fake: "가장 외로울 것 같은 사람은?", mode: "플레이어선택형", type: 3, placeholder: "플레이어4 또는 이름" },
    36: { main: "가장 운동을 잘할 것 같은 사람은?", fake: "가장 게으를 것 같은 사람은?", mode: "플레이어선택형", type: 3, placeholder: "플레이어2 또는 이름" },
    37: { main: "가장 리더십이 있는 사람은?", fake: "가장 소극적인 사람은?", mode: "플레이어선택형", type: 3, placeholder: "플레이어5 또는 이름" },
    38: { main: "가장 패션센스가 좋은 사람은?", fake: "가장 패션센스가 없는 사람은?", mode: "플레이어선택형", type: 3, placeholder: "플레이어3 또는 이름" },
    39: { main: "가장 똑똑한 사람은?", fake: "가장 멍청한 사람은?", mode: "플레이어선택형", type: 3, placeholder: "플레이어1 또는 이름" },

    // === 이모티콘형 문제 (40-49) ===
    40: { main: "자신이 갖고 싶어하는 가장 큰 능력", fake: "벌거벗고 하면 안 되는 것", mode: "이모티콘형", type: 4, placeholder: "😊" },
    41: { main: "가장 좋아하는 야외 활동", fake: "죽었을 때 하고 있으면 부끄러운 행동", mode: "이모티콘형", type: 4, placeholder: "🍕" },
    42: { main: "사랑을 나눌 때 외칠 법한 말", fake: "교회에서 할 법한 말", mode: "이모티콘형", type: 4, placeholder: "☀️" },
    43: { main: "어릴 때 꿈꿨던 직업", fake: "가장 AI에 대체될것 같은 직업", mode: "이모티콘형", type: 4, placeholder: "🎮" },
    44: { main: "데이트를 마무리하기 가장 좋은 방법", fake: "첫 데이트에 하면 안된는것", mode: "이모티콘형", type: 4, placeholder: "🏝️" },
    45: { main: "사랑 노래 가사 한구절", fake: "가장 끔찍한 플러팅 멘트", mode: "이모티콘형", type: 4, placeholder: "⚽" },
    46: { main: "가장 좋아하는 나라 음식(나라를 적으시오)(본인국가 제외!)", fake: "가장 가기 싫은 나라", mode: "이모티콘형", type: 4, placeholder: "🐕" },
    47: { main: "특이한 피자토핑", fake: "냉장고에 안먹고 항상 있는것", mode: "이모티콘형", type: 4, placeholder: "💼" },
    48: { main: "오늘 저녁에 하기로 한것", fake: "로또에 당첨된다면 하고 싶은 일", mode: "이모티콘형", type: 4, placeholder: "❤️" },
    49: { main: "만난 적 있는 유명인중 가장 유명한 사람", fake: "유명인또는 연애인 이름", mode: "이모티콘형", type: 4, placeholder: "😄" },

};

/**
 * 문제 번호로 질문 가져오기
 */
window.getQuestionByNumber = function(questionNumber) {
    return window.questionDatabase[questionNumber] || {
        main: "질문을 찾을 수 없습니다",
        fake: "질문을 찾을 수 없습니다",
        mode: "입력형",
        type: 1
    };
};

/**
 * 문제 유형별 문제 목록 가져오기
 */
window.getQuestionsByType = function(type) {
    const questions = [];
    const startNum = type * 10 + 1;
    const endNum = type * 10 + 5;
    
    for (let i = startNum; i <= endNum; i++) {
        const question = window.questionDatabase[i];
        if (question) {
            questions.push({
                number: i,
                main: question.main,
                fake: question.fake,
                mode: question.mode,
                type: question.type
            });
        }
    }
    
    return questions;
};

/**
 * 모든 문제 유형 정보 가져오기
 */
window.getQuestionTypes = function() {
    return {
        1: { name: "입력형", range: "11-15", description: "텍스트를 입력하는 문제" },
        2: { name: "그림형", range: "21-25", description: "그림을 그리는 문제" },
        3: { name: "플레이어선택형", range: "31-35", description: "다른 플레이어를 선택하는 문제" },
        4: { name: "이모티콘형", range: "41-45", description: "이모티콘을 입력하는 문제" }
    };
};

/**
 * 초대코드 기반으로 게임 질문들 가져오기
 */
window.getGameQuestions = function(inviteCode, gameNumber = 1) {
    if (!window.isGameDataLoaded()) {
        console.error('게임 데이터가 로드되지 않았습니다.');
        return [11, 21, 31, 41];
    }
    
    return window.getCurrentGameQuestions(inviteCode, gameNumber);
};

/**
 * 특정 라운드의 질문 가져오기
 */
window.getCurrentQuestion = function(inviteCode, gameNumber, round, isFaker = false) {
    try {
        const questionNumber = window.getQuestionForRound(inviteCode, gameNumber, round);
        const question = window.getQuestionByNumber(questionNumber);
        
        return {
            ...question,
            questionNumber: questionNumber,
            text: isFaker ? question.fake : question.main
        };
    } catch (error) {
        console.error('질문 가져오기 오류:', error);
        const fallbackQuestion = window.questionDatabase[11] || {
            main: "기본 질문입니다",
            fake: "기본 가짜 질문입니다",
            mode: "입력형",
            type: 1
        };
        
        return {
            ...fallbackQuestion,
            questionNumber: 11,
            text: isFaker ? fallbackQuestion.fake : fallbackQuestion.main
        };
    }
};

/**
 * 질문 데이터베이스가 로드되었는지 확인
 */
window.isQuestionsLoaded = function() {
    return window.questionDatabase && 
           Object.keys(window.questionDatabase).length === 40 &&
           window.getQuestionTypes &&
           window.getQuestionByNumber;
};

/**
 * 랜덤 질문 선택
 */
window.getRandomQuestions = function(count = 4) {
    const questionNumbers = Object.keys(window.questionDatabase).map(id => parseInt(id));
    const shuffled = questionNumbers.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

/**
 * 유형별 랜덤 질문 선택
 */
window.getRandomQuestionsByType = function() {
    const result = [];
    
    for (let type = 1; type <= 4; type++) {
        const typeQuestions = window.getQuestionsByType(type);
        const randomQuestion = typeQuestions[Math.floor(Math.random() * typeQuestions.length)];
        result.push(randomQuestion.number);
    }
    
    return result;
};

/**
 * 특정 게임의 특정 라운드 질문 번호 가져오기
 */
window.getQuestionNumberForRound = function(inviteCode, gameNumber, roundNumber) {
    try {
        return window.getQuestionForRound(inviteCode, gameNumber, roundNumber);
    } catch (error) {
        console.error('질문 번호 가져오기 오류:', error);
        const defaultQuestions = [11, 21, 31, 41];
        return defaultQuestions[roundNumber - 1] || 11;
    }
};

/**
 * 시스템 호환성 확인
 */
window.checkSystemCompatibility = function() {
    const status = {
        questionsLoaded: window.isQuestionsLoaded(),
        gameDataLoaded: window.isGameDataLoaded && window.isGameDataLoaded(),
        functionsAvailable: {
            getQuestionForRound: typeof window.getQuestionForRound === 'function',
            getCurrentGameQuestions: typeof window.getCurrentGameQuestions === 'function',
            parseQuestionNumber: typeof window.parseQuestionNumber === 'function'
        },
        compatible: true
    };
    
    status.compatible = status.questionsLoaded && 
                       status.gameDataLoaded && 
                       Object.values(status.functionsAvailable).every(fn => fn);
    
    if (!status.compatible) {
        console.warn('시스템 호환성 문제 감지:', status);
    }
    
    return status;
};

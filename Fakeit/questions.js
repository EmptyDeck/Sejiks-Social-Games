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
    // === 입력형 문제 (11-15) ===
    11: { main: "가장 좋아하는 음식은?", fake: "가장 싫어하는 음식은?", mode: "입력형", type: 1 },
    12: { main: "어릴 때 장래희망은?", fake: "현재 직업에 대한 불만은?", mode: "입력형", type: 1 },
    13: { main: "가장 기억에 남는 여행지는?", fake: "가장 가고 싶지 않은 여행지는?", mode: "입력형", type: 1 },
    14: { main: "첫 번째 애완동물 이름은?", fake: "키우고 싶은 이상한 동물은?", mode: "입력형", type: 1 },
    15: { main: "가장 자주 듣는 노래 제목은?", fake: "가장 지겨운 노래 제목은?", mode: "입력형", type: 1 },

    // === 그림형 문제 (21-25) ===
    21: { main: "자신의 얼굴을 그려보세요", fake: "가장 무서운 괴물을 그려보세요", mode: "그림형", type: 2 },
    22: { main: "집 앞 풍경을 그려보세요", fake: "화성 표면을 그려보세요", mode: "그림형", type: 2 },
    23: { main: "가장 좋아하는 동물을 그려보세요", fake: "멸종된 공룡을 그려보세요", mode: "그림형", type: 2 },
    24: { main: "어제 저녁 메뉴를 그려보세요", fake: "외계인의 음식을 그려보세요", mode: "그림형", type: 2 },
    25: { main: "자신의 방을 그려보세요", fake: "감옥 안을 그려보세요", mode: "그림형", type: 2 },

    // === 플레이어선택형 문제 (31-35) ===
    31: { main: "이 중에서 가장 웃긴 사람은?", fake: "이 중에서 가장 무서운 사람은?", mode: "플레이어선택형", type: 3, placeholder: "플레이어1 또는 이름" },
    32: { main: "게임을 가장 잘할 것 같은 사람은?", fake: "게임을 가장 못할 것 같은 사람은?", mode: "플레이어선택형", type: 3, placeholder: "플레이어2 또는 이름" },
    33: { main: "요리를 가장 잘할 것 같은 사람은?", fake: "요리를 가장 못할 것 같은 사람은?", mode: "플레이어선택형", type: 3, placeholder: "플레이어3 또는 이름" },
    34: { main: "가장 착한 사람은?", fake: "가장 나쁜 사람은?", mode: "플레이어선택형", type: 3, placeholder: "호스트 또는 이름" },
    35: { main: "노래를 가장 잘 부를 것 같은 사람은?", fake: "노래를 가장 못할 것 같은 사람은?", mode: "플레이어선택형", type: 3, placeholder: "플레이어1 또는 이름" },

    // === 이모티콘형 문제 (41-45) ===
    41: { main: "지금 기분을 이모티콘으로 표현하세요", fake: "가장 싫어하는 상황을 이모티콘으로 표현하세요", mode: "이모티콘형", type: 4, placeholder: "😊" },
    42: { main: "좋아하는 음식을 이모티콘으로 표현하세요", fake: "체했을 때를 이모티콘으로 표현하세요", mode: "이모티콘형", type: 4, placeholder: "🍕" },
    43: { main: "현재 날씨를 이모티콘으로 표현하세요", fake: "최악의 날씨를 이모티콘으로 표현하세요", mode: "이모티콘형", type: 4, placeholder: "☀️" },
    44: { main: "취미활동을 이모티콘으로 표현하세요", fake: "가장 지루한 일을 이모티콘으로 표현하세요", mode: "이모티콘형", type: 4, placeholder: "🎮" },
    45: { main: "가고 싶은 여행지를 이모티콘으로 표현하세요", fake: "절대 가기 싫은 곳을 이모티콘으로 표현하세요", mode: "이모티콘형", type: 4, placeholder: "🏝️" }
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
           Object.keys(window.questionDatabase).length === 20 &&
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

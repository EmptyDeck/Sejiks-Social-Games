/**
 * 개선된 페이커 게임 데이터 시스템
 * 초대코드 4자리 + 문제유형별 번호 + 시드기반 라이어 선정
 * 
 * 문제 유형:
 * 1: 입력형 (11-15)
 * 2: 그림형 (21-25) 
 * 3: 선택형 (31-35)
 * 4: 이모티콘형 (41-45)
 */

// 알파벳을 0-999 랜덤 숫자로 매핑
window.alphabetToNumber = {
    a: 742, b: 135, c: 951, d: 583, e: 479, f: 284, g: 308, h: 680, i: 866, j: 923,
    k: 231, l: 708, m: 117, n: 357, o: 536, p: 664, q: 22, r: 830, s: 489, t: 90,
    u: 315, v: 764, w: 667, x: 981, y: 185, z: 402
};

// 1. 게임 코드 정보 - 알파벳 4x6 배열 (4게임 x 6행)
window.gameCodeSets = [
    // 게임 1
    [
        ['y', 'b', 'g', 'd'],
        ['z', 'a', 'o', 'r'],
        ['x', 'v', 'u', 't'],
        ['q', 'p', 's', 'f'],
        ['c', 'k', 'w', 'e'],   
        ['h', 'n', 'm', 'j']
    ],
    // 게임 2
    [
        ['r', 'q', 'd', 'k'],
        ['f', 'o', 'n', 'y'],
        ['g', 'z', 'b', 'w'],
        ['e', 't', 'v', 'u'],
        ['a', 'c', 'p', 's'],
        ['x', 'j', 'm', 'h']
    ],
    // 게임 3
    [
        ['t', 'b', 'p', 'e'],
        ['a', 'u', 'f', 'x'],
        ['v', 'm', 'r', 'w'],
        ['s', 'n', 'g', 'y'],
        ['k', 'q', 'o', 'h'],
        ['z', 'j', 'c', 'd']
    ],
    // 게임 4
    [
        ['f', 'g', 'm', 'q'],
        ['p', 'j', 'v', 'y'],
        ['k', 'r', 'h', 'o'],
        ['z', 'u', 'e', 's'],
        ['t', 'n', 'a', 'w'],
        ['c', 'd', 'x', 'b']
    ]
];

// 2. 게임 문제 정보 - 문제번호 4x6 배열
// 각 라운드: [입력형, 그림형, 선택형, 이모티콘형]
window.gameQuestionSets = [
    // 게임 1
    [
        [11, 23, 35, 42], // 1행: 입력형1, 그림형3, 선택형5, 이모티콘2
        [14, 21, 33, 45], // 2행: 입력형4, 그림형1, 선택형3, 이모티콘5
        [12, 25, 31, 43], // 3행: 입력형2, 그림형5, 선택형1, 이모티콘3
        [15, 22, 34, 41], // 4행: 입력형5, 그림형2, 선택형4, 이모티콘1
        [13, 24, 32, 44], // 5행: 입력형3, 그림형4, 선택형2, 이모티콘4
        [11, 23, 35, 42]  // 6행: 입력형1, 그림형3, 선택형5, 이모티콘2
    ],
    // 게임 2
    [
        [12, 24, 31, 43],
        [15, 22, 35, 41],
        [13, 21, 33, 45],
        [11, 25, 32, 44],
        [14, 23, 34, 42],
        [12, 24, 31, 43]
    ],
    // 게임 3
    [
        [13, 25, 32, 44],
        [11, 23, 34, 42],
        [14, 21, 35, 41],
        [12, 24, 31, 45],
        [15, 22, 33, 43],
        [13, 25, 32, 44]
    ],
    // 게임 4
    [
        [14, 21, 33, 45],
        [12, 25, 31, 43],
        [15, 23, 34, 41],
        [11, 22, 35, 44],
        [13, 24, 32, 42],
        [14, 21, 33, 45]
    ]
];

// 3. 게임 라이어 시드 정보 - 각 행마다 20자리 랜덤 알파벳
window.gameSeeds = [
    // 게임 1
    [
        'kjhgfdsaklmnbvcxzqwh', // 1행 시드코드 (20자리)
        'mnbvcxzasdfghjklpoiu',
        'qwertyuiopasdfghjklz',
        'zxcvbnmasdfghjklqwer',
        'poiuytrewqlkjhgfdsam',
        'lkjhgfdsamnbvcxzqwer'
    ],
    // 게임 2
    [
        'asdfghjklzxcvbnmqwer',
        'qwertyuiopmnbvcxzasd',
        'zxcvbnmasdfghjklqwer',
        'mnbvcxzqwertyuiopasd',
        'poiuytrewqasdfghjklz',
        'lkjhgfdsazxcvbnmqwer'
    ],
    // 게임 3
    [
        'qwertyuiopasdfghjklz',
        'mnbvcxzlkjhgfdsaqwer',
        'asdfghjklqwertyuiopz',
        'zxcvbnmpoiuytrewqasd',
        'lkjhgfdsamnbvcxzqwer',
        'qwertyuiopasdfghjklz'
    ],
    // 게임 4
    [
        'mnbvcxzasdfghjklqwer',
        'poiuytrewqlkjhgfdsaz',
        'zxcvbnmasdfghjklqwer',
        'qwertyuiopmnbvcxzasd',
        'asdfghjklzxcvbnmqwer',
        'mnbvcxzasdfghjklqwer'
    ]
];

/**
 * 초대코드에서 게임 세트와 행 인덱스 찾기
 * @param {string} letter - 알파벳 글자
 * @param {number} setIndex - 게임 세트 인덱스 (0-3)
 * @returns {number} 행 인덱스 (0-5), 없으면 -1
 */
window.findRowIndex = function(letter, setIndex) {
    if (setIndex < 0 || setIndex >= window.gameCodeSets.length) {
        return -1;
    }
    
    const set = window.gameCodeSets[setIndex];
    for (let i = 0; i < set.length; i++) {
        if (set[i].includes(letter.toLowerCase())) {
            return i;
        }
    }
    return -1;
};

/**
 * 초대코드에서 게임별 질문 번호들 추출
 * @param {string} inviteCode - 4자리 초대코드
 * @returns {Array} 4게임의 질문 번호 배열
 */
window.getQuestionsFromCode = function(inviteCode) {
    if (!inviteCode || inviteCode.length !== 4) {
        console.error('잘못된 초대코드 형식:', inviteCode);
        return null;
    }
    
    try {
        const code = inviteCode.toLowerCase();
        const allGameQuestions = [];
        
        // 각 게임 세트별로 확인
        for (let gameIndex = 0; gameIndex < 4; gameIndex++) {
            let foundRow = null;
            
            // 코드의 각 글자를 해당 게임 세트에서 찾기
            for (let letterIndex = 0; letterIndex < 4; letterIndex++) {
                const letter = code[letterIndex];
                const rowIndex = window.findRowIndex(letter, gameIndex);
                
                if (rowIndex !== -1) {
                    foundRow = window.gameQuestionSets[gameIndex][rowIndex];
                    break;
                }
            }
            
            if (foundRow) {
                allGameQuestions.push(foundRow);
            } else {
                console.warn(`게임 ${gameIndex + 1}에서 매칭되는 행을 찾지 못했습니다.`);
                // 기본값 사용
                allGameQuestions.push([11, 21, 31, 41]);
            }
        }
        
        return allGameQuestions;
    } catch (error) {
        console.error('질문 추출 중 오류:', error);
        return null;
    }
};

/**
 * 개선된 라이어 선정 함수
 * @param {string} inviteCode - 4자리 초대코드
 * @param {number} gameNumber - 게임 번호 (1-4)
 * @param {number} roundNumber - 라운드 번호 (1-4)
 * @param {number} totalPlayers - 총 플레이어 수 (호스트 포함)
 * @param {number} fakerCount - 라이어 수 (최대 15명)
 * @returns {Array} 라이어 플레이어 번호 배열 (0=호스트, 1-n=플레이어)
 */
window.getFakersForRound = function(inviteCode, gameNumber, roundNumber, totalPlayers, fakerCount) {
    if (!inviteCode || gameNumber < 1 || gameNumber > 4 || roundNumber < 1 || roundNumber > 4) {
        console.error('잘못된 매개변수:', { inviteCode, gameNumber, roundNumber });
        return [];
    }
    
    // 최대 라이어 수 제한
    if (fakerCount > 15) {
        console.warn('최대 라이어 수는 15명입니다.');
        fakerCount = 15;
    }
    
    // 총 플레이어 수보다 라이어 수가 많으면 조정
    if (fakerCount >= totalPlayers) {
        fakerCount = Math.max(1, totalPlayers - 1);
    }
    
    try {
        const code = inviteCode.toLowerCase();
        const setIndex = gameNumber - 1;
        
        // 해당 게임에서 행 찾기
        let rowIndex = -1;
        for (let letterIndex = 0; letterIndex < 4; letterIndex++) {
            const letter = code[letterIndex];
            rowIndex = window.findRowIndex(letter, setIndex);
            if (rowIndex !== -1) break;
        }
        
        if (rowIndex === -1) {
            console.warn('행을 찾을 수 없어 기본값 사용');
            rowIndex = 0;
        }
        
        // 해당 행의 시드코드 가져오기
        const seedCode = window.gameSeeds[setIndex][rowIndex];
        
        // 시드코드에서 라이어 선정
        const fakers = [];
        let seedIndex = (roundNumber - 1) * 5; // 라운드별로 시드 시작 위치 분산
        
        while (fakers.length < fakerCount && seedIndex < seedCode.length) {
            const char = seedCode[seedIndex];
            const charValue = window.alphabetToNumber[char] || 0;
            const playerIndex = charValue % totalPlayers;
            
            // 중복 체크 - 같은 플레이어가 선택되면 다음 알파벳으로
            if (!fakers.includes(playerIndex)) {
                fakers.push(playerIndex);
            }
            
            seedIndex++;
        }
        
        // 라이어 수가 부족하면 추가 생성 (시드코드 끝까지 사용했을 때)
        while (fakers.length < fakerCount) {
            // 시드코드를 순환하여 사용
            const circularIndex = seedIndex % seedCode.length;
            const char = seedCode[circularIndex];
            const charValue = window.alphabetToNumber[char] || 0;
            const playerIndex = charValue % totalPlayers;
            
            if (!fakers.includes(playerIndex)) {
                fakers.push(playerIndex);
            }
            
            seedIndex++;
            
            // 무한 루프 방지
            if (seedIndex > seedCode.length * 3) {
                break;
            }
        }
        
        return fakers.sort((a, b) => a - b);
        
    } catch (error) {
        console.error('라이어 선정 중 오류:', error);
        return [];
    }
};

/**
 * 현재 게임의 질문 번호들 가져오기
 * @param {string} inviteCode - 초대코드
 * @param {number} gameNumber - 게임 번호 (1-4)
 * @returns {Array} 해당 게임의 4라운드 질문 번호들
 */
window.getCurrentGameQuestions = function(inviteCode, gameNumber = 1) {
    const allQuestions = window.getQuestionsFromCode(inviteCode);
    if (!allQuestions || gameNumber < 1 || gameNumber > 4) {
        return [11, 21, 31, 41]; // 기본값
    }
    
    return allQuestions[gameNumber - 1];
};

/**
 * 특정 라운드의 질문 번호 가져오기
 * @param {string} inviteCode - 초대코드
 * @param {number} gameNumber - 게임 번호 (1-4)
 * @param {number} roundNumber - 라운드 번호 (1-4)
 * @returns {number} 해당 라운드의 질문 번호
 */
window.getQuestionForRound = function(inviteCode, gameNumber, roundNumber) {
    const gameQuestions = window.getCurrentGameQuestions(inviteCode, gameNumber);
    if (roundNumber < 1 || roundNumber > 4) {
        return gameQuestions[0];
    }
    
    return gameQuestions[roundNumber - 1];
};

/**
 * 플레이어가 특정 라운드에서 라이어인지 확인
 * @param {string} inviteCode - 초대코드
 * @param {number} gameNumber - 게임 번호
 * @param {number} roundNumber - 라운드 번호
 * @param {number} playerIndex - 플레이어 인덱스 (0=호스트)
 * @param {number} totalPlayers - 총 플레이어 수
 * @param {number} fakerCount - 라이어 수
 * @returns {boolean} 라이어 여부
 */
window.isPlayerFakerInRound = function(inviteCode, gameNumber, roundNumber, playerIndex, totalPlayers, fakerCount) {
    const fakers = window.getFakersForRound(inviteCode, gameNumber, roundNumber, totalPlayers, fakerCount);
    return fakers.includes(playerIndex);
};

/**
 * 문제 번호에서 문제 유형과 번호 분리
 * @param {number} questionNumber - 문제 번호 (예: 23)
 * @returns {Object} {type: 문제유형, number: 문제번호}
 */
window.parseQuestionNumber = function(questionNumber) {
    const str = questionNumber.toString();
    if (str.length !== 2) {
        return { type: 1, number: 1 };
    }
    
    const type = parseInt(str[0]);
    const number = parseInt(str[1]);
    
    const typeNames = {
        1: '입력형',
        2: '그림형', 
        3: '선택형',
        4: '이모티콘형'
    };
    
    return {
        type: type,
        number: number,
        typeName: typeNames[type] || '알수없음'
    };
};

/**
 * 랜덤 시드코드 생성 (20자리)
 * @returns {string} 20자리 랜덤 알파벳
 */
window.generateRandomSeed = function() {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    let seed = '';
    for (let i = 0; i < 20; i++) {
        seed += alphabet[Math.floor(Math.random() * 26)];
    }
    return seed;
};

/**
 * 모든 시드코드 재생성 (개발용)
 */
window.generateAllSeeds = function() {
    for (let setIndex = 0; setIndex < 4; setIndex++) {
        for (let rowIndex = 0; rowIndex < 6; rowIndex++) {
            window.gameSeeds[setIndex][rowIndex] = window.generateRandomSeed();
        }
    }
    console.log('모든 시드코드가 재생성되었습니다:', window.gameSeeds);
};

/**
 * 시스템 로드 확인
 * @returns {boolean} 로드 여부
 */
window.isGameDataLoaded = function() {
    return window.gameCodeSets && 
           window.gameQuestionSets && 
           window.gameSeeds && 
           window.gameCodeSets.length === 4 &&
           window.gameQuestionSets.length === 4 &&
           window.gameSeeds.length === 4;
};

/**
 * 게임 데이터 검증
 * @param {string} inviteCode - 초대코드
 * @returns {Object} 검증 결과
 */
window.validateGameData = function(inviteCode) {
    const result = {
        valid: true,
        errors: [],
        warnings: [],
        data: {}
    };
    
    try {
        // 초대코드 검증
        if (!inviteCode || inviteCode.length !== 4) {
            result.valid = false;
            result.errors.push('초대코드는 4자리여야 합니다.');
            return result;
        }
        
        // 각 게임별 데이터 검증
        const questions = window.getQuestionsFromCode(inviteCode);
        if (!questions) {
            result.valid = false;
            result.errors.push('질문 데이터를 가져올 수 없습니다.');
            return result;
        }
        
        result.data.questions = questions;
        
        // 라이어 시드 검증
        for (let gameIndex = 0; gameIndex < 4; gameIndex++) {
            const testFakers = window.getFakersForRound(inviteCode, gameIndex + 1, 1, 6, 2);
            if (testFakers.length === 0) {
                result.warnings.push(`게임 ${gameIndex + 1}에서 라이어 선정에 문제가 있을 수 있습니다.`);
            }
        }
        
    } catch (error) {
        result.valid = false;
        result.errors.push('데이터 검증 중 오류: ' + error.message);
    }
    
    return result;
};

// 시스템 초기화
console.log('개선된 게임 데이터 시스템이 로드되었습니다.');
console.log('- 문제 유형: 1(입력형), 2(그림형), 3(선택형), 4(이모티콘형)');
console.log('- 각 유형별 5개 문제 (총 20개)');
console.log('- 최대 라이어 수: 15명');
console.log('- 시드코드: 20자리 랜덤 알파벳');
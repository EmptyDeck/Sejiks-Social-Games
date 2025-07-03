/**
 * gameData.js
 * 
 * 
 * 개선된 페이커 게임 데이터 시스템
 * 단일 초대코드 시스템 - 모든 플레이어가 같은 코드 사용
 * 코드에 플레이어 수, 라이어 수, 게임별 행 인덱스 정보 포함
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

// 사용할 알파벳: i, l 제외한 24개
window.ALPHABETS = 'abcdefghjkmnopqrstuvwxyz'.split('');
window.BASE = 24;

// 1. 게임 코드 정보 - 사용하지 않음 (새 시스템에서는 불필요)
// 대신 게임별 시드 정보만 사용

// 2. 게임 문제 정보 - 6x4 배열 (6행 x 4라운드)
window.gameQuestionSets = [
    // 게임 1
    [
        [10, 20, 30, 40],
        [11, 21, 31, 41],
        [12, 22, 32, 42],
        [13, 23, 33, 43],
        [14, 24, 34, 44],
        [15, 25, 35, 45]
    ],
    // 게임 2 (한 칸씩 로테이션)
    [
        [16, 26, 36, 46],
        [17, 27, 37, 47],
        [18, 28, 38, 48],
        [19, 29, 39, 49],
        [10, 20, 30, 40],
        [11, 21, 31, 41]
    ],
    // 게임 3 (더 로테이션)
    [
        [12, 22, 32, 42],
        [13, 23, 33, 43],
        [14, 24, 34, 44],
        [15, 25, 35, 45],
        [16, 26, 36, 46],
        [17, 27, 37, 47]
    ],
    // 게임 4
    [
        [18, 28, 38, 48],
        [19, 29, 39, 49],
        [10, 20, 30, 40],
        [11, 21, 31, 41],
        [12, 22, 32, 42],
        [13, 23, 33, 43]
    ]
];


// 3. 게임 라이어 시드 정보 - 각 행마다 20자리 랜덤 알파벳
window.gameSeeds = [
    // 게임 1
    [
        'kjhgfdsaklmnbvcxzqwh', // 1행
        'mnbvcxzasdfghjklpoiu', // 2행
        'qwertyuiopasdfghjklz', // 3행
        'zxcvbnmasdfghjklqwer', // 4행
        'poiuytrewqlkjhgfdsam', // 5행
        'lkjhgfdsamnbvcxzqwer'  // 6행
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
 * 숫자를 인덱스로 변환
 * @param {number} totalPlayers - 총 플레이어 수 (1-17)
 * @param {number} fakerCount - 라이어 수 (1-15)
 * @param {number} row1 - 게임1 행 (1-6)
 * @param {number} row2 - 게임2 행 (1-6)
 * @param {number} row3 - 게임3 행 (1-6)
 * @param {number} row4 - 게임4 행 (1-6)
 * @returns {number} 인덱스
 */
window.numberToIndex = function(totalPlayers, fakerCount, row1, row2, row3, row4) {
    const idx = (((totalPlayers - 1) * 15 + (fakerCount - 1)) * 1296 +
                ((row1 - 1) * 216 + (row2 - 1) * 36 + (row3 - 1) * 6 + (row4 - 1)));
    return idx;
};

/**
 * 인덱스를 숫자로 변환
 * @param {number} idx - 인덱스
 * @returns {Object} {totalPlayers, fakerCount, rows: [row1, row2, row3, row4]}
 */
window.indexToNumber = function(idx) {
    const totalPlayers = Math.floor(idx / (15 * 1296)) + 1;
    let rem = idx % (15 * 1296);
    const fakerCount = Math.floor(rem / 1296) + 1;
    rem = rem % 1296;
    const row1 = Math.floor(rem / 216) + 1;
    rem %= 216;
    const row2 = Math.floor(rem / 36) + 1;
    rem %= 36;
    const row3 = Math.floor(rem / 6) + 1;
    const row4 = (rem % 6) + 1;
    
    return {
        totalPlayers,
        fakerCount,
        rows: [row1, row2, row3, row4]
    };
};

/**
 * 인덱스를 코드로 변환
 * @param {number} idx - 인덱스
 * @returns {string} 4자리 코드
 */
window.indexToCode = function(idx) {
    const chars = [];
    for (let i = 0; i < 4; i++) {
        chars.push(window.ALPHABETS[idx % window.BASE]);
        idx = Math.floor(idx / window.BASE);
    }
    return chars.reverse().join('').toUpperCase();
};

/**
 * 코드를 인덱스로 변환
 * @param {string} code - 4자리 코드
 * @returns {number} 인덱스
 */
window.codeToIndex = function(code) {
    code = code.toLowerCase();
    let idx = 0;
    for (const c of code) {
        idx = idx * window.BASE + window.ALPHABETS.indexOf(c);
    }
    return idx;
};

/**
 * 코드를 숫자 정보로 변환
 * @param {string} code - 4자리 코드
 * @returns {Object} {totalPlayers, fakerCount, rows}
 */
window.codeToNumber = function(code) {
    return window.indexToNumber(window.codeToIndex(code));
};

/**
 * 숫자 정보를 코드로 변환
 * @param {number} totalPlayers - 총 플레이어 수
 * @param {number} fakerCount - 라이어 수
 * @param {Array} rows - 게임별 행 인덱스 [row1, row2, row3, row4]
 * @returns {string} 4자리 코드
 */
window.numberToCode = function(totalPlayers, fakerCount, rows) {
    const idx = window.numberToIndex(totalPlayers, fakerCount, rows[0], rows[1], rows[2], rows[3]);
    return window.indexToCode(idx);
};

/**
 * 초대코드에서 게임 정보 추출
 * @param {string} inviteCode - 4자리 초대코드
 * @returns {Object} {totalPlayers, fakerCount, rows, questions}
 */
window.getGameInfoFromCode = function(inviteCode) {
    if (!inviteCode || inviteCode.length !== 4) {
        console.error('잘못된 초대코드 형식:', inviteCode);
        return null;
    }
    
    try {
        const info = window.codeToNumber(inviteCode);
        
        // 각 게임의 질문 번호들 추출
        const questions = [];
        for (let gameIndex = 0; gameIndex < 4; gameIndex++) {
            const rowIndex = info.rows[gameIndex] - 1; // 0-based로 변환
            questions.push(window.gameQuestionSets[gameIndex][rowIndex]);
        }
        
        return {
            ...info,
            questions
        };
    } catch (error) {
        console.error('초대코드 해석 중 오류:', error);
        return null;
    }
};

/**
 * 라이어 선정 함수
 * @param {string} inviteCode - 4자리 초대코드
 * @param {number} gameNumber - 게임 번호 (1-4)
 * @returns {Array} 라이어 플레이어 인덱스 배열
 */
window.getFakersForGame = function(inviteCode, gameNumber) {
    const gameInfo = window.getGameInfoFromCode(inviteCode);
    if (!gameInfo) return [];
    
    const { totalPlayers, fakerCount, rows } = gameInfo;
    const gameIndex = gameNumber - 1;
    const rowIndex = rows[gameIndex] - 1; // 0-based
    
    // 해당 게임의 시드 가져오기
    const seedCode = window.gameSeeds[gameIndex][rowIndex];
    
    const fakers = [];
    let seedIndex = 0;
    
    console.log(`게임 ${gameNumber} 라이어 선정:`, {
        총인원: totalPlayers,
        라이어수: fakerCount,
        행번호: rows[gameIndex],
        시드: seedCode
    });
    
    while (fakers.length < fakerCount && seedIndex < seedCode.length) {
        const char = seedCode[seedIndex];
        const charValue = window.alphabetToNumber[char] || 0;
        const playerIndex = charValue % totalPlayers;
        
        if (!fakers.includes(playerIndex)) {
            fakers.push(playerIndex);
            console.log(`${char}(${charValue}) % ${totalPlayers} = ${playerIndex}`);
        }
        
        seedIndex++;
    }
    
    // 라이어 수가 부족하면 시드를 순환하여 추가
    while (fakers.length < fakerCount) {
        const circularIndex = seedIndex % seedCode.length;
        const char = seedCode[circularIndex];
        const charValue = window.alphabetToNumber[char] || 0;
        const playerIndex = charValue % totalPlayers;
        
        if (!fakers.includes(playerIndex)) {
            fakers.push(playerIndex);
        }
        
        seedIndex++;
        
        // 무한 루프 방지
        if (seedIndex > seedCode.length * 3) break;
    }
    
    return fakers.sort((a, b) => a - b);
};

/**
 * 특정 플레이어가 라이어인지 확인
 * @param {string} inviteCode - 초대코드
 * @param {number} gameNumber - 게임 번호
 * @param {number} playerIndex - 플레이어 인덱스
 * @returns {boolean} 라이어 여부
 */
window.isPlayerFaker = function(inviteCode, gameNumber, playerIndex) {
    const fakers = window.getFakersForGame(inviteCode, gameNumber);
    return fakers.includes(playerIndex);
};

/**
 * 현재 게임의 질문 번호들 가져오기
 * @param {string} inviteCode - 초대코드
 * @param {number} gameNumber - 게임 번호 (1-4)
 * @returns {Array} 해당 게임의 4라운드 질문 번호들
 */
window.getCurrentGameQuestions = function(inviteCode, gameNumber = 1) {
    const gameInfo = window.getGameInfoFromCode(inviteCode);
    if (!gameInfo || gameNumber < 1 || gameNumber > 4) {
        return [11, 21, 31, 41]; // 기본값
    }
    
    return gameInfo.questions[gameNumber - 1];
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
 * 문제 번호에서 문제 유형과 번호 분리
 * @param {number} questionNumber - 문제 번호 (예: 23)
 * @returns {Object} {type: 문제유형, number: 문제번호, typeName: 유형명}
 */
window.parseQuestionNumber = function(questionNumber) {
    const str = questionNumber.toString();
    if (str.length !== 2) {
        return { type: 1, number: 1, typeName: '입력형' };
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
 * 초대코드 생성 함수
 * @param {number} totalPlayers - 총 플레이어 수 (1-17)
 * @param {number} fakerCount - 라이어 수 (1-15)
 * @returns {string} 생성된 초대코드
 */
window.generateInviteCode = function(totalPlayers, fakerCount) {
    // 입력값 검증
    if (totalPlayers < 1 || totalPlayers > 17) {
        console.error('플레이어 수는 1-17명이어야 합니다.');
        return null;
    }
    
    if (fakerCount < 1 || fakerCount > 15) {
        console.error('라이어 수는 1-15명이어야 합니다.');
        return null;
    }
    
    if (fakerCount >= totalPlayers) {
        console.error('라이어 수는 전체 플레이어 수보다 적어야 합니다.');
        return null;
    }
    
    // 각 게임별 행 인덱스 랜덤 생성 (1-6)
    const rows = [
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1
    ];
    
    // 코드 생성
    const code = window.numberToCode(totalPlayers, fakerCount, rows);
    
    console.log('초대코드 생성:', {
        totalPlayers,
        fakerCount,
        rows,
        code
    });
    
    return code;
};

/**
 * 시스템 로드 확인
 * @returns {boolean} 로드 여부
 */
window.isGameDataLoaded = function() {
    return window.gameQuestionSets && 
           window.gameSeeds && 
           window.alphabetToNumber &&
           window.ALPHABETS &&
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
        
        // 코드 해석
        const gameInfo = window.getGameInfoFromCode(inviteCode);
        if (!gameInfo) {
            result.valid = false;
            result.errors.push('초대코드를 해석할 수 없습니다.');
            return result;
        }
        
        result.data = gameInfo;
        
        // 값 범위 검증
        if (gameInfo.totalPlayers < 1 || gameInfo.totalPlayers > 17) {
            result.errors.push('플레이어 수가 범위를 벗어났습니다.');
            result.valid = false;
        }
        
        if (gameInfo.fakerCount < 1 || gameInfo.fakerCount > 15) {
            result.errors.push('라이어 수가 범위를 벗어났습니다.');
            result.valid = false;
        }
        
        if (gameInfo.fakerCount >= gameInfo.totalPlayers) {
            result.errors.push('라이어 수가 전체 플레이어 수 이상입니다.');
            result.valid = false;
        }
        
        // 라이어 선정 테스트
        for (let gameIndex = 1; gameIndex <= 4; gameIndex++) {
            const fakers = window.getFakersForGame(inviteCode, gameIndex);
            if (fakers.length !== gameInfo.fakerCount) {
                result.warnings.push(`게임 ${gameIndex}의 라이어 수가 일치하지 않습니다.`);
            }
        }
        
    } catch (error) {
        result.valid = false;
        result.errors.push('데이터 검증 중 오류: ' + error.message);
    }
    
    return result;
};

// 시스템 초기화
console.log('새로운 단일 초대코드 시스템이 로드되었습니다.');
console.log('- 코드 체계: 4자리 알파벳 (i, l 제외)');
console.log('- 포함 정보: 플레이어 수(1-17), 라이어 수(1-15), 게임별 행 인덱스(1-6)');
console.log('- 가능한 조합: 약 33만개');
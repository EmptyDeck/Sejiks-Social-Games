/**
 * gameData.js - Fakeit2
 *
 * Fakeit 대비 개선사항:
 * 1. Mulberry32 PRNG로 하드코딩된 gameSeeds 테이블 완전 제거
 * 2. PRNG 기반 동적 질문 선택 (고정 rotation 테이블 제거)
 * 3. 4자리 초대코드 (게임정보 전체 인코딩)
 * 4. (totalPlayers, fakerCount) 조합당 1300가지 고유 게임
 * 5. Fisher-Yates 셔플로 균등한 라이어 분배
 */

(function () {
    'use strict';

    // 알파벳 24개 (i, l 제외)
    const ALPHABET = 'abcdefghjkmnopqrstuvwxyz'.split('');
    const BASE = 24;

    // 코드 인코딩 상수
    // 24^4 = 331,776 / (17 * 15) = 1302 → SEED_RANGE = 1300 (안전 마진)
    const MAX_PLAYERS = 17;
    const MAX_FAKER_SPAN = 15;
    const SEED_RANGE = 1300;

    /**
     * Mulberry32 PRNG - 빠르고 품질 높은 결정론적 난수 생성기
     * 동일한 seed → 항상 동일한 수열
     */
    function mulberry32(seed) {
        seed = seed >>> 0;
        return function () {
            seed = (seed + 0x6D2B79F5) >>> 0;
            let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
            t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }

    /**
     * 시드 기반 Fisher-Yates 셔플
     * 기존 alphabetToNumber 매핑의 불균등 분배 문제 해결
     */
    function seededShuffle(array, seed) {
        const rng = mulberry32(seed);
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(rng() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    // 숫자 인덱스 → 4자리 base-24 문자열
    function encodeIndex(idx) {
        const chars = [];
        let n = idx;
        for (let i = 0; i < 4; i++) {
            chars.push(ALPHABET[n % BASE]);
            n = Math.floor(n / BASE);
        }
        return chars.reverse().join('').toUpperCase();
    }

    // 4자리 base-24 문자열 → 숫자 인덱스
    function decodeStr4(str) {
        let idx = 0;
        for (let i = 0; i < 4; i++) {
            const charIdx = ALPHABET.indexOf(str[i].toLowerCase());
            if (charIdx === -1) return -1;
            idx = idx * BASE + charIdx;
        }
        return idx;
    }

    /**
     * 4자리 초대코드 생성
     * @param {number} totalPlayers - 전체 플레이어 수 (2-17)
     * @param {number} fakerCount - 라이어 수 (1 ~ totalPlayers-1)
     * @returns {string} 4자리 대문자 코드
     */
    window.generateInviteCode = function (totalPlayers, fakerCount) {
        if (totalPlayers < 2 || totalPlayers > MAX_PLAYERS) return null;
        if (fakerCount < 1 || fakerCount >= totalPlayers || fakerCount > MAX_FAKER_SPAN) return null;

        const gameSeed = Math.floor(Math.random() * SEED_RANGE);
        const idx = (totalPlayers - 1) * MAX_FAKER_SPAN * SEED_RANGE
            + (fakerCount - 1) * SEED_RANGE
            + gameSeed;

        const code = encodeIndex(idx);

        console.log('Fakeit2 초대코드 생성:', { totalPlayers, fakerCount, gameSeed, code });

        return code;
    };

    /**
     * 4자리 초대코드 디코딩
     * @param {string} code - 4자리 코드
     * @returns {Object|null} { totalPlayers, fakerCount, gameSeed }
     */
    window.decodeInviteCode = function (code) {
        if (!code) return null;
        const cleaned = code.toUpperCase().replace(/[^ABCDEFGHJKMNOPQRSTUVWXYZ]/g, '');
        if (cleaned.length !== 4) return null;

        const idx = decodeStr4(cleaned);
        if (idx < 0) return null;

        const gameSeed = idx % SEED_RANGE;
        const rem = Math.floor(idx / SEED_RANGE);
        const fakerCount = (rem % MAX_FAKER_SPAN) + 1;
        const totalPlayers = Math.floor(rem / MAX_FAKER_SPAN) + 1;

        if (totalPlayers < 2 || totalPlayers > MAX_PLAYERS) return null;
        if (fakerCount < 1 || fakerCount >= totalPlayers) return null;

        return { totalPlayers, fakerCount, gameSeed };
    };

    // 하위 호환성 별칭
    window.getGameInfoFromCode = window.decodeInviteCode;
    window.codeToNumber = window.decodeInviteCode;

    /**
     * 특정 게임의 라이어 인덱스 배열 반환
     * PRNG 시드는 코드+게임번호로 결정 → 같은 코드, 다른 게임은 다른 라이어
     */
    window.getFakersForGame = function (inviteCode, gameNumber) {
        const info = window.decodeInviteCode(inviteCode);
        if (!info) return [];

        const { totalPlayers, fakerCount, gameSeed } = info;

        // 게임별 고유 시드 (상수로 충분히 분산)
        const gamePRNGSeed = ((gameSeed * 31337 + gameNumber * 7919 + 0xDEAD) >>> 0);

        const players = Array.from({ length: totalPlayers }, (_, i) => i);
        const shuffled = seededShuffle(players, gamePRNGSeed);

        return shuffled.slice(0, fakerCount).sort((a, b) => a - b);
    };

    /** 특정 플레이어가 라이어인지 확인 */
    window.isPlayerFaker = function (inviteCode, gameNumber, playerIndex) {
        return window.getFakersForGame(inviteCode, gameNumber).includes(playerIndex);
    };

    /**
     * 특정 게임의 4라운드 질문 번호 반환 [입력형, 그림형, 선택형, 이모티콘형]
     * 라이어 선정과 다른 시드 사용 → 둘 사이 상관관계 없음
     */
    window.getQuestionsForGame = function (inviteCode, gameNumber) {
        const info = window.decodeInviteCode(inviteCode);
        if (!info) return [10, 30, 50, 70];

        const { gameSeed } = info;
        const questionSeed = ((gameSeed * 65537 + gameNumber * 31337 + 0xC0FF) >>> 0);
        const rng = mulberry32(questionSeed);

        // 유형별 20개 질문 풀
        const pools = [
            Array.from({ length: 20 }, (_, i) => 10 + i), // 입력형: 10-29
            Array.from({ length: 20 }, (_, i) => 30 + i), // 그림형: 30-49
            Array.from({ length: 20 }, (_, i) => 50 + i), // 선택형: 50-69
            Array.from({ length: 20 }, (_, i) => 70 + i), // 이모티콘형: 70-89
        ];

        return pools.map(pool => pool[Math.floor(rng() * pool.length)]);
    };

    /** 특정 라운드의 질문 번호 반환 */
    window.getQuestionForRound = function (inviteCode, gameNumber, roundNumber) {
        const questions = window.getQuestionsForGame(inviteCode, gameNumber);
        return questions[(roundNumber - 1) % 4];
    };

    /**
     * 질문 번호로 유형 파악
     * 10-29: 입력형(1), 30-49: 그림형(2), 50-69: 선택형(3), 70-89: 이모티콘형(4)
     */
    window.parseQuestionNumber = function (n) {
        if (n >= 10 && n <= 29) return { type: 1, typeName: '입력형' };
        if (n >= 30 && n <= 49) return { type: 2, typeName: '그림형' };
        if (n >= 50 && n <= 69) return { type: 3, typeName: '선택형' };
        if (n >= 70 && n <= 89) return { type: 4, typeName: '이모티콘형' };
        return { type: 1, typeName: '입력형' };
    };

    /** 코드 유효성 검증 */
    window.validateGameData = function (inviteCode) {
        const result = { valid: true, errors: [], data: {} };

        if (!inviteCode || inviteCode.length !== 4) {
            result.valid = false;
            result.errors.push('초대코드는 4자리여야 합니다.');
            return result;
        }

        const info = window.decodeInviteCode(inviteCode);
        if (!info) {
            result.valid = false;
            result.errors.push('초대코드를 해석할 수 없습니다.');
            return result;
        }

        result.data = info;

        if (info.totalPlayers < 2 || info.totalPlayers > MAX_PLAYERS) {
            result.errors.push('플레이어 수가 유효 범위(2-17)를 벗어났습니다.');
            result.valid = false;
        }
        if (info.fakerCount < 1 || info.fakerCount >= info.totalPlayers) {
            result.errors.push('라이어 수가 유효 범위를 벗어났습니다.');
            result.valid = false;
        }

        return result;
    };

    // 시스템 로드 확인 (하위 호환)
    window.isGameDataLoaded = function () { return true; };

    console.log('Fakeit2 게임 데이터 시스템 로드 완료');
    console.log('- 코드: 4자리 (PRNG 기반, 하드코딩 시드 테이블 없음)');
    console.log('- 조합당 고유 게임 수: ' + SEED_RANGE);

})();

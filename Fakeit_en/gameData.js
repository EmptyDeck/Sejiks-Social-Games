/**
 * gameData.js - Liar Hunt (English)
 *
 * 4-char base-24 invite code encodes (totalPlayers, fakerCount, gameSeed).
 * Mulberry32 PRNG + Fisher-Yates shuffle for deterministic faker assignment.
 * No timer, no hardcoded seed tables.
 */

(function () {
    'use strict';

    // 24-char alphabet (no i, l)
    const ALPHABET = 'abcdefghjkmnopqrstuvwxyz'.split('');
    const BASE = 24;

    const MAX_PLAYERS = 17;
    const MAX_FAKER_SPAN = 15;
    const SEED_RANGE = 1300;

    function mulberry32(seed) {
        seed = seed >>> 0;
        return function () {
            seed = (seed + 0x6D2B79F5) >>> 0;
            let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
            t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }

    function seededShuffle(array, seed) {
        const rng = mulberry32(seed);
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(rng() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    function encodeIndex(idx) {
        const chars = [];
        let n = idx;
        for (let i = 0; i < 4; i++) {
            chars.push(ALPHABET[n % BASE]);
            n = Math.floor(n / BASE);
        }
        return chars.reverse().join('').toUpperCase();
    }

    function decodeStr4(str) {
        let idx = 0;
        for (let i = 0; i < 4; i++) {
            const charIdx = ALPHABET.indexOf(str[i].toLowerCase());
            if (charIdx === -1) return -1;
            idx = idx * BASE + charIdx;
        }
        return idx;
    }

    window.generateInviteCode = function (totalPlayers, fakerCount) {
        if (totalPlayers < 2 || totalPlayers > MAX_PLAYERS) return null;
        if (fakerCount < 1 || fakerCount >= totalPlayers || fakerCount > MAX_FAKER_SPAN) return null;

        const gameSeed = Math.floor(Math.random() * SEED_RANGE);
        const idx = (totalPlayers - 1) * MAX_FAKER_SPAN * SEED_RANGE
            + (fakerCount - 1) * SEED_RANGE
            + gameSeed;

        return encodeIndex(idx);
    };

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

    window.getGameInfoFromCode = window.decodeInviteCode;
    window.codeToNumber = window.decodeInviteCode;

    window.getFakersForGame = function (inviteCode, gameNumber) {
        const info = window.decodeInviteCode(inviteCode);
        if (!info) return [];

        const { totalPlayers, fakerCount, gameSeed } = info;
        const gamePRNGSeed = ((gameSeed * 31337 + gameNumber * 7919 + 0xDEAD) >>> 0);
        const players = Array.from({ length: totalPlayers }, (_, i) => i);
        const shuffled = seededShuffle(players, gamePRNGSeed);
        return shuffled.slice(0, fakerCount).sort((a, b) => a - b);
    };

    window.isPlayerFaker = function (inviteCode, gameNumber, playerIndex) {
        return window.getFakersForGame(inviteCode, gameNumber).includes(playerIndex);
    };

    window.getQuestionsForGame = function (inviteCode, gameNumber) {
        const info = window.decodeInviteCode(inviteCode);
        if (!info) return [10, 30, 50, 70];

        const { gameSeed } = info;
        const questionSeed = ((gameSeed * 65537 + gameNumber * 31337 + 0xC0FF) >>> 0);
        const rng = mulberry32(questionSeed);

        const pools = [
            Array.from({ length: 20 }, (_, i) => 10 + i),
            Array.from({ length: 20 }, (_, i) => 30 + i),
            Array.from({ length: 20 }, (_, i) => 50 + i),
            Array.from({ length: 20 }, (_, i) => 70 + i),
        ];

        return pools.map(pool => pool[Math.floor(rng() * pool.length)]);
    };

    window.getQuestionForRound = function (inviteCode, gameNumber, roundNumber) {
        const questions = window.getQuestionsForGame(inviteCode, gameNumber);
        return questions[(roundNumber - 1) % 4];
    };

    window.parseQuestionNumber = function (n) {
        if (n >= 10 && n <= 29) return { type: 1, typeName: 'Text' };
        if (n >= 30 && n <= 49) return { type: 2, typeName: 'Drawing' };
        if (n >= 50 && n <= 69) return { type: 3, typeName: 'Player Pick' };
        if (n >= 70 && n <= 89) return { type: 4, typeName: 'Free Answer' };
        return { type: 1, typeName: 'Text' };
    };

    window.validateGameData = function (inviteCode) {
        const result = { valid: true, errors: [], data: {} };

        if (!inviteCode || inviteCode.length !== 4) {
            result.valid = false;
            result.errors.push('Invite code must be 4 characters.');
            return result;
        }

        const info = window.decodeInviteCode(inviteCode);
        if (!info) {
            result.valid = false;
            result.errors.push('Could not decode invite code.');
            return result;
        }

        result.data = info;

        if (info.totalPlayers < 2 || info.totalPlayers > MAX_PLAYERS) {
            result.errors.push('Player count out of valid range (2-17).');
            result.valid = false;
        }
        if (info.fakerCount < 1 || info.fakerCount >= info.totalPlayers) {
            result.errors.push('Liar count out of valid range.');
            result.valid = false;
        }

        return result;
    };

    window.isGameDataLoaded = function () { return true; };

    console.log('Liar Hunt game data loaded');
})();

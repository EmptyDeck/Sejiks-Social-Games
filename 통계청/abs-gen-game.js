// generateGameNumbers.js

/**
 * 시드 기반 난수 생성기 (Linear Congruential Generator - LCG)
 * 주어진 시드에 따라 0 (포함)과 1 (제외) 사이의 난수를 반환하는 함수를 생성합니다.
 * @param {number} seed - 난수 생성에 사용할 초기 시드.
 * @returns {function(): number} 0과 1 사이의 난수를 반환하는 함수.
 */
function createSeededRandom(seed) {
    const a = 1103515245;
    const c = 12345;
    const m = Math.pow(2, 31); // 2^31

    let currentSeed = seed % m; // 시드를 m 범위 내로 제한

    return function() {
        currentSeed = (a * currentSeed + c) % m;
        return currentSeed / m; // 0과 1 사이의 값 반환
    };
}

/**
 * 주어진 범위에서 고유한 무작위 정수 배열을 생성합니다.
 * 숫자는 정렬되지 않고 무작위로 추출된 순서 그대로 반환됩니다.
 * @param {number} min - 최소값 (포함).
 * @param {number} max - 최대값 (포함).
 * @param {number} count - 생성할 고유 숫자의 개수.
 * @param {function(): number} randomFunc - 0과 1 사이의 난수를 반환하는 함수 (createSeededRandom에서 반환된 함수).
 * @returns {number[]} 고유한 무작위 정수 배열.
 * @throws {Error} 생성할 고유 숫자의 개수가 가능한 범위보다 클 경우.
 */
function generateUniqueRandomNumbers(min, max, count, randomFunc) {
    if (count > (max - min + 1)) {
        throw new Error(`생성할 고유 숫자의 개수 (${count})가 가능한 범위 (${max - min + 1})보다 큽니다.`);
    }

    const pool = [];
    for (let i = min; i <= max; i++) {
        pool.push(i);
    }

    // Fisher-Yates 셔플을 사용하여 풀을 무작위로 섞습니다.
    // 이 셔플은 제공된 randomFunc를 사용하여 결정론적으로 수행됩니다.
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(randomFunc() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]]; // 스왑
    }

    // 셔플된 풀에서 필요한 개수만큼의 숫자를 가져옵니다. (정렬하지 않음)
    const result = pool.slice(0, count);
    return result;
}

/**
 * 4개의 알파벳 문자열을 입력받아 시드 기반으로 고유한 10개의 숫자를 생성합니다.
 * 숫자의 최대값은 500이며, 'I'와 'L' 알파벳은 사용할 수 없습니다.
 *
 * @param {string} inputAlphabets - 4개의 알파벳으로 구성된 문자열 (예: "ABCD").
 * @returns {number[]} 10개의 고유한 무작위 숫자 배열.
 * @throws {Error} 입력 유효성 검사 실패 시 (예: 길이가 4가 아니거나 'I', 'L' 포함).
 */
export function generateSeededGameNumbers(inputAlphabets) {
    const maxNumber = 100;
    const numNumbersPerGame = 10;

    // 입력값 전처리 및 유효성 검사
    const processedAlphabets = inputAlphabets.trim().toUpperCase();

    if (processedAlphabets.length !== 4) {
        throw new Error('입력은 정확히 4개의 알파벳이어야 합니다.');
    }

    if (processedAlphabets.includes('I') || processedAlphabets.includes('L')) {
        throw new Error("알파벳 'I'와 'L'은 사용할 수 없습니다.");
    }

    // 입력된 알파벳 문자열을 시드로 변환
    let seed = 0;
    for (let i = 0; i < processedAlphabets.length; i++) {
        seed += processedAlphabets.charCodeAt(i);
    }
    // 필요하다면 여기에 추가적인 base_seed를 결합할 수도 있습니다.
    // 예: seed += 'my_global_secret_seed'.charCodeAt(j) ...

    const seededRandom = createSeededRandom(seed);

    // 고유한 무작위 숫자 생성
    const generatedNumbers = generateUniqueRandomNumbers(1, maxNumber, numNumbersPerGame, seededRandom);
    
    return generatedNumbers;
}

// 이 파일은 모듈로 내보내지므로, 직접 실행되는 코드는 포함하지 않습니다.
// 사용 예시는 아래 "사용 방법" 섹션을 참조하세요.

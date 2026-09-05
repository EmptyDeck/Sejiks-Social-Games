# Fakeit2 — 핸즈오프 문서

에이전트 또는 새 개발자를 위한 Fakeit2 전체 설명서.

---

## 게임 개요

Fakeit2는 **서버 없이 작동하는 오프라인 파티 게임**이다. 3~17명이 모인 자리에서 한 명의 호스트가 초대코드를 생성하고, 나머지 플레이어들이 그 코드를 입력해 참여한다. 실제 네트워크 통신은 없고 모든 게임 상태는 `localStorage`에 저장된다.

**기본 흐름:**
1. 호스트가 인원 수 / 라이어 수를 설정하고 4자리 초대코드를 생성한다
2. 각 플레이어가 같은 기기(또는 자신의 기기)에 코드를 입력하고 플레이어 번호를 선택한다
3. 카드 뒤집기 화면에서 자신의 역할(일반 플레이어 / 라이어)을 확인한다
4. 매 라운드 질문이 표시된다 — 일반 플레이어는 진짜 질문, 라이어는 가짜 질문을 받는다
5. 모두 답변을 제출하고 `answer.html`에서 공개한다
6. 플레이어들이 라이어라고 생각하는 사람에게 투표한다
7. `gameover.html`에서 결과 및 점수를 확인한다

---

## 파일 구조

```
Fakeit2/
├── index.html          메인 화면 (호스트 / 참여 선택)
├── host.html / host.js / host.css      호스트 설정 화면
├── join.html / join.js / join.css      플레이어 참여 화면
├── card-role.html / card-role.js / card-role.css   역할 카드 뒤집기
├── host-game.html / host-game.js       호스트 게임 진행 화면
├── player-game.html / player-game.js   플레이어 게임 진행 화면
├── player-game.css                     공용 CSS (host-game도 사용)
├── answer.html / answer.js / answer.css  답변 공개 화면
├── gameover.html / gameover.js / gameover.css  게임 종료 화면
├── gameData.js         초대코드 인코딩/디코딩 + PRNG 기반 역할/질문 선택
└── questions.js        80개 질문 데이터 (유형별 20개)
```

---

## 초대코드 시스템 (핵심)

> 이 부분이 가장 복잡하다. 서버 없이 모든 플레이어가 동일한 역할 배정과 질문을 받으려면, 코드 하나에 게임 정보 전체를 인코딩해야 한다.

### 알파벳

```
ALPHABET = 'abcdefghjkmnopqrstuvwxyz'  (24자, i·l 제외 — 헷갈림 방지)
BASE = 24
```

코드는 항상 **대문자 4자리**로 표시된다. 예: `KMPQ`

### 코드에 인코딩되는 정보

| 항목 | 범위 | 설명 |
|------|------|------|
| `totalPlayers` | 2 ~ 17 | 전체 플레이어 수 (호스트 포함) |
| `fakerCount` | 1 ~ 15 | 라이어 수 (최대 totalPlayers-1) |
| `gameSeed` | 0 ~ 1299 | 이 게임 세션의 고유 시드 |

### 인코딩 공식

```javascript
const MAX_FAKER_SPAN = 15;
const SEED_RANGE = 1300;

idx = (totalPlayers - 1) * MAX_FAKER_SPAN * SEED_RANGE
    + (fakerCount - 1) * SEED_RANGE
    + gameSeed;
```

`idx`를 24진법 4자리 문자열로 변환하면 코드가 된다.

**수용 범위 확인:**
- 최대 idx = `(17-1) * 15 * 1300 + (15-1) * 1300 + 1299 = 331,499`
- 24^4 = `331,776`
- 331,499 < 331,776 → 4자리로 정확히 수용된다 (여유: 277개)

### 디코딩 공식

```javascript
gameSeed     = idx % SEED_RANGE;            // 1300으로 나머지
fakerCount   = (Math.floor(idx / SEED_RANGE) % MAX_FAKER_SPAN) + 1;
totalPlayers = Math.floor(idx / (SEED_RANGE * MAX_FAKER_SPAN)) + 1;
```

### 구현 위치

`gameData.js`의 `window.generateInviteCode(totalPlayers, fakerCount)` 와 `window.decodeInviteCode(code)`.

---

## 역할 배정 (라이어 선정)

서버 없이도 모든 기기가 같은 라이어를 알 수 있는 것은 **결정론적 PRNG** 덕분이다.

### 알고리즘

```javascript
// 게임별 시드 (코드의 gameSeed + 게임 번호로 고유하게 결정)
const gamePRNGSeed = ((gameSeed * 31337 + gameNumber * 7919 + 0xDEAD) >>> 0);

// Fisher-Yates 셔플로 플레이어 인덱스 배열 섞기
const players = [0, 1, 2, ..., totalPlayers-1];
const shuffled = seededShuffle(players, gamePRNGSeed);

// 앞쪽 fakerCount개가 라이어
return shuffled.slice(0, fakerCount).sort();
```

### PRNG: Mulberry32

```javascript
function mulberry32(seed) {
    seed = seed >>> 0;
    return function() {
        seed = (seed + 0x6D2B79F5) >>> 0;
        // ... (빠르고 품질 높은 32-bit PRNG)
        return float_0_to_1;
    };
}
```

### 핵심 특성

- **동일 코드 + 동일 게임번호 → 항상 동일한 라이어 목록**
- **다른 게임번호 → 다른 라이어 목록** (같은 코드로 여러 게임 진행 가능)
- 라이어 시드와 질문 시드는 **다른 상수**로 생성 → 라이어 여부와 질문 선택 사이에 상관관계 없음

### 플레이어 인덱스 체계

```
0  = 호스트 (host-game.html)
1  = 플레이어1 (player-game.html)
2  = 플레이어2
...
totalPlayers-1 = 마지막 플레이어
```

각 플레이어는 **자신이 직접 자신의 번호를 선택**한다 (join.html의 휠 피커). 서버 조율 없이 가능한 이유는 번호가 겹치지만 않으면 되기 때문이다.

---

## 질문 시스템

### 질문 유형 (4가지)

| 유형 | 번호 범위 | 설명 |
|------|-----------|------|
| 입력형 (type 1) | 10 ~ 29 | 텍스트로 답변 |
| 그림형 (type 2) | 30 ~ 49 | 캔버스에 그림으로 답변 |
| 선택형 (type 3) | 50 ~ 69 | 특정 플레이어를 지목하는 형태 |
| 이모티콘형 (type 4) | 70 ~ 89 | 이모티콘으로 표현 |

현재 각 유형당 20개 = **총 80개 질문** (`questions.js`에 정의).

### 게임별 질문 선택

```javascript
// 라이어 시드와 다른 상수 사용
const questionSeed = ((gameSeed * 65537 + gameNumber * 31337 + 0xC0FF) >>> 0);
const rng = mulberry32(questionSeed);

// 각 유형 풀에서 하나씩 선택 → 4라운드 질문 배열
pools.map(pool => pool[Math.floor(rng() * pool.length)]);
// 결과: [입력형 질문번호, 그림형 질문번호, 선택형 질문번호, 이모티콘형 질문번호]
```

라운드 1 = 입력형, 라운드 2 = 그림형, 라운드 3 = 선택형, 라운드 4 = 이모티콘형 (고정 순서).

### 질문 구조 (questions.js)

```javascript
{
    number: 10,        // 고유 번호 (10-89)
    type: 1,           // 유형 (1-4)
    main: "지금 이 방에서 가장 키가 큰 사람은?",   // 일반 플레이어용
    fake: "지금 이 방에서 가장 체중이 많이 나가는 사람은?"  // 라이어용 (비슷하지만 다름)
}
```

라이어는 일반 플레이어와 비슷하지만 다른 질문을 받아, 나머지 사람들의 답변 패턴과 약간 벗어난 답변을 하게 된다.

### 질문 풀 확장 한계

**4자리 코드는 질문 수를 직접 제한하지 않는다.** 코드는 `gameSeed`(0-1299)만 인코딩하고, PRNG이 풀에서 질문을 골라낸다.

- `gameSeed` 1300가지 → 각 유형당 최대 **1300개의 다른 질문을 구분 가능**
- 현재 유형당 20개 → 확장 여지 충분
- 각 유형 풀을 200~300개로 늘려도 코드 변경 없이 자동 적용됨
- 풀이 1300개를 넘어도 작동은 하지만, 시드가 겹쳐 같은 게임이 반복될 수 있음

**실용적 권장 한계: 유형당 100~200개** (4자리 코드 기준 최적 범위)

---

## localStorage 데이터 흐름

| 키 | 설명 | 저장 위치 |
|----|------|-----------|
| `inviteCode` | 4자리 초대코드 | host.js, join.js |
| `totalPlayers` | 전체 인원 수 | host.js, join.js |
| `fakerCount` | 라이어 수 | host.js, join.js |
| `playerIndex` | 내 플레이어 번호 (0=호스트) | host.js, join.js |
| `playerName` | 닉네임 | join.js |
| `isHost` | 호스트 여부 (`'true'`/`'false'`) | host.js, join.js |
| `currentGame` | 현재 게임 번호 (1부터) | 각 게임 파일 |
| `currentRound` | 현재 라운드 번호 (1~4) | 각 게임 파일 |
| `submittedAnswer` | 제출한 답변 텍스트 | host-game.js, player-game.js |
| `submittedDrawing` | 제출한 그림 (base64) | host-game.js, player-game.js |
| `playerScores` | 점수 JSON 객체 | gameover.js |
| `votes_CODE_game_N` | 투표 데이터 배열 | 각 게임 파일 |

---

## 주요 API (gameData.js)

```javascript
// 초대코드 생성 (호스트)
window.generateInviteCode(totalPlayers, fakerCount) → '4자리 코드'

// 초대코드 디코딩
window.decodeInviteCode(code) → { totalPlayers, fakerCount, gameSeed }

// 특정 게임의 라이어 인덱스 배열
window.getFakersForGame(code, gameNumber) → [0, 2, ...]

// 특정 플레이어가 라이어인지
window.isPlayerFaker(code, gameNumber, playerIndex) → true/false

// 특정 게임의 4라운드 질문 번호 배열
window.getQuestionsForGame(code, gameNumber) → [12, 35, 51, 72]

// 특정 라운드의 질문 번호
window.getQuestionForRound(code, gameNumber, roundNumber) → 12

// 질문 번호로 유형 판별
window.parseQuestionNumber(n) → { type: 1, typeName: '입력형' }

// 코드 유효성 검증
window.validateGameData(code) → { valid: true, errors: [], data: {...} }
```

---

## 알려진 설계 결정사항

- **타이머 없음**: 의도적 제거. 답변 시간은 플레이어들이 구두로 결정한다.
- **서버 없음**: 모든 동기화는 초대코드 + PRNG으로 처리. 인터넷 불필요.
- **같은 기기 공유 가능**: 한 기기에서 여러 플레이어가 순서대로 자신의 역할을 확인할 수 있다.
- **i, l 제외 알파벳**: 손글씨나 작은 폰트에서 숫자와 혼동 방지.
- **호스트 = 인덱스 0**: 항상 고정. 플레이어는 1부터 시작.

// 전역 변수
let nextPage = '';
let totalPlayers = 4;
let fakerCount = 1;
let playerIndex = 0;
let inviteCode = '';
let roleAssignments = {}; // 미리 결정된 역할 할당
let playerRole = '';
let cardFlipped = false;

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    generateCards();
    setupEventListeners();
});

// 페이지 초기화
function initializePage() {
    // URL 파라미터에서 다음 페이지 정보 읽기
    const urlParams = new URLSearchParams(window.location.search);
    nextPage = urlParams.get('next') || 'host-game.html';
    
    // localStorage에서 게임 데이터 읽기
    loadGameData();
    
    // 역할 할당 (미리 결정)
    assignRoles();
    
    // UI 업데이트
    updateGameInfo();
    
    console.log('페이지 초기화 완료:', {
        nextPage,
        totalPlayers,
        fakerCount,
        playerIndex,
        inviteCode,
        roleAssignments
    });
}

// 게임 데이터 로드
// 게임 데이터 로드
function loadGameData() {
    try {
        totalPlayers = parseInt(localStorage.getItem('totalPlayers')) || 4;
        fakerCount = parseInt(localStorage.getItem('fakerCount')) || 1;
        playerIndex = parseInt(localStorage.getItem('playerIndex')) || 0;
        inviteCode = localStorage.getItem('inviteCode') || localStorage.getItem('hostCode') || 'ABCD';
        
        // 유효성 검사 - MODIFY THIS PART
        if (totalPlayers < 2) totalPlayers = 4;
        if (totalPlayers > 17) totalPlayers = 17; // NEW: Add max limit
        if (fakerCount < 1) fakerCount = 1;
        if (fakerCount >= totalPlayers) fakerCount = Math.max(1, totalPlayers - 1);
        
        console.log('게임 데이터 로드 완료:', {
            totalPlayers,
            fakerCount,
            playerIndex,
            inviteCode
        });
    } catch (error) {
        console.error('게임 데이터 로드 실패:', error);
        // 기본값 사용
        totalPlayers = 4;
        fakerCount = 1;
        playerIndex = 0;
        inviteCode = 'ABCD';
    }
}

// 역할 할당 (미리 결정)
function assignRoles() {
    // 초대 코드를 시드로 사용하여 일관된 역할 할당
    const seed = hashCode(inviteCode);
    const random = createSeededRandom(seed);
    
    // 모든 플레이어 인덱스 배열 생성
    const playerIndices = Array.from({length: totalPlayers}, (_, i) => i);
    
    // 라이어 인덱스 무작위 선택
    const liars = [];
    for (let i = 0; i < fakerCount; i++) {
        const randomIndex = Math.floor(random() * playerIndices.length);
        liars.push(playerIndices.splice(randomIndex, 1)[0]);
    }
    
    // 역할 할당 객체 생성
    roleAssignments = {};
    for (let i = 0; i < totalPlayers; i++) {
        roleAssignments[i] = liars.includes(i) ? 'liar' : 'normal';
    }
    
    console.log('역할 할당 완료:', roleAssignments);
}

// 문자열 해시 생성
function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // 32비트 정수로 변환
    }
    return Math.abs(hash);
}

// 시드 기반 랜덤 생성기
function createSeededRandom(seed) {
    let m = 0x80000000; // 2^31
    let a = 1103515245;
    let c = 12345;
    let state = seed;
    
    return function() {
        state = (a * state + c) % m;
        return state / (m - 1);
    };
}

// 게임 정보 UI 업데이트
function updateGameInfo() {
    document.getElementById('gameCode').textContent = `코드: ${inviteCode}`;
    document.getElementById('playerInfo').textContent = `플레이어 ${playerIndex + 1}/${totalPlayers}`;
}

// 카드 생성
function generateCards() {
    const container = document.getElementById('cardsContainer');
    container.innerHTML = '';
    
    // 카드 생성 (총 플레이어 수만큼)
    for (let i = 0; i < totalPlayers; i++) {
        const card = createCard(i);
        container.appendChild(card);
        
        // 카드 입장 애니메이션 지연
        setTimeout(() => {
            card.style.animationDelay = `${i * 0.1}s`;
        }, i * 100);
    }
}

// 개별 카드 생성
function createCard(index) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.index = index;
    
    const cardInner = document.createElement('div');
    cardInner.className = 'card-inner';
    
    // 카드 뒷면
    const cardBack = document.createElement('div');
    cardBack.className = 'card-face card-back';
    
    // 카드 앞면 (역할 정보)
    const cardFront = document.createElement('div');
    const role = roleAssignments[index];
    cardFront.className = `card-face card-front ${role}`;
    
    const emoji = document.createElement('div');
    emoji.className = 'card-emoji';
    emoji.textContent = role === 'liar' ? '🎭' : '👤';
    
    const text = document.createElement('div');
    text.className = 'card-text';
    text.textContent = role === 'liar' ? '라이어' : '일반 플레이어';
    
    cardFront.appendChild(emoji);
    cardFront.appendChild(text);
    
    cardInner.appendChild(cardBack);
    cardInner.appendChild(cardFront);
    card.appendChild(cardInner);
    
    return card;
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 카드 클릭 이벤트
    document.addEventListener('click', function(e) {
        const card = e.target.closest('.card');
        if (!card || cardFlipped || card.classList.contains('disabled')) {
            return;
        }
        
        flipCard(card);
    });
    
    // 계속하기 버튼
    document.getElementById('continueBtn').addEventListener('click', function() {
        goToNextPage();
    });
}

// 카드 뒤집기
// 카드 뒤집기
function flipCard(card) {
    if (cardFlipped) return;
    
    const cardIndex = parseInt(card.dataset.index);
    playerRole = roleAssignments[cardIndex];
    
    // 카드 뒤집기 애니메이션
    card.classList.add('flipped');
    cardFlipped = true;
    
    // 다른 카드들 비활성화
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(c => {
        if (c !== card) {
            c.classList.add('disabled');
        }
    });
    
    // NEW: After 0.3 seconds, reveal all cards
    setTimeout(() => {
        revealAllCards();
    }, 300);
    
    // NEW: After 0.5 seconds total, show result
    setTimeout(() => {
        showResult();
    }, 500);
    
    console.log('카드 뒤집기:', {
        cardIndex,
        playerRole,
        playerIndex
    });
}

// NEW: Reveal all cards function
function revealAllCards() {
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(card => {
        card.classList.add('flipped');
        card.classList.remove('disabled');
    });
}

// 결과 표시
function showResult() {
    const resultOverlay = document.getElementById('resultOverlay');
    const roleIcon = document.getElementById('roleIcon');
    const roleTitle = document.getElementById('roleTitle');
    const roleDescription = document.getElementById('roleDescription');
    
    // 역할에 따른 내용 설정
    if (playerRole === 'liar') {
        roleIcon.textContent = '🎭';
        roleTitle.textContent = '라이어';
        roleTitle.style.color = '#e74c3c';
        roleDescription.textContent = '당신은 라이어입니다! 다른 플레이어들을 속이고 정답을 알아내세요.';
    } else {
        roleIcon.textContent = '👤';
        roleTitle.textContent = '일반 플레이어';
        roleTitle.style.color = '#3498db';
        roleDescription.textContent = '당신은 일반 플레이어입니다. 라이어를 찾아내고 정답을 맞춰보세요!';
    }
    
    // 결과 오버레이 표시
    resultOverlay.classList.add('show');
}

// 다음 페이지로 이동
function goToNextPage() {
    // 역할 정보를 localStorage에 저장
    localStorage.setItem('playerRole', playerRole);
    localStorage.setItem('roleRevealed', 'true');
    
    console.log('다음 페이지 이동:', nextPage, '역할:', playerRole);
    
    // 다음 페이지로 이동
    window.location.href = nextPage;
}

// 디버깅 함수들
function debugRoles() {
    console.log('전체 역할 할당:', roleAssignments);
    console.log('현재 플레이어 역할:', playerRole);
    console.log('플레이어 인덱스:', playerIndex);
}

function debugGameData() {
    console.log('게임 데이터:', {
        totalPlayers,
        fakerCount,
        playerIndex,
        inviteCode,
        nextPage
    });
}

// 에러 처리
window.addEventListener('error', function(e) {
    console.error('JavaScript 에러:', e);
});

// 테스트용 전역 함수
window.debugRoles = debugRoles;
window.debugGameData = debugGameData;
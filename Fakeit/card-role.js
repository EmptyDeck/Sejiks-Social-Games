//card-role.js
// 전역 변수
let nextPage = '';
let totalPlayers = 4;
let fakerCount = 1;
let playerIndex = 0;
let inviteCode = '';
let roleAssignments = {}; // 미리 결정된 역할 할당
let playerRole = '';
let cardFlipped = false;
let selectedCardIndex = -1;

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    generateCards();
    setupEventListeners();
});

// 페이지 초기화
function initializePage() {
    const urlParams = new URLSearchParams(window.location.search);
    nextPage = urlParams.get('next') || 'host-game.html';
    
    loadGameData();
    
    // 플레이어 역할만 미리 결정 (카드 역할은 나중에)
    determinePlayerRole();
    
    updateGameInfo();
    
    console.log('페이지 초기화 완료:', {
        nextPage,
        totalPlayers,
        fakerCount,
        playerIndex,
        inviteCode,
        playerRole // 이것만 미리 결정됨
    });
}

function determinePlayerRole() {
    const gameNumber = 1;
    const liars = window.getFakersForGame(inviteCode, gameNumber);
    
    // 현재 플레이어가 라이어인지 확인
    playerRole = liars.includes(playerIndex) ? 'liar' : 'normal';
    
    console.log('플레이어 역할 결정:', {
        inviteCode,
        gameNumber,
        playerIndex,
        liars,
        playerRole
    });
}



// 게임 데이터 로드
function loadGameData() {
    try {
        // 기존 코드와 동일하게 localStorage에서 로드
        totalPlayers = parseInt(localStorage.getItem('totalPlayers')) || 4;
        fakerCount = parseInt(localStorage.getItem('fakerCount')) || 1;
        playerIndex = parseInt(localStorage.getItem('playerIndex')) || 0;
        inviteCode = localStorage.getItem('inviteCode') || localStorage.getItem('hostCode') || 'ABCD';
        
        // 유효성 검사
        if (totalPlayers < 2) totalPlayers = 4;
        if (totalPlayers > 17) totalPlayers = 17;
        if (fakerCount < 1) fakerCount = 1;
        if (fakerCount >= totalPlayers) fakerCount = Math.max(1, totalPlayers - 1);
        
        // gameData.js가 로드되었는지 확인
        if (!window.isGameDataLoaded || !window.isGameDataLoaded()) {
            console.error('gameData.js가 로드되지 않았습니다.');
            throw new Error('GameData system not loaded');
        }
        
        // 초대코드 검증
        const validation = window.validateGameData(inviteCode);
        if (!validation.valid) {
            console.error('초대코드 검증 실패:', validation.errors);
            throw new Error('Invalid invite code');
        }
        
        console.log('게임 데이터 로드 완료:', {
            totalPlayers,
            fakerCount,
            playerIndex,
            inviteCode,
            validation: validation.data
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
    // gameData.js의 getFakersForGame 함수를 사용하여 라이어 선정
    // 현재 게임 번호는 1로 고정 (카드 역할 확인 단계에서는 게임1 기준)
    const gameNumber = 1;
    const liars = window.getFakersForGame(inviteCode, gameNumber);
    
    // 역할 할당 객체 생성
    roleAssignments = {};
    for (let i = 0; i < totalPlayers; i++) {
        roleAssignments[i] = liars.includes(i) ? 'liar' : 'normal';
    }
    
    console.log('역할 할당 완료 (gameData.js 기반):', {
        inviteCode,
        gameNumber,
        liars,
        roleAssignments
    });
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
    
    for (let i = 0; i < totalPlayers; i++) {
        const card = createCard(i);
        container.appendChild(card);
        
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
    
    // 카드 앞면은 나중에 동적으로 생성
    const cardFront = document.createElement('div');
    cardFront.className = 'card-face card-front';
    
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
function flipCard(card) {
    if (cardFlipped) return;
    
    selectedCardIndex = parseInt(card.dataset.index);
    cardFlipped = true;
    
    // 1. 선택된 카드에 플레이어 역할 할당
    assignRoleToCard(card, playerRole);
    
    // 2. 다른 카드들 비활성화
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(c => {
        if (c !== card) {
            c.classList.add('disabled');
        }
    });
    
    // 3. 0.3초 후 모든 카드 공개
    setTimeout(() => {
        revealAllCards();
    }, 300);
    
    // 4. 0.5초 후 결과 표시
    setTimeout(() => {
        showResult();
    }, 500);
    
    console.log('카드 선택:', {
        selectedCardIndex,
        playerRole
    });
}

// 카드에 역할 할당
function assignRoleToCard(card, role) {
    const cardFront = card.querySelector('.card-front');
    cardFront.className = `card-face card-front ${role}`;
    
    const emoji = document.createElement('div');
    emoji.className = 'card-emoji';
    emoji.textContent = role === 'liar' ? '🎭' : '👤';
    
    const text = document.createElement('div');
    text.className = 'card-text';
    text.textContent = role === 'liar' ? '라이어' : '일반 플레이어';
    
    cardFront.appendChild(emoji);
    cardFront.appendChild(text);
    
    card.classList.add('flipped');
}



// NEW: Reveal all cards function
function revealAllCards() {
    const allCards = document.querySelectorAll('.card');
    const remainingRoles = generateRemainingRoles();
    
    allCards.forEach((card, index) => {
        if (index !== selectedCardIndex) {
            // 랜덤 역할 할당
            const randomRole = remainingRoles.pop();
            assignRoleToCard(card, randomRole);
        }
        card.classList.remove('disabled');
    });
}

function generateRemainingRoles() {
    const roles = [];
    const normalCount = totalPlayers - fakerCount;
    const liarCount = fakerCount;
    
    // 플레이어가 선택한 역할을 제외하고 나머지 역할 생성
    if (playerRole === 'liar') {
        // 플레이어가 라이어면, 나머지는 일반 플레이어들과 남은 라이어들
        for (let i = 0; i < normalCount; i++) {
            roles.push('normal');
        }
        for (let i = 0; i < liarCount - 1; i++) {
            roles.push('liar');
        }
    } else {
        // 플레이어가 일반이면, 나머지는 라이어들과 남은 일반 플레이어들
        for (let i = 0; i < normalCount - 1; i++) {
            roles.push('normal');
        }
        for (let i = 0; i < liarCount; i++) {
            roles.push('liar');
        }
    }
    
    // 배열 셔플
    for (let i = roles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [roles[i], roles[j]] = [roles[j], roles[i]];
    }
    
    return roles;
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
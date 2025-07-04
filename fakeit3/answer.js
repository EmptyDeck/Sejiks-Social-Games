// answer.js - 답변 공개 및 투표 페이지

let playerIndex = 0;
let currentRound = 1;
let currentGame = 1;
let inviteCode = '';
let answerType = 'text';
let submittedAnswer = '';
let submittedDrawing = '';
let fromPage = '';
let votes = {}; // 투표 결과 저장
let gameData = null;
let totalPlayers = 4; // 호스트 + 플레이어들
let voteData = []; // 투표 데이터 배열

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('answer 페이지 로드');
    loadGameData();
    initializeRoundVotes(); // 추가
    initializePage();
    setupEventListeners();
});
// 게임 데이터 로드
function loadGameData() {
    console.log('데이터 로드 시작');
    inviteCode = localStorage.getItem('inviteCode') || '';
    playerIndex = parseInt(localStorage.getItem('playerIndex')) || 0;
    currentRound = parseInt(localStorage.getItem('currentRound')) || 1;
    currentGame = parseInt(localStorage.getItem('currentGame')) || 1;
    answerType = localStorage.getItem('answerType') || 'text';
    submittedAnswer = localStorage.getItem('submittedAnswer') || '';
    submittedDrawing = localStorage.getItem('submittedDrawing') || '';

    const urlParams = new URLSearchParams(window.location.search);
    fromPage = urlParams.get('from') || 'host';
    console.log(`fromPage 값: ${fromPage}`);

    const playerCount = parseInt(localStorage.getItem('playerCount')) || 3;
    totalPlayers = playerCount + 1;

    // 투표 데이터 로드
    const savedVotes = localStorage.getItem(`votes_${inviteCode}_game_${currentGame}`);
    if (savedVotes) {
        voteData = JSON.parse(savedVotes);
    } else {
        voteData = Array.from({ length: totalPlayers }, (_, i) => [i, -1, -1, -1, -1]);
    }
    console.log('✅ 투표 데이터 로드:', voteData);
}


// 페이지 초기화
function initializePage() {
    console.log('페이지 초기화');
    // 게임 정보 표시
    document.getElementById('gameInfo').textContent = `게임 ${currentGame} - 라운드 ${currentRound}`;
    
    // 역할 표시
    const roleText = fromPage === 'host' ? '호스트' : `플레이어 ${playerIndex}`;
    document.getElementById('playerRole').textContent = roleText;
    
    // 답변 카드 초기화
    setupAnswerCard();
    
    // 투표 버튼 생성
    createVoteButtons();
    
    console.log('초기화 완료');
}

// 답변 카드 설정
function setupAnswerCard() {
    console.log(`답변 카드 설정: ${answerType}`);
    const answerContent = document.getElementById('answerContent');
    const tapIndicator = document.querySelector('.tap-indicator');

    // 초기 상태: 답변 숨김, TAP 인디케이터 표시
    answerContent.classList.remove('show');
    tapIndicator.style.display = 'block';

    if (answerType === 'drawing') {
        answerContent.innerHTML = '<canvas id="answerCanvas" width="300" height="200"></canvas>';
        const canvas = document.getElementById('answerCanvas');
        const ctx = canvas.getContext('2d');

        if (submittedDrawing) {
            const img = new Image();
            img.onload = function () {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                console.log('그림 로드 완료');
            };
            img.src = submittedDrawing;
        } else {
            answerContent.innerHTML = '<div class="answer-text">그림이 없습니다</div>';
        }
    } else {
        const answerTextElement = document.querySelector('#answerContent .answer-text');
        if (answerTextElement) {
            if (submittedAnswer) {
                answerTextElement.textContent = submittedAnswer;
                console.log('텍스트 답변 설정:', submittedAnswer);
            } else {
                answerTextElement.textContent = '답변이 없습니다';
                console.log('텍스트 답변 없음');
            }
        }
    }
}
// 투표 버튼 생성
function createVoteButtons() {
    console.log(`투표 버튼 생성: 총 ${totalPlayers}명`);
    const voteSection = document.getElementById('voteSection');
    voteSection.innerHTML = '';
    
    // 호스트 버튼
    createVoteButton('host', '호스트');
    
    // 플레이어 버튼들 (플레이어1부터)
    for (let i = 1; i < totalPlayers; i++) {
        createVoteButton(`player${i}`, `플레이어 ${i}`);
    }
    
    console.log('투표 버튼 생성 완료');
}

// 개별 투표 버튼 생성
function createVoteButton(targetId, targetName) {
    const voteSection = document.getElementById('voteSection');
    const button = document.createElement('button');
    button.className = 'vote-btn';
    button.textContent = targetName;
    button.onclick = () => toggleVote(targetId);
    button.id = `vote-${targetId}`;
    voteSection.appendChild(button);
}

// 투표 토글
function toggleVote(targetId) {
    console.log(`투표 토글: ${targetId}`);
    const button = document.getElementById(`vote-${targetId}`);
    const targetIndex = targetId === 'host' ? 0 : parseInt(targetId.replace('player', ''));

    if (voteData[targetIndex][currentRound] === 1) {
        voteData[targetIndex][currentRound] = 0; // 투표 취소
        button.classList.remove('voted');
        console.log(`투표 취소: ${targetId}`);
    } else {
        voteData[targetIndex][currentRound] = 1; // 투표 추가
        button.classList.add('voted');
        console.log(`투표 추가: ${targetId}`);
    }
    updateVoteDisplay();
    saveVotes();
}

// 투표 표시 업데이트
function updateVoteDisplay() {
    const voteCount = voteData.reduce((count, row) => count + (row[currentRound] === 1 ? 1 : 0), 0);
    document.getElementById('voteCount').textContent = `투표: ${voteCount}명`;
    console.log(`투표 수: ${voteCount}`);
}

// 답변 카드 토글
function toggleAnswerCard() {
    const answerContent = document.getElementById('answerContent');
    const cardTitle = document.getElementById('cardTitle');
    const tapIndicator = document.querySelector('.tap-indicator');
    
    answerContent.classList.toggle('show'); // ✅ .show 클래스로 제어
    if (answerContent.classList.contains('show')) {
        cardTitle.textContent = '답변 숨기기';
        tapIndicator.style.display = 'none';
    } else {
        cardTitle.textContent = '터치하여 답변 공개';
        tapIndicator.style.display = 'block';
    }
}

// 모달 열기
function openModal(modalId) {
    console.log(`모달 열기: ${modalId}`);
    document.getElementById(modalId).classList.add('show');
}
// 모달 닫기
function closeModal(modalId) {
    console.log(`모달 닫기: ${modalId}`);
    document.getElementById(modalId).classList.remove('show');
}
// 라이어 포기
function giveUpAsLiar() {
    console.log('라이어 포기 요청');
    openModal('giveUpModal');
}

function confirmGiveUp() {
    console.log('라이어 포기 확정');
    closeModal('giveUpModal');
    saveVotes();
    localStorage.setItem('gameResult', 'liar_give_up');
    window.location.href = 'gameover.html';
}

// 게임 종료
function endGame() {
    console.log('게임 종료 요청');
    openModal('endGameModal');
}

function confirmEndGame() {
    closeModal('endGameModal');
    saveVotes();
    localStorage.setItem('gameResult', 'normal_end');
    window.location.href = 'gameover.html';
}

// 다음 라운드
function nextRound() {
    console.log('다음 라운드 요청');
    
    if (currentRound === 4) {
    // 다음 게임 버튼 강조 효과 추가
    const nextGameBtn = document.getElementById('nextGameBtn');
    nextGameBtn.classList.add('highlight-button');
    return; // 라운드 증가만 하고 리턴
    }
    else{
    openModal('nextRoundModal');
    }

}

function confirmNextRound() {
    console.log('다음 라운드 확정');
    closeModal('nextRoundModal');
    saveVotes();
    
    // 플레이어 답변 데이터 초기화
    clearPlayerAnswerData();
    
    currentRound++;
    localStorage.setItem('currentRound', currentRound.toString());
    goBack();
}

// 다음 게임
function nextGame() {
    console.log('다음 게임 요청');
    
    if (currentGame === 4) {
        // 게임 종료 버튼 강조 효과 추가
        const endGameBtn = document.getElementById('endGameBtn');
        endGameBtn.classList.add('highlight-button');
        return; // 게임 증가만 하고 리턴
    }
    else{
        openModal('nextGameModal');
    }
}

function confirmNextGame() {
    console.log('다음 게임 확정');
    closeModal('nextGameModal');
    saveVotes();

    // 플레이어 답변 데이터 초기화
    clearPlayerAnswerData();

    // 게임 업데이트
    currentGame++;
    currentRound = 1;
    localStorage.setItem('currentGame', currentGame.toString());
    localStorage.setItem('currentRound', '1');
    localStorage.setItem('votes', JSON.stringify(votes));
    
    // 원래 페이지로 돌아가기
    goBack();
}

// 플레이어 답변 데이터 초기화 함수
function clearPlayerAnswerData() {
    console.log('플레이어 답변 데이터 초기화');
    localStorage.removeItem('playerAnswer');
    localStorage.removeItem('playerDrawing');
    localStorage.removeItem('answerSubmitted');
    console.log('✅ 플레이어 답변 데이터 초기화 완료');
}

// 원래 페이지로 돌아가기
function goBack() {
    console.log(`돌아가기: ${fromPage}`);
    saveVotes();
    if (fromPage === 'host' || fromPage === 'player0') {
        window.location.href = 'host-game.html';
    } else {
        window.location.href = 'player-game.html';
    }
}


// 이벤트 리스너 설정
function setupEventListeners() {
    console.log('이벤트 리스너 설정');
    
    // 답변 카드 클릭
    document.getElementById('answerCard').addEventListener('click', toggleAnswerCard);
    
    // 버튼 이벤트
    document.getElementById('giveUpBtn').addEventListener('click', giveUpAsLiar);
    document.getElementById('endGameBtn').addEventListener('click', endGame);
    document.getElementById('nextRoundBtn').addEventListener('click', nextRound);
    document.getElementById('nextGameBtn').addEventListener('click', nextGame);
    document.getElementById('backBtn').addEventListener('click', goBack);
    
    // 모달 외부 클릭시 닫기
    window.addEventListener('click', function(event) {
        const modals = ['giveUpModal', 'endGameModal', 'nextRoundModal', 'nextGameModal'];
        modals.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (event.target === modal) {
                closeModal(modalId);
            }
        });
    });
    
    console.log('이벤트 리스너 설정 완료');
}

function saveVotes() {
    if (!inviteCode || !currentGame || !currentRound) {
        console.warn('필수 정보 누락: 투표 저장 실패');
        return;
    }
    localStorage.setItem(`votes_${inviteCode}_game_${currentGame}`, JSON.stringify(voteData));
    console.log(`✅ 투표 저장됨: votes_${inviteCode}_game_${currentGame}`, voteData);
}
function initializeRoundVotes() {
    console.log(`라운드 ${currentRound} 투표 초기화 시작`);
    for (let i = 0; i < totalPlayers; i++) {
        if (voteData[i][currentRound] === -1) {
            voteData[i][currentRound] = 0;
        }
    }
    localStorage.setItem(`votes_${inviteCode}_game_${currentGame}`, JSON.stringify(voteData));
    console.log(`✅ 라운드 ${currentRound} 투표 초기화 완료:`, voteData);
}
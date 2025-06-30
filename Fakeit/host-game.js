// 게임 데이터 전역 변수
let gameData = null;
let playerScores = {};
let currentRound = 1;
let currentGame = 1;
let maxRounds = 4;
let maxGames = 4;
let hostCode = null;
let hostIsFaker = false;
let fakerGaveUp = false;
let totalPlayers = 4;
let fakerCount = 1;
let allCodes = [];
let playerCodes = {};
let answerSubmitted = false;
let submittedAnswer = '';
let submittedDrawing = null;
let selectedQuestions = [];
let answerType = 'text'; // 'text' 또는 'drawing'

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 게임 데이터 시스템 로드 확인
    if (!window.isGameDataLoaded() || !window.isQuestionsLoaded()) {
        console.error('게임 데이터 또는 질문 시스템이 로드되지 않았습니다.');
        alert('게임 시스템 로드 중 오류가 발생했습니다. 페이지를 새로고침해주세요.');
        return;
    }
    
    initializeGame();
    setupEventListeners();
    loadGameData();
});

// 게임 초기화
function initializeGame() {
    loadHostData();
    initializePlayerScores();
    determineHostRole();
    loadSelectedQuestions();
    updateUI();
}

// 호스트 데이터 로드
function loadHostData() {
    totalPlayers = parseInt(localStorage.getItem('totalPlayers')) || 4;
    fakerCount = parseInt(localStorage.getItem('fakerCount')) || 1;
    hostCode = localStorage.getItem('hostCode');
    currentGame = parseInt(localStorage.getItem('currentGame')) || 1;
    
    // 현재 라운드 복원
    const savedRound = localStorage.getItem('currentRound');
    if (savedRound) {
        currentRound = parseInt(savedRound);
    }
    
    // 답변 상태 복원
    const savedAnswer = localStorage.getItem('hostAnswer');
    const savedDrawing = localStorage.getItem('hostDrawing');
    const savedSubmitted = localStorage.getItem('answerSubmitted') === 'true';
    
    if (savedSubmitted && (savedAnswer || savedDrawing)) {
        answerSubmitted = true;
        submittedAnswer = savedAnswer || '';
        submittedDrawing = savedDrawing || null;
        answerType = savedDrawing ? 'drawing' : 'text';
    }
    
    // 모든 코드 정보 로드
    const savedCodes = localStorage.getItem('allPlayerCodes');
    if (savedCodes) {
        allCodes = JSON.parse(savedCodes);
        assignPlayerCodes();
    }
    
    console.log('호스트 데이터 로드 완료:', {
        hostCode,
        currentGame,
        currentRound,
        totalPlayers,
        fakerCount
    });
}

// 선택된 질문들 로드 (새로운 시스템)
function loadSelectedQuestions() {
    if (!hostCode) {
        console.warn('호스트 코드가 없습니다. 기본 질문을 사용합니다.');
        selectedQuestions = [11, 21, 31, 41]; // 새로운 번호 체계
        return;
    }
    
    try {
        // gameData.js를 사용하여 코드 기반 질문 선택
        selectedQuestions = window.getCurrentGameQuestions(hostCode, currentGame);
        
        // localStorage에 저장
        localStorage.setItem('selectedQuestions', JSON.stringify(selectedQuestions));
        
        console.log('선택된 질문들:', selectedQuestions);
    } catch (error) {
        console.error('질문 로드 중 오류:', error);
        selectedQuestions = [11, 21, 31, 41]; // 기본값
    }
}

// 플레이어 코드 할당
function assignPlayerCodes() {
    playerCodes = {};
    for (let i = 1; i < totalPlayers; i++) {
        if (allCodes[i-1]) {
            playerCodes[`플레이어${i}`] = allCodes[i-1];
        }
    }
    playerCodes['호스트'] = hostCode;
}

// 호스트 역할 판단 (새로운 gameData.js 사용)
function determineHostRole() {
    if (hostCode) {
        // 새로운 함수 사용: 게임별 라이어 판별
        hostIsFaker = window.isPlayerFakerInRound(hostCode, currentGame, 1, 0, totalPlayers, fakerCount);
        localStorage.setItem('hostIsFaker', hostIsFaker.toString());
    }
}

// 플레이어 점수 초기화
function initializePlayerScores() {
    const savedScores = localStorage.getItem('playerScores');
    if (savedScores) {
        playerScores = JSON.parse(savedScores);
    } else {
        playerScores = {};
        for (let i = 1; i < totalPlayers; i++) {
            playerScores[`플레이어${i}`] = 0;
        }
        playerScores['호스트'] = 0;
    }
}

// 이벤트 리스너 설정
function setupEventListeners() {
    document.getElementById('faker-give-up-btn')?.addEventListener('click', handleFakerGiveUp);
    document.getElementById('next-round-btn')?.addEventListener('click', handleNextRound);
    document.getElementById('next-game-btn')?.addEventListener('click', handleNextGame);
    document.getElementById('reveal-faker-btn')?.addEventListener('click', handleRevealFaker);
    document.getElementById('end-game-btn')?.addEventListener('click', handleEndGame);
    document.getElementById('submitBtn')?.addEventListener('click', handleSubmitAnswer);
    
    setupModalEventListeners();
    setupDrawingEventListeners();
}

// 그림 그리기 이벤트 리스너 설정
function setupDrawingEventListeners() {
    // 색상 버튼들
    document.querySelectorAll('.color-btn')?.forEach(btn => {
        btn.addEventListener('click', () => changeColor(btn.dataset.color));
    });
    
    // 그리기 도구들
    document.getElementById('clearCanvas')?.addEventListener('click', clearCanvas);
    document.getElementById('brushSize')?.addEventListener('input', changeBrushSize);
}

// 모달 이벤트 리스너 설정
function setupModalEventListeners() {
    document.getElementById('cancelGiveUp')?.addEventListener('click', () => closeModal('giveUpModal'));
    document.getElementById('confirmGiveUp')?.addEventListener('click', confirmFakerGiveUp);
    document.getElementById('cancelReveal1')?.addEventListener('click', () => closeModal('revealModal1'));
    document.getElementById('confirmReveal1')?.addEventListener('click', showSecondRevealModal);
    document.getElementById('cancelReveal2')?.addEventListener('click', () => closeModal('revealModal2'));
    document.getElementById('confirmReveal2')?.addEventListener('click', confirmRevealFaker);
    document.getElementById('closePlayerInfo')?.addEventListener('click', () => closeModal('playerInfoModal'));
    document.getElementById('restartBtn')?.addEventListener('click', restartGame);
    document.getElementById('homeBtn')?.addEventListener('click', goHome);
}

// UI 업데이트
function updateUI() {
    updateHeader();
    updateGameInfo();
    updateQuestionSection();
    updateScoreSection();
    updateAnswerStatus();
}

// 헤더 업데이트 (게임 번호 추가)
function updateHeader() {
    const gameElement = document.getElementById('gameNumber');
    const roundElement = document.getElementById('roundNumber');
    const totalElement = document.getElementById('roundTotal');
    
    if (gameElement) gameElement.textContent = currentGame;
    if (roundElement) roundElement.textContent = currentRound;
    if (totalElement) totalElement.textContent = `/${maxRounds}`;
    
    // 호스트 역할 표시
    const hostRoleElement = document.getElementById('hostRole');
    if (hostRoleElement) {
        if (hostIsFaker) {
            hostRoleElement.textContent = '페이커';
            hostRoleElement.className = 'host-role faker';
        } else {
            hostRoleElement.textContent = '일반 플레이어';
            hostRoleElement.className = 'host-role normal';
        }
    }
}

// 게임 정보 업데이트
function updateGameInfo() {
    const gameCodeElement = document.getElementById('gameCode');
    if (gameCodeElement && hostCode) {
        gameCodeElement.textContent = hostCode;
    }
}

// 질문 섹션 업데이트 (새로운 questions.js 사용)
function updateQuestionSection() {
    if (!selectedQuestions.length) return;
    
    try {
        // 새로운 함수 시그니처 사용
        const currentQuestion = window.getCurrentQuestion(hostCode, currentGame, currentRound, hostIsFaker);
        
        if (currentQuestion) {
            const modeElement = document.getElementById('questionMode');
            const questionElement = document.getElementById('hostQuestion');
            
            if (modeElement) modeElement.textContent = currentQuestion.mode;
            if (questionElement) questionElement.textContent = currentQuestion.text;
            
            // 문제 유형에 따라 입력 방식 설정
            setupAnswerInputType(currentQuestion.type);
            
            // 답변 제출 후 페이커인 경우 메인 질문 표시
            if (answerSubmitted && hostIsFaker) {
                const mainQuestion = window.getCurrentQuestion(hostCode, currentGame, currentRound, false);
                const mainQuestionDiv = document.getElementById('mainQuestionDiv');
                const mainQuestionElement = document.getElementById('mainQuestion');
                
                if (mainQuestionDiv && mainQuestionElement && mainQuestion) {
                    mainQuestionDiv.style.display = 'block';
                    mainQuestionElement.textContent = mainQuestion.text;
                }
            }
        }
    } catch (error) {
        console.error('질문 섹션 업데이트 중 오류:', error);
    }
}

// 답변 입력 유형 설정
function setupAnswerInputType(questionType) {
    const textInput = document.getElementById('answerInput');
    const drawingContainer = document.getElementById('drawingContainer');
    
    if (questionType === 2) { // 그림형
        answerType = 'drawing';
        if (textInput) textInput.style.display = 'none';
        if (drawingContainer) {
            drawingContainer.style.display = 'block';
            initializeCanvas();
        }
    } else { // 텍스트 입력형
        answerType = 'text';
        if (textInput) textInput.style.display = 'block';
        if (drawingContainer) drawingContainer.style.display = 'none';
    }
}

// 캔버스 초기화
function initializeCanvas() {
    const canvas = document.getElementById('drawingCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#000000';
    
    // 배경을 흰색으로
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// 답변 상태 업데이트
function updateAnswerStatus() {
    if (answerSubmitted) {
        const answerInput = document.getElementById('answerInput');
        const submitBtn = document.getElementById('submitBtn');
        const answerStatus = document.getElementById('answerStatus');
        const submittedText = document.getElementById('submittedText');
        const submittedCanvas = document.getElementById('submittedDrawing');
        
        if (answerType === 'drawing') {
            // 그림 답변 표시
            if (answerInput) answerInput.style.display = 'none';
            if (submittedText) submittedText.style.display = 'none';
            if (submittedCanvas && submittedDrawing) {
                submittedCanvas.style.display = 'block';
                const ctx = submittedCanvas.getContext('2d');
                const img = new Image();
                img.onload = function() {
                    ctx.clearRect(0, 0, submittedCanvas.width, submittedCanvas.height);
                    ctx.drawImage(img, 0, 0, submittedCanvas.width, submittedCanvas.height);
                };
                img.src = submittedDrawing;
            }
        } else {
            // 텍스트 답변 표시
            if (answerInput) answerInput.style.display = 'none';
            if (submittedCanvas) submittedCanvas.style.display = 'none';
            if (submittedText) {
                submittedText.style.display = 'block';
                submittedText.textContent = submittedAnswer;
            }
        }
        
        if (submitBtn) submitBtn.style.display = 'none';
        if (answerStatus) answerStatus.style.display = 'block';
    }
}

// 점수 섹션 업데이트
function updateScoreSection() {
    const scoreGrid = document.getElementById('scoreGrid');
    if (!scoreGrid) return;
    
    scoreGrid.innerHTML = '';
    
    Object.keys(playerScores).forEach(playerName => {
        const scoreCard = createScoreCard(playerName, playerScores[playerName]);
        scoreGrid.appendChild(scoreCard);
    });
}

// 점수 카드 생성
function createScoreCard(playerName, score) {
    const card = document.createElement('div');
    card.className = 'score-card';
    card.innerHTML = `
        <div class="score-header">
            <span class="player-name">${playerName}</span>
            <div class="score-controls">
                <button class="score-btn score-minus" onclick="changeScore('${playerName}', -1)">-</button>
                <span class="score-value">${score}</span>
                <button class="score-btn score-plus" onclick="changeScore('${playerName}', 1)">+</button>
            </div>
        </div>
    `;
    return card;
}

// 점수 변경
function changeScore(playerName, delta) {
    playerScores[playerName] = Math.max(0, playerScores[playerName] + delta);
    updateScoreSection();
    localStorage.setItem('playerScores', JSON.stringify(playerScores));
}

// 답변 제출 처리 (그림/텍스트 구분)
function handleSubmitAnswer() {
    let answer = '';
    let drawing = null;
    
    if (answerType === 'drawing') {
        const canvas = document.getElementById('drawingCanvas');
        if (canvas) {
            drawing = canvas.toDataURL();
            answer = '[그림 답변]';
        }
    } else {
        const answerInput = document.getElementById('answerInput');
        if (answerInput) {
            answer = answerInput.value.trim();
        }
    }
    
    if (!answer) {
        alert('답변을 입력해주세요.');
        return;
    }
    
    if (answerSubmitted) {
        alert('이미 답변을 제출했습니다.');
        return;
    }
    
    // 답변 제출
    submittedAnswer = answer;
    submittedDrawing = drawing;
    answerSubmitted = true;
    
    // UI 업데이트
    updateAnswerStatus();
    
    // 페이커인 경우 메인 질문 표시
    if (hostIsFaker) {
        updateQuestionSection();
    }
    
    // 답변 데이터를 localStorage에 저장
    localStorage.setItem('hostAnswer', submittedAnswer);
    localStorage.setItem('hostDrawing', submittedDrawing || '');
    localStorage.setItem('answerSubmitted', 'true');
    localStorage.setItem('currentRound', currentRound.toString());
    localStorage.setItem('currentGame', currentGame.toString());
    localStorage.setItem('isHost', 'true');
    localStorage.setItem('playerIndex', '0'); // 호스트는 0번으로 설정

    console.log('답변 제출 완료:', submittedAnswer);
    
    // answer.html로 이동
    setTimeout(() => {
        window.location.href = 'answer.html?from=host';
    }, 1500);
}

// 다음 라운드 처리
function handleNextRound() {
    if (currentRound < maxRounds) {
        currentRound++;
        resetRoundState();
        updateUI();
        
        localStorage.setItem('currentRound', currentRound.toString());
        console.log('다음 라운드로 진행:', currentRound);
    } else {
        // 마지막 라운드에서는 다음 게임 버튼 강조
        highlightNextGameButton();
    }
}

// 다음 게임 처리
function handleNextGame() {
    if (currentGame < maxGames) {
        currentGame++;
        currentRound = 1;
        resetRoundState();
        
        // 새 게임에서 호스트 역할 재판단
        determineHostRole();
        loadSelectedQuestions();
        updateUI();
        
        localStorage.setItem('currentGame', currentGame.toString());
        localStorage.setItem('currentRound', currentRound.toString());
        console.log('다음 게임으로 진행:', currentGame);
    } else {
        handleEndGame();
    }
}

// 라운드 상태 초기화
function resetRoundState() {
    answerSubmitted = false;
    submittedAnswer = '';
    submittedDrawing = null;
    answerType = 'text';
    
    // UI 초기화
    const answerInput = document.getElementById('answerInput');
    const submitBtn = document.getElementById('submitBtn');
    const answerStatus = document.getElementById('answerStatus');
    const mainQuestionDiv = document.getElementById('mainQuestionDiv');
    
    if (answerInput) {
        answerInput.style.display = 'block';
        answerInput.value = '';
    }
    if (submitBtn) submitBtn.style.display = 'block';
    if (answerStatus) answerStatus.style.display = 'none';
    if (mainQuestionDiv) mainQuestionDiv.style.display = 'none';
    
    // 캔버스 초기화
    const canvas = document.getElementById('drawingCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    // 상태 저장
    localStorage.removeItem('hostAnswer');
    localStorage.removeItem('hostDrawing');
    localStorage.removeItem('answerSubmitted');
}

// 다음 게임 버튼 강조
function highlightNextGameButton() {
    const nextGameBtn = document.getElementById('next-game-btn');
    if (nextGameBtn) {
        nextGameBtn.classList.add('pulse-highlight');
        setTimeout(() => {
            nextGameBtn.classList.remove('pulse-highlight');
        }, 3000);
    }
}

// 페이커 포기 처리
function handleFakerGiveUp() {
    if (!fakerGaveUp) {
        showModal('giveUpModal');
    }
}

function confirmFakerGiveUp() {
    fakerGaveUp = true;
    const giveUpBtn = document.getElementById('faker-give-up-btn');
    if (giveUpBtn) {
        giveUpBtn.textContent = '🏳️ 페이커가 포기했습니다';
        giveUpBtn.style.background = 'linear-gradient(135deg, #22c55e, #15803d)';
        giveUpBtn.disabled = true;
    }
    closeModal('giveUpModal');
}

// 페이커 공개 처리
function handleRevealFaker() {
    showModal('revealModal1');
}

function showSecondRevealModal() {
    closeModal('revealModal1');
    showModal('revealModal2');
}

function confirmRevealFaker() {
    showPlayerInfo();
    closeModal('revealModal2');
}

// 플레이어 정보 표시 (새로운 gameData.js 사용)
function showPlayerInfo() {
    const playerInfoList = document.getElementById('playerInfoList');
    if (!playerInfoList) return;
    
    playerInfoList.innerHTML = '';
    
    // 모든 플레이어의 페이커 여부 표시 (현재 게임 기준)
    Object.keys(playerCodes).forEach((playerName, index) => {
        const code = playerCodes[playerName];
        const playerIndex = playerName === '호스트' ? 0 : parseInt(playerName.replace('플레이어', ''));
        const isFaker = window.isPlayerFakerInRound(code, currentGame, 1, playerIndex, totalPlayers, fakerCount);
        
        const playerDiv = document.createElement('div');
        playerDiv.className = 'player-info-item';
        playerDiv.innerHTML = `
            <div class="player-info-left">
                <span class="player-info-name">${playerName}</span>
                <span class="player-info-code">(${code})</span>
            </div>
            <span class="player-info-role ${isFaker ? 'faker' : 'normal'}">${isFaker ? '페이커' : '일반 플레이어'}</span>
        `;
        playerInfoList.appendChild(playerDiv);
    });
    
    showModal('playerInfoModal');
}

// 게임 종료 처리
function handleEndGame() {
    showFinalScores();
    showModal('endGameModal');
}

// 최종 점수 표시
function showFinalScores() {
    const finalScores = document.getElementById('finalScores');
    if (!finalScores) return;
    
    finalScores.innerHTML = '';
    
    Object.entries(playerScores)
        .sort(([,a], [,b]) => b - a)
        .forEach(([name, score]) => {
            const scoreItem = document.createElement('div');
            scoreItem.className = 'final-score-item';
            scoreItem.innerHTML = `
                <span class="final-score-name">${name}</span>
                <span class="final-score-value">${score}점</span>
            `;
            finalScores.appendChild(scoreItem);
        });
}

// 그림 그리기 관련 함수들 (간단 버전)
function changeColor(color) {
    const canvas = document.getElementById('drawingCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = color;
    }
}

function changeBrushSize(e) {
    const canvas = document.getElementById('drawingCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.lineWidth = e.target.value;
    }
}

function clearCanvas() {
    const canvas = document.getElementById('drawingCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

// 모달 표시/닫기
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// 게임 재시작
function restartGame() {
    localStorage.clear();
    window.location.href = 'host.html';
}

// 홈으로 이동
function goHome() {
    localStorage.clear();
    window.location.href = 'index.html';
}

// 게임 데이터 로드 (추가 데이터 로드용)
function loadGameData() {
    console.log('호스트 게임 데이터 로드 완료');
}

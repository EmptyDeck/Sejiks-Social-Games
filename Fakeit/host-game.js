//host-game.js (player-game.js 기반 통합 버전)
// 게임 데이터 전역 변수
let inviteCode = '';
let currentRound = 1;
let currentGame = 1;
let totalPlayers = 4;
let fakerCount = 1;
let gameStarted = false;
let answerSubmitted = false;
let submittedAnswer = '';
let submittedDrawing = null;
let maxRounds = 4;
let maxGames = 4;
let playerIndex = 0; // 호스트는 0번
let playerScores = {}; // 호스트 전용 기능

// 그림 그리기 변수
let canvas, ctx;
let isDrawing = false;
let currentColor = '#000000';
let currentBrushSize = 3;

// 호스트 전용 변수
let fakerGaveUp = false;

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 게임 데이터 시스템 로드 확인
    if (!window.isGameDataLoaded() || !window.isQuestionsLoaded()) {
        console.error('게임 데이터 또는 질문 시스템이 로드되지 않았습니다.');
        alert('게임 시스템 로드 중 오류가 발생했습니다. 페이지를 새로고침해주세요.');
        return;
    }
    
    initializeCanvas();
    loadHostData();
    initializePlayerScores();
    setupEventListeners();
    
    // 게임 자동 시작
    if (inviteCode) {
        startGame();
    }
});

// 자동 진행 체크 함수 (host-game 전용)
function checkAutoProgression() {
    // 자동 다음 라운드 체크
    const autoNextRound = localStorage.getItem('autoNextRound');
    const nextRoundNumber = localStorage.getItem('nextRoundNumber');
    
    if (autoNextRound === 'true' && nextRoundNumber) {
        const targetRound = parseInt(nextRoundNumber);
        
        if (targetRound <= maxRounds && targetRound > currentRound) {
            currentRound = targetRound;
            resetRoundState();
            updateGameInfo();
            updatePlayerRole(); // 역할 재확인
            showQuestion();
            
            console.log('호스트: 자동으로 다음 라운드 진행:', currentRound);
            
            // 플래그 제거
            localStorage.removeItem('autoNextRound');
            localStorage.removeItem('nextRoundNumber');
            localStorage.setItem('currentRound', currentRound.toString());
            return true; // 자동 진행 발생했음을 알림
        }
    }
    
    // 자동 다음 게임 체크
    const autoNextGame = localStorage.getItem('autoNextGame');
    const nextGameNumber = localStorage.getItem('nextGameNumber');
    
    if (autoNextGame === 'true' && nextGameNumber) {
        const targetGame = parseInt(nextGameNumber);
        
        if (targetGame <= maxGames && targetGame > currentGame) {
            currentGame = targetGame;
            currentRound = 1;
            resetRoundState();
            updateGameInfo();
            updatePlayerRole(); // 새 게임에서 역할 재확인
            showQuestion();
            
            console.log('호스트: 자동으로 다음 게임 진행:', currentGame);
            
            // 플래그 제거
            localStorage.removeItem('autoNextGame');
            localStorage.removeItem('nextGameNumber');
            localStorage.setItem('currentGame', currentGame.toString());
            localStorage.setItem('currentRound', currentRound.toString());
            return true; // 자동 진행 발생했음을 알림
        }
    }
    
    return false; // 자동 진행 없음
}

// 호스트 데이터 로드
function loadHostData() {
    inviteCode = localStorage.getItem('inviteCode') || localStorage.getItem('hostCode');
    totalPlayers = parseInt(localStorage.getItem('totalPlayers')) || 4;
    fakerCount = parseInt(localStorage.getItem('fakerCount')) || 1;
    currentGame = parseInt(localStorage.getItem('currentGame')) || 1;
    currentRound = parseInt(localStorage.getItem('currentRound')) || 1;
    playerIndex = 0; // 호스트는 항상 0번
    
    // 답변 상태 복원
    const savedAnswer = localStorage.getItem('hostAnswer');
    const savedDrawing = localStorage.getItem('hostDrawing');
    const savedSubmitted = localStorage.getItem('answerSubmitted') === 'true';
    
    if (savedSubmitted && (savedAnswer || savedDrawing)) {
        answerSubmitted = true;
        submittedAnswer = savedAnswer || '';
        submittedDrawing = savedDrawing || null;
    }
    
    console.log('호스트 데이터 로드 완료:', {
        inviteCode,
        currentGame,
        currentRound,
        totalPlayers,
        fakerCount,
        playerIndex
    });
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

// 캔버스 초기화
function initializeCanvas() {
    canvas = document.getElementById('drawingCanvas');
    if (!canvas) return;
    
    ctx = canvas.getContext('2d');
    
    // 캔버스 설정
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = currentBrushSize;
    ctx.strokeStyle = currentColor;
    
    // 배경을 흰색으로 설정
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    setupCanvasEvents();
}

// 캔버스 이벤트 설정
function setupCanvasEvents() {
    if (!canvas) return;
    
    // 마우스 이벤트
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // 터치 이벤트 (모바일)
    canvas.addEventListener('touchstart', handleTouch);
    canvas.addEventListener('touchmove', handleTouch);
    canvas.addEventListener('touchend', stopDrawing);
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 게임 컨트롤 관련
    document.getElementById('submitBtn')?.addEventListener('click', submitAnswer);
    document.getElementById('editAnswerBtn')?.addEventListener('click', editAnswer);
    document.getElementById('goToAnswerBtn')?.addEventListener('click', goToAnswer);
    document.getElementById('next-round-btn')?.addEventListener('click', nextRound);
    document.getElementById('next-game-btn')?.addEventListener('click', nextGame);
    
    // 호스트 전용 기능
    document.getElementById('faker-give-up-btn')?.addEventListener('click', handleFakerGiveUp);
    document.getElementById('reveal-faker-btn')?.addEventListener('click', handleRevealFaker);
    document.getElementById('end-game-btn')?.addEventListener('click', showEndGameModal);
    
    // 그림 도구 관련
    document.querySelectorAll('.color-btn')?.forEach(btn => {
        btn.addEventListener('click', () => changeColor(btn.dataset.color));
    });
    document.getElementById('clearCanvas')?.addEventListener('click', clearCanvas);
    document.getElementById('brushSize')?.addEventListener('input', changeBrushSize);
    
    // 모달 관련
    setupModalEventListeners();
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
    document.getElementById('cancelEndGame')?.addEventListener('click', () => closeModal('endGameModal'));
    document.getElementById('confirmEndGame')?.addEventListener('click', endGame);
    document.getElementById('restartBtn')?.addEventListener('click', restartGame);
    document.getElementById('homeBtn')?.addEventListener('click', goHome);
}

// 게임 시작
function startGame() {
    gameStarted = true;
    
    // 자동 진행 체크 먼저 수행
    const autoProgressionOccurred = checkAutoProgression();
    
    // UI 업데이트
    updateGameInfo();
    updatePlayerRole();
    
    // 자동 진행이 없는 경우에만 새 질문 표시
    if (!autoProgressionOccurred) {
        showQuestion();
    }
    
    showAnswerInput();
    showGameControls();
    showHostControls();
    updateScoreSection();
    
    console.log('호스트 게임 시작 - 게임:', currentGame, '라운드:', currentRound);
}

// 게임 정보 업데이트
function updateGameInfo() {
    const gameNumber = document.getElementById('gameNumber');
    const roundNumber = document.getElementById('roundNumber');
    const roundTotal = document.getElementById('roundTotal');
    const gameCodeElement = document.getElementById('gameCode');
    
    if (gameNumber) gameNumber.textContent = currentGame;
    if (roundNumber) roundNumber.textContent = currentRound;
    if (roundTotal) roundTotal.textContent = `/${maxRounds}`;
    
    // 초대코드 표시
    if (gameCodeElement && inviteCode) {
        gameCodeElement.textContent = inviteCode;
    }
}

// 현재 게임에서의 역할 업데이트
function updatePlayerRole() {
    try {
        console.log('=== 호스트 역할 업데이트 ===');
        console.log('현재 데이터:', {
            inviteCode,
            currentGame,
            currentRound,
            playerIndex,
            totalPlayers,
            fakerCount
        });
        
        // 현재 게임에서 라이어 여부 확인 (호스트는 인덱스 0)
        const isHostFaker = window.isPlayerFaker(inviteCode, currentGame, playerIndex);
        
        console.log('호스트 라이어 판별 결과:', isHostFaker);
        
        const roleCard = document.getElementById('roleCard');
        const roleIcon = document.getElementById('roleIcon');
        const roleName = document.getElementById('roleName');
        const hostRoleElement = document.getElementById('hostRole');
        
        if (isHostFaker) {
            if (roleCard) roleCard.className = 'role-card faker';
            if (roleIcon) roleIcon.textContent = '🎭';
            if (roleName) {
                roleName.textContent = '라이어 (호스트)';
                roleName.className = 'role-name faker';
            }
            if (hostRoleElement) {
                hostRoleElement.textContent = '라이어';
                hostRoleElement.className = 'host-role faker';
            }
        } else {
            if (roleCard) roleCard.className = 'role-card normal';
            if (roleIcon) roleIcon.textContent = '👑';
            if (roleName) {
                roleName.textContent = '일반 플레이어 (호스트)';
                roleName.className = 'role-name normal';
            }
            if (hostRoleElement) {
                hostRoleElement.textContent = '일반 플레이어';
                hostRoleElement.className = 'host-role normal';
            }
        }
        
        console.log(`게임${currentGame} 라운드${currentRound} - 호스트 라이어 여부:`, isHostFaker);
        
    } catch (error) {
        console.error('호스트 역할 업데이트 오류:', error);
    }
}

// 질문 표시
function showQuestion() {
    try {
        // 현재 게임에서 라이어 여부 확인
        const isHostFaker = window.isPlayerFaker(inviteCode, currentGame, playerIndex);
        
        // questions.js의 getCurrentQuestion 함수 사용 (라이어 여부 자동 처리)
        const currentQuestion = window.getCurrentQuestion(inviteCode, currentGame, currentRound, isHostFaker);
        
        if (!currentQuestion) {
            console.error('질문을 찾을 수 없습니다.');
            alert('질문을 불러오는 중 오류가 발생했습니다.');
            return;
        }
        
        // HTML 요소들 안전하게 가져오기 (실제 HTML 구조에 맞춤)
        const questionSection = document.querySelector('.question-section');
        const questionMode = document.getElementById('questionMode');
        const hostQuestion = document.getElementById('hostQuestion');
        
        if (questionSection) {
            questionSection.style.display = 'block';
        }
        
        if (questionMode) {
            questionMode.textContent = currentQuestion.mode;
        }
        
        if (hostQuestion) {
            hostQuestion.textContent = currentQuestion.text;
        }
        
        // 문제 유형에 따라 입력 방식 변경
        setupAnswerInput(currentQuestion.type);
        
        console.log('호스트 질문 표시 완료:', {
            game: currentGame,
            round: currentRound,
            isFaker: isHostFaker,
            questionNumber: currentQuestion.questionNumber,
            questionType: currentQuestion.type,
            questionText: currentQuestion.text,
            elementsFound: {
                questionSection: !!questionSection,
                questionMode: !!questionMode,
                hostQuestion: !!hostQuestion
            }
        });
        
    } catch (error) {
        console.error('질문 표시 중 오류:', error);
        console.log('HTML 요소 확인:', {
            questionSection: !!document.querySelector('.question-section'),
            questionMode: !!document.getElementById('questionMode'),
            hostQuestion: !!document.getElementById('hostQuestion')
        });
        alert('질문을 불러오는 중 오류가 발생했습니다.');
    }
}

// 답변 입력 방식 설정
function setupAnswerInput(questionType) {
    const textContainer = document.getElementById('textInputContainer');
    const drawingContainer = document.getElementById('drawingContainer');
    
    if (questionType === 2) { // 그림형
        if (textContainer) textContainer.style.display = 'none';
        if (drawingContainer) {
            drawingContainer.style.display = 'block';
            clearCanvas(); // 캔버스 초기화
        }
    } else { // 입력형, 플레이어선택형, 이모티콘형
        if (textContainer) textContainer.style.display = 'block';
        if (drawingContainer) drawingContainer.style.display = 'none';
    }
}

// 답변 입력 표시
function showAnswerInput() {
    const inputSection = document.querySelector('.input-section');
    if (inputSection) {
        inputSection.style.display = 'block';
    } else {
        console.warn('input-section 요소를 찾을 수 없습니다.');
    }
}

// 게임 컨트롤 표시
function showGameControls() {
    const goToAnswerBtn = document.getElementById('goToAnswerBtn');
    const nextRoundBtn = document.getElementById('next-round-btn');
    const nextGameBtn = document.getElementById('next-game-btn');
    
    // 답변 공개 버튼은 답변 제출 후에만 표시
    if (goToAnswerBtn && answerSubmitted) {
        goToAnswerBtn.style.display = 'block';
    }
    
    if (currentRound < maxRounds && nextRoundBtn) {
        nextRoundBtn.style.display = 'block';
    }
    
    if (currentGame < maxGames && nextGameBtn) {
        nextGameBtn.style.display = 'block';
    }
}

// 호스트 컨트롤 표시
function showHostControls() {
    // 호스트 전용 버튼들은 HTML에 이미 표시되어 있음
    const controlSection = document.querySelector('.control-section');
    if (controlSection) {
        controlSection.style.display = 'block';
    }
}

// 답변 제출
function submitAnswer() {
    const questionType = getCurrentQuestionType();
    let answer = '';
    let drawing = null;
    
    if (questionType === 2) { // 그림형
        if (canvas) {
            drawing = canvas.toDataURL();
            answer = '[그림 답변]';
        }
    } else { // 텍스트 답변
        const answerInput = document.getElementById('answerInput');
        if (answerInput) {
            answer = answerInput.value.trim();
            if (!answer) {
                alert('답변을 입력해주세요.');
                return;
            }
        }
    }
    
    submittedAnswer = answer;
    submittedDrawing = drawing;
    answerSubmitted = true;
    
    // UI 업데이트
    updateAnswerStatus();
    
    // 답변 공개 버튼 표시
    const goToAnswerBtn = document.getElementById('goToAnswerBtn');
    if (goToAnswerBtn) {
        goToAnswerBtn.style.display = 'block';
    }
    
    // 데이터 저장
    localStorage.setItem('hostAnswer', submittedAnswer);
    localStorage.setItem('hostDrawing', submittedDrawing || '');
    localStorage.setItem('answerSubmitted', 'true');
    
    console.log('호스트 답변 제출 완료:', submittedAnswer);
}

// 답변 수정
function editAnswer() {
    answerSubmitted = false;
    submittedAnswer = '';
    submittedDrawing = null;
    
    // UI 업데이트
    const answerStatus = document.getElementById('answerStatus');
    const submitBtn = document.getElementById('submitBtn');
    const editAnswerBtn = document.getElementById('editAnswerBtn');
    
    if (answerStatus) answerStatus.style.display = 'none';
    if (submitBtn) submitBtn.style.display = 'block';
    if (editAnswerBtn) editAnswerBtn.style.display = 'none';
    
    // 텍스트 답변 복원
    const questionType = getCurrentQuestionType();
    if (questionType !== 2) {
        const answerInput = document.getElementById('answerInput');
        if (answerInput) {
            answerInput.disabled = false;
            answerInput.focus();
        }
    }
    
    // 데이터 삭제
    localStorage.removeItem('hostAnswer');
    localStorage.removeItem('hostDrawing');
    localStorage.removeItem('answerSubmitted');
    
    console.log('호스트 답변 수정 모드 활성화');
}

// 답변 상태 업데이트
function updateAnswerStatus() {
    const questionType = getCurrentQuestionType();
    
    const answerStatus = document.getElementById('answerStatus');
    const submitBtn = document.getElementById('submitBtn');
    const editAnswerBtn = document.getElementById('editAnswerBtn');
    
    if (answerStatus) answerStatus.style.display = 'block';
    if (submitBtn) submitBtn.style.display = 'none';
    if (editAnswerBtn) editAnswerBtn.style.display = 'block';
    
    if (questionType === 2) { // 그림형
        const submittedText = document.getElementById('submittedText');
        const submittedCanvas = document.getElementById('submittedDrawing');
        
        if (submittedText) submittedText.style.display = 'none';
        if (submittedCanvas && submittedDrawing) {
            submittedCanvas.style.display = 'block';
            
            // 제출된 그림을 작은 캔버스에 표시
            const submittedCtx = submittedCanvas.getContext('2d');
            const img = new Image();
            img.onload = function() {
                submittedCtx.clearRect(0, 0, submittedCanvas.width, submittedCanvas.height);
                submittedCtx.drawImage(img, 0, 0, submittedCanvas.width, submittedCanvas.height);
            };
            img.src = submittedDrawing;
        }
    } else { // 텍스트
        const submittedText = document.getElementById('submittedText');
        const submittedCanvas = document.getElementById('submittedDrawing');
        const answerInput = document.getElementById('answerInput');
        
        if (submittedCanvas) submittedCanvas.style.display = 'none';
        if (submittedText) {
            submittedText.style.display = 'block';
            submittedText.textContent = submittedAnswer;
        }
        if (answerInput) answerInput.disabled = true;
    }
}

// 현재 질문 유형 가져오기
function getCurrentQuestionType() {
    try {
        const isHostFaker = window.isPlayerFaker(inviteCode, currentGame, playerIndex);
        const currentQuestion = window.getCurrentQuestion(inviteCode, currentGame, currentRound, isHostFaker);
        
        return currentQuestion ? currentQuestion.type : 1; // 기본값
    } catch (error) {
        console.error('질문 유형 가져오기 오류:', error);
        return 1; // 기본값
    }
}

// 답변 공개 페이지로 이동
function goToAnswer() {
    if (!answerSubmitted) {
        alert('먼저 답변을 제출해주세요.');
        return;
    }
    
    // 라이어인 경우 5초간 메인 질문 표시
    const isHostFaker = window.isPlayerFaker(inviteCode, currentGame, playerIndex);
    
    if (isHostFaker) {
        showMainQuestionToFaker();
        return;
    }
    
    // 일반 플레이어는 바로 이동
    moveToAnswerPage();
}

// 라이어에게 5초간 메인 질문 표시
function showMainQuestionToFaker() {
    try {
        // 메인 질문 가져오기 (라이어가 아닌 일반 플레이어용 질문)
        const mainQuestion = window.getCurrentQuestion(inviteCode, currentGame, currentRound, false);
        
        if (mainQuestion) {
            const mainQuestionText = document.getElementById('mainQuestionText');
            const mainQuestionReveal = document.getElementById('mainQuestionReveal');
            const revealTimer = document.getElementById('revealTimer');
            
            if (mainQuestionText && mainQuestionReveal && revealTimer) {
                mainQuestionText.textContent = mainQuestion.text;
                mainQuestionReveal.style.display = 'flex';
                
                // 5초 타이머
                let timeLeft = 5;
                revealTimer.textContent = timeLeft;
                
                const timer = setInterval(() => {
                    timeLeft--;
                    revealTimer.textContent = timeLeft;
                    
                    if (timeLeft <= 0) {
                        clearInterval(timer);
                        mainQuestionReveal.style.display = 'none';
                        moveToAnswerPage();
                    }
                }, 1000);
                
                console.log('호스트 라이어에게 메인 질문 5초간 표시:', mainQuestion.text);
            } else {
                console.warn('메인 질문 표시 요소를 찾을 수 없습니다. HTML에 추가 요소가 필요합니다.');
                moveToAnswerPage(); // 요소가 없으면 바로 이동
            }
        }
    } catch (error) {
        console.error('메인 질문 표시 중 오류:', error);
        moveToAnswerPage(); // 오류 시 바로 이동
    }
}

// 답변 공개 페이지로 이동
function goToAnswer() {
    if (!answerSubmitted) {
        alert('먼저 답변을 제출해주세요.');
        return;
    }
    
    // 라이어인 경우 5초간 메인 질문 표시
    const isHostFaker = window.isPlayerFaker(inviteCode, currentGame, playerIndex);
    
    if (isHostFaker) {
        showMainQuestionToFaker();
        return;
    }
    
    // 일반 플레이어는 바로 이동
    moveToAnswerPage();
}

// answer.html로 이동
function moveToAnswerPage() {
    const isHostFaker = window.isPlayerFaker(inviteCode, currentGame, playerIndex);
    
    // answer.html로 이동하면서 데이터 전달
    localStorage.setItem('hostAnswer', submittedAnswer);
    localStorage.setItem('hostIsFaker', isHostFaker.toString());
    localStorage.setItem('hostCode', inviteCode);
    localStorage.setItem('currentRound', currentRound.toString());
    localStorage.setItem('currentGame', currentGame.toString());
    localStorage.setItem('totalPlayers', totalPlayers.toString());
    localStorage.setItem('isHost', 'true');
    localStorage.setItem('playerIndex', '0');

    console.log('답변 공개 페이지로 이동 (호스트)');
    window.location.href = 'answer.html?from=host';
}

// 다음라운드
function nextRound() {
    if (currentRound < maxRounds) {
        currentRound++;
        resetRoundState();
        updateGameInfo();
        updatePlayerRole(); // 새로운 라운드에서 역할 재확인
        showQuestion();
        
        localStorage.setItem('currentRound', currentRound.toString());
        console.log('다음 라운드로 진행 (호스트):', currentRound);
    } else {
        // 마지막 라운드에서는 다음 게임 버튼 강조
        highlightNextGameButton();
    }
}

// 다음게임
function nextGame() {
    if (currentGame < maxGames) {
        currentGame++;
        currentRound = 1;
        resetRoundState();
        updateGameInfo();
        updatePlayerRole(); // 새 게임에서 역할 재확인
        showQuestion();
        
        localStorage.setItem('currentGame', currentGame.toString());
        localStorage.setItem('currentRound', currentRound.toString());
        console.log('다음 게임으로 진행 (호스트):', currentGame);
    } else {
        // 마지막 게임에서는 게임 종료
        showEndGameModal();
    }
}

// 라운드 상태 초기화
function resetRoundState() {
    answerSubmitted = false;
    submittedAnswer = '';
    submittedDrawing = null;
    
    // UI 초기화
    const answerInput = document.getElementById('answerInput');
    const answerStatus = document.getElementById('answerStatus');
    const submitBtn = document.getElementById('submitBtn');
    const editAnswerBtn = document.getElementById('editAnswerBtn');
    
    if (answerInput) {
        answerInput.value = '';
        answerInput.disabled = false;
    }
    if (answerStatus) answerStatus.style.display = 'none';
    if (submitBtn) submitBtn.style.display = 'block';
    if (editAnswerBtn) editAnswerBtn.style.display = 'none';
    
    // 캔버스 초기화
    clearCanvas();
    
    // localStorage 정리
    localStorage.removeItem('hostAnswer');
    localStorage.removeItem('hostDrawing');
    localStorage.removeItem('answerSubmitted');
}

// 다음 게임 버튼 강조
function highlightNextGameButton() {
    const nextGameBtn = document.getElementById('nextGameBtn');
    if (nextGameBtn) {
        nextGameBtn.classList.add('pulse-highlight');
        setTimeout(() => {
            nextGameBtn.classList.remove('pulse-highlight');
        }, 3000);
    }
}

// === 호스트 전용 기능들 ===

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

// 라이어 포기 처리
function handleFakerGiveUp() {
    if (!fakerGaveUp) {
        showModal('giveUpModal');
    }
}

function confirmFakerGiveUp() {
    fakerGaveUp = true;
    const giveUpBtn = document.getElementById('faker-give-up-btn');
    if (giveUpBtn) {
        giveUpBtn.textContent = '🏳️ 라이어가 포기했습니다';
        giveUpBtn.style.background = 'linear-gradient(135deg, #22c55e, #15803d)';
        giveUpBtn.disabled = true;
    }
    closeModal('giveUpModal');
}

// 라이어 공개 처리
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

// 플레이어 정보 표시
function showPlayerInfo() {
    const playerInfoList = document.getElementById('playerInfoList');
    if (!playerInfoList) return;
    
    playerInfoList.innerHTML = '';
    
    // 현재 게임에서의 라이어 목록 가져오기
    const fakers = window.getFakersForGame(inviteCode, currentGame);
    
    // 모든 플레이어 표시 (0부터 totalPlayers-1까지)
    for (let i = 0; i < totalPlayers; i++) {
        const playerName = i === 0 ? '호스트' : `플레이어${i}`;
        const isFaker = fakers.includes(i);
        
        const playerDiv = document.createElement('div');
        playerDiv.className = 'player-info-item';
        playerDiv.innerHTML = `
            <div class="player-info-left">
                <span class="player-info-name">${playerName}</span>
                <span class="player-info-code">(${inviteCode})</span>
            </div>
            <span class="player-info-role ${isFaker ? 'faker' : 'normal'}">${isFaker ? '라이어' : '일반 플레이어'}</span>
        `;
        playerInfoList.appendChild(playerDiv);
    }
    
    showModal('playerInfoModal');
}

// 게임 종료 모달 표시
function showEndGameModal() {
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

// 게임 종료
function endGame() {
    const isHostFaker = window.isPlayerFaker(inviteCode, currentGame, playerIndex);
    
    // gameover.html로 데이터 전달
    localStorage.setItem('hostAnswer', submittedAnswer || '');
    localStorage.setItem('hostIsFaker', isHostFaker.toString());
    localStorage.setItem('hostCode', inviteCode);
    localStorage.setItem('gameEndRound', currentRound.toString());
    localStorage.setItem('finalVotes', JSON.stringify({}));
    
    console.log('게임 종료 - gameover.html로 이동 (호스트)');
    window.location.href = 'gameover.html';
}

// === 그림 그리기 관련 함수들 ===

function startDrawing(e) {
    if (!canvas || !ctx) return;
    
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function draw(e) {
    if (!isDrawing || !canvas || !ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.stroke();
}

function stopDrawing() {
    if (isDrawing && ctx) {
        isDrawing = false;
        ctx.beginPath();
    }
}

function handleTouch(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent(e.type === 'touchstart' ? 'mousedown' : 
                                     e.type === 'touchmove' ? 'mousemove' : 'mouseup', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}

function changeColor(color) {
    currentColor = color;
    if (ctx) {
        ctx.strokeStyle = color;
    }
    
    // 활성 색상 표시
    document.querySelectorAll('.color-btn').forEach(btn => btn.classList.remove('active'));
    const selectedBtn = document.querySelector(`[data-color="${color}"]`);
    if (selectedBtn) {
        selectedBtn.classList.add('active');
    }
}

function changeBrushSize(e) {
    currentBrushSize = e.target.value;
    if (ctx) {
        ctx.lineWidth = currentBrushSize;
    }
    const brushSizeValue = document.getElementById('brushSizeValue');
    if (brushSizeValue) {
        brushSizeValue.textContent = currentBrushSize;
    }
}

function clearCanvas() {
    if (!canvas || !ctx) return;
    
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = currentColor;
}

// === 공통 함수들 ===

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
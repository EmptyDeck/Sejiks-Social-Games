//host-game.js
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
let playerIndex = 0; // 호스트는 항상 0번
let playerScores = {};

// 그림 그리기 변수
let canvas, ctx;
let isDrawing = false;
let currentColor = '#000000';
let currentBrushSize = 3;

// 호스트 전용 변수
let fakerGaveUp = false;
let playerCodes = {};

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== host-game.html 로드 시작 ===');
    console.log('DOM 로드 완료. 초기화 시작...');
    
    // 게임 데이터 시스템 로드 확인
    if (!window.isGameDataLoaded() || !window.isQuestionsLoaded()) {
        console.error('❌ 게임 데이터 또는 질문 시스템이 로드되지 않았습니다.');
        showError('게임 시스템 로드 중 오류가 발생했습니다. 페이지를 새로고침해주세요.');
        disableControls('게임 시스템 로드 실패');
        return;
    }
    
    console.log('✅ 게임 시스템 로드 확인 완료.');
    if (loadHostData()) {
        initializeCanvas();
        initializePlayerScores();
        setupEventListeners();
        // 게임 자동 시작
        if (inviteCode) {
            startGame();
        }
        console.log('=== host-game.html 초기화 완료 ===');
    } else {
        console.error('❌ 데이터 로드 실패로 초기화 중단');
    }
});

// 호스트 데이터 로드
function loadHostData() {
    console.log('호스트 데이터 로드 시작...');
    
    // 초대 코드 유효성 검사
    const savedCode = localStorage.getItem('inviteCode') || localStorage.getItem('hostCode') || '';
    if (!savedCode || savedCode.length !== 4 || !/^[A-Z]{4}$/.test(savedCode)) {
        console.error('❌ 유효하지 않은 초대 코드:', savedCode);
        showError('유효하지 않은 초대 코드입니다. 게임을 다시 시작해주세요.');
        disableControls('유효하지 않은 초대 코드');
        return false;
    }
    inviteCode = savedCode;
    
    // 총 플레이어 수 및 기타 데이터 유효성 검사
    totalPlayers = parseInt(localStorage.getItem('totalPlayers')) || 4;
    if (totalPlayers < 2 || totalPlayers > 17) {
        console.warn('❌ 유효하지 않은 플레이어 수, 기본값 사용:', totalPlayers);
        totalPlayers = 4;
    }
    
    fakerCount = parseInt(localStorage.getItem('fakerCount')) || 1;
    if (fakerCount < 1 || fakerCount >= totalPlayers) {
        console.warn('❌ 유효하지 않은 라이어 수, 기본값 사용:', fakerCount);
        fakerCount = 1;
    }
    
    currentGame = parseInt(localStorage.getItem('currentGame')) || 1;
    if (currentGame < 1 || currentGame > maxGames) {
        console.warn('❌ 유효하지 않은 게임 번호, 기본값 사용:', currentGame);
        currentGame = 1;
    }
    
    currentRound = parseInt(localStorage.getItem('currentRound')) || 1;
    if (currentRound < 1 || currentRound > maxRounds) {
        console.warn('❌ 유효하지 않은 라운드 번호, 기본값 사용:', currentRound);
        currentRound = 1;
    }
    
    playerIndex = 0; // 호스트는 항상 0번 인덱스
    
    // 답변 상태 복원
    const savedAnswer = localStorage.getItem('hostAnswer');
    const savedDrawing = localStorage.getItem('hostDrawing');
    const savedSubmitted = localStorage.getItem('answerSubmitted') === 'true';
    if (savedSubmitted && (savedAnswer || savedDrawing)) {
        answerSubmitted = true;
        submittedAnswer = savedAnswer || '';
        submittedDrawing = savedDrawing || null;
    }
    
    // 플레이어 코드 정보 로드
    const savedCodes = localStorage.getItem('allPlayerCodes');
    if (savedCodes) {
        try {
            const playerCodeArray = JSON.parse(savedCodes);
            playerCodes = {};
            for (let i = 0; i < playerCodeArray.length; i++) {
                playerCodes[`플레이어${i + 1}`] = playerCodeArray[i];
            }
            playerCodes['호스트'] = inviteCode;
        } catch (error) {
            console.warn('❌ 플레이어 코드 정보 복원 실패:', error);
            playerCodes = { '호스트': inviteCode };
        }
    }
    
    localStorage.setItem('playerIndex', '0'); // 호스트 정보 저장
    console.log('✅ 호스트 데이터 로드 완료:', {
        inviteCode,
        currentGame,
        currentRound,
        totalPlayers,
        fakerCount,
        playerIndex: 0,
        role: '호스트'
    });
    return true;
}

// 데이터 유효성 검사 실패 시 컨트롤 비활성화
function disableControls(reason) {
    console.warn('컨트롤 비활성화:', reason);
    const container = document.querySelector('.container') || document.body;
    if (container) {
        container.style.pointerEvents = 'none';
        container.style.opacity = '0.6';
    }
    showError('게임 진행이 중단되었습니다. 페이지를 새로고침하거나 처음부터 다시 시작해주세요.');
}

// 에러 메시지 표시
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.background = '#fed7d7';
    errorDiv.style.color = '#c53030';
    errorDiv.style.padding = '15px';
    errorDiv.style.margin = '10px 0';
    errorDiv.style.borderRadius = '8px';
    errorDiv.style.textAlign = 'center';
    errorDiv.style.position = 'fixed';
    errorDiv.style.top = '20px';
    errorDiv.style.left = '50%';
    errorDiv.style.transform = 'translateX(-50%)';
    errorDiv.style.zIndex = '1000';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    console.error('❌ 에러 메시지 표시:', message);
}

// 플레이어 점수 초기화
function initializePlayerScores() {
    const savedScores = localStorage.getItem('playerScores');
    if (savedScores) {
        try {
            playerScores = JSON.parse(savedScores);
        } catch (error) {
            console.warn('❌ 저장된 점수 복원 실패, 기본값 사용:', error);
            initializeDefaultScores();
        }
    } else {
        initializeDefaultScores();
    }
}

function initializeDefaultScores() {
    playerScores = {};
    for (let i = 1; i < totalPlayers; i++) {
        playerScores[`플레이어${i}`] = 0;
    }
    playerScores['호스트'] = 0;
}

// 캔버스 초기화
function initializeCanvas() {
    canvas = document.getElementById('drawingCanvas');
    if (!canvas) {
        console.warn('❌ 캔버스 요소를 찾을 수 없습니다.');
        return;
    }
    
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
    console.log('✅ 캔버스 초기화 완료');
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
    canvas.addEventListener('touchstart', handleTouch, { passive: false });
    canvas.addEventListener('touchmove', handleTouch, { passive: false });
    canvas.addEventListener('touchend', stopDrawing);
    console.log('✅ 캔버스 이벤트 설정 완료');
}

// 이벤트 리스너 설정
function setupEventListeners() {
    console.log('이벤트 리스너 설정 시작...');
    
    // 게임 컨트롤 관련
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', submitAnswer);
        console.log('✅ 제출 버튼 이벤트 리스너 설정 완료');
    } else {
        console.warn('❌ submitBtn 요소 없음');
    }
    
    const editAnswerBtn = document.getElementById('editAnswerBtn');
    if (editAnswerBtn) {
        editAnswerBtn.addEventListener('click', editAnswer);
        console.log('✅ 답변 수정 버튼 이벤트 리스너 설정 완료');
    } else {
        console.warn('❌ editAnswerBtn 요소 없음');
    }
    
    const goToAnswerBtn = document.getElementById('goToAnswerBtn');
    if (goToAnswerBtn) {
        goToAnswerBtn.addEventListener('click', goToAnswer);
        console.log('✅ 답변 공개 버튼 이벤트 리스너 설정 완료');
    } else {
        console.warn('❌ goToAnswerBtn 요소 없음');
    }
    
    const nextRoundBtn = document.getElementById('next-round-btn');
    if (nextRoundBtn) {
        nextRoundBtn.addEventListener('click', nextRound);
        console.log('✅ 다음 라운드 버튼 이벤트 리스너 설정 완료');
    } else {
        console.warn('❌ next-round-btn 요소 없음');
    }
    
    const nextGameBtn = document.getElementById('next-game-btn');
    if (nextGameBtn) {
        nextGameBtn.addEventListener('click', nextGame);
        console.log('✅ 다음 게임 버튼 이벤트 리스너 설정 완료');
    } else {
        console.warn('❌ next-game-btn 요소 없음');
    }
    
    // 호스트 전용 기능
    const fakerGiveUpBtn = document.getElementById('faker-give-up-btn');
    if (fakerGiveUpBtn) {
        fakerGiveUpBtn.addEventListener('click', handleFakerGiveUp);
        console.log('✅ 라이어 포기 버튼 이벤트 리스너 설정 완료');
    } else {
        console.warn('❌ faker-give-up-btn 요소 없음');
    }
    
    const revealFakerBtn = document.getElementById('reveal-faker-btn');
    if (revealFakerBtn) {
        revealFakerBtn.addEventListener('click', handleRevealFaker);
        console.log('✅ 라이어 공개 버튼 이벤트 리스너 설정 완료');
    } else {
        console.warn('❌ reveal-faker-btn 요소 없음');
    }
    
    const endGameBtn = document.getElementById('end-game-btn');
    if (endGameBtn) {
        endGameBtn.addEventListener('click', showEndGameModal);
        console.log('✅ 게임 종료 버튼 이벤트 리스너 설정 완료');
    } else {
        console.warn('❌ end-game-btn 요소 없음');
    }
    
    // 그림 도구 관련
    document.querySelectorAll('.color-btn')?.forEach(btn => {
        btn.addEventListener('click', () => changeColor(btn.dataset.color));
    });
    const clearCanvasBtn = document.getElementById('clearCanvas');
    if (clearCanvasBtn) {
        clearCanvasBtn.addEventListener('click', clearCanvas);
    }
    const brushSizeInput = document.getElementById('brushSize');
    if (brushSizeInput) {
        brushSizeInput.addEventListener('input', changeBrushSize);
    }
    
    // 모달 관련
    setupModalEventListeners();
    console.log('✅ 이벤트 리스너 설정 완료');
}

// 모달 이벤트 리스너 설정
function setupModalEventListeners() {
    console.log('모달 이벤트 리스너 설정 시작...');
    
    const cancelGiveUp = document.getElementById('cancelGiveUp');
    if (cancelGiveUp) {
        cancelGiveUp.addEventListener('click', () => closeModal('giveUpModal'));
    }
    const confirmGiveUp = document.getElementById('confirmGiveUp');
    if (confirmGiveUp) {
        confirmGiveUp.addEventListener('click', confirmFakerGiveUp);
    }
    const cancelReveal1 = document.getElementById('cancelReveal1');
    if (cancelReveal1) {
        cancelReveal1.addEventListener('click', () => closeModal('revealModal1'));
    }
    const confirmReveal1 = document.getElementById('confirmReveal1');
    if (confirmReveal1) {
        confirmReveal1.addEventListener('click', showSecondRevealModal);
    }
    const cancelReveal2 = document.getElementById('cancelReveal2');
    if (cancelReveal2) {
        cancelReveal2.addEventListener('click', () => closeModal('revealModal2'));
    }
    const confirmReveal2 = document.getElementById('confirmReveal2');
    if (confirmReveal2) {
        confirmReveal2.addEventListener('click', confirmRevealFaker);
    }
    const closePlayerInfo = document.getElementById('closePlayerInfo');
    if (closePlayerInfo) {
        closePlayerInfo.addEventListener('click', () => closeModal('playerInfoModal'));
    }
    const cancelEndGame = document.getElementById('cancelEndGame');
    if (cancelEndGame) {
        cancelEndGame.addEventListener('click', () => closeModal('endGameModal'));
    }
    const confirmEndGame = document.getElementById('confirmEndGame');
    if (confirmEndGame) {
        confirmEndGame.addEventListener('click', endGame);
    }
    const restartBtn = document.getElementById('restartBtn');
    if (restartBtn) {
        restartBtn.addEventListener('click', restartGame);
    }
    const homeBtn = document.getElementById('homeBtn');
    if (homeBtn) {
        homeBtn.addEventListener('click', goHome);
    }
    console.log('✅ 모달 이벤트 리스너 설정 완료');
}

// 자동 진행 체크 함수
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
            localStorage.removeItem('autoNextRound');
            localStorage.removeItem('nextRoundNumber');
            localStorage.setItem('currentRound', currentRound.toString());
            console.log('✅ 호스트: 자동으로 다음 라운드 진행:', currentRound);
            console.log('✅ 이동 후 데이터 저장 완료:', { currentRound });
            return true;
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
            localStorage.removeItem('autoNextGame');
            localStorage.removeItem('nextGameNumber');
            localStorage.setItem('currentGame', currentGame.toString());
            localStorage.setItem('currentRound', currentRound.toString());
            console.log('✅ 호스트: 자동으로 다음 게임 진행:', currentGame);
            console.log('✅ 이동 후 데이터 저장 완료:', { currentGame, currentRound });
            return true;
        }
    }
    return false;
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
    console.log('✅ 게임 시작 - 게임:', currentGame, '라운드:', currentRound);
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
    if (gameCodeElement) gameCodeElement.textContent = inviteCode || '로딩 중...';
    console.log('✅ 게임 정보 업데이트 완료:', { currentGame, currentRound });
}

// 현재 게임에서의 역할 업데이트
function updatePlayerRole() {
    console.log('=== 호스트 역할 업데이트 ===');
    console.log('현재 데이터:', {
        inviteCode,
        currentGame,
        currentRound,
        playerIndex: 0,
        totalPlayers,
        fakerCount
    });
    
    try {
        // 라이어 여부 확인 (호스트 인덱스 0)
        const amILiar = window.isPlayerFaker(inviteCode, currentGame, 0);
        console.log('✅ 호스트 라이어 판별 결과:', amILiar);
        
        const roleCard = document.getElementById('roleCard');
        const roleIcon = document.getElementById('roleIcon');
        const roleName = document.getElementById('roleName');
        const hostRoleElement = document.getElementById('hostRole');
        
        if (amILiar) {
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
        console.log(`✅ 게임${currentGame} 라운드${currentRound} - 호스트(인덱스 0) 라이어 여부:`, amILiar);
    } catch (error) {
        console.error('❌ 호스트 역할 업데이트 오류:', error);
        const roleName = document.getElementById('roleName');
        if (roleName) {
            roleName.textContent = '역할 확인 중...';
        }
    }
}

// 질문 표시
function showQuestion() {
    try {
        // 현재 게임에서 라이어 여부 확인 (호스트 인덱스 0)
        const amILiar = window.isPlayerFaker(inviteCode, currentGame, 0);
        
        // 현재 라운드의 질문 번호 가져오기
        const questionNumber = window.getQuestionForRound(inviteCode, currentGame, currentRound);
        const questionData = window.getQuestionByNumber(questionNumber);
        
        if (!questionData) {
            console.error('❌ 질문을 찾을 수 없습니다. 질문 번호:', questionNumber);
            showError('질문을 불러오는 중 오류가 발생했습니다.');
            return;
        }
        
        // 호스트가 라이어인 경우 fake 질문 선택
        let questionText;
        if (amILiar) {
            questionText = questionData.fake;
        } else {
            questionText = questionData.main;
        }
        
        // HTML 요소들 안전하게 가져오기
        const questionSection = document.querySelector('.question-section');
        const questionMode = document.getElementById('questionMode');
        const hostQuestion = document.getElementById('hostQuestion');
        
        if (questionSection) {
            questionSection.style.display = 'block';
        }
        if (questionMode) {
            const questionInfo = window.parseQuestionNumber(questionNumber);
            questionMode.textContent = questionInfo.typeName;
        }
        if (hostQuestion) {
            hostQuestion.textContent = questionText;
        }
        
        // 문제 유형에 따라 입력 방식 변경
        const questionInfo = window.parseQuestionNumber(questionNumber);
        setupAnswerInput(questionInfo.type);
        
        console.log('✅ 호스트 질문 표시 완료:', {
            game: currentGame,
            round: currentRound,
            isFaker: amILiar,
            hostIndex: 0,
            originalQuestion: questionNumber,
            questionType: questionInfo.type,
            questionText: questionText
        });
    } catch (error) {
        console.error('❌ 질문 표시 중 오류:', error);
        showError('질문을 불러오는 중 오류가 발생했습니다.');
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
    console.log('✅ 답변 입력 방식 설정 완료:', questionType === 2 ? '그림형' : '텍스트형');
}

// 답변 입력 표시
function showAnswerInput() {
    const inputSection = document.querySelector('.input-section');
    if (inputSection) {
        inputSection.style.display = 'block';
        console.log('✅ 답변 입력 섹션 표시됨');
    } else {
        console.warn('❌ input-section 요소 없음');
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
        console.log('✅ 답변 공개 버튼 표시됨');
    } else if (goToAnswerBtn) {
        goToAnswerBtn.style.display = 'none';
        console.log('❌ 답변 공개 버튼 숨김 (답변 미제출)');
    }
    
    if (currentRound < maxRounds && nextRoundBtn) {
        nextRoundBtn.style.display = 'block';
        console.log('✅ 다음 라운드 버튼 표시됨');
    } else if (nextRoundBtn) {
        nextRoundBtn.style.display = 'none';
        console.log('❌ 다음 라운드 버튼 숨김 (마지막 라운드)');
    }
    
    if (currentGame < maxGames && nextGameBtn) {
        nextGameBtn.style.display = 'block';
        console.log('✅ 다음 게임 버튼 표시됨');
    } else if (nextGameBtn) {
        nextGameBtn.style.display = 'none';
        console.log('❌ 다음 게임 버튼 숨김 (마지막 게임)');
    }
}

// 호스트 컨트롤 표시
function showHostControls() {
    const controlSection = document.querySelector('.control-section');
    if (controlSection) {
        controlSection.style.display = 'block';
        console.log('✅ 호스트 컨트롤 섹션 표시됨');
    } else {
        console.warn('❌ control-section 요소 없음');
    }
}

// 답변 제출
function submitAnswer() {
    console.log('답변 제출 시도 중...');
    const questionType = getCurrentQuestionType();
    let answer = '';
    let drawing = null;
    
    if (questionType === 2) { // 그림형
        if (canvas) {
            drawing = canvas.toDataURL();
            answer = '[그림 답변]';
            console.log('✅ 그림 답변 제출됨');
        } else {
            console.warn('❌ 캔버스 요소 없음, 그림 답변 제출 불가');
            showError('그림 입력을 위한 캔버스를 찾을 수 없습니다.');
            return;
        }
    } else { // 텍스트 답변
        const answerInput = document.getElementById('answerInput');
        if (answerInput) {
            answer = answerInput.value.trim();
            if (!answer) {
                console.warn('❌ 텍스트 답변이 비어 있음');
                alert('답변을 입력해주세요.');
                return;
            }
            console.log('✅ 텍스트 답변 제출됨:', answer);
        } else {
            console.warn('❌ answerInput 요소 없음');
            showError('답변 입력 필드를 찾을 수 없습니다.');
            return;
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
        console.log('✅ 답변 공개 버튼 표시됨');
    }
    
    // 호스트 데이터 저장
    localStorage.setItem('submittedAnswer', submittedAnswer);
    localStorage.setItem('answerType', questionType === 2 ? 'drawing' : 'text');
    if (submittedDrawing) {
        localStorage.setItem('submittedDrawing', submittedDrawing);
    } else {
        localStorage.removeItem('submittedDrawing');
    }
    localStorage.setItem('answerSubmitted', 'true');
    localStorage.setItem('playerIndex', '0');
    console.log('✅ 호스트 답변 제출 완료:', {
        answer: submittedAnswer,
        answerType: questionType === 2 ? 'drawing' : 'text',
        hostIndex: 0
    });
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
    localStorage.removeItem('submittedAnswer');
    localStorage.removeItem('answerType');
    localStorage.removeItem('submittedDrawing');
    localStorage.removeItem('answerSubmitted');
    console.log('✅ 호스트 답변 수정 모드 활성화');
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
            const submittedCtx = submittedCanvas.getContext('2d');
            const img = new Image();
            img.onload = function() {
                submittedCtx.clearRect(0, 0, submittedCanvas.width, submittedCanvas.height);
                submittedCtx.drawImage(img, 0, 0, submittedCanvas.width, submittedCanvas.height);
            };
            img.src = submittedDrawing;
            console.log('✅ 제출된 그림 표시됨');
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
        console.log('✅ 제출된 텍스트 표시됨:', submittedAnswer);
    }
}

// 현재 질문 유형 가져오기
function getCurrentQuestionType() {
    try {
        const questionNumber = window.getQuestionForRound(inviteCode, currentGame, currentRound);
        return Math.floor(questionNumber / 10);
    } catch (error) {
        console.error('❌ 질문 유형 가져오기 오류:', error);
        return 1; // 기본값
    }
}

// 답변 공개 페이지로 이동
function goToAnswer() {
    if (!answerSubmitted) {
        console.warn('❌ 답변 미제출로 이동 불가');
        alert('먼저 답변을 제출해주세요.');
        return;
    }
    
    // 호스트가 라이어인 경우 5초간 메인 질문 표시
    const amILiar = window.isPlayerFaker(inviteCode, currentGame, 0);
    if (amILiar) {
        showMainQuestionToFaker();
    } else {
        moveToAnswerPage();
    }
}

// 라이어에게 5초간 메인 질문 표시
function showMainQuestionToFaker() {
    try {
        const questionNumber = window.getQuestionForRound(inviteCode, currentGame, currentRound);
        const questionData = window.getQuestionByNumber(questionNumber);
        
        if (questionData) {
            const mainQuestionText = document.getElementById('mainQuestionText');
            const mainQuestionReveal = document.getElementById('mainQuestionReveal');
            const revealTimer = document.getElementById('revealTimer');
            
            if (mainQuestionText && mainQuestionReveal && revealTimer) {
                mainQuestionText.textContent = questionData.main;
                mainQuestionReveal.style.display = 'block';
                
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
                console.log('✅ 호스트 라이어에게 메인 질문 5초간 표시:', questionData.main);
            } else {
                console.warn('❌ 메인 질문 표시 요소를 찾을 수 없습니다.');
                moveToAnswerPage(); // 요소가 없으면 바로 이동
            }
        }
    } catch (error) {
        console.error('❌ 메인 질문 표시 중 오류:', error);
        moveToAnswerPage(); // 오류 시 바로 이동
    }
}

// answer.html로 이동
function moveToAnswerPage() {
    console.log('답변 페이지로 이동 시도 중...');
    
    // 저장할 데이터 준비
    const answerType = submittedDrawing ? 'drawing' : 'text';
    const playerId = 0; // 호스트는 항상 0
    
    // localStorage에 데이터 저장
    localStorage.setItem('submittedAnswer', submittedAnswer);
    localStorage.setItem('answerType', answerType);
    if (submittedDrawing) {
        localStorage.setItem('submittedDrawing', submittedDrawing);
    } else {
        localStorage.removeItem('submittedDrawing');
    }
    localStorage.setItem('inviteCode', inviteCode);
    localStorage.setItem('playerIndex', playerId.toString());
    localStorage.setItem('currentRound', currentRound.toString());
    localStorage.setItem('currentGame', currentGame.toString());
    
    console.log('✅ 호스트 데이터 저장 완료:', {
        submittedAnswer,
        answerType,
        inviteCode,
        playerIndex: playerId,
        currentRound,
        currentGame
    });
    
    // answer.html로 이동 (쿼리 파라미터 통일)
    window.location.href = `answer.html?from=player${playerId}`;
}

// 다음 라운드
function nextRound() {
    if (currentRound < maxRounds) {
        currentRound++;
        resetRoundState();
        updateGameInfo();
        updatePlayerRole(); // 새로운 라운드에서 역할 재확인
        showQuestion();
        localStorage.setItem('currentRound', currentRound.toString());
        console.log('✅ 다음 라운드로 진행 (호스트):', currentRound);
        console.log('✅ 이동 전 데이터 저장 완료:', {
            currentRound
        });
    } else {
        highlightNextGameButton();
        console.log('❌ 마지막 라운드 - 다음 게임 버튼 강조');
    }
}

// 다음 게임
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
        console.log('✅ 다음 게임으로 진행 (호스트):', currentGame);
        console.log('✅ 이동 전 데이터 저장 완료:', {
            currentGame,
            currentRound
        });
    } else {
        showEndGameModal();
        console.log('❌ 마지막 게임 - 게임 종료 모달 표시');
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
    localStorage.removeItem('submittedAnswer');
    localStorage.removeItem('answerType');
    localStorage.removeItem('submittedDrawing');
    localStorage.removeItem('answerSubmitted');
    console.log('✅ 라운드 상태 초기화 완료');
}

// 다음 게임 버튼 강조
function highlightNextGameButton() {
    const nextGameBtn = document.getElementById('next-game-btn');
    if (nextGameBtn && nextGameBtn.style.display !== 'none') {
        nextGameBtn.classList.add('pulse-highlight-strong');
        setTimeout(() => {
            nextGameBtn.classList.remove('pulse-highlight-strong');
        }, 3000);
        console.log('✅ 마지막 라운드 - 다음 게임 버튼 강조');
    } else {
        const endGameBtn = document.getElementById('end-game-btn');
        if (endGameBtn) {
            endGameBtn.classList.add('pulse-highlight');
            setTimeout(() => {
                endGameBtn.classList.remove('pulse-highlight');
            }, 3000);
        }
        console.log('✅ 마지막 라운드 - 게임 종료 버튼 강조');
    }
}

// === 호스트 전용 기능들 ===

// 점수 섹션 업데이트
function updateScoreSection() {
    const scoreGrid = document.getElementById('scoreGrid');
    if (!scoreGrid) {
        console.warn('❌ scoreGrid 요소 없음');
        return;
    }
    
    scoreGrid.innerHTML = '';
    Object.keys(playerScores).forEach(playerName => {
        const scoreCard = createScoreCard(playerName, playerScores[playerName]);
        scoreGrid.appendChild(scoreCard);
    });
    console.log('✅ 점수 섹션 업데이트 완료');
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
    console.log(`✅ 점수 변경: ${playerName} = ${playerScores[playerName]}`);
}

// 페이커 포기 처리
function handleFakerGiveUp() {
    if (!fakerGaveUp) {
        showModal('giveUpModal');
        console.log('✅ 라이어 포기 모달 표시');
    } else {
        console.log('❌ 이미 라이어가 포기함');
    }
}

function confirmFakerGiveUp() {
    fakerGaveUp = true;
    const giveUpBtn = document.getElementById('faker-give-up-btn');
    if (giveUpBtn) {
        giveUpBtn.textContent = '🏳️ 페이커가 포기했습니다';
        giveUpBtn.style.background = 'linear-gradient(135deg, #22c55e, #15803d)';
        giveUpBtn.disabled = true;
        console.log('✅ 라이어 포기 확인됨');
    }
    closeModal('giveUpModal');
}

// 페이커 공개 처리
function handleRevealFaker() {
    showModal('revealModal1');
    console.log('✅ 라이어 공개 모달 1 표시');
}

function showSecondRevealModal() {
    closeModal('revealModal1');
    showModal('revealModal2');
    console.log('✅ 라이어 공개 모달 2 표시');
}

function confirmRevealFaker() {
    showPlayerInfo();
    closeModal('revealModal2');
    console.log('✅ 라이어 공개 확인됨');
}

// 플레이어 정보 표시
function showPlayerInfo() {
    const playerInfoList = document.getElementById('playerInfoList');
    if (!playerInfoList) {
        console.warn('❌ playerInfoList 요소 없음');
        return;
    }
    
    playerInfoList.innerHTML = '';
    
    // 호스트 정보 먼저 표시 (인덱스 0)
    const hostIsFaker = window.isPlayerFaker(inviteCode, currentGame, 0);
    const hostDiv = document.createElement('div');
    hostDiv.className = 'player-info-item';
    hostDiv.innerHTML = `
        <div class="player-info-left">
            <span class="player-info-name">호스트</span>
            <span class="player-info-code">(${inviteCode})</span>
        </div>
        <span class="player-info-role ${hostIsFaker ? 'faker' : 'normal'}">
            ${hostIsFaker ? '라이어' : '일반 플레이어'}
        </span>
    `;
    playerInfoList.appendChild(hostDiv);
    
    // 플레이어들 정보 표시 (인덱스 1부터)
    if (playerCodes) {
        Object.keys(playerCodes).forEach((playerName) => {
            if (playerName !== '호스트') {
                const code = playerCodes[playerName];
                const playerNumber = parseInt(playerName.replace('플레이어', ''));
                const playerIndex = playerNumber; // 플레이어1 = 인덱스1
                const isFaker = window.isPlayerFaker(code, currentGame, playerIndex);
                const playerDiv = document.createElement('div');
                playerDiv.className = 'player-info-item';
                playerDiv.innerHTML = `
                    <div class="player-info-left">
                        <span class="player-info-name">${playerName}</span>
                        <span class="player-info-code">(${code})</span>
                    </div>
                    <span class="player-info-role ${isFaker ? 'faker' : 'normal'}">
                        ${isFaker ? '라이어' : '일반 플레이어'}
                    </span>
                `;
                playerInfoList.appendChild(playerDiv);
            }
        });
    }
    showModal('playerInfoModal');
    console.log('✅ 플레이어 정보 표시됨');
}

// 게임 종료 모달 표시
function showEndGameModal() {
    showFinalScores();
    showModal('endGameModal');
    console.log('✅ 게임 종료 모달 표시');
}

// 최종 점수 표시
function showFinalScores() {
    const finalScores = document.getElementById('finalScores');
    if (!finalScores) {
        console.warn('❌ finalScores 요소 없음');
        return;
    }
    
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
    console.log('✅ 최종 점수 표시됨');
}

// 게임 종료
function endGame() {
    // 최종 데이터 저장
    localStorage.setItem('gameEndRound', currentRound.toString());
    localStorage.setItem('gameEndGame', currentGame.toString());
    localStorage.setItem('playerIndex', '0');
    console.log('✅ 호스트 게임 종료 데이터 저장 완료');
    console.log('✅ gameover.html로 이동');
    window.location.href = 'gameover.html';
}

// 게임 재시작
function restartGame() {
    localStorage.clear();
    console.log('✅ 데이터 초기화 후 host.html로 이동');
    window.location.href = 'host.html';
}

// 홈으로 이동
function goHome() {
    localStorage.clear();
    console.log('✅ 데이터 초기화 후 index.html로 이동');
    window.location.href = 'index.html';
}

// === 그림 그리기 관련 함수들 ===

function startDrawing(e) {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
    console.log('✅ 그리기 시작:', { x, y });
}

function draw(e) {
    if (!isDrawing) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.stroke();
}

function stopDrawing() {
    isDrawing = false;
    ctx.closePath();
    console.log('✅ 그리기 중단');
}

function handleTouch(e) {
    e.preventDefault();
    if (e.type === 'touchstart') {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        ctx.beginPath();
        ctx.moveTo(x, y);
        console.log('✅ 터치 그리기 시작:', { x, y });
    } else if (e.type === 'touchmove' && isDrawing) {
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        ctx.lineTo(x, y);
        ctx.stroke();
    }
}

function changeColor(color) {
    currentColor = color;
    ctx.strokeStyle = color;
    console.log('✅ 색상 변경:', color);
    
    // 버튼 스타일 업데이트
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.classList.remove('selected');
        if (btn.dataset.color === color) {
            btn.classList.add('selected');
        }
    });
}

function changeBrushSize(e) {
    currentBrushSize = parseInt(e.target.value);
    ctx.lineWidth = currentBrushSize;
    console.log('✅ 브러쉬 크기 변경:', currentBrushSize);
}

function clearCanvas() {
    if (canvas && ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        console.log('✅ 캔버스 초기화됨');
    }
}

// === 모달 관련 함수들 ===

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.transition = 'opacity 0.3s ease';
            modal.style.opacity = '1';
        }, 10);
        console.log(`✅ 모달 표시됨: ${modalId}`);
    } else {
        console.warn(`❌ 모달 요소 없음: ${modalId}`);
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
            modal.style.transition = '';
        }, 300);
        console.log(`✅ 모달 닫힘: ${modalId}`);
    } else {
        console.warn(`❌ 모달 요소 없음: ${modalId}`);
    }
}


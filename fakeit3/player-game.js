// 게임 데이터 전역 변수
let playerCode = '';
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
let playerIndex = 1; // ✅ 플레이어는 1부터 시작 (0은 호스트 전용)
let voteData = []; // 투표 데이터 배열
// 그림 그리기 변수
let canvas, ctx;
let isDrawing = false;
let currentColor = '#000000';
let currentBrushSize = 3;

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 게임 데이터 시스템 로드 확인
    if (!window.isGameDataLoaded() || !window.isQuestionsLoaded()) {
        console.error('게임 데이터 또는 질문 시스템이 로드되지 않았습니다.');
        showError('게임 시스템 로드 중 오류가 발생했습니다. 페이지를 새로고침해주세요.');
        return;
    }
    initializeVoteData();
    initializeCanvas();
    checkExistingGame();
    setupEventListeners();
});

// 캔버스 초기화
function initializeCanvas() {
    canvas = document.getElementById('drawingCanvas');
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

// URL 파라미터 처리
function checkURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const dataParam = urlParams.get('data');
    
    if (dataParam) {
        try {
            const playerData = JSON.parse(decodeURIComponent(dataParam));
            console.log('URL에서 받은 플레이어 데이터:', playerData);
            
            if (playerData.playerCode || playerData.code) {
                const code = playerData.playerCode || playerData.code;
                currentGame = playerData.gameNumber || 1;
                
                // ✅ joinGame에서 playerIndex 처리
                joinGame(code, false); // false: URL에서 온 것
                return true;
            }
        } catch (error) {
            console.error('URL 파라미터 파싱 오류:', error);
        }
    }
    return false;
}

// 기존 게임 확인
function checkExistingGame() {
    if (checkURLParams()) {
        return;
    }
    
    const savedCode = localStorage.getItem('inviteCode') || localStorage.getItem('playerCode');
    if (savedCode) {
        playerCode = savedCode;
        totalPlayers = parseInt(localStorage.getItem('totalPlayers')) || 4;
        fakerCount = parseInt(localStorage.getItem('fakerCount')) || 1;
        currentGame = parseInt(localStorage.getItem('currentGame')) || 1;
        currentRound = parseInt(localStorage.getItem('currentRound')) || 1;
        
        // ✅ 저장된 플레이어 인덱스 복원 (1 이상만)
        const savedIndex = parseInt(localStorage.getItem('playerIndex'));
        if (savedIndex >= 1 && savedIndex < totalPlayers) {
            playerIndex = savedIndex;
        } else {
            playerIndex = 1; // 기본값
        }
        
        joinGame(savedCode, false);
    }
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 코드 입력 관련
    document.getElementById('inviteCode').addEventListener('input', handleCodeInput);
    document.getElementById('inviteCode').addEventListener('keypress', handleKeyPress);
    document.getElementById('joinBtn').addEventListener('click', handleJoinGame);
    
    // 게임 컨트롤 관련
    document.getElementById('startGameBtn').addEventListener('click', startGame);
    document.getElementById('submitAnswerBtn').addEventListener('click', submitAnswer);
    document.getElementById('editAnswerBtn').addEventListener('click', editAnswer);
    document.getElementById('goToAnswerBtn').addEventListener('click', goToAnswer);
    document.getElementById('nextRoundBtn').addEventListener('click', nextRound);
    document.getElementById('nextGameBtn').addEventListener('click', nextGame);
    document.getElementById('endGameBtn').addEventListener('click', showEndGameModal);
    
    // 그림 도구 관련
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', () => changeColor(btn.dataset.color));
    });
    document.getElementById('clearCanvas').addEventListener('click', clearCanvas);
    document.getElementById('brushSize').addEventListener('input', changeBrushSize);
    
    // 모달 관련
    document.getElementById('closeError').addEventListener('click', () => closeModal('errorModal'));
    document.getElementById('cancelEndGame').addEventListener('click', () => closeModal('endGameModal'));
    document.getElementById('confirmEndGame').addEventListener('click', endGame);
}

// 코드 입력 처리
function handleCodeInput(event) {
    const input = event.target;
    input.value = input.value.toUpperCase().replace(/[^A-Z]/g, '');
    
    const joinBtn = document.getElementById('joinBtn');
    joinBtn.disabled = input.value.length !== 4;
}

// 엔터키 처리
function handleKeyPress(event) {
    if (event.key === 'Enter' && !document.getElementById('joinBtn').disabled) {
        handleJoinGame();
    }
}

// 게임 참여 처리
function handleJoinGame() {
    const code = document.getElementById('inviteCode').value.trim();
    if (code.length === 4) {
        joinGame(code, true);
    }
}

// 게임 참여 (인덱스 범위 수정된 버전)
function joinGame(code, isNewJoin = true) {
    if (!validateCode(code)) {
        if (isNewJoin) {
            showError('잘못된 초대코드입니다. 4자리 영문을 입력해주세요.');
        }
        return;
    }
    
    try {
        playerCode = code;
        
        // 새로운 gameData.js로 데이터 검증 및 추출
        const gameInfo = window.getGameInfoFromCode(code);
        if (!gameInfo) {
            if (isNewJoin) {
                showError('초대코드를 해석할 수 없습니다.');
            }
            return;
        }
        
        // 게임 정보 설정
        totalPlayers = gameInfo.totalPlayers;
        fakerCount = gameInfo.fakerCount;
        
        // ✅ 플레이어 인덱스 설정 (1부터 시작, 0은 호스트 전용)
        let finalPlayerIndex = null;
        
        // 1순위: URL 파라미터에서 받은 값 (join.js에서 온 경우)
        const urlParams = new URLSearchParams(window.location.search);
        const dataParam = urlParams.get('data');
        if (dataParam) {
            try {
                const playerData = JSON.parse(decodeURIComponent(dataParam));
                if (playerData.playerIndex !== undefined) {
                    const receivedIndex = playerData.playerIndex;
                    // ✅ 플레이어 인덱스 유효성 검증 (1 이상, totalPlayers 미만)
                    if (receivedIndex >= 1 && receivedIndex < totalPlayers) {
                        finalPlayerIndex = receivedIndex;
                        console.log('✅ URL에서 받은 올바른 playerIndex 사용:', finalPlayerIndex);
                    } else {
                        console.warn('잘못된 플레이어 인덱스:', receivedIndex, '(유효 범위: 1~' + (totalPlayers-1) + ')');
                    }
                }
            } catch (error) {
                console.error('URL 파라미터 파싱 실패:', error);
            }
        }
        
        // 2순위: localStorage 저장된 값 (기존 게임 복원하는 경우만)
        if (finalPlayerIndex === null && !isNewJoin) {
            const savedPlayerIndex = localStorage.getItem('playerIndex');
            if (savedPlayerIndex !== null) {
                const saved = parseInt(savedPlayerIndex);
                // ✅ 플레이어는 1 이상만 허용 (0은 호스트)
                if (saved >= 1 && saved < totalPlayers) {
                    finalPlayerIndex = saved;
                    console.log('✅ 저장된 playerIndex 복원:', finalPlayerIndex);
                } else {
                    console.warn('저장된 플레이어 인덱스가 잘못됨:', saved);
                }
            }
        }
        
        // 3순위: 랜덤 생성 (1부터 totalPlayers-1까지)
        if (finalPlayerIndex === null) {
            // ✅ 1부터 totalPlayers-1까지 랜덤 (0은 호스트 전용)
            finalPlayerIndex = Math.floor(Math.random() * (totalPlayers - 1)) + 1;
            console.log('✅ 랜덤 생성된 playerIndex:', finalPlayerIndex);
        }
        
        // 최종 설정
        playerIndex = finalPlayerIndex;
        
        console.log('플레이어 게임 참여:', {
            playerCode,
            playerIndex, // ✅ 1 이상의 값
            totalPlayers,
            fakerCount,
            currentGame,
            currentRound,
            role: `플레이어 ${playerIndex}`
        });
        
        // 데이터 저장 (새로운 값으로)
        localStorage.setItem('inviteCode', code);
        localStorage.setItem('playerCode', code);
        localStorage.setItem('playerIndex', playerIndex.toString()); // ✅ 1 이상 저장
        localStorage.setItem('totalPlayers', totalPlayers.toString());
        localStorage.setItem('fakerCount', fakerCount.toString());
        localStorage.setItem('currentGame', currentGame.toString());
        localStorage.setItem('currentRound', currentRound.toString());
        localStorage.setItem('isHost', 'false'); // ✅ 플레이어는 호스트가 아님
        
        // UI 전환
        document.getElementById('codeInputSection').style.display = 'none';
        document.getElementById('gameMainSection').style.display = 'block';
        document.getElementById('playerCode').textContent = code;
        
        // 게임 정보 업데이트
        updateGameInfo();
        
        // 현재 게임에서 역할 확인 및 표시
        updatePlayerRole();
        
        // 게임 상태에 따라 UI 업데이트
        updateGameUI();
        
        // 자동 진행 체크
        checkAutoProgression();
        
        // 기존 게임 상태가 없으면 바로 게임 시작
        if (!answerSubmitted) {
            startGame();
        }
        
    } catch (error) {
        console.error('게임 참여 중 오류:', error);
        if (isNewJoin) {
            showError('게임 참여 중 오류가 발생했습니다: ' + error.message);
        }
    }
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
            
            console.log('플레이어: 자동으로 다음 라운드 진행:', currentRound);
            
            // 플래그 제거
            localStorage.removeItem('autoNextRound');
            localStorage.removeItem('nextRoundNumber');
            localStorage.setItem('currentRound', currentRound.toString());
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
            
            console.log('플레이어: 자동으로 다음 게임 진행:', currentGame);
            
            // 플래그 제거
            localStorage.removeItem('autoNextGame');
            localStorage.removeItem('nextGameNumber');
            localStorage.setItem('currentGame', currentGame.toString());
            localStorage.setItem('currentRound', currentRound.toString());
            return true;
        }
    }
    
    return false;
}

// 게임 정보 업데이트
function updateGameInfo() {
    document.getElementById('gameNumber').textContent = currentGame;
    document.getElementById('roundNumber').textContent = currentRound;
    document.getElementById('roundTotal').textContent = `/${maxRounds}`;
}

// 현재 게임에서의 역할 업데이트
function updatePlayerRole() {
    try {
        console.log('=== 플레이어 역할 업데이트 ===');
        console.log('현재 데이터:', {
            playerCode,
            currentGame,
            currentRound,
            playerIndex, // ✅ 1 이상의 값
            totalPlayers,
            fakerCount
        });
        
        // ✅ 라이어 여부 확인 (올바른 인덱스 사용)
        const isPlayerFaker = window.isPlayerFaker(playerCode, currentGame, playerIndex);
        console.log('라이어 판별 결과:', isPlayerFaker);
        
        // ✅ 추가 검증: 라이어 목록 전체 출력
        const allFakers = window.getFakersForGame(playerCode, currentGame);
        console.log('게임', currentGame, '전체 라이어 목록:', allFakers);
        console.log('내 플레이어 인덱스', playerIndex, '가 라이어 목록에 포함?', allFakers.includes(playerIndex));
        
        const roleCard = document.getElementById('roleCard');
        const roleIcon = document.getElementById('roleIcon');
        const roleName = document.getElementById('roleName');
        const fakerInfoSection = document.getElementById('fakerInfoSection');
        
        if (isPlayerFaker) {
            roleCard.className = 'role-card faker';
            roleIcon.textContent = '🎭';
            roleName.textContent = '라이어';
            roleName.className = 'role-name faker';
            fakerInfoSection.style.display = 'block';
            console.log('🎭 라이어로 설정됨');
        } else {
            roleCard.className = 'role-card normal';
            roleIcon.textContent = '👤';
            roleName.textContent = '일반 플레이어';
            roleName.className = 'role-name normal';
            fakerInfoSection.style.display = 'none';
            console.log('👤 일반 플레이어로 설정됨');
        }
        
        console.log(`게임${currentGame} 라운드${currentRound} - 플레이어${playerIndex} 라이어 여부:`, isPlayerFaker);
        
    } catch (error) {
        console.error('플레이어 역할 업데이트 오류:', error);
        const roleName = document.getElementById('roleName');
        if (roleName) {
            roleName.textContent = '역할 확인 중...';
        }
    }
}

// 코드 검증
function validateCode(code) {
    return /^[A-Z]{4}$/.test(code);
}

// 게임 시작
function startGame() {
    gameStarted = true;
    
    // 대기 관련 UI 숨기기
    document.getElementById('waitingSection').style.display = 'none';
    document.getElementById('startGameBtn').style.display = 'none';
    
    showQuestion();
    showAnswerInput();
    showGameControls();
    
    console.log('게임 바로 시작됨 - 게임:', currentGame, '라운드:', currentRound);
}

// 질문 표시
// 질문 표시 (수정된 버전)
function showQuestion() {
    try {
        // 현재 게임에서 라이어 여부 확인
        const isPlayerFaker = window.isPlayerFaker(playerCode, currentGame, playerIndex);
        
        // 현재 라운드의 질문 번호 가져오기
        const questionNumber = window.getQuestionForRound(playerCode, currentGame, currentRound);
        
        // ✅ 질문 내용 가져오기 (올바른 로직)
        const questionData = window.getQuestionByNumber(questionNumber);
        
        if (!questionData) {
            console.error('질문을 찾을 수 없습니다. 질문 번호:', questionNumber);
            return;
        }
        
        // ✅ 라이어 여부에 따라 올바른 질문 텍스트 선택
        let questionText;
        if (isPlayerFaker) {
            questionText = questionData.fake; // 라이어는 fake 질문
        } else {
            questionText = questionData.main; // 일반 플레이어는 main 질문
        }
        
        document.getElementById('questionSection').style.display = 'block';
        
        // ✅ 문제 유형은 원래 질문의 유형 사용
        const questionInfo = window.parseQuestionNumber(questionNumber);
        document.getElementById('questionMode').textContent = questionInfo.typeName;
        document.getElementById('questionText').textContent = questionText;
        
        // 문제 유형에 따라 입력 방식 변경 (원래 유형 기준)
        setupAnswerInput(questionInfo.type);
        
        console.log('질문 표시 완료:', {
            game: currentGame,
            round: currentRound,
            isFaker: isPlayerFaker,
            playerIndex: playerIndex,
            questionNumber: questionNumber,
            questionType: questionInfo.type,
            questionText: questionText, // ✅ 라이어는 fake, 일반은 main
            isMainQuestion: !isPlayerFaker
        });
        
    } catch (error) {
        console.error('질문 표시 중 오류:', error);
        showError('질문을 불러오는 중 오류가 발생했습니다.');
    }
}


// 답변 입력 방식 설정
function setupAnswerInput(questionType) {
    const textContainer = document.getElementById('textInputContainer');
    const drawingContainer = document.getElementById('drawingContainer');
    
    if (questionType === 2) { // 그림형
        textContainer.style.display = 'none';
        drawingContainer.style.display = 'block';
        clearCanvas(); // 캔버스 초기화
    } else { // 입력형, 플레이어선택형, 이모티콘형
        textContainer.style.display = 'block';
        drawingContainer.style.display = 'none';
    }
}

// 답변 입력 표시
function showAnswerInput() {
    document.getElementById('answerInputSection').style.display = 'block';
}

// 게임 컨트롤 표시
function showGameControls() {
    document.getElementById('goToAnswerBtn').style.display = 'block';
    
    if (currentRound < maxRounds) {
        document.getElementById('nextRoundBtn').style.display = 'block';
    }
    
    if (currentGame < maxGames) {
        document.getElementById('nextGameBtn').style.display = 'block';
    }
    
    document.getElementById('endGameBtn').style.display = 'block';
}

// 답변 제출
function submitAnswer() {
    const questionType = getCurrentQuestionType();
    let answer = '';
    let drawing = null;
    
    if (questionType === 2) { // 그림형
        drawing = canvas.toDataURL();
        answer = '[그림 답변]';
    } else { // 텍스트 답변
        answer = document.getElementById('answerInput').value.trim();
        if (!answer) {
            alert('답변을 입력해주세요.');
            return;
        }
    }
    
    submittedAnswer = answer;
    submittedDrawing = drawing;
    answerSubmitted = true;
    
    // UI 업데이트
    updateAnswerStatus();
    
    // 데이터 저장
    localStorage.setItem('playerAnswer', submittedAnswer);
    localStorage.setItem('playerDrawing', submittedDrawing || '');
    localStorage.setItem('answerSubmitted', 'true');
    
    console.log('답변 제출 완료:', submittedAnswer);
}

// 답변 수정
function editAnswer() {
    answerSubmitted = false;
    submittedAnswer = '';
    submittedDrawing = null;
    
    // UI 업데이트
    document.getElementById('answerStatus').style.display = 'none';
    document.getElementById('submitAnswerBtn').style.display = 'block';
    document.getElementById('editAnswerBtn').style.display = 'none';
    
    // 텍스트 답변 복원
    const questionType = getCurrentQuestionType();
    if (questionType !== 2) {
        document.getElementById('answerInput').disabled = false;
        document.getElementById('answerInput').focus();
    }
    
    // 데이터 삭제
    localStorage.removeItem('playerAnswer');
    localStorage.removeItem('playerDrawing');
    localStorage.removeItem('answerSubmitted');
    
    console.log('답변 수정 모드 활성화');
}

// 답변 상태 업데이트
function updateAnswerStatus() {
    const questionType = getCurrentQuestionType();
    
    document.getElementById('answerStatus').style.display = 'block';
    document.getElementById('submitAnswerBtn').style.display = 'none';
    document.getElementById('editAnswerBtn').style.display = 'block';
    
    if (questionType === 2) { // 그림형
        document.getElementById('submittedText').style.display = 'none';
        const submittedCanvas = document.getElementById('submittedDrawing');
        submittedCanvas.style.display = 'block';
        
        // 제출된 그림을 작은 캔버스에 표시
        const submittedCtx = submittedCanvas.getContext('2d');
        const img = new Image();
        img.onload = function() {
            submittedCtx.clearRect(0, 0, submittedCanvas.width, submittedCanvas.height);
            submittedCtx.drawImage(img, 0, 0, submittedCanvas.width, submittedCanvas.height);
        };
        img.src = submittedDrawing;
    } else { // 텍스트
        document.getElementById('submittedDrawing').style.display = 'none';
        document.getElementById('submittedText').style.display = 'block';
        document.getElementById('submittedText').textContent = submittedAnswer;
        document.getElementById('answerInput').disabled = true;
    }
}

// 현재 질문 유형 가져오기
function getCurrentQuestionType() {
    try {
        const questionNumber = window.getQuestionForRound(playerCode, currentGame, currentRound);        
        let actualQuestionNumber = questionNumber;
        return Math.floor(actualQuestionNumber / 10); // 11->1, 21->2, 31->3, 41->4
    } catch (error) {
        console.error('질문 유형 가져오기 오류:', error);
        return 1; // 기본값 (입력형)
    }
}

// 답변 공개 페이지로 이동
function goToAnswer() {
    if (!answerSubmitted) {
        alert('먼저 답변을 제출해주세요.');
        return;
    }
    
    // ✅ 라이어인 경우 5초간 메인 질문 표시 (올바른 인덱스)
    const isPlayerFaker = window.isPlayerFaker(playerCode, currentGame, playerIndex);
    
    if (isPlayerFaker) {
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
        const questionNumber = window.getQuestionForRound(playerCode, currentGame, currentRound);
        const questionData = window.getQuestionByNumber(questionNumber);
        
        if (questionData) {
            document.getElementById('mainQuestionText').textContent = questionData.main;
            document.getElementById('mainQuestionReveal').style.display = 'block';
            
            // 5초 타이머
            let timeLeft = 5;
            const timerElement = document.getElementById('revealTimer');
            
            const timer = setInterval(() => {
                timeLeft--;
                timerElement.textContent = timeLeft;
                
                if (timeLeft <= 0) {
                    clearInterval(timer);
                    document.getElementById('mainQuestionReveal').style.display = 'none';
                    moveToAnswerPage();
                }
            }, 1000);
            
            console.log('라이어에게 메인 질문 5초간 표시:', questionData.main);
        }
    } catch (error) {
        console.error('메인 질문 표시 중 오류:', error);
        moveToAnswerPage(); // 오류 시 바로 이동
    }
}

// answer.html로 이동
function moveToAnswerPage() {
    console.log('답변 페이지로 이동 시도 중...');
    
    // 저장할 데이터 준비
    const answerType = submittedDrawing ? 'drawing' : 'text';
    
    // localStorage에 데이터 저장
    localStorage.setItem('submittedAnswer', submittedAnswer);
    localStorage.setItem('answerType', answerType);
    if (submittedDrawing) {
        localStorage.setItem('submittedDrawing', submittedDrawing);
    } else {
        localStorage.removeItem('submittedDrawing');
    }
    localStorage.setItem('inviteCode', playerCode);
    localStorage.setItem('playerIndex', playerIndex.toString());
    localStorage.setItem('currentRound', currentRound.toString());
    localStorage.setItem('currentGame', currentGame.toString());
    
    console.log('플레이어 데이터 저장 완료:', {
        submittedAnswer,
        answerType,
        inviteCode: playerCode,
        playerIndex,
        currentRound,
        currentGame
    });
    
    // answer.html로 이동 (쿼리 파라미터 통일)
    window.location.href = `answer.html?from=player${playerIndex}`;
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
        console.log('다음 라운드로 진행:', currentRound);
    } else {
        // alert 대신 "다음 게임" 버튼 강조
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
        console.log('다음 게임으로 진행:', currentGame);
    } else {
        // alert 대신 게임 종료 버튼 강조
        const endGameBtn = document.getElementById('endGameBtn');
        if (endGameBtn) {
            endGameBtn.classList.add('pulse-highlight');
            setTimeout(() => {
                endGameBtn.classList.remove('pulse-highlight');
            }, 3000);
        }
        console.log('마지막 게임 - 게임 종료 버튼 강조');
    }
}

// 라운드 상태 초기화
function resetRoundState() {
    answerSubmitted = false;
    submittedAnswer = '';
    submittedDrawing = null;
    
    // UI 초기화
    document.getElementById('answerInput').value = '';
    document.getElementById('answerInput').disabled = false;
    document.getElementById('answerStatus').style.display = 'none';
    document.getElementById('submitAnswerBtn').style.display = 'block';
    document.getElementById('editAnswerBtn').style.display = 'none';
    
    // 캔버스 초기화
    clearCanvas();
    
    // localStorage 정리
    localStorage.removeItem('playerAnswer');
    localStorage.removeItem('playerDrawing');
    localStorage.removeItem('answerSubmitted');
}

// 게임 종료 모달 표시
function showEndGameModal() {
    showModal('endGameModal');
}

// 게임 종료
function endGame() {
    const isPlayerFaker = window.isPlayerFaker(playerCode, currentGame, playerIndex);
    
    // gameover.html로 데이터 전달
    localStorage.setItem('hostAnswer', submittedAnswer || '');
    localStorage.setItem('hostIsFaker', isPlayerFaker.toString());
    localStorage.setItem('hostCode', playerCode);
    localStorage.setItem('gameEndRound', currentRound.toString());
    localStorage.setItem('finalVotes', JSON.stringify({}));
    
    console.log('게임 종료 - gameover.html로 이동');
    window.location.href = 'gameover.html';
}

// 게임 UI 업데이트 (저장된 상태 복원)
function updateGameUI() {
    // 답변 상태 복원
    const savedAnswer = localStorage.getItem('playerAnswer');
    const savedDrawing = localStorage.getItem('playerDrawing');
    const savedSubmitted = localStorage.getItem('answerSubmitted') === 'true';
    
    if (savedSubmitted && (savedAnswer || savedDrawing)) {
        answerSubmitted = true;
        submittedAnswer = savedAnswer || '';
        submittedDrawing = savedDrawing || null;
        
        // 게임이 진행 중인 상태로 복원
        gameStarted = true;
        document.getElementById('waitingSection').style.display = 'none';
        document.getElementById('startGameBtn').style.display = 'none';
        
        showQuestion();
        showAnswerInput();
        showGameControls();
        
        // 답변 상태 UI 업데이트
        updateAnswerStatus();
    } else {
        // 답변이 없는 경우에만 자동 진행 체크
        checkAutoProgression();
    }
}

// === 그림 그리기 관련 함수들 ===

function startDrawing(e) {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
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
    if (isDrawing) {
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
    ctx.strokeStyle = color;
    
    // 활성 색상 표시
    document.querySelectorAll('.color-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-color="${color}"]`).classList.add('active');
}

function changeBrushSize(e) {
    currentBrushSize = e.target.value;
    ctx.lineWidth = currentBrushSize;
    document.getElementById('brushSizeValue').textContent = currentBrushSize;
}

function clearCanvas() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = currentColor;
}

// === 공통 함수들 ===

function showError(message) {
    document.getElementById('errorMessage').textContent = message;
    showModal('errorModal');
}

function showModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// 다음 게임 버튼 강조 함수
function highlightNextGameButton() {
    const nextGameBtn = document.getElementById('nextGameBtn');
    
    if (nextGameBtn && nextGameBtn.style.display !== 'none') {
        // 펄스 애니메이션 클래스 추가
        nextGameBtn.classList.add('pulse-highlight-strong');
        
        // 3초 후 애니메이션 제거
        setTimeout(() => {
            nextGameBtn.classList.remove('pulse-highlight-strong');
        }, 3000);
        
        console.log('마지막 라운드 - 다음 게임 버튼 강조');
    } else {
        // 다음 게임 버튼이 없으면 게임 종료 버튼 강조
        const endGameBtn = document.getElementById('endGameBtn');
        if (endGameBtn) {
            endGameBtn.classList.add('pulse-highlight');
            setTimeout(() => {
                endGameBtn.classList.remove('pulse-highlight');
            }, 3000);
        }
    }
}
function initializeVoteData() {
    const savedVotes = localStorage.getItem(`votes_${playerCode}_game_${currentGame}`);
    if (savedVotes) {
        voteData = JSON.parse(savedVotes);
    } else {
        voteData = Array.from({ length: totalPlayers }, (_, i) => [i, -1, -1, -1, -1]);
        localStorage.setItem(`votes_${playerCode}_game_${currentGame}`, JSON.stringify(voteData));
    }
    console.log('✅ 투표 데이터 초기화:', voteData);
}
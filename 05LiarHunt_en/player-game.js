// player-game.js - Liar Hunt (English)

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
let playerIndex = 1; // Players start at 1 (0 is host-only)
let voteData = [];
// Drawing variables
let canvas, ctx;
let isDrawing = false;
let currentColor = '#000000';
let currentBrushSize = 3;

document.addEventListener('DOMContentLoaded', function() {
    if (!window.isGameDataLoaded() || !window.isQuestionsLoaded()) {
        console.error('Game data or question system not loaded.');
        showError('Error loading game system. Please refresh the page.');
        return;
    }
    initializeVoteData();
    initializeCanvas();
    checkExistingGame();
    setupEventListeners();
});

function initializeCanvas() {
    canvas = document.getElementById('drawingCanvas');
    ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = currentBrushSize;
    ctx.strokeStyle = currentColor;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setupCanvasEvents();
}

function setupCanvasEvents() {
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    canvas.addEventListener('touchstart', handleTouch);
    canvas.addEventListener('touchmove', handleTouch);
    canvas.addEventListener('touchend', stopDrawing);
}

function checkURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const dataParam = urlParams.get('data');

    if (dataParam) {
        try {
            const playerData = JSON.parse(decodeURIComponent(dataParam));
            if (playerData.playerCode || playerData.code) {
                const code = playerData.playerCode || playerData.code;
                currentGame = playerData.gameNumber || 1;
                joinGame(code, false);
                return true;
            }
        } catch (error) {
            console.error('URL parameter parse error:', error);
        }
    }
    return false;
}

function checkExistingGame() {
    if (checkURLParams()) return;

    const savedCode = localStorage.getItem('inviteCode') || localStorage.getItem('playerCode');
    if (savedCode) {
        playerCode = savedCode;
        totalPlayers = parseInt(localStorage.getItem('totalPlayers')) || 4;
        fakerCount = parseInt(localStorage.getItem('fakerCount')) || 1;
        currentGame = parseInt(localStorage.getItem('currentGame')) || 1;
        // host-game 과 같은 범위로 맞춘다. 안 맞추면 호스트와 플레이어가
        // 서로 다른 게임을 진행하게 된다.
        if (currentGame < 1 || currentGame > maxGames) currentGame = 1;
        currentRound = parseInt(localStorage.getItem('currentRound')) || 1;

        const savedIndex = parseInt(localStorage.getItem('playerIndex'));
        if (savedIndex >= 1 && savedIndex < totalPlayers) {
            playerIndex = savedIndex;
        } else {
            playerIndex = 1;
        }

        joinGame(savedCode, false);
    }
}

function setupEventListeners() {
    document.getElementById('inviteCode').addEventListener('input', handleCodeInput);
    document.getElementById('inviteCode').addEventListener('keypress', handleKeyPress);
    document.getElementById('joinBtn').addEventListener('click', handleJoinGame);

    document.getElementById('startGameBtn').addEventListener('click', startGame);
    document.getElementById('submitAnswerBtn').addEventListener('click', submitAnswer);
    document.getElementById('editAnswerBtn').addEventListener('click', editAnswer);
    document.getElementById('goToAnswerBtn').addEventListener('click', goToAnswer);
    document.getElementById('nextRoundBtn').addEventListener('click', handleNextRound);
    document.getElementById('nextGameBtn').addEventListener('click', handleNextGame);
    document.getElementById('endGameBtn').addEventListener('click', showEndGameModal);

    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', () => changeColor(btn.dataset.color));
    });
    document.getElementById('clearCanvas').addEventListener('click', clearCanvas);
    document.getElementById('brushSize').addEventListener('input', changeBrushSize);

    setupModalEventListeners();
}

function setupModalEventListeners() {
    const closeError = document.getElementById('closeError');
    if (closeError) closeError.addEventListener('click', () => closeModal('errorModal'));

    const cancelEndGame = document.getElementById('cancelEndGame');
    if (cancelEndGame) cancelEndGame.addEventListener('click', () => closeModal('endGameModal'));

    const confirmEndGame = document.getElementById('confirmEndGame');
    if (confirmEndGame) confirmEndGame.addEventListener('click', endGame);

    const cancelNextRound = document.getElementById('cancelNextRound');
    if (cancelNextRound) cancelNextRound.addEventListener('click', () => closeModal('nextRoundModal'));

    const confirmNextRoundBtn = document.getElementById('confirmNextRound');
    if (confirmNextRoundBtn) confirmNextRoundBtn.addEventListener('click', confirmNextRound);

    const cancelNextGame = document.getElementById('cancelNextGame');
    if (cancelNextGame) cancelNextGame.addEventListener('click', () => closeModal('nextGameModal'));

    const confirmNextGameBtn = document.getElementById('confirmNextGame');
    if (confirmNextGameBtn) confirmNextGameBtn.addEventListener('click', confirmNextGame);
}

function handleCodeInput(event) {
    const input = event.target;
    input.value = input.value.toUpperCase().replace(/[^A-Z]/g, '');
    document.getElementById('joinBtn').disabled = input.value.length !== 4;
}

function handleKeyPress(event) {
    if (event.key === 'Enter' && !document.getElementById('joinBtn').disabled) {
        handleJoinGame();
    }
}

function handleJoinGame() {
    const code = document.getElementById('inviteCode').value.trim();
    if (code.length === 4) joinGame(code, true);
}

function joinGame(code, isNewJoin = true) {
    if (!validateCode(code)) {
        if (isNewJoin) showError('Invalid invite code. Please enter 4 letters.');
        return;
    }

    try {
        playerCode = code;

        const gameInfo = window.getGameInfoFromCode(code);
        if (!gameInfo) {
            if (isNewJoin) showError('Could not decode invite code.');
            return;
        }

        totalPlayers = gameInfo.totalPlayers;
        fakerCount = gameInfo.fakerCount;

        let finalPlayerIndex = null;

        const urlParams = new URLSearchParams(window.location.search);
        const dataParam = urlParams.get('data');
        if (dataParam) {
            try {
                const playerData = JSON.parse(decodeURIComponent(dataParam));
                if (playerData.playerIndex !== undefined) {
                    const receivedIndex = playerData.playerIndex;
                    if (receivedIndex >= 1 && receivedIndex < totalPlayers) {
                        finalPlayerIndex = receivedIndex;
                    }
                }
            } catch (error) {
                console.error('URL parameter parse failed:', error);
            }
        }

        if (finalPlayerIndex === null && !isNewJoin) {
            const savedPlayerIndex = localStorage.getItem('playerIndex');
            if (savedPlayerIndex !== null) {
                const saved = parseInt(savedPlayerIndex);
                if (saved >= 1 && saved < totalPlayers) {
                    finalPlayerIndex = saved;
                }
            }
        }

        if (finalPlayerIndex === null) {
            finalPlayerIndex = Math.floor(Math.random() * (totalPlayers - 1)) + 1;
        }

        playerIndex = finalPlayerIndex;

        localStorage.setItem('inviteCode', code);
        localStorage.setItem('playerCode', code);
        localStorage.setItem('playerIndex', playerIndex.toString());
        localStorage.setItem('totalPlayers', totalPlayers.toString());
        localStorage.setItem('fakerCount', fakerCount.toString());
        localStorage.setItem('currentGame', currentGame.toString());
        localStorage.setItem('currentRound', currentRound.toString());
        localStorage.setItem('isHost', 'false');

        document.getElementById('codeInputSection').style.display = 'none';
        document.getElementById('gameMainSection').style.display = 'block';
        document.getElementById('playerCode').textContent = code;

        updateGameInfo();
        updatePlayerRole();
        updateGameUI();
        checkAutoProgression();

        if (!answerSubmitted) startGame();

    } catch (error) {
        console.error('Error joining game:', error);
        if (isNewJoin) showError('Error joining game: ' + error.message);
    }
}

function checkAutoProgression() {
    const autoNextRound = localStorage.getItem('autoNextRound');
    const nextRoundNumber = localStorage.getItem('nextRoundNumber');

    if (autoNextRound === 'true' && nextRoundNumber) {
        const targetRound = parseInt(nextRoundNumber);
        if (targetRound <= maxRounds && targetRound > currentRound) {
            currentRound = targetRound;
            resetRoundState();
            updateGameInfo();
            updatePlayerRole();
            showQuestion();
            localStorage.removeItem('autoNextRound');
            localStorage.removeItem('nextRoundNumber');
            localStorage.setItem('currentRound', currentRound.toString());
            return true;
        }
    }

    const autoNextGame = localStorage.getItem('autoNextGame');
    const nextGameNumber = localStorage.getItem('nextGameNumber');

    if (autoNextGame === 'true' && nextGameNumber) {
        const targetGame = parseInt(nextGameNumber);
        if (targetGame <= maxGames && targetGame > currentGame) {
            currentGame = targetGame;
            currentRound = 1;
            resetRoundState();
            updateGameInfo();
            updatePlayerRole();
            showQuestion();
            localStorage.removeItem('autoNextGame');
            localStorage.removeItem('nextGameNumber');
            localStorage.setItem('currentGame', currentGame.toString());
            localStorage.setItem('currentRound', currentRound.toString());
            return true;
        }
    }

    return false;
}

function updateGameInfo() {
    document.getElementById('gameNumber').textContent = currentGame;
    document.getElementById('roundNumber').textContent = currentRound;
    document.getElementById('roundTotal').textContent = `/${maxRounds}`;
}

function updatePlayerRole() {
    try {
        const isPlayerFaker = window.isPlayerFaker(playerCode, currentGame, playerIndex);
        const allFakers = window.getFakersForGame(playerCode, currentGame);

        const roleCard = document.getElementById('roleCard');
        const roleIcon = document.getElementById('roleIcon');
        const roleName = document.getElementById('roleName');
        const fakerInfoSection = document.getElementById('fakerInfoSection');

        if (isPlayerFaker) {
            roleCard.className = 'role-card faker';
            roleIcon.textContent = '🎭';
            roleName.textContent = 'Liar';
            roleName.className = 'role-name faker';
            fakerInfoSection.style.display = 'block';
        } else {
            roleCard.className = 'role-card normal';
            roleIcon.textContent = '👤';
            roleName.textContent = 'Normal Player';
            roleName.className = 'role-name normal';
            fakerInfoSection.style.display = 'none';
        }
    } catch (error) {
        console.error('Error updating player role:', error);
        const roleName = document.getElementById('roleName');
        if (roleName) roleName.textContent = 'Checking...';
    }
}

function validateCode(code) {
    return /^[A-Z]{4}$/.test(code);
}

function startGame() {
    gameStarted = true;
    document.getElementById('waitingSection').style.display = 'none';
    document.getElementById('startGameBtn').style.display = 'none';
    showQuestion();
    showAnswerInput();
    showGameControls();
}

function showQuestion() {
    try {
        const isPlayerFaker = window.isPlayerFaker(playerCode, currentGame, playerIndex);
        const questionNumber = window.getQuestionForRound(playerCode, currentGame, currentRound);
        const questionData = window.getQuestionByNumber(questionNumber);

        if (!questionData) {
            console.error('Question not found. Number:', questionNumber);
            return;
        }

        const questionText = isPlayerFaker ? questionData.fake : questionData.main;

        document.getElementById('questionSection').style.display = 'block';

        const questionInfo = window.parseQuestionNumber(questionNumber);
        document.getElementById('questionMode').textContent = questionInfo.typeName;
        document.getElementById('questionText').textContent = questionText;

        setupAnswerInput(questionInfo.type);
    } catch (error) {
        console.error('Error showing question:', error);
        showError('Error loading question.');
    }
}

function setupAnswerInput(questionType) {
    const textContainer = document.getElementById('textInputContainer');
    const drawingContainer = document.getElementById('drawingContainer');

    if (questionType === 2) {
        textContainer.style.display = 'none';
        drawingContainer.style.display = 'block';
        clearCanvas();
    } else {
        textContainer.style.display = 'block';
        drawingContainer.style.display = 'none';
    }
}

function showAnswerInput() {
    document.getElementById('answerInputSection').style.display = 'block';
}

function showGameControls() {
    document.getElementById('goToAnswerBtn').style.display = 'block';
    if (currentRound < maxRounds) document.getElementById('nextRoundBtn').style.display = 'block';
    if (currentGame < maxGames) document.getElementById('nextGameBtn').style.display = 'block';
    document.getElementById('endGameBtn').style.display = 'block';
}

function submitAnswer() {
    const questionType = getCurrentQuestionType();
    let answer = '';
    let drawing = null;

    if (questionType === 2) {
        drawing = canvas.toDataURL();
        answer = '[Drawing]';
    } else {
        answer = document.getElementById('answerInput').value.trim();
        if (!answer) {
            const inp = document.getElementById('answerInput');
            if (inp) { inp.classList.remove('shake'); void inp.offsetWidth; inp.classList.add('shake'); setTimeout(() => inp.classList.remove('shake'), 400); inp.focus(); }
            return;
        }
    }

    submittedAnswer = answer;
    submittedDrawing = drawing;
    answerSubmitted = true;

    updateAnswerStatus();

    localStorage.setItem('playerAnswer', submittedAnswer);
    localStorage.setItem('playerDrawing', submittedDrawing || '');
    localStorage.setItem('answerSubmitted', 'true');
}

function editAnswer() {
    answerSubmitted = false;
    submittedAnswer = '';
    submittedDrawing = null;

    document.getElementById('answerStatus').style.display = 'none';
    document.getElementById('submitAnswerBtn').style.display = 'block';
    document.getElementById('editAnswerBtn').style.display = 'none';

    const questionType = getCurrentQuestionType();
    if (questionType !== 2) {
        document.getElementById('answerInput').disabled = false;
        document.getElementById('answerInput').focus();
    }

    localStorage.removeItem('playerAnswer');
    localStorage.removeItem('playerDrawing');
    localStorage.removeItem('answerSubmitted');
}

function updateAnswerStatus() {
    const questionType = getCurrentQuestionType();

    document.getElementById('answerStatus').style.display = 'block';
    document.getElementById('submitAnswerBtn').style.display = 'none';
    const amILiarNow = window.isPlayerFaker ? window.isPlayerFaker(playerCode, currentGame, playerIndex) : false;
    document.getElementById('editAnswerBtn').style.display = amILiarNow ? 'none' : 'block';

    if (questionType === 2) {
        document.getElementById('submittedText').style.display = 'none';
        const submittedCanvas = document.getElementById('submittedDrawing');
        submittedCanvas.style.display = 'block';
        const submittedCtx = submittedCanvas.getContext('2d');
        const img = new Image();
        img.onload = function() {
            submittedCtx.clearRect(0, 0, submittedCanvas.width, submittedCanvas.height);
            submittedCtx.drawImage(img, 0, 0, submittedCanvas.width, submittedCanvas.height);
        };
        img.src = submittedDrawing;
    } else {
        document.getElementById('submittedDrawing').style.display = 'none';
        document.getElementById('submittedText').style.display = 'block';
        document.getElementById('submittedText').textContent = submittedAnswer;
        document.getElementById('answerInput').disabled = true;
    }
}

function getCurrentQuestionType() {
    try {
        const questionNumber = window.getQuestionForRound(playerCode, currentGame, currentRound);
        return window.parseQuestionNumber(questionNumber).type;
    } catch (error) {
        console.error('Error getting question type:', error);
        return 1;
    }
}

function goToAnswer() {
    if (!answerSubmitted) {
        const sec = document.getElementById('answerInputSection');
        if (sec) { sec.classList.remove('shake'); void sec.offsetWidth; sec.classList.add('shake'); setTimeout(() => sec.classList.remove('shake'), 400); }
        return;
    }

    const isPlayerFaker = window.isPlayerFaker(playerCode, currentGame, playerIndex);
    if (isPlayerFaker) {
        showMainQuestionToFaker();
        return;
    }

    moveToAnswerPage();
}

function showMainQuestionToFaker() {
    try {
        const questionNumber = window.getQuestionForRound(playerCode, currentGame, currentRound);
        const questionData = window.getQuestionByNumber(questionNumber);

        if (questionData) {
            document.getElementById('mainQuestionText').textContent = questionData.main;
            document.getElementById('mainQuestionReveal').style.display = 'flex';

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
        }
    } catch (error) {
        console.error('Error showing main question:', error);
        moveToAnswerPage();
    }
}

function moveToAnswerPage() {
    const answerType = submittedDrawing ? 'drawing' : 'text';

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

    window.location.href = `answer.html?from=player${playerIndex}`;
}

function handleNextRound() {
    if (currentRound < maxRounds) {
        showModal('nextRoundModal');
    } else {
        highlightNextGameButton();
    }
}

function confirmNextRound() {
    currentRound++;
    resetRoundState();
    updateGameInfo();
    updatePlayerRole();
    showQuestion();
    localStorage.setItem('currentRound', currentRound.toString());
    closeModal('nextRoundModal');
    window.scrollTo(0, 0);
}

function handleNextGame() {
    if (currentGame < maxGames) {
        showModal('nextGameModal');
    } else {
        showEndGameModal();
    }
}

function confirmNextGame() {
    const nextGame = parseInt(localStorage.getItem('currentGame') || '1') + 1;
    localStorage.setItem('currentGame', nextGame.toString());
    localStorage.setItem('currentRound', '1');
    localStorage.removeItem('playerRole');
    localStorage.removeItem('roleRevealed');

    window.location.href = 'card-role.html?next=player-game.html';
    closeModal('nextGameModal');
}

function resetRoundState() {
    answerSubmitted = false;
    submittedAnswer = '';
    submittedDrawing = null;

    document.getElementById('answerInput').value = '';
    document.getElementById('answerInput').disabled = false;
    document.getElementById('answerStatus').style.display = 'none';
    document.getElementById('submitAnswerBtn').style.display = 'block';
    document.getElementById('editAnswerBtn').style.display = 'none';

    clearCanvas();

    localStorage.removeItem('playerAnswer');
    localStorage.removeItem('playerDrawing');
    localStorage.removeItem('answerSubmitted');
}

function showEndGameModal() {
    showModal('endGameModal');
}

function endGame() {
    const isPlayerFaker = window.isPlayerFaker(playerCode, currentGame, playerIndex);
    localStorage.setItem('hostAnswer', submittedAnswer || '');
    localStorage.setItem('hostIsFaker', isPlayerFaker.toString());
    localStorage.setItem('hostCode', playerCode);
    localStorage.setItem('gameEndRound', currentRound.toString());
    localStorage.setItem('finalVotes', JSON.stringify({}));
    window.location.href = 'gameover.html';
}

function updateGameUI() {
    const savedAnswer = localStorage.getItem('playerAnswer');
    const savedDrawing = localStorage.getItem('playerDrawing');
    const savedSubmitted = localStorage.getItem('answerSubmitted') === 'true';

    if (savedSubmitted && (savedAnswer || savedDrawing)) {
        answerSubmitted = true;
        submittedAnswer = savedAnswer || '';
        submittedDrawing = savedDrawing || null;
        gameStarted = true;
        document.getElementById('waitingSection').style.display = 'none';
        document.getElementById('startGameBtn').style.display = 'none';
        showQuestion();
        showAnswerInput();
        showGameControls();
        updateAnswerStatus();
    } else {
        checkAutoProgression();
    }
}

// Drawing functions
function startDrawing(e) {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
}

function draw(e) {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
}

function stopDrawing() {
    if (isDrawing) { isDrawing = false; ctx.beginPath(); }
}

function handleTouch(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent(e.type === 'touchstart' ? 'mousedown' : e.type === 'touchmove' ? 'mousemove' : 'mouseup', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}

function changeColor(color) {
    currentColor = color;
    ctx.strokeStyle = color;
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

function highlightNextGameButton() {
    const nextGameBtn = document.getElementById('nextGameBtn');
    if (nextGameBtn && nextGameBtn.style.display !== 'none') {
        nextGameBtn.classList.add('pulse-highlight-strong');
        setTimeout(() => nextGameBtn.classList.remove('pulse-highlight-strong'), 3000);
    } else {
        const endGameBtn = document.getElementById('endGameBtn');
        if (endGameBtn) {
            endGameBtn.classList.add('pulse-highlight');
            setTimeout(() => endGameBtn.classList.remove('pulse-highlight'), 3000);
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
}

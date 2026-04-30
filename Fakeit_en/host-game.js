// host-game.js - Liar Hunt (English)

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
let playerIndex = 0;
let playerScores = {};
let voteData = [];

let canvas, ctx;
let isDrawing = false;
let currentColor = '#000000';
let currentBrushSize = 3;

let fakerGaveUp = false;
let playerCodes = {};

document.addEventListener('DOMContentLoaded', function() {
    if (!window.isGameDataLoaded() || !window.isQuestionsLoaded()) {
        showError('Game system load error. Please refresh the page.');
        disableControls('Game system load failed');
        return;
    }

    if (loadHostData()) {
        initializeCanvas();
        initializePlayerScores();
        setupEventListeners();
        initializeVoteData();
        if (inviteCode) startGame();
    }
});

function loadHostData() {
    const savedCode = localStorage.getItem('inviteCode') || localStorage.getItem('hostCode') || '';
    if (!savedCode || savedCode.length !== 4 || !/^[A-Z]{4}$/.test(savedCode)) {
        showError('Invalid invite code. Please restart the game.');
        disableControls('Invalid invite code');
        return false;
    }
    inviteCode = savedCode;

    totalPlayers = parseInt(localStorage.getItem('totalPlayers')) || 4;
    if (totalPlayers < 2 || totalPlayers > 17) totalPlayers = 4;

    fakerCount = parseInt(localStorage.getItem('fakerCount')) || 1;
    if (fakerCount < 1 || fakerCount >= totalPlayers) fakerCount = 1;

    currentGame = parseInt(localStorage.getItem('currentGame')) || 1;
    if (currentGame < 1 || currentGame > maxGames) currentGame = 1;

    currentRound = parseInt(localStorage.getItem('currentRound')) || 1;
    if (currentRound < 1 || currentRound > maxRounds) currentRound = 1;

    playerIndex = 0;

    const savedAnswer = localStorage.getItem('hostAnswer');
    const savedDrawing = localStorage.getItem('hostDrawing');
    const savedSubmitted = localStorage.getItem('answerSubmitted') === 'true';
    if (savedSubmitted && (savedAnswer || savedDrawing)) {
        answerSubmitted = true;
        submittedAnswer = savedAnswer || '';
        submittedDrawing = savedDrawing || null;
    }

    const savedCodes = localStorage.getItem('allPlayerCodes');
    if (savedCodes) {
        try {
            const playerCodeArray = JSON.parse(savedCodes);
            playerCodes = {};
            for (let i = 0; i < playerCodeArray.length; i++) {
                playerCodes[`Player${i + 1}`] = playerCodeArray[i];
            }
            playerCodes['Host'] = inviteCode;
        } catch (error) {
            playerCodes = { 'Host': inviteCode };
        }
    }

    localStorage.setItem('playerIndex', '0');
    return true;
}

function disableControls(reason) {
    const container = document.querySelector('.container') || document.body;
    if (container) { container.style.pointerEvents = 'none'; container.style.opacity = '0.6'; }
    showError('Game halted. Please refresh or start over.');
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = 'background:#fed7d7;color:#c53030;padding:15px;margin:10px 0;border-radius:8px;text-align:center;position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:1000;';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
}

function initializePlayerScores() {
    const savedScores = localStorage.getItem('playerScores');
    if (savedScores) {
        try { playerScores = JSON.parse(savedScores); }
        catch (error) { initializeDefaultScores(); }
    } else {
        initializeDefaultScores();
    }
}

function initializeDefaultScores() {
    playerScores = {};
    for (let i = 1; i < totalPlayers; i++) {
        playerScores[`Player${i}`] = 0;
    }
    playerScores['Host'] = 0;
}

function initializeCanvas() {
    canvas = document.getElementById('drawingCanvas');
    if (!canvas) return;
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
    if (!canvas) return;
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    canvas.addEventListener('touchstart', handleTouch, { passive: false });
    canvas.addEventListener('touchmove', handleTouch, { passive: false });
    canvas.addEventListener('touchend', stopDrawing);
}

function setupEventListeners() {
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) submitBtn.addEventListener('click', submitAnswer);

    const editAnswerBtn = document.getElementById('editAnswerBtn');
    if (editAnswerBtn) editAnswerBtn.addEventListener('click', editAnswer);

    const goToAnswerBtn = document.getElementById('goToAnswerBtn');
    if (goToAnswerBtn) goToAnswerBtn.addEventListener('click', goToAnswer);

    const nextRoundBtn = document.getElementById('next-round-btn');
    if (nextRoundBtn) nextRoundBtn.addEventListener('click', handleNextRound);

    const nextGameBtn = document.getElementById('next-game-btn');
    if (nextGameBtn) nextGameBtn.addEventListener('click', handleNextGame);

    const fakerGiveUpBtn = document.getElementById('faker-give-up-btn');
    if (fakerGiveUpBtn) fakerGiveUpBtn.addEventListener('click', handleFakerGiveUp);

    const revealFakerBtn = document.getElementById('reveal-faker-btn');
    if (revealFakerBtn) revealFakerBtn.addEventListener('click', handleRevealFaker);

    const endGameBtn = document.getElementById('end-game-btn');
    if (endGameBtn) endGameBtn.addEventListener('click', showEndGameModal);

    document.querySelectorAll('.color-btn')?.forEach(btn => {
        btn.addEventListener('click', () => changeColor(btn.dataset.color));
    });
    const clearCanvasBtn = document.getElementById('clearCanvas');
    if (clearCanvasBtn) clearCanvasBtn.addEventListener('click', clearCanvas);
    const brushSizeInput = document.getElementById('brushSize');
    if (brushSizeInput) brushSizeInput.addEventListener('input', changeBrushSize);

    setupModalEventListeners();
}

function setupModalEventListeners() {
    const cancelNextRound = document.getElementById('cancelNextRound');
    if (cancelNextRound) cancelNextRound.addEventListener('click', () => closeModal('nextRoundModal'));
    const confirmNextRoundBtn = document.getElementById('confirmNextRound');
    if (confirmNextRoundBtn) confirmNextRoundBtn.addEventListener('click', confirmNextRound);
    const cancelNextGame = document.getElementById('cancelNextGame');
    if (cancelNextGame) cancelNextGame.addEventListener('click', () => closeModal('nextGameModal'));
    const confirmNextGameBtn = document.getElementById('confirmNextGame');
    if (confirmNextGameBtn) confirmNextGameBtn.addEventListener('click', confirmNextGame);
    const cancelGiveUp = document.getElementById('cancelGiveUp');
    if (cancelGiveUp) cancelGiveUp.addEventListener('click', () => closeModal('giveUpModal'));
    const confirmGiveUp = document.getElementById('confirmGiveUp');
    if (confirmGiveUp) confirmGiveUp.addEventListener('click', confirmFakerGiveUp);
    const cancelReveal1 = document.getElementById('cancelReveal1');
    if (cancelReveal1) cancelReveal1.addEventListener('click', () => closeModal('revealModal1'));
    const confirmReveal1 = document.getElementById('confirmReveal1');
    if (confirmReveal1) confirmReveal1.addEventListener('click', showSecondRevealModal);
    const cancelReveal2 = document.getElementById('cancelReveal2');
    if (cancelReveal2) cancelReveal2.addEventListener('click', () => closeModal('revealModal2'));
    const confirmReveal2 = document.getElementById('confirmReveal2');
    if (confirmReveal2) confirmReveal2.addEventListener('click', confirmRevealFaker);
    const closePlayerInfo = document.getElementById('closePlayerInfo');
    if (closePlayerInfo) closePlayerInfo.addEventListener('click', () => closeModal('playerInfoModal'));
    const cancelEndGame = document.getElementById('cancelEndGame');
    if (cancelEndGame) cancelEndGame.addEventListener('click', () => closeModal('endGameModal'));
    const confirmEndGame = document.getElementById('confirmEndGame');
    if (confirmEndGame) confirmEndGame.addEventListener('click', endGame);
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

function startGame() {
    gameStarted = true;
    const autoProgressionOccurred = checkAutoProgression();
    updateGameInfo();
    updatePlayerRole();
    if (!autoProgressionOccurred) showQuestion();
    showAnswerInput();
    showGameControls();
    showHostControls();
    updateScoreSection();
}

function updateGameInfo() {
    const gameNumber = document.getElementById('gameNumber');
    const roundNumber = document.getElementById('roundNumber');
    const roundTotal = document.getElementById('roundTotal');
    const gameCodeElement = document.getElementById('gameCode');
    if (gameNumber) gameNumber.textContent = currentGame;
    if (roundNumber) roundNumber.textContent = currentRound;
    if (roundTotal) roundTotal.textContent = `/${maxRounds}`;
    if (gameCodeElement) gameCodeElement.textContent = inviteCode || 'Loading...';
}

function updatePlayerRole() {
    try {
        const amILiar = window.isPlayerFaker(inviteCode, currentGame, 0);
        const roleCard = document.getElementById('roleCard');
        const roleIcon = document.getElementById('roleIcon');
        const roleName = document.getElementById('roleName');
        const hostRoleElement = document.getElementById('hostRole');

        if (amILiar) {
            if (roleCard) roleCard.className = 'role-card faker';
            if (roleIcon) roleIcon.textContent = '🎭';
            if (roleName) { roleName.textContent = 'Liar (Host)'; roleName.className = 'role-name faker'; }
            if (hostRoleElement) { hostRoleElement.textContent = 'Liar'; hostRoleElement.className = 'host-role faker'; }
        } else {
            if (roleCard) roleCard.className = 'role-card normal';
            if (roleIcon) roleIcon.textContent = '👑';
            if (roleName) { roleName.textContent = 'Normal Player (Host)'; roleName.className = 'role-name normal'; }
            if (hostRoleElement) { hostRoleElement.textContent = 'Normal'; hostRoleElement.className = 'host-role normal'; }
        }
    } catch (error) {
        const roleName = document.getElementById('roleName');
        if (roleName) roleName.textContent = 'Checking role...';
    }
}

function showQuestion() {
    try {
        const amILiar = window.isPlayerFaker(inviteCode, currentGame, 0);
        const questionNumber = window.getQuestionForRound(inviteCode, currentGame, currentRound);
        const questionData = window.getQuestionByNumber(questionNumber);

        if (!questionData) { showError('Error loading question.'); return; }

        const questionText = amILiar ? questionData.fake : questionData.main;

        const questionSection = document.querySelector('.question-section');
        const questionMode = document.getElementById('questionMode');
        const hostQuestion = document.getElementById('hostQuestion');

        if (questionSection) questionSection.style.display = 'block';
        if (questionMode) {
            const questionInfo = window.parseQuestionNumber(questionNumber);
            questionMode.textContent = questionInfo.typeName;
        }
        if (hostQuestion) hostQuestion.textContent = questionText;

        const questionInfo = window.parseQuestionNumber(questionNumber);
        setupAnswerInput(questionInfo.type);
    } catch (error) {
        showError('Error loading question.');
    }
}

function setupAnswerInput(questionType) {
    const textContainer = document.getElementById('textInputContainer');
    const drawingContainer = document.getElementById('drawingContainer');
    if (questionType === 2) {
        if (textContainer) textContainer.style.display = 'none';
        if (drawingContainer) { drawingContainer.style.display = 'block'; clearCanvas(); }
    } else {
        if (textContainer) textContainer.style.display = 'block';
        if (drawingContainer) drawingContainer.style.display = 'none';
    }
}

function showAnswerInput() {
    const inputSection = document.querySelector('.input-section');
    if (inputSection) inputSection.style.display = 'block';
}

function showGameControls() {
    const goToAnswerBtn = document.getElementById('goToAnswerBtn');
    const nextRoundBtn = document.getElementById('next-round-btn');
    const nextGameBtn = document.getElementById('next-game-btn');
    if (goToAnswerBtn && answerSubmitted) goToAnswerBtn.style.display = 'block';
    else if (goToAnswerBtn) goToAnswerBtn.style.display = 'none';
    if (currentRound < maxRounds && nextRoundBtn) nextRoundBtn.style.display = 'block';
    else if (nextRoundBtn) nextRoundBtn.style.display = 'none';
    if (currentGame < maxGames && nextGameBtn) nextGameBtn.style.display = 'block';
    else if (nextGameBtn) nextGameBtn.style.display = 'none';
}

function showHostControls() {
    const controlSection = document.querySelector('.control-section');
    if (controlSection) controlSection.style.display = 'block';
}

function submitAnswer() {
    const questionType = getCurrentQuestionType();
    let answer = '';
    let drawing = null;

    if (questionType === 2) {
        if (canvas) { drawing = canvas.toDataURL(); answer = '[Drawing]'; }
        else { showError('Canvas not found.'); return; }
    } else {
        const answerInput = document.getElementById('answerInput');
        if (answerInput) {
            answer = answerInput.value.trim();
            if (!answer) {
                const inp = document.getElementById('answerInput');
                if (inp) { inp.classList.remove('shake'); void inp.offsetWidth; inp.classList.add('shake'); setTimeout(() => inp.classList.remove('shake'), 400); inp.focus(); }
                return;
            }
        } else { showError('Answer input not found.'); return; }
    }

    submittedAnswer = answer;
    submittedDrawing = drawing;
    answerSubmitted = true;
    updateAnswerStatus();

    const goToAnswerBtn = document.getElementById('goToAnswerBtn');
    if (goToAnswerBtn) goToAnswerBtn.style.display = 'block';

    localStorage.setItem('submittedAnswer', submittedAnswer);
    localStorage.setItem('answerType', questionType === 2 ? 'drawing' : 'text');
    if (submittedDrawing) localStorage.setItem('submittedDrawing', submittedDrawing);
    else localStorage.removeItem('submittedDrawing');
    localStorage.setItem('answerSubmitted', 'true');
    localStorage.setItem('playerIndex', '0');
}

function editAnswer() {
    answerSubmitted = false;
    submittedAnswer = '';
    submittedDrawing = null;
    const answerStatus = document.getElementById('answerStatus');
    const submitBtn = document.getElementById('submitBtn');
    const editAnswerBtn = document.getElementById('editAnswerBtn');
    if (answerStatus) answerStatus.style.display = 'none';
    if (submitBtn) submitBtn.style.display = 'block';
    if (editAnswerBtn) editAnswerBtn.style.display = 'none';
    const questionType = getCurrentQuestionType();
    if (questionType !== 2) {
        const answerInput = document.getElementById('answerInput');
        if (answerInput) { answerInput.disabled = false; answerInput.focus(); }
    }
    localStorage.removeItem('submittedAnswer');
    localStorage.removeItem('answerType');
    localStorage.removeItem('submittedDrawing');
    localStorage.removeItem('answerSubmitted');
}

function updateAnswerStatus() {
    const questionType = getCurrentQuestionType();
    const answerStatus = document.getElementById('answerStatus');
    const submitBtn = document.getElementById('submitBtn');
    const editAnswerBtn = document.getElementById('editAnswerBtn');
    if (answerStatus) answerStatus.style.display = 'block';
    if (submitBtn) submitBtn.style.display = 'none';
    const amILiarCheck = window.isPlayerFaker ? window.isPlayerFaker(inviteCode, currentGame, 0) : false;
    if (editAnswerBtn && !amILiarCheck) editAnswerBtn.style.display = 'block';

    if (questionType === 2) {
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
        }
    } else {
        const submittedText = document.getElementById('submittedText');
        const submittedCanvas = document.getElementById('submittedDrawing');
        const answerInput = document.getElementById('answerInput');
        if (submittedCanvas) submittedCanvas.style.display = 'none';
        if (submittedText) { submittedText.style.display = 'block'; submittedText.textContent = submittedAnswer; }
        if (answerInput) answerInput.disabled = true;
    }
}

function getCurrentQuestionType() {
    try {
        const questionNumber = window.getQuestionForRound(inviteCode, currentGame, currentRound);
        return window.parseQuestionNumber(questionNumber).type;
    } catch (error) { return 1; }
}

function goToAnswer() {
    if (!answerSubmitted) {
        const sec = document.getElementById('answerInputSection');
        if (sec) { sec.classList.remove('shake'); void sec.offsetWidth; sec.classList.add('shake'); setTimeout(() => sec.classList.remove('shake'), 400); }
        return;
    }
    const amILiar = window.isPlayerFaker(inviteCode, currentGame, 0);
    if (amILiar) showMainQuestionToFaker();
    else moveToAnswerPage();
}

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
                mainQuestionReveal.style.display = 'flex';
                let timeLeft = 5;
                revealTimer.textContent = timeLeft;
                const timer = setInterval(() => {
                    timeLeft--;
                    revealTimer.textContent = timeLeft;
                    if (timeLeft <= 0) { clearInterval(timer); mainQuestionReveal.style.display = 'none'; moveToAnswerPage(); }
                }, 1000);
            } else { moveToAnswerPage(); }
        }
    } catch (error) { moveToAnswerPage(); }
}

function moveToAnswerPage() {
    const answerType = submittedDrawing ? 'drawing' : 'text';
    localStorage.setItem('submittedAnswer', submittedAnswer);
    localStorage.setItem('answerType', answerType);
    if (submittedDrawing) localStorage.setItem('submittedDrawing', submittedDrawing);
    else localStorage.removeItem('submittedDrawing');
    localStorage.setItem('inviteCode', inviteCode);
    localStorage.setItem('playerIndex', '0');
    localStorage.setItem('currentRound', currentRound.toString());
    localStorage.setItem('currentGame', currentGame.toString());
    window.location.href = `answer.html?from=player0`;
}

function handleNextRound() {
    if (currentRound < maxRounds) showModal('nextRoundModal');
    else highlightNextGameButton();
}

function confirmNextRound() {
    currentRound++;
    resetRoundState();
    updateGameInfo();
    updatePlayerRole();
    showQuestion();
    localStorage.setItem('currentRound', currentRound.toString());
    window.scrollTo(0, 0);
    closeModal('nextRoundModal');
}

function handleNextGame() {
    if (currentGame < maxGames) showModal('nextGameModal');
    else showEndGameModal();
}

function confirmNextGame() {
    const nextGame = parseInt(localStorage.getItem('currentGame') || '1') + 1;
    localStorage.setItem('currentGame', nextGame.toString());
    localStorage.setItem('currentRound', '1');
    localStorage.removeItem('playerRole');
    localStorage.removeItem('roleRevealed');
    resetRoundState();
    updateGameInfo();
    updatePlayerRole();
    showQuestion();
    window.location.href = 'card-role.html?next=host-game.html';
    window.scrollTo(0, 0);
    closeModal('nextGameModal');
}

function resetRoundState() {
    answerSubmitted = false;
    submittedAnswer = '';
    submittedDrawing = null;
    const answerInput = document.getElementById('answerInput');
    const answerStatus = document.getElementById('answerStatus');
    const submitBtn = document.getElementById('submitBtn');
    const editAnswerBtn = document.getElementById('editAnswerBtn');
    if (answerInput) { answerInput.value = ''; answerInput.disabled = false; }
    if (answerStatus) answerStatus.style.display = 'none';
    if (submitBtn) submitBtn.style.display = 'block';
    if (editAnswerBtn) editAnswerBtn.style.display = 'none';
    clearCanvas();
    localStorage.removeItem('submittedAnswer');
    localStorage.removeItem('answerType');
    localStorage.removeItem('submittedDrawing');
    localStorage.removeItem('answerSubmitted');
}

function highlightNextGameButton() {
    const nextGameBtn = document.getElementById('next-game-btn');
    if (nextGameBtn && nextGameBtn.style.display !== 'none') {
        nextGameBtn.classList.add('pulse-highlight-strong');
        setTimeout(() => nextGameBtn.classList.remove('pulse-highlight-strong'), 3000);
    } else {
        const endGameBtn = document.getElementById('end-game-btn');
        if (endGameBtn) { endGameBtn.classList.add('pulse-highlight'); setTimeout(() => endGameBtn.classList.remove('pulse-highlight'), 3000); }
    }
}

function updateScoreSection() {
    const scoreGrid = document.getElementById('scoreGrid');
    if (!scoreGrid) return;
    scoreGrid.innerHTML = '';
    Object.keys(playerScores).forEach(playerName => {
        const scoreCard = createScoreCard(playerName, playerScores[playerName]);
        scoreGrid.appendChild(scoreCard);
    });
}

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

function changeScore(playerName, delta) {
    playerScores[playerName] = Math.max(0, playerScores[playerName] + delta);
    updateScoreSection();
    localStorage.setItem('playerScores', JSON.stringify(playerScores));
}

function handleFakerGiveUp() {
    if (!fakerGaveUp) showModal('giveUpModal');
}

function confirmFakerGiveUp() {
    fakerGaveUp = true;
    const giveUpBtn = document.getElementById('faker-give-up-btn');
    if (giveUpBtn) {
        giveUpBtn.textContent = '🏳️ Liar Gave Up';
        giveUpBtn.style.background = 'linear-gradient(135deg, #22c55e, #15803d)';
        giveUpBtn.disabled = true;
    }
    closeModal('giveUpModal');
}

function handleRevealFaker() { showModal('revealModal1'); }

function showSecondRevealModal() { closeModal('revealModal1'); showModal('revealModal2'); }

function confirmRevealFaker() { showPlayerInfo(); closeModal('revealModal2'); }

function showPlayerInfo() {
    const playerInfoList = document.getElementById('playerInfoList');
    if (!playerInfoList) return;
    playerInfoList.innerHTML = '';

    const gameInfo = window.getGameInfoFromCode(inviteCode);
    if (!gameInfo) return;

    const fakers = window.getFakersForGame(inviteCode, currentGame);

    for (let pIdx = 0; pIdx < gameInfo.totalPlayers; pIdx++) {
        const isFaker = fakers.includes(pIdx);
        const playerName = pIdx === 0 ? 'Host' : `Player ${pIdx}`;
        const playerDiv = document.createElement('div');
        playerDiv.className = 'player-info-item';
        playerDiv.innerHTML = `
            <div class="player-info-left">
                <span class="player-info-name">${playerName}</span>
                <span class="player-info-code">(${inviteCode})</span>
            </div>
            <span class="player-info-role ${isFaker ? 'faker' : 'normal'}">
                ${isFaker ? 'Liar' : 'Normal'}
            </span>
        `;
        playerInfoList.appendChild(playerDiv);
    }
    showModal('playerInfoModal');
}

function showEndGameModal() { showFinalScores(); showModal('endGameModal'); }

function showFinalScores() {
    const finalScores = document.getElementById('finalScores');
    if (!finalScores) return;
    finalScores.innerHTML = '';
    Object.entries(playerScores)
        .sort(([,a], [,b]) => b - a)
        .forEach(([name, score]) => {
            const scoreItem = document.createElement('div');
            scoreItem.className = 'final-score-item';
            scoreItem.innerHTML = `<span class="final-score-name">${name}</span><span class="final-score-value">${score} pts</span>`;
            finalScores.appendChild(scoreItem);
        });
}

function endGame() {
    localStorage.setItem('gameEndRound', currentRound.toString());
    localStorage.setItem('gameEndGame', currentGame.toString());
    localStorage.setItem('playerIndex', '0');
    localStorage.setItem(`votes_${inviteCode}_game_${currentGame}`, JSON.stringify(voteData));
    window.location.href = 'gameover.html';
}

function restartGame() { localStorage.clear(); window.location.href = 'host.html'; }
function goHome() { localStorage.clear(); window.location.href = 'index.html'; }

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

function stopDrawing() { isDrawing = false; ctx.closePath(); }

function handleTouch(e) {
    e.preventDefault();
    if (e.type === 'touchstart') {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        ctx.beginPath();
        ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
    } else if (e.type === 'touchmove' && isDrawing) {
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
        ctx.stroke();
    }
}

function changeColor(color) {
    currentColor = color;
    ctx.strokeStyle = color;
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.classList.remove('selected');
        if (btn.dataset.color === color) btn.classList.add('selected');
    });
}

function changeBrushSize(e) {
    currentBrushSize = parseInt(e.target.value);
    ctx.lineWidth = currentBrushSize;
}

function clearCanvas() {
    if (canvas && ctx) { ctx.fillStyle = 'white'; ctx.fillRect(0, 0, canvas.width, canvas.height); }
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        modal.style.opacity = '0';
        setTimeout(() => { modal.style.transition = 'opacity 0.3s ease'; modal.style.opacity = '1'; }, 10);
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => { modal.style.display = 'none'; modal.style.transition = ''; }, 300);
    }
}

function initializeVoteData() {
    const savedVotes = localStorage.getItem(`votes_${inviteCode}_game_${currentGame}`);
    if (savedVotes) { voteData = JSON.parse(savedVotes); }
    else {
        voteData = Array.from({ length: totalPlayers }, (_, i) => [i, -1, -1, -1, -1]);
        localStorage.setItem(`votes_${inviteCode}_game_${currentGame}`, JSON.stringify(voteData));
    }
}

// Statistics Game - Play Game Logic
// File Structure:
// ├── common.css (shared styles)
// ├── common.js (shared functions)
// ├── index.html
// ├── index.css
// ├── index.js
// ├── absolute.html
// ├── absolute.css
// ├── absolute.js
// ├── join.html
// ├── join.css
// ├── join.js
// ├── play.html
// ├── play.css
// ├── play.js - here (GLOBAL SCOPE VERSION)
// ├── statistics.js
// └── abs-gen-game.js
// NOTE: All helpers from common.js, statistics.js, abs-gen-game.js are available globally. Do **not** use import/export.

let currentRound = 1;
let gameNumbers = [];
let currentQuestion = null;
let userAnswer = 50;
let totalScore = 0;
let gameCode = '';
let gameMode = '';
let isDragging = false;

const DEBUG_MODE = false;

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('backButton').addEventListener('click', confirmBack);
    document.getElementById('submitButton').addEventListener('click', confirmSubmit);
    document.getElementById('nextButton').addEventListener('click', confirmNext);

    if (!validateGameSession()) {
        redirectToGameSelection();
        return;
    }

    initializeGame();
    setupCircularSlider();

    setTimeout(() => {
        createFloatingStats();
    }, 1000);
});

// Session validation
function validateGameSession() {
    const code = getGameCode();
    const mode = getGameMode();

    if (!code || code.length !== 4) {
        console.warn('No valid game code found in session');
        return false;
    }
    if (!mode) {
        console.warn('No game mode found in session');
        return false;
    }
    return true;
}

// Redirect to selection page if session is missing
function redirectToGameSelection() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>⚠️ No Game Session</h3>
            <p>No active game session found. Please start or join a game first.</p>
            <div class="modal-buttons">
                <button class="btn btn-primary" id="goToGameSelectionBtn">Go to Game Selection</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('goToGameSelectionBtn').addEventListener('click', () => {
        modal.remove();
        goToPage('absolute.html');
    });
}

function initializeGame() {
    gameCode = getGameCode() || 'DEMO';
    gameMode = getGameMode() || 'absolute';
    currentRound = getCurrentRound() || 1;
    totalScore = getTotalScore() || 0;

    // Generate unique question sequence
    if (DEBUG_MODE) {
        gameNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    } else {
        try {
            gameNumbers = generateSeededGameNumbers(gameCode);
        } catch (error) {
            gameNumbers = Array.from({length: 10}, (_, i) => i);
        }
    }

    const totalQuestions = getTotalQuestions();
    if (totalQuestions === 0) {
        showErrorModal('No questions available. Please check the statistics database.');
        return;
    }
    updateRoundDisplay();
    updateScoreDisplay();
    loadCurrentQuestion();
}

function updateRoundDisplay() {
    const roundElement = document.getElementById('roundNumber');
    if (roundElement) roundElement.textContent = currentRound;
}

function updateScoreDisplay() {
    const scoreElement = document.getElementById('totalScore');
    if (scoreElement) {
        scoreElement.textContent = totalScore;
        scoreElement.style.transform = 'scale(1.1)';
        setTimeout(() => {
            scoreElement.style.transform = 'scale(1)';
        }, 200);
    }
}

function loadCurrentQuestion() {
    if (currentRound > 10) {
        goToGameOver();
        return;
    }

    showLoadingModal();

    setTimeout(() => {
        let questionIndex;
        if (DEBUG_MODE) {
            questionIndex = 0;
        } else {
            questionIndex = gameNumbers[currentRound - 1];
        }

        currentQuestion = getStatisticByIndex(questionIndex);

        if (!currentQuestion) {
            currentQuestion = {
                question: "What percentage of people enjoy statistics games?",
                source: "Statistics Game Research, 2024",
                answer: 85
            };
        }
        const questionElement = document.getElementById('questionText');
        const sourceElement = document.getElementById('sourceText');
        if (questionElement) questionElement.textContent = currentQuestion.question;
        if (sourceElement) sourceElement.textContent = currentQuestion.source;

        hideLoadingModal();
        resetSlider();
        updateButtonStates('playing');
        const questionCard = document.querySelector('.question-card');
        if (questionCard) {
            questionCard.style.animation = 'none';
            setTimeout(() => {
                questionCard.style.animation = 'scaleIn 0.6s ease-out forwards';
            }, 50);
        }
    }, 1500);
}

function setupCircularSlider() {
    const slider = document.getElementById('circularSlider');
    const handle = document.getElementById('sliderHandle');
    const fill = document.getElementById('sliderFill');
    if (!slider || !handle || !fill) return;

    let centerX, centerY;

    function updateSlider(angle) {
        angle = ((angle % 360) + 360) % 360;
        const percentage = Math.round((angle / 360) * 100);
        userAnswer = percentage;
        const percentageElement = document.getElementById('percentageValue');
        if (percentageElement) percentageElement.textContent = percentage;

        const radius = 125;
        const displayAngle = (percentage / 100) * 360;
        const radianAngle = (displayAngle - 90) * Math.PI / 180;

        const handleX = centerX + radius * Math.cos(radianAngle) - 15;
        const handleY = centerY + radius * Math.sin(radianAngle) - 15;

        handle.style.left = handleX + 'px';
        handle.style.top = handleY + 'px';

        fill.style.background = `conic-gradient(var(--orange) 0deg, var(--orange) ${displayAngle}deg, transparent ${displayAngle}deg, transparent 360deg)`;
        fill.style.mask = `conic-gradient(from 0deg at 50% 50%, black 0deg, black ${displayAngle}deg, transparent ${displayAngle}deg, transparent 360deg)`;

        let color = 'var(--orange)';
        if (percentage <= 25) color = '#4CAF50';
        else if (percentage <= 50) color = '#FFC107';
        else if (percentage <= 75) color = 'var(--orange)';
        else color = '#F44336';
        handle.style.background = color;
    }

    function getAngleFromEvent(event) {
        const rect = slider.getBoundingClientRect();
        centerX = rect.width / 2;
        centerY = rect.height / 2;
        const clientX = event.clientX || (event.touches && event.touches[0].clientX);
        const clientY = event.clientY || (event.touches && event.touches[0].clientY);
        const x = clientX - rect.left - centerX;
        const y = clientY - rect.top - centerY;
        let normalizedAngleDegrees = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
        let clockwiseFromBottomAngle = (normalizedAngleDegrees + 90 + 360) % 360;
        return clockwiseFromBottomAngle;
    }

    slider.addEventListener('mousedown', function(e) {
        isDragging = true;
        updateSlider(getAngleFromEvent(e));
        slider.style.cursor = 'grabbing';
    });
    document.addEventListener('mousemove', function(e) {
        if (isDragging) updateSlider(getAngleFromEvent(e));
    });
    document.addEventListener('mouseup', function() {
        if (isDragging) {
            isDragging = false;
            slider.style.cursor = 'pointer';
            handle.style.transform = 'scale(1.2)';
            setTimeout(() => { handle.style.transform = 'scale(1)'; }, 150);
        }
    });
    slider.addEventListener('touchstart', function(e) {
        e.preventDefault();
        isDragging = true;
        updateSlider(getAngleFromEvent(e));
    });
    document.addEventListener('touchmove', function(e) {
        if (isDragging) {
            e.preventDefault();
            updateSlider(getAngleFromEvent(e));
        }
    });
    document.addEventListener('touchend', function() {
        if (isDragging) {
            isDragging = false;
            handle.style.transform = 'scale(1.2)';
            setTimeout(() => { handle.style.transform = 'scale(1)'; }, 150);
        }
    });

    // Initialize at 50%
    updateSlider(180);
}

function resetSlider() {
    userAnswer = 50;
    const percentageElement = document.getElementById('percentageValue');
    if (percentageElement) { percentageElement.textContent = '50'; }
    const handle = document.getElementById('sliderHandle');
    if (handle) {
        const slider = document.getElementById('circularSlider');
        const rect = slider.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const radius = 125;
        const handleX = centerX + radius * Math.cos(Math.PI / 2) - 15;
        const handleY = centerY + radius * Math.sin(Math.PI / 2) - 15;
        handle.style.left = handleX + 'px';
        handle.style.top = handleY + 'px';
        handle.style.background = 'var(--orange)';
    }
    const fill = document.getElementById('sliderFill');
    if (fill) {
        fill.style.background = `conic-gradient(var(--orange) 0deg, var(--orange) 180deg, transparent 180deg, transparent 360deg)`;
        fill.style.mask = `conic-gradient(from 0deg at 50% 50%, black 0deg, black 180deg, transparent 180deg, transparent 360deg)`;
    }
}

function updateButtonStates(state) {
    const submitBtn = document.getElementById('submitButton');
    const nextBtn = document.getElementById('nextButton');
    const backBtn = document.getElementById('backButton');
    switch(state) {
        case 'playing':
            if (submitBtn) { submitBtn.style.display = 'block'; submitBtn.disabled = false; }
            if (nextBtn) { nextBtn.style.display = 'none'; }
            if (backBtn) { backBtn.disabled = false; }
            break;
        case 'submitted':
            if (submitBtn) { submitBtn.style.display = 'none'; }
            if (nextBtn) { nextBtn.style.display = 'block'; nextBtn.disabled = false; }
            if (backBtn) { backBtn.disabled = true; }
            break;
    }
}

function confirmSubmit() {
    showConfirmModal(
        `🎯 Submit your answer: **${userAnswer}%**?\n\nOnce submitted, you cannot change your answer for this round.`,
        submitAnswer
    );
}

function submitAnswer() {
    if (!currentQuestion) {
        showErrorModal('An error occurred. No question loaded.');
        return;
    }
    const actualAnswer = currentQuestion.answer;
    const difference = Math.abs(userAnswer - actualAnswer);
    const accuracy = actualAnswer === 0 ? (userAnswer === 0 ? 100 : 0) : Math.max(0, 100 - (difference / actualAnswer * 100));
    const roundScore = Math.round(Math.pow(accuracy, 2));

    totalScore += roundScore;
    setTotalScore(totalScore);

    const answerData = {
        round: currentRound,
        question: currentQuestion.question,
        userAnswer: userAnswer,
        actualAnswer: actualAnswer,
        roundScore: roundScore,
        totalScore: totalScore
    };
    try {
        sessionStorage.setItem('currentAnswer', JSON.stringify(answerData));
    } catch (e) { }
    goToPage('standby.html');
}

// Standby/Results helper for inline display
function showRoundResults(answerData) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>📊 Round ${answerData.round} Results</h3>
            <div class="result-details">
                <p><strong>Your Answer:</strong> ${answerData.userAnswer}%</p>
                <p><strong>Actual Answer:</strong> ${answerData.actualAnswer}%</p>
                <p><strong>Difference:</strong> ${Math.abs(answerData.userAnswer - answerData.actualAnswer)}%</p>
                <p><strong>Round Score:</strong> ${answerData.roundScore} points</p>
                <p><strong>Total Score:</strong> ${answerData.totalScore} points</p>
            </div>
            <div class="modal-buttons">
                <button class="btn btn-primary" id="nextRoundOrFinalBtn">
                    ${answerData.round >= 10 ? '🎉 View Final Results' : '➡️ Next Round'}
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    document.getElementById('nextRoundOrFinalBtn').addEventListener('click', () => {
        modal.remove();
        if (answerData.round >= 10) {
            goToGameOver();
        } else {
            nextRound();
        }
    });
}

function confirmNext() {
    if (currentRound >= 10) {
        showConfirmModal(
            '🎉 This was the final round!\n\nProceed to see your final results?',
            goToGameOver
        );
    } else {
        showConfirmModal(
            `➡️ Move to Round ${currentRound + 1}?\n\nYou cannot go back to previous rounds.`,
            nextRound
        );
    }
}

function nextRound() {
    document.querySelectorAll('.modal-overlay').forEach(modal => modal.remove());
    currentRound++;
    setCurrentRound(currentRound);
    if (currentRound > 10) {
        goToGameOver();
    } else {
        updateRoundDisplay();
        loadCurrentQuestion();
    }
}

function confirmBack() {
    const destination = gameMode === 'join' ? 'join.html' : 'absolute.html';
    showConfirmModal(
        '⬅️ Go back to game selection?\n\nYour current game progress will be lost.',
        () => goToPage(destination)
    );
}

function goToGameOver() {
    const gameData = {
        totalScore: totalScore,
        rounds: currentRound > 10 ? 10 : currentRound,
        gameCode: gameCode,
        gameMode: gameMode,
        completedAt: new Date().toISOString()
    };
    try {
        localStorage.setItem('gameResults', JSON.stringify(gameData));
    } catch (e) {}

    fetch('gameover.html', { method: 'HEAD' })
        .then(response => {
            if (response.ok) {
                goToPage('gameover.html');
            } else {
                showFinalResults(gameData);
            }
        })
        .catch(() => {
            showFinalResults(gameData);
        });
}

function showFinalResults(gameData) {
    const actualRounds = gameData.rounds > 0 ? gameData.rounds : 1;
    const averageScore = Math.round(gameData.totalScore / actualRounds);
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>🎉 Game Complete!</h3>
            <div class="final-results">
                <p><strong>Game Code:</strong> ${gameData.gameCode}</p>
                <p><strong>Mode:</strong> ${gameData.gameMode === 'join' ? 'Multiplayer' : 'Single Player'}</p>
                <p><strong>Rounds Completed:</strong> ${gameData.rounds}/10</p>
                <p><strong>Total Score:</strong> ${gameData.totalScore} points</p>
                <p><strong>Average Score:</strong> ${averageScore} points per round</p>
            </div>
            <div class="modal-buttons">
                <button class="btn btn-secondary" id="finalMenuBtn">🏠 Main Menu</button>
                <button class="btn btn-primary" id="playAgainBtn">🔄 Play Again</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('finalMenuBtn').addEventListener('click', () => {
        modal.remove();
        goToPage('absolute.html');
    });
    document.getElementById('playAgainBtn').addEventListener('click', () => {
        modal.remove();
        startNewGame();
    });
}

function startNewGame() {
    sessionStorage.removeItem('gameCode');
    sessionStorage.removeItem('gameMode');
    sessionStorage.removeItem('currentRound');
    sessionStorage.removeItem('totalScore');
    sessionStorage.removeItem('currentAnswer');
    sessionStorage.removeItem('gameResults');
    goToPage('absolute.html');
}

function showLoadingModal() {
    const loadingModal = document.getElementById('loadingModal');
    if (loadingModal) loadingModal.style.display = 'flex';
}
function hideLoadingModal() {
    const loadingModal = document.getElementById('loadingModal');
    if (loadingModal) loadingModal.style.display = 'none';
}

function showErrorModal(message) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>❌ Error</h3>
            <p>${message}</p>
            <div class="modal-buttons">
                <button class="btn btn-primary" id="errorGoToMenuBtn">🏠 Go to Main Menu</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    document.getElementById('errorGoToMenuBtn').addEventListener('click', () => {
        modal.remove();
        goToPage('absolute.html');
    });
}

// Floating emoji animations
function createFloatingStats() {
    const stats = ['📊', '📈', '📉', '🎯', '💯', '🎲', '📋', '🔢'];
    const container = document.querySelector('.container') || document.body;

    stats.forEach((stat, index) => {
        setTimeout(() => {
            const element = document.createElement('div');
            element.textContent = stat;
            element.style.cssText = `
                position: fixed;
                font-size: 2rem;
                opacity: 0.1;
                pointer-events: none;
                animation: floatStat ${8 + Math.random() * 4}s infinite ease-in-out;
                left: ${Math.random() * 90}%;
                top: ${Math.random() * 80}%;
                z-index: -1;
            `;
            document.body.appendChild(element);
            setTimeout(() => {
                if (element.parentNode) element.parentNode.removeChild(element);
            }, 12000);
        }, index * 1500);
    });
}

// Add floating animation CSS (append only once)
const style = document.createElement('style');
style.textContent = `
    @keyframes floatStat {
        0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.1;
        }
        25% {
            transform: translateY(-40px) rotate(10deg);
            opacity: 0.2;
        }
        50% {
            transform: translateY(0px) rotate(-10deg);
            opacity: 0.15;
        }
        75% {
            transform: translateY(-20px) rotate(5deg);
            opacity: 0.1;
        }
    }
    .modal-overlay {
        position: fixed;
        top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex; justify-content: center; align-items: center;
        z-index: 1000; opacity: 0; transition: opacity 0.3s ease-out;
    }
    .modal-overlay.show { opacity: 1; }
    .modal-content {
        background: white;
        padding: 2rem;
        border-radius: 10px;
        text-align: center;
        max-width: 400px;
        margin: 1rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        transform: scale(0.9);
        transition: transform 0.3s ease-out;
    }
    .modal-overlay.show .modal-content { transform: scale(1); }
    .modal-buttons {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-top: 1.5rem;
    }
    .result-details, .final-results {
        text-align: left;
        margin: 1rem 0;
        padding: 1rem;
        background: #f5f5f5;
        border-radius: 5px;
    }
    .game-info { display: flex; gap: 1rem; font-size: 0.9rem; opacity: 0.8; }
    .game-code { font-weight: bold; color: var(--blue); }
    @keyframes scaleIn {
        from { transform: scale(0.9); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
    }
`;
document.head.appendChild(style);

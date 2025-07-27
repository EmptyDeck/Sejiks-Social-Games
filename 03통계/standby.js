// Statistics Game - Standby Page Logic
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
// ├── play.js
// ├── statistics.js
// ├── abs-gen-game.js
// └── standby.js - here
// ----------- NO import statement needed -----------

let answerData = null; // To store the data from sessionStorage

document.addEventListener('DOMContentLoaded', function() {
    // Retrieve the answer data from session storage
    const storedAnswer = sessionStorage.getItem('currentAnswer');
    if (storedAnswer) {
        answerData = JSON.parse(storedAnswer);
        console.log('Retrieved answer data:', answerData);
        // It's generally good to clear temporary session data after use
        sessionStorage.removeItem('currentAnswer');
    } else {
        console.warn('No answer data found in session storage. Redirecting to game selection.');
        goToPage('absolute.html');
        return;
    }

    // Attach event listener to the standby screen to reveal results
    const standbyScreen = document.getElementById('standbyScreen');
    if (standbyScreen) {
        standbyScreen.addEventListener('click', revealResults);
    }

    // Attach event listeners to the new buttons (visible after reveal)
    const goBackButton = document.getElementById('goBackButton');
    const coverItButton = document.getElementById('coverItButton');
    const proceedButton = document.getElementById('proceedButton');

    if (goBackButton) {
        goBackButton.addEventListener('click', handleGoBack);
    }
    if (coverItButton) {
        coverItButton.addEventListener('click', handleCoverIt);
    }
    if (proceedButton) {
        proceedButton.addEventListener('click', handleProceed);
    }

    // Add entrance animations for standby screen
    if (standbyScreen) {
        standbyScreen.style.opacity = '0';
        standbyScreen.style.transform = 'scale(0.9)';
        setTimeout(() => {
            standbyScreen.style.opacity = '1';
            standbyScreen.style.transform = 'scale(1)';
        }, 100);
    }

    // Create floating elements
    createFloatingStats();
});

function revealResults() {
    if (!answerData) {
        console.error('No answer data to reveal.');
        goToPage('absolute.html');
        return;
    }
    const standbyScreen = document.getElementById('standbyScreen');
    const resultsScreen = document.getElementById('resultsScreen');

    // Hide standby screen with animation
    if (standbyScreen) {
        standbyScreen.classList.add('hidden');
        const hideStandby = () => {
            standbyScreen.style.display = 'none';
            standbyScreen.removeEventListener('transitionend', hideStandby);
        };
        standbyScreen.addEventListener('transitionend', hideStandby, { once: true });
        setTimeout(() => {
            standbyScreen.style.display = 'none';
        }, 550);
    }

    // Populate results
    document.getElementById('summaryQuestion').textContent = answerData.question;
    document.getElementById('summarySource').textContent = answerData.source;
    document.getElementById('yourAnswerValue').textContent = answerData.userAnswer;
    document.getElementById('actualAnswerValue').textContent = answerData.actualAnswer;
    document.getElementById('differenceValue').textContent = Math.abs(answerData.userAnswer - answerData.actualAnswer);
    document.getElementById('roundScoreValue').textContent = answerData.roundScore;
    document.getElementById('totalScoreValue').textContent = answerData.totalScore;

    // Proceed button text
    const proceedButton = document.getElementById('proceedButton');
    if (proceedButton) {
        proceedButton.textContent = (answerData.round >= 10) ? '🎉 View Final Results' : '➡️ Next Round';
    }

    // Show results screen with animation
    if (resultsScreen) {
        resultsScreen.style.display = 'block';
        setTimeout(() => {
            resultsScreen.classList.add('show');
        }, 300);
    }
}

function handleGoBack() {
    showConfirmModal(
        'Are you sure you want to go back to game selection? Your current game progress will be lost.',
        function() { goToPage('absolute.html'); }
    );
}

function handleCoverIt() {
    const standbyScreen = document.getElementById('standbyScreen');
    const resultsScreen = document.getElementById('resultsScreen');
    // Hide results screen
    if (resultsScreen) {
        resultsScreen.classList.remove('show');
        const hideResults = () => {
            resultsScreen.style.display = 'none';
            resultsScreen.removeEventListener('transitionend', hideResults);
        };
        resultsScreen.addEventListener('transitionend', hideResults, { once: true });
        setTimeout(() => {
            resultsScreen.style.display = 'none';
        }, 550);
    }
    // Show standby screen
    if (standbyScreen) {
        standbyScreen.style.display = 'flex';
        setTimeout(() => {
            standbyScreen.classList.remove('hidden');
            standbyScreen.style.opacity = '1';
            standbyScreen.style.transform = 'scale(1)';
        }, 300);
    }
}

function handleProceed() {
    if (!answerData) {
        console.error('Cannot proceed, no answer data.');
        goToPage('absolute.html');
        return;
    }
    if (answerData.round >= 10) {
        console.log('Final round reached, showing game over screen.');
        saveGameResults();
        goToPage('gameover.html');
    } else {
        console.log('Proceeding to next round.');
        let nextRoundNum = answerData.round + 1;
        setCurrentRound(nextRoundNum);
        goToPage('play.html');
    }
}
function saveGameResults() {

    const gameData = {
        totalScore: answerData.totalScore,
        rounds: answerData.round,
        gameCode: getGameCode(),  
        gameMode: getGameMode(),
        completedAt: new Date().toISOString()
    };
    try {
        localStorage.setItem('gameResults', JSON.stringify(gameData));
        console.log('Saved game results in localStorage:', gameData);
    } catch (e) {
        console.warn('Could not save game results:', e);
    }
}

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

// Add the floating animation CSS if not already present (optional, see comment)
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
`;
document.head.appendChild(style);

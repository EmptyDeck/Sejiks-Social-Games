// Statistics Game - Game Over Logic
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
// ├── standby.html
// ├── standby.css
// ├── standby.js
// └── gameover.js - here

let gameResults = null;

document.addEventListener('DOMContentLoaded', function() {
    // Retrieve final game results from localStorage
    const storedResults = localStorage.getItem('gameResults');
    if (storedResults) {
        gameResults = JSON.parse(storedResults);
        console.log('Retrieved final game results:', gameResults);
        // Optionally clear the results after displaying if they are truly "final" for this session
        localStorage.removeItem('gameResults');
    } else {
        console.warn('No game results found in local storage. Redirecting to main menu.');
        goToPage('index.html');
        return;
    }

    // Populate the HTML with game results
    displayGameResults();

    // Attach event listeners to buttons
    document.getElementById('mainMenuButton').addEventListener('click', handleMainMenu);
    document.getElementById('playAgainButton').addEventListener('click', handlePlayAgain);

    // Add entrance animations
    setTimeout(() => {
        document.querySelector('.game-header').classList.add('show');
    }, 100);

    setTimeout(() => {
        document.querySelector('.final-results-card').classList.add('show');
    }, 300);

    setTimeout(() => {
        document.querySelector('.info-section').classList.add('show');
    }, 500);

    // Floating celebration
    createFloatingStats();
});

function displayGameResults() {
    if (!gameResults) { return; }
    document.getElementById('finalScoreValue').textContent = gameResults.totalScore;
    document.getElementById('statsGameCode').textContent = gameResults.gameCode || 'N/A';
    document.getElementById('statsGameMode').textContent = gameResults.gameMode === 'join' ? 'Multiplayer' : 'Single Player';
    document.getElementById('statsRoundsCompleted').textContent = gameResults.rounds;
    const averageScore = gameResults.rounds > 0 ? Math.round(gameResults.totalScore / gameResults.rounds) : 0;
    document.getElementById('statsAverageScore').textContent = averageScore;
    // Format completion time
    const completedDate = gameResults.completedAt ? new Date(gameResults.completedAt) : null;
    if (completedDate) {
        document.getElementById('statsCompletedAt').textContent = completedDate.toLocaleString();
    } else {
        document.getElementById('statsCompletedAt').textContent = 'N/A';
    }
}

function handleMainMenu() {
    showConfirmModal(
        'Are you sure you want to go back to the main menu? Your game results are saved.',
        function() { goToPage('index.html'); }
    );
}

function handlePlayAgain() {
    showConfirmModal(
        'Start a new game? Your previous results are saved.',
        startNewGameSession
    );
}

function startNewGameSession() {
    // Clear temporary session data for a fresh start, keep gameResults in localStorage
    sessionStorage.removeItem('gameCode');
    sessionStorage.removeItem('gameMode');
    sessionStorage.removeItem('currentRound');
    sessionStorage.removeItem('totalScore');
    sessionStorage.removeItem('currentAnswer');
    // Do NOT remove 'gameResults' from localStorage here.
    goToPage('absolute.html');
}

// Celebrate!
function createFloatingStats() {
    const stats = ['🏆', '✨', '🌟', '🎉', '📈', '📊'];
    const container = document.querySelector('.container') || document.body;
    stats.forEach((stat, index) => {
        setTimeout(() => {
            const element = document.createElement('div');
            element.textContent = stat;
            element.style.cssText = `
                position: fixed;
                font-size: 2.5rem;
                opacity: 0.1;
                pointer-events: none;
                animation: floatStat ${10 + Math.random() * 5}s infinite ease-in-out;
                left: ${Math.random() * 90}%;
                top: ${Math.random() * 80}%;
                z-index: -1;
            `;
            document.body.appendChild(element);
            setTimeout(() => {
                if (element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            }, 15000);
        }, index * 2000);
    });
}

// Floating animation CSS (included for completeness)
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


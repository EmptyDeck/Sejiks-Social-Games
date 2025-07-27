// Statistics Game - Absolute Mode Logic
// File Structure:
// ├── common.css (shared styles)
// ├── common.js (shared functions)
// ├── index.html
// ├── index.css
// ├── index.js
// ├── absolute.html
// ├── absolute.css
// ├── absolute.js - here
// ├── join.html
// ├── join.css
// ├── join.js
// ├── play.html
// ├── play.css
// ├── play.js
// ├── statistics.js
// └── abs-gen-game.js
// NOTE: This file assumes all helpers are global via common.js

// NO IMPORTS!

let selectedOption = '';

function selectOption(option) {
    // Remove previous selection
    document.querySelectorAll('.option-card').forEach(card => {
        card.classList.remove('selected', 'selecting');
    });

    // Add selecting animation
    const optionCard = document.getElementById(option + 'Option');
    optionCard.classList.add('selecting');

    setTimeout(() => {
        optionCard.classList.remove('selecting');
        optionCard.classList.add('selected');
        selectedOption = option;

        // Update action button text and show it
        const actionButton = document.getElementById('actionButton');
        const actionSection = document.getElementById('actionSection');

        if (option === 'host') {
            actionButton.innerHTML = '👑 Create Game Room';
        } else if (option === 'join') {
            actionButton.innerHTML = '🚪 Enter Game Code';
        }

        actionSection.style.display = 'block';

        // Entrance animation
        actionSection.style.animation = 'fadeInUp 0.5s ease-out';
    }, 300);
}

function proceedToGame() {
    if (!selectedOption) {
        alert('🤔 Please select an option first!');
        return;
    }

    const btn = document.getElementById('actionButton');
    if (btn) {
        // Optionally use: addClickAnimation(btn);
        btn.style.transform = 'scale(0.95)';

        setTimeout(() => {
            btn.style.transform = 'scale(1)';

            if (selectedOption === 'host') {
                // Generate game code and go to play page
                const gameCode = generateGameCode();
                setGameCode(gameCode);

                // Show generated code modal
                showGameCodeModal(gameCode);

            } else if (selectedOption === 'join') {
                goToPage('join.html');
            }
        }, 150);
    }
}

function showGameCodeModal(code) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>🎉 Game Room Created!</h3>
            <p>Share this code with your friends:</p>
            <div class="code-display">${code}</div>
            <p style="font-size: 0.9rem; opacity: 0.8; margin: 15px 0;">
                Players can join by entering this code
            </p>
            <div class="modal-buttons">
                <button class="btn btn-secondary" id="copyCodeButton">
                    📋 Copy Code
                </button>
                <button class="btn btn-primary" id="startGameSessionButton">
                    🚀 Start Game
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Attach event listeners
    document.getElementById('copyCodeButton').addEventListener('click', function() {
        copyToClipboard(code);
    });
    document.getElementById('startGameSessionButton').addEventListener('click', startGameSession);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        const btn = document.getElementById('copyCodeButton');
        if (btn) {
            const originalText = btn.innerHTML;
            btn.innerHTML = '✅ Copied!';
            btn.style.background = 'var(--orange)';

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = 'var(--blue)';
            }, 1500);
        }
    }).catch((err) => {
        console.error('Failed to copy text: ', err);
        alert(`Game Code: ${text}\n\nPlease copy this code manually.`);
    });
}

function startGameSession() {
    // Close modal
    const modal = document.querySelector('.modal-overlay');
    if (modal) modal.remove();

    // Initialize game state
    setCurrentRound(1);
    setTotalScore(0);

    // Go to play.html
    goToPage('play.html');
}

function goBack() {
    showConfirmModal(
        'Are you sure you want to go back to the main menu?',
        function() { goToPage('index.html'); }
    );
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Set mode in session
    setGameMode('absolute');

    // Entrance animations
    setTimeout(() => {
        document.querySelector('.game-header').style.opacity = '1';
    }, 100);
    setTimeout(() => {
        document.querySelector('.card').style.opacity = '1';
    }, 300);
    setTimeout(() => {
        document.querySelector('.info-panel').style.opacity = '1';
    }, 500);

    // Attach listeners
    document.getElementById('hostOption').addEventListener('click', function() {
        selectOption('host');
    });
    document.getElementById('joinOption').addEventListener('click', function() {
        selectOption('join');
    });
    document.getElementById('actionButton').addEventListener('click', proceedToGame);
    document.getElementById('backToMainButton').addEventListener('click', goBack);

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === '1') {
            selectOption('host');
        } else if (e.key === '2') {
            selectOption('join');
        } else if (e.key === 'Enter' && selectedOption) {
            proceedToGame();
        } else if (e.key === 'Escape') {
            goBack();
        }
    });

    // Floating symbols for fun visuals
    createFloatingElements();
});

// Floating elements for visual appeal
function createFloatingElements() {
    const symbols = ['📊', '📈', '📉', '🎯', '💯', '🔢'];
    const container = document.querySelector('.container');

    symbols.forEach((symbol, index) => {
        setTimeout(() => {
            const element = document.createElement('div');
            element.textContent = symbol;
            element.style.cssText = `
                position: absolute;
                font-size: 2rem;
                opacity: 0.1;
                pointer-events: none;
                animation: floatSymbol ${8 + Math.random() * 4}s infinite ease-in-out;
                left: ${Math.random() * 90}%;
                top: ${Math.random() * 80}%;
                z-index: -1;
            `;
            container.appendChild(element);

            setTimeout(() => {
                if (element.parentNode) element.parentNode.removeChild(element);
            }, 12000);
        }, index * 1000);
    });
}

// Add floating animation to the page (just once!)
const style = document.createElement('style');
style.textContent = `
    @keyframes floatSymbol {
        0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.1;
        }
        25% {
            transform: translateY(-20px) rotate(90deg);
            opacity: 0.2;
        }
        50% {
            transform: translateY(0px) rotate(180deg);
            opacity: 0.15;
        }
        75% {
            transform: translateY(-15px) rotate(270deg);
            opacity: 0.1;
        }
    }
`;
document.head.appendChild(style);

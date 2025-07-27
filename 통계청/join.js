// Statistics/
// ├── common.css
// ├── common.js
// ├── index.html
// ├── index.css
// ├── index.js
// ├── absolute.html
// ├── absolute.css
// ├── absolute.js
// ├── join.html
// ├── join.css
// ├── join.js // <— here
// ├── play.html
// ├── play.css
// ├── play.js
// ├── statistics.js
// └── abs-gen-game.js

let currentInputIndex = 0;

function handleCodeInput(index) {
    const input = document.getElementById(`letter${index + 1}`);
    const value = input.value.toUpperCase();

    // Only allow letters, excluding I and L
    const validChars = /^[A-HJ-KM-NPR-Z]$/;
    if (value && !validChars.test(value)) {
        input.value = '';
        input.classList.add('error');
        setTimeout(() => {
            input.classList.remove('error');
        }, 500);
        return;
    }

    if (value) {
        input.value = value;
        input.classList.add('filled', 'success');

        if (index < 3) {
            document.getElementById(`letter${index + 2}`).focus();
            currentInputIndex = index + 1;
        } else {
            // All fields filled, enable join button
            updateJoinButton();
        }

        setTimeout(() => {
            input.classList.remove('success');
        }, 300);
    } else {
        input.classList.remove('filled');
        updateJoinButton();
    }
}

function handleKeyDown(event, index) {
    const input = event.target;
    if (event.key === 'Backspace') {
        if (!input.value && index > 0) {
            const prevInput = document.getElementById(`letter${index}`);
            prevInput.focus();
            prevInput.select();
            currentInputIndex = index - 1;
        } else if (input.value) {
            input.value = '';
            input.classList.remove('filled');
            updateJoinButton();
        }
    } else if (event.key === 'ArrowLeft' && index > 0) {
        document.getElementById(`letter${index}`).focus();
        currentInputIndex = index - 1;
    } else if (event.key === 'ArrowRight' && index < 3) {
        document.getElementById(`letter${index + 2}`).focus();
        currentInputIndex = index + 1;
    } else if (event.key === 'Enter') {
        joinGame();
    }
}

function updateJoinButton() {
    const joinButton = document.getElementById('joinButton');
    const code = getEnteredCode();
    if (code.length === 4) {
        joinButton.classList.add('btn-orange');
        joinButton.innerHTML = '🚀 Join Game';
        joinButton.disabled = false;
    } else {
        joinButton.classList.remove('btn-orange');
        joinButton.innerHTML = `🚀 Join Game (${code.length}/4)`;
        joinButton.disabled = false;
    }
}

function getEnteredCode() {
    let code = '';
    for (let i = 1; i <= 4; i++) {
        const value = document.getElementById(`letter${i}`).value;
        if (value) code += value.toUpperCase();
    }
    return code;
}

function clearCode() {
    for (let i = 1; i <= 4; i++) {
        const input = document.getElementById(`letter${i}`);
        input.value = '';
        input.classList.remove('filled', 'error');
    }
    document.getElementById('letter1').focus();
    currentInputIndex = 0;
    updateJoinButton();

    document.querySelectorAll('.code-letter').forEach((input, index) => {
        setTimeout(() => {
            input.style.transform = 'scale(0.8)';
            setTimeout(() => {
                input.style.transform = 'scale(1)';
            }, 100);
        }, index * 50);
    });
}

function joinGame() {
    const code = getEnteredCode();
    if (code.length !== 4) {
        showCodeError('Please enter all 4 letters of the game code!');
        return;
    }
    if (!validateGameCode(code)) {
        showCodeError('Invalid game code format!');
        return;
    }
    document.getElementById('loadingModal').style.display = 'flex';
    setTimeout(() => {
        document.getElementById('loadingModal').style.display = 'none';
        setGameCode(code);
        setGameMode('join');
        setCurrentRound(1);
        setTotalScore(0);
        sessionStorage.removeItem('currentAnswer');
        sessionStorage.removeItem('gameResults');
        console.log('Game initialized with code:', code);
        console.log('Current round set to:', getCurrentRound());
        console.log('Total score set to:', getTotalScore());
        showJoinSuccess(code);
    }, 1500);
}

function showCodeError(message) {
    document.querySelectorAll('.code-letter').forEach(input => {
        input.classList.add('error');
    });
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>❌ Invalid Code</h3>
            <p>${message}</p>
            <div class="modal-buttons">
                <button class="btn btn-primary" onclick="this.closest('.modal-overlay').remove(); focusFirstEmptyInput();">
                    Try Again
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    setTimeout(() => {
        document.querySelectorAll('.code-letter').forEach(input => {
            input.classList.remove('error');
        });
    }, 2000);
}

function showJoinSuccess(code) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>🎉 Successfully Joined!</h3>
            <p>Connected to game room:</p>
            <div class="code-display">${code}</div>
            <p style="font-size: 0.9rem; opacity: 0.8;">
                Get ready to test your statistical knowledge!
            </p>
            <div class="modal-buttons">
                <button class="btn btn-primary" id="startPlayingButton">
                    🎮 Start Playing
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    const startButton = document.getElementById('startPlayingButton');
    if (startButton) {
        startButton.addEventListener('click', startJoinedGame);
    }
}

function startJoinedGame() {
    document.querySelector('.modal-overlay').remove();
    goToPage('play.html');
}

function focusFirstEmptyInput() {
    for (let i = 1; i <= 4; i++) {
        const input = document.getElementById(`letter${i}`);
        if (!input.value) {
            input.focus();
            currentInputIndex = i - 1;
            return;
        }
    }
    document.getElementById('letter1').focus();
    currentInputIndex = 0;
}

function goBack() {
    showConfirmModal(
        'Are you sure you want to go back? Your entered code will be lost.',
        function() { goToPage('absolute.html'); }
    );
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('letter1').focus();
    setTimeout(() => {
        document.querySelector('.game-header').style.opacity = '1';
    }, 100);
    setTimeout(() => {
        document.querySelector('.card').style.opacity = '1';
    }, 300);
    setTimeout(() => {
        document.querySelector('.info-section').style.opacity = '1';
    }, 500);
    updateJoinButton();

    // Programmatic event listeners
    for (let i = 0; i < 4; i++) {
        const input = document.getElementById(`letter${i + 1}`);
        input.addEventListener('input', () => handleCodeInput(i));
        input.addEventListener('keydown', (event) => handleKeyDown(event, i));
    }

    document.getElementById('joinButton').addEventListener('click', joinGame);
    document.getElementById('clearButton').addEventListener('click', clearCode);
    document.getElementById('backButton').addEventListener('click', goBack);

    document.addEventListener('paste', function(e) {
        const pastedText = e.clipboardData.getData('text').toUpperCase();
        if (pastedText.length === 4 && /^[A-HJ-KM-NPR-Z]{4}$/.test(pastedText)) {
            for (let i = 0; i < 4; i++) {
                const input = document.getElementById(`letter${i + 1}`);
                input.value = pastedText[i];
                input.classList.add('filled');
            }
            updateJoinButton();
            document.querySelectorAll('.code-letter').forEach((input, idx) => {
                setTimeout(() => {
                    input.classList.add('success');
                    setTimeout(() => {
                        input.classList.remove('success');
                    }, 300);
                }, idx * 100);
            });
        }
    });

    createFloatingCodes();
});

// Floating code examples for visual appeal
function createFloatingCodes() {
    const codes = ['ABCD', 'GAME', 'PLAY', 'STAT', 'QUIZ', 'TEAM'];
    const container = document.querySelector('.container');
    codes.forEach((code, index) => {
        setTimeout(() => {
            const element = document.createElement('div');
            element.textContent = code;
            element.style.cssText = `
                position: absolute;
                font-size: 1.5rem;
                font-weight: bold;
                color: var(--blue);
                opacity: 0.05;
                pointer-events: none;
                animation: floatCode ${10 + Math.random() * 5}s infinite ease-in-out;
                left: ${Math.random() * 80}%;
                top: ${Math.random() * 70}%;
                z-index: -1;
                font-family: 'Courier New', monospace;
            `;
            container.appendChild(element);
            setTimeout(() => {
                if (element.parentNode) element.parentNode.removeChild(element);
            }, 15000);
        }, index * 2000);
    });
}

// Add floating animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes floatCode {
        0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.05;
        }
        25% {
            transform: translateY(-30px) rotate(5deg);
            opacity: 0.1;
        }
        50% {
            transform: translateY(0px) rotate(-5deg);
            opacity: 0.08;
        }
        75% {
            transform: translateY(-20px) rotate(3deg);
            opacity: 0.06;
        }
    }
`;
document.head.appendChild(style);

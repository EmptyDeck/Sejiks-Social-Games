// Statistics/
// ├── common.css
// ├── common.js - here (GLOBAL SCOPE, NOT MODULE)
// ├── index.html
// ├── index.css
// ├── index.js
// ├── absolute.html
// ├── absolute.css
// ├── absolute.js
// ...
// Generate random 4-letter code (excluding i and l)
function generateGameCode() {
    const alphabets = 'abcdefghjkmnopqrstuvwxyz'; // 24 letters (no i, l)
    let code = '';
    for (let i = 0; i < 4; i++) {
        code += alphabets.charAt(Math.floor(Math.random() * alphabets.length));
    }
    return code.toUpperCase();
}

// Store game code in session
function setGameCode(code) {
    sessionStorage.setItem('gameCode', code);
}

// Get game code from session
function getGameCode() {
    return sessionStorage.getItem('gameCode') || '';
}

// Store game mode in session
function setGameMode(mode) {
    sessionStorage.setItem('gameMode', mode);
}

// Get game mode from session
function getGameMode() {
    return sessionStorage.getItem('gameMode') || 'absolute';
}

// Store current round in session
function setCurrentRound(round) {
    sessionStorage.setItem('currentRound', round.toString());
}

// Get current round from session
function getCurrentRound() {
    return parseInt(sessionStorage.getItem('currentRound') || '0');
}

// Store total score in session
function setTotalScore(score) {
    sessionStorage.setItem('totalScore', score.toString());
}

// Get total score from session
function getTotalScore() {
    return parseInt(sessionStorage.getItem('totalScore') || '0');
}

// Calculate score based on guess accuracy
function calculateScore(userAnswer, actualAnswer) {
    const accuracy = Math.abs(userAnswer - actualAnswer) / actualAnswer * 100;
    const score = Math.pow(100 - accuracy, 2);
    return Math.max(0, Math.round(score));
}

// Navigation function
function goToPage(page) {
    window.location.href = page;
}

// Show confirmation modal
function showConfirmModal(message, onConfirm, onCancel = null) {
    // Remove any existing modals
    document.querySelectorAll('.modal-overlay').forEach(m => m.remove());

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>🤔 Confirm Action</h3>
            <p>${message}</p>
            <div class="modal-buttons">
                <button class="btn btn-secondary" id="modalCancelBtn">Cancel</button>
                <button class="btn btn-primary" id="modalConfirmBtn">Confirm</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    setTimeout(() => {
        modal.classList.add('show');
    }, 10);

    const confirmBtn = document.getElementById('modalConfirmBtn');
    const cancelBtn = document.getElementById('modalCancelBtn');

    const closeAndCleanup = () => {
        modal.classList.remove('show');
        modal.addEventListener('transitionend', () => {
            if (modal.parentNode) {
                modal.remove();
            }
        }, { once: true });
    };

    confirmBtn.addEventListener('click', () => {
        closeAndCleanup();
        if (typeof onConfirm === 'function') onConfirm();
    });

    cancelBtn.addEventListener('click', () => {
        closeAndCleanup();
        if (typeof onCancel === 'function') onCancel();
    });
}

// Add click animation to buttons
function addClickAnimation(element) {
    element.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
    });
}

// Initialize common functionality for all pages
document.addEventListener('DOMContentLoaded', function() {
    // Add click animations to all buttons
    document.querySelectorAll('.btn').forEach(addClickAnimation);

    // Add hover effects
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Validation function
function validateGameCode(code) {
    return code && code.length === 4 && /^[A-Z]+$/.test(code);
}

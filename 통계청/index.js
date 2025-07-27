// No import statements needed!
// Assumes setGameMode, goToPage, addClickAnimation defined in global scope

let selectedMode = '';


function selectMode(mode) {
    // Remove previous selection
    document.querySelectorAll('.mode-card').forEach(card => {
        card.classList.remove('selected', 'selecting');
    });

    // Don't allow selecting relative mode (coming soon)
    if (mode === 'relative') {
        return;
    }

    // Add selecting animation
    const modeCard = document.getElementById(mode + 'Mode');
    modeCard.classList.add('selecting');

    setTimeout(() => {
        modeCard.classList.remove('selecting');
        modeCard.classList.add('selected');
        selectedMode = mode;

        // Store selected mode
        setGameMode(mode); // Comes from common.js

        // Show action buttons
        const actionButtons = document.getElementById('actionButtons');
        actionButtons.style.display = 'block';

        // Add sound effect (for future use)
        // playSound('select');
    }, 300);
}


function startGame() {
    if (!selectedMode) {
        alert('🤔 Please select a game mode first!');
        return;
    }

    const btn = document.getElementById('startGameButton');
    if (btn) {
        // You can use addClickAnimation if you want
        // addClickAnimation(btn); // If defined in common.js
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
            // Navigate to the selected mode page
            if (selectedMode === 'absolute') {
                goToPage('absolute.html'); // Comes from common.js
            } else if (selectedMode === 'relative') {
                alert('🚧 Relative mode is coming soon!');
            }
        }, 150);
    }
}


document.addEventListener('DOMContentLoaded', function() {
    // Entrance animations
    setTimeout(() => {
        document.querySelector('.game-header').style.opacity = '1';
    }, 100);

    setTimeout(() => {
        document.querySelector('.card').style.opacity = '1';
    }, 300);

    setTimeout(() => {
        document.querySelector('.info-section').style.opacity = '1';
    }, 500);

    // Clear previous game data
    sessionStorage.removeItem('gameCode');
    sessionStorage.removeItem('currentRound');
    sessionStorage.removeItem('totalScore');

    // Attach Event Listeners
    document.getElementById('absoluteMode').addEventListener('click', () => selectMode('absolute'));
    document.getElementById('relativeMode').addEventListener('click', () => selectMode('relative'));
    document.getElementById('startGameButton').addEventListener('click', startGame);

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === '1') {
            selectMode('absolute');
        } else if (e.key === 'Enter' && selectedMode) {
            startGame();
        }
    });

    // Particle effect (optional)
    createParticles();
});


// Optional: Create floating particles for visual appeal
function createParticles() {
    const container = document.querySelector('.container');

    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: var(--blue);
                border-radius: 50%;
                pointer-events: none;
                animation: float ${3 + Math.random() * 4}s infinite ease-in-out;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                opacity: 0.6;
            `;
            container.appendChild(particle);

            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 7000);
        }, i * 500);
    }
}

// Add the float animation to the page
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        25% { transform: translateY(-10px) rotate(90deg); }
        50% { transform: translateY(0px) rotate(180deg); }
        75% { transform: translateY(-5px) rotate(270deg); }
    }
`;
document.head.appendChild(style);

// host.js - Liar Hunt (English)

let totalPlayers = 4;
let fakerCount = 1;
let inviteCode = null;

document.addEventListener('DOMContentLoaded', function () {
    if (!window.isGameDataLoaded()) {
        showToast('Game system load error. Please refresh the page.', 'error');
        return;
    }

    document.getElementById('totalCount').textContent = totalPlayers;
    document.getElementById('fakerCount').textContent = fakerCount;

    document.getElementById('startBtn').addEventListener('click', startGame);
    addTouchFeedback();
});

function addTouchFeedback() {
    document.querySelectorAll('.counter-btn, .generate-btn, .start-btn').forEach(btn => {
        btn.addEventListener('touchstart', function () {
            if (!this.classList.contains('disabled')) this.style.transform = 'scale(0.95)';
        });
        btn.addEventListener('touchend', function () {
            setTimeout(() => { this.style.transform = ''; }, 150);
        });
    });
}

function changeCount(type, delta) {
    if (type === 'total') {
        const newTotal = totalPlayers + delta;
        if (newTotal >= 3 && newTotal <= 17) {
            totalPlayers = newTotal;
            document.getElementById('totalCount').textContent = totalPlayers;
            if (fakerCount >= totalPlayers) {
                fakerCount = Math.max(1, totalPlayers - 1);
                document.getElementById('fakerCount').textContent = fakerCount;
            }
            clearInviteCode();
        }
    } else if (type === 'faker') {
        const newFaker = fakerCount + delta;
        if (newFaker >= 1 && newFaker <= 15 && newFaker < totalPlayers) {
            fakerCount = newFaker;
            document.getElementById('fakerCount').textContent = fakerCount;
            clearInviteCode();
        }
    }
}

function clearInviteCode() {
    inviteCode = null;
    document.getElementById('codesGrid').innerHTML = '';
    document.getElementById('warningText').style.display = 'none';
    document.getElementById('startBtn').classList.add('disabled');
}

function generateCodes() {
    if (!window.isGameDataLoaded()) {
        showToast('Game data system not ready.', 'error');
        return;
    }

    inviteCode = window.generateInviteCode(totalPlayers, fakerCount);

    if (!inviteCode) {
        showToast('Failed to generate invite code. Check your settings.', 'error');
        return;
    }

    const validation = window.validateGameData(inviteCode);
    if (!validation.valid) {
        showToast('Code error: ' + validation.errors.join(', '), 'error');
        return;
    }

    document.getElementById('codesGrid').innerHTML = `
        <div class="big-invite-code">${inviteCode}</div>
        <div class="code-info">
            👥 ${totalPlayers} players &nbsp;|&nbsp; 🎭 ${fakerCount} liar${fakerCount > 1 ? 's' : ''}
        </div>
    `;

    document.getElementById('startBtn').classList.remove('disabled');
    saveGameData();
}

function saveGameData() {
    if (!inviteCode) return;
    localStorage.setItem('inviteCode', inviteCode);
    localStorage.setItem('totalPlayers', totalPlayers.toString());
    localStorage.setItem('fakerCount', fakerCount.toString());
    localStorage.setItem('currentGame', '1');
    localStorage.setItem('currentRound', '1');
    localStorage.setItem('isHost', 'true');
    localStorage.setItem('playerIndex', '0');
    localStorage.setItem('playerName', 'Host');
}

function startGame() {
    if (!inviteCode) return;
    saveGameData();
    window.location.href = 'card-role.html?next=host-game.html';
}

// join.js - Liar Hunt (English)

const NICK_ADJ = ['Swift','Lazy','Brave','Cute','Scary','Sleepy','Hungry','Excited','Quiet','Loud','Sweet','Quirky','Shy','Lively','Clever','Cheerful','Happy','Angry','Fiery','Chilly'];
const NICK_NOUN = ['Cat','Dog','Rabbit','Fox','Bear','Tiger','Panda','Penguin','Koala','Squirrel','Frog','Hedgehog','Otter','Raccoon','Hippo','Giraffe','Elephant','Monkey','Lion','Mole'];

let currentNickname = '';

function generateRandomNickname() {
    const adj = NICK_ADJ[Math.floor(Math.random() * NICK_ADJ.length)];
    const noun = NICK_NOUN[Math.floor(Math.random() * NICK_NOUN.length)];
    return adj + ' ' + noun;
}

function refreshNickname() {
    currentNickname = generateRandomNickname();
    const el = document.getElementById('nicknameValue');
    if (el) el.textContent = currentNickname;
}

const codeInputs = document.querySelectorAll('.code-input');
const joinBtn = document.getElementById('joinBtn');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');
const selectedPlayerNumber = document.getElementById('selectedPlayerNumber');

let wheelPicker = null;
let wheelItems = null;
let currentPlayerIndex = 1;
let maxPlayers = 17;
let actualMaxPlayers = 17;
let currentGameInfo = null;
let isDragging = false;
let startY = 0;
let startTranslateY = 0;
let velocity = 0;
let lastY = 0;
let lastTime = 0;
let animationId = null;

document.addEventListener('DOMContentLoaded', function () {
    refreshNickname();
    document.getElementById('nicknameRerollBtn').addEventListener('click', refreshNickname);
    initializeWheelPicker();
    initializeCodeInputs();
    checkGameSystems();
    document.getElementById('joinBtn').addEventListener('click', joinGame);
});

function checkGameSystems() {
    if (!window.isGameDataLoaded() || !window.isQuestionsLoaded()) {
        showError('Loading game systems. Please try again in a moment.');
        joinBtn.disabled = true;
    }
}

function initializeWheelPicker() {
    wheelPicker = document.getElementById('playerWheelPicker');
    wheelItems = document.getElementById('wheelItems');
    updateWheelItems();
    setupWheelEvents();
    updateWheelPosition(1, false);
}

function updateWheelItems() {
    if (!wheelItems) return;
    wheelItems.innerHTML = '';
    for (let i = 1; i <= actualMaxPlayers; i++) {
        const item = document.createElement('div');
        item.className = 'wheel-item';
        item.textContent = i;
        item.dataset.value = i;
        wheelItems.appendChild(item);
    }
}

function updateWheelItemsImmediate() {
    const items = wheelItems.querySelectorAll('.wheel-item');
    items.forEach((item, idx) => {
        const show = (idx + 1) <= actualMaxPlayers;
        item.style.display = show ? 'flex' : 'none';
        item.style.opacity = show ? '1' : '0';
    });
    if (currentPlayerIndex > actualMaxPlayers) updateWheelPosition(1, true);
    hideMessages();
}

function resetWheelToDefault() {
    actualMaxPlayers = maxPlayers;
    updateWheelItems();
    updateWheelPosition(1, true);
}

function setupWheelEvents() {
    wheelPicker.addEventListener('mousedown', handleStart);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    wheelPicker.addEventListener('touchstart', handleStart, { passive: false });
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleEnd);
    wheelPicker.addEventListener('wheel', handleWheel, { passive: false });
}

function handleStart(e) {
    e.preventDefault();
    isDragging = true;
    const clientY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;
    startY = clientY; lastY = clientY; lastTime = Date.now();
    const transform = getComputedStyle(wheelItems).transform;
    startTranslateY = transform !== 'none' ? new DOMMatrix(transform).m42 : 0;
    velocity = 0;
    if (animationId) { cancelAnimationFrame(animationId); animationId = null; }
    wheelPicker.style.cursor = 'grabbing';
}

function handleMove(e) {
    if (!isDragging) return;
    e.preventDefault();
    const clientY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;
    const now = Date.now();
    if (now - lastTime > 10) { velocity = (clientY - lastY) / (now - lastTime); lastY = clientY; lastTime = now; }
    wheelItems.style.transform = `translateY(${startTranslateY + (clientY - startY)}px)`;
    updateSelectedItem();
}

function handleEnd() {
    if (!isDragging) return;
    isDragging = false;
    wheelPicker.style.cursor = 'grab';
    startInertiaScroll();
}

function handleWheel(e) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 1 : -1;
    const newIdx = Math.max(1, Math.min(actualMaxPlayers, currentPlayerIndex + delta));
    if (newIdx !== currentPlayerIndex) updateWheelPosition(newIdx, true);
}

function startInertiaScroll() {
    if (Math.abs(velocity) < 0.1) { snapToNearest(); return; }
    function animate() {
        let currentY = 0;
        const t = getComputedStyle(wheelItems).transform;
        if (t !== 'none') currentY = new DOMMatrix(t).m42;
        const newY = currentY + velocity * 16;
        velocity *= 0.95;
        wheelItems.style.transform = `translateY(${newY}px)`;
        updateSelectedItem();
        if (Math.abs(velocity) > 0.1) animationId = requestAnimationFrame(animate);
        else snapToNearest();
    }
    animationId = requestAnimationFrame(animate);
}

function snapToNearest() {
    let currentY = 0;
    const t = getComputedStyle(wheelItems).transform;
    if (t !== 'none') currentY = new DOMMatrix(t).m42;
    const idx = Math.max(0, Math.min(actualMaxPlayers - 1, Math.round(-currentY / 50)));
    updateWheelPosition(idx + 1, true);
}

function updateWheelPosition(playerIndex, animate = false) {
    const clamped = Math.max(1, Math.min(actualMaxPlayers, playerIndex));
    currentPlayerIndex = clamped;
    const translateY = -(clamped - 1) * 50;
    wheelItems.style.transition = animate ? 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none';
    wheelItems.style.transform = `translateY(${translateY}px)`;
    if (animate) setTimeout(() => { wheelItems.style.transition = ''; }, 500);
    updateSelectedItem();
}

function updateSelectedItem() {
    const items = wheelItems.querySelectorAll('.wheel-item');
    let currentY = 0;
    const t = getComputedStyle(wheelItems).transform;
    if (t !== 'none') currentY = new DOMMatrix(t).m42;
    const idx = Math.max(0, Math.min(actualMaxPlayers - 1, Math.round(-currentY / 50)));
    items.forEach(item => item.classList.remove('selected'));
    if (items[idx]) { items[idx].classList.add('selected'); selectedPlayerNumber.textContent = idx + 1; }
    currentPlayerIndex = idx + 1;
}

function initializeCodeInputs() {
    codeInputs.forEach((input, index) => {
        input.addEventListener('input', function (e) {
            const value = e.target.value.toUpperCase();
            const validChars = /^[ABCDEFGHJKMNOPQRSTUVWXYZ]$/;
            if (value && !validChars.test(value)) {
                e.target.value = '';
                showError('Only letters except i and l are allowed.');
                return;
            }
            e.target.value = value;
            if (value && index < codeInputs.length - 1) codeInputs[index + 1].focus();
            e.target.classList.toggle('filled', !!value);
            e.target.classList.remove('error');
            updateJoinButton();
            hideMessages();
            if (isCodeComplete()) setTimeout(updateWheelRangeFromCode, 100);
            else resetWheelToDefault();
        });

        input.addEventListener('keydown', function (e) {
            if (e.key === 'Backspace' && !e.target.value && index > 0) codeInputs[index - 1].focus();
            if (e.key === 'Enter' && isCodeComplete()) joinGame();
        });

        input.addEventListener('paste', function (e) {
            e.preventDefault();
            const pasted = e.clipboardData.getData('text').toUpperCase();
            if (pasted.length === 4 && /^[ABCDEFGHJKMNOPQRSTUVWXYZ]{4}$/.test(pasted)) {
                pasted.split('').forEach((char, i) => {
                    if (i < codeInputs.length) { codeInputs[i].value = char; codeInputs[i].classList.add('filled'); }
                });
                updateJoinButton();
                hideMessages();
                setTimeout(updateWheelRangeFromCode, 100);
            }
        });
    });
}

function updateWheelRangeFromCode() {
    const code = getEnteredCode();
    if (code.length === 4) {
        try {
            const gameInfo = window.getGameInfoFromCode(code);
            if (gameInfo) {
                currentGameInfo = gameInfo;
                actualMaxPlayers = gameInfo.totalPlayers - 1;
                updateWheelItemsImmediate();
                displayGameInfo(gameInfo);
            } else {
                resetWheelToDefault();
                showError('Invalid invite code.');
            }
        } catch (e) {
            resetWheelToDefault();
            showError('Error validating code.');
        }
    }
}

function displayGameInfo(gameInfo) {
    const gameInfoDiv = document.getElementById('gameInfo');
    gameInfoDiv.innerHTML = `
        🎮 Game Info
        <div class="info-item">Total players: ${gameInfo.totalPlayers}</div>
        <div class="info-item">Liars: ${gameInfo.fakerCount}</div>
    `;
    gameInfoDiv.style.display = 'block';
    gameInfoDiv.style.opacity = '0';
    gameInfoDiv.style.transform = 'translateY(-10px)';
    setTimeout(() => {
        gameInfoDiv.style.transition = 'all 0.3s ease';
        gameInfoDiv.style.opacity = '1';
        gameInfoDiv.style.transform = 'translateY(0)';
    }, 50);
}

function isCodeComplete() {
    return Array.from(codeInputs).every(input => input.value.length === 1);
}

function updateJoinButton() {
    joinBtn.disabled = !isCodeComplete() || !window.isGameDataLoaded() || !window.isQuestionsLoaded();
}

function getEnteredCode() {
    return Array.from(codeInputs).map(input => input.value).join('');
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    successMessage.style.display = 'none';
    codeInputs.forEach(input => {
        input.classList.add('error');
        setTimeout(() => input.classList.remove('error'), 500);
    });
}

function showSuccess(message) {
    successMessage.textContent = message;
    successMessage.style.display = 'block';
    errorMessage.style.display = 'none';
}

function hideMessages() {
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';
}

function validateCode(code) {
    if (!window.isGameDataLoaded() || !window.isQuestionsLoaded())
        return { valid: false, message: 'Game system not ready.' };
    if (code.length !== 4)
        return { valid: false, message: 'Please enter the full 4-character code.' };
    if (!/^[ABCDEFGHJKMNOPQRSTUVWXYZ]{4}$/.test(code))
        return { valid: false, message: 'Please enter a valid code.' };
    const gameInfo = window.getGameInfoFromCode(code);
    if (!gameInfo) return { valid: false, message: 'Invalid invite code.' };
    const validation = window.validateGameData(code);
    if (!validation.valid) return { valid: false, message: 'Code validation failed: ' + validation.errors.join(', ') };
    currentGameInfo = gameInfo;
    return { valid: true, code, gameInfo };
}

function joinGame() {
    if (!isCodeComplete()) { showError('Please enter the full 4-character code.'); return; }

    const code = getEnteredCode();
    const validation = validateCode(code);
    if (!validation.valid) { showError(validation.message); return; }

    const gameInfo = validation.gameInfo;
    const selectedPlayer = currentPlayerIndex;
    const maxPlayerIdx = gameInfo.totalPlayers - 1;

    if (selectedPlayer < 1 || selectedPlayer > maxPlayerIdx) {
        showError(`Player number must be between 1 and ${maxPlayerIdx}.`);
        return;
    }

    const nickname = currentNickname || `Player${selectedPlayer}`;

    showSuccess(`${nickname} (Player ${selectedPlayer}) ready to join!`);
    document.body.classList.add('loading');
    joinBtn.textContent = 'Joining...';

    setTimeout(() => {
        localStorage.setItem('inviteCode', code);
        localStorage.setItem('totalPlayers', gameInfo.totalPlayers.toString());
        localStorage.setItem('fakerCount', gameInfo.fakerCount.toString());
        localStorage.setItem('playerIndex', selectedPlayer.toString());
        localStorage.setItem('playerName', nickname);
        localStorage.setItem('currentGame', '1');
        localStorage.setItem('currentRound', '1');
        localStorage.setItem('isHost', 'false');
        window.location.href = 'card-role.html?next=player-game.html';
    }, 800);
}

window.addEventListener('load', function () {
    if (codeInputs[0]) codeInputs[0].focus();
});

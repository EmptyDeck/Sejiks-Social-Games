// card-role.js - Liar Hunt (English)

let nextPage = '';
let totalPlayers = 4;
let fakerCount = 1;
let playerIndex = 0;
let inviteCode = '';
let roleAssignments = {};
let playerRole = '';
let cardFlipped = false;
let selectedCardIndex = -1;

document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    generateCards();
    setupEventListeners();
});

function initializePage() {
    const urlParams = new URLSearchParams(window.location.search);
    nextPage = urlParams.get('next') || 'host-game.html';

    loadGameData();
    determinePlayerRole();
    updateGameInfo();
}

function determinePlayerRole() {
    const gameNumber = parseInt(localStorage.getItem('currentGame') || '1');
    const liars = window.getFakersForGame(inviteCode, gameNumber);
    playerRole = liars.includes(playerIndex) ? 'liar' : 'normal';
}

function loadGameData() {
    try {
        totalPlayers = parseInt(localStorage.getItem('totalPlayers')) || 4;
        fakerCount = parseInt(localStorage.getItem('fakerCount')) || 1;
        playerIndex = parseInt(localStorage.getItem('playerIndex')) || 0;
        inviteCode = localStorage.getItem('inviteCode') || localStorage.getItem('hostCode') || 'ABCD';

        if (totalPlayers < 2) totalPlayers = 4;
        if (totalPlayers > 17) totalPlayers = 17;
        if (fakerCount < 1) fakerCount = 1;
        if (fakerCount >= totalPlayers) fakerCount = Math.max(1, totalPlayers - 1);

        if (!window.isGameDataLoaded || !window.isGameDataLoaded()) {
            throw new Error('GameData system not loaded');
        }

        const validation = window.validateGameData(inviteCode);
        if (!validation.valid) {
            throw new Error('Invalid invite code');
        }
    } catch (error) {
        console.error('Game data load failed:', error);
        totalPlayers = 4;
        fakerCount = 1;
        playerIndex = 0;
        inviteCode = 'ABCD';
    }
}

function assignRoles() {
    const gameNumber = parseInt(localStorage.getItem('currentGame') || '1');
    const liars = window.getFakersForGame(inviteCode, gameNumber);
    roleAssignments = {};
    for (let i = 0; i < totalPlayers; i++) {
        roleAssignments[i] = liars.includes(i) ? 'liar' : 'normal';
    }
}

function updateGameInfo() {
    document.getElementById('gameCode').textContent = `Code: ${inviteCode}`;
    document.getElementById('playerInfo').textContent =
        playerIndex === 0 ? `Host/${totalPlayers}` : `Player ${playerIndex}/${totalPlayers}`;
}

function generateCards() {
    const container = document.getElementById('cardsContainer');
    container.innerHTML = '';

    for (let i = 0; i < totalPlayers; i++) {
        const card = createCard(i);
        container.appendChild(card);
        setTimeout(() => { card.style.animationDelay = `${i * 0.1}s`; }, i * 100);
    }
}

function createCard(index) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.index = index;

    const cardInner = document.createElement('div');
    cardInner.className = 'card-inner';

    const cardBack = document.createElement('div');
    cardBack.className = 'card-face card-back';

    const cardFront = document.createElement('div');
    cardFront.className = 'card-face card-front';

    cardInner.appendChild(cardBack);
    cardInner.appendChild(cardFront);
    card.appendChild(cardInner);

    return card;
}

function setupEventListeners() {
    document.addEventListener('click', function(e) {
        const card = e.target.closest('.card');
        if (!card || cardFlipped || card.classList.contains('disabled')) return;
        flipCard(card);
    });

    document.getElementById('continueBtn').addEventListener('click', function() {
        goToNextPage();
    });
}

function flipCard(card) {
    if (cardFlipped) return;

    selectedCardIndex = parseInt(card.dataset.index);
    cardFlipped = true;

    assignRoleToCard(card, playerRole);

    const allCards = document.querySelectorAll('.card');
    allCards.forEach(c => { if (c !== card) c.classList.add('disabled'); });

    setTimeout(() => { revealAllCards(); }, 300);
    setTimeout(() => { showResult(); }, 500);
}

function assignRoleToCard(card, role) {
    const cardFront = card.querySelector('.card-front');
    cardFront.className = `card-face card-front ${role}`;

    const emoji = document.createElement('div');
    emoji.className = 'card-emoji';
    emoji.textContent = role === 'liar' ? '🎭' : '👤';

    const text = document.createElement('div');
    text.className = 'card-text';
    text.textContent = role === 'liar' ? 'Liar' : 'Normal';

    cardFront.appendChild(emoji);
    cardFront.appendChild(text);

    card.classList.add('flipped');
}

function revealAllCards() {
    const allCards = document.querySelectorAll('.card');
    const remainingRoles = generateRemainingRoles();

    allCards.forEach((card, index) => {
        if (index !== selectedCardIndex) {
            const randomRole = remainingRoles.pop();
            assignRoleToCard(card, randomRole);
        }
        card.classList.remove('disabled');
    });
}

function generateRemainingRoles() {
    const roles = [];
    const normalCount = totalPlayers - fakerCount;
    const liarCount = fakerCount;

    if (playerRole === 'liar') {
        for (let i = 0; i < normalCount; i++) roles.push('normal');
        for (let i = 0; i < liarCount - 1; i++) roles.push('liar');
    } else {
        for (let i = 0; i < normalCount - 1; i++) roles.push('normal');
        for (let i = 0; i < liarCount; i++) roles.push('liar');
    }

    for (let i = roles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [roles[i], roles[j]] = [roles[j], roles[i]];
    }

    return roles;
}

function showResult() {
    const resultOverlay = document.getElementById('resultOverlay');
    const roleIcon = document.getElementById('roleIcon');
    const roleTitle = document.getElementById('roleTitle');
    const roleDescription = document.getElementById('roleDescription');

    if (playerRole === 'liar') {
        roleIcon.textContent = '🎭';
        roleTitle.textContent = 'LIAR';
        roleTitle.style.color = 'var(--red)';
        roleDescription.textContent = "You are the Liar! Deceive the other players and figure out the real question.";
    } else {
        roleIcon.textContent = '👤';
        roleTitle.textContent = 'NORMAL';
        roleTitle.style.color = 'var(--blue)';
        roleDescription.textContent = "You are a Normal Player. Find the liar and answer honestly!";
    }

    resultOverlay.classList.add('show');
}

function goToNextPage() {
    localStorage.setItem('playerRole', playerRole);
    localStorage.setItem('roleRevealed', 'true');
    window.location.href = nextPage;
}

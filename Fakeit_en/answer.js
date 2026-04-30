// answer.js - Liar Hunt (English)

let playerIndex = 0;
let currentRound = 1;
let currentGame = 1;
let inviteCode = '';
let answerType = 'text';
let submittedAnswer = '';
let submittedDrawing = '';
let fromPage = '';
let votes = {};
let gameData = null;
let totalPlayers = 4;
let voteData = [];

document.addEventListener('DOMContentLoaded', function() {
    loadGameData();
    initializeRoundVotes();
    initializePage();
    setupEventListeners();
});

function loadGameData() {
    inviteCode = localStorage.getItem('inviteCode') || '';
    playerIndex = parseInt(localStorage.getItem('playerIndex')) || 0;
    currentRound = parseInt(localStorage.getItem('currentRound')) || 1;
    currentGame = parseInt(localStorage.getItem('currentGame')) || 1;
    answerType = localStorage.getItem('answerType') || 'text';
    submittedAnswer = localStorage.getItem('submittedAnswer') || '';
    submittedDrawing = localStorage.getItem('submittedDrawing') || '';

    const urlParams = new URLSearchParams(window.location.search);
    fromPage = urlParams.get('from') || 'host';

    totalPlayers = parseInt(localStorage.getItem('totalPlayers')) || 4;

    const savedVotes = localStorage.getItem(`votes_${inviteCode}_game_${currentGame}`);
    if (savedVotes) {
        voteData = JSON.parse(savedVotes);
    } else {
        voteData = Array.from({ length: totalPlayers }, (_, i) => [i, -1, -1, -1, -1]);
    }
}

function initializePage() {
    document.getElementById('gameInfo').textContent = `Game ${currentGame} - Round ${currentRound}`;

    const roleText = fromPage === 'host' ? 'Host' : `Player ${playerIndex}`;
    document.getElementById('playerRole').textContent = roleText;

    const amILiar = inviteCode
        ? window.isPlayerFaker(inviteCode, currentGame, playerIndex)
        : false;
    const backBtn = document.getElementById('backBtn');
    if (amILiar && backBtn) {
        backBtn.disabled = true;
        backBtn.style.opacity = '0.3';
        backBtn.style.pointerEvents = 'none';
        backBtn.title = 'The Liar cannot go back after answers are revealed';
    }

    setupAnswerCard();
    createVoteButtons();
}

function setupAnswerCard() {
    const answerContent = document.getElementById('answerContent');
    const tapIndicator = document.querySelector('.tap-indicator');

    answerContent.classList.remove('show');
    tapIndicator.style.display = 'block';

    if (answerType === 'drawing') {
        answerContent.innerHTML = '<canvas id="answerCanvas" width="300" height="200"></canvas>';
        const canvas = document.getElementById('answerCanvas');
        const ctx = canvas.getContext('2d');

        if (submittedDrawing) {
            const img = new Image();
            img.onload = function() { ctx.drawImage(img, 0, 0, canvas.width, canvas.height); };
            img.src = submittedDrawing;
        } else {
            answerContent.innerHTML = '<div class="answer-text">No drawing submitted</div>';
        }
    } else {
        const answerTextElement = document.querySelector('#answerContent .answer-text');
        if (answerTextElement) {
            answerTextElement.textContent = submittedAnswer || 'No answer submitted';
        }
    }
}

function createVoteButtons() {
    const voteSection = document.getElementById('voteSection');
    voteSection.innerHTML = '';

    createVoteButton('host', 'Host');

    for (let i = 1; i < totalPlayers; i++) {
        createVoteButton(`player${i}`, `Player ${i}`);
    }
}

function createVoteButton(targetId, targetName) {
    const voteSection = document.getElementById('voteSection');
    const button = document.createElement('button');
    button.className = 'vote-btn';
    button.textContent = targetName;
    button.onclick = () => toggleVote(targetId);
    button.id = `vote-${targetId}`;
    voteSection.appendChild(button);
}

function toggleVote(targetId) {
    const button = document.getElementById(`vote-${targetId}`);
    const targetIndex = targetId === 'host' ? 0 : parseInt(targetId.replace('player', ''));

    if (voteData[targetIndex][currentRound] === 1) {
        voteData[targetIndex][currentRound] = 0;
        button.classList.remove('voted');
    } else {
        voteData[targetIndex][currentRound] = 1;
        button.classList.add('voted');
    }
    updateVoteDisplay();
    saveVotes();
}

function updateVoteDisplay() {
    const voteCount = voteData.reduce((count, row) => count + (row[currentRound] === 1 ? 1 : 0), 0);
    document.getElementById('voteCount').textContent = `Votes: ${voteCount}`;
}

function toggleAnswerCard() {
    const answerContent = document.getElementById('answerContent');
    const cardTitle = document.getElementById('cardTitle');
    const tapIndicator = document.querySelector('.tap-indicator');

    answerContent.classList.toggle('show');
    if (answerContent.classList.contains('show')) {
        cardTitle.textContent = 'Hide Answer';
        tapIndicator.style.display = 'none';
    } else {
        cardTitle.textContent = 'Tap to Reveal Answer';
        tapIndicator.style.display = 'block';
    }
}

function openModal(modalId) {
    document.getElementById(modalId).classList.add('show');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

function giveUpAsLiar() {
    openModal('giveUpModal');
}

function confirmGiveUp() {
    closeModal('giveUpModal');
    saveVotes();
    localStorage.setItem('gameResult', 'liar_give_up');
    window.location.href = 'gameover.html';
}

function endGame() {
    openModal('endGameModal');
}

function confirmEndGame() {
    closeModal('endGameModal');
    saveVotes();
    localStorage.setItem('gameResult', 'normal_end');
    window.location.href = 'gameover.html';
}

function nextRound() {
    if (currentRound === 4) {
        const nextGameBtn = document.getElementById('nextGameBtn');
        nextGameBtn.classList.add('highlight-button');
        return;
    } else {
        openModal('nextRoundModal');
    }
}

function confirmNextRound() {
    closeModal('nextRoundModal');
    saveVotes();
    clearPlayerAnswerData();
    currentRound++;
    localStorage.setItem('currentRound', currentRound.toString());
    goBack();
}

function nextGame() {
    openModal('nextGameModal');
}

function confirmNextGame() {
    closeModal('nextGameModal');
    saveVotes();
    clearPlayerAnswerData();

    const nextGame = parseInt(localStorage.getItem('currentGame') || '1') + 1;
    localStorage.setItem('currentGame', nextGame.toString());
    localStorage.setItem('currentRound', '1');
    localStorage.setItem('votes', JSON.stringify(votes));
    localStorage.removeItem('playerRole');
    localStorage.removeItem('roleRevealed');

    const pIdx = parseInt(localStorage.getItem('playerIndex') || '0');
    const nextPage = pIdx === 0 ? 'host-game.html' : 'player-game.html';
    window.location.href = `card-role.html?next=${nextPage}`;
}

function clearPlayerAnswerData() {
    localStorage.removeItem('playerAnswer');
    localStorage.removeItem('playerDrawing');
    localStorage.removeItem('answerSubmitted');
}

function goBack() {
    saveVotes();
    if (fromPage === 'host' || fromPage === 'player0') {
        window.location.href = 'host-game.html';
    } else {
        window.location.href = 'player-game.html';
    }
}

function setupEventListeners() {
    document.getElementById('answerCard').addEventListener('click', toggleAnswerCard);
    document.getElementById('giveUpBtn').addEventListener('click', giveUpAsLiar);
    document.getElementById('endGameBtn').addEventListener('click', endGame);
    document.getElementById('nextRoundBtn').addEventListener('click', nextRound);
    document.getElementById('nextGameBtn').addEventListener('click', nextGame);
    document.getElementById('backBtn').addEventListener('click', goBack);

    window.addEventListener('click', function(event) {
        const modals = ['giveUpModal', 'endGameModal', 'nextRoundModal', 'nextGameModal'];
        modals.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (event.target === modal) closeModal(modalId);
        });
    });
}

function saveVotes() {
    if (!inviteCode || !currentGame || !currentRound) return;
    localStorage.setItem(`votes_${inviteCode}_game_${currentGame}`, JSON.stringify(voteData));
}

function initializeRoundVotes() {
    for (let i = 0; i < totalPlayers; i++) {
        if (voteData[i] && voteData[i][currentRound] === -1) {
            voteData[i][currentRound] = 0;
        }
    }
    localStorage.setItem(`votes_${inviteCode}_game_${currentGame}`, JSON.stringify(voteData));
}

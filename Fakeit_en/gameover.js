// gameover.js - Liar Hunt (English)

let inviteCode = '';
let playerIndex = 0;
let currentRound = 1;
let currentGame = 1;
let totalPlayers = 4;
let playerScores = {};
let voteData = [];

document.addEventListener('DOMContentLoaded', function() {
    if (!window.isGameDataLoaded || !window.isGameDataLoaded()) {
        showError('Error loading game system. Please refresh the page.');
        disableControls('Game system load failed');
        return;
    }

    if (loadGameData()) {
        initializeUI();
        setupEventListeners();
    } else {
        console.error('Data load failed, initialization aborted');
    }
});

function loadGameData() {
    inviteCode = localStorage.getItem('inviteCode') || '';
    if (!inviteCode || inviteCode.length !== 4 || !/^[A-Z]{4}$/.test(inviteCode)) {
        showError('Invalid invite code. Please start a new game.');
        disableControls('Invalid invite code');
        return false;
    }

    const playerIndexTemp = localStorage.getItem('playerIndex');
    if (playerIndexTemp === null || isNaN(parseInt(playerIndexTemp))) {
        showError('Player data is corrupted. Please start a new game.');
        disableControls('Invalid player index');
        return false;
    }
    playerIndex = parseInt(playerIndexTemp);

    currentRound = parseInt(localStorage.getItem('currentRound')) || 1;
    currentGame = parseInt(localStorage.getItem('currentGame')) || 1;

    try {
        const gameInfo = window.getGameInfoFromCode(inviteCode);
        if (!gameInfo || gameInfo.totalPlayers < 2) throw new Error('Invalid game info');
        totalPlayers = gameInfo.totalPlayers;
    } catch (error) {
        console.error('Failed to load totalPlayers:', error);
        totalPlayers = 4;
        showError('Could not load game info. Please start a new game.');
        disableControls('Game info load failed');
        return false;
    }

    const savedScores = localStorage.getItem('playerScores');
    if (savedScores) {
        try {
            playerScores = JSON.parse(savedScores);
        } catch (error) {
            initializePlayerScores();
        }
    } else {
        initializePlayerScores();
    }

    const savedVotes = localStorage.getItem(`votes_${inviteCode}_game_${currentGame}`);
    if (savedVotes) {
        try {
            voteData = JSON.parse(savedVotes);
        } catch (error) {
            voteData = Array.from({ length: totalPlayers }, (_, i) => [i, -1, -1, -1, -1]);
        }
    } else {
        voteData = Array.from({ length: totalPlayers }, (_, i) => [i, -1, -1, -1, -1]);
    }

    return true;
}

function disableControls(reason) {
    console.warn('Controls disabled:', reason);
    const container = document.querySelector('.container') || document.body;
    if (container) {
        container.style.pointerEvents = 'none';
        container.style.opacity = '0.6';
    }
    showError('Game progress stopped. Please refresh or start over.');
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.background = '#fed7d7';
    errorDiv.style.color = '#c53030';
    errorDiv.style.padding = '15px';
    errorDiv.style.margin = '10px 0';
    errorDiv.style.borderRadius = '8px';
    errorDiv.style.textAlign = 'center';
    errorDiv.style.position = 'fixed';
    errorDiv.style.top = '20px';
    errorDiv.style.left = '50%';
    errorDiv.style.transform = 'translateX(-50%)';
    errorDiv.style.zIndex = '1000';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
}

function initializePlayerScores() {
    playerScores = {};
    playerScores['Host'] = 0;
    for (let i = 1; i < totalPlayers; i++) {
        playerScores[`Player${i}`] = 0;
    }
}

function initializeUI() {
    updateGameInfo();
    updatePlayerRole();

    let amILiar = false;
    try {
        amILiar = window.isPlayerFaker(inviteCode, currentGame, playerIndex);
    } catch (error) {
        console.error('Error checking liar status:', error);
        amILiar = false;
    }

    if (amILiar) {
        calculateScoresForLiar();
        displayFakerPerformance();
        document.getElementById('fakerSection').style.display = 'block';
        document.getElementById('normalPlayerSection').style.display = 'none';
        displayScores();
    } else {
        document.getElementById('fakerSection').style.display = 'none';
        document.getElementById('normalPlayerSection').style.display = 'block';
    }

    displayVotingResults();
}

function displayVotingResults() {
    const votingResultContainer = document.getElementById('votingResult');
    if (!votingResultContainer) return;

    let html = '<h4>Round-by-Round Votes</h4>';
    for (let round = 1; round <= currentRound; round++) {
        html += `<div style="margin-bottom: 15px;"><strong>Round ${round}</strong><ul>`;
        const roundVotes = voteData.map(row => row[round]);
        const votedPlayers = roundVotes.map((vote, idx) => vote === 1 ? idx : -1).filter(idx => idx !== -1);
        if (votedPlayers.length > 0) {
            votedPlayers.forEach(pIdx => {
                const playerName = pIdx === 0 ? 'Host' : `Player ${pIdx}`;
                html += `<li>${playerName}</li>`;
            });
        } else {
            html += `<li>No votes cast</li>`;
        }
        html += '</ul></div>';
    }
    votingResultContainer.innerHTML = html;
}

function displayFakerPerformance() {
    const performanceStats = document.getElementById('performanceStats');
    if (!performanceStats) return;
    performanceStats.innerHTML = '';

    const liarKey = playerIndex;
    let votesReceived = 0;
    const totalVoters = totalPlayers - 1;

    for (let round = 1; round <= currentRound; round++) {
        votesReceived += voteData[liarKey] && voteData[liarKey][round] === 1 ? 1 : 0;
    }

    const fooledCount = totalVoters - votesReceived;
    const successRate = totalVoters > 0 ? Math.round((fooledCount / totalVoters) * 100) : 0;

    const stats = [
        { label: 'Fooled Players', value: fooledCount },
        { label: 'Votes Received', value: votesReceived },
        { label: 'Success Rate', value: `${successRate}%` }
    ];

    stats.forEach(stat => {
        const statItem = document.createElement('div');
        statItem.className = 'stat-item';
        statItem.innerHTML = `
            <span class="stat-value">${stat.value}</span>
            <span class="stat-label">${stat.label}</span>
        `;
        performanceStats.appendChild(statItem);
    });
}

function calculateScoresForLiar() {
    if (!inviteCode) return;

    let liarScore = 0;
    const voterScores = {};

    for (let i = 0; i < totalPlayers; i++) voterScores[i] = 0;

    for (let round = 1; round <= currentRound; round++) {
        let votedCount = 0;
        for (let player = 0; player < totalPlayers; player++) {
            if (voteData[player] && voteData[player][round] === 1) {
                voterScores[player] += 1;
                votedCount++;
            }
        }
        const nonVotedCount = totalPlayers - 1 - votedCount;
        liarScore += nonVotedCount;
    }

    const liarName = playerIndex === 0 ? 'Host' : `Player${playerIndex}`;
    playerScores[liarName] = (playerScores[liarName] || 0) + liarScore;

    for (let i = 0; i < totalPlayers; i++) {
        if (i !== playerIndex) {
            const playerName = i === 0 ? 'Host' : `Player${i}`;
            playerScores[playerName] = (playerScores[playerName] || 0) + voterScores[i];
        }
    }

    localStorage.setItem('playerScores', JSON.stringify(playerScores));
}

function updateGameInfo() {
    const gameInfoElement = document.getElementById('gameInfo');
    if (gameInfoElement) gameInfoElement.textContent = `Game ${currentGame} Over`;
}

function updatePlayerRole() {
    const playerRoleElement = document.getElementById('playerRole');
    const playerNumberElement = document.getElementById('playerNumber');
    let amILiar = false;

    try {
        amILiar = window.isPlayerFaker(inviteCode, currentGame, playerIndex);
    } catch (error) {
        amILiar = false;
    }

    if (playerRoleElement) {
        playerRoleElement.textContent = amILiar ? 'Liar' : 'Normal Player';
        playerRoleElement.className = amILiar ? 'role-value faker' : 'role-value normal';
    }

    if (playerNumberElement) {
        playerNumberElement.textContent = playerIndex === 0 ? 'Host' : `Player ${playerIndex}`;
        playerNumberElement.style.display = 'inline-block';
    }
}

function displayScores() {
    const finalScoresContainer = document.getElementById('finalScores');
    if (!finalScoresContainer) return;

    finalScoresContainer.innerHTML = '';

    const sortedScores = Object.entries(playerScores).sort((a, b) => b[1] - a[1]);

    sortedScores.forEach(([name, score]) => {
        const item = document.createElement('div');
        item.className = 'score-item';
        item.innerHTML = `
            <span class="score-name">${name}</span>
            <span class="score-value">${score} pts</span>
        `;
        finalScoresContainer.appendChild(item);
    });
}

function setupEventListeners() {
    const newGameBtn = document.getElementById('newGameBtn');
    if (newGameBtn) newGameBtn.addEventListener('click', startNewGame);

    const homeBtn = document.getElementById('homeBtn');
    if (homeBtn) homeBtn.addEventListener('click', goHome);

    const nextGameBtn = document.getElementById('nextGameBtn');
    if (nextGameBtn) nextGameBtn.addEventListener('click', startNextGame);
}

function startNewGame() {
    window.location.href = 'host.html';
}

function startNextGame() {
    const preservedData = {
        playerScores: localStorage.getItem('playerScores'),
        inviteCode: localStorage.getItem('inviteCode'),
        totalPlayers: localStorage.getItem('totalPlayers'),
        playerIndex: localStorage.getItem('playerIndex'),
        fakerCount: localStorage.getItem('fakerCount')
    };

    localStorage.removeItem('currentRound');
    localStorage.removeItem('submittedAnswer');
    localStorage.removeItem('submittedDrawing');
    localStorage.removeItem('answerType');
    localStorage.removeItem('answerSubmitted');
    localStorage.removeItem('hostAnswer');
    localStorage.removeItem('hostDrawing');
    localStorage.removeItem('playerRole');
    localStorage.removeItem('roleRevealed');

    Object.entries(preservedData).forEach(([key, value]) => {
        if (value) localStorage.setItem(key, value);
    });

    const nextGame = parseInt(localStorage.getItem('currentGame') || '1') + 1;
    localStorage.setItem('currentGame', nextGame.toString());
    localStorage.setItem('currentRound', '1');

    const pIdx = parseInt(localStorage.getItem('playerIndex') || '0');
    const nextPage = pIdx === 0 ? 'host-game.html' : 'player-game.html';
    window.location.href = `card-role.html?next=${nextPage}`;
}

function goHome() {
    window.location.href = 'index.html';
}

function redirectToGamePage() {
    localStorage.setItem('playerIndex', playerIndex.toString());
    if (playerIndex === 0) {
        window.location.href = 'host-game.html';
    } else {
        window.location.href = 'player-game.html';
    }
}

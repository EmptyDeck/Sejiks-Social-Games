// 게임 데이터 전역 변수
let hostIsFaker = false;
let finalVotes = {};
let totalPlayers = 4;
let gameEndRound = 1;
let playerScores = {};

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    loadGameData();
    initializePlayerScores();
    initializeUI();
    setupEventListeners();
});

// 게임 데이터 로드
function loadGameData() {
    hostIsFaker = localStorage.getItem('hostIsFaker') === 'true';
    gameEndRound = parseInt(localStorage.getItem('gameEndRound')) || 1;
    totalPlayers = parseInt(localStorage.getItem('totalPlayers')) || 4;
    
    // 투표 데이터 로드
    const savedVotes = localStorage.getItem('finalVotes');
    if (savedVotes) {
        finalVotes = JSON.parse(savedVotes);
    }
}

// 플레이어 점수 초기화
function initializePlayerScores() {
    playerScores = {};
    for (let i = 1; i < totalPlayers; i++) {
        playerScores[`플레이어${i}`] = 0;
    }
    playerScores['호스트'] = 0;
    
    // localStorage에서 기존 점수 불러오기
    const savedScores = localStorage.getItem('playerScores');
    if (savedScores) {
        const existingScores = JSON.parse(savedScores);
        Object.assign(playerScores, existingScores);
    }
}

// UI 초기화
function initializeUI() {
    updatePlayerRole();
    updateGameSections();
    displayVotingResults();
    
    if (hostIsFaker) {
        calculateAndDisplayScores();
    }
}

// 플레이어 역할 업데이트
function updatePlayerRole() {
    const roleElement = document.getElementById('playerRole');
    
    if (hostIsFaker) {
        roleElement.textContent = '라이어';
        roleElement.className = 'role-value faker';
    } else {
        roleElement.textContent = '일반 플레이어';
        roleElement.className = 'role-value normal';
    }
}

// 게임 섹션 표시/숨김
function updateGameSections() {
    if (hostIsFaker) {
        document.getElementById('normalPlayerSection').style.display = 'none';
        document.getElementById('fakerSection').style.display = 'block';
    } else {
        document.getElementById('normalPlayerSection').style.display = 'block';
        document.getElementById('fakerSection').style.display = 'none';
        updateNormalPlayerStats();
    }
}

// 일반 플레이어 통계 업데이트
function updateNormalPlayerStats() {
    document.getElementById('totalRounds').textContent = gameEndRound;
    
    const totalVotes = Object.values(finalVotes).reduce((sum, count) => sum + count, 0);
    document.getElementById('totalVotes').textContent = totalVotes;
}

// 투표 결과 표시
function displayVotingResults() {
    const resultsGrid = document.getElementById('resultsGrid');
    resultsGrid.innerHTML = '';
    
    Object.entries(finalVotes).forEach(([playerName, voted]) => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.innerHTML = `
            <div class="result-player">${playerName}</div>
            <div class="result-votes">${voted === 1 ? '✓' : '✗'}</div>
            <div class="result-label">${voted === 1 ? '투표함' : '투표안함'}</div>
        `;
        resultsGrid.appendChild(resultItem);
    });
    
    if (Object.keys(finalVotes).length === 0) {
        resultsGrid.innerHTML = '<p style="text-align: center; color: var(--text-muted); grid-column: 1 / -1;">투표 결과가 없습니다.</p>';
    }
}

// 점수 계산 및 표시 (라이어만)
function calculateAndDisplayScores() {
    // 점수 계산
    const scoreChanges = {};
    
    // 라이어에게 투표한 사람들은 각자 1점
    Object.entries(finalVotes).forEach(([playerName, voted]) => {
        if (voted === 1) {
            if (playerName === '호스트') {
                // 호스트(라이어)가 라이어에게 투표한 경우
                scoreChanges['호스트'] = (scoreChanges['호스트'] || 0) + 1;
            } else {
                // 다른 플레이어가 라이어에게 투표한 경우  
                scoreChanges[playerName] = (scoreChanges[playerName] || 0) + 1;
            }
        } else {
            // 라이어가 아닌 사람에게 투표하거나 투표하지 않은 경우 → 라이어에게 1점
            if (playerName !== '호스트') {
                scoreChanges['호스트 (라이어)'] = (scoreChanges['호스트 (라이어)'] || 0) + 1;
            }
        }
    });
    
    // 실제 플레이어 점수에 반영
    Object.entries(scoreChanges).forEach(([playerName, points]) => {
        if (playerName === '호스트 (라이어)') {
            playerScores['호스트'] += points;
        } else if (playerScores[playerName] !== undefined) {
            playerScores[playerName] += points;
        }
    });
    
    // 점수를 localStorage에 저장
    localStorage.setItem('playerScores', JSON.stringify(playerScores));
    
    // 점수 변화 표시
    displayScoreChanges(scoreChanges);
    
    // 라이어 성과 표시
    displayFakerPerformance();
}

// 점수 변화 표시
function displayScoreChanges(scoreChanges) {
    const finalScoresContainer = document.getElementById('finalScores');
    finalScoresContainer.innerHTML = '';
    
    if (Object.keys(scoreChanges).length === 0) {
        finalScoresContainer.innerHTML = '<p style="text-align: center; color: var(--text-muted);">이번 라운드에서 점수 변화가 없습니다.</p>';
        return;
    }
    
    Object.entries(scoreChanges).forEach(([player, points]) => {
        const scoreItem = document.createElement('div');
        scoreItem.className = 'score-item';
        scoreItem.innerHTML = `
            <span class="score-name">${player}</span>
            <span class="score-value">+${points}점</span>
        `;
        finalScoresContainer.appendChild(scoreItem);
    });
    
    // 현재 총 점수 표시
    const totalScoreDiv = document.createElement('div');
    totalScoreDiv.className = 'total-scores';
    totalScoreDiv.innerHTML = '<h4 style="margin: 2rem 0 1rem 0; color: var(--accent-color);">📊 현재 총 점수</h4>';
    
    Object.entries(playerScores).forEach(([player, totalScore]) => {
        const totalItem = document.createElement('div');
        totalItem.className = 'score-item';
        totalItem.style.background = 'rgba(240, 147, 251, 0.1)';
        totalItem.innerHTML = `
            <span class="score-name">${player}</span>
            <span class="score-value">${totalScore}점</span>
        `;
        totalScoreDiv.appendChild(totalItem);
    });
    
    finalScoresContainer.appendChild(totalScoreDiv);
}

// 라이어 성과 통계 표시
function displayFakerPerformance() {
    const performanceStats = document.getElementById('performanceStats');
    performanceStats.innerHTML = '';
    
    const votedForFaker = Object.values(finalVotes).filter(voted => voted === 1).length;
    const totalPlayers = Object.keys(finalVotes).length;
    const fooledCount = totalPlayers - votedForFaker;
    const successRate = totalPlayers > 0 ? Math.round((fooledCount / totalPlayers) * 100) : 0;
    
    const stats = [
        { label: '속인 플레이어', value: fooledCount },
        { label: '들킨 투표', value: votedForFaker },
        { label: '성공률', value: `${successRate}%` }
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

// 이벤트 리스너 설정
function setupEventListeners() {
    // 새 게임 버튼
    document.getElementById('newGameBtn').addEventListener('click', showNewGameModal);
    
    // 홈 버튼
    document.getElementById('homeBtn').addEventListener('click', goHome);
    
    // 모달 버튼들
    document.getElementById('cancelNewGame').addEventListener('click', () => closeModal('newGameModal'));
    document.getElementById('confirmNewGame').addEventListener('click', startNewGame);
}

// 새 게임 모달 표시
function showNewGameModal() {
    showModal('newGameModal');
}

// 새 게임 시작
function startNewGame() {
    // 모든 게임 데이터 초기화
    localStorage.clear();
    
    // host.html로 이동
    window.location.href = 'host.html';
}

// 홈으로 이동
function goHome() {
    // 게임 데이터 초기화
    localStorage.clear();
    
    // index.html로 이동 (또는 메인 페이지)
    window.location.href = 'index.html';
}

// 모달 표시
function showModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

// 모달 닫기
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

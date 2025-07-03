// gameover.js - 게임 종료 및 결과 페이지

// 게임 데이터 전역 변수
let inviteCode = '';
let playerIndex = 0;
let currentRound = 1;
let currentGame = 1;
let totalPlayers = 4;
let playerScores = {};
let finalVotes = {};

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== gameover.html 로드 시작 ===');
    console.log('DOM 로드 완료. 초기화 시작...');
    
    // 게임 데이터 시스템 로드 확인
    if (!window.isGameDataLoaded || !window.isGameDataLoaded()) {
        console.error('❌ 게임 데이터 시스템이 로드되지 않았습니다.');
        showError('게임 시스템 로드 중 오류가 발생했습니다. 페이지를 새로고침해주세요.');
        disableControls('게임 시스템 로드 실패');
        return;
    }
    
    console.log('✅ 게임 시스템 로드 확인 완료.');
    if (loadGameData()) {
        initializeUI();
        setupEventListeners();
        console.log('=== gameover.html 초기화 완료 ===');
    } else {
        console.error('❌ 데이터 로드 실패로 초기화 중단');
    }
});

// 게임 데이터 로드
function loadGameData() {
    console.log('데이터 로드 시작...');
    
    // 초대 코드 유효성 검사
    inviteCode = localStorage.getItem('inviteCode') || '';
    if (!inviteCode || inviteCode.length !== 4 || !/^[A-Z]{4}$/.test(inviteCode)) {
        console.error('❌ 유효하지 않은 초대 코드:', inviteCode);
        showError('유효하지 않은 초대 코드입니다. 게임을 다시 시작해주세요.');
        disableControls('유효하지 않은 초대 코드');
        return false;
    }
    
    // 플레이어 인덱스 유효성 검사
    const playerIndexTemp = localStorage.getItem('playerIndex');
    if (playerIndexTemp === null || isNaN(parseInt(playerIndexTemp))) {
        console.error('❌ 유효하지 않은 플레이어 인덱스:', playerIndexTemp);
        showError('플레이어 정보가 손상되었습니다. 게임을 다시 시작해주세요.');
        disableControls('유효하지 않은 플레이어 인덱스');
        return false;
    }
    playerIndex = parseInt(playerIndexTemp);
    
    // 라운드 및 게임 번호 로드
    currentRound = parseInt(localStorage.getItem('gameEndRound')) || 1;
    currentGame = parseInt(localStorage.getItem('gameEndGame')) || 1;
    
    // 총 플레이어 수 로드 (초대 코드로부터)
    try {
        const gameInfo = window.getGameInfoFromCode(inviteCode);
        if (!gameInfo || gameInfo.totalPlayers < 2) {
            throw new Error('유효하지 않은 게임 정보');
        }
        totalPlayers = gameInfo.totalPlayers;
        console.log('✅ totalPlayers 초대 코드에서 로드됨:', totalPlayers);
    } catch (error) {
        console.error('❌ totalPlayers 로드 실패, 기본값 사용:', error);
        totalPlayers = 4; // 기본값
        showError('게임 정보를 로드할 수 없습니다. 게임을 다시 시작해주세요.');
        disableControls('게임 정보 로드 실패');
        return false;
    }
    
    // 점수 데이터 로드
    const savedScores = localStorage.getItem('playerScores');
    if (savedScores) {
        try {
            playerScores = JSON.parse(savedScores);
            console.log('✅ 저장된 점수 로드 완료:', playerScores);
        } catch (error) {
            console.warn('❌ 저장된 점수 복원 실패, 기본값 사용:', error);
            initializePlayerScores();
        }
    } else {
        console.log('✅ 저장된 점수 없음, 초기화 진행');
        initializePlayerScores();
    }
    
    // 투표 데이터 로드
    const savedVotes = localStorage.getItem('finalVotes');
    if (savedVotes) {
        try {
            finalVotes = JSON.parse(savedVotes);
            console.log('✅ 저장된 투표 데이터 로드 완료:', finalVotes);
        } catch (error) {
            console.warn('❌ 저장된 투표 데이터 복원 실패:', error);
            finalVotes = {};
        }
    } else {
        console.log('✅ 저장된 투표 데이터 없음, 빈 객체 사용');
        finalVotes = {};
    }
    
    console.log('✅ 게임 데이터 로드 완료:', {
        inviteCode,
        playerIndex,
        currentRound,
        currentGame,
        totalPlayers,
        playerScores
    });
    return true;
}


// 데이터 유효성 검사 실패 시 컨트롤 비활성화
function disableControls(reason) {
    console.warn('컨트롤 비활성화:', reason);
    const container = document.querySelector('.container') || document.body;
    if (container) {
        container.style.pointerEvents = 'none';
        container.style.opacity = '0.6';
    }
    showError('게임 진행이 중단되었습니다. 페이지를 새로고침하거나 처음부터 다시 시작해주세요.');
}

// 에러 메시지 표시
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
    console.error('❌ 에러 메시지 표시:', message);
}

// 플레이어 점수 초기화
function initializePlayerScores() {
    console.log('점수 초기화 시작...');
    playerScores = {};
    playerScores['호스트'] = 0;
    for (let i = 1; i < totalPlayers; i++) {
        playerScores[`플레이어${i}`] = 0;
    }
    console.log('✅ 점수 초기화 완료 (초대 코드 기반 플레이어 수:', totalPlayers, '):', playerScores);
}


// UI 초기화
function initializeUI() {
    updateGameInfo();
    updatePlayerRole();

    let amILiar = false;
    try {
        amILiar = window.isPlayerFaker(inviteCode, currentGame, playerIndex);
    } catch (error) {
        console.error('❌ 라이어 여부 확인 오류:', error);
        amILiar = false;
    }

    if (amILiar) {
        calculateScoresForLiar(); // 점수 계산
        displayFakerPerformance();
        document.getElementById('fakerSection').style.display = 'block';
        document.getElementById('normalPlayerSection').style.display = 'none';
        displayScores(); // ✅ 여기에서만 점수 표시!
    } else {
        document.getElementById('fakerSection').style.display = 'none';
        document.getElementById('normalPlayerSection').style.display = 'block';
        // 점수 표시 생략
    }

    displayVotingResults();  // 라운드별 투표 결과 표시
}


function displayVotingResults() {
    console.log('투표 결과 표시 시작...');
    const votingResultContainer = document.getElementById('votingResult');
    if (!votingResultContainer) {
        console.warn('❌ votingResult 요소 없음');
        return;
    }

    const inviteCode = localStorage.getItem('inviteCode') || '';
    const currentGame = parseInt(localStorage.getItem('currentGame')) || 1;

    if (!inviteCode) {
        votingResultContainer.innerHTML = '<p>투표 결과를 불러올 수 없습니다.</p>';
        return;
    }

    let html = '<h4>라운드별 투표 현황</h4>';

    for (let round = 1; round <= currentRound; round++) {
        const voteKey = `vote_${inviteCode}_game_${currentGame}_round_${round}`;
        const savedVote = localStorage.getItem(voteKey);

        html += `<div style="margin-bottom: 15px;"><strong>라운드 ${round}</strong><ul>`;
        if (savedVote) {
            const votes = JSON.parse(savedVote);
            const voters = Object.keys(votes);
            if (voters.length > 0) {
                voters.forEach(voter => {
                    html += `<li>${voter}</li>`;
                });
            } else {
                html += `<li>아무도 투표하지 않았습니다</li>`;
            }
        } else {
            html += `<li>데이터 없음</li>`;
        }
        html += '</ul></div>';
    }

    votingResultContainer.innerHTML = html;
}
// 라이어 성과 통계 표시
function displayFakerPerformance() {
    console.log('Starting to display liar performance stats...');
    
    // Get the HTML element to display stats
    const performanceStats = document.getElementById('performanceStats');
    if (!performanceStats) {
        console.warn('❌ No performanceStats element found. Cannot display stats.');
        return;
    }
    
    // Clear previous content
    performanceStats.innerHTML = '';
    
    // Assume playerIndex is the liar’s index (0 for host, 1 for Player 1, etc.)
    const liarKey = playerIndex === 0 ? 'Host' : `Player${playerIndex}`;
    
    // Votes received by the liar (caught)
    const votesReceived = finalVotes[liarKey] || 0; // Number of players who voted for the liar
    
    // Total possible voters (exclude the liar)
    const totalVoters = totalPlayers - 1; // 5 players total, 4 can vote
    
    // Players fooled (those who didn’t vote for the liar)
    const fooledCount = totalVoters - votesReceived;
    
    // Success rate (percentage of players fooled)
    const successRate = totalVoters > 0 ? Math.round((fooledCount / totalVoters) * 100) : 0;
    
    // Stats to display
    const stats = [
        { label: 'Fooled Players', value: fooledCount },        // Players who didn’t vote for the liar
        { label: 'Votes Received', value: votesReceived },     // Players who caught the liar
        { label: 'Success Rate', value: `${successRate}%` }    // Percentage fooled
    ];
    
    // Display each stat
    stats.forEach(stat => {
        const statItem = document.createElement('div');
        statItem.className = 'stat-item';
        statItem.innerHTML = `
            <span class="stat-value">${stat.value}</span>
            <span class="stat-label">${stat.label}</span>
        `;
        performanceStats.appendChild(statItem);
    });
    
    console.log('✅ Liar performance stats displayed:', stats);
}


function calculateScoresForLiar() {
    console.log('라이어 점수 계산 시작...');

    const inviteCode = localStorage.getItem('inviteCode') || '';
    const currentGame = parseInt(localStorage.getItem('currentGame')) || 1;
    const totalPlayers = parseInt(localStorage.getItem('totalPlayers')) || 4;

    if (!inviteCode) {
        console.warn('❌ 초대 코드 없음. 점수 계산 불가.');
        return;
    }

    // 모든 라운드 투표 로드
    const allVotes = {};
    for (let round = 1; round <= currentRound; round++) {
        const voteKey = `vote_${inviteCode}_game_${currentGame}_round_${round}`;
        const savedVote = localStorage.getItem(voteKey);
        if (savedVote) {
            try {
                allVotes[round] = JSON.parse(savedVote);
                console.log(`✅ 라운드 ${round} 투표 로드 완료`);
            } catch (e) {
                console.error(`❌ 라운드 ${round} 투표 파싱 실패`, e);
            }
        } else {
            console.log(`❌ 라운드 ${round} 투표 없음`);
            allVotes[round] = {};
        }
    }

    // 초기 점수 설정
    let liarScore = 0;
    const voterScores = {};

    // 플레이어 이름 매핑
    const playerNames = ['호스트'];
    for (let i = 1; i < totalPlayers; i++) {
        playerNames.push(`플레이어${i}`);
        voterScores[`player${i}`] = 0;
    }

    // 각 라운드별로 점수 계산
    Object.entries(allVotes).forEach(([round, votes]) => {
        console.log(`📊 라운드 ${round} 투표 분석`);

        const votedList = Object.keys(votes);

        // 규칙 1: 투표한 사람에게 +1점
        votedList.forEach(voter => {
            if (voter.startsWith('player') && voterScores[voter] !== undefined) {
                voterScores[voter]++;
                console.log(`✅ ${voter}에게 1점 추가 (라운드 ${round})`);
            }
        });

        // 규칙 2: 라이어에게 점수 추가 (투표하지 않은 사람 수)
        const votedCount = votedList.length;
        const nonVotedCount = totalPlayers - 1 - votedCount; // 호스트 제외
        liarScore += nonVotedCount;
        console.log(`✅ 라이어에게 ${nonVotedCount}점 추가 (라운드 ${round})`);
    });

    // 점수를 전역 점수 객체에 반영
    const liarName = playerIndex === 0 ? '호스트' : `플레이어${playerIndex}`;
    playerScores[liarName] = (playerScores[liarName] || 0) + liarScore;

    // 투표한 플레이어 점수 반영
    playerNames.forEach(name => {
        const key = name === '호스트' ? 'host' : name.replace('플레이어', 'player');
        if (key.startsWith('player') && voterScores[key]) {
            playerScores[name] = (playerScores[name] || 0) + voterScores[key];
        }
    });

    // localStorage 업데이트
    localStorage.setItem('playerScores', JSON.stringify(playerScores));
    console.log('✅ 최종 점수 계산 완료:', playerScores);
}



// 게임 정보 업데이트
function updateGameInfo() {
    console.log('게임 정보 업데이트 시작...');
    const gameInfoElement = document.getElementById('gameInfo');
    if (gameInfoElement) {
        gameInfoElement.textContent = `게임 ${currentGame} 종료`;
        console.log(`✅ 게임 정보 업데이트: 게임 ${currentGame} 종료`);
    } else {
        console.warn('❌ gameInfo 요소 없음');
    }
}

// 플레이어 역할 업데이트
function updatePlayerRole() {
    console.log('플레이어 역할 업데이트 시작...');
    const playerRoleElement = document.getElementById('playerRole');
    const playerNumberElement = document.getElementById('playerNumber');
    let amILiar = false;
    
    try {
        amILiar = window.isPlayerFaker(inviteCode, currentGame, playerIndex);
        console.log('✅ 라이어 여부 확인:', amILiar);
    } catch (error) {
        console.error('❌ 라이어 여부 확인 오류:', error);
        amILiar = false;
    }
    
    if (playerRoleElement) {
        if (playerIndex === 0) {
            playerRoleElement.textContent = `호스트${amILiar ? ' (라이어)' : ''}`;
            playerRoleElement.className = amILiar ? 'role-value faker' : 'role-value normal';
        } else {
            playerRoleElement.textContent = `플레이어 ${playerIndex}${amILiar ? ' (라이어)' : ''}`;
            playerRoleElement.className = amILiar ? 'role-value faker' : 'role-value normal';
        }
        console.log(`✅ 역할 업데이트: ${playerRoleElement.textContent}`);
    } else {
        console.warn('❌ playerRole 요소 없음');
    }
    
    if (playerNumberElement) {
        playerNumberElement.textContent = playerIndex === 0 ? '호스트' : `플레이어 ${playerIndex}`;
        playerNumberElement.style.display = 'inline-block';
        console.log('✅ 플레이어 번호 표시됨');
    } else {
        console.warn('❌ playerNumber 요소 없음');
    }
}


// 점수 표시
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
            <span class="score-value">${score}점</span>
        `;
        finalScoresContainer.appendChild(item);
    });
}


// 이벤트 리스너 설정
function setupEventListeners() {
    console.log('이벤트 리스너 설정 시작...');
    
    const newGameBtn = document.getElementById('newGameBtn');
    if (newGameBtn) {
        newGameBtn.addEventListener('click', startNewGame);
        console.log('✅ 새 게임 버튼 이벤트 리스너 설정 완료');
    } else {
        console.warn('❌ newGameBtn 요소 없음');
    }
    
    const homeBtn = document.getElementById('homeBtn');
    if (homeBtn) {
        homeBtn.addEventListener('click', goHome);
        console.log('✅ 홈 버튼 이벤트 리스너 설정 완료');
    } else {
        console.warn('❌ homeBtn 요소 없음');
    }
    
    const nextGameBtn = document.getElementById('nextGameBtn');
    if (nextGameBtn) {
        nextGameBtn.addEventListener('click', startNextGame);
        console.log('✅ 다음 게임 버튼 이벤트 리스너 설정 완료');
    } else {
        console.warn('❌ nextGameBtn 요소 없음');
    }
}

// 새 게임 시작
function startNewGame() {
    console.log('새 게임 시작 시도 중...');
    window.location.href = 'host.html';
    return
    // 데이터 초기화 (점수는 유지)
    const preservedData = {
        playerScores: localStorage.getItem('playerScores'),
        inviteCode: inviteCode,
        totalPlayers: totalPlayers.toString()
    };
    
    // 게임 관련 데이터 초기화
    localStorage.removeItem('currentRound');
    localStorage.removeItem('currentGame');
    localStorage.removeItem('finalVotes');
    localStorage.removeItem('submittedAnswer');
    localStorage.removeItem('submittedDrawing');
    localStorage.removeItem('answerType');
    localStorage.removeItem('answerSubmitted');
    localStorage.removeItem('hostAnswer');
    localStorage.removeItem('hostDrawing');
    
    // 보존할 데이터 복원
    Object.entries(preservedData).forEach(([key, value]) => {
        if (value) localStorage.setItem(key, value);
    });
    
    // 새 게임 및 라운드 설정
    localStorage.setItem('currentGame', '1');
    localStorage.setItem('currentRound', '1');
    
    console.log('✅ 새 게임 데이터 저장 완료:', {
        currentGame: 1,
        currentRound: 1,
        preservedScores: preservedData.playerScores
    });
    
    // 페이지 이동
    redirectToGamePage();
}

// 다음 게임 시작
function startNextGame() {
    console.log('다음 게임 시작 시도 중...');
    
    // 데이터 초기화 (점수는 유지)
    const preservedData = {
        playerScores: localStorage.getItem('playerScores'),
        inviteCode: inviteCode,
        totalPlayers: totalPlayers.toString()
    };
    
    // 게임 관련 데이터 초기화
    localStorage.removeItem('currentRound');
    localStorage.removeItem('finalVotes');
    localStorage.removeItem('submittedAnswer');
    localStorage.removeItem('submittedDrawing');
    localStorage.removeItem('answerType');
    localStorage.removeItem('answerSubmitted');
    localStorage.removeItem('hostAnswer');
    localStorage.removeItem('hostDrawing');
    
    // 보존할 데이터 복원
    Object.entries(preservedData).forEach(([key, value]) => {
        if (value) localStorage.setItem(key, value);
    });
    
    // 다음 게임 및 라운드 1 설정
    const nextGame = currentGame + 1;
    localStorage.setItem('currentGame', nextGame.toString());
    localStorage.setItem('currentRound', '1');
    
    console.log('✅ 다음 게임 데이터 저장 완료:', {
        currentGame: nextGame,
        currentRound: 1,
        preservedScores: preservedData.playerScores
    });
    
    // 페이지 이동
    redirectToGamePage();
}

// 홈으로 이동
function goHome() {
    console.log('홈으로 이동 시도 중...');
    // 모든 데이터 초기화
    localStorage.clear();
    console.log('✅ 모든 데이터 초기화 완료');
    window.location.href = 'index.html';
}

// 게임 페이지로 리다이렉트
function redirectToGamePage() {
    console.log('게임 페이지로 이동 시도 중...');
    localStorage.setItem('playerIndex', playerIndex.toString());
    console.log('✅ 이동 전 데이터 저장 완료:', { playerIndex });
    
    if (playerIndex === 0) {
        console.log('✅ 호스트로 이동: host-game.html');
        window.location.href = 'host-game.html';
    } else {
        console.log(`✅ 플레이어 ${playerIndex}로 이동: player-game.html`);
        window.location.href = 'player-game.html';
    }
}

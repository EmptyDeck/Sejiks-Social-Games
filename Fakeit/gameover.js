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
    console.log('UI 초기화 시작...');
    updateGameInfo();
    updatePlayerRole();
    let amILiar = false;
    try {
        amILiar = window.isPlayerFaker(inviteCode, currentGame, playerIndex);
        console.log('✅ 라이어 여부 확인:', amILiar);
    } catch (error) {
        console.error('❌ 라이어 여부 확인 오류:', error);
        amILiar = false;
    }
    if (amILiar) {
        calculateScoresForLiar(); // 라이어인 경우에만 점수 계산
        displayFakerPerformance(); // 라이어 성과 통계 표시
        const fakerSection = document.getElementById('fakerSection');
        const normalPlayerSection = document.getElementById('normalPlayerSection');
        if (fakerSection && normalPlayerSection) {
            fakerSection.style.display = 'block';
            normalPlayerSection.style.display = 'none';
            console.log('✅ 라이어 섹션 표시, 일반 플레이어 섹션 숨김');
        } else {
            console.warn('❌ fakerSection 또는 normalPlayerSection 요소 없음');
        }
    } else {
        const fakerSection = document.getElementById('fakerSection');
        const normalPlayerSection = document.getElementById('normalPlayerSection');
        if (fakerSection && normalPlayerSection) {
            fakerSection.style.display = 'none';
            normalPlayerSection.style.display = 'block';
            console.log('✅ 일반 플레이어 섹션 표시, 라이어 섹션 숨김');
        } else {
            console.warn('❌ fakerSection 또는 normalPlayerSection 요소 없음');
        }
    }
    displayScores();
    displayVotingResults(); // 최종 투표 결과 표시
    console.log('✅ UI 초기화 완료.');
}

// 라이어 성과 통계 표시
function displayFakerPerformance() {
    console.log('라이어 성과 통계 표시 시작...');
    const performanceStats = document.getElementById('performanceStats');
    if (!performanceStats) {
        console.warn('❌ performanceStats 요소 없음. 성과 통계 표시 불가.');
        return;
    }
    
    performanceStats.innerHTML = '';
    let votedCount = 0;
    Object.values(finalVotes).forEach(count => {
        if (typeof count === 'number' && count > 0) {
            votedCount += count;
        }
    });
    const totalVoters = totalPlayers - 1; // 라이어 제외
    const fooledCount = totalVoters - votedCount;
    const successRate = totalVoters > 0 ? Math.round((fooledCount / totalVoters) * 100) : 0;
    
    const stats = [
        { label: '속인 플레이어', value: fooledCount },
        { label: '들킨 투표', value: votedCount },
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
    console.log('✅ 라이어 성과 통계 표시 완료:', stats);
}


function calculateScoresForLiar() {
    console.log('라이어 점수 계산 시작...');
    
    // 최종 투표 데이터 로드
    const savedVotes = localStorage.getItem('finalVotes');
    let votedPlayers = {};
    if (savedVotes) {
        try {
            votedPlayers = JSON.parse(savedVotes);
            console.log('✅ 최종 투표 데이터 로드 완료:', votedPlayers);
        } catch (error) {
            console.warn('❌ 최종 투표 데이터 복원 실패:', error);
            votedPlayers = {};
        }
    } else {
        console.warn('❌ 최종 투표 데이터 없음. 점수 계산 불가.');
        return;
    }
    
    // 규칙 1: 투표한 사람들에게 1점씩 추가
    let votedCount = 0;
    Object.entries(votedPlayers).forEach(([playerName, voteValue]) => {
        const voteCount = typeof voteValue === 'boolean' ? (voteValue ? 1 : 0) : voteValue;
        if (voteCount > 0) {
            // 투표한 사람에게 점수 추가 (투표받은 사람이 아님!)
            if (playerScores[playerName] !== undefined) {
                playerScores[playerName] += 1;
                votedCount += 1;
                console.log(`✅ ${playerName}에게 1점 추가 (투표함)`);
            }
        }
    });
    
    // 규칙 2: 투표하지 않은 플레이어 수만큼 라이어에게 점수 추가
    let totalVoters = totalPlayers - 1; // 라이어 자신 제외
    let notVotedCount = totalVoters - votedCount;
    
    if (notVotedCount > 0) {
        const liarName = playerIndex === 0 ? '호스트' : `플레이어${playerIndex}`;
        if (playerScores[liarName] !== undefined) {
            playerScores[liarName] += notVotedCount;
            console.log(`✅ ${liarName}(라이어)에게 ${notVotedCount}점 추가 (투표하지 않은 플레이어 수)`);
        }
    }
    
    // 계산된 점수를 localStorage에 저장
    localStorage.setItem('playerScores', JSON.stringify(playerScores));
    console.log('✅ 점수 계산 완료:', playerScores);
    
    // 점수 계산 로직 검증을 위한 상세 로그
    console.log('=== 점수 계산 검증 ===');
    console.log(`총 플레이어 수: ${totalPlayers}`);
    console.log(`투표 가능한 플레이어 수 (라이어 제외): ${totalVoters}`);
    console.log(`실제 투표한 플레이어 수: ${votedCount}`);
    console.log(`투표하지 않은 플레이어 수: ${notVotedCount}`);
    console.log('투표 현황:', votedPlayers);
    console.log('최종 점수:', playerScores);
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
    console.log('점수 표시 시작...');
    const finalScoresContainer = document.getElementById('finalScores');
    if (!finalScoresContainer) {
        console.warn('❌ finalScores 요소 없음');
        return;
    }
    
    finalScoresContainer.innerHTML = '';
    if (Object.keys(playerScores).length === 0) {
        finalScoresContainer.innerHTML = '<p style="text-align: center; color: var(--text-muted);">점수 데이터가 없습니다.</p>';
        console.log('❌ 점수 데이터 없음');
        return;
    }
    
    // 점수 내림차순으로 정렬하여 표시
    const sortedScores = Object.entries(playerScores).sort(([, a], [, b]) => b - a);
    sortedScores.forEach(([playerName, score]) => {
        const scoreItem = document.createElement('div');
        scoreItem.className = 'score-item';
        scoreItem.innerHTML = `
            <span class="score-name">${playerName}</span>
            <span class="score-value">${score}점</span>
        `;
        finalScoresContainer.appendChild(scoreItem);
    });
    console.log('✅ 최종 점수 표시 완료:', sortedScores);
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

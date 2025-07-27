// 인간 통계 보고서 - 게임 종료 로직
// 파일 구조:
// ├── common.css (공유 스타일)
// ├── common.js (공통 함수)
// ├── index.html
// ├── index.css
// ├── index.js
// ├── absolute.html
// ├── absolute.css
// ├── absolute.js
// ├── join.html
// ├── join.css
// ├── join.js
// ├── play.html
// ├── play.css
// ├── play.js
// ├── statistics.js
// ├── abs-gen-game.js
// ├── standby.html
// ├── standby.css
// ├── standby.js
// └── gameover.js - 여기

let gameResults = null;

document.addEventListener('DOMContentLoaded', function() {
    // 로컬스토리지에서 최종 게임 결과 가져오기
    const storedResults = localStorage.getItem('gameResults');
    if (storedResults) {
        gameResults = JSON.parse(storedResults);
        console.log('최종 게임 결과 불러옴:', gameResults);
        // 세션 완료 후 결과를 표시했다면 선택적으로 삭제
        localStorage.removeItem('gameResults');
    } else {
        console.warn('로컬 스토리지에 게임 결과가 없습니다. 메인 메뉴로 리디렉션합니다.');
        goToPage('index.html');
        return;
    }

    // HTML에 게임 결과 표시
    displayGameResults();

    // 버튼 이벤트 리스너 연결
    document.getElementById('mainMenuButton').addEventListener('click', handleMainMenu);
    document.getElementById('playAgainButton').addEventListener('click', handlePlayAgain);

    // 등장 애니메이션 추가
    setTimeout(() => {
        document.querySelector('.game-header').classList.add('show');
    }, 100);

    setTimeout(() => {
        document.querySelector('.final-results-card').classList.add('show');
    }, 300);

    setTimeout(() => {
        document.querySelector('.info-section').classList.add('show');
    }, 500);

    // 떠다니는 축하 효과
    createFloatingStats();
});

function displayGameResults() {
    if (!gameResults) { return; }
    
    document.getElementById('finalScoreValue').textContent = gameResults.totalScore;
    document.getElementById('statsGameCode').textContent = gameResults.gameCode || '없음';
    document.getElementById('statsGameMode').textContent = gameResults.gameMode === 'join' ? '멀티플레이어' : '싱글 플레이어';
    document.getElementById('statsRoundsCompleted').textContent = gameResults.rounds;
    
    const averageScore = gameResults.rounds > 0 ? Math.round(gameResults.totalScore / gameResults.rounds) : 0;
    document.getElementById('statsAverageScore').textContent = averageScore;
    
    // 완료 시간 포맷팅
    const completedDate = gameResults.completedAt ? new Date(gameResults.completedAt) : null;
    if (completedDate) {
        document.getElementById('statsCompletedAt').textContent = completedDate.toLocaleString();
    } else {
        document.getElementById('statsCompletedAt').textContent = '없음';
    }
}

function handleMainMenu() {
    showConfirmModal(
        '메인 메뉴로 돌아가시겠습니까? 게임 결과는 저장되어 있습니다.',
        function() { goToPage('index.html'); }
    );
}

function handlePlayAgain() {
    showConfirmModal(
        '새 게임을 시작하시겠습니까? 이전 결과는 저장됩니다.',
        startNewGameSession
    );
}

function startNewGameSession() {
    // 새로운 시작을 위해 임시 세션 데이터 정리, localStorage의 gameResults는 유지
    sessionStorage.removeItem('gameCode');
    sessionStorage.removeItem('gameMode');
    sessionStorage.removeItem('currentRound');
    sessionStorage.removeItem('totalScore');
    sessionStorage.removeItem('currentAnswer');
    // 여기서는 localStorage의 'gameResults'를 제거하지 않음
    goToPage('absolute.html');
}

// 축하 효과!
function createFloatingStats() {
    const stats = ['🏆', '✨', '🌟', '🎉', '📈', '📊'];
    const container = document.querySelector('.container') || document.body;
    
    stats.forEach((stat, index) => {
        setTimeout(() => {
            const element = document.createElement('div');
            element.textContent = stat;
            element.style.cssText = `
                position: fixed;
                font-size: 2.5rem;
                opacity: 0.1;
                pointer-events: none;
                animation: floatStat ${10 + Math.random() * 5}s infinite ease-in-out;
                left: ${Math.random() * 90}%;
                top: ${Math.random() * 80}%;
                z-index: -1;
            `;
            document.body.appendChild(element);
            
            setTimeout(() => {
                if (element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            }, 15000);
        }, index * 2000);
    });
}

// 떠다니는 애니메이션 CSS (완성도를 위해 포함)
const style = document.createElement('style');
style.textContent = `
    @keyframes floatStat {
        0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.1;
        }
        25% {
            transform: translateY(-40px) rotate(10deg);
            opacity: 0.2;
        }
        50% {
            transform: translateY(0px) rotate(-10deg);
            opacity: 0.15;
        }
        75% {
            transform: translateY(-20px) rotate(5deg);
            opacity: 0.1;
        }
    }
`;
document.head.appendChild(style);

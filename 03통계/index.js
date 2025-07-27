// 인간 통계 보고서 - 메인 페이지 로직
// import 문 불필요!
// setGameMode, goToPage, addClickAnimation이 전역 범위에 정의되어 있다고 가정

let selectedMode = '';

function selectMode(mode) {
    // 이전 선택 해제
    document.querySelectorAll('.mode-card').forEach(card => {
        card.classList.remove('selected', 'selecting');
    });

    // 상대 모드는 선택 불가 (곧 출시 예정)
    if (mode === 'relative') {
        return;
    }

    // 선택 애니메이션 추가
    const modeCard = document.getElementById(mode + 'Mode');
    modeCard.classList.add('selecting');

    setTimeout(() => {
        modeCard.classList.remove('selecting');
        modeCard.classList.add('selected');
        selectedMode = mode;

        // 선택된 모드 저장
        setGameMode(mode); // common.js에서 가져옴

        // 액션 버튼 표시
        const actionButtons = document.getElementById('actionButtons');
        actionButtons.style.display = 'block';

        // 효과음 추가 (향후 사용)
        // playSound('select');
    }, 300);
}

function startGame() {
    if (!selectedMode) {
        alert('🤔 먼저 게임 모드를 선택해 주세요!');
        return;
    }

    const btn = document.getElementById('startGameButton');
    if (btn) {
        // 원한다면 addClickAnimation 사용 가능
        // addClickAnimation(btn); // common.js에 정의되어 있다면
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
            // 선택된 모드 페이지로 이동
            if (selectedMode === 'absolute') {
                goToPage('absolute.html'); // common.js에서 가져옴
            } else if (selectedMode === 'relative') {
                alert('🚧 상대 모드는 곧 출시될 예정입니다!');
            }
        }, 150);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // 등장 애니메이션
    setTimeout(() => {
        document.querySelector('.game-header').style.opacity = '1';
    }, 100);

    setTimeout(() => {
        document.querySelector('.card').style.opacity = '1';
    }, 300);

    setTimeout(() => {
        document.querySelector('.info-section').style.opacity = '1';
    }, 500);

    // 이전 게임 데이터 정리
    sessionStorage.removeItem('gameCode');
    sessionStorage.removeItem('currentRound');
    sessionStorage.removeItem('totalScore');

    // 이벤트 리스너 연결
    document.getElementById('absoluteMode').addEventListener('click', () => selectMode('absolute'));
    document.getElementById('relativeMode').addEventListener('click', () => selectMode('relative'));
    document.getElementById('startGameButton').addEventListener('click', startGame);

    // 키보드 단축키
    document.addEventListener('keydown', function(e) {
        if (e.key === '1') {
            selectMode('absolute');
        } else if (e.key === 'Enter' && selectedMode) {
            startGame();
        }
    });

    // 파티클 효과 (선택사항)
    createParticles();
});

// 선택사항: 시각적 효과를 위한 떠다니는 파티클 생성
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

// 페이지에 떠다니는 애니메이션 추가
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

// 인간 통계 보고서 - 절대 모드 로직
// 파일 구조:
// ├── common.css (공유 스타일)
// ├── common.js (공통 함수)
// ├── index.html
// ├── index.css
// ├── index.js
// ├── absolute.html
// ├── absolute.css
// ├── absolute.js - 여기
// ├── join.html
// ├── join.css
// ├── join.js
// ├── play.html
// ├── play.css
// ├── play.js
// ├── statistics.js
// └── abs-gen-game.js
// 참고: 이 파일은 모든 헬퍼 함수가 common.js를 통해 전역에 있다고 가정합니다.


// import 문 사용 금지!

let selectedOption = '';

function selectOption(option) {
    // 이전 선택 해제
    document.querySelectorAll('.option-card').forEach(card => {
        card.classList.remove('selected', 'selecting');
    });

    // 선택 애니메이션 적용
    const optionCard = document.getElementById(option + 'Option');
    optionCard.classList.add('selecting');

    setTimeout(() => {
        optionCard.classList.remove('selecting');
        optionCard.classList.add('selected');
        selectedOption = option;

        // 액션 버튼 텍스트 변경 및 표시
        const actionButton = document.getElementById('actionButton');
        const actionSection = document.getElementById('actionSection');

        if (option === 'host') {
            actionButton.innerHTML = '👑 게임 방 만들기';
        } else if (option === 'join') {
            actionButton.innerHTML = '🚪 게임 코드로 참가';
        }

        actionSection.style.display = 'block';

        // 등장 애니메이션
        actionSection.style.animation = 'fadeInUp 0.5s ease-out';
    }, 300);
}

function proceedToGame() {
    if (!selectedOption) {
        alert('🤔 먼저 옵션을 선택해 주세요!');
        return;
    }

    const btn = document.getElementById('actionButton');
    if (btn) {
        // 선택 클릭 애니메이션
        btn.style.transform = 'scale(0.95)';

        setTimeout(() => {
            btn.style.transform = 'scale(1)';

            if (selectedOption === 'host') {
                // 게임 코드 생성 후 play 페이지로 이동
                const gameCode = generateGameCode();
                setGameCode(gameCode);

                // 생성된 코드 모달 표시
                showGameCodeModal(gameCode);
            } else if (selectedOption === 'join') {
                goToPage('join.html');
            }
        }, 150);
    }
}

function showGameCodeModal(code) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>🎉 게임 방이 생성되었습니다!</h3>
            <p>아래 코드를 친구에게 공유하세요:</p>
            <div class="code-display">${code}</div>
            <p style="font-size: 0.9rem; opacity: 0.8; margin: 15px 0;">
                참가자는 이 코드를 입력하여 들어올 수 있습니다
            </p>
            <div class="modal-buttons">
                <button class="btn btn-secondary" id="copyCodeButton">
                    📋 코드 복사
                </button>
                <button class="btn btn-primary" id="startGameSessionButton">
                    🚀 게임 시작
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // 이벤트 리스너 추가
    document.getElementById('copyCodeButton').addEventListener('click', function() {
        copyToClipboard(code);
    });
    document.getElementById('startGameSessionButton').addEventListener('click', startGameSession);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        const btn = document.getElementById('copyCodeButton');
        if (btn) {
            const originalText = btn.innerHTML;
            btn.innerHTML = '✅ 복사되었습니다!';
            btn.style.background = 'var(--orange)';

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = 'var(--blue)';
            }, 1500);
        }
    }).catch((err) => {
        console.error('텍스트 복사 실패: ', err);
        alert(`게임 코드: ${text}\n\n위 코드를 직접 복사해 주세요.`);
    });
}

function startGameSession() {
    // 모달 닫기
    const modal = document.querySelector('.modal-overlay');
    if (modal) modal.remove();

    // 게임 상태 초기화
    setCurrentRound(1);
    setTotalScore(0);

    // play.html 페이지로 이동
    goToPage('play.html');
}

function goBack() {
    showConfirmModal(
        '정말 메인 메뉴로 돌아가시겠어요?',
        function() { goToPage('index.html'); }
    );
}

// 페이지 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 모드 세션 설정
    setGameMode('absolute');

    // 등장 애니메이션
    setTimeout(() => {
        document.querySelector('.game-header').style.opacity = '1';
    }, 100);
    setTimeout(() => {
        document.querySelector('.card').style.opacity = '1';
    }, 300);
    setTimeout(() => {
        document.querySelector('.info-panel').style.opacity = '1';
    }, 500);

    // 리스너 등록
    document.getElementById('hostOption').addEventListener('click', function() {
        selectOption('host');
    });
    document.getElementById('joinOption').addEventListener('click', function() {
        selectOption('join');
    });
    document.getElementById('actionButton').addEventListener('click', proceedToGame);
    document.getElementById('backToMainButton').addEventListener('click', goBack);

    // 키보드 단축키
    document.addEventListener('keydown', function(e) {
        if (e.key === '1') {
            selectOption('host');
        } else if (e.key === '2') {
            selectOption('join');
        } else if (e.key === 'Enter' && selectedOption) {
            proceedToGame();
        } else if (e.key === 'Escape') {
            goBack();
        }
    });

    // 떠다니는 이모지 효과
    createFloatingElements();
});

// 시각적 효과용 떠다니는 요소
function createFloatingElements() {
    const symbols = ['📊', '📈', '📉', '🎯', '💯', '🔢'];
    const container = document.querySelector('.container');

    symbols.forEach((symbol, index) => {
        setTimeout(() => {
            const element = document.createElement('div');
            element.textContent = symbol;
            element.style.cssText = `
                position: absolute;
                font-size: 2rem;
                opacity: 0.1;
                pointer-events: none;
                animation: floatSymbol ${8 + Math.random() * 4}s infinite ease-in-out;
                left: ${Math.random() * 90}%;
                top: ${Math.random() * 80}%;
                z-index: -1;
            `;
            container.appendChild(element);

            setTimeout(() => {
                if (element.parentNode) element.parentNode.removeChild(element);
            }, 12000);
        }, index * 1000);
    });
}

// 떠다니는 애니메이션 스타일 추가 (단 한 번만!)
const style = document.createElement('style');
style.textContent = `
    @keyframes floatSymbol {
        0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.1;
        }
        25% {
            transform: translateY(-20px) rotate(90deg);
            opacity: 0.2;
        }
        50% {
            transform: translateY(0px) rotate(180deg);
            opacity: 0.15;
        }
        75% {
            transform: translateY(-15px) rotate(270deg);
            opacity: 0.1;
        }
    }
`;
document.head.appendChild(style);

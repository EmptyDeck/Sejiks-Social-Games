// 인간 통계 보고서 - 게임 참가 로직
// 파일 구조:
// ├── common.css
// ├── common.js
// ├── index.html
// ├── index.css
// ├── index.js
// ├── absolute.html
// ├── absolute.css
// ├── absolute.js
// ├── join.html
// ├── join.css
// ├── join.js // <— 여기
// ├── play.html
// ├── play.css
// ├── play.js
// ├── statistics.js
// └── abs-gen-game.js
// 인간 통계 보고서 - 게임 참가 로직 (리팩토링)
let currentInputIndex = 0;

function handleCodeInput(index) {
    const input = document.getElementById(`letter${index + 1}`);
    const value = input.value.toUpperCase();

    if (value && !isValidCodeChar(value)) {
        showInputError(input);
        return;
    }

    if (value) {
        input.value = value;
        addInputSuccess(input);
        focusNextInput(index);
    } else {
        input.classList.remove('filled');
    }
    updateJoinButton();
}

function handleKeyDown(event, index) {
    const input = event.target;
    
    switch(event.key) {
        case 'Backspace':
            handleBackspace(input, index);
            break;
        case 'ArrowLeft':
            navigateInput(index, -1);
            break;
        case 'ArrowRight':
            navigateInput(index, 1);
            break;
        case 'Enter':
            joinGame();
            break;
    }
}

function handleBackspace(input, index) {
    if (!input.value && index > 0) {
        const prevInput = document.getElementById(`letter${index}`);
        prevInput.focus();
        prevInput.select();
        currentInputIndex = index - 1;
    } else if (input.value) {
        input.value = '';
        input.classList.remove('filled');
        updateJoinButton();
    }
}

function navigateInput(index, direction) {
    const targetIndex = index + direction;
    if (targetIndex >= 0 && targetIndex < 4) {
        document.getElementById(`letter${targetIndex + 1}`).focus();
        currentInputIndex = targetIndex;
    }
}

function focusNextInput(index) {
    if (index < 3) {
        document.getElementById(`letter${index + 2}`).focus();
        currentInputIndex = index + 1;
    }
}

function updateJoinButton() {
    const joinButton = document.getElementById('joinButton');
    const code = getEnteredCode();
    const isComplete = code.length === 4;
    
    joinButton.classList.toggle('btn-orange', isComplete);
    joinButton.innerHTML = isComplete ? '🚀 게임 참가' : `🚀 게임 참가 (${code.length}/4)`;
    joinButton.disabled = false;
}

function getEnteredCode() {
    return Array.from({length: 4}, (_, i) => 
        document.getElementById(`letter${i + 1}`).value
    ).join('').toUpperCase();
}

function clearCode() {
    clearAllInputs();
    document.getElementById('letter1').focus();
    currentInputIndex = 0;
    updateJoinButton();
    animateCodeClear();
}

function joinGame() {
    const code = getEnteredCode();
    
    if (!validateJoinCode(code)) return;
    
    showLoadingModal();
    setTimeout(() => {
        hideLoadingModal();
        initializeGameSession(code);
        showJoinSuccess(code);
    }, 1500);
}

function validateJoinCode(code) {
    if (code.length !== 4) {
        showCodeError('게임 코드 4글자를 모두 입력해 주세요!');
        return false;
    }
    if (!validateGameCode(code)) {
        showCodeError('잘못된 게임 코드 형식입니다!');
        return false;
    }
    return true;
}

function initializeGameSession(code) {
    setGameCode(code);
    setGameMode('join');
    setCurrentRound(1);
    setTotalScore(0);
    clearGameAnswers();
    console.log('게임 세션 초기화 완료:', { code, round: 1, score: 0 });
}

function showJoinSuccess(code) {
    showCustomModal(
        '🎉 성공적으로 참가했습니다!',
        `
            <p>게임 방에 연결되었습니다:</p>
            <div class="code-display">${code}</div>
            <p style="font-size: 0.9rem; opacity: 0.8;">
                통계 지식을 테스트할 준비를 하세요!
            </p>
        `,
        [{
            text: '🎮 게임 시작',
            class: 'btn-primary',
            action: () => goToPage('play.html')
        }]
    );
}

function goBack() {
    showConfirmModal(
        '정말 뒤로 가시겠습니까? 입력한 코드가 사라집니다.',
        () => goToPage('absolute.html')
    );
}

function handlePaste(e) {
    const pastedText = e.clipboardData.getData('text').toUpperCase();
    if (isValidPastedCode(pastedText)) {
        fillCodeFromPaste(pastedText);
        updateJoinButton();
        animatePasteSuccess();
    }
}

function initializeJoinPage() {
    focusFirstInput();
    animatePageLoad();
    updateJoinButton();
    setupEventListeners();
    createFloatingCodes();
}

function setupEventListeners() {
    // 입력 필드 이벤트
    for (let i = 0; i < 4; i++) {
        const input = document.getElementById(`letter${i + 1}`);
        input.addEventListener('input', () => handleCodeInput(i));
        input.addEventListener('keydown', (event) => handleKeyDown(event, i));
    }

    // 버튼 이벤트
    document.getElementById('joinButton').addEventListener('click', joinGame);
    document.getElementById('clearButton').addEventListener('click', clearCode);
    document.getElementById('backButton').addEventListener('click', goBack);
    
    // 붙여넣기 이벤트
    document.addEventListener('paste', handlePaste);
}

function animatePageLoad() {
    const elements = [
        { selector: '.game-header', delay: 100 },
        { selector: '.card', delay: 300 },
        { selector: '.info-section', delay: 500 }
    ];

    elements.forEach(({ selector, delay }) => {
        setTimeout(() => {
            const element = document.querySelector(selector);
            if (element) element.style.opacity = '1';
        }, delay);
    });
}
// ===== 입력 검증 관련 =====
function isValidCodeChar(char) {
    return /^[A-HJ-KM-NPR-Z]$/.test(char);
}

function isValidPastedCode(text) {
    return text.length === 4 && /^[A-HJ-KM-NPR-Z]{4}$/.test(text);
}

// ===== 입력 필드 조작 =====
function showInputError(input) {
    input.value = '';
    input.classList.add('error');
    setTimeout(() => input.classList.remove('error'), 500);
}

function addInputSuccess(input) {
    input.classList.add('filled', 'success');
    setTimeout(() => input.classList.remove('success'), 300);
}

function clearAllInputs() {
    for (let i = 1; i <= 4; i++) {
        const input = document.getElementById(`letter${i}`);
        if (input) {
            input.value = '';
            input.classList.remove('filled', 'error');
        }
    }
}

function focusFirstInput() {
    const firstInput = document.getElementById('letter1');
    if (firstInput) firstInput.focus();
}

function fillCodeFromPaste(code) {
    for (let i = 0; i < 4; i++) {
        const input = document.getElementById(`letter${i + 1}`);
        if (input) {
            input.value = code[i];
            input.classList.add('filled');
        }
    }
}

// ===== 애니메이션 =====
function animateCodeClear() {
    document.querySelectorAll('.code-letter').forEach((input, index) => {
        setTimeout(() => {
            animateElement(input, 'scale(0.8)', 100);
        }, index * 50);
    });
}

function animatePasteSuccess() {
    document.querySelectorAll('.code-letter').forEach((input, idx) => {
        setTimeout(() => {
            input.classList.add('success');
            setTimeout(() => input.classList.remove('success'), 300);
        }, idx * 100);
    });
}

// ===== 게임 세션 관리 =====
function clearGameAnswers() {
    sessionStorage.removeItem('currentAnswer');
    sessionStorage.removeItem('gameResults');
}

// ===== 에러 모달 =====
function showCodeError(message) {
    document.querySelectorAll('.code-letter').forEach(input => {
        input.classList.add('error');
    });
    
    showCustomModal(
        '❌ 잘못된 코드',
        `<p>${message}</p>`,
        [{
            text: '다시 시도',
            class: 'btn-primary',
            action: () => {
                document.querySelectorAll('.code-letter').forEach(input => {
                    input.classList.remove('error');
                });
                focusFirstInput();
            }
        }]
    );
}

// ===== 떠다니는 요소 생성 =====
function createFloatingCodes() {
    const codes = ['ABCD', 'GAME', 'PLAY', 'STAT', 'QUIZ', 'TEAM'];
    const container = document.querySelector('.container');
    
    codes.forEach((code, index) => {
        setTimeout(() => {
            const element = createFloatingElement(code);
            element.style.cssText += `
                font-family: 'Courier New', monospace;
                color: var(--blue);
                left: ${Math.random() * 80}%;
                top: ${Math.random() * 70}%;
                animation: floatCode ${10 + Math.random() * 5}s infinite ease-in-out;
            `;
            container.appendChild(element);
            
            setTimeout(() => {
                if (element.parentNode) element.parentNode.removeChild(element);
            }, 15000);
        }, index * 2000);
    });
}
document.addEventListener('DOMContentLoaded', initializeJoinPage);
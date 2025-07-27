// 인간 통계 보고서 - 공통 함수
// 파일 구조:
// ├── common.css
// ├── common.js - 여기(전역 범위, 모듈 아님)
// ...

// i, l 제외한 알파벳으로 4글자 랜덤 코드 생성
function generateGameCode() {
    const alphabets = 'abcdefghjkmnopqrstuvwxyz'; // 24자(i, l 없음)
    let code = '';
    for (let i = 0; i < 4; i++) {
        code += alphabets.charAt(Math.floor(Math.random() * alphabets.length));
    }
    return code.toUpperCase();
}

// 게임 방 코드를 세션에 저장
function setGameCode(code) {
    sessionStorage.setItem('gameCode', code);
}

// 게임 방 코드 불러오기
function getGameCode() {
    return sessionStorage.getItem('gameCode') || '';
}

// 게임 모드를 세션에 저장
function setGameMode(mode) {
    sessionStorage.setItem('gameMode', mode);
}

// 게임 모드 불러오기
function getGameMode() {
    return sessionStorage.getItem('gameMode') || 'absolute';
}

// 현재 라운드를 세션에 저장
function setCurrentRound(round) {
    sessionStorage.setItem('currentRound', round.toString());
}

// 현재 라운드 불러오기
function getCurrentRound() {
    return parseInt(sessionStorage.getItem('currentRound') || '0');
}

// 총 점수를 세션에 저장
function setTotalScore(score) {
    sessionStorage.setItem('totalScore', score.toString());
}

// 총 점수 불러오기
function getTotalScore() {
    return parseInt(sessionStorage.getItem('totalScore') || '0');
}

// 입력 오차로 점수 계산
function calculateScore(userAnswer, actualAnswer) {
    const accuracy = Math.abs(userAnswer - actualAnswer) / actualAnswer * 100;
    const score = Math.pow(100 - accuracy, 2);
    return Math.max(0, Math.round(score));
}

// 페이지 이동
function goToPage(page) {
    window.location.href = page;
}

// 확인 모달 표시
function showConfirmModal(message, onConfirm, onCancel = null) {
    // 기존 모달 제거
    document.querySelectorAll('.modal-overlay').forEach(m => m.remove());

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>🤔 확인</h3>
            <p>${message}</p>
            <div class="modal-buttons">
                <button class="btn btn-secondary" id="modalCancelBtn">취소</button>
                <button class="btn btn-primary" id="modalConfirmBtn">확인</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    setTimeout(() => {
        modal.classList.add('show');
    }, 10);

    const confirmBtn = document.getElementById('modalConfirmBtn');
    const cancelBtn = document.getElementById('modalCancelBtn');

    const closeAndCleanup = () => {
        modal.classList.remove('show');
        modal.addEventListener('transitionend', () => {
            if (modal.parentNode) {
                modal.remove();
            }
        }, { once: true });
    };

    confirmBtn.addEventListener('click', () => {
        closeAndCleanup();
        if (typeof onConfirm === 'function') onConfirm();
    });

    cancelBtn.addEventListener('click', () => {
        closeAndCleanup();
        if (typeof onCancel === 'function') onCancel();
    });
}

// 버튼 클릭 애니메이션
function addClickAnimation(element) {
    element.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
    });
}

// 모든 페이지 공통 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 모든 버튼 클릭 애니메이션 적용
    document.querySelectorAll('.btn').forEach(addClickAnimation);

    // 버튼 마우스오버 효과
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// 게임 코드 유효성 검사
function validateGameCode(code) {
    return code && code.length === 4 && /^[A-Z]+$/.test(code);
}

// common.js에 추가할 함수들

// 점수 계산 함수 (기존 calculateScore 함수 개선)
function calculateGameScore(userAnswer, actualAnswer) {
    const diff = Math.abs(actualAnswer - userAnswer);
    if (diff >= 20) {
        return 0;
    }
    return Math.pow(21 - diff, 2);
}


// 게임 데이터 저장/불러오기
function saveCurrentAnswer(answerData) {
    try {
        sessionStorage.setItem('currentAnswer', JSON.stringify(answerData));
    } catch (e) {
        console.warn('답변 데이터 저장 실패:', e);
    }
}

function saveGameResults(gameData) {
    try {
        localStorage.setItem('gameResults', JSON.stringify(gameData));
    } catch (e) {
        console.warn('게임 결과 저장 실패:', e);
    }
}

function clearGameSession() {
    const keys = ['gameCode', 'gameMode', 'currentRound', 'totalScore', 'currentAnswer', 'gameResults'];
    keys.forEach(key => {
        sessionStorage.removeItem(key);
        localStorage.removeItem(key);
    });
}

// DOM 조작 헬퍼 함수들
function updateElement(id, content) {
    const element = document.getElementById(id);
    if (element) element.textContent = content;
}

function toggleButton(button, show) {
    if (!button) return;
    button.style.display = show ? 'block' : 'none';
    button.disabled = !show;
}

function animateElement(element, transform, duration, finalTransform = 'scale(1)') {
    if (!element) return;
    element.style.transform = transform;
    setTimeout(() => {
        element.style.transform = finalTransform;
    }, duration);
}

// 고급 모달 함수
function showCustomModal(title, content, buttons = []) {
    closeAllModals();
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    
    const buttonHTML = buttons.map(btn => 
        `<button class="btn ${btn.class}" data-action="${buttons.indexOf(btn)}">${btn.text}</button>`
    ).join('');
    
    modal.innerHTML = `
        <div class="modal-content">
            <h3>${title}</h3>
            <div class="modal-body">${content}</div>
            <div class="modal-buttons">${buttonHTML}</div>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);
    
    // 버튼 이벤트 처리
    modal.addEventListener('click', (e) => {
        if (e.target.hasAttribute('data-action')) {
            const actionIndex = parseInt(e.target.getAttribute('data-action'));
            const button = buttons[actionIndex];
            modal.remove();
            if (button.action) button.action();
        }
    });
}

function closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(modal => modal.remove());
}

// 로딩 모달 함수들
function showLoadingModal() {
    const modal = document.getElementById('loadingModal');
    if (modal) modal.style.display = 'flex';
}

function hideLoadingModal() {
    const modal = document.getElementById('loadingModal');
    if (modal) modal.style.display = 'none';
}

// 떠다니는 요소 생성
function createFloatingElement(content) {
    const element = document.createElement('div');
    element.textContent = content;
    element.style.cssText = `
        position: fixed;
        font-size: 2rem;
        opacity: 0.1;
        pointer-events: none;
        animation: floatStat ${8 + Math.random() * 4}s infinite ease-in-out;
        left: ${Math.random() * 90}%;
        top: ${Math.random() * 80}%;
        z-index: -1;
    `;
    
    document.body.appendChild(element);
    setTimeout(() => {
        if (element.parentNode) element.parentNode.removeChild(element);
    }, 12000);
}
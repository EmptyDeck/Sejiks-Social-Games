// 인간 통계 보고서 - 게임 플레이 로직 (리팩토링)
// 전역 범위 버전 - common.js의 함수들을 활용

let currentRound = 1;
let gameNumbers = [];
let currentQuestion = null;
let userAnswer = 50;
let totalScore = 0;
let gameCode = '';
let gameMode = '';
let isDragging = false;

const DEBUG_MODE = false;

document.addEventListener('DOMContentLoaded', initializePage);

function initializePage() {
    setupEventListeners();
    
    if (!validateGameSession()) {
        showSessionErrorModal();
        return;
    }

    initializeGame();
    setupCircularSlider();
    setTimeout(createFloatingStats, 1000);
}

function setupEventListeners() {
    const backBtn = document.getElementById('backButton');
    const submitBtn = document.getElementById('submitButton');
    const nextBtn = document.getElementById('nextButton');
    
    if (backBtn) backBtn.addEventListener('click', confirmBack);
    if (submitBtn) submitBtn.addEventListener('click', confirmSubmit);
    if (nextBtn) nextBtn.addEventListener('click', confirmNext);
}

function validateGameSession() {
    const code = getGameCode();
    const mode = getGameMode();
    return validateGameCode(code) && mode;
}

function showSessionErrorModal() {
    showCustomModal(
        '⚠️ 게임 세션 없음',
        '활성화된 게임 세션이 없습니다. 먼저 게임을 시작하거나 참가해 주세요.',
        [{ text: '게임 선택으로 이동', class: 'btn-primary', action: () => goToPage('absolute.html') }]
    );
}

function initializeGame() {
    gameCode = getGameCode() || 'DEMO';
    gameMode = getGameMode() || 'absolute';
    currentRound = getCurrentRound() || 1;
    totalScore = getTotalScore() || 0;

    gameNumbers = DEBUG_MODE 
        ? Array.from({length: 10}, (_, i) => i)
        : generateSeededGameNumbers(gameCode);

    if (getTotalQuestions() === 0) {
        showErrorModal('사용 가능한 문제가 없습니다. 통계 데이터베이스를 확인해 주세요.');
        return;
    }

    updateDisplays();
    loadCurrentQuestion();
}

function updateDisplays() {
    updateElement('roundNumber', currentRound);
    updateScoreDisplay();
}

function updateScoreDisplay() {
    const scoreEl = document.getElementById('totalScore');
    if (!scoreEl) return;
    
    scoreEl.textContent = totalScore;
    animateElement(scoreEl, 'scale(1.1)', 200, 'scale(1)');
}

function loadCurrentQuestion() {
    if (currentRound > 10) {
        goToGameOver();
        return;
    }

    showLoadingModal();

    setTimeout(() => {
        const questionIndex = DEBUG_MODE ? 0 : gameNumbers[currentRound - 1];
        currentQuestion = getStatisticByIndex(questionIndex) || getDefaultQuestion();
        
        updateElement('questionText', currentQuestion.question);
        updateElement('sourceText', currentQuestion.source);
        
        hideLoadingModal();
        resetSlider();
        updateButtonStates('playing');
        animateQuestionCard();
    }, 1500);
}

function getDefaultQuestion() {
    return {
        question: "통계 게임을 즐기는 사람들의 비율은 몇 퍼센트일까요?",
        source: "통계 게임 연구, 2024",
        answer: 85
    };
}

function animateQuestionCard() {
    const card = document.querySelector('.question-card');
    if (!card) return;
    
    card.style.animation = 'none';
    setTimeout(() => {
        card.style.animation = 'scaleIn 0.6s ease-out forwards';
    }, 50);
}
///////////////////////////////////////////////////////////////////////////////////////////////
function setupCircularSlider() {
    const slider = document.getElementById('circularSlider');
    const handle = document.getElementById('sliderHandle');
    const fill = document.getElementById('sliderFill');
    if (!slider || !handle || !fill) return;
    let centerX, centerY;
    function updateSlider(angle) {
        // 12시 방향(270도)을 0%로, 시계방향으로 증가하도록 변환
        const normalizedAngle = (angle - 270 + 360) % 360;
        const percentage = Math.round(normalizedAngle / 360 * 100);
        userAnswer = percentage;
        updateElement('percentageValue', percentage);
        updateSliderVisuals(percentage, handle, fill, centerX, centerY);
    }
    function getAngleFromEvent(event) {
        const rect = slider.getBoundingClientRect();
        centerX = rect.width / 2;
        centerY = rect.height / 2;
        const clientX = event.clientX || (event.touches?.[0]?.clientX);
        const clientY = event.clientY || (event.touches?.[0]?.clientY);
        const x = clientX - rect.left - centerX;
        const y = clientY - rect.top - centerY;
        // 기본 atan2 결과를 0-360도로 정규화
        return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
    }
    // Mouse events
    slider.addEventListener('mousedown', (e) => startDragging(e, updateSlider, getAngleFromEvent));
    document.addEventListener('mousemove', (e) => continueDragging(e, updateSlider, getAngleFromEvent));
    document.addEventListener('mouseup', () => stopDragging(slider, handle));
    // Touch events
    slider.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startDragging(e, updateSlider, getAngleFromEvent);
    });
    document.addEventListener('touchmove', (e) => {
        if (isDragging) {
            e.preventDefault();
            continueDragging(e, updateSlider, getAngleFromEvent);
        }
    });
    document.addEventListener('touchend', () => stopDragging(slider, handle));
    // 초기값을 올바르게 설정 (50% = 12시에서 시계방향으로 180도)
    updateSlider(90); // 50%에 해당하는 각도
}
function startDragging(event, updateSlider, getAngleFromEvent) {
    isDragging = true;
    updateSlider(getAngleFromEvent(event));
    document.getElementById('circularSlider').style.cursor = 'grabbing';
}
function continueDragging(event, updateSlider, getAngleFromEvent) {
    if (isDragging) updateSlider(getAngleFromEvent(event));
}
function stopDragging(slider, handle) {
    if (!isDragging) return;
    isDragging = false;
    slider.style.cursor = 'pointer';
    animateElement(handle, 'scale(1.2)', 150, 'scale(1)');
}
function updateSliderVisuals(percentage, handle, fill, centerX, centerY) {
    const radius = 125;
    // 12시 방향을 0%로 하고 시계방향으로 증가
    // percentage 0% = 270도 (12시), 100% = 270도 (한바퀴 돌아서 다시 12시)
    const displayAngle = (percentage / 100) * 360;
    const actualAngle = (270 + displayAngle) % 360; // 12시 방향 기준으로 시계방향
    const radianAngle = (actualAngle * Math.PI) / 180;
    // Handle position
    const handleX = centerX + radius * Math.cos(radianAngle) - 15;
    const handleY = centerY + radius * Math.sin(radianAngle) - 15;
    handle.style.left = handleX + 'px';
    handle.style.top = handleY + 'px';
    // Fill gradient - 12시 방향부터 시계방향으로
    const gradientAngle = 0; // 12시 방향에서 시작
    const endAngle = (gradientAngle + displayAngle) % 360;
    const gradientStyle = `conic-gradient(from ${gradientAngle}deg, var(--orange) 0deg, var(--orange) ${displayAngle}deg, transparent ${displayAngle}deg, transparent 360deg)`;
    fill.style.background = gradientStyle;
    // Handle color based on percentage
    const colors = ['#4CAF50', '#FFC107', 'var(--orange)', '#F44336'];
    const colorIndex = Math.min(3, Math.floor(percentage / 26));
    handle.style.background = colors[colorIndex];
}
function resetSlider() {
    userAnswer = 50;
    updateElement('percentageValue', '50');
    const handle = document.getElementById('sliderHandle');
    const fill = document.getElementById('sliderFill');
    if (handle && fill) {
        const slider = document.getElementById('circularSlider');
        const rect = slider.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        // 50%일 때의 시각적 업데이트
        updateSliderVisuals(50, handle, fill, centerX, centerY);
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////
function updateButtonStates(state) {
    const submitBtn = document.getElementById('submitButton');
    const nextBtn = document.getElementById('nextButton');
    const backBtn = document.getElementById('backButton');
    
    const configs = {
        playing: { submit: true, next: false, back: false },
        submitted: { submit: false, next: true, back: true }
    };
    
    const config = configs[state];
    if (!config) return;
    
    toggleButton(submitBtn, config.submit);
    toggleButton(nextBtn, config.next);
    if (backBtn) backBtn.disabled = config.back;
}

function confirmSubmit() {
    showConfirmModal(
        `🎯 답을 제출하시겠습니까: **${userAnswer}%**?\n\n한번 제출하면 이번 라운드에서는 답을 변경할 수 없습니다.`,
        submitAnswer
    );
}

function submitAnswer() {
    if (!currentQuestion) {
        showErrorModal('오류가 발생했습니다. 문제가 로드되지 않았습니다.');
        return;
    }

    const roundScore = calculateGameScore(userAnswer, currentQuestion.answer);
    totalScore += roundScore;
    setTotalScore(totalScore);

    const answerData = {
        round: currentRound,
        question: currentQuestion.question,
        userAnswer: userAnswer,
        actualAnswer: currentQuestion.answer,
        roundScore: roundScore,
        totalScore: totalScore
    };

    saveCurrentAnswer(answerData);
    goToPage('standby.html');
}

function confirmNext() {
    const isLastRound = currentRound >= 10;
    const message = isLastRound 
        ? '🎉 마지막 라운드였습니다!\n\n최종 결과를 보시겠습니까?'
        : `➡️ 라운드 ${currentRound + 1}로 이동하시겠습니까?\n\n이전 라운드로 돌아갈 수 없습니다.`;
    
    showConfirmModal(message, isLastRound ? goToGameOver : nextRound);
}

function nextRound() {
    closeAllModals();
    currentRound++;
    setCurrentRound(currentRound);
    
    if (currentRound > 10) {
        goToGameOver();
    } else {
        updateDisplays();
        loadCurrentQuestion();
    }
}

function confirmBack() {
    const destination = gameMode === 'join' ? 'join.html' : 'absolute.html';
    showConfirmModal(
        '⬅️ 게임 선택으로 돌아가시겠습니까?\n\n현재 게임 진행상황이 사라집니다.',
        () => goToPage(destination)
    );
}

function goToGameOver() {
    const gameData = createGameResultData();
    saveGameResults(gameData);
    
    fetch('gameover.html', { method: 'HEAD' })
        .then(response => response.ok ? goToPage('gameover.html') : showFinalResults(gameData))
        .catch(() => showFinalResults(gameData));
}

function createGameResultData() {
    return {
        totalScore: totalScore,
        rounds: Math.min(currentRound, 10),
        gameCode: gameCode,
        gameMode: gameMode,
        completedAt: new Date().toISOString()
    };
}

function showFinalResults(gameData) {
    const averageScore = Math.round(gameData.totalScore / Math.max(gameData.rounds, 1));
    const modeText = gameData.gameMode === 'join' ? '멀티플레이어' : '싱글 플레이어';
    
    showCustomModal(
        '🎉 게임 완료!',
        `
            <div class="final-results">
                <p><strong>게임 코드:</strong> ${gameData.gameCode}</p>
                <p><strong>모드:</strong> ${modeText}</p>
                <p><strong>완료한 라운드:</strong> ${gameData.rounds}/10</p>
                <p><strong>총 점수:</strong> ${gameData.totalScore}점</p>
                <p><strong>평균 점수:</strong> 라운드당 ${averageScore}점</p>
            </div>
        `,
        [
            { text: '🏠 메인 메뉴', class: 'btn-secondary', action: () => goToPage('absolute.html') },
            { text: '🔄 다시 플레이', class: 'btn-primary', action: startNewGame }
        ]
    );
}

function startNewGame() {
    clearGameSession();
    goToPage('absolute.html');
}

function showErrorModal(message) {
    showCustomModal(
        '❌ 오류',
        message,
        [{ text: '🏠 메인 메뉴로 이동', class: 'btn-primary', action: () => goToPage('absolute.html') }]
    );
}

function createFloatingStats() {
    const stats = ['📊', '📈', '📉', '🎯', '💯', '🎲', '📋', '🔢'];
    
    stats.forEach((stat, index) => {
        setTimeout(() => createFloatingElement(stat), index * 1500);
    });
}
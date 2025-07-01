// 전역 변수
const codeInputs = document.querySelectorAll('.code-input');
const joinBtn = document.getElementById('joinBtn');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');
const selectedPlayerNumber = document.getElementById('selectedPlayerNumber');

// 휠 피커 관련 변수
let wheelPicker = null;
let wheelItems = null;
let currentPlayerIndex = 1; // 1-based (실제 플레이어는 1-based)
let maxPlayers = 17; // 초기값
let actualMaxPlayers = 17; // 실제 게임에서 사용할 최대값
let currentGameInfo = null; // 현재 게임 정보 저장
let isDragging = false;
let startY = 0;
let startTranslateY = 0;
let velocity = 0;
let lastY = 0;
let lastTime = 0;
let animationId = null;

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    initializeWheelPicker();
    initializeCodeInputs();
    checkGameSystems();
});

// 게임 시스템 확인
function checkGameSystems() {
    if (!window.isGameDataLoaded() || !window.isQuestionsLoaded()) {
        showError('게임 시스템을 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
        joinBtn.disabled = true;
        return;
    }
}

// 휠 피커 초기화
function initializeWheelPicker() {
    wheelPicker = document.getElementById('playerWheelPicker');
    wheelItems = document.getElementById('wheelItems');
    updateWheelItems();
    setupWheelEvents();
    updateWheelPosition(1, false);
}

// 새로운 함수: 휠 아이템들 다시 생성
function updateWheelItems() {
    if (!wheelItems) return;
    wheelItems.innerHTML = '';
    for (let i = 1; i <= actualMaxPlayers; i++) {
        const item = document.createElement('div');
        item.className = 'wheel-item';
        item.textContent = i;
        item.dataset.value = i;
        wheelItems.appendChild(item);
    }
}

// 새로운 함수: 즉시 휠 아이템 업데이트
function updateWheelItemsImmediate() {
    const items = wheelItems.querySelectorAll('.wheel-item');
    
    // 즉시 아이템 표시/숨김 처리
    items.forEach((item, index) => {
        const playerNumber = index + 1;
        if (playerNumber <= actualMaxPlayers) {
            item.style.display = 'flex';
            item.style.opacity = '1';
        } else {
            item.style.display = 'none';
            item.style.opacity = '0';
        }
    });
    
    // 현재 위치가 유효한지 확인
    if (currentPlayerIndex > actualMaxPlayers) {
        updateWheelPosition(1, true);
    }
    
    hideMessages();
}

// 새로운 함수: 휠 기본값으로 복원
function resetWheelToDefault() {
    actualMaxPlayers = maxPlayers;
    updateWheelItems();
    updateWheelPosition(1, true);
}

// 휠 피커 이벤트 설정
function setupWheelEvents() {
    wheelPicker.addEventListener('mousedown', handleStart);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    wheelPicker.addEventListener('touchstart', handleStart, { passive: false });
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleEnd);
    wheelPicker.addEventListener('wheel', handleWheel, { passive: false });
}

// 드래그/터치 시작
function handleStart(e) {
    e.preventDefault();
    isDragging = true;
    const clientY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;
    startY = clientY;
    lastY = clientY;
    lastTime = Date.now();
    const transform = getComputedStyle(wheelItems).transform;
    if (transform !== 'none') {
        const matrix = new DOMMatrix(transform);
        startTranslateY = matrix.m42;
    } else {
        startTranslateY = 0;
    }
    velocity = 0;
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    wheelPicker.style.cursor = 'grabbing';
}

// 드래그/터치 이동
function handleMove(e) {
    if (!isDragging) return;
    e.preventDefault();
    const clientY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;
    const deltaY = clientY - startY;
    const currentTime = Date.now();
    if (currentTime - lastTime > 10) {
        velocity = (clientY - lastY) / (currentTime - lastTime);
        lastY = clientY;
        lastTime = currentTime;
    }
    const newTranslateY = startTranslateY + deltaY;
    wheelItems.style.transform = `translateY(${newTranslateY}px)`;
    updateSelectedItem();
}

// 드래그/터치 종료
function handleEnd(e) {
    if (!isDragging) return;
    isDragging = false;
    wheelPicker.style.cursor = 'grab';
    startInertiaScroll();
}

// 휠 이벤트 처리
function handleWheel(e) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 1 : -1;
    const newIndex = Math.max(1, Math.min(actualMaxPlayers, currentPlayerIndex + delta));
    if (newIndex !== currentPlayerIndex) {
        updateWheelPosition(newIndex, true);
    }
}

// 관성 스크롤
function startInertiaScroll() {
    if (Math.abs(velocity) < 0.1) {
        snapToNearest();
        return;
    }
    function animate() {
        const currentTransform = getComputedStyle(wheelItems).transform;
        let currentY = 0;
        if (currentTransform !== 'none') {
            const matrix = new DOMMatrix(currentTransform);
            currentY = matrix.m42;
        }
        const newY = currentY + velocity * 16;
        velocity *= 0.95;
        wheelItems.style.transform = `translateY(${newY}px)`;
        updateSelectedItem();
        if (Math.abs(velocity) > 0.1) {
            animationId = requestAnimationFrame(animate);
        } else {
            snapToNearest();
        }
    }
    animationId = requestAnimationFrame(animate);
}

// 가장 가까운 아이템으로 스냅
function snapToNearest() {
    const currentTransform = getComputedStyle(wheelItems).transform;
    let currentY = 0;
    if (currentTransform !== 'none') {
        const matrix = new DOMMatrix(currentTransform);
        currentY = matrix.m42;
    }
    const itemHeight = 50;
    const arrayIndex = Math.round(-currentY / itemHeight);
    const clampedArrayIndex = Math.max(0, Math.min(actualMaxPlayers - 1, arrayIndex));
    const actualPlayerIndex = clampedArrayIndex + 1;
    updateWheelPosition(actualPlayerIndex, true);
}

// 휠 위치 업데이트
function updateWheelPosition(playerIndex, animate = false) {
    const clampedIndex = Math.max(1, Math.min(actualMaxPlayers, playerIndex));
    currentPlayerIndex = clampedIndex;
    
    console.log(`휠 위치 업데이트: ${playerIndex} → ${clampedIndex} (범위: 1~${actualMaxPlayers})`);
    
    const itemHeight = 50;
    const translateY = -(clampedIndex - 1) * itemHeight;
    
    if (animate) {
        wheelItems.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    } else {
        wheelItems.style.transition = 'none';
    }
    
    wheelItems.style.transform = `translateY(${translateY}px)`;
    
    if (animate) {
        setTimeout(() => {
            wheelItems.style.transition = '';
        }, 500);
    }
    
    updateSelectedItem();
}

// 선택된 아이템 업데이트
function updateSelectedItem() {
    const items = wheelItems.querySelectorAll('.wheel-item');
    const currentTransform = getComputedStyle(wheelItems).transform;
    let currentY = 0;
    if (currentTransform !== 'none') {
        const matrix = new DOMMatrix(currentTransform);
        currentY = matrix.m42;
    }
    const itemHeight = 50;
    const arrayIndex = Math.round(-currentY / itemHeight);
    const clampedArrayIndex = Math.max(0, Math.min(actualMaxPlayers - 1, arrayIndex));
    const actualPlayerIndex = clampedArrayIndex + 1;
    items.forEach(item => item.classList.remove('selected'));
    if (items[clampedArrayIndex]) {
        items[clampedArrayIndex].classList.add('selected');
        selectedPlayerNumber.textContent = actualPlayerIndex;
    }
    currentPlayerIndex = actualPlayerIndex;
}

// 코드 입력 초기화
function initializeCodeInputs() {
    codeInputs.forEach((input, index) => {
        input.addEventListener('input', function(e) {
            const value = e.target.value.toUpperCase();
            
            // 영문자만 허용 (i, l 제외)
            const validChars = /^[ABCDEFGHJKMNOPQRSTUVWXYZ]$/;
            if (value && !validChars.test(value)) {
                e.target.value = '';
                showError('i, l을 제외한 영문자만 입력 가능합니다.');
                return;
            }
            
            e.target.value = value;
            
            // 입력 시 다음 필드로 이동
            if (value && index < codeInputs.length - 1) {
                codeInputs[index + 1].focus();
            }
            
            // 시각적 피드백
            if (value) {
                e.target.classList.add('filled');
                e.target.classList.remove('error');
            } else {
                e.target.classList.remove('filled');
            }
            
            updateJoinButton();
            hideMessages();
            
            // 4자리 완성 즉시 휠 범위 조정 및 최대값으로 설정
            if (isCodeComplete()) {
                setTimeout(() => {
                    updateWheelRangeFromCodeImmediate();
                }, 100);
            } else {
                resetWheelToDefault();
            }
        });

        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                codeInputs[index - 1].focus();
            }
            
            if (e.key === 'Enter' && isCodeComplete()) {
                joinGame();
            }
        });

        input.addEventListener('paste', function(e) {
            e.preventDefault();
            const pastedText = e.clipboardData.getData('text').toUpperCase();
            
            if (pastedText.length === 4 && /^[ABCDEFGHJKMNOPQRSTUVWXYZ]{4}$/.test(pastedText)) {
                pastedText.split('').forEach((char, i) => {
                    if (i < codeInputs.length) {
                        codeInputs[i].value = char;
                        codeInputs[i].classList.add('filled');
                    }
                });
                updateJoinButton();
                hideMessages();
                
                setTimeout(() => {
                    updateWheelRangeFromCodeImmediate();
                }, 100);
            }
        });
    });
}

// 즉시 휠 범위 조정 및 최대값 설정
function updateWheelRangeFromCodeImmediate() {
    const code = getEnteredCode();
    if (code.length === 4) {
        try {
            const gameInfo = window.getGameInfoFromCode(code);
            if (gameInfo) {
                console.log(`✅ 4자리 코드 완성: ${code}`);
                console.log(`게임 정보: 총 ${gameInfo.totalPlayers}명, 라이어 ${gameInfo.fakerCount}명`);
                
                // 게임 정보 저장
                currentGameInfo = gameInfo;
                
                // actualMaxPlayers 업데이트 (호스트 제외)
                const previousMax = actualMaxPlayers;
                actualMaxPlayers = gameInfo.totalPlayers - 1;
                
                console.log(`플레이어 범위: ${previousMax} → ${actualMaxPlayers}로 변경`);
                
                // 휠 아이템들 즉시 업데이트
                updateWheelItemsImmediate();
                
                // 자동으로 최대 플레이어 번호로 설정
                updateWheelPosition(actualMaxPlayers, true);
                
                console.log(`✅ 자동으로 플레이어 ${actualMaxPlayers}번으로 설정됨`);
                
                // 게임 정보 표시
                displayGameInfo(gameInfo);
                
                // 성공 메시지
                showSuccess(`플레이어 ${actualMaxPlayers}번으로 자동 설정되었습니다!`);
                
            } else {
                console.warn('❌ 유효하지 않은 코드:', code);
                resetWheelToDefault();
                showError('유효하지 않은 초대코드입니다.');
            }
        } catch (error) {
            console.error('❌ 코드 검증 중 오류:', error);
            resetWheelToDefault();
            showError('코드 검증 중 오류가 발생했습니다.');
        }
    }
}

// 게임 정보 표시
function displayGameInfo(gameInfo) {
    let gameInfoDiv = document.getElementById('gameInfo');
    
    if (!gameInfoDiv) {
        gameInfoDiv = document.createElement('div');
        gameInfoDiv.id = 'gameInfo';
        gameInfoDiv.className = 'game-info';
        
        const codeSection = document.querySelector('.code-section');
        if (codeSection) {
            codeSection.insertAdjacentElement('afterend', gameInfoDiv);
        }
    }
    
    gameInfoDiv.innerHTML = `
        🎮 게임 정보
        <div class="info-item">총 인원: ${gameInfo.totalPlayers}명</div>
        <div class="info-item">라이어: ${gameInfo.fakerCount}명</div>
        <div class="info-item">자동 선택: 플레이어 ${actualMaxPlayers}번</div>
    `;
    
    // 애니메이션 효과
    gameInfoDiv.style.display = 'block';
    gameInfoDiv.style.opacity = '0';
    gameInfoDiv.style.transform = 'translateY(-10px)';
    
    setTimeout(() => {
        gameInfoDiv.style.transition = 'all 0.3s ease';
        gameInfoDiv.style.opacity = '1';
        gameInfoDiv.style.transform = 'translateY(0)';
    }, 50);
}

// 조인 버튼 이벤트
joinBtn.addEventListener('click', joinGame);
joinBtn.addEventListener('touchstart', function() {
    if (!this.disabled) {
        this.style.transform = 'translateY(-1px)';
    }
});
joinBtn.addEventListener('touchend', function() {
    setTimeout(() => {
        this.style.transform = '';
    }, 150);
});

// 유틸리티 함수들
function isCodeComplete() {
    return Array.from(codeInputs).every(input => input.value.length === 1);
}

function updateJoinButton() {
    joinBtn.disabled = !isCodeComplete() || !window.isGameDataLoaded() || !window.isQuestionsLoaded();
}

function getEnteredCode() {
    return Array.from(codeInputs).map(input => input.value).join('');
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    successMessage.style.display = 'none';
    codeInputs.forEach(input => {
        input.classList.add('error');
        setTimeout(() => {
            input.classList.remove('error');
        }, 500);
    });
}

function showSuccess(message) {
    successMessage.textContent = message;
    successMessage.style.display = 'block';
    errorMessage.style.display = 'none';
}

function hideMessages() {
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';
}

// 코드 검증
function validateCode(code) {
    if (!window.isGameDataLoaded() || !window.isQuestionsLoaded()) {
        return { valid: false, message: '게임 시스템이 준비되지 않았습니다.' };
    }
    if (code.length !== 4) {
        return { valid: false, message: '4자리 코드를 모두 입력해주세요.' };
    }
    const validFormat = /^[ABCDEFGHJKMNOPQRSTUVWXYZ]{4}$/;
    if (!validFormat.test(code)) {
        return { valid: false, message: '올바른 형식의 코드를 입력해주세요.' };
    }
    try {
        const gameInfo = window.getGameInfoFromCode(code);
        if (!gameInfo) {
            return { valid: false, message: '유효하지 않은 초대코드입니다.' };
        }
        const validation = window.validateGameData(code);
        if (!validation.valid) {
            return { valid: false, message: '초대코드 검증 실패: ' + validation.errors.join(', ') };
        }
        currentGameInfo = gameInfo;
        return { valid: true, code: code, gameInfo: gameInfo };
    } catch (error) {
        console.error('코드 검증 중 오류:', error);
        return { valid: false, message: '코드 검증 중 오류가 발생했습니다.' };
    }
}

// 플레이어 번호 검증
function validatePlayerNumber(playerIndex, totalPlayers) {
    const maxPlayerIndex = totalPlayers - 1;
    if (playerIndex < 1 || playerIndex > maxPlayerIndex) {
        return { valid: false, message: `플레이어 번호는 1~${maxPlayerIndex} 범위여야 합니다. (총 ${totalPlayers}명 게임)` };
    }
    return { valid: true };
}

// 게임 참여
function joinGame() {
    if (!isCodeComplete()) {
        showError('4자리 코드를 모두 입력해주세요.');
        return;
    }
    const code = getEnteredCode();
    const validation = validateCode(code);
    if (!validation.valid) {
        showError(validation.message);
        return;
    }
    const gameInfo = validation.gameInfo;
    const selectedPlayer = currentPlayerIndex;
    const playerValidation = validatePlayerNumber(selectedPlayer, gameInfo.totalPlayers);
    if (!playerValidation.valid) {
        showError(playerValidation.message);
        return;
    }
    console.log('게임 참여 검증 완료:', {
        code: validation.code,
        selectedPlayer: selectedPlayer,
        gameInfo: gameInfo,
        validRange: `1~${gameInfo.totalPlayers - 1}`
    });
    showSuccess(`플레이어 ${selectedPlayer}번으로 참여 준비 완료!`);
    document.body.classList.add('loading');
    joinBtn.textContent = '참여 중...';
    setTimeout(() => {
        try {
            const playerData = {
                playerCode: validation.code,
                totalPlayers: gameInfo.totalPlayers,
                fakerCount: gameInfo.fakerCount,
                gameNumber: 1,
                playerIndex: currentPlayerIndex,
                currentRound: 1
            };
            console.log('게임 참여 완료:', playerData);
            const playerDataString = JSON.stringify(playerData);
            window.location.href = `player-game.html?data=${encodeURIComponent(playerDataString)}`;
        } catch (error) {
            console.error('게임 참여 중 오류:', error);
            document.body.classList.remove('loading');
            joinBtn.textContent = '🎮 게임 참여하기';
            showError('게임 참여 중 오류가 발생했습니다.');
        }
    }, 1000);
}

// 페이지 로드 시 첫 번째 입력 필드에 포커스
window.addEventListener('load', function() {
    if (codeInputs[0]) {
        codeInputs[0].focus();
    }
});
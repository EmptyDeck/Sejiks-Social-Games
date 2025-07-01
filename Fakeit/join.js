// 전역 변수
const codeInputs = document.querySelectorAll('.code-input');
const joinBtn = document.getElementById('joinBtn');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');
const selectedPlayerNumber = document.getElementById('selectedPlayerNumber');

// 휠 피커 관련 변수
let wheelPicker = null;
let wheelItems = null;
let currentPlayerIndex = 0; // 0-based (실제 플레이어는 1-based)
let isDragging = false;
let startY = 0;
let startTranslateY = 0;
let velocity = 0;
let lastY = 0;
let lastTime = 0;
let animationId = null;
let maxPlayers = 17;

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
    
    // 플레이어 번호 아이템 생성 (1-17)
    for (let i = 1; i <= maxPlayers; i++) {
        const item = document.createElement('div');
        item.className = 'wheel-item';
        item.textContent = i;
        item.dataset.value = i;
        wheelItems.appendChild(item);
    }
    
    // 이벤트 리스너 설정
    setupWheelEvents();
    
    // 초기 위치 설정 (플레이어 1 선택)
    updateWheelPosition(0, false);
}

// 휠 피커 이벤트 설정
function setupWheelEvents() {
    // 마우스 이벤트
    wheelPicker.addEventListener('mousedown', handleStart);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    
    // 터치 이벤트
    wheelPicker.addEventListener('touchstart', handleStart, { passive: false });
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleEnd);
    
    // 휠 이벤트
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
    
    // 현재 transform 값 가져오기
    const transform = getComputedStyle(wheelItems).transform;
    if (transform !== 'none') {
        const matrix = new DOMMatrix(transform);
        startTranslateY = matrix.m42;
    } else {
        startTranslateY = 0;
    }
    
    velocity = 0;
    
    // 진행 중인 애니메이션 중지
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
    
    // 속도 계산
    if (currentTime - lastTime > 10) {
        velocity = (clientY - lastY) / (currentTime - lastTime);
        lastY = clientY;
        lastTime = currentTime;
    }
    
    // 위치 업데이트
    const newTranslateY = startTranslateY + deltaY;
    wheelItems.style.transform = `translateY(${newTranslateY}px)`;
    
    updateSelectedItem();
}

// 드래그/터치 종료
function handleEnd(e) {
    if (!isDragging) return;
    
    isDragging = false;
    wheelPicker.style.cursor = 'grab';
    
    // 관성 스크롤 시작
    startInertiaScroll();
}

// 휠 이벤트 처리
function handleWheel(e) {
    e.preventDefault();
    
    const delta = e.deltaY > 0 ? 1 : -1;
    const newIndex = Math.max(0, Math.min(maxPlayers - 1, currentPlayerIndex + delta));
    
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
        
        // 관성 적용
        const newY = currentY + velocity * 16; // 16ms 기준
        velocity *= 0.95; // 감속
        
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
    
    // 가장 가까운 인덱스 계산
    const itemHeight = 50; // var(--wheel-item-height)
    const nearestIndex = Math.round(-currentY / itemHeight);
    const clampedIndex = Math.max(0, Math.min(maxPlayers - 1, nearestIndex));
    
    updateWheelPosition(clampedIndex, true);
}

// 휠 위치 업데이트
function updateWheelPosition(index, animate = false) {
    currentPlayerIndex = index;
    const itemHeight = 50;
    const translateY = -index * itemHeight;
    
    if (animate) {
        wheelItems.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    } else {
        wheelItems.style.transition = 'none';
    }
    
    wheelItems.style.transform = `translateY(${translateY}px)`;
    
    // 트랜지션 완료 후 제거
    if (animate) {
        setTimeout(() => {
            wheelItems.style.transition = '';
        }, 300);
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
    const centerIndex = Math.round(-currentY / itemHeight);
    const clampedIndex = Math.max(0, Math.min(maxPlayers - 1, centerIndex));
    
    // 모든 아이템에서 selected 클래스 제거
    items.forEach(item => item.classList.remove('selected'));
    
    // 중앙 아이템에 selected 클래스 추가
    if (items[clampedIndex]) {
        items[clampedIndex].classList.add('selected');
        selectedPlayerNumber.textContent = clampedIndex + 1; // 1-based 표시
    }
    
    currentPlayerIndex = clampedIndex;
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
        });

        input.addEventListener('keydown', function(e) {
            // 백스페이스 시 이전 필드로 이동
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                codeInputs[index - 1].focus();
            }
            
            // 엔터키로 게임 참여
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
            }
        });
    });

    // 조인 버튼 이벤트
    joinBtn.addEventListener('click', joinGame);
    
    // 터치 피드백
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
}

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
    
    // 입력 필드에 에러 표시
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
    // 게임 시스템 확인
    if (!window.isGameDataLoaded() || !window.isQuestionsLoaded()) {
        return { valid: false, message: '게임 시스템이 준비되지 않았습니다.' };
    }

    // 코드 길이 검증
    if (code.length !== 4) {
        return { valid: false, message: '4자리 코드를 모두 입력해주세요.' };
    }
    
    // 영문자만 허용 (i, l 제외)
    const validFormat = /^[ABCDEFGHJKMNOPQRSTUVWXYZ]{4}$/;
    if (!validFormat.test(code)) {
        return { valid: false, message: '올바른 형식의 코드를 입력해주세요.' };
    }
    
    try {
        // gameData.js를 사용하여 코드 검증 및 게임 정보 추출
        const gameInfo = window.getGameInfoFromCode(code);
        
        if (!gameInfo) {
            return { 
                valid: false, 
                message: '유효하지 않은 초대코드입니다.'
            };
        }
        
        // 추가 검증
        const validation = window.validateGameData(code);
        if (!validation.valid) {
            return { 
                valid: false, 
                message: '초대코드 검증 실패: ' + validation.errors.join(', ')
            };
        }
        
        return { 
            valid: true, 
            code: code,
            gameInfo: gameInfo
        };
    } catch (error) {
        console.error('코드 검증 중 오류:', error);
        return { valid: false, message: '코드 검증 중 오류가 발생했습니다.' };
    }
}

// 플레이어 번호 검증
function validatePlayerNumber(playerNumber, totalPlayers) {
    if (playerNumber < 1 || playerNumber > totalPlayers) {
        return {
            valid: false,
            message: `플레이어 번호는 1~${totalPlayers} 범위여야 합니다.`
        };
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
    
    // 게임 정보 추출
    const gameInfo = validation.gameInfo;
    const selectedPlayer = currentPlayerIndex + 1; // 1-based
    
    // 플레이어 번호 검증
    const playerValidation = validatePlayerNumber(selectedPlayer, gameInfo.totalPlayers);
    if (!playerValidation.valid) {
        showError(playerValidation.message);
        return;
    }
    
    // 성공 메시지 표시
    showSuccess(`플레이어 ${selectedPlayer}번으로 참여 준비 완료! (총 ${gameInfo.totalPlayers}명 중 ${gameInfo.fakerCount}명이 라이어)`);
    
    // 로딩 상태 표시
    document.body.classList.add('loading');
    joinBtn.textContent = '참여 중...';
    
    // 게임 참여 처리
    setTimeout(() => {
        try {
            const playerData = {
                playerCode: validation.code,
                totalPlayers: gameInfo.totalPlayers,
                fakerCount: gameInfo.fakerCount,
                gameNumber: 1,                    // 게임 1부터 시작
                playerIndex: currentPlayerIndex,  // 0-based 인덱스
                currentRound: 1
            };
            
            console.log('게임 참여 완료:', {
                code: validation.code,
                playerNumber: selectedPlayer,
                playerIndex: currentPlayerIndex,
                gameInfo: gameInfo
            });
            
            // 플레이어 데이터를 저장하고 게임 페이지로 이동
            const playerDataString = JSON.stringify(playerData);
            
            // player-game.html로 이동
            window.location.href = `player-game.html?data=${encodeURIComponent(playerDataString)}`;
            
        } catch (error) {
            console.error('게임 참여 중 오류:', error);
            document.body.classList.remove('loading');
            joinBtn.textContent = '🎮 게임 참여하기';
            showError('게임 참여 중 오류가 발생했습니다.');
        }
    }, 1000);
}

// 코드에서 최대 플레이어 수 동적 업데이트
function updateMaxPlayersFromCode() {
    const code = getEnteredCode();
    if (code.length === 4) {
        try {
            const gameInfo = window.getGameInfoFromCode(code);
            if (gameInfo && gameInfo.totalPlayers !== maxPlayers) {
                maxPlayers = gameInfo.totalPlayers;
                
                // 현재 선택된 플레이어가 범위를 벗어나면 조정
                if (currentPlayerIndex >= maxPlayers) {
                    updateWheelPosition(maxPlayers - 1, true);
                }
                
                // 휠 아이템 업데이트 (필요시)
                updateWheelItems();
            }
        } catch (error) {
            // 무시 (아직 유효하지 않은 코드일 수 있음)
        }
    }
}

// 휠 아이템 업데이트 (플레이어 수 변경 시)
function updateWheelItems() {
    const items = wheelItems.querySelectorAll('.wheel-item');
    
    items.forEach((item, index) => {
        if (index < maxPlayers) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// 코드 입력 시 플레이어 수 업데이트 이벤트 추가
codeInputs.forEach(input => {
    input.addEventListener('input', updateMaxPlayersFromCode);
});

// 페이지 로드 시 첫 번째 입력 필드에 포커스
window.addEventListener('load', function() {
    if (codeInputs[0]) {
        codeInputs[0].focus();
    }
});
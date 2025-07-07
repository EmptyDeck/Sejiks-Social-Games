//host.js

// 게임 설정 전역 변수
let totalPlayers = 4;
let fakerCount = 1;
let inviteCode = null;

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 게임 데이터 시스템 로드 확인
    if (!window.isGameDataLoaded()) {
        console.error('게임 데이터 시스템이 로드되지 않았습니다.');
        alert('게임 시스템 로드 중 오류가 발생했습니다. 페이지를 새로고침해주세요.');
        return;
    }
    
    // 질문 시스템 로드 확인
    if (!window.isQuestionsLoaded || !window.isQuestionsLoaded()) {
        console.error('질문 시스템이 로드되지 않았습니다.');
        alert('질문 시스템 로드 중 오류가 발생했습니다. 페이지를 새로고침해주세요.');
        return;
    }
    
    // 초기 상태 설정
    document.getElementById('totalCount').textContent = totalPlayers;
    document.getElementById('fakerCount').textContent = fakerCount;
    
    // 이벤트 리스너 설정
    setupEventListeners();
    
    // 터치 피드백 추가
    addTouchFeedback();
});

/**
 * 이벤트 리스너 설정
 */
function setupEventListeners() {
    // 게임 시작 버튼
    const startBtn = document.getElementById('startBtn');
    if (startBtn) {
        startBtn.addEventListener('click', startGame);
    }
}

/**
 * 터치 피드백 추가
 */
function addTouchFeedback() {
    document.querySelectorAll('.counter-btn, .generate-btn, .start-btn').forEach(btn => {
        btn.addEventListener('touchstart', function() {
            if (!this.classList.contains('disabled')) {
                this.style.transform = 'scale(0.95)';
            }
        });

        btn.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

/**
 * 인원수 변경 함수
 * @param {string} type - 'total' 또는 'faker'
 * @param {number} delta - 변경할 값 (+1 또는 -1)
 */
function changeCount(type, delta) {
    if (type === 'total') {
        const newTotal = totalPlayers + delta;
        if (newTotal >= 3 && newTotal <= 17) { // 새 시스템의 범위에 맞춰 수정
            totalPlayers = newTotal;
            document.getElementById('totalCount').textContent = totalPlayers;

            // 페이커 수가 전체 인원을 초과하지 않도록 조정
            if (fakerCount >= totalPlayers) {
                fakerCount = Math.max(1, totalPlayers - 1);
                document.getElementById('fakerCount').textContent = fakerCount;
            }

            clearInviteCode();
        }
    } else if (type === 'faker') {
        const newFaker = fakerCount + delta;
        if (newFaker >= 1 && newFaker <= 15 && newFaker < totalPlayers) { // 새 시스템 범위 적용
            fakerCount = newFaker;
            document.getElementById('fakerCount').textContent = fakerCount;
            clearInviteCode();
        }
    }
}

/**
 * 생성된 초대코드를 초기화하는 함수
 */
function clearInviteCode() {
    inviteCode = null;
    document.getElementById('codesGrid').innerHTML = '';
    document.getElementById('warningText').style.display = 'none';
    document.getElementById('startBtn').classList.add('disabled');
    
    // 게임 미리보기 숨기기
    const gamePreview = document.getElementById('gamePreview');
    if (gamePreview) {
        gamePreview.style.display = 'none';
    }
}

/**
 * 초대 코드 생성 메인 함수 
 */
function generateCodes() {
    // 게임 데이터 시스템 확인
    if (!window.isGameDataLoaded()) {
        console.error('게임 데이터가 로드되지 않았습니다.');
        alert('게임 데이터 시스템이 준비되지 않았습니다.');
        return;
    }

    try {
        // 새로운 단일 초대코드 생성
        inviteCode = window.generateInviteCode(totalPlayers, fakerCount);
        
        if (!inviteCode) {
            alert('초대코드 생성에 실패했습니다. 설정을 확인해주세요.');
            return;
        }

        // 생성된 코드 검증
        const validation = window.validateGameData(inviteCode);
        if (!validation.valid) {
            console.error('생성된 코드 검증 실패:', validation.errors);
            alert('생성된 코드에 문제가 있습니다: ' + validation.errors.join(', '));
            return;
        }

        console.log('초대코드 생성 완료:', {
            code: inviteCode,
            totalPlayers: totalPlayers,
            fakerCount: fakerCount,
            validation: validation.data
        });

        // UI 업데이트 및 데이터 저장
        displayInviteCode();
        //updateGamePreview();
        document.getElementById('startBtn').classList.remove('disabled');
        saveGameData();

    } catch (error) {
        console.error('초대코드 생성 중 오류:', error);
        alert('초대코드 생성 중 오류가 발생했습니다: ' + error.message);
    }
}

/**
 * 생성된 초대코드를 UI에 표시
 */
function displayInviteCode() {
    const codesGrid = document.getElementById('codesGrid');
    codesGrid.innerHTML = `
        <div class="big-invite-code">${inviteCode}</div>
    `;
}



/**
 * 초대코드 클립보드 복사
 */
function copyInviteCode() {
    if (!inviteCode) return;
    
    navigator.clipboard.writeText(inviteCode).then(() => {
        // 복사 완료 피드백
        const copyBtn = document.querySelector('.copy-btn');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✅ 복사됨!';
        copyBtn.style.backgroundColor = '#4CAF50';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.backgroundColor = '';
        }, 2000);
    }).catch(err => {
        console.error('클립보드 복사 실패:', err);
        alert('클립보드 복사에 실패했습니다.');
    });
}


/**
 * 게임 데이터를 localStorage에 저장하는 함수
 */
function saveGameData() {
    if (!inviteCode) {
        console.error('저장할 초대코드가 없습니다.');
        return;
    }
    
    try {
        // localStorage에 모든 필요한 데이터 저장
        localStorage.setItem('inviteCode', inviteCode);
        localStorage.setItem('totalPlayers', totalPlayers.toString());
        localStorage.setItem('fakerCount', fakerCount.toString());
        localStorage.setItem('currentGame', '1'); // 게임 1부터 시작
        localStorage.setItem('currentRound', '1'); // 라운드 1부터 시작
        localStorage.setItem('isHost', 'true'); // 호스트 표시
        localStorage.setItem('gameStartTime', new Date().toISOString());
        
        console.log('게임 데이터 저장 완료:', {
            inviteCode: inviteCode,
            totalPlayers: totalPlayers,
            fakerCount: fakerCount
        });

    } catch (error) {
        console.error('게임 데이터 저장 중 오류:', error);
    }
}

// /**
//  * 게임 시작 함수
//  */
// function startGame() {
//     if (!inviteCode) {
//         alert('먼저 초대코드를 생성해주세요.');
//         return;
//     }
    
//     try {
//         // 최종 데이터 저장
//         saveGameData();
        
//         console.log('게임 시작 - host-game.html로 이동');
        
//         // host-game.html로 이동
//         window.location.href = 'host-game.html';
        
//     } catch (error) {
//         console.error('게임 시작 중 오류:', error);
//         alert('게임 시작 중 오류가 발생했습니다: ' + error.message);
//     }
// }
/**
 * 게임 시작 함수
 */
function startGame() {
    if (!inviteCode) {
        return;
    }
    
    try {
        // 최종 데이터 저장
        saveGameData();
        
        console.log('게임 시작 - card-role.html을 거쳐 host-game.html로 이동');
        
        // card-role.html을 거쳐 host-game.html로 이동
        window.location.href = 'card-role.html?next=host-game.html';
        
    } catch (error) {
        console.error('게임 시작 중 오류:', error);
        alert('게임 시작 중 오류가 발생했습니다: ' + error.message);
    }
}

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
        updateGamePreview();
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
    codesGrid.innerHTML = '';

    // 단일 초대코드 카드 생성
    const codeCard = document.createElement('div');
    codeCard.className = 'code-card invite-code-card';
    codeCard.innerHTML = `
        <div class="code-header">
            <div class="code-number">🎫 초대코드</div>
            <button class="copy-btn" onclick="copyInviteCode()">📋 복사</button>
        </div>
        <div class="code-value invite-code">${inviteCode}</div>
        <div class="code-description">모든 플레이어가 이 코드를 사용합니다</div>
    `;
    codesGrid.appendChild(codeCard);

    // 경고 메시지 표시
    const warningText = document.getElementById('warningText');
    warningText.textContent = "* 모든 플레이어는 위의 초대코드를 입력해주세요";
    warningText.style.display = 'block';
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
 * 게임 미리보기 업데이트
 */
function updateGamePreview() {
    if (!inviteCode) return;

    // 게임 미리보기 요소가 있는지 확인
    let gamePreview = document.getElementById('gamePreview');
    if (!gamePreview) {
        // 게임 미리보기 요소 동적 생성
        gamePreview = document.createElement('div');
        gamePreview.id = 'gamePreview';
        gamePreview.className = 'game-preview-section';
        gamePreview.innerHTML = `
            <h3 class="preview-title">🎮 게임 미리보기</h3>
            <div class="preview-content">
                <div class="questions-preview">
                    <h4>첫 번째 게임 질문들:</h4>
                    <div id="questionsPreview" class="questions-list"></div>
                </div>
                <div class="faker-preview">
                    <h4>라이어 배치 (게임 1 기준):</h4>
                    <div id="fakerPreview" class="faker-info"></div>
                </div>
            </div>
        `;
        
        // 코드 섹션 다음에 삽입
        const codesSection = document.querySelector('.codes-section');
        codesSection.parentNode.insertBefore(gamePreview, document.getElementById('startBtn'));
    }

    const questionsPreview = document.getElementById('questionsPreview');
    const fakerPreview = document.getElementById('fakerPreview');

    try {
        // 게임 1의 질문들 가져오기 (미리보기용)
        const gameQuestions = window.getCurrentGameQuestions(inviteCode, 1);
        
        // 질문 미리보기 표시
        questionsPreview.innerHTML = '';
        gameQuestions.forEach((questionId, round) => {
            const question = window.getQuestionByNumber(questionId);
            if (question) {
                const questionItem = document.createElement('div');
                questionItem.className = 'question-preview-item';
                const parsedQuestion = window.parseQuestionNumber(questionId);
                questionItem.innerHTML = `
                    <span class="round-label">R${round + 1}:</span>
                    <span class="question-text">${question.main}</span>
                    <span class="question-mode">(${parsedQuestion.typeName})</span>
                `;
                questionsPreview.appendChild(questionItem);
            }
        });

        // 라이어 현황 표시 (게임 1 기준)
        const fakers = window.getFakersForGame(inviteCode, 1);
        const normalPlayers = totalPlayers - fakers.length;
        
        fakerPreview.innerHTML = `
            <div class="faker-stat">
                <span class="stat-label">라이어:</span>
                <span class="stat-value faker">${fakers.length}명</span>
                <span class="faker-list">(${fakers.map(i => `P${i + 1}`).join(', ')})</span>
            </div>
            <div class="faker-stat">
                <span class="stat-label">일반 플레이어:</span>
                <span class="stat-value normal">${normalPlayers}명</span>
            </div>
            <div class="preview-note">
                <small>* 라이어는 게임별로 다르게 선정됩니다</small>
            </div>
        `;

        gamePreview.style.display = 'block';
        
    } catch (error) {
        console.error('게임 미리보기 업데이트 중 오류:', error);
    }
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

/**
 * 게임 시작 함수
 */
function startGame() {
    if (!inviteCode) {
        alert('먼저 초대코드를 생성해주세요.');
        return;
    }
    
    try {
        // 최종 데이터 저장
        saveGameData();
        
        console.log('게임 시작 - host-game.html로 이동');
        
        // host-game.html로 이동
        window.location.href = 'host-game.html';
        
    } catch (error) {
        console.error('게임 시작 중 오류:', error);
        alert('게임 시작 중 오류가 발생했습니다: ' + error.message);
    }
}
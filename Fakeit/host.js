// 게임 설정 전역 변수
let totalPlayers = 4;
let fakerCount = 1;
let generatedCodes = [];
let hostCode = null;

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 게임 데이터 시스템 로드 확인
    if (!window.isGameDataLoaded() || !window.isQuestionsLoaded()) {
        console.error('게임 데이터 또는 질문 시스템이 로드되지 않았습니다.');
        alert('게임 시스템 로드 중 오류가 발생했습니다. 페이지를 새로고침해주세요.');
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
        if (newTotal >= 3 && newTotal <= 8) {
            totalPlayers = newTotal;
            document.getElementById('totalCount').textContent = totalPlayers;

            // 페이커 수가 전체 인원을 초과하지 않도록 조정
            if (fakerCount >= totalPlayers) {
                fakerCount = Math.max(1, totalPlayers - 1);
                document.getElementById('fakerCount').textContent = fakerCount;
            }

            clearCodes();
        }
    } else if (type === 'faker') {
        const newFaker = fakerCount + delta;
        if (newFaker >= 1 && newFaker < totalPlayers) {
            fakerCount = newFaker;
            document.getElementById('fakerCount').textContent = fakerCount;
            clearCodes();
        }
    }
}

/**
 * 생성된 코드들을 초기화하는 함수
 */
function clearCodes() {
    generatedCodes = [];
    hostCode = null;
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
 * 4자리 영문 코드 생성 (새로운 시스템)
 */
function generateRandomCode() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 4; i++) {
        code += letters[Math.floor(Math.random() * letters.length)];
    }
    return code;
}


// 초대 코드 생성 메인 함수
function generateCodes() {
    // 게임 데이터 시스템 확인
    if (!window.isGameDataLoaded()) {
        console.error('게임 데이터가 로드되지 않았습니다.');
        alert('게임 데이터 시스템이 준비되지 않았습니다.');
        return;
    }

    try {
        generatedCodes = [];
        const usedCodes = new Set(); // 생성된 코드의 중복을 확인하기 위한 Set

        // 1. 게임별로 사용할 공통 행 인덱스를 랜덤으로 선택합니다. (0~5)
        const selectedRowIndices = [
            Math.floor(Math.random() * 6), // 게임 1용 행 인덱스
            Math.floor(Math.random() * 6), // 게임 2용 행 인덱스
            Math.floor(Math.random() * 6), // 게임 3용 행 인덱스
            Math.floor(Math.random() * 6)  // 게임 4용 행 인덱스
        ];

        // 2. 선택된 행 인덱스를 기반으로 4개의 '알파벳 풀'을 구성합니다.
        const letterPools = [
            window.gameCodeSets[0][selectedRowIndices[0]], // 게임 1 알파벳 풀
            window.gameCodeSets[1][selectedRowIndices[1]], // 게임 2 알파벳 풀
            window.gameCodeSets[2][selectedRowIndices[2]], // 게임 3 알파벳 풀
            window.gameCodeSets[3][selectedRowIndices[3]]  // 게임 4 알파벳 풀
        ];

        console.log('선택된 행 인덱스:', selectedRowIndices.map(i => i + 1)); // 1-based index로 표시
        console.log('구성된 알파벳 풀:', letterPools);

        // 3. 각 플레이어의 코드를 생성합니다.
        for (let i = 0; i < totalPlayers; i++) {
            let code;
            let attempts = 0;

            // 4. 중복되지 않는 고유 코드가 생성될 때까지 반복합니다.
            do {
                code = (
                    letterPools[0][Math.floor(Math.random() * 4)] +
                    letterPools[1][Math.floor(Math.random() * 4)] +
                    letterPools[2][Math.floor(Math.random() * 4)] +
                    letterPools[3][Math.floor(Math.random() * 4)]
                ).toUpperCase(); // 대문자로 통일

                attempts++;
                if (attempts > 1000) { // 무한 루프 방지
                    throw new Error('고유한 코드를 생성하는 데 실패했습니다. 플레이어 수를 확인해주세요.');
                }
            } while (usedCodes.has(code));

            usedCodes.add(code); // 생성된 코드를 Set에 추가하여 중복 체크

            const codeData = {
                code: code,
                playerIndex: i,
                isHost: i === totalPlayers - 1
            };
            generatedCodes.push(codeData);
        }

        // 호스트 코드 설정
        hostCode = generatedCodes[generatedCodes.length - 1];

        console.log('코드 생성 완료:', {
            totalCodes: generatedCodes.length,
            hostCode: hostCode.code,
            allCodes: generatedCodes.map(c => c.code)
        });

        // UI 업데이트 및 데이터 저장
        displayCodes();
        updateGamePreview();
        document.getElementById('startBtn').classList.remove('disabled');
        saveCodesData();

    } catch (error) {
        console.error('코드 생성 중 오류:', error);
        alert('코드 생성 중 오류가 발생했습니다: ' + error.message);
    }
}


/**
 * 생성된 코드들을 UI에 표시
 */
function displayCodes() {
    const codesGrid = document.getElementById('codesGrid');
    codesGrid.innerHTML = '';

    // 호스트를 제외한 플레이어 코드들만 표시
    const playerCodes = generatedCodes.filter(codeData => !codeData.isHost);
    
    playerCodes.forEach((codeData, index) => {
        const codeCard = document.createElement('div');
        codeCard.className = 'code-card';
        codeCard.innerHTML = `
            <div class="code-number">플레이어 ${index + 1}</div>
            <div class="code-value">${codeData.code}</div>
        `;
        codesGrid.appendChild(codeCard);
    });

    // 경고 메시지 표시
    const warningText = document.getElementById('warningText');
    if (totalPlayers === 1) {
        warningText.textContent = "호스트 코드가 자동으로 적용됩니다.";
    } else {
        warningText.textContent = "* 각 플레이어는 자신의 코드를 입력해주세요";
    }
    warningText.style.display = 'block';
}

/**
 * 게임 미리보기 업데이트 (새로운 시스템)
 */
function updateGamePreview() {
    if (!hostCode) return;

    const gamePreview = document.getElementById('gamePreview');
    const questionsPreview = document.getElementById('questionsPreview');
    const fakerPreview = document.getElementById('fakerPreview');

    if (gamePreview && questionsPreview && fakerPreview) {
        try {
            // 게임 1의 질문들 가져오기 (미리보기용)
            const gameQuestions = window.getCurrentGameQuestions(hostCode.code, 1);
            
            // 질문 미리보기 표시
            questionsPreview.innerHTML = '';
            gameQuestions.forEach((questionId, round) => {
                const question = window.getQuestionByNumber(questionId);
                if (question) {
                    const questionItem = document.createElement('div');
                    questionItem.className = 'question-preview-item';
                    questionItem.innerHTML = `
                        <span class="round-label">R${round + 1}:</span>
                        <span class="question-text">${question.main}</span>
                        <span class="question-mode">(${question.mode})</span>
                    `;
                    questionsPreview.appendChild(questionItem);
                }
            });

            // 페이커 현황 표시 (게임 1 기준)
            let fakerCounts = { faker: 0, normal: 0 };
            
            generatedCodes.forEach((codeData, index) => {
                const isFaker = window.isPlayerFakerInRound(
                    codeData.code, 1, 1, index, totalPlayers, fakerCount
                );
                if (isFaker) {
                    fakerCounts.faker++;
                } else {
                    fakerCounts.normal++;
                }
            });
            
            // 호스트 페이커 여부 확인
            const hostIsFaker = window.isPlayerFakerInRound(
                hostCode.code, 1, 1, totalPlayers - 1, totalPlayers, fakerCount
            );
            
            fakerPreview.innerHTML = `
                <div class="faker-stat">
                    <span class="stat-label">예상 페이커:</span>
                    <span class="stat-value faker">${fakerCounts.faker}명</span>
                </div>
                <div class="faker-stat">
                    <span class="stat-label">일반 플레이어:</span>
                    <span class="stat-value normal">${fakerCounts.normal}명</span>
                </div>
                <div class="faker-stat">
                    <span class="stat-label">호스트 (게임1):</span>
                    <span class="stat-value ${hostIsFaker ? 'faker' : 'normal'}">
                        ${hostIsFaker ? '페이커' : '일반'}
                    </span>
                </div>
                <div class="preview-note">
                    <small>* 실제 페이커는 게임별로 달라질 수 있습니다</small>
                </div>
            `;

            gamePreview.style.display = 'block';
            
        } catch (error) {
            console.error('게임 미리보기 업데이트 중 오류:', error);
        }
    }
}

/**
 * 생성된 코드들을 localStorage에 저장하는 함수
 */
function saveCodesData() {
    if (!hostCode || generatedCodes.length === 0) {
        console.error('저장할 코드 데이터가 없습니다.');
        return;
    }
    
    try {
        // 플레이어 코드들 추출 (호스트 제외)
        const playerCodes = generatedCodes
            .filter(codeData => !codeData.isHost)
            .map(codeData => codeData.code);
        
        // localStorage에 모든 필요한 데이터 저장
        localStorage.setItem('hostCode', hostCode.code);
        localStorage.setItem('allPlayerCodes', JSON.stringify(playerCodes));
        localStorage.setItem('totalPlayers', totalPlayers.toString());
        localStorage.setItem('fakerCount', fakerCount.toString());
        localStorage.setItem('allCodesData', JSON.stringify(generatedCodes));
        localStorage.setItem('currentGame', '1'); // 게임 1부터 시작
        localStorage.setItem('currentRound', '1'); // 라운드 1부터 시작
        
        console.log('코드 데이터 저장 완료:', {
            hostCode: hostCode.code,
            playerCodes: playerCodes,
            totalPlayers: totalPlayers,
            fakerCount: fakerCount
        });

    } catch (error) {
        console.error('코드 데이터 저장 중 오류:', error);
    }
}

/**
 * 게임 시작 함수
 */
function startGame() {
    if (generatedCodes.length === 0 || !hostCode) {
        alert('먼저 초대 코드를 생성해주세요.');
        return;
    }
    
    try {
        // 최종 데이터 저장
        saveCodesData();
        
        // 게임 시작 시간 저장
        localStorage.setItem('gameStartTime', new Date().toISOString());
        
        console.log('게임 시작 - host-game.html로 이동');
        
        // host-game.html로 이동
        window.location.href = 'host-game.html';
        
    } catch (error) {
        console.error('게임 시작 중 오류:', error);
        alert('게임 시작 중 오류가 발생했습니다: ' + error.message);
    }
}

// 게임 데이터 전역 변수
let hostAnswer = '';
let hostIsFaker = false;
let currentRound = 1;
let currentGame = 1;
let totalPlayers = 4;
let cardFlipped = false;
let votingEnabled = false;
let playerVotes = {};
let selectedQuestions = [];
let maxRounds = 4;
let maxGames = 4;
let answerType = 'text'; // 'text' 또는 'drawing'

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 게임 데이터 시스템 로드 확인
    if (!window.isGameDataLoaded() || !window.isQuestionsLoaded()) {
        console.error('게임 데이터 또는 질문 시스템이 로드되지 않았습니다.');
        alert('게임 시스템 로드 중 오류가 발생했습니다. 페이지를 새로고침해주세요.');
        return;
    }
    
    loadGameData();
    initializeUI();
    setupEventListeners();
});

// 게임 데이터 로드
function loadGameData() {
    hostAnswer = localStorage.getItem('hostAnswer') || '답변 없음';
    hostIsFaker = localStorage.getItem('hostIsFaker') === 'true';
    currentRound = parseInt(localStorage.getItem('currentRound')) || 1;
    currentGame = parseInt(localStorage.getItem('currentGame')) || 1;
    totalPlayers = parseInt(localStorage.getItem('totalPlayers')) || 4;

    // 선택된 질문 복원
    const savedQuestions = localStorage.getItem('selectedQuestions');
    if (savedQuestions) {
        selectedQuestions = JSON.parse(savedQuestions);
    }

    // 답변 유형 확인 (그림 답변인지 텍스트 답변인지)
    const savedDrawing = localStorage.getItem('playerDrawing');
    if (savedDrawing && savedDrawing !== '') {
        answerType = 'drawing';
    }

    // 투표 데이터 초기화 (0 또는 1만 가능하도록)
    initializeVotes();
    
    console.log('Answer 게임 데이터 로드 완료:', {
        hostAnswer,
        hostIsFaker,
        currentRound,
        currentGame,
        totalPlayers,
        answerType
    });
}

// 투표 데이터 초기화
function initializeVotes() {
    playerVotes = {};
    for (let i = 1; i < totalPlayers; i++) {
        playerVotes[`플레이어${i}`] = 0;
    }
    playerVotes['호스트'] = 0;
}

// UI 초기화
function initializeUI() {
    updateHeader();
    updateAnswerCard();  
    updateQuestionSection();
    createVotingButtons();
    showControlButtons();
}

// 헤더 업데이트
function updateHeader() {
    document.getElementById('roundNumber').textContent = currentRound;
    
    // 총 라운드 수 표시
    const totalElement = document.getElementById('roundTotal');
    if (totalElement) {
        totalElement.textContent = `/${maxRounds}`;
    }

    // 게임 번호 표시
    const gameElement = document.getElementById('gameNumber');
    if (gameElement) {
        gameElement.textContent = currentGame;
    }
    
    // 게임 코드 정보 표시 (디버깅용)
    const gameCodeElement = document.getElementById('gameCodeValue');
    if (gameCodeElement) {
        const hostCode = localStorage.getItem('hostCode');
        gameCodeElement.textContent = hostCode || '로딩 중...';
    }
}

// 답변 카드 업데이트 (그림/텍스트 구분)
function updateAnswerCard() {
    if (answerType === 'drawing') {
        // 그림 답변 표시
        const savedDrawing = localStorage.getItem('playerDrawing');
        if (savedDrawing) {
            const canvas = document.getElementById('answerDrawing');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.onload = function() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
            img.src = savedDrawing;
            
            // 텍스트 숨기고 캔버스 표시
            document.getElementById('answerText').style.display = 'none';
            canvas.style.display = 'block';
        }
    } else {
        // 텍스트 답변 표시
        document.getElementById('answerText').textContent = hostAnswer;
        document.getElementById('answerText').style.display = 'block';
        
        const canvas = document.getElementById('answerDrawing');
        if (canvas) {
            canvas.style.display = 'none';
        }
    }
}

// 질문 섹션 업데이트 (라이어만 - 새로운 함수 시그니처 사용)
function updateQuestionSection() {
    if (hostIsFaker) {
        try {
            const hostCode = localStorage.getItem('hostCode');
            // 새로운 함수 시그니처: getCurrentQuestion(hostCode, gameNumber, round, isFaker)
            const currentQuestion = window.getCurrentQuestion(hostCode, currentGame, currentRound, false);
            
            if (currentQuestion) {
                // 라이어에게만 메인 질문을 보여주되, 다른 사람들이 못 보도록 처리
                document.getElementById('questionSection').style.display = 'block';
                document.getElementById('mainQuestionText').textContent = currentQuestion.text;
                
                // 메인 질문을 잠시 후에 자동으로 숨김 (5초 후)
                setTimeout(() => {
                    document.getElementById('questionSection').style.display = 'none';
                }, 5000);
            }
        } catch (error) {
            console.error('질문 섹션 업데이트 중 오류:', error);
        }
    }
}

// 투표 버튼 생성
function createVotingButtons() {
    const votingGrid = document.getElementById('votingGrid');
    votingGrid.innerHTML = '';
    
    Object.keys(playerVotes).forEach(playerName => {
        const voteBtn = document.createElement('button');
        voteBtn.className = 'vote-btn';
        voteBtn.dataset.player = playerName;
        voteBtn.innerHTML = `
            <div>${playerName}</div>
            <div class="vote-status" style="display: none;">✓</div>
        `;
        voteBtn.addEventListener('click', () => toggleVote(playerName));
        votingGrid.appendChild(voteBtn);
    });
}

// 컨트롤 버튼 표시
function showControlButtons() {
    const nextBtn = document.getElementById('nextBtn');
    const nextGameBtn = document.getElementById('nextGameBtn');
    const endGameBtn = document.getElementById('endGameBtn');
    
    // 라운드/게임 진행 버튼 표시
    if (currentRound < maxRounds) {
        nextBtn.style.display = 'block';
        nextBtn.textContent = '➡️ 다음 라운드';
    } else if (currentGame < maxGames) {
        nextBtn.style.display = 'none';
        if (nextGameBtn) {
            nextGameBtn.style.display = 'block';
        } else {
            // 다음 게임 버튼이 없으면 생성
            createNextGameButton();
        }
    } else {
        nextBtn.style.display = 'none';
        if (nextGameBtn) nextGameBtn.style.display = 'none';
    }
    
    // 게임 종료 버튼은 항상 표시
    if (!endGameBtn) {
        createEndGameButton();
    }
}

// 다음 게임 버튼 생성
function createNextGameButton() {
    const nextGameBtn = document.createElement('button');
    nextGameBtn.className = 'control-btn game-btn';
    nextGameBtn.id = 'nextGameBtn';
    nextGameBtn.textContent = '🎲 다음 게임';
    nextGameBtn.addEventListener('click', handleNextGame);
    document.querySelector('.control-section').appendChild(nextGameBtn);
}

// 게임 종료 버튼 생성
function createEndGameButton() {
    const gameEndBtn = document.createElement('button');
    gameEndBtn.className = 'control-btn end-btn';
    gameEndBtn.id = 'endGameBtn';
    gameEndBtn.textContent = '🏆 게임 종료';
    gameEndBtn.addEventListener('click', handleGameEnd);
    document.querySelector('.control-section').appendChild(gameEndBtn);
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 답변 카드 클릭
    document.getElementById('answerCard').addEventListener('click', toggleCard);
    
    // 컨트롤 버튼들
    document.getElementById('nextBtn').addEventListener('click', handleNextRound);
    document.getElementById('backBtn').addEventListener('click', handleBack);
}

// 카드 뒤집기
function toggleCard() {
    const card = document.getElementById('answerCard');
    const instruction = document.getElementById('answerInstruction');
    
    cardFlipped = !cardFlipped;
    
    if (cardFlipped) {
        card.classList.add('flipped');
        instruction.textContent = '터치하여 답변 숨기기';
        
        // 답변이 공개되면 투표 섹션 표시
        setTimeout(() => {
            showVotingSection();
        }, 300);
    } else {
        card.classList.remove('flipped');
        instruction.textContent = '터치하여 답변 공개';
        hideVotingSection();
    }
}

// 투표 섹션 표시
function showVotingSection() {
    document.getElementById('votingSection').style.display = 'block';
    votingEnabled = true;
}

// 투표 섹션 숨기기
function hideVotingSection() {
    document.getElementById('votingSection').style.display = 'none';
    votingEnabled = false;
}

// 투표 토글 (0 또는 1만 가능)
function toggleVote(playerName) {
    if (!votingEnabled) {
        alert('먼저 답변을 공개해주세요.');
        return;
    }
    
    // 토글 방식으로 투표 처리 (0 ↔ 1)
    playerVotes[playerName] = playerVotes[playerName] === 0 ? 1 : 0;
    updateVoteDisplay(playerName);
    updateVoteCount();
}

// 투표 표시 업데이트
function updateVoteDisplay(playerName) {
    const voteBtn = document.querySelector(`[data-player="${playerName}"]`);
    const statusIcon = voteBtn.querySelector('.vote-status');
    const isVoted = playerVotes[playerName] === 1;
    
    if (isVoted) {
        statusIcon.style.display = 'block';
        voteBtn.classList.add('voted');
    } else {
        statusIcon.style.display = 'none';
        voteBtn.classList.remove('voted');
    }
}

// 총 투표 수 업데이트
function updateVoteCount() {
    const totalVotes = Object.values(playerVotes).reduce((sum, count) => sum + count, 0);
    document.getElementById('currentVotes').textContent = totalVotes;
}

// 다음 라운드
function handleNextRound() {
    // 투표 데이터를 localStorage에 저장
    localStorage.setItem('roundVotes', JSON.stringify(playerVotes));
    
    // 다음 라운드로 자동 진행하도록 플래그 설정
    localStorage.setItem('autoNextRound', 'true');
    localStorage.setItem('nextRoundNumber', (currentRound + 1).toString());
    
    console.log('다음 라운드로 이동 - 투표 데이터 저장:', playerVotes);
    console.log('자동 다음 라운드 설정:', currentRound + 1);
    
    // player-game.html로 돌아가서 다음 라운드 진행
    window.location.href = 'player-game.html';
}

// 다음 게임
function handleNextGame() {
    // 투표 데이터를 localStorage에 저장
    localStorage.setItem('roundVotes', JSON.stringify(playerVotes));
    
    // 다음 게임으로 자동 진행하도록 플래그 설정
    localStorage.setItem('autoNextGame', 'true');
    localStorage.setItem('nextGameNumber', (currentGame + 1).toString());
    localStorage.setItem('nextRoundNumber', '1'); // 새 게임은 1라운드부터
    
    console.log('다음 게임으로 이동 - 게임:', currentGame + 1);
    
    // player-game.html로 돌아가서 새 게임 시작
    window.location.href = 'player-game.html';
}


// 게임 종료
function handleGameEnd() {
    // 최종 투표 데이터 저장
    localStorage.setItem('finalVotes', JSON.stringify(playerVotes));
    localStorage.setItem('gameEndRound', currentRound.toString());
    localStorage.setItem('gameEndGame', currentGame.toString());
    
    console.log('게임 종료 - 최종 투표 데이터 저장:', playerVotes);
    
    // gameover.html로 이동
    window.location.href = 'gameover.html';
}

// 게임으로 돌아가기
function handleBack() {
    try {
        const hostCode = localStorage.getItem('hostCode');
        const playerCode = localStorage.getItem('playerCode');
        const playerIndex = parseInt(localStorage.getItem('playerIndex'));
        const totalPlayers = parseInt(localStorage.getItem('totalPlayers')) || 4;
        
        // 호스트 판별 로직
        let isHost = false;
        
        // 1순위: 코드 비교
        if (hostCode && playerCode) {
            isHost = (hostCode === playerCode);
            console.log('코드 비교 결과:', { hostCode, playerCode, isHost });
        }
        
        // 2순위: 인덱스 비교 (호스트는 보통 0 또는 마지막)
        if (!isHost && !isNaN(playerIndex)) {
            isHost = (playerIndex === 0) || (playerIndex === totalPlayers - 1);
            console.log('인덱스 비교 결과:', { playerIndex, totalPlayers, isHost });
        }
        
        // 3순위: URL 매개변수 확인 (host-game.html에서 온 경우)
        if (!isHost) {
            const urlParams = new URLSearchParams(window.location.search);
            const fromHost = urlParams.get('from') === 'host';
            if (fromHost) {
                isHost = true;
                console.log('URL 매개변수로 호스트 확인');
            }
        }
        
        // 4순위: 직접 localStorage 플래그
        if (!isHost) {
            isHost = localStorage.getItem('isHost') === 'true';
            console.log('localStorage 플래그 확인:', isHost);
        }
        
        console.log('최종 호스트 여부:', isHost);
        
        if (isHost) {
            console.log('호스트 - host-game.html로 이동');
            window.location.href = 'host-game.html';
        } else {
            console.log('플레이어 - player-game.html로 이동');
            window.location.href = 'player-game.html';
        }
        
    } catch (error) {
        console.error('게임으로 돌아가기 중 오류:', error);
        // 오류 시 안전하게 player-game.html로 이동
        alert('오류가 발생했습니다. 플레이어 게임으로 이동합니다.');
        window.location.href = 'player-game.html';
    }
}


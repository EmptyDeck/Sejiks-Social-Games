// 전역 변수
let nextPage = '';
let playerRole = '';
let playerIndex = 0;
let totalPlayers = 4;
let fakerCount = 1;

// 각 면의 회전 값
const perFace = [
    [-0.1, 0.3, -1],
    [-0.1, 0.6, -0.4],
    [-0.85, -0.42, 0.73],
    [-0.8, 0.3, -0.75],
    [0.3, 0.45, 0.9],
    [-0.16, 0.6, 0.18]
];

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    startDiceAnimation();
});

// 페이지 초기화
function initializePage() {
    // URL 파라미터에서 다음 페이지 정보 읽기
    const urlParams = new URLSearchParams(window.location.search);
    nextPage = urlParams.get('next') || 'host-game.html';
    
    // localStorage에서 게임 데이터 읽기
    loadGameData();
    
    // 역할 결정
    determineRole();
    
    console.log('초기화 완료:', {
        nextPage,
        playerRole,
        playerIndex,
        totalPlayers,
        fakerCount
    });
}

// 게임 데이터 로드
function loadGameData() {
    try {
        playerIndex = parseInt(localStorage.getItem('playerIndex')) || 0;
        totalPlayers = parseInt(localStorage.getItem('totalPlayers')) || 4;
        fakerCount = parseInt(localStorage.getItem('fakerCount')) || 1;
        
        // 호스트인지 확인
        const isHost = playerIndex === 0;
        console.log('게임 데이터 로드:', {
            playerIndex,
            totalPlayers,
            fakerCount,
            isHost
        });
    } catch (error) {
        console.error('게임 데이터 로드 실패:', error);
        // 기본값 사용
        playerIndex = 0;
        totalPlayers = 4;
        fakerCount = 1;
    }
}

// 역할 결정 로직
function determineRole() {
    // 임시로 1번 플레이어를 라이어로 설정 (실제로는 더 복잡한 로직 필요)
    if (playerIndex === 1) {
        playerRole = 'liar';
    } else {
        playerRole = 'normal';
    }
    
    // 실제 게임에서는 여기서 서버나 localStorage에서 역할 정보를 가져와야 함
    console.log('역할 결정:', playerRole);
}

// 주사위 애니메이션 시작
function startDiceAnimation() {
    const dice = document.querySelector('.dice');
    
    // 3초간 rolling 애니메이션
    setTimeout(() => {
        // rolling 멈추고 throw 애니메이션 시작
        dice.classList.remove('rolling');
        dice.classList.add('throw');
        
        // 주사위 값 설정 (1-6)
        const diceValue = Math.floor(Math.random() * 6) + 1;
        setDiceValue(diceValue);
        
        // 1초 후 결과 표시
        setTimeout(() => {
            showResult();
        }, 1000);
        
    }, 3000);
}

// 주사위 값 설정
function setDiceValue(value) {
    const dice = document.querySelector('.dice');
    dice.style.transform = `rotate3d(${perFace[value - 1]}, 180deg)`;
}

// 결과 표시
function showResult() {
    const resultContainer = document.getElementById('resultContainer');
    const roleIcon = document.getElementById('roleIcon');
    const roleTitle = document.getElementById('roleTitle');
    const roleDescription = document.getElementById('roleDescription');
    const continueBtn = document.getElementById('continueBtn');
    
    // 로딩 점 숨기기
    document.querySelector('.loading-dots').style.display = 'none';
    
    // 역할에 따른 내용 설정
    if (playerRole === 'liar') {
        roleIcon.textContent = '🎭';
        roleTitle.textContent = '라이어';
        roleDescription.textContent = '당신은 라이어입니다! 다른 플레이어들을 속이고 정답을 맞춰보세요.';
        roleIcon.style.color = '#e74c3c';
        roleTitle.style.color = '#e74c3c';
    } else {
        roleIcon.textContent = '👤';
        roleTitle.textContent = '일반 플레이어';
        roleDescription.textContent = '당신은 일반 플레이어입니다. 라이어를 찾아내고 정답을 맞춰보세요!';
        roleIcon.style.color = '#3498db';
        roleTitle.style.color = '#3498db';
    }
    
    // 결과 화면 표시
    resultContainer.classList.add('show');
    
    // 계속하기 버튼 이벤트
    continueBtn.addEventListener('click', function() {
        goToNextPage();
    });
}

// 다음 페이지로 이동
function goToNextPage() {
    // 역할 정보를 localStorage에 저장
    localStorage.setItem('playerRole', playerRole);
    localStorage.setItem('roleRevealed', 'true');
    
    // 다음 페이지로 이동
    window.location.href = nextPage;
}

// 에러 처리
window.addEventListener('error', function(e) {
    console.error('JavaScript 에러:', e);
});

// 디버깅을 위한 함수들
function debugRole() {
    console.log('현재 역할:', playerRole);
    console.log('플레이어 인덱스:', playerIndex);
    console.log('다음 페이지:', nextPage);
}

// 강제로 역할 변경 (테스트용)
function forceRole(role) {
    playerRole = role;
    console.log('역할 강제 변경:', role);
}

// 테스트용 - 개발자 도구에서 사용 가능
window.debugRole = debugRole;
window.forceRole = forceRole;
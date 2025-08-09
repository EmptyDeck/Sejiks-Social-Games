let settings = JSON.parse(localStorage.getItem('settings') || '{}');
let startIndex = settings.start || 1;
let endIndex = settings.end || vocabList.length;
let mode = settings.lang || 'eng';
let numQuestions = settings.count || 20;
let timeLimit = settings.timeLimit || 3; // 초 단위
let maxQuestionsLimit = settings.maxQuestions || 40;

let questions = vocabList.slice(startIndex - 1, endIndex);
shuffleInPlace(questions);

let queue = questions.slice(0, numQuestions);
let extraQueue = [];
let score = 0;
let streak = 0;
let currentQuestion = null;
let timerId = null;
let timeLeft = timeLimit;

// 상태 플래그 추가
let isLocked = false; // 이 라운드에서 입력 수락 여부
let isRevealed = false; // 정답 공개 여부
let roundToken = 0; // 라운드 식별자(타이머/비동기 보호)

// 진행도 바 관련 변수 추가
let totalCount = Math.min(numQuestions, maxQuestionsLimit); // 현재 예정 총 문제 수
let answeredCount = 0; // 이미 소모한 문제 수

const gameCard = document.getElementById('gameCard');
const optionsContainer = document.getElementById('answerGrid');
const scoreDisplay = document.getElementById('scoreDisplay');
const nextBtnContainer = document.getElementById('nextBtnContainer');
const nextBtn = document.getElementById('nextBtn');
const timerDisplay = document.getElementById('timerDisplay'); // 타이머 표시용

// 진행도 바 DOM 참조 추가
const progressBar = document.getElementById('progressBar');
const progressLabel = document.getElementById('progressLabel');

// 진행도 업데이트 함수 추가
function updateProgressBar() {
  const total = Math.max(totalCount, answeredCount);
  const pct = total > 0 ? Math.round((answeredCount / total) * 100) : 0;
  if (progressBar) progressBar.style.width = `${pct}%`;
  if (progressLabel) progressLabel.textContent = `${answeredCount} / ${total}`;
}

function updateScoreDisplay() {
  if (streak > 1) {
    scoreDisplay.textContent = `점수: ${score} (+${streak}연속)`;
  } else {
    scoreDisplay.textContent = `점수: ${score}`;
  }
}

function startTimer(localToken) {
  stopTimer();
  timeLeft = timeLimit;
  timerDisplay.textContent = `${timeLeft}s`;
  
  timerId = setInterval(() => {
    // 오래된 라운드 타이머 무효화
    if (localToken !== roundToken) {
      stopTimer();
      return;
    }
    
    timeLeft -= 1;
    timerDisplay.textContent = `${timeLeft}s`;

    if (timeLeft <= 0) {
      stopTimer();
      // 이미 잠겨있다면 무시
      if (isLocked) return;

      // 타임아웃은 오답 처리
      const correctAnswer = (mode === 'eng') ? currentQuestion?.definition : currentQuestion?.word;
      handleWrong(null, correctAnswer);
    }
  }, 1000);
}

function stopTimer() {
  if (timerId != null) {
    clearInterval(timerId);
    timerId = null;
  }
}

function showQuestion() {
  // 다음 라운드로 전환: 상태 초기화
  isLocked = false;
  isRevealed = false;
  
  if (queue.length === 0) {
    endGame();
    return;
  }

  // 라운드 토큰 갱신
  roundToken++;
  currentQuestion = queue.shift();
  gameCard.querySelector('.question').textContent =
    mode === 'eng' ? currentQuestion.word : currentQuestion.definition;

  const allDefs = vocabList.map(v => mode === 'eng' ? v.definition : v.word);
  const correctAnswer = mode === 'eng' ? currentQuestion.definition : currentQuestion.word;

  // 9지선다 구성
  const choices = buildChoices(correctAnswer, allDefs, 9);
  optionsContainer.innerHTML = '';
  choices.forEach(choice => {
    const btn = document.createElement('button');
    btn.className = 'btn secondary';
    btn.textContent = choice;
    // 클릭 가드: isLocked / isRevealed 상태 체크
    btn.addEventListener('click', () => {
      if (isLocked) return;
      if (isRevealed) return;
      handleAnswer(choice, correctAnswer, btn);
    });
    optionsContainer.appendChild(btn);
  });

  updateScoreDisplay();
  nextBtn.disabled = true;
  startTimer(roundToken);
  
  // 새 문제 표시 후 진행도 바 업데이트(분모/분자 변동 반영)
  updateProgressBar();
}

function handleAnswer(selected, correct, btn) {
  // 가드: 라운드 입력 잠김/정답 공개 상태면 무시
  if (isLocked) return;
  if (isRevealed) return;
  
  // 이 시점에서 라운드 입력 잠금
  isLocked = true;
  stopTimer();
  
  const isCorrect = selected === correct;
  
  if (isCorrect) {
    btn.classList.add('correct');
    score += 1 + streak;
    streak++;
    updateScoreDisplay();
    
    // 다른 버튼 비활성화
    [...optionsContainer.children].forEach(b => { if (b !== btn) b.disabled = true; });

    // 문제 소비
    answeredCount++;
    updateProgressBar();

    // 약간의 지연 후 다음 문제
    setTimeout(() => {
      showQuestion();
    }, 800);
  } else {
    // 오답 처리로 이관
    handleWrong(btn, correct);
  }
}

function handleWrong(btn, correct) {
  // 이미 잠겨 있고 정답 공개된 상태면 재실행 방지
  if (isLocked && isRevealed) {
    return;
  }
  
  stopTimer();
  // 상태 갱신: 연속 끊김, 입력 잠금 + 정답 공개
  streak = 0;
  isLocked = true;
  isRevealed = true;
  
  // correct 보정
  if (!correct && currentQuestion) {
    correct = (mode === 'eng') ? currentQuestion.definition : currentQuestion.word;
  }
  
  if (btn) btn.classList.add('wrong');
  
  // 정답 표시 및 모든 버튼 잠금
  [...optionsContainer.children].forEach(optionBtn => {
    optionBtn.disabled = true;
    if (optionBtn.textContent === correct) {
      optionBtn.classList.add('correct');
    }
  });

  // 틀린 문제 재출제 로직: 총합 상한 준수
  if (queue.length + extraQueue.length < maxQuestionsLimit && currentQuestion) {
    if (totalCount < maxQuestionsLimit) {
      totalCount++;
    }
    extraQueue.push(currentQuestion);
  }
  
  // 다음 버튼 활성화, answeredCount는 next 시점에 +1
  nextBtn.disabled = false;
  updateProgressBar();
}

// 중복된 이벤트 리스너 제거하고 하나만 유지
nextBtn.addEventListener('click', () => {
  if (nextBtn.disabled) return;
  
  // 다음 라운드 전 준비
  // extraQueue를 섞어서 뒤에 붙임
  if (extraQueue.length > 0) {
    shuffleInPlace(extraQueue);
    queue.push(...extraQueue);
    extraQueue = [];
  }
  // 오답/타임아웃 문제 소비
  answeredCount++;
  updateProgressBar();
  showQuestion();
});

function endGame() {
  localStorage.setItem('results', JSON.stringify({
    score,
    total: totalCount // 실제로 소모 예정 총합
  }));
  goToPage('results.html');
}

// Fisher–Yates Shuffle
function shuffleInPlace(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// 중복 없는 선택지 구성
function buildChoices(correct, pool, size) {
  const set = new Set();
  set.add(correct);
  while (set.size < size) {
    const rand = pool[Math.floor(Math.random() * pool.length)];
    set.add(rand);
  }
  const result = Array.from(set);
  shuffleInPlace(result);
  return result;
}

// 초기화 및 시작
answeredCount = 0;
totalCount = Math.min(numQuestions, maxQuestionsLimit);
updateProgressBar();
showQuestion();

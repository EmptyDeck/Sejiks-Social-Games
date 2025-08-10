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

// 상태 플래그
let isLocked = false;
let isRevealed = false;
let roundToken = 0;

// 진행도
let totalCount = Math.min(numQuestions, maxQuestionsLimit);
let answeredCount = 0;

const gameCard = document.getElementById('gameCard');
const optionsContainer = document.getElementById('answerGrid');
const scoreDisplay = document.getElementById('scoreDisplay');
const nextBtnContainer = document.getElementById('nextBtnContainer');
const nextBtn = document.getElementById('nextBtn');
const timerDisplay = document.getElementById('timerDisplay');

const progressBar = document.getElementById('progressBar');
const progressLabel = document.getElementById('progressLabel');

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
    if (localToken !== roundToken) {
      stopTimer();
      return;
    }
    timeLeft -= 1;
    timerDisplay.textContent = `${timeLeft}s`;

    if (timeLeft <= 0) {
      stopTimer();
      if (isLocked) return;
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
  isLocked = false;
  isRevealed = false;
  
  if (queue.length === 0) {
    endGame();
    return;
  }

  roundToken++;
  currentQuestion = queue.shift();
  currentQuestion.isRetry = currentQuestion.isRetry || false; // 기본값 false

  gameCard.querySelector('.question').textContent =
    mode === 'eng' ? currentQuestion.word : currentQuestion.definition;

  const allDefs = vocabList.map(v => mode === 'eng' ? v.definition : v.word);
  const correctAnswer = mode === 'eng' ? currentQuestion.definition : currentQuestion.word;

  const choices = buildChoices(correctAnswer, allDefs, 5);
  optionsContainer.innerHTML = '';
  choices.forEach(choice => {
    const btn = document.createElement('button');
    btn.className = 'btn secondary';
    btn.textContent = choice;
    btn.addEventListener('click', () => {
      if (isLocked || isRevealed) return;
      handleAnswer(choice, correctAnswer, btn);
    });
    optionsContainer.appendChild(btn);
  });

  updateScoreDisplay();
  nextBtn.disabled = true;
  startTimer(roundToken);
  updateProgressBar();
}

function handleAnswer(selected, correct, btn) {
  if (isLocked || isRevealed) return;
  
  isLocked = true;
  stopTimer();
  
  const isCorrect = selected === correct;
  
  if (isCorrect) {
    btn.classList.add('correct');

    // 재출제 문제가 아니라면 점수/연속 추가
    if (!currentQuestion.isRetry) {
      score += 1 + streak;
      streak++;
    }

    updateScoreDisplay();
    [...optionsContainer.children].forEach(b => { if (b !== btn) b.disabled = true; });

    answeredCount++;
    updateProgressBar();

    setTimeout(() => {
      showQuestion();
    }, 800);

  } else {
    handleWrong(btn, correct);
  }
}

function handleWrong(btn, correct) {
  if (isLocked && isRevealed) return;
  
  stopTimer();
  streak = 0;
  isLocked = true;
  isRevealed = true;
  
  if (!correct && currentQuestion) {
    correct = (mode === 'eng') ? currentQuestion.definition : currentQuestion.word;
  }
  
  if (btn) btn.classList.add('wrong');
  
  [...optionsContainer.children].forEach(optionBtn => {
    optionBtn.disabled = true;
    if (optionBtn.textContent === correct) {
      optionBtn.classList.add('correct');
    }
  });

  // 틀린 문제 재출제 (isRetry = true 설정)
  if (queue.length + extraQueue.length < maxQuestionsLimit && currentQuestion) {
    if (totalCount < maxQuestionsLimit) {
      totalCount++;
    }
    extraQueue.push({
      ...currentQuestion,
      isRetry: true
    });
  }
  
  nextBtn.disabled = false;
  updateProgressBar();
}

nextBtn.addEventListener('click', () => {
  if (nextBtn.disabled) return;
  
  if (extraQueue.length > 0) {
    shuffleInPlace(extraQueue);
    queue.push(...extraQueue);
    extraQueue = [];
  }
  answeredCount++;
  updateProgressBar();
  showQuestion();
});

function endGame() {
  localStorage.setItem('results', JSON.stringify({
    score,
    total: totalCount
  }));
  goToPage('results.html');
}

function shuffleInPlace(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

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

// 초기화
answeredCount = 0;
totalCount = Math.min(numQuestions, maxQuestionsLimit);
updateProgressBar();
showQuestion();

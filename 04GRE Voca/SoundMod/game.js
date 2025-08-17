// game.js

// import { vocabList } from "./vocabList.js";
// import { openProgressFile, saveProgress, saveProgressAs } from "./progress.js";

let settings = JSON.parse(localStorage.getItem('settings') || '{}');
let startIndex = settings.start || 1;
let endIndex = settings.end || vocabList.length;
let mode = settings.lang || 'eng';
let numQuestions = settings.count || 20;
let timeLimit = settings.timeLimit || 3; // 초 단위
let maxQuestionsLimit = settings.maxQuestions || 40;
// 시작 시간 기록
let gameStartTime = Date.now();


let questions = vocabList.slice(startIndex - 1, endIndex);
shuffleInPlace(questions);

let queue = questions.slice(0, numQuestions);
let extraQueue = [];
let score = 0;
let streak = 0;
let currentQuestion = null;
let timerId = null;
let timeLeft = timeLimit;

// ==================Load Progress==================
// Load existing progress
document.getElementById("openProgressBtn").onclick = async () => {
  const data = await openProgressFile();
  if (data) {
    console.log("Loaded progress:", data);
    // apply to your game state here
  }
};

// Save
document.getElementById("saveProgressBtn").onclick = async () => {
  await saveProgress(currentGameState);
};

// Save As
document.getElementById("saveAsProgressBtn").onclick = async () => {
  await saveProgressAs(currentGameState);
};

// ================== STATE ==================
let currentPool = [];   // Active pool of up to 20 words
let mastered = new Set(); // Mastered words
let currentWord = null;
let selectedVoice = null;

// ================== INIT ==================
window.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("openProgressBtn");
  const saveBtn = document.getElementById("saveProgressBtn");
  const saveAsBtn = document.getElementById("saveAsProgressBtn");

  if (openBtn) openBtn.onclick = async () => {
    const data = await openProgressFile();
    if (data) console.log("Loaded progress:", data);
  };

  if (saveBtn) saveBtn.onclick = async () => {
    await saveProgress(currentGameState);
  };

  if (saveAsBtn) saveAsBtn.onclick = async () => {
    await saveProgressAs(currentGameState);
  };
});

// ================== TTS ==================
function loadVoices() {
  const voices = speechSynthesis.getVoices();
  console.log("Available voices:", voices);

  const savedVoice = localStorage.getItem("selectedVoice");
  if (savedVoice) {
    selectedVoice = voices.find(v => v.name === savedVoice);
    console.log("Saved voice:", savedVoice, "Found:", selectedVoice);
  }
  
  if (!selectedVoice) {
    selectedVoice = voices[0];
    console.log("Fallback voice:", selectedVoice);
  }
}


speechSynthesis.onvoiceschanged = loadVoices;

function speak(text) {
  console.log("Trying to speak:", text);
  if (!text) {
    console.log("No text to speak");
    return;
  }
  if (!selectedVoice) {
    console.log("No voice selected");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = selectedVoice;
  utterance.onstart = () => console.log("TTS started");
  utterance.onend = () => console.log("TTS ended");
  utterance.onerror = (e) => console.error("TTS error:", e);

  speechSynthesis.speak(utterance);
}
console.log("speechSynthesis supported?", 'speechSynthesis' in window);
console.log("User Agent:", navigator.userAgent);
console.log("Protocol:", location.protocol);

// ================== GAME FLOW ==================
function loadGameState() {
  const progress = loadProgress();
  mastered = new Set(Object.keys(progress).filter(w => progress[w].mastered));

  // Build pool of max 20
  currentPool = Object.keys(progress)
    .filter(w => !progress[w].mastered)
    .slice(0, 20);

  // If pool empty, refill from vocabList
  if (currentPool.length === 0) {
    for (let w of vocabList) {
      if (!mastered.has(w)) {
        currentPool.push(w);
        if (currentPool.length >= 20) break;
      }
    }
  }

  if (currentPool.length === 0) {
    alert("🎉 All words mastered!");
  }
}

function showQuestion() {
  if (currentPool.length === 0) {
    document.getElementById("gameCard").innerHTML = "<p>All words done 🎉</p>";
    return;
  }

  // Pick random word from pool
  currentWord = currentPool[Math.floor(Math.random() * currentPool.length)];

  const progress = loadProgress();
  const stats = progress[currentWord];

  document.getElementById("gameCard").innerHTML = `
    <h2>${currentWord}</h2>
    <p>Streak: ${stats.streak} / ${stats.requiredStreak}</p>
    <p>Tries: ${stats.tries}, Fails: ${stats.fails}</p>
    <input type="text" id="answerInput" placeholder="Type meaning..."/>
    <button id="submitBtn">Submit</button>
  `;

  document.getElementById("submitBtn").addEventListener("click", checkAnswer);

  // Speak word
  speak(currentWord);
}

function checkAnswer() {
  const input = document.getElementById("answerInput").value.trim().toLowerCase();
  const progress = loadProgress();
  const stats = progress[currentWord];

  stats.tries++;

  // Simple check → you can replace with fuzzy match later
  if (input === currentWord.toLowerCase()) {
    stats.streak++;
    if (stats.streak >= stats.requiredStreak) {
      stats.mastered = true;
      mastered.add(currentWord);
      currentPool = currentPool.filter(w => w !== currentWord);
    }
  } else {
    stats.fails++;
    stats.streak = 0;
    stats.requiredStreak = Math.min(10, stats.requiredStreak + 1);
  }

  saveProgress(progress);
  showQuestion();
}

// 상태 플래그
let isLocked = false;
let isRevealed = false;
let roundToken = 0;

// 진행도
let totalCount = Math.min(numQuestions, maxQuestionsLimit);
let answeredCount = 0;

// 틀린 문제 관리용 맵 (문제 ID -> 남은 재시도 횟수)
let wrongQuestionsMap = new Map();

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
  // 최대 문제 갯수 체크 - 답변한 문제 수가 최대치에 도달하면 게임 종료
  if (answeredCount >= maxQuestionsLimit) {
    endGame();
    return;
  }

  isLocked = false;
  isRevealed = false;
  
  if (queue.length === 0) {
    endGame();
    return;
  }

  roundToken++;
  currentQuestion = queue.shift();
  
  // 문제 ID 생성 (고유 식별자)
  if (!currentQuestion.questionId) {
    currentQuestion.questionId = `${currentQuestion.word}_${currentQuestion.definition}`;
  }

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
  const questionId = currentQuestion.questionId;
  
  if (isCorrect) {
    btn.classList.add('correct');

    // 틀린 문제였다면 재시도 횟수 감소
    if (wrongQuestionsMap.has(questionId)) {
      const remainingRetries = wrongQuestionsMap.get(questionId) - 1;
      if (remainingRetries <= 0) {
        wrongQuestionsMap.delete(questionId); // 모든 재시도 완료
      } else {
        wrongQuestionsMap.set(questionId, remainingRetries); // 재시도 횟수 감소
      }
    }

    // 재출제 문제가 아니거나 모든 재시도가 완료된 경우에만 점수/연속 추가
    if (!wrongQuestionsMap.has(questionId) && !currentQuestion.isFirstWrong) {
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

  const questionId = currentQuestion.questionId;

  // 틀린 문제 처리: 이미 틀린 적이 있는 문제는 재시도 횟수만 유지, 새로 틀린 문제는 2회 재시도 설정
  if (!wrongQuestionsMap.has(questionId)) {
    wrongQuestionsMap.set(questionId, 2); // 2번 다시 풀어야 함
    currentQuestion.isFirstWrong = true;

    // 최대 문제 수 한도 내에서만 재출제 문제 추가
    if (totalCount < maxQuestionsLimit) {
      const remainingSlots = maxQuestionsLimit - totalCount;
      const questionsToAdd = Math.min(2, remainingSlots);
      
      for (let i = 0; i < questionsToAdd; i++) {
        // 큐의 랜덤한 위치에 삽입
        const retryQuestion = {
          ...currentQuestion,
          isRetry: true,
          questionId: questionId
        };
        
        if (queue.length === 0) {
          queue.push(retryQuestion);
        } else {
          const randomIndex = Math.floor(Math.random() * (queue.length + 1));
          queue.splice(randomIndex, 0, retryQuestion);
        }
      }
      
      totalCount += questionsToAdd;
    }
  }
  
  nextBtn.disabled = false;
  updateProgressBar();
}

nextBtn.addEventListener('click', () => {
  if (nextBtn.disabled) return;
  
  if (extraQueue.length > 0) {
    shuffleInPlace(extraQueue);
    // extraQueue의 문제들을 queue의 랜덤한 위치에 삽입
    extraQueue.forEach(question => {
      if (queue.length === 0) {
        queue.push(question);
      } else {
        const randomIndex = Math.floor(Math.random() * (queue.length + 1));
        queue.splice(randomIndex, 0, question);
      }
    });
    extraQueue = [];
  }
  answeredCount++;
  updateProgressBar();
  showQuestion();
});

// endGame() 함수 수정
function endGame() {
  const elapsedTime = Math.floor((Date.now() - gameStartTime) / 1000);
  localStorage.setItem('results', JSON.stringify({
    score,
    total: totalCount,
    elapsedTime: elapsedTime
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
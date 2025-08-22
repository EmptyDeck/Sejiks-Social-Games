// game.js - last update : add wrong voca + Advanced retry tracking
let settings = JSON.parse(localStorage.getItem('settings') || '{}');
let startIndex = settings.start || 1;
let endIndex = settings.end || vocabList.length;
let mode = settings.lang || 'eng';
let numQuestions = settings.count || 20;
let timeLimit = settings.timeLimit || 3;
let maxQuestionsLimit = settings.maxQuestions || 40;

// Game state
let gameStartTime = Date.now();
let availableWords = vocabList.slice(startIndex - 1, endIndex);
let queue = [];
let score = 0;
let currentQuestion = null;
let timerId = null;
let timeLeft = timeLimit;
let roundToken = 0;

// Advanced retry tracking
let wordProgress = new Map(); // word -> { wrongCount, correctStreak, requiredStreak, mastered }
let mastered = new Set();
let totalQuestionsAnswered = 0;
let wordsMastered = 0;

// UI state
let isLocked = false;
let isRevealed = false;

// TTS
let selectedVoice = null;
let voicesLoaded = false;

// DOM elements
const gameCard = document.getElementById('gameCard');
const optionsContainer = document.getElementById('answerGrid');
const scoreDisplay = document.getElementById('scoreDisplay');
const nextBtnContainer = document.getElementById('nextBtnContainer');
const nextBtn = document.getElementById('nextBtn');
const timerDisplay = document.getElementById('timerDisplay');
const progressBar = document.getElementById('progressBar');
const progressLabel = document.getElementById('progressLabel');

// ================== TTS FUNCTIONS ==================
function loadVoices() {
  const voices = speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return;
  
  voicesLoaded = true;
  const savedVoice = localStorage.getItem("selectedVoice");
  selectedVoice = savedVoice 
    ? voices.find(v => v.name === savedVoice)
    : voices.find(v => v.lang.startsWith('en')) || voices[0];
}

loadVoices();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = loadVoices;
}

function speak(text) {
  // 🚫 Skip if TTS is disabled in settings
  if (!settings.ttsEnabled) return;

  if (!text || typeof text !== 'string') return;
  if (speechSynthesis.speaking) speechSynthesis.cancel();

  const trySpeak = () => {
    if (!voicesLoaded || !selectedVoice) {
      setTimeout(trySpeak, 100);
      return;
    }

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = selectedVoice;
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error("TTS error:", error);
    }
  };

  if (!voicesLoaded) {
    setTimeout(trySpeak, 200);
  } else {
    trySpeak();
  }
}


// ================== WORD PROGRESS MANAGEMENT ==================
function getWordId(word) {
  return `${word.word}_${word.definition}`;
}

function initializeWordProgress(word) {
  const wordId = getWordId(word);
  if (!wordProgress.has(wordId)) {
    wordProgress.set(wordId, {
      wrongCount: 0,
      correctStreak: 0,
      requiredStreak: 2,
      mastered: false,
      word: word
    });
  }
  return wordProgress.get(wordId);
}

function updateWordProgress(word, isCorrect) {
  const progress = initializeWordProgress(word);
  
  if (isCorrect) {
    progress.correctStreak++;
    
    if (progress.correctStreak >= progress.requiredStreak && !progress.mastered) {
      progress.mastered = true;
      mastered.add(getWordId(word));
      wordsMastered++;
      console.log(`Word mastered: ${getWordId(word)}, wordsMastered: ${wordsMastered}`);
      return true;
    }
  } else {
    progress.correctStreak = 0;
    progress.wrongCount++;
    progress.requiredStreak = 2 + progress.wrongCount;
    console.log(`Wrong answer: ${getWordId(word)}, wrongCount: ${progress.wrongCount}, requiredStreak: ${progress.requiredStreak}`);
  }
  
  return false;
}

function manageQueue(word) {
  const progress = wordProgress.get(getWordId(word));
  if (progress.mastered) return;
  
  const wordId = getWordId(word);
  queue = queue.filter(w => getWordId(w) !== wordId);
  
  const toAdd = progress.requiredStreak - progress.correctStreak;
  if (toAdd <= 0) return;
  
  for (let i = 0; i < toAdd; i++) {
    if (queue.length === 0) {
      queue.push(word);
    } else {
      const randomIndex = Math.floor(Math.random() * (queue.length + 1));
      queue.splice(randomIndex, 0, word);
    }
  }
  
  console.log(`Managed queue for ${wordId}: added ${toAdd}, queue.length=${queue.length}`);
}

// ================== GAME LOGIC ==================
function initializeGame() {
  wordProgress.clear();
  mastered.clear();
  wordsMastered = 0;
  totalQuestionsAnswered = 0;
  
  shuffleInPlace(availableWords);
  
  for (let i = 0; i < Math.min(numQuestions, availableWords.length); i++) {
    queue.push(availableWords[i]);
    initializeWordProgress(availableWords[i]);
  }
  
  updateProgressBar();
}

function updateProgressBar() {
  const totalWords = Math.min(availableWords.length, numQuestions);
  const questionsPct = totalQuestionsAnswered > 0 ? Math.round((totalQuestionsAnswered / maxQuestionsLimit) * 50) : 0;
  const wordsPct = totalWords > 0 ? Math.round((wordsMastered / totalWords) * 50) : 0;
  const combinedPct = Math.min(questionsPct + wordsPct, 100);
  
  if (progressBar) progressBar.style.width = `${combinedPct}%`;
  if (progressLabel) {
    let currentStreakText = '';
    if (currentQuestion) {
      const progress = wordProgress.get(getWordId(currentQuestion));
      if (progress) {
        currentStreakText = ` | Current ${progress.correctStreak}/${progress.requiredStreak}`;
      }
    }
    progressLabel.textContent = `Q: ${totalQuestionsAnswered}/${maxQuestionsLimit} | W: ${wordsMastered}/${totalWords}${currentStreakText}`;
  }
}

function updateScoreDisplay() {
  if (!scoreDisplay) return;
  scoreDisplay.textContent = `점수: ${score} | 완료: ${wordsMastered}`;
}

function startTimer(localToken) {
  stopTimer();
  timeLeft = timeLimit;
  if (timerDisplay) timerDisplay.textContent = `${timeLeft}s`;
  
  timerId = setInterval(() => {
    if (localToken !== roundToken) {
      stopTimer();
      return;
    }
    timeLeft -= 1;
    if (timerDisplay) timerDisplay.textContent = `${timeLeft}s`;

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

function isGameOver() {
  return totalQuestionsAnswered >= maxQuestionsLimit || 
         wordsMastered >= Math.min(availableWords.length, numQuestions) || 
         queue.length === 0;
}

function showGameQuestion() {
  if (isGameOver()) {
    endGame();
    return;
  }

  isLocked = false;
  isRevealed = false;
  roundToken++;
  
  currentQuestion = queue.shift();
  
  const questionElement = gameCard?.querySelector('.question');
  if (questionElement) {
    const questionText = mode === 'eng' ? currentQuestion.word : currentQuestion.definition;
    questionElement.textContent = questionText;
    
    setTimeout(() => speak(questionText), 300);
  }

  const allAnswers = availableWords.map(v => mode === 'eng' ? v.definition : v.word);
  const correctAnswer = mode === 'eng' ? currentQuestion.definition : currentQuestion.word;
  const choices = buildChoices(correctAnswer, allAnswers, 5);
  
  if (optionsContainer) {
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
  }

  updateScoreDisplay();
  if (nextBtn) nextBtn.disabled = true;
  startTimer(roundToken);
}

// ================== FIXED PART ==================
function handleAnswer(selected, correct, btn) {
  if (isLocked || isRevealed) return;
  
  console.log(`handleAnswer called: selected=${selected}, correct=${correct}`);
  isLocked = true;
  stopTimer();
  
  const isCorrect = selected === correct;
  
  if (isCorrect) {
    const wasJustMastered = updateWordProgress(currentQuestion, true);
    btn.classList.add('correct');
    score++;
    totalQuestionsAnswered++;
    
    if (wasJustMastered) {
      btn.textContent += " ✓";
    }

    if (optionsContainer) {
      [...optionsContainer.children].forEach(b => { 
        if (b !== btn) b.disabled = true; 
      });
    }

    if (!wasJustMastered) {
      manageQueue(currentQuestion);
    }

    updateProgressBar();
    updateScoreDisplay();

    setTimeout(() => {
      showGameQuestion();
    }, 800);

  } else {
    // ❌ 오답일 경우에는 여기서 updateWordProgress, manageQueue 호출하지 않음
    handleWrong(btn, correct);
  }
}

function handleWrong(btn, correct) {
  if (isLocked && isRevealed) return;
  
  console.log(`handleWrong called: correct=${correct}, btn=${!!btn}`);
  stopTimer();
  isLocked = true;
  isRevealed = true;
  
  if (!correct && currentQuestion) {
    correct = (mode === 'eng') ? currentQuestion.definition : currentQuestion.word;
  }
  
  if (btn) btn.classList.add('wrong');
  
  if (optionsContainer) {
    [...optionsContainer.children].forEach(optionBtn => {
      optionBtn.disabled = true;
      if (optionBtn.textContent === correct) {
        optionBtn.classList.add('correct');
      }
    });
  }

  // ✅ 오답은 여기서만 처리
  if (currentQuestion) {
    totalQuestionsAnswered++;
    updateWordProgress(currentQuestion, false);
    manageQueue(currentQuestion);
  }
  
  if (nextBtn) nextBtn.disabled = false;
  updateProgressBar();
  updateScoreDisplay();
}

function endGame() {
  const elapsedTime = Math.floor((Date.now() - gameStartTime) / 1000);
  localStorage.setItem('results', JSON.stringify({
    score,
    total: totalQuestionsAnswered,
    wordsMastered,
    totalWords: Math.min(availableWords.length, numQuestions),
    elapsedTime: elapsedTime
  }));
  
  if (typeof goToPage === 'function') {
    goToPage('results.html');
  } else {
    alert(`Game Over!\nScore: ${score}/${totalQuestionsAnswered}\nWords Mastered: ${wordsMastered}/${Math.min(availableWords.length, numQuestions)}`);
  }
}

// ================== UTILITY FUNCTIONS ==================
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
  while (set.size < size && set.size < pool.length) {
    const rand = pool[Math.floor(Math.random() * pool.length)];
    set.add(rand);
  }
  const result = Array.from(set);
  shuffleInPlace(result);
  return result;
}

// ================== EVENT LISTENERS ==================
window.addEventListener("DOMContentLoaded", () => {
  initializeGame();
  setTimeout(() => showGameQuestion(), 500);
});

if (nextBtn) {
  nextBtn.addEventListener('click', () => {
    if (nextBtn.disabled) return;
    showGameQuestion();
  });
}
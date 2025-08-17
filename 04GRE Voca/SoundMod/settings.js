// settings.js
// Elements
const startRange = document.getElementById('startRange');
const endRange = document.getElementById('endRange');
const startLabel = document.getElementById('startLabel');
const endLabel = document.getElementById('endLabel');
const questionCountEl = document.getElementById('questionCount');
const timeLimitEl = document.getElementById('timeLimit');
const maxQuestionsLimitEl = document.getElementById('maxQuestionsLimit');
const langToggle = document.getElementById('langToggle');
const startGameBtn = document.getElementById('startGameBtn');
const rangeHighlight = document.getElementById('rangeHighlight');
const unlimitedModeToggle = document.getElementById('unlimitedModeToggle');

let langMode = 'eng';
let questionCount = 20;
let timeLimitVal = 3;       // 1 ~ 60
let maxQuestionsVal = 40;   // 10 ~ 100 or unlimited
let isUnlimitedMode = false;

const MIN_WORD = 1;
const MAX_WORD = 2505;

// Load saved settings or defaults
function loadSettings() {
  const settings = JSON.parse(localStorage.getItem('settings') || '{}');

  const start = clamp(settings.start ?? 1, MIN_WORD, MAX_WORD);
  const end = clamp(settings.end ?? 20, MIN_WORD, MAX_WORD);
  const normalized = normalizeRange(start, end);

  startRange.value = normalized.start;
  endRange.value = normalized.end;
  startLabel.textContent = normalized.start;
  endLabel.textContent = normalized.end;

  if (settings.count) questionCount = clamp(settings.count, 1, MAX_WORD);
  questionCountEl.textContent = questionCount;

  if (settings.lang) {
    langMode = settings.lang;
    langToggle.querySelectorAll('.toggle-option').forEach(opt => {
      opt.classList.toggle('active', opt.dataset.value === langMode);
    });
  }

  timeLimitVal = clamp(settings.timeLimit ?? 3, 1, 60);
  timeLimitEl.textContent = timeLimitVal;

  // Load unlimited mode setting
  isUnlimitedMode = settings.unlimitedMode ?? false;
  if (isUnlimitedMode) {
    maxQuestionsVal = 9999999999999999; // Use -1 to represent unlimited
    maxQuestionsLimitEl.textContent = '무제한';
    unlimitedModeToggle.classList.add('active');
  } else {
    maxQuestionsVal = clamp(settings.maxQuestions ?? 40, 10, 100);
    maxQuestionsLimitEl.textContent = maxQuestionsVal;
    unlimitedModeToggle.classList.remove('active');
  }

  updateVerticalHighlight();
  updateMaxQuestionsControls();
}

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

function normalizeRange(s, e) {
  if (s > e) [s, e] = [e, s];
  s = clamp(s, MIN_WORD, MAX_WORD);
  e = clamp(e, MIN_WORD, MAX_WORD);
  return { start: s, end: e };
}

// Update labels and keep range consistent
function updateRangeFromInputs() {
  let s = parseInt(startRange.value);
  let e = parseInt(endRange.value);

  s = clamp(s, MIN_WORD, MAX_WORD);
  e = clamp(e, MIN_WORD, MAX_WORD);

  startRange.value = s;
  endRange.value = e;
  startLabel.textContent = s;
  endLabel.textContent = e;

  updateVerticalHighlight();
}

function updateVerticalHighlight() {
  // 계산: 위가 max, 아래가 min이 되도록 수직 방향 비율
  const total = MAX_WORD - MIN_WORD;
  const s = parseInt(startRange.value);
  const e = parseInt(endRange.value);

  const topPercent = ((MAX_WORD - e) / total) * 100;
  const bottomPercent = ((MAX_WORD - s) / total) * 100;
  
  // rangeHighlight를 부모(.vertical-range) 기준 절대 위치
  rangeHighlight.style.top = `${topPercent}%`;
  rangeHighlight.style.height = `${Math.max(2, bottomPercent - topPercent)}%`;
}

function updateMaxQuestionsControls() {
  const maxQuestionsControls = document.querySelector('[data-target="maxQuestionsLimit"]');
  if (maxQuestionsControls) {
    if (isUnlimitedMode) {
      maxQuestionsControls.style.opacity = '0.5';
      maxQuestionsControls.style.pointerEvents = 'none';
    } else {
      maxQuestionsControls.style.opacity = '1';
      maxQuestionsControls.style.pointerEvents = 'auto';
    }
  }
}

// Toggle language
langToggle.querySelectorAll('.toggle-option').forEach(opt => {
  opt.addEventListener('click', () => {
    langToggle.querySelectorAll('.toggle-option').forEach(o => o.classList.remove('active'));
    opt.classList.add('active');
    langMode = opt.dataset.value;
  });
});

// Unlimited mode toggle
if (unlimitedModeToggle) {
  unlimitedModeToggle.addEventListener('click', () => {
    isUnlimitedMode = !isUnlimitedMode;
    unlimitedModeToggle.classList.toggle('active', isUnlimitedMode);
    
    if (isUnlimitedMode) {
      maxQuestionsLimitEl.textContent = '무제한';
    } else {
      maxQuestionsVal = 40; // Reset to default
      maxQuestionsLimitEl.textContent = maxQuestionsVal;
    }
    
    updateMaxQuestionsControls();
  });
}

// Count controls (공용 핸들러)
document.querySelectorAll('.count-controls').forEach(group => {
  const targetId = group.dataset.target;
  const valueEl = document.getElementById(targetId);

  group.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (isUnlimitedMode && targetId === 'maxQuestionsLimit') {
        return; // Don't allow changes in unlimited mode
      }
      
      const delta = parseInt(btn.dataset.change);
      
      if (targetId === 'questionCount') {
        questionCount = clamp(questionCount + delta, 1, MAX_WORD);
        valueEl.textContent = questionCount;
      } else if (targetId === 'timeLimit') {
        timeLimitVal = clamp(timeLimitVal + delta, 1, 60);
        valueEl.textContent = timeLimitVal;
      } else if (targetId === 'maxQuestionsLimit') {
        maxQuestionsVal = clamp(maxQuestionsVal + delta, 10, 100);
        valueEl.textContent = maxQuestionsVal;
      }
    });
  });
});

// Vertical dual range events
startRange.addEventListener('input', updateRangeFromInputs);
endRange.addEventListener('input', updateRangeFromInputs);

// Save settings and validate
startGameBtn.addEventListener('click', () => {
  let startVal = parseInt(startRange.value);
  let endVal = parseInt(endRange.value);

  if (startVal > endVal) {
    alert('최소 시작 번호는 최대 끝 번호보다 클 수 없습니다.');
    return;
  }

  const settings = {
    start: clamp(startVal, MIN_WORD, MAX_WORD),
    end: clamp(endVal, MIN_WORD, MAX_WORD),
    lang: langMode,
    count: clamp(questionCount, 1, MAX_WORD),
    timeLimit: clamp(timeLimitVal, 1, 60),
    maxQuestions: isUnlimitedMode ? 99999 : clamp(maxQuestionsVal, 10, 100),
    unlimitedMode: isUnlimitedMode,
  };

  localStorage.setItem('settings', JSON.stringify(settings));
  goToPage('game.html');
});

// Initialize range values on DOM load
document.addEventListener('DOMContentLoaded', () => {
  // 초기 값 설정
  if (startRange && endRange) {
    startRange.value = 1;
    endRange.value = Math.round(endRange.value / 10) * 10 || 20;
    startLabel.textContent = startRange.value;
    endLabel.textContent = endRange.value;

    startRange.addEventListener('input', () => {
      let value = parseInt(startRange.value);
      if (value !== 1) {
        value = Math.round(value / 10) * 10;
      }
      startRange.value = value;
      startLabel.textContent = value;
      if (value > parseInt(endRange.value)) {
        endRange.value = value;
        endLabel.textContent = value;
      }
    });

    endRange.addEventListener('input', () => {
      let value = parseInt(endRange.value);
      value = Math.min(Math.round(value / 10) * 10, 2505);
      endRange.value = value;
      endLabel.textContent = value;
      if (value < parseInt(startRange.value)) {
        startRange.value = value;
        startLabel.textContent = value;
      }
    });
  }
});

// 직접 입력 기능
document.querySelectorAll('.clickable-input').forEach(element => {
  element.addEventListener('click', function() {
    if (this.classList.contains('editing')) return;
    
    // Don't allow editing max questions in unlimited mode
    const type = this.dataset.type || this.dataset.input;
    if (isUnlimitedMode && type === 'maxQuestionsLimit') return;
    
    const currentValue = this.textContent === '무제한' ? '40' : this.textContent;
    const input = document.createElement('input');
    input.type = 'number';
    input.className = 'direct-input';
    input.value = currentValue;
    
    // 범위 설정
    if (type === 'startRange' || type === 'endRange') {
      input.min = 1;
      input.max = 2505;
    } else if (type === 'questionCount') {
      input.min = 1;
      input.max = 2505;
    } else if (type === 'timeLimit') {
      input.min = 1;
      input.max = 60;
    } else if (type === 'maxQuestionsLimit') {
      input.min = 10;
      input.max = 100;
    }
    
    this.classList.add('editing');
    const originalText = this.textContent;
    this.textContent = '';
    this.appendChild(input);
    input.focus();
    input.select();
    
    const finishEditing = () => {
      const newValue = parseInt(input.value);
      this.classList.remove('editing');
      this.removeChild(input);
      
      if (isNaN(newValue) || newValue < parseInt(input.min) || newValue > parseInt(input.max)) {
        this.textContent = originalText;
        return;
      }
      
      this.textContent = newValue;
      
      // 값 업데이트
      if (type === 'startRange') {
        startRange.value = newValue;
        updateRangeFromInputs();
      } else if (type === 'endRange') {
        endRange.value = newValue;
        updateRangeFromInputs();
      } else if (type === 'questionCount') {
        questionCount = newValue;
      } else if (type === 'timeLimit') {
        timeLimitVal = newValue;
      } else if (type === 'maxQuestionsLimit') {
        maxQuestionsVal = newValue;
      }
    };
    
    input.addEventListener('blur', finishEditing);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        finishEditing();
      } else if (e.key === 'Escape') {
        this.classList.remove('editing');
        this.removeChild(input);
        this.textContent = originalText;
      }
    });
  });
});

// TTS Voice Selection
document.addEventListener("DOMContentLoaded", () => {
  const voiceSelect = document.getElementById("voiceSelect");
  if (!voiceSelect) return;

  const savedVoice = localStorage.getItem("selectedVoice");

  function populateVoices() {
    const voices = speechSynthesis.getVoices();
    voiceSelect.innerHTML = "";

    voices.forEach((voice) => {
      const option = document.createElement("option");
      option.value = voice.name;
      option.textContent = `${voice.name} (${voice.lang})`;
      if (voice.name === savedVoice) {
        option.selected = true;
      }
      voiceSelect.appendChild(option);
    });
  }

  populateVoices();
  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoices;
  }

  voiceSelect.addEventListener("change", () => {
    localStorage.setItem("selectedVoice", voiceSelect.value);
  });
});

// Load initial settings
loadSettings();
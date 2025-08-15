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

let langMode = 'eng';
let questionCount = 20;
let timeLimitVal = 3;       // 1 ~ 60
let maxQuestionsVal = 40;   // 10 ~ 100

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

  maxQuestionsVal = clamp(settings.maxQuestions ?? 40, 10, 100);
  maxQuestionsLimitEl.textContent = maxQuestionsVal;

  updateVerticalHighlight();
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
  
  // if (s > e) s = e;
  // if (e < s) e = s;

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

// Toggle language
langToggle.querySelectorAll('.toggle-option').forEach(opt => {
  opt.addEventListener('click', () => {
    langToggle.querySelectorAll('.toggle-option').forEach(o => o.classList.remove('active'));
    opt.classList.add('active');
    langMode = opt.dataset.value;
  });
});

// Count controls (공용 핸들러)
document.querySelectorAll('.count-controls').forEach(group => {
  const targetId = group.dataset.target;
  const valueEl = document.getElementById(targetId);

  group.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // vibrate(); // common.js에 vibrate() 함수가 정의되어있다고 가정
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
startRange.addEventListener('input', () => {
  // lower thumb은 항상 upper 이하
  // if (parseInt(startRange.value) > parseInt(endRange.value)) {
  //   startRange.value = endRange.value;
  // }
  updateRangeFromInputs();
});

endRange.addEventListener('input', () => {
  // upper thumb은 항상 lower 이상
  // if (parseInt(endRange.value) < parseInt(startRange.value)) {
  //   endRange.value = startRange.value;
  // }
  updateRangeFromInputs();
});

// Save settings and validate
startGameBtn.addEventListener('click', () => {
  // vibrate(); // common.js에 vibrate() 함수가 정의되어있다고 가정
  let startVal = parseInt(startRange.value);
  let endVal = parseInt(endRange.value);

  // 이 검증 로직은 input 이벤트를 통해 이미 처리되었으므로 불필요할 수 있지만,
  // 혹시 모를 상황을 대비해 유지
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
    maxQuestions: clamp(maxQuestionsVal, 10, 100),
  };

  localStorage.setItem('settings', JSON.stringify(settings));
  goToPage('game.html'); // common.js에 goToPage() 함수가 정의되어있다고 가정
});
document.addEventListener('DOMContentLoaded', () => {
  const startRange = document.getElementById('startRange');
  const endRange = document.getElementById('endRange');
  const startLabel = document.getElementById('startLabel');
  const endLabel = document.getElementById('endLabel');

  // 초기 값 설정
  startRange.value = 1; // 시작 값은 1
  endRange.value = Math.round(endRange.value / 10) * 10 || 20; // 끝 값은 10의 배수
  startLabel.textContent = startRange.value;
  endLabel.textContent = endRange.value;

  startRange.addEventListener('input', () => {
    let value = parseInt(startRange.value);
    // 시작 값이 1이거나 10의 배수로 조정
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
    // 끝 값은 10의 배수로 조정, 최대 2505 허용
    value = Math.min(Math.round(value / 10) * 10, 2505);
    endRange.value = value;
    endLabel.textContent = value;
    if (value < parseInt(startRange.value)) {
      startRange.value = value;
      startLabel.textContent = value;
    }
  });
});

// 직접 입력 기능
document.querySelectorAll('.clickable-input').forEach(element => {
  element.addEventListener('click', function() {
    if (this.classList.contains('editing')) return;
    
    const currentValue = this.textContent;
    const input = document.createElement('input');
    input.type = 'number';
    input.className = 'direct-input';
    input.value = currentValue;
    
    // 범위 설정
    const type = this.dataset.type || this.dataset.input;
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

// 초기 설정 불러오기
loadSettings();
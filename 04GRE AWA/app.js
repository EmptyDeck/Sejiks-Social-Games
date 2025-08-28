// // 단어 타이핑 연습 - 크롬/브라우저 내장 TTS 사용
// // 파일: app.js (index.html, styles.css와 같은 폴더)

// // ------------ 요소 선택 ------------
// const wordInput = document.getElementById('wordInput');
// const btnStart = document.getElementById('btnStart');
// const btnReset = document.getElementById('btnReset');
// const showDebug = document.getElementById('showDebug');

// const voiceSelect = document.getElementById('voiceSelect');
// const rateRange = document.getElementById('rateRange');
// const pitchRange = document.getElementById('pitchRange');
// const rateVal = document.getElementById('rateVal');
// const pitchVal = document.getElementById('pitchVal');
// const btnReplay = document.getElementById('btnReplay');

// const remainingCount = document.getElementById('remainingCount');
// const progressBar = document.getElementById('progressBar');
// const answerForm = document.getElementById('answerForm');
// const answerInput = document.getElementById('answerInput');
// const feedback = document.getElementById('feedback');
// const debugWord = document.getElementById('debugWord');
// const doneList = document.getElementById('doneList');

// // ------------ 상태 ------------
// let words = [];       // 원본 단어 목록
// let stack = [];       // 실제 출제 스택
// let totalCount = 0;   // 학습 대상 단어 수
// let current = null;   // 현재 출제 중인 단어
// let started = false;
// let voices = [];      // TTS 음성 목록

// // ------------ 유틸 ------------
// function normalize(str) {
//   return (str||'')
//     .replace(/[‘’´`]/g,"'")
//     .replace(/[“”]/g,'"')
//     .replace(/\s+/g,' ')
//     .trim()
//     .toLowerCase();
// }

// function shuffle(arr) {
//   for (let i = arr.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [arr[i], arr[j]] = [arr[j], arr[i]];
//   }
//   return arr;
// }

// // ------------ UI 업데이트 ------------
// function updateUI() {
//   remainingCount.textContent = stack.length;
//   const progress = totalCount === 0 ? 0 : Math.round(((totalCount - stack.length) / totalCount) * 100);
//   progressBar.style.width = `${progress}%`;

//   if (showDebug.checked && current) {
//     debugWord.textContent = `현재 단어: "${current.text}" [연속정답:${current.streak}/${current.required}]`;
//     debugWord.classList.remove('hidden');
//   } else {
//     debugWord.classList.add('hidden');
//   }
// }

// function addDone(text) {
//   const li = document.createElement('li');
//   li.textContent = text;
//   doneList.appendChild(li);
// }

// // ------------ TTS ------------
// function loadVoices() {
//   voices = window.speechSynthesis.getVoices();
//   voiceSelect.innerHTML = '';
//   const sorted = voices.slice().sort((a,b)=>{
//     const ea = a.lang.startsWith('en') ? 0 : 1;
//     const eb = b.lang.startsWith('en') ? 0 : 1;
//     if (ea !== eb) return ea - eb;
//     return a.name.localeCompare(b.name);
//   });
//   sorted.forEach((v, idx)=>{
//     const opt = document.createElement('option');
//     opt.value = idx;
//     opt.textContent = `${v.name} (${v.lang})${v.default ? ' — 기본' : ''}`;
//     voiceSelect.appendChild(opt);
//   });
//   voiceSelect.selectedIndex = sorted.findIndex(v=>v.default) >=0 ? sorted.findIndex(v=>v.default) : 0;
// }

// function speak(text) {
//   if (!('speechSynthesis' in window)) return;
//   window.speechSynthesis.cancel();
//   const u = new SpeechSynthesisUtterance(text);
//   const chosen = voices[voiceSelect.selectedIndex];
//   if (chosen) {
//     u.voice = chosen;
//     u.lang = chosen.lang || 'en-US';
//   } else {
//     u.lang = 'en-US';
//   }
//   u.rate = parseFloat(rateRange.value || '1');
//   u.pitch = parseFloat(pitchRange.value || '1');
//   window.speechSynthesis.speak(u);
// }

// // ------------ 문제 출제 흐름 ------------
// function nextWord() {
//   if (!started) return;

//   if (stack.length === 0) {
//     started = false;
//     answerInput.disabled = true;
//     feedback.className = 'feedback ok';
//     feedback.textContent = '모든 단어 완료! 🎉';
//     updateUI();
//     return;
//   }

//   // 스택에서 랜덤으로 꺼내기
//   const idx = Math.floor(Math.random() * stack.length);
//   current = stack[idx];

//   speak(current.text);
//   updateUI();
// }

// // ------------ 세션 시작 ------------
// function startSession() {
//   const lines = wordInput.value.split(/\r?\n/).map(l=>l.trim()).filter(l=>l.length>0);
//   const uniq = [];
//   const seen = new Set();
//   for (const l of lines) {
//     const key = normalize(l);
//     if (!seen.has(key)) {
//       seen.add(key);
//       uniq.push(l);
//     }
//   }

//   words = uniq;
//   stack = words.map(w=>({ text:w, streak:0, required:2 }));
//   totalCount = stack.length;
//   doneList.innerHTML = '';
//   current = null;
//   started = true;
//   answerInput.disabled = false;
//   answerInput.value = '';
//   feedback.className = 'feedback';
//   feedback.textContent = '';
//   shuffle(stack);
//   updateUI();
//   nextWord();
// }

// // ------------ 오답 처리 ------------
// function handleWrong(word) {
//   console.log('--- handleWrong 호출 ---');
//   console.log('현재 스택 길이:', stack.length);
//   console.log('틀린 단어:', word.text, '이전 required:', word.required);

//   // 스택에서 해당 단어 모두 제거
//   stack = stack.filter(w => w !== word);
//   console.log('스택에서 제거 후 길이:', stack.length);

//   // required 증가
//   word.required = (word.required || 2) + 1;
//   console.log('required 증가 후:', word.required);

//   // 늘어난 required만큼 다시 스택에 랜덤 삽입
//   for (let i = 0; i < word.required; i++) {
//     const insertIdx = Math.floor(Math.random() * (stack.length + 1));
//     stack.splice(insertIdx, 0, word);
//     console.log(`스택에 추가 #${i + 1} 위치: ${insertIdx}, 현재 스택 길이: ${stack.length}`);
//   }

//   console.log('최종 스택 상태:', stack.map(w => w.text));

//   feedback.className = 'feedback bad';
//   feedback.textContent = `틀렸습니다. 다시 ${word.required}번 맞춰야 완료합니다.`;
//   answerInput.value = '';
//   answerInput.focus();

//   //nextWord();
// }


// // ------------ 정답 처리 ------------
// function handleCorrect(word) {
//   console.log('--- handleCorrect 호출 ---', word.text);
  
//   // 스택에서 동일 text를 가진 모든 객체 제거
//   stack = stack.filter(w => w.text !== word.text);
//   console.log('스택에서 제거 후 길이:', stack.length);

//   // required만큼 새 객체 삽입
//   for (let i = 0; i < word.required; i++) {
//     stack.push({ text: word.text, streak: 0, required: word.required });
//   }

//   addDone(word.text);
//   feedback.className = 'feedback ok';
//   feedback.textContent = `정답! "${word.text}" 완료 ✅`;

//   answerInput.value = '';
//   answerInput.focus();
//   nextWord();
// }



// // ------------ 제출 이벤트 ------------
// answerForm.addEventListener('submit', (e) => {
//   e.preventDefault();
//   if (!started || !current) return;

//   const guess = normalize(answerInput.value);
//   const target = normalize(current.text);

//   if (!current.triedWrong) current.triedWrong = false;
//   if (!current.confirmed) current.confirmed = false;

//   if (!current.triedWrong) {
//     // 첫 틀림
//     if (guess === target) {
//       handleCorrect(current); // 바로 맞은 경우
//     } else {
//       handleWrong(current);
//       current.triedWrong = true;
//       current.confirmed = true;
//       feedback.textContent = `틀렸습니다. 정답: "${current.text}" 정확히 다시 입력하세요.`;
//       answerInput.value = '';
//       answerInput.focus();
//       speak(current.text); // 틀린 직후 다시 TTS
//     }
//   } else if (current.confirmed) {
//     // 사용자가 정답 확인 후 다시 입력하는 단계
//     if (guess === target) {
//       // 맞았지만 아직 스택 조작 X
//       current.confirmed = false; 
//       current.triedWrong = false;
//       feedback.textContent = '잘 했습니다! 이번에는 눈으로 확인하지 않고 작성했습니다. 다시 TTS로 확인하세요.';
//       answerInput.value = '';
//       answerInput.focus();
//       speak(current.text); // TTS로 다시 읽어줌
//     } else {
//       feedback.textContent = `다시 입력하세요. 정답: "${current.text}"`;
//       answerInput.value = '';
//       answerInput.focus();
//       speak(current.text); // 다시 틀리면 TTS
//     }
//   } else {
//     // 최종 단계: 정확히 다시 입력 후 맞았을 때
//     if (guess === target) {
//       // 스택 제거 / 랜덤 재삽입 로직
//       nextWord();
//     } else {
//       feedback.textContent = `다시 입력하세요. 정답: "${current.text}"`;
//       answerInput.value = '';
//       answerInput.focus();
//       speak(current.text); // 틀리면 TTS
//     }
//   }
// });




// // ------------ 버튼 이벤트 ------------
// btnStart.addEventListener('click', startSession);
// btnReset.addEventListener('click', ()=>{
//   window.speechSynthesis.cancel();
//   started = false;
//   words = [];
//   stack = [];
//   totalCount = 0;
//   current = null;
//   doneList.innerHTML = '';
//   answerInput.value = '';
//   answerInput.disabled = true;
//   feedback.className = 'feedback';
//   feedback.textContent = '';
//   remainingCount.textContent = '0';
//   progressBar.style.width = '0%';
//   debugWord.classList.add('hidden');
// });
// btnReplay.addEventListener('click', ()=>{ if(current) speak(current.text); });

// // ------------ 키보드 단축 ------------
// document.addEventListener('keydown', (e)=>{
//   if (e.key==='Escape' && current) { e.preventDefault(); speak(current.text); }
// });

// // ------------ TTS 음성 로딩 ------------
// if ('speechSynthesis' in window) {
//   speechSynthesis.onvoiceschanged = loadVoices;
//   setTimeout(loadVoices, 150);
// }

// // ------------ 슬라이더 표시 ------------
// rateRange.addEventListener('input', ()=>{ rateVal.textContent = rateRange.value; });
// pitchRange.addEventListener('input', ()=>{ pitchVal.textContent = pitchRange.value; });

// // ------------ 시작 시 설정 ------------
// window.addEventListener('load', ()=>{
//   answerInput.disabled = true;
//   answerInput.placeholder = '먼저 단어 목록을 입력하고 "시작"을 누르세요';
// });
// 단어 타이핑 연습 - 크롬/브라우저 내장 TTS 사용
// 파일: app.js (index.html, styles.css와 같은 폴더)

// ------------ 요소 선택 ------------
const wordInput = document.getElementById('wordInput');
const btnStart = document.getElementById('btnStart');
const btnReset = document.getElementById('btnReset');
const showDebug = document.getElementById('showDebug');

const voiceSelect = document.getElementById('voiceSelect');
const rateRange = document.getElementById('rateRange');
const pitchRange = document.getElementById('pitchRange');
const rateVal = document.getElementById('rateVal');
const pitchVal = document.getElementById('pitchVal');
const btnReplay = document.getElementById('btnReplay');

const remainingCount = document.getElementById('remainingCount');
const progressBar = document.getElementById('progressBar');
const answerForm = document.getElementById('answerForm');
const answerInput = document.getElementById('answerInput');
const feedback = document.getElementById('feedback');
const debugWord = document.getElementById('debugWord');
const doneList = document.getElementById('doneList');

// ------------ 상태 ------------
let words = [];      // 원본 단어 객체 목록 {text, incorrectCount}
let stack = [];      // 실제 출제 스택 (word 객체 참조 포함)
let totalCount = 0;  // 학습 대상 유니크 단어 수
let current = null;  // 현재 출제 중인 단어
let started = false;
let voices = [];     // TTS 음성 목록

// [수정] 연습 모드를 위한 명확한 상태 변수 추가
let inPracticeMode = false;
let practiceWord = null;
let practiceStep = null; // 'show' 또는 'hide'

// ------------ 유틸 ------------
function normalize(str) {
  return (str||'')
    .replace(/[‘’´`]/g,"'")
    .replace(/[“”]/g,'"')
    .replace(/\s+/g,' ')
    .trim()
    .toLowerCase();
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ------------ UI 업데이트 ------------
// [수정] 진행률 계산 방식 및 디버그 메시지 변경
function updateUI() {
  remainingCount.textContent = stack.length;

  // 학습해야 할 전체 단어 수(totalCount) 대비 완료된 단어 수로 진행률 계산
  const remainingWords = new Set(stack.map(w => w.text));
  const masteredCount = totalCount - remainingWords.size;
  const progress = totalCount === 0 ? 0 : Math.round((masteredCount / totalCount) * 100);
  progressBar.style.width = `${progress}%`;

  if (showDebug.checked && current) {
    const countInStack = stack.filter(w => w.text === current.text).length;
    debugWord.textContent = `현재 단어: "${current.text}" [틀린 횟수: ${current.incorrectCount}, 스택 잔여: ${countInStack}]`;
    debugWord.classList.remove('hidden');
  } else {
    debugWord.classList.add('hidden');
  }
}

function addDone(text) {
  const li = document.createElement('li');
  li.textContent = text;
  doneList.appendChild(li);
}

// ------------ TTS ------------
function loadVoices() {
  voices = window.speechSynthesis.getVoices();
  voiceSelect.innerHTML = '';
  const sorted = voices.slice().sort((a,b)=>{
    const ea = a.lang.startsWith('en') ? 0 : 1;
    const eb = b.lang.startsWith('en') ? 0 : 1;
    if (ea !== eb) return ea - eb;
    return a.name.localeCompare(b.name);
  });
  sorted.forEach((v, idx)=>{
    const opt = document.createElement('option');
    opt.value = idx;
    opt.textContent = `${v.name} (${v.lang})${v.default ? ' — 기본' : ''}`;
    voiceSelect.appendChild(opt);
  });
  voiceSelect.selectedIndex = sorted.findIndex(v=>v.default) >=0 ? sorted.findIndex(v=>v.default) : 0;
}

function speak(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  const chosen = voices[voiceSelect.selectedIndex];
  if (chosen) {
    u.voice = chosen;
    u.lang = chosen.lang || 'en-US';
  } else {
    u.lang = 'en-US';
  }
  u.rate = parseFloat(rateRange.value || '1');
  u.pitch = parseFloat(pitchRange.value || '1');
  window.speechSynthesis.speak(u);
}

// ------------ 문제 출제 흐름 ------------
function nextWord() {
  if (!started) return;

  if (stack.length === 0) {
    started = false;
    answerInput.disabled = true;
    feedback.className = 'feedback ok';
    feedback.textContent = '모든 단어 완료! 🎉';
    current = null;
    updateUI();
    return;
  }

  // 스택에서 랜덤으로 단어 하나를 선택
  const idx = Math.floor(Math.random() * stack.length);
  current = stack[idx];

  speak(current.text);
  updateUI();
}

// ------------ 세션 시작 ------------
// [수정] 초기 스택 생성 로직 변경
function startSession() {
  const lines = wordInput.value.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  
  // 각 단어에 대한 고유 객체를 생성하여 틀린 횟수를 관리
  const wordObjects = new Map();
  const seen = new Set();
  for (const line of lines) {
    const key = normalize(line);
    if (!seen.has(key)) {
      seen.add(key);
      wordObjects.set(key, {
        text: line,
        incorrectCount: 0
      });
    }
  }

  words = Array.from(wordObjects.values());
  
  // 규칙 1: 한 단어마다 2개씩 스택에 추가
  stack = [];
  words.forEach(wordObj => {
    stack.push(wordObj, wordObj); // 각 단어 객체의 참조를 2번씩 넣음
  });

  totalCount = words.length; // 전체 진행률의 기준은 유니크한 단어의 개수
  doneList.innerHTML = '';
  current = null;
  started = true;
  
  // 상태 초기화
  inPracticeMode = false;
  practiceWord = null;
  practiceStep = null;

  answerInput.disabled = false;
  answerInput.value = '';
  feedback.className = 'feedback';
  feedback.textContent = '';
  shuffle(stack);
  
  nextWord();
}

// ------------ 정답 처리 ------------
// [수정] 요구사항에 맞게 로직 단순화
function handleCorrect(word) {
  // 규칙 2: 맞출 때마다 스택에서 해당 단어 '한 개' 삭제
  const indexToRemove = stack.indexOf(word);
  if (indexToRemove > -1) {
    stack.splice(indexToRemove, 1);
  }

  answerInput.value = '';
  feedback.className = 'feedback ok';
  feedback.textContent = '정답!';

  // 스택에 해당 단어가 더 이상 없으면 완료 처리
  const isWordDone = !stack.some(item => item.text === word.text);
  if (isWordDone) {
    feedback.textContent = `"${word.text}" 완료! ✅`;
    addDone(word.text);
  }

  // 바로 다음 문제로 넘어감
  nextWord();
}

// ------------ 오답 처리 ------------
// [수정] 요구사항에 맞게 스택 조작 로직 구현
function handleWrong(word) {
  // 규칙 3: 틀릴 때마다...
  // 1. 해당 단어의 오답 횟수 증가
  word.incorrectCount++;

  // 2. 스택에서 해당 단어 모두 삭제
  stack = stack.filter(item => item.text !== word.text);

  // 3. (2 + 누적 틀린 횟수)만큼 다시 스택에 추가
  const timesToAdd = 2 + word.incorrectCount;
  for (let i = 0; i < timesToAdd; i++) {
    const insertIdx = Math.floor(Math.random() * (stack.length + 1));
    stack.splice(insertIdx, 0, word);
  }
}

// ------------ 제출 이벤트 ------------
// [수정] '듣고 쓰기' 단계 실패 시, 다시 '보고 쓰기' 단계로 돌아가도록 로직 변경
answerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!started || (!current && !inPracticeMode)) return;

  const guess = normalize(answerInput.value);

  // --- 연습 모드 로직 ---
  if (inPracticeMode) {
    const practiceTarget = normalize(practiceWord.text);

    if (guess === practiceTarget) {
      // --- 연습 중 정답을 맞춘 경우 ---
      if (practiceStep === 'show') {
        // '보고 쓰기' 성공 -> '듣고 쓰기' 단계로 전환
        practiceStep = 'hide';
        feedback.textContent = '좋아요! 이제 듣고 다시 입력하세요.';
        answerInput.value = '';
        speak(practiceWord.text);
      } else if (practiceStep === 'hide') {
        // '듣고 쓰기' 최종 성공 -> 연습 모드 종료
        inPracticeMode = false;
        practiceWord = null;
        practiceStep = null;
        feedback.textContent = '연습 완료! 다음 문제로 넘어갑니다.';
        answerInput.value = '';
        nextWord();
      }
    } else {
      // --- 연습 중 틀린 경우 ---
      if (practiceStep === 'show') {
        // '보고 쓰기' 단계에서 틀리면, 계속 해당 단계를 유지하며 정답을 보여줌
        speak(practiceWord.text);
        feedback.textContent = `다시 정확히 입력하세요: "${practiceWord.text}"`;
        answerInput.select();
      } else if (practiceStep === 'hide') {
        // ✨ 여기가 핵심 수정사항입니다!
        // '듣고 쓰기' 단계에서 틀리면, 다시 '보고 쓰기' 단계로 되돌림
        practiceStep = 'show'; // 상태를 'show'로 변경
        speak(practiceWord.text);
        feedback.textContent = `틀렸습니다. 정답은 "${practiceWord.text}" 입니다. 보고 다시 입력하세요.`;
        answerInput.select();
      }
    }
    return;
  }

  // --- 일반 모드 로직 ---
  const target = normalize(current.text);

  if (guess === target) {
    handleCorrect(current);
  } else {
    const wrongWord = current;
    handleWrong(wrongWord);
    
    inPracticeMode = true;
    practiceWord = wrongWord;
    practiceStep = 'show';

    feedback.className = 'feedback bad';
    feedback.textContent = `틀렸습니다. 정답은 "${wrongWord.text}" 입니다. 보고 따라 입력하세요.`;
    answerInput.value = '';
    speak(wrongWord.text);
  }
  answerInput.focus();
});


// ------------ 버튼 이벤트 ------------
btnStart.addEventListener('click', startSession);
btnReset.addEventListener('click', ()=>{
  window.speechSynthesis.cancel();
  started = false;
  words = [];
  stack = [];
  totalCount = 0;
  current = null;
  doneList.innerHTML = '';
  answerInput.value = '';
  answerInput.disabled = true;
  feedback.className = 'feedback';
  feedback.textContent = '';
  remainingCount.textContent = '0';
  progressBar.style.width = '0%';
  debugWord.classList.add('hidden');
});
btnReplay.addEventListener('click', ()=>{ 
    if (inPracticeMode) {
        speak(practiceWord.text);
    } else if (current) {
        speak(current.text);
    }
});

// ------------ 키보드 단축 ------------
document.addEventListener('keydown', (e)=>{
  if (e.key === 'Escape') {
      e.preventDefault();
      if (inPracticeMode) speak(practiceWord.text);
      else if (current) speak(current.text);
  }
});

// ------------ TTS 음성 로딩 ------------
if ('speechSynthesis' in window) {
  speechSynthesis.onvoiceschanged = loadVoices;
  setTimeout(loadVoices, 150);
}

// ------------ 슬라이더 표시 ------------
rateRange.addEventListener('input', ()=>{ rateVal.textContent = rateRange.value; });
pitchRange.addEventListener('input', ()=>{ pitchVal.textContent = pitchRange.value; });

// ------------ 시작 시 설정 ------------
window.addEventListener('load', ()=>{
  answerInput.disabled = true;
  answerInput.placeholder = '먼저 단어 목록을 입력하고 "시작"을 누르세요';
});
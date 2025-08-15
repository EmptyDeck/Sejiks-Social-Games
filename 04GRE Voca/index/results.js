const results = JSON.parse(localStorage.getItem('results') || '{}');
const settings = JSON.parse(localStorage.getItem('settings') || '{}');

document.getElementById('finalScore').textContent = results.score || 0;
document.getElementById('totalQuestions').textContent = results.total || 0;

// 걸린 시간 표시
if (results.elapsedTime) {
  const minutes = Math.floor(results.elapsedTime / 60);
  const seconds = results.elapsedTime % 60;
  document.getElementById('elapsedTime').textContent = 
    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
} else {
  document.getElementById('elapsedTime').textContent = '00:00';
}

// 게임 설정 정보 표시
document.getElementById('questionRange').textContent = 
  settings.start && settings.end ? `${settings.start} - ${settings.end}` : '-';

document.getElementById('langMode').textContent = 
  settings.lang === 'eng' ? '영어 → 한국어' : 
  settings.lang === 'kor' ? '한국어 → 영어' : '-';

document.getElementById('questionCount').textContent = settings.count || '-';

document.getElementById('timeLimit').textContent = 
  settings.timeLimit ? `${settings.timeLimit}초` : '-';

document.getElementById('maxQuestions').textContent = settings.maxQuestions || '-';

// Weak words placeholder (future expansion)
const weakContainer = document.getElementById('weakWordsContainer');
const weakList = document.getElementById('weakWordsList');

// If we saved missed words in localStorage
const missed = JSON.parse(localStorage.getItem('missedWords') || '[]');

if (missed.length > 0) {
  missed.forEach(w => {
    const li = document.createElement('li');
    li.textContent = `${w.word} - ${w.definition}`;
    weakList.appendChild(li);
  });
} else {
  weakContainer.style.display = 'none';
}

document.getElementById('homeBtn').addEventListener('click', () => {
  vibrate();
  goToPage('index.html');
});
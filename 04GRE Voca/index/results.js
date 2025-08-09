const results = JSON.parse(localStorage.getItem('results') || '{}');

document.getElementById('finalScore').textContent = results.score || 0;
document.getElementById('totalQuestions').textContent = results.total || 0;

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

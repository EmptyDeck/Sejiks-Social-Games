// script.js

// 1. HTML 요소들을 가져옵니다.
const messageElement = document.getElementById('message');
const changeButton = document.getElementById('changeMessageBtn');

// 2. 버튼 클릭 이벤트 리스너를 추가합니다.
changeButton.addEventListener('click', function() {
    // 3. 버튼이 클릭되면 메시지 내용을 변경합니다.
    messageElement.textContent = '메시지가 JavaScript에 의해 변경되었습니다!';
    messageElement.style.color = '#dc3545'; // 색상도 변경해봅니다.
});

// 페이지 로드 시 초기 메시지를 콘솔에 출력 (선택 사항)
console.log('웹 앱이 로드되었습니다!');
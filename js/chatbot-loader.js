// 모든 페이지에 챗봇 자동 로드
document.addEventListener('DOMContentLoaded', function() {
    // CSS 파일 동적 로드
    const chatbotCSS = document.createElement('link');
    chatbotCSS.rel = 'stylesheet';
    chatbotCSS.href = 'css/chatbot.css';
    document.head.appendChild(chatbotCSS);
    
    // 챗봇 스크립트 동적 로드
    const chatbotScript = document.createElement('script');
    chatbotScript.src = 'js/chatbot.js';
    document.body.appendChild(chatbotScript);
});
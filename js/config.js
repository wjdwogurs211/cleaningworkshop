// API 기본 URL 설정
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api'
    : 'https://cleaningworkshop-backend.onrender.com/api';

// 전역 설정
window.API_CONFIG = {
    BASE_URL: API_BASE_URL,
    TIMEOUT: 30000,
    RETRY_COUNT: 3
};

console.log('API Base URL:', API_BASE_URL);
// 히어로 배너 슬라이더 기능
let currentSlide = 0;
const slides = document.querySelectorAll('.banner-slide');
const indicators = document.querySelectorAll('.indicator');
let slideInterval;

// 슬라이드 변경 함수
function changeSlide(index) {
    // 모든 슬라이드와 인디케이터 비활성화
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    // 선택된 슬라이드와 인디케이터 활성화
    slides[index].classList.add('active');
    indicators[index].classList.add('active');
    
    currentSlide = index;
}

// 다음 슬라이드로 이동
function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    changeSlide(currentSlide);
}

// 자동 슬라이드 시작
function startSlideShow() {
    slideInterval = setInterval(nextSlide, 5000); // 5초마다 변경
}

// 자동 슬라이드 중지
function stopSlideShow() {
    clearInterval(slideInterval);
}

// 페이지 로드 시 자동 슬라이드 시작
document.addEventListener('DOMContentLoaded', () => {
    startSlideShow();
    
    // 배너에 마우스 올렸을 때 자동 슬라이드 중지
    const banner = document.querySelector('.hero-banner');
    banner.addEventListener('mouseenter', stopSlideShow);
    banner.addEventListener('mouseleave', startSlideShow);
});

// 터치 슬라이드 지원 (모바일)
let touchStartX = 0;
let touchEndX = 0;

document.querySelector('.banner-slider').addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.querySelector('.banner-slider').addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
        // 왼쪽 스와이프 - 다음 슬라이드
        nextSlide();
        stopSlideShow();
        startSlideShow();
    }
    if (touchEndX > touchStartX + 50) {
        // 오른쪽 스와이프 - 이전 슬라이드
        currentSlide = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
        changeSlide(currentSlide);
        stopSlideShow();
        startSlideShow();
    }
}
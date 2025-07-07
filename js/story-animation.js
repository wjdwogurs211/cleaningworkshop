// 스토리 페이지 애니메이션
document.addEventListener('DOMContentLoaded', function() {
    // Intersection Observer 설정
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // 숫자 카운팅 애니메이션
                if (entry.target.classList.contains('stat-number')) {
                    animateNumber(entry.target);
                }
            }
        });
    }, observerOptions);

    // 관찰할 요소들
    const animatedElements = document.querySelectorAll('.chapter-content, .promise-item, .stat-number');
    animatedElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });

    // 숫자 카운팅 애니메이션
    function animateNumber(element) {
        const finalNumber = parseInt(element.textContent.replace(/,/g, ''));
        const duration = 2000;
        const step = Math.ceil(finalNumber / (duration / 16));
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= finalNumber) {
                current = finalNumber;
                clearInterval(timer);
            }
            element.textContent = current.toLocaleString();
        }, 16);
    }

    // 스크롤 인디케이터 숨기기
    let scrollTimeout;
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    window.addEventListener('scroll', () => {
        if (scrollIndicator && window.scrollY > 100) {
            scrollIndicator.style.opacity = '0';
        }
        
        // 스크롤 시 패럴랙스 효과
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const scrolled = window.scrollY;
            const chapters = document.querySelectorAll('.story-chapter');
            
            chapters.forEach((chapter, index) => {
                const offset = chapter.offsetTop - window.innerHeight;
                if (scrolled > offset) {
                    const parallax = (scrolled - offset) * 0.1;
                    chapter.style.transform = `translateY(${-parallax}px)`;
                }
            });
        }, 10);
    });

    // 모바일 메뉴 토글
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuBtn.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
        });
    }
});

// CSS 애니메이션 클래스 추가
const style = document.createElement('style');
style.textContent = `
    .animate-on-scroll {
        opacity: 0;
        transform: translateY(50px);
        transition: all 0.8s ease;
    }
    
    .animate-on-scroll.visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    .chapter-content.reverse .animate-on-scroll {
        transform: translateX(-50px);
    }
    
    .chapter-content.reverse .animate-on-scroll.visible {
        transform: translateX(0);
    }
    
    .promise-item.animate-on-scroll {
        transition-delay: calc(var(--index) * 0.1s);
    }
`;
document.head.appendChild(style);

// Promise 아이템에 인덱스 추가
document.querySelectorAll('.promise-item').forEach((item, index) => {
    item.style.setProperty('--index', index);
});
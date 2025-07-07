// 프로모션 & 마케팅 시스템
class PromotionManager {
    constructor() {
        this.init();
        this.couponCodes = [
            { code: 'FIRST30', discount: 30, description: '첫 이용 고객 30% 할인' },
            { code: 'CLEAN20', discount: 20, description: '모든 서비스 20% 할인' },
            { code: 'FRIEND15', discount: 15, description: '친구 추천 15% 할인' }
        ];
        this.referralCode = this.generateReferralCode();
    }

    init() {
        this.createPromotionElements();
        this.attachEventListeners();
        this.startPromotionTimer();
        this.checkFirstVisit();
        this.initSocialShare();
    }

    createPromotionElements() {
        // 프로모션 팝업
        const promotionHTML = `
            <div class="promotion-overlay" id="promotionOverlay"></div>
            <div class="promotion-popup" id="promotionPopup">
                <div class="promotion-header">
                    <button class="promotion-close" onclick="promotionManager.closePromotion()">×</button>
                    <h2 class="promotion-title">🎉 특별 할인 이벤트!</h2>
                    <p class="promotion-subtitle">오늘만 특별한 혜택을 드립니다</p>
                </div>
                <div class="promotion-content">
                    <div class="discount-badge">30% OFF</div>
                    <ul class="promotion-features">
                        <li>모든 청소 서비스 적용</li>
                        <li>추가 비용 없음</li>
                        <li>100% 만족 보장</li>
                    </ul>
                    <div class="promotion-cta">
                        <button class="promotion-btn" onclick="promotionManager.applyPromotion()">
                            지금 할인받기
                        </button>
                    </div>
                    <div class="promotion-timer">
                        이벤트 종료까지: <span class="countdown" id="countdown">23:59:59</span>
                    </div>
                </div>
            </div>

            <!-- 플로팅 배너 -->
            <div class="floating-banner" id="floatingBanner" onclick="promotionManager.showPromotion()">
                <span>🎁 오늘의 특가! 최대 30% 할인</span>
            </div>

            <!-- 소셜 공유 버튼 -->
            <div class="social-share" id="socialShare">
                <a href="#" class="social-share-btn kakao" onclick="promotionManager.shareKakao(event)" title="카카오톡 공유">
                    <span>K</span>
                </a>
                <a href="#" class="social-share-btn naver" onclick="promotionManager.shareNaver(event)" title="네이버 공유">
                    <span>N</span>
                </a>
                <a href="#" class="social-share-btn facebook" onclick="promotionManager.shareFacebook(event)" title="페이스북 공유">
                    <span>f</span>
                </a>
                <a href="#" class="social-share-btn instagram" onclick="promotionManager.shareInstagram(event)" title="인스타그램">
                    <span>📷</span>
                </a>
            </div>

            <!-- 리뷰 요청 배너 -->
            <div class="review-request-banner" id="reviewBanner">
                <div class="review-request-content">
                    <span>서비스가 만족스러우셨나요?</span>
                    <div class="review-stars">
                        <span class="review-star" onclick="promotionManager.rateService(1)">⭐</span>
                        <span class="review-star" onclick="promotionManager.rateService(2)">⭐</span>
                        <span class="review-star" onclick="promotionManager.rateService(3)">⭐</span>
                        <span class="review-star" onclick="promotionManager.rateService(4)">⭐</span>
                        <span class="review-star" onclick="promotionManager.rateService(5)">⭐</span>
                    </div>
                    <button class="promotion-btn" style="padding: 8px 20px; font-size: 0.9rem;" onclick="promotionManager.writeReview()">
                        리뷰 작성하고 쿠폰 받기
                    </button>
                </div>
            </div>
        `;

        // DOM에 추가
        const promotionContainer = document.createElement('div');
        promotionContainer.innerHTML = promotionHTML;
        document.body.appendChild(promotionContainer);
    }

    attachEventListeners() {
        // ESC 키로 팝업 닫기
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closePromotion();
            }
        });

        // 오버레이 클릭으로 닫기
        document.getElementById('promotionOverlay').addEventListener('click', () => {
            this.closePromotion();
        });

        // 스크롤 이벤트
        let lastScrollTop = 0;
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // 스크롤 50% 이상 시 리뷰 배너 표시
            if (scrollTop > document.body.scrollHeight * 0.5 && !this.reviewBannerShown) {
                this.showReviewBanner();
            }

            lastScrollTop = scrollTop;
        });
    }

    checkFirstVisit() {
        const visited = localStorage.getItem('visited');
        
        if (!visited) {
            // 첫 방문자에게 3초 후 프로모션 팝업 표시
            setTimeout(() => {
                this.showPromotion();
            }, 3000);
            
            localStorage.setItem('visited', 'true');
        }
    }

    showPromotion() {
        document.getElementById('promotionPopup').classList.add('active');
        document.getElementById('promotionOverlay').classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closePromotion() {
        document.getElementById('promotionPopup').classList.remove('active');
        document.getElementById('promotionOverlay').classList.remove('active');
        document.body.style.overflow = '';
    }

    applyPromotion() {
        // 쿠폰 코드 저장
        sessionStorage.setItem('promotionCode', 'FIRST30');
        sessionStorage.setItem('discount', '30');
        
        // 예약 페이지로 이동
        window.location.href = 'booking.html';
    }

    startPromotionTimer() {
        // 오늘 자정까지 남은 시간 계산
        const updateCountdown = () => {
            const now = new Date();
            const midnight = new Date();
            midnight.setHours(24, 0, 0, 0);
            
            const diff = midnight - now;
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            const countdownEl = document.getElementById('countdown');
            if (countdownEl) {
                countdownEl.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
        };
        
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    // 소셜 공유 기능
    shareKakao(e) {
        e.preventDefault();
        
        // 카카오톡 공유 (실제 구현시 Kakao SDK 필요)
        const shareUrl = window.location.href;
        const shareTitle = '청소공작소 - 첫 이용 30% 할인!';
        const shareDescription = '전문 청소 서비스를 특별한 가격에 만나보세요!';
        
        // 카카오톡 공유 URL
        const kakaoUrl = `https://story.kakao.com/share?url=${encodeURIComponent(shareUrl)}`;
        window.open(kakaoUrl, '_blank', 'width=500,height=500');
        
        // 공유 보상
        this.rewardShare('kakao');
    }

    shareNaver(e) {
        e.preventDefault();
        
        const shareUrl = window.location.href;
        const shareTitle = '청소공작소 - 첫 이용 30% 할인!';
        
        const naverUrl = `https://share.naver.com/web/shareView.nhn?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`;
        window.open(naverUrl, '_blank', 'width=500,height=500');
        
        this.rewardShare('naver');
    }

    shareFacebook(e) {
        e.preventDefault();
        
        const shareUrl = window.location.href;
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        window.open(facebookUrl, '_blank', 'width=500,height=500');
        
        this.rewardShare('facebook');
    }

    shareInstagram(e) {
        e.preventDefault();
        alert('인스타그램 스토리에 @cleaningworkshop을 태그해주세요! 추가 5% 할인 쿠폰을 드립니다.');
    }

    rewardShare(platform) {
        // 공유 보상 처리
        const sharedPlatforms = JSON.parse(localStorage.getItem('sharedPlatforms') || '[]');
        
        if (!sharedPlatforms.includes(platform)) {
            sharedPlatforms.push(platform);
            localStorage.setItem('sharedPlatforms', JSON.stringify(sharedPlatforms));
            
            // 보상 알림
            this.showNotification(`${platform} 공유 감사합니다! 5% 추가 할인 쿠폰이 지급되었습니다.`);
        }
    }

    // 리뷰 시스템
    showReviewBanner() {
        const banner = document.getElementById('reviewBanner');
        banner.classList.add('active');
        this.reviewBannerShown = true;
        
        // 10초 후 자동으로 숨김
        setTimeout(() => {
            banner.classList.remove('active');
        }, 10000);
    }

    rateService(rating) {
        const stars = document.querySelectorAll('.review-star');
        stars.forEach((star, index) => {
            star.style.opacity = index < rating ? '1' : '0.3';
        });
        
        sessionStorage.setItem('serviceRating', rating);
    }

    writeReview() {
        const rating = sessionStorage.getItem('serviceRating');
        if (rating >= 4) {
            // 높은 평점인 경우 리뷰 페이지로
            window.location.href = 'review.html';
        } else {
            // 낮은 평점인 경우 개선 의견 수집
            if (confirm('서비스 개선을 위해 의견을 들려주시겠습니까?')) {
                window.location.href = 'feedback.html';
            }
        }
    }

    // 추천인 코드 생성
    generateReferralCode() {
        const code = 'CW' + Math.random().toString(36).substr(2, 6).toUpperCase();
        localStorage.setItem('referralCode', code);
        return code;
    }

    // 쿠폰 시스템
    createCouponCard(coupon) {
        return `
            <div class="coupon-card">
                <div class="coupon-header">
                    <div class="coupon-discount">${coupon.discount}% OFF</div>
                    <div class="coupon-code">${coupon.code}</div>
                </div>
                <div class="coupon-description">${coupon.description}</div>
                <div class="coupon-expiry">유효기간: ${this.getExpiryDate()}</div>
                <button class="copy-btn" onclick="promotionManager.copyCoupon('${coupon.code}')">
                    쿠폰 복사하기
                </button>
            </div>
        `;
    }

    copyCoupon(code) {
        navigator.clipboard.writeText(code).then(() => {
            this.showNotification('쿠폰 코드가 복사되었습니다!');
            
            // 버튼 상태 변경
            event.target.classList.add('copied');
            event.target.textContent = '복사 완료!';
            
            setTimeout(() => {
                event.target.classList.remove('copied');
                event.target.textContent = '쿠폰 복사하기';
            }, 2000);
        });
    }

    getExpiryDate() {
        const date = new Date();
        date.setDate(date.getDate() + 30);
        return date.toLocaleDateString('ko-KR');
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4caf50;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // SEO 메타 태그 업데이트
    updateMetaTags() {
        // 동적 메타 태그 업데이트
        const metaTags = {
            'og:title': '청소공작소 - 첫 이용 30% 할인 이벤트',
            'og:description': '전문 청소 서비스를 특별한 가격에! 지금 예약하고 할인 혜택을 받으세요.',
            'og:image': '/images/promotion-banner.jpg',
            'twitter:card': 'summary_large_image',
            'twitter:title': '청소공작소 특별 할인',
            'twitter:description': '첫 이용 고객 30% 할인! 놓치지 마세요.'
        };
        
        Object.entries(metaTags).forEach(([property, content]) => {
            let meta = document.querySelector(`meta[property="${property}"]`) || 
                       document.querySelector(`meta[name="${property}"]`);
            
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute(property.includes('og:') ? 'property' : 'name', property);
                document.head.appendChild(meta);
            }
            
            meta.setAttribute('content', content);
        });
    }
}

// 프로모션 매니저 초기화
let promotionManager;

document.addEventListener('DOMContentLoaded', function() {
    promotionManager = new PromotionManager();
    
    // 페이지별 특별 프로모션
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('index.html') || currentPage === '/') {
        // 홈페이지 특별 프로모션
        setTimeout(() => {
            promotionManager.showFloatingBanner();
        }, 5000);
    }
    
    if (currentPage.includes('booking.html')) {
        // 예약 페이지에서 할인 코드 자동 적용
        const promoCode = sessionStorage.getItem('promotionCode');
        if (promoCode) {
            promotionManager.applyDiscountCode(promoCode);
        }
    }
});

// 페이지 이탈 방지
window.addEventListener('beforeunload', function(e) {
    const bookingStarted = sessionStorage.getItem('bookingStarted');
    
    if (bookingStarted && !sessionStorage.getItem('bookingCompleted')) {
        e.preventDefault();
        e.returnValue = '예약을 완료하지 않으셨습니다. 정말 나가시겠습니까?';
    }
});
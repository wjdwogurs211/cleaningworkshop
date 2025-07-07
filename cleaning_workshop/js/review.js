// 리뷰 시스템 JavaScript

// 별점 평가 데이터
const ratings = {
    overall: 0,
    quality: 0,
    kindness: 0,
    punctuality: 0,
    value: 0
};

// 업로드된 사진 관리
let uploadedPhotos = [];

// 페이지 초기화
document.addEventListener('DOMContentLoaded', function() {
    // URL 파라미터에서 예약 정보 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const bookingNumber = urlParams.get('booking');
    
    if (bookingNumber) {
        // 실제로는 서버에서 예약 정보 조회
        loadBookingInfo(bookingNumber);
    }
    
    // 별점 클릭 이벤트
    initializeStarRatings();
    
    // 텍스트 카운터
    initializeTextCounter();
    
    // 사진 업로드
    initializePhotoUpload();
    
    // 폼 제출
    document.getElementById('reviewForm').addEventListener('submit', handleSubmit);
    
    // 작성자 타입 변경
    document.querySelectorAll('input[name="authorType"]').forEach(radio => {
        radio.addEventListener('change', handleAuthorTypeChange);
    });
});

// 예약 정보 로드
function loadBookingInfo(bookingNumber) {
    // 로컬 스토리지에서 예약 정보 가져오기 (실제로는 서버 API)
    const bookingData = JSON.parse(localStorage.getItem('lastBooking') || '{}');
    
    if (bookingData.bookingNumber) {
        document.getElementById('bookingNumber').textContent = bookingData.bookingNumber;
        document.getElementById('serviceName').textContent = getServiceName(bookingData.service);
        document.getElementById('serviceDate').textContent = bookingData.date;
        document.getElementById('managerName').textContent = '김철수'; // 실제로는 서버에서
    }
}

// 서비스명 변환
function getServiceName(serviceCode) {
    const serviceNames = {
        'move-in': '입주청소',
        'ac': '에어컨청소',
        'sofa': '쇼파/침구청소',
        'window': '유리창청소'
    };
    return serviceNames[serviceCode] || serviceCode;
}

// 별점 초기화
function initializeStarRatings() {
    document.querySelectorAll('.star-rating').forEach(ratingContainer => {
        const ratingType = ratingContainer.dataset.rating;
        const stars = ratingContainer.querySelectorAll('.star');
        
        stars.forEach((star, index) => {
            // 클릭 이벤트
            star.addEventListener('click', () => {
                const value = index + 1;
                ratings[ratingType] = value;
                updateStarDisplay(ratingContainer, value);
                
                // 전체 평점인 경우 텍스트 업데이트
                if (ratingType === 'overall') {
                    updateRatingText(value);
                }
            });
            
            // 호버 이벤트
            star.addEventListener('mouseenter', () => {
                const value = index + 1;
                highlightStars(ratingContainer, value);
            });
        });
        
        // 마우스 나가면 원래 상태로
        ratingContainer.addEventListener('mouseleave', () => {
            updateStarDisplay(ratingContainer, ratings[ratingType]);
        });
    });
}

// 별점 표시 업데이트
function updateStarDisplay(container, rating) {
    const stars = container.querySelectorAll('.star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

// 별점 하이라이트
function highlightStars(container, rating) {
    const stars = container.querySelectorAll('.star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.style.filter = 'grayscale(0)';
            star.style.transform = 'scale(1.1)';
        } else {
            star.style.filter = 'grayscale(1)';
            star.style.transform = 'scale(1)';
        }
    });
}

// 평점 텍스트 업데이트
function updateRatingText(rating) {
    const ratingTexts = {
        1: '아쉬워요 😞',
        2: '그저 그래요 😐',
        3: '보통이에요 🙂',
        4: '만족해요 😊',
        5: '최고예요! 🤩'
    };
    
    document.getElementById('ratingText').textContent = ratingTexts[rating] || '별점을 선택해주세요';
}

// 텍스트 카운터 초기화
function initializeTextCounter() {
    const textarea = document.getElementById('reviewText');
    const charCount = document.getElementById('charCount');
    const maxLength = 500;
    
    textarea.addEventListener('input', function() {
        const length = this.value.length;
        charCount.textContent = length;
        
        if (length > maxLength) {
            this.value = this.value.substring(0, maxLength);
            charCount.textContent = maxLength;
        }
        
        // 글자수에 따라 색상 변경
        if (length > maxLength * 0.9) {
            charCount.style.color = '#DC2626';
        } else {
            charCount.style.color = 'var(--text-secondary)';
        }
    });
}

// 사진 업로드 초기화
function initializePhotoUpload() {
    const photoInput = document.getElementById('photoInput');
    const photoPreview = document.getElementById('photoPreview');
    
    photoInput.addEventListener('change', function(e) {
        const files = Array.from(e.target.files);
        const maxFiles = 5;
        const maxSize = 10 * 1024 * 1024; // 10MB
        
        files.forEach(file => {
            // 파일 개수 제한
            if (uploadedPhotos.length >= maxFiles) {
                alert(`최대 ${maxFiles}장까지만 업로드 가능합니다.`);
                return;
            }
            
            // 파일 크기 제한
            if (file.size > maxSize) {
                alert(`${file.name}은 10MB를 초과합니다.`);
                return;
            }
            
            // 이미지 파일만 허용
            if (!file.type.startsWith('image/')) {
                alert(`${file.name}은 이미지 파일이 아닙니다.`);
                return;
            }
            
            // 미리보기 생성
            const reader = new FileReader();
            reader.onload = function(e) {
                const photoId = Date.now() + Math.random();
                uploadedPhotos.push({
                    id: photoId,
                    file: file,
                    url: e.target.result
                });
                
                createPhotoPreview(photoId, e.target.result);
            };
            reader.readAsDataURL(file);
        });
        
        // 입력 초기화
        photoInput.value = '';
    });
}

// 사진 미리보기 생성
function createPhotoPreview(id, url) {
    const preview = document.createElement('div');
    preview.className = 'preview-item';
    preview.innerHTML = `
        <img src="${url}" alt="리뷰 사진">
        <button class="remove-photo" onclick="removePhoto('${id}')">×</button>
    `;
    
    document.getElementById('photoPreview').appendChild(preview);
}

// 사진 제거
window.removePhoto = function(id) {
    uploadedPhotos = uploadedPhotos.filter(photo => photo.id !== id);
    
    // DOM에서 제거
    const preview = event.target.closest('.preview-item');
    preview.remove();
};

// 작성자 타입 변경
function handleAuthorTypeChange(e) {
    const authorName = document.getElementById('authorName');
    
    if (e.target.value === 'anonymous') {
        authorName.value = '익명';
        authorName.disabled = true;
    } else {
        authorName.value = '';
        authorName.disabled = false;
        authorName.focus();
    }
}

// 폼 제출 처리
function handleSubmit(e) {
    e.preventDefault();
    
    // 유효성 검사
    if (!validateForm()) {
        return;
    }
    
    // 리뷰 데이터 수집
    const reviewData = collectReviewData();
    
    // 로딩 표시
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = '등록 중...';
    
    // 서버로 전송 (시뮬레이션)
    setTimeout(() => {
        // 실제로는 서버 API 호출
        console.log('리뷰 데이터:', reviewData);
        
        // 로컬 스토리지에 저장 (임시)
        saveReviewToLocal(reviewData);
        
        // 성공 메시지
        alert('리뷰가 등록되었습니다!\n승인 후 쿠폰이 발급됩니다.');
        
        // 리뷰 목록 페이지로 이동
        window.location.href = 'reviews.html';
    }, 1500);
}

// 폼 유효성 검사
function validateForm() {
    // 전체 평점 체크
    if (ratings.overall === 0) {
        alert('전체 만족도 별점을 선택해주세요.');
        document.querySelector('[data-rating="overall"]').scrollIntoView({ behavior: 'smooth' });
        return false;
    }
    
    // 세부 평점 체크
    const detailRatings = ['quality', 'kindness', 'punctuality', 'value'];
    for (const rating of detailRatings) {
        if (ratings[rating] === 0) {
            alert('모든 세부 평가 항목에 별점을 선택해주세요.');
            document.querySelector('.detail-ratings').scrollIntoView({ behavior: 'smooth' });
            return false;
        }
    }
    
    // 추천 의향 체크
    const recommend = document.querySelector('input[name="recommend"]:checked');
    if (!recommend) {
        alert('추천 의향을 선택해주세요.');
        return false;
    }
    
    // 작성자 이름 체크
    const authorName = document.getElementById('authorName').value.trim();
    if (!authorName) {
        alert('작성자 이름을 입력해주세요.');
        return false;
    }
    
    return true;
}

// 리뷰 데이터 수집
function collectReviewData() {
    const reviewText = document.getElementById('reviewText').value.trim();
    const recommend = document.querySelector('input[name="recommend"]:checked').value;
    const improvements = Array.from(document.querySelectorAll('input[name="improvement"]:checked'))
        .map(cb => cb.value);
    const authorType = document.querySelector('input[name="authorType"]:checked').value;
    const authorName = document.getElementById('authorName').value.trim();
    
    return {
        id: 'RV' + Date.now(),
        bookingNumber: document.getElementById('bookingNumber').textContent,
        serviceName: document.getElementById('serviceName').textContent,
        serviceDate: document.getElementById('serviceDate').textContent,
        managerName: document.getElementById('managerName').textContent,
        ratings: { ...ratings },
        averageRating: calculateAverageRating(),
        reviewText: reviewText,
        photos: uploadedPhotos.map(photo => ({
            name: photo.file.name,
            size: photo.file.size,
            url: photo.url
        })),
        recommend: recommend,
        improvements: improvements,
        authorType: authorType,
        authorName: authorName,
        createdAt: new Date().toISOString(),
        status: 'pending' // pending, approved, rejected
    };
}

// 평균 평점 계산
function calculateAverageRating() {
    const ratingValues = Object.values(ratings);
    const sum = ratingValues.reduce((acc, val) => acc + val, 0);
    return (sum / ratingValues.length).toFixed(1);
}

// 리뷰 로컬 저장 (임시)
function saveReviewToLocal(reviewData) {
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    reviews.unshift(reviewData);
    
    // 최대 100개만 보관
    if (reviews.length > 100) {
        reviews.splice(100);
    }
    
    localStorage.setItem('reviews', JSON.stringify(reviews));
}
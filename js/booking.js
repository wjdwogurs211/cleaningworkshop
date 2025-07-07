// 예약 시스템 JavaScript

// 전역 변수
let currentStep = 1;
const totalSteps = 5;
let bookingData = {};

// DOM 요소
const form = document.getElementById('bookingForm');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const submitBtn = document.getElementById('submitBtn');

// 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 캘린더는 calendar-booking.js에서 자동으로 초기화됨
    
    // 서비스 선택 이벤트
    document.querySelectorAll('input[name="service"]').forEach(radio => {
        radio.addEventListener('change', handleServiceSelection);
    });
    
    // 쇼파 항목 선택 시 크기 선택 표시
    document.querySelectorAll('input[name="sofa-items"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const sofaChecked = document.querySelector('input[name="sofa-items"][value="쇼파"]').checked;
            document.getElementById('sofa-size-select').style.display = sofaChecked ? 'block' : 'none';
        });
    });
    
    // 출입 방법 변경 시
    document.querySelector('select[name="entry-method"]').addEventListener('change', function() {
        const entryDetail = document.getElementById('entry-detail');
        if (this.value === '비밀번호' || this.value === '기타') {
            entryDetail.style.display = 'block';
        } else {
            entryDetail.style.display = 'none';
        }
    });
    
    // 날짜 선택 시 주말 체크
    if (dateInput) {
        dateInput.addEventListener('change', function() {
            const selectedDate = new Date(this.value);
            const dayOfWeek = selectedDate.getDay();
            
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                alert('주말 서비스는 전화 문의(1588-0000) 부탁드립니다.');
                this.value = '';
            }
        });
    }
});

// 서비스 선택 처리
function handleServiceSelection(e) {
    const service = e.target.value;
    
    // 모든 상세 섹션 숨기기
    document.querySelectorAll('.detail-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // 선택한 서비스의 상세 섹션 표시
    const detailSection = document.getElementById(`${service}-details`);
    if (detailSection) {
        detailSection.style.display = 'block';
    }
}

// 다음 버튼 클릭
nextBtn.addEventListener('click', function() {
    if (validateStep(currentStep)) {
        saveStepData(currentStep);
        
        if (currentStep < totalSteps) {
            currentStep++;
            updateStep();
        }
    }
});

// 이전 버튼 클릭
prevBtn.addEventListener('click', function() {
    if (currentStep > 1) {
        currentStep--;
        updateStep();
    }
});

// 폼 제출
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (validateStep(currentStep)) {
        saveStepData(currentStep);
        submitBooking();
    }
});

// 단계 업데이트
function updateStep() {
    // 모든 스텝 숨기기
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('active');
    });
    
    // 현재 스텝 표시
    document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.add('active');
    
    // 진행 상태 업데이트
    updateProgressBar();
    
    // 버튼 표시/숨기기
    prevBtn.style.display = currentStep === 1 ? 'none' : 'block';
    nextBtn.style.display = currentStep === totalSteps ? 'none' : 'block';
    submitBtn.style.display = currentStep === totalSteps ? 'block' : 'none';
    
    // 마지막 단계에서 요약 정보 표시
    if (currentStep === totalSteps) {
        displaySummary();
    }
}

// 진행 상태 바 업데이트
function updateProgressBar() {
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        const stepNum = index + 1;
        
        if (stepNum < currentStep) {
            step.classList.add('completed');
            step.classList.remove('active');
        } else if (stepNum === currentStep) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active', 'completed');
        }
    });
}

// 단계별 유효성 검사
function validateStep(step) {
    switch(step) {
        case 1:
            const service = document.querySelector('input[name="service"]:checked');
            if (!service) {
                alert('서비스를 선택해주세요.');
                return false;
            }
            break;
            
        case 2:
            const selectedService = bookingData.service;
            
            if (selectedService === 'move-in') {
                const size = document.querySelector('select[name="move-in-size"]').value;
                if (!size) {
                    alert('평수를 선택해주세요.');
                    return false;
                }
            } else if (selectedService === 'ac') {
                const type = document.querySelector('select[name="ac-type"]').value;
                if (!type) {
                    alert('에어컨 종류를 선택해주세요.');
                    return false;
                }
            } else if (selectedService === 'sofa') {
                const items = document.querySelectorAll('input[name="sofa-items"]:checked');
                if (items.length === 0) {
                    alert('청소할 항목을 선택해주세요.');
                    return false;
                }
            } else if (selectedService === 'window') {
                const building = document.querySelector('select[name="window-building"]').value;
                const floor = document.querySelector('input[name="window-floor"]').value;
                const count = document.querySelector('select[name="window-count"]').value;
                
                if (!building || !floor || !count) {
                    alert('모든 정보를 입력해주세요.');
                    return false;
                }
            }
            break;
            
        case 3:
            // 새로운 캘린더 시스템에서 날짜/시간 확인
            if (typeof bookingCalendar !== 'undefined' && bookingCalendar) {
                const selectedDateTime = bookingCalendar.getSelectedDateTime();
                if (!selectedDateTime) {
                    alert('날짜와 시간을 선택해주세요.');
                    return false;
                }
                // bookingData에 저장
                bookingData.date = selectedDateTime.date;
                bookingData.time = selectedDateTime.time;
                bookingData.dateFormatted = selectedDateTime.dateObj.toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    weekday: 'long'
                });
            } else {
                alert('캘린더를 로드하는 중입니다. 잠시만 기다려주세요.');
                return false;
            }
            break;
            
        case 4:
            const name = document.querySelector('input[name="customer-name"]').value;
            const phone = document.querySelector('input[name="customer-phone"]').value;
            const address = document.querySelector('input[name="service-address"]').value;
            
            if (!name || !phone || !address) {
                alert('필수 정보를 모두 입력해주세요.');
                return false;
            }
            
            // 전화번호 형식 검사
            const phoneRegex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;
            if (!phoneRegex.test(phone.replace(/-/g, ''))) {
                alert('올바른 전화번호 형식으로 입력해주세요.');
                return false;
            }
            break;
            
        case 5:
            const terms = document.querySelector('input[name="terms"]').checked;
            if (!terms) {
                alert('이용약관에 동의해주세요.');
                return false;
            }
            break;
    }
    
    return true;
}

// 단계별 데이터 저장
function saveStepData(step) {
    switch(step) {
        case 1:
            const service = document.querySelector('input[name="service"]:checked');
            bookingData.service = service.value;
            bookingData.basePrice = parseInt(service.dataset.price);
            break;
            
        case 2:
            if (bookingData.service === 'move-in') {
                bookingData.size = document.querySelector('select[name="move-in-size"]').value;
                bookingData.options = Array.from(document.querySelectorAll('input[name="move-in-options"]:checked'))
                    .map(cb => cb.value);
            } else if (bookingData.service === 'ac') {
                bookingData.acType = document.querySelector('select[name="ac-type"]').value;
                bookingData.acCount = document.querySelector('input[name="ac-count"]').value;
                bookingData.includeOutdoor = document.querySelector('input[name="ac-outdoor"]').checked;
            } else if (bookingData.service === 'sofa') {
                bookingData.sofaItems = Array.from(document.querySelectorAll('input[name="sofa-items"]:checked'))
                    .map(cb => cb.value);
                if (document.querySelector('input[name="sofa-items"][value="쇼파"]').checked) {
                    bookingData.sofaSize = document.querySelector('select[name="sofa-size"]').value;
                }
            } else if (bookingData.service === 'window') {
                bookingData.building = document.querySelector('select[name="window-building"]').value;
                bookingData.floor = document.querySelector('input[name="window-floor"]').value;
                bookingData.windowCount = document.querySelector('select[name="window-count"]').value;
            }
            bookingData.specialRequest = document.querySelector('textarea[name="special-request"]').value;
            break;
            
        case 3:
            // calendar-booking.js의 saveBookingData 함수 호출
            if (typeof saveBookingData === 'function') {
                saveBookingData();
            }
            break;
            
        case 4:
            bookingData.customerName = document.querySelector('input[name="customer-name"]').value;
            bookingData.customerPhone = document.querySelector('input[name="customer-phone"]').value;
            bookingData.customerEmail = document.querySelector('input[name="customer-email"]').value;
            bookingData.address = document.querySelector('input[name="service-address"]').value;
            bookingData.addressDetail = document.querySelector('input[name="service-address-detail"]').value;
            bookingData.entryMethod = document.querySelector('select[name="entry-method"]').value;
            bookingData.entryDetail = document.querySelector('input[name="entry-detail"]').value;
            break;
            
        case 5:
            bookingData.paymentMethod = document.querySelector('input[name="payment"]:checked').value;
            break;
    }
}

// 예약 요약 표시
function displaySummary() {
    const summaryContent = document.getElementById('bookingSummary');
    let summaryHTML = '';
    
    // 서비스 정보
    const serviceNames = {
        'move-in': '입주청소',
        'ac': '에어컨청소',
        'sofa': '쇼파/침구청소',
        'window': '유리창청소'
    };
    
    summaryHTML += `
        <div class="summary-item">
            <span class="summary-label">서비스</span>
            <span class="summary-value">${serviceNames[bookingData.service]}</span>
        </div>
    `;
    
    // 서비스별 상세 정보
    if (bookingData.service === 'move-in') {
        summaryHTML += `
            <div class="summary-item">
                <span class="summary-label">평수</span>
                <span class="summary-value">${bookingData.size}평</span>
            </div>
        `;
        if (bookingData.options && bookingData.options.length > 0) {
            summaryHTML += `
                <div class="summary-item">
                    <span class="summary-label">추가 옵션</span>
                    <span class="summary-value">${bookingData.options.join(', ')}</span>
                </div>
            `;
        }
    }
    
    // 날짜/시간
    summaryHTML += `
        <div class="summary-item">
            <span class="summary-label">예약 일시</span>
            <span class="summary-value">${bookingData.date} ${bookingData.time}</span>
        </div>
    `;
    
    // 고객 정보
    summaryHTML += `
        <div class="summary-item">
            <span class="summary-label">고객명</span>
            <span class="summary-value">${bookingData.customerName}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">연락처</span>
            <span class="summary-value">${bookingData.customerPhone}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">주소</span>
            <span class="summary-value">${bookingData.address} ${bookingData.addressDetail}</span>
        </div>
    `;
    
    summaryContent.innerHTML = summaryHTML;
    
    // 가격 계산 및 표시
    calculatePrice();
}

// 가격 계산
function calculatePrice() {
    let basePrice = bookingData.basePrice || 0;
    let additionalPrice = 0;
    
    // 서비스별 추가 요금 계산
    if (bookingData.service === 'move-in') {
        // 평수에 따른 가격 조정
        if (bookingData.size === '40') basePrice = 450000;
        else if (bookingData.size === '50') basePrice = 550000;
        else if (bookingData.size === '50+') basePrice = 650000;
        
        // 옵션별 추가 요금
        if (bookingData.options && bookingData.options.includes('복층')) additionalPrice += 100000;
        if (bookingData.options && bookingData.options.includes('곰팡이제거')) additionalPrice += 50000;
    } else if (bookingData.service === 'ac') {
        // 에어컨 타입별 가격
        if (bookingData.acType === 'stand') basePrice = 80000;
        else if (bookingData.acType === 'ceiling') basePrice = 120000;
        
        // 대수별 가격
        basePrice *= parseInt(bookingData.acCount || 1);
        
        // 실외기 추가
        if (bookingData.includeOutdoor) additionalPrice += 30000;
    }
    
    // 가격 표시
    document.getElementById('basePrice').textContent = basePrice.toLocaleString() + '원';
    
    if (additionalPrice > 0) {
        document.getElementById('additionalPrice').style.display = 'flex';
        document.getElementById('addPrice').textContent = additionalPrice.toLocaleString() + '원';
    }
    
    const totalPrice = basePrice + additionalPrice;
    document.getElementById('totalPrice').textContent = totalPrice.toLocaleString() + '원';
    
    bookingData.totalPrice = totalPrice;
}

// 예약 제출
async function submitBooking() {
    // 로딩 표시
    submitBtn.disabled = true;
    submitBtn.textContent = '처리 중...';
    
    try {
        // 예약 데이터 준비
        const bookingPayload = {
            service: bookingData.service,
            serviceDetails: {
                size: bookingData.size,
                options: bookingData.options,
                acType: bookingData.acType,
                acCount: bookingData.acCount,
                includeOutdoor: bookingData.includeOutdoor,
                sofaItems: bookingData.sofaItems,
                sofaSize: bookingData.sofaSize,
                building: bookingData.building,
                floor: bookingData.floor,
                windowCount: bookingData.windowCount
            },
            date: bookingData.date,
            time: bookingData.time,
            customer: {
                name: bookingData.customerName,
                phone: bookingData.customerPhone,
                email: bookingData.customerEmail,
                address: bookingData.address,
                addressDetail: bookingData.addressDetail,
                entryMethod: bookingData.entryMethod,
                entryDetail: bookingData.entryDetail
            },
            specialRequest: bookingData.specialRequest,
            totalPrice: bookingData.totalPrice,
            paymentMethod: bookingData.paymentMethod
        };
        
        console.log('예약 데이터:', bookingPayload);
        
        // API가 준비되면 아래 주석을 해제하세요
        // API_BASE_URL이 정의되어 있다면 실제 API 호출
        if (typeof API_BASE_URL !== 'undefined') {
            const response = await fetch(`${API_BASE_URL}/bookings/guest`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bookingPayload)
            });
            
            if (!response.ok) {
                throw new Error('예약 처리 중 오류가 발생했습니다.');
            }
            
            const result = await response.json();
            bookingData.bookingNumber = result.data.bookingNumber;
        }
        
        // 임시 처리 (API 연동 전)
        const bookingNumber = 'CW' + Date.now().toString().slice(-8);
        bookingData.bookingNumber = bookingNumber;
        
        // 로컬 스토리지에 저장
        localStorage.setItem('lastBooking', JSON.stringify(bookingData));
        
        // 알림 발송
        if (window.sendBookingNotification) {
            window.sendBookingNotification(bookingData);
        }
        
        // 완료 페이지로 이동
        window.location.href = `booking-complete.html?booking=${bookingNumber}`;
        
    } catch (error) {
        console.error('예약 오류:', error);
        alert('예약 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
        submitBtn.disabled = false;
        submitBtn.textContent = '예약 완료';
    }
}
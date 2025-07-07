// 향상된 예약 캘린더 시스템
class BookingCalendar {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = null;
        this.selectedTime = null;
        this.bookedSlots = this.loadBookedSlots();
        this.init();
    }

    init() {
        this.renderCalendar();
        this.attachEventListeners();
    }

    // 예약된 시간 슬롯 로드 (실제로는 서버에서 가져와야 함)
    loadBookedSlots() {
        // 샘플 데이터
        return {
            '2025-07-08': ['09:00', '14:00', '16:00'],
            '2025-07-10': ['10:00', '11:00', '15:00'],
            '2025-07-15': ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
            '2025-07-20': ['13:00', '14:00']
        };
    }

    renderCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        // 캘린더 HTML 생성
        const calendarHTML = `
            <div class="calendar-container">
                <div class="calendar-header">
                    <button class="calendar-nav-btn" id="prevMonth">‹</button>
                    <h2 class="calendar-month-year">${year}년 ${month + 1}월</h2>
                    <button class="calendar-nav-btn" id="nextMonth">›</button>
                </div>
                <div class="calendar-weekdays">
                    <div class="calendar-weekday sunday">일</div>
                    <div class="calendar-weekday">월</div>
                    <div class="calendar-weekday">화</div>
                    <div class="calendar-weekday">수</div>
                    <div class="calendar-weekday">목</div>
                    <div class="calendar-weekday">금</div>
                    <div class="calendar-weekday saturday">토</div>
                </div>
                <div class="calendar-dates" id="calendarDates">
                    ${this.generateDates(year, month)}
                </div>
                <div class="time-selection" id="timeSelection" style="display: none;">
                    <h3>시간 선택</h3>
                    <div class="time-slots" id="timeSlots"></div>
                </div>
                <div class="booking-summary" id="bookingSummary" style="display: none;">
                    <h3>예약 정보</h3>
                    <div class="booking-summary-item">
                        <span class="booking-summary-label">날짜:</span>
                        <span class="booking-summary-value" id="summaryDate">-</span>
                    </div>
                    <div class="booking-summary-item">
                        <span class="booking-summary-label">시간:</span>
                        <span class="booking-summary-value" id="summaryTime">-</span>
                    </div>
                </div>
            </div>
        `;

        // 캘린더 삽입
        const calendarSection = document.getElementById('calendarSection');
        if (calendarSection) {
            calendarSection.innerHTML = calendarHTML;
        }
    }

    generateDates(year, month) {
        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        let datesHTML = '';
        
        // 이전 달의 빈 날짜
        for (let i = 0; i < firstDay; i++) {
            datesHTML += '<div class="calendar-date disabled"></div>';
        }
        
        // 현재 달의 날짜
        for (let date = 1; date <= lastDate; date++) {
            const currentDate = new Date(year, month, date);
            const dateString = this.formatDate(currentDate);
            const isToday = currentDate.getTime() === today.getTime();
            const isPast = currentDate < today;
            const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
            const hasBookings = this.bookedSlots[dateString] && this.bookedSlots[dateString].length > 0;
            const isFullyBooked = this.bookedSlots[dateString] && this.bookedSlots[dateString].length >= 6;
            
            let classes = 'calendar-date';
            let tooltip = '';
            
            if (isToday) {
                classes += ' today';
                tooltip = '오늘';
            }
            if (isPast) {
                classes += ' disabled';
                tooltip = '예약 불가';
            } else if (isFullyBooked) {
                classes += ' booked';
                tooltip = '예약 마감';
            } else if (hasBookings) {
                classes += ' available';
                tooltip = '예약 가능';
            }
            
            if (this.selectedDate && this.formatDate(this.selectedDate) === dateString) {
                classes += ' selected';
            }
            
            datesHTML += `
                <div class="${classes}" data-date="${dateString}" ${isPast ? '' : 'onclick="bookingCalendar.selectDate(\'' + dateString + '\')"'}>
                    <span class="calendar-date-number">${date}</span>
                    ${hasBookings && !isPast ? '<span class="calendar-date-status">•</span>' : ''}
                    ${tooltip ? '<span class="calendar-tooltip">' + tooltip + '</span>' : ''}
                </div>
            `;
        }
        
        return datesHTML;
    }

    selectDate(dateString) {
        this.selectedDate = new Date(dateString);
        this.selectedTime = null;
        
        // 캘린더 다시 렌더링
        document.getElementById('calendarDates').innerHTML = 
            this.generateDates(this.currentDate.getFullYear(), this.currentDate.getMonth());
        
        // 시간 슬롯 표시
        this.showTimeSlots(dateString);
        
        // 요약 정보 업데이트
        this.updateSummary();
    }

    showTimeSlots(dateString) {
        const timeSelection = document.getElementById('timeSelection');
        const timeSlotsContainer = document.getElementById('timeSlots');
        
        const availableSlots = [
            '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'
        ];
        
        const bookedSlots = this.bookedSlots[dateString] || [];
        
        let slotsHTML = '';
        availableSlots.forEach(slot => {
            const isBooked = bookedSlots.includes(slot);
            const classes = `time-slot ${isBooked ? 'booked' : ''} ${this.selectedTime === slot ? 'selected' : ''}`;
            
            slotsHTML += `
                <div class="${classes}" 
                     data-time="${slot}" 
                     ${isBooked ? '' : 'onclick="bookingCalendar.selectTime(\'' + slot + '\')"'}>
                    ${slot}
                </div>
            `;
        });
        
        timeSlotsContainer.innerHTML = slotsHTML;
        timeSelection.style.display = 'block';
    }

    selectTime(time) {
        this.selectedTime = time;
        
        // 시간 슬롯 업데이트
        document.querySelectorAll('.time-slot').forEach(slot => {
            if (slot.dataset.time === time) {
                slot.classList.add('selected');
            } else {
                slot.classList.remove('selected');
            }
        });
        
        // 요약 정보 업데이트
        this.updateSummary();
    }

    updateSummary() {
        const summarySection = document.getElementById('bookingSummary');
        const summaryDate = document.getElementById('summaryDate');
        const summaryTime = document.getElementById('summaryTime');
        
        if (this.selectedDate) {
            const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
            summaryDate.textContent = this.selectedDate.toLocaleDateString('ko-KR', options);
        }
        
        if (this.selectedTime) {
            summaryTime.textContent = this.selectedTime;
            summarySection.style.display = 'block';
        }
        
        // 다음 버튼 활성화
        if (this.selectedDate && this.selectedTime) {
            const nextBtn = document.getElementById('nextBtn');
            if (nextBtn) {
                nextBtn.disabled = false;
            }
        }
    }

    attachEventListeners() {
        // 이전/다음 달 네비게이션
        document.addEventListener('click', (e) => {
            if (e.target.id === 'prevMonth') {
                this.currentDate.setMonth(this.currentDate.getMonth() - 1);
                this.renderCalendar();
            } else if (e.target.id === 'nextMonth') {
                this.currentDate.setMonth(this.currentDate.getMonth() + 1);
                this.renderCalendar();
            }
        });
    }

    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    getSelectedDateTime() {
        if (this.selectedDate && this.selectedTime) {
            return {
                date: this.formatDate(this.selectedDate),
                time: this.selectedTime,
                dateObj: this.selectedDate
            };
        }
        return null;
    }
}

// 전역 인스턴스 생성
let bookingCalendar;

// DOM 준비 완료 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    const calendarSection = document.getElementById('calendarSection');
    if (calendarSection) {
        bookingCalendar = new BookingCalendar();
    }
});

// 예약 데이터 저장 함수
function saveBookingData() {
    const selectedDateTime = bookingCalendar.getSelectedDateTime();
    if (selectedDateTime) {
        // 기존 bookingData에 추가
        bookingData = {
            ...bookingData,
            date: selectedDateTime.date,
            time: selectedDateTime.time,
            dateFormatted: selectedDateTime.dateObj.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long'
            })
        };
        return true;
    }
    return false;
}
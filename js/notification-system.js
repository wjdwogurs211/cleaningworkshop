// 알림 시스템 JavaScript

// 알림 템플릿
const notificationTemplates = {
    // SMS 템플릿
    'booking-confirm-sms': {
        type: 'sms',
        name: '예약 확인 SMS',
        template: `[청소공작소] 
{{고객명}}님, 예약이 접수되었습니다.

📅 일시: {{예약날짜}} {{예약시간}}
🏠 서비스: {{서비스명}}
💰 예상금액: {{금액}}원

예약번호: {{예약번호}}
문의: 1588-0000`,
        active: true
    },
    
    'booking-confirmed-sms': {
        type: 'sms',
        name: '예약 확정 SMS',
        template: `[청소공작소]
{{고객명}}님의 예약이 확정되었습니다! ✅

📅 {{예약날짜}} {{예약시간}}
🧹 {{서비스명}}
👷 담당: {{담당자명}} 매니저

준비사항은 별도 안내드리겠습니다.
문의: 1588-0000`,
        active: true
    },
    
    'reminder-sms': {
        type: 'sms',
        name: '서비스 전날 리마인더',
        template: `[청소공작소]
{{고객명}}님, 내일 청소 예정입니다! 🏠

⏰ 내일 {{예약시간}} 방문 예정
📞 담당: {{담당자명}} {{담당자연락처}}

준비사항:
- 귀중품 보관
- 청소 공간 정리
- 주차 공간 확보

변경사항 있으시면 연락주세요!`,
        active: true
    },
    
    'complete-sms': {
        type: 'sms',
        name: '서비스 완료 SMS',
        template: `[청소공작소]
{{고객명}}님, 청소가 완료되었습니다! ✨

깨끗해진 공간이 마음에 드셨나요?
만족도 평가를 부탁드립니다.

⭐ 평가하기: {{평가링크}}

소중한 의견은 더 나은 서비스를 
만드는데 큰 도움이 됩니다.

감사합니다! 🙏`,
        active: true
    },
    
    // 이메일 템플릿
    'booking-confirm-email': {
        type: 'email',
        name: '예약 확인 이메일',
        subject: '청소공작소 예약이 확인되었습니다.',
        template: `안녕하세요 {{고객명}}님,

청소공작소를 이용해 주셔서 감사합니다.
아래와 같이 예약이 접수되었습니다.

━━━━━━━━━━━━━━━━━━━
예약 정보
━━━━━━━━━━━━━━━━━━━
• 예약번호: {{예약번호}}
• 서비스: {{서비스명}}
• 예약일시: {{예약날짜}} {{예약시간}}
• 주소: {{주소}}
• 예상금액: {{금액}}원

담당자가 24시간 이내에 연락드려 
상세 내용을 확인해 드리겠습니다.

감사합니다.

청소공작소 드림
문의: 1588-0000`,
        active: true
    }
};

// 알림 발송 클래스
class NotificationSystem {
    constructor() {
        this.templates = notificationTemplates;
        this.sendLog = [];
    }
    
    // 템플릿의 변수를 실제 값으로 치환
    replaceVariables(template, data) {
        let result = template;
        
        // 모든 변수를 치환
        Object.keys(data).forEach(key => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            result = result.replace(regex, data[key] || '');
        });
        
        return result;
    }
    
    // SMS 발송
    async sendSMS(phoneNumber, templateId, data) {
        const template = this.templates[templateId];
        
        if (!template || !template.active) {
            console.error('템플릿을 찾을 수 없거나 비활성화 상태입니다.');
            return false;
        }
        
        const message = this.replaceVariables(template.template, data);
        
        // 실제 환경에서는 SMS API 호출
        // 여기서는 시뮬레이션
        console.log('SMS 발송:', {
            to: phoneNumber,
            message: message
        });
        
        // 발송 로그 저장
        this.addLog({
            type: 'sms',
            templateId: templateId,
            templateName: template.name,
            recipient: phoneNumber,
            content: message,
            status: 'success',
            sentAt: new Date().toISOString()
        });
        
        return true;
    }
    
    // 이메일 발송
    async sendEmail(email, templateId, data) {
        const template = this.templates[templateId];
        
        if (!template || !template.active) {
            console.error('템플릿을 찾을 수 없거나 비활성화 상태입니다.');
            return false;
        }
        
        const subject = this.replaceVariables(template.subject || '', data);
        const body = this.replaceVariables(template.template, data);
        
        // 실제 환경에서는 이메일 API 호출
        // 여기서는 시뮬레이션
        console.log('이메일 발송:', {
            to: email,
            subject: subject,
            body: body
        });
        
        // 발송 로그 저장
        this.addLog({
            type: 'email',
            templateId: templateId,
            templateName: template.name,
            recipient: email,
            subject: subject,
            content: body,
            status: 'success',
            sentAt: new Date().toISOString()
        });
        
        return true;
    }
    
    // 예약 확인 알림 발송
    async sendBookingConfirmation(bookingData) {
        const data = {
            고객명: bookingData.customerName,
            예약번호: bookingData.bookingNumber,
            서비스명: this.getServiceName(bookingData.service),
            예약날짜: bookingData.date,
            예약시간: bookingData.time,
            주소: bookingData.address,
            금액: (bookingData.totalPrice || 0).toLocaleString()
        };
        
        // SMS 발송
        if (bookingData.customerPhone) {
            await this.sendSMS(bookingData.customerPhone, 'booking-confirm-sms', data);
        }
        
        // 이메일 발송
        if (bookingData.customerEmail) {
            await this.sendEmail(bookingData.customerEmail, 'booking-confirm-email', data);
        }
    }
    
    // 예약 확정 알림 발송
    async sendBookingConfirmed(bookingData, managerName = '김철수') {
        const data = {
            고객명: bookingData.customerName,
            예약날짜: bookingData.date,
            예약시간: bookingData.time,
            서비스명: this.getServiceName(bookingData.service),
            담당자명: managerName
        };
        
        if (bookingData.customerPhone) {
            await this.sendSMS(bookingData.customerPhone, 'booking-confirmed-sms', data);
        }
    }
    
    // 서비스 전날 리마인더
    async sendReminder(bookingData, managerInfo) {
        const data = {
            고객명: bookingData.customerName,
            예약시간: bookingData.time,
            담당자명: managerInfo.name,
            담당자연락처: managerInfo.phone
        };
        
        if (bookingData.customerPhone) {
            await this.sendSMS(bookingData.customerPhone, 'reminder-sms', data);
        }
    }
    
    // 서비스 완료 알림
    async sendCompletionNotice(bookingData) {
        const data = {
            고객명: bookingData.customerName,
            평가링크: `https://cleaningworkshop.co.kr/review/${bookingData.bookingNumber}`
        };
        
        if (bookingData.customerPhone) {
            await this.sendSMS(bookingData.customerPhone, 'complete-sms', data);
        }
    }
    
    // 서비스명 변환
    getServiceName(serviceCode) {
        const serviceNames = {
            'move-in': '입주청소',
            'ac': '에어컨청소',
            'sofa': '쇼파/침구청소',
            'window': '유리창청소'
        };
        
        return serviceNames[serviceCode] || serviceCode;
    }
    
    // 발송 로그 추가
    addLog(logData) {
        this.sendLog.push(logData);
        
        // 로컬 스토리지에 저장 (실제로는 서버에 저장)
        const logs = JSON.parse(localStorage.getItem('notificationLogs') || '[]');
        logs.push(logData);
        
        // 최근 1000개만 유지
        if (logs.length > 1000) {
            logs.splice(0, logs.length - 1000);
        }
        
        localStorage.setItem('notificationLogs', JSON.stringify(logs));
    }
    
    // 발송 로그 조회
    getLogs(filters = {}) {
        let logs = JSON.parse(localStorage.getItem('notificationLogs') || '[]');
        
        // 필터 적용
        if (filters.type) {
            logs = logs.filter(log => log.type === filters.type);
        }
        
        if (filters.status) {
            logs = logs.filter(log => log.status === filters.status);
        }
        
        if (filters.startDate) {
            logs = logs.filter(log => new Date(log.sentAt) >= new Date(filters.startDate));
        }
        
        if (filters.endDate) {
            logs = logs.filter(log => new Date(log.sentAt) <= new Date(filters.endDate));
        }
        
        // 최신 순으로 정렬
        logs.sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));
        
        return logs;
    }
    
    // 템플릿 업데이트
    updateTemplate(templateId, updates) {
        if (this.templates[templateId]) {
            this.templates[templateId] = {
                ...this.templates[templateId],
                ...updates
            };
            
            // 실제로는 서버에 저장
            console.log('템플릿 업데이트:', templateId, updates);
            return true;
        }
        
        return false;
    }
    
    // 자동 발송 스케줄러 (서비스 전날 리마인더)
    scheduleReminders() {
        // 매일 오전 10시에 실행
        const now = new Date();
        const scheduledTime = new Date();
        scheduledTime.setHours(10, 0, 0, 0);
        
        if (now > scheduledTime) {
            // 오늘은 이미 지났으므로 내일로 설정
            scheduledTime.setDate(scheduledTime.getDate() + 1);
        }
        
        const timeout = scheduledTime.getTime() - now.getTime();
        
        setTimeout(() => {
            this.sendDailyReminders();
            // 매일 반복
            setInterval(() => {
                this.sendDailyReminders();
            }, 24 * 60 * 60 * 1000);
        }, timeout);
    }
    
    // 내일 예약된 고객들에게 리마인더 발송
    async sendDailyReminders() {
        // 실제로는 서버에서 내일 예약 목록 조회
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];
        
        // 예약 목록 조회 (시뮬레이션)
        const bookings = []; // 서버에서 가져온 내일 예약 목록
        
        for (const booking of bookings) {
            await this.sendReminder(booking, {
                name: '김철수',
                phone: '010-1234-5678'
            });
        }
        
        console.log(`${bookings.length}명에게 리마인더 발송 완료`);
    }
}

// 전역 알림 시스템 인스턴스
const notificationSystem = new NotificationSystem();

// 예약 폼에서 사용할 수 있도록 전역 함수 export
window.sendBookingNotification = function(bookingData) {
    notificationSystem.sendBookingConfirmation(bookingData);
};

// 관리자 페이지에서 사용할 함수들
window.confirmBooking = function(bookingData) {
    notificationSystem.sendBookingConfirmed(bookingData);
};

window.completeService = function(bookingData) {
    notificationSystem.sendCompletionNotice(bookingData);
};

// 리마인더 스케줄 시작
notificationSystem.scheduleReminders();
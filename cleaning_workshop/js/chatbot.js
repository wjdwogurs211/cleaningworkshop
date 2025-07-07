// AI 챗봇 시스템
class CleaningLabChatbot {
    constructor() {
        this.isOpen = false;
        this.messageHistory = [];
        this.isTyping = false;
        this.quickReplies = [];
        
        // 챗봇 지식 베이스
        this.knowledgeBase = {
            greetings: [
                "안녕하세요! 청소공작소 AI 상담원입니다. 😊",
                "반갑습니다! 무엇을 도와드릴까요?",
                "환영합니다! 청소 서비스에 대해 궁금하신 점이 있으신가요?"
            ],
            
            services: {
                "입주청소": {
                    description: "새 집으로 이사하실 때 필요한 전문 청소 서비스입니다.",
                    price: "평수에 따라 20만원부터 시작",
                    duration: "20평 기준 4-5시간 소요",
                    includes: ["전체 실내 청소", "주방 기름때 제거", "욕실 곰팡이 제거", "창문 및 창틀 청소", "현관 및 베란다 청소"]
                },
                "에어컨청소": {
                    description: "에어컨 내부를 완벽하게 분해 청소하는 서비스입니다.",
                    price: "벽걸이 7만원, 스탠드 10만원",
                    duration: "1대당 1-2시간 소요",
                    includes: ["필터 세척", "열교환기 청소", "송풍팬 청소", "살균 소독", "실외기 청소(추가)"]
                },
                "쇼파청소": {
                    description: "전문 장비로 쇼파를 깨끗하게 청소하는 서비스입니다.",
                    price: "1인용 5만원부터",
                    duration: "2-3시간 소요",
                    includes: ["얼룩 제거", "진드기 제거", "살균 소독", "섬유 보호 코팅"]
                },
                "침구청소": {
                    description: "매트리스와 이불을 전문적으로 청소하는 서비스입니다.",
                    price: "매트리스 7만원부터",
                    duration: "2-3시간 소요",
                    includes: ["진드기 제거", "알레르기 유발 물질 제거", "얼룩 제거", "살균 소독"]
                },
                "유리창청소": {
                    description: "고층 건물도 안전하게 청소하는 전문 서비스입니다.",
                    price: "창문 개수와 층수에 따라 상이",
                    duration: "반나절 소요",
                    includes: ["외부 유리창 청소", "내부 유리창 청소", "창틀 청소", "방충망 청소"]
                }
            },
            
            faq: {
                "예약 방법": "홈페이지에서 '예약하기' 버튼을 클릭하시거나, 전화(1588-4954)로 예약하실 수 있습니다.",
                "결제 방법": "현장에서 현금, 카드 결제가 가능하며, 계좌이체도 가능합니다.",
                "취소 규정": "서비스 24시간 전까지 무료 취소 가능합니다. 당일 취소는 30% 위약금이 발생합니다.",
                "준비사항": "청소 도구는 저희가 모두 준비해갑니다. 귀중품만 안전한 곳에 보관해주세요.",
                "소요시간": "서비스 종류와 공간 크기에 따라 다르지만, 보통 2-5시간 정도 소요됩니다.",
                "직원 신원": "모든 직원은 신원 검증을 완료했으며, 손해배상보험에 가입되어 있습니다."
            }
        };
        
        this.init();
    }
    
    init() {
        this.createChatbotHTML();
        this.attachEventListeners();
        this.loadChatHistory();
    }
    
    createChatbotHTML() {
        // 챗봇 버튼
        const chatbotButton = document.createElement('div');
        chatbotButton.className = 'chatbot-button';
        chatbotButton.id = 'chatbotButton';
        chatbotButton.innerHTML = `
            <svg viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM9 11H7V13H9V11ZM13 11H11V13H13V11ZM17 11H15V13H17V11Z"/>
            </svg>
            <span class="chatbot-notification" style="display: none;">1</span>
        `;
        
        // 챗봇 컨테이너
        const chatbotContainer = document.createElement('div');
        chatbotContainer.className = 'chatbot-container';
        chatbotContainer.id = 'chatbotContainer';
        chatbotContainer.innerHTML = `
            <div class="chatbot-header">
                <div class="chatbot-header-info">
                    <div class="chatbot-avatar">🤖</div>
                    <div class="chatbot-title">
                        <div class="chatbot-name">청소공작소 AI</div>
                        <div class="chatbot-status">
                            <span class="status-dot"></span>
                            <span>온라인</span>
                        </div>
                    </div>
                </div>
                <button class="chatbot-close" id="chatbotClose">×</button>
            </div>
            
            <div class="chatbot-messages" id="chatbotMessages">
                <div class="welcome-message">
                    <h3>청소공작소에 오신 것을 환영합니다!</h3>
                    <p>궁금하신 점이 있으시면 편하게 물어보세요.<br>24시간 친절하게 답변해드립니다.</p>
                </div>
            </div>
            
            <div class="chatbot-input-area">
                <div class="chatbot-input-wrapper">
                    <input type="text" class="chatbot-input" id="chatbotInput" 
                           placeholder="메시지를 입력하세요..." maxlength="200">
                    <button class="chatbot-send-btn" id="chatbotSend">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
        
        // DOM에 추가
        document.body.appendChild(chatbotButton);
        document.body.appendChild(chatbotContainer);
    }
    
    attachEventListeners() {
        const button = document.getElementById('chatbotButton');
        const container = document.getElementById('chatbotContainer');
        const closeBtn = document.getElementById('chatbotClose');
        const input = document.getElementById('chatbotInput');
        const sendBtn = document.getElementById('chatbotSend');
        
        // 챗봇 열기/닫기
        button.addEventListener('click', () => this.toggleChat());
        closeBtn.addEventListener('click', () => this.closeChat());
        
        // 메시지 전송
        sendBtn.addEventListener('click', () => this.sendMessage());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // 입력 상태 체크
        input.addEventListener('input', () => {
            sendBtn.disabled = !input.value.trim();
        });
    }
    
    toggleChat() {
        this.isOpen = !this.isOpen;
        const container = document.getElementById('chatbotContainer');
        
        if (this.isOpen) {
            container.classList.add('active');
            document.getElementById('chatbotInput').focus();
            
            // 첫 방문시 인사말
            if (this.messageHistory.length === 0) {
                setTimeout(() => {
                    this.addBotMessage(this.knowledgeBase.greetings[0]);
                    this.showQuickReplies([
                        "서비스 안내",
                        "요금 문의",
                        "예약하기",
                        "자주 묻는 질문"
                    ]);
                }, 500);
            }
        } else {
            container.classList.remove('active');
        }
    }
    
    closeChat() {
        this.isOpen = false;
        document.getElementById('chatbotContainer').classList.remove('active');
    }
    
    sendMessage() {
        const input = document.getElementById('chatbotInput');
        const message = input.value.trim();
        
        if (!message) return;
        
        // 사용자 메시지 추가
        this.addUserMessage(message);
        
        // 입력 초기화
        input.value = '';
        input.focus();
        
        // 봇 응답 처리
        this.processMessage(message);
    }
    
    addUserMessage(message) {
        const messagesContainer = document.getElementById('chatbotMessages');
        const messageEl = document.createElement('div');
        messageEl.className = 'message user';
        messageEl.innerHTML = `
            <div class="message-avatar">👤</div>
            <div class="message-content">${message}</div>
        `;
        messagesContainer.appendChild(messageEl);
        this.scrollToBottom();
        
        // 메시지 히스토리에 저장
        this.messageHistory.push({ type: 'user', content: message, time: new Date() });
    }
    
    addBotMessage(message, options = {}) {
        const messagesContainer = document.getElementById('chatbotMessages');
        
        // 타이핑 인디케이터 표시
        this.showTypingIndicator();
        
        setTimeout(() => {
            this.hideTypingIndicator();
            
            const messageEl = document.createElement('div');
            messageEl.className = 'message bot';
            messageEl.innerHTML = `
                <div class="message-avatar">🤖</div>
                <div class="message-content">${message}</div>
            `;
            messagesContainer.appendChild(messageEl);
            this.scrollToBottom();
            
            // 메시지 히스토리에 저장
            this.messageHistory.push({ type: 'bot', content: message, time: new Date() });
        }, 1000);
    }
    
    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatbotMessages');
        const typingEl = document.createElement('div');
        typingEl.className = 'message bot typing-message';
        typingEl.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="typing-indicator">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
            </div>
        `;
        messagesContainer.appendChild(typingEl);
        this.scrollToBottom();
    }
    
    hideTypingIndicator() {
        const typingMessage = document.querySelector('.typing-message');
        if (typingMessage) {
            typingMessage.remove();
        }
    }
    
    showQuickReplies(replies) {
        const messagesContainer = document.getElementById('chatbotMessages');
        const quickRepliesEl = document.createElement('div');
        quickRepliesEl.className = 'quick-replies';
        
        replies.forEach(reply => {
            const button = document.createElement('button');
            button.className = 'quick-reply-btn';
            button.textContent = reply;
            button.onclick = () => {
                document.getElementById('chatbotInput').value = reply;
                this.sendMessage();
                quickRepliesEl.remove();
            };
            quickRepliesEl.appendChild(button);
        });
        
        messagesContainer.appendChild(quickRepliesEl);
        this.scrollToBottom();
    }
    
    processMessage(message) {
        const lowerMessage = message.toLowerCase();
        
        // 인사말 처리
        if (this.containsKeywords(lowerMessage, ['안녕', '하이', 'hi', 'hello'])) {
            this.addBotMessage(this.knowledgeBase.greetings[Math.floor(Math.random() * this.knowledgeBase.greetings.length)]);
            this.showQuickReplies(["서비스 안내", "요금 문의", "예약하기"]);
            return;
        }
        
        // 서비스 문의
        if (this.containsKeywords(lowerMessage, ['서비스', '청소', '종류', '뭐가 있', '어떤'])) {
            this.showServiceList();
            return;
        }
        
        // 특정 서비스 문의
        for (const [service, info] of Object.entries(this.knowledgeBase.services)) {
            if (lowerMessage.includes(service.replace('청소', ''))) {
                this.showServiceDetail(service, info);
                return;
            }
        }
        
        // 요금 문의
        if (this.containsKeywords(lowerMessage, ['요금', '가격', '비용', '얼마'])) {
            this.showPriceInfo();
            return;
        }
        
        // 예약 문의
        if (this.containsKeywords(lowerMessage, ['예약', '신청', '언제', '가능'])) {
            this.showBookingInfo();
            return;
        }
        
        // FAQ 처리
        for (const [question, answer] of Object.entries(this.knowledgeBase.faq)) {
            if (this.containsKeywords(lowerMessage, question.split(' '))) {
                this.addBotMessage(answer);
                this.showQuickReplies(["다른 질문", "예약하기", "상담원 연결"]);
                return;
            }
        }
        
        // 기본 응답
        this.addBotMessage("죄송합니다. 정확한 답변을 찾지 못했습니다. 다른 방법으로 질문해주시거나, 아래 옵션을 선택해주세요.");
        this.showQuickReplies(["서비스 안내", "요금 문의", "예약하기", "상담원 연결"]);
    }
    
    containsKeywords(text, keywords) {
        return keywords.some(keyword => text.includes(keyword));
    }
    
    showServiceList() {
        let message = "청소공작소에서 제공하는 서비스입니다:\n\n";
        Object.keys(this.knowledgeBase.services).forEach(service => {
            message += `• ${service}\n`;
        });
        message += "\n어떤 서비스에 대해 자세히 알고 싶으신가요?";
        
        this.addBotMessage(message);
        this.showQuickReplies(Object.keys(this.knowledgeBase.services));
    }
    
    showServiceDetail(serviceName, serviceInfo) {
        let message = `<strong>${serviceName}</strong>\n\n`;
        message += `📝 ${serviceInfo.description}\n\n`;
        message += `💰 요금: ${serviceInfo.price}\n`;
        message += `⏱️ 소요시간: ${serviceInfo.duration}\n\n`;
        message += `✨ 포함 서비스:\n`;
        serviceInfo.includes.forEach(item => {
            message += `  • ${item}\n`;
        });
        
        this.addBotMessage(message);
        this.showQuickReplies(["예약하기", "다른 서비스 보기", "상담원 연결"]);
    }
    
    showPriceInfo() {
        let message = "💰 <strong>서비스별 요금 안내</strong>\n\n";
        for (const [service, info] of Object.entries(this.knowledgeBase.services)) {
            message += `• ${service}: ${info.price}\n`;
        }
        message += "\n※ 정확한 견적은 현장 상황에 따라 달라질 수 있습니다.";
        
        this.addBotMessage(message);
        this.showQuickReplies(["예약하기", "할인 혜택", "상담원 연결"]);
    }
    
    showBookingInfo() {
        const message = `📅 <strong>예약 방법 안내</strong>\n\n` +
                       `1. 온라인 예약: '예약하기' 버튼 클릭\n` +
                       `2. 전화 예약: 1588-4954\n` +
                       `3. 카카오톡 상담: @청소공작소\n\n` +
                       `⏰ 운영시간: 평일 09:00 - 18:00\n` +
                       `📍 서비스 지역: 서울/경기 전지역`;
        
        this.addBotMessage(message);
        
        // 예약 버튼 카드 추가
        setTimeout(() => {
            this.addBookingCard();
        }, 1500);
    }
    
    addBookingCard() {
        const messagesContainer = document.getElementById('chatbotMessages');
        const cardEl = document.createElement('div');
        cardEl.className = 'message bot';
        cardEl.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="booking-card">
                <div class="booking-card-header">
                    📋 빠른 예약
                </div>
                <div class="booking-info">
                    <div class="booking-info-item">
                        <span class="booking-info-label">예약 가능 시간</span>
                        <span class="booking-info-value">09:00 - 18:00</span>
                    </div>
                    <div class="booking-info-item">
                        <span class="booking-info-label">최소 예약 시간</span>
                        <span class="booking-info-value">24시간 전</span>
                    </div>
                </div>
                <div class="booking-action">
                    <button class="booking-action-btn" onclick="window.location.href='booking.html'">
                        지금 예약하기
                    </button>
                </div>
            </div>
        `;
        messagesContainer.appendChild(cardEl);
        this.scrollToBottom();
    }
    
    scrollToBottom() {
        const messagesContainer = document.getElementById('chatbotMessages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    loadChatHistory() {
        // 로컬 스토리지에서 이전 대화 내역 로드 (필요시)
        const savedHistory = localStorage.getItem('chatHistory');
        if (savedHistory) {
            this.messageHistory = JSON.parse(savedHistory);
        }
    }
    
    saveChatHistory() {
        // 대화 내역 저장 (필요시)
        localStorage.setItem('chatHistory', JSON.stringify(this.messageHistory));
    }
}

// 챗봇 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 챗봇 인스턴스 생성
    window.cleaningLabChatbot = new CleaningLabChatbot();
    
    // 5초 후 자동으로 챗봇 알림 표시
    setTimeout(() => {
        const notification = document.querySelector('.chatbot-notification');
        if (notification) {
            notification.style.display = 'flex';
        }
    }, 5000);
});
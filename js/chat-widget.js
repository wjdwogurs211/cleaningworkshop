// 청연 실시간 채팅 위젯
(function() {
    'use strict';

    // 채팅 위젯 HTML 생성
    const chatWidgetHTML = `
        <div id="chat-widget" class="chat-widget">
            <div class="chat-button" onclick="toggleChat()">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                </svg>
                <span class="chat-notification">1</span>
            </div>
            
            <div class="chat-box" id="chat-box">
                <div class="chat-header">
                    <h3>청연 고객센터</h3>
                    <button class="chat-close" onclick="toggleChat()">×</button>
                </div>
                
                <div class="chat-messages" id="chat-messages">
                    <div class="chat-message bot">
                        <div class="message-content">
                            안녕하세요! 청연입니다 👋<br>
                            무엇을 도와드릴까요?
                        </div>
                    </div>
                </div>
                
                <div class="chat-quick-replies">
                    <button onclick="sendQuickReply('가격 문의')">💰 가격 문의</button>
                    <button onclick="sendQuickReply('예약 방법')">📅 예약 방법</button>
                    <button onclick="sendQuickReply('서비스 지역')">📍 서비스 지역</button>
                </div>
                
                <div class="chat-input-area">
                    <input type="text" id="chat-input" placeholder="메시지를 입력하세요..." onkeypress="handleKeyPress(event)">
                    <button onclick="sendMessage()">전송</button>
                </div>
            </div>
        </div>
    `;

    // 채팅 위젯 스타일
    const chatWidgetStyle = `
        <style>
        .chat-widget {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans KR', sans-serif;
        }

        .chat-button {
            width: 60px;
            height: 60px;
            background: #0066FF;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0, 102, 255, 0.3);
            transition: all 0.3s ease;
            position: relative;
        }

        .chat-button:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(0, 102, 255, 0.4);
        }

        .chat-notification {
            position: absolute;
            top: -5px;
            right: -5px;
            background: #FF6B6B;
            color: white;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
        }

        .chat-box {
            position: absolute;
            bottom: 80px;
            right: 0;
            width: 350px;
            height: 500px;
            background: white;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
            display: none;
            flex-direction: column;
            overflow: hidden;
            animation: slideUp 0.3s ease;
        }

        .chat-box.active {
            display: flex;
        }

        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .chat-header {
            background: #0066FF;
            color: white;
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .chat-header h3 {
            margin: 0;
            font-size: 18px;
        }

        .chat-close {
            background: none;
            border: none;
            color: white;
            font-size: 28px;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            background: #F8F9FA;
        }

        .chat-message {
            margin-bottom: 15px;
            display: flex;
        }

        .chat-message.user {
            justify-content: flex-end;
        }

        .message-content {
            max-width: 70%;
            padding: 12px 16px;
            border-radius: 18px;
            font-size: 14px;
            line-height: 1.4;
        }

        .chat-message.bot .message-content {
            background: white;
            color: #333;
        }

        .chat-message.user .message-content {
            background: #0066FF;
            color: white;
        }

        .chat-quick-replies {
            padding: 10px;
            background: white;
            border-top: 1px solid #E5E7EB;
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        }

        .chat-quick-replies button {
            padding: 8px 16px;
            border: 1px solid #E5E7EB;
            background: white;
            border-radius: 20px;
            cursor: pointer;
            font-size: 13px;
            transition: all 0.2s ease;
        }

        .chat-quick-replies button:hover {
            background: #F8F9FA;
            border-color: #0066FF;
            color: #0066FF;
        }

        .chat-input-area {
            padding: 15px;
            background: white;
            border-top: 1px solid #E5E7EB;
            display: flex;
            gap: 10px;
        }

        .chat-input-area input {
            flex: 1;
            padding: 10px 15px;
            border: 1px solid #E5E7EB;
            border-radius: 25px;
            outline: none;
            font-size: 14px;
        }

        .chat-input-area input:focus {
            border-color: #0066FF;
        }

        .chat-input-area button {
            padding: 10px 20px;
            background: #0066FF;
            color: white;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.2s ease;
        }

        .chat-input-area button:hover {
            background: #0052CC;
        }

        @media (max-width: 768px) {
            .chat-box {
                width: 100%;
                height: 100%;
                bottom: 0;
                right: 0;
                border-radius: 0;
            }
        }
        </style>
    `;

    // DOM에 채팅 위젯 추가
    document.body.insertAdjacentHTML('beforeend', chatWidgetStyle + chatWidgetHTML);

    // 채팅 관련 함수들
    window.toggleChat = function() {
        const chatBox = document.getElementById('chat-box');
        chatBox.classList.toggle('active');
        
        // 알림 제거
        const notification = document.querySelector('.chat-notification');
        if (notification && chatBox.classList.contains('active')) {
            notification.style.display = 'none';
        }
    };

    window.sendMessage = function() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (message) {
            addMessage(message, 'user');
            input.value = '';
            
            // 봇 응답 시뮬레이션
            setTimeout(() => {
                const response = getBotResponse(message);
                addMessage(response, 'bot');
            }, 1000);
        }
    };

    window.sendQuickReply = function(text) {
        addMessage(text, 'user');
        setTimeout(() => {
            const response = getBotResponse(text);
            addMessage(response, 'bot');
        }, 1000);
    };

    window.handleKeyPress = function(event) {
        if (event.key === 'Enter') {
            sendMessage();
        }
    };

    function addMessage(text, sender) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}`;
        messageDiv.innerHTML = `<div class="message-content">${text}</div>`;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function getBotResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('가격') || lowerMessage.includes('비용')) {
            return '집청소 서비스는 평수에 따라 51,100원부터 시작합니다.<br><br>정확한 견적은 앱에서 주소를 입력하시면 확인하실 수 있어요! 😊';
        } else if (lowerMessage.includes('예약') || lowerMessage.includes('신청')) {
            return '청연 앱을 다운로드하신 후:<br>1. 서비스 선택<br>2. 날짜와 시간 선택<br>3. 주소 입력<br>4. 결제 수단 등록<br><br>간단하게 예약 완료! 📱';
        } else if (lowerMessage.includes('지역') || lowerMessage.includes('어디')) {
            return '서울, 경기, 인천을 비롯해 전국 주요 도시에서 서비스를 이용하실 수 있습니다.<br><br>정확한 서비스 가능 지역은 앱에서 확인해주세요! 🗺️';
        } else if (lowerMessage.includes('시간') || lowerMessage.includes('언제')) {
            return '청소 시간은 평수에 따라 다릅니다:<br>• 19평 이하: 3시간 30분<br>• 20-34평: 4시간<br>• 35-44평: 4시간 30분<br>• 45평 이상: 5시간';
        } else {
            return '자세한 문의는 앱 내 고객센터를 이용해주세요.<br>365일 언제나 친절히 답변드리겠습니다! 💙<br><br>전화 문의: 1588-0000';
        }
    }

    // 페이지 로드 후 3초 뒤에 채팅 알림 표시
    setTimeout(() => {
        const notification = document.querySelector('.chat-notification');
        if (notification) {
            notification.style.display = 'flex';
        }
    }, 3000);

})();
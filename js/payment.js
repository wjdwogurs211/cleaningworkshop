// 토스페이먼츠 결제 모듈
class PaymentManager {
  constructor() {
    this.clientKey = 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq'; // 테스트 클라이언트 키
    this.tossPayments = null;
    this.initTossPayments();
  }

  // 토스페이먼츠 SDK 초기화
  async initTossPayments() {
    if (typeof TossPayments !== 'undefined') {
      this.tossPayments = TossPayments(this.clientKey);
    } else {
      console.error('토스페이먼츠 SDK가 로드되지 않았습니다.');
    }
  }

  // 결제 위젯 렌더링
  async renderPaymentWidget(containerId, amount, orderId, orderName) {
    if (!this.tossPayments) {
      alert('결제 시스템을 초기화하는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    try {
      const paymentWidget = this.tossPayments.widgets({
        customerKey: this.generateCustomerKey(),
      });

      await paymentWidget.setAmount({
        currency: 'KRW',
        value: amount,
      });

      const paymentMethodWidget = paymentWidget.renderPaymentMethods(
        `#${containerId}`,
        { value: amount }
      );

      return {
        widget: paymentWidget,
        paymentMethodWidget
      };
    } catch (error) {
      console.error('결제 위젯 렌더링 실패:', error);
      throw error;
    }
  }

  // 결제 요청
  async requestPayment(bookingData) {
    try {
      const { bookingId, amount, orderName, customerName, customerEmail, customerPhone } = bookingData;

      // 백엔드에 결제 요청
      const response = await CleaningLabAPI.payments.request({
        bookingId,
        paymentMethod: 'card',
        successUrl: window.location.origin + '/booking-complete.html',
        failUrl: window.location.origin + '/booking.html?error=payment_failed'
      });

      if (response.success) {
        // 토스페이먼츠 결제창 열기
        await this.tossPayments.requestPayment('카드', {
          amount,
          orderId: response.data.orderId,
          orderName,
          customerName,
          customerEmail,
          customerMobilePhone: customerPhone.replace(/-/g, ''),
          successUrl: response.data.checkoutUrl || window.location.origin + '/payment-success.html',
          failUrl: window.location.origin + '/payment-fail.html'
        });
      }
    } catch (error) {
      console.error('결제 요청 실패:', error);
      throw error;
    }
  }

  // 간편 결제 (토스페이, 카카오페이 등)
  async requestEasyPayment(bookingData, method) {
    try {
      const { bookingId, amount, orderName } = bookingData;

      // 백엔드에 결제 요청
      const response = await CleaningLabAPI.payments.request({
        bookingId,
        paymentMethod: method === 'tosspay' ? 'toss_pay' : 'kakao_pay'
      });

      if (response.success && response.data.checkoutUrl) {
        // 결제 페이지로 리다이렉트
        window.location.href = response.data.checkoutUrl;
      }
    } catch (error) {
      console.error('간편결제 요청 실패:', error);
      throw error;
    }
  }

  // 결제 승인
  async confirmPayment(paymentKey, orderId, amount) {
    try {
      const response = await CleaningLabAPI.payments.confirm({
        paymentKey,
        orderId,
        amount
      });

      return response;
    } catch (error) {
      console.error('결제 승인 실패:', error);
      throw error;
    }
  }

  // 결제 취소
  async cancelPayment(paymentId, reason) {
    try {
      const response = await CleaningLabAPI.payments.cancel(paymentId, reason);
      return response;
    } catch (error) {
      console.error('결제 취소 실패:', error);
      throw error;
    }
  }

  // 고객 키 생성
  generateCustomerKey() {
    const user = tokenManager.getUser();
    if (user && user._id) {
      return `USER_${user._id}`;
    }
    return `GUEST_${Date.now()}`;
  }

  // 결제 금액 포맷팅
  formatAmount(amount) {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount);
  }

  // 결제 상태 확인
  async checkPaymentStatus(orderId) {
    try {
      const params = new URLSearchParams(window.location.search);
      const paymentKey = params.get('paymentKey');
      const amount = params.get('amount');

      if (paymentKey && orderId && amount) {
        return await this.confirmPayment(paymentKey, orderId, parseInt(amount));
      }
      return null;
    } catch (error) {
      console.error('결제 상태 확인 실패:', error);
      return null;
    }
  }
}

// 전역 결제 매니저 인스턴스
const paymentManager = new PaymentManager();

// 결제 성공 페이지 처리
if (window.location.pathname.includes('payment-success') || window.location.pathname.includes('booking-complete')) {
  document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('orderId');
    
    if (orderId) {
      const result = await paymentManager.checkPaymentStatus(orderId);
      
      if (result && result.success) {
        // 결제 성공 UI 표시
        const successMessage = document.getElementById('payment-success-message');
        if (successMessage) {
          successMessage.innerHTML = `
            <div class="success-icon">✓</div>
            <h2>결제가 완료되었습니다!</h2>
            <p>예약번호: ${result.data.booking.bookingNumber}</p>
            <p>결제금액: ${paymentManager.formatAmount(result.data.booking.pricing.totalPrice)}</p>
            <a href="/bookings" class="btn btn-primary">예약 내역 보기</a>
          `;
        }
      } else {
        // 결제 실패 처리
        alert('결제 처리 중 오류가 발생했습니다.');
        window.location.href = '/booking.html';
      }
    }
  });
}

// 결제 실패 페이지 처리
if (window.location.pathname.includes('payment-fail')) {
  document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const message = params.get('message') || '결제가 취소되었습니다.';
    
    const failMessage = document.getElementById('payment-fail-message');
    if (failMessage) {
      failMessage.innerHTML = `
        <div class="fail-icon">✕</div>
        <h2>결제 실패</h2>
        <p>${message}</p>
        <a href="/booking.html" class="btn btn-primary">다시 시도하기</a>
      `;
    }
  });
}
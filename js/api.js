// API 기본 설정
const API_BASE_URL = 'http://localhost:5000/api';

// 토큰 관리
const tokenManager = {
  getToken: () => localStorage.getItem('authToken'),
  setToken: (token) => localStorage.setItem('authToken', token),
  removeToken: () => localStorage.removeItem('authToken'),
  getUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
  setUser: (user) => localStorage.setItem('user', JSON.stringify(user)),
  removeUser: () => localStorage.removeItem('user')
};

// API 요청 헬퍼
const apiRequest = async (url, options = {}) => {
  const token = tokenManager.getToken();
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  };

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || '요청 처리 중 오류가 발생했습니다.');
  }

  return data;
};

// API 함수들
const api = {
  // 인증 관련
  auth: {
    signup: async (userData) => {
      const response = await apiRequest('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
      
      if (response.token) {
        tokenManager.setToken(response.token);
        tokenManager.setUser(response.data.user);
      }
      
      return response;
    },

    login: async (email, password) => {
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      
      if (response.token) {
        tokenManager.setToken(response.token);
        tokenManager.setUser(response.data.user);
      }
      
      return response;
    },

    logout: async () => {
      await apiRequest('/auth/logout', { method: 'POST' });
      tokenManager.removeToken();
      tokenManager.removeUser();
    },

    getMe: async () => {
      return await apiRequest('/auth/me');
    }
  },

  // 예약 관련
  bookings: {
    create: async (bookingData) => {
      return await apiRequest('/bookings', {
        method: 'POST',
        body: JSON.stringify(bookingData)
      });
    },

    getList: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return await apiRequest(`/bookings?${queryString}`);
    },

    getById: async (id) => {
      return await apiRequest(`/bookings/${id}`);
    },

    update: async (id, updateData) => {
      return await apiRequest(`/bookings/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updateData)
      });
    },

    cancel: async (id, reason) => {
      return await apiRequest(`/bookings/${id}/cancel`, {
        method: 'PATCH',
        body: JSON.stringify({ reason })
      });
    },

    getAvailableSlots: async (date) => {
      return await apiRequest(`/bookings/available-slots/${date}`);
    }
  },

  // 서비스 관련
  services: {
    getAll: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return await apiRequest(`/services?${queryString}`);
    },

    getById: async (id) => {
      return await apiRequest(`/services/${id}`);
    },

    getByCategory: async (category) => {
      return await apiRequest(`/services/category/${category}`);
    }
  },

  // 리뷰 관련
  reviews: {
    create: async (reviewData) => {
      return await apiRequest('/reviews', {
        method: 'POST',
        body: JSON.stringify(reviewData)
      });
    },

    getList: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return await apiRequest(`/reviews?${queryString}`);
    },

    getServiceReviews: async (serviceId, params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return await apiRequest(`/reviews/service/${serviceId}?${queryString}`);
    },

    update: async (id, updateData) => {
      return await apiRequest(`/reviews/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updateData)
      });
    },

    delete: async (id) => {
      return await apiRequest(`/reviews/${id}`, {
        method: 'DELETE'
      });
    },

    toggleHelpful: async (id) => {
      return await apiRequest(`/reviews/${id}/helpful`, {
        method: 'POST'
      });
    }
  },

  // 사용자 관련
  users: {
    getProfile: async () => {
      return await apiRequest('/users/profile');
    },

    updateProfile: async (updateData) => {
      return await apiRequest('/users/profile', {
        method: 'PATCH',
        body: JSON.stringify(updateData)
      });
    },

    addAddress: async (address) => {
      return await apiRequest('/users/addresses', {
        method: 'POST',
        body: JSON.stringify(address)
      });
    },

    getFavoriteCleaners: async () => {
      return await apiRequest('/users/favorite-cleaners');
    },

    addFavoriteCleaner: async (cleanerId) => {
      return await apiRequest(`/users/favorite-cleaners/${cleanerId}`, {
        method: 'POST'
      });
    }
  },

  // 결제 관련
  payments: {
    request: async (paymentData) => {
      return await apiRequest('/payments/request', {
        method: 'POST',
        body: JSON.stringify(paymentData)
      });
    },

    confirm: async (confirmData) => {
      return await apiRequest('/payments/confirm', {
        method: 'POST',
        body: JSON.stringify(confirmData)
      });
    },

    cancel: async (paymentId, reason) => {
      return await apiRequest(`/payments/cancel/${paymentId}`, {
        method: 'POST',
        body: JSON.stringify({ reason })
      });
    },

    getHistory: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return await apiRequest(`/payments/history?${queryString}`);
    }
  }
};

// 전역 객체로 내보내기
window.CleaningLabAPI = api;
window.tokenManager = tokenManager;
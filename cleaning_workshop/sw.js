// 청소공작소 Service Worker
const CACHE_NAME = 'cleaning-workshop-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/css/hero-banner.css',
  '/css/chatbot.css',
  '/js/hero-banner.js',
  '/js/chatbot.js',
  '/booking.html',
  '/css/booking.css',
  '/css/calendar.css',
  '/js/booking.js',
  '/js/calendar-booking.js',
  '/our-story.html',
  '/css/our-story.css',
  '/reviews.html',
  '/css/review.css',
  '/logo.svg',
  '/images/hero_main.png',
  '/images/banner1.png',
  '/images/banner2.png',
  '/images/banner3.png',
  '/images/story-1.jpg',
  '/images/story-2.jpg',
  '/images/story-3.jpg',
  '/images/story-4.jpg'
];

// 설치 이벤트 - 캐시에 파일 저장
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('캐시에 파일 저장 중');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// 활성화 이벤트 - 오래된 캐시 정리
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('오래된 캐시 삭제:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch 이벤트 - 네트워크 요청 가로채기
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 캐시에 있으면 캐시에서 반환
        if (response) {
          return response;
        }

        // 네트워크 요청
        return fetch(event.request).then(response => {
          // 응답이 유효하지 않으면 그대로 반환
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // 응답 복제
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
      .catch(() => {
        // 오프라인 페이지 표시
        if (event.request.destination === 'document') {
          return caches.match('/offline.html');
        }
      })
  );
});

// 푸시 알림 수신
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : '청소공작소에서 알림이 도착했습니다.',
    icon: '/images/icon-192x192.png',
    badge: '/images/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: '확인하기',
        icon: '/images/checkmark.png'
      },
      {
        action: 'close',
        title: '닫기',
        icon: '/images/close.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('청소공작소', options)
  );
});

// 푸시 알림 클릭
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'explore') {
    // 예약 페이지로 이동
    event.waitUntil(
      clients.openWindow('/booking.html')
    );
  }
});

// 백그라운드 동기화
self.addEventListener('sync', event => {
  if (event.tag === 'sync-bookings') {
    event.waitUntil(syncBookings());
  }
});

async function syncBookings() {
  // 오프라인에서 만든 예약을 서버와 동기화
  const pendingBookings = await getPendingBookings();
  
  for (const booking of pendingBookings) {
    try {
      const response = await fetch('/api/bookings/guest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(booking)
      });

      if (response.ok) {
        await removePendingBooking(booking.id);
      }
    } catch (error) {
      console.error('예약 동기화 실패:', error);
    }
  }
}

// IndexedDB에서 대기 중인 예약 가져오기
async function getPendingBookings() {
  // IndexedDB 구현 (간단한 예시)
  return [];
}

async function removePendingBooking(id) {
  // IndexedDB에서 예약 삭제
}
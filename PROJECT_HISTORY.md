# 🧹 청소공작소 프로젝트 히스토리

## 👬 팀 소개
- **솔로드**: 세계적 수준의 개발자이자 너의 형제
- **형제**: 청소공작소의 공동 창업자

## 📅 프로젝트 진행 과정

### 1단계: 프론트엔드 웹사이트 구축
- **위치**: `/cleaning_workshop/`
- **주요 페이지**:
  - `index.html` - 메인 페이지
  - `booking.html` - 5단계 예약 시스템
  - `signup.html` / `login.html` - 회원 시스템
  - `ai-image-generator.html` - AI 이미지 생성기
  - 각종 서비스 페이지들

### 2단계: 백엔드 시스템 구축
- **위치**: `/backend/`
- **기술 스택**:
  - Node.js + Express.js
  - MongoDB (데이터베이스)
  - JWT 인증
  - 토스페이먼츠 결제 연동

### 3단계: 데이터베이스 설정
- **MongoDB 설치 완료**
- **데이터베이스명**: `cleaninglab`
- **컬렉션**: users, bookings, services, reviews

### 4단계: API 연동
- **백엔드 서버**: http://localhost:5000
- **프론트엔드**: http://localhost:8080
- **API 엔드포인트**: `/api/auth`, `/api/bookings`, `/api/services` 등

### 5단계: Google Imagen 3 연동
- **프로젝트 ID**: gen-lang-client-0866235587
- **자격증명 파일**: `backend/google-credentials.json`
- **AI 이미지 생성 기능 구현**

## 🚀 서버 실행 방법

### 백엔드 서버
```bash
cd C:\Users\cksgo\OneDrive\바탕 화면\extracted_files\cleaninglab_clone\backend
node src/server.js
```

### 프론트엔드 서버
```bash
cd C:\Users\cksgo\OneDrive\바탕 화면\extracted_files\cleaninglab_clone
python start_server.py
```

## 🔧 주요 설정 사항

### 환경변수 (.env)
- MongoDB URI: `mongodb://localhost:27017/cleaninglab`
- JWT Secret: 설정됨
- 토스페이먼츠 테스트 키: 설정됨
- Google Cloud 자격증명: 설정됨

### CORS 설정
- 프론트엔드 포트: 8080
- 백엔드 포트: 5000

## 📝 다음에 이어서 할 일
1. 실제 도메인 구매 및 배포
2. 토스페이먼츠 실제 가맹점 등록
3. 이메일 발송 시스템 구축
4. 모바일 앱 개발

## 💡 특별 메모
- 전화번호 형식: 하이픈 포함/미포함 모두 가능
- 예약 시스템: 날짜/시간 선택 → 고객정보 → 결제
- AI 이미지: 로그인 필요

## 🎯 프로젝트 목표
실제로 운영 가능한 청소 서비스 플랫폼 구축!

---
형제, 우리가 함께 만든 최고의 작품! 💪
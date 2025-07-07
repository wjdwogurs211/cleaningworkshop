# 🚀 청소공작소 백엔드 배포 가이드 (Render.com)

형제! 이 가이드 따라하면 혼자서도 백엔드 배포 가능해!

## 📋 준비물
- GitHub 계정 (이미 있음 ✓)
- Render.com 계정 (무료)
- MongoDB Atlas (이미 설정됨 ✓)

## 🔧 단계별 가이드

### 1단계: backend 폴더만 따로 GitHub 레포지토리 만들기

```bash
# 1. backend 폴더를 복사
cd /mnt/c/Users/cksgo/OneDrive/바탕 화면/
cp -r extracted_files/cleaninglab_clone/backend cleaningworkshop-backend

# 2. 새 Git 저장소 초기화
cd cleaningworkshop-backend
git init
git add .
git commit -m "Initial backend commit"
```

### 2단계: GitHub에 새 레포지토리 생성
1. GitHub.com 접속
2. New repository 클릭
3. Repository name: `cleaningworkshop-backend`
4. Public 선택
5. Create repository

### 3단계: 코드 푸시
```bash
git remote add origin https://github.com/wjdwogurs211/cleaningworkshop-backend.git
git branch -M main
git push -u origin main
```

### 4단계: Render.com 설정
1. https://render.com 접속
2. GitHub로 가입/로그인
3. "New +" → "Web Service" 클릭
4. GitHub 연동 후 `cleaningworkshop-backend` 선택

### 5단계: Render 서비스 설정
- **Name**: cleaningworkshop-backend
- **Region**: Singapore (아시아)
- **Branch**: main
- **Runtime**: Node
- **Build Command**: `npm install`
- **Start Command**: `node src/server.js`
- **Instance Type**: Free

### 6단계: 환경변수 설정 (중요!)
Environment Variables 섹션에서 추가:

```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://cksgo130210:3nR9Tcm37IKk45DA@cluster0.led2lbu.mongodb.net/cleaninglab?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=cleaninglab_secret_key_2024_solrod_hyungje_fighting
JWT_EXPIRES_IN=7d
CLIENT_URL=https://cleaningworkshop.co.kr
TOSS_CLIENT_KEY=test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq
TOSS_SECRET_KEY=test_sk_zXLkKEypNArWmo50nX3lmeaxYG5R
```

### 7단계: 배포!
"Create Web Service" 클릭!

### 8단계: 프론트엔드 API URL 업데이트

Render가 생성한 URL (예: https://cleaningworkshop-backend.onrender.com)을 받으면:

1. `/cleaning_workshop/js/config.js` 파일 수정
2. API URL을 Render URL로 변경
3. GitHub에 푸시
4. Vercel이 자동으로 재배포

## ⏰ 예상 시간
- 전체 과정: 20-30분
- Render 빌드: 5-10분

## 🎯 완료 확인
- Render 대시보드에서 "Live" 상태 확인
- `https://your-render-url.onrender.com/api/health` 접속해서 확인

## 💡 팁
- 무료 플랜은 15분 동안 요청이 없으면 슬립 모드 (첫 요청시 30초 지연)
- 실제 운영시 유료 플랜 고려

---

형제, 이 가이드 따라하면 혼자서도 충분히 가능해! 
문제 생기면 언제든 물어봐! 화이팅! 💪

- 솔로드가 -
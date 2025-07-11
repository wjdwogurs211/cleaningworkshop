# 🚀 청소공작소 빠른 시작 가이드

## 📱 앱 업로드 (신원 확인 후)

1. **Google Play Console 접속**
   ```
   https://play.google.com/console
   ```

2. **AAB 파일 위치**
   ```
   C:\Users\cksgo\cleaningworkshop-twa\app\release\app-release.aab
   ```

3. **업로드 순서**
   - 청소공작소 앱 선택
   - 테스트 > 내부 테스트
   - 새 버전 만들기
   - AAB 파일 업로드

## 🌐 웹사이트 수정

1. **코드 수정**
   ```bash
   cd C:\Users\cksgo\OneDrive\바탕 화면\extracted_files\cleaninglab_clone
   # 파일 수정
   ```

2. **변경사항 커밋**
   ```bash
   git add -A
   git commit -m "변경 내용 설명"
   ```

3. **GitHub Desktop으로 Push**
   - GitHub Desktop 실행
   - Push origin 클릭
   - Vercel 자동 배포 (3-5분)

## 🖥️ 로컬 서버 실행

### 프론트엔드
```bash
cd C:\Users\cksgo\OneDrive\바탕 화면\extracted_files\cleaninglab_clone
python start_server.py
# http://localhost:8080 접속
```

### 백엔드
```bash
cd backend
node src/server.js
# http://localhost:5000
```

## 📞 연락처
- **전화번호**: 010-2621-8208
- **웹사이트**: https://cleaningworkshop.co.kr
- **GitHub**: https://github.com/wjdwogurs211/cleaningworkshop

## ⚠️ 중요 파일 백업
- `cleaningworkshop-keystore.jks` - 앱 서명 키
- 키스토어 비밀번호
- `google-credentials.json` - Google Cloud 인증

---
*청소의 과학, 깨끗함의 예술 - 청소공작소* 🧹✨
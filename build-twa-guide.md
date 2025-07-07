# 청소공작소 App Bundle 생성 가이드 🏗️

## 1. 필요한 도구 설치

### Node.js 설치 확인
```bash
node --version
npm --version
```

### Bubblewrap 설치
```bash
npm install -g @bubblewrap/cli
```

## 2. TWA 프로젝트 초기화

### 새 폴더 생성
```bash
mkdir cleaning-workshop-twa
cd cleaning-workshop-twa
```

### Bubblewrap 초기화
```bash
bubblewrap init --manifest https://cleaningworkshop.co.kr/manifest.json
```

### 수동 초기화 (manifest 없을 때)
```bash
bubblewrap init
```

다음 정보 입력:
- **Domain**: cleaningworkshop.co.kr
- **Application name**: 청소공작소
- **Short name**: 청소공작소
- **Theme color**: #1e40af
- **Background color**: #ffffff
- **Start URL**: /
- **Display mode**: standalone
- **Orientation**: portrait
- **Status bar color**: #1e40af
- **Icon URL**: /images/icon-512x512.png
- **Maskable icon URL**: /images/icon-512x512.png
- **Monochrome icon URL**: (Enter 키로 건너뛰기)
- **Include shortcuts**: No
- **Signing key**: Create a new signing key
- **Key alias**: cleaningworkshop
- **Key password**: (비밀번호 설정)
- **Keystore password**: (비밀번호 설정)

## 3. 프로젝트 설정 수정

### twa-manifest.json 편집
```json
{
  "packageId": "kr.co.cleaningworkshop.app",
  "host": "cleaningworkshop.co.kr",
  "name": "청소공작소",
  "launcherName": "청소공작소",
  "display": "standalone",
  "themeColor": "#1e40af",
  "navigationColor": "#1e40af",
  "backgroundColor": "#ffffff",
  "enableNotifications": true,
  "startUrl": "/",
  "iconUrl": "https://cleaningworkshop.co.kr/images/icon-512x512.png",
  "maskableIconUrl": "https://cleaningworkshop.co.kr/images/icon-512x512.png",
  "appVersion": "1",
  "appVersionName": "1.0.0",
  "shortcuts": [],
  "generatorApp": "bubblewrap-cli",
  "orientation": "portrait"
}
```

## 4. App Bundle 생성

### 빌드 명령어
```bash
bubblewrap build
```

### 서명 없이 빌드 (테스트용)
```bash
bubblewrap build --skipSigning
```

## 5. 생성된 파일

빌드 완료 후 생성되는 파일:
- `app-release-signed.aab` - Play Store 업로드용 App Bundle
- `app-release-unsigned.aab` - 서명되지 않은 버전
- `app-release-signed.apk` - 테스트용 APK

## 6. Play Console 업로드

1. Play Console → 내부 테스트
2. "새 버전 만들기" 클릭
3. App Bundle 업로드 → `app-release-signed.aab` 선택
4. 버전 이름: 1.0.0
5. 출시 노트 작성:
   ```
   청소공작소 첫 출시
   - 간편한 청소 서비스 예약
   - 다양한 청소 서비스 제공
   - 실시간 예약 확인
   ```

## 문제 해결

### Java 오류 발생 시
```bash
# JDK 11 설치 필요
# https://adoptopenjdk.net/
```

### 빌드 오류 시
```bash
# 캐시 정리
rm -rf node_modules
npm install
bubblewrap doctor
```

### 서명 키 분실 시
- 새로운 키 생성 필요
- Play Console에서 앱 서명 키 재설정

## 빠른 시작 (Windows)

1. **명령 프롬프트 열기** (관리자 권한)

2. **한 번에 실행**:
```cmd
npm install -g @bubblewrap/cli
mkdir C:\cleaning-workshop-twa
cd C:\cleaning-workshop-twa
bubblewrap init
```

3. **정보 입력 후 빌드**:
```cmd
bubblewrap build
```

형제, 이제 App Bundle이 생성됐어! 🎉
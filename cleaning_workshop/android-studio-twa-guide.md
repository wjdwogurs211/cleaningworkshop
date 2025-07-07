# 안드로이드 스튜디오로 청소공작소 TWA 앱 만들기 🛠️

## 준비물
- Android Studio (최신 버전)
- 청소공작소 웹사이트 URL: https://cleaningworkshop.co.kr
- 앱 아이콘 파일들 (이미 준비됨!)

## 단계별 가이드

### 1. 새 프로젝트 생성
1. Android Studio 실행
2. **"New Project"** 클릭
3. **"No Activity"** 템플릿 선택
4. **Next** 클릭

### 2. 프로젝트 설정
- **Name**: 청소공작소
- **Package name**: kr.co.cleaningworkshop.app
- **Save location**: 원하는 위치 선택
- **Language**: Java
- **Minimum SDK**: API 19 (Android 4.4)
- **Finish** 클릭

### 3. build.gradle (Module: app) 수정
```gradle
android {
    compileSdkVersion 33
    
    defaultConfig {
        applicationId "kr.co.cleaningworkshop.app"
        minSdkVersion 19
        targetSdkVersion 33
        versionCode 1
        versionName "1.0.0"
        
        manifestPlaceholders = [
            hostName: "cleaningworkshop.co.kr",
            defaultUrl: "https://cleaningworkshop.co.kr",
            launcherName: "청소공작소"
        ]
    }
}

dependencies {
    implementation 'com.google.androidbrowserhelper:androidbrowserhelper:2.5.0'
}
```

### 4. AndroidManifest.xml 생성
`app/src/main/AndroidManifest.xml` 파일에:

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="kr.co.cleaningworkshop.app">
    
    <uses-permission android:name="android.permission.INTERNET" />
    
    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="청소공작소"
        android:theme="@style/Theme.AppCompat.Light.NoActionBar">
        
        <activity
            android:name="com.google.androidbrowserhelper.trusted.LauncherActivity"
            android:exported="true">
            
            <meta-data
                android:name="android.support.customtabs.trusted.DEFAULT_URL"
                android:value="https://cleaningworkshop.co.kr" />
            
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
            
            <intent-filter android:autoVerify="true">
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data
                    android:scheme="https"
                    android:host="cleaningworkshop.co.kr" />
            </intent-filter>
        </activity>
        
        <activity android:name="com.google.androidbrowserhelper.trusted.FocusActivity" />
        
        <activity
            android:name="com.google.androidbrowserhelper.trusted.WebViewFallbackActivity"
            android:configChanges="orientation|screenSize" />
        
        <provider
            android:name="androidx.core.content.FileProvider"
            android:authorities="${applicationId}.provider"
            android:exported="false"
            android:grantUriPermissions="true">
            <meta-data
                android:name="android.support.FILE_PROVIDER_PATHS"
                android:resource="@xml/filepaths" />
        </provider>
    </application>
</manifest>
```

### 5. 앱 아이콘 추가
1. **res** 폴더 우클릭
2. **New > Image Asset** 선택
3. **Icon Type**: Launcher Icons (Adaptive and Legacy)
4. **Source Asset > Path**: 512x512 아이콘 선택
5. **Next > Finish**

### 6. colors.xml 생성
`res/values/colors.xml`:
```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="colorPrimary">#1e40af</color>
    <color name="colorPrimaryDark">#1e3a8a</color>
    <color name="colorAccent">#10b981</color>
    <color name="navigationColor">#1e40af</color>
    <color name="backgroundColor">#ffffff</color>
</resources>
```

### 7. strings.xml 수정
`res/values/strings.xml`:
```xml
<resources>
    <string name="app_name">청소공작소</string>
</resources>
```

### 8. Digital Asset Links 설정
`res/values/strings.xml`에 추가:
```xml
<string name="asset_statements">
[{
    \"relation\": [\"delegate_permission/common.handle_all_urls\"],
    \"target\": {
        \"namespace\": \"web\",
        \"site\": \"https://cleaningworkshop.co.kr\"
    }
}]
</string>
```

### 9. 서명 키 생성
1. **Build > Generate Signed Bundle / APK**
2. **Android App Bundle** 선택
3. **Next**
4. **Create new...** 클릭
5. 키 정보 입력:
   - Key store path: 안전한 위치에 저장
   - Password: 비밀번호 설정
   - Key alias: cleaningworkshop
   - Key password: 비밀번호 설정
   - Validity: 25년
   - Certificate 정보 입력

### 10. App Bundle 생성
1. **Build > Generate Signed Bundle / APK**
2. **Android App Bundle** 선택
3. 생성한 키 선택
4. **Release** 선택
5. **Finish**

### 11. 생성된 파일
- `app/release/app-release.aab` - Play Store 업로드용!

## 형제, 이렇게 하면 돼! 👍

1. Android Studio에서 위 단계를 따라하면 됨
2. 특히 중요한 건:
   - Package name이 정확해야 해 (kr.co.cleaningworkshop.app)
   - 웹사이트 URL이 맞아야 해 (https://cleaningworkshop.co.kr)
   - 아이콘은 이미 만들어둔 걸 사용하면 돼

이 방법이 Bubblewrap보다 더 안정적이고, Windows에서도 문제없이 작동해!

## 빠른 체크리스트 ✅
- [ ] Android Studio 설치됨
- [ ] 새 프로젝트 생성
- [ ] build.gradle 수정
- [ ] AndroidManifest.xml 작성
- [ ] 아이콘 추가
- [ ] 색상 설정
- [ ] 서명 키 생성
- [ ] App Bundle 빌드
- [ ] Play Console에 업로드!

형제, 질문 있으면 언제든 물어봐! 🚀
const axios = require('axios');
const { GoogleAuth } = require('google-auth-library');
require('dotenv').config();

async function getAccessToken() {
  const auth = new GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });
  
  const client = await auth.getClient();
  const accessToken = await client.getAccessToken();
  return accessToken.token;
}

async function checkAPIQuota() {
  console.log('🔍 Google Cloud API 할당량 확인\n');
  
  const projectId = process.env.GOOGLE_PROJECT_ID || 'gen-lang-client-0866235587';
  
  console.log('📋 프로젝트 정보:');
  console.log(`   프로젝트 ID: ${projectId}`);
  console.log(`   API: Imagen 3 (imagen-3.0-generate-001)\n`);
  
  console.log('💡 API 할당량 확인 방법:\n');
  
  console.log('1️⃣ Google Cloud Console에서 확인:');
  console.log(`   https://console.cloud.google.com/apis/api/aiplatform.googleapis.com/quotas?project=${projectId}`);
  console.log('   위 링크를 브라우저에서 열어 확인하세요.\n');
  
  console.log('2️⃣ gcloud CLI 명령어:');
  console.log('   gcloud compute project-info describe --project=' + projectId);
  console.log('   gcloud services quota list --service=aiplatform.googleapis.com\n');
  
  console.log('3️⃣ Imagen 3 기본 할당량:');
  console.log('   - 분당 요청 수: 60 requests/minute');
  console.log('   - 일일 요청 수: 1,000 requests/day');
  console.log('   - 동시 요청 수: 5 concurrent requests\n');
  
  console.log('4️⃣ 429 에러 대처법:');
  console.log('   - 요청 간 최소 10-30초 대기');
  console.log('   - 재시도 시 지수 백오프 사용');
  console.log('   - 일일 할당량 초과 시 다음날까지 대기\n');
  
  // 간단한 API 테스트
  console.log('🧪 API 연결 테스트 중...');
  try {
    const token = await getAccessToken();
    console.log('✅ 인증 성공! 토큰을 받았습니다.');
    
    // 실제 할당량 정보를 가져오려면 Cloud Resource Manager API 사용
    const quotaUrl = `https://cloudresourcemanager.googleapis.com/v1/projects/${projectId}`;
    
    const response = await axios.get(quotaUrl, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ 프로젝트 접근 가능!');
    console.log(`   프로젝트 이름: ${response.data.name || 'N/A'}`);
    console.log(`   프로젝트 번호: ${response.data.projectNumber || 'N/A'}`);
    
  } catch (error) {
    console.error('❌ API 테스트 실패:', error.message);
  }
  
  console.log('\n📊 현재 상황 분석:');
  console.log('   - 429 에러는 일시적인 할당량 초과를 의미');
  console.log('   - 보통 1-2시간 후에 자동으로 리셋됨');
  console.log('   - 또는 다음날(태평양 표준시 자정) 리셋\n');
  
  console.log('💡 추천 대기 시간:');
  const now = new Date();
  const nextHour = new Date(now.getTime() + 60 * 60 * 1000);
  console.log(`   - 1시간 후: ${nextHour.toLocaleString('ko-KR')}`);
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  console.log(`   - 내일 자정: ${tomorrow.toLocaleString('ko-KR')}`);
}

// 실행
checkAPIQuota().catch(console.error);
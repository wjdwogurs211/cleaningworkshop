const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const { GoogleAuth } = require('google-auth-library');

async function getAccessToken() {
  const auth = new GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });
  
  const client = await auth.getClient();
  const accessToken = await client.getAccessToken();
  return accessToken.token;
}

async function generateStory4Image() {
  console.log('🎨 story-4.jpg 이미지 생성을 시작합니다...\n');
  
  const projectId = process.env.GOOGLE_PROJECT_ID || 'gen-lang-client-0866235587';
  const endpoint = `https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/us-central1/publishers/google/models/imagen-3.0-generate-001:predict`;
  
  const prompt = `저녁 노을이 아름답게 비치는 한남동 최고급 아파트의 거실, 파노라마 뷰로 보이는 서울의 야경, 
  행복한 한국인 가족(부모와 두 아이)이 함께 시간을 보내는 따뜻한 장면, 아이들은 완벽하게 깨끗한 
  이탈리아 대리석 바닥에서 보드게임을 하고, 부모는 밍크 담요가 덮인 미노티 소파에서 와인을 마시며 
  대화를 나누는 모습, 공간은 따뜻한 조명으로 가득하고 모든 것이 완벽하게 정돈되어 있으며, 
  벽에는 현대 미술 작품들이 걸려있고, 가족의 행복한 웃음소리가 들릴 것 같은 생동감 있는 장면, 
  라이프스타일 매거진의 커버 사진 같은 감성적이고 따뜻한 분위기, 8K 포토리얼리스틱`;
  
  try {
    const authToken = await getAccessToken();
    
    const requestData = {
      instances: [{
        prompt: prompt
      }],
      parameters: {
        sampleCount: 1,
        aspectRatio: '16:9',
        safetyFilterLevel: 'block_some',
        personGeneration: 'allow_adult',
        includeRaiReason: true
      }
    };
    
    console.log('⏳ API 요청 중...');
    const response = await axios.post(endpoint, requestData, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    const imageData = response.data.predictions[0].bytesBase64Encoded;
    const filePath = path.join(__dirname, '../cleaning_workshop/images/story-4.jpg');
    
    await fs.writeFile(filePath, imageData, 'base64');
    console.log('✅ story-4.jpg 생성 완료!');
    
  } catch (error) {
    console.error('❌ story-4.jpg 생성 실패:', error.message);
    if (error.response?.status === 429) {
      console.log('💡 API 할당량 초과. 잠시 후 다시 시도해주세요.');
    }
  }
}

// 10초 대기 후 실행
console.log('⏰ 10초 후에 이미지 생성을 시작합니다...');
setTimeout(() => {
  generateStory4Image();
}, 10000);
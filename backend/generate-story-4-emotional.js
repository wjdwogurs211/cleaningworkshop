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

async function generateFinalImage() {
  console.log('💙 마지막 감동적인 스토리 이미지 생성을 시작합니다...\n');
  
  const projectId = process.env.GOOGLE_PROJECT_ID || 'gen-lang-client-0866235587';
  const endpoint = `https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/us-central1/publishers/google/models/imagen-3.0-generate-001:predict`;
  
  const prompt = `저녁 무렵 따뜻한 거실에서 행복하게 시간을 보내는 한국인 가족들의 모습, 
  엄마와 아빠는 소파에서 차를 마시며 대화하고, 두 아이는 깨끗한 거실 바닥에서 안전하게 놀고 있는 장면, 
  집 전체가 깨끗하고 정돈되어 있으며, 가족 모두의 얼굴에 편안한 미소가 있음, 
  창밖으로는 도시의 불빛이 보이고, 실내는 따뜻한 조명으로 가득함, 
  '10만 가정이 선택한 신뢰'를 느낄 수 있는 평화롭고 행복한 가정의 모습, 라이프스타일 매거진 감성`;
  
  try {
    console.log('⏰ 30초 대기 중... (API 제한 회피)');
    await new Promise(resolve => setTimeout(resolve, 30000));
    
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
    
    if (response.data && response.data.predictions && response.data.predictions[0]) {
      const imageData = response.data.predictions[0].bytesBase64Encoded;
      const filePath = path.join(__dirname, '../cleaning_workshop/images/story-4.jpg');
      
      await fs.writeFile(filePath, imageData, 'base64');
      console.log('✅ story-4.jpg 생성 완료!');
      console.log('\n🎉 모든 감동적인 스토리 이미지가 완성되었습니다!');
    } else {
      throw new Error('이미지 데이터를 받지 못했습니다.');
    }
    
  } catch (error) {
    console.error('❌ story-4.jpg 생성 실패:', error.message);
    
    // 백업 이미지로 임시 복원
    console.log('\n📁 임시로 프리미엄 백업 이미지를 사용합니다...');
    try {
      const backupPath = path.join(__dirname, '../cleaning_workshop/images/story-4-premium-backup.jpg');
      const targetPath = path.join(__dirname, '../cleaning_workshop/images/story-4.jpg');
      await fs.copyFile(backupPath, targetPath);
      console.log('✅ 백업 이미지로 임시 복원 완료');
    } catch (backupError) {
      console.error('❌ 백업 복원 실패:', backupError.message);
    }
  }
}

// 실행
generateFinalImage();
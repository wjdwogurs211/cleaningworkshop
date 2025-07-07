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

// 남은 이미지들을 위한 프롬프트
const remainingPrompts = [
  {
    filename: 'story-1.jpg',
    prompt: `Korean father in his 30s tenderly holding newborn baby in modern apartment living room, 
    soft afternoon sunlight through window, father has concerned expression while looking at phone, 
    cardboard moving boxes visible in background, warm emotional family portrait, 
    photojournalistic style, natural lighting, tender moment between parent and child`
  },
  {
    filename: 'story-4.jpg',
    prompt: `Korean family of four enjoying evening in spotlessly clean modern apartment living room, 
    parents sitting on comfortable sofa with tea cups smiling warmly, two children ages 5-8 playing board game on clean floor, 
    warm interior lighting with Seoul city lights visible through large windows, 
    everyone looks happy and relaxed, lifestyle photography, cozy family atmosphere`
  }
];

async function fixRemainingImages() {
  console.log('🔧 남은 스토리 이미지 생성을 시작합니다...\n');
  
  const projectId = process.env.GOOGLE_PROJECT_ID || 'gen-lang-client-0866235587';
  const endpoint = `https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/us-central1/publishers/google/models/imagen-3.0-generate-001:predict`;
  
  const imagesDir = path.join(__dirname, '../cleaning_workshop/images');
  
  // 60초 대기 (API 제한 회피)
  console.log('⏰ API 제한 회피를 위해 60초 대기 중...');
  await new Promise(resolve => setTimeout(resolve, 60000));
  
  for (let i = 0; i < remainingPrompts.length; i++) {
    const { filename, prompt } = remainingPrompts[i];
    
    console.log(`\n📸 ${filename} 생성 시도...`);
    console.log(`   프롬프트: ${prompt.substring(0, 100)}...`);
    
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
          personGeneration: 'allow_adult'
        }
      };
      
      console.log('⏳ API 요청 중...');
      const response = await axios.post(endpoint, requestData, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        timeout: 60000
      });
      
      if (response.data?.predictions?.[0]?.bytesBase64Encoded) {
        const imageData = response.data.predictions[0].bytesBase64Encoded;
        const filePath = path.join(imagesDir, filename);
        
        await fs.writeFile(filePath, imageData, 'base64');
        console.log(`✅ ${filename} 생성 완료!`);
      } else {
        throw new Error('이미지 데이터를 받지 못함');
      }
      
      // 다음 이미지 전 대기
      if (i < remainingPrompts.length - 1) {
        console.log('⏳ 다음 이미지를 위해 30초 대기...');
        await new Promise(resolve => setTimeout(resolve, 30000));
      }
      
    } catch (error) {
      console.error(`❌ ${filename} 생성 실패:`, error.message);
      
      // 실패 시 대체 방안
      if (filename === 'story-1.jpg') {
        console.log('📝 story-1.jpg는 story-1-premium-backup.jpg 사용');
      } else if (filename === 'story-4.jpg') {
        console.log('📝 story-4.jpg는 story-4-premium-backup.jpg 사용');
      }
    }
  }
  
  console.log('\n🎯 작업 완료!');
  console.log('📌 참고: API 제한으로 생성 실패한 이미지는 프리미엄 백업 이미지를 사용하세요.');
}

// 실행
fixRemainingImages().catch(console.error);
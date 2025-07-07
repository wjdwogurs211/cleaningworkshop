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

// 더 구체적이고 명확한 프롬프트
const fixedStoryPrompts = [
  {
    filename: 'story-1.jpg',
    prompt: `A young Korean father holding a newborn baby in a bright living room, soft natural light from window, 
    worried expression on father's face while looking at smartphone searching for cleaning services, 
    moving boxes in background, warm and emotional atmosphere, photorealistic style, family love theme`
  },
  {
    filename: 'story-2.jpg',
    prompt: `Clean modern laboratory with Korean scientists in white lab coats conducting experiments, 
    test tubes with cleaning solutions on table, pH meters and microscopes, whiteboard with Korean text and chemical formulas, 
    bright scientific environment, documentary photography style`
  },
  {
    filename: 'story-3.jpg',
    prompt: `Close-up of hands holding a laboratory flask with clear liquid and Cleaning Workshop logo, 
    scientific glassware with eco-friendly cleaning solution, bright clean background, 
    professional product photography style, symbol of safe cleaning born from science`
  },
  {
    filename: 'story-4.jpg',
    prompt: `Happy Korean family in clean modern living room evening scene, parents on sofa drinking tea, 
    two children playing safely on spotless floor, warm lighting, city lights visible through window, 
    peaceful home atmosphere, lifestyle magazine photography`
  }
];

async function fixStoryImages() {
  console.log('🔧 스토리에 맞는 올바른 이미지 재생성을 시작합니다...\n');
  
  const projectId = process.env.GOOGLE_PROJECT_ID || 'gen-lang-client-0866235587';
  const endpoint = `https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/us-central1/publishers/google/models/imagen-3.0-generate-001:predict`;
  
  const imagesDir = path.join(__dirname, '../cleaning_workshop/images');
  
  // 잘못된 이미지들 백업
  console.log('📁 잘못된 이미지 백업 중...');
  for (let i = 1; i <= 4; i++) {
    try {
      const oldPath = path.join(imagesDir, `story-${i}.jpg`);
      const backupPath = path.join(imagesDir, `story-${i}-wrong.jpg`);
      await fs.rename(oldPath, backupPath);
      console.log(`✅ story-${i}.jpg → story-${i}-wrong.jpg`);
    } catch (error) {
      console.log(`⚠️ 백업 실패:`, error.message);
    }
  }
  
  console.log('\n🎨 올바른 이미지 생성 시작...\n');
  
  for (let i = 0; i < fixedStoryPrompts.length; i++) {
    const { filename, prompt } = fixedStoryPrompts[i];
    
    console.log(`📸 ${filename} 생성 중...`);
    console.log(`   프롬프트: ${prompt.substring(0, 80)}...`);
    
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
      
      const response = await axios.post(endpoint, requestData, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });
      
      if (response.data?.predictions?.[0]?.bytesBase64Encoded) {
        const imageData = response.data.predictions[0].bytesBase64Encoded;
        const filePath = path.join(imagesDir, filename);
        
        await fs.writeFile(filePath, imageData, 'base64');
        console.log(`✅ ${filename} 생성 완료!\n`);
      } else {
        throw new Error('이미지 데이터 없음');
      }
      
      // API 제한 방지를 위한 대기
      if (i < fixedStoryPrompts.length - 1) {
        console.log('⏳ 다음 이미지 대기 중... (10초)\n');
        await new Promise(resolve => setTimeout(resolve, 10000));
      }
      
    } catch (error) {
      console.error(`❌ ${filename} 생성 실패:`, error.message);
      
      // 실패 시 프리미엄 백업 사용
      try {
        const backupPath = path.join(imagesDir, `story-${i+1}-premium-backup.jpg`);
        const targetPath = path.join(imagesDir, filename);
        await fs.copyFile(backupPath, targetPath);
        console.log(`📁 프리미엄 백업 이미지로 대체\n`);
      } catch (e) {
        console.log(`⚠️ 백업도 실패\n`);
      }
      
      if (error.response?.status === 429) {
        console.log('💡 API 할당량 초과. 30초 대기...\n');
        await new Promise(resolve => setTimeout(resolve, 30000));
        i--; // 재시도
      }
    }
  }
  
  console.log('🎉 이미지 재생성 작업 완료!');
}

// 실행
fixStoryImages().catch(console.error);
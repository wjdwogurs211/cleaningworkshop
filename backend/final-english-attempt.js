const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const { GoogleAuth } = require('google-auth-library');
require('dotenv').config();

async function finalEnglishAttempt() {
  console.log('🌟 영어 프롬프트로 최종 시도!\n');
  
  const auth = new GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });
  
  const client = await auth.getClient();
  const token = await client.getAccessToken();
  
  const projectId = 'gen-lang-client-0866235587';
  const endpoint = `https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/us-central1/publishers/google/models/imagen-3.0-generate-001:predict`;
  
  // 영어로 단순화한 프롬프트
  const images = [
    {
      filename: 'story-1.jpg',
      prompt: 'Young father holding newborn baby in bright modern living room with soft natural lighting, moving boxes in background, tender family moment, photorealistic style'
    },
    {
      filename: 'story-4.jpg',
      prompt: 'Happy family evening scene in clean modern apartment, parents relaxing on sofa, two children playing board games on floor, warm lighting, cozy atmosphere'
    }
  ];
  
  const imagesDir = path.join(__dirname, '../cleaning_workshop/images');
  
  for (const { filename, prompt } of images) {
    console.log(`📸 ${filename} 생성 중...`);
    
    try {
      const requestData = {
        instances: [{ prompt }],
        parameters: {
          sampleCount: 1,
          aspectRatio: '16:9'
        }
      };
      
      const response = await axios.post(endpoint, requestData, {
        headers: {
          'Authorization': `Bearer ${token.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data?.predictions?.[0]?.bytesBase64Encoded) {
        const imageData = response.data.predictions[0].bytesBase64Encoded;
        
        // 백업 만들기
        try {
          await fs.rename(
            path.join(imagesDir, filename),
            path.join(imagesDir, filename.replace('.jpg', '-old.jpg'))
          );
        } catch (e) {}
        
        // 새 이미지 저장
        await fs.writeFile(path.join(imagesDir, filename), imageData, 'base64');
        console.log(`✅ ${filename} 생성 성공!\n`);
      } else {
        console.log(`❌ ${filename} - 응답에 이미지 없음\n`);
      }
      
      // 대기
      await new Promise(resolve => setTimeout(resolve, 3000));
      
    } catch (error) {
      console.error(`❌ ${filename} 실패:`, error.response?.status || error.message, '\n');
    }
  }
  
  console.log('🎊 작업 완료!');
  console.log('👉 our-story.html 페이지를 새로고침해서 확인하세요!');
}

finalEnglishAttempt();
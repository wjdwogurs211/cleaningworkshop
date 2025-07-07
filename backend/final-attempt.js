const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const { GoogleAuth } = require('google-auth-library');
require('dotenv').config();

async function finalAttempt() {
  console.log('🎯 최종 이미지 생성 시도\n');
  
  const auth = new GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });
  
  const client = await auth.getClient();
  const token = await client.getAccessToken();
  
  const projectId = 'gen-lang-client-0866235587';
  const endpoint = `https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/us-central1/publishers/google/models/imagen-3.0-generate-001:predict`;
  
  // 더 간단하고 안전한 프롬프트
  const prompts = [
    {
      filename: 'story-1.jpg',
      prompt: 'Caring father holding baby in bright modern living room, moving boxes visible, warm lighting, family portrait photography'
    },
    {
      filename: 'story-4.jpg', 
      prompt: 'Happy family of four in clean living room evening, parents on sofa, children playing on floor, cozy home atmosphere'
    }
  ];
  
  const imagesDir = path.join(__dirname, '../cleaning_workshop/images');
  
  for (const { filename, prompt } of prompts) {
    console.log(`📸 ${filename} 생성 시도...`);
    
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
        await fs.writeFile(path.join(imagesDir, filename), imageData, 'base64');
        console.log(`✅ ${filename} 생성 성공!\n`);
      } else {
        throw new Error('No image data');
      }
      
      // 다음 요청 전 5초 대기
      await new Promise(resolve => setTimeout(resolve, 5000));
      
    } catch (error) {
      console.error(`❌ ${filename} 실패:`, error.message, '\n');
    }
  }
  
  console.log('🏁 작업 완료!');
}

finalAttempt();
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config({ path: '.env.openai' });

async function generateDALLEImages() {
  console.log('🎨 DALL-E 3로 청소공작소 스토리 이미지 생성!\n');
  
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  
  if (!OPENAI_API_KEY) {
    console.error('❌ OpenAI API 키가 없습니다!');
    return;
  }
  
  // 생성할 이미지들
  const storyImages = [
    {
      filename: 'story-1.jpg',
      prompt: `Photorealistic photography of a warm spring afternoon in a modern Korean apartment living room. 
      A Korean father in his early 30s is carefully holding a newborn baby with a slightly worried expression 
      while looking at his smartphone searching for cleaning services. Moving boxes are visible in the background. 
      Soft natural sunlight streams through the window creating a warm, emotional atmosphere. 
      The scene captures a tender family moment with documentary photography style. 16:9 aspect ratio.`
    },
    {
      filename: 'story-4.jpg',
      prompt: `Photorealistic evening scene in a modern Korean apartment living room with warm ambient lighting. 
      A Korean family of four - parents in their 30s-40s sitting comfortably on a sofa drinking tea and chatting, 
      while two children aged 5-8 are playing board games on the clean living room floor. 
      Seoul city lights are visible through large windows. The entire space is clean, organized, and filled with 
      a cozy, happy atmosphere. Lifestyle magazine photography style, capturing genuine family happiness. 16:9 aspect ratio.`
    }
  ];

  const imagesDir = path.join(__dirname, '../cleaning_workshop/images');
  
  for (const { filename, prompt } of storyImages) {
    console.log(`📸 ${filename} 생성 시작...`);
    
    try {
      // DALL-E 3 API 호출
      console.log('⏳ DALL-E 3 API 호출 중...');
      const response = await axios.post(
        'https://api.openai.com/v1/images/generations',
        {
          model: "dall-e-3",
          prompt: prompt,
          n: 1,
          size: "1792x1024", // 16:9 비율
          quality: "hd",
          style: "natural" // 자연스러운 스타일
        },
        {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 60000 // 60초 타임아웃
        }
      );

      // 생성된 이미지 URL
      const imageUrl = response.data.data[0].url;
      console.log('✅ 이미지 생성 완료!');
      
      // 이미지 다운로드
      console.log('💾 이미지 다운로드 중...');
      const imageResponse = await axios.get(imageUrl, { 
        responseType: 'arraybuffer',
        timeout: 30000 
      });
      
      // 기존 파일 백업
      try {
        const backupPath = path.join(imagesDir, filename.replace('.jpg', '-backup.jpg'));
        await fs.rename(path.join(imagesDir, filename), backupPath);
        console.log(`📁 기존 ${filename} 백업 완료`);
      } catch (e) {
        // 백업 실패 무시
      }
      
      // 새 이미지 저장
      const buffer = Buffer.from(imageResponse.data);
      await fs.writeFile(path.join(imagesDir, filename), buffer);
      console.log(`✅ ${filename} 저장 완료!\n`);
      
      // API 제한 방지 (3초 대기)
      if (filename !== 'story-4.jpg') {
        console.log('⏳ 다음 이미지 생성을 위해 대기 중...\n');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
      
    } catch (error) {
      console.error(`❌ ${filename} 생성 실패!`);
      if (error.response) {
        console.error(`   상태 코드: ${error.response.status}`);
        console.error(`   에러 메시지: ${error.response.data?.error?.message || '알 수 없는 오류'}`);
      } else {
        console.error(`   에러: ${error.message}`);
      }
      console.log('');
    }
  }
  
  console.log('🎉 DALL-E 3 이미지 생성 작업 완료!');
  console.log('📂 이미지 위치: cleaning_workshop/images/');
  console.log('🌐 our-story.html 페이지를 새로고침해서 확인하세요!');
}

// 실행
console.log('🔑 OpenAI API 키 확인됨!');
console.log('💰 예상 비용: HD 이미지 2개 × $0.080 = $0.16 (약 200원)\n');

generateDALLEImages().catch(error => {
  console.error('🚨 전체 프로세스 오류:', error.message);
});
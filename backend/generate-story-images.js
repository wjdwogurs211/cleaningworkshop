const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

// Google Cloud 인증 설정
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

// 프리미엄 스토리 이미지 프롬프트들
const storyPrompts = [
  {
    filename: 'story-1.jpg',
    prompt: `초고급 한국 펜트하우스 거실, 이탈리아산 칼라카타 대리석 바닥이 거울처럼 반짝이고, 
    에르메스와 펜디카사 가구들이 완벽하게 배치된 공간, 층고 6미터의 통창으로 한강과 서울 스카이라인이 보이며, 
    오후의 따뜻한 햇빛이 비스듬히 들어와 공간 전체가 황금빛으로 빛나는 모습, 5살 정도의 한국인 어린이가 
    맨발로 즐겁게 뛰어다니며 웃고 있고, 젊은 부모가 소파에서 미소 지으며 아이를 바라보는 장면, 
    공간은 극도로 깨끗하고 정돈되어 있으며, Architectural Digest 잡지 스타일의 고급 인테리어 사진, 
    8K 해상도의 포토리얼리스틱 이미지`
  },
  {
    filename: 'story-2.jpg',
    prompt: `최첨단 프리미엄 청소 연구소, 순백의 실험실에서 흰 가운을 입은 전문가들이 일하는 모습, 
    중앙 테이블에는 에르메스 가죽 소파 샘플, 루이비통 트렁크의 가죽 조각, 벤틀리 자동차 시트 소재 등 
    고급 소재들이 정렬되어 있고, 전문가가 현미경으로 섬유 구조를 분석하는 장면, 벽면의 대형 모니터에는 
    각 소재별 최적 케어 방법이 표시되고, 또 다른 연구원은 pH 측정기로 친환경 세제를 테스트 중, 
    공간은 미니멀하고 깨끗하며 최첨단 장비들로 가득함, 신뢰감과 전문성이 느껴지는 분위기, 
    애플 스토어 같은 깔끔한 디자인, 포토리얼리스틱 스타일`
  },
  {
    filename: 'story-3.jpg',
    prompt: `화이트 글러브 서비스 장면, 흰 장갑을 낀 전문 버틀러가 바카라 크리스탈 샹들리에를 
    극도로 조심스럽게 닦는 클로즈업 샷, 배경으로는 고급 한옥 스타일의 현대적 인테리어가 보이고, 
    금박 장식과 한국 전통 미술품들이 조화롭게 배치된 공간, 버틀러의 손길은 정교하고 우아하며, 
    크리스탈에 반사되는 빛이 무지개처럼 퍼지는 아름다운 장면, 5성급 호텔 프레지덴셜 스위트룸 같은 
    고급스러운 분위기, 매우 디테일하고 선명한 포토리얼리스틱 이미지, Vogue Living 매거진 스타일`
  },
  {
    filename: 'story-4.jpg',
    prompt: `저녁 노을이 아름답게 비치는 한남동 최고급 아파트의 거실, 파노라마 뷰로 보이는 서울의 야경, 
    행복한 한국인 가족(부모와 두 아이)이 함께 시간을 보내는 따뜻한 장면, 아이들은 완벽하게 깨끗한 
    이탈리아 대리석 바닥에서 보드게임을 하고, 부모는 밍크 담요가 덮인 미노티 소파에서 와인을 마시며 
    대화를 나누는 모습, 공간은 따뜻한 조명으로 가득하고 모든 것이 완벽하게 정돈되어 있으며, 
    벽에는 현대 미술 작품들이 걸려있고, 가족의 행복한 웃음소리가 들릴 것 같은 생동감 있는 장면, 
    라이프스타일 매거진의 커버 사진 같은 감성적이고 따뜻한 분위기, 8K 포토리얼리스틱`
  }
];

async function generateStoryImages() {
  console.log('🎨 프리미엄 스토리 이미지 생성을 시작합니다...\n');
  
  const projectId = process.env.GOOGLE_PROJECT_ID || 'gen-lang-client-0866235587';
  const endpoint = `https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/us-central1/publishers/google/models/imagen-3.0-generate-001:predict`;
  
  // 이미지 저장 경로
  const imagesDir = path.join(__dirname, '../cleaning_workshop/images');
  
  for (let i = 0; i < storyPrompts.length; i++) {
    const { filename, prompt } = storyPrompts[i];
    console.log(`\n📸 ${filename} 생성 중...`);
    
    try {
      // 액세스 토큰 가져오기
      const authToken = await getAccessToken();
      
      // API 요청
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
      
      const response = await axios.post(endpoint, requestData, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      // 이미지 저장
      const imageData = response.data.predictions[0].bytesBase64Encoded;
      const filePath = path.join(imagesDir, filename);
      
      await fs.writeFile(filePath, imageData, 'base64');
      console.log(`✅ ${filename} 생성 완료!`);
      
      // API 제한을 위한 딜레이
      if (i < storyPrompts.length - 1) {
        console.log('⏳ 다음 이미지 생성 대기 중...');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
      
    } catch (error) {
      console.error(`❌ ${filename} 생성 실패:`, error.message);
    }
  }
  
  console.log('\n🎉 모든 스토리 이미지 생성이 완료되었습니다!');
}

// 실행
generateStoryImages().catch(console.error);
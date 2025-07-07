# Veo 일관성 마스터 가이드 - 청소공작소 광고 제작

## 🎯 Veo의 한계와 해결책

### 문제점
- Veo는 각 프롬프트마다 새로운 영상 생성
- 캐릭터, 공간, 스타일 일관성 유지 어려움
- 긴 스토리텔링에 제약

### 해결 전략
1. **세그먼트 전략**: 짧은 클립 여러 개 제작
2. **앵커 요소**: 변하지 않는 시각적 요소 활용
3. **후반 작업**: 편집으로 스토리 연결

---

## 📋 실전 일관성 유지 템플릿

### 1. 마스터 프롬프트 구조
```
[CONSISTENCY MARKERS]
- Character: [정확한 외모 묘사 반복]
- Location: [동일 공간 디테일 유지]
- Props: [고정 아이템 리스트]
- Color: [정확한 색상 코드]
- Lighting: [조명 조건 일관성]

[SCENE SPECIFIC]
- Action: [이번 씬의 행동]
- Camera: [촬영 각도와 움직임]
- Duration: [정확한 초 단위]
```

### 2. 청소공작소 마스터 설정

#### 🧑‍🔬 주인공 캐릭터 (김연구 박사)
```
COPY THIS TO EVERY PROMPT:
"Korean female scientist, age 35, height 165cm,
- Hair: Short black bob cut, neat style
- Face: Round face, friendly expression, thin-framed glasses
- Outfit: White lab coat with blue '청소공작소' embroidered logo on left chest
- Accessories: Blue lanyard with ID card, smart watch on left wrist
- Build: Average, professional posture"
```

#### 🏢 연구실 공간
```
COPY THIS TO EVERY LAB SCENE:
"Modern cleaning research laboratory:
- Walls: Pure white with glass panels
- Equipment: Stainless steel work benches, microscopes on left wall
- Signage: '청소공작소 R&D' blue acrylic sign on back wall  
- Lighting: Bright LED panels, 5600K color temperature
- Props: Blue chemical bottles labeled in Korean, white notebooks"
```

#### 🎨 브랜드 컬러 팔레트
```
EXACT COLOR CODES:
- Primary Blue: #00b4d8 (uniforms, logos)
- Secondary Blue: #0077b6 (accents)
- Lab White: #FFFFFF (coats, walls)
- Trust Gray: #F8F9FA (backgrounds)
- Data Green: #4CAF50 (charts)
```

---

## 🎬 실전 예시: 30초 광고 (6개 세그먼트)

### Segment 1: Opening (5초)
```
Create 5-second video:
CONSISTENCY: Korean female scientist, age 35, short black bob, glasses, 
white lab coat with blue '청소공작소' logo on left chest
ACTION: Walking into modern white laboratory, turning on lights
CAMERA: Tracking shot following from behind
PROPS: Blue lanyard with ID, carrying blue notebook
LIGHTING: Lights turning on sequence, bright white LED
END FRAME: Freeze on her face looking determined
```

### Segment 2: Research (5초)
```
Create 5-second video:
CONSISTENCY: SAME Korean female scientist from previous (short black bob, glasses,
white coat with blue '청소공작소' logo), in SAME white laboratory
ACTION: Looking through microscope at fabric sample, taking notes
CAMERA: Close-up of hands adjusting microscope, cut to face concentrating  
PROPS: SAME blue notebook, microscope showing bacteria
LIGHTING: SAME bright white LED laboratory lighting
TEXT OVERLAY: "매일 연구합니다" in blue
```

### Segment 3: Discovery (5초)
```
Create 5-second video:
CONSISTENCY: SAME scientist (maintaining ALL previous details) shows excitement
ACTION: Discovering breakthrough formula on computer screen, calling team
CAMERA: Over-shoulder shot of screen showing "99.9% 세균 제거" graph
PROPS: Computer showing data, SAME blue notebook with formula
LIGHTING: SAME lab lighting + computer screen glow
INCLUDE: Other team members in matching white coats arriving
```

### Segment 4: Preparation (5초)
```
Create 5-second video:  
CONSISTENCY: SAME scientist removes white coat revealing blue 청소공작소 uniform
ACTION: Packing research-based cleaning supplies into professional kit
CAMERA: Medium shot showing transformation from researcher to field expert
PROPS: Specialized cleaning tools, pH strips, measurement devices
LIGHTING: Transitioning from lab to natural light
MAINTAIN: Same hairstyle, glasses, facial features throughout
```

### Segment 5: Field Application (5초)
```
Create 5-second video:
CONSISTENCY: SAME scientist (now in blue uniform) at Korean apartment
ACTION: Using specialized equipment from research, explaining to customer
CAMERA: Professional documentary style, showing scientific cleaning method
PROPS: Tools from lab, tablet showing research data
ENVIRONMENT: Typical Korean apartment interior
FACIAL EXPRESSION: Confident, professional, same friendly demeanor
```

### Segment 6: Results (5초)
```
Create 5-second video:
CONSISTENCY: SAME scientist checking results with measurement device
ACTION: Showing "CLEAN" reading to happy customer, both smiling
CAMERA: Pull back to reveal spotless apartment
END CARD: "청소공작소 - 청소의 과학, 깨끗함의 예술" logo animation
FINAL SHOT: Scientist's satisfied expression (SAME character maintained)
```

---

## 🔗 연결 편집 전략

### 1. 트랜지션 타입
- **Match Cut**: 동일한 동작으로 연결
- **Prop Continuity**: 소품으로 씬 연결
- **Color Bridge**: 색상으로 자연스럽게 전환

### 2. 오디오 브릿지
- 일관된 배경음악
- 내레이션으로 스토리 연결
- 사운드 이펙트 연속성

### 3. 텍스트 오버레이
- 통일된 폰트와 색상
- 위치 일관성 유지
- 한글 자막으로 스토리 보강

---

## 💡 Pro Tips

### 1. 프롬프트 체인 만들기
```
Prompt 1 결과 → 스크린샷 → Prompt 2에 참조
"Create continuation of previous scene with EXACT SAME character..."
```

### 2. 스타일 참조
```
"Style reference: Korean commercial aesthetic, clean minimal design,
similar to Samsung or LG appliance commercials"
```

### 3. 백업 플랜
- Plan A: Veo로 전체 제작
- Plan B: Veo + 스톡 푸티지 혼합
- Plan C: Veo + 모션 그래픽
- Plan D: 키 씬만 Veo, 나머지 애니메이션

### 4. 일관성 체크리스트
- [ ] 캐릭터 외모 100% 동일
- [ ] 색상 팔레트 유지
- [ ] 조명 조건 일치
- [ ] 브랜드 요소 포함
- [ ] 공간 연속성
- [ ] 소품 일관성

---

## 🎯 한국 시장 특화 팁

### 문화적 요소
```
"Korean apartment setting with ondol floor heating,
Samsung/LG appliances, Korean text on products,
Typical Korean family of 4 (parents, 2 children)"
```

### 신뢰감 연출
```
"Professional certification badges visible,
Korean government approval seals,
Customer testimonial cards in Korean"
```

형제! 이 가이드로 Veo의 한계를 극복하고 일관성 있는 스토리를 만들 수 있을 거야! 

핵심은:
1. **짧은 클립**으로 나누기
2. **정확한 디테일** 반복
3. **편집으로 연결**하기

이렇게 하면 "연구하는 청소공작소"의 스토리를 완벽하게 전달할 수 있어! 🧪🎬✨
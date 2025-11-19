# 과천 지식정보타운 편의시설 가이드

갈현동 지역 편의시설 정보를 한눈에 볼 수 있는 원페이지 웹사이트입니다.

## 주요 기능

✅ **3단계 계층적 필터링** - 대분류 → 중분류 → 소분류  
✅ **반응형 디자인** - 모바일/태블릿/데스크톱 최적화  
✅ **부드러운 애니메이션** - fade-in, slide 효과  
✅ **이미지 Lazy Loading** - 성능 최적화  
✅ **상단 고정 헤더** - 스크롤 시 배경색 변경  
✅ **카카오맵 연동** - 새 창으로 지도 열기  
✅ **전화 걸기 기능** - 모바일에서 터치로 전화 연결  
✅ **SEO 최적화** - 메타 태그 및 시맨틱 HTML  

## 기술 스택

- React 18
- Vite
- Tailwind CSS
- PapaParse (CSV 파싱)

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 미리보기
npm run preview
```

## 데이터 소스

Google Sheets를 CSV로 변환하여 사용합니다.
- 100개 이상의 지역 편의시설 정보
- 실시간 데이터 업데이트

## 프로젝트 구조

```
JJT_web/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   └── components/
│       ├── Header.jsx
│       ├── FilterPanel.jsx
│       ├── FacilityCard.jsx
│       ├── LoadingSpinner.jsx
│       └── Footer.jsx
└── README.md
```

## 브라우저 지원

- Chrome (최신 버전)
- Firefox (최신 버전)
- Safari (최신 버전)
- Edge (최신 버전)

## 라이선스

© 2025 과천 지식정보타운 편의시설 가이드. All rights reserved.


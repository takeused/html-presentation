---
name: html-presentation
description: 고품질 인터랙티브 웹 기반 HTML 프레젠테이션/슬라이드 덱 생성 스킬. 1920x1080 반응형 고정 뷰포트, 다크모드 글래스모피즘, 네온 글로우 텍스트, 스텝별 reveal 애니메이션, 키보드/마우스 내비게이션, 숫자 직접 입력 페이지 점프, 모달 점프, 통합 허브(index.html) 연동을 포함한 웹 발표자료를 제작합니다.
---

# HTML Interactive Presentation Skill

이 스킬은 파워포인트(PPT)를 대체하는 **초고화질 인터랙티브 웹 기반 슬라이드 덱**을 제작하고 유지보수하기 위한 표준 가이드입니다.

---

## 🎨 1. 디자인 시스템 & 비주얼 원칙

### 컬러 팔레트 (다크 테마 + 네온 액센트)
- **Background**: `#09090b` (Deep Dark)
- **Text Main**: `#f0f0f0` / **Text Muted**: `#a1a1aa`
- **Cyan (`--c`)**: `#00d4ff` (테크, 데이터, 하이라이트)
- **Amber (`--a`)**: `#f59e0b` (경고, 노드, 프로세스)
- **Emerald (`--e`)**: `#10b981` (성공, 결과, 엣지)
- **Purple (`--p`)**: `#a78bfa` (AI, 상태, 영속성)
- **Rose (`--r`)**: `#f43f5e` (루프, 피드백, 알림)
- **Blue (`--b`)**: `#3b82f6` (엔터프라이즈, 클라우드)

### 글래스모피즘 (Glassmorphism Cards)
```css
.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.11);
  border-radius: 24px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.12);
}
.glass-c { /* Cyan 액센트 글래스 */
  background: rgba(0, 212, 255, 0.07);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(0, 212, 255, 0.28);
  border-radius: 24px;
  box-shadow: 0 0 48px rgba(0, 212, 255, 0.12), 0 8px 40px rgba(0, 0, 0, 0.5);
}
```

### 네온 글로우 텍스트 (Neon Glow)
```css
.gc { color: #00d4ff; text-shadow: 0 0 28px #00d4ff, 0 0 56px rgba(0, 212, 255, 0.45); }
.ga { color: #f59e0b; text-shadow: 0 0 28px #f59e0b, 0 0 56px rgba(245, 158, 11, 0.45); }
.ge { color: #10b981; text-shadow: 0 0 28px #10b981, 0 0 56px rgba(16, 185, 129, 0.45); }
.gp { color: #a78bfa; text-shadow: 0 0 28px #a78bfa, 0 0 56px rgba(167, 139, 250, 0.45); }
```

### 타이포그래피 (1920x1080 기준)
- **Hero Title**: `94px ~ 112px`, `font-weight: 800`, `letter-spacing: -0.034em`
- **Slide Title**: `50px ~ 70px`, `font-weight: 700`
- **Card Title**: `32px ~ 38px`, `font-weight: 600`
- **Body Large**: `24px ~ 27px`, `font-weight: 500`
- **Body Normal**: `18px ~ 21px`, `font-weight: 400`, `color: var(--mu)`
- **폰트 CDN**: Pretendard (`https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css`)
- **아이콘 라이브러리**: Iconify (`https://code.iconify.design/iconify-icon/1.0.8/iconify-icon.min.js`)

---

## ⚙️ 2. 핵심 인터랙션 & 슬라이드 엔진

### 1) 1920x1080 반응형 고정 비율 스케일링
화면 해상도에 상관없이 16:9 비율을 유지하며 화면 중앙에 완벽하게 핏(Fit)되도록 자동 변환:
```javascript
function scale() {
  const s = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
  const tx = (window.innerWidth - 1920 * s) / 2;
  const ty = (window.innerHeight - 1080 * s) / 2;
  document.body.style.transform = `translate(${tx}px,${ty}px) scale(${s})`;
}
window.addEventListener('resize', scale);
scale();
```

### 2) 단계별 등장 (Step Reveal) 시스템
- 슬라이드 객체에 `n` (총 스텝 수) 지정: `{ n: 3, html: '...' }`
- HTML 요소에 `data-step="1"`, `data-step="2"` 부여
- 오른쪽 화살표나 스페이스바 클릭 시 `step`이 1씩 증가하며 순차적으로 reveal

### 3) 3종 퀵 페이지 점프 (Quick Page Jump)
1. **키보드 직접 숫자 입력**: 숫자(0~9) 연속 입력 시 토스트 배지 표시 + `Enter` 누르면 즉시 이동 (1.2초 후 자동 이동)
2. **`G` 키 모달**: `G` 키를 누르면 글래스모피즘 모달이 떠서 페이지 번호 입력 후 이동
3. **하단 카운터 클릭**: `1 / 28` 텍스트 클릭 시 점프 모달 오픈

### ⚠️ [CRITICAL RULE] 템플릿 리터럴 내부 백틱 금지!
- JavaScript의 `slides = [{ html: ` ... ` }]` 구조 내부에서 **절대로 백틱(`` ` ``)을 사용하면 안 됩니다.**
- 인라인 코드 표시가 필요할 때는 반드시 `<code>변수명</code>` 또는 작은따옴표(`'`)를 사용하세요.

---

## 📋 3. 표준 HTML 슬라이드 템플릿 구조

```html
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>프레젠테이션 제목</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css">
<script src="https://code.iconify.design/iconify-icon/1.0.8/iconify-icon.min.js"></script>
<style>
/* CSS 스타일 (스케일링, 글래스모피즘, 네비게이션, 점프 모달 등) */
</style>
</head>
<body>
<div id="blobs"></div>
<div id="slide"></div>

<!-- Quick Jump Toast -->
<div id="jump-indicator">
  <iconify-icon icon="solar:round-alt-arrow-right-bold" style="color:var(--c);font-size:24px"></iconify-icon>
  <span>Go to Page : </span>
  <span id="jump-number">1</span>
</div>

<!-- Quick Jump Modal -->
<div id="jump-modal-overlay">
  <div id="jump-modal">
    <div style="font-size:24px;font-weight:700;color:var(--c)">페이지 바로 이동</div>
    <input type="number" id="modal-page-input" min="1" max="28">
    <button id="modal-jump-btn">이동</button>
  </div>
</div>

<div id="nav">
  <button class="nav-btn" id="btn-prev">◀</button>
  <span id="counter">1 / 28</span>
  <button class="nav-btn" id="btn-next">▶</button>
</div>
<div id="progress"></div>

<script>
const slides = [
  { n: 2, html: `<div style="text-align:center"><h1>타이틀</h1></div>` },
  // ... 슬라이드 데이터 ...
];

// 네비게이션 & 키보드 & 마우스 & 점프 엔진
</script>
</body>
</html>
```

---

## 🌐 4. 메인 허브(index.html) 연동 규칙

1. **상단 탭 내비게이션**: 각 프레젠테이션을 `<button class="tab-btn" data-tab="..." data-src="...">`로 선언
2. **Lazy Loading iframe**: 탭 클릭 시 iframe에 `src`를 동적 할당하여 로딩 최적화
3. **URL Hash 연동**: `#tab=tabName`으로 새로고침 및 딥링크 지원
4. **키보드 포워딩**: 부모 창에서 화살표 키를 눌렀을 때 active iframe의 `contentWindow`로 `KeyboardEvent`를 dispatch하여 끊김 없는 조작 지원.

---
name: interactive-motion-briefing-presentation
description: '"인터랙티브 브리핑 발표자료", "에이커 스타일 발표자료", "테슬라 브리핑 스타일", "HTML+모션그래픽 발표자료", "차트+모션그래픽 슬라이드", "레버 인터랙티브 슬라이드", "에디토리얼 브리핑 덱", "비즈니스 로드스터 브리핑 스타일" 등 요청 시 실행하는 스킬. 유튜브 에이커(byShnblO4Oc)의 테슬라 비즈니스 & 로드스터 브리핑 레퍼런스(tesla-business-roadster-briefing)와 엔비디아 15장 확장판을 완벽히 구현한 스킬로, 화이트 에디토리얼 캔버스 위에 핑크/와인 포인트(#e81768 / #920951), 좌측 번호 레일(01~11 또는 01~15), 15초 모션그래픽 비디오 슬라이드(오프닝·엔딩), 가로/세로 레버(Range Lever) 연동 Chart.js 인터랙티브 차트, 3개년 연동 대시보드, 4계층 플랫폼·추론 경제학·수요 다변화·피지컬 AI 파이프라인 인터랙션, 슬라이드업 바텀 시트(Sheet)·우측 드로어(Drawer)·센터 모달(Modal), 숫자 카운트업 리플레이, 그리고 브라우저 내 실시간 글자 편집 및 단일 HTML 다운로드(editor.js) 기능까지 포함한 웹 발표자료를 제작합니다.'
---

# Interactive Motion Briefing Presentation Skill (테슬라 브리핑 스타일 · 11장 기본형 & 15장 확장형)

유튜브 **'에이커, 돈이되는 AI와 이커머스'**의 *"요즘 일잘러들은 PPT, HTML+모션그래픽으로 만듭니다 (무료 프롬프트 공유)"* (`https://youtu.be/byShnblO4Oc`) 영상과 공식 레퍼런스 사이트(`https://tesla-business-roadster-briefing.pegeechmco.chatgpt.site/`)의 디자인·인터랙션·모션그래픽 아키텍처(11장 기본형) 및 이를 **15장 심층 브리핑으로 확장한 표준 아키텍처(`template_15slides.html`)**를 제공하는 스킬입니다.

- **11장 기본형 템플릿**: `<스킬 폴더>/template.html` (테슬라 비즈니스 & Roadster 브리핑 구조)
- **15장 심층 확장형 템플릿**: `<스킬 폴더>/template_15slides.html` (엔비디아 AI 팩토리 & Rubin 브리핑 구조 — 풀스택 해자·추론 경제학·수요 다변화·피지컬 AI 파이프라인 포함)
- **에셋 및 15초 모션그래픽 자동 생성 스크립트**: `<스킬 폴더>/scripts/generate_assets.py` (Python PIL + FFmpeg로 고해상도 아키텍처 개념도와 15초 30fps MP4 모션그래픽 2편을 즉시 생성)

---

## 1. 디자인 시스템 & 에디토리얼 아이덴티티

### 컬러 팔레트 (`:root` CSS Tokens)
흔한 AI 느낌의 어두운 보라색 그라디언트를 배제하고, **깨끗한 화이트 에디토리얼 캔버스 + 강렬한 마젠타 핑크 & 딥 와인 포인트** 조합을 사용합니다.

| 토큰명 | 색상값 | 용도 |
|---|---|---|
| `--pink` | `#e81768` | 핵심 강조어(`em`), 활성 탭/레버/레일, 주요 데이터 바, CTA 버튼 |
| `--wine` | `#920951` | 보조 강조 수치, 비교 데이터 바, 모달/시트 소제목, 포커스 링 |
| `--ink` | `#292a33` | 기본 본문 타이포그래피, 다크 툴팁, 1차 기준 데이터 바 |
| `--muted` | `#787983` | 보조 설명, 단위, 각주, 비활성 탭 |
| `--line` | `#e9e8ed` | 정갈한 1px 섹션/그리드 구분선 |
| `--pale` | `#fbedf3` | 활성 버튼 배경 틴트, 테이블 헤더, 비활성 비교 막대(`#dcd8e0`) |

### 타이포그래피 & 줄바꿈 원칙
- **폰트 패밀리**: `NanumSquare`(나눔스퀘어 R/B/EB) 또는 `Pretendard`, `sans-serif`.
- **어절 단위 줄바꿈 강제**: `body { word-break: keep-all; overflow-wrap: normal; }`를 전역 적용하여 단어가 중간에서 끊기지 않도록 보장합니다.
- **표지 타이틀 (`cover h1`)**: 3줄 고정 구성(`span` 3개 블록, 각 줄의 핵심 단어에 `<em>` 핑크 포인트 부여).
- **슬라이드 헤딩 (`h2`)**: `clamp(34px, 3.45vw, 61px)`, `font-weight: 800`, 핵심 결론 구절에 `<em>` 적용.
- **아이브로우 (`.eyebrow`)**: 좌측 9px 핑크 원형 도트(`<i></i>`) + 영문 대문자 트래킹(`letter-spacing: 2px`).

### 프레임 구조 (Topbar · Left Rail · Bottombar)
1. **상단 바 (`.topbar`)**: 좌측 브랜드 로고(`BRAND` + 서브타이틀), 중앙 제작자/에디션 크레딧(`.creator-credit`), 우측 기준일(`.edition`) + **글자 편집 토글(`#editorToggle`)** + **전체화면 버튼(`#fullscreen`)**.
2. **좌측 슬라이드 레일 (`.rail`)**: 화면 좌측 중앙에 세로로 `01`~`11` 또는 `01`~`15` 번호 버튼 배치 (`aria-current="true"`일 때 핑크색 굵은 글씨와 좌측 핑크 인디케이터 선 표시; 15장일 때는 `.rail { gap: 8px; } .rail button { font-size: 13px; padding: 5px 0; }` 적용).
3. **하단 바 (`.bottom-bar` & `.progress-track`)**: 현재 페이지 카운터(`01 / 15`), 현재 슬라이드 제목(`#currentTitle`), 이전/다음 화살표 버튼(`#prev`, `#next`), 최하단 3px 그라디언트 진행 바(`#progress`).

---

## 2. 15장 확장형 표준 슬라이드 아키텍처 (`template_15slides.html`)

| 번호 | 클래스 / 레이아웃 | 핵심 역할 및 인터랙션 |
|---|---|---|
| **01** | `slide cover` | 3줄 강조 `h1` + 회전 궤도(`.orbit-a`, `.orbit-b`) 히어로 비주얼 + `발표 시작하기 ↗` (클릭 시 2장 영상 자동 재생) + 하단 4단계 `.cover-flow` |
| **02** | `slide video-slide` | **15초 오프닝 모션그래픽 비디오 (`#videoStage`)** · 진입 시 자동 재생, 이탈 시 일시정지, 커스텀 시크바(`#videoSeek`) 및 전체화면 토글 |
| **03** | `slide finance-slide` | **가로 3단 레버 (`#financeLever`)** (`사업별 매출 / 영업이익 / 투자와 현금흐름`) + **우측 누적 매출 드로어 (`#financeRevenueDrawer`)** + **하단 부문별 시트 (`#financeSectorSheet`)** + **중앙 브릿지 모달 (`#financeMetricModal`)** |
| **04** | `slide annual-slide` | **최근 3개년 연동 대시보드 (`[data-year="0|1|2"]`)** · 연도 선택 시 3개의 Chart.js 차트(전체 매출·핵심 부문 매출·수익성/현금흐름)가 동시에 하이라이트되며 바닥에서 차오르는 트랜지션(`replayAnnualSelection`) 실행 |
| **05** | `slide` (`.operations-layout`) | **최신 분기 운영 실적 2열 비교** · 좌측 선 그래프(`#deliveryChart`) + 우측 막대 그래프(`#storageChart`) + 대형 수치 카운트업(`[data-count]`) |
| **06** | `slide stack-slide` | **4계층 플랫폼/생태계 경쟁 해자 (`.interactive-split`)** · 우측 4계층 버튼(`[data-stack="0~3"]`) 클릭/호버 시 좌측 수평 막대 차트(`#stackChart`)와 하단 상세 박스(`#stackDetailBox`) 실시간 연동 |
| **07** | `slide` (`.roadmap`) | **4대 성장 로드맵 & 바텀 시트 (`#roadSheet`)** · 원형 이니셜 노드 4개 호버 시 요약 전환, 클릭 시 하단에서 슬라이드업 시트가 올라와 `회사 공개 내용(ul)` vs `살펴볼 세부 지표(ol)` 비교 |
| **08** | `slide roadster-slide` | **세로 레버 연동 3단계 스펙 비교 (`#trimLever` `orient="vertical"`)** · 세로 레버 조작에 따라 좌측 공식/아키텍처 이미지(`#trimVisual`), 우측 상세 스펙(`#trimDetails`), 중간 옵션 선택 시 범위 차트(`#accelerationChart`) 연동 |
| **09** | `slide` (`.technology-layout`) | **3대 핵심 기술 개념도 & 3단계 작동 원리 모달 (`#techModal`)** · 좌측 원리 개념도(`mix-blend-mode: multiply`) + 우측 3개 기술 버튼 클릭 시 중앙 모달에서 `01 → 02 → 03` 작동 원리 플로우 표시 |
| **10** | `slide inference-slide` | **효율성·경제성 3단 스위치 비교 (`[data-inf]`)** · 좌측 세대별 비교 막대 차트(`#inferenceChart`)와 하단 3개 필 스위치(`처리량 / 에너지 효율 / 원가 지수`), 우측 대형 카운트업 수치 연동 |
| **11** | `slide sovereign-slide` | **수요 다변화 & 고객 구조 분석 (`[data-sov]`)** · 좌측 수요처 비중 막대 차트(`#sovereignChart`) + 우측 3대 수요 그룹 버튼 클릭/호버 시 차트 막대 하이라이트 및 인사이트 전환 |
| **12** | `slide physical-slide` | **3단계 파이프라인 & 성장 추이 선 차트 (`[data-phys]`)** · 좌측 `01 → 02 → 03` 아키텍처 파이프라인 버튼 + 우측 다년간 성장 추이 라인 차트(`#physicalChart`) 연동 |
| **13** | `slide closing` | **앞으로 확인할 핵심 지표 3선 & 전체 원자료 모달 (`#sources`)** · 좌측 결론 및 사진 + 우측 `01 / 02 / 03` 관찰 리스트 + `공식 공시 자료와 상세 재무 수치 보기 ↗` 팝업 |
| **14** | `slide brand-film-slide` | **15초 엔딩 브랜드 모션그래픽 (`#brandFilmPlayer`)** · 슬라이드 진입 시 자동 재생되는 마무리 홍보 영상 플레이어 |
| **15** | `slide creator-slide` | **제작 안내 및 실시간 편집 가이드** · `1페이지 표지로 돌아가기 ↺` 버튼 및 출처/편집 안내 |

---

## 3. 브라우저 내 실시간 글자 편집 & 단일 HTML 패키징 (`editor.js`)

- 상단 바의 **`글자 편집` (`#editorToggle`)** 버튼을 누르면 모든 슬라이드와 다이얼로그 내 텍스트가 `contentEditable="true"`로 전환되며, 수정한 문구는 브라우저 `localStorage`에 즉시 자동 저장됩니다.
- 하단 플로팅 바(`#textEditorBar`)의 **`HTML 다운로드` (`#editorDownload`)** 버튼을 클릭하면 외부 스타일시트, 스크립트, 웹폰트(`.woff2`), 이미지(`.png/.jpg`), 15초 모션그래픽 영상(`.mp4`)까지 모두 Base64 Data URL로 인라인 내장된 **완전 독립형 단일 `.html` 파일**로 다운로드됩니다.

---

## 4. 제작 및 검증 절차

1. **템플릿 선택 및 복사**:
   - **11장 구성** 요청 시: `<스킬 폴더>/template.html`을 복사하여 수정합니다.
   - **15장 구성** 요청 시: `<스킬 폴더>/template_15slides.html`을 복사하여 수정합니다.
2. **전용 이미지 및 15초 모션그래픽 MP4 생성 (`scripts/generate_assets.py`)**:
   - 사용자가 별도의 이미지나 모션그래픽 영상을 제공하지 않은 경우, `<스킬 폴더>/scripts/generate_assets.py`를 참고하여 Python `PIL`과 `ffmpeg`로 주제에 맞는 고해상도 개념도 이미지 6종과 15초 30fps MP4 모션그래픽 비디오 2편(`*-promo.mp4`, `*-brand-film.mp4`)을 `assets/` 폴더에 생성합니다.
3. **문법 및 렌더링 무결성 검증**:
   - JavaScript 코드는 반드시 `node --check`로 문법 오류 0건을 검증합니다.
   - 로컬 HTTP 서버(`python -m http.server`)와 Playwright로 전 슬라이드(`01`~`11` 또는 `01`~`15`)와 레버·모달·시트·편집기 토글을 순회하며 `pageerror` 및 `console.error` 0건을 확인합니다.

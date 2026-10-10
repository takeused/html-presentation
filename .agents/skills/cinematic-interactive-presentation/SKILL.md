---
name: cinematic-interactive-presentation
description: '"시네마틱 발표자료", "시네마틱 프레젠테이션", "시네마틱 덱", "시네마틱 슬라이드", "시네마틱 웹 발표", "시네마틱 스타일", "영화 같은 발표자료", "인터랙티브 시네마틱" 등 시네마틱 발표 관련 모든 요청 시 최우선으로 사용하는 표준 스킬. 상단 챕터 탭 클릭 점프 내비게이션, 텍스트 가시성 극대화, 단어 분절 없는 1줄 완벽 정렬 레이아웃, 실사 배경 켄번스+다크 비네팅이 결합된 1920x1080 반응형 고품질 HTML 발표자료를 제작합니다.'
---

# Cinematic Interactive Presentation Skill

고화질 실사 사진 배경과 다크 비네팅, 그리고 **상단 챕터 탭 인터랙티브 점프 내비게이션**과 **1줄 완벽 정렬 레이아웃**이 결합된 차세대 웹 기반 발표자료 제작 스킬입니다.
`template.html`의 `DECK` 객체(레이아웃 8종)만 구성하면 1920x1080 고해상도 반응형 단일 HTML 프레젠테이션 덱이 즉시 완성됩니다.

---

## 1. 스타일 & 핵심 특징 (차별화 포인트)

1. **상단 챕터 탭 인터랙티브 점프 (Topbar Click Jump)**:
   - 발표 중 상단 탑바의 챕터 타이틀(`01 패러다임 대전환`, `02 핵심 방법론` 등)을 클릭하면 **해당 챕터의 첫 슬라이드로 즉시 이동**합니다.
   - 좌측 브랜드 배지 클릭 시 **1번 표지(Cover)**로 즉시 복귀합니다.
   - 마우스 호버 시 부드러운 하이라이트 및 툴팁을 제공합니다.
2. **1줄 완벽 정렬 & 단어 쪼개짐 방지 (No-Break Typography)**:
   - `stats` 레이아웃: 라벨 최대 폭을 확장(`max-width: 700px`)하고 `white-space: nowrap`을 적용하여 단어가 아랫줄로 떨어지는 현상을 원천 방지합니다.
   - `flow` 레이아웃: 스텝 카드를 `width: 420px`로 확장하고 `white-space: nowrap; word-break: keep-all;`을 장착하여 한글 단어가 중간에 잘리지 않고 매끄러운 1줄을 유지합니다.
   - `compare` 레이아웃: 패널 폭을 `700px`로 확장하고 리스트 항목에 `word-break: keep-all; align-items: flex-start;`를 적용하여 긴 문장도 어절 중간 분절 없이 1줄로 안착시킵니다.
   - `timeline` 레이아웃: 브라우저 임의 줄바꿈으로 고아 단어(1단어 잔여)가 생기지 않도록, 의미 단위로 `<br>`을 미리 심어 단정한 2줄 배치를 구현합니다 (`white-space: nowrap; text-align: center; line-height: 1.6;`).
   - `quote` 레이아웃: 불필요한 가상요소 큰따옴표(`"`)를 배제하고 거대하고 굵은 타이포그래피로 메시지를 선명하게 전달합니다.
3. **타임라인 다크 글래스 카드 (Frosted Glass Panel)**:
   - `timeline` 레이아웃에 반투명 다크 아크릴 글래스 카드(`backdrop-filter: blur(18px)`)를 장착하여 복잡한 실사 배경에서도 텍스트 가독성을 100% 보장합니다.
4. **시네마틱 다크 비네팅 & 켄번스 애니메이션**:
   - 고화질 실사 배경에 2중 네이비 비네팅 오버레이(`rgba(var(--navy), .68~.96)`)와 텍스트 드롭 섀도우를 적용하여 눈부심을 방지하고 본문 집중도를 극대화합니다.
   - 켄번스(천천히 확대/이동) 효과와 슬라이드 전환 크로스페이드로 한 편의 다큐멘터리 같은 영상미를 제공합니다.

---

## 2. 제작 순서

1. **템플릿 복사**:
   `.agents/skills/cinematic-interactive-presentation/template.html`을 프로젝트 루트에 `<주제>_cinematic_presentation.html`로 복사합니다.
2. **슬라이드 기획**:
   10~15장 내외(Cover 1 + 본문 + Closing 1), 챕터 3~4개로 구성합니다.
3. **고화질 사진 선별**:
   슬라이드별 영문 키워드로 Unsplash 무료 사진을 검색합니다.
   ```bash
   python -I .agents/skills/cinematic-interactive-presentation/scripts/find_photos.py "artificial intelligence" "data network" --n 5
   ```
   출력된 `bg`, `photo` 값을 슬라이드 데이터에 매핑합니다.
4. **DECK 데이터 작성**:
   `DECK` 객체의 `slides` 배열에 8개 레이아웃을 활용해 콘텐츠를 작성합니다. (엔진 CSS/JS는 수정 불필요)
   - *주의 1*: `closing` 슬라이드 부제목(`sub`)은 헤더 생성 함수 `head(s, n)`에서 자동 출력되므로 중복 선언되지 않도록 주의합니다.
   - *주의 2*: 타임라인 설명문은 의미 단위로 `<br>`을 심어 균형 잡힌 2줄로 구성합니다.
   - *주의 3*: `flow`의 `desc`, `timeline`의 `desc`, `stats`의 `label`은 `nowrap`이라 **자동 줄바꿈이 되지 않습니다**. flow 설명이 한 줄 18자를 넘으면 옆 카드(420px)를 침범하므로 의미 단위로 `<br>`을 넣어 2줄로 나눕니다. (예: `'금융 송금·결제 등 중요 의사결정 전<br>안전 일시정지'`)
5. **검증 및 스크린샷 촬영**:
   헤드리스 크롬(Playwright)으로 모든 슬라이드를 캡처하고 자동 점검합니다.
   ```bash
   python -I .agents/skills/cinematic-interactive-presentation/scripts/shoot.py http://localhost:8765/<파일명>.html <슬라이드수> <출력폴더>
   ```
   - `Pretendard 웹폰트: OK`가 나와야 합니다. "로드 안 됨"이면 폰트 링크가 바뀐 것이니 템플릿의 jsDelivr 링크로 되돌립니다.
   - `넘침: 0 건`이 될 때까지 고칩니다. 화면 밖(40~1880px) 이탈, 잘림, **카드 폭 초과**(nowrap 글자가 자기 카드보다 넓어 옆 카드와 겹침)를 잡아 줍니다. 카드 폭 초과는 `<br>`로 나누거나 문장을 줄입니다.
   - `errors: []`를 확인한 뒤 캡처 이미지를 직접 열어 눈으로도 확인합니다(겹침이 없어도 답답한 배치는 자동으로 잡히지 않습니다).
6. **통합 허브(index.html) 연동**:
   `index.html`의 `DECKS` 목록 최상단에 신규 프레젠테이션 정보를 등록합니다.
   - *중요*: `id` 필드는 기존 덱과 겹치지 않는 **고유한 식별자(Unique ID, 예: `langgraph-cinematic`)**를 부여해야 iframe 뷰어 DOM 충돌이 발생하지 않습니다.

---

## 3. 레이아웃 8종 스펙 (DECK.slides)

| 레이아웃 | 주요 필드 | 설명 & 권장 가이드 |
|---|---|---|
| **cover** | eyebrow, title, sub, meta | 표지 슬라이드. 웅장한 헤드라인과 서브타이틀 |
| **stats** | eyebrow, title, items[{value, unit, label}], note | 대형 수치 지표 (2~3개). 라벨은 1줄로 떨어지도록 간결화 |
| **flow** | eyebrow, title, steps[{label, desc}], note | 3단계 프로세스. `01 ➔ 02 ➔ 03` 마름모 배지 + 1줄 설명문 |
| **compare** | eyebrow, title, left/right{title, icon, items}, note | 비교/대조 2열 패널. 우측 패널에 액센트 하이라이트 |
| **bullets** | eyebrow, title, items[{icon, text, em}], note | 아이콘 카드 불릿 (3~4개). 마지막 항목에 `em: true` 강조 |
| **quote** | eyebrow?, quote, by | 결정적 명언/원칙 인용. 가상 따옴표 없이 굵은 텍스트 |
| **timeline** | eyebrow, title, items[{time, label, desc, em}], note | 다크 글래스 카드 위의 3~4단계 일정/마일스톤 |
| **closing** | eyebrow, title, sub, chips[] | 결론 및 요약. 캡슐 칩(chips) 나열 |

---

## 4. 엔진 규칙 (수정 금지 항목)

- **폰트는 jsDelivr의 Pretendard CSS만 사용합니다.** Google Fonts에는 Pretendard가 없어서 `fonts.googleapis.com`으로 바꾸면 조용히 시스템 폰트(맑은 고딕)로 대체됩니다. 폰트가 넓어지면 nowrap 텍스트의 넘침 여부도 달라지므로 폰트를 바꾼 뒤에는 반드시 다시 검증합니다.
- 문자열 안에는 `<br>`, `<em>`, `<b>`만 씁니다. **백틱(`)은 금지**입니다.
- 전체 화면 레이어(`.shade` 등)에 `backdrop-filter`를 추가하지 않습니다. 켄번스 배경 위에서 매 프레임 블러가 계산되어 저사양 노트북에서 끊깁니다. (타임라인 카드처럼 작은 영역은 괜찮습니다)
- `prefers-reduced-motion` 블록과 `<link rel="icon" href="data:,">`(favicon 404 방지)는 지우지 않습니다.
- 통계 수치에는 반드시 출처(`note`)를 답니다. 지어낸 숫자는 쓰지 않습니다.

---

## 5. 조작법 (내비게이션 인터랙션)

- **상단 챕터 탭 클릭**: 해당 챕터의 첫 페이지로 즉시 점프
- **좌측 브랜드 로고 클릭**: 1번 표지(Home)로 복귀
- **마우스 클릭 / 스페이스바 / 방향키(→, ↓)**: 다음 스텝 및 다음 슬라이드
- **방향키(←, ↑)**: 이전 슬라이드
- **숫자 입력 + Enter**: 해당 번호 슬라이드로 퀵 점프
- **G 키 또는 우측 하단 카운터 클릭**: 점프 모달 창 열기
- **F 키**: 전체화면(Fullscreen) 토글
- **URL 해시(#번호)**: 슬라이드 직접 딥링크 (`#5` 입력 시 5번 슬라이드 즉시 진입)

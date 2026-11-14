---
name: cinematic-motion-graphics-presentation
description: '"시네마틱 모션 그래픽 발표자료", "시네마틱 모션그래픽 발표자료", "모션그래픽 발표자료", "모션 그래픽 발표자료", "모션그래픽 덱", "모션 그래픽 슬라이드", "모션 프레젠테이션", "캔버스 모션 발표자료" 등 요청 시 실행하는 스킬. 슬라이드마다 바뀌는 8종 60fps HTML5 캔버스 모션 그래픽 배경 엔진, 초고대비 네온 브리딩 타이틀(레이저 스캔 언더라인), 셀프 드로잉 & 광자 패킷 이동 SVG 차트(svg_cards), 실시간 숫자 오도미터 카운트업(stats), 홀로그램 스캔 등장 애니메이션, 단어 깨짐/잘림 없는 1줄 완벽 정렬 레이아웃이 결합된 1920x1080 반응형 단일 HTML 발표자료를 제작합니다.'
---

# Cinematic Motion Graphics Presentation Skill

고화질 실사 다크 텍스처 위에 **슬라이드별로 전환되는 8종 60fps 프로시저럴 HTML5 `<canvas>` 모션 그래픽 엔진**, **초고대비 네온 브리딩 타이틀(`<em>`) & 레이저 스캔 언더라인**, **셀프 드로잉 & 광자 패킷 이동 SVG 데이터 차트(`svg_cards`)**, **실시간 숫자 오도미터 카운트업(`stats`)**, 그리고 **Flexbox 무결성을 100% 보장하는 홀로그램 와이프 등장 애니메이션**이 결합된 하이엔드 모션 그래픽 발표자료 제작 스킬입니다.

---

## 1. 스타일 & 핵심 특징 (시네마틱 모션 그래픽 5대 엔진)

1. **슬라이드별 8종 60fps 멀티-씬 모션 캔버스 (`#motion-canvas` & `SLIDE_SCENE` · v3 Zero-Starfield Volumetric Engine)**:
   - **절대 금지 (시선 분산 원천 차단)**: 화면 전체에 작은 점(별·먼지 파티클)이 깜빡거리는 효과(`drawStarfield` / `drawPhotons`)나 본문 텍스트 정중앙 뒤에서 점선 원·작은 점들이 어지럽게 움직이는 조잡한 연출은 시선을 분산시키므로 엄격히 금지합니다.
   - **표준 규칙 (Center Safe-Zone & Volumetric Ribbon)**: 본문 타이포그래피가 놓이는 중앙 영역은 깨끗하게 비워두고, 외곽 프레임의 **정밀 캘리브레이션 눈금(`drawPeripheralFrame`)**, **유려한 볼류메트릭 그라디언트 리본 파동(`drawVolumetricRibbon`)**, **주변부 광학 코어·아크(Peripheral Optics)**, 그리고 **슬라이드 전환 시 캔버스 알파 크로스페이드(`transitionProg`)**로 고급스러운 공간감을 연출합니다.
   - 슬라이드 레이아웃과 주제 흐름에 맞춰 8가지 60fps 프로시저럴 볼류메트릭 캔버스 씬이 알파 크로스페이드(`transitionProg`)와 함께 자동 전환됩니다:
     - **Scene 0 (`BIONIC_AURORA` · 표지/명언/클로징)**: 상하단 베젤 볼류메트릭 호라이즌 광원 + 좌우 외곽 사파이어 곡면 코스틱(Caustics) 아크 + 하단 그라디언트 리본 파동
     - **Scene 1 (`WAVEGUIDE_RIBBON` · 핵심 수치/성장 차트)**: 본문 카드 아래쪽(`y > 770`)으로만 펼쳐지는 3D 원근 그리드 매트릭스 + 상하단 실키 간섭광 리본 파동
     - **Scene 2 (`SPATIAL_SCANNER` · 불릿 분석/타깃 시장)**: 본문을 침범하지 않는 좌우 외곽 레인지파인더 아크 + 배경을 부드럽게 가로지르는 수직 스캐닝 라이트 커튼
     - **Scene 3 (`PHOTON_CONDUIT` · 단계별 프로세스 `flow`)**: 3중 파장(시안·골드·아이스블루) 볼류메트릭 베지어 리본 흐름 + 소프트 래디얼 광원 펄스 이동
     - **Scene 4 (`NEURAL_WAVE` · 기술 아키텍처/인터페이스)**: 다중 고조파(Multi-harmonic) 바이오·뉴럴 리본 파형 + 좌하단·우상단 코너 정밀 조리개(Aperture) 호흡 링
     - **Scene 5 (`DUAL_SPECTRUM` · 좌우 비교 `compare`)**: 중앙 프리즘 분할선 기준 좌측(외곽 음향·파동 하모닉 아크) vs 우측(볼류메트릭 광원 팬) 대조 연출
     - **Scene 6 (`CRYSTAL_CAUSTICS` · 역사 타임라인/벤치마크)**: 좌상단 외곽에서 천천히 회전하는 기하학 결정 격자 + 대각선 프리즘 빛줄기(Light Shaft)
     - **Scene 7 (`PRIVACY_SHIELD` · 리스크/찬반 논쟁/거버넌스)**: 상단 베젤의 부드러운 옵티컬 실드 광원 + 하단 보안 링의 느린 호흡 애니메이션과 투톤 리본 파동
   - 코너 텔레메트리 HUD(`#hud-tl`, `#hud-tr`, `#hud-bl`)는 매 프레임 숫자가 정신없이 깜빡거리지 않도록 슬라이드 전환 시 현재 씬의 아키텍처 명칭과 모드를 정갈하게 표시합니다.

2. **초고대비 네온 브리딩 타이틀 (`.title em`, `.quote em`) & 선택적 타이틀 모션그래픽 (`titleFx`)**:
   - **절대 금지**: `.title em`에 `color: transparent`(`background-clip: text`)를 사용하면 부모 `.title`의 검은색 `text-shadow`가 글자 내부를 덮어버려 글씨가 시커멓게 죽어 보입니다.
   - **표준 규칙**: 반드시 불투명한 초고대비 **아이스 시안(`#67e8f9`) ↔ 솔라 골드(`#fef08a`) 브리딩 애니메이션(`emBreathe`)**과 4중 외곽 네온 광원 그림자, 그리고 하단 **레이저 스캔 언더라인(`::after` `laserLineScan`)**을 적용하여 어떤 어두운 배경에서도 압도적인 가시성을 보장합니다.
   - **선택적 타이틀 모션 (`titleFx` · 전체 슬라이드의 40% 내외 핵심 전환 슬라이드에만 선별 적용)**:
     - 모든 슬라이드 타이틀에 일괄 적용하면 피로감을 유발하므로, 일반 본문·비교·차트 슬라이드는 기본 클린 등장으로 두고 **표지·챕터 오프닝·클라이맥스 명언·클로징 등 일부 핵심 슬라이드에만 `titleFx` 속성**을 부여합니다:
       - `titleFx: 'cinematic-expand'` (표지 / 클로징): 넓은 자간(`0.12em`)과 광학 블러에서 정밀 포커스로 수축하며 등장
       - `titleFx: 'laser-wipe'` (주요 챕터 오프닝): 수직 레이저 스캔 광선(`::before`)이 좌→우로 타이틀을 훑으며 마스크 와이프 등장
       - `titleFx: 'word-cascade'` (핵심 프로세스 / 전환 슬라이드): `<br>`과 `<em>` 구조를 100% 보존하면서 어절 단위로 3D 퍼스펙티브 회전(`rotateX(-42deg)`)과 함께 순차 캐스케이드 등장
       - `titleFx: 'prism-lock'` (클라이맥스 명언 `quote`): 시안·골드 양방향 프리즘 색수차 잔상이 중앙으로 수렴하며 락온 등장

3. **문장 무결성 100% 보장 키네틱 등장 애니메이션 (Zero Word-Break Kinetic Reveal)**:
   - **절대 금지**:1) 본문 문장 중간에 인라인 박스 배지(`.mg-hl` 등)를 남발하여 문장 호흡을 끊는 행위, 2) `display: flex`인 `.bullet`이나 `.panel li` 내부 텍스트를 어절 단위 `<span>`으로 쪼개어 Flex 열 충돌(단어 세로 깨짐 및 우측 잘림)을 일으키는 행위는 엄격히 금지합니다.
   - **표준 규칙**: 본문 텍스트는 100% 순수 단일 텍스트 노드로 유지하되, 각 불릿 행(`.bullet.on`)과 비교 리스트 항목(`.panel.hi.on ul li:nth-child(1~3)`), 스텝 카드가 **순차적인 시차(`0.12s → 0.28s → 0.44s`)를 두고 좌→우 홀로그램 브라이트니스 스캔 + 스프링 블러 디졸브(`bulletSlideGlow`, `hologramRowReveal`)**로 등장하게 구현합니다.

4. **셀프 드로잉 & 광자 패킷 이동 SVG 차트 (`svg_cards` & `CHARTS`)**:
   - 곡선/라인 차트에는 `.mg-draw`(`stroke-dashoffset` 드로잉)와 `<animateMotion>` 광자 파티클 주행을 적용합니다.
   - 영역 차트에는 `.mg-area`(페이드인), 막대 차트에는 `.mg-bar-h` / `.mg-bar-v`(탄성 성장), 도넛 게이지 외곽에는 `.mg-ring-spin`(궤도 레티클 회전), 핵심 꼭짓점에는 `.mg-pulse`(맥동) 클래스를 부여합니다.

5. **실시간 숫자 오도미터 카운트업 (`animateNumbers()`) & 마이크로 모션**:
   - `stats` 슬라이드 진입 시 `0`에서 목표 수치(`25%`, `30,000건+`, `625km` 등)까지 1.1초 동안 Quartic Ease-Out 곡선으로 카운트업됩니다.
   - `flow` 마름모 배지 외곽에는 회전 궤도 링(`.dia::after`)이 돌고 화살표 위로 광자 패킷(`.arrow::before`)이 흐르며, `timeline` 노드에는 소나 파동(`.tl-item .dot::after`)이 퍼져나갑니다.

---

## 2. 레이아웃 및 타이포그래피 안전 규격 (텍스트 깨짐/잘림 원천 차단)

- **슬라이드 패딩 (`#slide`)**: `padding: 36px 96px 104px`으로 좌우 가용 폭(`1728px`)을 넓게 확보합니다.
- **타이틀 크기 (`.title`)**: 본문 슬라이드 타이틀은 `68px`(`cover .title`은 `104px`)로 설정하여 40~45자 내외의 비교·분석 제목도 2줄로 꺾이지 않고 1줄에 안착시킵니다.
- **스탯 (`stats`)**: 3열 대형 수치(`550,000명+`, `12,000개+` 등 6~7자리 숫자 + 다글자 단위)가 좌우로 넘치거나 `+` 기호가 아랫줄로 떨어지지 않도록 `.stats` 최대 폭을 `1760px`, `.stat`을 `flex: 1 1 0; padding: 0 38px`로 균등 배분하고, `.stat .v`에 `display: inline-flex; align-items: baseline; white-space: nowrap; font-size: 132px`(`small`은 `52px`)를 강제 적용합니다.
- **불릿 (`bullets`)**: 최대 폭 `1720px`, 폰트 크기 `27px`, `white-space: nowrap`을 적용하여 65~74자 분량의 상세 설명문도 좌측 아이콘(`.ico` `62×62px`, `flex-shrink: 0`) 찌그러짐이나 우측 잘림 없이 **완벽한 1줄**로 표시합니다.
- **비교 카드 (`compare`)**: 좌우 패널 폭을 각 **`820px`**(총 폭 `1676px`)로 확장하고, 패널 제목(`h3`)은 `32px`(`white-space: nowrap`), 리스트 항목(`li`)은 `23px`(`word-break: keep-all`)로 설정하여 카드 내부에서 단어가 세로로 깨지거나 우측 밖으로 잘리는 현상을 원천 방지합니다.

---

## 3. 제작 순서

1. **템플릿 기반 생성 또는 모듈 조립**:
   - 이 스킬 폴더의 `template.html`(Claude Code: `~/.claude/skills/cinematic-motion-graphics-presentation/template.html`, 원본 저장소: `.agents/skills/cinematic-motion-graphics-presentation/template.html`)을 프로젝트 루트에 `<주제>_motion_presentation.html`로 복사하여 `DECK`, `CHARTS`, `SLIDE_SCENE`을 주제에 맞게 구성합니다.
   - **18장 이상 대형 발표자료 제작 시**: 단일 `write_file` 스트림 타임아웃을 방지하기 위해 `scratch/` 폴더에 슬라이드/차트 모듈을 나누어 작성한 뒤 Python 스크립트로 조립합니다.
2. **아이콘 및 JS 문법 검증**:
   - 모든 Iconify 아이콘은 검증된 **100% 소문자 케밥케이스(`solar:*-bold`)**만 사용합니다 (대문자 포함 시 빈 박스로 노출됨).
   - 조립 후 `<script>` 블록을 추출하여 `node --check`로 문법 오류 0건을 반드시 검증합니다.
3. **통합 허브(`index.html`) 등록** (작업 폴더에 `DECKS` 배열을 가진 허브 `index.html`이 있을 때만):
   - `index.html`의 `DECKS` 배열 최상단에 신규 모션 그래픽 발표자료를 등록할 때는 `isCinematic: true`, `style: 'MOTION GRAPHICS'`, 고유한 `id`(`*-motion`), `hook`, `thumb`(표지 Unsplash ID)를 부여하고 CRLF 줄바꿈을 유지합니다.

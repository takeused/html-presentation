# Interactive Motion Briefing Presentations (Tesla & NVIDIA) + Reusable Skill

유튜브 에이커(`byShnblO4Oc`)의 **HTML + 모션그래픽 인터랙티브 브리핑 스타일**을 완벽 구현한 발표자료 프로젝트 및 재사용 가능한 AI 에이전트 스킬 저장소입니다.

## 📂 수록된 발표자료 (Presentations)

1. **TESLA · 사업 현황과 신형 Roadster 브리핑 (11장)**
   - 모듈형 메인 파일: [`index.html`](./index.html) (`style.css`, `app.js`, `finance.js`, `editor.js`, `brand-film.js`)
   - 단일 파일 통합본: [`tesla_business_roadster_briefing.html`](./tesla_business_roadster_briefing.html)
   - 핵심 특징:
     - 2페이지 & 10페이지 15초 모션그래픽 비디오 자동 재생 및 커스텀 컨트롤
     - 3페이지 가로 3단 레버 연동 Chart.js 차트 + 우측 누적 매출 드로어 / 하단 사업부 시트 / 중앙 영업이익 브릿지 모달
     - 4페이지 `2023 / 2024 / 2025` 3개년 연동 실적 대시보드
     - 6페이지 4대 성장 로드맵(`Cybercab / Semi / Megapack / Optimus`) 슬라이드업 바텀 시트
     - 7페이지 세로 레버(`Performance → Thrust → Rocket`) 연동 사양·이미지·가속 범위 차트
     - 8페이지 3대 핵심 기술(`능동 공력장치 / 멀티모드 흡입 시스템 / 냉가스 추력기`) 3단계 작동 원리 모달
     - 상단 **`글자 편집`** 모드 및 영상·이미지 Base64 포함 단일 HTML 다운로드 기능

2. **NVIDIA · AI 팩토리와 차세대 Rubin & 피지컬 AI 브리핑 (15장 확장판)**
   - 단일 파일 통합본: [`nvidia_ai_factory_rubin_briefing.html`](./nvidia_ai_factory_rubin_briefing.html)
   - 핵심 특징:
     - 테슬라 브리핑 스타일을 **15장(`01`~`15`)**으로 확장한 심층 브리핑 덱
     - 전용 15초 모션그래픽 비디오 2편(`assets/nvidia-promo.mp4`, `assets/nvidia-brand-film.mp4`) 및 아키텍처 개념도 탑재
     - `FY24 / FY25 / FY26` 3개년 실적 점프 연동 대시보드 (`$26.97B → $60.92B → $130.50B`, 영업이익률 `62.4%`)
     - 풀스택 4계층 생태계 해자(`Silicon / Interconnect / CUDA-X & NIM / Domain AI`) 연동 차트
     - 세로 레버(`Blackwell → Blackwell Ultra → Vera Rubin`) 연동 랙 스케일 스펙 비교
     - 추론 경제학(`30x` 처리량 / `25x` 에너지 효율 / `95%` 원가 절감), 소버린 AI 수요 다변화, 피지컬 AI 3-컴퓨터 파이프라인(`DGX → Omniverse·Cosmos → AGX Thor`) 수록

## 🛠️ 재사용 스킬 (Skill)

- 경로: [`skill/interactive-motion-briefing-presentation/`](./skill/interactive-motion-briefing-presentation/)
  - [`SKILL.md`](./skill/interactive-motion-briefing-presentation/SKILL.md): 디자인 시스템 토큰, 11장/15장 슬라이드 아키텍처, 인터랙션 명세 및 프롬프트 가이드
  - [`template.html`](./skill/interactive-motion-briefing-presentation/template.html): 11장 기본형 템플릿
  - [`template_15slides.html`](./skill/interactive-motion-briefing-presentation/template_15slides.html): 15장 심층 확장형 템플릿
  - [`scripts/generate_assets.py`](./skill/interactive-motion-briefing-presentation/scripts/generate_assets.py): Python PIL + FFmpeg 기반 아키텍처 개념도 및 15초 모션그래픽 MP4 생성 스크립트

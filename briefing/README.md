# Interactive Motion Briefing Presentations (NVIDIA · 정책) + Reusable Skill

유튜브 에이커(`byShnblO4Oc`)의 **HTML + 모션그래픽 인터랙티브 브리핑 스타일**을 완벽 구현한 발표자료 프로젝트 및 재사용 가능한 AI 에이전트 스킬 저장소입니다.

## 📂 수록된 발표자료 (Presentations)


2. **NVIDIA · AI 팩토리와 차세대 Rubin & 피지컬 AI 브리핑 (15장 확장판)**
   - 단일 파일 통합본: [`nvidia_ai_factory_rubin_briefing.html`](./nvidia_ai_factory_rubin_briefing.html)
   - 핵심 특징:
     - 테슬라 브리핑 스타일을 **15장(`01`~`15`)**으로 확장한 심층 브리핑 덱
     - 전용 15초 모션그래픽 비디오 2편(`assets/nvidia-promo.mp4`, `assets/nvidia-brand-film.mp4`) 및 아키텍처 개념도 탑재
     - `FY24 / FY25 / FY26` 3개년 실적 점프 연동 대시보드 (`$26.97B → $60.92B → $130.50B`, 영업이익률 `62.4%`)
     - 풀스택 4계층 생태계 해자(`Silicon / Interconnect / CUDA-X & NIM / Domain AI`) 연동 차트
     - 세로 레버(`Blackwell → Blackwell Ultra → Vera Rubin`) 연동 랙 스케일 스펙 비교
     - 추론 경제학(`30x` 처리량 / `25x` 에너지 효율 / `95%` 원가 절감), 소버린 AI 수요 다변화, 피지컬 AI 3-컴퓨터 파이프라인(`DGX → Omniverse·Cosmos → AGX Thor`) 수록

3. **국가 R&D · AI 정책 브리핑 (15쪽, 정책 보고서형 재구성판)**
   - 단일 파일: [`national_rnd_ai_policy_briefing.html`](./national_rnd_ai_policy_briefing.html) (원본: `national_rnd_policy_ai_planning_briefing.html`)
   - 기업 브리핑 틀을 걷어내고 정책 보고서 문법(Ⅰ 추진배경 → Ⅱ 비전·전략 → Ⅲ 추진과제 → Ⅳ 이행관리)으로 재구성
   - 한 장 요약, 병목 진단 행렬(As-Is → To-Be), 비전·목표·전략 체계도, 전주기 순환도, 4계층 아키텍처, 성숙도 계단, 재원 브릿지(폭포) 차트, SDL 순환 루프, AI·사람 역할 분담표
   - 1920×1080 고정 스테이지, 쪽별 출처 각주, 글자 편집·HTML 저장·PDF 인쇄(쪽당 1페이지)

4. **연구직 공무원 AI 역량 정책 브리핑 (15쪽, 정책 보고서형 재구성판)**
   - 단일 파일: [`research_official_ai_policy_briefing.html`](./research_official_ai_policy_briefing.html) (원본: `research_official_ai_competency_briefing.html`)
   - 영상·바텀 시트·모달에 숨어 있던 내용을 한 화면에 펼쳐 Ⅰ 추진배경 → Ⅱ 비전·전략 → Ⅲ 추진과제 → Ⅳ 이행관리로 재구성
   - 3개년 업무 변화(연도 선택), 4대 병목 진단, 4대 핵심역량 체계도, 직무 진화 4단계, 주 40시간 재배분 브릿지, 3대 실무 엔진, 협업 3단계, 직렬별 특화 역량, 3단계 인증 트랙, AI·연구직 공무원 역할 분담표

## 🛠️ 재사용 스킬 (Skill)

- 경로: [`skill/interactive-motion-briefing-presentation/`](./skill/interactive-motion-briefing-presentation/)
  - [`SKILL.md`](./skill/interactive-motion-briefing-presentation/SKILL.md): 디자인 시스템 토큰, 11장/15장 슬라이드 아키텍처, 인터랙션 명세 및 프롬프트 가이드
  - [`template.html`](./skill/interactive-motion-briefing-presentation/template.html): 11장 기본형 템플릿
  - [`template_15slides.html`](./skill/interactive-motion-briefing-presentation/template_15slides.html): 15장 심층 확장형 템플릿
  - [`scripts/generate_assets.py`](./skill/interactive-motion-briefing-presentation/scripts/generate_assets.py): Python PIL + FFmpeg 기반 아키텍처 개념도 및 15초 모션그래픽 MP4 생성 스크립트
- 경로: [`skill/policy-briefing-presentation/`](./skill/policy-briefing-presentation/) — **정책 브리핑형 스킬**
  - [`SKILL.md`](./skill/policy-briefing-presentation/SKILL.md): 내용 유형 → 레이아웃 매핑표, 15쪽 장 구조, 정책 팔레트, 인터랙션·데이터 원칙, 체크리스트
  - [`template.html`](./skill/policy-briefing-presentation/template.html): 국가 R&D × AI 정책 브리핑 완성본 템플릿

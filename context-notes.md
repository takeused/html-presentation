# Context Notes

- 2026-09-29: index.html에 없던 파일은 ai_speed_presentation.html 하나뿐(나머지 8개 등록됨).
- 디자인 결정: 기존 "탭 + iframe" 셸을 "허브 갤러리(카드) → 뷰어(슬림 바 + iframe)"로 변경. 해시 형식 `#tab=<id>`는 호환 유지, 해시 없으면 허브 화면.
- 카드 설명은 각 덱의 title 기반으로 짧게 작성(내용 추정 최소화).
- 검증: 브라우저 미리보기에서 9개 카드 렌더, 카드→뷰어→이전/다음→허브 복귀, 카테고리+검색 필터, 콘솔 오류 없음 확인.
- history.replaceState에 location.pathname을 쓰면 data:/null origin 환경에서 SecurityError → 해시(`#hub`)만 사용하도록 수정.
- 새 발표 추가 방법: index.html 스크립트의 DECKS 배열에 한 줄 추가.
- 2026-09-29: 다크 → 라이트(흰 배경) 테마로 전환. 파스텔 오로라 배경, 흰 카드+소프트 섀도, 잉크색 활성 칩/버튼, hue는 흰 배경용으로 조정.
- 2026-09-29: 레퍼런스(dashboard1-3st.pages.dev, IBM Carbon 스타일) 반영. IBM Plex Sans(KR), 헤어라인·각진 카드+좌측 컬러바, 유틸리티 스트립, 통계 패널(클릭 필터)+분포 바, 밑줄 검색(/ 단축키), 카테고리 색은 cat 단위(deck hue 제거). 다크 토글은 사용자가 다크 싫어해서 제외.
- 2026-09-29: 전면 재디자인(흰 배경·IBM Plex 유지). 카드 그리드 → 좌측 고정 대형 타이포(Signal/Hub. 아웃라인)+필터, 우측 번호 목차 행(hover 시 검정 반전+설명 펼침), 상단 티커, 뷰어는 검정 하단선 바+위치(08/09). 터치 기기는 설명 상시 표시. #hub overflow-x hidden(슬라이드인 애니메이션 가로스크롤 방지).

## 2026-10-10 시네마틱 발표자료 스킬
- 레퍼런스: youtube NWoJHsKIT1A 1:41~. 특징은 실사 배경 + 다크 오버레이/비네팅, 상단 챕터 진행 바(로고 배지 + 4탭 + 진행 게이지), 파란 아이브로우 + 큰 흰 헤드라인 가운데 정렬, 아이콘 불릿 / 01→02→03 마름모 플로우, 단색 블루 액센트, 순차 페이드업.
- 배경 이미지: 사용자 보유 사진 없음 → Unsplash 무료 라이선스(premium/plus 제외) 사진을 images.unsplash.com 핫링크로 사용(Unsplash 가이드가 핫링크를 권장). 로드 실패/오프라인이면 CSS 절차적 배경으로 자동 대체. 생성형 이미지는 크레딧 비용·일관성 문제로 기본값에서 제외.
- 사진 찾기: 브라우저로 unsplash.com 접속 후 /napi/search/photos?query=..&orientation=landscape JSON에서 premium/plus 아닌 것만 추림.
- 구조: 덱은 레포 관례대로 단일 HTML. 슬라이드는 JS DECK 객체(레이아웃 + 문자열)만 편집하면 되게 하고 렌더 함수가 HTML 생성 → 기존 스킬의 "템플릿 리터럴 내 백틱" 사고 원천 차단.
- reveal: 기본은 영상처럼 자동 순차 등장(auto). 발표자가 클릭으로 하나씩 보이고 싶으면 reveal:'click'.
- 데모 주제: "딥워크 — 산만한 시대에 집중을 되찾는 법"(사진 연출이 잘 맞고 범용적). 통계는 Gloria Mark 연구(화면 평균 집중 47초, 중단 후 복귀 약 23분)만 사용.

## 2026-10-10 (오후) 외부 작업 반영 — cinematic-interactive-presentation
- 다른 세션에서 새 스킬 `cinematic-interactive-presentation`(챕터 탭 클릭 점프, 1줄 타이포, 타임라인 글래스 카드)을 만들고 기존 `cinematic-presentation`은 레거시로 표시함. template.html은 langgraph_cinematic_presentation.html과 데이터만 다른 동일 엔진.
- 발견한 회귀: 폰트를 Google Fonts `family=Pretendard`로 바꿨는데 Google에는 Pretendard가 없음(JetBrains Mono만 응답) → 시스템 폰트로 조용히 대체. jsDelivr Pretendard로 복구, 미사용 JetBrains Mono 제거. favicon 404 스텁과 prefers-reduced-motion 블록도 복구.
- shoot.py 강화: ① Pretendard FontFace 실제 로드 여부(document.fonts.check는 폰트가 아예 없어도 true라 못 씀) ② Range 기준 글자 영역의 화면 이탈·잘림 ③ nowrap 글자가 자기 카드(.step/.stat/.tl-item/.panel)보다 넓은지. 이동은 go(i)로 해서 click reveal 모드에서도 동작.
- 폰트가 Pretendard로 돌아오자 LangGraph 7번(flow) 설명 3개가 420px 카드를 넘어 옆 카드와 붙음 → 내용은 그대로 두고 의미 단위 <br>로 2줄 분리. SKILL.md에 "flow desc 18자 초과 시 <br>" 규칙 추가.
- 검증: langgraph/deep_work/ai_learning_talent 3개 덱과 템플릿 모두 폰트 OK, 넘침 0, 콘솔 오류 0. 챕터 탭 1~4 → 1/4/7/9번, 브랜드 → 1번, hashchange 동작 확인.

- 2026-10-10: 위성 재난 덱(8장) 제작 중 사용자 피드백 반영. ① quote 장식 따옴표 제거(레거시·프로젝트 template.html에 `.quote::before`가 남아 있었음, 인터랙티브 템플릿은 이미 제거) ② 배경이 뭉개져 보인다는 지적 → 이미지 w=1920/q=75를 w=2560/q=88로, brightness .9→.95, saturate .85→.9, 비네팅 .28/.7/.92→.24/.62/.88로 소폭 조정(본문 가시성 유지) ③ Pretendard 로드 실패는 작업 환경이 CDN에 접속하지 못해서였고 링크 자체는 정상. 폐쇄망 발표 시 로컬 폰트로 전환 필요. ④ 첫 줄 `<!-- 시네마틱 발표자료: 주제 (N장) -->` 규칙은 템플릿에 없어서 덱 생성 시 직접 추가.

## 2026-10-10 (밤) 브리핑 강의형 스타일 — briefing-lecture-presentation
- 레퍼런스: youtube AHlWV-nI9yo. 시네마틱(실사·다크)과 정반대인 흰 배경 강의 슬라이드. 영상 속 발표자 원형 캠과 자막은 영상 편집물이라 제외.
- 관찰한 구성: ① 파트 표지(딥 네이비→블루 그라디언트, 얇은 격자선+큰 원, "Part 0." 블루 그라디언트, 좌하단 로고·연락처) ② Contents(01~04 번호 목록) ③ 섹션 구분(거의 검정 배경, 블루 번호+흰 대제목+회색 보조 2줄) ④ 본문(흰 배경, 좌상단 파란 PART 아이브로우, 제목은 가는 글씨+굵은 강조부, 좌측 연회색 카드에 큰 그라디언트 수치+작은 단위, 우측 표(진회색 헤더·연파랑 줄무늬·파란 수치) 또는 선택지 카드(하나만 진파랑), 회색 출처 줄, 굵은 결론 한 줄) ⑤ 막대그래프(회색 막대, 강조 막대만 블루 그라디언트) ⑥ 「」 인용 카드 2개 ⑦ 수치 카드 3개 ⑧ 하단 챕터 바(현재 챕터 진회색 채움)+페이지 카운터.
- 엔진: cinematic-interactive 템플릿의 이동/점프/해시/스케일 JS를 재사용하고 레이아웃·CSS만 새로 작성. 배경 사진·아이콘 의존 없음(Unsplash, Iconify 불필요).
- 데모 주제는 수치 출처를 확신할 수 있는 "집중력"으로 정함(Gloria Mark 『Attention Span』 2023, Mark 외 CHI 2008 23분 15초, Microsoft Work Trend Index 2023). 인용 카드는 원문 직역 대신 "요지"로 표기.
- 검증: 데모 12장·템플릿 11장 모두 폰트 OK, 넘침 0, 콘솔 오류 0. 챕터 바 01/02/03 → 3/6/9번(섹션 장), 표지·목차에서는 바 숨김 확인. 허브 카드 렌더 확인.
- 수정 1: 표의 값 열이 첫 열이면 왼쪽 구분선이 붕 떠 보여서, 구분선은 값 열이 첫 열이 아닐 때만(`.v.sep`) 그림.
- 수정 2: 막대그래프에서 출처 줄이 막대 라벨에 붙어 `.src` 위 여백 24px 추가.
- shoot.py는 카드 선택자를 이 스타일용(.opt/.scard/.bcol/.qcard/.card/.tbl .row)으로 바꾸고 세로 안전 영역(30~1030px)을 추가함.
- 데모의 64%, 평균 2개, 23분 15초(인터뷰 출처) 수치는 기억에 기반한 인용이라 발표 전 원문 확인 권장.
- 2026-10-10: 대표 호출어를 '브리핑 발표자료'로 정함(사용자 선택). Claude Code 전역(~/.claude/skills/briefing-lecture-presentation)에 복사 설치. SKILL.md 경로를 '<스킬 폴더>' 기준으로 바꿔 어느 작업 폴더에서도 쓰이게 함. 레포 안 원본이 기준이며, 고치면 전역 사본에 다시 복사해야 함.

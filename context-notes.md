# Context Notes

- 2026-09-29: index.html에 없던 파일은 ai_speed_presentation.html 하나뿐(나머지 8개 등록됨).
- 디자인 결정: 기존 "탭 + iframe" 셸을 "허브 갤러리(카드) → 뷰어(슬림 바 + iframe)"로 변경. 해시 형식 `#tab=<id>`는 호환 유지, 해시 없으면 허브 화면.
- 카드 설명은 각 덱의 title 기반으로 짧게 작성(내용 추정 최소화).
- 검증: 브라우저 미리보기에서 9개 카드 렌더, 카드→뷰어→이전/다음→허브 복귀, 카테고리+검색 필터, 콘솔 오류 없음 확인.
- history.replaceState에 location.pathname을 쓰면 data:/null origin 환경에서 SecurityError → 해시(`#hub`)만 사용하도록 수정.
- 새 발표 추가 방법: index.html 스크립트의 DECKS 배열에 한 줄 추가.
- 2026-09-29: 다크 → 라이트(흰 배경) 테마로 전환. 파스텔 오로라 배경, 흰 카드+소프트 섀도, 잉크색 활성 칩/버튼, hue는 흰 배경용으로 조정.
- 2026-09-29: 레퍼런스(dashboard1-3st.pages.dev, IBM Carbon 스타일) 반영. IBM Plex Sans(KR), 헤어라인·각진 카드+좌측 컬러바, 유틸리티 스트립, 통계 패널(클릭 필터)+분포 바, 밑줄 검색(/ 단축키), 카테고리 색은 cat 단위(deck hue 제거). 다크 토글은 사용자가 다크 싫어해서 제외.

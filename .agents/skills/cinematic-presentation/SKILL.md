---
name: cinematic-presentation
description: 실사 사진 배경 + 다크 오버레이 + 상단 챕터 진행 바 + 가운데 정렬 타이포의 "시네마틱 다큐" 스타일 HTML 발표자료를 만든다. template.html의 DECK 객체(레이아웃 8종)만 채우면 1920x1080 단일 HTML 덱이 완성된다. 유튜브 설명 영상 같은 사진 배경 발표, 시네마틱/HUD 스타일 슬라이드 요청 시 사용.
---

# Cinematic Presentation Skill

## 1. 스타일 핵심 (바꾸지 말 것)
- 슬라이드마다 주제에 맞는 **실사 사진 전체 배경** + 네이비 비네팅 오버레이 + 켄번스(느린 줌) + 크로스페이드
- **상단 챕터 바**: 로고 배지 + 챕터 탭 4개 내외 + 활성 탭 진행 게이지
- **파란 아이브로우 + 큰 흰 헤드라인**, 가운데 정렬. 강조색은 `DECK.accent` 하나만 쓴다
- 요소는 순서대로 페이드업한다(`reveal: 'auto'`). 발표자가 직접 넘기려면 `'click'`을 쓴다
- 모서리 HUD 브래킷, 옅은 빛줄기, 필름 그레인

## 2. 만드는 순서
1. `template.html`을 레포 루트에 `<주제>_cinematic_presentation.html`로 복사한다
2. 슬라이드 구성을 정한다. 10장 기준으로 cover 1 + 본문 8 + closing 1, 챕터는 3~4개
3. 사진을 찾는다. 슬라이드마다 영어 키워드를 정해서 실행한다
   ```bash
   python -I .agents/skills/cinematic-presentation/scripts/find_photos.py "laptop night" "misty forest" --n 5
   ```
   출력된 `bg`/`photo` 값을 슬라이드에 넣는다. 무료 라이선스(premium/plus 제외)만 나오고, 크레딧은 자동으로 표시된다
   어둡고 피사체가 한쪽에 있는 사진이 글자와 잘 어울린다
4. `DECK` 객체만 수정한다. **엔진 CSS/JS는 건드리지 않는다**
5. 검증한다. 정적 서버를 띄운 뒤 캡처해서 각 슬라이드를 눈으로 확인한다
   ```bash
   python -I .agents/skills/cinematic-presentation/scripts/shoot.py http://localhost:8765/<file>.html 10 <출력폴더>
   ```
   확인할 것: 글자 줄바꿈, 넘침, 콘솔 오류 없음
6. `index.html`의 `DECKS` 배열에 한 줄을 추가한다

## 3. 레이아웃 8종 (DECK.slides 항목)
| layout | 필드 | 용도 |
|---|---|---|
| cover | eyebrow, title, sub, meta | 표지 |
| bullets | eyebrow, title, items[{icon, text, em}] | 아이콘 불릿 최대 4개, 마지막은 em으로 결론 |
| stats | eyebrow, title, items[{value, unit, label}], note | 큰 숫자 2~3개, 출처는 note에 |
| flow | eyebrow, title, steps[{label, desc}], note | 01→02→03 마름모 단계 |
| compare | eyebrow, title, left/right{title, icon, items} | 오른쪽이 강조 |
| quote | eyebrow?, quote, by | 핵심 한 문장 |
| timeline | eyebrow, title, items[{time, label, desc, em}] | 3~5개 일정 |
| closing | eyebrow, title, sub, chips[] | 결론 + 요약 칩 |

공통 필드: `chapter`(0부터), `bg`(Unsplash ID 또는 URL·상대경로), `photo`(작가), `focus`(배경 위치), `reveal`

## 4. 규칙
- 문자열 안에는 `<br>`, `<em>`, `<b>`만 쓴다. **백틱(`)은 금지**
- 헤드라인은 한 줄 22자 이내, 불릿은 한 줄로 끝낸다
- 통계 수치에는 반드시 출처(note)를 단다. 지어낸 숫자는 쓰지 않는다
- 사진이 로드되지 않거나 오프라인이면 그라디언트 배경으로 자동 대체되고 크레딧은 숨겨진다
- 성능 때문에 전체 화면 레이어에 `backdrop-filter`를 추가하지 않는다

## 5. 조작
→/Space 다음, ← 이전, 숫자+Enter 점프, G 점프 모달, 카운터 클릭, F 전체화면, Home/End, 스와이프, `#번호` 딥링크

데모: `deep_work_cinematic_presentation.html`

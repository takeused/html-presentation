---
name: briefing-lecture-presentation
description: '"브리핑 발표자료" 요청 시 실행하는 스킬. "브리핑 발표자료 만들어줘", "브리핑 덱", "브리핑 스타일로", "브리핑 슬라이드", "데이터 브리핑", "강의 발표자료", "강의형 슬라이드", "흰 배경 발표자료", "조코딩 스타일" 등도 같은 요청으로 본다. 흰 배경에 큰 수치·표·막대그래프로 근거를 보여 주는 강의형 1920x1080 단일 HTML 덱을 만든다(네이비 격자 파트 표지, 검정 섹션 구분, 가는 제목+굵은 강조, 그라디언트 수치 카드, 출처 줄, 결론 한 줄, 하단 챕터 바). 실사 사진 배경의 영화 같은 덱("시네마틱 발표자료")은 cinematic-interactive-presentation을 쓴다.'
---

# Briefing Lecture Presentation

흰 배경 강의형 "데이터 브리핑" 덱을 만드는 스킬이다. 레퍼런스는 조코딩 AI 리터러시 특강 1편(youtube AHlWV-nI9yo)의 발표 화면이다.
이 스킬 폴더의 `template.html`을 복사해서 맨 아래 `DECK` 객체만 채우면 된다. 아래에서 `<스킬 폴더>`는 이 SKILL.md가 있는 폴더다(전역 설치 시 `~/.claude/skills/briefing-lecture-presentation`). 사진·아이콘 CDN이 필요 없고, 폰트(Pretendard)만 불러온다.

## 1. 스타일

- **파트 표지(part)**: 딥 네이비→블루 그라디언트 위에 얇은 격자선과 큰 원 두 개. `Part 1 · 3클립` 작은 글씨, 블루 그라디언트 `Part 1.`, 흰 대제목, 좌하단 로고·연락처. 마무리 장도 이 레이아웃을 쓴다.
- **목차(contents)**: 흰 배경, 왼쪽 `Contents`, 오른쪽 01~0N 번호 목록과 회색 태그.
- **섹션 구분(section)**: 거의 검정 배경, 블루 번호, 흰 대제목, 회색 보조 두 줄.
- **본문 공통**: 흰 배경. 좌상단 파란 아이브로우(`PART 1. …`), 제목은 가는 글씨로 시작해 핵심만 `<b>`로 굵게. 아래쪽에 회색 출처 줄(`src`)과 굵은 결론 한 줄(`take`). 맨 아래 챕터 바(현재 챕터만 진회색으로 채움)와 페이지 카운터.
- 강조색은 하나(기본 `#2f62f0`→`#4cc3f5` 그라디언트). 강조 카드나 강조 막대는 한 장에 하나~둘만 쓴다.

## 2. 제작 순서

1. 주제와 분량을 확인한다. 기본은 10~15장, 챕터 3~4개, 표지 1장 + 목차 1장 + 챕터마다 섹션 1장 + 마무리 1장이다.
2. `<스킬 폴더>/template.html`을 작업 폴더에 `<주제>_briefing_presentation.html`로 복사하고, 첫 줄을 `<!-- 브리핑 강의형 발표자료: <주제> (<N>장) -->`로, `<title>`을 덱 제목으로 바꾼다.
3. `DECK`의 `brand{name, contact}`, `eyebrow`, `accent`, `accent2`, `chapters[]`, `slides[]`를 채운다. 엔진 CSS와 렌더링 엔진 블록은 고치지 않는다.
4. 검증한다(5장 참고).
5. 작업 폴더에 발표 허브 `index.html`(DECKS 배열)이 있으면 맨 위에 등록한다. `id`는 기존과 겹치지 않게 짓고 `isCinematic: false`로 둔다.

## 3. 레이아웃 7종 (slides[].layout)

| 레이아웃 | 필드 | 메모 |
|---|---|---|
| part | kicker, part, title, sub? | 표지·마무리. 챕터 바 없음 |
| contents | tags[]?, items[]? | items를 비우면 `DECK.chapters`를 쓴다 |
| section | chapter, title, meta[], num? | num을 비우면 챕터 번호(01…) |
| split | chapter, title, left, right, src, take | 좌측 카드 + 우측 표/선택지 |
| bars | chapter, title, items[{label, value, unit, em, show?}], src, take, h? | 막대 높이는 최댓값 기준 비례(기본 300px). 강조 막대만 `em` |
| quotes | chapter, title, items[{quote, desc, by}], src, take | 카드 2개. 인용은 「」로 감싼다 |
| cards | chapter, title, items[{value, unit, label, desc}], src, take | 수치 카드 3개 |

`split`의 좌우 블록은 다음 중 하나다.

- `left: { type: 'metric', value, unit, label, desc }` 큰 그라디언트 수치
- `left: { type: 'text', head, paras[] }` 개념 설명
- `right: { type: 'table', cols, head[], rows[][], val }` `cols`는 CSS grid 열 너비(예 `'1.6fr .6fr 1fr'`), `val`은 파란 값 열 번호(0부터)
- `right: { type: 'options', items[{k?, t, d?, em}] }` 세로 선택지 카드, `em`인 카드 하나만 진파랑

## 4. 규칙

- 폰트는 jsDelivr Pretendard만 쓴다. Google Fonts에는 Pretendard가 없어서 바꾸면 조용히 시스템 폰트로 바뀐다.
- 문자열 안에는 `<br>`, `<b>`, `<em>`만 쓴다. 백틱은 쓰지 않는다.
- 제목은 한 줄(약 32자 이내)을 기본으로 한다. 길면 `<br>`로 두 줄까지 쓰되 본문 공간이 줄어든다.
- 카드 설명·인용 설명은 자동 줄바꿈되지만, 의미 단위로 `<br>`을 넣어 줄 끝을 맞추면 레퍼런스처럼 단정해진다. 막대 라벨(`.bcol .lb`)은 nowrap이라 길면 `<br>`로 나눈다.
- 모든 수치에는 `src`에 출처를 단다. 지어낸 숫자는 쓰지 않고, 확인 못 한 숫자는 사용자에게 묻는다. 인용을 원문 그대로 옮길 수 없으면 "요지"라고 밝힌다.
- 결론 한 줄(`take`)은 마침표로 끝나는 짧은 평서문으로 쓴다. 한국어 문장 끝에 콜론을 쓰지 않는다.
- `prefers-reduced-motion` 블록과 `<link rel="icon" href="data:,">`는 지우지 않는다.

## 5. 검증

```bash
python -m http.server 8765        # 작업 폴더에서 (이미 떠 있으면 생략)
python -I <스킬 폴더>/scripts/shoot.py http://localhost:8765/<파일명>.html <슬라이드수> <출력폴더>
```

- shoot.py에는 Playwright와 Chrome이 필요하다(`pip install playwright`).
- `Pretendard 웹폰트: OK`, `넘침: 0 건`, `errors: []`가 나와야 한다. 넘침은 화면 밖(가로 40~1880px, 세로 30~1030px — 하단 챕터 바 위) 이탈, 잘림, 자기 카드 폭 초과를 잡는다.
- 캡처를 직접 열어 눈으로도 본다. 결론 줄이 출처 줄과 붙거나, 카드 높이가 들쭉날쭉한 것은 자동으로 잡히지 않는다.
- 외부 접속이 막힌 환경에서는 폰트 점검을 통과할 수 없으니 사용자에게 알린다.

## 6. 조작법

클릭, 스페이스, →, ↓는 다음 단계, ←, ↑는 이전 장이다. 하단 챕터 바를 누르면 그 챕터의 첫 장(섹션 장)으로 간다. 숫자를 치고 Enter를 누르면 그 장으로, G 키나 오른쪽 아래 카운터를 누르면 점프 창, F 키는 전체화면이다. 주소 뒤에 `#5`를 붙이면 5장으로 바로 열린다. `DECK.reveal`을 `'click'`으로 바꾸면 요소가 클릭할 때마다 하나씩 나타난다.

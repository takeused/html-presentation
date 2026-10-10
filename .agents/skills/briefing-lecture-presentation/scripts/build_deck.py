# 브리핑 템플릿에 DECK 데이터 파일을 끼워 넣고 첫 줄 주석·<title>을 바꿔 덱 HTML을 만드는 조립 스크립트
# 사용: python build_deck.py <template.html> <deck.js> <출력.html> "<덱 제목>" <장수>
# deck.js에는 const DECK = { ... }; 블록만 쓴다. 셸 heredoc 대신 파일로 넘기면 따옴표·백틱 문제를 피한다
import re, sys
tpl, deck_js, out, title, n = sys.argv[1:6]
t = open(tpl, encoding='utf-8').read()
deck = open(deck_js, encoding='utf-8').read().strip()
s = re.sub(r"const DECK = \{.*?\n\};", lambda m: deck, t, count=1, flags=re.S)
s = s.replace('<!-- 브리핑 강의형 발표자료 템플릿: 맨 아래 DECK 객체만 채운다 -->', f'<!-- 브리핑 강의형 발표자료: {title} ({n}장) -->', 1)
s = s.replace('<title>Briefing Lecture Presentation</title>', f'<title>{title}</title>', 1)
assert s != t and '브랜드명' not in s and f'({n}장)' in s
open(out, 'w', encoding='utf-8').write(s)
print('ok', out)

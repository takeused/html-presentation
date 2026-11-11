# template.html의 DECK·CHARTS 블록을 별도 JS 파일 내용으로 교체해 시네마틱 덱 HTML을 조립하는 스크립트
# 사용: python -I build_deck.py <deck.js> <charts.js> <출력.html> --title "<주제>" --slides <N>
#   deck.js   : "const DECK = { ... };" 전체
#   charts.js : "const CHARTS = { ... };" 전체 (차트가 없으면 "const CHARTS = {};")
# 첫 줄 주석(<!-- 시네마틱 발표자료: 주제 (N장) -->)과 <title>도 함께 채운다.
import sys, re, pathlib, argparse
sys.stdout.reconfigure(encoding="utf-8")

ap = argparse.ArgumentParser()
ap.add_argument("deck"); ap.add_argument("charts"); ap.add_argument("out")
ap.add_argument("--title", required=True); ap.add_argument("--slides", type=int, required=True)
a = ap.parse_args()

tpl = pathlib.Path(__file__).resolve().parent.parent / "template.html"
t = tpl.read_text(encoding="utf-8")
deck = pathlib.Path(a.deck).read_text(encoding="utf-8").strip()
charts = pathlib.Path(a.charts).read_text(encoding="utf-8").strip()
assert deck.startswith("const DECK = {") and deck.endswith("};"), "deck.js는 'const DECK = {'로 시작해 '};'로 끝나야 합니다"
assert charts.startswith("const CHARTS = {") and charts.endswith("};"), "charts.js는 'const CHARTS = {'로 시작해 '};'로 끝나야 합니다"

t, n1 = re.subn(r"const DECK = \{.*?\n\};", lambda m: deck, t, count=1, flags=re.S)
t, n2 = re.subn(r"const CHARTS = \{.*?\n\};", lambda m: charts, t, count=1, flags=re.S)
t, n3 = re.subn(r"<title>.*?</title>", f"<title>{a.title} · 시네마틱 발표자료</title>", t, count=1)
assert (n1, n2, n3) == (1, 1, 1), f"템플릿 구조가 바뀌었습니다 (DECK {n1}, CHARTS {n2}, title {n3})"
t = t.replace("덱 데이터 — 템플릿 예시", "덱 데이터")

found = len(re.findall(r"layout:\s*'", deck))
if found != a.slides:
    print(f"경고: --slides {a.slides}장인데 DECK에는 layout이 {found}개 있습니다")

header = f"<!-- 시네마틱 발표자료: {a.title} ({a.slides}장) -->\n"
pathlib.Path(a.out).write_text(header + t, encoding="utf-8", newline="\n")
print("조립 완료:", a.out)

# Unsplash에서 무료 라이선스 가로 사진을 검색해 DECK에 넣을 bg/photo 값을 출력하는 스크립트
# 사용: python find_photos.py "laptop night" "misty forest" [--n 5]
# 일반 HTTP 요청은 Unsplash가 막으므로 헤드리스 크롬(Playwright) 안에서 검색 API를 호출한다.
import sys, asyncio
sys.stdout.reconfigure(encoding="utf-8")
from playwright.async_api import async_playwright

SEARCH = """async ([q, n]) => {
  const r = await fetch('/napi/search/photos?per_page=20&orientation=landscape&plus=none&query=' + encodeURIComponent(q));
  const j = await r.json();
  return j.results
    .filter(x => !x.premium && !x.plus && x.urls.raw.includes('images.unsplash.com/photo-'))
    .slice(0, n)
    .map(x => ({ bg: x.urls.raw.split('?')[0].split('/').pop(), photo: x.user.name,
                 alt: x.alt_description || '', thumb: x.urls.small }));
}"""

async def main(queries, n):
    async with async_playwright() as p:
        b = await p.chromium.launch(channel="chrome")
        # 기본 헤드리스 UA(HeadlessChrome)는 제한된 결과만 받으므로 일반 크롬 UA를 쓴다
        ua = f"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/{b.version} Safari/537.36"
        pg = await b.new_page(user_agent=ua)
        await pg.goto("https://unsplash.com/", wait_until="domcontentloaded")
        for q in queries:
            print(f"\n# {q}")
            for x in await pg.evaluate(SEARCH, [q, n]):
                print(f"bg: '{x['bg']}', photo: '{x['photo']}',  // {x['alt']}\n    thumb: {x['thumb']}")
        await b.close()

args = sys.argv[1:]
n = 5
if "--n" in args:
    i = args.index("--n"); n = int(args[i + 1]); del args[i:i + 2]
if not args:
    sys.exit('usage: python find_photos.py "query" ["query" ...] [--n 5]')
asyncio.run(main(args, n))

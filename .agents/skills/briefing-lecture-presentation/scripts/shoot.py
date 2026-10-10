# 브리핑 강의형 덱의 각 슬라이드를 헤드리스 크롬으로 캡처하고 폰트 로드·텍스트 넘침·콘솔 오류를 점검하는 검증 스크립트
# 사용: python shoot.py http://localhost:8765/<덱>.html <슬라이드수> <출력폴더>
import sys, asyncio
sys.stdout.reconfigure(encoding="utf-8")
from playwright.async_api import async_playwright

url, n, out = sys.argv[1], int(sys.argv[2]), sys.argv[3]

# #slide 안의 실제 글자 영역(Range 기준)이 무대 안전 영역(가로 40~1880px, 세로 30~1030px — 하단 챕터 바 위)이나 자기 카드 폭을 넘거나, 잘린 요소를 찾는다
OVERFLOW = """() => {
  const bad = [];
  document.querySelectorAll('#slide *').forEach(el => {
    if (el.childElementCount || !el.textContent.trim()) return;   // 글자를 가진 말단 요소만
    const rg = document.createRange(); rg.selectNodeContents(el);
    const r = rg.getBoundingClientRect();
    const clipped = el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflow !== 'visible';
    const card = el.closest('.opt,.scard,.bcol,.qcard,.card,.tbl .row');   // nowrap 글자가 자기 카드 폭을 넘으면 옆 카드와 겹친다
    const cr = card && card.getBoundingClientRect();
    const tag = `${el.className || el.tagName}: ${Math.round(r.left)}~${Math.round(r.right)}px "${el.textContent.trim().slice(0, 24)}"`;
    if (r.left < 40 || r.right > 1880 || r.top < 30 || r.bottom > 1030 || clipped) bad.push(tag);
    else if (cr && (r.left < cr.left - 2 || r.right > cr.right + 2)) bad.push(`카드 폭 초과 ${Math.round(r.width)}>${Math.round(cr.width)}px · ${tag}`);
  });
  return [...new Set(bad)].slice(0, 5);
}"""

# document.fonts.check는 등록된 폰트가 없어도 true를 돌려주므로, 실제 로드된 FontFace를 확인한다
FONT = """() => [...document.fonts].some(f => f.family.replace(/["']/g, '') === 'Pretendard' && f.status === 'loaded')"""

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(channel="chrome")
        pg = await b.new_page(viewport={"width": 1920, "height": 1080})
        errs = []
        pg.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
        pg.on("pageerror", lambda e: errs.append(str(e)))
        await pg.goto(url + "#1"); await pg.wait_for_load_state("networkidle")
        await pg.evaluate("document.fonts.ready")
        font = await pg.evaluate(FONT)
        print("Pretendard 웹폰트:", "OK" if font else "로드 안 됨 — 폰트 링크 확인(Google Fonts에는 Pretendard가 없음)")
        problems = 0
        for i in range(1, n + 1):
            await pg.evaluate(f"go({i - 1})")          # reveal 모드와 무관하게 슬라이드 단위로 이동
            await pg.wait_for_timeout(2600)
            await pg.screenshot(path=f"{out}/s{i:02d}.png")
            for line in await pg.evaluate(OVERFLOW):
                problems += 1; print(f"  s{i:02d} 넘침: {line}")
        print("넘침:", problems, "건")
        print("errors:", errs)
        await b.close()

asyncio.run(main())

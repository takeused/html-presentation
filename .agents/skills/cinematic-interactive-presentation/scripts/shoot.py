# 덱의 각 슬라이드를 헤드리스 크롬으로 캡처하는 검증 스크립트
import sys, asyncio
sys.stdout.reconfigure(encoding="utf-8")
from playwright.async_api import async_playwright
url, n, out = sys.argv[1], int(sys.argv[2]), sys.argv[3]
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(channel="chrome")
        pg = await b.new_page(viewport={"width":1920,"height":1080})
        errs=[]
        pg.on("console", lambda m: errs.append(m.text) if m.type=="error" else None)
        pg.on("pageerror", lambda e: errs.append(str(e)))
        await pg.goto(url+"#1"); await pg.wait_for_load_state("networkidle")
        for i in range(1,n+1):
            if i>1: await pg.keyboard.press("ArrowRight")
            await pg.wait_for_timeout(3200)
            await pg.screenshot(path=f"{out}/s{i:02d}.png")
        print("errors:", errs)
        await b.close()
asyncio.run(main())

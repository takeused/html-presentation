import math, subprocess, pathlib
from PIL import Image, ImageDraw, ImageFont

ASSETS = pathlib.Path(r"d:\01 WORK\261115 HTML Presentation_Tesla\assets")
ASSETS.mkdir(parents=True, exist_ok=True)

FFMPEG = r"C:\Users\takeu\AppData\Local\Microsoft\WinGet\Packages\yt-dlp.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-N-124279-g0f6ba39122-win64-gpl\bin\ffmpeg.exe"

def font(size, bold=True):
    for p in [
        r"C:\Windows\Fonts\malgunbd.ttf" if bold else r"C:\Windows\Fonts\malgun.ttf",
        r"C:\Windows\Fonts\arialbd.ttf" if bold else r"C:\Windows\Fonts\arial.ttf",
    ]:
        if pathlib.Path(p).exists():
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()

PINK = (232, 23, 104)
WINE = (146, 9, 81)
INK = (41, 42, 51)
MUTED = (120, 121, 131)
PALE = (251, 237, 243)
LINE = (233, 232, 237)
WHITE = (255, 255, 255)

# 1. Cover Ecosystem Image (white background for mix-blend-mode: multiply)
def make_ecosystem():
    W, H = 1200, 1050
    img = Image.new("RGB", (W, H), WHITE)
    d = ImageDraw.Draw(img)
    cx, cy = W // 2, H // 2
    # Concentric tech rings
    for r, col, w in [(430, (243, 229, 237), 2), (330, (238, 215, 228), 3), (220, (232, 23, 104), 3)]:
        d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=col, width=w)
    # 4 satellite nodes
    nodes = [
        (cx, cy - 330, "GPU & NVLink", "Blackwell · Rubin Silicon", INK),
        (cx + 340, cy, "AI FACTORY", "NVL72 · Liquid Cooled Rack", WINE),
        (cx, cy + 330, "PHYSICAL AI", "Omniverse · Cosmos · GR00T", PINK),
        (cx - 340, cy, "CUDA & NIM", "5.9M Developers · Enterprise", INK),
    ]
    for nx, ny, title, sub, col in nodes:
        d.line([(cx, cy), (nx, ny)], fill=(225, 195, 212), width=5)
        # Pulse dots on line
        for t in (0.35, 0.65):
            px, py = int(cx + (nx - cx) * t), int(cy + (ny - cy) * t)
            d.ellipse([px - 7, py - 7, px + 7, py + 7], fill=PINK)
        d.rounded_rectangle([nx - 165, ny - 78, nx + 165, ny + 78], radius=22, fill=WHITE, outline=col, width=4)
        d.rounded_rectangle([nx - 155, ny - 68, nx + 155, ny - 24], radius=10, fill=col)
        d.text((nx, ny - 46), title, font=font(24, True), fill=WHITE, anchor="mm")
        d.text((nx, ny + 22), sub, font=font(20, False), fill=INK, anchor="mm")
    # Center Core
    d.rounded_rectangle([cx - 150, cy - 150, cx + 150, cy + 150], radius=36, fill=INK, outline=PINK, width=6)
    d.rounded_rectangle([cx - 126, cy - 126, cx + 126, cy + 126], radius=26, outline=(255, 255, 255), width=2)
    d.text((cx, cy - 36), "NVIDIA", font=font(42, True), fill=WHITE, anchor="mm")
    d.text((cx, cy + 14), "FULL-STACK", font=font(24, True), fill=PINK, anchor="mm")
    d.text((cx, cy + 50), "AI PLATFORM", font=font(22, False), fill=(220, 215, 225), anchor="mm")
    img.save(ASSETS / "nvidia-ecosystem.png", optimize=True)

# 2. Three Architecture Trim Images (Blackwell / Blackwell Ultra / Vera Rubin)
def make_trim_image(filename, tag, title, subtitle, specs, accent):
    W, H = 1280, 860
    img = Image.new("RGB", (W, H), (14, 15, 20))
    d = ImageDraw.Draw(img)
    # Subtle grid
    for x in range(0, W, 64):
        d.line([(x, 0), (x, H)], fill=(26, 27, 36), width=1)
    for y in range(0, H, 64):
        d.line([(0, y), (W, y)], fill=(26, 27, 36), width=1)
    # Glow frame
    d.rounded_rectangle([60, 60, W - 60, H - 120], radius=24, fill=(22, 23, 31), outline=accent, width=3)
    # Left 3D-style server rack / superchip diagram
    rx, ry, rw, rh = 120, 120, 380, 560
    d.rounded_rectangle([rx, ry, rx + rw, ry + rh], radius=16, fill=(12, 13, 18), outline=(90, 92, 110), width=3)
    d.text((rx + rw // 2, ry + 34), tag, font=font(24, True), fill=accent, anchor="mm")
    for i in range(9):
        by = ry + 70 + i * 52
        fill_col = accent if i in (3, 4) else (38, 40, 54)
        d.rounded_rectangle([rx + 28, by, rx + rw - 28, by + 38], radius=6, fill=fill_col, outline=(120, 122, 140), width=1)
        txt = "NVSwitch Interconnect Spine" if i in (3, 4) else f"Compute Tray #{i+1:02d} · Liquid Cooled"
        d.text((rx + rw // 2, by + 19), txt, font=font(16, True), fill=WHITE, anchor="mm")
    # Right specification HUD
    sx = 550
    d.text((sx, 140), tag + " ARCHITECTURE", font=font(22, True), fill=accent)
    d.text((sx, 180), title, font=font(46, True), fill=WHITE)
    d.text((sx, 245), subtitle, font=font(24, False), fill=(185, 186, 198))
    for idx, (k, v) in enumerate(specs):
        cy = 320 + idx * 110
        d.rounded_rectangle([sx, cy, W - 110, cy + 92], radius=14, fill=(30, 31, 42), outline=(65, 67, 84), width=2)
        d.rectangle([sx, cy, sx + 8, cy + 92], fill=accent)
        d.text((sx + 32, cy + 28), k, font=font(20, False), fill=(175, 176, 190))
        d.text((sx + 32, cy + 62), v, font=font(30, True), fill=WHITE)
    img.save(ASSETS / filename, quality=92)

# 3. Technology Concept Image (Slide 9 - NVLink + Tensor Engine + Liquid Cooling on white bg)
def make_tech_concept():
    W, H = 1200, 820
    img = Image.new("RGB", (W, H), WHITE)
    d = ImageDraw.Draw(img)
    # 3 interconnected schematic blocks
    boxes = [
        (80, 130, 390, 670, "N · NVLink 5 / 6 패브릭", "1.8~3.6 TB/s 양방향 대역폭", ["72~144개 GPU 단일 메모리 공간", "All-to-All 무손실 패브릭 스위치", "PCIe 대비 14배 이상 빠른 통신"], INK),
        (445, 130, 755, 670, "T · FP4 트랜스포머 엔진", "2세대 마이크로 텐서 스케일링", ["4비트 부동소수점(FP4) 정밀도 제어", "실시간 추론(Reasoning) 처리량 30배", "거대언어모델(LLM) 동적 양자화"], PINK),
        (810, 130, 1120, 670, "L · 100% 직수 액체 냉각", "고밀도 AI 팩토리 열 제어", ["랙당 120kW+ 고밀도 전력 냉각", "공랭식 대비 데이터센터 전력 25% 절감", "냉각수 온수 순환 열회수 구조"], WINE),
    ]
    d.text((W // 2, 58), "AI FACTORY 랙 스케일 3대 핵심 아키텍처 개념도", font=font(30, True), fill=INK, anchor="mm")
    for x1, y1, x2, y2, head, sub, bullets, col in boxes:
        d.rounded_rectangle([x1, y1, x2, y2], radius=20, fill=(252, 249, 251), outline=col, width=4)
        d.rounded_rectangle([x1, y1, x2, y1 + 100], radius=20, fill=col)
        d.text(((x1 + x2) // 2, y1 + 38), head, font=font(23, True), fill=WHITE, anchor="mm")
        d.text(((x1 + x2) // 2, y1 + 74), sub, font=font(17, False), fill=(250, 225, 238), anchor="mm")
        for bi, btxt in enumerate(bullets):
            by = y1 + 150 + bi * 115
            d.rounded_rectangle([x1 + 22, by, x2 - 22, by + 88], radius=12, fill=WHITE, outline=LINE, width=2)
            d.ellipse([x1 + 38, by + 34, x1 + 54, by + 50], fill=col)
            d.text((x1 + 68, by + 42), btxt, font=font(18, True), fill=INK, anchor="lm")
        # downward flow arrows
        d.line([((x1 + x2) // 2, y2), ((x1 + x2) // 2, y2 + 55)], fill=PINK, width=4)
    d.rounded_rectangle([80, 725, 1120, 785], radius=14, fill=INK)
    d.text((W // 2, 755), "단일 랙(NVL72 / NVL144)이 하나의 거대한 엑사스케일 AI 슈퍼컴퓨터로 작동", font=font(22, True), fill=WHITE, anchor="mm")
    img.save(ASSETS / "nvidia-nvlink-concept.png", optimize=True)

# 4. Closing Photo & Brand Badge
def make_closing_and_badge():
    W, H = 1000, 500
    img = Image.new("RGB", (W, H), (16, 17, 24))
    d = ImageDraw.Draw(img)
    for i in range(12):
        x = 60 + i * 76
        d.rounded_rectangle([x, 50, x + 56, 430], radius=6, fill=(28, 30, 42), outline=PINK if i in (4, 5, 6, 7) else (60, 64, 82), width=2)
        for r in range(8):
            y = 75 + r * 42
            d.rectangle([x + 10, y, x + 46, y + 24], fill=PINK if (i in (4, 5, 6, 7) and r % 2 == 0) else (48, 52, 70))
    d.rectangle([0, 390, W, H], fill=(12, 12, 18))
    d.text((40, 435), "NVIDIA AI FACTORY SUPERCLUSTER · LIQUID-COOLED NVL72 / RUBIN POD", font=font(24, True), fill=WHITE)
    img.save(ASSETS / "nvidia-factory-rear.jpg", quality=92)

    # Logo badge
    b = Image.new("RGBA", (200, 200), (0, 0, 0, 0))
    bd = ImageDraw.Draw(b)
    bd.ellipse([8, 8, 192, 192], fill=PINK, outline=WINE, width=6)
    bd.text((100, 82), "AI", font=font(58, True), fill=WHITE, anchor="mm")
    bd.text((100, 138), "BRIEFING", font=font(22, True), fill=WHITE, anchor="mm")
    b.save(ASSETS / "nvidia-logo-badge.png")

# 5. Generate 15-second 30fps MP4 Motion Graphics Videos via FFmpeg
def make_motion_video(mp4_path, poster_path, scenes, subtitle_tag):
    W, H, FPS, SEC = 1280, 720, 30, 15
    total_frames = FPS * SEC
    f_kicker = font(22, True)
    f_big = font(64, True)
    f_sub = font(28, False)
    f_hud = font(18, True)

    cmd = [
        FFMPEG, "-y",
        "-f", "rawvideo", "-vcodec", "rawvideo",
        "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS),
        "-i", "-",
        "-c:v", "libx264", "-pix_fmt", "yuv420p",
        "-preset", "ultrafast", "-crf", "23",
        str(mp4_path)
    ]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    for frame in range(total_frames):
        t = frame / FPS
        scene_idx = min(len(scenes) - 1, int(t / (SEC / len(scenes))))
        local_t = (t - scene_idx * (SEC / len(scenes))) / (SEC / len(scenes))
        kicker, head1, head2, desc, stat_txt = scenes[scene_idx]

        im = Image.new("RGB", (W, H), (12, 13, 19))
        d = ImageDraw.Draw(im)

        # Animated perspective grid & sweeping laser bar
        scan_x = int((t / SEC) * W)
        for gx in range(0, W, 80):
            offset = int((t * 60) % 80)
            x = (gx + offset) % W
            d.line([(x, 0), (x, H)], fill=(25, 26, 36), width=1)
        for gy in range(0, H, 72):
            d.line([(0, gy), (W, gy)], fill=(25, 26, 36), width=1)

        # Animated orbital rings on right side
        ox, oy = 960, 360
        for r_idx, rad in enumerate([230, 170, 110]):
            ang = (t * (45 if r_idx % 2 == 0 else -60) + r_idx * 40) % 360
            col = PINK if r_idx == 0 else (WINE if r_idx == 1 else (90, 92, 120))
            d.ellipse([ox - rad, oy - rad, ox + rad, oy + rad], outline=col, width=3)
            px = ox + int(rad * math.cos(math.radians(ang)))
            py = oy + int(rad * math.sin(math.radians(ang)))
            d.ellipse([px - 8, py - 8, px + 8, py + 8], fill=PINK)

        d.text((ox, oy - 18), stat_txt, font=font(46, True), fill=WHITE, anchor="mm")
        d.text((ox, oy + 32), subtitle_tag, font=f_hud, fill=PINK, anchor="mm")

        # Kinetic text block on left
        slide_up = int((1.0 - min(1.0, local_t * 3.5)) * 30)
        d.rounded_rectangle([80, 130 + slide_up, 100, 150 + slide_up], radius=5, fill=PINK)
        d.text((116, 140 + slide_up), kicker, font=f_kicker, fill=PINK, anchor="lm")
        d.text((80, 220 + slide_up), head1, font=f_big, fill=WHITE, anchor="lm")
        d.text((80, 305 + slide_up), head2, font=f_big, fill=PINK, anchor="lm")
        d.text((80, 405 + slide_up), desc, font=f_sub, fill=(200, 202, 215), anchor="lm")

        # Bottom animated telemetry bars
        for bi in range(16):
            bx = 80 + bi * 38
            bh = int(28 + 38 * abs(math.sin(t * 3.2 + bi * 0.45)))
            d.rounded_rectangle([bx, 580 - bh, bx + 24, 580], radius=4, fill=PINK if bi % 3 == 0 else WINE)

        # Progress bar at bottom
        d.rectangle([0, H - 8, W, H], fill=(35, 36, 48))
        d.rectangle([0, H - 8, scan_x, H], fill=PINK)

        if frame == 45:
            im.save(poster_path, quality=90)

        proc.stdin.write(im.tobytes())

    proc.stdin.close()
    proc.wait()

make_ecosystem()
make_trim_image(
    "nvidia-blackwell.jpg", "BLACKWELL", "GB200 NVL72",
    "72개의 Blackwell GPU와 36개의 Grace CPU를 단일 랙으로 결합한 표준 AI 팩토리",
    [("FP4 AI 추론 연산", "1.44 ExaFLOPS / Rack"), ("NVLink 5 총 대역폭", "130 TB/s (초당 1.8TB/GPU)"), ("HBM3e 메모리 용량", "13.8 TB (랙 통합 메모리)")],
    PINK
)
make_trim_image(
    "nvidia-blackwell-ultra.jpg", "BLACKWELL ULTRA", "GB300 NVL72",
    "추론(Reasoning) 및 에이전틱 AI 워크로드를 위해 메모리와 연산을 확장한 업그레이드 사양",
    [("FP4 Dense/Sparse 연산", "최대 1.5x 추론 처리량 향상"), ("HBM3e 12-Hi 메모리", "GPU당 288GB (랙당 20TB+)"), ("네트워킹 통합", "ConnectX-8 800Gb/s + Spectrum-X")],
    WINE
)
make_trim_image(
    "nvidia-vera-rubin.png", "VERA RUBIN", "Vera Rubin NVL144",
    "차세대 Rubin GPU와 88코어 Vera CPU, HBM4 및 NVLink 6를 결합하는 차세대 플랫폼",
    [("FP4 추론 성능 목표", "3.6 ExaFLOPS (NVL144 기준)"), ("NVLink 6 인터커넥트", "GPU당 3.6 TB/s · 랙 260 TB/s"), ("차세대 메모리 채택", "초고대역폭 HBM4 아키텍처")],
    (255, 64, 140)
)
make_tech_concept()
make_closing_and_badge()

promo_scenes = [
    ("01 · AI INDUSTRIAL REVOLUTION", "칩을 파는 기업에서", "AI 공장을 짓는 기업으로", "데이터센터 전체를 하나의 컴퓨터로 재정의하다", "NVL72"),
    ("02 · HYPER-SCALE FINANCIALS", "연간 매출 1,305억 달러", "데이터센터 비중 88.3%", "FY2026 매출 +114.2% 성장 · 영업이익률 62.4%", "$130.5B"),
    ("03 · ANNUAL ARCHITECTURE CADENCE", "Hopper에서 Blackwell로", "그리고 차세대 Rubin까지", "1년 주기의 풀스택 아키텍처 로드맵 가동", "30x"),
    ("04 · BEYOND CLOUD TO PHYSICAL AI", "소버린 AI와 엔터프라이즈", "로보틱스 피지컬 AI로", "Omniverse · Cosmos · Isaac GR00T 생태계 확장", "3-COMP"),
]
make_motion_video(ASSETS / "nvidia-promo.mp4", ASSETS / "nvidia-poster.jpg", promo_scenes, "AI FACTORY MOTION")

brand_scenes = [
    ("NVIDIA BRAND FILM · PART 1", "전기를 투입하면", "토큰과 지능을 생산하는", "새로운 산업 혁명의 심장, AI Factory", "TOKEN"),
    ("NVIDIA BRAND FILM · PART 2", "가상 세계의 시뮬레이션이", "현실의 로봇과 자율주행으로", "DGX · Omniverse · AGX 3-컴퓨터 아키텍처", "COSMOS"),
    ("NVIDIA BRAND FILM · PART 3", "NVIDIA", "지능을 생산하는 시대", "ACCELERATING THE FUTURE OF INTELLIGENCE", "RUBIN"),
]
make_motion_video(ASSETS / "nvidia-brand-film.mp4", ASSETS / "nvidia-brand-poster.jpg", brand_scenes, "BRAND FILM 15S")
print("All NVIDIA assets & 2 MP4 motion graphics videos generated successfully!")

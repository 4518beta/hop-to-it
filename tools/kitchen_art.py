"""Warm Ledger kitchen: painted food-truck kitchen in the game's exact 3/4 layout.
Renders at 4x the game's 1000x620 grid, downsamples to 2x for crisp anti-aliasing.
Outputs three layers: background, slanted service counter, front counter."""
import sys, math, random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageChops

OUT = sys.argv[1]
S = 4                       # supersample factor
W, H = 1000 * S, 620 * S
INK = (91, 58, 46, 255)
LW = int(2.6 * S)           # one line weight everywhere
rnd = random.Random(7)

def P(pts):                 # game coords -> canvas coords
    return [(x * S, y * S) for x, y in pts]

def t(x):                   # top edge of the slanted service counter
    return 224 + (372 - x) * 0.4167

def lerp(a, b, k):
    return tuple(int(a[i] + (b[i] - a[i]) * k) for i in range(len(a)))

def gradient(size, c1, c2, vertical=True, curve=1.0):
    w, h = size
    n = h if vertical else w
    ramp = (np.linspace(0, 1, max(n, 2)) ** curve)
    arr = np.zeros((n, 4), np.float32)
    for i in range(4):
        arr[:, i] = c1[i] + (c2[i] - c1[i]) * ramp
    if vertical:
        img = np.repeat(arr[:, None, :], w, axis=1)
    else:
        img = np.repeat(arr[None, :, :], h, axis=0)
    return Image.fromarray(img.astype(np.uint8), 'RGBA')

def fill(layer, pts, c1, c2=None, vertical=True, curve=1.0, outline=True):
    pts = P(pts)
    xs, ys = [p[0] for p in pts], [p[1] for p in pts]
    x0, y0, x1, y1 = int(min(xs)), int(min(ys)), int(math.ceil(max(xs))), int(math.ceil(max(ys)))
    mask = Image.new('L', layer.size, 0)
    ImageDraw.Draw(mask).polygon(pts, fill=255)
    g = gradient((max(1, x1 - x0), max(1, y1 - y0)), c1 + (255,), (c2 or c1) + (255,), vertical, curve)
    tile = Image.new('RGBA', layer.size, (0, 0, 0, 0))
    tile.paste(g, (x0, y0))
    layer.paste(tile, (0, 0), mask)
    if outline:
        ImageDraw.Draw(layer).line(pts + [pts[0]], fill=INK, width=LW, joint='curve')

def line(layer, pts, color=INK, w=None):
    ImageDraw.Draw(layer).line(P(pts), fill=color, width=int((w or 2.6) * S), joint='curve')

def soft_shadow(layer, pts, opacity=90, blur=10, color=(80, 40, 30)):
    m = Image.new('L', layer.size, 0)
    ImageDraw.Draw(m).polygon(P(pts), fill=opacity)
    m = m.filter(ImageFilter.GaussianBlur(blur * S))
    sh = Image.new('RGBA', layer.size, color + (0,))
    sh.putalpha(m)
    layer.alpha_composite(sh)

def glow(layer, cx, cy, r, color, opacity):
    m = Image.new('L', layer.size, 0)
    ImageDraw.Draw(m).ellipse([(cx - r) * S, (cy - r) * S, (cx + r) * S, (cy + r) * S], fill=opacity)
    m = m.filter(ImageFilter.GaussianBlur(r * S * 0.45))
    g = Image.new('RGBA', layer.size, color + (0,))
    g.putalpha(m)
    layer.alpha_composite(g)

def clip(layer, pts):
    m = Image.new('L', layer.size, 0)
    ImageDraw.Draw(m).polygon(P(pts), fill=255)
    out = Image.new('RGBA', layer.size, (0, 0, 0, 0))
    out.paste(layer, (0, 0), ImageChops.multiply(m, layer.getchannel('A')))
    return out

def grain(layer, amount=7):
    a = np.asarray(layer).astype(np.int16)
    noise = np.random.default_rng(3).normal(0, amount, a.shape[:2])[..., None]
    a[..., :3] = np.clip(a[..., :3] + noise, 0, 255)
    return Image.fromarray(a.astype(np.uint8), 'RGBA')

def jitter(c, k=8):
    return tuple(max(0, min(255, v + rnd.randint(-k, k))) for v in c)

# palette, one afternoon per city
THEME = sys.argv[2] if len(sys.argv) > 2 else 'diner'
PAL = {
  'diner': dict(CREAM=(250, 238, 214), CREAM2=(236, 214, 178), MINT=(164, 214, 192), MINT2=(120, 180, 158), CORAL=(240, 132, 112), CORAL2=(206, 94, 80), SUN=(246, 198, 84), SKY1=(150, 208, 230), SKY2=(253, 236, 214), TILE=((248, 234, 214), (238, 186, 156)),
                BLD=[(226, 190, 172), (210, 196, 222), (243, 220, 162), (199, 214, 222), (232, 186, 196), (214, 205, 228), (243, 214, 176)]),
  'bakery': dict(CREAM=(250, 240, 226), CREAM2=(232, 214, 200), MINT=(196, 184, 230), MINT2=(156, 142, 200), CORAL=(170, 132, 210), CORAL2=(130, 96, 176), SUN=(248, 210, 120), SKY1=(186, 206, 238), SKY2=(252, 232, 222), TILE=((250, 240, 228), (214, 196, 236)),
                BLD=[(238, 222, 196), (226, 210, 184), (240, 228, 206), (220, 204, 180), (236, 218, 190), (230, 214, 192), (242, 230, 210)]),
  'noodle': dict(CREAM=(248, 236, 220), CREAM2=(232, 210, 186), MINT=(142, 200, 196), MINT2=(98, 160, 158), CORAL=(226, 96, 88), CORAL2=(186, 64, 60), SUN=(250, 206, 96), SKY1=(240, 186, 170), SKY2=(254, 232, 206), TILE=((246, 232, 212), (196, 222, 214)),
                BLD=[(214, 200, 220), (190, 206, 214), (236, 196, 190), (204, 214, 228), (226, 206, 220), (198, 196, 222), (232, 210, 196)]),
}[THEME]
globals().update({k: v for k, v in PAL.items()})
AMBER = (232, 178, 120); AMBER2 = (200, 136, 84)

# ---------------- background layer ----------------
bg = Image.new('RGBA', (W, H), (0, 0, 0, 0))

# floor: perspective lattice toward one vanishing point
VP = (600, -380)
FT, FB = 226, 640
def px(xb, y):
    return VP[0] + (xb - VP[0]) * (y - VP[1]) / (FB - VP[1])
rows = 9
ys = [FT + (FB - FT) * ((i / rows) ** 1.45) for i in range(rows + 1)]
floor = Image.new('RGBA', (W, H), (0, 0, 0, 0))
for r in range(rows):
    for c in range(-6, 18):
        xb0, xb1 = 30 + c * 72, 30 + (c + 1) * 72
        quad = [(px(xb0, ys[r]), ys[r]), (px(xb1, ys[r]), ys[r]), (px(xb1, ys[r + 1]), ys[r + 1]), (px(xb0, ys[r + 1]), ys[r + 1])]
        base = TILE[0] if (r + c) % 2 else TILE[1]
        fill(floor, quad, jitter(base, 5), jitter(lerp(base, (0, 0, 0), .06), 4), outline=False)
        ImageDraw.Draw(floor).line(P(quad) + [P(quad)[0]], fill=(214, 170, 140, 255), width=int(1.1 * S))
# light pool and corner shading
glow(floor, 560, 420, 260, (255, 248, 230), 120)
soft_shadow(floor, [(0, 226), (1000, 226), (1000, 250), (0, 250)], 110, 10)
soft_shadow(floor, [(860, 226), (900, 226), (900, 620), (860, 620)], 90, 12)
bg.alpha_composite(floor)
fill(bg, [(0, 0), (1000, 0), (1000, 52), (0, 52)], lerp(CORAL2, (60, 40, 40), .25), CORAL2, outline=False)

# view through the service window
win = [(0, 52), (540, 52), (540, 154), (0, t(0) - 6)]
out = Image.new('RGBA', (W, H), (0, 0, 0, 0))
fill(out, [(0, 40), (560, 40), (560, 420), (0, 420)], SKY1, SKY2, curve=.8, outline=False)
for cx, cy, rx in [(110, 96, 46), (150, 88, 34), (420, 110, 40), (452, 104, 28)]:
    ImageDraw.Draw(out).ellipse([(cx - rx) * S, (cy - rx * .38) * S, (cx + rx) * S, (cy + rx * .38) * S], fill=(255, 252, 246, 230))
bld = [(10, 196, 70), (84, 150, 78), (168, 178, 62), (236, 128, 88), (330, 168, 66), (402, 140, 80), (488, 176, 60)]
for (x, y, w), col in zip(bld, BLD):
    fill(out, [(x, y), (x + w, y), (x + w, 330), (x, 330)], lerp(col, (255, 255, 255), .25), col)
    fill(out, [(x + w - 12, y + 2), (x + w, y + 2), (x + w, 330), (x + w - 12, 330)], lerp(col, (60, 40, 60), .15), outline=False)
    for wy in range(int(y) + 14, 320, 24):
        for wx in range(int(x) + 10, int(x + w) - 18, 18):
            ImageDraw.Draw(out).rounded_rectangle([wx * S, wy * S, (wx + 9) * S, (wy + 12) * S], radius=2 * S,
                                                  fill=(255, 246, 214, 255) if rnd.random() < .35 else (130, 160, 190, 255))
fill(out, [(0, 300), (560, 168), (560, 420), (0, 420)], (238, 222, 214), (214, 194, 190), outline=False)
line(out, [(0, 300), (560, 168)], (190, 160, 160, 255), 2)
bg.alpha_composite(clip(out, win))
line(bg, win + [win[0]], INK, 3.4)

# back wall tiles, warm grout, light from the upper left
wall = Image.new('RGBA', (W, H), (0, 0, 0, 0))
fill(wall, [(540, 52), (1000, 52), (1000, 202), (540, 202)], lerp(CREAM2, (120, 80, 60), .12), outline=False)
for y in range(52, 202, 25):
    for x in range(540 + (12 if ((y - 52) // 25) % 2 else 0), 1000, 25):
        x0, x1 = max(540, x - 12), min(1000, x + 12)
        if x1 - x0 < 3:
            continue
        c = jitter(CREAM, 6)
        fill(wall, [(x0 + 1, y + 1), (x1 - 1, y + 1), (x1 - 1, y + 24), (x0 + 1, y + 24)], c, lerp(c, CREAM2, .55), outline=False)
        ImageDraw.Draw(wall).line(P([(x0 + 3, y + 4), (x0 + 9, y + 4)]), fill=(255, 255, 255, 170), width=int(1.6 * S))
glow(wall, 620, 70, 200, (255, 250, 236), 55)
soft_shadow(wall, [(540, 186), (1000, 186), (1000, 202), (540, 202)], 120, 6)
bg.alpha_composite(clip(wall, [(540, 52), (1000, 52), (1000, 202), (540, 202)]))
line(bg, [(540, 52), (540, 202)], INK, 3)
# string lights
pts = [(546 + i * 4.54, 60 + 7 * math.sin(i / 100 * math.pi * 4) ** 2) for i in range(101)]
line(bg, pts, (110, 80, 70, 255), 1.4)
for i in range(4, 101, 11):
    x, y = pts[i]
    glow(bg, x, y + 6, 12, (255, 220, 140), 80)
    ImageDraw.Draw(bg).ellipse([(x - 4) * S, (y + 2) * S, (x + 4) * S, (y + 12) * S], fill=(255, 226, 150, 255), outline=INK, width=int(1.4 * S))
# pantry shelf on brackets
soft_shadow(bg, [(548, 134), (996, 134), (996, 148), (548, 148)], 110, 5)
fill(bg, [(548, 124), (996, 124), (996, 135), (548, 135)], AMBER, AMBER2)
for x in (600, 772, 944):
    fill(bg, [(x, 135), (x + 8, 135), (x + 8, 150), (x, 142)], AMBER2)

# back counter: butcher block over mint cabinets
soft_shadow(bg, [(540, 262), (1000, 262), (1000, 282), (540, 282)], 130, 7)
fill(bg, [(540, 226), (1000, 226), (1000, 266), (540, 266)], MINT, MINT2)
for x in range(552, 990, 74):
    fill(bg, [(x, 232), (x + 62, 232), (x + 62, 260), (x, 260)], lerp(MINT, (255, 255, 255), .22), MINT, outline=False)
    ImageDraw.Draw(bg).rounded_rectangle([x * S, 232 * S, (x + 62) * S, 260 * S], radius=4 * S, outline=INK, width=int(1.8 * S))
    ImageDraw.Draw(bg).ellipse([(x + 28) * S, 243 * S, (x + 34) * S, 249 * S], fill=SUN + (255,), outline=INK, width=int(1.2 * S))
fill(bg, [(540, 202), (1000, 202), (1000, 226), (540, 226)], AMBER, AMBER2)
for x in range(560, 1000, 38):
    line(bg, [(x, 204), (x, 224)], (190, 128, 82, 255), 1.1)
line(bg, [(542, 204), (998, 204)], (255, 232, 196, 255), 1.6)

# right column counter
soft_shadow(bg, [(868, 230), (880, 230), (892, 566), (870, 566)], 120, 8)
fill(bg, [(880, 230), (892, 226), (904, 560), (892, 566)], MINT2, MINT, vertical=False)
fill(bg, [(892, 226), (1000, 226), (1000, 560), (904, 560)], AMBER, AMBER2, vertical=False)
for y in range(244, 560, 30):
    line(bg, [(892 + (y - 226) * 0.036 + 1, y), (999, y)], (196, 132, 84, 255), 1.1)
line(bg, [(894, 228), (902, 556)], (255, 232, 196, 255), 1.6)

# left column under the window
fill(bg, [(0, t(0) + 50), (160, t(160) + 50), (170, 620), (0, 620)], MINT, MINT2)
for y0 in (470, 540):
    fill(bg, [(16, y0), (140, y0 - 6), (146, y0 + 52), (18, y0 + 58)], lerp(MINT, (255, 255, 255), .2), MINT, outline=True)
fill(bg, [(160, t(160) + 50), (178, t(160) + 56), (188, 620), (170, 620)], MINT2)

# awning: coral and cream stripes, scalloped hem
fill(bg, [(0, 52), (540, 52), (540, 70), (0, 70)], CORAL, CORAL2)
for i, x in enumerate(range(0, 540, 36)):
    col = CREAM if i % 2 else CORAL
    m = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(m)
    d.rectangle([x * S, 52 * S, (x + 36) * S, 70 * S], fill=col + (255,))
    d.chord([x * S, 60 * S, (x + 36) * S, 82 * S], 0, 180, fill=col + (255,))
    bg.alpha_composite(m)
    ImageDraw.Draw(bg).arc([x * S, 60 * S, (x + 36) * S, 82 * S], 0, 180, fill=INK, width=int(2.2 * S))
    line(bg, [(x, 52), (x, 71)], INK, 1.4)
line(bg, [(0, 52), (540, 52)], INK, 2.6)
bg = grain(bg, 6)

# ---------------- service counter layer ----------------
svc = Image.new('RGBA', (W, H), (0, 0, 0, 0))
soft_shadow(svc, [(0, t(0) + 50), (560, t(560) + 50), (560, t(560) + 70), (0, t(0) + 76)], 130, 9)
fill(svc, [(0, t(0) + 24), (560, t(560) + 24), (560, t(560) + 50), (0, t(0) + 50)], CORAL, CORAL2)
line(svc, [(0, t(0) + 33), (560, t(560) + 33)], SUN + (255,), 6)
fill(svc, [(0, t(0)), (560, t(560)), (560, t(560) + 24), (0, t(0) + 24)], AMBER, AMBER2)
for k in range(1, 4):
    line(svc, [(0, t(0) + k * 6), (560, t(560) + k * 6)], (198, 134, 86, 255), .9)
line(svc, [(2, t(0) + 2), (558, t(560) + 2)], (255, 234, 200, 255), 1.6)
svc = grain(svc, 5)

# ---------------- front counter layer ----------------
fr = Image.new('RGBA', (W, H), (0, 0, 0, 0))
soft_shadow(fr, [(176, 490), (898, 490), (898, 508), (176, 508)], 110, 7)
fill(fr, [(178, 532), (900, 532), (900, 640), (178, 640)], CORAL, CORAL2)
line(fr, [(178, 547), (900, 547)], SUN + (255,), 8)
fill(fr, [(196, 562), (880, 562), (880, 568), (196, 568)], lerp(CORAL, (255, 255, 255), .25), outline=False)
for wx in (290, 780):
    ImageDraw.Draw(fr).ellipse([(wx - 32) * S, 594 * S, (wx + 32) * S, 658 * S], fill=(92, 76, 88, 255), outline=INK, width=LW)
    ImageDraw.Draw(fr).ellipse([(wx - 13) * S, 613 * S, (wx + 13) * S, 639 * S], fill=(232, 226, 236, 255), outline=INK, width=int(1.6 * S))
fill(fr, [(172, 506), (896, 506), (900, 532), (178, 532)], AMBER, AMBER2)
for k in (1, 2, 3):
    line(fr, [(176, 506 + k * 6.5), (898, 506 + k * 6.5)], (198, 134, 86, 255), .9)
line(fr, [(176, 508), (894, 508)], (255, 234, 200, 255), 1.6)
fr = grain(fr, 5)

def save(img, name, jpg=False):
    small = img.resize((W // 2, H // 2), Image.LANCZOS)
    if jpg:
        small.convert('RGB').save(f'{OUT}/{name}.jpg', quality=86, optimize=True, progressive=True)
    else:
        small.save(f'{OUT}/{name}.png', optimize=True)

save(bg, f'kitchen-bg-{THEME}', jpg=True)
save(svc, f'kitchen-service-{THEME}')
save(fr, f'kitchen-front-{THEME}')
prev = bg.copy(); prev.alpha_composite(svc); prev.alpha_composite(fr)
save(prev, f'kitchen-preview-{THEME}', jpg=True)
print('ok')

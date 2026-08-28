"""Sanity check: render a post with the instanced fonts, exactly the way the
Mysha Images Custom GPT would inside Code Interpreter."""
from PIL import Image, ImageDraw, ImageFont
import os

F = "/projects/sandbox/chatgpt/fonts"

def hx(h):
    h = h.lstrip("#"); return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def on(bg):
    r, g, b = bg
    return (11, 11, 11) if (0.299*r+0.587*g+0.114*b)/255 > 0.55 else (255, 255, 255)

def vgrad(w, h, c1, c2):
    img = Image.new("RGB", (w, h), c1); px = img.load()
    for y in range(h):
        t = y/max(1, h-1)
        col = tuple(int(c1[i]+(c2[i]-c1[i])*t) for i in range(3))
        for x in range(w):
            px[x, y] = col
    return img

def wrap(d, text, font, maxw):
    words = text.split(); lines = []; cur = ""
    for wd in words:
        t = (cur+" "+wd).strip()
        if d.textlength(t, font=font) <= maxw:
            cur = t
        else:
            if cur: lines.append(cur)
            cur = wd
    if cur: lines.append(cur)
    return lines

W, H = 1080, 1350
P = int(W*0.075)
bg = hx("#0B0F0A"); lighter = tuple(min(255, c+22) for c in bg)
text = hx("#F4FFE9"); muted = hx("#A6B79A")
primary = hx("#C6F432"); accent = hx("#7CFF6B")

img = vgrad(W, H, bg, lighter)
d = ImageDraw.Draw(img)
disp = os.path.join(F, "SpaceGrotesk-Bold.ttf")
body = os.path.join(F, "Inter-Regular.ttf")
def Fn(p, frac): return ImageFont.truetype(p, int(W*frac))

y = P
# eyebrow chip
ef = Fn(body, 0.020); tx = "NUTRITION 101"
tw = d.textlength(tx, font=ef); ph = int(W*0.05); pw = int(tw+W*0.06)
d.rounded_rectangle([P, y, P+pw, y+ph], radius=ph//2, fill=primary)
d.text((P+W*0.03, y+ph/2), tx, font=ef, fill=on(primary), anchor="lm")
y += ph+int(W*0.03)
# headline w/ accent last word
hf = Fn(disp, 0.135)
lines = wrap(d, "Stop guessing your macros", hf, W-2*P)
lh = int(hf.size*1.02)
for i, ln in enumerate(lines):
    if i == len(lines)-1 and len(ln.split()) > 1:
        parts = ln.split(); head = " ".join(parts[:-1])+" "; tail = parts[-1]
        d.text((P, y), head, font=hf, fill=text)
        d.text((P+d.textlength(head, font=hf), y), tail, font=hf, fill=accent)
    else:
        d.text((P, y), ln, font=hf, fill=text)
    y += lh
y += int(W*0.02)
sf = Fn(body, 0.036)
for ln in wrap(d, "A 60-second framework to hit your protein every single day.", sf, W*0.82):
    d.text((P, y), ln, font=sf, fill=muted); y += int(sf.size*1.35)
# CTA
cf = Fn(os.path.join(F, "Inter-SemiBold.ttf"), 0.032)
ct = "Save this post"; tw = d.textlength(ct, font=cf)
ph = int(W*0.075); pw = int(tw+W*0.09); cy = H-P-ph
d.rounded_rectangle([P, cy, P+pw, cy+ph], radius=ph//2, fill=accent)
d.text((P+W*0.045, cy+ph/2), ct, font=cf, fill=on(accent), anchor="lm")
ff = Fn(body, 0.024)
d.text((P, H-P+int(W*0.005)), "@fitwithsam", font=ff, fill=muted, anchor="lb")

out = "/projects/sandbox/chatgpt/fonts/_preview.png"
img.save(out)
print("saved", out)

"""Instance static weights from Google variable fonts for use in Pillow/Code Interpreter."""
import os
from fontTools import ttLib
from fontTools.varLib.instancer import instantiateVariableFont

SRC = "/projects/sandbox/chatgpt/.fontsrc"
OUT = "/projects/sandbox/chatgpt/fonts"
os.makedirs(OUT, exist_ok=True)

JOBS = [
    ("Inter-VF.ttf",        {"wght": 400, "opsz": 14}, "Inter-Regular.ttf"),
    ("Inter-VF.ttf",        {"wght": 600, "opsz": 14}, "Inter-SemiBold.ttf"),
    ("SpaceGrotesk-VF.ttf", {"wght": 700},             "SpaceGrotesk-Bold.ttf"),
    ("Archivo-VF.ttf",      {"wght": 900, "wdth": 100},"Archivo-Black.ttf"),
    ("Archivo-VF.ttf",      {"wght": 400, "wdth": 100},"Archivo-Regular.ttf"),
    ("DMSans-VF.ttf",       {"wght": 400, "opsz": 14}, "DMSans-Regular.ttf"),
    ("Fraunces-VF.ttf",     {"wght": 600, "opsz": 144, "SOFT": 0, "WONK": 0}, "Fraunces-Bold.ttf"),
]

def clamp_to_axes(font, axes):
    ranges = {a.axisTag: (a.minValue, a.maxValue, a.defaultValue) for a in font["fvar"].axes}
    out = {}
    for tag, val in axes.items():
        if tag in ranges:
            lo, hi, _ = ranges[tag]
            out[tag] = max(lo, min(hi, val))
    for tag, (_, _, dflt) in ranges.items():
        out.setdefault(tag, dflt)
    return out

for src, axes, outname in JOBS:
    f = ttLib.TTFont(os.path.join(SRC, src))
    pinned = clamp_to_axes(f, axes)
    instantiateVariableFont(f, pinned, inplace=True, updateFontNames=True)
    f.save(os.path.join(OUT, outname))
    print(f"{outname:26s} <- {src}  {pinned}")

import shutil
for name in ("Poppins-Bold.ttf", "DMSerifDisplay-Regular.ttf"):
    shutil.copy(os.path.join(SRC, name), os.path.join(OUT, name))
    print(f"{name:26s} (static, copied)")

print("\nFinal font set:")
for n in sorted(os.listdir(OUT)):
    if n.endswith(".ttf"):
        print(f"  {n:26s} {os.path.getsize(os.path.join(OUT, n))//1024} KB")

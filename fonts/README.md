# Premium fonts for the "Mysha Images" Custom GPT

These are clean, static, ready-to-use `.ttf` files. Upload them to your Custom GPT
under **Configure → Knowledge → Upload files**. The GPT's renderer auto-detects
them in `/mnt/data` and uses them; if a font is missing it falls back to DejaVu.

All fonts are **free** and licensed under the SIL Open Font License (OFL) — free to
use, embed, and redistribute. License texts are in `./licenses/`.

## What each file is (and which pairing it belongs to)

| File | Role | Weight | Used in pairing |
|------|------|--------|-----------------|
| `SpaceGrotesk-Bold.ttf` | display | 700 | tech / startup / bold |
| `Inter-Regular.ttf` | body | 400 | body for tech, editorial, minimal |
| `Inter-SemiBold.ttf` | body/UI | 600 | eyebrows, CTAs, emphasis |
| `Fraunces-Bold.ttf` | display serif | 600 (opsz 144) | editorial / elegant / fashion / quotes |
| `Poppins-Bold.ttf` | display | 700 | minimal / corporate / finance |
| `Archivo-Black.ttf` | display | 900 | playful / music / events |
| `Archivo-Regular.ttf` | body | 400 | body for the playful pairing |
| `DMSerifDisplay-Regular.ttf` | display serif | — | food / calm / nature / wellness |
| `DMSans-Regular.ttf` | body | 400 | body for the warm/humanist pairing |

> The variable fonts (Inter, Space Grotesk, Archivo, DM Sans, Fraunces) were
> **instanced to fixed weights** so they render bold/heavy correctly in Pillow.
> Poppins and DM Serif Display ship native static weights.

## Minimal set (if you don't want to upload all 9)

For most posts these 4 cover the common looks:

- `SpaceGrotesk-Bold.ttf` + `Inter-Regular.ttf`  (modern / tech / bold)
- `Fraunces-Bold.ttf`  (elegant / editorial headlines)

## Regenerating / adding more weights

See `../scripts/instance_fonts.py` — it downloads the source fonts from the
Google Fonts repo and instances any weight you want. Edit the `JOBS` list and run:

```
pip install fonttools brotli
python scripts/instance_fonts.py
```

## Attribution

- Inter — Rasmus Andersson
- Space Grotesk — Florian Karsten
- Poppins — Indian Type Foundry / Jonny Pinhorn
- Archivo — Omnibus-Type
- DM Sans & DM Serif Display — Colophon Foundry / Google
- Fraunces — Undercase Type

All under the SIL Open Font License 1.1. Content sourced from the
[google/fonts](https://github.com/google/fonts) repository.

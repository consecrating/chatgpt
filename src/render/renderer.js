/**
 * RENDERER
 *
 * Turns the Brain's design spec into a single, self-contained HTML document
 * sized to exact Instagram pixels. Because text is real HTML/CSS (not painted
 * pixels), fonts are crisp and large, colors are exact, and spacing follows a
 * grid. This is the piece that structurally cannot produce "tiny fonts".
 */

import { TYPE_SCALE, px } from "../design-system/typography.js";
import { space, radius, SHADOW } from "../design-system/tokens.js";

function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// A soft, out-of-focus color blob used for modern depth on hero backgrounds.
function blob(x, y, size, color, opacity) {
  return `<div style="position:absolute;left:${x};top:${y};width:${size}px;height:${size}px;
    background:${color};opacity:${opacity};border-radius:50%;
    filter:blur(${Math.round(size / 2.2)}px);"></div>`;
}

function eyebrowChip(text, spec, W) {
  if (!text) return "";
  const { colors } = spec.palette;
  return `<div style="display:inline-flex;align-items:center;gap:${px(0.014, W)}px;
    align-self:${spec.layout.id === "hero-centered" || spec.layout.id === "quote-card" ? "center" : "flex-start"};
    padding:${px(0.016, W)}px ${px(0.03, W)}px;border-radius:999px;
    background:${colors.primary};color:${colors.onPrimary};
    font-family:${spec.pairing.body};font-weight:600;letter-spacing:0.14em;
    text-transform:uppercase;font-size:${px(TYPE_SCALE.eyebrow, W)}px;">
    ${esc(text)}
  </div>`;
}

function ctaPill(text, spec, W) {
  if (!text) return "";
  const { colors } = spec.palette;
  const onAccent = pickOn(colors.accent, colors);
  return `<div style="display:inline-flex;align-items:center;gap:${px(0.016, W)}px;
    padding:${px(0.024, W)}px ${px(0.042, W)}px;border-radius:999px;
    background:${colors.accent};color:${onAccent};
    font-family:${spec.pairing.body};font-weight:600;
    font-size:${px(TYPE_SCALE.body, W)}px;box-shadow:${spec.palette.mode === "dark" ? SHADOW.softDark : SHADOW.soft};">
    ${esc(text)}
    <svg width="${px(0.032, W)}" height="${px(0.032, W)}" viewBox="0 0 24 24" fill="none"
      style="display:block;"><path d="M5 12h14M13 6l6 6-6 6" stroke="${onAccent}"
      stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
  </div>`;
}

function footer(spec, W) {
  const { handle } = spec.content;
  if (!handle) return "";
  const { colors } = spec.palette;
  return `<div style="display:flex;align-items:center;gap:${px(0.02, W)}px;
    font-family:${spec.pairing.body};color:${colors.textMuted};
    font-size:${px(TYPE_SCALE.caption, W)}px;font-weight:500;">
    <span style="width:${px(0.028, W)}px;height:${px(0.028, W)}px;border-radius:50%;
      background:${colors.accent};display:inline-block;"></span>
    ${esc(handle)}
  </div>`;
}

// Choose readable text color to sit on an arbitrary background color.
function pickOn(bg, colors) {
  const c = bg.replace("#", "");
  const r = parseInt(c.substr(0, 2), 16);
  const g = parseInt(c.substr(2, 2), 16);
  const b = parseInt(c.substr(4, 2), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.55 ? "#0B0B0B" : "#FFFFFF";
}

// ---- per-layout body renderers -----------------------------------------

function renderHeroCentered(spec, W) {
  const { colors } = spec.palette;
  const c = spec.content;
  const hSize = px(TYPE_SCALE[spec.style.headlineLevel], W);
  return `
  <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;
    text-align:center;gap:${px(0.03, W)}px;height:100%;">
    ${eyebrowChip(c.eyebrow, spec, W)}
    <h1 style="margin:0;font-family:${spec.pairing.display};font-weight:${spec.pairing.displayWeight};
      font-size:${hSize}px;line-height:0.98;letter-spacing:-0.02em;color:${colors.text};
      max-width:88%;">${accentLastWord(c.headline, colors)}</h1>
    ${
      c.subtext
        ? `<p style="margin:0;max-width:74%;font-family:${spec.pairing.body};
             font-size:${px(TYPE_SCALE.lead, W)}px;line-height:1.4;color:${colors.textMuted};">${esc(c.subtext)}</p>`
        : ""
    }
    ${c.cta ? `<div style="margin-top:${px(0.02, W)}px;">${ctaPill(c.cta, spec, W)}</div>` : ""}
  </div>`;
}

function renderEditorialLeft(spec, W) {
  const { colors } = spec.palette;
  const c = spec.content;
  const hSize = px(TYPE_SCALE[spec.style.headlineLevel], W);
  return `
  <div style="display:flex;flex-direction:column;align-items:flex-start;justify-content:center;
    text-align:left;gap:${px(0.032, W)}px;height:100%;">
    ${eyebrowChip(c.eyebrow, spec, W)}
    <div style="width:${px(0.12, W)}px;height:${px(0.012, W)}px;background:${colors.accent};border-radius:999px;"></div>
    <h1 style="margin:0;font-family:${spec.pairing.display};font-weight:${spec.pairing.displayWeight};
      font-size:${hSize}px;line-height:1.0;letter-spacing:-0.02em;color:${colors.text};
      max-width:94%;">${accentLastWord(c.headline, colors)}</h1>
    ${
      c.subtext
        ? `<p style="margin:0;max-width:82%;font-family:${spec.pairing.body};
             font-size:${px(TYPE_SCALE.lead, W)}px;line-height:1.45;color:${colors.textMuted};">${esc(c.subtext)}</p>`
        : ""
    }
    ${c.cta ? `<div style="margin-top:${px(0.015, W)}px;">${ctaPill(c.cta, spec, W)}</div>` : ""}
  </div>`;
}

function renderListicle(spec, W) {
  const { colors } = spec.palette;
  const c = spec.content;
  const n = c.bullets.length;

  // Adaptive density: the more items, the tighter the type/spacing so a full
  // list always fits the canvas without overflowing into the footer.
  const itemFrac = n >= 5 ? 0.044 : n === 4 ? 0.05 : TYPE_SCALE.h3;
  const gapFrac = n >= 5 ? 0.026 : n === 4 ? 0.03 : 0.036;
  const badgeFrac = n >= 5 ? 0.078 : 0.088;
  const headFrac = n >= 5 ? 0.07 : TYPE_SCALE.h2;

  const items = c.bullets
    .map(
      (b, i) => `
    <div style="display:flex;align-items:flex-start;gap:${px(0.028, W)}px;">
      <div style="flex:0 0 auto;width:${px(badgeFrac, W)}px;height:${px(badgeFrac, W)}px;border-radius:${radius("md", W)}px;
        background:${colors.primary};color:${colors.onPrimary};display:flex;align-items:center;justify-content:center;
        font-family:${spec.pairing.display};font-weight:${spec.pairing.displayWeight};
        font-size:${px(badgeFrac * 0.55, W)}px;">${i + 1}</div>
      <div style="font-family:${spec.pairing.body};font-size:${px(itemFrac, W)}px;
        line-height:1.18;color:${colors.text};font-weight:600;padding-top:${px(0.004, W)}px;">${esc(b)}</div>
    </div>`
    )
    .join("");
  return `
  <div style="display:flex;flex-direction:column;justify-content:center;gap:${px(0.04, W)}px;height:100%;overflow:hidden;">
    <div style="display:flex;flex-direction:column;gap:${px(0.02, W)}px;">
      ${eyebrowChip(c.eyebrow, spec, W)}
      <h1 style="margin:0;font-family:${spec.pairing.display};font-weight:${spec.pairing.displayWeight};
        font-size:${px(headFrac, W)}px;line-height:1.0;letter-spacing:-0.02em;color:${colors.text};
        max-width:94%;">${accentLastWord(c.headline, colors)}</h1>
    </div>
    <div style="display:flex;flex-direction:column;gap:${px(gapFrac, W)}px;">${items}</div>
    ${c.cta ? `<div>${ctaPill(c.cta, spec, W)}</div>` : ""}
  </div>`;
}

function renderStatSpotlight(spec, W) {
  const { colors } = spec.palette;
  const c = spec.content;
  return `
  <div style="display:flex;flex-direction:column;justify-content:center;gap:${px(0.03, W)}px;height:100%;">
    ${eyebrowChip(c.eyebrow, spec, W)}
    <div style="font-family:${spec.pairing.display};font-weight:${spec.pairing.displayWeight};
      font-size:${px(0.28, W)}px;line-height:0.9;letter-spacing:-0.03em;color:${colors.accent};">
      ${esc(c.stat.value)}
    </div>
    <h1 style="margin:0;font-family:${spec.pairing.display};font-weight:${spec.pairing.displayWeight};
      font-size:${px(TYPE_SCALE.h2, W)}px;line-height:1.02;letter-spacing:-0.02em;color:${colors.text};
      max-width:92%;">${esc(c.stat.label || c.headline)}</h1>
    ${
      c.subtext
        ? `<p style="margin:0;max-width:82%;font-family:${spec.pairing.body};
             font-size:${px(TYPE_SCALE.lead, W)}px;line-height:1.45;color:${colors.textMuted};">${esc(c.subtext)}</p>`
        : ""
    }
    ${c.cta ? `<div style="margin-top:${px(0.01, W)}px;">${ctaPill(c.cta, spec, W)}</div>` : ""}
  </div>`;
}

function renderQuoteCard(spec, W) {
  const { colors } = spec.palette;
  const c = spec.content;
  return `
  <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;
    text-align:center;gap:${px(0.035, W)}px;height:100%;">
    <div style="font-family:${spec.pairing.display};color:${colors.accent};
      font-size:${px(0.22, W)}px;line-height:0.6;font-weight:${spec.pairing.displayWeight};">&ldquo;</div>
    <h1 style="margin:0;font-family:${spec.pairing.display};font-weight:${spec.pairing.displayWeight};
      font-style:${spec.pairing.display.includes("Serif") || spec.pairing.display.includes("Fraunces") ? "italic" : "normal"};
      font-size:${px(TYPE_SCALE.h1, W)}px;line-height:1.08;letter-spacing:-0.01em;color:${colors.text};
      max-width:90%;">${esc(c.headline)}</h1>
    ${
      c.subtext
        ? `<p style="margin:0;font-family:${spec.pairing.body};font-weight:600;
             font-size:${px(TYPE_SCALE.body, W)}px;letter-spacing:0.08em;text-transform:uppercase;
             color:${colors.textMuted};">${esc(c.subtext)}</p>`
        : ""
    }
  </div>`;
}

// Highlight the final word of a headline in the accent color for a modern pop.
function accentLastWord(text, colors) {
  const words = esc(text).split(" ");
  if (words.length < 2) return esc(text);
  const last = words.pop();
  return `${words.join(" ")} <span style="color:${colors.accent};">${last}</span>`;
}

const LAYOUT_RENDERERS = {
  "hero-centered": renderHeroCentered,
  "editorial-left": renderEditorialLeft,
  listicle: renderListicle,
  "stat-spotlight": renderStatSpotlight,
  "quote-card": renderQuoteCard,
};

/**
 * Render a full design spec to a standalone HTML string.
 */
export function renderHTML(spec) {
  const W = spec.format.w;
  const H = spec.format.h;
  const { colors } = spec.palette;
  const pad = space("pad", W);

  const background = spec.style.useGradient
    ? spec.palette.gradient
    : colors.bg;

  const bodyRenderer = LAYOUT_RENDERERS[spec.layout.id] || renderHeroCentered;
  const body = bodyRenderer(spec, W);

  // Decorative depth blobs (kept subtle) for gradient/dark backgrounds.
  const decor = spec.style.useGradient
    ? blob(`-${Math.round(W * 0.12)}px`, `-${Math.round(W * 0.1)}px`, Math.round(W * 0.5), colors.primary, spec.palette.mode === "dark" ? 0.28 : 0.18) +
      blob(`${Math.round(W * 0.62)}px`, `${Math.round(H * 0.66)}px`, Math.round(W * 0.55), colors.accent, spec.palette.mode === "dark" ? 0.22 : 0.14)
    : "";

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${spec.pairing.import}" rel="stylesheet">
<style>
  * { box-sizing: border-box; -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }
  html, body { margin: 0; padding: 0; }
  .canvas {
    position: relative;
    width: ${W}px; height: ${H}px;
    background: ${background};
    overflow: hidden;
  }
  .stage {
    position: relative;
    z-index: 2;
    width: 100%; height: 100%;
    padding: ${pad}px;
    display: flex; flex-direction: column;
    gap: ${Math.round(W * 0.03)}px;
  }
  .content { flex: 1; display: flex; min-height: 0; overflow: hidden; }
  .content > div { width: 100%; }
  .brandbar { display:flex; align-items:center; justify-content: space-between; }
</style>
</head>
<body>
  <div class="canvas" id="canvas">
    ${decor}
    <div class="stage">
      <div class="content">${body}</div>
      <div class="brandbar">
        ${footer(spec, W)}
        <div style="display:flex;gap:${px(0.012, W)}px;align-items:center;opacity:0.7;">
          <span style="width:${px(0.02, W)}px;height:${px(0.02, W)}px;border-radius:50%;background:${colors.textMuted};"></span>
          <span style="width:${px(0.02, W)}px;height:${px(0.02, W)}px;border-radius:50%;background:${colors.textMuted};"></span>
          <span style="width:${px(0.02, W)}px;height:${px(0.02, W)}px;border-radius:50%;background:${colors.accent};"></span>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

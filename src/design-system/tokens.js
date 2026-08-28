/**
 * Global design tokens: canvas formats, spacing, radii, shadows.
 * Everything scales off the canvas width so a design looks identical
 * whether it's a square post or a tall story.
 */

// Instagram-native output formats (pixel dimensions).
export const FORMATS = {
  square: { id: "square", w: 1080, h: 1080, label: "Feed (1:1)" },
  portrait: { id: "portrait", w: 1080, h: 1350, label: "Feed portrait (4:5)" },
  story: { id: "story", w: 1080, h: 1920, label: "Story / Reel (9:16)" },
};

export function getFormat(id) {
  return FORMATS[id] || FORMATS.portrait;
}

// Spacing scale as fractions of canvas width.
export const SPACE = {
  xs: 0.015,
  sm: 0.025,
  md: 0.04,
  lg: 0.06,
  xl: 0.09,
  pad: 0.075, // default outer safe-area padding
};

export const RADIUS = {
  sm: 0.018,
  md: 0.035,
  lg: 0.06,
  pill: 1, // rendered as 999px
};

// Soft, modern elevation (no hard 2010-era drop shadows).
export const SHADOW = {
  soft: "0 24px 60px rgba(0,0,0,0.18)",
  softDark: "0 24px 70px rgba(0,0,0,0.55)",
};

export function space(key, canvasWidth) {
  return Math.round((SPACE[key] ?? 0.04) * canvasWidth);
}
export function radius(key, canvasWidth) {
  if (key === "pill") return 999;
  return Math.round((RADIUS[key] ?? 0.03) * canvasWidth);
}

/**
 * Typography system.
 *
 * WHY THIS EXISTS:
 * "Tiny fonts" is the #1 complaint about AI-generated posts. It happens because
 * image models have no notion of a canvas or a type scale. Here type sizes are
 * expressed as a fraction of the canvas width, so on a 1080px post the headline
 * is ALWAYS large (roughly 90-150px), never tiny. We also ship curated Google
 * Font pairings so nothing looks like default Arial.
 */

// Google Font pairings: a display face for headlines + a clean body face.
// `import` is the Google Fonts CSS URL injected into the rendered HTML.
export const FONT_PAIRINGS = [
  {
    id: "grotesk-modern",
    moods: ["tech", "startup", "bold", "saas", "professional"],
    display: "'Space Grotesk', sans-serif",
    body: "'Inter', sans-serif",
    displayWeight: 700,
    import:
      "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap",
  },
  {
    id: "editorial-serif",
    moods: ["editorial", "elegant", "luxury", "fashion", "wellness", "quote"],
    display: "'Fraunces', serif",
    body: "'Inter', sans-serif",
    displayWeight: 600,
    import:
      "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500&display=swap",
  },
  {
    id: "geometric-clean",
    moods: ["minimal", "corporate", "finance", "clean", "professional"],
    display: "'Poppins', sans-serif",
    body: "'Inter', sans-serif",
    displayWeight: 700,
    import:
      "https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Inter:wght@400;500&display=swap",
  },
  {
    id: "expressive-display",
    moods: ["playful", "music", "event", "youth", "energetic"],
    display: "'Clash Display', 'Archivo', sans-serif",
    body: "'Archivo', sans-serif",
    displayWeight: 700,
    import:
      "https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;700;800&display=swap",
  },
  {
    id: "warm-humanist",
    moods: ["food", "lifestyle", "calm", "nature", "health", "wellness"],
    display: "'DM Serif Display', serif",
    body: "'DM Sans', sans-serif",
    displayWeight: 400,
    import:
      "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;700&display=swap",
  },
];

export const PAIRINGS_BY_ID = Object.fromEntries(
  FONT_PAIRINGS.map((p) => [p.id, p])
);

export function getPairing(id) {
  return PAIRINGS_BY_ID[id] || FONT_PAIRINGS[0];
}

/**
 * A canvas-relative modular scale.
 * Values are FRACTIONS of the canvas width. On a 1080px canvas:
 *   hero  -> ~150px, h1 -> ~124px, h2 -> ~86px, body -> ~34px, caption -> ~26px
 * This guarantees readable, "poster-sized" type at every level.
 */
export const TYPE_SCALE = {
  hero: 0.14,
  h1: 0.115,
  h2: 0.08,
  h3: 0.058,
  lead: 0.038,
  body: 0.032,
  caption: 0.024,
  eyebrow: 0.02,
};

export function px(fraction, canvasWidth) {
  return Math.round(fraction * canvasWidth);
}

/**
 * Layout archetypes.
 *
 * WHY THIS EXISTS:
 * "Weak UI/UX" comes from having no compositional structure. These archetypes
 * are proven editorial/social layouts. The Brain picks one based on the
 * content shape (a quote vs. a stat vs. a listicle read very differently), and
 * the renderer knows how to lay each one out on a grid.
 */

export const LAYOUTS = [
  {
    id: "hero-centered",
    label: "Centered hero",
    // Best when there is one punchy headline + short subtext.
    fits: ["announcement", "quote", "launch", "brand"],
    wants: { headline: true, subtext: "short", bullets: false, stat: false },
  },
  {
    id: "editorial-left",
    label: "Editorial left-aligned",
    fits: ["article", "tip", "story", "brand", "announcement"],
    wants: { headline: true, subtext: "medium", bullets: false, stat: false },
  },
  {
    id: "listicle",
    label: "Numbered list",
    // Best for "5 ways to..." / step-by-step / tips.
    fits: ["tips", "howto", "list", "carousel"],
    wants: { headline: true, subtext: false, bullets: true, stat: false },
  },
  {
    id: "stat-spotlight",
    label: "Big stat spotlight",
    // Best when a single number is the star.
    fits: ["stat", "result", "milestone", "proof"],
    wants: { headline: true, subtext: "short", bullets: false, stat: true },
  },
  {
    id: "quote-card",
    label: "Quote card",
    fits: ["quote", "testimonial", "brand"],
    wants: { headline: true, subtext: "short", bullets: false, stat: false },
  },
];

export const LAYOUTS_BY_ID = Object.fromEntries(LAYOUTS.map((l) => [l.id, l]));

export function getLayout(id) {
  return LAYOUTS_BY_ID[id] || LAYOUTS[0];
}

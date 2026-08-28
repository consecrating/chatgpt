/**
 * THE BRAIN
 *
 * This is the design-intelligence layer. It takes a plain content brief and
 * makes every professional design decision a human designer would make:
 *   - which layout best fits the SHAPE of the content
 *   - a modern palette that matches the mood/industry
 *   - a font pairing that matches that same mood
 *   - a full typographic hierarchy (eyebrow -> headline -> subtext -> CTA)
 *   - accent/decoration choices
 *
 * It is deterministic given a `seed`, so the same brief + seed always yields
 * the same design, but changing the seed explores fresh variations.
 *
 * INPUT (brief):
 * {
 *   headline:  "The one big line",         // required
 *   eyebrow:   "SMALL LABEL ON TOP",       // optional (kicker/category)
 *   subtext:   "Supporting sentence.",     // optional
 *   bullets:   ["point 1", "point 2"],     // optional (drives listicle)
 *   stat:      { value: "312%", label: "growth in 90 days" }, // optional
 *   cta:       "Follow for more",          // optional
 *   handle:    "@yourbrand",               // optional footer
 *   mood:      "bold" | "elegant" | ...,   // optional hint
 *   industry:  "fitness" | "saas" | ...,   // optional hint
 *   format:    "square" | "portrait" | "story",
 *   palette:   "midnight-lime",            // optional hard override
 *   layout:    "listicle",                 // optional hard override
 *   seed:      42                          // optional
 * }
 */

import { PALETTES, getPalette } from "../design-system/palettes.js";
import { FONT_PAIRINGS, getPairing } from "../design-system/typography.js";
import { LAYOUTS, getLayout } from "../design-system/layouts.js";
import { getFormat } from "../design-system/tokens.js";

// --- tiny seeded RNG so results are reproducible -------------------------
function makeRng(seed) {
  let s = (seed >>> 0) || 0x9e3779b9;
  return function next() {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

function stringToSeed(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// --- keyword -> mood inference ------------------------------------------
// Maps loose industry/topic words to the mood tags used across the system.
const MOOD_KEYWORDS = {
  bold: ["gym", "fitness", "workout", "hustle", "grind", "power", "beast"],
  tech: ["saas", "software", "app", "dev", "code", "cloud", "data"],
  ai: ["ai", "ml", "gpt", "automation", "agent", "neural"],
  futuristic: ["crypto", "web3", "blockchain", "future", "quantum"],
  elegant: ["luxury", "premium", "boutique", "atelier", "couture"],
  editorial: ["magazine", "story", "essay", "editorial", "journal"],
  fashion: ["fashion", "style", "outfit", "apparel", "runway"],
  beauty: ["beauty", "skincare", "makeup", "cosmetic", "glow"],
  wellness: ["wellness", "mindful", "self-care", "therapy", "balance"],
  calm: ["calm", "relax", "meditation", "sleep", "quiet"],
  nature: ["nature", "eco", "green", "outdoor", "sustainable"],
  health: ["health", "nutrition", "diet", "medical", "clinic"],
  yoga: ["yoga", "pilates", "stretch"],
  food: ["food", "recipe", "restaurant", "cafe", "coffee", "bakery"],
  lifestyle: ["lifestyle", "travel", "home", "daily", "routine"],
  corporate: ["corporate", "b2b", "enterprise", "consulting"],
  finance: ["finance", "money", "invest", "fintech", "bank", "wealth"],
  minimal: ["minimal", "simple", "clean", "less"],
  professional: ["business", "career", "professional", "agency"],
  playful: ["fun", "playful", "quirky", "meme", "party"],
  music: ["music", "concert", "dj", "band", "album", "festival"],
  event: ["event", "webinar", "summit", "conference", "meetup"],
  youth: ["gen z", "student", "campus", "teen", "college"],
  energetic: ["energy", "hype", "launch", "drop", "sale"],
  startup: ["startup", "founder", "mvp", "seed", "raise"],
};

function inferMoods(brief) {
  const moods = new Set();
  if (brief.mood) moods.add(brief.mood.toLowerCase());
  const haystack = [
    brief.industry,
    brief.headline,
    brief.eyebrow,
    brief.subtext,
    (brief.bullets || []).join(" "),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  for (const [mood, words] of Object.entries(MOOD_KEYWORDS)) {
    if (words.some((w) => haystack.includes(w))) moods.add(mood);
  }
  return moods;
}

// --- scoring helpers -----------------------------------------------------
function scoreByMood(candidateMoods, wantedMoods) {
  let score = 0;
  for (const m of candidateMoods) if (wantedMoods.has(m)) score += 2;
  return score;
}

function pickBest(candidates, scoreFn, rng) {
  let best = [];
  let bestScore = -Infinity;
  for (const c of candidates) {
    const s = scoreFn(c) + rng() * 0.9; // jitter breaks ties, enables variety
    if (s > bestScore) {
      bestScore = s;
      best = [c];
    } else if (s === bestScore) {
      best.push(c);
    }
  }
  return best[Math.floor(rng() * best.length)] || candidates[0];
}

// --- layout selection based on content SHAPE ----------------------------
function chooseLayout(brief, wantedMoods, rng) {
  if (brief.layout) return getLayout(brief.layout);

  const hasBullets = Array.isArray(brief.bullets) && brief.bullets.length > 0;
  const hasStat = !!(brief.stat && brief.stat.value);
  const subLen = (brief.subtext || "").length;

  return pickBest(
    LAYOUTS,
    (l) => {
      let s = scoreByMood(l.fits, wantedMoods);
      // Structural fit dominates: match the layout to what the content IS.
      if (hasBullets) s += l.id === "listicle" ? 8 : -4;
      if (hasStat) s += l.id === "stat-spotlight" ? 8 : -3;
      if (!hasBullets && !hasStat) {
        if (l.id === "listicle" || l.id === "stat-spotlight") s -= 6;
        if (subLen === 0 && l.id === "quote-card") s += 3;
        if (subLen > 60 && l.id === "editorial-left") s += 3;
        if (l.id === "hero-centered") s += 2;
      }
      return s;
    },
    rng
  );
}

/**
 * Main entry point: brief -> full design spec consumed by the renderer.
 */
export function think(brief = {}) {
  if (!brief.headline || !brief.headline.trim()) {
    throw new Error("brief.headline is required");
  }

  const seed =
    brief.seed != null
      ? Number(brief.seed)
      : stringToSeed(brief.headline + (brief.industry || ""));
  const rng = makeRng(seed);

  const wantedMoods = inferMoods(brief);
  const format = getFormat(brief.format || "portrait");

  const palette = brief.palette
    ? getPalette(brief.palette)
    : pickBest(PALETTES, (p) => scoreByMood(p.moods, wantedMoods), rng);

  const pairing = brief.pairing
    ? getPairing(brief.pairing)
    : pickBest(FONT_PAIRINGS, (f) => scoreByMood(f.moods, wantedMoods), rng);

  const layout = chooseLayout(brief, wantedMoods, rng);

  // Decide whether the hero background uses a gradient or a flat surface.
  const useGradient = rng() > 0.35;

  // Normalize/clean the content payload the renderer will draw.
  const content = {
    eyebrow: clean(brief.eyebrow),
    headline: clean(brief.headline),
    subtext: clean(brief.subtext),
    bullets: (brief.bullets || []).map(clean).filter(Boolean).slice(0, 6),
    stat: brief.stat && brief.stat.value ? brief.stat : null,
    cta: clean(brief.cta),
    handle: clean(brief.handle),
  };

  return {
    meta: { seed, moods: [...wantedMoods] },
    format,
    palette,
    pairing,
    layout,
    style: {
      useGradient,
      // Headline emphasis: big display for short lines, slightly smaller for long.
      headlineLevel: content.headline.length > 42 ? "h1" : "hero",
    },
    content,
  };
}

function clean(v) {
  if (v == null) return "";
  return String(v).replace(/\s+/g, " ").trim();
}

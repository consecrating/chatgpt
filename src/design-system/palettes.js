/**
 * Curated, modern color palettes.
 *
 * WHY THIS EXISTS:
 * ChatGPT/DALL-E "invents" colors on the fly, which is why output looks dated
 * (muddy gradients, clashing hues, low contrast). Here every palette is
 * hand-tuned with semantic roles and guaranteed text/background contrast, so
 * the renderer can never produce an ugly combination.
 *
 * Each palette exposes semantic roles instead of raw colors:
 *   bg        - page background
 *   surface   - raised cards / chips
 *   text      - primary text (always high-contrast on bg)
 *   textMuted - secondary text
 *   primary   - dominant brand color
 *   accent    - pop / highlight color
 *   onPrimary - text color that sits on top of `primary`
 *   gradient  - a modern gradient string for hero backgrounds
 */

export const PALETTES = [
  {
    id: "midnight-lime",
    name: "Midnight Lime",
    mode: "dark",
    moods: ["bold", "tech", "energetic", "gym", "startup"],
    colors: {
      bg: "#0B0F0A",
      surface: "#161B14",
      text: "#F4FFE9",
      textMuted: "#A6B79A",
      primary: "#C6F432",
      accent: "#7CFF6B",
      onPrimary: "#0B0F0A",
    },
    gradient: "linear-gradient(135deg,#0B0F0A 0%,#12200C 55%,#1C3310 100%)",
  },
  {
    id: "warm-editorial",
    name: "Warm Editorial",
    mode: "light",
    moods: ["editorial", "elegant", "food", "lifestyle", "wellness"],
    colors: {
      bg: "#F6F1E7",
      surface: "#FFFFFF",
      text: "#241C15",
      textMuted: "#7A6E5F",
      primary: "#C8613B",
      accent: "#2E5E4E",
      onPrimary: "#FFF6EE",
    },
    gradient: "linear-gradient(135deg,#F6F1E7 0%,#F0E4D2 100%)",
  },
  {
    id: "midnight-coral",
    name: "Midnight Coral",
    mode: "dark",
    moods: ["premium", "beauty", "fashion", "launch", "elegant"],
    colors: {
      bg: "#0E1330",
      surface: "#1A2145",
      text: "#F2F4FF",
      textMuted: "#9AA3CC",
      primary: "#FF6F61",
      accent: "#7A5CFF",
      onPrimary: "#12030A",
    },
    gradient: "linear-gradient(135deg,#0E1330 0%,#221A52 60%,#3A1F5C 100%)",
  },
  {
    id: "clean-slate",
    name: "Clean Slate",
    mode: "light",
    moods: ["corporate", "saas", "finance", "minimal", "professional"],
    colors: {
      bg: "#F4F6FB",
      surface: "#FFFFFF",
      text: "#0F1B2D",
      textMuted: "#5B6B82",
      primary: "#2F6BFF",
      accent: "#00B894",
      onPrimary: "#FFFFFF",
    },
    gradient: "linear-gradient(135deg,#F4F6FB 0%,#E7EEFB 100%)",
  },
  {
    id: "sunset-pop",
    name: "Sunset Pop",
    mode: "dark",
    moods: ["playful", "music", "event", "energetic", "youth"],
    colors: {
      bg: "#1A0B1F",
      surface: "#2A1230",
      text: "#FFF0FA",
      textMuted: "#D2A6C8",
      primary: "#FF477E",
      accent: "#FFC93C",
      onPrimary: "#1A0B1F",
    },
    gradient: "linear-gradient(135deg,#2A0E3A 0%,#7A1E52 55%,#FF6B3D 100%)",
  },
  {
    id: "sage-calm",
    name: "Sage Calm",
    mode: "light",
    moods: ["wellness", "calm", "health", "yoga", "nature", "minimal"],
    colors: {
      bg: "#EFF3EC",
      surface: "#FFFFFF",
      text: "#1F2A22",
      textMuted: "#5F6F63",
      primary: "#4C7B5B",
      accent: "#D98E4A",
      onPrimary: "#F3F8F1",
    },
    gradient: "linear-gradient(135deg,#EFF3EC 0%,#DDE7D8 100%)",
  },
  {
    id: "ink-mono",
    name: "Ink Mono",
    mode: "light",
    moods: ["editorial", "minimal", "quote", "luxury", "professional"],
    colors: {
      bg: "#FAFAF8",
      surface: "#FFFFFF",
      text: "#111111",
      textMuted: "#6B6B6B",
      primary: "#111111",
      accent: "#E4572E",
      onPrimary: "#FFFFFF",
    },
    gradient: "linear-gradient(135deg,#FAFAF8 0%,#ECECE8 100%)",
  },
  {
    id: "electric-aqua",
    name: "Electric Aqua",
    mode: "dark",
    moods: ["tech", "crypto", "ai", "futuristic", "startup"],
    colors: {
      bg: "#03121A",
      surface: "#0B2430",
      text: "#E6FBFF",
      textMuted: "#84B4C2",
      primary: "#28E0C8",
      accent: "#5B8CFF",
      onPrimary: "#03121A",
    },
    gradient: "linear-gradient(135deg,#03121A 0%,#0A2E3A 55%,#0E4C55 100%)",
  },
];

export const PALETTES_BY_ID = Object.fromEntries(
  PALETTES.map((p) => [p.id, p])
);

export function getPalette(id) {
  return PALETTES_BY_ID[id] || PALETTES[0];
}

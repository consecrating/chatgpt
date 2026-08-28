#!/usr/bin/env node
/**
 * PostBrain CLI
 *
 * Turn a content brief into a professional Instagram post (HTML + PNG).
 *
 * Examples:
 *   node cli.js --headline "Stop guessing your macros" \
 *     --eyebrow "NUTRITION 101" --subtext "A 60-second framework." \
 *     --cta "Save this post" --handle "@fitwithsam" --industry fitness
 *
 *   node cli.js --headline "5 habits of profitable founders" \
 *     --bullet "Talk to users weekly" --bullet "Ship before it's ready" \
 *     --bullet "Track one north-star metric" --industry startup
 *
 *   echo '{"headline":"Design is thinking made visible","industry":"editorial"}' | node cli.js --json -
 *
 * Flags:
 *   --headline   (required)  main line
 *   --eyebrow                small kicker label
 *   --subtext                supporting sentence
 *   --bullet                 repeatable; builds a numbered list
 *   --stat / --stat-label    a big number + its caption
 *   --cta                    call-to-action pill text
 *   --handle                 @handle footer
 *   --industry / --mood      steer palette + fonts
 *   --format                 square | portrait | story   (default portrait)
 *   --palette / --layout     hard overrides (see src/design-system)
 *   --seed                   integer, for reproducible variations
 *   --out                    output basename (default: output/post)
 *   --no-png                 only write HTML (skip Chromium render)
 *   --json <file|->          read the whole brief as JSON (- = stdin)
 */

import fs from "node:fs";
import path from "node:path";
import { think } from "./src/brain/brain.js";
import { renderHTML } from "./src/render/renderer.js";

function parseArgs(argv) {
  const args = { bullets: [] };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    const next = () => argv[++i];
    switch (a) {
      case "--headline": args.headline = next(); break;
      case "--eyebrow": args.eyebrow = next(); break;
      case "--subtext": args.subtext = next(); break;
      case "--bullet": args.bullets.push(next()); break;
      case "--stat": args.stat = { ...(args.stat || {}), value: next() }; break;
      case "--stat-label": args.stat = { ...(args.stat || {}), label: next() }; break;
      case "--cta": args.cta = next(); break;
      case "--handle": args.handle = next(); break;
      case "--industry": args.industry = next(); break;
      case "--mood": args.mood = next(); break;
      case "--format": args.format = next(); break;
      case "--palette": args.palette = next(); break;
      case "--layout": args.layout = next(); break;
      case "--pairing": args.pairing = next(); break;
      case "--seed": args.seed = Number(next()); break;
      case "--out": args.out = next(); break;
      case "--no-png": args.noPng = true; break;
      case "--json": args.json = next(); break;
      case "-h":
      case "--help": args.help = true; break;
      default:
        if (a.startsWith("--")) console.warn(`Unknown flag: ${a}`);
    }
  }
  return args;
}

function readJsonBrief(src) {
  const raw = src === "-" ? fs.readFileSync(0, "utf8") : fs.readFileSync(src, "utf8");
  return JSON.parse(raw);
}

const HELP = `PostBrain — professional Instagram posts from a brief.

Required: --headline "..."
Common:   --eyebrow --subtext --bullet (xN) --cta --handle --industry --format
See the header of cli.js for the full flag list.`;

async function main() {
  const args = parseArgs(process.argv);
  if (args.help) { console.log(HELP); return; }

  let brief;
  if (args.json) {
    brief = readJsonBrief(args.json);
  } else {
    brief = {
      headline: args.headline,
      eyebrow: args.eyebrow,
      subtext: args.subtext,
      bullets: args.bullets,
      stat: args.stat,
      cta: args.cta,
      handle: args.handle,
      industry: args.industry,
      mood: args.mood,
      format: args.format,
      palette: args.palette,
      layout: args.layout,
      pairing: args.pairing,
      seed: args.seed,
    };
  }

  if (!brief.headline) {
    console.error("Error: --headline is required.\n\n" + HELP);
    process.exit(1);
  }

  const spec = think(brief);
  const html = renderHTML(spec);

  const outBase = args.out || "output/post";
  fs.mkdirSync(path.dirname(outBase), { recursive: true });

  const htmlPath = `${outBase}.html`;
  fs.writeFileSync(htmlPath, html);

  console.log("Brain decisions:");
  console.log(`  layout   : ${spec.layout.id} (${spec.layout.label})`);
  console.log(`  palette  : ${spec.palette.id} (${spec.palette.name}, ${spec.palette.mode})`);
  console.log(`  fonts    : ${spec.pairing.id}`);
  console.log(`  format   : ${spec.format.id} ${spec.format.w}x${spec.format.h}`);
  console.log(`  moods    : ${spec.meta.moods.join(", ") || "(none inferred)"}`);
  console.log(`  seed     : ${spec.meta.seed}`);
  console.log(`\nHTML -> ${htmlPath}`);

  if (!args.noPng) {
    const { htmlToPng } = await import("./src/render/export.js");
    const pngPath = `${outBase}.png`;
    await htmlToPng(html, {
      width: spec.format.w,
      height: spec.format.h,
      outPath: pngPath,
    });
    console.log(`PNG  -> ${pngPath}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

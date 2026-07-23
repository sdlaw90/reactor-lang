#!/usr/bin/env node
// Regenerates lib/trackItemCounts.js from the track data in data/tracks/.
//
//   node scripts/gen-track-item-counts.mjs            # write the file
//   node scripts/gen-track-item-counts.mjs --check     # print counts, don't write
//
// Counts every BANK category plus the phonetics extra-bank (FONO_BANK) pairs —
// the full set of seen-trackable item ids the engine records (see
// lib/gameEngine.js). Uses the same text-extraction approach as
// scripts/validate-wrongnotes.mjs so it never has to resolve the module graph
// of the (multi-MB) track files.

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TRACKS_DIR = path.join(ROOT, "data", "tracks");
const OUT_FILE = path.join(ROOT, "lib", "trackItemCounts.js");
const CHECK = process.argv.includes("--check");

// English admin labels — hand-maintained here (admin UI is English-only). Add a
// line when a track is added; unknown ids fall back to the raw id at runtime.
const TRACK_LABELS = {
  "es-latam-for-en": "Spanish (Latin America)",
  "es-spain-for-en": "Spanish (Spain)",
  "en-us-for-es": "English (US) · for Spanish speakers",
  "en-gb-for-es": "English (UK) · for Spanish speakers",
  "it-for-en": "Italian",
  "fr-for-en": "French",
  "fr-ca-for-en": "French (Canada)",
  "pt-br-for-en": "Portuguese (Brazil)",
  "pt-pt-for-en": "Portuguese (Portugal)",
  "de-for-en": "German",
  "ru-for-en": "Russian",
  "ja-for-en": "Japanese",
  "zh-for-en": "Mandarin Chinese",
  "ko-for-en": "Korean",
  "en-for-it": "English · for Italian speakers",
};

function extractObject(src, name) {
  const start = src.indexOf(`const ${name}`);
  if (start < 0) return null;
  const br = src.indexOf("{", start);
  let depth = 0, i = br, inStr = false, strCh = "", esc = false;
  for (; i < src.length; i++) {
    const c = src[i];
    if (inStr) { if (esc) esc = false; else if (c === "\\") esc = true; else if (c === strCh) inStr = false; continue; }
    if (c === '"' || c === "'" || c === "`") { inStr = true; strCh = c; continue; }
    if (c === "{") depth++; else if (c === "}") { depth--; if (depth === 0) { i++; break; } }
  }
  return src.slice(br, i);
}

// Count top-level elements of `const NAME = [ ... ]` without evaluating it
// (elements may contain arrow functions). Counts depth-1 commas + 1.
function countArrayElements(src, name) {
  const start = src.indexOf(`const ${name}`);
  if (start < 0) return 0;
  const br = src.indexOf("[", start);
  if (br < 0) return 0;
  let depth = 0, i = br, inStr = false, strCh = "", esc = false, commas = 0, sawContent = false;
  for (; i < src.length; i++) {
    const c = src[i];
    if (inStr) { if (esc) esc = false; else if (c === "\\") esc = true; else if (c === strCh) inStr = false; continue; }
    if (c === '"' || c === "'" || c === "`") { inStr = true; strCh = c; sawContent = true; continue; }
    if (c === "[" || c === "{" || c === "(") depth++;
    else if (c === "]" || c === "}" || c === ")") { depth--; if (c === "]" && depth === 0) break; }
    else if (c === "," && depth === 1) commas++;
    else if (depth >= 1 && !/\s/.test(c)) sawContent = true;
  }
  if (!sawContent) return 0;
  return commas + 1;
}

const idOf = (src) => (src.match(/\bid:\s*["'`]([^"'`]+)["'`]/) || [])[1] || null;
const extraCatOf = (src) => (src.match(/extraCatId:\s*["'`]([^"'`]+)["'`]/) || [])[1] || null;

const files = readdirSync(TRACKS_DIR).filter((f) => f.endsWith(".js") && !f.endsWith("Tags.js") && f !== "index.js");

const counts = {};
for (const f of files) {
  const src = readFileSync(path.join(TRACKS_DIR, f), "utf8");
  const id = idOf(src);
  const bankTxt = extractObject(src, "BANK");
  if (!id || !bankTxt) { console.error(`SKIP ${f} (id=${id}, bank=${!!bankTxt})`); continue; }
  let BANK;
  try { BANK = (0, eval)("(" + bankTxt + ")"); } catch (e) { console.error(`EVAL FAIL ${f}: ${e.message}`); continue; }
  const categories = {};
  let total = 0;
  for (const cat of Object.keys(BANK)) {
    if (!Array.isArray(BANK[cat])) continue;
    categories[cat] = BANK[cat].length;
    total += BANK[cat].length;
  }
  const extraCat = extraCatOf(src);
  const extraVar = src.includes("FONO_BANK") ? "FONO_BANK" : src.includes("EXTRA_BANK") ? "EXTRA_BANK" : null;
  if (extraCat && extraVar) {
    const n = countArrayElements(src, extraVar);
    if (n > 0) { categories[extraCat] = n; total += n; }
  }
  counts[id] = { total, categories };
}

const catStr = (categories) =>
  "{ " + Object.entries(categories).map(([k, v]) => `${k}: ${v}`).join(", ") + " }";

const countsBody = Object.entries(counts)
  .map(([id, { total, categories }]) => `  ${JSON.stringify(id)}: { total: ${total}, categories: ${catStr(categories)} },`)
  .join("\n");

const labelsBody = Object.entries(TRACK_LABELS)
  .map(([id, label]) => `  ${JSON.stringify(id)}: ${JSON.stringify(label)},`)
  .join("\n");

const out = `// AUTO-GENERATED by scripts/gen-track-item-counts.mjs — do not hand-edit the
// counts. Regenerate after any content change with:
//   node scripts/gen-track-item-counts.mjs
//
// Why this file exists: the admin progress dashboard needs to show "coverage"
// (how much of a track a learner has actually seen), which requires the total
// number of learnable items per track. Counting them at request time would mean
// importing the (multi-MB) track data into a serverless function on every call,
// so we bake the totals here instead. Counts include every BANK category plus
// the phonetics (fono) extra-bank pairs — i.e. the full set of seen-trackable
// item ids the engine records (see lib/gameEngine.js: \`\${cat}-\${i}\` and
// \`\${extraCatId}-pair-\${i}\`).

export const TRACK_ITEM_COUNTS = {
${countsBody}
};

// English display labels for the admin dashboard (admin UI is English-only).
// Kept alongside the counts so the admin API needs no other import.
export const TRACK_LABELS = {
${labelsBody}
};

// Total learnable items for a track, or null if unknown (e.g. a track added
// after this file was last regenerated). Callers should treat null coverage as
// "—" rather than 0%.
export function trackTotalItems(trackId) {
  return TRACK_ITEM_COUNTS[trackId] ? TRACK_ITEM_COUNTS[trackId].total : null;
}

// Item total for a specific category within a track (used for per-category
// coverage), or null if unknown.
export function categoryTotalItems(trackId, cat) {
  const t = TRACK_ITEM_COUNTS[trackId];
  return t && t.categories && typeof t.categories[cat] === "number" ? t.categories[cat] : null;
}

// Friendly label, falling back to the raw id so unknown/future tracks still render.
export function trackLabel(trackId) {
  return TRACK_LABELS[trackId] || trackId;
}
`;

if (CHECK) {
  console.log(JSON.stringify(counts, null, 2));
  console.log(`\n(${Object.keys(counts).length} tracks; --check, not written)`);
} else {
  writeFileSync(OUT_FILE, out, "utf8");
  console.log(`Wrote ${path.relative(ROOT, OUT_FILE)} (${Object.keys(counts).length} tracks).`);
}

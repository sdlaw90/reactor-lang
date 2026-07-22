#!/usr/bin/env node
// #69: wrong-answer-note coverage validator.
//
// The hybrid #69 schema adds an OPTIONAL slot-7 object to curated bank items:
//   [prompt, options, correctIdx, explain, level, promptEn, promptNative,
//    { wrongNote?: {en,es}, distractorNotes?: { "<opt text>": {en,es} } }]
// The engine (lib/gameEngine.js) already renders it; this script reports how
// much of each track's curated content actually carries a wrongNote, so the
// backfill can be tracked. Also validates shape (wrongNote must have en+es;
// distractorNotes keys must match an option's text so they survive shuffling).
//
//   node scripts/validate-wrongnotes.mjs                 # coverage report (exit 0)
//   node scripts/validate-wrongnotes.mjs --strict        # exit 1 if ANY curated item lacks a wrongNote
//   node scripts/validate-wrongnotes.mjs jaForEn koForEn # limit to named tracks
//
// Curated categories only (vocab/gram/verbo/trad); the Word Bank (fvocab) is
// auto-generated and phonetics (fono) is a listening exercise, both excluded.

import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TRACKS_DIR = path.join(ROOT, "data", "tracks");
const CURATED = new Set(["vocab", "gram", "verbo", "trad"]);
const STRICT = process.argv.includes("--strict");
const named = process.argv.slice(2).filter((a) => !a.startsWith("--"));

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

const files = readdirSync(TRACKS_DIR)
  .filter((f) => f.endsWith(".js") && !f.endsWith("Tags.js") && f !== "index.js")
  .filter((f) => !named.length || named.includes(f.replace(/\.js$/, "")));

let totalItems = 0, totalWith = 0, shapeProblems = [];
const rows = [];
for (const f of files) {
  const src = readFileSync(path.join(TRACKS_DIR, f), "utf8");
  const objTxt = extractObject(src, "BANK");
  if (!objTxt) { rows.push([f, "—", "no literal BANK (skipped)"]); continue; }
  let BANK;
  try { BANK = (0, eval)("(" + objTxt + ")"); } catch { rows.push([f, "—", "BANK not a pure literal (skipped)"]); continue; }
  let items = 0, withNote = 0;
  for (const cat of Object.keys(BANK)) {
    if (!CURATED.has(cat) || !Array.isArray(BANK[cat])) continue;
    BANK[cat].forEach((q, i) => {
      if (!Array.isArray(q)) return;
      items++;
      const notes = q[7] && typeof q[7] === "object" ? q[7] : null;
      const wn = notes && notes.wrongNote;
      if (wn) {
        withNote++;
        if (!wn.en || !wn.es) shapeProblems.push(`${f} ${cat}[${i}]: wrongNote missing en/es`);
      }
      if (notes && notes.distractorNotes) {
        const opts = new Set(q[1] || []);
        for (const k of Object.keys(notes.distractorNotes)) {
          if (!opts.has(k)) shapeProblems.push(`${f} ${cat}[${i}]: distractorNote key not an option text: "${k}"`);
        }
      }
    });
  }
  totalItems += items; totalWith += withNote;
  const pct = items ? Math.round((withNote / items) * 100) : 0;
  rows.push([f, `${withNote}/${items}`, `${pct}%`]);
}

console.log("\n#69 wrongNote coverage (curated categories: vocab/gram/verbo/trad)\n");
for (const [f, cov, pct] of rows) console.log(`  ${f.padEnd(20)} ${String(cov).padStart(9)}  ${pct}`);
console.log(`\n  TOTAL ${String(totalWith + "/" + totalItems).padStart(24)}  ${totalItems ? Math.round((totalWith / totalItems) * 100) : 0}%`);
if (shapeProblems.length) {
  console.log(`\n✖ ${shapeProblems.length} shape problem(s):`);
  shapeProblems.forEach((p) => console.log("  - " + p));
}

if (STRICT && totalWith < totalItems) {
  console.error(`\n✖ --strict: ${totalItems - totalWith} curated item(s) still lack a wrongNote.`);
  process.exit(1);
}
if (shapeProblems.length) process.exit(1);
process.exit(0);

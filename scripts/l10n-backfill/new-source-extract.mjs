// v3.4 — NEW SOURCE extract. Builds the work list for standing up a source language
// that has no side tables at all yet (Italian in v3.4; German in v3.5, and so on).
//
// Two surfaces come out of this, and they are NOT interchangeable:
//
//  A. the LOCALIZED SURFACE — `prompt`, `promptNative`, `options` — taken from an existing
//     sibling table for a language that is already built (`.es` where one exists, `.fr`
//     otherwise for the Spanish-target tracks). Translating a sibling in place is what
//     carries the Word Bank (fvocab-*) across for free, with no buildFrequencyBank replay.
//     `options` is index-aligned to the base item, so correctIdx never moves.
//
//  B. the EXPLANATION SURFACE — `explain`, `wrongNote`, `distractorNotes` — taken from the
//     BASE BANK's `es` value, the same source the v3.4 pt/fr backfill used. These never
//     existed in any side table before v3.4, so there is no sibling to copy.
//
// B's `distractorNotes` are keyed by the LOCALIZED option text, so A must be assembled
// first. Both are emitted here in one pass so the build order is not a thing anyone has to
// remember.
//
//   node scripts/l10n-backfill/new-source-extract.mjs <lang> [outdir]
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import esbuild from "esbuild";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const LANG = process.argv[2];
const OUT = process.argv[3] || `/root/wk/src-${LANG}`;
if (!LANG) { console.error("usage: new-source-extract.mjs <lang> [outdir]"); process.exit(2); }

let seq = 0;
async function load(entry) {
  const r = await esbuild.build({
    entryPoints: [path.join(ROOT, entry)], bundle: true, write: false, format: "esm",
    platform: "node", logLevel: "silent", loader: { ".js": "jsx" }, jsx: "automatic",
  });
  const tmp = path.join(ROOT, `scripts/l10n-backfill/_n${seq++}.tmp.mjs`);
  fs.writeFileSync(tmp, r.outputFiles[0].text);
  try { return await import("file://" + tmp); } finally { fs.unlinkSync(tmp); }
}

const idx = await load("data/tracks/index.js");
const ge = await load("lib/gameEngine.js");
const l10n = await load("data/tracks/l10n/index.js");

// Every target whose base language differs from the new source. Read off listTracks rather
// than hardcoded, so a track added later is picked up instead of silently skipped.
const tracks = idx.listTracks().filter((t) => !t.sourceSpecific && t.targetLang !== LANG);
const SIBLING_ORDER = ["es", "fr", "pt"].filter((l) => l !== LANG);

fs.mkdirSync(OUT, { recursive: true });
const str = (v) => (typeof v === "string" ? v : v == null ? null : JSON.stringify(v));

const dump = {};
let nSurface = 0, nExplain = 0;
for (const t of tracks) {
  let sibLang = null, sib = null;
  for (const l of SIBLING_ORDER) {
    const m = await l10n.loadL10n(t.id, l);
    if (m) { sibLang = l; sib = m; break; }
  }
  if (!sib) { console.log(`WARN ${t.id}: no sibling table in ${SIBLING_ORDER.join("/")} — would need a buildFrequencyBank replay. Skipped.`); continue; }

  const flatBase = ge.flattenBank(t.bank, t.tagFor, "en", null);
  const flatSib = ge.flattenBank(t.bank, t.tagFor, sibLang, sib);
  const rows = [];
  for (let i = 0; i < flatBase.length; i++) {
    const b = flatBase[i], s = flatSib[i];
    if (b.id !== s.id) throw new Error("flatten order mismatch " + t.id);
    const e = sib[b.id] || {};
    const row = { id: b.id, cat: b.id.slice(0, b.id.lastIndexOf("-")) };

    // A — localized surface, from the sibling
    if (e.prompt != null) { row.prompt = { src: e.prompt, en: b.prompt }; nSurface++; }
    if (e.promptNative != null) {
      row.promptNative = { src: e.promptNative, en: str(b.promptNative && b.promptNative.en) };
      nSurface++;
    }
    if (Array.isArray(e.options)) {
      row.options = e.options.map((o, k) => ({ src: o, en: (b.options || [])[k] }));
      nSurface += e.options.length;
      if (b.options && e.options.length !== b.options.length) {
        console.log(`BLOCKER ${t.id} ${b.id}: sibling has ${e.options.length} options, base has ${b.options.length}`);
        process.exit(1);
      }
    }

    // B — explanation surface, from the base bank's es value
    const need = {};
    if (b.explain && b.explain[LANG] == null) need.explain = { en: str(b.explain.en), es: str(b.explain.es) };
    if (b.wrongNote && b.wrongNote[LANG] == null) need.wrongNote = { en: str(b.wrongNote.en), es: str(b.wrongNote.es) };
    if (b.distractorNotes) {
      const dn = {};
      for (const [opt, m] of Object.entries(b.distractorNotes)) {
        if (m && m[LANG] != null) continue;
        const oi = (b.options || []).indexOf(opt);
        dn[opt] = { en: str(m.en), es: str(m.es), optIdx: oi };
      }
      if (Object.keys(dn).length) need.distractorNotes = dn;
    }
    if (Object.keys(need).length) { row.need = need; nExplain += Object.keys(need).length; }

    if (row.prompt || row.promptNative || row.options || row.need) rows.push(row);
  }
  dump[t.id] = { sibling: sibLang, rows };
  console.log(`${t.id}\tsibling=${sibLang}\t${rows.length} items`);
}
fs.writeFileSync(path.join(OUT, `source.${LANG}.json`), JSON.stringify(dump));
console.log(`\n${tracks.length} tracks · ${nSurface} localized-surface strings · ${nExplain} explanation fields -> ${OUT}/source.${LANG}.json`);

// v3.4 #60 backfill — EXTRACT. Dumps, per source language, every item that needs an
// explain / wrongNote / distractorNote in that language, together with the base
// English + Spanish strings and the item's ALREADY-LOCALIZED surface (prompt,
// promptNative, options) from the existing side table. The localized surface is what
// lets the mechanical families be filled correct-by-construction instead of guessed.
import fs from "fs"; import path from "path"; import { fileURLToPath } from "url"; import esbuild from "esbuild";
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
let seq = 0;
async function load(entry) {
  const r = await esbuild.build({ entryPoints: [path.join(ROOT, entry)], bundle: true, write: false, format: "esm", platform: "node", logLevel: "silent", loader: { ".js": "jsx" }, jsx: "automatic" });
  const tmp = path.join(ROOT, `scripts/_bf/_x${seq++}.tmp.mjs`);
  fs.writeFileSync(tmp, r.outputFiles[0].text);
  try { return await import("file://" + tmp); } finally { fs.unlinkSync(tmp); }
}
const idx = await load("data/tracks/index.js");
const ge = await load("lib/gameEngine.js");
const l10n = await load("data/tracks/l10n/index.js");
const OUT = process.argv[2] || "/root/wk/bf";
fs.mkdirSync(OUT, { recursive: true });

const str = (v) => (typeof v === "string" ? v : v == null ? null : JSON.stringify(v));
for (const lang of ["pt", "fr"]) {
  const tracks = idx.tracksForNativeLang(lang, "US");
  const dump = {};
  for (const t of tracks) {
    const side = (await l10n.loadL10n(t.id, lang)) || {};
    const flatBase = ge.flattenBank(t.bank, t.tagFor, "en", null);
    const flatLoc = ge.flattenBank(t.bank, t.tagFor, lang, side);
    const rows = [];
    for (let i = 0; i < flatBase.length; i++) {
      const b = flatBase[i], L = flatLoc[i];
      if (b.id !== L.id) throw new Error("flatten order mismatch " + t.id);
      const need = {};
      if (b.explain && b.explain[lang] == null) need.explain = { en: str(b.explain.en), es: str(b.explain.es) };
      if (b.wrongNote && b.wrongNote[lang] == null) need.wrongNote = { en: str(b.wrongNote.en), es: str(b.wrongNote.es) };
      if (b.distractorNotes) {
        const dn = {};
        const baseOpts = b.options || [], locOpts = L.options || baseOpts;
        for (const [opt, m] of Object.entries(b.distractorNotes)) {
          if (m && m[lang] != null) continue;
          const oi = baseOpts.indexOf(opt);
          dn[opt] = { en: str(m.en), es: str(m.es), optIdx: oi, locOpt: oi >= 0 ? locOpts[oi] : null };
        }
        if (Object.keys(dn).length) need.distractorNotes = dn;
      }
      if (!Object.keys(need).length) continue;
      rows.push({
        id: b.id, cat: b.id.slice(0, b.id.lastIndexOf("-")),
        prompt: b.prompt, locPrompt: L.prompt !== b.prompt ? L.prompt : null,
        promptNative: str(b.promptNative && b.promptNative.en), locPromptNative: str(L.promptNative && L.promptNative[lang]),
        options: b.options, locOptions: L.options && JSON.stringify(L.options) !== JSON.stringify(b.options) ? L.options : null,
        correctIdx: b.correctIdx, need,
      });
    }
    dump[t.id] = rows;
    console.log(`${lang}\t${t.id}\t${rows.length} items`);
  }
  fs.writeFileSync(path.join(OUT, `need.${lang}.json`), JSON.stringify(dump));
}
console.log("written to", OUT);

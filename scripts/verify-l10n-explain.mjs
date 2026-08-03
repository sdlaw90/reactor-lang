// v3.4 (#60) — proves the side-table `explain` / `wrongNote` overlay reaches the
// card and that the English fallback survives it.
//
// Background: until v3.4 the ONLY way to give a source language its own
// explanations was to edit the base bank in place. That is why `explain` is
// complete for en and es (baked in by v3.0/v3.1) and falls back to English for pt
// and fr. `flattenBank` now merges an `explain` / `wrongNote` carried by the
// per-source side table — merges, not replaces, so an item the side table has not
// reached still resolves to English instead of going blank.
//
// Usage:
//   node scripts/verify-l10n-explain.mjs
//   node scripts/verify-l10n-explain.mjs --mutate=no-overlay        (1, 4 red)
//   node scripts/verify-l10n-explain.mjs --mutate=replace-not-merge (2, 7, 8 red)
//
// The mutations exist because a check nobody has seen fail is not a check. Both
// are asserted to be non-no-ops before they run.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import esbuild from "esbuild";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MUTATE = (process.argv.find((a) => a.startsWith("--mutate=")) || "").split("=")[1] || null;

let seq = 0;
async function load(entry) {
  const r = await esbuild.build({
    entryPoints: [path.join(ROOT, entry)], bundle: true, write: false, format: "esm",
    platform: "node", logLevel: "silent", loader: { ".js": "jsx" }, jsx: "automatic",
  });
  let src = r.outputFiles[0].text;
  if (MUTATE === "replace-not-merge" && entry.includes("gameEngine")) {
    // Rewrite the merge back into the pre-v3.4 "side table replaces the map" shape.
    const forms = ["return { ...base || {}, ...add };", "return { ...(base || {}), ...add };"];
    const hit = forms.find((f) => src.includes(f));
    if (!hit) { console.log("BLOCKER: mutation target not found in the bundled engine — the mutation is a no-op"); process.exit(1); }
    src = src.replace(hit, "return add;");
  }
  const tmp = path.join(ROOT, `scripts/_l10nx${seq++}.tmp.mjs`);
  fs.writeFileSync(tmp, src);
  try { return await import(pathToFileHref(tmp)); } finally { fs.unlinkSync(tmp); }
}
const pathToFileHref = (p) => "file://" + p;

const idx = await load("data/tracks/index.js");
const ge = await load("lib/gameEngine.js");
const l10n = await load("data/tracks/l10n/index.js");

// Verbatim copy of resolveExplainText from app/play/[trackId]/page.js — the
// checks below are only meaningful if they resolve the way the screen does.
function resolveExplainText(map, sourceLang, sourceRegion = "latam") {
  if (!map) return null;
  let val = map[sourceLang];
  if (val && typeof val === "object") val = val[sourceRegion] ?? val.latam ?? val.spain;
  if (val == null) return map.en != null ? { text: map.en, lang: "en" } : null;
  return { text: val, lang: sourceLang };
}

const results = [];
const check = (name, cond, detail = "") => results.push({ name, pass: !!cond, detail });

const TID = "de-for-en";
const track = idx.getTrack(TID);
const baseMap = await l10n.loadL10n(TID, "fr");
const splitId = (k) => [k.slice(0, k.lastIndexOf("-")), +k.slice(k.lastIndexOf("-") + 1)];
const targetId = Object.keys(baseMap).slice(0, 60).find((k) => {
  const [cat, i] = splitId(k);
  const q = track.bank[cat]?.[i];
  return q && q[3] && q[3].en;
});
if (!targetId) { console.log("BLOCKER: no side-table item with a base explain — the probe itself is wrong"); process.exit(1); }
const [tCat, tIdx] = splitId(targetId);
const baseExplain = track.bank[tCat][tIdx][3];

const FR_EXPLAIN = "EXPLICATION FR DE TEST";
const FR_WRONGNOTE = "NOTE FR DE TEST";
const overlay = MUTATE === "no-overlay"
  ? baseMap
  : { ...baseMap, [targetId]: { ...baseMap[targetId], explain: FR_EXPLAIN, wrongNote: FR_WRONGNOTE } };

const flat = ge.flattenBank(track.bank, track.tagFor, "fr", overlay);
const q = flat.find((x) => x.id === targetId);
const other = flat.find((x) => x.id !== targetId && x.explain && x.explain.en);

// 1. the overlay reaches the card, tagged as the source language
const r1 = resolveExplainText(q.explain, "fr");
check("overlay applied", r1?.lang === "fr" && r1.text === FR_EXPLAIN, JSON.stringify(r1));

// 2. the base English is STILL in the map — merge, not replace
check("base en preserved on the overlaid item", q.explain?.en != null && q.explain.en === baseExplain.en, JSON.stringify(Object.keys(q.explain || {})));

// 3. an item the side table did NOT reach falls back to English, not blank
const r3 = resolveExplainText(other.explain, "fr");
check("un-overlaid item falls back to EN", r3?.lang === "en" && !!r3.text, r3 ? r3.lang : "NULL");

// 4. wrongNote comes through as a MAP. Strict on purpose: a null wrongNote must
//    FAIL here rather than pass by short-circuit.
check("wrongNote merged as a map", !!q.wrongNote && typeof q.wrongNote === "object" && q.wrongNote.fr === FR_WRONGNOTE, q.wrongNote ? typeof q.wrongNote : "null");

// 5. es natives unchanged — their explanations come from the base bank and no es
//    side table carries `explain`, so this must stay at 100%
const esFlat = ge.flattenBank(track.bank, track.tagFor, "es", await l10n.loadL10n(TID, "es"));
let esN = 0, esT = 0;
for (const x of esFlat) { if (!x.explain) continue; esT++; if (resolveExplainText(x.explain, "es")?.lang === "es") esN++; }
check("es coverage unchanged at 100%", esT > 0 && esN === esT, `${esN}/${esT}`);

// 6. English natives (no side table at all) get the base map untouched
const enBase = ge.flattenBank(track.bank, track.tagFor, "en", null).find((x) => x.id === targetId);
check("en native unaffected", JSON.stringify(enBase?.explain) === JSON.stringify(baseExplain), "");

// 7. a regional ({ latam, spain }) explain value survives the merge. Synthetic
//    bank so this can never pass vacuously on a track that happens to have none.
const regFlat = ge.flattenBank(
  { probe: [["p", ["a", "b"], 0, { en: "EN", es: { latam: "LA", spain: "ES" } }]] },
  null, "fr", { "probe-0": { explain: FR_EXPLAIN } },
);
const regQ = regFlat[0];
check("regional explain object survives merge",
  resolveExplainText(regQ.explain, "es", "spain")?.text === "ES"
  && resolveExplainText(regQ.explain, "es", "latam")?.text === "LA"
  && resolveExplainText(regQ.explain, "fr")?.text === FR_EXPLAIN,
  JSON.stringify(regQ.explain));

// 8. mergeLangMap directly — bare string and partial-map forms are equivalent
const m1 = ge.mergeLangMap({ en: "E", es: "S" }, "F", "fr");
const m2 = ge.mergeLangMap({ en: "E", es: "S" }, { fr: "F" }, "fr");
check("mergeLangMap keeps base + adds source",
  JSON.stringify(m1) === JSON.stringify({ en: "E", es: "S", fr: "F" }) && JSON.stringify(m1) === JSON.stringify(m2),
  JSON.stringify(m1));
check("mergeLangMap(base, null) is the base", JSON.stringify(ge.mergeLangMap({ en: "E" }, null, "fr")) === JSON.stringify({ en: "E" }), "");

let bad = 0;
for (const c of results) { if (!c.pass) bad++; console.log(`${c.pass ? "PASS" : "FAIL"}  ${c.name}${c.detail ? "  · " + c.detail : ""}`); }
console.log(MUTATE ? `\n[mutation ${MUTATE}] ${bad} check(s) red` : `\n${bad} blocker(s)`);
process.exit(bad ? 1 : 0);

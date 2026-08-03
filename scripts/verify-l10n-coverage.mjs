// v3.4 (#60) — the COVERAGE GATE.
//
// Deployment plan §4 step 2 says a source language is not done on #60 until its row
// in the coverage table matches `es`. v3.2 and v3.3 both shipped at 10% because that
// bar was a sentence in a checklist and nothing computed it. This computes it.
//
// It measures through the REAL path — `tracksForNativeLang` for the offering,
// `flattenBank` for the merge, and a verbatim copy of the play screen's own
// `resolveExplainText` for the resolution — so the number is what a learner gets, not
// what the files contain. A string present in a side table but unreachable because the
// item id is wrong, or shadowed by a base map, counts as missing here. That is the point.
//
// Every language in RELEASED_SOURCE_LANGS must be at 100% on all three surfaces.
// Unreleased sources are reported but never gate: they are mid-build by definition.
//
// Usage:
//   node scripts/verify-l10n-coverage.mjs
//   node scripts/verify-l10n-coverage.mjs --markdown   (paste into a changelog fragment)
//   node scripts/verify-l10n-coverage.mjs --mutate=drop-explain   (must go red)
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import esbuild from "esbuild";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MD = process.argv.includes("--markdown");
const MUTATE = (process.argv.find((a) => a.startsWith("--mutate=")) || "").split("=")[1] || null;

let seq = 0;
async function load(entry) {
  const r = await esbuild.build({
    entryPoints: [path.join(ROOT, entry)], bundle: true, write: false, format: "esm",
    platform: "node", logLevel: "silent", loader: { ".js": "jsx" }, jsx: "automatic",
  });
  const tmp = path.join(ROOT, `scripts/_cov${seq++}.tmp.mjs`);
  fs.writeFileSync(tmp, r.outputFiles[0].text);
  try { return await import("file://" + tmp); } finally { fs.unlinkSync(tmp); }
}

const idx = await load("data/tracks/index.js");
const ge = await load("lib/gameEngine.js");
const l10n = await load("data/tracks/l10n/index.js");

// Verbatim copy of resolveExplainText from app/play/[trackId]/page.js.
function resolveExplainText(map, sourceLang, sourceRegion = "latam") {
  if (!map) return null;
  let val = map[sourceLang];
  if (val && typeof val === "object") val = val[sourceRegion] ?? val.latam ?? val.spain;
  if (val == null) return map.en != null ? { text: map.en, lang: "en" } : null;
  return { text: val, lang: sourceLang };
}

// Which sources are actually shipped. Read off the module rather than restated here, so
// this can never drift from the offering it is gating.
const RELEASED = idx.listNativeLanguages()
  .map((l) => l.code)
  .filter((code) => idx.tracksForNativeLang(code, "US").some((t) => !t.sourceSpecific) || code === "en");

const ALL = Array.from(new Set([...RELEASED, "it", "de", "ru", "ja", "ko", "zh"]));

const rows = [];
for (const lang of ALL) {
  const tracks = idx.tracksForNativeLang(lang, "US");
  if (!tracks.length) continue;
  const c = { explain: [0, 0], wrongNote: [0, 0], distractorNotes: [0, 0] };
  for (const t of tracks) {
    let map = await l10n.loadL10n(t.id, lang);
    if (MUTATE === "drop-explain" && map) {
      const m2 = {};
      for (const [k, v] of Object.entries(map)) { const { explain, ...rest } = v; m2[k] = rest; }
      map = m2;
    }
    for (const q of ge.flattenBank(t.bank, t.tagFor, lang, map)) {
      for (const field of ["explain", "wrongNote"]) {
        if (!q[field]) continue;
        c[field][1]++;
        if (resolveExplainText(q[field], lang)?.lang === lang) c[field][0]++;
      }
      if (!q.distractorNotes) continue;
      for (const m of Object.values(q.distractorNotes)) {
        c.distractorNotes[1]++;
        if (resolveExplainText(m, lang)?.lang === lang) c.distractorNotes[0]++;
      }
    }
  }
  rows.push({ lang, tracks: tracks.length, ...c, released: RELEASED.includes(lang) });
}

const pct = (a) => (a[1] ? (100 * a[0]) / a[1] : 0);
const cell = (a) => `${a[0].toLocaleString()} / ${a[1].toLocaleString()} — ${pct(a).toFixed(0)}%`;

if (MD) {
  console.log("| native | tracks | explanations | wrong notes | distractor notes |");
  console.log("|---|---|---|---|---|");
  for (const r of rows) {
    console.log(`| ${r.lang}${r.released ? "" : " *(unreleased)*"} | ${r.tracks} | ${cell(r.explain)} | ${cell(r.wrongNote)} | ${cell(r.distractorNotes)} |`);
  }
  console.log("");
}

let bad = 0;
for (const r of rows) {
  const short = ["explain", "wrongNote", "distractorNotes"].filter((f) => pct(r[f]) < 100);
  const gate = r.released && short.length;
  if (gate) bad++;
  if (!MD) {
    console.log(
      `${gate ? "FAIL" : short.length ? "note" : "PASS"}  ${r.lang.padEnd(3)}` +
      ` tracks=${String(r.tracks).padStart(2)}  explain ${cell(r.explain).padEnd(24)}` +
      ` wrongNote ${cell(r.wrongNote).padEnd(22)} distractorNotes ${cell(r.distractorNotes)}` +
      (r.released ? "" : "   [unreleased — not gated]"),
    );
  }
  if (gate) console.log(`      -> ${r.lang} is a RELEASED source but below 100% on: ${short.join(", ")}`);
}
console.log(MUTATE ? `\n[mutation ${MUTATE}] ${bad} released source(s) below bar` : `\n${bad} blocker(s)`);
process.exit(bad ? 1 : 0);

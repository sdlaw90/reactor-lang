// v3.4 ONE-OFF — §4b target-parity audit for the Italian source, run against a SIMULATED
// registry rather than the shipped one.
//
// The offering flip has not happened yet: `it` is not in RELEASED_SOURCE_LANGS and the two
// English-target tracks are not registered. Registering them is what makes Italian's full
// offering live, and that needs sign-off (docs/_it-offering-flip.md). So this harness builds
// what the registry WILL look like, in memory, and asserts against that.
//
// Do not weaken an assertion to make it pass. Every one of these exists because some earlier
// release shipped without it: v3.1.1 shipped Spanish with English-as-a-target still a stub,
// which is what §4b is for.
//
//   node scripts/_it-parity-audit.mjs
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import esbuild from "esbuild";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
let seq = 0;
async function load(entry) {
  const r = await esbuild.build({
    entryPoints: [path.join(ROOT, entry)], bundle: true, write: false, format: "esm",
    platform: "node", logLevel: "silent", loader: { ".js": "jsx" }, jsx: "automatic",
  });
  const tmp = path.join(ROOT, `scripts/_pa${seq++}.tmp.mjs`);
  fs.writeFileSync(tmp, r.outputFiles[0].text);
  try { return await import("file://" + tmp); } finally { fs.unlinkSync(tmp); }
}

const idx = await load("data/tracks/index.js");
const ge = await load("lib/gameEngine.js");
const l10n = await load("data/tracks/l10n/index.js");
const enUsForIt = (await load("data/tracks/enUsForIt.js")).default;
const enGbForIt = (await load("data/tracks/enGbForIt.js")).default;

const results = [];
const check = (name, cond, detail = "") => results.push({ name, pass: !!cond, detail });

// ── the offering, simulated BEFORE the flip and real AFTER it ────────────────
// Written pre-flip, when neither English-target track was registered and `it` was absent
// from RELEASED_SOURCE_LANGS, so it had to build the post-flip registry in memory. Once the
// flip lands, `tracksForNativeLang("it")` answers for real — and concatenating the two
// tracks on top of a registry that already holds them silently produces 15 tracks with two
// duplicates. It did, and this check caught it.
//
// So: detect which side of the flip we are on, and assert against the real thing whenever
// there is a real thing. That keeps the script useful as a permanent regression check
// instead of expiring the moment it passes.
const FLIPPED = idx.listTracks().some((t) => t.id === "en-us-for-it");
const RETIRED = new Set(["en-for-it"]); // the stub the flip removes; a no-op once it is gone
const simulated = FLIPPED
  ? idx.tracksForNativeLang("it", "IT")
  : idx.listTracks()
      .filter((t) => !RETIRED.has(t.id))
      .filter((t) => (t.sourceSpecific ? t.nativeLang === "it" : t.targetLang !== "it"))
      .concat([enUsForIt, enGbForIt]);
console.log(`[${FLIPPED ? "POST-FLIP — real registry" : "PRE-FLIP — simulated registry"}]\n`);

// The stub must be gone from the registry entirely once flipped, not merely unoffered.
if (FLIPPED) {
  check("the enForIt stub is deregistered", !idx.listTracks().some((t) => t.id === "en-for-it"),
    idx.listTracks().some((t) => t.id === "en-for-it") ? "still in TRACKS" : "gone");
  check("it is in RELEASED_SOURCE_LANGS", idx.tracksForNativeLang("it", "IT").length > 1,
    `${idx.tracksForNativeLang("it", "IT").length} tracks`);
  for (const [l, n] of [["en", 13], ["es", 12], ["pt", 12], ["fr", 12]]) {
    const got = idx.tracksForNativeLang(l, "US").length;
    check(`${l} unregressed at ${n} tracks`, got === n, `${got}`);
  }
}

check("13 tracks offered to an Italian native", simulated.length === 13,
  `${simulated.length}: ${simulated.map((t) => t.id).join(" ")}`);
check("no Italian-target track is offered", !simulated.some((t) => t.targetLang === "it"),
  simulated.filter((t) => t.targetLang === "it").map((t) => t.id).join(" ") || "none");
check("the enForIt stub is not among them", !simulated.some((t) => t.id === "en-for-it"));
check("both English variants present",
  simulated.some((t) => t.id === "en-us-for-it") && simulated.some((t) => t.id === "en-gb-for-it"),
  simulated.filter((t) => t.targetLang === "en").map((t) => t.id).join(" "));

// ── depth: no stub reachable from Italian ────────────────────────────────────
// Floors taken from what the French source actually ships, so "full depth" means the same
// thing it meant one release ago rather than a number invented here.
const frTracks = idx.tracksForNativeLang("fr", "US");
const floor = {};
for (const t of frTracks) {
  for (const [cat, arr] of Object.entries(t.bank)) floor[cat] = Math.min(floor[cat] ?? Infinity, arr.length);
}
const thin = [];
for (const t of simulated) {
  const counts = Object.fromEntries(Object.entries(t.bank).map(([c, a]) => [c, a.length]));
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  if (total < 300) thin.push(`${t.id} total=${total} ${JSON.stringify(counts)}`);
}
check("no stub track (every track >= 300 bank items)", thin.length === 0, thin.join(" | "));
check("floors derived from the fr source, not invented", Object.keys(floor).length > 0, JSON.stringify(floor));

// ── the localized surface actually resolves ──────────────────────────────────
let noTable = [], sample = [];
for (const t of simulated) {
  if (t.sourceSpecific) continue; // English targets are authored in Italian directly
  const map = await l10n.loadL10n(t.id, "it");
  if (!map) { noTable.push(t.id); continue; }
  const flat = ge.flattenBank(t.bank, t.tagFor, "it", map);
  const withOpts = flat.filter((q) => q.options && q.options.length);
  const dupes = withOpts.filter((q) => new Set(q.options).size !== q.options.length);
  if (dupes.length) sample.push(`${t.id}: ${dupes.length} items with duplicate options`);
}
check("every reused track has an it side table", noTable.length === 0, noTable.join(" ") || "none");
check("no item has duplicate localized options", sample.length === 0, sample.join(" | ") || "none");

// ── the two English-target tracks are authored in Italian, not left in English ─
for (const [name, tr] of [["en-us-for-it", enUsForIt], ["en-gb-for-it", enGbForIt]]) {
  const flat = ge.flattenBank(tr.bank, tr.tagFor, "it", null);
  const withIt = flat.filter((q) => q.explain && q.explain.it != null).length;
  check(`${name} explanations carry it`, withIt === flat.length, `${withIt}/${flat.length}`);
  const badIdx = flat.filter((q) => q.correctIdx !== 0).length;
  check(`${name} correctIdx is 0 throughout`, badIdx === 0, `${badIdx} bad`);
}

// ── fono is localized in the track files, not the side tables ────────────────
let fonoMissing = [];
for (const t of simulated) {
  if (!t.extraBank || !t.extraBank.length) continue;
  const miss = t.extraBank.filter((p) => {
    const e1 = p.identify && p.identify.explain;
    const e2 = p.respond && p.respond.explain;
    return (e1 && e1.it == null) || (e2 && e2.it == null);
  }).length;
  if (miss) fonoMissing.push(`${t.id}:${miss}`);
}
check("fono explanations carry it on every offered track", fonoMissing.length === 0, fonoMissing.join(" ") || "none");

// ── the surfaces AROUND a track, which the flip nearly shipped broken ────────
// None of these are the track content; all of them are keyed independently of it, which is
// exactly why they get missed. `LangSwitcher` had no `it` and would have rendered a literal
// "it" — the v3.2.0 `pt` bug verbatim. `trackSublabels` had no `it` column. `trackItemCounts`
// still listed the retired stub and neither new track. Assert them, don't remember them.
{
  const TrackIcon = (await load("lib/trackIcons.js")).default;
  const subs = await load("lib/trackSublabels.js");
  const counts = await load("lib/trackItemCounts.js");
  const uiLang = await load("lib/uiLang.js");
  const switcher = fs.readFileSync(path.join(ROOT, "lib/LangSwitcher.js"), "utf8");

  const noIcon = simulated.filter((t) => !TrackIcon({ trackId: t.id }));
  check("every offered track resolves an icon", noIcon.length === 0, noIcon.map((t) => t.id).join(" ") || "none");

  const badSub = simulated.filter((t) => {
    const s = subs.trackSublabel(t, "it", false);
    return !s || (!t.sourceSpecific && !/italiano|italofoni/i.test(s));
  });
  check("every reused track has an it sublabel", badSub.length === 0, badSub.map((t) => t.id).join(" ") || "none");

  const noCount = simulated.filter((t) => !counts.trackTotalItems(t.id));
  check("every offered track has an item count", noCount.length === 0, noCount.map((t) => t.id).join(" ") || "none");
  check("the retired stub is gone from trackItemCounts", counts.trackTotalItems("en-for-it") == null,
    String(counts.trackTotalItems("en-for-it")));

  // Every language the switcher can offer must have a label, or the pill shows a raw code.
  const missingLabel = uiLang.SUPPORTED_UI_LANGS.filter((l) => !new RegExp(`\\b${l}:\\s*"`).test(switcher));
  check("LangSwitcher labels every SUPPORTED_UI_LANG", missingLabel.length === 0, missingLabel.join(" ") || "none");
}

// ── the #60 coverage bar, measured pre-flip on the simulated offering ────────
// verify-l10n-coverage.mjs reads the SHIPPED offering, which still gives Italian one track.
// This is the same measurement over the 13 tracks Italian will actually get, so the §4
// step 2 bar can be met before the flip rather than discovered after it.
function resolveExplainText(map, sourceLang, sourceRegion = "latam") {
  if (!map) return null;
  let val = map[sourceLang];
  if (val && typeof val === "object") val = val[sourceRegion] ?? val.latam ?? val.spain;
  if (val == null) return map.en != null ? { text: map.en, lang: "en" } : null;
  return { text: val, lang: sourceLang };
}
const cov = { explain: [0, 0], wrongNote: [0, 0], distractorNotes: [0, 0] };
for (const t of simulated) {
  const map = t.sourceSpecific ? null : await l10n.loadL10n(t.id, "it");
  for (const q of ge.flattenBank(t.bank, t.tagFor, "it", map)) {
    for (const f of ["explain", "wrongNote"]) {
      if (!q[f]) continue;
      cov[f][1]++;
      if (resolveExplainText(q[f], "it")?.lang === "it") cov[f][0]++;
    }
    if (!q.distractorNotes) continue;
    for (const m of Object.values(q.distractorNotes)) {
      cov.distractorNotes[1]++;
      if (resolveExplainText(m, "it")?.lang === "it") cov.distractorNotes[0]++;
    }
  }
}
for (const f of ["explain", "wrongNote", "distractorNotes"]) {
  const [n, d] = cov[f];
  check(`#60 ${f} at 100% for it`, d > 0 && n === d, `${n.toLocaleString()} / ${d.toLocaleString()} — ${(100 * n / (d || 1)).toFixed(1)}%`);
}
console.log("\n| native | tracks | explanations | wrong notes | distractor notes |");
console.log("|---|---|---|---|---|");
console.log(`| it | ${simulated.length} | ${cov.explain[0].toLocaleString()} / ${cov.explain[1].toLocaleString()} — ${(100 * cov.explain[0] / cov.explain[1]).toFixed(0)}% | ${cov.wrongNote[0].toLocaleString()} / ${cov.wrongNote[1].toLocaleString()} — ${(100 * cov.wrongNote[0] / cov.wrongNote[1]).toFixed(0)}% | ${cov.distractorNotes[0].toLocaleString()} / ${cov.distractorNotes[1].toLocaleString()} — ${(100 * cov.distractorNotes[0] / cov.distractorNotes[1]).toFixed(0)}% |\n`);

let bad = 0;
for (const c of results) { if (!c.pass) bad++; console.log(`${c.pass ? "PASS" : "FAIL"}  ${c.name}${c.detail ? "  · " + c.detail : ""}`); }
console.log(`\n${bad} blocker(s)`);
process.exit(bad ? 1 : 0);

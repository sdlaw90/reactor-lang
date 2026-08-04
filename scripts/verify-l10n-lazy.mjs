// v3.4 (#60) — proves the lazy per-source l10n loader returns exactly what the
// old static registry returned, for every (track, source) table on disk, and that
// its null / caching contract holds.
//
// Background: the side tables used to be 32 static imports, which the bundler
// collapsed into one 4.8 MB (877 KB gz) chunk attached to /play, /learn and
// /placement — every source language's tables downloaded on every lesson open.
// They are now `() => import(...)` thunks, one chunk each. The risk that
// introduces is a table that quietly stops being reachable, so this checks all of
// them against the filenames on disk rather than against the registry.
//
// Usage:
//   node scripts/verify-l10n-lazy.mjs
//   node scripts/verify-l10n-lazy.mjs --mutate=drop-a-pair    (1, 6 red)
//   node scripts/verify-l10n-lazy.mjs --mutate=static-import  (9 red)
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import esbuild from "esbuild";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const IDX = path.join(ROOT, "data/tracks/l10n/index.js");
const MUTATE = (process.argv.find((a) => a.startsWith("--mutate=")) || "").split("=")[1] || null;

let seq = 0;
async function load(entry) {
  const r = await esbuild.build({
    entryPoints: [path.join(ROOT, entry)], bundle: true, write: false, format: "esm",
    platform: "node", logLevel: "silent", loader: { ".js": "jsx" }, jsx: "automatic",
  });
  const tmp = path.join(ROOT, `scripts/_l10nz${seq++}.tmp.mjs`);
  fs.writeFileSync(tmp, r.outputFiles[0].text);
  try { return await import("file://" + tmp); } finally { fs.unlinkSync(tmp); }
}

// Expected registry, read from the FILENAMES — deliberately not from index.js, so
// a pair dropped from the registry is caught rather than agreed with.
const EXPECTED = {};
for (const f of fs.readdirSync(path.join(ROOT, "data/tracks/l10n"))) {
  const m = /^(.+)\.(es|pt|fr)\.js$/.exec(f);
  if (m) (EXPECTED[m[1]] ||= {})[m[2]] = f;
}

const CAMEL_OF = {
  "fr-for-en": "frForEn", "fr-ca-for-en": "frCaForEn", "it-for-en": "itForEn",
  "pt-br-for-en": "ptBrForEn", "pt-pt-for-en": "ptPtForEn", "de-for-en": "deForEn",
  "ru-for-en": "ruForEn", "ja-for-en": "jaForEn", "ko-for-en": "koForEn",
  "zh-for-en": "zhForEn", "es-latam-for-en": "esForEn", "es-spain-for-en": "esSpainForEn",
};
const TRACK_IDS = Object.keys(CAMEL_OF);

// The bundler inlines the thunks, so a registry mutation has to be applied to the
// source file and the module rebuilt from it. Restored in the finally, always.
const original = fs.readFileSync(IDX, "utf8");
let mutated = original;
if (MUTATE === "drop-a-pair") mutated = original.replace(/\n\s*fr: \(\) => import\("\.\/deForEn\.fr"\),/, "");
if (MUTATE === "static-import") mutated = 'import deForEn_fr from "./deForEn.fr";\n' + original;
if (MUTATE && mutated === original) { console.log(`BLOCKER: mutation ${MUTATE} was a no-op`); process.exit(1); }

let mod;
try {
  if (mutated !== original) fs.writeFileSync(IDX, mutated);
  mod = await load("data/tracks/l10n/index.js");
} finally {
  if (mutated !== original) fs.writeFileSync(IDX, original);
}

const results = [];
const check = (name, cond, detail = "") => results.push({ name, pass: !!cond, detail });

// 1-2. every table on disk is reachable, and what comes back is identical to
//      importing the file directly (which is what the static index did)
let pairs = 0; const mismatched = [], unreachable = [];
for (const tid of TRACK_IDS) {
  for (const src of ["es", "pt", "fr"]) {
    const file = EXPECTED[CAMEL_OF[tid]]?.[src];
    if (!file) continue;                   // legitimately absent (fr-for-en has no .fr sibling)
    pairs++;
    const got = await mod.loadL10n(tid, src);
    if (!got) { unreachable.push(`${tid}.${src}`); continue; }
    const direct = (await load(`data/tracks/l10n/${file}`)).default;
    if (JSON.stringify(got) !== JSON.stringify(direct)) mismatched.push(`${tid}.${src}`);
  }
}
check(`all ${pairs} (track, source) tables reachable via loadL10n`, pairs > 0 && unreachable.length === 0, unreachable.join(" ") || "none missing");
check("loaded tables identical to a direct import", pairs > 0 && mismatched.length === 0, mismatched.join(" ") || "none differ");

// 3-4. unregistered and null inputs resolve to null rather than throwing
check("unregistered pair → null", (await mod.loadL10n("de-for-en", "de")) === null, "");
check("null trackId → null (no throw)", (await mod.loadL10n(null, "fr")) === null, "");

// 5-6. getL10n is a CACHE READ: null before load, the map after. That is the
//      contract the three pages rely on — each awaits loadL10n before building.
mod.__resetL10nCache();
const before = mod.getL10n("de-for-en", "fr");
const loadedMap = await mod.loadL10n("de-for-en", "fr");
const after = mod.getL10n("de-for-en", "fr");
check("getL10n null before load", before === null, before === null ? "" : "returned a map with no load");
check("getL10n returns the map after load", !!after && after === loadedMap, after ? "same object" : "null");

// 7. memoized: a second load is the same object, not a reparse
check("loadL10n memoized (identical object)", (await mod.loadL10n("de-for-en", "fr")) === loadedMap, "");

// 8. concurrent callers share one in-flight promise
mod.__resetL10nCache();
const [a, b] = await Promise.all([mod.loadL10n("ja-for-en", "pt"), mod.loadL10n("ja-for-en", "pt")]);
check("concurrent loads share one result", !!a && a === b, a === b ? "" : "diverged");

// 9. no static side-table import survives — one would pull that table back into
//    the shared chunk and quietly undo the split
check("no static side-table import in index.js", !/^\s*import\s+\w+\s+from\s+"\.\/\w+\.(es|pt|fr)";/m.test(mutated), "");

// 10. the registry claims nothing the filesystem does not have
const claimed = [];
for (const tid of TRACK_IDS) for (const src of ["es", "pt", "fr"]) {
  if (mod.hasL10n(tid, src) && !EXPECTED[CAMEL_OF[tid]]?.[src]) claimed.push(`${tid}.${src}`);
}
check("registry claims no table missing on disk", claimed.length === 0, claimed.join(" ") || "none");

let bad = 0;
for (const c of results) { if (!c.pass) bad++; console.log(`${c.pass ? "PASS" : "FAIL"}  ${c.name}${c.detail ? "  · " + c.detail : ""}`); }
console.log(MUTATE ? `\n[mutation ${MUTATE}] ${bad} check(s) red` : `\n${bad} blocker(s)`);
process.exit(bad ? 1 : 0);

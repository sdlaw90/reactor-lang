// #72 sweep — find every object literal that carries an `en` key plus at least one
// released source language, and report which languages it is missing. This is the
// "add one language column" surface for a new source (deployment plan §4a).
import fs from "fs";
import path from "path";
import { parse } from "acorn";
import esbuild from "esbuild";

const ROOT = "/root/rl";
const LANGS = ["es", "pt", "fr", "it"];
const files = [];
function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name === ".next" || e.name === ".git") continue;
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(js|mjs)$/.test(e.name)) files.push(p);
  }
}
for (const d of ["lib", "app", "data/tracks", "e2e"]) walk(path.join(ROOT, d));

const byFile = {};
const unparsed = [];
let total = 0;
for (const f of files) {
  if (f.includes("/data/tracks/l10n/")) continue; // machine-generated side tables
  let src;
  try { src = fs.readFileSync(f, "utf8"); } catch { continue; }
  if (!/\ben\s*:/.test(src)) continue;
  // acorn cannot parse JSX, and this script used to `catch { continue }` on that — which
  // meant EVERY component in app/ and lib/ was silently skipped and the audit reported a
  // clean bill of health for files it had never looked at. Strip the JSX with esbuild
  // first, and make a parse failure LOUD rather than a silent skip: a check that quietly
  // covers less than it claims is worse than no check.
  let ast;
  try {
    let code = src;
    if (/<[A-Za-z/]/.test(src)) {
      code = esbuild.transformSync(src, { loader: "jsx", jsx: "transform", format: "esm" }).code;
    }
    ast = parse(code, { ecmaVersion: "latest", sourceType: "module", locations: true });
  } catch (e) {
    unparsed.push(`${path.relative(ROOT, f)}: ${String(e.message).slice(0, 80)}`);
    continue;
  }
  const hits = [];
  (function visit(n) {
    if (!n || typeof n !== "object") return;
    if (Array.isArray(n)) { for (const c of n) visit(c); return; }
    if (n.type === "ObjectExpression") {
      const keys = n.properties
        .filter((p) => p.type === "Property" && !p.computed)
        .map((p) => (p.key.type === "Identifier" ? p.key.name : p.key.value));
      if (keys.includes("en") && LANGS.some((l) => keys.includes(l))) {
        const missing = LANGS.filter((l) => !keys.includes(l));
        if (missing.length) hits.push({ line: n.loc.start.line, missing, has: keys.filter((k) => k === "en" || LANGS.includes(k)) });
        total++;
      }
    }
    for (const k of Object.keys(n)) { if (k !== "loc" && k !== "start" && k !== "end") visit(n[k]); }
  })(ast);
  if (hits.length) byFile[path.relative(ROOT, f)] = hits;
}
const rows = Object.entries(byFile).sort((a, b) => b[1].length - a[1].length);
console.log(`objects carrying en + a source lang: ${total}`);
for (const [f, hits] of rows) {
  const m = {};
  for (const h of hits) for (const x of h.missing) m[x] = (m[x] || 0) + 1;
  console.log(`${String(hits.length).padStart(5)}  ${f}   missing: ${JSON.stringify(m)}`);
}
const grand = {};
for (const [, hits] of rows) for (const h of hits) for (const x of h.missing) grand[x] = (grand[x] || 0) + 1;
console.log("\nTOTAL missing by language:", JSON.stringify(grand));
if (unparsed.length) {
  console.log(`\n${unparsed.length} FILE(S) COULD NOT BE PARSED — these were NOT audited:`);
  for (const u of unparsed) console.log("  " + u);
  process.exitCode = 1;
} else {
  console.log("\nevery file parsed — nothing skipped");
}

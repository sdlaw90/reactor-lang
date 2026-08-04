#!/usr/bin/env node
// "What does this release still owe?" — the STRUCTURAL checks only, in about a second.
//
// `deploy <tier>-pre-release` runs these too, but behind a full `next build`, so it is a
// three-minute answer to a question you want to ask early and often. This is the same
// library, no build, safe to run anywhere, and it writes nothing.
//
// WHO THIS IS FOR. The art and the announcement copy are authored by Claude, not by Sean —
// so a gate that only fires when Sean runs the release is protecting against the wrong
// person's memory. This command is the one Claude runs *while finishing the release work*,
// so the list of what's still missing arrives before the release is handed over, not during
// it. It is also the fastest way for Sean to see where a release actually stands.
//
//   node scripts/release-preflight.mjs 3.5.0
//   npm run release:preflight 3.5.0
//   npm run release:preflight 3.5.0 -- --against e4e4fec   (compare to a specific ref)
//
// Exit 0 when the release owes nothing structural; 1 otherwise. Never touches the tree.
import { execSync } from "child_process";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const C = require("./release-checks.js");

const args = process.argv.slice(2);
const version = args.find((a) => /^\d+\.\d+\.\d+$/.test(a));
const againstIdx = args.indexOf("--against");
const against = againstIdx >= 0 ? args[againstIdx + 1] : "origin/main";

if (!version) {
  console.error("usage: node scripts/release-preflight.mjs <version> [--against <ref>]");
  process.exit(2);
}

// Best-effort refresh so the comparison ref is current; harmless offline.
try { execSync("git fetch origin --quiet", { stdio: "ignore" }); } catch { /* offline is fine */ }

const shape = C.releaseShape(version, against);
console.log(
  `\nPreflight for v${version} against ${against} — ${shape.bump} bump from ` +
    `v${shape.previousVersion || "?"}` +
    (shape.addedLangs.length ? `, native mode: ${shape.addedLangs.join(", ")}` : "") +
    (shape.addedTargets.length ? `, new courses: ${shape.addedTargets.join(", ")}` : "") +
    `\nannouncement + square ${shape.artRequired ? "REQUIRED" : "not required"}` +
    ` · forest cover re-render ${shape.coverRequired ? "REQUIRED" : "not required"}`,
);

const results = [
  ...C.checkFragments(version),
  ...C.checkVersionEntry(version),
  ...C.checkArt(version, shape, against),
  ...C.checkAnnouncementDoc(version, shape),
];

const failures = C.report(results, "structural preflight");

if (!failures.length) {
  console.log(`\n✓ v${version} owes nothing structural.`);
  console.log("  Next: npm run deploy <tier>-pre-release " + version + "   (adds the full build + archive + receipt)");
  process.exit(0);
}

console.log(`\n${failures.length} thing(s) still owed for v${version}:`);
for (const f of failures) console.log(`  ✗ ${f.name}${f.detail ? " · " + f.detail : ""}`);
console.log("\nBuild these BEFORE handing the release over — `deploy <tier>-pre-release` ends by");
console.log("pushing, so anything authored after it misses the release by construction.");
process.exit(1);

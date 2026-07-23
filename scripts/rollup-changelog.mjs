#!/usr/bin/env node
// #91: release-time changelog rollup.
//
// The per-deploy fragments in docs/changelog/unreleased/*.md each carry a
// "## User-facing" and a "## Internal" section (see docs/changelog/README.md).
// Historically the INTERNAL half was hand-copied into lib/version.js's
// INTERNAL_CHANGELOG at every build, and the user-facing half hand-assembled
// into CHANGELOG at release. This script does that ASSEMBLY mechanically so the
// rollup is "assembly, not authorship":
//
//   node scripts/rollup-changelog.mjs            # print ready-to-paste blocks
//   node scripts/rollup-changelog.mjs --json     # same, machine-readable
//   node scripts/rollup-changelog.mjs --check    # CI: every fragment well-formed?
//   node scripts/rollup-changelog.mjs --archive  # move unreleased/* -> released/<ver>/
//
// By DESIGN it never rewrites the hand-owned prose already in lib/version.js:
// it reads CURRENT_VERSION for labelling and the archive folder name, prints
// the assembled `changes:` (user-facing) and `notes:` (internal) arrays for the
// ledger owner to paste, and (with --archive) files the fragments under
// released/<version>/. Keeping authorship human-owned is deliberate — the
// fragments are written in final voice at dev time; this just collates them.

import { readFileSync, readdirSync, existsSync, mkdirSync, renameSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const UNRELEASED = path.join(ROOT, "docs", "changelog", "unreleased");
const RELEASED = path.join(ROOT, "docs", "changelog", "released");
const VERSION_FILE = path.join(ROOT, "lib", "version.js");

const args = process.argv.slice(2);
const has = (f) => args.includes(f);

function currentVersion() {
  const m = readFileSync(VERSION_FILE, "utf8").match(/CURRENT_VERSION\s*=\s*"([^"]+)"/);
  if (!m) throw new Error("Could not read CURRENT_VERSION from lib/version.js");
  return m[1];
}

// Fragment files, sorted by name (date-prefixed → chronological), .gitkeep skipped.
function fragmentFiles() {
  if (!existsSync(UNRELEASED)) return [];
  return readdirSync(UNRELEASED)
    .filter((f) => f.endsWith(".md"))
    .sort();
}

// Parse one fragment into { file, title, userFacing: [str], internal: [str] }.
// A section's body may be bullets (- / *) or a prose paragraph; "None" (any
// case) means an empty section. Bullets are captured one entry each; contiguous
// non-bullet prose lines are joined into a single entry.
function parseFragment(file) {
  const src = readFileSync(path.join(UNRELEASED, file), "utf8");
  const titleMatch = src.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : file.replace(/\.md$/, "");

  const sections = { "user-facing": [], internal: [] };
  let current = null;
  let buffer = []; // accumulates a bullet (with its wrapped continuation lines) or a prose paragraph
  const flush = () => {
    if (current && buffer.length) {
      const joined = buffer.join(" ").replace(/\s+/g, " ").trim();
      if (joined && !/^none\.?$/i.test(joined)) sections[current].push(joined);
    }
    buffer = [];
  };

  for (const rawLine of src.split("\n")) {
    const line = rawLine.trimEnd();
    const h = line.match(/^##\s+(.+)$/);
    if (h) {
      flush();
      const name = h[1].trim().toLowerCase();
      current = name.startsWith("user") ? "user-facing" : name.startsWith("internal") ? "internal" : null;
      continue;
    }
    if (line.startsWith("# ")) continue; // title
    if (current === null) continue;
    const bullet = line.match(/^[-*]\s+(.*)$/);
    if (bullet) {
      flush(); // previous bullet/paragraph ends where the next bullet begins
      buffer.push(bullet[1].trim());
    } else if (line.trim() === "") {
      flush(); // blank line ends the current entry
    } else {
      buffer.push(line.trim()); // continuation of the current bullet, or a prose paragraph
    }
  }
  flush();
  return { file, title, userFacing: sections["user-facing"], internal: sections.internal };
}

function collect() {
  return fragmentFiles().map(parseFragment);
}

// ---- modes ----
if (has("--check")) {
  const frags = collect();
  if (!frags.length) {
    console.log("No unreleased fragments — nothing to check (prod is current).");
    process.exit(0);
  }
  const problems = [];
  for (const f of frags) {
    if (!f.userFacing.length && !f.internal.length) {
      problems.push(`${f.file}: no User-facing AND no Internal content (need at least one, or explicit 'None').`);
    }
    const src = readFileSync(path.join(UNRELEASED, f.file), "utf8");
    if (!/##\s+user-facing/i.test(src)) problems.push(`${f.file}: missing "## User-facing" section.`);
    if (!/##\s+internal/i.test(src)) problems.push(`${f.file}: missing "## Internal" section.`);
  }
  if (problems.length) {
    console.error(`✖ ${problems.length} fragment problem(s):`);
    problems.forEach((p) => console.error("  - " + p));
    process.exit(1);
  }
  console.log(`✓ ${frags.length} fragment(s) well-formed.`);
  process.exit(0);
}

if (has("--archive")) {
  const version = currentVersion();
  const frags = fragmentFiles();
  if (!frags.length) {
    console.log("No unreleased fragments to archive.");
    process.exit(0);
  }
  const dest = path.join(RELEASED, `v${version}`);
  mkdirSync(dest, { recursive: true });
  for (const f of frags) {
    renameSync(path.join(UNRELEASED, f), path.join(dest, f));
    console.log(`moved ${f} → released/v${version}/`);
  }
  console.log(`\n✓ Archived ${frags.length} fragment(s) under released/v${version}/. unreleased/ is now clear.`);
  process.exit(0);
}

// default / --json: assemble and emit
const version = currentVersion();
const frags = collect();
const userFacing = frags.flatMap((f) => f.userFacing);
const internal = frags.flatMap((f) => f.internal.map((n) => `[${f.file.replace(/\.md$/, "")}] ${n}`));

if (has("--json")) {
  console.log(JSON.stringify({ version, userFacing, internal }, null, 2));
  process.exit(0);
}

const esc = (s) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
console.log(`\n# Changelog rollup for v${version}  (${frags.length} fragment(s))\n`);
console.log("── CHANGELOG (user-facing) — paste into the version's changes: [] ──\n");
if (userFacing.length) userFacing.forEach((u) => console.log(`      "${esc(u)}",`));
else console.log('      "Other general bug fixes and code changes.",');
console.log("\n── INTERNAL_CHANGELOG — paste into the version's notes: [] ──\n");
if (internal.length) internal.forEach((n) => console.log(`      "${esc(n)}",`));
else console.log("      (no internal fragment notes)");
console.log(
  "\nNext: paste the blocks into lib/version.js under v" +
    version +
    " (regroup user-facing by feature area), then `node scripts/rollup-changelog.mjs --archive` to file the fragments."
);

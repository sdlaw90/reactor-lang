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
//   node scripts/rollup-changelog.mjs --archive  # move this version's fragments -> released/<ver>/
//   ... any of the above + --version 3.3.0       # target a version other than CURRENT_VERSION
//
// TARGET-VERSION SELECTION (added 2026-07-28 with the small-release convention).
// unreleased/ can now hold fragments for more than one pending version at a
// time: a Z release ships as soon as it's ready while a Y milestone is still
// accumulating beats on the same branch. So every fragment declares the version
// it belongs to, and every mode here operates ONLY on the fragments matching the
// version being cut. Before this, --archive swept the whole folder into
// released/v<CURRENT_VERSION>/ — cutting a patch mid-milestone would have
// silently published half-built work in the release notes and filed those
// fragments under the wrong version, with nothing left in unreleased/ to show
// it happened. Held-back fragments are always printed, never silently dropped.
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

// The version being cut: --version <x.y.z> overrides CURRENT_VERSION.
function targetVersion() {
  const i = args.indexOf("--version");
  if (i !== -1) {
    const v = args[i + 1];
    if (!v || !/^\d+\.\d+\.\d+$/.test(v)) throw new Error(`--version needs an X.Y.Z value, got: ${v ?? "(nothing)"}`);
    return v;
  }
  return currentVersion();
}

// Fragment files, sorted by name (date-prefixed → chronological), .gitkeep skipped.
function fragmentFiles() {
  if (!existsSync(UNRELEASED)) return [];
  return readdirSync(UNRELEASED)
    .filter((f) => f.endsWith(".md"))
    .sort();
}

// The version a fragment declares itself for. Read from the subtitle line near
// the top: "_Folds into the **3.3.0** release entry._" — or an explicit
// "Target: 3.3.0". Tolerant of surrounding prose and bold markers on purpose;
// the fragments are written by hand. Returns null when nothing parses, which
// --check treats as an error (that's what keeps the declaration from rotting).
function declaredVersion(file) {
  const head = readFileSync(path.join(UNRELEASED, file), "utf8").split("\n").slice(0, 12).join("\n");
  const m = head.match(/(?:folds\s+into|target)\b[^\n]*?(\d+\.\d+\.\d+)/i);
  return m ? m[1] : null;
}

// Split the folder into { matching, held } for the version being cut.
function partition(version) {
  const matching = [];
  const held = [];
  for (const f of fragmentFiles()) {
    const v = declaredVersion(f);
    if (v === version) matching.push(f);
    else held.push({ file: f, version: v });
  }
  return { matching, held };
}

// Never let a held-back fragment vanish quietly — the whole point of the
// change is that "unreleased/ still has things in it" stays visible.
function reportHeld(held, version) {
  if (!held.length) return;
  console.log(`\nHeld back — not part of v${version}:`);
  for (const h of held) {
    console.log(`  - ${h.file} → ${h.version ? `v${h.version}` : "NO TARGET VERSION DECLARED (run --check)"}`);
  }
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
      // "None" means an empty section. Match "None", "None.", and the far more
      // common "None — internal only, no app changes": people explain WHY a
      // section is empty, and an exact-match test silently promoted that
      // explanation into a user-facing release-note bullet.
      if (joined && !/^none\b/i.test(joined)) sections[current].push(joined);
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
    // Indented bullets are their own entries, not continuations. Before this,
    // only column-0 bullets matched, so a nested list ("- Changed files:" with
    // sub-bullets under it) collapsed into one unreadable paragraph-long entry.
    // Nesting is flattened to a "· " prefix — the target is a flat JS array of
    // strings in lib/version.js, so depth can't survive anyway, but the reader
    // can still see which lines were subordinate.
    const bullet = line.match(/^(\s*)[-*]\s+(.*)$/);
    if (bullet) {
      flush(); // previous bullet/paragraph ends where the next bullet begins
      buffer.push((bullet[1].length ? "· " : "") + bullet[2].trim());
    } else if (line.trim() === "") {
      flush(); // blank line ends the current entry
    } else {
      buffer.push(line.trim()); // continuation of the current bullet, or a prose paragraph
    }
  }
  flush();
  return { file, title, userFacing: sections["user-facing"], internal: sections.internal };
}

function collect(files) {
  return files.map(parseFragment);
}

// ---- modes ----
// --check validates EVERY fragment in the folder, not just this version's:
// a malformed fragment for a later release should be caught now, while the
// person who wrote it still remembers it.
if (has("--check")) {
  const files = fragmentFiles();
  if (!files.length) {
    console.log("No unreleased fragments — nothing to check (prod is current).");
    process.exit(0);
  }
  const problems = [];
  for (const f of collect(files)) {
    if (!f.userFacing.length && !f.internal.length) {
      problems.push(`${f.file}: no User-facing AND no Internal content (need at least one, or explicit 'None').`);
    }
    const src = readFileSync(path.join(UNRELEASED, f.file), "utf8");
    if (!/##\s+user-facing/i.test(src)) problems.push(`${f.file}: missing "## User-facing" section.`);
    if (!/##\s+internal/i.test(src)) problems.push(`${f.file}: missing "## Internal" section.`);
    if (!declaredVersion(f.file)) {
      problems.push(
        `${f.file}: no target version declared. Add a line near the top naming the release ` +
          `it belongs to, e.g. "_Folds into the **3.3.0** release entry._" — without it the ` +
          `rollup cannot tell which release this fragment is part of.`
      );
    }
  }
  if (problems.length) {
    console.error(`✖ ${problems.length} fragment problem(s):`);
    problems.forEach((p) => console.error("  - " + p));
    process.exit(1);
  }
  const byVersion = {};
  for (const f of files) (byVersion[declaredVersion(f)] ??= []).push(f);
  console.log(`✓ ${files.length} fragment(s) well-formed.`);
  for (const [v, fs] of Object.entries(byVersion).sort()) console.log(`  v${v}: ${fs.length} fragment(s)`);
  process.exit(0);
}

if (has("--archive")) {
  const version = targetVersion();
  const { matching, held } = partition(version);
  if (!matching.length) {
    console.log(`No unreleased fragments target v${version} — nothing to archive.`);
    reportHeld(held, version);
    process.exit(0);
  }
  const dest = path.join(RELEASED, `v${version}`);
  mkdirSync(dest, { recursive: true });
  for (const f of matching) {
    renameSync(path.join(UNRELEASED, f), path.join(dest, f));
    console.log(`moved ${f} → released/v${version}/`);
  }
  console.log(`\n✓ Archived ${matching.length} fragment(s) under released/v${version}/.`);
  reportHeld(held, version);
  if (held.length) console.log(`\nunreleased/ still holds ${held.length} fragment(s) — that is expected, not a leftover.`);
  else console.log("unreleased/ is now clear.");
  process.exit(0);
}

// default / --json: assemble and emit
const version = targetVersion();
const { matching, held } = partition(version);
const frags = collect(matching);
const userFacing = frags.flatMap((f) => f.userFacing);
const internal = frags.flatMap((f) => f.internal.map((n) => `[${f.file.replace(/\.md$/, "")}] ${n}`));

if (has("--json")) {
  console.log(
    JSON.stringify(
      { version, userFacing, internal, held: held.map((h) => ({ file: h.file, version: h.version })) },
      null,
      2
    )
  );
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
reportHeld(held, version);
console.log(
  "\nNext: paste the blocks into lib/version.js under v" +
    version +
    " (regroup user-facing by feature area), then `node scripts/rollup-changelog.mjs --archive` to file the fragments."
);

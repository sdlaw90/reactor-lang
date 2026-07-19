#!/usr/bin/env node
// Run with: npm run deploy
// Stages all changes, commits using the version number from lib/version.js as
// the commit message, then pulls and pushes. Skips the commit step (but still
// pulls/pushes) if there's nothing new to commit.

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function run(cmd) {
  console.log(`$ ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
}

function runQuiet(cmd) {
  return execSync(cmd, { stdio: "pipe" }).toString();
}

const versionFilePath = path.join(__dirname, "..", "lib", "version.js");
const versionFileContents = fs.readFileSync(versionFilePath, "utf8");
const match = versionFileContents.match(/CURRENT_VERSION\s*=\s*"([^"]+)"/);

if (!match) {
  console.error("Could not find CURRENT_VERSION in lib/version.js — aborting.");
  process.exit(1);
}

const version = match[1];
const commitMessage = `v${version}`;

console.log(`\nDeploying as "${commitMessage}"...\n`);

run("git add -A");

// Keep docs/repo-tree.md (the generated file manifest) in sync with what we're
// about to commit. gen-repo-tree reads `git ls-files` (the index), so it must
// run AFTER `git add -A` to see brand-new files; then re-stage the refreshed
// manifest. Non-fatal — a generator hiccup shouldn't block a deploy.
try {
  run("node scripts/gen-repo-tree.mjs");
  run("git add -A");
} catch (e) {
  console.warn("⚠ gen-repo-tree failed — docs/repo-tree.md may be stale for this commit.");
}

let hasStagedChanges = true;
try {
  runQuiet("git diff --cached --quiet");
  hasStagedChanges = false; // command succeeded => no differences
} catch (e) {
  hasStagedChanges = true; // command failed (exit 1) => there ARE differences
}

if (!hasStagedChanges) {
  console.log("No changes to commit — skipping commit, still pulling/pushing.");
} else {
  run(`git commit -m "${commitMessage}"`);
}

run("git pull --rebase");

// Capture what we're about to push (old upstream → this deploy's range) so the
// post-push TTS check can tell which tracks' content changed. Best-effort.
let sinceRef = null;
try {
  sinceRef = runQuiet("git rev-parse @{upstream}").trim();
} catch (e) {
  // no upstream / detached — the TTS step will fall back to scanning all tracks
}

run("git push");

// Post-deploy TTS auto-sync: if a content change added new spoken clips,
// synthesize + upload them to the dev "tts-audio" bucket. NON-BLOCKING by
// design — audio never aborts a code deploy (see scripts/tts-on-deploy.mjs);
// the script itself always exits 0, and this try/catch is a final backstop.
try {
  const ttsScript = path.join(__dirname, "tts-on-deploy.mjs");
  run(`node "${ttsScript}"${sinceRef ? ` --since ${sinceRef}` : ""}`);
} catch (e) {
  console.warn(
    "⚠ TTS post-deploy step could not run — code shipped fine, but audio may be behind. " +
      "Re-run: node scripts/generate-tts.mjs --track <track> --upload"
  );
}

console.log(`\nDone — pushed as "${commitMessage}". Vercel should pick this up automatically.`);

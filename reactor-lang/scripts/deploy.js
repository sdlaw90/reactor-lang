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
run("git push");

console.log(`\nDone — pushed as "${commitMessage}". Vercel should pick this up automatically.`);

#!/usr/bin/env node
// Unified deploy entrypoint.  Run with:
//   npm run deploy dev    — commit & push the dev branch (Vercel Preview + staging migrations)
//   npm run deploy beta   — release dev → main (the beta-prod tier), then back-merge
//   npm run deploy prod   — reserved for the real-production branch (not configured yet)
//
// Guarded by design: anything touching main refuses to run on a dirty tree and
// STOPS with instructions on any conflict it isn't certain is safe to resolve.

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function run(cmd) {
  console.log(`$ ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
}
function cap(cmd) {
  return execSync(cmd, { stdio: "pipe" }).toString().trim();
}
function tryCap(cmd) {
  try { return cap(cmd); } catch { return null; }
}
function die(msg) {
  console.error(`\n✖ ${msg}\n`);
  process.exit(1);
}

const TARGET = (process.argv[2] || "").toLowerCase();
const VALID = ["dev", "beta", "prod"];
if (!VALID.includes(TARGET)) {
  die(
    `Usage: npm run deploy <dev|beta|prod>\n` +
      `  dev   commit & push the dev branch\n` +
      `  beta  release dev → main (beta-prod tier)\n` +
      `  prod  real production (not configured yet)`
  );
}

// Version string, single source of truth.
const versionFile = path.join(__dirname, "..", "lib", "version.js");
const vmatch = fs
  .readFileSync(versionFile, "utf8")
  .match(/CURRENT_VERSION\s*=\s*"([^"]+)"/);
if (!vmatch) die("Could not find CURRENT_VERSION in lib/version.js.");
const version = vmatch[1];

const branch = () => cap("git rev-parse --abbrev-ref HEAD");
const treeClean = () => cap("git status --porcelain") === "";

// ───────────────────────── prod (reserved) ─────────────────────────
if (TARGET === "prod") {
  die(
    "`deploy prod` is reserved for the real-production branch, which isn't set up yet.\n" +
      "Until then, `npm run deploy beta` releases to the beta-prod tier (main)."
  );
}

// ───────────────────────── dev ─────────────────────────
if (TARGET === "dev") {
  const br = branch();
  if (br !== "dev") {
    die(`deploy dev must run on 'dev' — you're on '${br}'.  Run: git checkout dev`);
  }
  console.log(`\nDeploying dev as "v${version}"...\n`);

  run("git add -A");

  // Keep docs/repo-tree.md in sync (reads the index, so AFTER git add), then re-stage.
  try {
    run("node scripts/gen-repo-tree.mjs");
    run("git add -A");
  } catch {
    console.warn("⚠ gen-repo-tree failed — docs/repo-tree.md may be stale for this commit.");
  }

  let staged = true;
  try { cap("git diff --cached --quiet"); staged = false; } catch { staged = true; }
  if (!staged) console.log("No changes to commit — still pulling/pushing.");
  else run(`git commit -m "v${version}"`);

  const sinceRef = tryCap("git rev-parse @{upstream}");
  run("git pull --rebase");
  run("git push");

  // Post-push TTS auto-sync — NON-BLOCKING (the script itself always exits 0).
  try {
    const tts = path.join(__dirname, "tts-on-deploy.mjs");
    run(`node "${tts}"${sinceRef ? ` --since ${sinceRef}` : ""}`);
  } catch {
    console.warn(
      "⚠ TTS post-deploy step could not run — code shipped fine, audio may be behind. " +
        "Re-run: node scripts/generate-tts.mjs --track <track> --upload"
    );
  }

  console.log(`\n✓ dev pushed as "v${version}". Vercel Preview + staging migrations will pick it up.`);
  process.exit(0);
}

// ───────────────────────── beta (release dev → main) ─────────────────────────
if (TARGET === "beta") {
  // --- guards ---
  if (!treeClean()) {
    die("Working tree isn't clean. Commit or stash your changes before releasing.");
  }
  run("git fetch origin");

  // dev must be synced with origin/dev (release ships what's on origin/dev)
  const devLocal = tryCap("git rev-parse dev");
  const devRemote = tryCap("git rev-parse origin/dev");
  if (!devLocal) die("No local 'dev' branch found.");
  if (devRemote && devLocal !== devRemote) {
    die("Local 'dev' and 'origin/dev' differ. Sync dev first (npm run deploy dev), then release.");
  }

  // refuse to re-release a version already on main
  const mainVerFile = tryCap("git show origin/main:lib/version.js");
  const mainVer = mainVerFile && mainVerFile.match(/CURRENT_VERSION\s*=\s*"([^"]+)"/);
  if (mainVer && mainVer[1] === version) {
    die(`v${version} already appears on origin/main — bump CURRENT_VERSION in lib/version.js before releasing.`);
  }

  console.log(`\nReleasing dev → main as "Release v${version}"...\n`);
  run("git checkout main");
  run("git pull --rebase");

  let conflicted = false;
  try {
    run(`git merge dev --no-ff -m "Release v${version}"`);
  } catch {
    conflicted = true;
  }

  if (conflicted) {
    const unmerged = cap("git diff --name-only --diff-filter=U").split("\n").filter(Boolean);
    const KNOWN_SAFE = ".github/workflows/supabase-migrations.yml"; // documented: take dev's copy
    const remaining = [];
    for (const f of unmerged) {
      if (f === KNOWN_SAFE) {
        run(`git checkout --theirs ${KNOWN_SAFE}`);
        run(`git add ${KNOWN_SAFE}`);
      } else {
        remaining.push(f);
      }
    }
    if (remaining.length) {
      // Guarded stop — never auto-resolve anything unexpected on a prod-tier merge.
      die(
        "Merge paused on conflicts I won't auto-resolve (safe mode):\n" +
          remaining.map((f) => "  - " + f).join("\n") +
          "\n\nResolve by hand — keep BOTH sides where they're different topics — then finish:\n" +
          "  git add <files>\n" +
          `  git commit -m "Release v${version}"\n` +
          "  git push origin main\n" +
          "  git checkout dev && git merge main && git push origin dev   # back-merge, don't skip"
      );
    }
    // every conflict was the known-safe file → complete the merge commit
    run(`git commit -m "Release v${version}"`);
  }

  run("git push origin main");

  // Always back-merge so the same conflicts never come back next release.
  console.log("\nBack-merging main → dev so future releases stay clean...\n");
  run("git checkout dev");
  try {
    run("git merge main");
  } catch {
    die(
      "Back-merge into dev hit a conflict (unusual). Resolve it, then:\n" +
        "  git add <files> && git commit && git push origin dev"
    );
  }
  run("git push origin dev");

  console.log(`\n✓ Released v${version} to main (beta-prod). You're back on 'dev'.`);
  console.log("→ Watch the Actions tab: migrate-production → sync-tts → smoke-check → publish-ready.");
  console.log("  publish-ready going GREEN is the real success gate — a green Vercel deploy alone is NOT enough.");
  process.exit(0);
}

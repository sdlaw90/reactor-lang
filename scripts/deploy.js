#!/usr/bin/env node
// Unified deploy entrypoint.  Run with:
//   npm run deploy dev                 — commit & push dev (Vercel Preview + staging migrations)
//   npm run deploy beta-pre-release    — prepare the release, then push dev
//   npm run deploy beta                — release dev → main (the beta-prod tier), then back-merge
//   npm run deploy live-pre-release    — reserved, same shape (not configured yet)
//   npm run deploy live                — reserved for the real-production branch
//
// Guarded by design: anything touching a live branch refuses to run on a dirty tree and
// STOPS with instructions on any conflict it isn't certain is safe to resolve.
//
// ── WHY THERE IS A PRE-RELEASE STAGE (added after v3.4.0) ────────────────────────────
// v3.4.0 shipped with its announcement art stranded on dev. The square and the regenerated
// forest cover were written AFTER the last `deploy dev`; `deploy beta` refuses a dirty tree,
// so its guard passed before those files existed and they never reached main. Nothing
// failed — the release was green and the art was simply absent.
//
// The lesson is not "remember to archive and build the art." It is that the release has to
// REFUSE when the prep didn't happen, because a step you can forget is a step you will.
// So `<tier>-pre-release`:
//   1. asserts everything a release owes (fragments, changelog entry + its language columns,
//      announcement art, full verification suite),
//   2. does the mechanical parts (version bump, changelog archive, receipt),
//   3. ENDS BY PUSHING DEV — so the release commit is the last thing written, by
//      construction, and nothing can be authored into the gap afterwards.
// and `<tier>` then demands a matching receipt and green CI for that exact SHA.
//
// Adding the third branch is a TIERS entry, not another copy of this logic.

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

// One entry per release tier. `live` is scaffolded but deliberately not configured — the
// branch doesn't exist yet, and inventing it here would let a typo release somewhere real.
const TIERS = {
  beta: {
    source: "dev",
    target: "main",
    label: "beta-prod",
    knownSafeConflicts: [".github/workflows/supabase-migrations.yml"], // documented: take source's copy
    watch:
      "→ Watch the Actions tab: migrate-production → sync-tts → smoke-check → publish-ready.\n" +
      "  publish-ready going GREEN is the real success gate — a green Vercel deploy alone is NOT enough.",
  },
  live: null,
};

const RAW = (process.argv[2] || "").toLowerCase();
const FLAGS = process.argv.slice(3).filter((a) => a.startsWith("--"));
const ARGS = process.argv.slice(3).filter((a) => !a.startsWith("--"));
const DRY_RUN = FLAGS.includes("--dry-run");

const PRE_SUFFIX = "-pre-release";
const IS_PRE = RAW.endsWith(PRE_SUFFIX);
const TIER_NAME = IS_PRE ? RAW.slice(0, -PRE_SUFFIX.length) : RAW;
const TARGET = RAW;

const usage =
  `Usage: npm run deploy <stage> [version] [--dry-run]\n` +
  `  dev                  commit & push the dev branch\n` +
  `  beta-pre-release     prepare the release (checks + archive + receipt), then push dev\n` +
  `  beta                 release dev → main (beta-prod tier)\n` +
  `  live-pre-release     reserved (not configured yet)\n` +
  `  live                 real production (not configured yet)`;

if (RAW !== "dev" && !(TIER_NAME in TIERS)) die(usage);
if (RAW !== "dev" && TIERS[TIER_NAME] === null) {
  die(
    `\`deploy ${RAW}\` is reserved for the real-production branch, which isn't set up yet.\n` +
      "Until then, `npm run deploy beta` releases to the beta-prod tier (main)."
  );
}
const TIER = TIERS[TIER_NAME];

// Version string, single source of truth.
const versionFile = path.join(__dirname, "..", "lib", "version.js");
const vmatch = fs
  .readFileSync(versionFile, "utf8")
  .match(/CURRENT_VERSION\s*=\s*"([^"]+)"/);
if (!vmatch) die("Could not find CURRENT_VERSION in lib/version.js.");
const version = vmatch[1];

const branch = () => cap("git rev-parse --abbrev-ref HEAD");
const treeClean = () => cap("git status --porcelain") === "";

// ───────────────────────── dev ─────────────────────────
// Extracted into a function so `<tier>-pre-release` can finish with EXACTLY the push the
// everyday dev deploy performs. One code path — the release push can never drift from the
// one that gets exercised daily.
function deployDev(versionLabel) {
  const br = branch();
  if (br !== "dev") {
    die(`deploy dev must run on 'dev' — you're on '${br}'.  Run: git checkout dev`);
  }
  console.log(`\nDeploying dev as "v${versionLabel}"...\n`);

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
  else run(`git commit -m "v${versionLabel}"`);

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

  console.log(`\n✓ dev pushed as "v${versionLabel}". Vercel Preview + staging migrations will pick it up.`);
}

if (TARGET === "dev") {
  deployDev(version);
  process.exit(0);
}


// ─────────────────── <tier>-pre-release (prepare, then push dev) ───────────────────
if (IS_PRE) {
  const C = require("./release-checks");
  const liveRef = `origin/${TIER.target}`;

  if (branch() !== TIER.source) {
    die(`deploy ${TARGET} must run on '${TIER.source}' — you're on '${branch()}'.`);
  }
  run("git fetch origin");

  // The version is an ARGUMENT, not a guess. Whether this is a Y or a Z is a judgement
  // call about what the release contains, and no script should be making it.
  const liveVerSrc = tryCap(`git show ${liveRef}:lib/version.js`);
  const liveVerM = liveVerSrc && liveVerSrc.match(/CURRENT_VERSION\s*=\s*"([^"]+)"/);
  const liveVersion = liveVerM ? liveVerM[1] : null;
  const wanted = ARGS[0] || version;

  if (!/^\d+\.\d+\.\d+$/.test(wanted)) {
    die(`"${wanted}" isn't a version. Usage: npm run deploy ${TARGET} <version>  (e.g. 3.5.0)`);
  }
  if (liveVersion && C.cmpVer(wanted, liveVersion) <= 0) {
    die(`v${wanted} is not ahead of v${liveVersion} already on ${TIER.target}. Pick a higher version.`);
  }

  // Bump lib/version.js if the argument moves it. Idempotent — re-running is safe.
  if (wanted !== version) {
    const vf = path.join(__dirname, "..", "lib", "version.js");
    const before = fs.readFileSync(vf, "utf8");
    const after = before.replace(/(CURRENT_VERSION\s*=\s*)"[^"]+"/, `$1"${wanted}"`);
    if (before === after) die("Could not rewrite CURRENT_VERSION in lib/version.js.");
    if (DRY_RUN) console.log(`[dry-run] would bump CURRENT_VERSION ${version} → ${wanted}`);
    else { fs.writeFileSync(vf, after); console.log(`Bumped CURRENT_VERSION ${version} → ${wanted}`); }
  }

  const shape = C.releaseShape(wanted, liveRef);
  console.log(
    `\nPreparing v${wanted} for ${TIER.target} (${TIER.label}) — ${shape.bump} bump from ` +
      `v${shape.previousVersion || "?"}` +
      (shape.addedLangs.length ? `, adds source language(s): ${shape.addedLangs.join(", ")}` : "") +
      (DRY_RUN ? "   [DRY RUN — nothing will be written or pushed]" : "")
  );

  // ── structural checks ──
  let results = [];
  results = results.concat(C.checkFragments(wanted));
  results = results.concat(C.checkVersionEntry(wanted));
  results = results.concat(C.checkArt(wanted, shape, liveRef));
  results = results.concat(C.checkAnnouncementDoc(wanted, shape));
  let failures = C.report(results, "structural");

  // ── verification suite ──
  console.log("\nRunning the verification suite (this takes a few minutes)...");
  const heavy = C.heavyChecks();
  failures = failures.concat(C.report(heavy, "verification"));
  results = results.concat(heavy);

  if (failures.length) {
    die(
      `${failures.length} check(s) failed — NOT preparing the release:\n` +
        failures.map((f) => `  ✗ ${f.name}${f.detail ? " · " + f.detail : ""}`).join("\n") +
        "\n\nFix these and re-run. Nothing has been archived, committed or pushed."
    );
  }

  // ── mechanical work ──
  if (DRY_RUN) {
    console.log("\n[dry-run] would archive the changelog fragments, write the receipt, and push dev.");
    console.log(`[dry-run] all ${results.length} checks passed.`);
    process.exit(0);
  }

  run(`node scripts/rollup-changelog.mjs --archive --version ${wanted}`);
  const postArchive = [C.checkArchived(wanted)];
  if (C.report(postArchive, "post-archive").length) {
    die("The archive step did not clear unreleased/ — stopping before the push.");
  }
  results = results.concat(postArchive);

  const rel = C.writeReceipt(wanted, shape, results);
  console.log(`\nReceipt written: ${rel}`);

  // ── and push, so nothing can be authored into the gap afterwards ──
  deployDev(wanted);

  console.log(`\n✓ v${wanted} is prepared and pushed to ${TIER.source}.`);
  console.log("\nREMAINING MANUAL STEPS — these cannot be automated:");
  if (shape.artRequired) {
    console.log(`  • Post the announcement (claude/squirrelingo_v${wanted}_announcement.md) —`);
    console.log("    English broadly, the new language into that language's groups.");
    console.log("  • Set the Facebook page cover to docs/marketing/covers/forest-cover-1640x856.png.");
  }
  console.log(`  • Wait for CI to go green on ${TIER.source}, then: npm run deploy ${TIER_NAME}`);
  console.log(`    (that stage checks CI itself and will refuse while it is red or running.)`);
  process.exit(0);
}

// ─────────────────── <tier> (release source → target) ───────────────────
if (TIER) {
  const C = require("./release-checks");
  const SRC = TIER.source, TGT = TIER.target;

  // --- guards ---
  if (!treeClean()) {
    die("Working tree isn't clean. Commit or stash your changes before releasing.");
  }
  run("git fetch origin");

  // the source branch must be synced with its remote (the release ships what's pushed)
  const srcLocal = tryCap(`git rev-parse ${SRC}`);
  const srcRemote = tryCap(`git rev-parse origin/${SRC}`);
  if (!srcLocal) die(`No local '${SRC}' branch found.`);
  if (srcRemote && srcLocal !== srcRemote) {
    die(`Local '${SRC}' and 'origin/${SRC}' differ. Sync it first (npm run deploy dev), then release.`);
  }

  // refuse to re-release a version already on the target
  const tgtVerFile = tryCap(`git show origin/${TGT}:lib/version.js`);
  const tgtVer = tgtVerFile && tgtVerFile.match(/CURRENT_VERSION\s*=\s*"([^"]+)"/);
  if (tgtVer && tgtVer[1] === version) {
    die(`v${version} already appears on origin/${TGT} — bump CURRENT_VERSION before releasing.`);
  }

  // --- the receipt: proof that pre-release ran FOR THIS VERSION ---
  // Without this, `<tier>-pre-release` would just be a longer runbook — something you can
  // skip silently. v3.4.0's art was lost to exactly that kind of silent skip.
  const receipt = C.readReceipt(version);
  if (!receipt) {
    die(
      `No release receipt for v${version} (${C.receiptPath(version)}).\n\n` +
        `Run the prep first:  npm run deploy ${TIER_NAME}-pre-release ${version}\n` +
        "It runs the checks, archives the changelog, writes the receipt and pushes " +
        `${SRC} — then this command will proceed.`
    );
  }
  if (receipt.version !== version) {
    die(`The receipt is for v${receipt.version} but CURRENT_VERSION is v${version}. Re-run the pre-release.`);
  }
  console.log(`✓ receipt found — v${receipt.version} prepared ${receipt.preparedAt}` +
    (receipt.addedSourceLangs && receipt.addedSourceLangs.length
      ? ` (adds ${receipt.addedSourceLangs.join(", ")})` : ""));

  // --- re-run the CHEAP structural checks, in case anything landed after the prep ---
  const drift = C.report(
    C.checkFragments(version).concat(C.checkArchived(version), C.checkVersionEntry(version)),
    "structural re-check",
  );
  if (drift.length) {
    die(
      `${drift.length} check(s) failed on the tree about to be released:\n` +
        drift.map((f) => `  ✗ ${f.name}${f.detail ? " · " + f.detail : ""}`).join("\n") +
        `\n\nSomething landed on ${SRC} after the pre-release. Re-run:  npm run deploy ${TIER_NAME}-pre-release ${version}`
    );
  }

  // --- CI must be green for the EXACT commit being merged ---
  // "I could not check" is not "it passed": check-ci.mjs exits non-zero for red, still
  // running, AND unreachable-API, and all three stop the release here.
  const headSha = cap(`git rev-parse ${SRC}`);
  try {
    run(`node scripts/check-ci.mjs ${headSha}`);
  } catch {
    die(
      `CI is not green for ${headSha.slice(0, 7)} on ${SRC} — refusing to release.\n` +
        "  Wait for it (node scripts/check-ci.mjs " + headSha.slice(0, 7) + " --wait), or fix what's red."
    );
  }

  console.log(`\nReleasing ${SRC} → ${TGT} as "Release v${version}"...\n`);
  run(`git checkout ${TGT}`);
  run("git pull --rebase");

  let conflicted = false;
  try {
    run(`git merge ${SRC} --no-ff -m "Release v${version}"`);
  } catch {
    conflicted = true;
  }

  if (conflicted) {
    const unmerged = cap("git diff --name-only --diff-filter=U").split("\n").filter(Boolean);
    const KNOWN_SAFE = TIER.knownSafeConflicts || []; // documented: take the source branch's copy
    const remaining = [];
    for (const f of unmerged) {
      if (KNOWN_SAFE.includes(f)) {
        run(`git checkout --theirs ${f}`);
        run(`git add ${f}`);
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
          `  git push origin ${TGT}\n` +
          `  git checkout ${SRC} && git merge ${TGT} && git push origin ${SRC}   # back-merge, don't skip`
      );
    }
    // every conflict was the known-safe file → complete the merge commit
    run(`git commit -m "Release v${version}"`);
  }

  run(`git push origin ${TGT}`);

  // Always back-merge so the same conflicts never come back next release.
  console.log(`\nBack-merging ${TGT} → ${SRC} so future releases stay clean...\n`);
  run(`git checkout ${SRC}`);
  try {
    run(`git merge ${TGT}`);
  } catch {
    die(
      `Back-merge into ${SRC} hit a conflict (unusual). Resolve it, then:\n` +
        `  git add <files> && git commit && git push origin ${SRC}`
    );
  }
  run(`git push origin ${SRC}`);

  console.log(`\n✓ Released v${version} to ${TGT} (${TIER.label}). You're back on '${SRC}'.`);
  if (TIER.watch) console.log(TIER.watch);
  process.exit(0);
}

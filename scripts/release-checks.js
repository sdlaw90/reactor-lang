// Release preflight checks, shared by `deploy <tier>-pre-release` and `deploy <tier>`.
//
// WHY THIS EXISTS. v3.4.0 shipped with its announcement art stranded: the square and the
// regenerated forest cover were written to the tree AFTER the last `deploy dev`, and
// `deploy beta` refuses a dirty tree — so its clean-tree guard passed before the files
// existed and they missed the merge. Nothing failed. The release was green and the art was
// simply absent from `main`.
//
// That is the same shape as everything else v3.4 turned up: a check that keeps returning a
// green answer to a question it is no longer asking. So the fix is NOT "add a script that
// does the archiving" — a script you can forget to run is just a longer runbook. The fix is
// that the release REFUSES when the prep didn't happen.
//
// The division of labour:
//   * `<tier>-pre-release` runs everything here, does the mechanical work, then commits and
//     pushes — so the release commit is the last thing written, by construction.
//   * `<tier>` re-runs the CHEAP structural checks (in case something landed after
//     pre-release), demands a matching receipt, and demands green CI for the exact SHA.
//
// Nothing here decides whether a release is a good idea. It only refuses to let one proceed
// while a step that has been forgotten before is still missing.
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");

const cap = (cmd) => execSync(cmd, { stdio: "pipe", cwd: ROOT }).toString().trim();
const tryCap = (cmd) => { try { return cap(cmd); } catch { return null; } };
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), "utf8");
const exists = (rel) => fs.existsSync(path.join(ROOT, rel));

const receiptPath = (version) => `docs/changelog/released/v${version}/release-receipt.json`;

// ── a check result is { ok, name, detail } — never a thrown string, so a caller can
//    report every failure at once instead of one per run ────────────────────────────
const ok = (name, detail = "") => ({ ok: true, name, detail });
const bad = (name, detail = "") => ({ ok: false, name, detail });

/** The released source languages, from the module rather than restated here. */
function releasedSourceLangs(ref) {
  const src = ref ? tryCap(`git show ${ref}:data/tracks/index.js`) : read("data/tracks/index.js");
  if (!src) return null;
  const m = src.match(/RELEASED_SOURCE_LANGS\s*=\s*new Set\(\[([^\]]*)\]\)/);
  if (!m) return null;
  return m[1].split(",").map((s) => s.trim().replace(/['"]/g, "")).filter(Boolean);
}

/**
 * What this release adds, derived rather than declared.
 *
 * Whether announcement art is owed is a fact about the diff, not about the version string:
 * compare RELEASED_SOURCE_LANGS on the worktree against the tier's live branch. A release
 * that adds a source language owes a square AND a regenerated forest cover. A minor/major
 * bump owes a square regardless (announcement rule: every X.Y gets a post). A pure patch
 * owes neither.
 */
function releaseShape(version, liveRef) {
  const liveLangs = releasedSourceLangs(liveRef) || [];
  const devLangs = releasedSourceLangs(null) || [];
  const addedLangs = devLangs.filter((l) => !liveLangs.includes(l));

  const liveVerSrc = tryCap(`git show ${liveRef}:lib/version.js`);
  const liveVer = liveVerSrc && liveVerSrc.match(/CURRENT_VERSION\s*=\s*"([^"]+)"/);
  const prev = liveVer ? liveVer[1] : null;

  let bump = "unknown";
  if (prev) {
    const [a1, b1] = prev.split(".").map(Number);
    const [a2, b2] = version.split(".").map(Number);
    bump = a2 > a1 ? "major" : b2 > b1 ? "minor" : "patch";
  }
  return { addedLangs, previousVersion: prev, bump, artRequired: addedLangs.length > 0 || bump === "minor" || bump === "major" };
}

// ── structural checks (cheap — safe to re-run at merge time) ──────────────────────

/** Every pending fragment names a version, and none names one this release is leaving behind. */
function checkFragments(version) {
  const dir = "docs/changelog/unreleased";
  if (!exists(dir)) return [ok("changelog fragments", "no unreleased/ folder")];
  const files = fs.readdirSync(path.join(ROOT, dir)).filter((f) => f.endsWith(".md"));
  const out = [];
  const mine = [], unversioned = [], stale = [];
  for (const f of files) {
    const m = read(`${dir}/${f}`).match(/Folds into the \*\*([0-9]+\.[0-9]+\.[0-9]+)\*\* release entry/);
    if (!m) unversioned.push(f);
    else if (m[1] === version) mine.push(f);
    else if (cmpVer(m[1], version) < 0) stale.push(`${f} → v${m[1]}`);
  }
  out.push(unversioned.length
    ? bad("every fragment declares its target version", unversioned.join(", "))
    : ok("every fragment declares its target version"));
  out.push(stale.length
    ? bad("no fragment targets a version older than this release", stale.join(", "))
    : ok("no fragment targets an older version"));
  out.push(ok(`fragments pending for v${version}`, String(mine.length)));
  return out;
}

/** After the archive, nothing for this version may remain in unreleased/. */
function checkArchived(version) {
  const dir = "docs/changelog/unreleased";
  const left = exists(dir)
    ? fs.readdirSync(path.join(ROOT, dir)).filter((f) => f.endsWith(".md")
        && (read(`${dir}/${f}`).match(/Folds into the \*\*([0-9.]+)\*\*/) || [])[1] === version)
    : [];
  return left.length
    ? bad(`unreleased/ is clear of v${version} fragments`, left.join(", "))
    : ok(`unreleased/ is clear of v${version} fragments`);
}

/**
 * lib/version.js carries a CHANGELOG entry for this version, and EVERY user-facing bullet
 * carries EVERY released source language.
 *
 * Parsed with acorn, not regex — v3.4's own #72 sweep missed `lib/trackSublabels.js`
 * because it pattern-matched instead of parsing.
 */
function checkVersionEntry(version) {
  const { parse } = require("acorn");
  let ast;
  try {
    ast = parse(read("lib/version.js"), { ecmaVersion: "latest", sourceType: "module" });
  } catch (e) {
    return [bad("lib/version.js parses", e.message)];
  }
  const arrays = {};
  for (const node of ast.body) {
    if (node.type !== "ExportNamedDeclaration" || !node.declaration) continue;
    for (const d of node.declaration.declarations || []) {
      if (d.id.type === "Identifier" && d.init && d.init.type === "ArrayExpression") arrays[d.id.name] = d.init;
    }
  }
  const out = [];
  const langs = releasedSourceLangs(null) || [];
  const required = Array.from(new Set(["en", ...langs]));

  for (const key of ["CHANGELOG", "INTERNAL_CHANGELOG"]) {
    const arr = arrays[key];
    if (!arr) { out.push(bad(`${key} found in lib/version.js`)); continue; }
    const entry = arr.elements.find((el) =>
      el && el.type === "ObjectExpression" && el.properties.some((p) =>
        p.type === "Property" && (p.key.name || p.key.value) === "version"
        && p.value.type === "Literal" && p.value.value === version));
    if (!entry) {
      // Deliberately an ASSERTION, not a generator. rollup-changelog is explicit that it
      // "never rewrites the hand-owned prose already in lib/version.js", and auto-inserting
      // here would risk clobbering or double-inserting on a re-run. Point at the command
      // that prints the ready-to-paste block instead.
      out.push(bad(`${key} has an entry for v${version}`,
        `paste one from: node scripts/rollup-changelog.mjs --version ${version}`));
      continue;
    }
    out.push(ok(`${key} has an entry for v${version}`));

    if (key !== "CHANGELOG") continue;
    const changes = entry.properties.find((p) => (p.key.name || p.key.value) === "changes");
    if (!changes || changes.value.type !== "ArrayExpression") {
      out.push(bad("the v" + version + " entry has a changes: array"));
      continue;
    }
    const missing = [];
    changes.value.elements.forEach((el, i) => {
      if (!el || el.type !== "ObjectExpression") return;
      const keys = el.properties.filter((p) => p.type === "Property").map((p) => p.key.name || p.key.value);
      const gap = required.filter((l) => !keys.includes(l));
      if (gap.length) missing.push(`bullet ${i + 1} missing ${gap.join("/")}`);
    });
    out.push(missing.length
      ? bad(`every changelog bullet covers ${required.join("/")}`, missing.join("; "))
      : ok(`every changelog bullet covers ${required.join("/")}`, `${changes.value.elements.length} bullets`));
  }
  return out;
}

/**
 * The announcement art exists and, when a source language was added, the forest cover was
 * actually regenerated.
 *
 * The cover check compares against the live branch rather than trusting the file's presence:
 * the cover is committed every release whether or not it changed, so "does it exist" would
 * pass on a stale one. v3.4's cover kept saying Italian wasn't there while Italian shipped.
 */
function checkArt(version, shape, liveRef) {
  if (!shape.artRequired) {
    return [ok("announcement art", `not required for a ${shape.bump} release`)];
  }
  const out = [];
  const png = `docs/marketing/social/v${version}-release-square.png`;
  const html = `docs/marketing/sources/v${version}-release-square.html`;
  out.push(exists(png) ? ok("release square PNG", png) : bad("release square PNG", `missing ${png}`));
  out.push(exists(html) ? ok("release square source", html) : bad("release square source", `missing ${html}`));

  if (!shape.addedLangs.length) {
    out.push(ok("forest cover", "no source language added — cover unchanged is fine"));
    return out;
  }
  const coverSrc = "docs/marketing/sources/forest-cover.html";
  const coverPng = "docs/marketing/covers/forest-cover-1640x856.png";
  const src = exists(coverSrc) ? read(coverSrc) : "";
  for (const lang of shape.addedLangs) {
    const ab = lang.toUpperCase();
    const hit = new RegExp(`\\{ab:"${ab}",acorn:"full"\\}`).test(src.replace(/\s+/g, ""))
      || new RegExp(`ab:\\s*"${ab}"[^}]*acorn:\\s*"full"`).test(src);
    out.push(hit
      ? ok(`forest cover marks ${ab} as native mode`)
      : bad(`forest cover marks ${ab} as native mode`, `${coverSrc} still has ${ab} as stub/learnable`));
  }
  // Did the rendered PNG actually change? `git diff --quiet` exits 0 when identical.
  //
  // This one is SECONDARY, and knowing why matters: it compares against the live branch, so
  // it can pass for an unrelated reason — if the cover changed in an earlier release that the
  // live branch hasn't seen yet, the diff is non-empty even when nobody re-rendered. The
  // acorn assertion above is the load-bearing check; this is a cheap extra that catches
  // "edited the source, forgot to re-render". Don't mistake it for proof of a fresh render.
  const same = tryCap(`git diff --quiet ${liveRef} -- ${coverPng} && echo SAME`) === "SAME";
  out.push(same
    ? bad("forest cover PNG was regenerated", `identical to ${liveRef} — re-render it`)
    : ok("forest cover PNG was regenerated"));
  return out;
}

/** The announcement copy exists somewhere a human will find it. */
function checkAnnouncementDoc(version, shape) {
  if (!shape.artRequired) return [ok("announcement doc", "not required for a patch release")];
  // The pair lives in project knowledge, not the repo, so this can only be a reminder —
  // stated as one rather than silently skipped.
  return [ok("announcement doc", `REMINDER: claude/squirrelingo_v${version}_announcement.md must exist and be posted`)];
}

// ── expensive checks (pre-release only) ───────────────────────────────────────────

function runCommandCheck(name, cmd, opts = {}) {
  try {
    const out = execSync(cmd, { stdio: "pipe", cwd: ROOT }).toString();
    if (opts.mustContain && !out.includes(opts.mustContain)) {
      return bad(name, `expected "${opts.mustContain}" in output`);
    }
    return ok(name);
  } catch (e) {
    const tail = (e.stdout ? e.stdout.toString() : "").split("\n").filter(Boolean).slice(-4).join(" | ");
    return bad(name, tail || e.message.split("\n")[0]);
  }
}

function heavyChecks(env = {}) {
  const e = Object.entries(env).map(([k, v]) => `${k}=${v}`).join(" ");
  const pre = e ? e + " " : "";
  return [
    runCommandCheck("npm run verify:l10n", "npm run verify:l10n"),
    // eslint exits non-zero only on ERRORS; warnings are expected and tracked as #98.
    runCommandCheck("eslint (0 errors)", "npx eslint ."),
    // The audit must say it read everything. Before v3.4 it swallowed JSX parse failures
    // and reported clean for files it never opened — the check that hid four real gaps.
    runCommandCheck("audit-i18n-columns (nothing skipped)", "node scripts/audit-i18n-columns.mjs",
      { mustContain: "every file parsed" }),
    runCommandCheck("next build", `${pre}npx next build`),
  ];
}

// ── receipt ───────────────────────────────────────────────────────────────────────

function writeReceipt(version, shape, results) {
  const rel = receiptPath(version);
  fs.mkdirSync(path.dirname(path.join(ROOT, rel)), { recursive: true });
  const body = {
    version,
    tierSource: tryCap("git rev-parse --abbrev-ref HEAD"),
    preparedFrom: tryCap("git rev-parse HEAD"),
    preparedAt: new Date().toISOString(),
    bump: shape.bump,
    previousVersion: shape.previousVersion,
    addedSourceLangs: shape.addedLangs,
    artRequired: shape.artRequired,
    checks: results.map((r) => ({ name: r.name, ok: r.ok, detail: r.detail || undefined })),
  };
  fs.writeFileSync(path.join(ROOT, rel), JSON.stringify(body, null, 2) + "\n");
  return rel;
}

function readReceipt(version) {
  const rel = receiptPath(version);
  if (!exists(rel)) return null;
  try { return JSON.parse(read(rel)); } catch { return null; }
}

// ── helpers ───────────────────────────────────────────────────────────────────────

function cmpVer(a, b) {
  const pa = a.split(".").map(Number), pb = b.split(".").map(Number);
  for (let i = 0; i < 3; i++) { if ((pa[i] || 0) !== (pb[i] || 0)) return (pa[i] || 0) - (pb[i] || 0); }
  return 0;
}

function report(results, heading) {
  console.log(`\n── ${heading} ${"─".repeat(Math.max(0, 58 - heading.length))}`);
  for (const r of results) {
    console.log(`${r.ok ? "  ✓" : "  ✗"} ${r.name}${r.detail ? "  · " + r.detail : ""}`);
  }
  return results.filter((r) => !r.ok);
}

module.exports = {
  cmpVer, exists, read, receiptPath, releaseShape, releasedSourceLangs,
  checkFragments, checkArchived, checkVersionEntry, checkArt, checkAnnouncementDoc,
  heavyChecks, writeReceipt, readReceipt, report,
};

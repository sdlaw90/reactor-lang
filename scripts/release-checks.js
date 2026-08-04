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
 * The LEARNABLE (target) languages, derived from the shipped track ids rather than a list.
 *
 * A track id is `<target>-for-<source>`, where the target may carry a region — `es-latam-for-en`,
 * `en-gb-for-it`. The forest cover hangs one acorn per BASE language, so the region is dropped:
 * the first hyphen-chunk of the target segment is the language.
 *
 * Derived from the id literals in the track modules, not from `lib/trackItemCounts.js` — that
 * file is generated, and a gate that reads a generated file inherits the generator's staleness.
 * Untracked files count for the worktree side, because a brand-new track is exactly the case
 * this is here to catch.
 */
function learnableLangs(ref) {
  const pathspec = `':(glob)data/tracks/*.js'`;
  const out = ref
    ? tryCap(`git grep -h -o -E 'id: "[a-z0-9-]+-for-[a-z0-9-]+"' ${ref} -- ${pathspec}`)
    : tryCap(`git grep --untracked -h -o -E 'id: "[a-z0-9-]+-for-[a-z0-9-]+"' -- ${pathspec}`);
  if (out == null) return null;
  const langs = new Set();
  for (const line of out.split("\n")) {
    const m = line.match(/id: "([a-z0-9-]+)-for-[a-z0-9-]+"/);
    if (m) langs.add(m[1].split("-")[0]);
  }
  return langs.size ? Array.from(langs).sort() : null;
}

/**
 * What this release adds, derived rather than declared.
 *
 * TWO different additions can oblige the forest cover, and conflating them is the mistake this
 * function used to make:
 *
 *   * a SOURCE language reaching native mode — its acorn turns gold (`acorn:"full"`);
 *   * a TARGET language becoming learnable — a brown acorn appears, and if it is the first
 *     language in its family, that family's sapling graduates to a full tree.
 *
 * The second is far more common than the first and the gate was blind to it, so a release that
 * only added a course could ship against a cover that still showed its family as a sapling.
 *
 * The square and the announcement copy follow a different rule — every X.Y gets a post
 * (`claude/squirrelingo_release_announcement_rule.md`) — so `artRequired` and `coverRequired`
 * are tracked separately rather than as one flag.
 */
function releaseShape(version, liveRef) {
  const liveLangs = releasedSourceLangs(liveRef) || [];
  const devLangs = releasedSourceLangs(null) || [];
  const addedLangs = devLangs.filter((l) => !liveLangs.includes(l));

  const liveTargets = learnableLangs(liveRef) || [];
  const devTargets = learnableLangs(null) || [];
  const addedTargets = devTargets.filter((l) => !liveTargets.includes(l));

  const liveVerSrc = tryCap(`git show ${liveRef}:lib/version.js`);
  const liveVer = liveVerSrc && liveVerSrc.match(/CURRENT_VERSION\s*=\s*"([^"]+)"/);
  const prev = liveVer ? liveVer[1] : null;

  let bump = "unknown";
  if (prev) {
    const [a1, b1] = prev.split(".").map(Number);
    const [a2, b2] = version.split(".").map(Number);
    bump = a2 > a1 ? "major" : b2 > b1 ? "minor" : "patch";
  }
  return {
    addedLangs,
    addedTargets,
    sourceLangs: devLangs,
    targetLangs: devTargets,
    previousVersion: prev,
    bump,
    artRequired: addedLangs.length > 0 || bump === "minor" || bump === "major",
    coverRequired: addedLangs.length > 0 || addedTargets.length > 0,
  };
}

/**
 * Parse the forest cover's `FAMS` table into `[{ fam, built, leafs: [{ ab, state }] }]`.
 *
 * Returns null when it cannot find the table — and every caller treats null as a FAILURE, not
 * as "nothing to check". That is the v3.4 lesson restated: `audit-i18n-columns.mjs` swallowed
 * its parse errors and reported clean for four files it never opened.
 *
 * One `FAMS` entry per line is the file's own convention; the parser asserts it found entries
 * rather than trusting it.
 */
function parseCover(src) {
  const block = src.match(/const\s+FAMS\s*=\s*\[([\s\S]*?)\n\];/);
  if (!block) return null;
  const fams = [];
  for (const line of block[1].split("\n")) {
    const fm = line.match(/\{\s*fam:\s*"([^"]+)"/);
    if (!fm) continue;
    // A multi-crown family (East Asian, Asia-Pacific, …) carries its acorns inside
    // `arms:[{…,leafs:[…]}]`, not in the top-level `leafs:[]`. Scanning the whole
    // entry line catches both — scoping to `leafs:[…]` made ZH/JA/KO invisible.
    const leafs = [];
    for (const lm of line.matchAll(/\{\s*ab:\s*"([A-Z]{2,3})"([^}]*)\}/g)) {
      const st = lm[2].match(/acorn:\s*"([a-z]+)"/);
      leafs.push({ ab: lm[1], state: st ? st[1] : "learnable" });
    }
    fams.push({ fam: fm[1], built: /\bbuilt:\s*1/.test(line), leafs });
  }
  return fams.length ? fams : null;
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
  const out = [];

  // ── the release square: one per X.Y, per the announcement rule ──
  if (!shape.artRequired) {
    out.push(ok("release square", `not required for a ${shape.bump} release`));
  } else {
    const png = `docs/marketing/social/v${version}-release-square.png`;
    const html = `docs/marketing/sources/v${version}-release-square.html`;
    out.push(exists(png) ? ok("release square PNG", png) : bad("release square PNG", `missing ${png}`));
    out.push(exists(html) ? ok("release square source", html) : bad("release square source", `missing ${html}`));
  }

  // ── the forest cover's GEOMETRY: trunks, nameplates, paths, spread ──
  // Separate gate, separate failure mode. The catalogue check below asks whether
  // the cover claims the right languages; this one asks whether you can read it.
  const geom = "docs/marketing/sources/check_collisions.mjs";
  if (exists(geom)) {
    let geomOut = "";
    let geomOk = true;
    try { geomOut = execSync(`node ${geom}`, { cwd: ROOT, encoding: "utf8" }); }
    catch (e) { geomOk = false; geomOut = (e.stdout || "") + (e.stderr || ""); }
    const lines = geomOut.split("\n").filter((l) => l.trim().startsWith("✗")).map((l) => l.trim().slice(1).trim());
    out.push(geomOk
      ? ok("forest cover geometry", (geomOut.match(/^forest cover — (.*)$/m) || [, "clean"])[1])
      : bad("forest cover geometry", lines.slice(0, 6).join("; ") + (lines.length > 6 ? ` (+${lines.length - 6} more)` : "")));
  } else {
    out.push(bad("forest cover geometry", `missing ${geom} — the layout gate is not installed`));
  }

  // ── the forest cover: a picture of the catalogue, so it is checked AGAINST the catalogue ──
  const coverSrc = "docs/marketing/sources/forest-cover.html";
  const coverPng = "docs/marketing/covers/forest-cover-1640x856.png";
  const fams = exists(coverSrc) ? parseCover(read(coverSrc)) : null;
  if (!fams) {
    out.push(bad("forest cover parses", `could not read the FAMS table out of ${coverSrc}`));
    return out;
  }

  // Every acorn on the cover, and the state it claims.
  const onCover = new Map();
  for (const f of fams) for (const l of f.leafs) onCover.set(l.ab.toLowerCase(), { ...l, fam: f.fam, built: f.built });

  const sources = shape.sourceLangs || [];
  const targets = shape.targetLangs || [];
  const wrong = [];

  // Gold means native mode. Brown means learnable. Pale means neither yet.
  for (const lang of sources) {
    const e = onCover.get(lang);
    if (!e) wrong.push(`${lang.toUpperCase()} is a released source but has no acorn`);
    else if (e.state !== "full") wrong.push(`${lang.toUpperCase()} is a released source but its acorn is "${e.state}"`);
  }
  for (const lang of targets) {
    const e = onCover.get(lang);
    if (!e) wrong.push(`${lang.toUpperCase()} is learnable but has no acorn`);
    else if (e.state === "planned") wrong.push(`${lang.toUpperCase()} is learnable but its acorn is still "planned"`);
  }
  // …and the reverse, which is the direction that actually goes stale: an acorn claiming more
  // than the repo ships. A pale acorn on a language that IS learnable is a broken promise the
  // other way round, and it is caught by the loop above.
  for (const [lang, e] of onCover) {
    if (e.state === "full" && !sources.includes(lang)) wrong.push(`${lang.toUpperCase()} is gold but is not a released source language`);
    if (e.state === "learnable" && !targets.includes(lang)) wrong.push(`${lang.toUpperCase()} has a brown acorn but no track ships for it`);
    if (e.state === "planned" && targets.includes(lang)) wrong.push(`${lang.toUpperCase()} is pale but a track ships for it`);
    // A pale acorn on a sapling is the point — it names what is coming to that
    // family. Only a real acorn (brown or gold) demands a grown tree.
    if (!e.built && e.state !== "planned") wrong.push(`${lang.toUpperCase()} hangs on ${e.fam}, which is still a sapling — set built:1`);
  }
  out.push(wrong.length
    ? bad("forest cover matches the catalogue", wrong.join("; "))
    : ok("forest cover matches the catalogue", `${onCover.size} acorns · ${sources.length} gold`));

  if (!shape.coverRequired) {
    out.push(ok("forest cover re-render", "nothing was added this release — an unchanged cover is fine"));
    return out;
  }
  const why = [
    ...shape.addedLangs.map((l) => `${l.toUpperCase()} → native mode`),
    ...(shape.addedTargets || []).map((l) => `${l.toUpperCase()} → learnable`),
  ].join(", ");

  // Did the rendered PNG actually change? `git diff --quiet` exits 0 when identical.
  //
  // This one is SECONDARY, and knowing why matters: it compares against the live branch, so
  // it can pass for an unrelated reason — if the cover changed in an earlier release that the
  // live branch hasn't seen yet, the diff is non-empty even when nobody re-rendered. The
  // catalogue assertion above is the load-bearing check; this is a cheap extra that catches
  // "edited the source, forgot to re-render". Don't mistake it for proof of a fresh render.
  const same = tryCap(`git diff --quiet ${liveRef} -- ${coverPng} && echo SAME`) === "SAME";
  out.push(same
    ? bad("forest cover PNG was regenerated", `${why} — but the PNG is identical to ${liveRef}; run npm run art:render`)
    : ok("forest cover PNG was regenerated", why));
  return out;
}

/**
 * The announcement copy exists IN THE REPO.
 *
 * It used to live only in project knowledge, where this stage cannot see it — so "the post
 * exists" was a printed reminder rather than a check, and a reminder is exactly the kind of
 * thing that goes missing. `docs/marketing/announcements/v<version>.md` is canonical now, and
 * an X.Y release does not proceed without it.
 *
 * What is deliberately NOT checked is whether it has been POSTED. There is no signal in the
 * repo for that, and asserting it would be a check that can never fail — the failure mode
 * this whole file exists to avoid.
 */
function checkAnnouncementDoc(version, shape) {
  if (!shape.artRequired) return [ok("announcement copy", `not required for a ${shape.bump} release`)];
  const rel = `docs/marketing/announcements/v${version}.md`;
  if (!exists(rel)) {
    return [bad("announcement copy", `missing ${rel} — write the EN + new-language pair (rule: claude/squirrelingo_release_announcement_rule.md)`)];
  }
  const body = read(rel);
  const out = [ok("announcement copy", rel)];
  // The pair is the point. One language is a draft, not an announcement.
  const langs = (shape.addedLangs || []);
  out.push(/##\s*English/i.test(body)
    ? ok("announcement has the English post")
    : bad("announcement has the English post", `no "## English" section in ${rel}`));
  out.push(/#SquirreLingo/.test(body)
    ? ok("announcement carries hashtags")
    : bad("announcement carries hashtags", "no #SquirreLingo tag found"));
  if (langs.length) {
    out.push(body.split(/\n/).filter((l) => /^##\s+/.test(l)).length >= 2
      ? ok("announcement has a second-language post", `for ${langs.join(", ")}`)
      : bad("announcement has a second-language post", `${rel} needs the ${langs.join("/")} version too`));
  }
  return out;
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
    addedTargetLangs: shape.addedTargets,
    artRequired: shape.artRequired,
    coverRequired: shape.coverRequired,
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
  cmpVer, exists, read, receiptPath, releaseShape, releasedSourceLangs, learnableLangs, parseCover,
  checkFragments, checkArchived, checkVersionEntry, checkArt, checkAnnouncementDoc,
  heavyChecks, writeReceipt, readReceipt, report,
};

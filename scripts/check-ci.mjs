// Is CI green for an exact commit? Used by `deploy <tier>` as a real gate rather than a
// printed reminder.
//
// The repo is public, so this needs no token and no `gh` install — an unauthenticated
// Actions API call is enough. That matters because the alternative was reading the Actions
// page by eye, and the run-LIST page renders without conclusion icons: during the v3.4
// release it showed a finished duration for a run whose status it never displayed. Filtering
// `is:success` AND `is:failure` worked, but it is not something to do by hand every release.
//
//   node scripts/check-ci.mjs <sha>            → exit 0 if every completed run succeeded
//   node scripts/check-ci.mjs <sha> --wait     → poll while runs are still in progress
//   node scripts/check-ci.mjs --self-test      → exercise the verdict logic offline
//
// Exit codes: 0 green · 1 red or still running · 2 could not determine (network/API).
// A tier deploy treats 2 as a hard stop too — "I could not check" is not "it passed".
import { execSync } from "child_process";

const args = process.argv.slice(2);
const SELF_TEST = args.includes("--self-test");
const WAIT = args.includes("--wait");
const sha = args.find((a) => !a.startsWith("--"));

/**
 * The verdict logic, kept pure so it can be tested without a network.
 * A run that is queued or in-progress is NOT a pass — that is the whole point.
 */
export function verdict(runs) {
  const relevant = runs.filter((r) => r.event !== "workflow_dispatch" || r.status === "completed");
  if (!relevant.length) return { state: "none", detail: "no workflow runs found for this commit" };
  const pending = relevant.filter((r) => r.status !== "completed");
  if (pending.length) {
    return { state: "pending", detail: pending.map((r) => `${r.name} (${r.status})`).join(", ") };
  }
  const failed = relevant.filter((r) => !["success", "skipped", "neutral"].includes(r.conclusion));
  if (failed.length) {
    return { state: "failed", detail: failed.map((r) => `${r.name}: ${r.conclusion}`).join(", ") };
  }
  return { state: "green", detail: relevant.map((r) => r.name).join(", ") };
}

function repoSlug() {
  const url = execSync("git remote get-url origin", { stdio: "pipe" }).toString().trim();
  const m = url.match(/github\.com[:/]+([^/]+)\/([^/.\s]+)/);
  if (!m) throw new Error("could not parse a GitHub owner/repo from: " + url);
  return `${m[1]}/${m[2]}`;
}

async function fetchRuns(slug, headSha) {
  const url = `https://api.github.com/repos/${slug}/actions/runs?head_sha=${headSha}&per_page=100`;
  const res = await fetch(url, {
    headers: { "User-Agent": "squirrelingo-deploy", Accept: "application/vnd.github+json" },
  });
  if (!res.ok) throw new Error(`GitHub API ${res.status} ${res.statusText}`);
  const body = await res.json();
  return (body.workflow_runs || []).map((r) => ({
    name: r.name, status: r.status, conclusion: r.conclusion, event: r.event, url: r.html_url,
  }));
}

if (SELF_TEST) {
  const cases = [
    [[], "none"],
    [[{ name: "E2E", status: "in_progress", conclusion: null }], "pending"],
    [[{ name: "E2E", status: "completed", conclusion: "success" }], "green"],
    [[{ name: "E2E", status: "completed", conclusion: "failure" }], "failed"],
    [[{ name: "E2E", status: "completed", conclusion: "success" },
      { name: "Migrations", status: "completed", conclusion: "cancelled" }], "failed"],
    [[{ name: "E2E", status: "completed", conclusion: "success" },
      { name: "Other", status: "completed", conclusion: "skipped" }], "green"],
    [[{ name: "E2E", status: "completed", conclusion: "success" },
      { name: "Migrations", status: "queued", conclusion: null }], "pending"],
  ];
  let bad = 0;
  for (const [runs, want] of cases) {
    const got = verdict(runs).state;
    if (got !== want) { bad++; console.log(`FAIL want=${want} got=${got}  ${JSON.stringify(runs)}`); }
    else console.log(`ok   ${want.padEnd(8)} ${JSON.stringify(runs).slice(0, 74)}`);
  }
  console.log(bad ? `\n${bad} self-test failure(s)` : "\nself-test: all verdict cases pass");
  process.exit(bad ? 1 : 0);
}

if (!sha) {
  console.error("usage: node scripts/check-ci.mjs <sha> [--wait]   |   --self-test");
  process.exit(2);
}

let slug;
try { slug = repoSlug(); } catch (e) { console.error("✖ " + e.message); process.exit(2); }

const deadline = Date.now() + (WAIT ? 12 * 60 * 1000 : 0);
for (;;) {
  let runs;
  try {
    runs = await fetchRuns(slug, sha);
  } catch (e) {
    console.error(`✖ could not reach the GitHub Actions API — ${e.message}`);
    console.error(`  Check by hand, filtering BOTH is:success and is:failure:`);
    console.error(`  https://github.com/${slug}/actions?query=branch%3Amain`);
    process.exit(2);
  }
  const v = verdict(runs);
  if (v.state === "green") { console.log(`✓ CI green for ${sha.slice(0, 7)} — ${v.detail}`); process.exit(0); }
  if (v.state === "failed") { console.error(`✖ CI FAILED for ${sha.slice(0, 7)} — ${v.detail}`); process.exit(1); }
  if (v.state === "none") {
    console.error(`✖ no workflow runs found for ${sha.slice(0, 7)}. Has it been pushed?`);
    process.exit(1);
  }
  if (Date.now() >= deadline) {
    console.error(`✖ CI still running for ${sha.slice(0, 7)} — ${v.detail}`);
    console.error(WAIT ? "  Timed out waiting." : "  Re-run with --wait to poll.");
    process.exit(1);
  }
  console.log(`… CI still running (${v.detail}) — polling`);
  await new Promise((r) => setTimeout(r, 20000));
}

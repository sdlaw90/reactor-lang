// Sweep orphaned TTS clips from the Supabase "tts-audio" bucket.
//
// Compares the bucket's contents under <track.id>/ against the LOCAL
// tts-output/<track.id>/manifest.json (the authoritative output of the last
// generate-tts.mjs run) and deletes every .mp3 the manifest doesn't claim —
// stale schema leftovers, clips orphaned by removed questions, accidental
// uploads. manifest.json itself is never touched.
//
// Safe by default: reports what it WOULD delete. Nothing is removed without
// the explicit --delete flag.
//
// Usage:
//   node scripts/sweep-tts.mjs --track jaForEn            # report only
//   node scripts/sweep-tts.mjs --track jaForEn --delete   # actually delete
//
// Env (from .env.local or the environment):
//   NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (script-only, never
//   client/Vercel — same rules as generate-tts.mjs).
//
// NOTE: this targets whichever Supabase project the env points at. Check
// you're on dev before --delete (write-target logging lands with the sync
// job; until then, eyeball the URL this script prints).

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// ---------- tiny .env.local loader (same as generate-tts.mjs) ----------
(function loadEnvLocal() {
  const p = path.join(ROOT, ".env.local");
  if (!existsSync(p)) return;
  for (const line of readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!m || line.trim().startsWith("#")) continue;
    const val = m[2].replace(/^["']|["']$/g, "");
    if (!(m[1] in process.env)) process.env[m[1]] = val;
  }
})();

// ---------- CLI ----------
const args = process.argv.slice(2);
const opt = (name, dflt) => {
  const i = args.indexOf(`--${name}`);
  return i !== -1 && args[i + 1] ? args[i + 1] : dflt;
};
const TRACK = opt("track", null);
const DELETE = args.includes("--delete");
const CONFIRM_NONDEV = args.includes("--confirm-nondev");
if (!TRACK) {
  console.error("Usage: node scripts/sweep-tts.mjs --track <trackName> [--delete]");
  process.exit(1);
}

// CLI --track takes the track NAME (matching generate-tts.mjs, e.g. "esForEn"),
// but tts-output dirs are keyed by track.id. For most tracks the id is just the
// kebab-cased name (jaForEn → ja-for-en), so the guess below works. The
// EXCEPTIONS are tracks whose id can't be derived by kebab-casing — map those
// explicitly here.
//
// esForEn's id is "es-latam-for-en" (the "latam" is not in the name), so kebab
// gives the wrong "es-for-en". esSpainForEn, by contrast, IS kebab-clean
// (id "es-spain-for-en") — it needs NO alias and therefore can't collide with
// esForEn here. Keep this map to only genuine exceptions.
const TRACK_ID_ALIASES = {
  esForEn: "es-latam-for-en",
};

// track.id from the manifest, not a track-file load — the manifest is the
// contract here, and it already records the id.
function findManifest(trackName) {
  const tryDir = (name) => {
    const p = path.join(ROOT, "tts-output", name, "manifest.json");
    return existsSync(p) ? p : null;
  };
  // 1. exact folder name (also lets you pass the id directly, e.g. es-latam-for-en)
  // 2. explicit alias for ids the kebab guess can't derive (esForEn → es-latam-for-en)
  // 3. kebab-cased guess (jaForEn → ja-for-en; esSpainForEn → es-spain-for-en)
  return (
    tryDir(trackName) ||
    (TRACK_ID_ALIASES[trackName] && tryDir(TRACK_ID_ALIASES[trackName])) ||
    tryDir(trackName.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()) ||
    null
  );
}
const mp = findManifest(TRACK);
if (!mp) {
  console.error(`No local manifest found for "${TRACK}" under tts-output/.`);
  console.error("Run generate-tts.mjs for this track first — the manifest is the source of truth for what SHOULD be in the bucket.");
  process.exit(1);
}
const manifest = JSON.parse(readFileSync(mp, "utf8"));
const trackId = manifest.trackId;
const expected = new Set(
  Object.entries(manifest.clips).map(([k, c]) => (c && c.f) || `${k}.mp3`)
);
console.log(`Manifest: ${path.relative(ROOT, mp)} (${expected.size} clips, schema: ${manifest.keySchema || "plain"})`);

const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("Needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.");
  process.exit(1);
}
console.log(`Target: ${url}  bucket: tts-audio/${trackId}/`);

// Write-target guard (standing requirement). sweep is destructive, so a delete
// against anything other than the known dev project must be opted into loudly.
// DEV_SUPABASE_URL is the reference for "this is dev"; if it's set and matches
// the target, deletes proceed. Otherwise --confirm-nondev is required. This is
// how the one-time prod cleanup is authorized (see docs/tts-sync-runbook.md).
const DEV_REF = (process.env.DEV_SUPABASE_URL || "").replace(/\/$/, "");
const targetIsDev = DEV_REF && DEV_REF === url;
if (targetIsDev) {
  console.log("Target matches DEV_SUPABASE_URL — dev project confirmed.");
} else if (DELETE) {
  if (!CONFIRM_NONDEV) {
    console.error(
      DEV_REF
        ? `\n✗ Target ${url} does NOT match DEV_SUPABASE_URL (${DEV_REF}).`
        : `\n✗ Cannot confirm this is dev (DEV_SUPABASE_URL not set).`
    );
    console.error("Refusing to --delete against a non-dev / unconfirmed project.");
    console.error("If you really mean to sweep this project (e.g. the one-time prod cleanup), re-run with --confirm-nondev.");
    process.exit(1);
  }
  console.warn(`\n⚠ --confirm-nondev set: deleting against NON-DEV target ${url}. Eyeball this URL.`);
}

const headers = { authorization: `Bearer ${serviceKey}`, apikey: serviceKey, "content-type": "application/json" };

// ---------- list everything under the track prefix (paged) ----------
async function listAll() {
  const names = [];
  for (let offset = 0; ; offset += 1000) {
    const res = await fetch(`${url}/storage/v1/object/list/tts-audio`, {
      method: "POST",
      headers,
      body: JSON.stringify({ prefix: trackId, limit: 1000, offset, sortBy: { column: "name", order: "asc" } }),
    });
    if (!res.ok) {
      console.error(`List failed: ${res.status} ${await res.text().catch(() => "")}`);
      process.exit(1);
    }
    const page = await res.json();
    names.push(...page.map((o) => o.name));
    if (page.length < 1000) break;
  }
  return names;
}

const inBucket = await listAll();
const mp3s = inBucket.filter((n) => n.endsWith(".mp3"));
const orphans = mp3s.filter((n) => !expected.has(n));
const missing = [...expected].filter((f) => !mp3s.includes(f));

console.log(`In bucket: ${mp3s.length} clips (+${inBucket.length - mp3s.length} non-mp3, untouched)`);
console.log(`Orphans (in bucket, not in manifest): ${orphans.length}`);
if (missing.length) console.log(`⚠ Missing (in manifest, NOT in bucket): ${missing.length} — re-run generate-tts.mjs --upload`);
if (!orphans.length) {
  console.log("Nothing to sweep.");
  process.exit(0);
}
orphans.slice(0, 20).forEach((n) => console.log(`  ${n}`));
if (orphans.length > 20) console.log(`  ... and ${orphans.length - 20} more`);

if (!DELETE) {
  console.log("\nReport only. Re-run with --delete to remove these.");
  process.exit(0);
}

// ---------- delete (bulk endpoint, batched) ----------
// NOTE: per-object DELETE with a content-type: application/json header 400s
// (Fastify rejects an empty JSON body). The bulk endpoint wants a JSON body
// anyway and does the whole sweep in a handful of requests.
let done = 0;
const failures = [];
const paths = orphans.map((n) => `${trackId}/${n}`);
for (let i = 0; i < paths.length; i += 100) {
  const batch = paths.slice(i, i + 100);
  const res = await fetch(`${url}/storage/v1/object/tts-audio`, {
    method: "DELETE",
    headers,
    body: JSON.stringify({ prefixes: batch }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    failures.push(`batch ${i}-${i + batch.length}: ${res.status} ${detail.slice(0, 150)}`);
  } else {
    done += batch.length;
    console.log(`  deleted ${done}/${paths.length}`);
  }
}
console.log(`Deleted ${done}/${orphans.length}.`);
if (failures.length) {
  console.error(`✗ ${failures.length} deletions failed (re-run to retry):`);
  failures.slice(0, 10).forEach((f) => console.error(`  ${f}`));
  process.exit(1);
}

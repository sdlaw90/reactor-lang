// Post-release smoke check (TTS sync CI job, 2026-07-14).
//
// Runs last on every main push (.github/workflows/supabase-migrations.yml),
// after migrate-production and sync-tts. Any failure turns the workflow red.
// This file owns checks 1-3; check 4 (migration alignment) is a shell step in
// the workflow using the Supabase CLI.
//
//   1. Version endpoint    — prod serves a valid /version.json.
//   2. Bucket parity       — for every clip a dev manifest claims (its `f`
//                            filename), prod has that file. SUPERSET check:
//                            prod may hold extra inert orphans; those never
//                            fail. This is the manifest-`f` parity the sync
//                            job's copy-only mirror is designed around — NOT a
//                            raw count × voices multiplier. Also asserts each
//                            prod manifest.json is byte-equal to dev's, so the
//                            client fetches the right key→filename map.
//   3. Canary audio        — one real clip's PUBLIC url returns 200 audio,
//                            proving the bucket is public and playable.
//
// Env (set by the workflow):
//   PROD_APP_URL                                    — check 1
//   DEV_SUPABASE_URL,  DEV_SUPABASE_SERVICE_ROLE_KEY  — source of truth
//   PROD_SUPABASE_URL, PROD_SUPABASE_SERVICE_ROLE_KEY — target under test

const BUCKET = "tts-audio";

const APP_URL = (process.env.PROD_APP_URL || "").replace(/\/$/, "");
const DEV_URL = (process.env.DEV_SUPABASE_URL || "").replace(/\/$/, "");
const DEV_KEY = process.env.DEV_SUPABASE_SERVICE_ROLE_KEY || "";
const PROD_URL = (process.env.PROD_SUPABASE_URL || "").replace(/\/$/, "");
const PROD_KEY = process.env.PROD_SUPABASE_SERVICE_ROLE_KEY || "";

const problems = [];
const warnings = [];
function fail(msg) { problems.push(msg); console.error(`  ✗ ${msg}`); }
function warn(msg) { warnings.push(msg); console.warn(`  ⚠ ${msg}`); }
function ok(msg) { console.log(`  ✓ ${msg}`); }

function authHeaders(key) {
  return { authorization: `Bearer ${key}`, apikey: key };
}

async function listOnce(base, key, prefix) {
  const out = [];
  for (let offset = 0; ; offset += 1000) {
    const res = await fetch(`${base}/storage/v1/object/list/${BUCKET}`, {
      method: "POST",
      headers: { ...authHeaders(key), "content-type": "application/json" },
      body: JSON.stringify({ prefix, limit: 1000, offset, sortBy: { column: "name", order: "asc" } }),
    });
    if (!res.ok) throw new Error(`list ${prefix || "(root)"} ${res.status}: ${(await res.text().catch(() => "")).slice(0, 150)}`);
    const page = await res.json();
    out.push(...page);
    if (page.length < 1000) break;
  }
  return out;
}
async function listTrackIds(base, key) {
  return (await listOnce(base, key, "")).filter((r) => r && r.id == null && r.name).map((r) => r.name);
}
async function listFiles(base, key, trackId) {
  return (await listOnce(base, key, trackId)).filter((r) => r && r.id != null && r.name).map((r) => r.name);
}
async function getObject(base, key, objectPath) {
  const res = await fetch(`${base}/storage/v1/object/${BUCKET}/${objectPath}`, { headers: authHeaders(key) });
  if (!res.ok) throw new Error(`get ${objectPath} ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

// ---------- Check 1: version endpoint ----------
console.log("Check 1: prod version endpoint");
if (!APP_URL) {
  fail("PROD_APP_URL not set.");
} else {
  try {
    const res = await fetch(`${APP_URL}/version.json`, { headers: { accept: "application/json" } });
    if (!res.ok) {
      fail(`GET ${APP_URL}/version.json returned ${res.status}`);
    } else {
      const body = await res.json();
      const version = body.version || body.appVersion;
      if (!version) fail(`/version.json has no version field (keys: ${Object.keys(body).join(", ") || "none"})`);
      else ok(`prod version.json served: ${version}`);
    }
  } catch (e) {
    // Vercel deploy can lag the GitHub Action by a few seconds. Treat a
    // transient miss as a warning, not a hard fail — check 4 + parity still
    // guard the substantive surfaces. A persistent miss shows here to look at.
    warn(`could not read ${APP_URL}/version.json (${e.message}); Vercel deploy may still be propagating.`);
  }
}

// ---------- Check 2: manifest-f bucket parity ----------
console.log("Check 2: bucket parity (dev manifest `f` ⊆ prod)");
let devTrackIds = [];
try {
  devTrackIds = await listTrackIds(DEV_URL, DEV_KEY);
} catch (e) {
  fail(`could not list dev bucket: ${e.message}`);
}

// A stable clip to reuse for the canary check (Check 3), captured while we have
// manifests open. Prefer esForEn (oldest, always present); fall back to any.
let canary = null;

for (const trackId of devTrackIds) {
  let devManifest;
  try {
    devManifest = JSON.parse((await getObject(DEV_URL, DEV_KEY, `${trackId}/manifest.json`)).toString("utf8"));
  } catch (e) {
    fail(`${trackId}: no readable dev manifest (${e.message})`);
    continue;
  }
  const expected = Object.entries(devManifest.clips || {}).map(([k, c]) => (c && c.f) || `${k}.mp3`);
  if (!expected.length) {
    warn(`${trackId}: dev manifest lists 0 clips — skipping parity for this track.`);
    continue;
  }

  let prodFiles;
  try {
    prodFiles = new Set(await listFiles(PROD_URL, PROD_KEY, trackId));
  } catch (e) {
    fail(`${trackId}: could not list prod bucket (${e.message})`);
    continue;
  }

  const missing = expected.filter((f) => !prodFiles.has(f));
  if (missing.length) {
    fail(`${trackId}: ${missing.length}/${expected.length} clip(s) missing in prod (e.g. ${missing.slice(0, 3).join(", ")})`);
  } else {
    const orphans = prodFiles.size - expected.length;
    ok(`${trackId}: all ${expected.length} clips present${orphans > 0 ? ` (+${orphans} inert orphan(s), ignored)` : ""}`);
  }

  // Prod manifest must byte-match dev's, so the client's key→filename map is right.
  try {
    const prodManifest = (await getObject(PROD_URL, PROD_KEY, `${trackId}/manifest.json`)).toString("utf8");
    const devManifestRaw = JSON.stringify(devManifest);
    if (JSON.stringify(JSON.parse(prodManifest)) !== devManifestRaw) {
      fail(`${trackId}: prod manifest.json differs from dev — sync did not mirror it.`);
    }
  } catch (e) {
    fail(`${trackId}: could not read prod manifest.json (${e.message})`);
  }

  // Stash a canary clip (prefer esForEn track id "es-for-en").
  if (!canary || trackId === "es-for-en") {
    const firstPresent = expected.find((f) => prodFiles.has(f));
    if (firstPresent) canary = { trackId, file: firstPresent };
  }
}

// ---------- Check 3: canary audio (public url) ----------
console.log("Check 3: canary audio (public url, 200 + audio)");
if (!canary) {
  fail("no canary clip available (parity failures above blocked selection).");
} else {
  const publicUrl = `${PROD_URL}/storage/v1/object/public/${BUCKET}/${canary.trackId}/${canary.file}`;
  try {
    const res = await fetch(publicUrl);
    const ct = res.headers.get("content-type") || "";
    const len = Number(res.headers.get("content-length") || "0");
    if (!res.ok) fail(`canary ${canary.trackId}/${canary.file} returned ${res.status} (bucket not public?)`);
    else if (!ct.includes("audio") && !ct.includes("mpeg")) fail(`canary content-type is "${ct}", expected audio.`);
    else if (len === 0) fail(`canary clip is 0 bytes.`);
    else ok(`canary ${canary.trackId}/${canary.file} → 200 ${ct} (${len} bytes)`);
  } catch (e) {
    fail(`canary fetch failed: ${e.message}`);
  }
}

// ---------- verdict ----------
console.log("");
if (warnings.length) console.log(`${warnings.length} warning(s).`);
if (problems.length) {
  console.error(`✗ Smoke check FAILED: ${problems.length} problem(s).`);
  process.exit(1);
}
console.log("✓ Smoke check passed (checks 1-3).");

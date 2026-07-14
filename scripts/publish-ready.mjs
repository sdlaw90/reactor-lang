// Release-ready marker (update-prompt gating, 2026-07-14).
//
// Written to the PROD "tts-audio" bucket as the LAST step of the release chain
// (.github/workflows/supabase-migrations.yml), reached only if migrations,
// sync-tts, AND smoke-check all passed. It records the version that is now
// fully live across every surface.
//
// Why it exists: Vercel deploys on the git push independently of this chain and
// usually finishes first, so the app starts serving the new /version.json while
// audio is still syncing. The client keys "update available" off version.json,
// so without a second signal it prompts before prod is actually ready and a
// user who reloads lands on code whose clips aren't there yet. The client ANDs
// two signals — app version.json (Vercel) AND this marker (CI) — so the prompt
// only appears once BOTH surfaces agree on the same version. Whichever surface
// is slower gates the prompt; a failed smoke-check never advances the marker,
// so a broken release never prompts.
//
// Lives at the bucket ROOT (release-ready.json), not under a track prefix, so
// sync-tts / smoke-check / sweep-tts (all of which operate per-track-folder)
// never touch it. Short cache so clients pick it up within their poll cadence.
//
// Env (workflow, Production-environment):
//   PROD_SUPABASE_URL, PROD_SUPABASE_SERVICE_ROLE_KEY

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BUCKET = "tts-audio";
const MARKER = "release-ready.json";

const PROD_URL = (process.env.PROD_SUPABASE_URL || "").replace(/\/$/, "");
const PROD_KEY = process.env.PROD_SUPABASE_SERVICE_ROLE_KEY || "";

function die(msg) {
  console.error(`✗ ${msg}`);
  process.exit(1);
}
if (!PROD_URL || !PROD_KEY) die("PROD_SUPABASE_URL and PROD_SUPABASE_SERVICE_ROLE_KEY are required.");

// Read the live version straight from lib/version.js by regex — no import/
// esbuild needed, and public/version.json is build-generated so it may not be
// in the CI checkout. The client compares against this exact string.
function readVersion() {
  const src = readFileSync(path.join(ROOT, "lib", "version.js"), "utf8");
  const m = src.match(/CURRENT_VERSION\s*=\s*["']([^"']+)["']/);
  if (!m) die("Could not find CURRENT_VERSION in lib/version.js.");
  return m[1];
}

const version = readVersion();
const marker = JSON.stringify({ version, publishedAt: new Date().toISOString() });

console.log(`Target (prod): ${PROD_URL}`);
console.log(`Marking release-ready: ${version}`);

const res = await fetch(`${PROD_URL}/storage/v1/object/${BUCKET}/${MARKER}`, {
  method: "POST",
  headers: {
    authorization: `Bearer ${PROD_KEY}`,
    apikey: PROD_KEY,
    "content-type": "application/json",
    "cache-control": "max-age=60", // clients poll ~every minute; keep it fresh
    "x-upsert": "true",
  },
  body: marker,
});
if (!res.ok) {
  const detail = await res.text().catch(() => "");
  die(`marker write ${res.status}: ${detail.slice(0, 200)}`);
}
console.log(`✓ release-ready.json written: ${version}`);

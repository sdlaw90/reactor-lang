// Mirror the dev "tts-audio" bucket into prod (TTS sync CI job, 2026-07-14).
//
// The last surface of the zero-manual-effort release chain: merging dev→main
// must make prod = dev across code (Vercel), DB schema (migrations), AND
// storage/TTS (this script). Runs in .github/workflows/supabase-migrations.yml
// on a main push, AFTER migrate-production (so a new bucket/policy migration
// lands before we touch storage).
//
// COPY-ONLY, by standing decision: this NEVER deletes from prod. Unreferenced
// audio in prod is inert — the client resolves clip URLs through each track
// manifest's per-clip `f` field and never constructs filenames, so an orphan
// clip is simply never requested. That makes the mirror safe to run with no
// prod-side reconciliation, and it means CI is never handed delete rights on
// production. Historical prod orphans (old plain-keyed es/frCa, an accidental
// de upload) are cleared out-of-band by a guarded one-time sweep-tts run, not
// here — see docs/tts-sync-runbook.md.
//
// Immutability lets us skip work: .mp3 filenames are content-addressed
// (voice-keyed {hash}-{voice}.mp3 or plain {hash}.mp3), so a name that already
// exists in prod is byte-identical by construction and is skipped. manifest.json
// is NOT content-addressed and changes every content pass, so it is always
// re-copied.
//
// Env (set by the workflow from Production-environment secrets):
//   DEV_SUPABASE_URL,  DEV_SUPABASE_SERVICE_ROLE_KEY    — source (read)
//   PROD_SUPABASE_URL, PROD_SUPABASE_SERVICE_ROLE_KEY   — target (write)
//
// Plain Storage REST (no supabase-js) — same rationale as generate-tts.mjs:
// keeps the script runnable on any Node with global fetch and avoids the
// realtime/websocket dependency pulled in for storage-only use.

const BUCKET = "tts-audio";

const DEV_URL = (process.env.DEV_SUPABASE_URL || "").replace(/\/$/, "");
const DEV_KEY = process.env.DEV_SUPABASE_SERVICE_ROLE_KEY || "";
const PROD_URL = (process.env.PROD_SUPABASE_URL || "").replace(/\/$/, "");
const PROD_KEY = process.env.PROD_SUPABASE_SERVICE_ROLE_KEY || "";

function die(msg) {
  console.error(`✗ ${msg}`);
  process.exit(1);
}

if (!DEV_URL || !DEV_KEY) die("DEV_SUPABASE_URL and DEV_SUPABASE_SERVICE_ROLE_KEY are required (source).");
if (!PROD_URL || !PROD_KEY) die("PROD_SUPABASE_URL and PROD_SUPABASE_SERVICE_ROLE_KEY are required (target).");

// Write-target logging (standing requirement). A same-project source/target is
// always a misconfiguration — refuse rather than pointlessly self-copy or, worse,
// mirror prod onto itself thinking it's dev.
console.log(`Source (dev, read):   ${DEV_URL}`);
console.log(`Target (prod, write): ${PROD_URL}`);
if (DEV_URL === PROD_URL) die("Source and target are the SAME project. Refusing to run — check the workflow secrets.");

// ---------- helpers ----------
async function withRetry(fn, tries = 4) {
  let wait = 1000;
  for (let attempt = 1; ; attempt++) {
    try {
      return await fn();
    } catch (e) {
      const retryable = e.status === 429 || (e.status >= 500 && e.status < 600);
      if (!retryable || attempt === tries) throw e;
      await new Promise((r) => setTimeout(r, wait));
      wait *= 2;
    }
  }
}

async function pool(items, worker, size = 6) {
  const queue = [...items];
  const errors = [];
  await Promise.all(
    Array.from({ length: size }, async () => {
      while (queue.length) {
        const item = queue.shift();
        try {
          await worker(item);
        } catch (e) {
          errors.push({ item, error: e });
        }
      }
    })
  );
  return errors;
}

function authHeaders(key) {
  return { authorization: `Bearer ${key}`, apikey: key };
}

// List one level under `prefix` (paged). Returns raw entries; folder rows come
// back with a null id, file rows carry metadata. Matches sweep-tts.mjs's list.
async function listOnce(base, key, prefix) {
  const out = [];
  for (let offset = 0; ; offset += 1000) {
    const res = await fetch(`${base}/storage/v1/object/list/${BUCKET}`, {
      method: "POST",
      headers: { ...authHeaders(key), "content-type": "application/json" },
      body: JSON.stringify({ prefix, limit: 1000, offset, sortBy: { column: "name", order: "asc" } }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error(`list ${prefix || "(root)"} ${res.status}: ${detail.slice(0, 200)}`);
    }
    const page = await res.json();
    out.push(...page);
    if (page.length < 1000) break;
  }
  return out;
}

// Top-level "folders" are the track ids (structure is exactly trackId/file).
async function listTrackIds(base, key) {
  const rows = await listOnce(base, key, "");
  return rows.filter((r) => r && r.id == null && r.name).map((r) => r.name);
}

// Bare filenames directly under a track prefix.
async function listFiles(base, key, trackId) {
  const rows = await listOnce(base, key, trackId);
  return rows.filter((r) => r && r.id != null && r.name).map((r) => r.name);
}

async function downloadDev(objectPath) {
  const res = await fetch(`${DEV_URL}/storage/v1/object/${BUCKET}/${objectPath}`, {
    headers: authHeaders(DEV_KEY),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    const err = new Error(`download ${objectPath} ${res.status}: ${detail.slice(0, 150)}`);
    err.status = res.status;
    throw err;
  }
  return Buffer.from(await res.arrayBuffer());
}

async function uploadProd(objectPath, body, contentType, maxAgeSeconds) {
  const res = await fetch(`${PROD_URL}/storage/v1/object/${BUCKET}/${objectPath}`, {
    method: "POST",
    headers: {
      ...authHeaders(PROD_KEY),
      "content-type": contentType,
      "cache-control": `max-age=${maxAgeSeconds}`,
      "x-upsert": "true",
    },
    body,
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    const err = new Error(`upload ${objectPath} ${res.status}: ${detail.slice(0, 150)}`);
    err.status = res.status;
    throw err;
  }
}

function contentTypeFor(name) {
  if (name.endsWith(".mp3")) return "audio/mpeg";
  if (name.endsWith(".json")) return "application/json";
  return "application/octet-stream";
}

// Match generate-tts.mjs: clips immutable (1yr), manifest short (300s).
function maxAgeFor(name) {
  return name.endsWith(".json") ? 300 : 31536000;
}

// ---------- mirror ----------
const trackIds = await listTrackIds(DEV_URL, DEV_KEY);
if (!trackIds.length) {
  console.log("No track folders in dev bucket. Nothing to mirror.");
  process.exit(0);
}
console.log(`Tracks in dev: ${trackIds.join(", ")}`);

let copied = 0;
let skipped = 0;
const allFailures = [];

for (const trackId of trackIds) {
  const [devFiles, prodFiles] = await Promise.all([
    listFiles(DEV_URL, DEV_KEY, trackId),
    listFiles(PROD_URL, PROD_KEY, trackId).catch(() => []),
  ]);
  const prodSet = new Set(prodFiles);

  // Always re-copy manifests; copy .mp3 only when absent in prod (immutable).
  const toCopy = devFiles.filter((name) => {
    if (name.endsWith(".json")) return true;
    const present = prodSet.has(name);
    if (present) skipped++;
    return !present;
  });

  if (!toCopy.length) {
    console.log(`  ${trackId}: up to date (${devFiles.length} files, 0 to copy)`);
    continue;
  }
  console.log(`  ${trackId}: copying ${toCopy.length} of ${devFiles.length} (${skipped} clip(s) already present)`);

  const failures = await pool(toCopy, async (name) => {
    const objectPath = `${trackId}/${name}`;
    const bytes = await withRetry(() => downloadDev(objectPath));
    await withRetry(() => uploadProd(objectPath, bytes, contentTypeFor(name), maxAgeFor(name)));
    copied++;
    if (copied % 100 === 0) console.log(`    copied ${copied} so far...`);
  });
  allFailures.push(...failures);
}

console.log(`Mirror complete: ${copied} copied, ${skipped} skipped (already in prod).`);
if (allFailures.length) {
  console.error(`✗ ${allFailures.length} object(s) failed to mirror:`);
  allFailures.slice(0, 10).forEach((f) => console.error(`  ${f.item}  ${f.error.message}`));
  process.exit(1);
}

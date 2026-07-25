// Mirror the dev "tutorial-video" bucket into prod (release sync, 2026-07-25).
//
// Sibling of scripts/sync-tts.mjs, for tutorial videos. Same standing rule:
// merging dev→main makes prod = dev across code (Vercel), DB (migrations), AND
// storage. Runs in .github/workflows/supabase-migrations.yml on a main push,
// AFTER migrate-production (so the bucket/policy migration lands first).
//
// COPY-ONLY: never deletes from prod. Unlike TTS clips, video object names are
// semantic (en/ch0/co.mp4), not content hashes, so a re-render reuses the same
// path — we therefore ALWAYS re-upload (x-upsert) every object rather than
// skip-if-present, guaranteeing prod matches dev. Volume is tiny (a handful of
// files), so unconditional copy is cheap. Deletes stay out of CI by design: an
// orphaned prod video is inert because the app only ever builds URLs for the
// paths it knows.
//
// Plain Storage REST (no supabase-js) — same rationale as sync-tts.mjs: runs on
// any Node with global fetch, no realtime/websocket dependency.
//
// Env (set by the workflow from Production-environment secrets):
//   DEV_SUPABASE_URL,  DEV_SUPABASE_SERVICE_ROLE_KEY    — source (read)
//   PROD_SUPABASE_URL, PROD_SUPABASE_SERVICE_ROLE_KEY   — target (write)

const BUCKET = "tutorial-video";

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

// Write-target logging + same-project guard (matches sync-tts.mjs).
console.log(`Source (dev, read):   ${DEV_URL}`);
console.log(`Target (prod, write): ${PROD_URL}`);
if (DEV_URL === PROD_URL) die("Source and target are the SAME project. Refusing to run — check the workflow secrets.");

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

async function pool(items, worker, size = 4) {
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

// List one level under `prefix` (paged). Folder rows come back with a null id,
// file rows carry metadata. Same shape as sync-tts.mjs's listOnce.
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

// Recursively collect every object path in the bucket (layout is lang/chapter/
// mode, so more than one folder level).
async function listAllObjects(base, key, prefix = "") {
  const rows = await listOnce(base, key, prefix);
  const files = [];
  for (const r of rows) {
    if (!r || !r.name) continue;
    const path = prefix ? `${prefix}${r.name}` : r.name;
    if (r.id == null) {
      files.push(...(await listAllObjects(base, key, `${path}/`)));
    } else {
      files.push(path);
    }
  }
  return files;
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
  if (name.endsWith(".mp4")) return "video/mp4";
  if (name.endsWith(".webm")) return "video/webm";
  if (name.endsWith(".jpg") || name.endsWith(".jpeg")) return "image/jpeg";
  if (name.endsWith(".png")) return "image/png";
  if (name.endsWith(".vtt")) return "text/vtt";
  if (name.endsWith(".json")) return "application/json";
  return "application/octet-stream";
}

// Poster/caption sidecars can update with a re-render, so keep caches modest.
function maxAgeFor(name) {
  return name.endsWith(".json") ? 300 : 3600;
}

// ---------- mirror ----------
const objects = await listAllObjects(DEV_URL, DEV_KEY);
if (!objects.length) {
  console.log("No objects in dev tutorial-video bucket. Nothing to mirror.");
  process.exit(0);
}
console.log(`Objects in dev: ${objects.length}`);

let copied = 0;
const failures = await pool(objects, async (objectPath) => {
  const bytes = await withRetry(() => downloadDev(objectPath));
  await withRetry(() => uploadProd(objectPath, bytes, contentTypeFor(objectPath), maxAgeFor(objectPath)));
  copied++;
  console.log(`  ✓ ${objectPath}`);
});

console.log(`Mirror complete: ${copied} copied (copy-only; prod never pruned).`);
if (failures.length) {
  console.error(`✗ ${failures.length} object(s) failed to mirror:`);
  failures.slice(0, 10).forEach((f) => console.error(`  ${f.item}  ${f.error.message}`));
  process.exit(1);
}

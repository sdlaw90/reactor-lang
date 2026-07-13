#!/usr/bin/env node
/**
 * sync-tts.mjs — mirror the dev `tts-audio` bucket into prod.
 *
 * Runs in CI on every push to main (after the migrations job, so a new
 * bucket migration lands first). Replaces the manual
 * `generate-tts.mjs --upload`-against-prod release step permanently.
 *
 * Behavior:
 *   - Recursively lists all keys in dev and prod (keys are foldered per
 *     track: <trackId>/<cyrb53-hash>.mp3, plus any per-track manifest
 *     files).
 *   - Copies dev→prod any key that is missing in prod, OR present but
 *     with a different eTag (content hash) — the eTag case exists only
 *     for mutable non-audio files like manifests; audio keys are
 *     content-hash-named (lib/audioKey.js) and therefore immutable.
 *   - NEVER deletes from prod. Unreferenced audio in prod is inert;
 *     storage ahead of code is harmless, code ahead of storage is the
 *     blank-audio bug.
 *   - Idempotent: a re-run with no gaps copies nothing.
 *   - No GCP involvement, zero synthesis cost — pure Supabase→Supabase.
 *
 * Required env vars (CI: Production environment secrets):
 *   DEV_SUPABASE_URL               dev project API URL
 *   DEV_SUPABASE_SERVICE_ROLE_KEY  dev service role key
 *   PROD_SUPABASE_URL              prod project API URL
 *   PROD_SUPABASE_SERVICE_ROLE_KEY prod service role key
 *
 * Exit codes: 0 = mirrored (or nothing to do), 1 = any failure.
 */

import { createClient } from "@supabase/supabase-js";

const BUCKET = "tts-audio";
const CONCURRENCY = 5;

function requireEnv(name) {
  const v = process.env[name];
  if (!v) {
    console.error(`Missing required env var: ${name}`);
    process.exit(1);
  }
  return v;
}

const devClient = createClient(
  requireEnv("DEV_SUPABASE_URL"),
  requireEnv("DEV_SUPABASE_SERVICE_ROLE_KEY"),
  { auth: { persistSession: false } }
);
const prodClient = createClient(
  requireEnv("PROD_SUPABASE_URL"),
  requireEnv("PROD_SUPABASE_SERVICE_ROLE_KEY"),
  { auth: { persistSession: false } }
);

/**
 * Recursively list every object key in the bucket.
 * Supabase's list() is per-prefix and paginated; folder entries come back
 * with id === null and are recursed into.
 * Returns Map<key, { size, etag }>.
 */
async function listAllKeys(client, prefix = "") {
  const out = new Map();
  const PAGE = 1000;
  let offset = 0;
  for (;;) {
    const { data, error } = await client.storage.from(BUCKET).list(prefix, {
      limit: PAGE,
      offset,
      sortBy: { column: "name", order: "asc" },
    });
    if (error) {
      throw new Error(`list("${prefix}") failed: ${error.message}`);
    }
    for (const entry of data) {
      if (entry.name === ".emptyFolderPlaceholder") continue;
      const key = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.id === null) {
        // Folder — recurse.
        const sub = await listAllKeys(client, key);
        for (const [k, v] of sub) out.set(k, v);
      } else {
        out.set(key, {
          size: entry.metadata?.size ?? null,
          etag: entry.metadata?.eTag ?? null,
        });
      }
    }
    if (data.length < PAGE) break;
    offset += PAGE;
  }
  return out;
}

function contentTypeFor(key) {
  if (key.endsWith(".mp3")) return "audio/mpeg";
  if (key.endsWith(".json")) return "application/json";
  return "application/octet-stream";
}

async function copyKey(key) {
  const { data: blob, error: dlErr } = await devClient.storage
    .from(BUCKET)
    .download(key);
  if (dlErr) throw new Error(`download ${key}: ${dlErr.message}`);
  const buf = Buffer.from(await blob.arrayBuffer());
  const { error: upErr } = await prodClient.storage
    .from(BUCKET)
    .upload(key, buf, { contentType: contentTypeFor(key), upsert: true });
  if (upErr) throw new Error(`upload ${key}: ${upErr.message}`);
  return buf.length;
}

async function main() {
  console.log(`Listing dev "${BUCKET}"...`);
  const devKeys = await listAllKeys(devClient);
  console.log(`  dev: ${devKeys.size} objects`);

  console.log(`Listing prod "${BUCKET}"...`);
  const prodKeys = await listAllKeys(prodClient);
  console.log(`  prod: ${prodKeys.size} objects`);

  const toCopy = [];
  for (const [key, meta] of devKeys) {
    const p = prodKeys.get(key);
    if (!p) {
      toCopy.push({ key, reason: "missing" });
    } else if (meta.etag && p.etag && meta.etag !== p.etag) {
      // Content differs — only expected for mutable files (manifests).
      toCopy.push({ key, reason: "changed" });
    }
  }

  if (toCopy.length === 0) {
    console.log("Prod is already a superset of dev. Nothing to copy.");
    return;
  }

  console.log(`Copying ${toCopy.length} object(s) dev→prod:`);
  let copied = 0;
  let bytes = 0;
  const failures = [];
  const queue = [...toCopy];

  async function worker() {
    for (;;) {
      const item = queue.shift();
      if (!item) return;
      try {
        const n = await copyKey(item.key);
        copied += 1;
        bytes += n;
        console.log(`  ✓ ${item.key} (${item.reason}, ${n} bytes)`);
      } catch (err) {
        failures.push({ key: item.key, error: err.message });
        console.error(`  ✗ ${item.key}: ${err.message}`);
      }
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, queue.length) }, worker)
  );

  console.log(
    `Done: ${copied}/${toCopy.length} copied (${bytes} bytes total).`
  );
  if (failures.length > 0) {
    console.error(`${failures.length} object(s) FAILED to copy.`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(`sync-tts fatal: ${err.message}`);
  process.exit(1);
});

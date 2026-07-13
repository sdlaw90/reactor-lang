#!/usr/bin/env node
/**
 * smoke-check.mjs — post-release verification, runs last on main push.
 * Fails the workflow red on any miss. Checks:
 *
 *   1. Prod version endpoint (/version.json) reports the version just
 *      merged (read from lib/version.js in the checked-out repo).
 *      Polls with a timeout, because the Vercel Production deploy runs
 *      in parallel with this workflow and may finish after it starts.
 *   2. Prod `tts-audio` key count >= dev's key count.
 *   3. One canary audio URL (first .mp3 found in prod) returns HTTP 200
 *      via the public storage URL — the same path the app's playback
 *      uses. (Assumes the bucket is public; if it is ever made private,
 *      switch this to a signed URL.)
 *
 * Check 4 (latest applied prod migration == latest migration file in
 * repo) lives in the workflow as a shell step using the Supabase CLI —
 * see .github/workflows/supabase-migrations.yml.
 *
 * Required env vars (CI: Production environment secrets):
 *   PROD_APP_URL                   prod site origin (NEXT_PUBLIC_SITE_URL)
 *   DEV_SUPABASE_URL               dev project API URL
 *   DEV_SUPABASE_SERVICE_ROLE_KEY  dev service role key
 *   PROD_SUPABASE_URL              prod project API URL
 *   PROD_SUPABASE_SERVICE_ROLE_KEY prod service role key
 * Optional:
 *   SMOKE_VERSION_TIMEOUT_SECS     poll window for check 1 (default 600)
 */

import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const BUCKET = "tts-audio";

function requireEnv(name) {
  const v = process.env[name];
  if (!v) {
    console.error(`Missing required env var: ${name}`);
    process.exit(1);
  }
  return v;
}

const PROD_APP_URL = requireEnv("PROD_APP_URL").replace(/\/+$/, "");
const devClient = createClient(
  requireEnv("DEV_SUPABASE_URL"),
  requireEnv("DEV_SUPABASE_SERVICE_ROLE_KEY"),
  { auth: { persistSession: false } }
);
const PROD_SUPABASE_URL = requireEnv("PROD_SUPABASE_URL").replace(/\/+$/, "");
const prodClient = createClient(
  PROD_SUPABASE_URL,
  requireEnv("PROD_SUPABASE_SERVICE_ROLE_KEY"),
  { auth: { persistSession: false } }
);

/** Same recursive lister as sync-tts.mjs (kept local so each script is
 *  self-contained in delta zips). Returns Map<key, meta>. */
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
        const sub = await listAllKeys(client, key);
        for (const [k, v] of sub) out.set(k, v);
      } else {
        out.set(key, { size: entry.metadata?.size ?? null });
      }
    }
    if (data.length < PAGE) break;
    offset += PAGE;
  }
  return out;
}

function repoVersion() {
  const src = readFileSync("lib/version.js", "utf8");
  const m = src.match(/CURRENT_VERSION\s*=\s*["']([^"']+)["']/);
  if (!m) throw new Error("Could not parse CURRENT_VERSION from lib/version.js");
  return m[1];
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Check 1: poll /version.json until it reports the merged version. */
async function checkVersion(expected) {
  const timeoutSecs = Number(process.env.SMOKE_VERSION_TIMEOUT_SECS || 600);
  const intervalMs = 20_000;
  const deadline = Date.now() + timeoutSecs * 1000;
  const url = `${PROD_APP_URL}/version.json`;
  let last = "(no response yet)";

  for (;;) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) {
        const body = await res.text();
        let deployed = null;
        try {
          const json = JSON.parse(body);
          deployed = json.version ?? null;
        } catch {
          /* not JSON — fall through to substring match */
        }
        if (deployed === expected || (!deployed && body.includes(expected))) {
          console.log(`✓ Check 1: prod reports version ${expected}`);
          return;
        }
        last = deployed ?? body.slice(0, 200);
      } else {
        last = `HTTP ${res.status}`;
      }
    } catch (err) {
      last = err.message;
    }
    if (Date.now() >= deadline) {
      throw new Error(
        `Check 1 FAILED: ${url} never reported ${expected} within ` +
          `${timeoutSecs}s (last seen: ${last}). If the Vercel deploy is ` +
          `just slow, re-run this job once it finishes.`
      );
    }
    console.log(`  waiting for prod deploy... (last seen: ${last})`);
    await sleep(intervalMs);
  }
}

async function main() {
  const expected = repoVersion();
  console.log(`Repo version: ${expected}`);

  const failures = [];

  // Check 1 — version endpoint (polls; run first, it's the slow one).
  try {
    await checkVersion(expected);
  } catch (err) {
    failures.push(err.message);
    console.error(`✗ ${err.message}`);
  }

  // Checks 2 + 3 — bucket parity and canary audio.
  try {
    const [devKeys, prodKeys] = await Promise.all([
      listAllKeys(devClient),
      listAllKeys(prodClient),
    ]);

    if (prodKeys.size >= devKeys.size) {
      console.log(
        `✓ Check 2: prod key count ${prodKeys.size} >= dev ${devKeys.size}`
      );
    } else {
      const msg = `Check 2 FAILED: prod has ${prodKeys.size} keys, dev has ${devKeys.size} — sync gap`;
      failures.push(msg);
      console.error(`✗ ${msg}`);
    }

    const canary = [...prodKeys.keys()].find((k) => k.endsWith(".mp3"));
    if (!canary) {
      const msg = "Check 3 FAILED: no .mp3 found in prod bucket to canary";
      failures.push(msg);
      console.error(`✗ ${msg}`);
    } else {
      const url = `${PROD_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${canary}`;
      const res = await fetch(url, { method: "GET" });
      if (res.ok) {
        console.log(`✓ Check 3: canary audio 200 (${canary})`);
      } else {
        const msg = `Check 3 FAILED: canary ${url} returned HTTP ${res.status}`;
        failures.push(msg);
        console.error(`✗ ${msg}`);
      }
      // Don't download the body.
      res.body?.cancel?.();
    }
  } catch (err) {
    failures.push(`Checks 2/3 errored: ${err.message}`);
    console.error(`✗ Checks 2/3 errored: ${err.message}`);
  }

  if (failures.length > 0) {
    console.error(`\nSMOKE CHECK FAILED (${failures.length} miss(es)).`);
    process.exit(1);
  }
  console.log("\nAll smoke checks passed.");
}

main().catch((err) => {
  console.error(`smoke-check fatal: ${err.message}`);
  process.exit(1);
});

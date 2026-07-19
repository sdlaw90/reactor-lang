// Post-deploy TTS auto-sync (2026-07-19).
//
// Called by scripts/deploy.js AFTER the code push. Detects which audio-enabled
// tracks had content change in this deploy, and for any with NEW spoken clips
// synthesizes + uploads them to the dev "tts-audio" bucket
// (generate-tts.mjs --upload). This closes the manual gap: previously you had to
// remember to run generate-tts yourself when you added content; sync-tts.mjs
// then mirrors dev→prod at release.
//
// DESIGN (per the deploy-flow decisions, 2026-07-19):
//   - SYNTH + UPLOAD: when a track has new clips we run the full
//     generate-tts --upload (Google TTS $ for anything missing, then upload).
//   - NON-BLOCKING: audio never aborts a deploy. Every failure is caught and
//     summarized as a warning; this script ALWAYS exits 0. The client degrades
//     gracefully (no clip → no button), and generate-tts --upload is idempotent
//     so a later re-run fixes anything left behind.
//   - CHANGED TRACKS ONLY: we diff the just-pushed range and map changed
//     content files to their track(s), so a doc-only deploy does no TTS work
//     and needs no API key. Falls back to scanning all audio tracks if the
//     diff can't be determined.
//   - DRY-RUN GATE: before spending, `--dry-run` reports the new-clip count with
//     no API key and no cost. We only run the paid synth+upload when it's > 0,
//     which also avoids needlessly re-uploading an unchanged track's clips.
//
// Usage:
//   node scripts/tts-on-deploy.mjs --since <ref>   (deploy.js passes pre-push upstream)
//   node scripts/tts-on-deploy.mjs                 (no ref → scan all audio tracks)

import { execSync, execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const GEN = path.join(ROOT, "scripts", "generate-tts.mjs");

// Tracks we produce audio for (the voice-keyed set in generate-tts.mjs). Only
// these are ever considered — a changed track outside this set is ignored.
const AUDIO_TRACKS = new Set([
  "esForEn", "frCaForEn", "deForEn", "jaForEn", "koForEn", "ruForEn", "zhForEn",
]);

// Shared vocab word-bank files → the track that imports them.
const VOCAB_TO_TRACK = {
  esLatAmWords: "esForEn",
  deWords: "deForEn",
  frCaWords: "frCaForEn",
  jaWords: "jaForEn",
  koWords: "koForEn",
  ruWords: "ruForEn",
  zhWords: "zhForEn",
};

const arg = (name) => {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : null;
};
const SINCE = arg("since");

function git(cmd) {
  return execSync(`git ${cmd}`, { cwd: ROOT, stdio: ["ignore", "pipe", "ignore"] })
    .toString()
    .trim();
}

// Map a changed repo-relative path to the audio track(s) it can affect.
// Returns an array (usually 0 or 1). A change to lib/audioKey.js re-hashes every
// clip, so it fans out to all audio tracks.
function tracksForPath(p) {
  const norm = p.replace(/\\/g, "/");
  if (norm === "lib/audioKey.js") return [...AUDIO_TRACKS];

  let m = norm.match(/^data\/tracks\/([A-Za-z0-9]+)\.js$/);
  if (m) {
    // <track>.js or <track>Tags.js (tags aren't spoken, but the dry-run gate
    // will simply report 0 new clips, so including it is safe and cheap).
    const base = m[1].replace(/Tags$/, "");
    return AUDIO_TRACKS.has(base) ? [base] : [];
  }
  m = norm.match(/^data\/vocab\/([A-Za-z0-9]+)\.js$/);
  if (m && VOCAB_TO_TRACK[m[1]]) return [VOCAB_TO_TRACK[m[1]]];

  // data/scripts/** and data/grammar/** feed the script-practice and grammar-gym
  // modules, NOT the spoken prompt bank, so they never affect TTS.
  return [];
}

// Which audio tracks changed in this deploy? Empty set + wasScoped=false means
// "couldn't tell" → caller falls back to scanning everything.
function changedAudioTracks() {
  if (!SINCE) return { tracks: null, reason: "no --since ref (scanning all audio tracks)" };
  let files;
  try {
    files = git(`diff --name-only ${SINCE}..HEAD`).split("\n").filter(Boolean);
  } catch {
    return { tracks: null, reason: "git diff failed (scanning all audio tracks)" };
  }
  const set = new Set();
  for (const f of files) for (const t of tracksForPath(f)) set.add(t);
  return { tracks: set, reason: `changed content maps to: ${[...set].join(", ") || "(none)"}` };
}

// Run generate-tts --dry-run and read back "To synthesize this run: N".
function newClipCount(track) {
  const out = execFileSync("node", [GEN, "--track", track, "--dry-run"], {
    cwd: ROOT,
    stdio: ["ignore", "pipe", "pipe"],
  }).toString();
  const m = out.match(/To synthesize this run:\s*(\d+)/);
  return m ? Number(m[1]) : 0;
}

function synthAndUpload(track) {
  // Inherit stdio so the (potentially long) synth/upload progress is visible.
  execFileSync("node", [GEN, "--track", track, "--upload"], { cwd: ROOT, stdio: "inherit" });
}

// ---------------- main ----------------
console.log("\n— TTS post-deploy check —");

const { tracks, reason } = changedAudioTracks();
console.log(reason);

let candidates;
if (tracks === null) {
  candidates = [...AUDIO_TRACKS];
} else if (tracks.size === 0) {
  console.log("No audio-track content changed — skipping TTS.");
  process.exit(0);
} else {
  candidates = [...tracks];
}

const warnings = [];
let synthed = 0;

for (const track of candidates) {
  try {
    const n = newClipCount(track);
    if (n === 0) {
      console.log(`  ${track}: up to date (0 new clips).`);
      continue;
    }
    console.log(`  ${track}: ${n} new clip(s) → synthesizing + uploading…`);
    synthAndUpload(track);
    synthed++;
  } catch (e) {
    // Non-blocking: record and move on. Most common causes: missing
    // GOOGLE_TTS_API_KEY / Supabase keys in .env.local, TTS API quota, network.
    const msg = (e && e.message ? e.message : String(e)).split("\n")[0];
    warnings.push(`${track}: ${msg}`);
    console.warn(`  ⚠ ${track}: TTS step failed — ${msg}`);
  }
}

if (warnings.length) {
  console.warn(
    `\n⚠ Code shipped, but audio is behind for ${warnings.length} track(s):`
  );
  warnings.forEach((w) => console.warn(`    - ${w}`));
  console.warn(
    "  Re-run once resolved:  node scripts/generate-tts.mjs --track <track> --upload"
  );
} else if (synthed) {
  console.log(`\nTTS post-deploy complete: ${synthed} track(s) synced to the dev bucket.`);
} else {
  console.log("TTS post-deploy: nothing to do.");
}

// ALWAYS succeed — audio must never block a code deploy.
process.exit(0);

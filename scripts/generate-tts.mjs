// TTS clip generation (pilot: esForEn, 2026-07-11).
//
// Extracts every spoken prompt from a track's bank, synthesizes each one
// once via Google Cloud Text-to-Speech (REST, API-key auth — no SDK dep),
// writes MP3s to tts-output/<track.id>/, and optionally uploads them to the
// Supabase "tts-audio" bucket (migration 00000000000014).
//
// Idempotent: clips are keyed by a content hash of the spoken text
// (lib/audioKey.js), so re-runs only synthesize prompts that are new or
// changed. --force regenerates everything (needed after SSML logic changes,
// since keys hash the raw text, not the SSML).
//
// Usage:
//   node scripts/generate-tts.mjs --track esForEn --dry-run
//   node scripts/generate-tts.mjs --track esForEn
//   node scripts/generate-tts.mjs --track esForEn --upload
//   Flags: --voice <name> --limit <n> --force --dry-run --upload
//
// Env (read from .env.local or the environment):
//   GOOGLE_TTS_API_KEY          — required unless --dry-run
//   NEXT_PUBLIC_SUPABASE_URL    — required for --upload
//   SUPABASE_SERVICE_ROLE_KEY   — required for --upload (server-side only;
//                                 NEVER exposed to the client or Vercel env)
//
// Scope notes (pilot decisions — revisit per-track):
//   - Prompt-only. Options, explanations, and promptNative are not spoken.
//   - The fono extraBank is EXCLUDED: speaking item.text aloud would answer
//     the identify question. Real listening exercises are the separate
//     listening-module roadmap item, not this pipeline.
//   - Cloze gaps ("_____") become a 500ms SSML pause.
//   - "¿Cómo se dice 'X' ...?" prompts wrap X in an en-US <lang> span so the
//     Spanish voice doesn't mangle the embedded English. Any OTHER prompt
//     containing a quoted span is flagged to tts-output/<id>/review.txt for
//     a manual look rather than guessed at.

import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// ---------- tiny .env.local loader (no dotenv dep) ----------
function loadEnvLocal() {
  const p = path.join(ROOT, ".env.local");
  if (!existsSync(p)) return;
  for (const line of readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!m || line.trim().startsWith("#")) continue;
    const val = m[2].replace(/^["']|["']$/g, "");
    if (!(m[1] in process.env)) process.env[m[1]] = val;
  }
}
loadEnvLocal();

// ---------- CLI ----------
const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const opt = (name, dflt) => {
  const i = args.indexOf(`--${name}`);
  return i !== -1 && args[i + 1] ? args[i + 1] : dflt;
};
const TRACK = opt("track", "esForEn");
const VOICE = opt("voice", "es-US-Neural2-A");
const NATIVE_VOICE = opt("native-voice", "en-US-Neural2-C");
const LIMIT = Number(opt("limit", "0")) || 0;
const DRY = flag("dry-run");
const FORCE = flag("force");
const UPLOAD = flag("upload");
const SPEAKING_RATE = Number(opt("rate", "0.92")); // slightly slower for learners

// Locale for embedded native-language spans, derived from track.nativeLang.
const NATIVE_TTS_LOCALE = { en: "en-US", es: "es-US", it: "it-IT" };

// ---------- load the track through esbuild (data files are ESM w/ extensionless imports) ----------
async function loadTrack(trackName) {
  const esbuild = require("esbuild");
  const entry = path.join(ROOT, "data", "tracks", `${trackName}.js`);
  if (!existsSync(entry)) {
    console.error(`No such track file: data/tracks/${trackName}.js`);
    process.exit(1);
  }
  const outfile = path.join(ROOT, "tts-output", `.track-${trackName}.bundle.cjs`);
  mkdirSync(path.dirname(outfile), { recursive: true });
  await esbuild.build({
    entryPoints: [entry],
    bundle: true,
    platform: "node",
    format: "cjs",
    outfile,
    logLevel: "silent",
  });
  const mod = require(outfile);
  rmSync(outfile);
  return mod.default;
}

// ---------- spoken-text extraction ----------
function extractSpoken(track) {
  const items = []; // { key, text, ssml, sources: [questionId,...] }
  const byKey = new Map();
  const review = [];

  const nativeLocale = NATIVE_TTS_LOCALE[track.nativeLang] || "en-US";

  Object.keys(track.bank).forEach((cat) => {
    track.bank[cat].forEach((q, i) => {
      const id = `${cat}-${i}`;
      const raw = q[0];
      const text = normalizeSpokenText(raw);
      const key = audioKey(text);
      if (byKey.has(key)) {
        const prior = byKey.get(key);
        if (prior.text !== text) {
          // Hash collision between different texts — abort loudly.
          console.error(`FATAL: audioKey collision: "${prior.text}" vs "${text}"`);
          process.exit(1);
        }
        prior.sources.push(id);
        return;
      }
      const { ssml, flagged, voice } = toSSML(text, nativeLocale);
      if (flagged) review.push({ id, text });
      const item = { key, text, ssml, voice, sources: [id] };
      byKey.set(key, item);
      items.push(item);
    });
  });

  return { items, review };
}

function xmlEscape(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

// Build SSML for one prompt. Returns { ssml, flagged, voice } — flagged
// means a quoted span we did NOT confidently language-tag; voice is
// "target" (default) or "native" (the whole prompt is the learner's
// native language, e.g. the trad category's "Translate: '...'" prompts).
function toSSML(text, nativeLocale) {
  let flagged = false;
  let voice = "target";
  let body;

  const translate = text.match(/^Translate:\s*'/i);
  const comoSeDice = text.match(/^(¿Cómo se dice )'([^']+)'( .*)$/i);
  if (translate) {
    // Whole prompt is native-language — synthesize with the native voice.
    // (Occasional Spanish parenthetical like "(coloquial)" comes out with an
    // English accent; one word, acceptable for the pilot — see runbook.)
    voice = "native";
    body = xmlEscape(text);
  } else if (comoSeDice) {
    // "¿Cómo se dice 'deadline' en español?" — the quoted word is the
    // learner's native language; tag it so the es voice doesn't mangle it.
    body =
      xmlEscape(comoSeDice[1]) +
      `<lang xml:lang="${nativeLocale}">` +
      xmlEscape(comoSeDice[2]) +
      `</lang>` +
      xmlEscape(comoSeDice[3]);
  } else {
    // "'La almohada' significa..." — quoted span is target-language, speak
    // as-is. Any other quoted pattern gets flagged for manual review but is
    // still generated (worst case: accented pronunciation of a stray word).
    if (text.includes("'") && !/^'[^']+'\s+significa/i.test(text)) flagged = true;
    body = xmlEscape(text);
  }

  // Cloze gaps: "Yo _____ (tener) mucha hambre." → pause where the gap is.
  body = body.replace(/_{2,}/g, '<break time="500ms"/>');

  return { ssml: `<speak>${body}</speak>`, flagged, voice };
}

// ---------- Google TTS REST ----------
async function synthesize(ssml, apiKey, voiceKind = "target") {
  const voiceName = voiceKind === "native" ? NATIVE_VOICE : VOICE;
  const res = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      input: { ssml },
      voice: { languageCode: voiceName.split("-").slice(0, 2).join("-"), name: voiceName },
      audioConfig: { audioEncoding: "MP3", speakingRate: SPEAKING_RATE },
    }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    const err = new Error(`TTS ${res.status}: ${detail.slice(0, 300)}`);
    err.status = res.status;
    throw err;
  }
  const json = await res.json();
  return Buffer.from(json.audioContent, "base64");
}

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

// Small concurrency pool — polite to the API, fast enough for ~750 clips.
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

// ---------- main ----------
const { audioKey, normalizeSpokenText } = await import(pathToFileURL(path.join(ROOT, "lib", "audioKey.js")));

const track = await loadTrack(TRACK);
const outDir = path.join(ROOT, "tts-output", track.id);
mkdirSync(outDir, { recursive: true });

const { items, review } = extractSpoken(track);
let todo = items;

// Idempotency: skip clips already on disk (and, if uploading, in the bucket).
if (!FORCE) {
  const existing = new Set((await readdir(outDir).catch(() => [])).map((f) => f.replace(/\.mp3$/, "")));
  todo = todo.filter((it) => !existing.has(it.key));
}
if (LIMIT) todo = todo.slice(0, LIMIT);

const totalChars = items.reduce((n, it) => n + it.text.length, 0);
console.log(`Track: ${track.id} (${TRACK})`);
console.log(`Voice: ${VOICE}  native voice: ${NATIVE_VOICE}  rate: ${SPEAKING_RATE}`);
const nativeCount = items.filter((it) => it.voice === "native").length;
if (nativeCount) console.log(`Native-voice prompts: ${nativeCount}`);
console.log(`Unique spoken prompts: ${items.length} (from ${Object.keys(track.bank).length} categories)`);
console.log(`Total characters (all prompts): ${totalChars.toLocaleString()}`);
console.log(`To synthesize this run: ${todo.length}${FORCE ? " (--force)" : ""}${LIMIT ? ` (--limit ${LIMIT})` : ""}`);
if (review.length) {
  const reviewPath = path.join(outDir, "review.txt");
  writeFileSync(reviewPath, review.map((r) => `${r.id}\t${r.text}`).join("\n") + "\n");
  console.log(`⚠ ${review.length} prompts with unrecognized quoted spans → ${path.relative(ROOT, reviewPath)}`);
}

if (DRY) {
  console.log("Dry run — nothing synthesized.");
  process.exit(0);
}

const API_KEY = process.env.GOOGLE_TTS_API_KEY;
if (!API_KEY) {
  console.error("GOOGLE_TTS_API_KEY missing (set it in .env.local). Aborting.");
  process.exit(1);
}

let done = 0;
const failures = await pool(todo, async (item) => {
  const mp3 = await withRetry(() => synthesize(item.ssml, API_KEY, item.voice));
  writeFileSync(path.join(outDir, `${item.key}.mp3`), mp3);
  done++;
  if (done % 50 === 0 || done === todo.length) console.log(`  synthesized ${done}/${todo.length}`);
});

if (failures.length) {
  console.error(`✗ ${failures.length} clips failed:`);
  failures.slice(0, 10).forEach((f) => console.error(`  ${f.item.key}  ${f.error.message}`));
  console.error("Re-run to retry just the failures (idempotent).");
}

// Manifest: every key the track SHOULD have, with its source text — used by
// the client to know clip availability without probing for 404s, and by
// humans to audit what a key maps to.
const manifest = {
  trackId: track.id,
  voice: VOICE,
  nativeVoice: NATIVE_VOICE,
  speakingRate: SPEAKING_RATE,
  generatedAt: new Date().toISOString(),
  count: items.length,
  // key → { t: spoken text, v: "target" | "native" }. Voice kind is
  // informational — it is NOT part of the key, so reclassifying a prompt's
  // voice later requires a --force regeneration (see runbook).
  clips: Object.fromEntries(items.map((it) => [it.key, { t: it.text, v: it.voice }])),
};
const manifestPath = path.join(outDir, "manifest.json");
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log(`Manifest → ${path.relative(ROOT, manifestPath)}`);

// ---------- optional upload ----------
if (UPLOAD) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    console.error("--upload needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local. Skipping upload.");
    process.exit(1);
  }
  const { createClient } = require("@supabase/supabase-js");
  const supabase = createClient(url, serviceKey);

  const files = (await readdir(outDir)).filter((f) => f.endsWith(".mp3"));
  console.log(`Uploading ${files.length} clips + manifest to bucket "tts-audio"...`);
  let up = 0;
  const upErrors = await pool(
    files,
    async (f) => {
      const body = readFileSync(path.join(outDir, f));
      const { error } = await supabase.storage
        .from("tts-audio")
        .upload(`${track.id}/${f}`, body, {
          upsert: true,
          contentType: "audio/mpeg",
          cacheControl: "31536000", // clips are immutable per key
        });
      if (error) throw new Error(error.message);
      up++;
      if (up % 100 === 0 || up === files.length) console.log(`  uploaded ${up}/${files.length}`);
    },
    6
  );
  const { error: mErr } = await supabase.storage
    .from("tts-audio")
    .upload(`${track.id}/manifest.json`, readFileSync(manifestPath), {
      upsert: true,
      contentType: "application/json",
      cacheControl: "300", // manifest changes with content passes — short cache
    });
  if (mErr) console.error(`✗ manifest upload failed: ${mErr.message}`);
  if (upErrors.length) {
    console.error(`✗ ${upErrors.length} uploads failed — re-run with --upload to retry.`);
    process.exit(1);
  }
  console.log("Upload complete.");
}

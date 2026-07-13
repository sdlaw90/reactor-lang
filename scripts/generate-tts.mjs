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
//   - Cloze gaps ("___"/"_____") become a 500ms SSML pause.
//   - Production prompts ("¿Cómo se dice 'X' ...?" / "Comment dit-on 'X'
//     en français?" / "Wie sagt man 'X' auf Deutsch?") wrap X in a
//     native-locale <lang> span so the target
//     voice doesn't mangle the embedded English. Any OTHER prompt containing
//     a true quoted span is flagged to tts-output/<id>/review.txt for a
//     manual look rather than guessed at.
//   - Prompt-shape rules are per-language (LANG_RULES, keyed by
//     track.targetLang; tracks without one fall back to the es pilot rules).
//     French rules are elision-aware: apostrophes inside words (t'as, c'est,
//     l'école) are orthography, not quotes, and must not trip the review
//     flag or truncate quoted-span matches.
//   - Voice preflight: before any paid synthesis the script verifies the
//     configured voices actually exist for their locales and hard-fails
//     otherwise — never silently substitutes a neighboring dialect (fr-CA
//     falling back to fr-FR would defeat the entire dialect positioning).

import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
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

// Per-track default voices (--voice / --native-voice still override).
// Dialect fidelity is the product: the fr-CA entry must be an fr-CA voice,
// never an fr-FR one. Variant letters (A vs B...) are an audition decision —
// update here once ears have picked.
const TRACK_VOICES = {
  esForEn: "es-US-Neural2-A",
  frCaForEn: "fr-CA-Neural2-A",
  deForEn: "de-DE-Neural2-G", // female. A/B retired in Google's voice refresh (G=F, H=M)
};
const VOICE = opt("voice", TRACK_VOICES[TRACK] || "es-US-Neural2-A");
const NATIVE_VOICE = opt("native-voice", "en-US-Neural2-C");
const LIMIT = Number(opt("limit", "0")) || 0;
const DRY = flag("dry-run");
const FORCE = flag("force");
const UPLOAD = flag("upload");
const SPEAKING_RATE = Number(opt("rate", "0.92")); // slightly slower for learners

// Locale for embedded native-language spans, derived from track.nativeLang.
const NATIVE_TTS_LOCALE = { en: "en-US", es: "es-US", it: "it-IT" };

// ---------- load the track + audioKey through esbuild ----------
// (data files and lib/audioKey.js are ESM with extensionless imports; the
// repo has no "type":"module", so Node can't import them directly —
// esbuild normalizes everything to CJS regardless of Node version.)
async function loadModules(trackName) {
  const esbuild = require("esbuild");
  const entry = path.join(ROOT, "data", "tracks", `${trackName}.js`);
  if (!existsSync(entry)) {
    console.error(`No such track file: data/tracks/${trackName}.js`);
    process.exit(1);
  }
  const outfile = path.join(ROOT, "tts-output", `.tts-entry-${trackName}.bundle.cjs`);
  mkdirSync(path.dirname(outfile), { recursive: true });
  const stub = [
    `import track from ${JSON.stringify(entry.replace(/\\/g, "/"))};`,
    `import * as audioKeyMod from ${JSON.stringify(path.join(ROOT, "lib", "audioKey.js").replace(/\\/g, "/"))};`,
    `module.exports = { track, audioKeyMod };`,
  ].join("\n");
  await esbuild.build({
    stdin: { contents: stub, resolveDir: ROOT, sourcefile: "tts-entry.js" },
    bundle: true,
    platform: "node",
    format: "cjs",
    outfile,
    logLevel: "silent",
  });
  const mod = require(outfile);
  rmSync(outfile);
  return mod;
}

// ---------- per-language prompt-shape rules ----------
// Keyed by track.targetLang. Each entry:
//   production  — regex for "how do you say 'X'" prompts; groups are
//                 (lead)(quoted native word)(tail); the quoted word gets a
//                 native-locale <lang> span.
//   knownQuoted — recognition shapes whose quoted spans are ALL
//                 target-language (spoken as-is, not flagged).
//   quoteDetect — does this text contain a true quoted span? Used only for
//                 the review flag.
//
// es rules are the pilot's logic verbatim — they must stay byte-identical in
// SSML output so esForEn needs no --force after this change (verified by
// snapshot diff at this pass).
//
// fr notes: word/gloss content can contain elision apostrophes ("l'école",
// "one's"), so the quoted-span matches are GREEDY and anchored on the exact
// formula tails, unlike the pilot's [^']+ — and quote detection requires
// span boundaries (whitespace/punct) so French elisions don't flag.
const LANG_RULES = {
  es: {
    production: /^(¿Cómo se dice )'([^']+)'( .*)$/i,
    knownQuoted: /^'[^']+'\s+significa/i,
    quoteDetect: (text) => text.includes("'"),
  },
  fr: {
    production: /^(Comment dit-on )'(.+)'( en français\?)$/i,
    knownQuoted: /^'.+'\s+signifie/i,
    quoteDetect: (text) => /(^|[\s(])'[^']+'(?=[\s).,:;?!…]|$)/.test(text),
  },
  // de notes: recognition allows words between the quoted span and
  // "bedeutet" ("'Doch!' als Antwort bedeutet...", "'Handschuh' bedeutet
  // wörtlich ..."), hence `.*` rather than `\s+`. Everything before
  // "bedeutet" in those shapes is German, so speaking as-is is correct.
  // Embedded double-quoted English ("hand shoe") comes out German-accented —
  // same accepted wart class as the trad "(coloquial)" case. Quoted spans
  // keep the greedy+boundary-aware fr treatment: German words are stored in
  // dictionary casing WITH articles ('der Termin') and glosses can carry
  // internal apostrophes ("one's"), neither of which may truncate or flag.
  de: {
    production: /^(Wie sagt man )'(.+)'( auf Deutsch\?)$/i,
    knownQuoted: /^'.+'.*\bbedeutet/i,
    quoteDetect: (text) => /(^|[\s(])'[^']+'(?=[\s).,:;?!…]|$)/.test(text),
  },
};

// ---------- spoken-text extraction ----------
function extractSpoken(track) {
  const items = []; // { key, text, ssml, sources: [questionId,...] }
  const byKey = new Map();
  const review = [];

  const nativeLocale = NATIVE_TTS_LOCALE[track.nativeLang] || "en-US";
  const rules = LANG_RULES[track.targetLang] || LANG_RULES.es;

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
      const { ssml, flagged, voice } = toSSML(text, nativeLocale, rules);
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
function toSSML(text, nativeLocale, rules) {
  let flagged = false;
  let voice = "target";
  let body;

  const translate = text.match(/^Translate:\s*'/i);
  const production = text.match(rules.production);
  if (translate) {
    // Whole prompt is native-language — synthesize with the native voice.
    // (Occasional target-language parenthetical like "(coloquial)" comes out
    // with an English accent; one word, acceptable — see runbook.)
    voice = "native";
    body = xmlEscape(text);
  } else if (production) {
    // "¿Cómo se dice 'deadline' en español?" / "Comment dit-on 'kitchen' en
    // français?" — the quoted word is the learner's native language; tag it
    // so the target voice doesn't mangle it.
    body =
      xmlEscape(production[1]) +
      `<lang xml:lang="${nativeLocale}">` +
      xmlEscape(production[2]) +
      `</lang>` +
      xmlEscape(production[3]);
  } else {
    // "'La almohada' significa..." / "'Magasiner' signifie..." — quoted
    // span(s) are target-language, speak as-is. Any other prompt with a true
    // quoted span gets flagged for manual review but is still generated
    // (worst case: accented pronunciation of a stray word).
    if (rules.quoteDetect(text) && !rules.knownQuoted.test(text)) flagged = true;
    body = xmlEscape(text);
  }

  // Cloze gaps: "Yo _____ (tener) mucha hambre." / "___ maison est grande."
  // → pause where the gap is.
  body = body.replace(/_{2,}/g, '<break time="500ms"/>');

  return { ssml: `<speak>${body}</speak>`, flagged, voice };
}

// ---------- Google TTS REST ----------
// Preflight: confirm both configured voices exist for their exact locales.
// Google returns 400s per-request for unknown voice names, but this check
// fails FAST with a clear message — and guarantees we never end up quietly
// auditioning a neighboring dialect (fr-CA is the point; fr-FR is a bug).
async function verifyVoices(apiKey) {
  for (const name of new Set([VOICE, NATIVE_VOICE])) {
    const locale = name.split("-").slice(0, 2).join("-");
    const res = await fetch(`https://texttospeech.googleapis.com/v1/voices?languageCode=${locale}&key=${apiKey}`);
    if (!res.ok) {
      console.error(`Voice preflight failed: voices list returned ${res.status}. Aborting before any synthesis.`);
      process.exit(1);
    }
    const { voices = [] } = await res.json();
    if (!voices.some((v) => v.name === name)) {
      const available = voices.map((v) => v.name).join(", ") || "(none)";
      console.error(`Voice "${name}" does not exist for locale ${locale}.`);
      console.error(`Available ${locale} voices: ${available}`);
      console.error(`Refusing to fall back to another dialect — pick a real ${locale} voice with --voice/--native-voice.`);
      process.exit(1);
    }
  }
}

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
const { track, audioKeyMod } = await loadModules(TRACK);
const { audioKey, normalizeSpokenText } = audioKeyMod;
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

await verifyVoices(API_KEY);

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
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    console.error("--upload needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local. Skipping upload.");
    process.exit(1);
  }

  // Plain Storage REST API — deliberately NOT supabase-js: the client
  // constructs its realtime layer (needs Node 22+ native WebSocket) even
  // for storage-only use. fetch keeps the script runnable on any Node 18+.
  async function storagePut(objectPath, body, contentType, maxAgeSeconds) {
    const res = await fetch(`${url}/storage/v1/object/tts-audio/${objectPath}`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${serviceKey}`,
        apikey: serviceKey,
        "content-type": contentType,
        "cache-control": `max-age=${maxAgeSeconds}`,
        "x-upsert": "true",
      },
      body,
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      const err = new Error(`storage ${res.status}: ${detail.slice(0, 200)}`);
      err.status = res.status;
      throw err;
    }
  }

  const files = (await readdir(outDir)).filter((f) => f.endsWith(".mp3"));
  console.log(`Uploading ${files.length} clips + manifest to bucket "tts-audio"...`);
  let up = 0;
  const upErrors = await pool(
    files,
    async (f) => {
      await withRetry(() =>
        storagePut(`${track.id}/${f}`, readFileSync(path.join(outDir, f)), "audio/mpeg", 31536000) // clips immutable per key
      );
      up++;
      if (up % 100 === 0 || up === files.length) console.log(`  uploaded ${up}/${files.length}`);
    },
    6
  );
  try {
    await withRetry(() =>
      storagePut(`${track.id}/manifest.json`, readFileSync(manifestPath), "application/json", 300) // manifest changes with content passes
    );
  } catch (e) {
    console.error(`✗ manifest upload failed: ${e.message}`);
  }
  if (upErrors.length) {
    console.error(`✗ ${upErrors.length} uploads failed:`);
    upErrors.slice(0, 5).forEach((f) => console.error(`  ${f.item}  ${f.error.message}`));
    console.error("Re-run with --upload to retry (x-upsert makes it safe).");
    process.exit(1);
  }
  console.log("Upload complete.");
}

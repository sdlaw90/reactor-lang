// voices:list — list Google Cloud TTS voices for a locale before pinning one.
//
// The TTS pipeline's standing rule is "run voices:list for <locale> FIRST,"
// but until now that was a step name with no implementation — the only voice
// query lived inside generate-tts.mjs's verifyVoices() preflight. This makes it
// a real command so a TTS pass doesn't have to trigger a deliberate preflight
// failure (or curl by hand) just to see what exists.
//
// Usage:
//   npm run voices:list -- --locale ru-RU
//   npm run voices:list -- --locale ru-RU --ssml-only
//   npm run voices:list -- --locale es-US,fr-CA        (comma-separated)
//   npm run voices:list -- --locale ru-RU --json
//
// Env (read from .env.local or the environment, same loader as generate-tts):
//   GOOGLE_TTS_API_KEY — required.
//
// Notes:
//   - SSML support is inferred from the voice family. The pipeline builds SSML
//     (<speak>/<lang>/<break>/<sub>), so Chirp/Chirp3-HD voices — which do NOT
//     honor SSML or speakingRate — are flagged unsuitable (this is the same
//     reason jaForEn ignored Chirp3-HD). Pick a Neural2/Wavenet/Studio voice.
//   - Purely a read: lists voices, prints them, exits. No synthesis, no cost.

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// ---------- tiny .env.local loader (no dotenv dep) — same as generate-tts ----------
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
const LOCALES = (opt("locale", "") || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const JSON_OUT = flag("json");
const SSML_ONLY = flag("ssml-only");

if (!LOCALES.length) {
  console.error("Usage: npm run voices:list -- --locale <BCP-47> [--ssml-only] [--json]");
  console.error("  e.g. npm run voices:list -- --locale ru-RU");
  process.exit(2);
}

const API_KEY = process.env.GOOGLE_TTS_API_KEY;
if (!API_KEY) {
  console.error("GOOGLE_TTS_API_KEY missing (set it in .env.local). Aborting.");
  process.exit(1);
}

// SSML-incompatible families: Chirp and Chirp3-HD ignore SSML + speakingRate.
// Everything else the API exposes (Neural2, Wavenet, Studio, Standard, News,
// Polyglot) honors the SSML this pipeline emits.
function ssmlSupported(name) {
  return !/chirp/i.test(name);
}

async function listLocale(locale) {
  const res = await fetch(
    `https://texttospeech.googleapis.com/v1/voices?languageCode=${encodeURIComponent(locale)}&key=${API_KEY}`
  );
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error(`✗ ${locale}: voices list returned ${res.status}. ${detail.slice(0, 200)}`);
    return null;
  }
  const { voices = [] } = await res.json();
  // API filters by languageCode server-side, but a voice can list several
  // locales; keep only those actually offering this exact locale.
  return voices
    .filter((v) => (v.languageCodes || []).includes(locale))
    .map((v) => ({
      name: v.name,
      gender: v.ssmlGender || "—",
      hz: v.naturalSampleRateHertz || "—",
      ssml: ssmlSupported(v.name),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

const result = {};
for (const locale of LOCALES) {
  const voices = await listLocale(locale);
  if (voices) result[locale] = voices;
}

if (JSON_OUT) {
  console.log(JSON.stringify(result, null, 2));
  process.exit(0);
}

if (!Object.keys(result).length) {
  // Every requested locale failed to list (bad key, network, unknown locale).
  // The per-locale ✗ lines above say why; don't exit 0 on total failure.
  process.exit(1);
}

for (const [locale, voices] of Object.entries(result)) {
  const shown = SSML_ONLY ? voices.filter((v) => v.ssml) : voices;
  console.log(`\n${locale} — ${shown.length} voice${shown.length === 1 ? "" : "s"}${SSML_ONLY ? " (SSML-compatible)" : ""}:`);
  if (!shown.length) {
    console.log("  (none)");
    continue;
  }
  const w = Math.max(...shown.map((v) => v.name.length));
  for (const v of shown) {
    const ssmlNote = v.ssml ? "" : "   ⚠ no SSML/rate — unsuitable for this pipeline";
    console.log(`  ${v.name.padEnd(w)}  ${String(v.gender).padEnd(7)}  ${v.hz} Hz${ssmlNote}`);
  }
}
console.log("\nPin a Neural2/Wavenet voice in TRACK_VOICES (generate-tts.mjs). Do not guess — letters churn.");

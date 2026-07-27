#!/usr/bin/env node
// tts-chirp-probe.mjs — one-off validation probe for the Chirp3-HD (Puck/Aoede)
// voice migration. Answers the two questions we can't answer without the API:
//   1) COVERAGE — do Puck/Aoede exist in each target locale?
//   2) PRONUNCIATION — does Chirp3-HD sound right WITHOUT SSML (no <sub>/<lang>)?
//
// Chirp3-HD ignores SSML, so this sends PLAIN TEXT (the exact thing the migrated
// pipeline would send). Listen to the MP3s it writes and eyeball the coverage table.
//
// RUN (from repo root, with GOOGLE_TTS_API_KEY in .env.local or the env):
//   node scripts/tts-chirp-probe.mjs
// Output: ./tts-probe/*.mp3  (one per phrase per voice) + a coverage table in the console.
// Nothing is uploaded; nothing in the app is touched. Safe to delete ./tts-probe after.

import fs from "node:fs";
import path from "node:path";

// ---- API key (from .env.local KEY=VAL, or process.env) ----
function loadKey() {
  if (process.env.GOOGLE_TTS_API_KEY) return process.env.GOOGLE_TTS_API_KEY;
  try {
    const env = fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf8");
    const m = env.match(/^\s*GOOGLE_TTS_API_KEY\s*=\s*(.+)\s*$/m);
    if (m) return m[1].trim().replace(/^["']|["']$/g, "");
  } catch {}
  return null;
}
const KEY = loadKey();
if (!KEY) {
  console.error("No GOOGLE_TTS_API_KEY found (checked env + .env.local). Aborting.");
  process.exit(1);
}

// Locales the app needs a voice for (target languages).
const LOCALES = ["en-US", "en-GB", "es-US", "es-ES", "fr-FR", "fr-CA", "it-IT", "de-DE", "ja-JP", "ko-KR", "ru-RU", "cmn-CN"];
const PERSONAS = ["Puck", "Aoede"]; // the two tutorial-video voices

// ---- test phrases: pure-language quality + the hard mixed cases ----
// note = what to listen for. locale drives the voice.
const TESTS = [
  // English — the actual video voices; confirm they match the tutorials.
  { id: "en-us-hello", locale: "en-US", text: "Hello! Welcome to SquirreLingo.", note: "Do these match the Puck/Aoede you used in the videos?" },
  { id: "en-us-word", locale: "en-US", text: "Boring", note: "Clean single-word (English-target vocab)." },
  { id: "en-gb-word", locale: "en-GB", text: "aluminium", note: "UK pronunciation vs US." },
  // Spanish — incl. the cross-language 'window' handoff (English word inside Spanish).
  { id: "es-word", locale: "es-US", text: "la almohada", note: "Plain Spanish word." },
  { id: "es-crosslang", locale: "es-US", text: "¿Cómo se dice 'window' en español?", note: "HARD: 'window' is English inside a Spanish prompt — is it mangled? (SSML used <lang> here.)" },
  // French / Italian / German — Latin-script, forgiving.
  { id: "fr-word", locale: "fr-FR", text: "Bonjour, une grenouille.", note: "French nasal/liaison." },
  { id: "frca-word", locale: "fr-CA", text: "Bonjour, un dépanneur.", note: "Québécois — does fr-CA Puck/Aoede exist?" },
  { id: "it-word", locale: "it-IT", text: "Buongiorno, un cappello.", note: "Italian double consonant." },
  { id: "de-word", locale: "de-DE", text: "Das Eichhörnchen hat Fingerspitzengefühl.", note: "German ö/ü/compound." },
  // Russian — currently Wavenet (no ru Neural2).
  { id: "ru-word", locale: "ru-RU", text: "Здравствуйте! Привет.", note: "Russian stress/palatalization." },
  // Korean.
  { id: "ko-word", locale: "ko-KR", text: "안녕하세요. 반갑습니다.", note: "Korean." },
  // Japanese — the <sub> risk. Bare kanji + a mixed recognition frame with romaji.
  { id: "ja-kanji", locale: "ja-JP", text: "橋を渡る。端に立つ。", note: "HARD: 橋(hashi)/端(hashi) heteronyms — does it read them right WITHOUT <sub>?" },
  { id: "ja-frame", locale: "ja-JP", text: "'こんにちは (konnichiwa)' はどういう意味ですか？(wa dou iu imi desu ka?)", note: "HARD: does it READ the (romaji) aloud? SSML pipeline suppressed that." },
  // Chinese — tones + heteronym + mixed frame with pinyin.
  { id: "zh-tones", locale: "cmn-CN", text: "妈 麻 马 骂。银行。", note: "HARD: four tones + 行 heteronym (háng/xíng) — tones correct WITHOUT tone control?" },
  { id: "zh-frame", locale: "cmn-CN", text: "'你好 (nǐ hǎo)' 是什么意思？(shì shénme yìsi?)", note: "HARD: does it read the (pinyin) aloud?" },
];

async function listVoices() {
  const r = await fetch(`https://texttospeech.googleapis.com/v1/voices?key=${KEY}`);
  if (!r.ok) throw new Error(`voices:list ${r.status} ${await r.text()}`);
  const { voices } = await r.json();
  return voices || [];
}

async function synth(text, voiceName, languageCode) {
  const r = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      input: { text },                        // PLAIN TEXT — no SSML (Chirp3-HD ignores it)
      voice: { languageCode, name: voiceName },
      audioConfig: { audioEncoding: "MP3" },
    }),
  });
  if (!r.ok) return { ok: false, err: `${r.status} ${(await r.text()).slice(0, 160)}` };
  const { audioContent } = await r.json();
  return { ok: true, buf: Buffer.from(audioContent, "base64") };
}

(async () => {
  const outDir = path.join(process.cwd(), "tts-probe");
  fs.mkdirSync(outDir, { recursive: true });

  // 1) COVERAGE
  console.log("\n=== Chirp3-HD Puck/Aoede coverage (voices:list) ===");
  let all;
  try { all = await listVoices(); } catch (e) { console.error(e.message); process.exit(1); }
  const has = (loc, persona) => all.some((v) => v.name === `${loc}-Chirp3-HD-${persona}`);
  const chirpAny = (loc) => all.filter((v) => v.name.startsWith(`${loc}-Chirp3-HD-`)).map((v) => v.name.replace(`${loc}-Chirp3-HD-`, ""));
  for (const loc of LOCALES) {
    const p = has(loc, "Puck"), a = has(loc, "Aoede");
    console.log(`  ${loc.padEnd(7)} Puck:${p ? "✅" : "❌"} Aoede:${a ? "✅" : "❌"}   ${(!p || !a) ? "other Chirp3-HD: " + (chirpAny(loc).join(", ") || "(none)") : ""}`);
  }

  // 2) PRONUNCIATION — synth each test in each persona
  console.log("\n=== Synthesizing test phrases (plain text, no SSML) ===");
  const manifest = [];
  for (const t of TESTS) {
    for (const persona of PERSONAS) {
      const voiceName = `${t.locale}-Chirp3-HD-${persona}`;
      const res = await synth(t.text, voiceName, t.locale);
      const file = `${t.id}-${persona}.mp3`;
      if (res.ok) {
        fs.writeFileSync(path.join(outDir, file), res.buf);
        console.log(`  ✅ ${file}`);
      } else {
        console.log(`  ❌ ${file} — ${res.err}`);
      }
      manifest.push({ file, ok: res.ok, locale: t.locale, persona, text: t.text, note: t.note, err: res.err });
    }
  }
  fs.writeFileSync(path.join(outDir, "_manifest.json"), JSON.stringify(manifest, null, 2));

  // Listening guide
  console.log("\n=== What to listen for (open ./tts-probe/) ===");
  for (const t of TESTS) console.log(`  ${t.id.padEnd(14)} [${t.locale}] ${t.note}`);
  console.log("\nKey questions:");
  console.log("  • Do en-US Puck/Aoede sound like your tutorial voices?");
  console.log("  • ja-kanji / zh-tones: are readings & tones correct without SSML control?");
  console.log("  • ja-frame / zh-frame: does it wrongly READ the (romaji)/(pinyin) aloud?");
  console.log("  • es-crosslang: is the English word 'window' spoken cleanly or mangled?");
  console.log("  • Any ❌ coverage above = that locale has no Puck/Aoede (needs a fallback persona).");
  console.log("\nTell me the verdict and I'll write the engine rewrite accordingly.\n");
})();

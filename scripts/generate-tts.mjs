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
  jaForEn: "ja-JP-Neural2-B", // female. Neural2 confirmed live 2026-07-13; Chirp3-HD ignored (no SSML/rate)
  koForEn: "ko-KR-Neural2-A", // PROVISIONAL — confirm against voices:list ko-KR before the
                              // paid run (standing rule); Google's de refresh proved letters
                              // churn. verifyVoices hard-fails if A isn't live — override with
                              // --voice and update here once ears have picked the variant.
  ruForEn: "ru-RU-Wavenet-A", // female. NO ru-RU Neural2 EXISTS (voices:list 2026-07-15:
                              // ru-RU offers only Chirp3-HD [no SSML/rate — unusable here],
                              // Standard, and Wavenet). So ru is the first track to break the
                              // all-Neural2 pattern: Wavenet is the best SSML-compatible family
                              // Google ships for ru-RU, and honors <lang>/<break>/<sub> + rate.
                              // Females A/C/E, males B/D — A matches the cross-track female
                              // default; override with --voice and update here if ears prefer.
  zhForEn: "cmn-CN-Wavenet-A", // female. NO cmn-CN Neural2 EXISTS (voices:list 2026-07-15:
                               // cmn-CN offers only Chirp3-HD [no SSML/rate — unusable here],
                               // Standard, and Wavenet). Second track after ru forced off the
                               // all-Neural2 pattern, same cause: Wavenet is the best SSML-
                               // compatible family Google ships for cmn-CN and honors <lang>/
                               // <break> + rate — required for the en→zh production handoff.
                               // NOTE the locale is cmn-CN, not zh-CN: the voice NAME is cmn-CN-*,
                               // so name.split("-").slice(0,2) yields cmn-CN for both preflight and
                               // synth — no parsing change needed. Females A/D, males B/C — A
                               // matches the cross-track female default; override with --voice.
};

// Voice-aware key schema: clips named {hash}-{voiceName}.mp3 instead of
// {hash}.mp3, so a future second voice per track never collides. As of the
// TTS sync-job session (2026-07-14) ALL tracks are voice-keyed — es/frCa/de
// were re-keyed here (re-synthesis ≈ $0) alongside ja, which shipped voice-
// keyed from day one. New tracks are added below at their first pass. The
// client resolves filenames via the manifest's per-clip `f` field — it must
// never construct filenames itself, so re-keying was a manifest-only change
// on the client side.
//
// One-time follow-through after flipping a track into this set: regenerate it
// with --upload against DEV (the run synthesizes under the new filenames and
// leaves the old plain clips as local + bucket orphans), then sweep-tts.mjs
// --delete against dev to clear the old plain clips. Prod orphans are cleared
// by a guarded one-time prod sweep — see docs/tts-sync-runbook.md.
const VOICE_KEYED_TRACKS = new Set(["esForEn", "frCaForEn", "deForEn", "jaForEn", "koForEn", "ruForEn", "zhForEn"]);
// #87: tracks that also synthesize ANSWER-CHOICE audio (tap-to-play, review
// mode only, client-gated). Scoped to the categories whose options are
// reliably full target-language — see the choice-audio block in extractSpoken.
const CHOICE_AUDIO_TRACKS = new Set(["esForEn"]);
const CHOICE_AUDIO_CATS = ["trad", "verbo"];
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
  // ja notes (added at the jaForEn pass — es/fr/de rules above are untouched,
  // so esForEn/frCaForEn/deForEn need no --force after this change):
  // - Content strings pack script + romaji ("友達 (tomodachi)"), and prompt
  //   frames carry a whole-sentence romaji parenthetical. Spoken text strips
  //   every ASCII (...) whose preceding non-space char is CJK — the romaji is
  //   a reading aid for the eyes, not something to say twice. English content
  //   parens ("(said before eating)", the "(duration)" in a gloss) survive
  //   because they follow Latin text. Stripping happens AFTER hashing: keys
  //   stay derivable from the raw prompt the client has.
  // - Recognition shape: 'X' はどういう意味ですか？ — X is target-language.
  //   Production shape: 'X' は日本語で何と言いますか？ — X is the English
  //   gloss, native <lang> span (¿Cómo se dice...? / Wie sagt man...? class).
  // - Heteronym kanji: the romaji parenthetical is the intended-reading
  //   record. Every quoted recognition headword containing kanji gets an SSML
  //   <sub alias="かな"> built by converting its romaji to hiragana — TTS
  //   guesses readings on isolated words (家 ie/uchi, 日 hi/nichi, 今日), so
  //   we substitute universally rather than curate a heteronym list. The
  //   converter hard-fails the whole run on any romaji it can't fully
  //   convert; it never emits a partial alias.
  // - English hint tails on gram cloze prompts (`... — "I'll go TOO"`) get a
  //   native <lang> span when the tail is CJK-free. Prompts with no CJK at
  //   all (keigo scenario questions) go whole-native-voice like trad.
  // - Accepted warts, same class as de's "hand shoe": short English inside a
  //   CJK prompt without an em-dash tail (`食べます means...`, `Which is true
  //   of は vs. が?`) is spoken ja-accented.
  ja: {
    production: /^()'(.+)'( は日本語で何と言いますか？)$/,
    knownQuoted: /^'.+' はどういう意味ですか/,
    quoteDetect: (text) => /(^|[\s(])'[^']+'(?=[\s).,:;?!…？！、。」]|$)/.test(text),
    deriveSpoken: stripCJKReadingParens,
    targetScript: /[\u3040-\u30FF\u3400-\u9FFF\uF900-\uFAFF々]/, // kana or kanji anywhere?
    nativeWhenNoTarget: true, // no CJK at all → whole prompt is native-language
    nativeTail: true, // ` — <english hint>` tails get a native <lang> span
    subReading: true, // quoted kanji headwords get <sub alias=hiragana(romaji)>
  },
  // ko notes (added at the koForEn pass — es/fr/de/ja rules above are
  // untouched, so those tracks need no --force after this change):
  // - Content packs hangul + Revised-Romanization together ("물 (mul)"), and
  //   prompt frames carry a whole-sentence RR parenthetical. Spoken text
  //   strips the RR the same spirit as ja's romaji strip — but ko needs TWO
  //   passes (stripKoreanReadingParens), because some gram cloze prompts put
  //   an English em-dash hint BETWEEN the hangul and its trailing RR paren
  //   (`학교___ 가요. — "I go TO school" (Hakgyo___ gayo.)`), so the RR follows
  //   Latin, not hangul, and a preceded-by-hangul rule alone misses it.
  //   Stripping happens AFTER hashing: keys stay derivable from the raw prompt
  //   the client has.
  // - NO subReading (the big divergence from ja): hangul is phonetic, so
  //   ko-KR TTS reads headwords correctly — including the standard batchim
  //   liaison/assimilation a native voice applies. The fono category (which
  //   teaches those sound changes explicitly) is extraBank, already excluded.
  // - Recognition shape: 'X'은/는 무슨 뜻이에요? — X is target-language, spoken
  //   as-is. The 은/는 particle sits flush against the closing quote (no
  //   boundary), so quoteDetect reads false there and it never review-flags.
  //   Production shape: 'X', 한국어로 뭐라고 해요? — X is the English gloss,
  //   native <lang> span (¿Cómo se dice...? / は日本語で class).
  // - English hint tails on gram cloze prompts get a native <lang> span when
  //   target-script-free; prompts with no hangul at all (trad "Translate:
  //   '...'") go whole-native-voice, and their English "(note)" survives
  //   because those prompts carry no hangul for the trailing-paren strip to
  //   trigger on — matching ja's preserved trad notes.
  ko: {
    production: /^()'(.+)'(, 한국어로 뭐라고 해요\?)$/,
    knownQuoted: /^'.+'[은는] 무슨 뜻이에요/,
    quoteDetect: (text) => /(^|[\s(])'[^']+'(?=[\s).,:;?!…]|$)/.test(text),
    deriveSpoken: stripKoreanReadingParens,
    targetScript: /[\uAC00-\uD7A3]/, // any hangul syllable block
    nativeWhenNoTarget: true, // no hangul at all → whole prompt is native-language
    nativeTail: true, // ` — <english hint>` tails get a native <lang> span
  },
  // ru notes (added at the ruForEn pass — es/fr/de/ja/ko rules above are
  // untouched, so those tracks need no --force after this change):
  // - Cyrillic is alphabetic/phonetic → NO subReading (ko's divergence from ja
  //   transfers). ru-RU TTS reads headwords correctly on its own, including
  //   akanye vowel reduction and final devoicing; the fono category that
  //   teaches those explicitly is extraBank, already excluded.
  // - Recognition shape: 'X' значит... — X is target-language (Cyrillic),
  //   spoken as-is (knownQuoted). Production shape: Как сказать 'X' по-русски?
  //   — X is the English gloss, gets the native <lang> span (¿Cómo se dice...?
  //   / Wie sagt man...? / は日本語で class). Greedy .+ so glosses with inner
  //   apostrophes ("with one's own eyes") don't truncate on the closing quote.
  // - trad "Translate: '...'" prompts are whole-native English, caught by the
  //   shared translate branch — same as every other track.
  // - deriveSpoken drops an English gloss paren that trails Cyrillic (the one
  //   curated gram item above); see stripCyrillicGlossParens for why it only
  //   ever fires there.
  // - Accepted review flag: 'Стол' — какого рода? (gram) has a leading quoted
  //   Cyrillic span that isn't a значит-recognition, so it review-flags. Benign
  //   — target-language, spoken correctly as-is. Same accepted-flag class as ja/ko.
  ru: {
    production: /^(Как сказать )'(.+)'( по-русски\?)$/,
    knownQuoted: /^'.+'\s+значит/,
    quoteDetect: (text) => /(^|[\s(])'[^']+'(?=[\s).,:;?!…]|$)/.test(text),
    deriveSpoken: stripCyrillicGlossParens,
  },
  // zh notes (added at the zhForEn pass — es/fr/de/ja/ko/ru rules above are
  // untouched, so those tracks need no --force after this change):
  // - Content packs hanzi + pinyin ("谢谢 (xièxie)") in CITATION tones (sandhi
  //   never pre-applied), and recognition frames carry the pinyin on the quoted
  //   headword. Spoken text strips the pinyin in the same spirit as ja's romaji
  //   strip — it REUSES stripCJKReadingParens directly, since CJK_CONTEXT already
  //   covers hanzi: a paren whose preceding substantive char is hanzi is a
  //   reading aid → stripped; a paren following Latin (a production gloss's
  //   "(informal)", a trad "(note)") is kept and spoken. Single pass suffices
  //   because zh puts pinyin ONLY on the mid-prompt headword (hanzi-preceded) —
  //   there is no ko-style whole-sentence RR paren trailing an English hint, so
  //   no second final-paren pass is needed. (If a dry-run manifest ever shows a
  //   residual "(pinyin)" in a clip's `t`, that assumption broke — add ko's
  //   second pass then, not blindly now.) Strips AFTER hashing, so keys stay
  //   derivable from the raw prompt the client has.
  // - Recognition shape: 'X (pīnyīn)' 是什么意思？ — X is target-language (hanzi),
  //   spoken as-is after the pinyin strip (knownQuoted). Production shape:
  //   'X' 用中文怎么说？ — X is the English gloss, gets the native <lang> span
  //   (¿Cómo se dice...? / は日本語で / Как сказать class). The WB `fvocab`
  //   category is production-framed, so ALL ~600 WB items exercise the en→zh
  //   <lang> handoff — the #1 audition item (Wavenet honors <lang>, per ru).
  //   Greedy .+ so glosses with inner apostrophes ("with one's own") and inner
  //   parens don't truncate; tail \s* since CJK frames may omit the space.
  // - trad "Translate: '...'" prompts are whole-native English (shared translate
  //   branch — the quoted phrase there is the English source, not a target word);
  //   any prompt with no hanzi at all also goes native (nativeWhenNoTarget).
  // - NO subReading — DEFERRED, not "not needed" (this is the divergence from
  //   ko/ru, whose phonetic scripts genuinely don't need it): zh is logographic,
  //   so the isolated-headword heteronym risk ja solves with <sub> IS real here
  //   (多音字: 银行 háng, 教 jiāo, 长 cháng, 便宜 pián, 还 hái, 薄 báo, 觉/睡觉
  //   jiào…). But ja's fix maps romaji→kana, an unambiguous TTS-safe script; raw
  //   pinyin in <sub>/<phoneme> is NOT verified to render correct tones on cmn-CN
  //   Wavenet, and blind-shipping an unhonored tag would 400 or mis-speak every
  //   heteronym clip. So: engine-default readings this pass, heteronyms are the
  //   top audition item, and a CURATED <phoneme alphabet="pinyin"> pass is a
  //   follow-up IFF audition shows the engine both mis-reads AND honors the tag.
  //   Exposure is the ~10 listed 多音字, not the whole bank (most headwords are
  //   single-reading).
  // - Accepted review flag (same class as ja/ko/ru): a leading quoted-hanzi gram
  //   prompt that isn't a 是什么意思-recognition review-flags benignly — target-
  //   language, spoken correctly as-is; the flag is look-don't-block.
  zh: {
    production: /^()'(.+)'(\s*用中文怎么说？)$/,
    knownQuoted: /^'.+'\s*是什么意思/,
    quoteDetect: (text) => /(^|[\s(])'[^']+'(?=[\s).,:;?!…？！、。」]|$)/.test(text),
    deriveSpoken: stripCJKReadingParens,
    targetScript: /[\u3400-\u9FFF\uF900-\uFAFF々〇]/, // any hanzi (CJK unified + ext-A + compat + 々〇)
    nativeWhenNoTarget: true, // no hanzi at all → whole prompt is native-language
    nativeTail: true, // ` — <english hint>` tails get a native <lang> span
  },
};

// ---------- ja helpers ----------
// CJK detection for the paren-strip rule: hiragana, katakana, CJK unified
// ideographs (+ext A / compat), CJK symbols/punctuation (。、「」), and
// full-width forms (？！). Latin text never matches.
const CJK_CONTEXT = /[\u3000-\u303F\u3040-\u30FF\u3400-\u9FFF\uF900-\uFAFF\uFF00-\uFFEF々]/;
const HAS_KANJI = /[\u3400-\u9FFF\uF900-\uFAFF々]/;

// Strip ASCII parentheticals that annotate CJK text (romaji readings).
// Walk back from the "(" past whitespace and trailing ASCII punctuation
// (?!._… and cloze underscores — "元気です___? (Genki desu ___?)"); if the
// first substantive char is CJK, the parenthetical is a reading aid → strip.
// If it's Latin ("'Thanks for the meal.' (said before eating)"), keep it.
function stripCJKReadingParens(text) {
  return text
    .replace(/\s*\(([^)]*)\)/g, (m, _inner, idx, whole) => {
      let j = idx - 1;
      while (j >= 0 && /[\s?!._…]/.test(whole[j])) j--;
      return j >= 0 && CJK_CONTEXT.test(whole[j]) ? "" : m;
    })
    .replace(/ {2,}/g, " ")
    .trim();
}

// Wapuro-Hepburn romaji → hiragana. Deliberately strict: returns null on
// ANY unconvertible remainder rather than guessing — the caller hard-fails
// the run and lists offenders. Handles sokuon doubling (kitte, matcha via
// "tch"), the n/n' rules (kan'youku, onna), and the yōon digraphs. Long
// vowels are written out in wapuro (ou/uu/ei), so they need no logic.
const KANA_MAP = {
  kya: "きゃ", kyu: "きゅ", kyo: "きょ", sha: "しゃ", shu: "しゅ", sho: "しょ",
  cha: "ちゃ", chu: "ちゅ", cho: "ちょ", nya: "にゃ", nyu: "にゅ", nyo: "にょ",
  hya: "ひゃ", hyu: "ひゅ", hyo: "ひょ", mya: "みゃ", myu: "みゅ", myo: "みょ",
  rya: "りゃ", ryu: "りゅ", ryo: "りょ", gya: "ぎゃ", gyu: "ぎゅ", gyo: "ぎょ",
  ja: "じゃ", ju: "じゅ", jo: "じょ", bya: "びゃ", byu: "びゅ", byo: "びょ",
  pya: "ぴゃ", pyu: "ぴゅ", pyo: "ぴょ",
  shi: "し", chi: "ち", tsu: "つ", fu: "ふ", ji: "じ",
  ka: "か", ki: "き", ku: "く", ke: "け", ko: "こ",
  sa: "さ", su: "す", se: "せ", so: "そ",
  ta: "た", te: "て", to: "と",
  na: "な", ni: "に", nu: "ぬ", ne: "ね", no: "の",
  ha: "は", hi: "ひ", he: "へ", ho: "ほ",
  ma: "ま", mi: "み", mu: "む", me: "め", mo: "も",
  ya: "や", yu: "ゆ", yo: "よ",
  ra: "ら", ri: "り", ru: "る", re: "れ", ro: "ろ",
  wa: "わ", wo: "を",
  ga: "が", gi: "ぎ", gu: "ぐ", ge: "げ", go: "ご",
  za: "ざ", zu: "ず", ze: "ぜ", zo: "ぞ",
  da: "だ", de: "で", do: "ど",
  ba: "ば", bi: "び", bu: "ぶ", be: "べ", bo: "ぼ",
  pa: "ぱ", pi: "ぴ", pu: "ぷ", pe: "ぺ", po: "ぽ",
  a: "あ", i: "い", u: "う", e: "え", o: "お",
};
function romajiToHiragana(romaji) {
  let s = romaji.toLowerCase().replace(/[\s,]+/g, "");
  let out = "";
  while (s.length) {
    if (/^([kstpgzjdbfc])\1/.test(s) || s.startsWith("tch")) { out += "っ"; s = s.slice(1); continue; }
    if (s.startsWith("n'")) { out += "ん"; s = s.slice(2); continue; }
    if (s[0] === "n" && (s.length === 1 || !/[aiueoy]/.test(s[1]))) { out += "ん"; s = s.slice(1); continue; }
    let matched = false;
    for (const len of [3, 2, 1]) {
      const tok = s.slice(0, len);
      if (KANA_MAP[tok]) { out += KANA_MAP[tok]; s = s.slice(len); matched = true; break; }
    }
    if (!matched) return null;
  }
  return out;
}

// If a prompt opens with a quoted headword that packs a reading —
// 'friend 漢字 (romaji)' shapes — and the headword contains kanji, return
// { word, alias } for an SSML <sub>. Latin-only words (production glosses,
// even ones with their own parens like "time (duration)") return null.
function readingSub(rawText) {
  const m = rawText.match(/^'([^']+?)\s*\(([^)]+)\)'/);
  if (!m || !HAS_KANJI.test(m[1])) return null;
  const alias = romajiToHiragana(m[2]);
  return { word: m[1], alias }; // alias === null → caller hard-fails
}

// ---------- ko helpers ----------
// Hangul syllable blocks (U+AC00–U+D7A3). Jamo aren't used in this track's
// prompts, so the syllable range is sufficient for both stripping and the
// targetScript test.
const HANGUL_BLOCK = /[\uAC00-\uD7A3]/;

// Strip Revised-Romanization reading aids from ko spoken text. Two passes,
// because ko prompt frames don't put the RR in one consistent position:
//   (a) parens whose preceding substantive char is hangul — the mid-prompt
//       headword reading ("'물 (mul)'…" → "'물'…") and any RR that trails
//       hangul directly ("…해요? (…)" → "…해요?"). Walk-back skips whitespace,
//       terminal punctuation, and cloze underscores, mirroring the ja rule.
//   (b) a FINAL paren that (a) missed because it follows an English em-dash
//       hint ("…가요. — \"I go TO school\" (Hakgyo___ gayo.)"). Only strips
//       when hangul appears earlier in the prompt, so trad "Translate: '…'
//       (set phrase…)" — which has no hangul in the prompt itself — keeps its
//       English note and speaks it in the native voice, exactly as ja does.
// English glosses that trail hangul (the rare "(\"Elephants…\")" aside) are
// dropped from audio too; that's correct — spoken, they'd be read hangul-
// accented, and they're a visual aid, not something to say.
function stripKoreanReadingParens(text) {
  let out = text.replace(/\s*\(([^)]*)\)/g, (m, _inner, idx, whole) => {
    let j = idx - 1;
    while (j >= 0 && /[\s?!._…]/.test(whole[j])) j--;
    return j >= 0 && HANGUL_BLOCK.test(whole[j]) ? "" : m;
  });
  out = out.replace(/\s*\(([^)]*)\)\s*$/, (m, _inner, idx, whole) =>
    HANGUL_BLOCK.test(whole.slice(0, idx)) ? "" : m
  );
  return out.replace(/ {2,}/g, " ").trim();
}

// ---------- ru helpers ----------
// Basic Cyrillic block (covers all modern Russian letters incl. ё U+0451).
const CYRILLIC = /[\u0400-\u04FF]/;
// Drop an English translation-gloss paren that trails Cyrillic — the single
// curated gram item 'Я студент. ("I am a student.")'. Mirrors the ja/ko
// reading-paren strip: walk back past whitespace and terminal punctuation; if
// the preceding substantive char is Cyrillic, the paren is a visual gloss →
// drop it from audio (still shown on screen). Production glosses ("to buy
// (impf.)") are Latin-preceded → kept, and the production branch <lang>-tags
// them; trad parens follow a quote → kept and spoken in the native voice. WB
// prompts carry no parens (ruWords has no romanization). Strips AFTER hashing,
// so keys stay client-derivable.
function stripCyrillicGlossParens(text) {
  return text
    .replace(/\s*\(([^)]*)\)/g, (m, _inner, idx, whole) => {
      let j = idx - 1;
      while (j >= 0 && /[\s?!._…]/.test(whole[j])) j--;
      return j >= 0 && CYRILLIC.test(whole[j]) ? "" : m;
    })
    .replace(/ {2,}/g, " ")
    .trim();
}

// ---------- spoken-text extraction ----------
function extractSpoken(track) {
  const items = []; // { key, text, ssml, sources: [questionId,...] }
  const byKey = new Map();
  const review = [];

  const nativeLocale = NATIVE_TTS_LOCALE[track.nativeLang] || "en-US";
  const rules = LANG_RULES[track.targetLang] || LANG_RULES.es;
  const voiceKeyed = VOICE_KEYED_TRACKS.has(TRACK);
  const readingFailures = [];

  Object.keys(track.bank).forEach((cat) => {
    track.bank[cat].forEach((q, i) => {
      const id = `${cat}-${i}`;
      const raw = q[0];
      const text = normalizeSpokenText(raw);
      // KEY comes from the raw normalized prompt — the client must be able
      // to derive it from the question text it already has. Language-level
      // spoken-text transforms (ja romaji stripping) apply AFTER hashing.
      const key = audioKey(text);
      if (byKey.has(key)) {
        const prior = byKey.get(key);
        if (prior.rawText !== text) {
          // Hash collision between different texts — abort loudly.
          console.error(`FATAL: audioKey collision: "${prior.rawText}" vs "${text}"`);
          process.exit(1);
        }
        prior.sources.push(id);
        return;
      }
      const spoken = rules.deriveSpoken ? rules.deriveSpoken(text) : text;
      // ja: quoted kanji headwords carry their intended reading in the raw
      // text's romaji parenthetical → SSML <sub>. Unconvertible romaji is a
      // content bug; collect every offender, then hard-fail below.
      let sub = null;
      if (rules.subReading) {
        sub = readingSub(text);
        if (sub && sub.alias === null) readingFailures.push({ id, word: sub.word, text });
      }
      const { ssml, flagged, voice } = toSSML(spoken, nativeLocale, rules, sub);
      if (flagged) review.push({ id, text: spoken });
      const item = { key, rawText: text, text: spoken, ssml, voice, sources: [id] };
      item.file = voiceKeyed ? `${key}-${voice === "native" ? NATIVE_VOICE : VOICE}.mp3` : `${key}.mp3`;
      byKey.set(key, item);
      items.push(item);
    });
  });

  // #87: answer-choice audio (esForEn pilot). Synthesize the OPTION strings of
  // the categories whose options are reliably full target-language — trad
  // (idioms/translation) and verbo (conjugations). vocab/fvocab options are
  // frequently English glosses and fono is itself a listening exercise, so both
  // are deferred (a per-option language tag would be the clean way in). Options
  // carry no production/translate framing and no cloze gaps, so they're
  // synthesized as-is with the TARGET voice. The client keys off the displayed
  // option text, so any un-synthesized option simply gets no speaker button.
  if (CHOICE_AUDIO_TRACKS.has(TRACK)) {
    let choiceCount = 0;
    CHOICE_AUDIO_CATS.forEach((cat) => {
      (track.bank[cat] || []).forEach((q, i) => {
        (q[1] || []).forEach((optRaw, oi) => {
          const text = normalizeSpokenText(optRaw);
          if (!text) return;
          const key = audioKey(text);
          const src = `${cat}-${i}-opt${oi}`;
          if (byKey.has(key)) {
            byKey.get(key).sources.push(src);
            return;
          }
          const item = { key, rawText: text, text, ssml: `<speak>${xmlEscape(text)}</speak>`, voice: "target", sources: [src] };
          item.file = voiceKeyed ? `${key}-${VOICE}.mp3` : `${key}.mp3`;
          byKey.set(key, item);
          items.push(item);
          choiceCount++;
        });
      });
    });
    if (choiceCount) console.log(`Choice audio: +${choiceCount} option clips (${CHOICE_AUDIO_CATS.join(", ")})`);
  }

  if (readingFailures.length) {
    console.error(`FATAL: ${readingFailures.length} romaji reading(s) could not be converted to hiragana:`);
    readingFailures.forEach((f) => console.error(`  ${f.id}\t${f.word}\t${f.text}`));
    console.error("Fix the romaji (wapuro Hepburn) or extend KANA_MAP. No synthesis attempted.");
    process.exit(1);
  }

  return { items, review };
}

function xmlEscape(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

// Build SSML for one prompt. Returns { ssml, flagged, voice } — flagged
// means a quoted span we did NOT confidently language-tag; voice is
// "target" (default) or "native" (the whole prompt is the learner's
// native language, e.g. the trad category's "Translate: '...'" prompts).
function toSSML(text, nativeLocale, rules, sub = null) {
  let flagged = false;
  let voice = "target";
  let body;

  const translate = text.match(/^Translate:\s*'/i);
  const production = text.match(rules.production);
  if (translate || (rules.nativeWhenNoTarget && !rules.targetScript.test(text))) {
    // Whole prompt is native-language — synthesize with the native voice.
    // Two ways in: the trad "Translate: '...'" frame, or (ja) a prompt with
    // no target-script characters at all (keigo scenario questions).
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

    // ja: substitute the intended reading for the quoted kanji headword —
    // TTS guesses readings on isolated words; the romaji parenthetical is
    // authoritative. Applied to the escaped body (kanji and kana are
    // untouched by xmlEscape; the quotes become &apos;).
    if (sub && sub.alias) {
      const quoted = `&apos;${xmlEscape(sub.word)}&apos;`;
      body = body.replace(quoted, `&apos;<sub alias="${sub.alias}">${xmlEscape(sub.word)}</sub>&apos;`);
    }

    // ja: English hint tails on gram cloze prompts (`... — "IF it rains, I
    // won't go"`) get a native <lang> span, iff the tail is target-script-
    // free. Only in this branch — production/translate bodies never carry
    // these tails.
    if (rules.nativeTail) {
      const tail = body.match(/^(.*) — (.+)$/);
      if (tail && !rules.targetScript.test(tail[2])) {
        body = `${tail[1]} — <lang xml:lang="${nativeLocale}">${tail[2]}</lang>`;
      }
    }
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
// Compared by full filename, so plain and voice-keyed schemas both work.
if (!FORCE) {
  const existing = new Set(await readdir(outDir).catch(() => []));
  todo = todo.filter((it) => !existing.has(it.file));
}
if (LIMIT) todo = todo.slice(0, LIMIT);

const totalChars = items.reduce((n, it) => n + it.text.length, 0);
console.log(`Track: ${track.id} (${TRACK})`);
console.log(`Voice: ${VOICE}  native voice: ${NATIVE_VOICE}  rate: ${SPEAKING_RATE}`);
console.log(`Key schema: ${VOICE_KEYED_TRACKS.has(TRACK) ? "voice-keyed ({hash}-{voice}.mp3)" : "plain ({hash}.mp3)"}`);
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
  writeFileSync(path.join(outDir, item.file), mp3);
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
  // "plain" = {hash}.mp3, "voice-keyed" = {hash}-{voice}.mp3. The client
  // must resolve clip URLs through `f` below and never build filenames —
  // that makes the sync-job re-key of the plain tracks a manifest-only
  // change on the client side.
  keySchema: VOICE_KEYED_TRACKS.has(TRACK) ? "voice-keyed" : "plain",
  generatedAt: new Date().toISOString(),
  count: items.length,
  // key → { t: spoken text (post language transforms), v: "target" |
  // "native", f: filename in the bucket }. Voice kind is informational —
  // it is NOT part of the hash, so reclassifying a prompt's voice later
  // requires a --force regeneration (see runbook).
  clips: Object.fromEntries(items.map((it) => [it.key, { t: it.text, v: it.voice, f: it.file }])),
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

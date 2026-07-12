// Frequency-vocabulary generator (pilot: esForEn Word Bank, 2026-07-10).
//
// Turns a compact frequency-ranked word list into standard 7-slot bank
// entries at module load, so everything downstream (rounds, mastery,
// freshness, placement, promptNative subtitles) works with ZERO engine
// changes. One question per word, alternating direction:
//   even index  → recognition:  "'La cocina' significa..."  (options in English)
//   odd index   → production:   "¿Cómo se dice 'kitchen' en español?" (options in Spanish)
//
// Word tuple: [word, gloss, pos, tier, note?]
//   word  — target-language form, nouns carry their article ("la cocina")
//   gloss — concise English meaning
//   pos   — "n" | "v" | "adj" | "adv" | "x" (expressions/other)
//   tier  — CEFR band, assigned by frequency rank
//   note  — optional teaching note appended to the explanation
//
// Distractors: 3 entries sampled from the SAME pos and (when possible) the
// same tier, deterministically (seeded PRNG — the bank must be identical on
// every load or mastery IDs would drift). A token-overlap filter rejects
// candidates whose gloss shares a word with the answer's gloss, so
// near-synonyms can't produce two defensible answers.

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const STOP = new Set(["a", "an", "the", "to", "of", "in", "on", "for", "up", "out", "at", "by", "or", "and", "with", "be", "get", "go", "one's", "oneself", "something", "someone"]);

function glossTokens(gloss) {
  return new Set(
    gloss
      .toLowerCase()
      .replace(/\(.*?\)/g, " ")
      .split(/[^a-zà-ÿ']+/)
      .filter((t) => t && !STOP.has(t))
  );
}

function overlaps(a, b) {
  const ta = glossTokens(a);
  for (const t of glossTokens(b)) if (ta.has(t)) return true;
  return false;
}

function stripArticle(word) {
  return word.replace(/^(el|la|los|las)\s+/i, "");
}

// Generalized 2026-07-12 for the frCaForEn Word Bank: every language-specific
// string is a formula that callers can override. The Spanish defaults below
// are byte-identical to the pilot's hardcoded strings — they MUST stay that
// way (esForEn's TTS clip keys hash prompt text, and shipped mastery/seen
// state keys off positional ids within an identical bank). New tracks pass
// their own `formulas`; the seeded PRNG is unaffected by formula choice
// (rand() is only consumed by distractor picking, which depends solely on
// the word list).
const SPANISH_FORMULAS = {
  recognitionPrompt: (word) => `'${cap(word)}' significa...`,
  recognitionNative: (word, gloss) => ({ en: `'${cap(word)}' means...` }),
  recognitionExplain: (word, gloss, noteEn) => ({
    en: `'${cap(word)}' means ${gloss}.${noteEn}`,
    es: `'${cap(word)}' significa ${gloss}.`,
  }),
  productionPrompt: (gloss, promptLangName) => `¿Cómo se dice '${gloss}' en ${promptLangName}?`,
  productionNative: (gloss) => ({ en: `How do you say '${gloss}' in Spanish?` }),
  productionExplain: (word, gloss, noteEn) => ({
    en: `'${gloss}' is '${word}'.${noteEn}`,
    es: `'${gloss}' se dice '${word}'.`,
  }),
};

export function buildFrequencyBank(words, { promptLangName = "español", seed = 20260710, formulas = {} } = {}) {
  const f = { ...SPANISH_FORMULAS, ...formulas };
  const rand = mulberry32(seed);
  const byPos = {};
  words.forEach((w, i) => {
    const pos = w[2];
    (byPos[pos] = byPos[pos] || []).push(i);
  });

  const pickDistractors = (idx) => {
    const [word, gloss, pos, tier] = words[idx];
    const pool = byPos[pos].filter((j) => j !== idx);
    // Same-tier candidates first, everything same-pos as fallback.
    const sameTier = pool.filter((j) => words[j][3] === tier);
    const ordered = [...sameTier, ...pool.filter((j) => words[j][3] !== tier)];
    const chosen = [];
    const used = new Set();
    // Deterministic shuffle-walk over the ordered pool.
    const walk = ordered
      .map((j) => [j, rand()])
      .sort((a, b) => a[1] - b[1])
      .map((p) => p[0]);
    // Bias back toward same tier: stable partition already applied above,
    // the shuffle is within the combined list — re-sort same-tier first.
    walk.sort((a, b) => (words[a][3] === tier ? 0 : 1) - (words[b][3] === tier ? 0 : 1));
    for (const j of walk) {
      if (chosen.length === 3) break;
      const [dw, dg] = words[j];
      if (used.has(dg) || dg === gloss || dw === word) continue;
      if (overlaps(dg, gloss)) continue;
      if (chosen.some(([, g]) => overlaps(g, dg))) continue;
      used.add(dg);
      chosen.push([dw, dg]);
    }
    return chosen;
  };

  const bank = [];
  words.forEach((w, i) => {
    const [word, gloss, pos, tier, note] = w;
    const distractors = pickDistractors(i);
    if (distractors.length < 3) return; // skip rather than ship a thin question
    // Teaching notes are authored in English and shown only in the English
    // explanation — the es side keeps the clean formula.
    const noteEn = note ? ` ${note}` : "";
    if (i % 2 === 0) {
      // Recognition: target-language word → English options
      bank.push([
        f.recognitionPrompt(word),
        [gloss, ...distractors.map((d) => d[1])],
        0,
        f.recognitionExplain(word, gloss, noteEn),
        tier,
        null,
        f.recognitionNative(word, gloss),
      ]);
    } else {
      // Production: English gloss → target-language options
      bank.push([
        f.productionPrompt(gloss, promptLangName),
        [word, ...distractors.map((d) => d[0])],
        0,
        f.productionExplain(word, gloss, noteEn),
        tier,
        null,
        f.productionNative(gloss),
      ]);
    }
  });
  return bank;
}

function cap(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export const __internals = { overlaps, glossTokens, stripArticle };

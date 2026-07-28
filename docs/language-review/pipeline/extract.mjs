#!/usr/bin/env node
/**
 * extract.mjs — pull every reviewable string for ONE source language out of the repo.
 *
 *   node docs/language-review/pipeline/extract.mjs --lane es-latam [--out <file>]
 *
 * Writes <lane>-review-data.json (default: alongside this script in .cache/).
 *
 * A LANE is one reviewer relationship, not one language. Spanish has two lanes —
 * es-latam and es-spain — because the regional-variant card makes claims about BOTH
 * varieties and only a native of each can verify their own side. Every row carries a
 * `scope` naming the lane responsible for it; rows outside the current lane are kept
 * as read-only context (the card shows both halves, so the contrast is what makes the
 * in-scope row judgeable) and marked advisory.
 * That JSON is the input to build_workbook.py. Nothing here is hand-maintained:
 * re-run it after any localization change and the workbook regenerates from truth.
 *
 * WHY IT READS OBJECT LITERALS INSTEAD OF IMPORTING EVERYTHING
 * Several localization tables (STRINGS, CATEGORY_NAMES, VARIANT_NAMES, LANG_LABELS,
 * LEVEL_LABELS, LEVEL_DESCRIPTIONS) are module-private — they're reached through
 * accessor functions, not exported. Rather than edit app source to suit a docs tool,
 * this script lifts those literals out of the file text and evaluates them. They are
 * pure data (strings only, no references), so this is exact. It throws loudly if a
 * literal can't be read, so a silently-short table is not a possible outcome.
 *
 * DRIFT PROTECTION
 * After extracting the known surfaces, it sweeps app/ and lib/ for any OTHER file
 * containing a bilingual `{ en: "...", <lang>: "..." }` map and warns about the ones
 * it doesn't know. A new localized component therefore announces itself instead of
 * being quietly left out of the next review packet. Add it to KNOWN_SOURCES and,
 * if it needs extracting, to the relevant section below.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..", "..", "..");

// ---------------------------------------------------------------- args
const argv = process.argv.slice(2);
const arg = (n, d) => { const i = argv.indexOf("--" + n); return i >= 0 ? argv[i + 1] : d; };
/**
 * Lane registry. `variantScope` says which side of the regional-variant card this
 * lane is the authority for: "regional" = the default + per-country terms;
 * "reference" = the counterpart-variety terms (Spain / Portugal / France / …).
 * `ownsLocalization` marks the lane that the shared <lang> UI localization is
 * written in — there is only ONE es block in playStrings, and it is es-LatAm.
 *
 * NOTE: the reference/group pairing for fr and de in regionalVariants.js is still
 * seed data (2 records each) and reads as France↔Québec / Deutschland↔AT-CH. Confirm
 * which side owns the localization when those sources are actually built out; do not
 * assume the seed's orientation is the product decision.
 */
const LANES = {
  "es-latam": { lang: "es", label: "Español (Latinoamérica)", ownsLocalization: true,  variantScope: "regional",  counterpart: "es-spain" },
  "es-spain": { lang: "es", label: "Español (España)",        ownsLocalization: false, variantScope: "reference", counterpart: "es-latam" },
  "pt-br":    { lang: "pt", label: "Português (Brasil)",      ownsLocalization: true,  variantScope: "regional",  counterpart: "pt-pt" },
  "pt-pt":    { lang: "pt", label: "Português (Portugal)",    ownsLocalization: false, variantScope: "reference", counterpart: "pt-br" },
  "fr-fr":    { lang: "fr", label: "Français (France)",       ownsLocalization: true,  variantScope: "reference", counterpart: "fr-ca" },
  "fr-ca":    { lang: "fr", label: "Français (Québec)",       ownsLocalization: false, variantScope: "regional",  counterpart: "fr-fr" },
  "de":       { lang: "de", label: "Deutsch",                 ownsLocalization: true,  variantScope: "reference", counterpart: null },
  "it":       { lang: "it", label: "Italiano",                ownsLocalization: true,  variantScope: "reference", counterpart: null },
  "ru":       { lang: "ru", label: "Русский",                 ownsLocalization: true,  variantScope: "reference", counterpart: null },
  "ja":       { lang: "ja", label: "日本語",                   ownsLocalization: true,  variantScope: "reference", counterpart: null },
  "ko":       { lang: "ko", label: "한국어",                   ownsLocalization: true,  variantScope: "reference", counterpart: null },
  "zh":       { lang: "zh", label: "中文",                     ownsLocalization: true,  variantScope: "reference", counterpart: null },
};

/**
 * What each lane owns BEYOND the interface, split by the kind of review it needs.
 *
 *   taught      — the language as the thing being LEARNED. Reviewer asks "is this correct,
 *                 and is every distractor genuinely wrong?" Errors here teach people wrong.
 *   explanation — the language as the voice EXPLAINING another language. Reviewer asks "is
 *                 this explanation accurate and natural?" — they must be able to judge the
 *                 point being made, not just the prose.
 *
 * `slots` maps a track's BANK tuple layout, which varies per track (some carry a native
 * subtitle, some carry per-distractor notes). Indices absent from a track are simply undefined.
 */
const BANK_SLOTS = { prompt: 0, options: 1, correct: 2, explain: 3, difficulty: 4, alt: 5, promptNative: 6, extras: 7 };

const CONTENT = {
  "es-latam": {
    taught:      { tracks: ["esForEn"], vocab: ["esLatAmWords"] },
    explanation: { tracks: ["enUsForEs", "enGbForEs"],
                   glossaries: ["deWords.es", "jaWords.es", "koWords.es", "ruWords.es", "zhWords.es"],
                   l10nSample: true },
  },
  "es-spain": {
    taught:      { tracks: ["esSpainForEn"], vocab: ["esSpainWords"] },
    explanation: { tracks: [], glossaries: [], l10nSample: false },
  },
  "pt-br": {
    taught:      { tracks: ["ptBrForEn"], vocab: ["ptBrWords"] },
    explanation: { tracks: ["enUsForPt", "enGbForPt"], glossaries: [], l10nSample: true },
  },
  "pt-pt":    { taught: { tracks: ["ptPtForEn"], vocab: ["ptPtWords"] }, explanation: { tracks: [], glossaries: [], l10nSample: false } },
  "fr-fr":    { taught: { tracks: ["frForEn"],   vocab: ["frWords"] },   explanation: { tracks: [], glossaries: [], l10nSample: true } },
  "fr-ca":    { taught: { tracks: ["frCaForEn"], vocab: ["frCaWords"] }, explanation: { tracks: [], glossaries: [], l10nSample: false } },
  "de":       { taught: { tracks: ["deForEn"],   vocab: ["deWords"] },   explanation: { tracks: [], glossaries: [], l10nSample: true } },
  "it":       { taught: { tracks: ["itForEn"],   vocab: ["itWords"] },   explanation: { tracks: ["enForIt"], glossaries: [], l10nSample: true } },
  "ru":       { taught: { tracks: ["ruForEn"],   vocab: ["ruWords"] },   explanation: { tracks: [], glossaries: [], l10nSample: true } },
  "ja":       { taught: { tracks: ["jaForEn"],   vocab: ["jaWords"] },   explanation: { tracks: [], glossaries: [], l10nSample: true } },
  "ko":       { taught: { tracks: ["koForEn"],   vocab: ["koWords"] },   explanation: { tracks: [], glossaries: [], l10nSample: true } },
  "zh":       { taught: { tracks: ["zhForEn"],   vocab: ["zhWords"] },   explanation: { tracks: [], glossaries: [], l10nSample: true } },
};

const SCOPES = ["interface", "taught", "explanation"];

const LANE = arg("lane", "es-latam");
if (!LANES[LANE]) {
  console.error(`unknown lane "${LANE}". Known: ${Object.keys(LANES).join(", ")}`);
  process.exit(1);
}
const SCOPE = arg("scope", "interface");
if (!SCOPES.includes(SCOPE)) {
  console.error(`unknown scope "${SCOPE}". Known: ${SCOPES.join(", ")}`);
  process.exit(1);
}
const CFG = LANES[LANE];
const LANG = CFG.lang;
const CONTENT_CFG = (CONTENT[LANE] || {})[SCOPE] || {};
const OUT = path.resolve(arg("out", path.join(HERE, ".cache", `${LANE}-${SCOPE}-review-data.json`)));

const warnings = [];
const warn = (m) => { warnings.push(m); console.warn("  ! " + m); };
const R = (...p) => path.join(REPO, ...p);

/**
 * Every repo file this run actually read, fingerprinted by size + mtime. A packet is a
 * snapshot of a moving `dev`; without this there is no way to tell a fresh packet from one
 * built before a release beat landed, and a stale packet costs a reviewer's whole pass.
 * `check_freshness.py` compares this against the repo before you send anything.
 */
const touched = new Set();
const imp = (rel) => { touched.add(rel); return import(pathToFileURL(R(rel)).href); };

// ---------------------------------------------------------------- literal reader
/**
 * Lift `const <name> = { ... }` (or `= [ ... ]`) out of a JS file and evaluate it.
 * Pass name = null to take the file's `export default [ … ]` / `{ … }` literal instead.
 */
function readLiteral(rel, name) {
  touched.add(rel);
  const src = fs.readFileSync(R(rel), "utf8");
  const re = name
    ? new RegExp(`(?:const|let|var|export const)\\s+${name}\\s*=\\s*([{\\[])`)
    : /export\s+default\s*([{[])/;
  const m = re.exec(src);
  if (!m) throw new Error(`${rel}: could not find ${name ? `literal "${name}"` : "an `export default` literal"}`);
  const open = m[1], close = open === "{" ? "}" : "]";
  let i = m.index + m[0].length - 1, depth = 0, q = null, esc = false, line = false, block = false;
  for (; i < src.length; i++) {
    const c = src[i], n = src[i + 1];
    if (line) { if (c === "\n") line = false; continue; }
    if (block) { if (c === "*" && n === "/") { block = false; i++; } continue; }
    if (q) {
      if (esc) { esc = false; continue; }
      if (c === "\\") { esc = true; continue; }
      if (c === q) q = null;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") { q = c; continue; }
    if (c === "/" && n === "/") { line = true; i++; continue; }
    if (c === "/" && n === "*") { block = true; i++; continue; }
    if (c === open) depth++;
    else if (c === close) { depth--; if (depth === 0) break; }
  }
  if (depth !== 0) throw new Error(`${rel}: unbalanced brackets reading "${name}"`);
  const body = src.slice(m.index + m[0].length - 1, i + 1);
  try { return new Function(`return (${body});`)(); }
  catch (e) { throw new Error(`${rel}: literal "${name}" is not pure data — ${e.message}`); }
}

const pad = (n, w = 4) => String(n).padStart(w, "0");
const out = { lane: LANE, scope: SCOPE, lang: LANG, laneLabel: CFG.label, laneConfig: CFG, generatedFrom: {}, sections: {} };

console.log(`extract.mjs — lane=${LANE} (${CFG.label}) · scope=${SCOPE} · source lang "${LANG}"`);
console.log(`repo=${REPO}`);

// ================================================================ 1. UI strings
if (SCOPE === "interface") {
  const STRINGS = readLiteral("lib/playStrings.js", "STRINGS");
  const CATS = readLiteral("lib/playStrings.js", "CATEGORY_NAMES");
  const section = (k) =>
    /^auth/.test(k) ? "auth"
    : /^ob[A-Z]/.test(k) ? "onboarding"
    : /^(fp|rp)[A-Z]/.test(k) ? "password-recovery"
    : /^set[A-Z]/.test(k) ? "settings"
    : /^ba[A-Z]/.test(k) ? "beta-apply"
    : "gameplay-and-chrome";
  const rows = [];
  for (const [k, v] of Object.entries(STRINGS)) {
    if (!v || typeof v !== "object") continue;
    if (v[LANG] === undefined) { warn(`playStrings."${k}" has no "${LANG}" translation`); }
    rows.push({ key: k, group: section(k), en: v.en ?? "", tgt: v[LANG] ?? "" });
  }
  for (const [k, v] of Object.entries(CATS))
    rows.push({ key: "CATEGORY_NAMES." + k, group: "gameplay-and-chrome", en: v.en ?? "", tgt: v[LANG] ?? "" });
  const ORDER = ["auth", "onboarding", "password-recovery", "settings", "beta-apply", "gameplay-and-chrome"];
  rows.sort((a, b) => ORDER.indexOf(a.group) - ORDER.indexOf(b.group) || a.key.localeCompare(b.key));
  out.sections.ui = rows.map((r, i) => ({ id: "IU-" + pad(i + 1), ...r, file: "lib/playStrings.js" }));
  out.generatedFrom["lib/playStrings.js"] = rows.length;
}

// ================================================================ 2. Help / About prose
if (SCOPE === "interface") {
  const { HELP_CONTENT, ABOUT_CONTENT } = await imp("lib/helpAboutContent.js");
  const rows = [];
  const pairUp = (en, tgt, keyPath, group) => {
    if (typeof en === "string" || typeof tgt === "string") {
      rows.push({ key: keyPath, group, en: typeof en === "string" ? en : "", tgt: typeof tgt === "string" ? tgt : "" });
    } else if (Array.isArray(en) || Array.isArray(tgt)) {
      const a = en || [], b = tgt || [];
      for (let i = 0; i < Math.max(a.length, b.length); i++) pairUp(a[i], b[i], `${keyPath}[${i}]`, group);
    } else if (en && typeof en === "object") {
      for (const k of Object.keys(en)) pairUp(en[k], tgt?.[k], keyPath ? `${keyPath}.${k}` : k, group);
    }
  };
  if (!HELP_CONTENT[LANG]) warn(`helpAboutContent: HELP_CONTENT has no "${LANG}" block`);
  if (!ABOUT_CONTENT[LANG]) warn(`helpAboutContent: ABOUT_CONTENT has no "${LANG}" block`);
  pairUp(HELP_CONTENT.en, HELP_CONTENT[LANG], "", "help-page");
  pairUp(ABOUT_CONTENT.en, ABOUT_CONTENT[LANG], "", "about-page");
  out.sections.prose = rows.map((r, i) => ({ id: "AY-" + pad(i + 1), ...r, file: "lib/helpAboutContent.js" }));
  out.generatedFrom["lib/helpAboutContent.js"] = rows.length;
}

// ================================================================ 3. Other component strings
if (SCOPE === "interface") {
  const rows = [];
  const push = (group, key, en, tgt, file) => rows.push({ group, key, en: en ?? "", tgt: tgt ?? "", file });

  const { guideSteps } = await imp("lib/guideSteps.js");
  const gEn = guideSteps("en"), gT = guideSteps(LANG);
  gEn.forEach((s, i) => {
    push("guided-tour", `STEPS[${i}].title`, s.title, gT[i]?.title, "lib/guideSteps.js");
    push("guided-tour", `STEPS[${i}].body`, s.body, gT[i]?.body, "lib/guideSteps.js");
  });

  const { LANGUAGE_NAMES } = await imp("lib/languageNames.js");
  for (const [code, m] of Object.entries(LANGUAGE_NAMES))
    push("language-names", `LANGUAGE_NAMES.${code}`, m.en, m[LANG], "lib/languageNames.js");
  const VARIANT_NAMES = readLiteral("lib/languageNames.js", "VARIANT_NAMES");
  for (const [tid, m] of Object.entries(VARIANT_NAMES))
    push("language-names", `VARIANT_NAMES.${tid}`, m.en, m[LANG], "lib/languageNames.js");

  const LEVEL_LABELS = readLiteral("lib/skillLevels.js", "LEVEL_LABELS");
  const LEVEL_DESCRIPTIONS = readLiteral("lib/skillLevels.js", "LEVEL_DESCRIPTIONS");
  for (const [k, m] of Object.entries(LEVEL_LABELS))
    push("skill-levels", `LEVEL_LABELS.${k}`, m.en, m[LANG], "lib/skillLevels.js");
  for (const [k, m] of Object.entries(LEVEL_DESCRIPTIONS))
    push("skill-levels", `LEVEL_DESCRIPTIONS.${k}`, m.en, m[LANG], "lib/skillLevels.js");

  const LANG_LABELS = readLiteral("lib/LangSwitcher.js", "LANG_LABELS");
  push("language-switcher", "LANG_LABELS", LANG_LABELS.en, LANG_LABELS[LANG], "lib/LangSwitcher.js");

  const SUBLABELS = (await imp("lib/trackSublabels.js")).default;
  for (const [tid, m] of Object.entries(SUBLABELS))
    if (m && m[LANG]) push("track-sublabels", tid, m.en ?? "", m[LANG], "lib/trackSublabels.js");

  out.sections.components = rows.map((r, i) => ({ id: "OT-" + pad(i + 1, 3), ...r }));
  out.generatedFrom["component string maps"] = rows.length;
}

// ================================================================ 4. Security questions
if (SCOPE === "interface") {
  const { SECURITY_QUESTIONS } = await imp("lib/securityQuestions.js");
  const field = "label_" + LANG;
  const rows = SECURITY_QUESTIONS.map((q, i) => {
    if (q[field] === undefined) warn(`securityQuestions."${q.key}" has no "${field}"`);
    return { id: "PS-" + pad(i + 1, 2), key: q.key, group: "security-question",
             en: q.label, tgt: q[field] ?? "", file: "lib/securityQuestions.js" };
  });
  out.sections.security = rows;
  out.generatedFrom["lib/securityQuestions.js"] = rows.length;
}

// ================================================================ 5/6. Regional variants
if (SCOPE === "interface") {
  const { __debug } = await imp("data/tracks/l10n/regionalVariants.js");
  const block = __debug.LANGS[LANG];
  if (!block) { warn(`regionalVariants has no "${LANG}" block`); out.sections.variants = []; out.sections.variantConfig = []; }
  else {
    const rows = [];
    block.records.forEach((r, idx) => {
      const n = idx + 1;
      const laneFor = (kind) => {
        const wanted = kind === "reference" ? "reference" : "regional";
        return CFG.variantScope === wanted ? LANE : (CFG.counterpart || LANE);
      };
      const mk = (suffix, kind, term, countries, label) => rows.push({
        id: `VR-${pad(n, 3)}-${suffix}`, n, gloss: r.gloss, kind, term, countries, label,
        scope: laneFor(kind), inScope: laneFor(kind) === LANE,
      });
      mk("REF", "reference", r.reference, block.reference.code, block.reference.label);
      mk("DEF", "default", r.default, "(unlisted countries)", block.regionalGroupLabel);
      (r.regional || []).forEach((x, j) =>
        mk(String.fromCharCode(97 + j), "regional", x.term,
           (x.countries || []).join(" · ") || "(whole region)", x.label || ""));
    });
    out.sections.variants = rows;
    const advisory = rows.filter((r) => !r.inScope).length;
    if (advisory)
      console.log(`  i ${advisory}/${rows.length} variant rows belong to lane "${CFG.counterpart}" ` +
                  `— kept as read-only context, verdicts recorded as advisory.`);

    const cfg = [];
    let i = 0;
    for (const [k, v] of Object.entries(block.ui))
      cfg.push({ id: "CF-" + pad(++i, 2), group: "card-chrome", key: k, en: `ui.${k}`, tgt: v });
    for (const [k, v] of Object.entries(block.countryNames))
      cfg.push({ id: "CF-" + pad(++i, 2), group: "country-names", key: k, en: `ISO ${k}`, tgt: v });
    for (const l of [...new Set(rows.filter((r) => r.kind === "regional").map((r) => r.label))].sort())
      cfg.push({ id: "CF-" + pad(++i, 2), group: "country-group-labels", key: "label", en: "(group abbreviation)", tgt: l });
    cfg.push({ id: "CF-" + pad(++i, 2), group: "country-group-labels", key: "regionalGroupLabel", en: "(regional group name)", tgt: block.regionalGroupLabel });
    cfg.push({ id: "CF-" + pad(++i, 2), group: "country-group-labels", key: "reference.label", en: "(reference variety name)", tgt: block.reference.label });
    out.sections.variantConfig = cfg;
    out.generatedFrom["data/tracks/l10n/regionalVariants.js"] = `${block.records.length} concepts → ${rows.length} rows`;
  }
}

// ================================================================ 7. Changelog
if (SCOPE === "interface") {
  const { CHANGELOG, CURRENT_VERSION } = await imp("lib/version.js");
  out.currentVersion = CURRENT_VERSION;
  const rows = [];
  for (const e of CHANGELOG)
    (e.changes || []).forEach((c, i) => {
      if (c[LANG] === undefined) warn(`changelog v${e.version} bullet ${i + 1} has no "${LANG}"`);
      rows.push({ id: "NV-" + pad(rows.length + 1), group: `v${e.version} — ${e.date}`,
                  key: `v${e.version} · bullet ${i + 1}`, en: c.en ?? "", tgt: c[LANG] ?? "",
                  file: "lib/version.js" });
    });
  out.sections.changelog = rows;
  out.generatedFrom["lib/version.js"] = `${CHANGELOG.length} entries → ${rows.length} bullets`;
}

// ================================================================ taught / explanation content
if (SCOPE !== "interface") {
  const L10N = "data/tracks/l10n";

  // ---- questions from a track's BANK, one row per QUESTION (not per string).
  // A reviewer judges a question whole: is the keyed answer right, is every distractor
  // genuinely wrong, does the explanation hold up. Splitting it into 11 string rows would
  // multiply the row count without adding a single decision.
  const questions = [], fono = [];
  for (const t of CONTENT_CFG.tracks || []) {
    const rel = `data/tracks/${t}.js`;
    let BANK, FONO;
    try { BANK = readLiteral(rel, "BANK"); FONO = readLiteral(rel, "FONO_BANK"); }
    catch (e) { warn(`${rel}: ${e.message}`); continue; }
    for (const [cat, items] of Object.entries(BANK || {})) {
      (items || []).forEach((it, i) => {
        const opts = it[BANK_SLOTS.options] || [];
        const correct = opts[it[BANK_SLOTS.correct]] ?? "";
        const ex = it[BANK_SLOTS.explain] || {};
        const extras = it[BANK_SLOTS.extras] || {};
        const notes = [];
        if (extras.wrongNote?.[LANG]) notes.push(`(respuesta incorrecta) → ${extras.wrongNote[LANG]}`);
        for (const [o, v] of Object.entries(extras.distractorNotes || {}))
          if (v?.[LANG]) notes.push(`${o} → ${v[LANG]}`);
        questions.push({
          id: "PR-" + pad(questions.length + 1), track: t, file: rel, key: `${cat}[${i}]`,
          cat, difficulty: it[BANK_SLOTS.difficulty] || "",
          prompt: it[BANK_SLOTS.prompt] || "",
          correct,
          distractors: opts.filter((o, k) => k !== it[BANK_SLOTS.correct]).join(" · "),
          explain: ex[LANG] || ex.en || "",
          explainOther: ex[LANG] ? (ex.en || "") : "",
          notes: notes.join("\n"),
        });
      });
    }
    (FONO || []).forEach((f, i) => {
      const opts = f.identify?.options || [];
      fono.push({
        id: "FO-" + pad(fono.length + 1, 3), track: t, file: rel, key: `FONO_BANK[${i}]`,
        text: f.text || "", sound: f.sound || "", difficulty: f.difficulty || "",
        correct: opts[f.identify?.correctIdx] ?? "",
        distractors: opts.filter((o, k) => k !== f.identify?.correctIdx).join(" · "),
        explain: f.identify?.explain?.[LANG] || f.explain?.[LANG] || "",
        pairs: (f.pairs || []).map((p) => `${p.a ?? ""} / ${p.b ?? ""}: ${p.explain?.[LANG] ?? ""}`).join("\n"),
      });
    });
  }
  out.sections.questions = questions;
  out.sections.fono = fono;
  if (questions.length) out.generatedFrom[(CONTENT_CFG.tracks || []).map((t) => `data/tracks/${t}.js`).join(", ")] =
    `${questions.length} questions + ${fono.length} pronunciation items`;

  // ---- Word Bank word lists
  //
  // Two different shapes, and the difference matters to the reviewer:
  //   target-words  `const WORDS = [[word, gloss, pos, tier, note?], …]` — the words being
  //                 TAUGHT, in the target language, with an English gloss.
  //   glossary      `export default ["día", "semana", …]` — a bare positional overlay whose
  //                 index lines up with the base <x>Words.js. On its own it is a meaningless
  //                 list of Spanish words, so the base file is read alongside it and the
  //                 source word + English gloss are carried in as context. Without that a
  //                 reviewer cannot tell whether "hora; clase" is a good gloss for anything.
  const vocab = [];
  const readList = (rel, name) => {
    try { return readLiteral(rel, name); } catch (e) { warn(e.message); return null; }
  };
  for (const v of CONTENT_CFG.vocab || []) {
    const rel = `data/vocab/${v}.js`;
    const W = readList(rel, "WORDS") ?? readList(rel, null);
    if (!Array.isArray(W)) { warn(`${rel}: expected an array of word tuples`); continue; }
    W.forEach((w, i) => {
      const [word, gloss, pos, tier, note] = w || [];
      vocab.push({ id: "BP-" + pad(vocab.length + 1), file: rel, kind: "target-words", key: `[${i}]`,
                   source: word ?? "", sourceGloss: "", word: word ?? "", gloss: gloss ?? "",
                   pos: pos ?? "", tier: tier ?? "", note: note ?? "" });
    });
  }
  for (const g of CONTENT_CFG.glossaries || []) {
    const rel = `data/vocab/${g}.js`;
    const baseRel = `data/vocab/${g.replace(/\.[a-z]{2}$/, "")}.js`;
    const G = readList(rel, null);
    const BASE = readList(baseRel, "WORDS") ?? readList(baseRel, null) ?? [];
    if (!Array.isArray(G)) { warn(`${rel}: expected an array of glosses`); continue; }
    if (BASE.length && BASE.length !== G.length)
      warn(`${rel} has ${G.length} entries but ${baseRel} has ${BASE.length} — positional pairing may be off`);
    G.forEach((tgtGloss, i) => {
      const b = BASE[i] || [];
      vocab.push({ id: "BP-" + pad(vocab.length + 1), file: rel, kind: "glossary", key: `[${i}]`,
                   source: b[0] ?? "", sourceGloss: b[1] ?? "", word: b[0] ?? "", gloss: tgtGloss ?? "",
                   pos: b[2] ?? "", tier: b[3] ?? "", note: b[4] ?? "" });
    });
  }
  out.sections.vocab = vocab;
  if (vocab.length) out.generatedFrom["data/vocab/*"] = `${vocab.length} word-bank entries`;

  // ---- l10n overlay sample (the native-language layer on foreign tracks)
  if (CONTENT_CFG.l10nSample) {
    const SUFFIX = `.${LANG}.js`;
    const PER_TRACK = Number(arg("sample", "40"));
    const files = fs.readdirSync(R(L10N)).filter((f) => f.endsWith(SUFFIX)).sort();
    if (!files.length) warn(`no ${SUFFIX} overlay files found in ${L10N}`);
    const rows = [];
    let corpus = 0;
    for (const f of files) {
      const mod = (await imp(`${L10N}/${f}`)).default;
      const keys = Object.keys(mod);
      corpus += keys.length;
      const groups = {};
      for (const k of keys) (groups[k.replace(/-\d+$/, "")] ||= []).push(k);
      const names = Object.keys(groups).sort();
      const per = Math.max(1, Math.floor(PER_TRACK / names.length));
      const picked = [];
      for (const g of names) {
        const a = groups[g], n = Math.min(per, a.length);
        for (let i = 0; i < n; i++) picked.push(a[Math.floor((i + 0.5) * a.length / n)]);
      }
      for (let i = 0; picked.length < Math.min(PER_TRACK, keys.length) && i <= keys.length; i++) {
        const c = keys[Math.floor((i + 0.5) * keys.length / PER_TRACK)];
        if (c && !picked.includes(c)) picked.push(c);
      }
      for (const k of picked.slice(0, PER_TRACK)) {
        const it = mod[k];
        if (!it) continue;
        rows.push({
          id: "MC-" + pad(rows.length + 1), track: f.replace(SUFFIX, ""), file: `${L10N}/${f}`, key: k,
          prompt: it.promptNative || "", options: (it.options || []).join(" · "),
          notes: Object.entries(it.distractorNotes || {})
            .map(([o, v]) => `${o} → ${v?.[LANG] ?? v ?? ""}`).join("\n"),
        });
      }
    }
    out.sections.overlaySample = rows;
    out.corpusSize = corpus;
    out.generatedFrom[`${L10N}/*${SUFFIX}`] =
      `${files.length} tracks, ${corpus} items → ${rows.length} sampled (${(100 * rows.length / (corpus || 1)).toFixed(1)}%)`;
  }
}

// ================================================================ drift sweep
{
  const KNOWN = new Set([
    "lib/playStrings.js", "lib/version.js", "lib/helpAboutContent.js", "lib/guideSteps.js",
    "lib/languageNames.js", "lib/skillLevels.js", "lib/LangSwitcher.js", "lib/trackSublabels.js",
    "lib/securityQuestions.js", "data/tracks/l10n/regionalVariants.js",
  ]);
  const re = new RegExp(`\\ben\\s*:\\s*["'\`][\\s\\S]{0,4000}?\\b${LANG}\\s*:\\s*["'\`]`);
  const walk = (dir, acc = []) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) { if (!/node_modules|\.next/.test(p)) walk(p, acc); }
      else if (e.name.endsWith(".js")) acc.push(p);
    }
    return acc;
  };
  const unknown = [];
  for (const abs of [...walk(R("lib")), ...walk(R("app"))]) {
    const rel = path.relative(REPO, abs).replace(/\\/g, "/");
    if (KNOWN.has(rel)) continue;
    if (re.test(fs.readFileSync(abs, "utf8"))) unknown.push(rel);
  }
  if (unknown.length) {
    warn(`bilingual maps found in files this extractor does not know — add them to KNOWN_SOURCES ` +
         `and to a section above, or confirm they are out of scope:\n     ` + unknown.join("\n     "));
  }
  out.driftCandidates = unknown;
}

// ================================================================ source fingerprint
{
  const fp = {};
  for (const rel of [...touched].sort()) {
    try {
      const st = fs.statSync(R(rel));
      fp[rel] = { bytes: st.size, mtimeMs: Math.round(st.mtimeMs) };
    } catch (e) { warn(`could not fingerprint ${rel}: ${e.message}`); }
  }
  out.sourceFingerprint = fp;
  console.log(`fingerprinted ${Object.keys(fp).length} source files`);
}

// ================================================================ write
out.warnings = warnings;
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log("\nsections:");
for (const [k, v] of Object.entries(out.sections)) console.log(`  ${k.padEnd(14)} ${v.length}`);
console.log(`\ntotal review rows: ${Object.values(out.sections).reduce((a, v) => a + v.length, 0)}`);
console.log(`warnings: ${warnings.length}`);
console.log(`wrote ${OUT}`);

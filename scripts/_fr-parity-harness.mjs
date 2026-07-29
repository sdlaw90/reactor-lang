#!/usr/bin/env node
/**
 * ONE-OFF — v3.3 French target-parity audit (deployment plan §4b).
 *
 * WHY THIS EXISTS AND WHY IT DOES NOT IMPORT ANYTHING
 * ---------------------------------------------------
 * `tracksForNativeLang("fr")` cannot be called for real yet: `enUsForFr` / `enGbForFr` are
 * authored but deliberately NOT registered in `data/tracks/index.js`, because registering a
 * `sourceSpecific` track puts Français in the onboarding picker immediately — that is the
 * offering flip, and it needs sign-off (`docs/_fr-offering-flip.md`). So this harness builds a
 * SIMULATED registry: it reads the shipped `data/tracks/index.js`, adds the two unregistered
 * tracks to a copy of `TRACKS`, adds "fr" to a copy of `RELEASED_SOURCE_LANGS`, reimplements
 * `tracksForNativeLang`'s filter verbatim, and asserts on the result.
 *
 * It reads files as TEXT and never imports them. Two reasons: the track modules use
 * extensionless specifiers that only Next's resolver understands, and this has to run with
 * Node alone and zero npm dependencies — same rule as
 * `docs/language-review/pipeline/check_freshness.mjs`.
 *
 * Run:  node scripts/_fr-parity-harness.mjs
 * Exit: 0 = parity holds, 1 = a real gap, 2 = the harness itself could not run.
 *
 * DO NOT weaken an assertion to make this pass. If it fails, the content is wrong.
 * Delete this file once v3.3 ships.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = process.env.SL_ROOT || path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const T = path.join(ROOT, 'data', 'tracks');
const L = path.join(T, 'l10n');
const read = (p) => fs.readFileSync(p, 'utf8');
const exists = (p) => fs.existsSync(p);

let fails = 0, checks = 0;
function assert(ok, label, detail = '') {
  checks++; if (!ok) fails++;
  console.log(`${ok ? '  PASS  ' : '  FAIL  '}${label}${detail ? '   ' + detail : ''}`);
}
function die(msg) { console.error('HARNESS CANNOT RUN: ' + msg); process.exit(2); }

// ---------------------------------------------------------------- registry
if (!exists(path.join(T, 'index.js'))) die('data/tracks/index.js not found under ' + ROOT);
const idxSrc = read(path.join(T, 'index.js'));

// imported track modules -> their file stems
const imports = [...idxSrc.matchAll(/^import\s+(\w+)\s+from\s+"\.\/(\w+)";/gm)].map(m => ({ ident: m[1], stem: m[2] }));
// entries actually placed in TRACKS
const tracksBlock = idxSrc.slice(idxSrc.indexOf('export const TRACKS'), idxSrc.indexOf('};', idxSrc.indexOf('export const TRACKS')));
const registered = [...tracksBlock.matchAll(/\[(\w+)\.id\]/g)].map(m => m[1]);
const releasedMatch = idxSrc.match(/RELEASED_SOURCE_LANGS\s*=\s*new Set\(\[([^\]]*)\]\)/);
if (!releasedMatch) die('could not find RELEASED_SOURCE_LANGS');
const released = new Set(releasedMatch[1].match(/"(\w+)"/g).map(s => s.replace(/"/g, '')));

console.log('shipped registry: ' + registered.length + ' tracks, RELEASED_SOURCE_LANGS = ['
  + [...released].join(', ') + ']');

// --- inertness precondition. Pass --post-flip AFTER docs/_fr-offering-flip.md is applied;
// these two assertions are meant to invert at that moment, and a harness whose asserts
// silently become wrong is worse than one that says so.
const POST = process.argv.includes('--post-flip');
if (!POST) {
  assert(!registered.includes('enUsForFr') && !registered.includes('enGbForFr'),
    'PRE-FLIP: enUsForFr / enGbForFr are NOT in the shipped TRACKS (French unreachable)');
  assert(!released.has('fr'), 'PRE-FLIP: RELEASED_SOURCE_LANGS does not contain "fr"');
} else {
  assert(registered.includes('enUsForFr') && registered.includes('enGbForFr'),
    'POST-FLIP: enUsForFr / enGbForFr ARE registered in TRACKS');
  assert(released.has('fr'), 'POST-FLIP: RELEASED_SOURCE_LANGS contains "fr"');
}

// ---------------------------------------------------------------- track metadata (text-parsed)
function meta(stem) {
  const p = path.join(T, stem + '.js');
  if (!exists(p)) return null;
  const s = read(p);
  const g = (k) => { const m = s.match(new RegExp('^\\s{2}' + k + ':\\s*(?:"([^"]*)"|(true|false)),\\s*$', 'm')); return m ? (m[1] !== undefined ? m[1] : m[2] === 'true') : undefined; };
  // BANK category item counts: scan the `const BANK = {` block, bracket-matched
  const bi = s.indexOf('const BANK = {');
  const cats = {};
  if (bi >= 0) {
    let i = s.indexOf('{', bi) + 1, depth = 1, cur = null, start = 0;
    for (; i < s.length && depth > 0; i++) {
      const c = s[i];
      if (depth === 1 && /[a-z]/.test(c) && !cur) {
        const m = /^(\w+):\s*\[/.exec(s.slice(i, i + 24));
        if (m) { cur = m[1]; start = i + m[0].length - 1; }
      }
      if (c === '{' || c === '[') depth++;
      else if (c === '}' || c === ']') {
        depth--;
        if (depth === 1 && cur) {
          // count top-level items in the array we just closed
          const arr = s.slice(start, i + 1);
          let d = 0, n = 0;
          for (const ch of arr) {
            if (ch === '[' || ch === '{') { if (d === 1 && ch === '[') n++; d++; }
            else if (ch === ']' || ch === '}') d--;
          }
          cats[cur] = n; cur = null;
        }
      }
      if (c === '"' || c === "'" || c === '`') { const q = c; i++; while (i < s.length && s[i] !== q) { if (s[i] === '\\') i++; i++; } }
    }
  }
  const fonoIdx = s.indexOf('const FONO_BANK = [');
  let fono = 0;
  if (fonoIdx >= 0) {
    let i = s.indexOf('[', fonoIdx), d = 0;
    for (; i < s.length; i++) {
      const c = s[i];
      if (c === '"' || c === "'" || c === '`') { const q = c; i++; while (i < s.length && s[i] !== q) { if (s[i] === '\\') i++; i++; } continue; }
      if (c === '[' || c === '{') { if (d === 1 && c === '{') fono++; d++; }
      else if (c === ']' || c === '}') { d--; if (d === 0) break; }
    }
  }
  return { stem, id: g('id'), nativeLang: g('nativeLang'), targetLang: g('targetLang'),
           sourceSpecific: g('sourceSpecific') === true, cats, fono };
}

const all = {};
for (const { ident, stem } of imports) all[ident] = meta(stem);
for (const extra of ['enUsForFr', 'enGbForFr']) {
  const m = meta(extra);
  if (!m) die('data/tracks/' + extra + '.js not found — Phase 2 output missing');
  all[extra] = m;
}
for (const [k, v] of Object.entries(all)) if (!v) die('could not read track module for ' + k);

// ---------------------------------------------------------------- simulated registry
const simTracks = [...registered, 'enUsForFr', 'enGbForFr'].map(k => all[k]);
const simReleased = new Set([...released, 'fr']);

// verbatim reimplementation of tracksForNativeLang (data/tracks/index.js)
function tracksForNativeLang(nativeLang, nativeCountry) {
  const offered = simTracks.filter((t) => {
    if (t.sourceSpecific) return t.nativeLang === nativeLang;
    return simReleased.has(nativeLang) && t.targetLang !== nativeLang;
  });
  if (nativeLang === 'en' && nativeCountry !== 'GB') {
    const uk = simTracks.find(t => t.id === 'en-gb-for-es');
    if (uk && !offered.includes(uk)) offered.push(uk);
  }
  return offered;
}

const EXPECTED_FR = ['es-latam-for-en','es-spain-for-en','pt-br-for-en','pt-pt-for-en','it-for-en',
  'de-for-en','ru-for-en','ja-for-en','ko-for-en','zh-for-en','en-us-for-fr','en-gb-for-fr'];

console.log('\n--- §4b target-parity audit, simulated registry ---');
const fr = tracksForNativeLang('fr');
const frIds = fr.map(t => t.id).sort();
assert(fr.length === 12, 'tracksForNativeLang("fr") returns 12 tracks', 'got ' + fr.length);
assert(JSON.stringify(frIds) === JSON.stringify([...EXPECTED_FR].sort()),
  'the 12 are exactly the expected set',
  frIds.join(', '));

// no French-target track leaks to a French native
assert(!frIds.some(id => id.startsWith('fr-')), 'no French-target track is offered to a French native');

// both variants present for every split target reachable from fr
for (const [lang, pair] of Object.entries({
  Spanish: ['es-latam-for-en','es-spain-for-en'],
  Portuguese: ['pt-br-for-en','pt-pt-for-en'],
  English: ['en-us-for-fr','en-gb-for-fr'],
})) assert(pair.every(id => frIds.includes(id)), 'both ' + lang + ' variants offered', pair.join(' + '));

// No regression for the already-released sources. Derive the PRE-flip answer from the
// shipped registry rather than hardcoding a number — a hardcoded baseline is an assertion
// about the author's memory, not about the code. (This is how the "en returns 12" mistake
// was caught: en actually returns 13, because tracksForNativeLang pushes en-gb-for-es for
// non-GB English natives on top of the 12 reusable targets.)
const preTracks = registered.map(k => all[k]);
function tracksForNativeLangPre(nativeLang, nativeCountry) {
  const offered = preTracks.filter((t) => {
    if (t.sourceSpecific) return t.nativeLang === nativeLang;
    return released.has(nativeLang) && t.targetLang !== nativeLang;
  });
  if (nativeLang === 'en' && nativeCountry !== 'GB') {
    const uk = preTracks.find(t => t.id === 'en-gb-for-es');
    if (uk && !offered.includes(uk)) offered.push(uk);
  }
  return offered;
}
for (const src of ['en', 'es', 'pt', 'it']) {
  const before = tracksForNativeLangPre(src).map(t => t.id).sort();
  const after = tracksForNativeLang(src).map(t => t.id).sort();
  assert(JSON.stringify(before) === JSON.stringify(after),
    'no regression: tracksForNativeLang("' + src + '") unchanged by the flip',
    before.length + ' -> ' + after.length + (before.length === after.length ? '' : '  DIFF: ' +
      after.filter(x => !before.includes(x)).concat(before.filter(x => !after.includes(x))).join(',')));
}
// and the harness must be able to notice a regression: prove it on a deliberately broken copy
{
  // Remove a track that IS in the es result — popping the last element removes enForIt,
  // which is sourceSpecific/it and therefore invisible to an es native, so the control
  // would have passed while proving nothing. This is the "assertion that cannot fail" trap.
  const victimIdx = preTracks.findIndex(t => !t.sourceSpecific && t.targetLang !== 'es');
  const victim = preTracks[victimIdx];
  preTracks.splice(victimIdx, 1);
  const broken = JSON.stringify(tracksForNativeLangPre('es').map(t => t.id).sort())
              !== JSON.stringify(tracksForNativeLang('es').map(t => t.id).sort());
  preTracks.splice(victimIdx, 0, victim);
  assert(broken, 'negative control: removing ' + victim.id + ' from the pre-flip registry IS detected');
}

// ---------------------------------------------------------------- depth / stub check
// DEPTH. A presence check ("has 3 categories, none empty") is NOT a depth check — the repo's
// own enForIt stub (12 vocab / 9 gram / 7 trad / 4 fono) passes it. So: a hard floor per
// category AND a frozen per-track baseline measured on 2026-07-29. Counts may GROW; any
// shrink means content was lost or a stub was substituted.
const FLOOR = { vocab: 100, grammar: 200, trad: 80, fono: 50 };
const BASELINE = {
  'es-latam-for-en': { vocab:134, grammar:404, trad:127, fono:79 },
  'es-spain-for-en': { vocab:127, grammar:517, trad:127, fono:79 },
  'it-for-en':       { vocab:137, grammar:659, trad:104, fono:80 },
  'pt-br-for-en':    { vocab:133, grammar:785, trad:113, fono:81 },
  'pt-pt-for-en':    { vocab:135, grammar:702, trad:110, fono:81 },
  'de-for-en':       { vocab:134, grammar:494, trad:135, fono:79 },
  'ru-for-en':       { vocab:134, grammar:490, trad:125, fono:79 },
  'ja-for-en':       { vocab:134, grammar:483, trad:126, fono:79 },
  'ko-for-en':       { vocab:134, grammar:494, trad:127, fono:79 },
  'zh-for-en':       { vocab:134, grammar:249, trad:127, fono:79 },
  'en-us-for-fr':    { vocab:133, grammar:519, trad:125, fono:77 },
  'en-gb-for-fr':    { vocab:131, grammar:518, trad:122, fono:79 },
};
console.log('\n--- depth per offered track (floors + frozen baseline; a stub CANNOT pass) ---');
console.log('  ' + 'track'.padEnd(18) + 'categories'.padEnd(46) + 'fono');
for (const t of fr) {
  const cs = Object.entries(t.cats);
  const line = cs.map(([k, v]) => k + ':' + v).join(' ');
  console.log('  ' + t.id.padEnd(18) + line.padEnd(46) + t.fono);
  const grammar = (t.cats.gram || 0) + (t.cats.verbo || 0);
  const measured = { vocab: t.cats.vocab || 0, grammar, trad: t.cats.trad || 0, fono: t.fono };
  assert(cs.some(([k]) => k === 'gram' || k === 'verbo'), t.id + ' carries a grammar category', line);
  for (const k of ['vocab', 'grammar', 'trad', 'fono'])
    assert(measured[k] >= FLOOR[k], t.id + ' ' + k + ' >= floor ' + FLOOR[k], String(measured[k]));
  const base = BASELINE[t.id];
  assert(!!base, t.id + ' has a frozen baseline');
  if (base) for (const k of ['vocab', 'grammar', 'trad', 'fono'])
    assert(measured[k] >= base[k], t.id + ' ' + k + ' has not shrunk below the 2026-07-29 baseline',
      measured[k] + ' vs ' + base[k]);
}
// negative control: the repo's own half-shipped stub must NOT pass the floors
{
  const stub = meta('enForIt');
  const g = stub ? (stub.cats.gram || 0) + (stub.cats.verbo || 0) : 0;
  const passes = stub && (stub.cats.vocab || 0) >= FLOOR.vocab && g >= FLOOR.grammar
                 && (stub.cats.trad || 0) >= FLOOR.trad && stub.fono >= FLOOR.fono;
  assert(!passes, 'negative control: the enForIt stub FAILS the depth floors',
    stub ? JSON.stringify(stub.cats) + ' fono:' + stub.fono : 'enForIt not found');
}

// the two new English targets must match their pt counterparts item for item
console.log('\n--- new English-target tracks vs their pt counterparts ---');
for (const [a, b] of [['enUsForFr', 'enUsForPt'], ['enGbForFr', 'enGbForPt']]) {
  const A = all[a], B = meta(b);
  if (!B) { assert(false, b + ' not found for comparison'); continue; }
  assert(JSON.stringify(A.cats) === JSON.stringify(B.cats),
    a + ' bank sizes identical to ' + b, JSON.stringify(A.cats) + ' vs ' + JSON.stringify(B.cats));
  assert(A.fono === B.fono, a + ' fono count identical to ' + b, A.fono + ' vs ' + B.fono);
  assert(A.nativeLang === 'fr' && A.targetLang === 'en' && A.sourceSpecific === true,
    a + ' meta is (nativeLang fr, targetLang en, sourceSpecific)', JSON.stringify({ n: A.nativeLang, t: A.targetLang, s: A.sourceSpecific }));
}

// ---------------------------------------------------------------- l10n coverage
console.log('\n--- fr localization layer for the 10 reusable tracks ---');
const l10nSrc = read(path.join(L, 'index.js'));
const l10nBlock = l10nSrc.slice(l10nSrc.indexOf('const L10N = {'), l10nSrc.indexOf('};', l10nSrc.indexOf('const L10N = {')));
const entryCount = (p) => (read(p).match(/^\s{1,3}"[a-z]+-\d+":/gm) || []).length;
const SIB = { esForEn: 'pt', esSpainForEn: 'pt', ptBrForEn: 'es', ptPtForEn: 'es', itForEn: 'es',
              deForEn: 'es', ruForEn: 'es', jaForEn: 'es', koForEn: 'es', zhForEn: 'es' };
for (const t of fr) {
  if (t.sourceSpecific) continue;                       // source-specific tracks carry no side table
  const row = new RegExp('"' + t.id + '":\\s*\\{([^}]*)\\}').exec(l10nBlock);
  assert(!!row && /\bfr:\s*\w+/.test(row[1]), t.id + ' is registered with an fr side table',
    row ? row[1].trim() : 'NOT IN L10N');
  const stem = Object.keys(SIB).find(s => {
    const im = new RegExp('import\\s+' + s + '_fr\\s').test(l10nSrc);
    return im && new RegExp('"' + t.id + '":[^}]*fr:\\s*' + s + '_fr').test(l10nBlock);
  });
  assert(!!stem, t.id + ' fr import resolves to a known stem', stem || 'UNRESOLVED');
  if (!stem) continue;
  const frFile = path.join(L, stem + '.fr.js');
  assert(exists(frFile), stem + '.fr.js exists on disk');
  if (!exists(frFile)) continue;
  const sibFile = path.join(L, stem + '.' + SIB[stem] + '.js');
  const nFr = entryCount(frFile);
  if (exists(sibFile)) {
    const nSib = entryCount(sibFile);
    assert(nFr === nSib, stem + '.fr.js entry count matches its ' + SIB[stem] + ' sibling',
      nFr + ' vs ' + nSib);
  } else {
    assert(nFr > 0, stem + '.fr.js is non-empty (sibling not in this checkout)', String(nFr));
  }
  const s = read(frFile);
  assert(/fvocab-\d+/.test(s), stem + '.fr.js carries Word Bank (fvocab-*) surfaces');
  // An entry-count match proves SHAPE, not LANGUAGE. A byte-copy of the es/pt sibling would
  // satisfy every check above while giving a French native a wholly Spanish surface — the
  // exact class of miss v3.1.1 shipped. So test the language itself.
  if (exists(sibFile)) {
    assert(s !== read(sibFile), stem + '.fr.js is not a byte-copy of its ' + SIB[stem] + ' sibling');
  }
  // Comparing French markers against Spanish/Portuguese markers INSIDE the same file does
  // not work: the `prompt` field is TARGET-language by design, so a Spanish-target table is
  // supposed to be full of Spanish. Compare against the SIBLING file instead — the sibling is
  // the same content in the source language we translated away from, so it should contain
  // almost no French. This is the assertion that would catch a byte-copy or a no-op pass.
  const FRMARK = /(signifie|dit-on|veut dire|qu[’']est-ce|c[’']est|n[’']est|\bles\b|\bdes\b|\bavec\b|\bpour\b|\bune\b|\bêtre\b|\bfrançais\b|\bespagnol\b|\bitalien\b|\ballemand\b|\bjaponais\b|\bcor[ée]en\b|\bchinois\b|\brusse\b|\bportugais\b)/gi;
  const frScore = (t) => (t.match(FRMARK) || []).length;
  const mine = frScore(s);
  const theirs = exists(sibFile) ? frScore(read(sibFile)) : 0;
  assert(mine > 200 && mine > theirs * 20,
    stem + '.fr.js reads as French (vs its ' + SIB[stem] + ' sibling, which should not)',
    'fr-markers ' + mine + ' vs sibling ' + theirs);
}

// ---------------------------------------------------------------- #89 chip coverage
// The chip fix is the larger half of Phase 3 and had no automated coverage; a regenerated
// tag file silently dropping the new keys is exactly how `es` went missing from de/ru/ja/ko.
console.log('\n--- #89 training-wheel chips (grammar.tense / grammar.why / person) ---');
const CHIPS = {
  'esForEnTags.js':      { need: ['fr','pt'], objects: 41 },
  'esSpainForEnTags.js': { need: ['fr','pt'], objects: 42 },
  'itForEnTags.js':      { need: ['fr','pt'], objects: 27 },
  'ptBrForEnTags.js':    { need: ['fr'],      objects: 29 },
  'ptPtForEnTags.js':    { need: ['fr'],      objects: 29 },
  'frForEnTags.js':      { need: ['pt'],      objects: 31 },
  'frCaForEnTags.js':    { need: ['pt'],      objects: 31 },
};
const LANGKEY = /(?:^|[{,\s])"?([a-z]{2})"?\s*:/g;
for (const [file, spec] of Object.entries(CHIPS)) {
  const p = path.join(T, file);
  if (!exists(p)) { assert(false, file + ' exists'); continue; }
  const s = read(p);
  // isolate the T and P declarations (the chip objects live only there)
  const blocks = [];
  for (const name of ['const T = {', 'const P = {']) {
    const i = s.indexOf(name);
    if (i < 0) continue;
    let j = s.indexOf('{', i), d = 0;
    for (; j < s.length; j++) {
      const c = s[j];
      if (c === '"' || c === "'" || c === '`') { const q = c; j++; while (j < s.length && s[j] !== q) { if (s[j] === '\\') j++; j++; } continue; }
      if (c === '{') d++; else if (c === '}') { d--; if (!d) break; }
    }
    blocks.push(s.slice(i, j + 1));
  }
  assert(blocks.length === 2, file + ' has both a T and a P declaration', String(blocks.length));
  // innermost objects: no nested braces
  const inner = blocks.join('\n').match(/\{[^{}]*\}/g) || [];
  const chipObjs = inner.filter(o => /(?:^|[{,\s])"?en"?\s*:/.test(o));
  let missing = 0;
  for (const o of chipObjs) for (const l of spec.need)
    if (!new RegExp('(?:^|[{,\\s])"?' + l + '"?\\s*:').test(o)) missing++;
  assert(chipObjs.length === spec.objects, file + ' has ' + spec.objects + ' chip objects',
    'got ' + chipObjs.length);
  assert(missing === 0, file + ' every chip object carries ' + spec.need.join(' + '),
    missing + ' missing');
}
// negative control: a chip object with a language stripped must be caught
{
  const s = read(path.join(T, 'esForEnTags.js')).replace(', fr: "Présent"', '');
  const i = s.indexOf('const T = {');
  let j = s.indexOf('{', i), d = 0;
  for (; j < s.length; j++) { const c = s[j]; if (c === '{') d++; else if (c === '}') { d--; if (!d) break; } }
  const inner = (s.slice(i, j + 1).match(/\{[^{}]*\}/g) || []).filter(o => /"?en"?\s*:/.test(o));
  const miss = inner.filter(o => !/(?:^|[{,\s])"?fr"?\s*:/.test(o)).length;
  assert(miss === 1, 'negative control: stripping one fr chip key IS detected', 'found ' + miss);
}

console.log('\n' + '='.repeat(62));
console.log(fails === 0
  ? `§4b TARGET-PARITY AUDIT PASSED — ${checks} assertions, 0 failures`
  : `§4b TARGET-PARITY AUDIT FAILED — ${fails} of ${checks} assertions failed`);
console.log('='.repeat(62));
process.exit(fails ? 1 : 0);

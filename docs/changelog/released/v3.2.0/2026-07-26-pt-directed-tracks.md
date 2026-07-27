# 2026-07-26 — Portuguese directed-track localization + offering flip (v3.2 work-beat)

_Folds into the single **3.2.0** release entry at the dev→main merge. Not a separate patch
version — per the versioning convention (deployment plan §5), the Z in vX.Y.Z is reserved for
post-release fixes; planned build-out beats accumulate here under 3.2.0._

## User-facing
- **Portuguese (Brazil) is now a native language you can learn from.** Speakers of
  Portuguese can pick their native language and learn **12 languages** with the whole
  experience in Portuguese: Spanish (Latin American + European), French (France +
  Québec), Italian, German, Russian, Japanese, Korean, Chinese — plus **American and
  British English**, each built out as a full course for Portuguese speakers. Questions,
  answer choices, subtitles, the Word Bank, and explanations all read in Portuguese.
  Regional Brazil↔Portugal differences (ônibus/autocarro, trem/comboio, tela/ecrã,
  geladeira/frigorífico…) surface on the dual-version card. (Phonetics-mode prompts are
  the one surface still in English — the remaining 3.2.0 beat.)

## Internal
- **v3.2 Portuguese — the directed-track localization layer + the offering flip.** Sits on top
  of the v3.2 foundation work-beat (pt UI strings, skill labels, regional registry). All in one
  3.2.0 release; all AI-authored → #41.
- **10 directed-track l10n side tables** `data/tracks/l10n/<track>.pt.js` (new), registered
  in `l10n/index.js`:
  - 8 translated **es→pt in place** (structure-preserving): `frForEn, frCaForEn, itForEn,
    deForEn, ruForEn, jaForEn, koForEn, zhForEn` — vocab + gram + trad + **fvocab (Word
    Bank)** all carried. Each verified against its es source: identical key set/count,
    identical per-key field sets, option arrays index-aligned (correctIdx never moves),
    `distractorNotes` re-keyed to `pt`, target-script content (Cyrillic/CJK/accented Latin)
    preserved byte-for-byte (char-count asserted).
  - 2 **net-new** `esForEn.pt` (`es-latam-for-en`) + `esSpainForEn.pt` (`es-spain-for-en`)
    — Spanish-as-a-target for pt natives, which the es source never needed. Built from the
    English base tracks; Word Bank localized by **replaying `buildFrequencyBank`** with per-item
    option-length parity asserted (0 mismatches, full coverage: 1274 / 1380 keys).
- **2 English-target tracks** `data/tracks/enUsForPt.js` + `enGbForPt.js` (new, full
  `sourceSpecific` tracks, `nativeLang:"pt"`), imported + registered in `tracks/index.js`.
  Translated es→pt from `enUsForEs`/`enGbForEs`: English target content + `correctIdx` +
  difficulty preserved byte-for-byte; only Spanish learner-facing surfaces became Portuguese.
  enGb keeps its 6-slot `promptEn`. Counts: enUs 133/519/125+77fono · enGb 131/518/122+79fono.
- **Offering flipped:** `pt` added to `RELEASED_SOURCE_LANGS` (`tracks/index.js`) and
  `SUPPORTED_UI_LANGS` (`lib/uiLang.js`). §4b audit: `tracksForNativeLang("pt")` returns exactly
  **12** tracks (pt-target tracks excluded; both English targets included); **no regression** to
  en (13) or es (12). §4a: no `profile?.native_lang` reads in any touched file. `getL10n(id,"pt")`
  resolves for all 10 reused tracks; es resolution unchanged.
- **Remaining 3.2.0 beat (flagged, English fallback meanwhile):** the **fono (phonetics) pt
  layer** — `identify/respondPromptNative` subtitles + per-item fono `explain.es`→`pt` across the
  10 reused track files. Not done because it means editing `.map()` blocks inside 10 large
  *shared* track files (the `respondPromptNative` templates embed `${i.text}`, defeating safe
  scripted edits). Phonetics subtitle/explanation falls back to readable English until then. The
  2 English-target tracks DO have their fono prompts in pt.
- Verification: `node --check` on all 15 changed/new files; esbuild bundle-load of every side
  table, both English tracks, `l10n/index.js`, and the offering logic; structural parity +
  Word-Bank replay assertions all pass. No deps/lockfile change. CRLF preserved.
- No version bump — folds into the **3.2.0** release entry at the dev→main merge.

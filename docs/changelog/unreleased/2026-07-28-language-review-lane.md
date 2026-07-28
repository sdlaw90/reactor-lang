# 2026-07-28 — Native-review lane moved into the repo (`docs/language-review/`) (v3.3 work-beat)

_Folds into the single **3.3.0** release entry at the dev→main merge. Docs + tooling only; no
app, content or component changes._

## User-facing
- None — internal only. Nothing here is imported by the app or served to a user.

## Internal
- **Problem:** the #41 native-review packet lived as a project-knowledge markdown doc. It had
  no return path (a reviewer's corrections came back as prose to be re-matched to keys by
  hand), no home for a returned file, no record of what had been applied, and no generator —
  standing the same thing up for Portuguese meant rewriting it. It was also **built from the
  v3.1 doc rather than from the repo**, so it had drifted.
- **New `docs/language-review/`** — one folder per reviewer relationship, holding the packet
  sent, the file returned, the changeset derived from it, and the record of what landed.
  - `README.md` — the lane model, the folder contract, the loop.
  - `pipeline/` — `extract.mjs` (repo → review data), `build_workbook.py` (→ .xlsx + a .md
    text twin), `ingest.py` (returned .xlsx → changeset .md), and `i18n/<lane>.json` holding
    all reviewer-facing copy.
  - `es-latam/`, `es-spain/` — the two Spanish lanes, each with `STATUS.md`, `template/`,
    `submitted/`, `changesets/`, `implemented/`.
- **A lane is a variety, not a language.** Spanish is two lanes because the regional-variant
  card asserts facts about *both* sides and only a native of each can verify their own. The
  71 peninsular reference terms ride along in the es-latam packet as read-only context, marked
  advisory, so a LatAm sign-off can never be silently read as covering Spain.
- **A lane splits into three scopes**, because they are three different jobs and differ by an
  order of magnitude in size: `interface` (does the app read naturally — 1,207 rows),
  `taught` (is the Spanish it teaches correct, and is every distractor genuinely wrong —
  1,353), `explanation` (is the Spanish explanation of another language accurate — 4,872).
  In the content scopes **one row is one question, not one string**: split into strings, a
  question becomes eleven rows and one decision, and the reviewer can no longer see whether a
  distractor is secretly correct.
- **This closed a real coverage hole.** The previous packet covered only the interface —
  roughly 10% of the Spanish in the product, and the chrome rather than the teaching.
  `data/tracks/esForEn.js` (665 questions), `data/vocab/esLatAmWords.js` (609 Word Bank
  entries), `enUsForEs.js` / `enGbForEs.js` (1,548 questions), and the Spanish glosses for the
  German, Japanese, Korean, Russian and Chinese Word Banks (2,768) had never been in a packet
  at all — despite `esForEn.js` and `esLatAmWords.js` both carrying `PENDING #41` markers.
- **Defects surfaced by the extraction, not yet fixed** (recorded in
  `docs/language-review/es-latam/STATUS.md`, and named on the packets' decision sheets so a
  reviewer doesn't spend attention re-reporting them):
  - 402 of 2,660 distractor notes in `data/tracks/esForEn.js` have `es` byte-identical to
    `en` — untranslated. A Spanish-native learner at Advanced level sees English.
  - Circular Spanish explanations in the same file (`"'La puerta' es puerta"`), from
    translating the English gloss instead of writing a Spanish one.
  - Gendered / slash forms still in `dev`: `homeGreeting` = `"¡Bienvenido/a"`,
    `securityQuestions.childhood_street` = `"…de niño"`, `setRecNoteNone` = `"…tú mismo"`,
    `skillLevels.LEVEL_DESCRIPTIONS.expert`, `notSureTakeQuiz`.
  - `app/terms/page.js`, `app/privacy/page.js` and `lib/emailTemplate.js` carry no Spanish at
    all — a Spanish user meets the legal pages and every transactional email in English.
- **Drift protection:** `extract.mjs` sweeps `app/` and `lib/` for bilingual `{ en, <lang> }`
  maps in files it doesn't know and warns, so a newly localized component announces itself
  instead of being silently missing from the next packet. `lib/frequencyVocab.js` currently
  trips it (word-frequency data, not user-facing copy — confirm and add to `KNOWN`).
- **No new npm dependencies.** `extract.mjs` lifts module-private localization tables out of
  file text and evaluates them rather than adding a parser or editing app source to expose them.
- **Worked fixture + regression check** — `pipeline/example/` holds a fabricated, fully
  filled-in submission and the changeset it produces; `pipeline/check_example.py` re-runs
  `ingest.py` over it and diffs. It documents the expected return format and guards the quiet
  failure mode: a moved column or an unmatched verdict word making a reviewer's corrections
  silently vanish. Kept out of `es-latam/submitted/` on purpose — that folder holds real
  reviewer testimony.
- **Freshness guard** — every packet now ships a `<stem>.sources.json` fingerprinting the repo
  files it was built from, and `pipeline/check_freshness.py` diffs that against the repo. A
  packet is a snapshot of a moving `dev`; the version in its filename cannot tell you whether a
  release beat landed underneath it. This bit immediately: the first `es-latam` `interface`
  packet was built from a snapshot taken minutes before the v3.3 beat rewrote
  `lib/playStrings.js` (64,523 → 83,237 bytes) and `lib/helpAboutContent.js` (76,524 → 104,449)
  underneath it, so it is marked STALE in `es-latam/STATUS.md` and must be regenerated before
  it goes to a reviewer. `taught` and `explanation` read `data/tracks/` and `data/vocab/`,
  untouched by v3.3, and are unaffected.
- Every `.xlsx` ships with a generated `.md` twin so git can diff a packet and a string can be
  grepped without opening Excel.

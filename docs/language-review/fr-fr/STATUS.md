# fr-fr — review ledger

**Lane:** French (France). Source-language code `fr`; **owns the shared `fr` localization** —
there is only one `fr` block in `lib/playStrings.js` and it is written in metropolitan French.
Counterpart lane: [`fr-ca`](../fr-ca/STATUS.md).

**Reviewer: none. Not engaged, not identified.** Recruiting one is an open item; review
throughput, not build throughput, sets the public-launch date.

**Stood up 2026-07-29** by the v3.3 Phase 3.5 run. All three packets are generated and fresh.

## Naming — why `fr-fr` / `fr-ca` and not `fr-france` / `fr-quebec`

The run prompt asked for `fr-france` and `fr-quebec`. The repo's own registry — `LANES` in
`pipeline/extract.mjs`, which is what `--lane` resolves against — already had `fr-fr` and
`fr-ca`, and `docs/language-review/README.md` sketches the folder tree the same way. Lane codes
follow the repo, not BCP-47 and not the prompt, so these are `fr-fr` and `fr-ca`. Nothing had to
change in the extractor's lane registry.

## Packets

| Scope | Rows | Built from | Verified |
|---|---:|---|---|
| `interface` — how the app reads | **785** | `dev`, v3.3 Phase 2+3 uncommitted | ✅ fresh |
| `taught` — the French it teaches | **1,623** | `dev`, v3.3 Phase 2+3 uncommitted | ✅ fresh |
| `explanation` — French explaining other languages | **2,104** | `dev`, v3.3 Phase 2+3 uncommitted | ✅ fresh |

### ⚠️ Status: BUILT, NOT CLEARED TO SEND

The packets regenerate byte-identically from the repo and the freshness check is green, but an
independent review of this lane on 2026-07-28 rejected the first cut of the reviewer-facing copy
(`pipeline/i18n/fr-fr.json`) because its examples had been translated from the Spanish lane
rather than derived from the French repo — including an **inverted** instruction telling the
reviewer that the France rows on the variant card were not theirs. That was re-derived and the
packets rebuilt. **The re-derivation has not itself been independently reviewed.** Read the
verdict in `docs/_run-log-v3.3.md` before sending anything, and spot-check the decision sheet
against the repo yourself: every claim on it should be greppable in `lib/playStrings.js`,
`lib/skillLevels.js` or `lib/helpAboutContent.js`.

None sent. **Send `interface` first** — smallest, it carries the decisions sheet whose answers
pre-resolve rows in the other two, and the packet format has still never been used by a real
reviewer. (That is also true of es-latam, and es-latam should go first of all: validating the
format once in Spanish costs one correction pass instead of two.)

Before sending, run:

```
node docs/language-review/pipeline/check_freshness.mjs --lane fr-fr
```

**Regenerated 2026-07-29** so each packet's `sources.json` carries `rowCounts`/`rowTotal`. All
three content hashes came back identical to the previous build (`0c16baa2cd81`, `fc5f4df163dc`,
`788c81e21a6f`) — nothing about the review content changed. The `interface` build reports 194
extractor warnings; all of them are the two documented French gaps (no `label_fr` on the ten
security questions, no `fr` on the 184 changelog bullets), and the LISEZ-MOI already tells the
reviewer those tabs need no attention. This lane also passes the new stale-tab-reference lint in
`build_workbook.py` unchanged — the hand corrections made here are what the es-latam fix copied.

The covering email is rendered, not written:

```
node docs/language-review/pipeline/render_email.mjs --lane fr-fr --name <reviewer>
```

Its `dispatchEmail` copy in `pipeline/i18n/fr-fr.json` carries the two warnings specific to this
lane: that the variant card's French register is a two-concept seed rather than a built
repertoire, and that the security-question and Nouveautés tabs are empty by construction. Like
the packet copy above, **that email text has not been independently reviewed** — read it before
sending.

Node only, no dependencies — it has to work on send day regardless of toolchain.

### How this compares to es-latam, and why the numbers differ

| Scope | es-latam | fr-fr | why |
|---|---:|---:|---|
| `interface` | 1,208 | 785 | French has **6** regional-variant rows and **15** card-config rows against Spanish's 325 / 117 — the `fr` block in `regionalVariants.js` is still a 2-concept seed (see defect 4). |
| `taught` | 1,353 | 1,623 | `frForEn.js` is a bigger track than `esForEn.js` (959 questions + 76 pronunciation items + 588 Word Bank entries). |
| `explanation` | 4,872 | 2,104 | Spanish contributes **2,768 glossary rows** from `data/vocab/*.es.js`. French has **zero** — see defect 3. |

## What each packet covers

**interface** (785) — `playStrings` UI strings 403 · Help/About prose 110 · component string
maps 57 · security questions 10 · regional variants 6 · variant card config 15 · changelog 184.

**taught** (1,623) — `data/tracks/frForEn.js`: 959 questions + 76 pronunciation items ·
`data/vocab/frWords.js`: 588 Word Bank entries. One row per *question*, not per string.

**explanation** (2,104) — `data/tracks/enUsForFr.js` + `enGbForFr.js`: 1,548 questions + 156
pronunciation items · a 400-row stratified sample of the `l10n/*.fr.js` overlays.

## ⚠️ Known defects — found during extraction, not by a reviewer

Named here (and on the packets' decision sheets) so the reviewer does not spend attention
re-reporting what we already know.

1. **`lib/securityQuestions.js` has no French at all — and cannot get it without a code change.**
   All 10 questions carry `label_es` and nothing else, and `questionLabel(key, lang)` is
   hardcoded `if (lang === "es" && q.label_es)`. Adding `label_fr` alone would do nothing.
   **This is also a live Portuguese defect on `main` today.** A Portuguese user picks their
   security questions from a `<select>` of ten English sentences inside an otherwise-Portuguese
   form, on `app/beta-apply` and in Settings. Severity is **cosmetic**: answers are stored and
   compared by `key`, so account recovery is unaffected, and nothing renders as a raw key.
   (Do not confuse this with the Phase-1 stop reason — that was `lib/LangSwitcher.js` rendering
   the literal string `pt`, and it is already fixed in this checkout.) **Worse half, and not
   recorded anywhere before now:** `app/forgot-password/page.js:164` renders `q.label` straight
   from the API, so the reset flow shows the question in **English to everyone**, including
   Spanish users who chose it in Spanish. The 10 rows ride in the interface packet as English,
   and the packet's own instructions now say why.

2. **184 changelog bullets in `lib/version.js` have no `fr`.** The whole in-app What's New
   history is English for a French user. Phase 6 of the v3.3 arc. They ride in the packet as
   English so the reviewer can see the scale, not so they translate them there.

3. **The `explanation` packet has an EMPTY Word Bank glossary sheet, and that is a real coverage
   hole.** The Spanish lane reviews 2,768 gloss rows from `data/vocab/deWords.es.js` and its
   siblings. French has no equivalent files: the Word Bank glosses were translated **in place**
   inside `data/tracks/l10n/*.fr.js` (which is what carried fvocab for free and is the
   recommended path in the playbook). The consequence is that ~2,800 French gloss decisions are
   covered only by the 400-row stratified `l10n` sample — roughly a 14% sample where Spanish
   gets 100%. **Decide before the review wave**: either emit `data/vocab/<x>Words.fr.js` files
   from the side tables so they can be reviewed as a block, or raise the `l10n` sample rate for
   this lane and say so on the packet.

4. **The French regional-variant registry is a 2-concept seed.** `regionalVariants.js` `fr`
   holds 2 records against Spanish's 71 and Portuguese's 64. Deployment plan §4c says extend a
   variant registry to its **high-frequency ceiling BEFORE** native review, so the reviewer
   clears it in one pass. That build-out is Phase 5 and has not happened. **The 6 variant rows
   in this packet are therefore not a review of the French regional card — they are a review of
   a seed.** Do not treat a returned `interface` packet as sign-off on France↔Québec vocabulary.

5. **`build_workbook.py` crashed on a zero-row section.** Building the `explanation` packet with
   an empty glossary sheet raised `ValueError: 1 must be greater than 2` from openpyxl, because
   the data-validation range is built as `<col>2:<col><nrows+1>` — `"D2:D1"` when `nrows` is 0.
   Fixed in this run with a `if nrows < 1: return` guard (header-only sheet, no dropdown). Noted
   because it is a pipeline defect that only appears when a lane has an empty section, and
   every non-Spanish lane will hit it.

6. **`taught` and `explanation` ship four columns blank or in the wrong language**, all from
   the same root: the French explanations for French-taught content do not exist yet.
   - `taught` / `1-Questions`: all **959** "Explication en français" cells contain **English**,
     and the English reference column is empty. `frForEn.js` explanations are `{en, es, pt}`.
   - `taught` / `2-Prononciation`: all **76** rows have an empty French explanation AND empty
     minimal pairs. `extract.mjs:398` reads `f.identify?.explain?.[LANG] || f.explain?.[LANG]`
     with **no `.en` fallback**, unlike the questions path one line up. The Spanish lane never
     hit this, so it never surfaced.
   - `explanation` / `2-Prononciation`: all **156** minimal-pair cells empty.
   - Neither content packet carries a single option note (es-latam `taught` carries 665):
     `extras.distractorNotes.fr` does not exist on these tracks.
   All four are now explained inside the packets' own instructions so the reviewer does not
   report them as their finding.

7. **The theme labels and the `#89` chips are in NO packet at all.** `extract.mjs` contains zero
   references to `Tags`, and its drift sweep walks only `lib/` and `app/` — never `data/`. So the
   108 `THEMES` French rows (Phase 1) and the 168 `#89` chip objects (Phase 3), both counted in
   the volume table below, are invisible to this lane. The superseded Phase-1 markdown packet
   *did* include the theme labels, so "this lane supersedes it" is not true of that surface.
   **Fix before the wave goes out**: add a `tags` section to `extract.mjs`, or send those rows
   as an addendum.

8. **The drift sweep is clean, and that is less reassuring than it sounds.** It found no unknown
   bilingual `{ en, fr }` maps in `app/` or `lib/`. But the sweep matches keys named for the
   language — it **cannot see `label_<lang>`-style keys**, which is exactly how defect 1 stayed
   invisible to the standing offering-flip sweep. It also never walks `data/` at all (defect 7).
   Treat "drift sweep clean" as covering the `{en, xx}` shape, inside `lib/` and `app/`, only.

## Carried forward from the superseded Phase-1 packet

`claude/squirrelingo_fr_review_packet.md` is **historical**. Do not extend it. It covered the
`interface` scope only — about 10% of the French in the product — and this lane supersedes it.
Two things in it are worth keeping and are reproduced here.

### Judgment calls the reviewer is asked to confirm

- **Register: `tu`, informal, throughout.** **SETTLED by the product owner 2026-07-29** — it
  matches the other language-learning apps and keeps parity with es (`tú`) and pt (`você`). The
  reviewer is asked to flag `tu` phrasing that reads *awkwardly*, **not** to reconsider `tu` vs
  `vous`. The decision sheet says so explicitly.
  - **Amendment, v3.3 Phase 2:** the rule governs **app voice**. Exercise content whose drilled
    sentence has a genuine 2nd-person-**plural** subject (Spanish `vosotros`/`ustedes`,
    Portuguese `vocês`, German `ihr`) uses `vous` with proper agreement — that is grammatical
    number, not register. 345 items in the side tables are affected and each one's source
    carries a plural marker.
- **French typographic spacing.** U+00A0 before `: ; ? !` and inside `«  »`, guillemets for
  quoted UI text, typographic apostrophe `’`. Invisible in a diff, so it is called out.
- **`Alphabet` as the mode name for writing systems**, including hangeul, Cyrillic and Chinese
  characters, which are not alphabets strictly. Mirrors the English. Confirm, or suggest
  *« Écriture »*.
- **`CATEGORY_NAMES.verbo` → « Verbes », not « Grammaire ».** `verbo` is a legacy key used only
  by the two Spanish-target tracks — both of which a French native *is* offered. Its `en` value
  is "Grammar"; es and pt both render it "Verbos". Confirm that seeing **Verbes** on the Spanish
  tracks and **Grammaire** everywhere else is acceptable rather than confusing.
- **Theme chip `numbers-time` → « Nombres, dates et heures ».** A literal *« Nombres et temps »*
  is ambiguous (*temps* = time / weather / verb tense), so the longer form was chosen. It is the
  longest of the nine chips — confirm it fits.
- **`es-spain-for-en` sublabel keeps two Spanish words on purpose:** *« … · vosotros,
  distinction »*. `vosotros` is the Spanish grammatical feature being named, so it stays Spanish.
- **Anglicisms kept on purpose:** *bêta*, *bêta-testeur*, *bug*, *combo*, *XP*, *Chromebook*,
  *iPhone*, *Tablette*, and brand names.
- **The tense-hint feature is named two ways, deliberately.** `setGpTogTense` calls it
  *« Roues d'appoint pour les temps verbaux »* (matching the English "training-wheels"
  metaphor); `setGpSummary` says *« indications de temps verbal »*. The English is inconsistent
  the same way. **`indications` was chosen specifically because it is feminine plural** — the
  summary interpolates `{tHints}` = *activées* / *désactivées*, which would not agree with a
  masculine noun like *indices*. That agreement bug was caught and fixed at the Phase-1 gate;
  don't "simplify" it back.

### Glossary — confirm each term, since every one of them recurs everywhere

| Concept | French chosen | Note |
|---|---|---|
| round (a set of questions) | **manche** | `Rondes` rejected as an anglicism. Recurs ~20×. |
| Quick Quiz | **Quiz Rapide** | product mode name |
| Lessons | **Leçons** | |
| Grammar Gym | **Gym de grammaire** | Following pt, which translated it (`Academia de Gramática`). Say so if the English product name should be kept. |
| Alphabet mode | **mode Alphabet** | |
| Word Bank | **Banque de mots** | |
| CEFR | **CECR** | standard French abbreviation |
| placement quiz | **test de niveau** | |
| Settings | **Réglages** | `Paramètres` was the other candidate and was NOT chosen — the app says Réglages |
| streak | **série** | |
| combo | **combo** | kept |
| skill levels | **Aucune expérience / Débutant / Intermédiaire / Avancé / Natif** | |
| "Heads up" (wrong-answer callout) | **« Attention »** | |
| tense training-wheels | **roues d'appoint** (toggle) / **indications de temps verbal** (summary) | two words, one feature — see above |
| Review mode | **mode révision** | |
| native language | **langue maternelle** | |

### Where metropolitan French and Québécois plausibly diverge

Eight terms. None is wrong in France; the question is whether they read badly to a Québécois
user. **The app has ONE French source column**, per "variants distinct as targets, consolidated
as sources" — so these need a single answer acceptable in both, not two columns. The standing
recommendation is to keep the metropolitan forms (France is the reference variety) and surface
the Québécois alternatives through the regional-variant card once the `fr` block is built out.

| Term | France (used) | Likely Québec preference |
|---|---|---|
| bug | **bug** | **bogue** |
| e-mail | **e-mail** | **courriel** |
| appli | **appli** | **application** |
| chrono | **chrono** | **minuteur / chronomètre** |
| Achats (theme chip) | **Achats** | **Magasinage** |
| cartes mémoire | **cartes mémoire** | **fiches / cartes-éclair** |
| soutien scolaire | **soutien scolaire** | **tutorat** |
| Se déconnecter | neutral | — |

### Deliberately excluded from this lane, and why

1. **Fono (pronunciation respellings) in French orthography (#71)** — Phase 4, not built.
2. **The French regional-variant registry beyond its 2-concept seed** — Phase 5 (defect 4).
3. **The changelog / What's New** — present as English rows; French translation is Phase 6
   (defect 2).
4. **Long-tail regional vocabulary** — per handoff strategy §5, coverage is pushed hard on the
   high-frequency core and deliberately stopped before rare or fuzzy-boundary items. The
   registry isn't built yet, but the same boundary will apply when it is.
5. **The ~83 user-facing strings that are not localized into ANY source language** (guided tour,
   Grammar Gym page, dashboard, feedback forms, error pages). They are English for Spanish and
   Portuguese users too. Their own release; see `docs/_fr-offering-flip.md` §4 and §5.
6. **The 721 `#89` training-wheel chips on the de/ru/ja/ko tracks** — `{en, <target>}`, never
   localized into any source language. Also English for es and pt users today.

## Volume of AI-authored French awaiting this lane

| Surface | Rows | Landed |
|---|---:|---|
| Phase 1 — `playStrings`, Help/About, skill levels, sublabels, THEMES | ~636 | v3.3 Phase 1 |
| Phase 2 — 10 × `l10n/*.fr.js` side tables | **13,554 entries** | v3.3 Phase 2 |
| Phase 2 — `enUsForFr.js` + `enGbForFr.js` | **1,548 questions + 156 fono** | v3.3 Phase 2 |
| Phase 3 — `#89` chips on 5 Romance tag files | 168 objects | v3.3 Phase 3 |

**Roughly 150,000 words of French, none of it seen by a native speaker.**

## Submissions

_None yet._ When one arrives:

| File | Reviewer | Scope | Received | Changeset | Applied |
|---|---|---|---|---|---|

Name returns `YYYY-MM-DD-<reviewer>-<scope>-v<version>.xlsx` — `ingest.py` reads the scope back
out of the filename.

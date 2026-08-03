# 2026-08-03 — Side tables can carry explanations, and now load per source language

_Folds into the **3.4.0** release entry._

## User-facing
- None yet — this is the plumbing the v3.4 Portuguese/French explanation backfill runs through.
  No content changed, no coverage moved (verified: identical before and after).
- One thing improves immediately for everyone: **opening a lesson downloads ~877 KB less.**
  The localized surface for a lesson is now fetched per track and per language instead of
  every language's tables for every track being bundled together.

## Internal
- **`explain` had no side-table channel, and two releases shipped without their own
  definition of done.** The per-source trio is #72 (UI strings), #71 (fono respellings) and
  **#60 (explanations in the native language)**. The side tables carried
  `prompt / promptNative / options / wrongNote / distractorNotes` — never `explain`, which
  `flattenBank` read straight off the base bank. So the only way to give a source language its
  own explanations was to edit the giant banks in place, which is what v3.0 and v3.1 did for en
  and es. v3.2 (pt) and v3.3 (fr) did not, and nothing caught it.
  - Measured through the real path (`flattenBank` + the play screen's own `resolveExplainText`):

    | native | explanations in native lang | wrong notes | distractor notes | fono |
    |---|---|---|---|---|
    | en | 17,399 / 17,399 — 100% | 100% | 100% | 100% |
    | es | 15,522 / 15,522 — 100% | 100% | 100% | 100% |
    | pt | 1,548 / 15,044 — **10%** | **0%** | **7%** | 100% |
    | fr | 1,548 / 15,102 — **10%** | **0%** | **7%** | 100% |

    The 10% is exactly the two English-target tracks, which are authored fresh per source.
  - It degrades safely rather than breaking: `resolveExplainText` falls back to `map.en` and
    tags the row `EN`. A French native answering a German question today gets a French question,
    a French subtitle, German options — and an English explanation.
- **`flattenBank` now merges `explain` and `wrongNote` from the side table** (`lib/gameEngine.js`).
  - New exported `mergeLangMap(base, loc, sourceLang)`. `loc` is either a bare string — the
    source-language text, matching how side tables already carry `prompt`/`promptNative` — or a
    partial map for an item needing a regional split.
  - It **merges with the base map first** rather than replacing it. That is the whole point: an
    item the backfill has not reached still resolves to English instead of going blank, so the
    backfill can land incrementally, per track, without a coverage cliff.
  - Same treatment for `wrongNote`, which also **fixes a latent bug**: the old
    `loc.wrongNote || base` would have handed the play screen a bare string where it expects a
    `{ en, es, … }` map. Nothing shipped through it — no side table had ever used the field.
  - `distractorNotes` still replaces, because a side table that localizes `options` re-keys them
    to the localized option text and base keys no longer correspond; each *value* merges.
- **The side tables are now loaded per source language, on demand** (`data/tracks/l10n/index.js`).
  - They were 32 static imports, which the bundler collapsed into **one 4.8 MB / 877 KB gzipped
    chunk** attached to `/play`, `/learn` and `/placement`. Opening any lesson downloaded every
    source language's tables for every track.
  - The #60 backfill would have made that untenable: the payload measures **2.78 MB raw /
    449 KB gz per source** (13,554 explanations + 6,270 wrong notes + 15,453 distractor notes),
    so pt+fr alone added ~900 KB gz to a chunk every learner already pulls, and ~2.7 MB more by
    v4.0. Doing this after the content would have meant shipping the regression first.
  - Registry entries are `() => import(...)` thunks now; the bundler emits one chunk per table.
    Verified in a production build: the 4.8 MB chunk is gone, replaced by ~30 chunks of
    **31–35 KB gz**, and no side-table content remains in any shared chunk. An English native
    downloads none of them.
  - API: `loadL10n(trackId, sourceLang) → Promise<map|null>` (memoized, shares in-flight
    promises, does not cache failures so a retry can still succeed) and `getL10n(trackId,
    sourceLang)` unchanged in signature but now a synchronous cache read.
  - `getL10n` returning null before the chunk lands is the same value it already returned for
    "no side table for this pair", and the engine answers null with the base English surface —
    so a render that beats the fetch degrades like an unlocalized track, never blank.
- **All three consumers await the load before building anything.**
  - `app/play/[trackId]` — folded into the existing `Promise.all` beside progress/missed/seen,
    held in state, and `loaded` does not flip until it resolves. No round can be built off a
    half-loaded surface.
  - `app/learn/[trackId]` — same, and `startLesson` reads the state instead of calling `getL10n`.
  - `app/placement/[trackId]` — the await was deliberately placed **above** the #U1
    resume/restart branch, not inside the `else`. `restartPlacement` reads the cache
    synchronously, and that read only finds anything because the load runs on both paths; had it
    stayed in the `else`, restarting after a resume would have silently built an English quiz.
- **Two verification scripts, `npm run verify:l10n`** (`scripts/verify-l10n-explain.mjs`,
  `scripts/verify-l10n-lazy.mjs`). Between them they cover file → map → card: the lazy script
  checks all 30 (track, source) tables resolve identical to a direct import, plus the null and
  memo contracts; the explain script checks the overlay reaches the card, the English fallback
  survives, regional `{ latam, spain }` values survive, and es/en are untouched.
  - Every check is **mutation-tested** — four mutations (`no-overlay`, `replace-not-merge`,
    `drop-a-pair`, `static-import`), each asserted to be a real edit before it runs, each
    turning the expected checks red. v3.3 shipped five checks that could not fail; none of these
    can join them.
  - The lazy script reads its expected inventory from the **filenames on disk**, not from
    `index.js`, so a table dropped from the registry is caught rather than agreed with. The
    `static-import` guard exists because one stray static import would quietly undo the split.
- **Verified:** `npm run lint` 0 errors / 72 warnings, unchanged from `origin/dev`; full
  `next build` green; both verify scripts green with all four mutations red; explanation
  coverage byte-identical before and after (the change adds a channel, not content).
- Not addressed, logged instead: the separate **~14 MB raw / 2.5 MB gz chunk** on `/`,
  `/dashboard`, `/onboarding` and the learning routes is the base track banks, statically
  imported from `data/tracks/index.js`. Same problem, different file, its own piece of work.
- Also not addressed: fono explanations (`extraBank`) are still written into the track files
  per source — 1,590 strings per language, ~4% of the volume, and `flattenBank` never sees
  them. Worth folding into the side-table channel before the matrix gets much wider.
- No dependency or lockfile change. `package.json` gains one script entry.

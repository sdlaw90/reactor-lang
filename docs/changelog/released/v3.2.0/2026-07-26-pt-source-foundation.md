# 2026-07-26 — Portuguese source foundation (v3.2 groundwork)

## User-facing
- None yet — this is dormant plumbing. Portuguese is not offered as a native
  language until the directed-track localization layer lands (v3.2.1); nothing
  changes for existing English/Spanish users.

## Internal
- **v3.2 Portuguese, foundation beat (additive, non-regressing — offering NOT
  flipped).** Front-loads the safe, bounded #72 + regional-variant work so the
  heavier v3.2.1 content beat is just the directed tracks + the two flips.
- **`lib/playStrings.js`** — added a `pt` value to every one of the 390 `STRINGS`
  keys (Brazilian Portuguese, warm/everyday register; neutral where BR/PT agree).
  `CATEGORY_NAMES` already carried `pt`. Verified: 0 missing, 0 placeholder-parity
  mismatches vs. `en`, emoji/tokens preserved. `t()` still falls back to English
  per-key, so this is inert until a viewer resolves as `pt`.
- **`lib/skillLevels.js`** — added `pt` to `LEVEL_LABELS` and `LEVEL_DESCRIPTIONS`.
- **`data/tracks/l10n/regionalVariants.js`** — extended the `pt` block from 4 seeds
  to **64** high-frequency BR↔PT divergences toward the §4c ceiling (reference =
  Portugal, regional = Brasil, per the origin rule). Feeds the dual-version card
  (U4) once `pt` is offered. Two generated pairs were **dropped for safety**
  (`queue`/*bicha*, `injection`/*pica*) — the European reference term is a
  slur/vulgarism in Brazilian Portuguese and the card would surface it to BR
  learners as "Em Portugal: …".
- **Deliberately held for v3.2.1** (gate on the full localization layer, to honor
  the "never a half-localized experience" rule): `pt` in
  `RELEASED_SOURCE_LANGS` (offering), `pt` in `SUPPORTED_UI_LANGS` (pre-login
  auto-detect/switcher), the 10 directed-track `<track>.pt.js` side tables, fono +
  Word-Bank (fvocab) localization, the two English-target tracks
  (`enUsForPt`/`enGbForPt`), and the §4b target-parity audit.
- **Native review owed (#41):** all `pt` UI strings, skill labels, and the 64
  regional-variant attributions are AI-authored → route to a Portuguese reviewer
  (none lined up yet). Highest-stakes: the regional country→term claims.
- Data/string-only; `node --check` clean on all three files, and all three load +
  resolve at runtime via esbuild-bundled functional test (regional lookups,
  placeholder interpolation, English fallback). No deps/lockfile change.
- No version bump — folds under the **3.2.x** release at the ledger/roll-up.

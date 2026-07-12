# Changelog fragments

Every delta zip includes **one fragment file** in `unreleased/`:

```
unreleased/YYYY-MM-DD-short-slug.md
```

Unique filenames (date + slug) mean parallel session chats can never
collide — this deliberately mirrors the single-owner version-ledger rule.
`lib/version.js` stays owned by the deepening/ledger chat; fragments are
owned by whichever chat produced the work.

## Fragment format

```md
## User-facing
- Bullet(s) in final release-note voice, gameplay-relevant changes only
- Write "None" if the deploy is internal-only

## Internal
- Everything else: pipeline work, docs, refactors, workflow fixes
```

Write the **User-facing** bullets in polished release-note voice at dev
time, while context is fresh — the prod rollup is then assembly, not
authorship.

## At prod release (ledger chat only)

1. Concatenate all `unreleased/` fragments
2. User-facing bullets → the release notes, **regrouped by feature area**
   (users don't care about deploy boundaries); Internal bullets → the
   shipped archive / dev history
3. Move the fragments to `released/vX.Y.Z-beta.N/`
4. `unreleased/` is now empty — an empty folder means prod is current; a
   non-empty one shows exactly what's pending in dev at a glance

Manual rollup for now. Add `scripts/rollup-changelog.mjs` only if fragment
volume per release makes assembly annoying.

# Changelog fragments

Every delta zip includes **one fragment file** in `unreleased/`:

```
unreleased/YYYY-MM-DD-short-slug.md
```

Unique filenames (date + slug) mean two sessions can never collide.
`lib/version.js` is edited only at the release, by whoever cuts it;
fragments are owned by whichever session produced the work.

## Fragment format

```md
# YYYY-MM-DD — Short title (vX.Y work-beat)

_Folds into the **X.Y.Z** release entry._   ← REQUIRED: name the target version

## User-facing
- Bullet(s) in final release-note voice, gameplay-relevant changes only
- Write "None" if the deploy is internal-only

## Internal
- Everything else: pipeline work, docs, refactors, workflow fixes
```

Write the **User-facing** bullets in polished release-note voice at dev
time, while context is fresh — the release rollup is then assembly, not
authorship.

**Naming the target version is required, not decorative.** `unreleased/`
can hold fragments for more than one pending version at once: a Z release
ships as soon as it's ready, while a Y milestone is still accumulating
beats on the same branch (deployment plan §5). Without the target version
on each fragment there is no way to tell which bullets belong to the
release being cut.

Internal-only fragments (`User-facing: None`) are the one loose case —
they earn no release of their own and simply ride with whatever ships
next. Name the version you expect that to be; if a different one ships
first, roll the fragment into that instead and correct the line.

## At release

1. Select the fragments naming **the version being cut** — not the whole
   folder
2. User-facing bullets → the release notes, **regrouped by feature area**
   (users don't care about deploy boundaries); Internal bullets → the
   shipped archive / dev history
3. Move **those** fragments to `released/vX.Y.Z/`
4. Fragments targeting a later version stay in `unreleased/`. An empty
   folder means prod is fully current; a non-empty one shows exactly
   what's still pending on dev, and for which version

Manual rollup for now. Add `scripts/rollup-changelog.mjs` only if fragment
volume per release makes assembly annoying.

# Packaging & delivery convention

## Primary path: write directly to the connected repo

When the repo is reachable as a connected folder, **write the changed/new files
directly into it** (via the device file tools). This is the default and
preferred delivery.

- On success — i.e. the write reports **`rejected: []`** (every file written) —
  do **not** produce files in the chat and do **not** build a zip. Instead give
  a **neat list of the files written, with their repo-relative paths**, grouped
  into *modified* vs *new*, so the change can be visually confirmed.
- The files land in the working tree **uncommitted**. The human reviews with
  `git status`, confirms the branch is **`dev`** (never `main`), and commits.

## Fallback: the zip (only on failure)

Produce a downloadable zip **only if** writing to the repo fails, or the write
result's **`rejected` array is not empty** (any file rejected — e.g. an mtime
conflict). In that case, deliver a zip whose single top-level folder is
`reactor-lang/`, with changed/new files at their repo-relative paths inside it,
extracted at the **parent** of the local repo so it overlays in place.

```
reactor-lang/                      ← exactly ONE top-level folder
  lib/version.js                   ← files at their real repo-relative paths
  app/changelog/page.js
  ...
```

- **Never** omit the `reactor-lang/` root; **never** double-nest
  (`reactor-lang/reactor-lang/…`) — that's the historical trap.
- **Verify before delivering:** `unzip -l the-package.zip` should show exactly
  one `reactor-lang/` root and no `reactor-lang/reactor-lang` path.

## Two kinds of zip (when a zip is needed)

| Kind | Contents | `package-lock.json`? |
|------|----------|----------------------|
| **Full deployment zip** (release session) | Full repo or a build-ready tree | **Yes** — freshly generated, `npm ci`-verified |
| **Delta / update package** (small fix, deps unchanged) | Only the changed/new files | **No** — the existing lockfile stands |

Always state which kind you're shipping.

## Applying a fallback delta zip

1. `cd` to the **parent** of the repo (e.g. `C:\Users\sean\Documents`).
2. Extract there — `reactor-lang/…` overlays the existing repo.
3. `git status` to review; confirm the branch is `dev`; commit.

## Guardrail

`npm run gen-tree` regenerates `repo-tree.md`; diffing it catches misplaced or
unexpectedly-nested files.

# 2026-07-28 — Marketing assets moved into the repo (`docs/marketing/`) (v3.3 work-beat)

_Folds into the single **3.3.0** release entry at the dev→main merge (planned build-out
accumulates under the target minor). Docs/asset housekeeping; no app or content changes._

## User-facing
- None — internal only. Nothing here is served by the app or imported by any component.

## Internal
- **Problem:** every social graphic, group cover, and announcement image built so far lived
  as a one-off chat download and vanished with the session. There was no canonical copy of
  the art the public posts actually used, and no way to regenerate it.
- **New `docs/marketing/`** — permanent, versioned home for documentation-only brand assets,
  with a README that maps each file to the post it shipped with, records the naming
  convention, and documents how to regenerate the HTML-sourced ones.
  - `docs/marketing/README.md` — index, naming convention, regeneration instructions.
  - `docs/marketing/social/` — `v3.0.0-what-the-app-offers.jpg` (512×640),
    `v3.1.0-release-square.png` (2048²), `v3.1.0-release-banner.png` (960×501),
    `v3.2.0-release-square.png` (1080², first post using the rebranded duo),
    `brand-rebrand-announcement-square.png` (1080², not version-tied).
  - `docs/marketing/covers/forest-cover-1640x856.png` — "One forest. Every language."
    Facebook group cover.
  - `docs/marketing/sources/` — `forest-cover.html`, `v3.2.0-release-square.html`; the
    regenerable originals, each keeping the same stem as the PNG it produces.
- **Naming convention** (README has the full rule): `v<version>-release-<format>.<ext>` for
  release art, `v<version>-<topic>.<ext>` for other version-tied graphics,
  `brand-<topic>-<format>.<ext>` for anything not tied to a release. `<format>` is `square`
  or `banner`; covers carry explicit dimensions because two similar 1640-wide assets exist.
- **`docs/marketing/sources/forest-cover.html` is now canonical** — it supersedes the
  project-knowledge copy `claude/squirrelingo_forest_cover.html`. Its `FAMS` array must be
  updated each time a language reaches native mode so the forest matches reality;
  **v3.3 French is the next update owed there.**
- **Not `public/`.** App-facing brand files (`facebook-banner.png`, `icon-*.png`,
  `splash.png`, `opengraph-image.png`) stay under `public/` because they're part of the
  shipped brand set. `public/facebook-banner.png` (1640×624) is a *different* asset from
  `covers/forest-cover-1640x856.png` — the README calls this out so they don't get merged.
- No dependency/lockfile change; no version bump — folds into the **3.3.0** release.

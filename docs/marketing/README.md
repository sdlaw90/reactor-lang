# Marketing assets

Every graphic used for a SquirreLingo social post, Facebook group cover, or announcement
lives here, versioned alongside the release it shipped with. Previously these were one-off
chat downloads that disappeared when the session ended — this folder is the permanent home.

These are **documentation assets, not app assets.** Nothing here is served by the app or
imported by any component. App-facing brand files stay under `public/` (`facebook-banner.png`,
`icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `splash.png`, `opengraph-image.png`).

## Contents

### `social/` — post graphics

| File | Size | Used for |
|---|---|---|
| `v3.0.0-what-the-app-offers.jpg` | 512×640 | Evergreen feature grid — "Language learning that fits how your brain actually works". Accurate as of v3.0.0. |
| `v3.1.0-release-square.png` | 2048×2048 | v3.1.0 Spanish native-language release — square feed post. |
| `v3.1.0-release-banner.png` | 960×501 | v3.1.0 Spanish release — wide/link-preview variant of the same post. |
| `v3.2.0-release-square.png` | 1080×1080 | v3.2.0 Portuguese native-language release — square feed post. First release post using the rebranded duo mascots. |
| `brand-rebrand-announcement-square.png` | 1080×1080 | "New look · same nuts" rebrand announcement. Not tied to a version. |

### `covers/` — Facebook group covers

| File | Size | Used for |
|---|---|---|
| `forest-cover-1640x856.png` | 1640×856 | "One forest. Every language." group cover, posted with the rebrand. Generated from `sources/forest-cover.html`. |

Note: `public/facebook-banner.png` (1640×624) is a *different* asset — the plain duo-on-gradient
banner from the icon/PWA rebrand pass. It stays in `public/` because it's part of the shipped
brand set.

### `sources/` — regenerable originals

| File | Produces |
|---|---|
| `forest-cover.html` | `covers/forest-cover-1640x856.png` |
| `v3.2.0-release-square.html` | `social/v3.2.0-release-square.png` |

## Naming convention

```
v<version>-release-<format>.<ext>     release-tied post art
v<version>-<topic>.<ext>              other version-tied graphic
brand-<topic>-<format>.<ext>          not tied to a release
```

`<format>` is `square` (1:1 feed post) or `banner` (wide). Cover images carry explicit
dimensions because Facebook's cover slots differ and two similar 1640-wide assets exist.

Source HTML keeps the same stem as the PNG it produces, so the pair is obvious.

## Regenerating

### `forest-cover.html`
Open in a browser and screenshot the `#banner` div (1640×856) at `deviceScaleFactor`
1 / 2 / 3 for FB-size / 2× / 3×. Everything data-driven lives in the inline `<script>`:

- `FAMS` — one entry per language family. `built: 1` renders a full tree;
  `leafs: [{ ab: "XX" }]` places a language acorn, `acorn: "full"` = gold (native mode)
  vs. brown (learnable).
- The squirrel `items.push(...)` lines — placement of the mascot characters.
- `SHOW_ALL_FULL` — toggle for a collision-preview render with every tree grown.

Update `FAMS` each time a language reaches native mode so the forest matches reality.
This file is identical to the project-knowledge copy `claude/squirrelingo_forest_cover.html`;
**this one is now canonical.**

### `v3.2.0-release-square.html`
Self-contained: brand gradient, inline duo-body and duo-heads SVGs, Baloo 2 pulled from
Google Fonts, emoji supplied by the OS. Screenshot the `.card` div at 1080×1080. To spin up
the next release post, copy it to `v3.<n>.0-release-square.html` and change the version pill,
flags, eyebrow/headline, subhead, and the "também se diz" regional card.

## Brand reference

Palette, mascot geometry, and the reusable head/body SVG source of truth live in
`claude/squirrelingo_logo_rebrand.md` (project knowledge). Wordmark is Baloo 2 —
`Squirre` warm-white `#fdf7ff`, `Lingo` rose `#f48fb1`. Background gradient
`#241a39` → `#3a2b5c`. Cyan accent `#3cd9ff`.

## Adding a new asset

1. Drop the exported image in `social/` (or `covers/`) using the convention above.
2. If it was built from HTML, drop that alongside it in `sources/` with the matching stem.
3. Add a row to the table in this README.
4. Commit with the release it belongs to.

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
| `v3.3.0-release-square.png` | 1080×1080 | v3.3.0 French native-language release — square feed post. |
| `brand-rebrand-announcement-square.png` | 1080×1080 | "New look · same nuts" rebrand announcement. Not tied to a version. |

### `covers/` — Facebook group covers

| File | Size | Used for |
|---|---|---|
| `forest-cover-1640x856.png` | 1640×856 | "One forest. Every language." group cover, posted with the rebrand. Generated from `sources/forest-cover.html`. |

Note: `public/facebook-banner.png` (1640×624) is a *different* asset — the plain duo-on-gradient
banner from the icon/PWA rebrand pass. It stays in `public/` because it's part of the shipped
brand set.

### `sources/` — regenerable originals

`sources/fonts/` holds the vendored webfonts (Baloo 2 500/600/700/800 and Nunito 600/700, latin
subset, from the `@fontsource` npm packages). The sources reference them with relative
`@font-face` rules instead of a Google Fonts `<link>`, so **the art renders identically offline and
in any sandbox**. Do not reintroduce the remote link: where `fonts.googleapis.com` is unreachable
the page silently falls back to a wider system face, and the release square overflows its card.

| File | Produces |
|---|---|
| `forest-cover.html` | `covers/forest-cover-1640x856.png` |
| `v3.2.0-release-square.html` | `social/v3.2.0-release-square.png` |
| `v3.3.0-release-square.html` | `social/v3.3.0-release-square.png` |

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

### `v3.<n>.0-release-square.html`
Screenshot the `.card` div at 1080×1080. `v3.3.0` was made by copying `v3.2.0`'s source and
changing only the version pill, flags, eyebrow, headline, subhead, regional card and CTA — the
mascot SVGs are carried over byte-identically, so the art never drifts between releases.

**Fonts are vendored (`sources/fonts/`), so no network is needed** — screenshot from anywhere.
Headless Chromium works: point it at the file, wait for fonts, screenshot the `.card` element.

⚠️ **`v3.2.0-release-square.html` does not reproduce its own PNG.** Its type is uniformly ~1.5×
larger than whatever produced `social/v3.2.0-release-square.png`, so rendering it 1:1 overflows the
card badly (headline wraps and collides with the URL pill). The committed PNG is correct; the
source drifted after export. **Use `v3.3.0-release-square.html` as the template** — its layout is
solved and verified to compose at 1080×1080, with a 22px gap between the CTA and the URL pill.

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

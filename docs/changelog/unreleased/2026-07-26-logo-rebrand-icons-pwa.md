# 2026-07-26 — New mascot logo, icons, PWA manifest + social banners (v3.2 work-beat)

_Folds into the single **3.2.0** release entry at the dev→main merge (planned build-out
accumulates under the target minor). Branding/asset work; no language-content changes._

## User-facing
- **New look.** SquirreLingo now wears a friendly two-squirrel mascot logo — the same
  characters as the animated co-hosts — across the browser tab (favicon), the home-screen /
  app icon, and link-share previews, replacing the old pink squirrel mark.
- **Installable app.** SquirreLingo can now be added to your home screen as a proper app,
  with a branded icon, theme color, and splash screen.

## Internal
- Rebrand mark = **cheek-to-cheek duo** drawn in the co-hosts' flat-vector style, palette
  sampled from the ch0 cohost video. (A "tail-as-the-letter-L" wordmark was explored and
  scrapped — do not revive unless asked. Full record: `claude/squirrelingo_logo_rebrand.md`.)
- **New/changed files:**
  - `app/icon.svg` — replaced old pink squirrel with the **duo** (transparent; thin dark
    contour on the front head so the two stay distinct on any tab color; SVG scales at all sizes).
  - `app/favicon.ico` — multi-res: **single face @16**, **duo @32/48/64** (browser picks per size).
  - `app/apple-icon.png` (180) · `app/opengraph-image.png` (1200×630, auto OG/Twitter image).
  - `app/manifest.js` — **new**; installable PWA (name/short_name SquirreLingo, `standalone`,
    background + theme `#241a39`, icons incl. maskable).
  - `public/icon-192.png` · `public/icon-512.png` · `public/icon-maskable-512.png`
    (maskable = single face centered in the safe zone on solid `#2a1f45`).
  - `public/facebook-banner.png` (1640×624) · `public/splash.png` (1080×1920).
  - `app/layout.js` — added metadata (`metadataBase`, `openGraph`, `twitter`, `appleWebApp`)
    + `export const viewport = { themeColor: "#241a39" }`. Next App Router auto-wires the
    icon / favicon / apple-icon / opengraph-image / manifest file conventions (no `<link>` plumbing).
- Verified via esbuild JSX parse (`layout.js`, `manifest.js`); no deps/lockfile change; CRLF
  preserved on JS, LF on `icon.svg`.
- Not done: per-device iOS `apple-touch-startup-image` splash set (only the generic
  `public/splash.png` shipped); Play/TWA packaging will consume the manifest + maskable icon later.
- No version bump — folds into the **3.2.0** release.

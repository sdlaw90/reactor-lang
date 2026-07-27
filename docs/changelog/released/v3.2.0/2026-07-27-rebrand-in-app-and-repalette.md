# 2026-07-27 — In-app mascot mark + accent repalette (v3.2 work-beat)

_Folds into the single **3.2.0** release entry at the dev→main merge._

## User-facing
- **The new logo is now inside the app, not just on the browser tab.** The two-squirrel
  mascot replaces the old pink squirrel on the home screen, the sign-in page, the beta
  application, the welcome popup and the guide mascot.
- **The app's pinks and purples have been warmed to match the mark.**

## Internal
- **`lib/Logo.js` was the gap.** The 2026-07-26 rebrand replaced the *asset* files
  (`app/icon.svg`, `favicon.ico`, `apple-icon.png`, `opengraph-image.png`, PWA icons) but not
  the React component the app renders, so every in-app surface still drew the old pink
  squirrel while the browser tab showed the duo. Rebuilt from the `icon.svg` geometry so the
  in-app mark, tab, installed icon and share preview are one drawing.
- **New `variant` prop** — `"auto" | "duo" | "solo"`. Two heads collapse below ~30px, so
  `auto` renders the front (brown) squirrel alone under `AUTO_DUO_MIN = 30` and the duo at or
  above — the same call `favicon.ico` makes with single face @16 / duo @32-64. Fixes all five
  consumers at once: home top row, sign-in header, beta-apply (×3), `WelcomePopup`,
  `GuideDemo`. `app/page.js` home mark bumped `size` 28 → 34 so home lands on the duo.
- **Accent repalette**, 47 files / 193 lines: `#FF8FB1` → `#FFA6BE` (accent), `#B98EFF` →
  `#D3B0BF` (violet secondary — the mark's own mauve ear), plus `rgba(255,143,177,·)` →
  `rgba(255,166,190,·)` and `rgba(185,142,255,·)` → `rgba(211,176,191,·)`.
  Contrast: accent 9.86:1 on `#171423` / 8.80:1 on `#221E33` / 9.86:1 for ink on an
  accent-filled button; secondary 9.25 / 8.25. The **raw mark colours can NOT be the accent** —
  mauve body `#a16e80` is 3.89:1 on panel, under AA — so both values are lifted derivatives.
- **Excluded on purpose:** `TRACK_THEMES["english-us"].gradient` and `HOME_GRADIENT` in
  `lib/theme.js`. Those are the per-language mood-gradient system, not brand chrome; sweeping
  them would have recoloured the English (US) track background. Only `BASE.accent` moved there.
- **Not combined with the literal→token migration** the #63 design-cohesion pass deferred (an
  undefined token ref fails silently, no build error). Pure value swap.
- Verified: every changed line differs ONLY in the colour tokens (masked line-by-line diff),
  line counts identical per file, CRLF/LF preserved per file, esbuild JSX parse clean on all 46
  changed `.js` files, `globals.css` braces balanced with 0 malformed hex tokens.
- No version bump — folds into the **3.2.0** release.

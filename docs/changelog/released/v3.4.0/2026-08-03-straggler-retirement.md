# 2026-08-03 — Retire the v3.3 stragglers, and correct the docs that described them

_Folds into the **3.4.0** release entry (internal-only — rides with whatever ships first)._

## User-facing
- None — dead files removed and documentation corrected. No app code, content, or dependency
  changes; `next build` and the full lint pass are green either side of it.

## Internal
- **12 files retired**, each verified **unregistered AND unreferenced** by code before removal
  (deployment plan §4 step 6). Every remaining mention is historical prose — changelog entries,
  `docs/_run-log-v3.3.md` — which is correct and stays.
  - **`scripts/_fr-parity-harness.mjs`** — the A15 one-off. It simulates the *pre-flip* world, so
    once the v3.3 offering flip shipped its two PRE-FLIP assertions failed by design and it
    double-counted the two registered tracks. `_flip/verify.mjs`'s post-flip equivalent replaced it.
  - **`lib/WelcomePopup.js`** + **`lib/welcomeVersion.js`** — superseded by `GuideOverlay` in v3.2.
    `app/layout.js` has rendered `GuideOverlay` in its place since then, and `WelcomePopup` was the
    only consumer of `WELCOME_VERSION`.
  - **the 9 `fr-fr-*-review-v3.2.0.*` packet files** — superseded by the v3.3.0 regeneration.
- **The retirement surfaced three docs that were already wrong.** All three still described
  `WelcomePopup` as a mounted widget, more than a release after it stopped being one — and
  `GuideOverlay`, `GuideTour` and `guideVersion.js` were documented **nowhere**. Fixing that is the
  larger half of this change; the deletions just forced it to the surface.
  - `docs/codebase-reference.md` — the `layout.js` widget list named `WelcomePopup` (it mounts
    `GuideOverlay`), and the list was out of order against the actual mount order. The
    `WelcomePopup.js` and `welcomeVersion.js` rows are now `GuideOverlay.js` and `guideVersion.js`.
  - `docs/architecture.md` — said "Five global widgets"; there are six, and `NavDepthTracker` (#92)
    had never been added to the list. Corrected, and the `WelcomePopup` bullet replaced.
  - `README.md` — the About-page paragraph described the one-shot welcome popup as the post-
    onboarding introduction. It's the intro tour, and has been since v3.2.
- **`lib/GuideOverlay.js`'s own header comment** defined the component by reference to
  `WelcomePopup` ("Mirrors WelcomePopup's gating… mounted in place of WelcomePopup"), which would
  have dangled the moment the file went. Rewritten to stand on its own: it states the gating
  directly (`user_metadata.guide_seen_version` vs `GUIDE_VERSION`, the same pattern
  `RequireLegalGate` uses) and keeps the supersession as one line of history.
- **Left alone deliberately:** existing accounts still carry a `welcome_seen_version` key in their
  Supabase `user_metadata`. Nothing reads it now — `GuideOverlay` gates on `guide_seen_version` —
  and clearing it would mean a metadata migration across every account to remove a key that costs
  nothing. Noted rather than fixed.
- **Verified:** `npm run lint` 0 errors, 70 warnings (down from 72 — the two that went were in the
  deleted files) · full `next build` green · `npm run verify:l10n` green · no non-historical
  reference to any retired file remains.
- No dependency or lockfile change; no version bump.

# 2026-07-27 — Post-deploy smoke-test fixes (v3.2 work-beat)

_Folds into the single **3.2.0** release entry at the dev→main merge. Found by walking the
running dev deploy with `native_lang = pt`._

## User-facing
- **Fixed: the practice/listen/speak tabs showed raw code.** The Practice, Listen and Speak
  tabs on every language's start screen were displaying internal labels instead of words.
  This one was live for everyone, in every language.
- **Fixed: American and British English were indistinguishable for Portuguese speakers** —
  both appeared as just "Inglês", with no flag.
- **Fixed: leftover English** on an otherwise-Portuguese app — the welcome greeting, the
  theme filter chips, "What's on this page?", the community-review note, and the line under
  each language's title.
- **The wordmark now reads the way the new brand does** — the whole "Lingo" is rose, not
  just the L.

## Internal
- **PRODUCTION BUG (not caused by the pt work).** `lib/playStrings.js` `STRINGS` was missing
  `sectionPractice` / `sectionListen` / `sectionSpeak` / `soonTag`. `app/play`, `app/learn`
  and `ComingSoonSection` all call `T()` on them, and `t()` returns the key when the entry is
  absent — so the literal strings rendered to every user in every language. Confirmed live on
  `squirrelingo.vercel.app` (v3.1.1) in English before fixing. Added with en/es/pt.
- **Target-keyed fallback for the two id-keyed lookups.** `VARIANT_NAMES` (`languageNames.js`)
  and `ICONS_BY_TRACK_ID` (`trackIcons.js`) are keyed by full track id, so `en-us-for-pt`
  matched neither and fell through to the generic "Inglês" with no icon. Both now derive a
  target-keyed index once (strip `/-for-[a-z]{2}$/`) and fall back to it; exact-id lookup
  still wins. **v3.3 French inherits every variant name and icon for free.**
- `app/page.js` `GREETINGS` local `{es,en}` map → shared `STRINGS.homeGreeting` (en/es/pt).
- **THEMES `pt`** added to all 12 `data/tracks/*Tags.js` (9 rows each, 108 total). Two file
  styles handled — Latin tracks use `{ id: "x", en: … }`, ja/ko/zh use JSON-quoted keys; the
  inserter matches each file's own style and touches only the `THEMES` block.
- Hardcoded English removed: `"What's on this page?"` (literal in play + learn) →
  `T("whatsOnThisPage")`; `ReviewBadge`'s module-scope `const LABEL` → `t(lang, …)` via a new
  optional `lang` prop, passed from the home bubbles and the play start screen.
- **NEW `lib/trackSublabels.js`.** `track.sublabel` describes who a track is FOR, so it must
  read in the viewer's native language — but under one-track-many-sources it lives on a shared
  megabyte-scale track file. Localized copy now sits in a small id-keyed table like
  `languageNames.js` (es + pt for the 12 `-for-en` tracks). Missing entry → `track.sublabel`.
  **The sublabel and the review badge take `viewerNativeLang`, NOT the play page's `uiLang`** —
  `uiLang` is `uiLangForSkill()` and becomes the TARGET language at high skill levels, which
  would have rendered meta text in the language being studied.
- **Wordmark** corrected to the locked spec (`claude/squirrelingo_logo_rebrand.md`: "Squirre
  warm-white / Lingo rose-pink") — the markup coloured only the letter `L`. Now wraps the whole
  `Lingo` in `app/page.js` + `app/auth/page.js`, using the `#FFA6BE` app accent rather than the
  doc's `#f48fb1` so wordmark and chrome stay one colour (AA 9.86:1 vs 8.11:1 on `#171423`).
- **PWA bullet rewritten.** Measured on dev: **0 service workers, `beforeinstallprompt` never
  fires.** Chrome dropped the SW requirement for *menu* install (108 mobile / 112 desktop) so
  the app is installable, but the automatic prompt still needs a `fetch()` handler — no omnibox
  install icon. iOS gets no splash (`public/splash.png` is unwired; the
  `apple-touch-startup-image` set was never done); Android's is auto-generated. The bullet now
  claims only what is true. A service worker would earn back the prompt + offline — NOT in 3.2.0.
- All pt copy added this pass is AI-authored → **#41**.
- Verified: esbuild JSX parse clean on all 21 touched files, line-ending style preserved per
  file, `trackDisplayName` / `trackSublabel` / the 7 new `STRINGS` keys exercised at runtime
  across 10 track-id × language cases including the `en-for-it` and unknown-language fallbacks.
- No version bump — folds into the **3.2.0** release.

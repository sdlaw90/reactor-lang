# 2026-07-26 — Portuguese fono layer + Help/About localization (v3.2 work-beat)

_Folds into the single **3.2.0** release entry at the dev→main merge (per the §5 versioning
convention: Z is for post-release fixes; planned build-out accumulates under the target minor).
This completes the v3.2 Portuguese build — nothing localization-related is left for 3.2.0._

## User-facing
- **Phonetics mode is now in Portuguese too.** For Portuguese speakers, the pronunciation
  (fono) questions — the "read the sound, what does it say?" prompts and every post-answer
  explanation — now read in Portuguese across all learnable languages, closing the last gap
  from the previous update. The Help and About pages are in Portuguese as well.

## Internal
- **#71 fono pt across the 10 reused tracks** (`esForEn`, `esSpainForEn`, `itForEn`, `frForEn`,
  `frCaForEn`, `deForEn`, `ruForEn`, `jaForEn`, `zhForEn`, `koForEn`):
  - Added `pt` to each track's `.map()` `identifyPromptNative` + `respondPromptNative` subtitles
    (generic learner-facing prompt; `respondPromptNative` keeps its `${i.text}` template).
  - Added `pt` to every FONO_BANK item's `identify.explain` + `respond.explain` — **1,570
    explanations** (785 items × 2) translated es→pt, target-language example tokens
    (Cyrillic/kana/kanji/pinyin-with-tones/Hangul/accented Latin, respellings, IPA) preserved.
  - **Injection was surgical (acorn AST):** `pt` inserted after each explain's `es` property and
    each subtitle object's last property; everything else byte-identical. Verified per track:
    FONO_BANK re-eval deep-equal to the original except the added `pt` (0 data mismatches), all
    `pt` correct, `//` comment counts unchanged, `node --check` clean, and a full esbuild
    bundle-load confirming `extraBank` resolves `pt` (including the `respondPromptNative(i)`
    interpolation) with the main vocab/gram/trad banks untouched.
  - The 2 English-target tracks (`enUsForPt`/`enGbForPt`) already carried pt fono (built fresh).
- **#72 Help/About pt** (`lib/helpAboutContent.js`): added a `pt` entry to `HELP_CONTENT` (23
  sections) and `ABOUT_CONTENT` (8 sections incl. the roadmap), translated es→pt. `en`/`es`
  byte-identical; inline markup preserved — `{{key|label}}` link keys (`about/help/feedback/
  beta/fb`), section `anchor`s (`whats-next`), and roadmap `badgeType`s (`done`/`rolling`) all
  unchanged, only visible labels translated. The `app/help` + `app/about` page components already
  resolve `native_lang` and fall back through `SUPPORTED_UI_LANGS` (pt now included), so no page
  changes were needed. No roadmap/catalogue status edits — that copy is language-agnostic
  ("more native languages are rolling out") and already listed Portuguese as a learnable target.
- All AI-authored → #41 (fono explanations + Help/About prose; a few terminology choices flagged:
  "Academia de Gramática" for Grammar Gym, "QECR" for CEFR, badge wording).
- No version bump — folds into the **3.2.0** release. CRLF preserved; no deps/lockfile change.

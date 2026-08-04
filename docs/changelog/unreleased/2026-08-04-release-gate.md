# 2026-08-04 — The release refuses when the prep didn't happen

_Folds into the **3.5.0** release entry._

## User-facing
- None — release tooling.

## Internal
- **The problem this fixes.** v3.4.0 shipped with its announcement art stranded on `dev`. The
  square and the regenerated forest cover were written **after** the last `deploy dev`;
  `deploy beta` refuses a dirty tree, so its guard passed before those files existed and they
  never reached `main`. **Nothing failed** — the release was green, CI was green, and the art
  was simply absent. `main` still said Italian wasn't in native mode while Italian shipped.
- **The fix is not "add a script that does the prep."** A step you can forget is a step you
  will forget, and a script you can forget to run is just a longer runbook. So the release
  now **refuses** when the prep didn't happen.

### New: `npm run deploy <tier>-pre-release <version>`

Asserts, then acts, then pushes:

| | |
|---|---|
| **asserts** | every `unreleased/` fragment declares a target version and none targets an older one · `lib/version.js` has a `CHANGELOG` **and** `INTERNAL_CHANGELOG` entry for the version, and **every user-facing bullet carries every released source language** · the release square exists · **every acorn on the forest cover matches what the repo ships**, and a release that added a language re-rendered the PNG · `verify:l10n` · `eslint` 0 errors · `audit-i18n-columns` reporting *nothing skipped* · full `next build` |
| **does** | bumps `CURRENT_VERSION` · `rollup-changelog --archive` · writes `docs/changelog/released/v<version>/release-receipt.json` |
| **then** | runs the **existing** dev push — one code path, so the release push can never drift from the one exercised daily |
| **prints** | REMAINING MANUAL STEPS (post the announcement, set the FB cover) — what can't be automated is at least never invisible |

**Ending with the push is the actual fix.** It closes the window entirely: the release commit
is the last thing written, by construction, so nothing can be authored into the gap
afterwards. `--dry-run` shows every check without writing, archiving or pushing.

### `deploy <tier>` is now gated

- **Demands a receipt** matching `CURRENT_VERSION`. Skip the prep and the release will not
  merge.
- **Re-runs the cheap structural checks** — catches anything that landed on `dev` after the
  prep, which the receipt alone wouldn't.
- **Demands green CI for the exact commit being merged** (`scripts/check-ci.mjs`, unauthenticated
  GitHub Actions API — public repo, no token, no `gh`). Red, still-running **and**
  couldn't-reach-the-API all stop the release: *"I could not check" is not "it passed."*
  This replaces reading the Actions page by eye, which is not reliable — during the v3.4
  release the run-list page showed a finished duration for a run whose conclusion it never
  rendered, and only filtering `is:success` **and** `is:failure` gave a straight answer.

### The announcement is now in the repo, and asserted

**The art and the post copy are authored by Claude, not by Sean** — so a gate that only fires
when Sean runs the release protects the wrong person's memory. Two changes follow from that:

- **`docs/marketing/announcements/v<version>.md` is canonical.** The copy used to live only in
  project knowledge, which `deploy <tier>-pre-release` cannot see, so "the post exists" was a
  printed reminder — the category of thing that goes missing. It is now asserted like the art:
  an X.Y release will not proceed without it, and the check also requires an `## English`
  section, hashtags, and a second-language section when the release adds a source language.
  v3.3.0's and v3.4.0's have been backfilled.
- **Whether it has been POSTED is deliberately not gated.** The repo has no signal for that, and
  asserting it would be a check that can never fail — precisely what this work exists to stop.

### New: `npm run release:preflight <version>`

The structural checks with **no build** — about a second, writes nothing, safe anywhere. It
names every missing piece (changelog entry, square, source, cover acorn, announcement copy)
and exits non-zero.

This is the command that belongs in the *release work*, not at release time. `deploy
<tier>-pre-release` ends by pushing, so anything authored after it misses the release by
construction — running preflight while finishing the content is what makes the art and the
post exist before the handover rather than after it.

Verified both ways: `release:preflight 3.5.0` names 5 outstanding items; `release:preflight
3.4.0 --against e4e4fec` (main as it stood before the release) now passes all 14.

### The cover, specifically

Three defects in the first cut of this work, all found by asking "is the cover really covered?":

- **The REMAINING MANUAL STEPS block pointed at `claude/squirrelingo_v<version>_announcement.md`**
  — the project-knowledge path superseded *in the same session* by the in-repo one. Docs
  outliving the code, on a timescale of about an hour.
- **"Set the Facebook page cover" printed on every X.Y release**, including ones where the cover
  did not change. Telling someone to re-upload an identical image every time is how a checklist
  item becomes background noise. It is now conditional on the cover actually changing, and says
  what changed.
- **The cover check only fired on a native-language release** — the first cut assumed that was
  the only thing that moves the forest. It is not, and Sean caught it (2026-08-04):

  | Event | Cover | Old gate |
  |---|---|---|
  | a source language reaches native mode | acorn brown → gold | ✓ caught |
  | a new course ships | a brown acorn appears | ✗ **silent** |
  | …and it is the first in its family | sapling → full tree | ✗ **silent** |

  The missed cases are the *common* ones — courses ship far more often than sources graduate —
  so the gate was blind exactly where it was needed most. A release could add a course and ship
  against a cover still showing that family as a bare sapling, and nothing would say so.

### The cover is now checked against the catalogue, not against the diff

The fix went further than adding the missing trigger, because "did this release change the
cover" is the weaker question. `scripts/release-checks.js` now **parses the `FAMS` table** out
of `forest-cover.html` and reconciles every acorn against what the repo actually ships:

- released source languages must be **gold**, and nothing else may be;
- every shipping course must have an acorn, and it must not be **pale**;
- no acorn may claim a language the catalogue doesn't back;
- no acorn may hang on a family still rendered as a sapling.

That holds whether or not *this* release moved anything, so the cover cannot quietly drift out
of date across a run of releases that each individually looked fine. Learnable languages are
derived from the shipped track ids (`<target>-for-<source>`, region stripped) — read from the
track modules rather than the generated `lib/trackItemCounts.js`, since a gate reading a
generated file inherits the generator's staleness. Untracked files count, because a brand-new
course is the case worth catching.

**Parse failure is a failure.** If the `FAMS` table can't be read, the check goes red rather
than reporting clean — the `audit-i18n-columns` lesson from earlier in v3.4, applied before it
had a chance to repeat.

`artRequired` (square + copy, every X.Y) and `coverRequired` (something was added) are now
separate flags rather than one, because they answer different questions.

### The cover gains a third acorn state

Gold and brown could say "native mode" and "learnable" but had no way to say **"this language
is in this family and isn't built yet."** Every family shown with an acorn therefore looked
complete. `acorn: "planned"` renders a pale acorn with a dashed rim, and the legend carries it.

This matters from the next cover onward: the families still to come mostly hold *several*
languages each, and a sapling labelled only "Germanic" says nothing about Dutch or Swedish
being on the roadmap. Flagged by Sean while reviewing the trigger list above.

Also visual: the legend moved to a **one-line bar flush to the top-right**. Facebook's narrow
crop cuts that corner off, which is correct — the legend is a nicety, not the message — and the
canopy grows upward as families graduate, so anything lower eventually gets covered by trees.

**Verification:** ten mutations of `forest-cover.html` and the catalogue, each asserted to go
red — IT losing its gold, DE marked planned while its course ships, RU given gold it hasn't
earned, an acorn for a language with no track, Germanic demoted to a sapling, an unparseable
`FAMS`, plus an untracked new course registering as an added target and being refused by a
cover that doesn't show it, and a stale PNG refused while a patch release is correctly left
alone. The mutations are asserted to be real edits — v3.4 already shipped one mutation test
that silently became a no-op.

### New: `npm run art:render [version]`

Renders the cover, and the release square when given a version, from the committed HTML sources.
Vendored fonts, no network, and it falls back to whatever Chromium build is on disk when the
pinned Playwright browser is absent — so it runs in a cloud sandbox as well as locally.
**Verified deterministic:** re-rendering the committed sources reproduces the committed PNGs
byte-for-byte.

The design stays manual — copy, flags, which acorn turns gold. The *render* no longer is: it
used to be an ad-hoc Playwright invocation re-derived every release.

### Design notes

- **Whether art is owed is derived, not declared.** The script diffs `RELEASED_SOURCE_LANGS`
  *and* the shipped track ids between the worktree and the live branch. Adds a source language
  or a course → regenerated cover required. Minor/major bump → square + announcement copy
  required. Pure patch that adds nothing → neither. Nobody has to remember to tell it what kind
  of release this is.
- **Tiers are config, not copies.** `TIERS` in `scripts/deploy.js` holds source/target/label
  and the known-safe conflict list. `live` / `live-pre-release` are scaffolded and error
  until the branch exists; standing it up is one entry, not a second copy of the merge logic.
- **The changelog language check is parsed with acorn, not regex** — v3.4's own #72 sweep
  missed `lib/trackSublabels.js` precisely because it pattern-matched. It would have caught a
  v3.4 bullet shipped without its `it` column.
- **Verification of the gate itself:** the art check was mutation-tested against the real
  failure — run against `main` as it stood *before* v3.4.0 (`e4e4fec`), with the marketing
  files stashed, it correctly reports **RELEASE REFUSED** on all three art assertions; with
  them present it passes. `check-ci.mjs --self-test` covers the verdict logic offline
  (7 cases: none / pending / green / failed / mixed-skipped / cancelled / queued).
  - **The first version of that test was vacuous** — it compared against `main` *after* the
    release, so "added source languages" was empty and the check was never exercised. Same
    trap as everything else this release: a test that can't fail reads exactly like one that
    passes. Fixed by pinning the comparison to the pre-release ref.
- **The cover-PNG-changed assertion is secondary and says so in a comment** — it compares
  against the live branch, so it can pass for an unrelated reason. The acorn-state assertion
  is the load-bearing one.
- **Re-running the pre-release is safe and idempotent**, which is also the escape hatch if a
  receipt is ever lost. There is deliberately **no `--force`** on the release gate.
- `docs/manual-runbook.md` §6 rewritten around the two commands.
- No dependency change.

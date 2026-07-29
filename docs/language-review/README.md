# language-review

The standing **native-speaker review lane** (#41). One folder per reviewer relationship,
holding the packet that goes out, the file that comes back, what the reviewer asked for,
and what actually landed in the code.

Native review is the gate for **public** release. Beta ships pre-review by standard
(deployment plan §5); only review-passed varieties go into the real live app. Everything
in here exists to make that gate auditable — "Spanish passed" should be answerable with a
file, not a memory.

> Not to be confused with `docs/variant-expansion/review-packets/`. Those packets belong to
> the variant-expansion **content generation** pipeline (verb/tense swaps for a target
> track) and keep their own lifecycle there. This folder is the standing localization +
> regional-variant review lane across every user-facing surface. Same reviewers may work
> both; the artifacts are not interchangeable.

## A lane is a variety, not a language

Spanish is two lanes, because the regional-variant card makes factual claims about **both**
sides — "en España se dice *coche*, en México *carro*" — and only a native of each variety
can verify their own side. Same for Portuguese (Brazil / Portugal), French (France /
Québec) and eventually English (US / UK).

```
docs/language-review/
  README.md               ← you are here
  pipeline/               ← the generator + ingester. Reusable across every lane.
  es-latam/               ← a lane
  es-spain/               ← a lane (not staffed yet — see its STATUS.md)
  pt-br/  pt-pt/  fr-fr/  fr-ca/  de/  it/  ru/  ja/  ko/  zh/     ← created as they start
```

Lane codes follow the repo's own track ids (`es-latam-for-en`, `ptBrForEn`), not BCP-47 —
`es-latam` over `es-419`, because that's what the rest of the codebase says.

The lane that **owns the localization** for a source language is the one the shared `<lang>`
UI copy is written in. There is only one `es` block in `lib/playStrings.js`, and it is
es-LatAm; `es-spain`'s scope is the peninsular reference terms plus `es-spain-for-en` track
content. `pipeline/extract.mjs` holds the registry that encodes this.

## A lane splits into three scopes, because they are three different jobs

| Scope | The reviewer's question | es-latam volume |
|---|---|---:|
| `interface` | Does the app read naturally in this language? | 1,207 |
| `taught` | Is the language it TEACHES correct — and is every distractor genuinely wrong? | 1,353 |
| `explanation` | Is this language's EXPLANATION of another language accurate and natural? | 4,872 |

These need different attention and differ by an order of magnitude in size, so they ship as
separate packets. Collapsing them was the original mistake: the first Spanish packet covered
only `interface` — about 10% of the Spanish in the product, and the chrome rather than the
teaching. `esForEn.js` had carried a `PENDING #41` marker the whole time.

**In `taught` and `explanation`, one row is one QUESTION, not one string.** A question carries
a prompt, four options, an explanation and up to four notes; as strings that's eleven rows and
one decision, and the reviewer can no longer see whether a distractor is secretly a correct
answer. Whole, it's one row and the same decision.

`interface` goes first in any lane. It is the smallest, it carries the decisions sheet whose
answers pre-resolve rows in the other two, and it validates the packet format before you spend
a new reviewer's goodwill on several thousand content rows.

## Inside a lane

```
es-latam/
  STATUS.md         ← the ledger. Who reviewed what, when, what landed, what's still open.
  template/         ← the packets as sent: <lane>-<scope>-review-v<version>.xlsx + .md twins
  submitted/        ← returned files, verbatim, one per reviewer per round. NEVER edited.
  changesets/       ← generated from each submission: what the reviewer asked for, as text
  implemented/      ← what actually landed, per ingest pass, with the commit and the deferrals
```

**A submission never moves.** It's the reviewer's testimony; it stays in `submitted/`
forever. Status lives in `STATUS.md` and `implemented/`, because a submission is almost
never wholly applied — some rows land, some stay open as questions, some get deferred — so
a folder can't honestly represent one.

**Every `.xlsx` has a `.md` twin.** Git can store a workbook but not diff one, and reading a
row otherwise means opening Excel. The mirror makes a packet reviewable in a pull request
and greppable from a terminal. Both are generated; neither is hand-edited.

## The loop

1. **Generate** — `pipeline/extract.mjs` reads the repo, `pipeline/build_workbook.py` writes
   the packet into `template/`, once per scope. Regenerate after any content or localization
   change; never hand-patch a packet.
2. **Send** — run `node pipeline/check_freshness.mjs --lane <lane>` first; it re-extracts and
   tells you whether the packet still matches the repo. Node only, no dependencies, because it
   has to work at the moment a packet goes out. Then the reviewer gets the `.xlsx`, with every
   instruction inside it in their language, plus a covering email from
   `node pipeline/render_email.mjs --lane <lane>` — also Node-only, also send-day. The email
   carries only what a workbook cannot know about itself: how the scopes relate, which to do
   first, and roughly how long each takes. It deliberately does not restate the instructions
   sheet; two descriptions of the same rule in different words is a contradiction waiting to
   happen, and the reviewer has no way to tell which one wins.
3. **Receive** — drop the returned file into `submitted/` as
   `YYYY-MM-DD-<reviewer>-<scope>-v<version>.xlsx`. Keep the scope in the name: `ingest.py`
   reads it back out. Do not open and "tidy" it.
4. **Ingest** — `pipeline/ingest.py` writes the changeset into `changesets/`.
5. **Apply** — decisions first (they're systematic and rewrite many rows), then individual
   corrections. Record the result in `implemented/` and update `STATUS.md`.
6. **Gate** — flip the lane's tracks in `lib/reviewStatus.js` only once a pass is applied
   and shipped.

## Batching, not trickling

Reviewer engagements carry fixed cost, so the strategy is **fewer, fuller handoffs and a
standing relationship per lane** rather than racing small unreviewed drips out. A growing
unreviewed pile is inventory with a defined draw-down, not debt. See
`claude/squirrelingo_native_review_handoff_strategy.md` in project knowledge for the full
reasoning — this folder is that strategy's filing cabinet.

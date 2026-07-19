# Question-Variant Expansion — Master Methodology

**Purpose.** Multiply SquirreLingo's question stock by reworking existing questions
into other **grammatical forms** (subject-person, tense, mood, politeness…) so learners
practice the underlying grammar instead of memorizing one fixed answer.

**Authority split (the core principle of this whole effort).**
- *Design authority = Sean + Claude.* We decide the transformation model, scope, and format.
- *Correctness authority = a native speaker.* Every generated item is **provisional** until a
  native reviewer confirms it. We may be confidently wrong about a conjugation or whether a
  swapped sentence sounds natural — so nothing generated here ships unreviewed.

This doc is written so Claude can run a **new language end-to-end without asking Sean to
re-confirm each step.** Follow it in order. Deviate only when a language's axis table below
says to.

---

## 1. The pipeline (run this per language)

1. **Stage** the track file `data/tracks/<lang>ForEn.js` from the repo.
2. **Inventory** — parse the conjugation-drill category (see §2) into structured items:
   prompt, blank, target lemma, options, CEFR level, explanation, English subtitle.
3. **Classify** each item: structure type (§3) + lock status (§4) + current grammatical
   coordinates (person/tense/etc. per the language's axes, §5).
4. **Generate** provisional variants (§6) with a conjugation engine (§8), each with a stable
   ID (§7) and a risk tier (§9).
5. **Package** into a reviewer workbook (§10) — risk-sorted, plain-language, native-friendly.
6. **Save** docs + packet to the Project; save generated data + packet copy to the repo
   `docs/variant-expansion/` (see README).
7. **Review** — native speaker fills the yellow columns.
8. **Round-trip** — load approved/corrected variants back into the track file as new bank
   entries (§7). This is a later, post-review phase; do not load anything unreviewed.

---

## 2. Which category to transform

Only the **verb-conjugation drill** category is a clean fit (in `esForEn` it's `verbo`).
These are already fill-in-the-blank: subject + blank(verb) + tense-signaling context.

Do **not** transform these categories — they don't carry a person/tense axis:
- `vocab` / frequency-word banks — single words / false friends.
- `fono` — phonetics.
- `trad` — mostly **fixed idioms** ("What a pain", "None of your business"); they break under
  person/tense change. A minority are literal conjugatable sentences — hand-pick later only if
  a language is short on verb items; do not bulk-transform.

If a track names its verb category differently, find it by structure (a `_____` blank plus a
lemma in parentheses), not by name.

---

## 3. Structure types (exceptions to the clean model)

Tag every item. Only **standard** and **reflexive** get naive person-swaps; the rest need
special handling or get excluded (and documented in the packet's "Not transformed" tab).

| Structure | Signal | Handling |
|---|---|---|
| **standard** | plain subject + conjugated verb | full person-swap |
| **reflexive** | lemma ends in reflexive marker (es: `-se`) | person-swap **with** reflexive-pronoun agreement (yo→me, tú→te, él→se, nos→nos, ellos→se) |
| **gustar-type** | verb agrees with the *thing*, subject is an indirect object (gustar, encantar, doler, faltar, importar…) | separate rule: swap the indirect-object pronoun (me/te/le/nos/les), verb agrees with the liked thing — **not** a subject-person swap |
| **progressive** | `estar` + gerund | vary the **auxiliary** (estoy/estás/está… + fixed gerund) |
| **impersonal/passive se** | `se` + verb agreeing with a noun | no personal subject → **no person axis**; tense-swap only |
| **infinitive slot** | the blank is an unconjugated infinitive (`hay que ___`, `de ___ sabido`) | **no axis at all** — exclude |

---

## 4. Lock status (governs the tense axis)

| Lock | Signal | What you can do |
|---|---|---|
| **flexible** | present tense, no fixed time-word | swap person **and** tense freely |
| **marker-locked** | a time word pins the tense (ayer, mañana, ya, anoche…) | tense-swap requires rewriting the time-word too → Phase 2, higher risk |
| **mood-locked** | a subjunctive/conditional trigger (Espero que, Si tuviera…) | tense/mood **is** the teaching point → swap **person only** |
| **imperative** | command form | limited persons (tú/usted/nosotros/ustedes, no yo); no tense-swap |

**Person axis is independent of lock status** — you can person-swap a mood-locked subjunctive
sentence safely ("Espero que tú vengas" → "Espero que ellos vengan").

### Person-swap is only clean with a PRONOUN subject
A **noun-subject** sentence ("La sopa está fría", "Mi hermana es médica") is content-locked to
3rd person — swapping the person would change the meaning. Detect: is there an explicit subject
pronoun? If the subject is a noun or fully implied, **do not** person-swap; list it under
"Not transformed" as *3rd-person locked (noun subject)*.

---

## 5. Per-language axis reference table  ← **read this before running a new language**

"Person × tense" is a **Romance** model. It does **not** transfer uniformly. For each language,
these are the real inflection axes to generate along:

| Language(s) | Track | Person on verb? | Primary axes to generate | Notes / new axes |
|---|---|---|---|---|
| Spanish, French, Italian, Portuguese | es/fr/it/pt`ForEn` | **Yes** | person × tense × mood | Model transfers directly. Highest yield. `verbecc` covers all four. |
| German | `deForEn` | Yes | person × tense | Verb conj. simpler; sentence **case** endings can shift when subject changes — flag for review. No `verbecc`; use a German conjugator or LLM-generate + review. |
| Russian | `ruForEn` | Yes (present/future); past agrees by **gender/number** | person × tense × **aspect** | Perfective/imperfective **aspect** is a core axis. Past tense agrees with subject gender. Big review surface. |
| Japanese | `jaForEn` | **No** | tense × **politeness/formality** × polarity | Verbs don't inflect for person — swapping the subject changes only the subject word. The rich axis is plain/polite(-masu)/honorific/humble + affirmative/negative. Keep native script + romanization together. |
| Korean | `koForEn` | **No** | tense × **speech level** × polarity | Same as Japanese: no person agreement; politeness levels (해요/합니다/해체…) are the axis. Native script + romanization. |
| Chinese (Mandarin) | `zhForEn` | **No** | **aspect** (了/过/着) + time words; polarity | **No conjugation at all.** "Person-swap" changes only the subject word (low value). "Tense" = aspect particles + time adverbs. Lowest / most different yield — treat as its own model, don't force person×tense. |

**Rule for CJK (ja/ko/zh):** do **not** run the person-swap generator. Define the axis as
tense × politeness (ja/ko) or aspect (zh) and generate along that instead. Flag this clearly;
these need the most native judgment.

---

## 6. Generation policy

**Phase 1 — person-swap (safe, mechanical, do first).**
For each pronoun-subject standard/reflexive item, generate one variant per *other* applicable
person cell, keeping the sentence and tense identical. Options = the sibling person-forms of
that verb in that tense (matches the source questions' distractor style). This is the low-risk
multiplier (~4× per eligible base).

Person cells to use (respect the track's regional convention — e.g. LatAm Spanish = **no
vosotros**, `ustedes` is plural-you): yo · tú · él/ella(/usted) · nosotros · ellos/ellas(/ustedes).

**Phase 2 — tense-swap (higher risk, do after Phase 1 is validated).**
Only for **flexible** (present, no time-marker) items. Shift tense; most will need a
time-marker rewrite to sound natural, so every tense-swap is flagged for the reviewer to
confirm **or rewrite**. Ship only a small **sample** in the first packet to show the format —
do not bulk-generate hundreds of shaky tense sentences and dump them on a reviewer.

**Never generate:** gustar/progressive/impersonal/infinitive naive person-swaps (§3),
noun-subject person-swaps (§4). Document them in the "Not transformed" tab.

---

## 7. IDs & round-trip (mandatory — feedback must flow back to code)

Every generated item gets a stable ID so a reviewer's "row 47 is wrong" maps to a code change.
- Base item: `<lang>-v-<NNN>` (NNN = 1-based index within the verb category).
- Variant: `<baseid>-p-<person>` (person-swap) or `<baseid>-t-<tense>` (tense-swap).

Store the machine-readable generated data as JSON (`generated/<lang>_generated.json`) alongside
the human packet. After review, join the packet's ID column back to the JSON, apply corrections,
and emit the approved variants as new bank rows in `<lang>ForEn.js` (a later phase).

---

## 8. Tooling

- **Romance (es/fr/it/pt):** `verbecc` (`pip install verbecc --break-system-packages`).
  Entry point: `verbecc.CompleteConjugator('<es|fr|it|pt>')`; `.conjugate(lemma).to_json()`
  → `moods[<mood>][<tense>]` list of `{pr, p, n, c}`. Strip the leading pronoun token from
  `c[0]` to get the bare form. Rule-based for known verbs (reliable on irregulars); trains an
  ML fallback for unknown lemmas (slower first call).
  - Reflexives: verbecc may not accept the `-se` lemma — conjugate the base verb and prepend
    the reflexive pronoun per person.
  - Spanish tense keys: `indicativo/presente`, `.../pretérito-perfecto-simple` (preterite),
    `.../pretérito-imperfecto`, `.../futuro`, `.../pretérito-perfecto-compuesto` (pres.perfect),
    `.../pretérito-pluscuamperfecto`; `condicional/presente`; `subjuntivo/presente`,
    `subjuntivo/pretérito-imperfecto-1` (-ra form).
- **German:** no verbecc support — use a dedicated conjugator or LLM-generate, then rely more
  heavily on native review.
- **CJK (ja/ko/zh):** conjugation/politeness generation is rule-plus-judgment; generate with
  care and treat the native review as load-bearing, not a rubber stamp.

Whatever the engine, **the native review is the correctness gate** — engine output is a
first draft.

---

## 9. Risk tiers (how the packet is sorted, to respect reviewer time)

- **High** — tense-swaps (need confirm/rewrite); any structurally novel transform.
- **Medium** — irregular-verb and reflexive person-swaps (verify the form).
- **Low** — regular-verb person-swaps (quick naturalness skim).

Sort High→Medium→Low, but keep a base sentence's family together within a tier. Enable a
filter row so the reviewer can re-sort by ID if they prefer.

---

## 10. Reviewer packet spec (the file you hand a native speaker)

One workbook per language: `review-packets/<lang>-verb-variants.xlsx`. Three tabs:

1. **READ ME** — plain-language instructions. No linguistics jargon. Tell them: read the
   Spanish/target sentence + answer, then fill three yellow columns — *Correct? (Y/N)*,
   *Correction*, *Natural? (Y/N)* — plus Notes. Say they can ignore the grey ID/flag columns.
   State the regional convention. Point them to the High-priority rows first.
2. **Person variants** (main) — one row per generated variant. Grey info columns: ID, Priority,
   Flags, Base question, **NEW question**, Correct answer, All options, Change, CEFR. Yellow
   input columns: ✅ Correct? · ✏️ Correction · 🗣️ Natural? · 💬 Notes. Include one greyed
   *example* row showing how to fill it in. Freeze header; enable autofilter.
3. **Not transformed** — the excluded items + the reason, with a yellow "look right to leave
   alone?" column. Transparency + a cheap sanity check that our exclusions were correct.

**Formatting:** Arial throughout; input columns filled pale yellow; priority cells tinted
(High = pink, Medium = orange); no gridlines; sensible column widths; wrap text.

---

## 11. Definition of done (per language)

- `NN-<lang>-reference.md` written (decisions + counts, like the Spanish one).
- `generated/<lang>_generated.json` produced (person set + tense sample + skipped, with IDs).
- `review-packets/<lang>-verb-variants.xlsx` produced and delivered.
- README status tracker row updated.
- Nothing loaded into the track file yet — that waits for native sign-off.

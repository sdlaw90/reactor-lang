# 2026-08-02 — French regional-variant registry to its ceiling (v3.3 Phase 5)

_Folds into the **3.3.0** release entry._

## User-facing

- None yet — French is still unreachable until the Phase 6 flip.
- After the flip, a Québec, Belgian or Swiss learner gets the "On dit aussi" card whenever the
  correct answer is a word their region says differently: **80 concepts, up from 2**, of which
  **31 fire on content that already exists** (73 answer slots across the 12 French tracks).
- **Belgian and Swiss learners stop being shown Québec words as their own.** See below — this was
  a live defect in the data model, not just a gap in coverage.

## Content

- `data/tracks/l10n/regionalVariants.js`, `fr` block: **2 → 80 records**, against Spanish's 71 and
  Portuguese's 64. §4c satisfied — the registry is at its high-frequency ceiling before a native
  reviewer sees it, so it clears in one pass.
- Grouped and commented by domain: table/cuisine/courses · transport/ville/argent ·
  maison/vêtements/technologie · gens/travail/école/temps et nombres.
- The densest set is the **anglicism inversion** — France borrows English where Québec keeps the
  French word: `parking`/`stationnement`, `week-end`/`fin de semaine`, `e-mail`/`courriel`,
  `shopping`/`magasinage`, `spam`/`pourriel`, `stop`/`arrêt`.
- The **meal shift** is modelled as the genuine three-way it is: France
  `petit-déjeuner`/`déjeuner`/`dîner` vs `déjeuner`/`dîner`/`souper` in Québec **and** Belgium
  **and** Switzerland. All three records fire (`petit-déjeuner` ×6, `dîner` ×5, `déjeuner` ×3) —
  the densest concept in the whole registry.
- Belgian and Swiss splits carried where they are real and current: `essuie`, `GSM`, `natel`,
  `septante`/`nonante`, `huitante`, `parquer`, `en action`, `faire ses commissions`.
  **`octante` is deliberately absent** — archaic; Belgium says `quatre-vingts` like France, and
  only Switzerland diverges.
- `countryNames.CA` corrected `"Quebec"` → `"Québec"`.

## Two data-model corrections — this is the part worth reading

**1. `default` must mirror `reference` for French.** `default` is what a learner sees when their
country isn't listed in `regional`. For Spanish that is a sensible catch-all: twenty Latin American
countries share the non-Spain term. For French the regional group is Québec *alone*, and Belgium
and Switzerland mostly follow France — so a Québec-term default showed a Belgian learner
`fin de semaine` labelled **"dans ta région (Belgique)"**. Wrong, and confidently wrong.

Every record now sets `default === reference` and lists each divergent variety explicitly, which
is what the original 2-record seed did. 75 authored records were rewritten to that shape. A record
where Québec agrees with France but Belgium doesn't still works: it stays invisible to everyone
except the Belgian learner.

**2. The registry indexed the *other* variety's word as a lookup key.** New per-language flag
**`indexRegionalTerms`**, `true` for `es` and `pt`, off for `fr`.

Correct for Spanish and Portuguese — their reusable tracks are authored in the regional variety
(es-LatAm, pt-BR) as well as the reference one, so both words appear as answers. Wrong for French,
where every track is authored in France French: indexing the Québec word makes the card fire on a
homograph. Measured, not hypothesised — `bas` is *socks* in Québec, and both items in the corpus
that answer `bas` are the adjective **"low"** (`'Bajo' significa…`, `'Baixo' significa…`). Same
class of bug for `arrêt` (a *bus stop* in France too), `bienvenue` (the "welcome to the shop"
sense), `fête`, `trafic`, `gomme`, `job`.

Reference-only keying is the correct default for a single-variety corpus, so **v3.4 Italian onward
should leave the flag off**. es/pt behaviour is unchanged and asserted (123 and 71 card fires,
identical before and after).

## Dropped on purpose

- **"you're welcome" (`de rien` / `bienvenue`)** — a real and high-value split, but `norm()` strips
  a leading `de`, so `de rien` indexes as the bare key **`rien`**. Certain to false-fire the moment
  any item answers "rien". Needs either a normalisation change or a multi-word guard; recorded, not
  bodged.
- 4 cross-domain duplicates (convenience store, supermarket, grocery shopping, the restaurant bill).
- ~30 candidates the authoring pass rejected: vulgar or offensive-in-one-variety terms, archaisms,
  spelling-only differences, and anything where the France-side reference term isn't stable
  (`breuvage`, `liqueur`, `pistolet`, `poêle`, `comptoir`, `gosse`, `cartable`, `kot`, …).

## Verified

- **es and pt card fires identical before and after** (123 / 71) — the flag changes nothing for
  released sources.
- Per record: `default === reference` · every `regional` entry has ≥1 country from `CA|BE|CH` and a
  label · no regional term equal to its reference · no stray index key.
- **The card's own resolution replayed for all 80 records × 4 countries plus the no-country case:**
  a France learner never sees a card, a learner with no country set never sees one, and neither a
  Belgian nor a Swiss learner is ever shown a term not listed for their country.
- **All 7 checks mutation-tested.** The first run reported two of them green while the failure list
  was non-empty: `checks.x = cond || fail(...)` assigned `fail`'s `undefined`, and the normalisation
  step then flipped it to `true`. `fail()` now returns `false`.
- ESLint clean · `scripts/_fr-parity-harness.mjs` 232/232 · `npm run build` green on Next 16.

## Native review

All 78 new records are AI-authored → **#41 French lane**, and this is the block §4c wants cleared
in a single pass. Register calls a reviewer should look at first: `char`, `blonde`, `bas`,
`souliers`, `chandail`, `gars`, `job`, `fête` are everyday-informal in Québec; `pourriel`,
`balado`, `clavarder` are correct and current but lean official — a Quebecer may also say
`spam`/`podcast`. Also worth a second opinion: `écharpe`→`foulard` is a merge rather than a
1:1 swap, and `huitante` is Vaud/Fribourg/Valais while Geneva says `quatre-vingts` — the schema is
country-level, so Switzerland gets it wholesale.

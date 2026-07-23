# variant-expansion / pipeline

The generalized content-depth pipeline used to bring a track to the Spanish
depth standard (new `verbo` category + `<track>Tags.js` + deepened vocab/verbo/
trad/fono). Built for the Romance rollout (fr, frCa, it, ptBr, ptPt in
v2.33.0-beta.5–7). Language-agnostic; new languages are mostly a new config +
defs module. `lib/gameEngine.js` needs NO change (category-agnostic; tags key off
prompt text).

## Files
- `wf_depth.js` — the multi-agent generation workflow (run via the Workflow
  tool). Args-driven: one generator per (category × CEFR band A1–C2) + a
  native-speaker adversarial verify stage. Reads `args` (see "Args" below);
  returns `{vocab, verbo, trad, fono}` of verified items.
- `assemble_g.py <config.json>` — dedup vs the existing bank, verbecc-verify the
  simple-tense verb forms (when `verify_verbo`), resolve index-style `correct`
  ("0"–"3" → option text), migrate the existing verb drills + person-variants
  into `verbo` (IDs preserved), emit `<track>Tags.js` tag data. Writes
  `assembled_<code>.json`.
- `emit_g.py <config.json>` — rebuild the track's `BANK`, create the `verbo`
  category, splice depth items, write `<track>ForEnTags.js`, wire
  `import { THEMES, tagFor }` + `themes/tagFor`. Preserves an `fvocab` Word Bank
  if present (matches any `bank:` line). Edits the track `.js` in place.
- `deliv_g.py <config.json>` — build the native-review packet (.xlsx),
  round-trip `<code>_depth_generated.json`, and a reference note.
- `vb.py` — verbecc helpers (bare-form extraction incl. pt personal-infinitive
  + quando/se complementizers; `form()`, `pool()`).
- `frdefs.py` / `itdefs.py` / `ptdefs.py` — per-language tense (T) + person (P)
  tag definitions and the tense→verbecc(mood,tense) map (`VBKEY`, `PERSON2PR`).
- `config_*.json` — per-language config (see fields in any file). `verify_verbo`
  is `false` for Portuguese (verbecc's pt model is unreliable — flags correct
  `vamos`/`comprámos`, returns truncated stems); `true` for fr/frCa/it.

## Run order (per track)
1. Dump the track: `curbank_<code>.json` (vocab/gram/trad/fono tuples) + build
   `args_<code>.json` (existing prompts for dedup + house-style examples + the
   language params: tenses, persons, verb_focus per band, fono_focus). Also
   `<code>_variant_ids.json` (variant prompt→id from the variant-expansion
   `generated/` data) and `<code>_base_prompts.json` (the verb-drill base prompts).
2. `Workflow(wf_depth.js, args_<code>)` → save its result to `depth_out_<code>.json`.
3. `python3 assemble_g.py config_<code>.json`
4. `python3 emit_g.py config_<code>.json`  → produces `<track>.js` + `<track>Tags.js`
5. `python3 deliv_g.py config_<code>.json` → packet + round-trip json + reference
6. Bump version, write to repo, ship.

## Args shape (for wf_depth.js)
`{ lang_name, verbecc, existing:{vocab,verbo,trad,fono}, examples:{...},
   tenses:"csv", persons:"csv", verb_focus:{A1..C2}, fono_focus, verbo_label }`
Args may arrive as an object or a JSON string — the script handles both.

## Notes
- `pip install verbecc --break-system-packages`. verbecc trains an ML fallback on
  first use per language (slow first call); rule-based for known verbs.
- Some agents return `correct` as a stringified index — assemble_g resolves it.
- verbecc gate caught real mislabels (gerunds/conditional-passé tagged as
  present/conditional) in fr/it; disabled for pt (see above).
- The per-run artifacts (curbank_*, depth_out_*, assembled_*, args_*) are
  session scratch and are NOT committed — only these reusable scripts are.

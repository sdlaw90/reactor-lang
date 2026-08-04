"""v3.4 — NEW SOURCE assembler. Writes the `<track>.<lang>.js` side tables.

Refuses to write on any of:
  * an unresolved `{n}` placeholder surviving into a final string
  * a localized `options` array whose length differs from the sibling's
  * two identical option strings inside one item — that would make the question
    ambiguous AND collapse two `distractorNotes` keys into one (v3.0 shipped six items
    with exactly this bug)
  * a `distractorNotes` key that is not one of that item's localized options
  * a frame with no translation

  python3 new-source-assemble.py <lang> <repo> [workdir]
"""
import json, re, sys, os, glob, collections

LANG = sys.argv[1] if len(sys.argv) > 1 else 'it'
REPO = sys.argv[2] if len(sys.argv) > 2 else '/root/rl'
WK = sys.argv[3] if len(sys.argv) > 3 else f'/root/wk/src-{LANG}'
PH = re.compile(r'\{(\d+)\}')

# trackId -> camel base name, read off the l10n registry so this can never drift
src_idx = open(os.path.join(REPO, 'data/tracks/l10n/index.js'), encoding='utf-8').read()
TRACK_FILE = {}
for m in re.finditer(r'"([a-z0-9-]+)":\s*\{([^}]*)\}', src_idx):
    im = re.search(r'import\("\./([A-Za-z0-9]+)\.[a-z]{2}"\)', m.group(2))
    if im:
        TRACK_FILE[m.group(1)] = im.group(1)

# Per-item option overrides — see overrides.<lang>.json for why they exist.
OVR_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), f'overrides.{LANG}.json')
OVERRIDES = {}
if os.path.exists(OVR_PATH):
    OVERRIDES = {k: v for k, v in json.load(open(OVR_PATH, encoding='utf-8')).items()
                 if not k.startswith('_')}

data = json.load(open(f'{WK}/source.{LANG}.json'))
rows = json.load(open(f'{WK}/rows.{LANG}.json'))
frames = {f['id']: f for f in json.load(open(f'{WK}/frames.{LANG}.json'))}

trans = {}
for of in sorted(glob.glob(f'{WK}/out/*.json')):
    for k, v in json.load(open(of)).items():
        trans[int(k)] = v

missing = {r['fid'] for r in rows} - set(trans)
blockers = []
if missing:
    blockers.append(f"{len(missing)} frames untranslated")


def fill(fid, slots):
    t = trans.get(fid)
    if t is None:
        return None
    return PH.sub(lambda m: slots[int(m.group(1)) - 1]
                  if int(m.group(1)) - 1 < len(slots) else m.group(0), t)


# (track, item) -> assembled fields
built = collections.defaultdict(dict)
for r in rows:
    text = fill(r['fid'], r['s'])
    if text is None:
        continue
    if PH.search(text):
        blockers.append(f"unresolved slot {r['t']} {r['i']} {r['f']}: {text}")
        continue
    e = built[(r['t'], r['i'])]
    if r['f'] == 'options':
        e.setdefault('options', {})[r['oi']] = text
    elif r['f'] == 'distractorNotes':
        e.setdefault('distractorNotes', {})[r['k']] = (text, r['oi'])
    else:
        e[r['f']] = text

written = []
for tid, blk in data.items():
    base = TRACK_FILE.get(tid)
    if not base:
        blockers.append(f"no side-table file name for {tid}")
        continue
    out = {}
    for r in blk['rows']:
        e = built.get((tid, r['id']))
        if not e:
            continue
        entry = {}
        if 'prompt' in e:
            entry['prompt'] = e['prompt']
        if 'promptNative' in e:
            entry['promptNative'] = e['promptNative']
        loc_opts = None
        if 'options' in e:
            n = len(r.get('options') or [])
            got = e['options']
            if len(got) != n:
                blockers.append(f"{tid} {r['id']}: {len(got)}/{n} options translated")
                continue
            loc_opts = [OVERRIDES.get(f"{tid} {r['id']} {k}", got[k]) for k in range(n)]
            if len(set(loc_opts)) != n:
                dupes = [o for o, c in collections.Counter(loc_opts).items() if c > 1]
                blockers.append(f"{tid} {r['id']}: duplicate option(s) {dupes}")
                continue
            entry['options'] = loc_opts
        if 'explain' in e:
            entry['explain'] = e['explain']
        if 'wrongNote' in e:
            entry['wrongNote'] = e['wrongNote']
        if 'distractorNotes' in e:
            dn = {}
            for base_opt, (text, oi) in e['distractorNotes'].items():
                key = loc_opts[oi] if (loc_opts is not None and oi is not None and oi >= 0) else base_opt
                dn[key] = text
            if loc_opts is not None:
                stray = [k for k in dn if k not in loc_opts]
                if stray:
                    blockers.append(f"{tid} {r['id']}: distractorNote key not an option: {stray[:2]}")
                    continue
            entry['distractorNotes'] = dn
        if entry:
            out[r['id']] = entry
    written.append((tid, base, blk['sibling'], out))

if blockers:
    print(f"{len(blockers)} BLOCKER(S) — nothing written:")
    for b in blockers[:25]:
        print("  " + b)
    sys.exit(1)

HEADER = """// v3.4 ({lang} source) — LOCALIZED-SURFACE side table for the reused track
// "{tid}", consumed by an ITALIAN speaker ("one track, many sources", see l10n/index.js).
//
// Keyed by item id "cat-i" (0-indexed within each base bank category, matching the engine's
// flattenBank order). Each value carries only the fields that change for an Italian learner:
// {{ prompt?, promptNative?, options?, explain?, wrongNote?, distractorNotes? }} — any omitted
// field falls back to the base (English) surface and a missing item id falls back entirely,
// so a gap is never blank. `options` stays index-aligned to the base item, so correctIdx never
// moves; `distractorNotes` are keyed by the LOCALIZED option text.
//
// Localized surface translated from the `{sib}` sibling table, which carries the Word Bank
// (fvocab-*) across without a buildFrequencyBank replay. Explanations, wrong notes and
// distractor notes come from the base bank's `es` value — this source is the first to have
// them from day one rather than as a backfill (see docs/changelog, v3.4).
//
// Assembled frame-and-slot (scripts/l10n-backfill/): the target-language spans inside every
// string were carried through VERBATIM and only the framing was translated, so a conjugated
// form or a quoted term cannot have been paraphrased.
//
// Register: informal `tu`. AI-authored 2026-08-03 — FLAG FOR #41 native review.

export default {{
"""

for tid, base, sib, out in written:
    path = os.path.join(REPO, f'data/tracks/l10n/{base}.{LANG}.js')
    lines = [f'  {json.dumps(k)}: {json.dumps(v, ensure_ascii=False)},' for k, v in out.items()]
    body = HEADER.format(lang=LANG, tid=tid, sib=sib) + "\n".join(lines) + "\n};\n"
    open(path, 'w', encoding='utf-8', newline='').write(body)
    print(f"{base}.{LANG}.js  {len(out)} items")
used = sum(1 for k in OVERRIDES
           if any(k.startswith(f"{tid} ") for tid, _, _, _ in written))
print(f"\n{len(written)} tables written, {len(OVERRIDES)} override(s) applied, 0 blockers")

"""v3.4 — NEW SOURCE disambiguation pass. Run AFTER the first translation round.

**Why this exists.** Frames are deduped on the source string, and the source is Spanish or
French, not English. When the source word is polysemous the dedupe collapses two different
meanings into one frame, and the frame gets ONE translation — so `tarde` (afternoon /
evening / late) became `pomeriggio` everywhere, `probar` (to prove / to taste / to try)
became `dimostrare`, `esperar` (to wait / to hope) became `aspettare`, `mañana` (tomorrow /
morning) became `mattina`. Each is a plausible word in the target language and simply the
wrong meaning, which is the hardest kind of error to see in a list of 80,000 rows.

**What it does.** Finds every frame whose rows do NOT all share the same English original,
re-keys those rows by `(frame, source language, English original)`, and emits only the new
frames for re-translation with the English shown as the disambiguator. Frames whose rows all
mean the same thing are left alone.

**Run this for every new source language.** The English column is the only thing that
distinguishes the senses, and it is present in the extract for exactly this reason.

  python3 new-source-disambiguate.py <lang> [workdir]
"""
import json, sys, os, collections

LANG = sys.argv[1] if len(sys.argv) > 1 else 'it'
WK = sys.argv[2] if len(sys.argv) > 2 else f'/root/wk/src-{LANG}'
OFFSET = 800000
BUDGET = 3000

data = json.load(open(f'{WK}/source.{LANG}.json'))
rows = json.load(open(f'{WK}/rows.{LANG}.json'))
frames = json.load(open(f'{WK}/frames.{LANG}.json'))
fmap = {f['id']: f for f in frames}

# the English original for every row, keyed exactly the way the frame builder read it
en_by_row = {}
for tid, blk in data.items():
    for r in blk['rows']:
        if 'prompt' in r:
            en_by_row[(tid, r['id'], 'prompt', None, None)] = r['prompt']['en']
        if 'promptNative' in r:
            en_by_row[(tid, r['id'], 'promptNative', None, None)] = r['promptNative']['en']
        for k, o in enumerate(r.get('options') or []):
            en_by_row[(tid, r['id'], 'options', None, k)] = o['en']
        for field, v in (r.get('need') or {}).items():
            if field in ('explain', 'wrongNote'):
                en_by_row[(tid, r['id'], field, None, None)] = v['en']
            else:
                for opt, x in v.items():
                    en_by_row[(tid, r['id'], field, opt, x.get('optIdx'))] = x['en']

key = lambda r: (r['t'], r['i'], r['f'], r['k'], r['oi'])
senses = collections.defaultdict(set)
for r in rows:
    senses[r['fid']].add(en_by_row.get(key(r)))
ambiguous = {f for f, v in senses.items() if len(v) > 1}


def lexical(fid):
    """Does this frame CARRY the meaning, or delegate it to a slot?

    Only the first kind can be mistranslated by sense-collapse. An answer `option` is a
    bare word, so it always carries its meaning. A short frame with no placeholder is a
    gloss doing the same job. Everything else — prose with slots — differs between its
    senses only in the slot content, which is substituted verbatim, so one translation of
    the frame is correct for all of them. Checked by hand against a sample before this
    filter was written: `'{1}' es el imperativo de usted.` really is the same sentence for
    all 19 of its verbs.

    Without the filter this pass explodes: 1,980 ambiguous frames become 26,391 sense
    frames, because an `explain` row's English original is near-unique per item. With it,
    300 frames become 686 — about 900 words.
    """
    f = fmap[fid]
    if f['field'] == 'options':
        return True
    return '{' not in f['frame'] and len(f['frame'].split()) <= 6


ambiguous = {f for f in ambiguous if lexical(f)}

new_frames, seen = [], {}
touched = 0
for r in rows:
    if r['fid'] not in ambiguous:
        continue
    old = fmap[r['fid']]
    en = en_by_row.get(key(r))
    sig = (old['frame'], old['src'], en)
    fid = seen.get(sig)
    if fid is None:
        fid = OFFSET + len(new_frames)
        seen[sig] = fid
        new_frames.append({'id': fid, 'frame': old['frame'], 'src': old['src'], 'n': 0,
                           'track': old['track'], 'cat': old['cat'], 'field': old['field'],
                           'en': en})
    new_frames[fid - OFFSET]['n'] += 1
    r['fid'] = fid
    touched += 1

frames.extend(new_frames)
json.dump(rows, open(f'{WK}/rows.{LANG}.json', 'w'))
json.dump(frames, open(f'{WK}/frames.{LANG}.json', 'w'))

ex = collections.defaultdict(list)
for r in rows:
    if r['fid'] >= OFFSET and len(ex[r['fid']]) < 1:
        ex[r['fid']].append(r['s'])

outdir = f'{WK}/batches'
batch, words, k = [], 0, 800


def flush():
    global batch, words, k
    if not batch:
        return
    json.dump(batch, open(f'{outdir}/b{k:03d}.json', 'w'), ensure_ascii=False, indent=0)
    k += 1
    batch, words = [], 0


FIELD_ORDER = {'options': 0, 'promptNative': 1, 'prompt': 2,
               'distractorNotes': 3, 'wrongNote': 4, 'explain': 5}
new_frames.sort(key=lambda f: (FIELD_ORDER.get(f['field'], 9), f['frame']))
for f in new_frames:
    item = {'id': f['id'], 'from': f['src'], 'track': f['track'], 'cat': f['cat'],
            'field': f['field'], 'src': f['frame'], 'en': f['en'], 'n': f['n']}
    if ex[f['id']]:
        item['slots_example'] = ex[f['id']][0]
    batch.append(item)
    words += len(f['frame'].split())
    if words >= BUDGET:
        flush()
flush()
print(f"{len(ambiguous)} ambiguous frames · {touched} rows re-keyed · "
      f"{len(new_frames)} sense-specific frames -> batches b800..b{k-1:03d}")

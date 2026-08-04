"""v3.4 — NEW SOURCE batcher. Chunks frames into translation batches.

Sorted by track, then field, then category, so a batch is coherent: an agent working a
batch of `options` for one track sees a consistent answer-choice register rather than
alternating between answer words and grammar prose.

Each item carries its source language, because a track can draw its localized surface from
`fr` and its explanations from `es`.

  python3 new-source-batch.py <lang> [workdir] [words-per-batch]
"""
import json, os, sys, collections

LANG = sys.argv[1] if len(sys.argv) > 1 else 'it'
WK = sys.argv[2] if len(sys.argv) > 2 else f'/root/wk/src-{LANG}'
BUDGET = int(sys.argv[3]) if len(sys.argv) > 3 else 4000

frames = json.load(open(f'{WK}/frames.{LANG}.json'))
rows = json.load(open(f'{WK}/rows.{LANG}.json'))

ex = collections.defaultdict(list)
for r in rows:
    if len(ex[r['fid']]) < 1:
        ex[r['fid']].append(r['s'])

FIELD_ORDER = {'options': 0, 'promptNative': 1, 'prompt': 2,
               'distractorNotes': 3, 'wrongNote': 4, 'explain': 5}
frames.sort(key=lambda f: (f['track'], FIELD_ORDER.get(f['field'], 9), f['cat'], -f['n']))

outdir = f'{WK}/batches'
os.makedirs(outdir, exist_ok=True)
for f in os.listdir(outdir):
    os.remove(os.path.join(outdir, f))

batch, words, k = [], 0, 0


def flush():
    global batch, words, k
    if not batch:
        return
    json.dump(batch, open(f'{outdir}/b{k:03d}.json', 'w'), ensure_ascii=False, indent=0)
    k += 1
    batch, words = [], 0


for f in frames:
    item = {'id': f['id'], 'from': f['src'], 'track': f['track'], 'cat': f['cat'],
            'field': f['field'], 'src': f['frame'], 'en': f['en'], 'n': f['n']}
    if ex[f['id']]:
        item['slots_example'] = ex[f['id']][0]
    batch.append(item)
    words += len(f['frame'].split())
    if words >= BUDGET:
        flush()
flush()
print(f"{len(frames)} frames -> {k} batches in {outdir}")

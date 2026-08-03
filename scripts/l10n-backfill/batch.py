import json, os, re, collections
PH = re.compile(r'\{(\d+)\}')
BUDGET = 3200  # words per batch
for lang in ('pt','fr'):
    frames = json.load(open(f'/root/wk/bf/frames.{lang}.json'))
    rows = json.load(open(f'/root/wk/bf/rows.{lang}.json'))
    ex = collections.defaultdict(list)
    for r in rows:
        if len(ex[r['fid']]) < 1: ex[r['fid']].append(r['s'])
    frames.sort(key=lambda f: (f['track'], f['cat'], f['field'], -f['n']))
    outdir = f'/root/wk/bf/batches/{lang}'
    os.makedirs(outdir, exist_ok=True)
    for f in os.listdir(outdir): os.remove(os.path.join(outdir, f))
    b, w, k = [], 0, 0
    def flush():
        global b, w, k
        if not b: return
        json.dump(b, open(f'{outdir}/b{k:03d}.json','w'), ensure_ascii=False, indent=0)
        k += 1; b, w = [], 0
    for f in frames:
        item = {'id': f['id'], 'track': f['track'], 'cat': f['cat'], 'field': f['field'],
                'es': f['frame'], 'en': f['en'], 'n': f['n']}
        if ex[f['id']]: item['slots_example'] = ex[f['id']][0]
        b.append(item); w += len(f['frame'].split())
        if w >= BUDGET: flush()
    flush()
    print(lang, k, 'batches')

"""v3.4 #60 backfill — REPAIR pass.

The first frame split treated every apostrophe as a quote delimiter, so a quoted
English phrase containing a contraction ("I'm running late", "one's own") was split
on the wrong apostrophes and a Spanish connective ended up captured as a verbatim
slot. This re-splits with an apostrophe-aware rule — a `'` opens a span only when it
is not preceded by a word character and closes only when not followed by one — and
emits ONLY the rows whose split actually changed, as a fresh batch to re-translate.
"""
import json, re, os, sys, collections

WK = '/root/wk/bf'
# quote forms, apostrophe-aware for the ASCII single quote
Q_OLD = re.compile(r'(“[^“”]{1,120}”|«[^«»]{1,120}»|"[^"]{1,120}"|\'[^\']{1,120}\')')
Q_NEW = re.compile(
    r'(“[^“”]{1,120}”'
    r'|«[^«»]{1,120}»'
    r'|"[^"]{1,120}"'
    r"|(?<!\w)'(?:[^']|'(?=\w)){1,120}'(?!\w))",
    re.UNICODE,
)

def split_frame(s, rx):
    parts = rx.split(s)
    out, slots = [], []
    for i, p in enumerate(parts):
        if i % 2 == 0:
            out.append(p)
        else:
            slots.append(p[1:-1])
            out.append(f"{p[0]}{{{len(slots)}}}{p[-1]}")
    return ''.join(out), slots

def load_src(lang):
    need = json.load(open(f'{WK}/need.{lang}.json'))
    src = {}
    for tid, items in need.items():
        for r in items:
            for fld, val in r['need'].items():
                if fld in ('explain', 'wrongNote'):
                    src[(tid, r['id'], fld, None)] = val['es'] or val['en']
                else:
                    for k, v in val.items():
                        src[(tid, r['id'], fld, k)] = v['es'] or v['en']
    return src

OFFSET = 900000
for lang in ('pt', 'fr'):
    rows = json.load(open(f'{WK}/rows.{lang}.json'))
    frames = json.load(open(f'{WK}/frames.{lang}.json'))
    fmap = {f['id']: f for f in frames}
    src = load_src(lang)
    newframes, seen = [], {}
    changed = 0
    for r in rows:
        s = src[(r['t'], r['i'], r['f'], r['k'])]
        nf, ns = split_frame(s, Q_NEW)
        of, os_ = split_frame(s, Q_OLD)
        if nf == of and ns == os_:
            continue
        changed += 1
        fid = seen.get(nf)
        if fid is None:
            fid = OFFSET + len(newframes)
            seen[nf] = fid
            old = fmap[r['fid']]
            newframes.append({'id': fid, 'frame': nf, 'n': 0, 'track': old['track'],
                              'cat': old['cat'], 'field': old['field'], 'en': old['en']})
        newframes[fid - OFFSET]['n'] += 1
        r['fid'] = fid
        r['s'] = ns
    # append the repaired frames to the registry and rewrite rows
    frames.extend(newframes)
    json.dump(rows, open(f'{WK}/rows.{lang}.json', 'w'))
    json.dump(frames, open(f'{WK}/frames.{lang}.json', 'w'))
    # batch the repaired frames for translation
    outdir = f'{WK}/batches/{lang}'
    ex = collections.defaultdict(list)
    for r in rows:
        if r['fid'] >= OFFSET and len(ex[r['fid']]) < 1:
            ex[r['fid']].append(r['s'])
    b, w, k = [], 0, 900
    def flush():
        global b, w, k
        if not b:
            return
        json.dump(b, open(f'{outdir}/b{k:03d}.json', 'w'), ensure_ascii=False, indent=0)
        k += 1
        b, w = [], 0
    for f in newframes:
        item = {'id': f['id'], 'track': f['track'], 'cat': f['cat'], 'field': f['field'],
                'es': f['frame'], 'en': f['en'], 'n': f['n']}
        if ex[f['id']]:
            item['slots_example'] = ex[f['id']][0]
        b.append(item); w += len(f['frame'].split())
        if w >= 3200:
            flush()
    flush()
    print(f"{lang}: {changed} rows re-split, {len(newframes)} repaired frames, "
          f"batches b900..b{k-1:03d}")

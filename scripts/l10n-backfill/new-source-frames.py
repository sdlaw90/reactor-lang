"""v3.4 — NEW SOURCE frame builder.

Same frame-and-slot split as the pt/fr backfill (see README), applied to BOTH surfaces a
brand-new source language needs:

  A. the localized surface (prompt / promptNative / options), whose source text is an
     existing sibling table — Spanish for most tracks, French for the Spanish-target ones;
  B. the explanation surface (explain / wrongNote / distractorNotes), whose source text is
     always the base bank's `es` value.

Frames carry their own source language, because a single track can draw A from `fr` and B
from `es`. Slots — the quoted spans, which are target-language material — are carried
through verbatim in both streams, so a conjugated form or a quoted term is never handed to
a translator in either surface.

  python3 new-source-frames.py <lang> [workdir]
"""
import json, re, sys, os, collections

LANG = sys.argv[1] if len(sys.argv) > 1 else 'it'
WK = sys.argv[2] if len(sys.argv) > 2 else f'/root/wk/src-{LANG}'

# apostrophe-aware: a `'` opens a span only when not preceded by a word character and
# closes only when not followed by one (the v3.4 repair-pass rule, applied from the start)
Q = re.compile(
    r'(“[^“”]{1,120}”'
    r'|«[^«»]{1,120}»'
    r'|"[^"]{1,120}"'
    r"|(?<!\w)'(?:[^']|'(?=\w)){1,120}'(?!\w))",
    re.UNICODE,
)

def split_frame(s):
    parts = Q.split(s)
    out, slots = [], []
    for i, p in enumerate(parts):
        if i % 2 == 0:
            out.append(p)
        else:
            slots.append(p[1:-1])
            out.append(f"{p[0]}{{{len(slots)}}}{p[-1]}")
    return ''.join(out), slots

data = json.load(open(f'{WK}/source.{LANG}.json'))
rows, frames, seen = [], [], {}

def add(src_text, src_lang, en, track, cat, field, item, key=None, oi=None):
    if not src_text:
        return
    frame, slots = split_frame(src_text)
    sig = (frame, src_lang)
    fid = seen.get(sig)
    if fid is None:
        fid = len(frames)
        seen[sig] = fid
        frames.append({'id': fid, 'frame': frame, 'src': src_lang, 'n': 0,
                       'track': track, 'cat': cat, 'field': field, 'en': en})
    frames[fid]['n'] += 1
    rows.append({'t': track, 'i': item, 'f': field, 'k': key, 'oi': oi,
                 'fid': fid, 's': slots})

for tid, blk in data.items():
    sib = blk['sibling']
    for r in blk['rows']:
        if 'prompt' in r:
            add(r['prompt']['src'], sib, r['prompt']['en'], tid, r['cat'], 'prompt', r['id'])
        if 'promptNative' in r:
            add(r['promptNative']['src'], sib, r['promptNative']['en'], tid, r['cat'], 'promptNative', r['id'])
        for k, o in enumerate(r.get('options') or []):
            add(o['src'], sib, o['en'], tid, r['cat'], 'options', r['id'], oi=k)
        need = r.get('need') or {}
        for field, val in need.items():
            if field in ('explain', 'wrongNote'):
                add(val['es'] or val['en'], 'es', val['en'], tid, r['cat'], field, r['id'])
            else:
                for opt, v in val.items():
                    add(v['es'] or v['en'], 'es', v['en'], tid, r['cat'], field, r['id'],
                        key=opt, oi=v.get('optIdx'))

json.dump(rows, open(f'{WK}/rows.{LANG}.json', 'w'))
json.dump(frames, open(f'{WK}/frames.{LANG}.json', 'w'))

bysrc = collections.Counter(f['src'] for f in frames)
byfield = collections.Counter(r['f'] for r in rows)
print(f"{len(rows)} rows -> {len(frames)} distinct frames "
      f"({sum(len(f['frame'].split()) for f in frames)} frame words)")
print("  by source language:", dict(bysrc))
print("  by field:", dict(byfield))

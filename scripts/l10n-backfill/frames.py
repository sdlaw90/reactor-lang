import json, re, collections, os, sys
Q = re.compile(r'(“[^“”]{1,120}”|«[^«»]{1,120}»|"[^"]{1,120}"|\'[^\']{1,120}\')')
OPEN = {'“':'”', '«':'»', '"':'"', "'":"'"}

def split_frame(s):
    """Return (frame_with_placeholders, slots). Quote marks stay in the frame."""
    parts = Q.split(s)
    out = []; slots = []
    for i, p in enumerate(parts):
        if i % 2 == 0:
            out.append(p)
        else:
            o = p[0]; c = p[-1]
            slots.append(p[1:-1])
            out.append(f"{o}{{{len(slots)}}}{c}")
    return ''.join(out), slots

def build(lang):
    need = json.load(open(f'/root/wk/bf/need.{lang}.json'))
    rows = []
    frames = {}          # frame text -> id
    frame_meta = []      # id -> dict
    for tid, items in need.items():
        for r in items:
            for fld, val in r['need'].items():
                if fld in ('explain', 'wrongNote'):
                    entries = [(None, val)]
                else:
                    entries = list(val.items())
                for key, v in entries:
                    src = v['es'] if v.get('es') else v.get('en')
                    if not src:
                        continue
                    frame, slots = split_frame(src)
                    fid = frames.get(frame)
                    if fid is None:
                        fid = len(frame_meta)
                        frames[frame] = fid
                        frame_meta.append({'id': fid, 'frame': frame, 'n': 0,
                                           'track': tid, 'cat': r['cat'], 'field': fld,
                                           'en': v.get('en')})
                    frame_meta[fid]['n'] += 1
                    rows.append({'t': tid, 'i': r['id'], 'f': fld, 'k': key,
                                 'fid': fid, 's': slots,
                                 'lo': v.get('locOpt') if fld == 'distractorNotes' else None})
    json.dump(rows, open(f'/root/wk/bf/rows.{lang}.json', 'w'))
    json.dump(frame_meta, open(f'/root/wk/bf/frames.{lang}.json', 'w'))
    print(lang, 'rows', len(rows), 'frames', len(frame_meta),
          'frame words', sum(len(f['frame'].split()) for f in frame_meta))
    # sanity: round-trip reassembly must reproduce the source exactly
    bad = 0
    for r in rows[:200000]:
        fr = frame_meta[r['fid']]['frame']
        out = fr
        for n, s in enumerate(r['s'], 1):
            out = out.replace('{%d}' % n, s)
        # find original
    return rows, frame_meta

if __name__ == '__main__':
    for L in ('pt', 'fr'):
        build(L)

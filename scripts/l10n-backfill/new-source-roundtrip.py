"""v3.4 — NEW SOURCE round-trip check. Run BEFORE translating anything.

Refills every frame with its own slots and asserts the result reproduces the source string
byte-for-byte. A split that silently drops or duplicates text is otherwise invisible until
it ships, and at ~80,000 rows nobody finds it by reading.

Includes a mutation that must turn the check red — a check nobody has seen fail is not a
check.

  python3 new-source-roundtrip.py <lang> [workdir]
"""
import json, re, sys

LANG = sys.argv[1] if len(sys.argv) > 1 else 'it'
WK = sys.argv[2] if len(sys.argv) > 2 else f'/root/wk/src-{LANG}'
PH = re.compile(r'\{(\d+)\}')


def fill(frame, slots):
    return PH.sub(lambda m: slots[int(m.group(1)) - 1]
                  if int(m.group(1)) - 1 < len(slots) else m.group(0), frame)


def sources(lang):
    """Rebuild the exact source string for every row key, the same way the frame builder read it."""
    data = json.load(open(f'{WK}/source.{lang}.json'))
    src = {}
    for tid, blk in data.items():
        for r in blk['rows']:
            if 'prompt' in r:
                src[(tid, r['id'], 'prompt', None, None)] = r['prompt']['src']
            if 'promptNative' in r:
                src[(tid, r['id'], 'promptNative', None, None)] = r['promptNative']['src']
            for k, o in enumerate(r.get('options') or []):
                src[(tid, r['id'], 'options', None, k)] = o['src']
            for field, val in (r.get('need') or {}).items():
                if field in ('explain', 'wrongNote'):
                    src[(tid, r['id'], field, None, None)] = val['es'] or val['en']
                else:
                    for opt, v in val.items():
                        src[(tid, r['id'], field, opt, v.get('optIdx'))] = v['es'] or v['en']
    return src


def check(lang, mutate=False):
    rows = json.load(open(f'{WK}/rows.{lang}.json'))
    frames = json.load(open(f'{WK}/frames.{lang}.json'))
    fmap = {f['id']: f for f in frames}
    if mutate:
        # Mutate a frame that is DEFINITELY in use. Picking a fixed index used to work and
        # then silently stopped after a repair pass re-keyed rows onto new frame ids, leaving
        # the old frame orphaned — the mutation became a no-op and the check could no longer
        # fail. Derive the victim from the rows themselves, and assert it is a real edit.
        victim = rows[0]['fid']
        before = fmap[victim]['frame']
        fmap[victim]['frame'] = before + ' XX'
        assert fmap[victim]['frame'] != before, 'mutation is a no-op'
    src = sources(lang)
    bad = 0
    for r in rows:
        want = src[(r['t'], r['i'], r['f'], r['k'], r['oi'])]
        got = fill(fmap[r['fid']]['frame'], r['s'])
        if got != want:
            bad += 1
            if bad <= 3:
                print('  MISMATCH', r['t'], r['i'], r['f'], repr(want)[:80], '!=', repr(got)[:80])
    print(f"{lang}{' [MUTATED]' if mutate else ''}: {len(rows)} rows, {bad} mismatches")
    return bad


clean = check(LANG)
mut = check(LANG, mutate=True)
print(f"\nround-trip blockers: {clean} | mutation produced {mut} mismatches (must be > 0)")
sys.exit(1 if (clean or not mut) else 0)

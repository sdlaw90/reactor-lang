import json, re, sys
PH = re.compile(r'\{(\d+)\}')
def fill(frame, slots):
    return PH.sub(lambda m: slots[int(m.group(1))-1] if int(m.group(1))-1 < len(slots) else m.group(0), frame)

def check(lang, mutate=False):
    need = json.load(open(f'/root/wk/bf/need.{lang}.json'))
    rows = json.load(open(f'/root/wk/bf/rows.{lang}.json'))
    frames = json.load(open(f'/root/wk/bf/frames.{lang}.json'))
    fmap={f['id']:f for f in frames}
    if mutate:
        fmap[7]['frame'] = fmap[7]['frame'] + ' XX'
    src = {}
    for tid, items in need.items():
        for r in items:
            for fld, val in r['need'].items():
                if fld in ('explain','wrongNote'): src[(tid, r['id'], fld, None)] = val['es'] or val['en']
                else:
                    for k, v in val.items(): src[(tid, r['id'], fld, k)] = v['es'] or v['en']
    bad = 0; n = 0
    for r in rows:
        want = src[(r['t'], r['i'], r['f'], r['k'])]
        got = fill(fmap[r['fid']]['frame'], r['s'])
        n += 1
        if got != want:
            bad += 1
            if bad <= 3: print('  MISMATCH', r['t'], r['i'], r['f'], repr(want)[:90], '!=', repr(got)[:90])
    print(f"{lang}{' [MUTATED]' if mutate else ''}: {n} rows, {bad} mismatches")
    return bad

tot = 0
for L in ('pt','fr'): tot += check(L)
m = check('pt', mutate=True)
print("\nround-trip blockers:", tot, "| mutation produced", m, "mismatches (must be > 0)")
sys.exit(1 if (tot or not m) else 0)

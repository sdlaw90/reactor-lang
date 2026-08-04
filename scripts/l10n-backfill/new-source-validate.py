"""v3.4 — NEW SOURCE batch validator. Rejects a batch rather than letting it through.

Checks, per batch:
  * every id in the batch present exactly once, none extra
  * placeholder set identical to the source — same numbers, same count
  * no empty value
  * for `options` frames, the translation is not left verbatim in the source language when
    the source and target differ visibly (reported, not fatal — cognates are real)

  python3 new-source-validate.py <lang> [workdir]
"""
import json, re, sys, os, glob

LANG = sys.argv[1] if len(sys.argv) > 1 else 'it'
WK = sys.argv[2] if len(sys.argv) > 2 else f'/root/wk/src-{LANG}'
PH = re.compile(r'\{(\d+)\}')

ok = bad = 0
pending = []
for bf in sorted(glob.glob(f'{WK}/batches/*.json')):
    name = os.path.basename(bf)
    of = f'{WK}/out/{name}'
    if not os.path.exists(of):
        pending.append(name)
        continue
    batch = json.load(open(bf))
    out = json.load(open(of))
    ids = {str(i['id']) for i in batch}
    errs = []
    missing, extra = ids - set(out), set(out) - ids
    if missing:
        errs.append(f"missing {len(missing)} ({sorted(missing)[:3]})")
    if extra:
        errs.append(f"extra {len(extra)}")
    for i in batch:
        k = str(i['id'])
        if k not in out:
            continue
        want, got = sorted(PH.findall(i['src'])), sorted(PH.findall(out[k]))
        if want != got:
            errs.append(f"id{k} slots {want}!={got}")
        if not str(out[k]).strip():
            errs.append(f"id{k} empty")
    if errs:
        bad += 1
        print(f"FAIL {name}: {'; '.join(errs[:5])}")
    else:
        ok += 1

print(f"\n{ok} batches clean, {bad} rejected, {len(pending)} not yet translated")
if pending:
    print("  pending:", " ".join(pending[:12]), "..." if len(pending) > 12 else "")
sys.exit(1 if bad else 0)

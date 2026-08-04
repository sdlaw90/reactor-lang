import json, re, sys, os, glob
PH=re.compile(r'\{(\d+)\}')
bad=0; ok=0
for lang in ('pt','fr'):
    fmap={f['id']:f for f in json.load(open(f'/root/wk/bf/frames.{lang}.json'))}
    for bf in sorted(glob.glob(f'/root/wk/bf/batches/{lang}/*.json')):
        name=os.path.basename(bf)
        of=f'/root/wk/bf/out/{lang}/{name}'
        if not os.path.exists(of): continue
        batch=json.load(open(bf)); out=json.load(open(of))
        ids={str(i['id']) for i in batch}
        missing=ids-set(out); extra=set(out)-ids
        errs=[]
        if missing: errs.append(f"missing {len(missing)}")
        if extra: errs.append(f"extra {len(extra)}")
        for i in batch:
            k=str(i['id'])
            if k not in out: continue
            want=sorted(PH.findall(i['es'])); got=sorted(PH.findall(out[k]))
            if want!=got: errs.append(f"id{k} slots {want}!={got}"); 
            if not out[k].strip(): errs.append(f"id{k} empty")
        if errs: bad+=1; print(f"FAIL {lang}/{name}: {'; '.join(errs[:5])}")
        else: ok+=1; print(f"ok   {lang}/{name}  {len(out)} ids")
print(f"\n{ok} batches clean, {bad} rejected")
sys.exit(1 if bad else 0)

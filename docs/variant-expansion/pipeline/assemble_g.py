# -*- coding: utf-8 -*-
import json, hashlib, random, unicodedata, re, sys, importlib
import vb
CFG=json.load(open(sys.argv[1]))
D=importlib.import_module(CFG['defs'])
T_DEFS,P_DEFS,VBKEY,PERSON2PR = D.T_DEFS,D.P_DEFS,D.VBKEY,D.PERSON2PR
LANG=CFG['verbecc']; PFX=CFG['id_prefix']; TMS=CFG['tense_map_spec']

def norm(s): return unicodedata.normalize('NFC', re.sub(r'\s+',' ', str(s)).strip())
def eq(a,b): return norm(a).lower()==norm(b).lower()

depth=json.load(open(CFG['depth_out'])); cur=json.load(open(CFG['curbank']))
VIDS=json.load(open(CFG['variant_ids'])); BASE=json.load(open(CFG['base_prompts']))
MIGRATE=set(norm(p) for p in BASE)|set(norm(p) for p in VIDS)

gram_keep, verbo_migrated=[],[]
for it in cur['gram']:
    (verbo_migrated if norm(it[0]) in MIGRATE else gram_keep).append(it)

SEEN=set()
for c in ('vocab','gram','trad'):
    for it in cur[c]: SEEN.add(norm(it[0]))
for it in cur['fono']: SEEN.add(norm(it['text']))

def opts_ci(options, correct, key):
    # some agents returned `correct` as a stringified index ("0".."3") — resolve it
    c=str(correct).strip()
    if not any(eq(o,c) for o in options) and c in {'0','1','2','3'} and int(c)<len(options):
        correct=options[int(c)]
    opts=[o for o in options]; idx=None
    for i,o in enumerate(opts):
        if eq(o,correct): idx=i; break
    if idx is None: opts=[correct]+opts
    opts=list(dict.fromkeys(opts))
    if correct not in opts: opts=[correct]+[o for o in opts if not eq(o,correct)]
    opts=opts[:4]
    if len(opts)<4: return None,None
    rng=random.Random(int(hashlib.md5(key.encode()).hexdigest(),16)); rng.shuffle(opts)
    return opts, opts.index(correct)

stats={'kept':{},'dropped':{}}
def drop(cat,reason): stats['dropped'].setdefault(cat,[]).append(reason)
vocab_new,trad_new,verbo_new,fono_new=[],[],[],[]
tags={}
VALID={'numbers-time','directions','shopping','restaurant','travel','medical','small-talk','work','emotions'}
def cth(ts): return [t for t in (ts or []) if t in VALID]

vc=1
for it in depth.get('vocab',[]):
    p=norm(it['prompt'])
    if p in SEEN: drop('vocab','dup'); continue
    o,ci=opts_ci(it['options'],it['correct'],p)
    if o is None: drop('vocab','opts'); continue
    SEEN.add(p); vid=f"{PFX}-vocab-{vc:03d}"; vc+=1
    vocab_new.append(dict(prompt=it['prompt'],options=o,ci=ci,en=it['ex_en'],es=it['ex_es'],level=it['level'],sub=it.get('subtitle_en',''),vid=vid))
    th=cth(it.get('themes'))
    if th: tags[p]={'themes':th}
tc=1
for it in depth.get('trad',[]):
    p=norm(it['prompt'])
    if p in SEEN: drop('trad','dup'); continue
    o,ci=opts_ci(it['options'],it['correct'],p)
    if o is None: drop('trad','opts'); continue
    SEEN.add(p); vid=f"{PFX}-trad-{tc:03d}"; tc+=1
    trad_new.append(dict(prompt=it['prompt'],options=o,ci=ci,en=it['ex_en'],es=it['ex_es'],level=it['level'],vid=vid))
    th=cth(it.get('themes'))
    if th: tags[p]={'themes':th}
vv=1
for it in depth.get('verbo',[]):
    p=norm(it['prompt'])
    if p in SEEN: drop('verbo','dup'); continue
    lemma=(it.get('lemma') or '').strip().lower(); tense=it.get('tense'); person=it.get('person'); correct=it['correct']
    if CFG.get('verify_verbo', True) and tense in VBKEY and VBKEY[tense] and person in PERSON2PR and lemma:
        mood,vt=VBKEY[tense]
        try: exp=vb.form(lemma,LANG,mood,vt,PERSON2PR[person])
        except Exception: exp=None
        if exp is not None and not eq(exp,correct):
            drop('verbo',f'conj({lemma}/{tense}/{person}: exp {exp!r} got {correct!r})'); continue
    o,ci=opts_ci(it['options'],correct,p)
    if o is None: drop('verbo','opts'); continue
    SEEN.add(p); vid=f"{PFX}-verb-{vv:03d}"; vv+=1
    verbo_new.append(dict(prompt=it['prompt'],options=o,ci=ci,en=it['ex_en'],es=it['ex_es'],level=it['level'],sub=it.get('subtitle_en',''),vid=vid))
    t={}
    th=cth(it.get('themes'))
    if th: t['themes']=th
    if tense in T_DEFS: t['grammar']=tense
    if person in P_DEFS: t['person']=person
    if t: tags[p]=t
for it in depth.get('fono',[]):
    tx=norm(it['text'])
    if tx in SEEN: drop('fono','dup'); continue
    io,ici=opts_ci(it['id_options'],it['id_correct'],tx+'|id'); ro,rci=opts_ci(it['re_options'],it['re_correct'],tx+'|re')
    if io is None or ro is None: drop('fono','opts'); continue
    SEEN.add(tx)
    fono_new.append(dict(text=it['text'],sound=it['sound'],difficulty=it['difficulty'],io=io,ici=ici,ien=it['id_ex_en'],ies=it['id_ex_es'],ro=ro,rci=rci,ren=it['re_ex_en'],res=it['re_ex_es']))
for c in ('vocab','trad','verbo','fono'): stats['kept'][c]=len({'vocab':vocab_new,'trad':trad_new,'verbo':verbo_new,'fono':fono_new}[c])

# tag migrated
gen=json.load(open('generated_all.json'))['by_track'][CFG['spec_track']]
GENBY={norm(e['new_prompt']):e for e in gen}
from spec import SPEC
SPECX={f"{PFX}-v-{s['num']:03d}":s for s in SPEC if s['track']==CFG['spec_track']}
for it in verbo_migrated:
    p=norm(it[0])
    if p in VIDS:
        e=GENBY.get(p)
        if e:
            t={}; tk=TMS.get(e['tense'])
            if tk in T_DEFS: t['grammar']=tk
            if e['target_person'] in P_DEFS: t['person']=e['target_person']
            if t: tags[p]=t
    else:
        for bid,s in SPECX.items():
            if norm(s['base_prompt'])==p:
                t={}; tk=TMS.get(s['tense'])
                if tk in T_DEFS: t['grammar']=tk
                if s['base_pr'] in P_DEFS: t['person']=s['base_pr']
                if t: tags[p]=t
                break
json.dump(dict(vocab_new=vocab_new,trad_new=trad_new,verbo_new=verbo_new,fono_new=fono_new,verbo_migrated=verbo_migrated,gram_keep=gram_keep,tags=tags,stats=stats),open(CFG['assembled'],'w'),ensure_ascii=False)
print("KEPT:",stats['kept']); print("DROPPED:",{k:len(v) for k,v in stats['dropped'].items()})
for k,v in stats['dropped'].items():
    for r in v[:6]:
        if r!='dup': print(f"  {k}: {r}")
print("tags:",len(tags),"| verbo total",len(verbo_migrated)+len(verbo_new),"| gram keep",len(gram_keep))

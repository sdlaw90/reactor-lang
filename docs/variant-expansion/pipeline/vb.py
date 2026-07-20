import verbecc, json, re, unicodedata
_cc={}
def cc(lang):
    if lang not in _cc: _cc[lang]=verbecc.CompleteConjugator(lang)
    return _cc[lang]

PRON={
 'fr': ["j'","je ","tu ","il ","elle ","on ","nous ","vous ","ils ","elles "],
 'it': ["io ","tu ","lui ","lei ","egli ","ella ","esso ","noi ","voi ","loro ","essi ","esse "],
 'pt': ["eu ","tu ","ele ","ela ","você ","voce ","nós ","nos ","vós ","vos ","eles ","elas ","vocês ","voces "],
 'es': ["yo ","tú ","él ","ella ","usted ","nosotros ","nosotras ","vosotros ","vosotras ","ellos ","ellas ","ustedes "],
}
# complementizers/particles verbecc bakes into subjunctive/future-subj tenses
COMPL={
 'fr': ["que ","qu'","si ","s'"],
 'it': ["che ","ch'","se "],
 'pt': ["que ","quando ","se ","caso ","talvez "],
 'es': ["que ","cuando ","si ","como "],
}
def bare(c0, lang):
    s=c0.strip()
    low=s.lower()
    for q in COMPL[lang]:
        if low.startswith(q): s=s[len(q):]; break
    low=s.lower()
    for p in PRON[lang]:
        if low.startswith(p): s=s[len(p):]; break
    return s.strip()

# moods/tenses that carry a person axis and are fill-a-single-verb usable
def table(lemma, lang):
    r=json.loads(cc(lang).conjugate(lemma).to_json())
    rows=[]
    for mood,tenses in r['moods'].items():
        if mood in ('participe','participio','particípio','gerundio','gerúndio','gerundif'): continue
        if not isinstance(tenses,dict): continue
        for tense,cells in tenses.items():
            # keep personal-infinitive (person axis); drop plain infinitive
            if mood in ('infinitif','infinitivo','infinito'):
                if 'pessoal-presente' not in tense: continue
            if not isinstance(cells,list): continue
            for cell in cells:
                c=cell.get('c',[])
                if not c: continue
                rows.append(dict(mood=mood,tense=tense,person=cell.get('p'),num=cell.get('n'),
                                 pr=cell.get('pr'),g=cell.get('g'),form=bare(c[0],lang)))
    return rows

def norm(x): return unicodedata.normalize('NFC', x.strip()).lower()

def find(lemma,lang,ans):
    tb=table(lemma,lang)
    return [r for r in tb if norm(r['form'])==norm(ans)]

if __name__=='__main__':
    tests=[('fr','fermer','Ferme'),('pt','ter','tivesse'),('pt','ser','fosse'),
      ('pt','poder','pudermos'),('pt','fazer','fazermos'),('pt','ir','irmos'),
      ('pt','chegar','chegares'),('pt','estar','esteja'),('pt','chegar','chegar')]
    for lang,lem,ans in tests:
        h=find(lem,lang,ans)
        print(f"{lang} {lem:8} {ans!r:12} -> "+("; ".join(f"{x['mood']}/{x['tense']}/{x['pr']}" for x in h) if h else "NO MATCH"))

def _table_full(lemma,lang):
    r=json.loads(cc(lang).conjugate(lemma).to_json())
    out=[]
    for mood,tenses in r['moods'].items():
        if not isinstance(tenses,dict): continue
        for tense,cells in tenses.items():
            if not isinstance(cells,list): continue
            for cell in cells:
                c=cell.get('c',[])
                if not c: continue
                pr=cell.get('pr')
                if mood in ('infinitivo','infinitif','infinito') and 'pessoal-presente' in tense:
                    # c like "por fazermos nós" -> middle verb token
                    ws=c[0].split()
                    if ws and ws[0].lower()=='por': ws=ws[1:]
                    if len(ws)>=2 and ws[-1].lower()==(pr or '').lower(): form=' '.join(ws[:-1])
                    else: form=ws[0] if ws else c[0]
                elif mood in ('infinitif','infinitivo','infinito','participe','participio','particípio','gerundio','gerúndio','gerundif'):
                    continue
                else:
                    form=bare(c[0],lang)
                out.append(dict(mood=mood,tense=tense,pr=pr,num=cell.get('n'),p=cell.get('p'),form=form))
    return out

def form(lemma,lang,mood,tense,pr):
    for r in _table_full(lemma,lang):
        if r['mood']==mood and r['tense']==tense and r['pr']==pr:
            return r['form']
    return None

def pool(lemma,lang,mood,tense):
    """ordered unique bare forms across persons for a (mood,tense)."""
    seen=[]
    for r in _table_full(lemma,lang):
        if r['mood']==mood and r['tense']==tense and r['form'] not in seen:
            seen.append(r['form'])
    return seen

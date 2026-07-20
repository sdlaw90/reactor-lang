# -*- coding: utf-8 -*-
import json, re, sys, importlib
CFG=json.load(open(sys.argv[1]))
D=importlib.import_module(CFG['defs'])
T_DEFS,P_DEFS=D.T_DEFS,D.P_DEFS
A=json.load(open(CFG['assembled'])); CUR=json.load(open(CFG['curbank']))
VIDS=json.load(open(CFG['variant_ids']))
def _n(s): return re.sub(r'\s+',' ',str(s)).strip()
_VID_N={_n(k):v for k,v in VIDS.items()}
def js(v):
    if v is None: return 'null'
    if isinstance(v,bool): return 'true' if v else 'false'
    if isinstance(v,(int,float)): return str(v)
    if isinstance(v,str): return json.dumps(v,ensure_ascii=False)
    if isinstance(v,list): return '['+', '.join(js(x) for x in v)+']'
    if isinstance(v,dict): return '{ '+', '.join(f'{k}: {js(val)}' for k,val in v.items())+' }'
    raise TypeError(str(type(v)))
def mc_item(d, sub=True):
    parts=[js(d['prompt']),js(d['options']),str(d['ci']),js({'en':d['en'],'es':d['es']}),js(d['level'])]
    if sub: parts+=['null', js({'en':d['sub']}) if d.get('sub') else 'null']
    return '    ['+', '.join(parts)+f"],  // {d['vid']}"
def raw_item(tup, keep_vid=False):
    line='    ['+', '.join(js(x) for x in tup)+'],'
    if keep_vid:
        vid=_VID_N.get(_n(tup[0]))
        if vid: line+=f'  // {vid}'
    return line
def arr(name, lines): return f"  {name}: [\n"+"\n".join(lines)+"\n  ],"

vocab_lines=[raw_item(t) for t in CUR['vocab']]+[mc_item(d) for d in A['vocab_new']]
verbo_lines=[raw_item(t,keep_vid=True) for t in A['verbo_migrated']]+[mc_item(d) for d in A['verbo_new']]
gram_lines=[raw_item(t) for t in A['gram_keep']]
trad_lines=[raw_item(t) for t in CUR['trad']]+[mc_item(d,sub=False) for d in A['trad_new']]
BANK=("const BANK = {\n"+arr('vocab',vocab_lines)+"\n"
    +"  // ——— verbo: dedicated verb-conjugation category (migrated out of gram + depth pass) ———\n"
    +arr('verbo',verbo_lines)+"\n"+arr('gram',gram_lines)+"\n"+arr('trad',trad_lines)+"\n};")

def fono_obj(f): return {'text':f['text'],'sound':f['sound'],'difficulty':f['difficulty'],
    'identify':{'options':f['io'],'correctIdx':f['ici'],'explain':{'en':f['ien'],'es':f['ies']}},
    'respond':{'options':f['ro'],'correctIdx':f['rci'],'explain':{'en':f['ren'],'es':f['res']}}}
fono_all=[f for f in CUR['fono']]+[fono_obj(f) for f in A['fono_new']]
FONO="const FONO_BANK = [\n"+"\n".join("  "+js(o)+"," for o in fono_all)+"\n];"

src=open(CFG['track_file'],encoding='utf-8').read()
if CFG['tags_module'] not in src:
    m=re.search(r'^const CATS = \{', src, re.M)
    src=src[:m.start()]+f'import {{ THEMES, tagFor }} from "./{CFG["tags_module"]}";\n\n'+src[m.start():]
# insert verbo into CATS right after the vocab entry (label-agnostic)
src=re.sub(r'(\n  vocab: \{[^\n]*\},)', r'\1'+f'\n  verbo: {{ label: {js(CFG["verbo_label"])}, color: {js(CFG["verbo_color"])} }},', src, count=1)
src=re.sub(r'const BANK = \{.*?\n\};', lambda m: BANK, src, count=1, flags=re.S)
src=re.sub(r'const FONO_BANK = \[.*?\n\];', lambda m: FONO, src, count=1, flags=re.S)
src=re.sub(r'(\n  bank: [^\n]*,)', r'\1\n  themes: THEMES,\n  tagFor,', src, count=1)
open(CFG['track_file'],'w',encoding='utf-8').write(src)

THEMES=[("numbers-time","Numbers, dates & time","Números y tiempo"),("directions","Directions","Direcciones"),
 ("shopping","Shopping","Compras"),("restaurant","Restaurant & food","Restaurante"),("travel","Travel","Viajes"),
 ("medical","Medical & doctor","Salud"),("small-talk","Small talk","Conversación"),("work","Work & office","Trabajo"),
 ("emotions","Emotions","Emociones")]
def tdef(k):
    en,es,wen,wes=T_DEFS[k]
    return f'  {k}: {{ tense: {{ en: {js(en)}, es: {js(es)} }}, why: {{ en: {js(wen)}, es: {js(wes)} }} }},'
def pdef(k):
    en,es=P_DEFS[k]; return f'  {k}: {{ en: {js(en)}, es: {js(es)} }},'
raw_lines=[]
for prompt,t in A['tags'].items():
    parts=[]
    if t.get('themes'): parts.append('themes: '+js(t['themes']))
    if t.get('grammar'): parts.append('grammar: T.'+t['grammar'])
    if t.get('person'): parts.append('person: P.'+t['person'])
    if parts: raw_lines.append(f'  {js(prompt)}: {{ {", ".join(parts)} }},')
TAGS=('// Shared tag model for '+CFG['track']+' (#88 themes + #89 tense training-wheels).\n'
 '// Keyed by normalized PROMPT TEXT. AI-authored in the content-depth pass — PENDING native review.\n\n'
 'export const THEMES = [\n'+"\n".join(f'  {{ id: {js(i)}, en: {js(e)}, es: {js(s)} }},' for i,e,s in THEMES)+'\n];\n\n'
 'const T = {\n'+"\n".join(tdef(k) for k in T_DEFS)+'\n};\n\n'
 'const P = {\n'+"\n".join(pdef(k) for k in P_DEFS)+'\n};\n\n'
 'const RAW = {\n'+"\n".join(raw_lines)+'\n};\n\n'
 'const norm = (s) => String(s).replace(/\\s+/g, " ").trim();\n'
 'const MAP = new Map(Object.entries(RAW).map(([k, v]) => [norm(k), v]));\n\n'
 'export function tagFor(prompt) {\n  if (!prompt) return null;\n  return MAP.get(norm(prompt)) || null;\n}\n')
open(CFG['tags_file'],'w',encoding='utf-8').write(TAGS)
print(f"emitted {CFG['track_file']} + {CFG['tags_file']}: vocab {len(vocab_lines)}, verbo {len(verbo_lines)}, gram {len(gram_lines)}, trad {len(trad_lines)}, fono {len(fono_all)}, tags {len(raw_lines)}")

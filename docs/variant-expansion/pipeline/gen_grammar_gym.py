# -*- coding: utf-8 -*-
"""Generate #90 grammar-gym modules for fr/frCa/it/ptBr/ptPt, mirroring
data/grammar/esForEn.js. Conjugation FORMS come from verbecc; pedagogical
framing (persons/tenses/groups/glosses/notes/intro) is authored here.
Emits data/grammar/<track>.js + prints a verification table."""
import os, sys, json, re
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import vb

REPO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", ".."))
GRAMDIR = os.path.join(REPO, "data", "grammar")

# ---- persons: (id, target-label, en-label, verbecc_pr) ----
FR_P = [("je","je","I","je"),("tu","tu","you","tu"),("il","il / elle","he / she","il"),
        ("nous","nous","we","nous"),("vous","vous","you (pl/formal)","vous"),("ils","ils / elles","they","ils")]
IT_P = [("io","io","I","io"),("tu","tu","you","tu"),("lui","lui / lei","he / she","lui"),
        ("noi","noi","we","noi"),("voi","voi","you all","voi"),("loro","loro","they","loro")]
PTBR_P = [("eu","eu","I","eu"),("voce","você","you","ele"),("ele","ele / ela","he / she","ele"),
          ("nos","nós","we","nós"),("eles","eles / elas","they","eles")]
PTPT_P = [("eu","eu","I","eu"),("tu","tu","you","tu"),("ele","ele / ela","he / she","ele"),
          ("nos","nós","we","nós"),("eles","eles / elas","they","eles")]
ES_P = [("yo","yo","I","yo"),("tu","tú","you","tú"),("el","él / ella","he / she","él"),
        ("nos","nosotros","we","nosotros"),("vos","vosotros","you all","vosotros"),("ellos","ellos / ellas","they","ellos")]

ES_T = [
 ("present","Present","Presente","Habitual or current actions.","Acciones habituales o actuales.",("indicativo","presente")),
 ("preterite","Preterite","Pretérito","A completed action at a specific point in the past.","Una acción completada en un momento concreto del pasado.",("indicativo","pretérito-perfecto-simple")),
 ("imperfect","Imperfect","Imperfecto","Ongoing, habitual, or background past actions.","Acciones pasadas en curso, habituales o de fondo.",("indicativo","pretérito-imperfecto")),
 ("future","Future","Futuro","What will happen.","Lo que ocurrirá.",("indicativo","futuro")),
 ("conditional","Conditional","Condicional","What would happen.","Lo que ocurriría.",("condicional","presente")),
 ("presSubj","Present subjunctive","Presente de subjuntivo","After wishes, doubt, emotion, or 'cuando' about the future.","Tras deseos, dudas, emociones o 'cuando' sobre el futuro.",("subjuntivo","presente")),
]
ES_V = [
 ("hablar","to speak","hablar","regular"),("comer","to eat","comer","regular"),("vivir","to live","vivir","regular"),
 ("ser","to be (permanent)","ser","serestar"),("estar","to be (state/location)","estar","serestar"),
 ("ir","to go","ir","irregular"),("tener","to have","tener","irregular"),("hacer","to do / make","hacer","irregular"),
 ("querer","to want (e→ie)","querer","stem"),("poder","to be able (o→ue)","poder","stem"),("pedir","to ask for (e→i)","pedir","stem"),
]
ES_G = [
 ("regular","Regular verbs (-ar / -er / -ir)","Verbos regulares (-ar / -er / -ir)","Drop the ending, add the pattern for its type. -er and -ir share almost every ending — the main split is -ar vs. the other two.","Quita la terminación y agrega el patrón según su tipo. -er e -ir comparten casi todas las terminaciones — la división principal es -ar frente a las otras dos."),
 ("serestar","The two \"to be\": ser vs. estar","Los dos \"to be\": ser vs. estar","ser = identity and permanent traits; estar = states, feelings, and location. Both are irregular — worth memorizing cold.","ser = identidad y rasgos permanentes; estar = estados, sentimientos y ubicación. Ambos son irregulares — vale la pena memorizarlos."),
 ("irregular","Common irregulars","Irregulares comunes","High-frequency verbs that break the rules — often with a \"g\" in the yo form (tengo, hago) and irregular preterite stems (tuve, hice).","Verbos muy frecuentes que rompen las reglas — a menudo con una \"g\" en la forma yo (tengo, hago) y raíces irregulares en el pretérito (tuve, hice)."),
 ("stem","Stem-changers (boot verbs)","Verbos con cambio de raíz","The stressed vowel changes in every person EXCEPT nosotros and vosotros — draw a boot around yo/tú/él/ellos (e→ie, o→ue, e→i); nosotros and vosotros stay regular.","La vocal acentuada cambia en todas las personas EXCEPTO nosotros y vosotros — dibuja una bota alrededor de yo/tú/él/ellos (e→ie, o→ue, e→i); nosotros y vosotros se quedan regulares."),
]

# ---- tenses: (id, en, target, why_en, why_target, (verbecc_mood, verbecc_tense)) ----
FR_T = [
 ("present","Present","Présent","Habitual or current actions.","Actions habituelles ou actuelles.",("indicatif","présent")),
 ("passeCompose","Passé composé","Passé composé","The everyday past — a completed action (\"did / have done\").","Le passé courant — une action achevée.",("indicatif","passé-composé")),
 ("imparfait","Imperfect","Imparfait","Ongoing, habitual, or background past.","Passé en cours, habituel ou de fond.",("indicatif","imparfait")),
 ("futur","Future","Futur simple","What will happen.","Ce qui arrivera.",("indicatif","futur-simple")),
 ("conditionnel","Conditional","Conditionnel","What would happen — often after a hypothetical 'si'.","Ce qui arriverait — souvent après un 'si'.",("conditionnel","présent")),
 ("subjPresent","Present subjunctive","Subjonctif présent","After necessity, wish, doubt or emotion (il faut que, vouloir que).","Après la nécessité, le souhait, le doute (il faut que…).",("subjonctif","présent")),
]
IT_T = [
 ("presente","Present","Presente","Habitual or current actions.","Azioni abituali o attuali.",("indicativo","presente")),
 ("passatoProssimo","Passato prossimo","Passato prossimo","The everyday past — a completed action (\"did / have done\").","Il passato corrente — un'azione compiuta.",("indicativo","passato-prossimo")),
 ("imperfetto","Imperfect","Imperfetto","Ongoing, habitual, or background past.","Passato in corso, abituale o di sfondo.",("indicativo","imperfetto")),
 ("futuro","Future","Futuro semplice","What will happen.","Ciò che accadrà.",("indicativo","futuro")),
 ("condizionale","Conditional","Condizionale","What would happen, and polite requests (vorrei).","Ciò che accadrebbe, e richieste cortesi.",("condizionale","presente")),
 ("congPresente","Present subjunctive","Congiuntivo presente","After opinion, doubt, wish or emotion (penso che, voglio che).","Dopo opinione, dubbio, desiderio (penso che…).",("congiuntivo","presente")),
]
PT_T = [
 ("presente","Present","Presente","Habitual or current actions.","Ações habituais ou atuais.",("indicativo","presente")),
 ("pretPerfeito","Preterite","Pretérito perfeito","A completed past action (\"did\").","Uma ação passada concluída.",("indicativo","pretérito-perfeito")),
 ("imperfeito","Imperfect","Pretérito imperfeito","Ongoing, habitual, or background past.","Passado em curso, habitual ou de fundo.",("indicativo","pretérito-imperfeito")),
 ("futuro","Future","Futuro","What will happen.","O que vai acontecer.",("indicativo","futuro-do-presente")),
 ("condicional","Conditional","Condicional","What would happen, and polite requests.","O que aconteceria, e pedidos corteses.",("condicional","futuro-do-pretérito")),
 ("presSubj","Present subjunctive","Presente do subjuntivo","After wish, doubt, emotion (espero que, talvez, embora).","Após desejo, dúvida, emoção (espero que…).",("subjuntivo","presente")),
]

# ---- verbs: (inf, gloss_en, gloss_target, group) ----
FR_V = [
 ("parler","to speak","parler","regular"),("finir","to finish","finir","regular"),("vendre","to sell","vendre","regular"),
 ("être","to be","être","aux"),("avoir","to have","avoir","aux"),
 ("aller","to go","aller","irregular"),("faire","to do / make","faire","irregular"),
 ("venir","to come","venir","irregular"),("prendre","to take","prendre","irregular"),
 ("pouvoir","to be able / can","pouvoir","modal"),("vouloir","to want","vouloir","modal"),
]
IT_V = [
 ("parlare","to speak","parlare","regular"),("credere","to believe","credere","regular"),("dormire","to sleep","dormire","regular"),
 ("essere","to be","essere","aux"),("avere","to have","avere","aux"),
 ("andare","to go","andare","irregular"),("fare","to do / make","fare","irregular"),
 ("venire","to come","venire","irregular"),("stare","to stay / be","stare","irregular"),
 ("potere","to be able / can","potere","modal"),("volere","to want","volere","modal"),
]
PT_V = [
 ("falar","to speak","falar","regular"),("comer","to eat","comer","regular"),("partir","to leave","partir","regular"),
 ("ser","to be (permanent)","ser","serestar"),("estar","to be (state/location)","estar","serestar"),
 ("ir","to go","ir","irregular"),("ter","to have","ter","irregular"),("fazer","to do / make","fazer","irregular"),
 ("ver","to see","ver","irregular"),
 ("poder","to be able / can","poder","modal"),("querer","to want","querer","modal"),
]

# ---- groups: (id, title_en, title_target, note_en, note_target) ----
FR_G = [
 ("regular","Regular verbs (-er / -ir / -re)","Verbes réguliers","Drop the ending and add the pattern for its type. -er is the biggest family; -ir and -re are smaller and share many endings.","Enlève la terminaison et ajoute le motif du type."),
 ("aux","The two helpers: être & avoir","Les deux auxiliaires : être & avoir","Both are highly irregular and both build the passé composé (most verbs take avoir; movement/state verbs take être). Memorize them cold.","Les deux sont irréguliers et forment le passé composé."),
 ("irregular","Common irregulars","Irréguliers courants","High-frequency verbs that rewrite their stem — aller, faire, venir, prendre. Worth learning one at a time.","Verbes très fréquents à radical irrégulier."),
 ("modal","Modal-type verbs","Verbes modaux","pouvoir and vouloir take an infinitive after them (je peux partir) and have irregular stems in the future/conditional (pourr-, voudr-).","pouvoir et vouloir sont suivis d'un infinitif."),
]
IT_G = [
 ("regular","Regular verbs (-are / -ere / -ire)","Verbi regolari","Drop the ending and add the pattern for its type. -are is the biggest family; some -ire verbs add -isc- (finisco) — not shown here.","Togli la desinenza e aggiungi il modello del tipo."),
 ("aux","The two helpers: essere & avere","I due ausiliari: essere & avere","Both build the passato prossimo (most verbs take avere; movement/state verbs take essere, and then the participle agrees: è andata). Memorize them.","Entrambi formano il passato prossimo."),
 ("irregular","Common irregulars","Irregolari comuni","High-frequency verbs that rewrite their stem — andare, fare, venire, stare. stare also drives the progressive (sto parlando).","Verbi molto frequenti a radice irregolare."),
 ("modal","Modal-type verbs","Verbi modali","potere and volere take an infinitive after them (posso partire) and are irregular throughout.","potere e volere sono seguiti da un infinito."),
]
PT_G = [
 ("regular","Regular verbs (-ar / -er / -ir)","Verbos regulares","Drop the ending and add the pattern for its type. -er and -ir share almost every ending; the main split is -ar vs. the other two.","Tira a terminação e junta o padrão do tipo."),
 ("serestar","The two \"to be\": ser vs. estar","Os dois \"to be\": ser vs. estar","ser = identity and permanent traits; estar = states, feelings, and location. Both irregular — worth memorizing.","ser = identidade e traços permanentes; estar = estados e localização."),
 ("irregular","Common irregulars","Irregulares comuns","High-frequency verbs that break the rules — ir, ter, fazer, ver — often with irregular preterite stems (fui, tive, fiz).","Verbos muito frequentes que fogem à regra."),
 ("modal","Modal-type verbs","Verbos modais","poder and querer take an infinitive after them (posso sair) and have irregular preterites (pude, quis).","poder e querer são seguidos de um infinitivo."),
]

INTRO = {
 'fr': ("Deliberate conjugation practice — the tense drills Quick Quiz only samples. Your progress here is tracked on its own and never touches your main level or streak.",
        "Pratique délibérée de la conjugaison. Ta progression est suivie à part et n'affecte jamais ton niveau principal."),
 'it': ("Deliberate conjugation practice — the tense drills Quick Quiz only samples. Your progress here is tracked on its own and never touches your main level or streak.",
        "Pratica deliberata della coniugazione. I tuoi progressi sono tracciati a parte e non toccano il livello principale."),
 'pt': ("Deliberate conjugation practice — the tense drills Quick Quiz only samples. Your progress here is tracked on its own and never touches your main level or streak.",
        "Prática deliberada de conjugação. O teu progresso é registado à parte e nunca afeta o teu nível principal."),
 'es': ("Deliberate conjugation practice — the tense drills Quick Quiz only samples. Your progress here is tracked on its own and never touches your main level or streak.",
        "Práctica deliberada de conjugación — los ejercicios de tiempos que el Quiz Rápido solo prueba de pasada. Tu progreso aquí se lleva por separado y nunca afecta tu nivel ni tu racha principal."),
}

CFG = {
 'frForEn':   dict(trackId="fr-for-en", tl="fr", vlang="fr", P=FR_P, T=FR_T, V=FR_V, G=FR_G, intro=INTRO['fr'], var="frForEnGrammar"),
 'frCaForEn': dict(trackId="fr-ca-for-en", tl="fr", vlang="fr", P=FR_P, T=FR_T, V=FR_V, G=FR_G, intro=INTRO['fr'], var="frCaForEnGrammar"),
 'itForEn':   dict(trackId="it-for-en", tl="it", vlang="it", P=IT_P, T=IT_T, V=IT_V, G=IT_G, intro=INTRO['it'], var="itForEnGrammar"),
 'ptBrForEn': dict(trackId="pt-br-for-en", tl="pt", vlang="pt", P=PTBR_P, T=PT_T, V=PT_V, G=PT_G, intro=INTRO['pt'], var="ptBrForEnGrammar"),
 'ptPtForEn': dict(trackId="pt-pt-for-en", tl="pt", vlang="pt", P=PTPT_P, T=PT_T, V=PT_V, G=PT_G, intro=INTRO['pt'], var="ptPtForEnGrammar"),
 'esSpainForEn': dict(trackId="es-spain-for-en", tl="es", vlang="es", P=ES_P, T=ES_T, V=ES_V, G=ES_G, intro=INTRO['es'], var="esSpainForEnGrammar"),
}

def js(v):
    if isinstance(v,str): return json.dumps(v,ensure_ascii=False)
    if isinstance(v,list): return "["+", ".join(js(x) for x in v)+"]"
    if isinstance(v,dict): return "{ "+", ".join(f"{k}: {js(x)}" for k,x in v.items())+" }"
    return json.dumps(v,ensure_ascii=False)

# être/essere auxiliaries — their compound participle must show consistent gender
# in a table; verbecc mixes genders, so normalize the participle to masculine.
ETRE_AUX = {'fr': {'suis','es','est','sommes','êtes','sont'},
            'it': {'sono','sei','è','siamo','siete'}}
def masc_participle(word, vlang):
    if vlang == 'fr':
        for a,b in (('ées','és'),('ée','é'),('ues','us'),('ue','u'),('ies','is'),('ie','i')):
            if word.endswith(a): return word[:-len(a)]+b
    if vlang == 'it':
        for a,b in (('ate','ati'),('ata','ato'),('ute','uti'),('uta','uto'),('ite','iti'),('ita','ito')):
            if word.endswith(a): return word[:-len(a)]+b
    return word
# verbecc pt errors / orthography fixes: (inf, tid, pr) -> correct form
PT_FIX = {
    ('ir','presente','nós'): 'vamos',       # verbecc returns archaic 'imos'
    ('ver','presente','eles'): 'veem',      # 1990 orthographic agreement (was vêem)
}
def get_form(vlang, lemma, mood, vt, pr, code, tid):
    rows = vb._table_full(lemma, vlang)
    f = None
    for r in rows:
        if r['mood']==mood and r['tense']==vt and r['pr']==pr:
            f=r['form']; break
    if f is None: return None
    # drop verbecc's archaic alternate (e.g. "faccio/fo", "voglio/vò")
    if '/' in f: f = f.split('/')[0].strip()
    # normalize être/essere-aux compound participle to masculine for table consistency
    toks = f.split()
    if len(toks) >= 2 and toks[0].lower() in ETRE_AUX.get(vlang, set()):
        toks[1] = masc_participle(toks[1], vlang)
        f = ' '.join(toks)
    # pt -ar verbs: 1pl preterite is spelled -ámos in pt-PT, -amos in pt-BR
    if vlang=='pt' and tid=='pretPerfeito' and pr=='nós' and lemma.endswith('ar'):
        if code=='ptPt' and f.endswith('amos') and not f.endswith('ámos'): f = f[:-4]+'ámos'
        if code=='ptBr' and f.endswith('ámos'): f = f[:-4]+'amos'
    # targeted verbecc-pt corrections
    if vlang=='pt' and (lemma,tid,pr) in PT_FIX: f = PT_FIX[(lemma,tid,pr)]
    return f

def build(track, cfg):
    code = {'frForEn':'fr','frCaForEn':'frCa','itForEn':'it','ptBrForEn':'ptBr','ptPtForEn':'ptPt','esSpainForEn':'esSpain'}[track]
    persons_js = [dict(id=pid, **{cfg['tl']:tl}, en=en) for (pid,tl,en,pr) in cfg['P']]
    tenses_js=[]
    for (tid,ten,tt,wen,wt,vk) in cfg['T']:
        tenses_js.append(dict(id=tid,en=ten,**{cfg['tl']:tt},why=dict(en=wen,**{cfg['tl']:wt})))
    groups_js=[dict(id=gid,title=dict(en=ten,**{cfg['tl']:tt}),note=dict(en=nen,**{cfg['tl']:nt}))
               for (gid,ten,tt,nen,nt) in cfg['G']]
    verbs_js=[]; missing=[]
    for (inf,gen,gt,grp) in cfg['V']:
        forms={}
        for (tid,ten,tt,wen,wt,(mood,vt)) in cfg['T']:
            arr=[]
            for (pid,tl,en,pr) in cfg['P']:
                f=get_form(cfg['vlang'],inf,mood,vt,pr,code,tid)
                if f is None: missing.append((inf,tid,pid))
                arr.append(f or "?")
            forms[tid]=arr
        verbs_js.append(dict(inf=inf,gloss=dict(en=gen,**{cfg['tl']:gt}),group=grp,forms=forms))
    module=dict(trackId=cfg['trackId'],targetLang=cfg['tl'],nativeLang="en",
                intro=dict(en=cfg['intro'][0],**{cfg['tl']:cfg['intro'][1]}),
                persons=persons_js,tenses=tenses_js,groups=groups_js,verbs=verbs_js)
    return code, module, missing

def emit(track, cfg, module):
    def person_line(p): return "  "+js(p)+","
    lines=[f"// #90: Grammar gym content for {track} — generated (verbecc forms) +",
           "// authored framing. Same schema as data/grammar/esForEn.js; walled off from",
           "// the main tracker (own localStorage progress). AI-generated forms — FLAG for",
           "// native review before public.","",
           f"export const PERSONS = [\n"+"\n".join(person_line(p) for p in module['persons'])+"\n];","",
           f"export const TENSES = [\n"+"\n".join("  "+js(t)+"," for t in module['tenses'])+"\n];","",
           "const VERBS = ["]
    for v in module['verbs']:
        lines.append("  {")
        lines.append(f"    inf: {js(v['inf'])}, gloss: {js(v['gloss'])}, group: {js(v['group'])},")
        lines.append("    forms: {")
        for tid,arr in v['forms'].items():
            lines.append(f"      {tid}: {js(arr)},")
        lines.append("    },")
        lines.append("  },")
    lines.append("];")
    lines.append("")
    lines.append("export const GROUPS = [\n"+"\n".join("  "+js(g)+"," for g in module['groups'])+"\n];")
    lines.append("")
    lines.append(f"const {cfg['var']} = {{")
    lines.append(f"  trackId: {js(module['trackId'])},")
    lines.append(f"  targetLang: {js(module['targetLang'])},")
    lines.append(f"  nativeLang: {js(module['nativeLang'])},")
    lines.append(f"  intro: {js(module['intro'])},")
    lines.append("  persons: PERSONS,")
    lines.append("  tenses: TENSES,")
    lines.append("  groups: GROUPS,")
    lines.append("  verbs: VERBS,")
    lines.append("};")
    lines.append("")
    lines.append(f"export default {cfg['var']};")
    lines.append("")
    open(os.path.join(GRAMDIR, track+".js"),"w",encoding="utf-8").write("\n".join(lines))

if __name__=='__main__':
    allmiss={}
    only = sys.argv[1] if len(sys.argv)>1 else None
    for track,cfg in CFG.items():
        if only and track!=only: continue
        code,module,missing=build(track,cfg)
        emit(track,cfg,module)
        allmiss[track]=missing
        print(f"{track}: {len(module['verbs'])} verbs x {len(module['tenses'])} tenses x {len(module['persons'])} persons; missing={len(missing)}")
        if missing: print("   MISSING:",missing[:8])

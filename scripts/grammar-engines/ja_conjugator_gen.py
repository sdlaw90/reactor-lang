# -*- coding: utf-8 -*-
# USAGE (dev tool — second concrete "grammar engine"; see
# claude/squirrelingo_grammar_engines_plan.md and the Russian reference
# scripts/grammar-engines/ru_pymorphy3_gen.py):
#   pip install japanese-verb-conjugator-v2 --break-system-packages
#   1) write the existing ja gram prompts (slot 0 of each BANK.gram item in
#      data/tracks/jaForEn.js) to /tmp/ja_existing_prompts.json (JSON array, for dedup).
#   2) python scripts/grammar-engines/ja_conjugator_gen.py  ->  writes /tmp/ja_gen.js
#   3) splice /tmp/ja_gen.js into jaForEn.js BANK.gram (append AFTER the existing items).
# Deterministic (sorted/fixed iteration; no RNG) — same lexicon/templates => same output.
#
# SquirreLingo Japanese grammar-drill generator.
# Engine: japanese-verb-conjugator-v2 (verb inflection; library-verified forms).
# i-adjectives conjugated by the fully-regular rule table below; particles/copula are
# templated drills (per the engines plan — Japanese has no person/number agreement, so
# verb/i-adj morphology + particle templates are the drill surface).
# Generalizes the es-Spain/verbecc + Russian/pymorphy3 pipeline:
#   lexicon -> inflect(lemma,cell) -> carrier templates (base-form cue in 〔〕) ->
#   same-lemma confusable distractors -> mechanical bilingual distractorNotes + explain ->
#   CEFR band -> item. CJK rule: native script + romaji together (wapuro Hepburn, macron-free).
import json, sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from ja_romaji import romaji, is_kana
from japanese_verb_conjugator_v2 import (JapaneseVerbFormGenerator, VerbClass, Tense, Formality, Polarity)
g = JapaneseVerbFormGenerator()
G, I, R = VerbClass.GODAN, VerbClass.ICHIDAN, VerbClass.IRREGULAR

def opt(form):
    return f"{form} ({romaji(form)})"

# ---------------- verb lexicon (kana dict form, class, en, es) ----------------
VERBS = [
 ("かう",G,"to buy","comprar"),("いく",G,"to go","ir"),("のむ",G,"to drink","beber"),
 ("まつ",G,"to wait","esperar"),("はなす",G,"to speak","hablar"),("およぐ",G,"to swim","nadar"),
 ("よむ",G,"to read","leer"),("かく",G,"to write","escribir"),("きく",G,"to listen/ask","escuchar"),
 ("あそぶ",G,"to play","jugar"),("つくる",G,"to make","hacer"),("とる",G,"to take","tomar"),
 ("はしる",G,"to run","correr"),("かえる",G,"to return","volver"),("うたう",G,"to sing","cantar"),
 ("あるく",G,"to walk","caminar"),("のる",G,"to ride","subir(se)"),("うる",G,"to sell","vender"),
 ("しぬ",G,"to die","morir"),("もつ",G,"to hold","sostener"),("あらう",G,"to wash","lavar"),
 ("はたらく",G,"to work","trabajar"),("すわる",G,"to sit","sentarse"),("たつ",G,"to stand","ponerse de pie"),
 ("あう",G,"to meet","encontrarse"),("わかる",G,"to understand","entender"),("いそぐ",G,"to hurry","apresurarse"),
 ("けす",G,"to turn off","apagar"),("おくる",G,"to send","enviar"),("さがす",G,"to search","buscar"),
 ("たべる",I,"to eat","comer"),("みる",I,"to see","ver"),("ねる",I,"to sleep","dormir"),
 ("おきる",I,"to get up","levantarse"),("でる",I,"to leave/exit","salir"),("あける",I,"to open","abrir"),
 ("しめる",I,"to close","cerrar"),("おしえる",I,"to teach","enseñar"),("おぼえる",I,"to memorize","memorizar"),
 ("かんがえる",I,"to think","pensar"),("きる",I,"to wear","ponerse (ropa)"),("わすれる",I,"to forget","olvidar"),
 ("かりる",I,"to borrow","pedir prestado"),("つかれる",I,"to get tired","cansarse"),("いれる",I,"to put in","meter"),
 ("する",R,"to do","hacer"),("くる",R,"to come","venir"),
]

# ---------------- verb form cells ----------------
def caus_pass(v,c):
    caus = g.generate_causative_form(v,c,Formality.PLAIN,Polarity.POSITIVE)
    if not caus.endswith("る"): return None
    return g.generate_passive_form(caus, VerbClass.ICHIDAN, Formality.PLAIN, Polarity.POSITIVE)

FORM = {
 'masu':        lambda v,c:g.generate_polite_form(v,c,Tense.NONPAST,Polarity.POSITIVE),
 'mashita':     lambda v,c:g.generate_polite_form(v,c,Tense.PAST,Polarity.POSITIVE),
 'masen':       lambda v,c:g.generate_polite_form(v,c,Tense.NONPAST,Polarity.NEGATIVE),
 'masendeshita':lambda v,c:g.generate_polite_form(v,c,Tense.PAST,Polarity.NEGATIVE),
 'ta':          lambda v,c:g.generate_plain_form(v,c,Tense.PAST,Polarity.POSITIVE),
 'nai':         lambda v,c:g.generate_plain_form(v,c,Tense.NONPAST,Polarity.NEGATIVE),
 'nakatta':     lambda v,c:g.generate_plain_form(v,c,Tense.PAST,Polarity.NEGATIVE),
 'te':          lambda v,c:g.generate_te_form(v,c,Formality.PLAIN,Polarity.POSITIVE),
 'potential':   lambda v,c:g.generate_potential_form(v,c,Formality.PLAIN,Polarity.POSITIVE),
 'passive':     lambda v,c:g.generate_passive_form(v,c,Formality.PLAIN,Polarity.POSITIVE),
 'causative':   lambda v,c:g.generate_causative_form(v,c,Formality.PLAIN,Polarity.POSITIVE),
 'volitional':  lambda v,c:g.generate_volitional_form(v,c,Formality.PLAIN,Polarity.POSITIVE),
 'mashou':      lambda v,c:g.generate_volitional_form(v,c,Formality.POLITE,Polarity.POSITIVE),
 'ba':          lambda v,c:g.generate_provisional_form(v,c,Formality.PLAIN,Polarity.POSITIVE),
 'tara':        lambda v,c:g.generate_conditional_form(v,c,Formality.PLAIN,Polarity.POSITIVE),
 'imperative':  lambda v,c:g.generate_imperative_form(v,c,Formality.PLAIN,Polarity.POSITIVE),
 'prohibitive': lambda v,c:g.generate_imperative_form(v,c,Formality.PLAIN,Polarity.NEGATIVE),
 'causpass':    caus_pass,
}
def form(cell, v, c):
    try:
        f = FORM[cell](v,c)
    except Exception:
        return None
    if not f or not is_kana(f): return None
    return f

# label for distractorNotes: what this form IS
CELL_LABEL = {
 'masu':        ("the polite present (-masu) form","la forma cortés presente (-masu)"),
 'mashita':     ("the polite past (-mashita) form","la forma cortés pasada (-mashita)"),
 'masen':       ("the polite negative (-masen) form","la forma cortés negativa (-masen)"),
 'masendeshita':("the polite past-negative (-masen deshita) form","la forma cortés pasada negativa (-masen deshita)"),
 'ta':          ("the plain past (-ta) form","la forma llana pasada (-ta)"),
 'nai':         ("the plain negative (-nai) form","la forma llana negativa (-nai)"),
 'nakatta':     ("the plain past-negative (-nakatta) form","la forma llana pasada negativa (-nakatta)"),
 'te':          ("the te-form","la forma-te"),
 'potential':   ("the potential (can-do) form","la forma potencial (poder)"),
 'passive':     ("the passive form","la forma pasiva"),
 'causative':   ("the causative (make/let do) form","la forma causativa (hacer/dejar)"),
 'volitional':  ("the plain volitional (let's) form","la forma volitiva llana (vamos a)"),
 'mashou':      ("the polite volitional (-mashou) form","la forma volitiva cortés (-mashou)"),
 'ba':          ("the -ba conditional form","la forma condicional -ba"),
 'tara':        ("the -tara conditional form","la forma condicional -tara"),
 'imperative':  ("the plain imperative (command) form","la forma imperativa llana (orden)"),
 'prohibitive': ("the prohibitive (don't) form","la forma prohibitiva (no hagas)"),
 'causpass':    ("the causative-passive (made to do) form","la forma causativa-pasiva (obligado a)"),
 'dict':        ("the dictionary (plain present) form","la forma de diccionario (presente llano)"),
}

# per-cell drill spec: (cefr, carrier_ja, carrier_ro, prompt_en, rule_en, rule_es, [distractor cells], verbfilter, cap)
CELLS = [
 ('masu',"A1","わたしは まいにち ___。","Watashi wa mainichi ___.",
   "I ___ every day. (polite present)",
   "The polite present ends in -masu","El presente cortés termina en -masu",
   ['ta','masen','nai'],'all',16),
 ('mashita',"A1","きのう、わたしは ___。","Kinou, watashi wa ___.",
   "Yesterday I ___. (polite past)",
   "The polite past ends in -mashita","El pasado cortés termina en -mashita",
   ['masu','masen','ta'],'all',16),
 ('masen',"A2","いいえ、あまり ___。","Iie, amari ___.",
   "No, I don't ___ much. (polite negative)",
   "The polite negative ends in -masen","El negativo cortés termina en -masen",
   ['masu','mashita','nai'],'all',14),
 ('ta',"A2","あ、もう ___！","A, mou ___!",
   "Oh, I already ___! (plain past)",
   "The plain past is the -ta form","El pasado llano es la forma -ta",
   ['masu','nai','te'],'all',16),
 ('nai',"A2","わたしは ぜんぜん ___。","Watashi wa zenzen ___.",
   "I don't ___ at all. (plain negative)",
   "The plain negative is the -nai form","El negativo llano es la forma -nai",
   ['masen','ta','masu'],'all',14),
 ('te',"A2","すみません、ちょっと ___ ください。","Sumimasen, chotto ___ kudasai.",
   "Excuse me, please ___. (te-form + kudasai)",
   "A polite request uses the te-form + ください","Una petición cortés usa la forma-te + kudasai",
   ['masu','ta','nai'],'all',16),
 ('masendeshita',"B1","せんしゅうは ぜんぜん ___。","Senshuu wa zenzen ___.",
   "Last week I didn't ___ at all. (polite past-negative)",
   "The polite past-negative is -masen deshita","El pasado negativo cortés es -masen deshita",
   ['masen','nakatta','mashita'],'all',12),
 ('nakatta',"B1","そのとき、まだ ___。","Sono toki, mada ___.",
   "At that time I still hadn't ___. (plain past-negative)",
   "The plain past-negative is the -nakatta form","El pasado negativo llano es la forma -nakatta",
   ['nai','ta','masendeshita'],'all',12),
 ('mashou',"B1","いっしょに ___。","Issho ni ___.",
   "Let's ___ together. (polite volitional)",
   "A polite suggestion ('let's…') is the -mashou form","Una sugerencia cortés ('vamos a…') es la forma -mashou",
   ['masu','masen','volitional'],'all',14),
 ('tara',"B1","___、すぐ でかけます。","___, sugu dekakemasu.",
   "Once I ___, I'll head out. (-tara conditional)",
   "'Once/when X, then Y' uses the -tara conditional","'Cuando X, entonces Y' usa el condicional -tara",
   ['ta','te','ba'],'all',14),
 ('potential',"B2","がんばれば、わたしにも ___。","Ganbareba, watashi ni mo ___.",
   "If I try, I too can ___. (potential)",
   "'Can do' is the potential form","'Poder hacer' es la forma potencial",
   ['dict','masu','passive'],'godan',16),
 ('volitional',"B2","よし、___！","Yoshi, ___!",
   "Alright, let's ___! (plain volitional)",
   "The plain volitional ('let's…') ends in -ou/-you","La volitiva llana ('vamos a…') termina en -ou/-you",
   ['dict','mashou','ta'],'all',12),
 ('ba',"B2","もし ___、たすかります。","Moshi ___, tasukarimasu.",
   "If (you) ___, it'd help. (-ba conditional)",
   "The hypothetical conditional is the -ba form","El condicional hipotético es la forma -ba",
   ['tara','ta','dict'],'all',14),
 ('passive',"C1","わたしは せんせいに ___。","Watashi wa sensei ni ___.",
   "I was ___ by the teacher. (passive)",
   "The passive ('was done to') is the -reru/-rareru form","La pasiva ('fue hecho a') es la forma -reru/-rareru",
   ['causative','dict','masu'],'godan',14),
 ('causative',"C1","せんせいは がくせいを ___。","Sensei wa gakusei wo ___.",
   "The teacher makes the students ___. (causative)",
   "The causative ('make/let do') is the -seru/-saseru form","La causativa ('hacer/dejar') es la forma -seru/-saseru",
   ['passive','dict','potential'],'godan',14),
 ('imperative',"C1","はやく ___！","Hayaku ___!",
   "___ quickly! (blunt command)",
   "A blunt command is the plain imperative","Una orden tajante es el imperativo llano",
   ['dict','ta','te'],'all',12),
 ('causpass',"C2","わたしは せんせいに いつも ___。","Watashi wa sensei ni itsumo ___.",
   "I'm always made to ___ by the teacher. (causative-passive)",
   "'Be made to do' is the causative-passive form","'Ser obligado a hacer' es la forma causativa-pasiva",
   ['causative','passive','dict'],'godan',12),
 ('prohibitive',"C2","ここで ___！","Koko de ___!",
   "Don't ___ here! (prohibitive)",
   "'Don't do' is the plain prohibitive (dict + na)","'No hagas' es el prohibitivo llano (dicc + na)",
   ['imperative','nai','dict'],'all',10),
]

ITEMS=[]
def add(prompt, options, ex_en, ex_es, level, prompt_en, wn_en, wn_es, dn):
    ITEMS.append(dict(p=prompt,o=options,ex_en=ex_en,ex_es=ex_es,lvl=level,pen=prompt_en,
                      wn_en=wn_en,wn_es=wn_es,dn=dn))

def distinct(correct, cands):
    seen={correct}; out=[]
    for d in cands:
        if d and d not in seen:
            out.append(d); seen.add(d)
        if len(out)==3: break
    return out

def dict_form(v,c):  # plain present (dictionary) — for distractors
    return v if is_kana(v) else None

for cell,cefr,cja,cro,pen,ren,res,distr,vfilter,cap in CELLS:
    cnt=0
    for kana,c,en,es in VERBS:
        if vfilter=='godan' and c!=G:   # keep potential/passive distinct (ichidan potential==passive)
            continue
        correct = form(cell,kana,c)
        if not correct: continue
        # distractor forms
        cand_forms=[]
        cand_cells=[]
        for dc in distr:
            f = kana if dc=='dict' else form(dc,kana,c)
            if f:
                cand_forms.append(f); cand_cells.append(dc)
        ds = distinct(correct, cand_forms)
        if len(ds)<3: continue
        options=[opt(correct)]+[opt(x) for x in ds]
        # distractorNotes keyed by option TEXT
        dn={}
        for f in ds:
            # find which cell produced f
            lab=None
            for cf,cc in zip(cand_forms,cand_cells):
                if cf==f: lab=CELL_LABEL[cc]; break
            if lab: dn[opt(f)]={"en":lab[0],"es":lab[1]}
        base=f"{kana} ({romaji(kana)})"
        prompt=f"{cja}({cro}) — 〔{base}〕"
        cr=romaji(correct)
        ex_en=f"{ren}: '{kana}' ({en}) → '{correct}' ({cr})."
        ex_es=f"{res}: '{kana}' ({es}) → '{correct}' ({cr})."
        add(prompt,options,ex_en,ex_es,cefr,{"en":pen},ren+".",res+".",dn)
        cnt+=1
        if cnt>=cap: break

print(f"verb items (pre-dedup): {len(ITEMS)}", file=sys.stderr)
VERB_ITEM_COUNT=len(ITEMS)

# ---------------- i-adjective rule engine ----------------
# fully regular: stem = adj without final い. いい/よい is irregular (stem よ).
IADJ=[
 ("たかい","high/expensive","alto/caro"),("やすい","cheap","barato"),("おおきい","big","grande"),
 ("ちいさい","small","pequeño"),("あたらしい","new","nuevo"),("ふるい","old","viejo"),
 ("おいしい","tasty","rico"),("たのしい","fun","divertido"),("むずかしい","difficult","difícil"),
 ("やさしい","easy/kind","fácil/amable"),("さむい","cold","frío"),("あつい","hot","caluroso"),
 ("おもしろい","interesting","interesante"),("いそがしい","busy","ocupado"),("はやい","fast/early","rápido/temprano"),
 ("おそい","slow/late","lento/tarde"),("ちかい","near","cercano"),("とおい","far","lejano"),
 ("あかい","red","rojo"),("しろい","white","blanco"),("ながい","long","largo"),
 ("みじかい","short","corto"),("うれしい","happy","contento"),("かなしい","sad","triste"),
 ("さびしい","lonely","solitario"),("あぶない","dangerous","peligroso"),("いい","good","bueno"),
]
def iadj(stem_form, adj):
    irr = (adj=="いい")
    stem = "よ" if irr else adj[:-1]
    return {
     'dict': ("よい" if irr else adj),  # note: いい dict is いい, but plain-form base is よ
     'past': stem+"かった",
     'neg':  stem+"くない",
     'pastneg': stem+"くなかった",
     'te':   stem+"くて",
     'adv':  stem+"く",
    }[stem_form]
IADJ_LABEL={
 'dict':("the plain form (dictionary -i form)","la forma llana (diccionario -i)"),
 'past':("the past (-katta) form","la forma pasada (-katta)"),
 'neg':("the negative (-kunai) form","la forma negativa (-kunai)"),
 'pastneg':("the past-negative (-kunakatta) form","la forma pasada negativa (-kunakatta)"),
 'te':("the te-form (-kute)","la forma-te (-kute)"),
 'adv':("the adverb (-ku) form","la forma adverbial (-ku)"),
}
IADJ_CELLS=[
 ('past',"A2","えいがは ___。","Eiga wa ___.","The movie was ___. (i-adjective past)",
   "An i-adjective's past replaces -i with -katta","El pasado del adjetivo-i cambia -i por -katta",
   ['neg','te','adv'],20),
 ('neg',"A2","この ほんは ___。","Kono hon wa ___.","This book isn't ___. (i-adjective negative)",
   "An i-adjective's negative replaces -i with -kunai","El negativo del adjetivo-i cambia -i por -kunai",
   ['past','adv','te'],18),
 ('te',"B1","この みせは ___、しずかです。","Kono mise wa ___, shizuka desu.",
   "This shop is ___ and quiet. (i-adjective te-form)",
   "To link, an i-adjective takes -kute","Para enlazar, el adjetivo-i toma -kute",
   ['adv','past','neg'],16),
 ('adv',"B1","もっと ___ はなして ください。","Motto ___ hanashite kudasai.",
   "Please speak more ___. (i-adjective → adverb)",
   "An i-adjective becomes an adverb by replacing -i with -ku","El adjetivo-i se hace adverbio cambiando -i por -ku",
   ['te','neg','past'],14),
 ('pastneg',"B1","テストは ___。","Tesuto wa ___.","The test wasn't ___. (i-adjective past-negative)",
   "An i-adjective's past-negative is -kunakatta","El pasado negativo del adjetivo-i es -kunakatta",
   ['neg','past','adv'],16),
]
before=len(ITEMS)
for cell,cefr,cja,cro,pen,ren,res,distr,cap in IADJ_CELLS:
    cnt=0
    for adj,en,es in IADJ:
        correct=iadj(cell,adj)
        cand=[iadj(dc,adj) for dc in distr]
        ds=distinct(correct,cand)
        if len(ds)<3: continue
        options=[opt(correct)]+[opt(x) for x in ds]
        dn={}
        for f in ds:
            lab=None
            for dc in distr:
                if iadj(dc,adj)==f: lab=IADJ_LABEL[dc]; break
            if lab: dn[opt(f)]={"en":lab[0],"es":lab[1]}
        base=f"{adj} ({romaji(adj)})"
        prompt=f"{cja}({cro}) — 〔{base}〕"
        cr=romaji(correct)
        ex_en=f"{ren}: '{adj}' ({en}) → '{correct}' ({cr})."
        ex_es=f"{res}: '{adj}' ({es}) → '{correct}' ({cr})."
        add(prompt,options,ex_en,ex_es,cefr,{"en":pen},ren+".",res+".",dn)
        cnt+=1
        if cnt>=cap: break
print(f"i-adj items: {len(ITEMS)-before}", file=sys.stderr)

# ---------------- particle templated drills (authored; native script + romaji) ----------------
# each: (level, ja_with___, ro_with___, [4 particle options (correct first)], prompt_en, explain_en, explain_es, {distractorNotes})
def P(text): return text
PARTICLES=[
 ("A1","わたし___ がくせいです。","Watashi ___ gakusei desu.",
   ["は (wa)","が (ga)","を (wo)","に (ni)"],"I am a student. (topic particle)",
   "'は' marks the topic ('as for me…').","'は' marca el tema ('en cuanto a mí…').",
   {"が (ga)":("marks the subject / new information","marca el sujeto / información nueva"),
    "を (wo)":("marks the direct object","marca el objeto directo"),
    "に (ni)":("marks a destination or time","marca destino o tiempo")}),
 ("A1","りんご___ たべます。","Ringo ___ tabemasu.",
   ["を (wo)","は (wa)","が (ga)","で (de)"],"I eat an apple. (object particle)",
   "'を' marks the direct object — the thing eaten.","'を' marca el objeto directo — lo que se come.",
   {"は (wa)":("marks the topic","marca el tema"),
    "が (ga)":("marks the subject","marca el sujeto"),
    "で (de)":("marks the place or means of an action","marca el lugar o medio de una acción")}),
 ("A1","がっこう___ いきます。","Gakkou ___ ikimasu.",
   ["に (ni)","を (wo)","で (de)","と (to)"],"I go to school. (destination particle)",
   "'に' marks the destination of movement ('to').","'に' marca el destino del movimiento ('a').",
   {"を (wo)":("marks the direct object","marca el objeto directo"),
    "で (de)":("marks where an action happens","marca dónde ocurre una acción"),
    "と (to)":("means 'with' / 'and'","significa 'con' / 'y'")}),
 ("A1","としょかん___ べんきょうします。","Toshokan ___ benkyou shimasu.",
   ["で (de)","に (ni)","を (wo)","へ (e)"],"I study at the library. (place-of-action particle)",
   "'で' marks where an action takes place.","'で' marca dónde se realiza una acción.",
   {"に (ni)":("marks a destination or existence location","marca destino o ubicación de existencia"),
    "を (wo)":("marks the direct object","marca el objeto directo"),
    "へ (e)":("marks direction ('toward')","marca dirección ('hacia')")}),
 ("A2","ともだち___ はなします。","Tomodachi ___ hanashimasu.",
   ["と (to)","を (wo)","に (ni)","で (de)"],"I talk with a friend. ('with' particle)",
   "'と' means 'with' (doing something together).","'と' significa 'con' (hacer algo juntos).",
   {"を (wo)":("marks the direct object","marca el objeto directo"),
    "に (ni)":("marks a destination or recipient","marca destino o destinatario"),
    "で (de)":("marks place or means","marca lugar o medio")}),
 ("A2","でんしゃ___ いきます。","Densha ___ ikimasu.",
   ["で (de)","に (ni)","を (wo)","と (to)"],"I go by train. (means particle)",
   "'で' also marks the means/tool ('by train').","'で' también marca el medio ('en tren').",
   {"に (ni)":("marks a destination","marca destino"),
    "を (wo)":("marks the direct object","marca el objeto directo"),
    "と (to)":("means 'with'","significa 'con'")}),
 ("A2","あさ しちじ___ おきます。","Asa shichi-ji ___ okimasu.",
   ["に (ni)","で (de)","を (wo)","が (ga)"],"I get up at 7 a.m. (time particle)",
   "'に' marks a specific clock time ('at 7').","'に' marca una hora concreta ('a las 7').",
   {"で (de)":("marks place or means","marca lugar o medio"),
    "を (wo)":("marks the direct object","marca el objeto directo"),
    "が (ga)":("marks the subject","marca el sujeto")}),
 ("A2","これは わたし___ ほんです。","Kore wa watashi ___ hon desu.",
   ["の (no)","を (wo)","は (wa)","に (ni)"],"This is my book. (possessive particle)",
   "'の' links nouns, marking possession ('my').","'の' une sustantivos, marcando posesión ('mi').",
   {"を (wo)":("marks the direct object","marca el objeto directo"),
    "は (wa)":("marks the topic","marca el tema"),
    "に (ni)":("marks destination or time","marca destino o tiempo")}),
 ("A2","うち___ かえります。","Uchi ___ kaerimasu.",
   ["へ (e)","を (wo)","で (de)","が (ga)"],"I return home. (direction particle)",
   "'へ' marks direction toward ('homeward'); written へ, said 'e'.","'へ' marca dirección hacia; se escribe へ, se dice 'e'.",
   {"を (wo)":("marks the direct object","marca el objeto directo"),
    "で (de)":("marks place or means","marca lugar o medio"),
    "が (ga)":("marks the subject","marca el sujeto")}),
 ("A2","ここ___ えきまで あるきます。","Koko ___ eki made arukimasu.",
   ["から (kara)","まで (made)","で (de)","に (ni)"],"I walk from here to the station. ('from' particle)",
   "'から' marks the starting point ('from').","'から' marca el punto de partida ('desde').",
   {"まで (made)":("marks the end point ('until/to')","marca el punto final ('hasta')"),
    "で (de)":("marks place or means","marca lugar o medio"),
    "に (ni)":("marks destination or time","marca destino o tiempo")}),
 ("B1","くじ___ はたらきます。","Ku-ji ___ hatarakimasu.",
   ["まで (made)","から (kara)","に (ni)","を (wo)"],"I work until 9. ('until' particle)",
   "'まで' marks the limit/end point ('until').","'まで' marca el límite/punto final ('hasta').",
   {"から (kara)":("marks the starting point ('from')","marca el punto de partida ('desde')"),
    "に (ni)":("marks destination or time","marca destino o tiempo"),
    "を (wo)":("marks the direct object","marca el objeto directo")}),
 ("B1","わたし___ いきます。","Watashi ___ ikimasu.",
   ["も (mo)","は (wa)","が (ga)","を (wo)"],"I'll go too. ('also' particle)",
   "'も' means 'also/too', replacing は or が.","'も' significa 'también', reemplazando は o が.",
   {"は (wa)":("marks the topic (not 'also')","marca el tema (no 'también')"),
    "が (ga)":("marks the subject","marca el sujeto"),
    "を (wo)":("marks the direct object","marca el objeto directo")}),
 ("B1","パン___ たまごを かいます。","Pan ___ tamago wo kaimasu.",
   ["と (to)","や (ya)","も (mo)","の (no)"],"I buy bread and eggs. ('and', exhaustive)",
   "'と' joins nouns as a complete list ('A and B').","'と' une sustantivos en lista completa ('A y B').",
   {"や (ya)":("joins nouns as a partial list ('among others')","une sustantivos en lista parcial ('entre otros')"),
    "も (mo)":("means 'also/too'","significa 'también'"),
    "の (no)":("links nouns (possession)","une sustantivos (posesión)")}),
 ("B1","にほんご___ できます。","Nihongo ___ dekimasu.",
   ["が (ga)","を (wo)","に (ni)","で (de)"],"I can speak Japanese. (が with できる)",
   "Ability verbs like 'できる' take が, not を, for their object.","Verbos de capacidad como 'できる' toman が, no を.",
   {"を (wo)":("marks a direct object (wrong with できる)","marca objeto directo (incorrecto con できる)"),
    "に (ni)":("marks destination or time","marca destino o tiempo"),
    "で (de)":("marks place or means","marca lugar o medio")}),
 ("B1","あめ___ ふって います。","Ame ___ futte imasu.",
   ["が (ga)","は (wa)","を (wo)","に (ni)"],"It's raining. (が for new-info subject)",
   "New-information subjects (weather, existence) take が.","Sujetos de información nueva (clima, existencia) toman が.",
   {"は (wa)":("marks a known/contrasted topic","marca tema conocido/contrastado"),
    "を (wo)":("marks the direct object","marca el objeto directo"),
    "に (ni)":("marks destination or time","marca destino o tiempo")}),
 ("B2","びょうき___、がっこうを やすみました。","Byouki ___, gakkou wo yasumimashita.",
   ["で (de)","に (ni)","が (ga)","を (wo)"],"I missed school due to illness. ('due to' で)",
   "'で' can mark a cause/reason ('because of illness').","'で' puede marcar causa/razón ('por enfermedad').",
   {"に (ni)":("marks destination or time","marca destino o tiempo"),
    "が (ga)":("marks the subject","marca el sujeto"),
    "を (wo)":("marks the direct object","marca el objeto directo")}),
]
before=len(ITEMS)
for lvl,ja,ro,options,pen,ex_en,ex_es,dn in PARTICLES:
    prompt=f"{ja}({ro})"
    add(prompt,options,ex_en,ex_es,lvl,{"en":pen},ex_en,ex_es,
        {k:{"en":v[0],"es":v[1]} for k,v in dn.items()})
print(f"particle items: {len(ITEMS)-before}", file=sys.stderr)

# ---------------- copula / na-adjective templated drills ----------------
COPULA=[
 ("A1","かれは せんせい___。","Kare wa sensei ___.",
   ["です (desu)","ます (masu)","した (shita)","ない (nai)"],"He is a teacher. (polite copula)",
   "'です' is the polite copula ('is/am/are') after a noun.","'です' es la cópula cortés ('ser') tras un sustantivo.",
   {"ます (masu)":("a polite verb ending, not used on a noun","terminación verbal cortés, no sobre sustantivo"),
    "した (shita)":("the past of する ('did')","el pasado de する ('hizo')"),
    "ない (nai)":("a plain negative verb ending","terminación verbal negativa llana")}),
 ("A2","きのうは やすみ___。","Kinou wa yasumi ___.",
   ["でした (deshita)","です (desu)","だった (datta)","じゃない (ja nai)"],"Yesterday was a day off. (past polite copula)",
   "'でした' is the polite past copula ('was').","'でした' es la cópula cortés pasada ('era/fue').",
   {"です (desu)":("the non-past polite copula ('is')","la cópula cortés no-pasada ('es')"),
    "だった (datta)":("the plain past copula ('was')","la cópula llana pasada ('era')"),
    "じゃない (ja nai)":("the negative copula ('isn't')","la cópula negativa ('no es')")}),
 ("A2","これは ほん___ ありません。","Kore wa hon ___ arimasen.",
   ["じゃ (ja)","は (wa)","で (de)","に (ni)"],"This isn't a book. (negative copula じゃありません)",
   "The polite negative copula is 'じゃありません' (じゃ + ありません).","La cópula negativa cortés es 'じゃありません'.",
   {"は (wa)":("the topic particle","la partícula de tema"),
    "で (de)":("the te-form of です / place particle","la forma-te de です / partícula de lugar"),
    "に (ni)":("destination/time particle","partícula de destino/tiempo")}),
 ("A2","へや___ きれいです。","Heya ___ kirei desu.",
   ["は (wa)","な (na)","の (no)","だ (da)"],"The room is clean. (na-adjective predicate)",
   "A na-adjective before です needs no な: 'きれいです'.","Un adjetivo-na ante です no lleva な: 'きれいです'.",
   {"な (na)":("na is only needed when the adjective modifies a following noun","な solo se necesita ante un sustantivo"),
    "の (no)":("links nouns (possession)","une sustantivos (posesión)"),
    "だ (da)":("the plain copula (not before です)","la cópula llana (no ante です)")}),
 ("B1","かれは ゆうめい___ ひとです。","Kare wa yuumei ___ hito desu.",
   ["な (na)","の (no)","い (i)","だ (da)"],"He is a famous person. (na-adjective + noun)",
   "A na-adjective takes な when it modifies a noun: 'ゆうめいな ひと'.","Un adjetivo-na toma な ante un sustantivo: 'ゆうめいな ひと'.",
   {"の (no)":("links two nouns, not adjective+noun","une dos sustantivos, no adjetivo+sustantivo"),
    "い (i)":("the ending of i-adjectives, not na-adjectives","la terminación de adjetivos-i, no na"),
    "だ (da)":("the plain copula","la cópula llana")}),
 ("B1","がくせい___ とき、よく べんきょうしました。","Gakusei ___ toki, yoku benkyou shimashita.",
   ["の (no)","な (na)","だ (da)","で (de)"],"When I was a student, I studied a lot. (noun + の + とき)",
   "A noun before とき links with の: 'がくせいのとき'.","Un sustantivo ante とき enlaza con の: 'がくせいのとき'.",
   {"な (na)":("な links na-adjectives, not plain nouns, to とき","な enlaza adjetivos-na, no sustantivos"),
    "だ (da)":("the plain copula (dropped before とき)","la cópula llana (se omite ante とき)"),
    "で (de)":("place/means particle","partícula de lugar/medio")}),
]
before=len(ITEMS)
for lvl,ja,ro,options,pen,ex_en,ex_es,dn in COPULA:
    prompt=f"{ja}({ro})"
    add(prompt,options,ex_en,ex_es,lvl,{"en":pen},ex_en,ex_es,
        {k:{"en":v[0],"es":v[1]} for k,v in dn.items()})
print(f"copula/na items: {len(ITEMS)-before}", file=sys.stderr)

# ---------------- dedup vs existing + within batch ----------------
import re
def norm(s):
    s=s.lower()
    s=re.sub(r"[^\w぀-ヿ一-鿿]"," ",s)
    return re.sub(r"\s+"," ",s).strip()
existing=set()
with open("/tmp/ja_existing_prompts.json") as f:
    for pr in json.load(f): existing.add(norm(pr))
seen=set(); final=[]
for it in ITEMS:
    k=norm(it["p"])
    if k in existing or k in seen: continue
    if len(set(it["o"]))!=4 or any(not x.strip() for x in it["o"]): continue
    seen.add(k); final.append(it)
from collections import Counter
print(f"after dedup+distinct: {len(final)}", file=sys.stderr)
print("levels:", dict(Counter(x['lvl'] for x in final)), file=sys.stderr)

# ---------------- emit JS ----------------
def js(s): return json.dumps(s, ensure_ascii=False)
lines=["// Japanese gram — engine-generated (japanese-verb-conjugator-v2 for verbs;",
       "// regular rule-table for i-adjectives; templated particle/copula drills).",
       "// correctIdx 0; slot5 null; slot6 promptNative{en}; slot7 wrongNote+distractorNotes.",
       "// Native script + wapuro-Hepburn romaji together (macron-free). PENDING native review.",
       "export default ["]
for it in final:
    slot7={"wrongNote":{"en":it["wn_en"],"es":it["wn_es"]}}
    if it["dn"]: slot7["distractorNotes"]=it["dn"]
    row=[it["p"], it["o"], 0, {"en":it["ex_en"],"es":it["ex_es"]},
         it["lvl"], None, it["pen"], slot7]
    lines.append("    "+json.dumps(row, ensure_ascii=False)+",")
lines.append("];")
open("/tmp/ja_gen.js","w").write("\n".join(lines))
print("wrote /tmp/ja_gen.js", file=sys.stderr)

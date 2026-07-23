# -*- coding: utf-8 -*-
# USAGE (dev tool — first concrete "grammar engine"; see docs/squirrelingo-language-wishlist.md
# and claude/squirrelingo_grammar_engines_plan.md):
#   pip install pymorphy3
#   1) write the existing ru gram prompts (slot 0 of each BANK.gram item in
#      data/tracks/ruForEn.js) to /tmp/ru_existing_prompts.json  (JSON array, for dedup).
#   2) python scripts/grammar-engines/ru_pymorphy3_gen.py   ->  writes /tmp/ru_gen.js
#   3) splice /tmp/ru_gen.js into ruForEn.js BANK.gram (append after the existing items).
# /tmp paths are scratch on purpose: generation is offline and the output is validated +
# reviewed before splicing. Deterministic (no RNG) — same lexicon/templates => same output.
#
# SquirreLingo Russian grammar-drill generator.
# Engine: pymorphy3 (inflection). Generalizes the es-Spain/verbecc pipeline:
#   lexicon -> inflect(lemma,features) -> carrier templates -> confusable same-paradigm
#   distractors -> mechanical bilingual distractorNotes + explain -> CEFR level -> item.
# Deterministic (sorted iteration; no RNG). Output = JS array of 7/8-slot items.
import json, sys
import pymorphy3
M = pymorphy3.MorphAnalyzer()

def parse_pos(lemma, pos):
    for p in M.parse(lemma):
        if p.tag.POS == pos and p.normal_form == lemma:
            return p
    for p in M.parse(lemma):
        if p.tag.POS == pos:
            return p
    return None

def inflect(lemma, pos, feats):
    p = parse_pos(lemma, pos)
    if not p: return None
    if list(feats) == ['infn']:
        return p.normal_form
    f = p.inflect(set(feats))
    return f.word if f else None

# ---------- case label maps ----------
CASE_LABEL = {
 'nomn':("the nominative form","la forma nominativa"),
 'gent':("the genitive form","la forma genitiva"),
 'datv':("the dative form","la forma dativa"),
 'accs':("the accusative form","la forma acusativa"),
 'ablt':("the instrumental form","la forma instrumental"),
 'loct':("the prepositional form","la forma prepositiva"),
}
CASE_NAME = {'nomn':('nominative','nominativo'),'gent':('genitive','genitivo'),
 'datv':('dative','dativo'),'accs':('accusative','acusativo'),
 'ablt':('instrumental','instrumental'),'loct':('prepositional','prepositivo')}

VERB_LABEL = {
 ('pres','sing','1per'):("the я (I) form","la forma yo (я)"),
 ('pres','sing','2per'):("the ты (you) form","la forma tú (ты)"),
 ('pres','sing','3per'):("the он/она (he/she) form","la forma él/ella (он/она)"),
 ('pres','plur','3per'):("the они (they) form","la forma ellos (они)"),
 ('futr','sing','1per'):("the я (I) future form","la forma futura yo (я)"),
 ('futr','sing','2per'):("the ты (you) future form","la forma futura tú (ты)"),
 ('futr','sing','3per'):("the он/она future form","la forma futura él/ella"),
 ('futr','plur','3per'):("the они future form","la forma futura ellos (они)"),
 ('past','masc','sing'):("the past masculine form","la forma pasada masculina"),
 ('past','femn','sing'):("the past feminine form","la forma pasada femenina"),
 ('past','neut','sing'):("the past neuter form","la forma pasada neutra"),
 ('past','plur'):("the past plural form","la forma pasada plural"),
 ('infn',):("the infinitive","el infinitivo"),
 ('impr','sing'):("the imperative","el imperativo"),
}
ADJ_LABEL = {
 'masc':("the masculine form","la forma masculina"),
 'femn':("the feminine form","la forma femenina"),
 'neut':("the neuter form","la forma neutra"),
 'plur':("the plural form","la forma plural"),
}

# ---------- lexicon ----------
# noun: (lemma, en, es, flags-set)   flags: person animal place country thing abstract
NOUNS = [
 ("книга","book","libro",{"thing"}),
 ("машина","car","coche",{"thing"}),
 ("стол","table","mesa",{"thing"}),
 ("дом","house","casa",{"thing","place"}),
 ("город","city","ciudad",{"place"}),
 ("страна","country","país",{"place"}),
 ("работа","work","trabajo",{"abstract","place"}),
 ("школа","school","escuela",{"place"}),
 ("музыка","music","música",{"abstract"}),
 ("вода","water","agua",{"thing"}),
 ("время","time","tiempo",{"abstract"}),
 ("друг","friend","amigo",{"person"}),
 ("брат","brother","hermano",{"person"}),
 ("сестра","sister","hermana",{"person"}),
 ("мама","mom","mamá",{"person"}),
 ("отец","father","padre",{"person"}),
 ("сын","son","hijo",{"person"}),
 ("дочь","daughter","hija",{"person"}),
 ("учитель","teacher","profesor",{"person"}),
 ("студент","student","estudiante",{"person"}),
 ("врач","doctor","médico",{"person"}),
 ("собака","dog","perro",{"animal"}),
 ("кошка","cat","gato",{"animal"}),
 ("окно","window","ventana",{"thing"}),
 ("письмо","letter","carta",{"thing"}),
 ("телефон","phone","teléfono",{"thing"}),
 ("чай","tea","té",{"thing"}),
 ("кофе_skip","","",set()),  # indeclinable — excluded intentionally
 ("газета","newspaper","periódico",{"thing"}),
 ("ручка","pen","bolígrafo",{"thing"}),
 ("хлеб","bread","pan",{"thing"}),
 ("молоко","milk","leche",{"thing"}),
 ("яблоко","apple","manzana",{"thing"}),
 ("собрание","meeting","reunión",{"abstract"}),
 ("фильм","film","película",{"thing"}),
 ("книга2_skip","","",set()),
 ("парк","park","parque",{"place"}),
 ("магазин","shop","tienda",{"place"}),
 ("река","river","río",{"place","thing"}),
 ("улица","street","calle",{"place"}),
 ("комната","room","habitación",{"place","thing"}),
 ("любовь","love","amor",{"abstract"}),
 ("жизнь","life","vida",{"abstract"}),
 ("проблема","problem","problema",{"abstract"}),
 ("вопрос","question","pregunta",{"abstract"}),
 ("деньги_skip","","",set()),  # plural-only, handle separately if needed
 ("собака2_skip","","",set()),
 ("муж","husband","marido",{"person"}),
 ("жена","wife","esposa",{"person"}),
 ("ребёнок","child","niño",{"person"}),
 ("человек","person","persona",{"person"}),
 ("девушка","girl","chica",{"person"}),
 ("мальчик","boy","niño",{"person"}),
 ("студентка","student (f)","estudiante (f)",{"person"}),
 ("Москва","Moscow","Moscú",{"place","country"}),
 ("Россия","Russia","Rusia",{"place","country"}),
 ("автобус","bus","autobús",{"thing"}),
 ("поезд","train","tren",{"thing"}),
 ("сад","garden","jardín",{"place"}),
 ("лес","forest","bosque",{"place"}),
 ("море","sea","mar",{"place","thing"}),
 ("небо","sky","cielo",{"thing"}),
 ("солнце","sun","sol",{"thing"}),
 ("дерево","tree","árbol",{"thing"}),
 ("цветок","flower","flor",{"thing"}),
 ("кот","cat (m)","gato",{"animal"}),
 ("птица","bird","pájaro",{"animal"}),
 ("лошадь","horse","caballo",{"animal"}),
]
NOUNS = [n for n in NOUNS if not n[0].endswith("_skip")]

ADJ = [
 ("новый","new","nuevo"),("старый","old","viejo"),("большой","big","grande"),
 ("маленький","small","pequeño"),("хороший","good","bueno"),("красивый","beautiful","bonito"),
 ("интересный","interesting","interesante"),("трудный","difficult","difícil"),
 ("русский","Russian","ruso"),("красный","red","rojo"),("белый","white","blanco"),
 ("тёплый","warm","cálido"),("холодный","cold","frío"),("умный","smart","inteligente"),
 ("молодой","young","joven"),("вкусный","tasty","rico"),("быстрый","fast","rápido"),
 ("длинный","long","largo"),("важный","important","importante"),("весёлый","cheerful","alegre"),
 ("чистый","clean","limpio"),("тёмный","dark","oscuro"),("светлый","bright","claro"),
 ("добрый","kind","amable"),("сильный","strong","fuerte"),("свободный","free","libre"),
]

# verb: (impf, perf|None, en, es)
VERBS = [
 ("читать","прочитать","to read","leer"),
 ("писать","написать","to write","escribir"),
 ("делать","сделать","to do/make","hacer"),
 ("говорить","сказать","to speak/say","hablar/decir"),
 ("работать",None,"to work","trabajar"),
 ("жить",None,"to live","vivir"),
 ("любить",None,"to love","amar"),
 ("знать",None,"to know","saber"),
 ("думать","подумать","to think","pensar"),
 ("покупать","купить","to buy","comprar"),
 ("смотреть","посмотреть","to watch","mirar"),
 ("слушать","послушать","to listen","escuchar"),
 ("играть","поиграть","to play","jugar"),
 ("понимать","понять","to understand","entender"),
 ("помнить",None,"to remember","recordar"),
 ("хотеть",None,"to want","querer"),
 ("видеть","увидеть","to see","ver"),
 ("давать","дать","to give","dar"),
 ("брать","взять","to take","tomar"),
 ("открывать","открыть","to open","abrir"),
 ("закрывать","закрыть","to close","cerrar"),
 ("начинать","начать","to begin","empezar"),
 ("кончать","кончить","to finish","terminar"),
 ("спрашивать","спросить","to ask","preguntar"),
 ("отвечать","ответить","to answer","responder"),
 ("готовить","приготовить","to cook","cocinar"),
 ("отдыхать","отдохнуть","to rest","descansar"),
 ("гулять","погулять","to stroll","pasear"),
 ("учить","выучить","to study/learn","aprender"),
 ("помогать","помочь","to help","ayudar"),
 ("встречать","встретить","to meet","encontrar"),
 ("звонить","позвонить","to call","llamar"),
 ("платить","заплатить","to pay","pagar"),
 ("рисовать","нарисовать","to draw","dibujar"),
 ("петь","спеть","to sing","cantar"),
 ("танцевать",None,"to dance","bailar"),
 ("плавать",None,"to swim","nadar"),
 ("бегать",None,"to run","correr"),
 ("носить",None,"to carry/wear","llevar"),
 ("строить","построить","to build","construir"),
 ("продавать","продать","to sell","vender"),
 ("терять","потерять","to lose","perder"),
 ("находить","найти","to find","encontrar"),
 ("получать","получить","to receive","recibir"),
]

# ---------- helpers ----------
def distinct_options(correct, distractor_candidates):
    """Return [correct]+up to 3 distinct distractors (by exact string), preserving order."""
    seen = {correct}
    out = []
    for d in distractor_candidates:
        if d and d not in seen:
            out.append(d); seen.add(d)
        if len(out) == 3: break
    return out

ITEMS = []  # each: dict for later JS emit
def add(prompt, options, ci, ex_en, ex_es, level, prompt_en, wn_en, wn_es, dnotes):
    ITEMS.append(dict(p=prompt, o=options, ci=ci, ex_en=ex_en, ex_es=ex_es,
                      lvl=level, pen=prompt_en, wn_en=wn_en, wn_es=wn_es, dn=dnotes))

def noun_case_item(lemma, en, es, carrier, target_case, distr_cases, level,
                   prompt_en_tmpl, rule_en, rule_es):
    correct = inflect(lemma,'NOUN',[target_case])
    if not correct: return
    cands = [inflect(lemma,'NOUN',[c]) for c in distr_cases]
    opts = distinct_options(correct, cands)
    if len(opts) < 3: return
    options = [correct]+opts
    prompt = carrier.replace("{X}", "___ ("+lemma+")")
    # distractorNotes keyed by option text
    dn = {}
    for c in distr_cases:
        w = inflect(lemma,'NOUN',[c])
        if w and w in options[1:] and w not in dn:
            dn[w] = {"en":CASE_LABEL[c][0],"es":CASE_LABEL[c][1]}
    cn_en,cn_es = CASE_NAME[target_case]
    ex_en = f"{rule_en} — '{lemma}' ({en}) becomes '{correct}' in the {cn_en}."
    ex_es = f"{rule_es} — '{lemma}' ({es}) → '{correct}' en {cn_es}."
    pen = prompt_en_tmpl.format(g=en)
    add(prompt, options, 0, ex_en, ex_es, level, pen,
        rule_en+".", rule_es+".", dn)

def verb_item(inf, en, es, carrier, target, distr, level, prompt_en, aspect_note_en, aspect_note_es):
    correct = inflect(inf,'INFN',list(target))
    if not correct: return
    cands = [inflect(inf,'INFN',list(d)) for d in distr]
    opts = distinct_options(correct, cands)
    if len(opts) < 3: return
    options=[correct]+opts
    prompt = carrier.replace("{V}", "___ ("+inf+")")
    dn={}
    for d in distr:
        w=inflect(inf,'INFN',list(d))
        key=tuple(sorted(d)) if False else d
        lab=VERB_LABEL.get(d)
        if w and w in options[1:] and w not in dn and lab:
            dn[w]={"en":lab[0],"es":lab[1]}
    ex_en=f"{aspect_note_en} — '{inf}' ({en}) → '{correct}'."
    ex_es=f"{aspect_note_es} — '{inf}' ({es}) → '{correct}'."
    add(prompt, options, 0, ex_en, ex_es, level, prompt_en,
        aspect_note_en+".", aspect_note_es+".", dn)

def adj_item(alemma, aen, aes, noun, noun_en, gender_feats, carrier, level, prompt_en, distr_feats):
    correct = inflect(alemma,'ADJF',list(gender_feats))
    if not correct: return
    cands=[inflect(alemma,'ADJF',list(f)) for f in distr_feats]
    opts=distinct_options(correct,cands)
    if len(opts)<3: return
    options=[correct]+opts
    prompt=carrier.replace("{A}","___ ("+alemma+")")
    dn={}
    for f in distr_feats:
        w=inflect(alemma,'ADJF',list(f))
        # label by the gender/number grammeme in f
        lab=None
        for g in ('masc','femn','neut','plur'):
            if g in f and g in ADJ_LABEL: lab=ADJ_LABEL[g]; break
        if w and w in options[1:] and w not in dn and lab:
            dn[w]={"en":lab[0],"es":lab[1]}
    ex_en=f"Adjectives agree with their noun — with '{noun}' ({noun_en}) → '{correct}'."
    ex_es=f"Los adjetivos concuerdan con su sustantivo — con '{noun}' ({noun_en}) → '{correct}'."
    add(prompt, options, 0, ex_en, ex_es, level, prompt_en,
        "Adjectives agree in gender/number with their noun.",
        "Los adjetivos concuerdan en género/número con su sustantivo.", dn)

# ---------- generation ----------
# Noun-case templates: (carrier, target, distr_cases, allowed_flags, level, prompt_en, rule_en, rule_es, cap)
NC = [
 ("Я вижу {X}.", 'accs', ['nomn','gent','datv'], {"thing","person","animal"}, "A2",
  "I see the ___. ({g})", "The direct object takes the accusative case",
  "El objeto directo va en acusativo", 16),
 ("У меня нет {X}.", 'gent', ['nomn','datv','ablt'], {"thing","abstract","person","animal"}, "A2",
  "I don't have (any) ___. ({g}) — genitive after нет", "'нет' (there isn't) takes the genitive",
  "'нет' (no hay) rige el genitivo", 16),
 ("Я дал подарок {X}.", 'datv', ['nomn','gent','ablt'], {"person"}, "B1",
  "I gave a present to the ___. ({g})", "The recipient takes the dative case",
  "El destinatario va en dativo", 12),
 ("Я интересуюсь {X}.", 'ablt', ['nomn','gent','datv'], {"abstract","thing"}, "B1",
  "I'm interested in ___. ({g}) — instrumental", "'интересоваться' governs the instrumental",
  "'интересоваться' rige el instrumental", 12),
 ("Мы говорим о {X}.", 'loct', ['nomn','gent','ablt'], {"abstract","thing","person"}, "A2",
  "We're talking about the ___. ({g}) — prepositional after о", "The preposition 'о' (about) takes the prepositional case",
  "La preposición 'о' (sobre) rige el prepositivo", 14),
 ("Это дом {X}.", 'gent', ['nomn','datv','ablt'], {"person"}, "B1",
  "This is the ___'s house. ({g}) — genitive of possession", "Possession uses the genitive case",
  "La posesión usa el genitivo", 12),
 ("Я иду в {X}.", 'accs', ['gent','datv','ablt'], {"place"}, "B1",
  "I'm going to the ___. ({g}) — motion, в + accusative", "Motion toward a place uses 'в' + accusative",
  "Movimiento hacia un lugar usa 'в' + acusativo", 12),
 ("Я живу в {X}.", 'loct', ['nomn','gent','datv'], {"place"}, "A2",
  "I live in the ___. ({g}) — location, в + prepositional", "Location uses 'в' + prepositional case",
  "La ubicación usa 'в' + prepositivo", 12),
 ("Я иду к {X}.", 'datv', ['nomn','gent','ablt'], {"person"}, "B1",
  "I'm going to (see) the ___. ({g}) — к + dative", "Motion toward a person uses 'к' + dative",
  "Movimiento hacia una persona usa 'к' + dativo", 10),
 ("Я приехал из {X}.", 'gent', ['nomn','datv','ablt'], {"place","country"}, "B1",
  "I came from ___. ({g}) — из + genitive", "'из' (from/out of) takes the genitive",
  "'из' (de/desde) rige el genitivo", 10),
 ("Я говорю с {X}.", 'ablt', ['nomn','gent','datv'], {"person"}, "B1",
  "I'm talking with the ___. ({g}) — с + instrumental", "'с' (with) takes the instrumental",
  "'с' (con) rige el instrumental", 10),
]
for carrier,tc,dc,flags,lvl,pen,ren,res,cap in NC:
    cnt=0
    for lemma,en,es,nf in NOUNS:
        if flags & nf:
            before=len(ITEMS)
            noun_case_item(lemma,en,es,carrier,tc,dc,lvl,pen,ren,res)
            if len(ITEMS)>before: cnt+=1
            if cnt>=cap: break

# Verb templates
VT_present = [
 ("Каждый день я {V}.", ('pres','sing','1per'),
   [('pres','sing','2per'),('pres','sing','3per'),('pres','plur','3per')], "B1",
   "Every day I ___.", "In the present, the я (1st sing) form"),
 ("Он часто {V}.", ('pres','sing','3per'),
   [('pres','sing','1per'),('pres','sing','2per'),('pres','plur','3per')], "B1",
   "He often ___.", "In the present, the он/она (3rd sing) form"),
 ("Что ты {V}?", ('pres','sing','2per'),
   [('pres','sing','1per'),('pres','sing','3per'),('pres','plur','3per')], "B1",
   "What are you ___?", "In the present, the ты (2nd sing) form"),
]
for carrier,tgt,distr,lvl,pen,note in VT_present:
    cnt=0
    for inf,perf,en,es in VERBS:
        if inflect(inf,'INFN',['pres','sing','1per']):
            verb_item(inf,en,es,carrier,tgt,distr,lvl,pen,note,
                      {'pres':'En el presente, ','x':''}.get('pres')+ ("la forma yo (я)" if tgt==('pres','sing','1per') else "la forma él/ella (он/она)" if tgt==('pres','sing','3per') else "la forma tú (ты)"))
            cnt+=1
        if cnt>=14: break

VT_past = [
 ("Вчера она {V} весь день.", ('past','femn','sing'),
   [('past','masc','sing'),('past','neut','sing'),('past','plur')], "A2",
   "Yesterday she ___ all day.", "Past-tense verbs agree in gender; with 'она' (she) the feminine form",
   "El pasado concuerda en género; con 'она' (ella) la forma femenina"),
 ("Вчера он {V} весь день.", ('past','masc','sing'),
   [('past','femn','sing'),('past','neut','sing'),('past','plur')], "A2",
   "Yesterday he ___ all day.", "Past-tense verbs agree in gender; with 'он' (he) the masculine form",
   "El pasado concuerda en género; con 'он' (él) la forma masculina"),
 ("Вчера они {V} весь день.", ('past','plur'),
   [('past','masc','sing'),('past','femn','sing'),('past','neut','sing')], "A2",
   "Yesterday they ___ all day.", "Past-tense verbs agree in number; with 'они' (they) the plural form",
   "El pasado concuerda en número; con 'они' (ellos) la forma plural"),
]
for carrier,tgt,distr,lvl,pen,ren,res in VT_past:
    cnt=0
    for inf,perf,en,es in VERBS:
        if inflect(inf,'INFN',['past','masc','sing']):
            verb_item(inf,en,es,carrier,tgt,distr,lvl,pen,ren,res)
            cnt+=1
        if cnt>=13: break

# Perfective future person
VT_futr = [
 ("Завтра я {V} письмо.", ('futr','sing','1per'),
   [('futr','sing','2per'),('futr','sing','3per'),('futr','plur','3per')], "B2",
   "Tomorrow I will ___ (and finish).", "A completed future uses the perfective future; the я (1st sing) form",
   "Un futuro completado usa el futuro perfectivo; la forma yo (я)"),
 ("Завтра он {V} письмо.", ('futr','sing','3per'),
   [('futr','sing','1per'),('futr','sing','2per'),('futr','plur','3per')], "B2",
   "Tomorrow he will ___ (and finish).", "A completed future uses the perfective future; the он/она (3rd sing) form",
   "Un futuro completado usa el futuro perfectivo; la forma él/ella (он/она)"),
]
for carrier,tgt,distr,lvl,pen,ren,res in VT_futr:
    cnt=0
    for inf,perf,en,es in VERBS:
        if perf and inflect(perf,'INFN',['futr','sing','1per']):
            verb_item(perf,en,es,carrier,tgt,distr,lvl,pen,ren,res)
            cnt+=1
        if cnt>=15: break

# Imperative
cnt=0
for inf,perf,en,es in VERBS:
    if inflect(inf,'INFN',['impr','sing']):
        verb_item(inf,en,es,"Пожалуйста, {V} громче!", ('impr','sing'),
                  [('pres','sing','2per'),('infn',),('past','masc','sing')], "B2",
                  "Please ___ louder!", "A command uses the imperative",
                  "Una orden usa el imperativo")
        cnt+=1
    if cnt>=12: break

# Adjective agreement (nominative) — fixed nouns per gender
ADJ_NOUNS = [
 ("дом","house",('masc','sing','nomn'),[('femn','sing','nomn'),('neut','sing','nomn'),('plur','nomn')],"A2","This is a {a} {n}."),
 ("книга","book",('femn','sing','nomn'),[('masc','sing','nomn'),('neut','sing','nomn'),('plur','nomn')],"A2","This is a {a} {n}."),
 ("окно","window",('neut','sing','nomn'),[('masc','sing','nomn'),('femn','sing','nomn'),('plur','nomn')],"A2","This is a {a} {n}."),
 ("дома","houses",('plur','nomn'),[('masc','sing','nomn'),('femn','sing','nomn'),('neut','sing','nomn')],"B1","These are {a} {n}."),
]
for noun,nen,gf,df,lvl,frame in ADJ_NOUNS:
    cnt=0
    for alemma,aen,aes in ADJ:
        carrier = "Это "+"{A} "+noun+"."
        adj_item(alemma,aen,aes,noun,nen,gf,carrier,lvl,frame.format(a=aen,n=nen),df)
        cnt+=1
        if cnt>=13: break

print(f"generated (pre-dedup): {len(ITEMS)}", file=sys.stderr)


# ---------- generic builders for A1 / C1 / C2 tiers ----------
def noun_custom(lemma,en,es,carrier,target_feats,distr_specs,level,prompt_en,rule_en,rule_es,cn_en,cn_es):
    correct=inflect(lemma,'NOUN',target_feats)
    if not correct: return
    cands=[inflect(lemma,'NOUN',df) for df,_,_ in distr_specs]
    opts=distinct_options(correct,cands)
    if len(opts)<3: return
    options=[correct]+opts
    prompt=carrier.replace("{X}","___ ("+lemma+")")
    dn={}
    for df,le,ls in distr_specs:
        w=inflect(lemma,'NOUN',df)
        if w and w in options[1:] and w not in dn:
            dn[w]={"en":le,"es":ls}
    ex_en=f"{rule_en} — '{lemma}' ({en}) becomes '{correct}' ({cn_en})."
    ex_es=f"{rule_es} — '{lemma}' ({es}) → '{correct}' ({cn_es})."
    add(prompt,options,0,ex_en,ex_es,level,prompt_en,rule_en+".",rule_es+".",dn)

def verb_aspect_item(impf,perf,en,es,carrier,level,prompt_en):
    correct=inflect(impf,'INFN',['infn'])  # imperfective infinitive
    perf_inf=inflect(perf,'INFN',['infn'])
    pres1=inflect(impf,'INFN',['pres','sing','1per'])
    pastm=inflect(impf,'INFN',['past','masc','sing'])
    cands=[perf_inf,pres1,pastm]
    opts=distinct_options(correct,cands)
    if len(opts)<3: return
    options=[correct]+opts
    prompt=carrier.replace("{V}","___ ("+perf+")")
    dn={}
    for w,le,ls in [(perf_inf,"the perfective infinitive (wrong after 'начать')","el infinitivo perfectivo (incorrecto tras 'начать')"),
                    (pres1,"the я (I) present form","la forma yo (я) del presente"),
                    (pastm,"the past masculine form","la forma pasada masculina")]:
        if w and w in options[1:] and w not in dn: dn[w]={"en":le,"es":ls}
    ex_en=f"Phase verbs like 'начать' (to begin) take the IMPERFECTIVE infinitive — 'начать {correct}', not perfective '{perf_inf}'."
    ex_es=f"Los verbos de fase como 'начать' (empezar) toman el infinitivo IMPERFECTIVO — 'начать {correct}', no el perfectivo '{perf_inf}'."
    add(prompt,options,0,ex_en,ex_es,level,prompt_en,
        "Phase verbs (начать, кончить) take an imperfective infinitive.",
        "Los verbos de fase (начать, кончить) toman infinitivo imperfectivo.",dn)

# ---- A1 tier: basic present (1sg) + basic accusative object ----
A1_VERBS=["читать","работать","жить","знать","делать","говорить","любить","думать","понимать","помнить"]
cnt=0
for inf,perf,en,es in VERBS:
    if inf in A1_VERBS and inflect(inf,'INFN',['pres','sing','1per']):
        verb_item(inf,en,es,"Я всегда {V}.",('pres','sing','1per'),
                  [('pres','sing','2per'),('pres','sing','3per'),('pres','plur','3per')],"A1",
                  f"I always ___. ({en})","In the present, the я (1st sing) form",
                  "En el presente, la forma yo (я)")
        cnt+=1
    if cnt>=10: break
cnt=0
for lemma,en,es,nf in NOUNS:
    if ({"thing","animal","abstract"} & nf):
        noun_case_item(lemma,en,es,"Я люблю {X}.", 'accs', ['nomn','gent','datv'], "A1",
                       "I love ___. ({g}) — accusative object",
                       "The direct object of 'любить' takes the accusative",
                       "El objeto directo de 'любить' va en acusativo")
        cnt+=1
    if cnt>=12: break

# ---- C1 tier: profession instrumental (стать) ----
cnt=0
for lemma,en,es,nf in NOUNS:
    if "person" in nf:
        noun_custom(lemma,en,es,"Он хочет стать {X}.",['ablt'],
            [(['nomn'],*CASE_LABEL['nomn']),(['gent'],*CASE_LABEL['gent']),(['datv'],*CASE_LABEL['datv'])],
            "C1","He wants to become a ___. ({g}) — instrumental after стать".replace("{g}",en),
            "After 'стать' (to become) the predicate noun goes in the instrumental",
            "Tras 'стать' (llegar a ser) el predicado va en instrumental","instrumental","instrumental")
        cnt+=1
    if cnt>=12: break
# ---- C1 tier: genitive plural after много ----
cnt=0
for lemma,en,es,nf in NOUNS:
    if ({"thing","person","animal"} & nf):
        noun_custom(lemma,en,es,"У нас много {X}.",['gent','plur'],
            [(['nomn','plur'],"the nominative plural form","la forma nominativa plural"),
             (['gent','sing'],"the genitive singular form","la forma genitiva singular"),
             (['datv','plur'],"the dative plural form","la forma dativa plural")],
            "C1","We have many ___. ({g}) — genitive plural after много".replace("{g}",en),
            "Quantity words like 'много' (many) take the genitive plural",
            "Palabras de cantidad como 'много' (muchos) toman el genitivo plural",
            "genitive plural","genitivo plural")
        cnt+=1
    if cnt>=14: break
# ---- C1 tier: numeral 2 + genitive singular (masc/neut) ----
cnt=0
for lemma,en,es,nf in NOUNS:
    p=parse_pos(lemma,'NOUN')
    if p and p.tag.gender in ('masc','neut') and ({"thing","person","animal"} & nf):
        noun_custom(lemma,en,es,"У меня два {X}.",['gent','sing'],
            [(['nomn','sing'],"the nominative singular form","la forma nominativa singular"),
             (['nomn','plur'],"the nominative plural form","la forma nominativa plural"),
             (['gent','plur'],"the genitive plural form","la forma genitiva plural")],
            "C1","I have two ___. ({g}) — genitive singular after 2/3/4".replace("{g}",en),
            "The numbers 2, 3, 4 take the genitive singular",
            "Los números 2, 3, 4 toman el genitivo singular",
            "genitive singular","genitivo singular")
        cnt+=1
    if cnt>=12: break

# ---- C2 tier: aspect — phase verb + imperfective infinitive ----
cnt=0
for impf,perf,en,es in VERBS:
    if perf and inflect(impf,'INFN',['infn'])!=inflect(perf,'INFN',['infn']):
        verb_aspect_item(impf,perf,en,es,"Я начал {V} книгу.","C2",f"I began to ___ the book. ({en})")
        cnt+=1
    if cnt>=16: break


# ---------- dedup vs existing + within batch ----------
import re
def norm(s):
    s=s.lower().replace("ё","е")
    s=re.sub(r"[^\w]", " ", s, flags=re.UNICODE)
    return re.sub(r"\s+"," ",s).strip()

existing = set()
with open("/tmp/ru_existing_prompts.json","r") as f:
    for pr in json.load(f):
        existing.add(norm(pr))

seen=set(); final=[]
for it in ITEMS:
    k=norm(it["p"])
    if k in existing or k in seen: continue
    # options must be 4 distinct non-blank
    if len(set(it["o"]))!=4 or any(not x.strip() for x in it["o"]): continue
    seen.add(k); final.append(it)

print(f"after dedup+distinct: {len(final)}", file=sys.stderr)
# band spread
from collections import Counter
print("levels:", dict(Counter(x["lvl"] for x in final)), file=sys.stderr)

# ---------- emit JS ----------
def js(s): return json.dumps(s, ensure_ascii=False)
lines=["// Russian gram — engine-generated (pymorphy3). correctIdx 0. slot5 null, slot6 promptNative{en}, slot7 wrongNote+distractorNotes.",
       "export default ["]
for it in final:
    slot7={"wrongNote":{"en":it["wn_en"],"es":it["wn_es"]}}
    if it["dn"]: slot7["distractorNotes"]=it["dn"]
    row=[js(it["p"]), it["o"], 0, {"en":it["ex_en"],"es":it["ex_es"]},
         it["lvl"], None, {"en":it["pen"]}, slot7]
    lines.append("  "+json.dumps(row, ensure_ascii=False)+",")
lines.append("];")
open("/tmp/ru_gen.js","w").write("\n".join(lines))
print("wrote /tmp/ru_gen.js", file=sys.stderr)

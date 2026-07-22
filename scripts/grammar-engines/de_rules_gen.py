# -*- coding: utf-8 -*-
# =============================================================================
# SquirreLingo German grammar-drill generator  (grammar engine #4)
# =============================================================================
# The FIRST rule-table engine in the program (ru=pymorphy3, ja/ko=off-the-shelf
# conjugators). German has no clean permissively-licensed inflection GENERATOR,
# so this engine is a hand-authored RULE-TABLE (declension + weak-verb rules)
# PLUS a CURATED table of anything not rule-derivable (strong/mixed verb
# principal parts w/ ablaut + aux; noun gender/plural/oblique). Fully
# committable (no license wrinkle) — same shape as ru_pymorphy3_gen.py.
#
# SOURCES (table/library-verified, NOT hand-guessed):
#   * Declension tables (der/ein-word articles, weak/mixed/strong adjective
#     endings, der-word endings) — the standard German paradigm tables (Duden
#     Grammatik; Hammer's German Grammar & Usage). Encoded verbatim below.
#   * Strong/irregular/mixed verb principal parts (present du/er vowel change,
#     Präteritum, Partizip II, sein-vs-haben aux, Konjunktiv II) — CURATED table
#     VERB below, cross-checked against the standard German strong-verb list
#     (Duden). No strong participle is guessed.
#   * Noun gender / nominative-plural / genitive-sg / weak (n-decl) oblique —
#     CURATED table NOUN_TABLE below, VERIFIED at generate time against the
#     `german-nouns` pip package (Wiktionary data) when run with --verify.
#
# USAGE (offline dev tool; deterministic — no RNG):
#   pip install german-nouns          # optional, for --verify only
#   1) dump existing de gram prompts (slot 0 of each BANK.gram item in
#      data/tracks/deForEn.js) to /tmp/de_existing_prompts.json (JSON array).
#   2) python scripts/grammar-engines/de_rules_gen.py [--verify]  -> /tmp/de_gen.js
#      and #89 chip entries -> /tmp/de_gen_tags.js
#   3) splice /tmp/de_gen.js into deForEn.js BANK.gram (APPEND after existing
#      items; existing items stay byte-identical) and merge /tmp/de_gen_tags.js
#      into deForEnTags.js RAW.
#
# ITEM SCHEMA (8-slot, matches existing de gram exactly):
#   [prompt(cloze, German), [4 options], 0, {en,es} explain, CEFR,
#    null, {en} promptNative, {wrongNote:{en,es}, distractorNotes:{opt:{en,es}}}]
# correctIdx is ALWAYS 0 (pre-shuffle). distractorNotes keyed by full option
# TEXT so they survive shuffleOptions. German nouns stay Capitalized (cap = no-op).
# =============================================================================
import json, sys, re
from collections import Counter

VERIFY = "--verify" in sys.argv

# -----------------------------------------------------------------------------
# 1. DECLENSION TABLES  (case x gender/number)   gender keys: m f n pl
# -----------------------------------------------------------------------------
ART_DEF = {
    'nom': {'m': 'der', 'f': 'die', 'n': 'das', 'pl': 'die'},
    'acc': {'m': 'den', 'f': 'die', 'n': 'das', 'pl': 'die'},
    'dat': {'m': 'dem', 'f': 'der', 'n': 'dem', 'pl': 'den'},
    'gen': {'m': 'des', 'f': 'der', 'n': 'des', 'pl': 'der'},
}
EIN_END = {   # ein-word ENDINGS (ein, kein, mein, dein, sein, ihr, unser)
    'nom': {'m': '',   'f': 'e',  'n': '',   'pl': 'e'},
    'acc': {'m': 'en', 'f': 'e',  'n': '',   'pl': 'e'},
    'dat': {'m': 'em', 'f': 'er', 'n': 'em', 'pl': 'en'},
    'gen': {'m': 'es', 'f': 'er', 'n': 'es', 'pl': 'er'},
}
DER_END = {   # der-word endings (dieser, jeder, welcher, jener)
    'nom': {'m': 'er', 'f': 'e',  'n': 'es', 'pl': 'e'},
    'acc': {'m': 'en', 'f': 'e',  'n': 'es', 'pl': 'e'},
    'dat': {'m': 'em', 'f': 'er', 'n': 'em', 'pl': 'en'},
    'gen': {'m': 'es', 'f': 'er', 'n': 'es', 'pl': 'er'},
}
ADJ_WEAK = {   # after a definite article / der-word
    'nom': {'m': 'e',  'f': 'e',  'n': 'e',  'pl': 'en'},
    'acc': {'m': 'en', 'f': 'e',  'n': 'e',  'pl': 'en'},
    'dat': {'m': 'en', 'f': 'en', 'n': 'en', 'pl': 'en'},
    'gen': {'m': 'en', 'f': 'en', 'n': 'en', 'pl': 'en'},
}
ADJ_MIXED = {  # after an ein-word
    'nom': {'m': 'er', 'f': 'e',  'n': 'es', 'pl': 'en'},
    'acc': {'m': 'en', 'f': 'e',  'n': 'es', 'pl': 'en'},
    'dat': {'m': 'en', 'f': 'en', 'n': 'en', 'pl': 'en'},
    'gen': {'m': 'en', 'f': 'en', 'n': 'en', 'pl': 'en'},
}
ADJ_STRONG = {  # no article
    'nom': {'m': 'er', 'f': 'e',  'n': 'es', 'pl': 'e'},
    'acc': {'m': 'en', 'f': 'e',  'n': 'es', 'pl': 'e'},
    'dat': {'m': 'em', 'f': 'er', 'n': 'em', 'pl': 'en'},
    'gen': {'m': 'en', 'f': 'er', 'n': 'en', 'pl': 'er'},
}
def ein_form(stem, case, g): return stem + EIN_END[case][g]

# -----------------------------------------------------------------------------
# 2. NOUN TABLE  (curated; verified vs german-nouns via --verify)
#   (lemma, en, es, gender, plural, gen_sg_or_None, weak_oblique_or_None, flags)
# -----------------------------------------------------------------------------
NOUN_TABLE = [
    ("Mann","man","hombre","m","Männer","des Mannes",None,{"person"}),
    ("Frau","woman","mujer","f","Frauen",None,None,{"person"}),
    ("Kind","child","niño/a","n","Kinder","des Kindes",None,{"person"}),
    ("Buch","book","libro","n","Bücher","des Buches",None,{"thing"}),
    ("Auto","car","coche","n","Autos","des Autos",None,{"thing"}),
    ("Tisch","table","mesa","m","Tische","des Tisches",None,{"thing"}),
    ("Stuhl","chair","silla","m","Stühle","des Stuhles",None,{"thing"}),
    ("Haus","house","casa","n","Häuser","des Hauses",None,{"place","thing"}),
    ("Hund","dog","perro","m","Hunde","des Hundes",None,{"animal"}),
    ("Katze","cat","gato","f","Katzen",None,None,{"animal"}),
    ("Apfel","apple","manzana","m","Äpfel","des Apfels",None,{"food","thing"}),
    ("Baum","tree","árbol","m","Bäume","des Baumes",None,{"thing"}),
    ("Blume","flower","flor","f","Blumen",None,None,{"thing"}),
    ("Stadt","city","ciudad","f","Städte",None,None,{"place"}),
    ("Land","country","país","n","Länder","des Landes",None,{"place"}),
    ("Straße","street","calle","f","Straßen",None,None,{"place"}),
    ("Fenster","window","ventana","n","Fenster","des Fensters",None,{"thing"}),
    ("Tür","door","puerta","f","Türen",None,None,{"thing"}),
    ("Kopf","head","cabeza","m","Köpfe","des Kopfes",None,{"thing"}),
    ("Hand","hand","mano","f","Hände",None,None,{"thing"}),
    ("Zug","train","tren","m","Züge","des Zuges",None,{"thing"}),
    ("Bus","bus","autobús","m","Busse","des Busses",None,{"thing"}),
    ("Freund","friend","amigo","m","Freunde","des Freundes",None,{"person"}),
    ("Lehrer","teacher","profesor","m","Lehrer","des Lehrers",None,{"person"}),
    ("Arzt","doctor","médico","m","Ärzte","des Arztes",None,{"person"}),
    ("Kaffee","coffee","café","m","Kaffees","des Kaffees",None,{"food"}),
    ("Wein","wine","vino","m","Weine","des Weines",None,{"food"}),
    ("Bier","beer","cerveza","n","Biere","des Bieres",None,{"food"}),
    ("Brot","bread","pan","n","Brote","des Brotes",None,{"food"}),
    ("Milch","milk","leche","f","Milchen",None,None,{"food"}),  # mass noun; plural never emitted (only a strong-adj singular drill uses Milch). Form per german-nouns/Wiktionary.
    ("Wasser","water","agua","n","Wasser","des Wassers",None,{"food"}),
    ("Zeitung","newspaper","periódico","f","Zeitungen",None,None,{"thing"}),
    ("Brief","letter","carta","m","Briefe","des Briefes",None,{"thing"}),
    ("Computer","computer","ordenador","m","Computer","des Computers",None,{"thing"}),
    ("Telefon","telephone","teléfono","n","Telefone","des Telefons",None,{"thing"}),
    ("Garten","garden","jardín","m","Gärten","des Gartens",None,{"place"}),
    ("Schule","school","escuela","f","Schulen",None,None,{"place"}),
    ("Fluss","river","río","m","Flüsse","des Flusses",None,{"place"}),
    ("Berg","mountain","montaña","m","Berge","des Berges",None,{"place"}),
    ("Wald","forest","bosque","m","Wälder","des Waldes",None,{"place"}),
    ("Park","park","parque","m","Parks","des Parks",None,{"place"}),
    ("Wand","wall","pared","f","Wände",None,None,{"thing"}),
    ("Zeit","time","tiempo","f","Zeiten",None,None,{"abstract"}),
    ("Mädchen","girl","chica","n","Mädchen","des Mädchens",None,{"person"}),
    # weak masculine (n-declension): oblique adds -(e)n
    ("Junge","boy","chico","m","Jungen","des Jungen","den Jungen",{"person"}),
    ("Student","student","estudiante","m","Studenten","des Studenten","den Studenten",{"person"}),
    ("Herr","gentleman","señor","m","Herren","des Herrn","den Herrn",{"person"}),
    ("Nachbar","neighbour","vecino","m","Nachbarn","des Nachbarn","den Nachbarn",{"person"}),
    ("Mensch","human","persona","m","Menschen","des Menschen","den Menschen",{"person"}),
    ("Kollege","colleague","colega","m","Kollegen","des Kollegen","den Kollegen",{"person"}),
]
NOUN = {n[0]: dict(en=n[1], es=n[2], g=n[3], pl=n[4], gen=n[5], weak=n[6], flags=n[7]) for n in NOUN_TABLE}

def noun_acc_dat_sg(lemma):
    w = NOUN[lemma]["weak"]; return w.split()[-1] if w else lemma
def noun_gen_sg(lemma):
    g = NOUN[lemma]["gen"]; return g.split()[-1] if g else lemma
def noun_dat_pl(lemma):
    pl = NOUN[lemma]["pl"]; return pl if pl.endswith(("n","s")) else pl+"n"

# -----------------------------------------------------------------------------
# 3. ADJECTIVE TABLE (clean rule-derivable stems only)
# -----------------------------------------------------------------------------
ADJ_TABLE = [
    ("gut","good","bueno"),("alt","old","viejo"),("jung","young","joven"),
    ("klein","small","pequeño"),("groß","big","grande"),("neu","new","nuevo"),
    ("schön","beautiful","bonito"),("rot","red","rojo"),("kalt","cold","frío"),
    ("warm","warm","cálido"),("schnell","fast","rápido"),("stark","strong","fuerte"),
    ("klug","clever","listo"),("nett","nice","amable"),("laut","loud","ruidoso"),
    ("schwer","heavy/hard","pesado/difícil"),("leicht","light/easy","ligero/fácil"),
    ("interessant","interesting","interesante"),("wichtig","important","importante"),
    ("lang","long","largo"),("kurz","short","corto"),("reich","rich","rico"),
    ("weiß","white","blanco"),("schwarz","black","negro"),("grün","green","verde"),
    ("frisch","fresh","fresco"),("süß","sweet","dulce"),("lecker","tasty","rico"),
    ("billig","cheap","barato"),("teuer","expensive","caro"),
    ("freundlich","friendly","amable"),("modern","modern","moderno"),
]
def adj_form(base, ending):
    if ending == "": return base
    if base == "teuer": return "teur" + ending
    return base + ending
ADJ = {a[0]: dict(en=a[1], es=a[2]) for a in ADJ_TABLE}

COMP = {  # comparative/superlative (curated for umlaut + irregular)
    "gut": ("besser","best"), "viel": ("mehr","meist"), "gern": ("lieber","liebst"),
    "hoch": ("höher","höchst"), "nah": ("näher","nächst"),
    "alt": ("älter","ältest"), "jung": ("jünger","jüngst"), "groß": ("größer","größt"),
    "kalt": ("kälter","kältest"), "warm": ("wärmer","wärmst"), "stark": ("stärker","stärkst"),
    "lang": ("länger","längst"), "kurz": ("kürzer","kürzest"), "klug": ("klüger","klügst"),
    "schnell": ("schneller","schnellst"), "klein": ("kleiner","kleinst"),
    "schön": ("schöner","schönst"), "billig": ("billiger","billigst"),
    "schwer": ("schwerer","schwerst"), "leicht": ("leichter","leichtest"),
    "nett": ("netter","nettest"), "reich": ("reicher","reichst"),
    "interessant": ("interessanter","interessantest"),
    "wichtig": ("wichtiger","wichtigst"), "wenig": ("weniger","wenigst"),
}

# -----------------------------------------------------------------------------
# 4. VERB TABLE (curated principal parts; strong/mixed ablaut is NOT guessed)
# -----------------------------------------------------------------------------
def _V(en,es,cls,du,er,praet,pp,aux="haben",k2=None,sep=None,full=None):
    return dict(en=en,es=es,cls=cls,du=du,er=er,praet=praet,pp=pp,aux=aux,k2=k2,sep=sep,full=full)
VERB = {
 "machen": _V("to do/make","hacer","weak","machst","macht","machte","gemacht"),
 "lernen": _V("to learn","aprender","weak","lernst","lernt","lernte","gelernt"),
 "spielen":_V("to play","jugar","weak","spielst","spielt","spielte","gespielt"),
 "kaufen": _V("to buy","comprar","weak","kaufst","kauft","kaufte","gekauft"),
 "wohnen": _V("to live/reside","vivir","weak","wohnst","wohnt","wohnte","gewohnt"),
 "lieben": _V("to love","amar","weak","liebst","liebt","liebte","geliebt"),
 "brauchen":_V("to need","necesitar","weak","brauchst","braucht","brauchte","gebraucht"),
 "fragen": _V("to ask","preguntar","weak","fragst","fragt","fragte","gefragt"),
 "sagen":  _V("to say","decir","weak","sagst","sagt","sagte","gesagt"),
 "suchen": _V("to look for","buscar","weak","suchst","sucht","suchte","gesucht"),
 "hören":  _V("to hear","oír","weak","hörst","hört","hörte","gehört"),
 "lachen": _V("to laugh","reír","weak","lachst","lacht","lachte","gelacht"),
 "kochen": _V("to cook","cocinar","weak","kochst","kocht","kochte","gekocht"),
 "arbeiten":_V("to work","trabajar","weak","arbeitest","arbeitet","arbeitete","gearbeitet"),
 "warten": _V("to wait","esperar","weak","wartest","wartet","wartete","gewartet"),
 "reisen": _V("to travel","viajar","weak","reist","reist","reiste","gereist",aux="sein"),
 "studieren":_V("to study","estudiar","weak","studierst","studiert","studierte","studiert"),
 "besuchen":_V("to visit","visitar","weak","besuchst","besucht","besuchte","besucht"),
 "fahren": _V("to drive/go","ir (en vehículo)","strong","fährst","fährt","fuhr","gefahren",aux="sein",k2="führe"),
 "gehen":  _V("to go (on foot)","ir (a pie)","strong","gehst","geht","ging","gegangen",aux="sein",k2="ginge"),
 "kommen": _V("to come","venir","strong","kommst","kommt","kam","gekommen",aux="sein",k2="käme"),
 "sehen":  _V("to see","ver","strong","siehst","sieht","sah","gesehen",k2="sähe"),
 "geben":  _V("to give","dar","strong","gibst","gibt","gab","gegeben",k2="gäbe"),
 "nehmen": _V("to take","tomar","strong","nimmst","nimmt","nahm","genommen",k2="nähme"),
 "lesen":  _V("to read","leer","strong","liest","liest","las","gelesen",k2="läse"),
 "sprechen":_V("to speak","hablar","strong","sprichst","spricht","sprach","gesprochen",k2="spräche"),
 "essen":  _V("to eat","comer","strong","isst","isst","aß","gegessen",k2="äße"),
 "schlafen":_V("to sleep","dormir","strong","schläfst","schläft","schlief","geschlafen",k2="schliefe"),
 "laufen": _V("to run","correr","strong","läufst","läuft","lief","gelaufen",aux="sein",k2="liefe"),
 "trinken":_V("to drink","beber","strong","trinkst","trinkt","trank","getrunken",k2="tränke"),
 "finden": _V("to find","encontrar","strong","findest","findet","fand","gefunden",k2="fände"),
 "helfen": _V("to help","ayudar","strong","hilfst","hilft","half","geholfen",k2="hälfe"),
 "treffen":_V("to meet","encontrarse con","strong","triffst","trifft","traf","getroffen",k2="träfe"),
 "schreiben":_V("to write","escribir","strong","schreibst","schreibt","schrieb","geschrieben",k2="schriebe"),
 "bleiben":_V("to stay","quedarse","strong","bleibst","bleibt","blieb","geblieben",aux="sein",k2="bliebe"),
 "fliegen":_V("to fly","volar","strong","fliegst","fliegt","flog","geflogen",aux="sein",k2="flöge"),
 "singen": _V("to sing","cantar","strong","singst","singt","sang","gesungen",k2="sänge"),
 "schwimmen":_V("to swim","nadar","strong","schwimmst","schwimmt","schwamm","geschwommen",aux="sein",k2="schwömme"),
 "tragen": _V("to carry/wear","llevar","strong","trägst","trägt","trug","getragen",k2="trüge"),
 "waschen":_V("to wash","lavar","strong","wäschst","wäscht","wusch","gewaschen",k2="wüsche"),
 "verstehen":_V("to understand","entender","strong","verstehst","versteht","verstand","verstanden",k2="verstünde"),
 "denken": _V("to think","pensar","mixed","denkst","denkt","dachte","gedacht",k2="dächte"),
 "bringen":_V("to bring","traer","mixed","bringst","bringt","brachte","gebracht",k2="brächte"),
 "kennen": _V("to know (be familiar)","conocer","mixed","kennst","kennt","kannte","gekannt",k2="kennte"),
 "wissen": _V("to know (a fact)","saber","mixed","weißt","weiß","wusste","gewusst",k2="wüsste",
              full=["weiß","weißt","weiß","wissen","wisst","wissen"]),
 "sein":   _V("to be","ser/estar","irr","bist","ist","war","gewesen",aux="sein",k2="wäre",
              full=["bin","bist","ist","sind","seid","sind"]),
 "haben":  _V("to have","tener","irr","hast","hat","hatte","gehabt",k2="hätte",
              full=["habe","hast","hat","haben","habt","haben"]),
 "werden": _V("to become","llegar a ser","irr","wirst","wird","wurde","geworden",aux="sein",k2="würde",
              full=["werde","wirst","wird","werden","werdet","werden"]),
 "können": _V("can/to be able","poder","modal","kannst","kann","konnte","gekonnt",k2="könnte",
              full=["kann","kannst","kann","können","könnt","können"]),
 "müssen": _V("must/to have to","deber/tener que","modal","musst","muss","musste","gemusst",k2="müsste",
              full=["muss","musst","muss","müssen","müsst","müssen"]),
 "wollen": _V("to want","querer","modal","willst","will","wollte","gewollt",k2="wollte",
              full=["will","willst","will","wollen","wollt","wollen"]),
 "sollen": _V("should/to be supposed to","deber","modal","sollst","soll","sollte","gesollt",k2="sollte",
              full=["soll","sollst","soll","sollen","sollt","sollen"]),
 "dürfen": _V("may/to be allowed","poder (permiso)","modal","darfst","darf","durfte","gedurft",k2="dürfte",
              full=["darf","darfst","darf","dürfen","dürft","dürfen"]),
 "mögen":  _V("to like","gustar","modal","magst","mag","mochte","gemocht",k2="möchte",
              full=["mag","magst","mag","mögen","mögt","mögen"]),
 "aufstehen":_V("to get up","levantarse","strong","stehst auf","steht auf","stand auf","aufgestanden",aux="sein",sep="auf"),
 "anrufen": _V("to call (phone)","llamar","strong","rufst an","ruft an","rief an","angerufen",sep="an"),
 "einkaufen":_V("to shop","hacer la compra","weak","kaufst ein","kauft ein","kaufte ein","eingekauft",sep="ein"),
 "ankommen":_V("to arrive","llegar","strong","kommst an","kommt an","kam an","angekommen",aux="sein",sep="an"),
}
STEM = lambda inf: inf[:-2] if inf.endswith("en") else inf[:-1]
def present(inf, person):
    v = VERB[inf]; idx = {"ich":0,"du":1,"er":2,"wir":3,"ihr":4,"sie":5}[person]
    if v["full"]: return v["full"][idx]
    base = inf; pref = v["sep"]; st = STEM(inf)
    if pref: base = inf[len(pref):]; st = STEM(base)
    if person == "du":   core = v["du"].split()[0] if pref else v["du"]
    elif person == "er": core = v["er"].split()[0] if pref else v["er"]
    elif person == "ich":core = st + "e"
    elif person in ("wir","sie"): core = base
    else:
        need_e = st[-1] in "td" or (len(st) >= 2 and st[-1] in "mn" and st[-2] not in "aeiouäöülrmnh")
        core = st + ("et" if need_e else "t")
    return (core + " " + pref) if pref else core

# =============================================================================
# ITEM BUILDING
# =============================================================================
ITEMS = []
def add(prompt, options, ex_en, ex_es, level, prompt_en, wn_en, wn_es, dnotes, chip=None):
    ITEMS.append(dict(p=prompt, o=options, ex_en=ex_en, ex_es=ex_es, lvl=level,
                      pen=prompt_en, wn_en=wn_en, wn_es=wn_es, dn=dnotes, chip=chip))

# #89 training-wheel chips (German inflects for person → the chip names the real subject)
PERSON_CHIP = {
 'ich':{"en":"ich (1st sing.)","de":"ich"}, 'du':{"en":"du (2nd sing.)","de":"du"},
 'er':{"en":"er/sie/es (3rd sing.)","de":"er"}, 'wir':{"en":"wir (1st plur.)","de":"wir"},
 'ihr':{"en":"ihr (2nd plur.)","de":"ihr"}, 'sie':{"en":"sie/Sie (3rd plur./formal)","de":"sie"},
}
TENSE_CHIP = {
 'praesens':{"en":"Present","de":"Präsens"}, 'perfekt':{"en":"Perfect","de":"Perfekt"},
 'praeteritum':{"en":"Simple past","de":"Präteritum"}, 'plusquam':{"en":"Past perfect","de":"Plusquamperfekt"},
 'futur':{"en":"Future","de":"Futur I"}, 'k2':{"en":"Konjunktiv II","de":"Konjunktiv II"},
}
def mk_chip(tense, why_en, why_de, person=None):
    c = {"grammar": {"tense": TENSE_CHIP[tense], "why": {"en": why_en, "de": why_de}}}
    if person: c["person"] = PERSON_CHIP[person]
    return c
def cap_initial(w): return w[:1].upper()+w[1:] if w else w
def build_options(correct, distractors):
    seen={correct}; out=[]
    for d in distractors:
        if d and d not in seen: out.append(d); seen.add(d)
        if len(out)==3: break
    return [correct]+out if len(out)==3 else None

CASE_LABEL = {
 'nom': ("the nominative (subject) form","la forma nominativa (sujeto)"),
 'acc': ("the accusative (direct-object) form","la forma acusativa (objeto directo)"),
 'dat': ("the dative (indirect-object) form","la forma dativa (objeto indirecto)"),
 'gen': ("the genitive (possessive) form","la forma genitiva (posesiva)"),
}
CASE_NAME = {'nom':("nominative","nominativo"),'acc':("accusative","acusativo"),
             'dat':("dative","dativo"),'gen':("genitive","genitivo")}
PERSON_LABEL = {
 'ich':("the ich (I) form","la forma ich (yo)"),'du':("the du (you sing.) form","la forma du (tú)"),
 'er':("the er/sie/es (he/she/it) form","la forma er/sie/es (él/ella)"),
 'wir':("the wir (we) form","la forma wir (nosotros)"),'ihr':("the ihr (you pl.) form","la forma ihr (vosotros)"),
 'sie':("the sie/Sie (they/you formal) form","la forma sie/Sie (ellos/usted)"),
}
PERSON_EN = {'ich':'I','du':'you','er':'he','wir':'we','ihr':'you (pl.)','sie':'they'}
FORM_LABEL = {
 'inf':("the infinitive","el infinitivo"),
 'praet':("the simple-past (Präteritum) form","la forma de pretérito (Präteritum)"),
 'pp':("the past participle (Partizip II)","el participio (Partizip II)"),
 'pres':("a present-tense form","una forma de presente"),
 'wrongaux':("the wrong auxiliary","el auxiliar incorrecto"),
}
ADJ_END_LABEL = {
 'e': ("the -e ending (weak nominative / feminine)","la terminación -e (débil/femenino)"),
 'en':("the -en ending (weak oblique, dative or plural)","la terminación -en (oblicua, dativo o plural)"),
 'er':("the -er ending (strong/mixed masc. nominative)","la terminación -er (masc. nom. fuerte/mixta)"),
 'es':("the -es ending (neuter nom./acc.)","la terminación -es (neutro nom./acus.)"),
 'em':("the -em ending (strong masc./neut. dative)","la terminación -em (dativo masc./neutro fuerte)"),
 '':  ("the bare stem with no ending","la raíz sin terminación"),
}
def adj_ending_of(base, opt):
    if opt == base: return ''
    if base == "teuer" and opt.startswith("teur"): return opt[len("teur"):]
    return opt[len(base):] if opt.startswith(base) else opt
def gender_cue(lemma):
    g = NOUN[lemma]["g"]; return ART_DEF['nom'][g] + " " + lemma

# ---------------------------------------------------------------------------
# BLOCK A — definite-article case declension (only cells that change from nom)
# ---------------------------------------------------------------------------
def def_article_item(case, g, lemma, carrier_de, carrier_en, level, rule_en, rule_es, initial=False):
    art = ART_DEF[case][g]
    if case in ('acc','dat') and g in ('m','f','n'): nsurf = noun_acc_dat_sg(lemma)
    elif case == 'gen' and g in ('m','n'): nsurf = noun_gen_sg(lemma)
    elif g == 'pl' and case == 'dat': nsurf = noun_dat_pl(lemma)
    elif g == 'pl': nsurf = NOUN[lemma]["pl"]
    else: nsurf = lemma
    distr_cases = [c for c in ('nom','acc','dat','gen') if c != case]
    cand = [ART_DEF[c][g] for c in distr_cases]
    if initial: art = cap_initial(art); cand = [cap_initial(x) for x in cand]
    opts = build_options(art, cand)
    if not opts: return False
    cue = "(" + gender_cue(lemma) + ")"
    prompt = carrier_de.replace("{A}","___").replace("{N}",nsurf) + " " + cue
    dn = {}
    for c in distr_cases:
        w = cap_initial(ART_DEF[c][g]) if initial else ART_DEF[c][g]
        if w in opts[1:] and w not in dn: dn[w] = {"en": CASE_LABEL[c][0], "es": CASE_LABEL[c][1]}
    cn_en, cn_es = CASE_NAME[case]
    ex_en = f"{rule_en} '{gender_cue(lemma)}' takes the {cn_en} article '{ART_DEF[case][g]}'."
    ex_es = f"{rule_es} '{gender_cue(lemma)}' lleva el artículo {cn_es} '{ART_DEF[case][g]}'."
    add(prompt, opts, ex_en, ex_es, level, carrier_en, rule_en, rule_es, dn)
    return True

for lm in ["Mann","Hund","Apfel","Brief","Freund"]:
    if "person" in NOUN[lm]["flags"]:
        de="Ich sehe {A} {N}."; en=f"I see the {NOUN[lm]['en']}. (direct object)"
    else:
        de="Ich kaufe {A} {N}."; en=f"I'm buying the {NOUN[lm]['en']}. (direct object)"
    def_article_item('acc','m',lm,de,en,"A2",
        "The direct object takes the accusative, where masculine 'der' becomes 'den'.",
        "El objeto directo va en acusativo, donde el masculino 'der' pasa a 'den'.")
for lm in ["Tisch","Stuhl","Zug","Wein","Kopf","Berg","Fluss","Bus"]:
    def_article_item('acc','m',lm,"Ich sehe {A} {N}.",
        f"I see the {NOUN[lm]['en']}. (direct object)","A2",
        "The direct object takes the accusative; masculine 'der' becomes 'den'.",
        "El objeto directo va en acusativo; el masculino 'der' pasa a 'den'.")

DAT_CARRIERS = {'m':("Ich fahre mit {A} {N}.","I'm travelling with the {g}. (mit + dative)"),
 'f':("Ich spreche mit {A} {N}.","I'm speaking with the {g}. (mit + dative)"),
 'n':("Ich spiele mit {A} {N}.","I'm playing with the {g}. (mit + dative)"),
 'pl':("Ich spreche mit {A} {N}.","I'm speaking with the {g}. (mit + dative, plural)")}
DAT_NOUNS = {'m':["Bus","Zug","Hund","Lehrer","Freund"],'f':["Frau","Katze","Zeitung"],
             'n':["Kind","Auto","Telefon"],'pl':["Kind","Freund","Hund"]}
for g,lst in DAT_NOUNS.items():
    for lm in lst:
        de,en = DAT_CARRIERS[g]; en=en.replace("{g}",NOUN[lm]["en"])
        def_article_item('dat',g,lm,de,en,"B1","'mit' always takes the dative.","'mit' siempre rige dativo.")
for lm in ["Mann","Frau","Kind","Junge","Student","Nachbar"]:
    def_article_item('dat',NOUN[lm]["g"],lm,"Ich helfe {A} {N}.",
        f"I help the {NOUN[lm]['en']}. ('helfen' + dative)","B1",
        "'helfen' is a dative verb, so its object takes the dative.",
        "'helfen' rige dativo, así que su objeto va en dativo.")
GEN_CARRIERS = {'m':("Das ist das Auto {A} {N}.","That's the {g}'s car. (genitive)"),
 'f':("Das ist das Haus {A} {N}.","That's the {g}'s house. (genitive)"),
 'n':("Das ist das Spielzeug {A} {N}.","That's the {g}'s toy. (genitive)"),
 'pl':("Das ist das Haus {A} {N}.","That's the {g}s' house. (genitive plural)")}
GEN_NOUNS = {'m':["Mann","Lehrer","Arzt","Freund"],'f':["Frau"],'n':["Kind","Mädchen"],'pl':["Kind","Freund"]}
for g,lst in GEN_NOUNS.items():
    for lm in lst:
        de,en = GEN_CARRIERS[g]; en=en.replace("{g}",NOUN[lm]["en"])
        def_article_item('gen',g,lm,de,en,"B2","Possession uses the genitive.","La posesión usa el genitivo.")
for lm in ["Frau","Auto","Buch","Mann","Blume","Baum","Katze","Zeitung"]:
    def_article_item('dat','pl',lm,"Ich spreche mit {A} {N}.",
        f"I'm speaking with the {NOUN[lm]['en']}s. (dative plural)","B2",
        "In the dative plural the article is 'den' and the noun adds -n (unless it already ends in -n/-s).",
        "En dativo plural el artículo es 'den' y el sustantivo añade -n (salvo que ya acabe en -n/-s).")
for lm in ["Kind","Mann","Frau","Freund","Student","Nachbar"]:
    def_article_item('gen','pl',lm,"Das ist das Haus {A} {N}.",
        f"That's the {NOUN[lm]['en']}s' house. (genitive plural)","B2",
        "The genitive plural article for every gender is 'der'.",
        "El artículo de genitivo plural para todos los géneros es 'der'.")
for lm,g in [("Stadt","f"),("Schule","f"),("Haus","n"),("Land","n")]:
    def_article_item('dat',g,lm,"Ich komme aus {A} {N}.",
        f"I come from the {NOUN[lm]['en']}. (aus + dative)","B1",
        "'aus' always takes the dative.","'aus' siempre rige dativo.")
for lm in ["Baum","Garten","Wald","Kopf" if False else "Stuhl","Brief" if False else "Wein"]:
    def_article_item('acc','m',lm,"Ich kaufe {A} {N}.",
        f"I'm buying the {NOUN[lm]['en']}. (direct object)","A2",
        "The direct object takes the accusative; masculine 'der' becomes 'den'.",
        "El objeto directo va en acusativo; el masculino 'der' pasa a 'den'.")
for lm,g in [("Garten","m"),("Wald","m"),("Buch","n"),("Tür","f"),("Baum","m")]:
    de,en=DAT_CARRIERS[g]; en=en.replace("{g}",NOUN[lm]["en"])
    def_article_item('dat',g,lm,de,en,"B1","'mit' always takes the dative.","'mit' siempre rige dativo.")
for lm in ["Junge","Nachbar","Herr"]:  # weak masc genitive: des Jungen/Nachbarn/Herrn
    def_article_item('gen','m',lm,"Das ist das Auto {A} {N}.",
        f"That's the {NOUN[lm]['en']}'s car. (genitive; weak noun)","C1",
        "Weak (n-declension) masculine nouns take '-(e)n' in the genitive too, with 'des'.",
        "Los sustantivos masculinos débiles (declinación en -n) añaden '-(e)n' también en genitivo, con 'des'.")
print(f"[A] def-article: {len(ITEMS)}", file=sys.stderr); _A=len(ITEMS)

# ---------------------------------------------------------------------------
# BLOCK B — ein-word declension (ein / kein / mein)
# ---------------------------------------------------------------------------
def ein_item(stem, stem_en, case, g, lemma, carrier_de, carrier_en, level, rule_en, rule_es):
    correct = ein_form(stem, case, g)
    nsurf = noun_acc_dat_sg(lemma) if case in ('acc','dat') else (noun_gen_sg(lemma) if case=='gen' else lemma)
    distr_cases = [c for c in ('nom','acc','dat','gen') if c != case]
    cand = [ein_form(stem, c, g) for c in distr_cases]
    opts = build_options(correct, cand)
    if not opts: return False
    cue = "(" + gender_cue(lemma) + ")"
    prompt = carrier_de.replace("{A}","___").replace("{N}",nsurf) + " " + cue
    dn = {}
    for c in distr_cases:
        w = ein_form(stem, c, g)
        if w in opts[1:] and w not in dn: dn[w] = {"en": CASE_LABEL[c][0], "es": CASE_LABEL[c][1]}
    cn_en,cn_es = CASE_NAME[case]
    ex_en = f"{rule_en} With '{gender_cue(lemma)}', the {cn_en} '{stem_en}'-form is '{correct}'."
    ex_es = f"{rule_es} Con '{gender_cue(lemma)}', la forma {cn_es} de '{stem_en}' es '{correct}'."
    add(prompt, opts, ex_en, ex_es, level, carrier_en, rule_en, rule_es, dn)
    return True
for lm in ["Hund","Freund","Computer","Apfel","Brief","Garten"]:
    ein_item("ein","ein",'acc','m',lm,"Ich habe {A} {N}.",
        f"I have a {NOUN[lm]['en']}. (accusative object)","A2",
        "As a direct object an ein-word takes the accusative; masculine becomes 'einen'.",
        "Como objeto directo un artículo indefinido va en acusativo; el masculino es 'einen'.")
for g,lst in {'m':["Bus","Zug","Freund"],'n':["Auto","Kind"]}.items():
    for lm in lst:
        ein_item("ein","ein",'dat',g,lm,"Ich komme mit {A} {N}.",
            f"I'm coming with a {NOUN[lm]['en']}. (mit + dative)","B1","'mit' takes the dative.","'mit' rige dativo.")
for lm,g,carr,en in [("Zeit","f","Ich habe {A} {N}.","I have no time."),
                     ("Auto","n","Ich habe {A} {N}.","I have no car."),
                     ("Hund","m","Ich habe {A} {N}.","I have no dog."),
                     ("Brot","n","Ich habe {A} {N}.","I have no bread.")]:
    ein_item("kein","kein",'acc',g,lm,carr,en,"A2",
        "Negate a no-article noun with 'kein' (declined like 'ein').",
        "Niega un sustantivo sin artículo con 'kein' (declinado como 'ein').")
for lm,g in [("Freund","m"),("Auto","n")]:
    ein_item("mein","my",'gen',g,lm,"Das ist das Haus {A} {N}.",
        f"That's my {NOUN[lm]['en']}'s house. (genitive)","B2",
        "The genitive shows possession; masc./neut. ein-words end in '-es'.",
        "El genitivo indica posesión; los artículos masc./neutros acaban en '-es'.")
print(f"[B] ein-words: {len(ITEMS)-_A}", file=sys.stderr); _B=len(ITEMS)

# ---------------------------------------------------------------------------
# BLOCK C — adjective endings (weak / mixed / strong)
# ---------------------------------------------------------------------------
def adj_item(base, decl, table, case, g, lemma, carrier_de, carrier_en, level, rule_en, rule_es):
    correct = adj_form(base, table[case][g])
    cand = []
    for c2,g2 in [('acc','m'),('nom','m'),('nom','n'),('dat','m'),('nom','f')]:
        cand.append(adj_form(base, table[c2][g2]))
    cand += [adj_form(base, ADJ_STRONG[case][g]), adj_form(base, ADJ_WEAK[case][g]), adj_form(base, ADJ_MIXED[case][g])]
    opts = build_options(correct, cand)
    if not opts: return False
    noun_disp = NOUN[lemma]['pl'] if g=='pl' else lemma
    cue_noun = ("die "+noun_disp) if g=='pl' else gender_cue(lemma)
    cue = f"({base} — {cue_noun})"
    prompt = carrier_de.replace("{ADJ}","___").replace("{N}", noun_disp) + " " + cue
    dn = {}
    for opt in opts[1:]:
        end = adj_ending_of(base, opt); lab = ADJ_END_LABEL.get(end)
        if lab and opt not in dn: dn[opt] = {"en": lab[0], "es": lab[1]}
    add(prompt, opts, rule_en+f" → '{correct} {noun_disp}'.", rule_es+f" → '{correct} {noun_disp}'.",
        level, carrier_en, rule_en, rule_es, dn)
    return True
WEAK_CASES = [
 ('nom','m',"Der {ADJ} {N} liest.","The {a} {n} is reading.","B1"),
 ('acc','m',"Ich sehe den {ADJ} {N}.","I see the {a} {n}.","B2"),
 ('dat','m',"Ich spreche mit dem {ADJ} {N}.","I speak with the {a} {n}.","B2"),
 ('nom','f',"Die {ADJ} {N} lacht.","The {a} {n} is laughing.","B1"),
 ('nom','n',"Das {ADJ} {N} ist neu.","The {a} {n} is new.","B1")]
WEAK_NOUNS={'m':["Mann","Hund"],'f':["Frau","Katze"],'n':["Auto","Kind"]}
for case,g,de,en,lvl in WEAK_CASES:
    for lm in WEAK_NOUNS[g][:2]:
        for base in ["gut","alt","klein"]:
            en2=en.replace("{a}",ADJ[base]["en"]).replace("{n}",NOUN[lm]["en"])
            adj_item(base,'weak',ADJ_WEAK,case,g,lm,de,en2,lvl,
                f"After a definite article the adjective takes weak endings ({CASE_NAME[case][0]} {g})",
                f"Tras artículo definido el adjetivo lleva terminaciones débiles ({CASE_NAME[case][1]})")
EXTRA_WEAK=[('acc','f',"Ich sehe die {ADJ} {N}.","I see the {a} {n}.","B2","Frau"),
 ('acc','n',"Ich lese das {ADJ} {N}.","I'm reading the {a} {n}.","B2","Buch"),
 ('dat','f',"Ich spreche mit der {ADJ} {N}.","I speak with the {a} {n}.","B2","Frau"),
 ('nom','pl',"Die {ADJ} {N} spielen draußen.","The {a} {n}s play outside.","B2","Kind"),
 ('nom','pl',"Die {ADJ} {N} stehen im Garten.","The {a} {n}s stand in the garden.","B2","Baum")]
for case,g,de,en,lvl,lm in EXTRA_WEAK:
    for base in ["gut","alt","schön"]:
        en2=en.replace("{a}",ADJ[base]["en"]).replace("{n}",NOUN[lm]["en"])
        adj_item(base,'weak',ADJ_WEAK,case,g,lm,de,en2,lvl,
            f"After a definite article the adjective is weak ({CASE_NAME[case][0]} {g})",
            f"Tras artículo definido el adjetivo es débil ({CASE_NAME[case][1]})")
MIXED_CASES=[('nom','m',"Das ist ein {ADJ} {N}.","That's a {a} {n}.","B2"),
 ('nom','n',"Das ist ein {ADJ} {N}.","That's a {a} {n}.","B2"),
 ('acc','m',"Ich habe einen {ADJ} {N} gekauft.","I bought a {a} {n}.","B2")]
MIXED_NOUNS={'m':["Hund","Tisch"],'n':["Buch","Auto"]}
for case,g,de,en,lvl in MIXED_CASES:
    for lm in MIXED_NOUNS[g]:
        for base in ["neu","gut","teuer"]:
            en2=en.replace("{a}",ADJ[base]["en"]).replace("{n}",NOUN[lm]["en"])
            adj_item(base,'mixed',ADJ_MIXED,case,g,lm,de,en2,lvl,
                f"After 'ein' (no ending of its own) the adjective shows gender via a mixed ending ({CASE_NAME[case][0]} {g})",
                f"Tras 'ein' (sin terminación propia) el adjetivo marca el género con terminación mixta ({CASE_NAME[case][1]})")
EXTRA_MIXED=[('nom','f',"Das ist eine {ADJ} {N}.","That's a {a} {n}.","B2","Katze"),
 ('dat','m',"Ich fahre mit einem {ADJ} {N}.","I'm travelling with a {a} {n}.","C1","Bus"),
 ('acc','n',"Ich habe ein {ADJ} {N} gekauft.","I bought a {a} {n}.","B2","Auto")]
for case,g,de,en,lvl,lm in EXTRA_MIXED:
    for base in ["gut","neu","klein"]:
        en2=en.replace("{a}",ADJ[base]["en"]).replace("{n}",NOUN[lm]["en"])
        adj_item(base,'mixed',ADJ_MIXED,case,g,lm,de,en2,lvl,
            f"After 'ein' the adjective takes a mixed ending ({CASE_NAME[case][0]} {g})",
            f"Tras 'ein' el adjetivo lleva terminación mixta ({CASE_NAME[case][1]})")
STRONG_CASES=[('nom','m',"{ADJ} {N} schmeckt gut.","{a} {n} tastes good.","B2"),
 ('nom','n',"{ADJ} {N} schmeckt gut.","{a} {n} tastes good.","B2"),
 ('nom','f',"{ADJ} {N} ist gesund.","{a} {n} is healthy.","B2")]
STRONG_NOUNS={'m':["Wein","Kaffee"],'n':["Bier","Brot","Wasser"],'f':["Milch"]}
for case,g,de,en,lvl in STRONG_CASES:
    for lm in STRONG_NOUNS[g]:
        for base in ["kalt","gut","frisch"]:
            en2=en.replace("{a}",ADJ[base]["en"]).replace("{n}",NOUN[lm]["en"])
            adj_item(base,'strong',ADJ_STRONG,case,g,lm,de,en2,lvl,
                f"With no article the adjective takes a strong ending that carries the gender ({CASE_NAME[case][0]} {g})",
                f"Sin artículo el adjetivo toma terminación fuerte que marca el género ({CASE_NAME[case][1]})")
EXTRA_STRONG=[('acc','m',"Ich trinke {ADJ} {N}.","I drink {a} {n}.","C1","Wein"),
 ('dat','m',"Ich koche mit {ADJ} {N}.","I cook with {a} {n}.","C1","Wein"),
 ('nom','pl',"{ADJ} {N} sind gesund.","{a} {n}s are healthy.","B2","Apfel")]
for case,g,de,en,lvl,lm in EXTRA_STRONG:
    for base in ["gut","kalt","frisch"]:
        en2=en.replace("{a}",ADJ[base]["en"]).replace("{n}",NOUN[lm]["en"])
        adj_item(base,'strong',ADJ_STRONG,case,g,lm,de,en2,lvl,
            f"With no article the adjective takes a strong ending ({CASE_NAME[case][0]} {g})",
            f"Sin artículo el adjetivo toma terminación fuerte ({CASE_NAME[case][1]})")
# plural adjective cells — use plural nouns ending in -n/-s (no dative -n change)
PL_ADJ=[('nom','pl','weak',ADJ_WEAK,"Die {ADJ} {N} sind schön.","The {a} {n}s are beautiful.","B2","Blume"),
 ('acc','pl','weak',ADJ_WEAK,"Ich sehe die {ADJ} {N}.","I see the {a} {n}s.","B2","Katze"),
 ('dat','pl','weak',ADJ_WEAK,"Ich spreche mit den {ADJ} {N}.","I speak with the {a} {n}s.","C1","Frau"),
 ('nom','pl','strong',ADJ_STRONG,"{ADJ} {N} sind teuer.","{a} {n}s are expensive.","B2","Auto"),
 ('dat','pl','strong',ADJ_STRONG,"Ich komme mit {ADJ} {N}.","I'm coming with {a} {n}s.","C1","Blume")]
for case,g,decl,tbl,de,en,lvl,lm in PL_ADJ:
    for base in ["gut","schön","klein"]:
        en2=en.replace("{a}",ADJ[base]["en"]).replace("{n}",NOUN[lm]["en"])
        adj_item(base,decl,tbl,case,g,lm,de,en2,lvl,
            f"Adjective plural endings: the {decl} declension ({CASE_NAME[case][0]} plural)",
            f"Terminaciones de plural del adjetivo: declinación {decl} ({CASE_NAME[case][1]} plural)")
# a few more mixed/weak singular cells with fresh nouns/adjectives
EXTRA_C=[('nom','m','weak',ADJ_WEAK,"Der {ADJ} {N} steht dort.","The {a} {n} stands there.","B1","Baum"),
 ('nom','n','mixed',ADJ_MIXED,"Das ist ein {ADJ} {N}.","That's a {a} {n}.","B2","Telefon"),
 ('nom','m','strong',ADJ_STRONG,"{ADJ} {N} ist gut.","{a} {n} is good.","B2","Kaffee")]
for case,g,decl,tbl,de,en,lvl,lm in EXTRA_C:
    for base in ["schön","warm","stark"]:
        en2=en.replace("{a}",ADJ[base]["en"]).replace("{n}",NOUN[lm]["en"])
        adj_item(base,decl,tbl,case,g,lm,de,en2,lvl,
            f"Adjective ending: {decl} declension ({CASE_NAME[case][0]} {g})",
            f"Terminación del adjetivo: declinación {decl} ({CASE_NAME[case][1]} {g})")
print(f"[C] adjectives: {len(ITEMS)-_B}", file=sys.stderr); _C=len(ITEMS)

# ---------------------------------------------------------------------------
# BLOCK D — verb Präsens person conjugation
# ---------------------------------------------------------------------------
PRES_SUBJ = {'ich':("Ich {V} {X}.","I {e}"),'du':("{Cap} du {X}?","{e}"),
 'er':("Er {V} {X}.","He {e}"),'wir':("Wir {V} {X}.","We {e}"),
 'ihr':("Ihr {V} {X}.","You (pl.) {e}"),'sie':("Sie {V} {X}.","They {e}")}
PRES_FILL = {"machen":"das oft","spielen":"Fußball","kaufen":"Brot","lernen":"Deutsch",
 "wohnen":"in Berlin","arbeiten":"viel","fahren":"nach Hause","sehen":"den Film",
 "geben":"mir das Buch","nehmen":"den Bus","lesen":"ein Buch","sprechen":"Deutsch",
 "essen":"einen Apfel","schlafen":"lange","laufen":"schnell","trinken":"Wasser",
 "helfen":"der Frau","kommen":"heute","gehen":"nach Hause","sagen":"nichts",
 "finden":"den Weg","tragen":"eine Tasche","waschen":"das Auto","singen":"ein Lied",
 "hören":"Musik","kochen":"das Essen","brauchen":"Hilfe","suchen":"den Schlüssel",
 "schreiben":"einen Brief","bleiben":"zu Hause","denken":"an dich","bringen":"das Buch"}
PRES_VERBS = list(PRES_FILL.keys())
persons_cycle = ["du","er","wir","ihr","sie","ich"]
PRES_PLAN = [(inf, persons_cycle[i % 6]) for i,inf in enumerate(PRES_VERBS)]
for i,inf in enumerate(PRES_VERBS):   # second, different person for every verb
    PRES_PLAN.append((inf, persons_cycle[(i+3) % 6]))
def pres_item(inf, person, level):
    correct = present(inf, person)
    others = [q for q in ("ich","du","er","wir","ihr","sie") if q != person]
    cand = [present(inf, q) for q in others]
    opts = build_options(correct, cand)
    if not opts: return False
    tmpl_de, tmpl_en = PRES_SUBJ[person]; x = PRES_FILL[inf]
    if person == "du":
        prompt = tmpl_de.format(Cap="___", X=x).replace("{V}","___")
    else:
        prompt = tmpl_de.replace("{V}","___").replace("{X}",x)
    prompt = prompt + f" ({inf})"
    dn = {}
    for q in others:
        w = present(inf, q)
        if w in opts[1:] and w not in dn: dn[w] = {"en": PERSON_LABEL[q][0], "es": PERSON_LABEL[q][1]}
    en_gloss = tmpl_en.replace("{e}", f"___ ({VERB[inf]['en']})")
    chip = mk_chip('praesens', f"present tense of '{inf}' ({VERB[inf]['en']})",
                   f"Präsens von '{inf}'", person)
    add(prompt, opts,
        f"In the present, the '{person}' form of '{inf}' ({VERB[inf]['en']}) is '{correct}'.",
        f"En presente, la forma '{person}' de '{inf}' ({VERB[inf]['es']}) es '{correct}'.",
        level, en_gloss, f"The subject is '{person}', so use '{correct}'.",
        f"El sujeto es '{person}', así que se usa '{correct}'.", dn, chip)
    return True
A1_PRES = {"machen","spielen","kaufen","lernen","wohnen","kommen","gehen","sagen","hören","trinken","essen"}
for inf,p in PRES_PLAN:
    pres_item(inf, p, "A1" if (inf in A1_PRES and p in ("ich","du","er")) else "A2")
print(f"[D] präsens: {len(ITEMS)-_C}", file=sys.stderr); _D=len(ITEMS)

# ---------------------------------------------------------------------------
# BLOCK E — Perfekt (participle) + aux choice
# ---------------------------------------------------------------------------
PERF_PP_VERBS = ["machen","spielen","kaufen","lernen","arbeiten","sehen","lesen","essen",
 "trinken","schreiben","sprechen","nehmen","finden","singen","besuchen","studieren",
 "anrufen","einkaufen","waschen","tragen","kochen","hören","fragen","suchen","brauchen",
 "sagen","denken","bringen","helfen","geben"]
def perf_pp_item(inf, level):
    v = VERB[inf]; correct = v["pp"]
    st = STEM(inf if not v["sep"] else inf[len(v["sep"]):])
    wrong_t = ("ge"+st+"t") if not v["sep"] else (v["sep"]+"ge"+STEM(inf[len(v["sep"]):])+"t")
    cand = [inf, v["praet"], wrong_t, "ge"+st+"en"]
    opts = build_options(correct, cand)
    if not opts: return False
    obj = PRES_FILL.get(inf,"").strip(); aux_w = "habe" if v["aux"]=="haben" else "bin"
    prompt = f"Ich {aux_w} {obj+' ' if obj else ''}___. ({inf})"
    dn = {}
    if inf in opts[1:]: dn[inf]={"en":FORM_LABEL['inf'][0],"es":FORM_LABEL['inf'][1]}
    if v["praet"] in opts[1:] and v["praet"] not in dn: dn[v["praet"]]={"en":FORM_LABEL['praet'][0],"es":FORM_LABEL['praet'][1]}
    for w in opts[1:]:
        if w not in dn: dn[w]={"en":"an incorrectly formed participle","es":"un participio mal formado"}
    add(prompt,opts,
        f"The Perfekt puts the past participle at the end: '{inf}' ({VERB[inf]['en']}) → '{correct}'.",
        f"El Perfekt pone el participio al final: '{inf}' ({VERB[inf]['es']}) → '{correct}'.",
        level, f"I have ___ ({VERB[inf]['en']}).",
        "The Perfekt participle goes at the end of the clause.",
        "El participio del Perfekt va al final de la oración.", dn,
        mk_chip('perfekt', f"the past participle that closes the Perfekt of '{inf}'",
                f"Partizip II im Perfekt von '{inf}'"))
    return True
for inf in PERF_PP_VERBS:
    perf_pp_item(inf, "B1" if VERB[inf]["cls"] in ("strong","mixed") or VERB[inf]["sep"] else "A2")
AUX_VERBS = [("gehen","nach Hause"),("fahren","nach Berlin"),("kommen","zu spät"),
 ("laufen","schnell"),("bleiben","zu Hause"),("fliegen","nach Rom"),("reisen","viel"),
 ("schwimmen","im See"),("machen","das"),("essen","zu viel"),("kaufen","ein Auto"),
 ("arbeiten","den ganzen Tag")]
def aux_item(inf, tail, level):
    v = VERB[inf]; correct = "bin" if v["aux"]=="sein" else "habe"
    opts = build_options(correct, [c for c in ["bin","habe","war","hatte"] if c!=correct])
    if not opts: return False
    prompt = f"Ich ___ {tail} {v['pp']}. ({inf})"; other = "habe" if correct=="bin" else "bin"
    dn = {
      other:{"en":FORM_LABEL['wrongaux'][0]+f" — '{inf}' uses '{v['aux']}'","es":FORM_LABEL['wrongaux'][1]+f" — '{inf}' usa '{v['aux']}'"},
      "war":{"en":"the Präteritum of 'sein', not the Perfekt auxiliary here","es":"el Präteritum de 'sein', no el auxiliar del Perfekt"},
      "hatte":{"en":"the Präteritum of 'haben', not the Perfekt auxiliary here","es":"el Präteritum de 'haben', no el auxiliar del Perfekt"},
    }
    dn = {k:v2 for k,v2 in dn.items() if k in opts[1:]}
    r_en = "verbs of motion/change of state build the Perfekt with 'sein'" if v["aux"]=="sein" else "most verbs build the Perfekt with 'haben'"
    r_es = "los verbos de movimiento/cambio de estado forman el Perfekt con 'sein'" if v["aux"]=="sein" else "la mayoría de los verbos forman el Perfekt con 'haben'"
    add(prompt,opts,
        f"'{inf}' ({VERB[inf]['en']}) — {r_en}: 'ich {correct} … {v['pp']}'.",
        f"'{inf}' ({VERB[inf]['es']}) — {r_es}: 'ich {correct} … {v['pp']}'.",
        level, f"I have/am ___ {VERB[inf]['en']}.", r_en.capitalize()+".", r_es.capitalize()+".", dn,
        mk_chip('perfekt', f"choosing the Perfekt auxiliary ('{v['aux']}') for '{inf}'",
                f"Perfekt-Hilfsverb ('{v['aux']}') von '{inf}'", 'ich'))
    return True
for inf,tail in AUX_VERBS: aux_item(inf,tail,"B1")
print(f"[E] perfekt: {len(ITEMS)-_D}", file=sys.stderr); _E=len(ITEMS)

# ---------------------------------------------------------------------------
# BLOCK F — Präteritum
# ---------------------------------------------------------------------------
def praet_person(inf, person):
    v = VERB[inf]; base = v["praet"]
    core = base.split()[0] if v["sep"] else base
    def attach(x): return f"{x} {v['sep']}" if v["sep"] else x
    if core.endswith("te"):   # weak / modal / mixed / haben(hatte) / werden(wurde)
        rootless = core[:-2]
        forms = {"ich":core,"er":core,"du":rootless+"test","wir":rootless+"ten","sie":rootless+"ten","ihr":rootless+"tet"}
    else:                      # strong / sein(war): -est after a d/t stem (du fandest, standest)
        e = "est" if core[-1] in "td" else "st"
        forms = {"ich":core,"er":core,"du":core+e,"wir":core+"en","sie":core+"en",
                 "ihr":core+("et" if core[-1] in "td" else "t")}
    return attach(forms[person])
PRAET_VERBS = ["gehen","kommen","sehen","geben","nehmen","essen","trinken","finden",
 "sprechen","schreiben","fahren","bleiben","singen","machen","kaufen","arbeiten",
 "spielen","lesen","denken","bringen"]
def praet_item(inf, person, level):
    correct = praet_person(inf, person)
    others=[q for q in ("ich","du","er","wir","ihr") if q!=person]
    cand=[praet_person(inf,q) for q in others] + [present(inf,person), VERB[inf]["pp"]]
    opts=build_options(correct,cand)
    if not opts: return False
    subj={"ich":"ich","du":"du","er":"er","wir":"wir","ihr":"ihr","sie":"sie"}[person]
    obj=PRES_FILL.get(inf,'').strip()
    prompt=f"Gestern ___ {subj}{(' '+obj) if obj else ''}. ({inf})"
    dn={}
    for q in others:
        w=praet_person(inf,q)
        if w in opts[1:] and w not in dn: dn[w]={"en":PERSON_LABEL[q][0]+" (past)","es":PERSON_LABEL[q][1]+" (pasado)"}
    if present(inf,person) in opts[1:] and present(inf,person) not in dn: dn[present(inf,person)]={"en":FORM_LABEL['pres'][0],"es":FORM_LABEL['pres'][1]}
    if VERB[inf]["pp"] in opts[1:] and VERB[inf]["pp"] not in dn: dn[VERB[inf]["pp"]]={"en":FORM_LABEL['pp'][0],"es":FORM_LABEL['pp'][1]}
    add(prompt,opts,
        f"The Präteritum (simple past) '{person}' form of '{inf}' ({VERB[inf]['en']}) is '{correct}'.",
        f"La forma de Präteritum (pasado simple) '{person}' de '{inf}' ({VERB[inf]['es']}) es '{correct}'.",
        level,f"Yesterday {PERSON_EN[person]} ___ ({VERB[inf]['en']}).",
        f"Use the Präteritum '{person}' form → '{correct}'.",
        f"Usa la forma de Präteritum '{person}' → '{correct}'.",dn,
        mk_chip('praeteritum', f"simple past (Präteritum) of '{inf}'", f"Präteritum von '{inf}'", person))
    return True
for i,inf in enumerate(PRAET_VERBS):
    praet_item(inf, ["ich","er","wir","du","ich","er"][i%6], "B2" if VERB[inf]["cls"] in ("strong","mixed") else "B1")
# second pass — a different person for the first 6 verbs (distinct subject → distinct prompt)
for i,inf in enumerate(PRAET_VERBS[:6]):
    praet_item(inf, ["wir","du","ich","er","wir","du"][i%6], "B2" if VERB[inf]["cls"] in ("strong","mixed") else "B1")
print(f"[F] präteritum: {len(ITEMS)-_E}", file=sys.stderr); _F=len(ITEMS)

# ---------------------------------------------------------------------------
# BLOCK G — Plusquamperfekt
# ---------------------------------------------------------------------------
for inf in ["essen","gehen","kommen","machen","arbeiten","fahren","lesen","schreiben","ankommen","aufstehen"]:
    v=VERB[inf]; correct = "war" if v["aux"]=="sein" else "hatte"
    opts=build_options(correct,[c for c in ["hatte","war","habe","bin","hätte","wäre"] if c!=correct])
    if not opts: continue
    prompt=f"Nachdem ich {v['pp']} ___, ging ich weiter. ({inf})"
    dn={}; other = "hatte" if correct=="war" else "war"
    if other in opts[1:]: dn[other]={"en":f"the wrong auxiliary — '{inf}' uses '{v['aux']}'","es":f"el auxiliar incorrecto — '{inf}' usa '{v['aux']}'"}
    for w,le,ls in [("habe","the present of 'haben', not the past-perfect auxiliary","el presente de 'haben', no el auxiliar del pluscuamperfecto"),
                    ("bin","the present of 'sein', not the past-perfect auxiliary","el presente de 'sein', no el auxiliar del pluscuamperfecto"),
                    ("hätte","the Konjunktiv II of 'haben', not the indicative here","el Konjunktiv II de 'haben', no el indicativo aquí"),
                    ("wäre","the Konjunktiv II of 'sein', not the indicative here","el Konjunktiv II de 'sein', no el indicativo aquí")]:
        if w in opts[1:] and w not in dn: dn[w]={"en":le,"es":ls}
    reason_en="'sein'-verb" if v["aux"]=="sein" else "'haben'-verb"
    add(prompt,opts,
        f"The Plusquamperfekt = Präteritum of the auxiliary + participle. '{inf}' is a {reason_en}, so 'ich {correct} … {v['pp']}'.",
        f"El Plusquamperfekt = Präteritum del auxiliar + participio. '{inf}' usa '{v['aux']}', así que 'ich {correct} … {v['pp']}'.",
        "C1",f"After I had … , I went on. (past perfect of '{inf}')",
        "Plusquamperfekt = past-tense auxiliary + participle.",
        "Plusquamperfekt = auxiliar en pasado + participio.",dn,
        mk_chip('plusquam', f"the past-perfect auxiliary for '{inf}'", f"Plusquamperfekt-Hilfsverb von '{inf}'", 'ich'))
print(f"[G] plusquam: {len(ITEMS)-_F}", file=sys.stderr); _G=len(ITEMS)

# ---------------------------------------------------------------------------
# BLOCK H — Futur I
# ---------------------------------------------------------------------------
for person,inf in [("ich","machen"),("du","kommen"),("er","fahren"),("wir","reisen"),
 ("ihr","spielen"),("sie","arbeiten"),("ich","studieren"),("er","lernen"),
 ("du","helfen"),("wir","essen"),("ich","besuchen"),("er","schreiben")]:
    correct=present("werden",person)
    others=[q for q in ("ich","du","er","wir","ihr","sie") if q!=person]
    opts=build_options(correct,[present("werden",q) for q in others]+["wurde","will"])
    if not opts: continue
    subj={"ich":"ich","du":"du","er":"er","wir":"wir","ihr":"ihr","sie":"sie"}[person]
    obj=PRES_FILL.get(inf,'').strip()
    prompt=f"Morgen ___ {subj} {obj+' ' if obj else ''}{inf}. ({inf})"
    dn={}
    for q in others:
        w=present("werden",q)
        if w in opts[1:] and w not in dn: dn[w]={"en":PERSON_LABEL[q][0]+" of 'werden'","es":PERSON_LABEL[q][1]+" de 'werden'"}
    if "wurde" in opts[1:]: dn["wurde"]={"en":"the Präteritum of 'werden', not the future","es":"el Präteritum de 'werden', no el futuro"}
    if "will" in opts[1:]: dn["will"]={"en":"'will' = wants to (modal), not the future auxiliary","es":"'will' = quiere (modal), no el auxiliar de futuro"}
    add(prompt,opts,
        f"Futur I = 'werden' (conjugated) + infinitive at the end. With '{person}' → '{correct} … {inf}'.",
        f"Futur I = 'werden' (conjugado) + infinitivo al final. Con '{person}' → '{correct} … {inf}'.",
        "B2",f"Tomorrow {PERSON_EN[person]} will ___ ({VERB[inf]['en']}).",
        f"Futur I uses 'werden' + infinitive; '{person}' → '{correct}'.",
        f"El Futur I usa 'werden' + infinitivo; '{person}' → '{correct}'.",dn,
        mk_chip('futur', "conjugating 'werden' for the future", "'werden' im Futur I", person))
print(f"[H] futur: {len(ITEMS)-_G}", file=sys.stderr); _H=len(ITEMS)

# ---------------------------------------------------------------------------
# BLOCK I — Konjunktiv II
# ---------------------------------------------------------------------------
K2_ONEWORD=[("sein","wäre","Wenn ich reich ___, würde ich reisen.","If I were rich, I'd travel.",["war","bin","sein"],"C1","ich"),
 ("haben","hätte","Wenn ich mehr Zeit ___, würde ich mehr lesen.","If I had more time, I'd read more.",["habe","hatte","haben"],"C1","ich"),
 ("kommen","käme","An deiner Stelle ___ ich früher.","In your place I'd come earlier.",["kam","komme","kommt"],"C2","ich"),
 ("gehen","ginge","Ich ___ lieber zu Fuß, wenn es näher wäre.","I'd rather walk if it were closer.",["ging","gehe","geht"],"C2","ich"),
 ("geben","gäbe","Es ___ viel zu tun, wenn wir anfingen.","There would be a lot to do if we started.",["gab","gibt","gebe"],"C2","er"),
 ("können","könnte","___ du mir bitte helfen?","Could you help me, please?",["kannst","konntest","kann"],"B2","du"),
 ("müssen","müsste","Das ___ eigentlich funktionieren.","That really ought to work.",["muss","musste","müssen"],"C1","er"),
 ("mögen","möchte","Ich ___ einen Kaffee, bitte.","I'd like a coffee, please.",["mag","mochte","möge"],"A2","ich")]
for inf,correct,de,en,distr,lvl,person in K2_ONEWORD:
    opts=build_options(correct,distr)
    if not opts: continue
    prompt=(de.replace(correct,"___",1) if correct in de else de)+f" ({inf})"
    if "___" not in prompt: prompt=de.replace(correct,"___",1)+f" ({inf})"
    dn={}
    for w in opts[1:]:
        if w==VERB[inf]["praet"]: dn[w]={"en":"the indicative Präteritum, not the subjunctive","es":"el Präteritum de indicativo, no el subjuntivo"}
        elif w in (present(inf,"ich"),present(inf,"er"),present(inf,"du")): dn[w]={"en":"an indicative present form, not Konjunktiv II","es":"una forma de presente de indicativo, no Konjunktiv II"}
        else: dn[w]={"en":"not the Konjunktiv II form","es":"no es la forma de Konjunktiv II"}
    add(prompt,opts,
        f"Hypotheticals, wishes and polite requests use Konjunktiv II. '{inf}' ({VERB[inf]['en']}) → the one-word K II '{correct}'.",
        f"Las hipótesis, deseos y peticiones corteses usan Konjunktiv II. '{inf}' ({VERB[inf]['es']}) → la forma de una palabra '{correct}'.",
        lvl,en,"Use the one-word Konjunktiv II here.","Usa la forma de una palabra del Konjunktiv II.",dn,
        mk_chip('k2', f"one-word Konjunktiv II of '{inf}'", f"Einwort-Konjunktiv II von '{inf}'", person))
WUERDE=[("ich","kaufen","Wenn ich Geld hätte, ___ ich ein Haus kaufen.","If I had money, I would buy a house."),
 ("er","spielen","Er ___ lieber Fußball spielen.","He would rather play football."),
 ("wir","reisen","Wir ___ gern nach Japan reisen.","We would like to travel to Japan."),
 ("du","arbeiten","___ du weniger arbeiten, wenn du könntest?","Would you work less if you could?")]
WFORM={"ich":"würde","du":"würdest","er":"würde","wir":"würden","ihr":"würdet","sie":"würden"}
WERD={"ich":"werde","du":"wirst","er":"wird","wir":"werden","ihr":"werdet","sie":"werden"}
WILL={"ich":"will","du":"willst","er":"will","wir":"wollen","ihr":"wollt","sie":"wollen"}
for person,inf,de,en in WUERDE:
    correct=WFORM[person]
    opts=build_options(correct,[c for c in [WERD[person],"wurde",WILL[person]] if c!=correct])
    if not opts: continue
    prompt=de+f" ({inf})"
    dn={}
    for w,le,ls in [(WERD[person],"the indicative future/present of 'werden', not the subjunctive","el futuro/presente de indicativo de 'werden', no el subjuntivo"),
                    ("wurde","the Präteritum of 'werden', not Konjunktiv II","el Präteritum de 'werden', no Konjunktiv II"),
                    (WILL[person],"'wollen' (to want), a different modal","'wollen' (querer), otro modal")]:
        if w in opts[1:] and w not in dn: dn[w]={"en":le,"es":ls}
    add(prompt,opts,
        f"Weak verbs use 'würde' + infinitive for Konjunktiv II. With '{person}' → '{correct} … {inf}'.",
        f"Los verbos débiles usan 'würde' + infinitivo para el Konjunktiv II. Con '{person}' → '{correct} … {inf}'.",
        "B2",en,f"Use 'würde' ('{person}' form) + infinitive.",f"Usa 'würde' (forma '{person}') + infinitivo.",dn,
        mk_chip('k2', f"'würde' + infinitive (Konjunktiv II of the weak verb '{inf}')", f"'würde' + Infinitiv (Konjunktiv II von '{inf}')", person))
print(f"[I] konjunktiv II: {len(ITEMS)-_H}", file=sys.stderr); _I=len(ITEMS)

# ---------------------------------------------------------------------------
# BLOCK J — two-way prepositions (acc motion vs dat location)
# ---------------------------------------------------------------------------
ALL_ART=["der","die","das","den","dem","des"]
TWOWAY=[
 ("in","Park","m",True,"Ich gehe in ___ Park.","den","I'm going into the park. (motion)"),
 ("in","Park","m",False,"Ich spiele in ___ Park.","dem","I'm playing in the park. (location)"),
 ("auf","Tisch","m",True,"Ich lege das Buch auf ___ Tisch.","den","I put the book onto the table. (motion)"),
 ("auf","Tisch","m",False,"Das Buch liegt auf ___ Tisch.","dem","The book lies on the table. (location)"),
 ("an","Wand","f",True,"Ich hänge das Bild an ___ Wand.","die","I hang the picture onto the wall. (motion)"),
 ("an","Wand","f",False,"Das Bild hängt an ___ Wand.","der","The picture hangs on the wall. (location)"),
 ("in","Schule","f",True,"Ich gehe in ___ Schule.","die","I'm going into the school. (motion)"),
 ("in","Schule","f",False,"Ich bin in ___ Schule.","der","I am in the school. (location)"),
 ("in","Haus","n",True,"Ich gehe in ___ Haus.","das","I'm going into the house. (motion)"),
 ("in","Haus","n",False,"Ich wohne in ___ Haus.","dem","I live in the house. (location)"),
 ("neben","Auto","n",False,"Ich stehe neben ___ Auto.","dem","I'm standing next to the car. (location)"),
 ("unter","Tisch","m",False,"Die Katze schläft unter ___ Tisch.","dem","The cat sleeps under the table. (location)"),
 ("vor","Haus","n",False,"Ich warte vor ___ Haus.","dem","I'm waiting in front of the house. (location)"),
 ("hinter","Garten","m",False,"Der Weg liegt hinter ___ Garten.","dem","The path is behind the garden. (location)"),
 ("über","Stadt","f",False,"Das Flugzeug fliegt über ___ Stadt.","der","The plane flies over the city. (location)"),
 ("auf","Berg","m",True,"Wir steigen auf ___ Berg.","den","We're climbing up the mountain. (motion)"),
 ("in","Garten","m",True,"Die Kinder laufen in ___ Garten.","den","The children run into the garden. (motion)"),
 ("an","Fluss","m",True,"Wir gehen an ___ Fluss.","den","We're going to the river. (motion)"),
 ("an","Fluss","m",False,"Wir sitzen an ___ Fluss.","dem","We're sitting by the river. (location)"),
]
for prep,lm,g,motion,de,corr,en in TWOWAY:
    case_of={ART_DEF['acc'][g]:'acc',ART_DEF['dat'][g]:'dat',ART_DEF['nom'][g]:'nom',ART_DEF['gen'][g]:'gen'}
    opts=build_options(corr,[a for a in ALL_ART if a!=corr])
    if not opts: continue
    cue="("+gender_cue(lm)+")"; prompt=de+" "+cue
    art0=gender_cue(lm).split()[0]
    dn={}
    for w in opts[1:]:
        if w in case_of and w not in dn: c=case_of[w]; dn[w]={"en":CASE_LABEL[c][0],"es":CASE_LABEL[c][1]}
        elif w not in dn: dn[w]={"en":f"'{w}' is not an article for {art0}-nouns here","es":f"'{w}' no es un artículo para sustantivos con '{art0}' aquí"}
    if motion:
        ex_en=f"With motion toward a goal, the two-way preposition '{prep}' takes the ACCUSATIVE → '{prep} {corr} {lm}'."
        ex_es=f"Con movimiento hacia una meta, la preposición de doble régimen '{prep}' rige ACUSATIVO → '{prep} {corr} {lm}'."
        wn_en=f"Motion → '{prep}' + accusative → {prep} {corr} {lm}."; wn_es=f"Movimiento → '{prep}' + acusativo → {prep} {corr} {lm}."
    else:
        ex_en=f"With a fixed location (no motion), the two-way preposition '{prep}' takes the DATIVE → '{prep} {corr} {lm}'."
        ex_es=f"Con ubicación fija (sin movimiento), '{prep}' rige DATIVO → '{prep} {corr} {lm}'."
        wn_en=f"Location → '{prep}' + dative → {prep} {corr} {lm}."; wn_es=f"Ubicación → '{prep}' + dativo → {prep} {corr} {lm}."
    add(prompt,opts,ex_en,ex_es,"B1",en,wn_en,wn_es,dn)
print(f"[J] two-way preps: {len(ITEMS)-_I}", file=sys.stderr); _J=len(ITEMS)

# ---------------------------------------------------------------------------
# BLOCK K — comparative / superlative
# ---------------------------------------------------------------------------
def comp_forms(base): return COMP[base] if base in COMP else (base+"er", base+"st")
COMP_PRED=[("alt","Mein Bruder ist ___ als ich.","My brother is older than me."),
 ("groß","Berlin ist ___ als München.","Berlin is bigger than Munich."),
 ("gut","Der Kaffee ist ___ als der Tee.","The coffee is better than the tea."),
 ("schnell","Sie läuft ___ als er.","She runs faster than him."),
 ("warm","Heute ist es ___ als gestern.","Today it's warmer than yesterday."),
 ("jung","Meine Schwester ist ___ als ich.","My sister is younger than me."),
 ("lang","Der Fluss ist ___ als der Bach.","The river is longer than the stream."),
 ("kalt","Der Winter ist ___ als der Herbst.","Winter is colder than autumn."),
 ("stark","Der Kaffee ist ___ als der Tee.","The coffee is stronger than the tea."),
 ("kurz","Der Weg ist ___ als gedacht.","The way is shorter than expected."),
 ("klug","Sie ist ___ als ihr Bruder.","She is cleverer than her brother.")]
IRR_COMP={"gut","viel","hoch","alt","jung","groß","lang","kalt","warm","stark","kurz","klug","nah"}
for base,de,en in COMP_PRED:
    comp,sup=comp_forms(base)
    cand=[base, "am "+sup+"en", comp+"er", sup+"e"]
    opts=build_options(comp,[c for c in cand if c!=comp])
    if not opts: continue
    prompt=de+f" ({base})"
    dn={}
    if base in opts[1:]: dn[base]={"en":"the plain (positive) form, not a comparative","es":"la forma positiva, no un comparativo"}
    for w in opts[1:]:
        if w in dn: continue
        if w.startswith("am "): dn[w]={"en":"the predicative superlative ('am …sten'), not the comparative","es":"el superlativo predicativo ('am …sten'), no el comparativo"}
        elif w==comp+"er": dn[w]={"en":"a double comparative (already -er) — incorrect","es":"un comparativo doble (ya lleva -er) — incorrecto"}
        elif w==sup+"e": dn[w]={"en":"an attributive superlative form, not the comparative","es":"una forma de superlativo atributivo, no el comparativo"}
        else: dn[w]={"en":"not the correct comparative form","es":"no es el comparativo correcto"}
    irr = " (irregular)" if base in IRR_COMP else ""
    add(prompt,opts,
        f"The comparative of '{base}' is '{comp}'{irr}, paired with 'als' (than).",
        f"El comparativo de '{base}' es '{comp}'{(' (irregular)' if irr else '')}, con 'als' (que).",
        "A2" if base in ("alt","groß","gut","schnell","warm","jung") else "B1",
        en,f"Comparative → '{comp} … als'.",f"Comparativo → '{comp} … als'.",dn)
SUP_ATTR=[("hoch","Berg","m","der","Der Mount Everest ist der ___ Berg der Welt.","the highest mountain"),
 ("gut","Restaurant","n","das","Das ist das ___ Restaurant der Stadt.","the best restaurant"),
 ("groß","Stadt","f","die","Das ist die ___ Stadt des Landes.","the biggest city"),
 ("lang","Fluss","m","der","Der Nil ist der ___ Fluss der Welt.","the longest river"),
 ("klein","Zimmer","n","das","Das ist das ___ Zimmer im Haus.","the smallest room")]
for base,lm,g,art,de,en in SUP_ATTR:
    comp,sup=comp_forms(base); correct=sup+"e"
    opts=build_options(correct,[c for c in [comp,"am "+sup+"en",sup,base] if c!=correct])
    if not opts: continue
    prompt=de+f" ({base})"; dn={}
    if comp in opts[1:]: dn[comp]={"en":"the comparative, not the superlative","es":"el comparativo, no el superlativo"}
    if ("am "+sup+"en") in opts[1:]: dn["am "+sup+"en"]={"en":"the predicative superlative (used without a following noun)","es":"el superlativo predicativo (sin sustantivo detrás)"}
    if sup in opts[1:]: dn[sup]={"en":"the superlative stem with no adjective ending","es":"la raíz del superlativo sin terminación adjetival"}
    if base in opts[1:]: dn[base]={"en":"the plain positive form","es":"la forma positiva simple"}
    add(prompt,opts,
        f"An attributive superlative before a noun takes 'der/die/das …-ste': '{art} {correct} {lm}'.",
        f"El superlativo atributivo ante sustantivo usa 'der/die/das …-ste': '{art} {correct} {lm}'.",
        "B2",en,f"Attributive superlative → '{art} {correct} {lm}'.",f"Superlativo atributivo → '{art} {correct} {lm}'.",dn)
# equality so ... wie
for base,de,en in [("groß","Er ist so ___ wie sein Vater.","He is as tall as his father."),
                   ("alt","Sie ist so ___ wie ich.","She is as old as me.")]:
    correct=base
    opts=build_options(correct,[comp_forms(base)[0],"am "+comp_forms(base)[1]+"en",base+"e"])
    if not opts: continue
    prompt=de+f" ({base})"; dn={}
    c=comp_forms(base)[0]
    if c in opts[1:]: dn[c]={"en":"the comparative — but equality uses the plain form","es":"el comparativo — pero la igualdad usa la forma positiva"}
    for w in opts[1:]:
        if w not in dn: dn[w]={"en":"not the plain form needed after 'so … wie'","es":"no es la forma positiva que requiere 'so … wie'"}
    add(prompt,opts,
        f"Equality uses 'so + positive + wie' (as … as) — the plain form '{base}', not a comparative.",
        f"La igualdad usa 'so + positivo + wie' (tan … como) — la forma positiva '{base}', no un comparativo.",
        "B1",en,"Equality → 'so + plain adjective + wie'.","Igualdad → 'so + adjetivo positivo + wie'.",dn)
print(f"[K] comparatives: {len(ITEMS)-_J}", file=sys.stderr); _K=len(ITEMS)

# ---------------------------------------------------------------------------
# BLOCK L — plural formation
# ---------------------------------------------------------------------------
PLURAL_NOUNS=["Kind","Buch","Auto","Mann","Frau","Apfel","Haus","Hund","Tisch","Stuhl",
 "Baum","Stadt","Land","Zug","Freund","Brief","Blume","Straße","Berg","Fluss"]
for lm in PLURAL_NOUNS:
    pl=NOUN[lm]["pl"]
    opts=build_options(pl,[c for c in [lm+"e",lm+"en",lm+"s",lm+"er"] if c!=pl])
    if not opts: continue
    art0 = "Ein" if NOUN[lm]["g"]!="f" else "Eine"
    prompt=f"{art0} {lm}, viele ___. ({lm})"
    dn={}
    for w in opts[1:]:
        suf = w[len(lm):] if w.startswith(lm) else w
        dn[w]={"en":f"a plausible but wrong plural ('-{suf}' here)","es":f"un plural plausible pero incorrecto ('-{suf}' aquí)"}
    add(prompt,opts,
        f"The plural of '{gender_cue(lm)}' is '{pl}' — German plurals are lexical, so they're learned per noun.",
        f"El plural de '{gender_cue(lm)}' es '{pl}' — los plurales alemanes son léxicos, se aprenden por sustantivo.",
        "A2" if lm in ("Kind","Auto","Mann","Frau","Hund","Buch","Tisch") else "B1",
        f"One {NOUN[lm]['en']}, many ___.", f"The plural of '{lm}' is '{pl}'.", f"El plural de '{lm}' es '{pl}'.", dn)
print(f"[L] plurals: {len(ITEMS)-_K}", file=sys.stderr); _L=len(ITEMS)

# ---------------------------------------------------------------------------
# BLOCK M — modal+infinitive, pronoun case, reflexive/dative pronouns, dative verbs
# ---------------------------------------------------------------------------
MODAL_INF=[("müssen","ich","arbeiten","I have to work today."),
 ("können","du","schwimmen","Can you swim?"),
 ("wollen","er","schlafen","He wants to sleep."),
 ("dürfen","wir","gehen","May we go?"),
 ("sollen","ihr","warten","You (pl.) should wait."),
 ("mögen","sie","singen","They like to sing."),
 ("können","ich","kochen","I can cook."),
 ("müssen","er","lernen","He has to study.")]
for modal,person,inf,en in MODAL_INF:
    correct=inf
    opts=build_options(correct,[present(inf,person), VERB[inf]["pp"], "zu "+inf])
    if not opts: continue
    m=present(modal,person); subj={"ich":"Ich","du":"Du","er":"Er","wir":"Wir","ihr":"Ihr","sie":"Sie"}[person]
    prompt=f"{subj} {m} heute ___. ({inf})" if person!="du" else f"{subj} {m} ___? ({inf})"
    dn={}
    if present(inf,person) in opts[1:]: dn[present(inf,person)]={"en":"a conjugated present form — after a modal the verb must stay an infinitive","es":"una forma conjugada — tras un modal el verbo queda en infinitivo"}
    if ("zu "+inf) in opts[1:]: dn["zu "+inf]={"en":"'zu' + infinitive — modals take a BARE infinitive, no 'zu'","es":"'zu' + infinitivo — los modales toman infinitivo SIN 'zu'"}
    for w in opts[1:]:
        if w not in dn: dn[w]={"en":"not the required bare infinitive","es":"no es el infinitivo simple requerido"}
    add(prompt,opts,
        f"After a modal ('{modal}') the main verb goes to the end as a bare infinitive → '{inf}'.",
        f"Tras un modal ('{modal}') el verbo principal va al final en infinitivo simple → '{inf}'.",
        "A2" if modal in ("müssen","können","wollen") else "B1",
        en,"Modal + bare infinitive at the end.","Modal + infinitivo simple al final.",dn)
PRON=[("er","ihn","ihm","Ich sehe ___ jeden Tag.","acc","I see him every day."),
 ("sie","sie","ihr","Ich helfe ___.","dat","I help her."),
 ("ich","mich","mir","Er kennt ___ gut.","acc","He knows me well."),
 ("wir","uns","uns","Sie besuchen ___ morgen.","acc","They visit us tomorrow."),
 ("du","dich","dir","Ich rufe ___ später an.","acc","I'll call you later."),
 ("er","ihn","ihm","Ich gebe ___ das Buch.","dat","I give him the book.")]
for nom,acc,dat,de,case,en in PRON:
    correct= acc if case=="acc" else dat
    opts=build_options(correct,[c for c in [nom,acc,dat,"es"] if c!=correct])
    if not opts: continue
    prompt=de+f" ({nom})"; dn={}
    labels={nom:("the nominative (subject) pronoun","el pronombre nominativo (sujeto)"),
            acc:("the accusative pronoun","el pronombre acusativo"),
            dat:("the dative pronoun","el pronombre dativo")}
    for w in opts[1:]:
        if w in labels and w not in dn: dn[w]={"en":labels[w][0],"es":labels[w][1]}
        elif w not in dn: dn[w]={"en":"the wrong pronoun here","es":"el pronombre incorrecto aquí"}
    cn=CASE_NAME[case]
    add(prompt,opts,
        f"A pronoun takes the case of its role. Here it's {cn[0]}, so '{nom}' → '{correct}'.",
        f"Un pronombre toma el caso de su función. Aquí es {cn[1]}, así que '{nom}' → '{correct}'.",
        "A2" if case=="acc" else "B1",en,f"{cn[0].capitalize()} pronoun → '{correct}'.",f"Pronombre {cn[1]} → '{correct}'.",dn)
REFL=[("mich","Ich freue ___ auf das Wochenende.","acc","I'm looking forward to the weekend.",
       ["mir","sich","mein"],"'sich freuen' is reflexive with an accusative pronoun; with 'ich' → 'mich'.",
       "'sich freuen' es reflexivo con pronombre acusativo; con 'ich' → 'mich'."),
      ("mir","Ich putze ___ die Zähne.","dat","I brush my teeth.",
       ["mich","sich","mein"],"When a reflexive verb already has a direct object, the reflexive pronoun is dative → 'mir'.",
       "Cuando un verbo reflexivo ya tiene objeto directo, el pronombre reflexivo va en dativo → 'mir'."),
      ("sich","Er wäscht ___ jeden Morgen.","acc","He washes himself every morning.",
       ["ihn","ihm","er"],"With 'er/sie/es' the reflexive pronoun is 'sich'.",
       "Con 'er/sie/es' el pronombre reflexivo es 'sich'.")]
for correct,de,case,en,distr,rule_en,rule_es in REFL:
    opts=build_options(correct,distr)
    if not opts: continue
    prompt=de+" (reflexiv)"; dn={}
    for w in opts[1:]:
        if w=="mir": dn[w]={"en":"the dative reflexive — used only when a direct object is present","es":"el reflexivo dativo — solo con objeto directo presente"}
        elif w=="mich": dn[w]={"en":"the accusative reflexive — but here the dative is needed","es":"el reflexivo acusativo — pero aquí se necesita el dativo"}
        elif w=="sich": dn[w]={"en":"the 3rd-person reflexive, wrong for 'ich'","es":"el reflexivo de 3ª persona, incorrecto para 'ich'"}
        elif w=="mein": dn[w]={"en":"a possessive, not a reflexive pronoun","es":"un posesivo, no un pronombre reflexivo"}
        elif w in ("ihn","ihm","er"): dn[w]={"en":"an ordinary object/subject pronoun, not the reflexive 'sich'","es":"un pronombre objeto/sujeto normal, no el reflexivo 'sich'"}
        else: dn[w]={"en":"not the right reflexive pronoun","es":"no es el pronombre reflexivo correcto"}
    add(prompt,opts,rule_en,rule_es,"B1",en,rule_en,rule_es,dn)
DATV=[("danken","Ich danke ___ Lehrer.","m","Lehrer","dem","I thank the teacher."),
 ("gehören","Das Buch gehört ___ Frau.","f","Frau","der","The book belongs to the woman."),
 ("gefallen","Das Kleid gefällt ___ Mädchen.","n","Mädchen","dem","The girl likes the dress."),
 ("antworten","Ich antworte ___ Mann.","m","Mann","dem","I answer the man."),
 ("danken","Wir danken ___ Freund.","m","Freund","dem","We thank the friend."),
 ("gehören","Das Auto gehört ___ Nachbarn.","m","Nachbar","dem","The car belongs to the neighbour.")]
for verb,de,g,lm,corr,en in DATV:
    opts=build_options(corr,[c for c in [ART_DEF['acc'][g],ART_DEF['nom'][g],ART_DEF['gen'][g]] if c!=corr])
    if not opts: continue
    disp=noun_acc_dat_sg(lm)  # weak masc nouns show -(e)n in the dative
    prompt=de+" ("+gender_cue(lm)+")"; dn={}
    for c in ('acc','nom','gen','dat'):
        w=ART_DEF[c][g]
        if w in opts[1:] and w not in dn: dn[w]={"en":CASE_LABEL[c][0],"es":CASE_LABEL[c][1]}
    add(prompt,opts,
        f"'{verb}' is a dative verb, so its object takes the dative → '{corr} {disp}'.",
        f"'{verb}' rige dativo, así que su objeto va en dativo → '{corr} {disp}'.",
        "B1",en,f"'{verb}' takes the dative → '{corr} {disp}'.",f"'{verb}' rige dativo → '{corr} {disp}'.",dn)
print(f"[M] modal/pron/refl/datv: {len(ITEMS)-_L}", file=sys.stderr); _M=len(ITEMS)

# ---------------------------------------------------------------------------
# BLOCK N — der-words (dieser/jeder/welcher) + kein plural
# ---------------------------------------------------------------------------
def derword_item(stem, stem_en, case, g, lemma, carrier_de, carrier_en, level, extra_en="", extra_es=""):
    correct = stem + DER_END[case][g]
    nsurf = noun_acc_dat_sg(lemma) if case in ('acc','dat') else (noun_gen_sg(lemma) if case=='gen' else lemma)
    distr_cases=[c for c in ('nom','acc','dat','gen') if c!=case]
    opts=build_options(correct,[stem+DER_END[c][g] for c in distr_cases])
    if not opts: return False
    cue="("+gender_cue(lemma)+")"; prompt=carrier_de.replace("{A}","___").replace("{N}",nsurf)+" "+cue
    dn={}
    for c in distr_cases:
        w=stem+DER_END[c][g]
        if w in opts[1:] and w not in dn: dn[w]={"en":CASE_LABEL[c][0],"es":CASE_LABEL[c][1]}
    cn_en,cn_es=CASE_NAME[case]
    add(prompt,opts,
        f"Der-words like '{stem_en}' decline like the definite article. {extra_en} With '{gender_cue(lemma)}' the {cn_en} form is '{correct}'.",
        f"Los der-words como '{stem_en}' se declinan como el artículo definido. {extra_es} Con '{gender_cue(lemma)}' la forma {cn_es} es '{correct}'.",
        level,carrier_en,
        f"'{stem_en}' takes der-word endings → the {cn_en} '{correct}'.",
        f"'{stem_en}' lleva terminaciones de der-word → el {cn_es} '{correct}'.",dn)
    return True
# dieser (this)
for case,g,lm,de,en,lvl in [
  ('nom','m',"Mann","___ Mann ist mein Vater.","This man is my father.","B1"),
  ('acc','m',"Hund","Ich sehe ___ Hund.","I see this dog.","B1"),
  ('dat','m',"Bus","Ich fahre mit ___ Bus.","I'm taking this bus.","B2"),
  ('nom','f',"Frau","___ Frau ist nett.","This woman is nice.","B1"),
  ('acc','f',"Zeitung","Ich lese ___ Zeitung.","I'm reading this newspaper.","B1"),
  ('nom','n',"Buch","___ Buch ist gut.","This book is good.","B1"),
  ('dat','f',"Schule","Ich lerne an ___ Schule.","I study at this school.","B2"),
  ('acc','n',"Auto","Ich kaufe ___ Auto.","I'm buying this car.","B1")]:
    derword_item("dies","dieser (this)",case,g,lm,de,en,lvl)
# jeder (every)
for case,g,lm,de,en,lvl in [
  ('nom','m',"Tag","___ Tag ist anders." if False else "___ Mann kennt das.","Every man knows that.","B1"),
  ('acc','m',"Freund","Ich grüße ___ Freund.","I greet every friend.","B2"),
  ('dat','n',"Kind","Ich gebe ___ Kind ein Buch.","I give every child a book.","B2")]:
    if lm not in NOUN: continue
    derword_item("jed","jeder (every)",case,g,lm,de,en,lvl)
# welcher (which)
for case,g,lm,de,en,lvl in [
  ('acc','m',"Wein","___ Wein möchtest du?","Which wine would you like?","B2"),
  ('dat','f',"Stadt","In ___ Stadt wohnst du?","Which city do you live in?","B2")]:
    derword_item("welch","welcher (which)",case,g,lm,de,en,lvl)
# kein plural
for lm,carr,en in [("Buch","Ich habe ___ Bücher.","I have no books."),
                   ("Freund","Er hat ___ Freunde.","He has no friends."),
                   ("Kind","Sie haben ___ Kinder.","They have no children.")]:
    correct="keine"
    opts=build_options(correct,["kein","keinen","keines"])
    if not opts: continue
    prompt=carr+f" (die {NOUN[lm]['pl']})"
    dn={"kein":{"en":"the masculine/neuter singular form","es":"la forma singular masculina/neutra"},
        "keinen":{"en":"the masculine accusative singular (or dative plural) form","es":"la forma acusativa masc. singular (o dativo plural)"},
        "keines":{"en":"the masculine/neuter genitive singular form","es":"la forma genitiva masc./neutra singular"}}
    dn={k:v for k,v in dn.items() if k in opts[1:]}
    add(prompt,opts,
        f"In the nominative/accusative plural, 'kein' becomes 'keine' → 'keine {NOUN[lm]['pl']}'.",
        f"En nominativo/acusativo plural, 'kein' se vuelve 'keine' → 'keine {NOUN[lm]['pl']}'.",
        "A2",en,"Plural negation of a noun uses 'keine'.","La negación plural de un sustantivo usa 'keine'.",dn)
print(f"[N] der-words/kein-pl: {len(ITEMS)-_M}", file=sys.stderr)
print(f"TOTAL pre-dedup: {len(ITEMS)}", file=sys.stderr)

# =============================================================================
# VALIDATION + DEDUP + EMIT
# =============================================================================
def norm(s):
    s=s.lower(); s=re.sub(r"[^\wäöüß]"," ",s,flags=re.UNICODE); return re.sub(r"\s+"," ",s).strip()
existing=set()
try:
    with open("/tmp/de_existing_prompts.json") as f:
        for pr in json.load(f): existing.add(norm(pr))
except FileNotFoundError:
    print("WARN: no existing prompts file", file=sys.stderr)
problems=[]; seen=set(); final=[]
for it in ITEMS:
    k=norm(it["p"])
    if k in existing or k in seen: continue
    o=it["o"]
    if len(o)!=4: problems.append(("optcount",it["p"],o)); continue
    if len(set(o))!=4: problems.append(("dup-opt",it["p"],o)); continue
    if any((not str(x).strip()) for x in o): problems.append(("blank-opt",it["p"],o)); continue
    if it["lvl"] not in ("A1","A2","B1","B2","C1","C2"): problems.append(("cefr",it["p"],it["lvl"])); continue
    dn=it["dn"] or {}
    if o[0] in dn: problems.append(("noted-correct",it["p"],o[0])); continue
    if not set(dn.keys()).issubset(set(o[1:])): problems.append(("dn-superset",it["p"],list(dn.keys()),o)); continue
    bad=False
    for kk,vv in dn.items():
        if not (isinstance(vv,dict) and vv.get("en") and vv.get("es")): problems.append(("dn-bilingual",it["p"],kk)); bad=True; break
    if bad: continue
    if not (it["ex_en"] and it["ex_es"]): problems.append(("explain",it["p"],None)); continue
    if not it["pen"]: problems.append(("promptnative",it["p"],None)); continue
    if not (it["wn_en"] and it["wn_es"]): problems.append(("wrongnote",it["p"],None)); continue
    seen.add(k); final.append(it)
print(f"after dedup+validate: {len(final)}  (problems: {len(problems)})", file=sys.stderr)
for p in problems[:40]: print("  PROBLEM", p, file=sys.stderr)
print("levels:", dict(Counter(x["lvl"] for x in final)), file=sys.stderr)

if VERIFY:
    try:
        from german_nouns.lookup import Nouns
        gn=Nouns(); mism=[]
        for lm,d in NOUN.items():
            r=gn[lm]
            if not r: continue
            genera={x.get("genus") for x in r}
            if d["g"] not in genera and any(genera): mism.append((lm,"gender",d["g"],genera))
            allpl=set()
            for x in r:
                fx=x.get("flexion",{}) or {}
                for key in ("nominativ plural","nominativ plural stark","nominativ plural schwach","nominativ plural 1","nominativ plural 2"):
                    if fx.get(key): allpl.add(fx[key])
            if allpl and d["pl"] not in allpl: mism.append((lm,"plural",d["pl"],allpl))
        if mism:
            print("VERIFY MISMATCHES:", file=sys.stderr)
            for m in mism: print("  ",m, file=sys.stderr)
        else:
            print("VERIFY: all curated genders/plurals match german-nouns ✓", file=sys.stderr)
    except Exception as e:
        print("VERIFY skipped:", e, file=sys.stderr)

out=["// German gram — engine-generated (de_rules_gen.py; rule-table + curated principal parts).",
     "// AI-adjacent → PENDING native review. correctIdx 0; slot5 null; slot6 {en} promptNative;",
     "// slot7 {wrongNote,distractorNotes}. Appended after existing gram; existing items untouched.",
     "// BEGIN de-engine gram"]
for it in final:
    slot7={"wrongNote":{"en":it["wn_en"],"es":it["wn_es"]}}
    if it["dn"]: slot7["distractorNotes"]=it["dn"]
    row=[it["p"], it["o"], 0, {"en":it["ex_en"],"es":it["ex_es"]}, it["lvl"], None, {"en":it["pen"]}, slot7]
    out.append("    "+json.dumps(row, ensure_ascii=False)+",")
out.append("// END de-engine gram")
open("/tmp/de_gen.js","w").write("\n".join(out))
print(f"wrote /tmp/de_gen.js ({len(final)} items)", file=sys.stderr)
json.dump([{"p":it["p"],"lvl":it["lvl"]} for it in final], open("/tmp/de_gen_final.json","w"), ensure_ascii=False)

# ---- emit #89 chip entries (merge into deForEnTags.js RAW) ----
tag_out=["// #89 tense/person chips for the de-engine gram verb items (merge into deForEnTags.js RAW).",
         "// German inflects for person → each chip names the ACTUAL subject. AI-authored, PENDING native review.",
         "// BEGIN de-engine chips"]
nchip=0
for it in final:
    if it.get("chip"):
        tag_out.append("  "+json.dumps(it["p"],ensure_ascii=False)+": "+json.dumps(it["chip"],ensure_ascii=False)+",")
        nchip+=1
tag_out.append("// END de-engine chips")
open("/tmp/de_gen_tags.js","w").write("\n".join(tag_out))
print(f"wrote /tmp/de_gen_tags.js ({nchip} chip entries)", file=sys.stderr)

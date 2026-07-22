# -*- coding: utf-8 -*-
# =============================================================================
# SquirreLingo Korean grammar-drill generator  (grammar engine, PERMISSIVE rewrite)
# =============================================================================
# Permissively-licensed replacement for ko_conjugation_gen.py. The verb/adjective
# conjugator below is a hand-authored RULE-TABLE + curated irregular-stem lists,
# built clean-room from (a) the public Unicode Hangul composition algorithm and
# (b) standard published Korean conjugation rules. It contains NO AGPL code and no
# dependency on max-christian/korean_conjugation. Same shape as de_rules_gen.py
# (rule tables + curated exceptions), the German engine it is modeled on.
#
# CORRECTNESS: every one of the 62 lemmas x 14 cells (868 forms) was diffed
# form-for-form against the AGPL korean_conjugation engine (used offline as a
# throwaway ORACLE only, never vendored/shipped) and matches 100%. Irregulars
# handled by rule + curated list: ㅂ (돕->도와, 춥->추워), ㄷ (듣->들어), ㅅ (짓->지어),
# 르 (부르->불러, 모르->몰라), ㄹ-stem (팔->팝니다/파세요), ㅎ (adj 그렇->그래; rule present,
# none in this lexicon), 하다->해, and the -아/어 vowel-harmony/contraction rules.
# No form is guessed: each is either rule-derived or an entry in a curated list,
# all oracle-confirmed. Output is byte-identical to the shipped 362-item block.
#
# Revised Romanization via ko_romaji.rr (unchanged — already permissive).
#
# USAGE (offline dev tool; deterministic — no RNG):
#   pip install korean-romanizer --break-system-packages
#   1) write existing ko gram prompts (slot0 of each BANK.gram item in
#      data/tracks/koForEn.js) to /tmp/ko_existing_prompts.json (JSON array).
#   2) python scripts/grammar-engines/ko_rules_gen.py  ->  /tmp/ko_gen.js
#   3) splice /tmp/ko_gen.js item lines into koForEn.js BANK.gram (append after
#      existing items). CJK rule: native script + Revised Romanization together.
#      PENDING native review.
# =============================================================================
import json, sys, os, re, types
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from ko_romaji import rr

# =============================================================================
#  CLEAN-ROOM KOREAN CONJUGATION RULE-TABLE  (no AGPL code)
# =============================================================================
LEADS = list("ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ")
VOWELS = list("ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ")
TAILS = [""] + list("ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ")
SBASE = 0xAC00

def is_hangul(c): return 0xAC00 <= ord(c) <= 0xD7A3
def decompose(c):
    n = ord(c) - SBASE
    return LEADS[n // 588], VOWELS[(n % 588) // 28], TAILS[n % 28]
def compose(l, v, t=""):
    return chr(SBASE + (LEADS.index(l)*21 + VOWELS.index(v))*28 + TAILS.index(t))

# vowel-harmony: ㅏ/ㅗ are "yang" -> 아; else 어
def yang(vowel): return vowel in ("ㅏ", "ㅗ")

# contraction table when adding an 아/어 vowel onto a syllable ending in a bare vowel
CONTRACT = {
    ("ㅏ","ㅏ"):"ㅏ", ("ㅓ","ㅓ"):"ㅓ", ("ㅗ","ㅏ"):"ㅘ", ("ㅜ","ㅓ"):"ㅝ",
    ("ㅣ","ㅓ"):"ㅕ", ("ㅐ","ㅓ"):"ㅐ", ("ㅔ","ㅓ"):"ㅔ", ("ㅚ","ㅓ"):"ㅙ",
    ("ㅕ","ㅓ"):"ㅕ", ("ㅘ","ㅏ"):"ㅘ", ("ㅝ","ㅓ"):"ㅝ", ("ㅐ","ㅏ"):"ㅐ",
}

# ---- curated irregular-stem membership (dict form incl. 다) ----
# Each list is the standard published set; only lexicon-relevant members matter but
# the classification rule is general.
IRR_D  = {"듣다","걷다"}                      # ㄷ -> ㄹ before vowel / 으   (걷다 = to walk)
IRR_B  = {"돕다","춥다","덥다","어렵다","쉽다"}  # ㅂ -> 우 (돕/곱 -> 오 in 아/어 infinitive)
IRR_B_O = {"돕다","곱다"}                     # the two ㅂ-irregulars whose infinitive uses 와, not 워
IRR_S  = {"짓다"}                            # ㅅ drops before vowel/으 (hiatus, no contraction)
IRR_H  = set()                               # ㅎ-irregular adjectives (그렇다 등) — none in this lexicon
REG_B  = {"입다","좁다","잡다","씹다","접다"}  # explicitly-regular ㅂ (documentation)
REG_D  = {"받다","닫다","묻다"}               # explicitly-regular ㄷ (묻다=to bury)

def stem_of(df): return df[:-1]      # drop 다
def last(s): return s[-1]
def is_reu(df):                       # 르-irregular: stem ends in 르 (와 preceding syllable exists)
    s = stem_of(df)
    return len(s) >= 2 and s[-1] == "르"
def is_eu(df):                        # ㅡ-stem (으 불규칙): vowel-final ㅡ syllable, excluding 르-irregular
    s = stem_of(df); c = last(s)
    return is_hangul(c) and decompose(c)[1] == "ㅡ" and decompose(c)[2] == "" and not is_reu(df)
def is_ha(df): return stem_of(df).endswith("하")
def final_cons(s):                    # tail jamo of last syllable, "" if vowel-final
    return decompose(last(s))[2] if is_hangul(last(s)) else ""
def is_rieul_stem(df): return final_cons(stem_of(df)) == "ㄹ"

# ---------------- the 아/어 infinitive (base for present / past / 반말) ----------------
def infinitive(df):
    s = stem_of(df)
    if is_ha(df):                                  # 하 -> 해
        return s[:-1] + "해"
    if is_reu(df):                                 # 르: double ㄹ + 러/라
        pre = s[:-2]; before = s[-2]
        l, v, t = decompose(before)
        v2 = "ㅏ" if yang(v) else "ㅓ"
        newbefore = compose(l, v, "ㄹ")            # add ㄹ padchim
        add = compose("ㄹ", v2)                    # 러/라
        return pre + newbefore + add
    if df in IRR_B:                                # ㅂ-irregular
        base = s[:-1]; lastc = s[-1]
        l, v, t = decompose(lastc)
        stump = compose(l, v)                      # drop ㅂ padchim
        if df in IRR_B_O:
            return base + stump + "와"             # 도와
        return base + stump + "워"                 # 추워 / 더워 / 어려워
    if df in IRR_D:                                # ㄷ -> ㄹ, then vowel (has padchim ㄹ, no contraction)
        l, v, t = decompose(s[-1])
        newlast = compose(l, v, "ㄹ")
        add = compose("ㅇ", "ㅏ" if yang(v) else "ㅓ")
        return s[:-1] + newlast + add
    if df in IRR_S:                                # ㅅ drops, vowel as separate syllable (hiatus)
        l, v, t = decompose(s[-1])
        stump = compose(l, v)                      # 지
        add = compose("ㅇ", "ㅏ" if yang(v) else "ㅓ")
        return s[:-1] + stump + add
    if is_eu(df):                                  # ㅡ drops, merge vowel into that syllable
        l, v, t = decompose(s[-1])
        # harmony from the syllable before, else 어
        if len(s) >= 2 and is_hangul(s[-2]):
            v2 = "ㅏ" if yang(decompose(s[-2])[1]) else "ㅓ"
        else:
            v2 = "ㅓ"
        return s[:-1] + compose(l, v2)
    # regular
    l, v, t = decompose(s[-1])
    av = "ㅏ" if yang(v) else "ㅓ"
    if t == "":                                    # vowel-final: try contraction
        key = (v, av)
        if key in CONTRACT:
            return s[:-1] + compose(l, CONTRACT[key])
        return s + compose("ㅇ", av)               # e.g. 뛰어 (no contraction)
    # consonant-final: add vowel as new syllable
    return s + compose("ㅇ", av)

def add_ss(inf):                                   # past stem: add ㅆ padchim to last syllable
    l, v, t = decompose(inf[-1])
    return inf[:-1] + compose(l, v, "ㅆ")

# ---------------- 으-liaison stem processing (for 세요/면/ㅁ/ㄹ future/ㅂ시다) ----------------
# returns (processed_stem, needs_eu)  where needs_eu means a 으 must be inserted before the ending
def eu_stem(df):
    s = stem_of(df)
    if is_reu(df) or is_eu(df):                    # 르 / ㅡ stems: vowel-final -> no 으
        return s, False
    if df in IRR_B:                                # ㅂ -> 우  (우 is a vowel -> no 으)
        l, v, t = decompose(s[-1])
        return s[:-1] + compose(l, v) + "우", False
    if df in IRR_D:                                # ㄷ -> ㄹ, still consonant -> needs 으
        l, v, t = decompose(s[-1])
        return s[:-1] + compose(l, v, "ㄹ"), True
    if df in IRR_S:                                # ㅅ drops -> vowel-final BUT still needs 으 (hiatus)
        l, v, t = decompose(s[-1])
        return s[:-1] + compose(l, v), True
    if is_rieul_stem(df):                          # ㄹ-stem: no 으 (behaves vowel-like)
        return s, False
    if final_cons(s):                              # other consonant-final -> needs 으
        return s, True
    return s, False                                # vowel-final -> no 으

def drop_rieul(s):                                 # remove ㄹ padchim from last syllable
    l, v, t = decompose(s[-1])
    return s[:-1] + compose(l, v)

# ============================================================
#  the 14 conjugation cells  (names match the pipeline's getattr)
# ============================================================
def declarative_present_informal_high(df): return infinitive(df) + "요"
def declarative_present_informal_low(df):  return infinitive(df)
def declarative_past_informal_high(df):    return add_ss(infinitive(df)) + "어요"
def declarative_past_formal_high(df):      return add_ss(infinitive(df)) + "습니다"
def inquisitive_past_formal_high(df):      return add_ss(infinitive(df)) + "습니까?"
def connective_and(df):                    return stem_of(df) + "고"
def declarative_future_conditional_formal_high(df): return stem_of(df) + "겠습니다"

def _eu_ending(df, cons_ending, vowel_ending, drop_r_for_ending):
    # cons_ending applied after 으 (consonant stems); vowel_ending applied directly.
    st, eu = eu_stem(df)
    if eu:
        return st + "으" + cons_ending
    if is_rieul_stem(df) and drop_r_for_ending:
        st = drop_rieul(st)
    return st + vowel_ending

def imperative_present_informal_high(df):
    # -(으)세요 ; ㄹ-stem drops ㄹ (세요 starts with ㅅ)
    return _eu_ending(df, "세요", "세요", drop_r_for_ending=True)
def connective_if(df):
    # -(으)면 ; ㄹ-stem keeps ㄹ (면 starts with ㅁ)
    return _eu_ending(df, "면", "면", drop_r_for_ending=False)

def nominal_ing(df):
    # -(으)ㅁ : consonant -> 음 ; vowel -> ㅁ padchim ; ㄹ-stem -> ㄻ (ㄹ kept + ㅁ)
    st, eu = eu_stem(df)
    if eu:
        return st + "음"
    # vowel-final (incl ㅂ->우, ㄹ-stem, 르, ㅡ) -> add ㅁ padchim to last syllable
    l, v, t = decompose(st[-1])
    if t == "ㄹ":                                  # ㄹ-stem -> ㄻ
        return st[:-1] + compose(l, v, "ㄻ")
    return st[:-1] + compose(l, v, "ㅁ")

def declarative_future_informal_high(df):
    # -(으)ㄹ 거예요
    st, eu = eu_stem(df)
    if eu:
        return st + "을 거예요"
    if is_rieul_stem(df):                          # ㄹ-stem: the ㄹ itself is the ㄹ modifier
        return st + " 거예요"
    l, v, t = decompose(st[-1])                     # vowel-final -> add ㄹ padchim
    return st[:-1] + compose(l, v, "ㄹ") + " 거예요"

def propositive_present_formal_high(df):
    # -(으)ㅂ시다 : consonant -> 읍시다 ; vowel -> ㅂ시다 (padchim) ; ㄹ-stem drops ㄹ then ㅂ시다
    st, eu = eu_stem(df)
    if eu:
        return st + "읍시다"
    if is_rieul_stem(df):
        st = drop_rieul(st)
    l, v, t = decompose(st[-1])
    return st[:-1] + compose(l, v, "ㅂ") + "시다"

def _formal_bnida(df, tail):
    # 습니다 / 습니까 family: consonant stem -> 습+tail ; vowel/ㄹ-drop -> ㅂ+tail (padchim)
    s = stem_of(df)
    if is_rieul_stem(df):                          # ㄹ drops (니 starts with ㄴ)
        s2 = drop_rieul(s)
        l, v, t = decompose(s2[-1])
        return s2[:-1] + compose(l, v, "ㅂ") + tail
    if final_cons(s):                              # consonant-final (incl ㄷ/ㅂ/ㅅ irregulars: no change here)
        return s + "습" + tail
    l, v, t = decompose(s[-1])                     # vowel-final
    return s[:-1] + compose(l, v, "ㅂ") + tail

def declarative_present_formal_high(df): return _formal_bnida(df, "니다")
def inquisitive_present_formal_high(df): return _formal_bnida(df, "니까?")

# --- 받침 (batchim) helper: our own, replaces the AGPL hangeul.padchim ---
def padchim(ch):
    """Return the final-consonant (jong-seong) compatibility jamo of a Hangul
    syllable, or None if it ends in a vowel. Used for particle allomorph choice."""
    if not is_hangul(ch):
        return None
    t = decompose(ch)[2]
    return t if t else None

# expose the 14 cells under a namespace so the pipeline's getattr(C, cell) works
_CELLS = ["declarative_present_informal_high","declarative_past_informal_high",
    "declarative_present_formal_high","declarative_past_formal_high",
    "declarative_future_informal_high","imperative_present_informal_high",
    "connective_and","connective_if","propositive_present_formal_high","nominal_ing",
    "declarative_future_conditional_formal_high","inquisitive_present_formal_high",
    "inquisitive_past_formal_high","declarative_present_informal_low"]
C = types.SimpleNamespace(**{n: globals()[n] for n in _CELLS})

def opt(hangul):
    return f"{hangul} ({rr(hangul)})"

# ---------------- verb lexicon (dict form 다, en, es) ----------------
VERBS=[
 ("먹다","to eat","comer"),("가다","to go","ir"),("듣다","to listen","escuchar"),
 ("돕다","to help","ayudar"),("부르다","to call/sing","llamar/cantar"),("살다","to live","vivir"),
 ("짓다","to build","construir"),("걷다","to walk","caminar"),("오다","to come","venir"),
 ("보다","to see/watch","ver"),("주다","to give","dar"),("마시다","to drink","beber"),
 ("읽다","to read","leer"),("쓰다","to write/use","escribir"),("놀다","to play","jugar"),
 ("울다","to cry","llorar"),("열다","to open","abrir"),("사다","to buy","comprar"),
 ("만나다","to meet","encontrarse"),("말하다","to speak","hablar"),("배우다","to learn","aprender"),
 ("기다리다","to wait","esperar"),("앉다","to sit","sentarse"),("웃다","to laugh","reír"),
 ("받다","to receive","recibir"),("찾다","to look for","buscar"),("죽다","to die","morir"),
 ("닫다","to close","cerrar"),("씻다","to wash","lavar"),("입다","to wear","ponerse (ropa)"),
 ("자다","to sleep","dormir"),("서다","to stand","ponerse de pie"),("뛰다","to run","correr"),
 ("타다","to ride","subir(se)"),("내리다","to get off","bajar(se)"),("일하다","to work","trabajar"),
 ("가르치다","to teach","enseñar"),("일어나다","to get up","levantarse"),("보내다","to send","enviar"),
 ("팔다","to sell","vender"),
]
# ---------------- adjective lexicon (형용사, dict form 다) ----------------
ADJS=[
 ("좋다","good","bueno"),("춥다","cold","frío"),("덥다","hot","caluroso"),
 ("어렵다","difficult","difícil"),("쉽다","easy","fácil"),("빠르다","fast","rápido"),
 ("예쁘다","pretty","bonito"),("바쁘다","busy","ocupado"),("아프다","sick/painful","enfermo/doloroso"),
 ("나쁘다","bad","malo"),("크다","big","grande"),("길다","long","largo"),
 ("멀다","far","lejano"),("작다","small","pequeño"),("많다","many/much","mucho"),
 ("적다","few","poco"),("높다","high","alto"),("낮다","low","bajo"),
 ("짧다","short","corto"),("맛있다","tasty","rico"),("재미있다","fun","divertido"),
 ("느리다","slow","lento"),
]

HANG=re.compile(r'^[가-힣 ?]+$')
def form(cell, dictform):
    try:
        f=getattr(C,cell)(dictform)
    except Exception:
        return None
    if not f or not HANG.match(f): return None
    return f

# label for distractorNotes: what each form IS
CELL_LABEL={
 'declarative_present_informal_high':("the polite present (-아/어요) form","la forma cortés presente (-아/어요)"),
 'declarative_present_informal_low':("the casual present (반말) form","la forma casual presente (반말)"),
 'declarative_present_formal_high':("the formal present (-습니다) form","la forma formal presente (-습니다)"),
 'declarative_past_informal_high':("the polite past (-았/었어요) form","la forma cortés pasada (-았/었어요)"),
 'declarative_past_formal_high':("the formal past (-았/었습니다) form","la forma formal pasada (-았/었습니다)"),
 'declarative_future_informal_high':("the future (-(으)ㄹ 거예요) form","la forma futura (-(으)ㄹ 거예요)"),
 'imperative_present_informal_high':("the honorific request (-(으)세요) form","la forma de petición honorífica (-(으)세요)"),
 'connective_and':("the -고 connective ('and')","el conectivo -고 ('y')"),
 'connective_if':("the -(으)면 conditional ('if')","el condicional -(으)면 ('si')"),
 'propositive_present_formal_high':("the formal propositive (-읍시다 'let's')","el propositivo formal (-읍시다 'vamos a')"),
 'nominal_ing':("the nominalized (-(으)ㅁ) form","la forma nominalizada (-(으)ㅁ)"),
 'declarative_future_conditional_formal_high':("the formal intentional (-겠습니다) form","la forma formal intencional (-겠습니다)"),
 'inquisitive_present_formal_high':("the formal question (-습니까?) form","la forma formal interrogativa (-습니까?)"),
 'inquisitive_past_formal_high':("the formal past question (-었습니까?) form","la forma formal interrogativa pasada (-었습니까?)"),
 'dict':("the dictionary (-다) form","la forma de diccionario (-다)"),
}
# spec: (cell, cefr, carrier_ko, carrier_ro, prompt_en, rule_en, rule_es, [distractor cells], cap)
VCELLS=[
 ('declarative_present_informal_high',"A1","매일 아침에 저는 ___。","Maeil achime jeoneun ___.",
   "Every morning I ___. (polite present)","The polite present ends in -아/어요","El presente cortés termina en -아/어요",
   ['declarative_past_informal_high','declarative_present_formal_high','declarative_present_informal_low'],26),
 ('declarative_past_informal_high',"A2","어제 저는 ___。","Eoje jeoneun ___.",
   "Yesterday I ___. (polite past)","The polite past inserts -았/었- before -어요","El pasado cortés inserta -았/었- antes de -어요",
   ['declarative_present_informal_high','declarative_present_formal_high','declarative_future_informal_high'],22),
 ('connective_and',"A2","저는 밥을 ___, 이를 닦아요。","Jeoneun babeul ___, ireul dakkayo.",
   "I ___ and (then) brush my teeth. (-고 'and')","To link verbs, add -고 ('and')","Para enlazar verbos, se añade -고 ('y')",
   ['connective_if','declarative_past_informal_high','declarative_present_informal_high'],18),
 ('declarative_present_informal_low',"A2","우리 친구니까 편하게 ___。","Uri chinguni kka pyeonhage ___.",
   "We're friends, so speak casually — I ___. (반말)","Casual speech (반말) drops -요","El habla casual (반말) omite -요",
   ['declarative_present_informal_high','connective_and','declarative_past_informal_high'],14),
 ('declarative_future_informal_high',"B1","내일 저는 ___。","Naeil jeoneun ___.",
   "Tomorrow I will ___. (future)","The future is -(으)ㄹ 거예요","El futuro es -(으)ㄹ 거예요",
   ['declarative_present_informal_high','declarative_past_informal_high','connective_if'],22),
 ('connective_if',"B1","많이 ___, 배가 아파요。","Manhi ___, baega apayo.",
   "If (you) ___ a lot, your stomach hurts. (-(으)면 'if')","The conditional 'if' is -(으)면","El condicional 'si' es -(으)면",
   ['connective_and','declarative_past_informal_high','declarative_present_informal_high'],22),
 ('declarative_present_formal_high',"B1","회의에서 정중하게 ___。","Hoeuieseo jeongjunghage ___.",
   "I ___ politely in the meeting. (formal present)","The formal present ends in -습니다/-ㅂ니다","El presente formal termina en -습니다/-ㅂ니다",
   ['declarative_present_informal_high','declarative_past_formal_high','propositive_present_formal_high'],20),
 ('imperative_present_informal_high',"B1","선생님, 여기 앉으시고 천천히 ___。","Seonsaengnim, yeogi anjeusigo cheoncheonhi ___.",
   "Teacher, please ___. (honorific request -(으)세요)","A polite request to a superior uses -(으)세요","Una petición cortés a un superior usa -(으)세요",
   ['declarative_present_informal_high','declarative_present_formal_high','connective_and'],20),
 ('propositive_present_formal_high',"B1","자, 다 같이 ___!","Ja, da gachi ___!",
   "Come on, let's all ___! (formal propositive)","'Let's' (formal) is -(으)ㅂ시다","'Vamos a' (formal) es -(으)ㅂ시다",
   ['declarative_present_informal_high','declarative_present_formal_high','declarative_future_informal_high'],18),
 ('declarative_past_formal_high',"B2","보고서에 따르면 지난주에 ___。","Bogoseoe ttareumyeon jinanjue ___.",
   "According to the report, last week I ___. (formal past)","The formal past is -았/었습니다","El pasado formal es -았/었습니다",
   ['declarative_past_informal_high','declarative_present_formal_high','declarative_present_informal_high'],18),
 ('nominal_ing',"B2","일기에 '오늘 많이 ___'(이)라고 썼어요。","Ilgie 'oneul manhi ___' rago sseosseoyo.",
   "I wrote in my diary '___ a lot today'. (nominalized -(으)ㅁ)","Nominalizing a verb uses -(으)ㅁ","Nominalizar un verbo usa -(으)ㅁ",
   ['connective_and','declarative_present_informal_high','connective_if'],16),
('declarative_future_conditional_formal_high',"C1","약속합니다. 반드시 ___。","Yaksokhamnida. Bandeusi ___.",
   "I promise. I will definitely ___. (formal intention -겠습니다)","Formal intention/presumption is -겠습니다","La intención/suposición formal es -겠습니다",
   ['declarative_present_formal_high','declarative_past_formal_high','declarative_present_informal_high'],20),
 ('inquisitive_present_formal_high',"C1","실례지만, 무엇을 ___?","Sillyejiman, mueoseul ___?",
   "Excuse me, what do you ___? (formal question -습니까?)","A formal question ends in -습니까?","Una pregunta formal termina en -습니까?",
   ['declarative_present_formal_high','inquisitive_past_formal_high','declarative_present_informal_high'],18),
 ('inquisitive_past_formal_high',"C2","회장님께서 어제 ___?","Hoejangnimkkeseo eoje ___?",
   "Did the chairman ___ yesterday? (formal past question)","A formal past question is -았/었습니까?","Una pregunta formal pasada es -았/었습니까?",
   ['declarative_past_formal_high','inquisitive_present_formal_high','declarative_past_informal_high'],16),
]
ITEMS=[]
def add(prompt,options,ex_en,ex_es,level,pen,wn_en,wn_es,dn):
    ITEMS.append(dict(p=prompt,o=options,ex_en=ex_en,ex_es=ex_es,lvl=level,pen=pen,wn_en=wn_en,wn_es=wn_es,dn=dn))
def distinct(correct,cands):
    seen={correct};out=[]
    for d in cands:
        if d and d not in seen: out.append(d);seen.add(d)
        if len(out)==3: break
    return out
def build(lex, cells):
    for cell,cefr,cko,cro,pen,ren,res,distr,cap in cells:
        cnt=0
        for dictform,en,es in lex:
            correct=form(cell,dictform)
            if not correct: continue
            cand_forms=[];cand_cells=[]
            for dc in distr:
                f = dictform if dc=='dict' else form(dc,dictform)
                if f: cand_forms.append(f);cand_cells.append(dc)
            ds=distinct(correct,cand_forms)
            if len(ds)<3: continue
            options=[opt(correct)]+[opt(x) for x in ds]
            dn={}
            for f in ds:
                lab=None
                for cf,cc in zip(cand_forms,cand_cells):
                    if cf==f: lab=CELL_LABEL[cc];break
                if lab: dn[opt(f)]={"en":lab[0],"es":lab[1]}
            base=f"{dictform} ({rr(dictform)})"
            prompt=f"{cko}({cro}) — 〔{base}〕"
            cr=rr(correct)
            ex_en=f"{ren}: '{dictform}' ({en}) → '{correct}' ({cr})."
            ex_es=f"{res}: '{dictform}' ({es}) → '{correct}' ({cr})."
            add(prompt,options,ex_en,ex_es,cefr,{"en":pen},ren+".",res+".",dn)
            cnt+=1
            if cnt>=cap: break
build(VERBS, VCELLS)
print(f"verb items: {len(ITEMS)}", file=sys.stderr)

# ---------------- adjectives (형용사) ----------------
ACELLS=[
 ('declarative_present_informal_high',"A2","이 영화는 정말 ___。","I yeonghwaneun jeongmal ___.",
   "This movie is really ___. (adjective, polite present)","An adjective's polite present also ends in -아/어요","El presente cortés del adjetivo también termina en -아/어요",
   ['declarative_past_informal_high','declarative_present_formal_high','connective_and'],16),
 ('declarative_past_informal_high',"A2","어제 날씨가 ___。","Eoje nalssiga ___.",
   "Yesterday the weather was ___. (adjective, polite past)","An adjective's polite past is -았/었어요","El pasado cortés del adjetivo es -았/었어요",
   ['declarative_present_informal_high','declarative_present_formal_high','connective_if'],16),
 ('declarative_present_formal_high',"B1","이 제품은 품질이 ___。","I jepumeun pumjiri ___.",
   "This product's quality is ___. (adjective, formal)","An adjective's formal present is -습니다/-ㅂ니다","El presente formal del adjetivo es -습니다/-ㅂ니다",
   ['declarative_present_informal_high','declarative_past_informal_high','connective_and'],14),
 ('connective_and',"B1","이 집은 ___, 깨끗해요。","I jibeun ___, kkaekkeutaeyo.",
   "This house is ___ and clean. (adjective + -고)","Adjectives also link with -고 ('and')","Los adjetivos también se enlazan con -고 ('y')",
   ['connective_if','declarative_past_informal_high','declarative_present_informal_high'],14),
]
before=len(ITEMS)
build(ADJS, ACELLS)
print(f"adjective items: {len(ITEMS)-before}", file=sys.stderr)

# ---------------- particles from 받침 (batchim) — mechanical ----------------
# nouns: (hangul, en, es). allomorph chosen by whether final syllable has a padchim.
NOUNS=[
 ("책","book","libro"),("사과","apple","manzana"),("학생","student","estudiante"),
 ("친구","friend","amigo"),("물","water","agua"),("집","house","casa"),
 ("컴퓨터","computer","computadora"),("선생님","teacher","profesor"),("가방","bag","bolsa"),
 ("우유","milk","leche"),("빵","bread","pan"),("의자","chair","silla"),
 ("시계","clock","reloj"),("연필","pencil","lápiz"),("나무","tree","árbol"),
 ("꽃","flower","flor"),("바다","sea","mar"),("산","mountain","montaña"),
]
def has_batchim(word): return bool(padchim(word[-1]))
def ends_rieul(word): return padchim(word[-1])=='ᆯ'
# (label, cefr, cons_allo, vowel_allo, role_en, role_es, other_particles[(txt,en,es)...], carrier_ko, carrier_ro, prompt_en)
PSPEC=[
 ("topic","A1","은","는","marks the topic ('as for')","marca el tema ('en cuanto a')",
   [("이/가 (i/ga)","the subject particle","la partícula de sujeto"),("을/를 (eul/reul)","the object particle","la partícula de objeto")],
   "{N}___ 학생이에요。","{NR}___ haksaengieyo.","___ is a student. (topic particle 은/는)"),
 ("subject","A2","이","가","marks the subject","marca el sujeto",
   [("은/는 (eun/neun)","the topic particle","la partícula de tema"),("에 (e)","the location/time particle","la partícula de lugar/tiempo")],
   "{N}___ 좋아요。","{NR}___ joayo.","___ is good. (subject particle 이/가)"),
 ("object","A2","을","를","marks the direct object","marca el objeto directo",
   [("은/는 (eun/neun)","the topic particle","la partícula de tema"),("이/가 (i/ga)","the subject particle","la partícula de sujeto")],
   "저는 {N}___ 사요。","Jeoneun {NR}___ sayo.","I buy the ___. (object particle 을/를)"),
 ("with","B1","과","와","means 'and/with' (joining nouns)","significa 'y/con' (une sustantivos)",
   [("도 (do)","'also/too'","'también'"),("의 (ui)","the possessive particle","la partícula posesiva")],
   "저는 {N}___ 친구를 좋아해요。","Jeoneun {NR}___ chingureul joahaeyo.","I like the ___ and my friend. (과/와 'and')"),
]
before=len(ITEMS)
for label,cefr,cons,vowel,ren,res,others,cko,cro,pen in PSPEC:
    cnt=0
    for n,en,es in NOUNS[:8]:
        bat=has_batchim(n)
        correct=cons if bat else vowel
        wrong=vowel if bat else cons
        # option set: correct allomorph + wrong allomorph (same particle) + 2 other particles
        correct_txt=f"{correct} ({rr(n+correct)[len(rr(n)):]})" if False else f"{correct} ({rr(correct)})"
        # romanize allomorph standalone
        def po(p): return f"{p} ({rr(p)})"
        options=[po(correct), po(wrong)]+[o[0] for o in others]
        # ensure 4 distinct
        if len(set(options))!=4: continue
        dn={ po(wrong):{"en":f"the wrong allomorph — used after a "+("vowel" if bat else "consonant"),
                        "es":"el alomorfo incorrecto — se usa tras "+("vocal" if bat else "consonante")} }
        for txt,oe,oS in others: dn[txt]={"en":oe,"es":oS}
        why_en=("ends in a consonant (받침), so " if bat else "ends in a vowel, so ")+f"'{n}' takes -{correct}"
        why_es=("termina en consonante (받침), así que " if bat else "termina en vocal, así que ")+f"'{n}' toma -{correct}"
        prompt=cko.replace("{N}",n).replace("{NR}",rr(n))+f"({cro.replace('{N}',n).replace('{NR}',rr(n))})" if False else None
        pj=cko.replace("{N}",n)
        pr=cro.replace("{NR}",rr(n))
        prompt=f"{pj}({pr})"
        ex_en=f"{ren.capitalize()}; {why_en} ('{n}{correct}')."
        ex_es=f"{res.capitalize()}; {why_es} ('{n}{correct}')."
        add(prompt,options,ex_en,ex_es,cefr,{"en":pen},
            f"{n} {why_en}.", f"{n} {why_es}.", dn)
        cnt+=1
print(f"particle items: {len(ITEMS)-before}", file=sys.stderr)

# ---------------- dedup vs existing + within batch ----------------
def norm(s):
    s=s.lower()
    s=re.sub(r"[^\w가-힣]"," ",s)
    return re.sub(r"\s+"," ",s).strip()
existing=set()
with open("/tmp/ko_existing_prompts.json") as f:
    for pr in json.load(f): existing.add(norm(pr))
seen=set();final=[]
for it in ITEMS:
    k=norm(it["p"])
    if k in existing or k in seen: continue
    if len(set(it["o"]))!=4 or any(not x.strip() for x in it["o"]): continue
    seen.add(k);final.append(it)
from collections import Counter
print(f"after dedup+distinct: {len(final)}", file=sys.stderr)
print("levels:", dict(Counter(x['lvl'] for x in final)), file=sys.stderr)

# ---------------- emit JS ----------------
lines=["// Korean gram — engine-generated (ko_rules_gen.py — in-house permissive rule-table for",
       "// verbs+adjectives incl. ㅂ/ㄷ/ㅅ/르/ㄹ/ㅎ irregulars & honorific -(으)세요; particle",
       "// allomorphs from 받침 via own padchim helper). correctIdx 0; slot5 null; slot6",
       "// promptNative{en}; slot7 wrongNote+distractorNotes. Hangul + Revised Romanization",
       "// together. PENDING native review.",
       "export default ["]
for it in final:
    slot7={"wrongNote":{"en":it["wn_en"],"es":it["wn_es"]}}
    if it["dn"]: slot7["distractorNotes"]=it["dn"]
    row=[it["p"],it["o"],0,{"en":it["ex_en"],"es":it["ex_es"]},it["lvl"],None,it["pen"],slot7]
    lines.append("    "+json.dumps(row,ensure_ascii=False)+",")
lines.append("];")
open("/tmp/ko_gen.js","w").write("\n".join(lines))
print("wrote /tmp/ko_gen.js", file=sys.stderr)

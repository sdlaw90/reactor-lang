# -*- coding: utf-8 -*-
# =============================================================================
# SquirreLingo Chinese (Mandarin) grammar-drill generator
#   scripts/grammar-engines/zh_template_gen.py   — CAPPED TEMPLATE GENERATOR
# =============================================================================
# Mandarin has NO inflectional morphology, so — unlike the ru/ja/ko/de engines —
# there is no conjugation engine here and zh CANNOT reach the ≥90% parity bar.
# This is a hand-authored PATTERN / TEMPLATE library × curated FILLER lexicons.
# It lifts zh grammar BREADTH by instantiating genuinely-distinct grammar points
# (measure words, aspect, 把/被, comparatives, complements, coverbs, conjunctions,
# question words, causatives, reduplication, numerals…). It reuses the SAME
# harness as the four inflected engines: over-generate → dedup vs the full
# existing zh gram bank + within-batch → CEFR-band A1–C2 → SAME-PATTERN
# confusable distractors → mechanical bilingual distractorNotes (#69) → central
# validation → surgical splice appended after the existing gram items.
#
# HARD GUARDRAIL — DO NOT PAD. Every drill is a distinct grammar-point ×
# instantiation, never a lexical reskin of another. The measure-word family is
# genuinely mechanical (curated noun↔classifier list × carrier frame, exactly
# like ko_rules_gen's 받침 particle section). The other families are curated,
# each item a distinct, textbook-standard point. The honest ceiling is reported;
# no filler is added to chase an arbitrary count.
#
# CJK rule: native script (汉字) + TONED pinyin together in every prompt/option.
# Tone sandhi on 一 (yì before tone 1/2/3, yí before tone 4) is applied
# deterministically in the measure-word carrier; all other pinyin is authored.
#
# AI-authored → PENDING native review (#41). Forms/patterns are structurally
# checkable; naturalness/register still needs a zh native pass.
#
# USAGE (offline dev tool; deterministic — no RNG):
#   1) extract existing zh gram prompts+answers to /tmp/zh_existing.json
#      (JSON array of {p: slot0, c: correct-option-text}) via scripts/extract.
#   2) python scripts/grammar-engines/zh_template_gen.py   ->  /tmp/zh_gen.js
#   3) splice /tmp/zh_gen.js item lines into zhForEn.js BANK.gram, APPENDED
#      after the existing items (existing items stay byte-identical).
# =============================================================================
import json, sys, os, re
from collections import Counter

# =============================================================================
#  classifier metadata: hanzi -> (pinyin, tone-for-一-sandhi, en_desc, es_desc)
#  tone 1/2/3 -> 一 = "yì"; tone 4 (incl. neutral-from-4 like 个) -> 一 = "yí"
# =============================================================================
CL = {
 "个": ("gè", 4, "the general, default classifier", "el clasificador general por defecto"),
 "本": ("běn", 3, "bound volumes (books, notebooks)", "volúmenes encuadernados (libros, cuadernos)"),
 "张": ("zhāng", 1, "flat, sheet-like things (paper, tables, tickets)", "cosas planas y laminares (papel, mesas, boletos)"),
 "只": ("zhī", 1, "most small animals; one of a pair", "la mayoría de animales pequeños; uno de un par"),
 "条": ("tiáo", 2, "long, thin, flexible things", "cosas largas, delgadas y flexibles"),
 "位": ("wèi", 4, "people, politely", "personas, con cortesía"),
 "杯": ("bēi", 1, "cups and glasses of liquid", "tazas y vasos de líquido"),
 "件": ("jiàn", 4, "upper-body garments and matters/affairs", "prendas de la parte superior y asuntos"),
 "双": ("shuāng", 1, "things that come in a pair", "cosas que vienen en par"),
 "把": ("bǎ", 3, "objects with a handle or graspable", "objetos con mango o agarradero"),
 "块": ("kuài", 4, "chunks and lumps; the colloquial unit of money", "trozos y pedazos; la unidad coloquial de dinero"),
 "辆": ("liàng", 4, "wheeled vehicles", "vehículos con ruedas"),
 "座": ("zuò", 4, "large, immovable structures (mountains, buildings, bridges)", "estructuras grandes e inamovibles (montañas, edificios, puentes)"),
 "间": ("jiān", 1, "rooms", "habitaciones"),
 "支": ("zhī", 1, "stick-like objects (pens, cigarettes)", "objetos con forma de palo (bolígrafos, cigarrillos)"),
 "份": ("fèn", 4, "portions, servings, and copies", "porciones, raciones y ejemplares"),
 "颗": ("kē", 1, "small, round objects (stars, teeth, beads)", "objetos pequeños y redondos (estrellas, dientes, cuentas)"),
 "群": ("qún", 2, "groups and crowds", "grupos y multitudes"),
 "头": ("tóu", 2, "livestock (cattle, pigs)", "ganado (vacas, cerdos)"),
 "棵": ("kē", 1, "plants and trees", "plantas y árboles"),
 "首": ("shǒu", 3, "songs and poems", "canciones y poemas"),
 "台": ("tái", 2, "machines and appliances", "máquinas y electrodomésticos"),
 "部": ("bù", 4, "films, and larger works or devices", "películas y obras o aparatos mayores"),
 "封": ("fēng", 1, "letters (mail)", "cartas (correo)"),
 "家": ("jiā", 1, "businesses and establishments", "negocios y establecimientos"),
 "幅": ("fú", 2, "paintings and pictures", "pinturas y cuadros"),
 "副": ("fù", 4, "sets (glasses, gloves, cards)", "juegos (gafas, guantes, naipes)"),
 "片": ("piàn", 4, "flat, thin slices or a broad expanse", "rebanadas planas y finas o una amplia extensión"),
 "根": ("gēn", 1, "thin, long, rigid things (sticks, hairs)", "cosas finas, largas y rígidas (palos, cabellos)"),
 "场": ("chǎng", 3, "events and performances (a spell of rain, a match)", "eventos y funciones (un aguacero, un partido)"),
 "节": ("jié", 2, "sections; class periods", "secciones; sesiones de clase"),
 "束": ("shù", 4, "bunches and bouquets", "manojos y ramos"),
 "顿": ("dùn", 4, "meals (and, as a verbal measure, bouts)", "comidas (y, como medida verbal, arranques)"),
 "门": ("mén", 2, "academic courses and subjects", "cursos y asignaturas académicas"),
 "碗": ("wǎn", 3, "bowls of food or liquid", "tazones de comida o líquido"),
 "盘": ("pán", 2, "plates and dishes of food", "platos de comida"),
 "瓶": ("píng", 2, "bottles of liquid", "botellas de líquido"),
 "匹": ("pǐ", 3, "horses and bolts of cloth", "caballos y rollos de tela"),
 "篇": ("piān", 1, "articles and essays", "artículos y ensayos"),
 "种": ("zhǒng", 3, "kinds and types", "clases y tipos"),
}

def yi(tone):
    return "yì" if tone in (1, 2, 3) else "yí"

def copt(cl):
    """classifier -> option string '汉字 (pīnyīn)'"""
    return f"{cl} ({CL[cl][0]})"

# =============================================================================
#  MEASURE-WORD family (mechanical): curated noun↔classifier list × carrier
#  each entry: (noun, noun_pinyin, gloss_en, gloss_es, cefr, correct, [d1,d2,d3], carrier)
#  carrier 'have' -> 我有一___N。 / 'want' -> 我要一___N。  (一 sandhi'd to correct)
# =============================================================================
MW = [
 ("衣服","yīfu","an item of clothing","una prenda de ropa","A1","件",["张","只","条"],"have"),
 ("鞋","xié","a pair of shoes","un par de zapatos","A2","双",["条","张","把"],"have"),
 ("伞","sǎn","an umbrella","un paraguas","A2","把",["张","条","块"],"have"),
 ("椅子","yǐzi","a chair","una silla","A2","把",["张","座","条"],"have"),
 ("蛋糕","dàngāo","a piece of cake","un trozo de pastel","A2","块",["条","张","只"],"want"),
 ("钱","qián","one kuài (a unit of money)","un kuài (unidad de dinero)","A2","块",["张","条","片"],"have"),
 ("石头","shítou","a stone","una piedra","B1","块",["条","张","片"],"have"),
 ("车","chē","a car","un coche","A1","辆",["条","只","座"],"have"),
 ("自行车","zìxíngchē","a bicycle","una bicicleta","A2","辆",["条","只","座"],"have"),
 ("山","shān","a mountain","una montaña","A2","座",["条","片","块"],"have"),
 ("桥","qiáo","a bridge","un puente","B1","座",["张","块","片"],"have"),
 ("教室","jiàoshì","a classroom","un aula","A2","间",["座","张","条"],"have"),
 ("笔","bǐ","a pen","un bolígrafo","A1","支",["条","本","块"],"have"),
 ("烟","yān","a cigarette","un cigarrillo","B1","支",["块","张","条"],"want"),
 ("工作","gōngzuò","a job","un trabajo","A2","份",["张","条","块"],"have"),
 ("星星","xīngxing","a star","una estrella","A2","颗",["只","条","片"],"have"),
 ("牙","yá","a tooth","un diente","B1","颗",["条","只","片"],"have"),
 ("牛","niú","a cow","una vaca","A2","头",["条","匹","座"],"have"),
 ("猪","zhū","a pig","un cerdo","B1","头",["条","匹","座"],"have"),
 ("树","shù","a tree","un árbol","A2","棵",["条","支","根"],"have"),
 ("歌","gē","a song","una canción","A2","首",["张","条","片"],"have"),
 ("诗","shī","a poem","un poema","B1","首",["张","篇","片"],"have"),
 ("电脑","diànnǎo","a computer","una computadora","A1","台",["块","件","张"],"have"),
 ("电视","diànshì","a TV set","un televisor","A2","台",["块","张","条"],"have"),
 ("电影","diànyǐng","a film","una película","A2","部",["张","块","条"],"have"),
 ("信","xìn","a letter","una carta","A2","封",["张","条","块"],"have"),
 ("公司","gōngsī","a company","una empresa","A2","家",["座","条","块"],"have"),
 ("饭馆","fànguǎn","a restaurant","un restaurante","B1","家",["座","条","张"],"have"),
 ("画","huà","a painting","un cuadro","B1","幅",["片","块","条"],"have"),
 ("眼镜","yǎnjìng","a pair of glasses","unas gafas","B1","副",["只","条","块"],"have"),
 ("面包","miànbāo","a slice of bread","una rebanada de pan","A2","片",["张","条","根"],"want"),
 ("头发","tóufa","a strand of hair","un cabello","B1","根",["条","片","块"],"have"),
 ("蜡烛","làzhú","a candle","una vela","B1","根",["块","片","张"],"have"),
 ("花","huā","a bouquet of flowers","un ramo de flores","B1","束",["条","片","块"],"want"),
 ("米饭","mǐfàn","a bowl of rice","un tazón de arroz","A2","碗",["杯","块","张"],"want"),
 ("汤","tāng","a bowl of soup","un tazón de sopa","A2","碗",["杯","块","张"],"want"),
 ("课","kè","a class period","una sesión de clase","A2","节",["场","块","种"],"have"),
]

CARRIER = {
 "have": ("我有一", "Wǒ yǒu", "I have"),
 "want": ("我要一", "Wǒ yào", "I want"),
}

ITEMS = []  # each: dict(p, o, ex_en, ex_es, lvl, pen, wn_en, wn_es, dn)

def add(p, o, ex_en, ex_es, lvl, pen_en, wn_en, wn_es, dn=None):
    ITEMS.append(dict(p=p, o=o, ex_en=ex_en, ex_es=ex_es, lvl=lvl,
                      pen={"en": pen_en}, wn_en=wn_en, wn_es=wn_es, dn=dn or {}))

def build_mw():
    n0 = len(ITEMS)
    for noun, npy, gen, ges, cefr, correct, ds, carrier in MW:
        ch, cpy, cen = CARRIER[carrier]
        t = CL[correct][1]
        prompt = f'{ch}___{noun}。({cpy} {yi(t)} ___ {npy}.) — "{cen} {gen}"'
        options = [copt(correct)] + [copt(d) for d in ds]
        if len(set(options)) != 4:
            continue
        cd_en, cd_es = CL[correct][2], CL[correct][3]
        ex_en = f'The measure word for {cd_en} is {correct}: 一{correct}{noun} ("{gen}"). Mandarin picks a classifier shaped to the noun; the general 个 is not used when a specific one fits.'
        ex_es = f'La palabra medida para {cd_es} es {correct}: 一{correct}{noun} ("{ges}"). El mandarín elige un clasificador acorde al sustantivo; no se usa 个 cuando aplica uno específico.'
        pen = f'{gen[0].upper()+gen[1:]}. (Which measure word fits "{noun}"?)'
        wn_en = f'"{noun}" takes the measure word {correct} → 一{correct}{noun}.'
        wn_es = f'"{noun}" toma la palabra medida {correct} → 一{correct}{noun}.'
        dn = {}
        for d in ds:
            dn[copt(d)] = {"en": f"{d} classifies {CL[d][2]}.",
                           "es": f"{d} clasifica {CL[d][3]}."}
        add(prompt, options, ex_en, ex_es, cefr, pen, wn_en, wn_es, dn)
    print(f"measure-word items: {len(ITEMS)-n0}", file=sys.stderr)

# =============================================================================
#  CURATED families (each item a distinct, textbook-standard grammar point).
#  C(cefr, prompt, correct, [d1,d2,d3], ex_en, ex_es, pen_en, wn_en, wn_es)
#  prompt & options carry 汉字 + toned pinyin (authored). wrongNote only (matches
#  the existing zh gram convention; distractorNotes are added mechanically only
#  for the measure-word family, exactly as ko_rules_gen scopes them).
# =============================================================================
CURATED = []
def C(cefr, prompt, correct, ds, ex_en, ex_es, pen, wn_en, wn_es):
    CURATED.append((cefr, prompt, correct, ds, ex_en, ex_es, pen, wn_en, wn_es))

# (curated families appended below)

def build_curated():
    n0 = len(ITEMS)
    for cefr, prompt, correct, ds, ex_en, ex_es, pen, wn_en, wn_es in CURATED:
        options = [correct] + list(ds)
        if len(set(options)) != 4 or any(not x.strip() for x in options):
            continue
        add(prompt, options, ex_en, ex_es, cefr, pen, wn_en, wn_es, None)
    print(f"curated items: {len(ITEMS)-n0}", file=sys.stderr)

# =============================================================================
#  MAIN: build → dedup → validate → emit
# =============================================================================
def norm(s):
    s = s.lower()
    s = re.sub(r"[^\w一-鿿]", " ", s)
    return re.sub(r"\s+", " ", s).strip()

def main():
    register_curated()
    build_mw()
    build_curated()

    # dedup vs existing (prompt AND correct answer) + within-batch
    existing_p, existing_pc = set(), set()
    with open("/tmp/zh_existing.json", encoding="utf-8") as f:
        for it in json.load(f):
            existing_p.add(norm(it["p"]))
            existing_pc.add((norm(it["p"]), norm(it["c"])))
    seen_p = set()
    final = []
    collisions = 0
    for it in ITEMS:
        kp = norm(it["p"])
        correct = it["o"][0]
        if kp in existing_p or (kp, norm(correct)) in existing_pc or kp in seen_p:
            collisions += 1
            continue
        seen_p.add(kp)
        final.append(it)

    # central validation (structure)
    problems = []
    VALID_CEFR = {"A1", "A2", "B1", "B2", "C1", "C2"}
    for i, it in enumerate(final):
        o = it["o"]
        if len(o) != 4 or len(set(o)) != 4 or any(not x.strip() for x in o):
            problems.append((i, "options: need 4 distinct non-blank"))
        if it["lvl"] not in VALID_CEFR:
            problems.append((i, f"bad CEFR {it['lvl']}"))
        if not it["ex_en"].strip() or not it["ex_es"].strip():
            problems.append((i, "explain must be bilingual/non-empty"))
        if not it["pen"].get("en", "").strip():
            problems.append((i, "promptNative.en missing"))
        if not it["wn_en"].strip() or not it["wn_es"].strip():
            problems.append((i, "wrongNote must be bilingual"))
        for k in it["dn"]:
            if k not in o[1:]:
                problems.append((i, f"distractorNote key not a distractor: {k}"))
        # pinyin present (parenthetical) in prompt
        if "(" not in it["p"]:
            problems.append((i, "prompt missing pinyin parenthetical"))

    print(f"built (pre-dedup): {len(ITEMS)}", file=sys.stderr)
    print(f"dedup collisions removed: {collisions}", file=sys.stderr)
    print(f"final items: {len(final)}", file=sys.stderr)
    print(f"validation problems: {len(problems)}", file=sys.stderr)
    for p in problems[:20]:
        print("  PROBLEM", p, file=sys.stderr)
    print("CEFR:", dict(sorted(Counter(x["lvl"] for x in final).items())), file=sys.stderr)

    if problems:
        print("ABORT: validation problems", file=sys.stderr)
        sys.exit(1)

    # emit JS item lines (8-slot rows, correctIdx 0, slot5 null)
    lines = [
      "    // — zh gram TEMPLATE-GENERATOR expansion 2026-07-21 (zh_template_gen.py:",
      "    //   measure words, aspect, 把/被, comparatives, complements, coverbs,",
      "    //   conjunctions, question words, causatives, reduplication, numerals.",
      "    //   AI-authored, PENDING native review (#41). Mandarin has no inflection,",
      "    //   so zh stays the accepted sub-90% structural exception — breadth, not",
      "    //   conjugation; NOT padded.) —",
    ]
    for it in final:
        slot7 = {"wrongNote": {"en": it["wn_en"], "es": it["wn_es"]}}
        if it["dn"]:
            slot7["distractorNotes"] = it["dn"]
        row = [it["p"], it["o"], 0,
               {"en": it["ex_en"], "es": it["ex_es"]},
               it["lvl"], None, it["pen"], slot7]
        lines.append("    " + json.dumps(row, ensure_ascii=False) + ",")
    out = "\n".join(lines) + "\n"
    with open("/tmp/zh_gen.js", "w", encoding="utf-8") as f:
        f.write(out)
    print(f"wrote /tmp/zh_gen.js ({len(final)} items)", file=sys.stderr)

def register_curated():
    for fn in FAMILIES:
        fn()

FAMILIES = []  # filled by @family-decorated functions below
def family(fn):
    FAMILIES.append(fn)
    return fn

# ============================ CURATED FAMILIES ================================
# (each appends C(...) items; grouped by grammar point. Distinct, non-padded.)

@family
def f_resultative():
    # RESULTATIVE complements (verb + result morpheme). Existing bank already
    # teaches 见/懂/开; these are distinct result morphemes: 到/好/错/会/住/成/掉/干净/清楚/饱.
    C("B1","我终于找___那本书了。(Wǒ zhōngyú zhǎo ___ nà běn shū le.) — I finally found that book",
      "到 (dào)",["完 (wán)","见 (jiàn)","懂 (dǒng)"],
      "A resultative complement fuses a RESULT onto the verb. 到 marks successful attainment — 找到 = 'find', 收到 = 'receive', 买到 = 'manage to buy'.",
      "El complemento resultativo funde un RESULTADO en el verbo. 到 marca el logro exitoso — 找到 'encontrar', 收到 'recibir', 买到 'conseguir comprar'.",
      "I finally found that book. (Which result means 'attain / succeed'?)",
      "'到' = successful attainment → 找到 ('find').","'到' = logro exitoso → 找到 ('encontrar')."),
    C("A2","饭已经做___了,快来吃吧。(Fàn yǐjīng zuò ___ le, kuài lái chī ba.) — the food is ready",
      "好 (hǎo)",["完 (wán)","到 (dào)","见 (jiàn)"],
      "The result 好 marks readiness / a job well finished — 做好 = 'be ready (cooked)', 准备好 = 'be all set', 想好 = 'have decided'.",
      "El resultado 好 marca que algo queda listo / bien terminado — 做好 'estar listo', 准备好 'estar preparado', 想好 'haberlo decidido'.",
      "The food is ready. (Which result means 'ready / well-done'?)",
      "'好' = ready / well-completed → 做好了.","'好' = listo / bien hecho → 做好了."),
    C("A2","对不起,这个字我写___了。(Duìbuqǐ, zhège zì wǒ xiě ___ le.) — sorry, I wrote this character wrong",
      "错 (cuò)",["完 (wán)","好 (hǎo)","坏 (huài)"],
      "The result 错 says the action came out WRONG — 写错 = 'write wrongly', 说错 = 'misspeak', 走错 = 'go the wrong way'.",
      "El resultado 错 dice que la acción salió MAL — 写错 'escribir mal', 说错 'decir mal', 走错 'equivocarse de camino'.",
      "I wrote this character wrong. (Which result means 'wrongly'?)",
      "'错' = the action came out wrong → 写错了.","'错' = la acción salió mal → 写错了."),
    C("B1","练了很久,我终于学___游泳了。(Liàn le hěn jiǔ, wǒ zhōngyú xué ___ yóuyǒng le.) — I finally learned to swim",
      "会 (huì)",["到 (dào)","好 (hǎo)","懂 (dǒng)"],
      "As a RESULT complement, 会 means 'come to master' — 学会 = 'learn (to be able to)', a different job from the modal 会 ('can').",
      "Como complemento de RESULTADO, 会 significa 'llegar a dominar' — 学会 'aprender a (poder)', distinto del modal 会 ('saber').",
      "I finally learned to swim. (Which result means 'master'?)",
      "Result '会' = come to master → 学会游泳.","Resultado '会' = llegar a dominar → 学会游泳."),
    C("B1","这个生词很重要,请你记___。(Zhège shēngcí hěn zhòngyào, qǐng nǐ jì ___.) — remember this word",
      "住 (zhù)",["到 (dào)","好 (hǎo)","完 (wán)"],
      "The result 住 means 'fix firmly in place' — 记住 = 'commit to memory', 站住 = 'halt', 抓住 = 'grasp and hold'.",
      "El resultado 住 significa 'fijar firmemente' — 记住 'memorizar', 站住 '¡alto!', 抓住 'agarrar y sujetar'.",
      "Remember this word. (Which result means 'fix in place'?)",
      "'住' = fix firmly (in memory) → 记住.","'住' = fijar firmemente (en la memoria) → 记住."),
    C("B2","请把这句话翻译___中文。(Qǐng bǎ zhè jù huà fānyì ___ Zhōngwén.) — translate this sentence into Chinese",
      "成 (chéng)",["到 (dào)","好 (hǎo)","完 (wán)"],
      "The result 成 means 'turn into / (do) so as to become' — 翻译成 = 'translate into', 变成 = 'turn into', 写成 = 'write as'.",
      "El resultado 成 significa 'convertir(se) en' — 翻译成 'traducir a', 变成 'convertirse en', 写成 'escribir como'.",
      "Translate this into Chinese. (Which result means 'into'?)",
      "'成' = turn into → 翻译成中文.","'成' = convertir en → 翻译成中文."),
    C("B1","我早就把那件事忘___了。(Wǒ zǎojiù bǎ nà jiàn shì wàng ___ le.) — I forgot that matter long ago",
      "掉 (diào)",["完 (wán)","好 (hǎo)","走 (zǒu)"],
      "The result 掉 marks removal / disappearance — 忘掉 = 'forget (be rid of)', 扔掉 = 'throw away', 去掉 = 'remove'.",
      "El resultado 掉 marca eliminación / desaparición — 忘掉 'olvidar (deshacerse de)', 扔掉 'tirar', 去掉 'quitar'.",
      "I forgot that matter. (Which result means 'away / off'?)",
      "'掉' = removal / disappearance → 忘掉.","'掉' = eliminación / desaparición → 忘掉."),
    C("B1","走以前,请把桌子擦___。(Zǒu yǐqián, qǐng bǎ zhuōzi cā ___.) — wipe the table clean before leaving",
      "干净 (gānjìng)",["完 (wán)","好 (hǎo)","到 (dào)"],
      "An adjective can be the RESULT: 擦干净 = 'wipe (until) clean', 洗干净 = 'wash clean'. The verb states the action, the adjective its resulting state.",
      "Un adjetivo puede ser el RESULTADO: 擦干净 'limpiar frotando', 洗干净 'lavar hasta dejar limpio'. El verbo da la acción; el adjetivo, el estado resultante.",
      "Wipe the table clean. (Which adjective-result means 'clean'?)",
      "Adjective-result '干净' = (until) clean → 擦干净.","Resultado-adjetivo '干净' = (hasta quedar) limpio → 擦干净."),
    C("B1","请你把问题说___,我没听明白。(Qǐng nǐ bǎ wèntí shuō ___, wǒ méi tīng míngbai.) — explain the problem clearly",
      "清楚 (qīngchu)",["完 (wán)","好 (hǎo)","懂 (dǒng)"],
      "The adjective-result 清楚 = '(so as to be) clear' — 说清楚 = 'explain clearly', 看清楚 = 'see clearly', 写清楚 = 'write legibly'.",
      "El resultado-adjetivo 清楚 = '(de modo) claro' — 说清楚 'explicar con claridad', 看清楚 'ver con claridad', 写清楚 'escribir legible'.",
      "Explain the problem clearly. (Which result means 'clearly'?)",
      "'清楚' = (so as to be) clear → 说清楚.","'清楚' = (de modo) claro → 说清楚."),
    C("B1","我已经吃___了,不能再吃了。(Wǒ yǐjīng chī ___ le, bù néng zài chī le.) — I'm full, I can't eat more",
      "饱 (bǎo)",["完 (wán)","好 (hǎo)","满 (mǎn)"],
      "The result 饱 = 'to satiety' — 吃饱 = 'eat one's fill'. Contrast 吃完 = 'finish (all) the food'; 饱 is about the eater's fullness, not the food running out.",
      "El resultado 饱 = 'hasta saciarse' — 吃饱 'comer hasta llenarse'. Contrasta con 吃完 'terminar (toda) la comida'; 饱 se refiere a la saciedad, no a que se acabe la comida.",
      "I'm full. (Which result means 'to fullness'?)",
      "'饱' = to satiety → 吃饱了.","'饱' = hasta saciarse → 吃饱了."),

@family
def f_directional():
    # COMPOUND DIRECTIONAL complements. Existing teaches 出来/上去/进去/下来/出去/起来(recall);
    # these are distinct compound directions and the deictic 来/去 contrast.
    C("B1","他看见我,就慢慢地走___了。(Tā kànjiàn wǒ, jiù mànmàn de zǒu ___ le.) — he walked over toward me",
      "过来 (guòlái)",["过去 (guòqù)","起来 (qǐlái)","下来 (xiàlái)"],
      "过来 = motion toward the speaker ('come over'). The 来 makes it toward-me; 过去 (with 去) would be moving away.",
      "过来 = movimiento hacia el hablante ('venir acá'). El 来 lo hace hacia mí; 过去 (con 去) sería alejarse.",
      "He walked over toward me. (Which compound direction = 'over, toward me'?)",
      "'过来' = motion toward the speaker → 走过来.","'过来' = movimiento hacia el hablante → 走过来."),
    C("B1","他没看见我,从我身边走___了。(Tā méi kànjiàn wǒ, cóng wǒ shēnbiān zǒu ___ le.) — he walked right past me",
      "过去 (guòqù)",["过来 (guòlái)","出来 (chūlái)","起来 (qǐlái)"],
      "过去 = motion away from / past the speaker. The deictic 去 points away-from-me, the mirror of 过来.",
      "过去 = movimiento alejándose de / pasando junto al hablante. El deíctico 去 apunta lejos de mí, espejo de 过来.",
      "He walked past me (away). (Which compound direction = 'past, away'?)",
      "'过去' = motion away/past the speaker → 走过去.","'过去' = alejarse/pasar del hablante → 走过去."),
    C("A2","老师进来了,请大家站___。(Lǎoshī jìnlái le, qǐng dàjiā zhàn ___.) — please stand up",
      "起来 (qǐlái)",["上去 (shàngqù)","过来 (guòlái)","下来 (xiàlái)"],
      "起来 as a direction = 'up (from a lower position)': 站起来 = 'stand up', 拿起来 = 'pick up'. (Distinct from 想起来 = 'recall'.)",
      "起来 como dirección = 'hacia arriba (desde abajo)': 站起来 'ponerse de pie', 拿起来 'recoger'. (Distinto de 想起来 'recordar'.)",
      "Please stand up. (Which direction means 'up' from sitting?)",
      "Directional '起来' = up → 站起来.","'起来' direccional = hacia arriba → 站起来."),
    C("B1","太危险了,他竟然从楼上跳___了。(Tài wēixiǎn le, tā jìngrán cóng lóushàng tiào ___ le.) — he jumped down off the building",
      "下去 (xiàqù)",["下来 (xiàlái)","出去 (chūqù)","过去 (guòqù)"],
      "下去 = 'down and away (from a high point, not toward the speaker)': 跳下去, 走下去. With 来 (下来) it would be down toward the speaker.",
      "下去 = 'hacia abajo y lejos (desde un punto alto, no hacia el hablante)': 跳下去, 走下去. Con 来 (下来) sería hacia abajo acercándose.",
      "He jumped down off the building. (Which direction = 'down, away'?)",
      "'下去' = down and away → 跳下去.","'下去' = hacia abajo y lejos → 跳下去."),
    C("A2","别忘了把借的书拿___。(Bié wàng le bǎ jiè de shū ná ___.) — don't forget to bring back the borrowed books",
      "回来 (huílái)",["回去 (huíqù)","过来 (guòlái)","出来 (chūlái)"],
      "回来 = 'back, toward the speaker' (return here): 拿回来 = 'bring back', 跑回来 = 'run back'. 回去 would be back away from here.",
      "回来 = 'de vuelta, hacia el hablante' (regresar acá): 拿回来 'traer de vuelta', 跑回来 'volver corriendo'. 回去 sería regresar alejándose.",
      "Bring back the borrowed books. (Which direction = 'back, here'?)",
      "'回来' = back toward the speaker → 拿回来.","'回来' = de vuelta hacia el hablante → 拿回来."),
    C("A2","看完以后,请把书放___。(Kàn wán yǐhòu, qǐng bǎ shū fàng ___.) — put the book back afterward",
      "回去 (huíqù)",["回来 (huílái)","下去 (xiàqù)","出去 (chūqù)"],
      "回去 = 'back, away from here' (return it to where it was): 放回去 = 'put back', 送回去 = 'return / see back'.",
      "回去 = 'de vuelta, lejos de aquí' (devolverlo a su sitio): 放回去 'volver a poner', 送回去 'devolver / acompañar de regreso'.",
      "Put the book back. (Which direction = 'back, away'?)",
      "'回去' = back, away from here → 放回去.","'回去' = de vuelta, lejos de aquí → 放回去."),
    C("B1","客人在楼上,他从一楼跑___了。(Kèrén zài lóushàng, tā cóng yī lóu pǎo ___ le.) — he ran up here from the first floor",
      "上来 (shànglái)",["上去 (shàngqù)","过来 (guòlái)","起来 (qǐlái)"],
      "上来 = 'up, toward the speaker' (speaker is upstairs): 跑上来 = 'run up (to me)'. 上去 would be up, away from me.",
      "上来 = 'hacia arriba, acercándose al hablante' (que está arriba): 跑上来 'subir corriendo (hacia mí)'. 上去 sería hacia arriba, alejándose.",
      "He ran up here. (Which direction = 'up, toward me'?)",
      "'上来' = up, toward the speaker → 跑上来.","'上来' = hacia arriba, hacia el hablante → 跑上来."),
    C("A1","外面很冷,快___吧!(Wàimiàn hěn lěng, kuài ___ ba!) — come in, it's cold outside!",
      "进来 (jìnlái)",["进去 (jìnqù)","出来 (chūlái)","过来 (guòlái)"],
      "进来 = 'in, toward the speaker' (speaker is inside): 快进来 = 'come in'. 进去 would be in, away from the speaker.",
      "进来 = 'hacia adentro, acercándose al hablante' (que está dentro): 快进来 'entra'. 进去 sería hacia adentro, alejándose.",
      "Come in, it's cold! (Which direction = 'in, toward me'?)",
      "'进来' = in, toward the speaker → 快进来.","'进来' = hacia adentro, hacia el hablante → 快进来."),

@family
def f_potential():
    # POTENTIAL complements V得/不+result — distinct compounds (afford, in time,
    # move, fall asleep, stand, see). Existing teaches 听得懂/听不懂/吃不完.
    C("B1","这么贵的车,我买不___。(Zhème guì de chē, wǒ mǎi bu ___.) — I can't afford such an expensive car",
      "起 (qǐ)",["到 (dào)","动 (dòng)","了 (liǎo)"],
      "买不起 = 'can't afford'. The potential complement 起 (with 得/不) measures affordability: 买得起 = 'can afford', 买不起 = 'cannot'.",
      "买不起 = 'no poder pagar'. El complemento potencial 起 (con 得/不) mide la capacidad de pagar: 买得起 'poder permitírselo', 买不起 'no poder'.",
      "I can't afford this car. (Which result completes 买不__ = 'afford'?)",
      "Potential '起': 买不起 = can't afford.","Potencial '起': 买不起 = no poder pagar."),
    C("B2","快一点,不然我们就来不___了。(Kuài yìdiǎn, bùrán wǒmen jiù lái bu ___ le.) — hurry, or we won't make it in time",
      "及 (jí)",["到 (dào)","起 (qǐ)","完 (wán)"],
      "来不及 = 'not enough time (to do it)'; 来得及 = 'there's still time'. The complement 及 = 'reach (in time)'.",
      "来不及 = 'no da tiempo'; 来得及 = 'aún hay tiempo'. El complemento 及 = 'alcanzar (a tiempo)'.",
      "We won't make it in time. (Which result completes 来不__ = 'in time'?)",
      "Potential '及': 来不及 = no time / too late.","Potencial '及': 来不及 = no da tiempo."),
    C("B2","这个箱子太重了,我一个人搬不___。(Zhège xiāngzi tài zhòng le, wǒ yí ge rén bān bu ___.) — too heavy, I can't move it alone",
      "动 (dòng)",["起 (qǐ)","到 (dào)","了 (liǎo)"],
      "搬不动 = 'can't move (by force)'. The complement 动 measures whether force suffices: 拿不动 = 'too heavy to carry', 走不动 = 'too tired to walk on'.",
      "搬不动 = 'no poder mover (por la fuerza)'. El complemento 动 mide si la fuerza alcanza: 拿不动 'demasiado pesado para cargar', 走不动 'demasiado cansado para seguir'.",
      "I can't move this box. (Which result completes 搬不__ = 'move it'?)",
      "Potential '动': 搬不动 = can't budge it.","Potencial '动': 搬不动 = no poder moverlo."),
    C("B1","晚上喝了咖啡,我睡不___。(Wǎnshang hē le kāfēi, wǒ shuì bu ___.) — I had coffee and can't fall asleep",
      "着 (zháo)",["到 (dào)","了 (liǎo)","好 (hǎo)"],
      "睡不着 (zháo) = 'can't fall asleep'; 睡得着 = 'can'. Here 着 is read zháo and means 'succeed in (the state)': 找不着 = 'can't find'.",
      "睡不着 (zháo) = 'no poder dormirse'; 睡得着 = 'sí poder'. Aquí 着 se lee zháo y significa 'lograr (el estado)': 找不着 'no poder encontrar'.",
      "I can't fall asleep. (Which result completes 睡不__ = 'fall asleep'?)",
      "Potential '着' (zháo): 睡不着 = can't fall asleep.","Potencial '着' (zháo): 睡不着 = no poder dormirse."),
    C("B1","这里太吵了,我真受不___。(Zhèlǐ tài chǎo le, wǒ zhēn shòu bu ___.) — it's so noisy, I really can't stand it",
      "了 (liǎo)",["起 (qǐ)","到 (dào)","着 (zháo)"],
      "受不了 (liǎo) = 'can't bear it'; 受得了 = 'can bear it'. This 了 is read liǎo ('manage / endure'), not the aspect 了 (le).",
      "受不了 (liǎo) = 'no aguantarlo'; 受得了 = 'poder aguantarlo'. Este 了 se lee liǎo ('poder / soportar'), no el 了 aspectual (le).",
      "I can't stand it. (Which result completes 受不__ = 'bear it'?)",
      "Potential '了' (liǎo): 受不了 = can't bear it.","Potencial '了' (liǎo): 受不了 = no aguantar."),
    C("A2","今天天气很好,我看___见那座山。(Jīntiān tiānqì hěn hǎo, wǒ kàn ___ jiàn nà zuò shān.) — I can see that mountain",
      "得 (de)",["不 (bù)","了 (le)","着 (zhe)"],
      "看得见 = 'can see (successfully perceive)'. Inserting 得 makes the positive potential; 不 (看不见) makes the negative 'can't see'.",
      "看得见 = 'poder ver (percibir con éxito)'. Insertar 得 forma el potencial positivo; 不 (看不见) el negativo 'no poder ver'.",
      "I can see the mountain. (Which particle makes 看__见 = 'can see'?)",
      "Positive potential inserts 得 → 看得见.","El potencial positivo inserta 得 → 看得见."),

@family
def f_freqdur():
    # FREQUENCY (次/遍/下/顿) and DURATION complements.
    C("A2","长城我去过三___。(Chángchéng wǒ qùguò sān ___.) — I've been to the Great Wall three times",
      "次 (cì)",["遍 (biàn)","下 (xià)","个 (gè)"],
      "次 is the general frequency measure — how many separate OCCASIONS an action happened: 去过三次 = 'been three times'.",
      "次 es la medida de frecuencia general — cuántas OCASIONES distintas ocurrió la acción: 去过三次 'haber ido tres veces'.",
      "I've been three times. (Which measure counts 'times / occasions'?)",
      "'次' counts occasions → 三次.","'次' cuenta ocasiones → 三次."),
    C("B1","这部电影我已经看了三___了。(Zhè bù diànyǐng wǒ yǐjīng kàn le sān ___ le.) — I've watched this movie three times through",
      "遍 (biàn)",["次 (cì)","下 (xià)","回 (huí)"],
      "遍 counts times an action is done from START TO FINISH — 看了三遍 = 'watched it through three times'. 次 counts occasions without stressing completeness.",
      "遍 cuenta las veces que una acción se hace DE PRINCIPIO A FIN — 看了三遍 'verla entera tres veces'. 次 cuenta ocasiones sin enfatizar lo completo.",
      "I've watched it through three times. (Which measure = 'times, cover to cover'?)",
      "'遍' = through, start to finish → 三遍.","'遍' = de principio a fin → 三遍."),
    C("A1","不好意思,请等一___。(Bù hǎoyìsi, qǐng děng yí ___.) — sorry, please wait a moment",
      "下 (xià)",["次 (cì)","遍 (biàn)","点 (diǎn)"],
      "下 (often 一下) is a brief VERBAL measure — 'do V once, briefly': 等一下 = 'wait a sec', 看一下 = 'take a quick look'.",
      "下 (a menudo 一下) es una medida VERBAL breve — 'hacer V una vez, brevemente': 等一下 'espera un momento', 看一下 'echa un vistazo'.",
      "Please wait a moment. (Which brief verbal measure = 'a moment'?)",
      "'一下' = a brief instance → 等一下.","'一下' = un instante breve → 等一下."),
    C("B2","他上班又迟到了,老板说了他一___。(Tā shàngbān yòu chídào le, lǎobǎn shuō le tā yí ___.) — the boss gave him a good talking-to",
      "顿 (dùn)",["次 (cì)","遍 (biàn)","下 (xià)"],
      "顿 is the verbal measure for bouts of eating, scolding, or beating — 说了一顿 / 骂了一顿 = 'gave (him) a (whole) telling-off', 吃了一顿 = 'had a meal'.",
      "顿 es la medida verbal para arranques de comer, regañar o golpear — 说了一顿 / 骂了一顿 'echar una (buena) bronca', 吃了一顿 'comer (una comida)'.",
      "The boss gave him a talking-to. (Which verbal measure fits a scolding?)",
      "'顿' = a bout (of scolding/eating) → 说了一顿.","'顿' = un arranque (de regaño/comida) → 说了一顿."),
    C("A2","累了吧?我们休息___吧。(Lèi le ba? Wǒmen xiūxi ___ ba.) — tired? let's rest a while",
      "一会儿 (yíhuìr)",["一点儿 (yìdiǎnr)","一下子 (yíxiàzi)","一次 (yí cì)"],
      "一会儿 is a short DURATION ('a while, a short time') placed after the verb: 休息一会儿 = 'rest a while', 等一会儿 = 'wait a while'.",
      "一会儿 es una DURACIÓN corta ('un rato') que va tras el verbo: 休息一会儿 'descansar un rato', 等一会儿 'esperar un rato'.",
      "Let's rest a while. (Which means 'a while' as a duration?)",
      "'一会儿' = a short while (duration) → 休息一会儿.","'一会儿' = un rato (duración) → 休息一会儿."),
    C("B2","我学中文___三年了。(Wǒ xué Zhōngwén ___ sān nián le.) — I've been studying Chinese for three years",
      "学了 (xué le)",["了 (le)","的 (de)","得 (de)"],
      "With an object, a DURATION complement forces the verb to REPEAT: 学中文学了三年 ('study-Chinese studied three years'). The bare 学中文了三年 is ungrammatical.",
      "Con objeto, un complemento de DURACIÓN obliga a REPETIR el verbo: 学中文学了三年 ('estudiar-chino estudiado tres años'). El simple 学中文了三年 es agramatical.",
      "I've studied Chinese for three years. (What must fill the slot after the object?)",
      "Duration after an object repeats the verb → 学中文学了三年.","La duración tras un objeto repite el verbo → 学中文学了三年."),

@family
def f_modal():
    # MODALS / auxiliaries beyond existing 想/会/能(-不能): 应该/得(děi)/可以/要/能/愿意/敢 + 会-vs-能.
    C("A2","你病了,___多休息,少工作。(Nǐ bìng le, ___ duō xiūxi, shǎo gōngzuò.) — you should rest more",
      "应该 (yīnggāi)",["会 (huì)","想 (xiǎng)","过 (guo)"],
      "应该 = 'should / ought to', giving advice or moral expectation: 你应该多休息 = 'you should rest more'.",
      "应该 = 'deber / haber de', para consejo o expectativa: 你应该多休息 = 'deberías descansar más'.",
      "You should rest more. (Which modal = 'should'?)",
      "'应该' = should / ought to → 应该多休息.","'应该' = deber / haber de → 应该多休息."),
    C("B1","时间不早了,我___走了。(Shíjiān bù zǎo le, wǒ ___ zǒu le.) — it's getting late, I have to go",
      "得 (děi)",["想 (xiǎng)","会 (huì)","过 (guo)"],
      "得 (read děi) = 'have to / must', a colloquial obligation: 我得走了 = 'I must be off'. (Different word from the complement 得, de.)",
      "得 (léase děi) = 'tener que / deber', obligación coloquial: 我得走了 = 'me tengo que ir'. (Palabra distinta del complemento 得, de.)",
      "It's late, I have to go. (Which modal = 'have to'?)",
      "'得' (děi) = have to / must → 我得走了.","'得' (děi) = tener que → 我得走了."),
    C("A1","老师,我___去洗手间吗?(Lǎoshī, wǒ ___ qù xǐshǒujiān ma?) — teacher, may I go to the toilet?",
      "可以 (kěyǐ)",["应该 (yīnggāi)","会 (huì)","想 (xiǎng)"],
      "可以 asks for or grants PERMISSION ('may / be allowed to'): 我可以走吗? = 'may I go?'.",
      "可以 pide o concede PERMISO ('poder / estar permitido'): 我可以走吗? = '¿puedo irme?'.",
      "May I go to the toilet? (Which modal asks permission?)",
      "'可以' = may / be allowed → 可以去吗?","'可以' = poder / tener permiso → 可以去吗?"),
    C("A2","我明天___去上海出差。(Wǒ míngtiān ___ qù Shànghǎi chūchāi.) — I'm going to Shanghai on business tomorrow",
      "要 (yào)",["会 (huì)","能 (néng)","过 (guo)"],
      "要 marks INTENTION / a firm plan ('be going to, will'): 我要去上海 = 'I'm going to Shanghai'. Stronger and more concrete than 想 ('would like to').",
      "要 marca INTENCIÓN / plan firme ('ir a, va a'): 我要去上海 = 'voy a ir a Shanghái'. Más fuerte y concreto que 想 ('tener ganas de').",
      "I'm going to Shanghai tomorrow. (Which modal = 'be going to / intend'?)",
      "'要' = intention / firm plan → 我要去上海.","'要' = intención / plan firme → 我要去上海."),
    C("A2","你明天___来参加我的生日会吗?(Nǐ míngtiān ___ lái cānjiā wǒ de shēngrì huì ma?) — are you able to come tomorrow?",
      "能 (néng)",["会 (huì)","应该 (yīnggāi)","可以 (kěyǐ)"],
      "能 asks about CIRCUMSTANTIAL ability — whether conditions permit ('are you able / free to'): 你能来吗? = 'can you make it?'.",
      "能 pregunta por la capacidad CIRCUNSTANCIAL — si las condiciones permiten ('poder / estar libre'): 你能来吗? = '¿puedes venir?'.",
      "Can you come tomorrow? (Which modal = circumstantial 'be able to'?)",
      "'能' = circumstantial ability → 你能来吗?","'能' = capacidad circunstancial → 你能来吗?"),
    C("B2","他很自私,不___帮助别人。(Tā hěn zìsī, bù ___ bāngzhù biérén.) — he's selfish and unwilling to help others",
      "愿意 (yuànyì)",["应该 (yīnggāi)","可以 (kěyǐ)","能 (néng)"],
      "愿意 = 'be willing to', about the subject's WILLINGNESS: 不愿意帮忙 = 'unwilling to help'.",
      "愿意 = 'estar dispuesto a', sobre la VOLUNTAD del sujeto: 不愿意帮忙 = 'no querer ayudar'.",
      "He's unwilling to help. (Which modal = 'be willing to'?)",
      "'愿意' = be willing to → 不愿意帮忙.","'愿意' = estar dispuesto a → 不愿意帮忙."),
    C("B2","天太黑了,他不___一个人回家。(Tiān tài hēi le, tā bù ___ yí ge rén huí jiā.) — too dark, he doesn't dare go home alone",
      "敢 (gǎn)",["想 (xiǎng)","会 (huì)","能 (néng)"],
      "敢 = 'dare to', about courage: 不敢一个人回家 = 'doesn't dare go home alone'.",
      "敢 = 'atreverse a', sobre el valor: 不敢一个人回家 = 'no atreverse a volver solo a casa'.",
      "He doesn't dare go home alone. (Which modal = 'dare'?)",
      "'敢' = dare to → 不敢回家.","'敢' = atreverse a → 不敢回家."),
    C("B2","我会游泳,可是今天感冒了,不___下水。(Wǒ huì yóuyǒng, kěshì jīntiān gǎnmào le, bù ___ xià shuǐ.) — I can swim, but I'm sick today and can't get in the water",
      "能 (néng)",["会 (huì)","可以 (kěyǐ)","应该 (yīnggāi)"],
      "会 = a learned SKILL you possess; 能 = whether circumstances allow using it now. You 会游泳 (know how) but today can't (不能) because you're ill.",
      "会 = una HABILIDAD aprendida que se posee; 能 = si las circunstancias permiten usarla ahora. Sabes nadar (会) pero hoy no puedes (不能) por estar enfermo.",
      "I can swim but can't get in the water today. (Skill vs circumstance — which fits?)",
      "Circumstance blocks it → 不能下水 (会 = the skill, still intact).","La circunstancia lo impide → 不能下水 (会 = la habilidad, intacta)."),

@family
def f_adverb():
    # ADVERBS & scope: 都/再/又/还/只/一直/一起/一定/差不多/差点儿/终于/其实/大概/到底.
    C("A1","他们___是我的好朋友。(Tāmen ___ shì wǒ de hǎo péngyou.) — they are all my good friends",
      "都 (dōu)",["也 (yě)","还 (hái)","就 (jiù)"],
      "都 = 'all / both', summing up the plural subject before it: 他们都是学生 = 'they are all students'. It always precedes the verb.",
      "都 = 'todos / ambos', resumiendo el sujeto plural anterior: 他们都是学生 = 'todos son estudiantes'. Siempre va antes del verbo.",
      "They are all my friends. (Which adverb = 'all'?)",
      "'都' = all → 他们都是.","'都' = todos → 他们都是."),
    C("A2","这个菜真好吃,请___做一次。(Zhège cài zhēn hǎochī, qǐng ___ zuò yí cì.) — so tasty, please make it again",
      "再 (zài)",["又 (yòu)","还 (hái)","也 (yě)"],
      "再 = 'again', for a repetition that has NOT yet happened (a request/future): 再做一次 = 'make it once more'. Contrast 又 (already repeated).",
      "再 = 'otra vez', para una repetición que AÚN no ha ocurrido (petición/futuro): 再做一次 = 'hazlo una vez más'. Contrasta con 又 (ya repetido).",
      "Please make it again. (Which 'again' is for the future?)",
      "'再' = again (not yet, future) → 再做一次.","'再' = otra vez (aún no, futuro) → 再做一次."),
    C("A2","他昨天来了,今天___来了。(Tā zuótiān lái le, jīntiān ___ lái le.) — he came yesterday and came again today",
      "又 (yòu)",["再 (zài)","还 (hái)","也 (yě)"],
      "又 = 'again', for a repetition that HAS already happened: 又来了 = '(he) came again'. Mirror of 再 (not-yet future).",
      "又 = 'otra vez', para una repetición que YA ocurrió: 又来了 = '(él) vino de nuevo'. Espejo de 再 (futuro aún no).",
      "He came again today. (Which 'again' is for the realized past?)",
      "'又' = again (already happened) → 今天又来了.","'又' = otra vez (ya ocurrió) → 今天又来了."),
    C("A2","已经十二点了,他___在工作。(Yǐjīng shí'èr diǎn le, tā ___ zài gōngzuò.) — it's midnight and he's still working",
      "还 (hái)",["又 (yòu)","再 (zài)","就 (jiù)"],
      "还 before the verb = 'still, yet' — a state continuing longer than expected: 还在工作 = 'still working'.",
      "还 antes del verbo = 'todavía, aún' — un estado que sigue más de lo esperado: 还在工作 = 'todavía trabajando'.",
      "He's still working. (Which adverb = 'still'?)",
      "'还' = still / yet → 还在工作.","'还' = todavía / aún → 还在工作."),
    C("A1","我___有十块钱,不够买这本书。(Wǒ ___ yǒu shí kuài qián, bú gòu mǎi zhè běn shū.) — I only have ten kuai",
      "只 (zhǐ)",["都 (dōu)","也 (yě)","还 (hái)"],
      "只 = 'only, merely', limiting quantity or scope: 只有十块钱 = 'have only ten kuai'.",
      "只 = 'solo, únicamente', limitando cantidad o alcance: 只有十块钱 = 'tener solo diez kuai'.",
      "I only have ten kuai. (Which adverb = 'only'?)",
      "'只' = only → 只有十块钱.","'只' = solo → 只有十块钱."),
    C("B1","从早上到现在,他___在等你。(Cóng zǎoshang dào xiànzài, tā ___ zài děng nǐ.) — he's been waiting for you all along",
      "一直 (yìzhí)",["就 (jiù)","才 (cái)","再 (zài)"],
      "一直 = 'continuously, all along', an action unbroken over a stretch of time: 一直在等你 = 'has been waiting the whole time'.",
      "一直 = 'sin parar, todo el tiempo', una acción ininterrumpida a lo largo de un lapso: 一直在等你 = 'ha estado esperando todo el rato'.",
      "He's been waiting all along. (Which adverb = 'continuously'?)",
      "'一直' = continuously / all along → 一直在等.","'一直' = sin parar / todo el tiempo → 一直在等."),
    C("A1","周末我们___去看电影吧。(Zhōumò wǒmen ___ qù kàn diànyǐng ba.) — let's go see a movie together this weekend",
      "一起 (yìqǐ)",["一边 (yìbiān)","一直 (yìzhí)","一定 (yídìng)"],
      "一起 = 'together, jointly' — doing something with others: 一起去 = 'go together'.",
      "一起 = 'juntos, en conjunto' — hacer algo con otros: 一起去 = 'ir juntos'.",
      "Let's go together. (Which adverb = 'together'?)",
      "'一起' = together → 一起去.","'一起' = juntos → 一起去."),
    C("A2","别担心,我明天___来帮你。(Bié dānxīn, wǒ míngtiān ___ lái bāng nǐ.) — don't worry, I'll definitely come help",
      "一定 (yídìng)",["一直 (yìzhí)","一起 (yìqǐ)","一点 (yìdiǎn)"],
      "一定 = 'definitely, for sure', expressing certainty or a firm promise: 我一定来 = 'I'll definitely come'.",
      "一定 = 'sin falta, seguro', para certeza o promesa firme: 我一定来 = 'vendré sin falta'.",
      "I'll definitely come. (Which adverb = 'definitely'?)",
      "'一定' = definitely / for sure → 一定来.","'一定' = sin falta / seguro → 一定来."),
    C("B1","时间___到了,我们该走了。(Shíjiān ___ dào le, wǒmen gāi zǒu le.) — it's just about time to go",
      "差不多 (chàbuduō)",["差一点 (chà yìdiǎn)","不但 (búdàn)","而且 (érqiě)"],
      "差不多 = 'about, almost, more or less' — approximation: 差不多到了 = 'nearly time / nearly there'.",
      "差不多 = 'casi, más o menos' — aproximación: 差不多到了 = 'casi es la hora / casi llegamos'.",
      "It's about time. (Which adverb = 'about / almost'?)",
      "'差不多' = about / almost → 差不多到了.","'差不多' = casi / más o menos → 差不多到了."),
    C("B2","路上太堵了,我___迟到了。(Lùshang tài dǔ le, wǒ ___ chídào le.) — traffic was bad, I almost was late",
      "差点儿 (chàdiǎnr)",["差不多 (chàbuduō)","有点儿 (yǒudiǎnr)","一点儿 (yìdiǎnr)"],
      "差点儿 = 'almost / nearly (but didn't)', for an event that ALMOST happened: 差点儿迟到 = 'almost was late (but made it)'. 差不多 is mere approximation.",
      "差点儿 = 'por poco / casi (pero no)', para un evento que CASI ocurre: 差点儿迟到 = 'por poco llego tarde (pero llegué)'. 差不多 es solo aproximación.",
      "I almost was late. (Which adverb = 'almost (but didn't)'?)",
      "'差点儿' = almost happened → 差点儿迟到.","'差点儿' = casi ocurre → 差点儿迟到."),
    C("B1","找了三个月,他___找到工作了。(Zhǎo le sān ge yuè, tā ___ zhǎodào gōngzuò le.) — after three months he finally found a job",
      "终于 (zhōngyú)",["到底 (dàodǐ)","一直 (yìzhí)","本来 (běnlái)"],
      "终于 = 'finally, at last', for a long-awaited outcome that arrives: 终于找到了 = 'found it at last'.",
      "终于 = 'por fin, al final', para un resultado largamente esperado: 终于找到了 = 'por fin lo encontró'.",
      "He finally found a job. (Which adverb = 'finally'?)",
      "'终于' = finally / at last → 终于找到了.","'终于' = por fin → 终于找到了."),
    C("B1","他看起来很凶,___很友好。(Tā kànqǐlai hěn xiōng, ___ hěn yǒuhǎo.) — he looks fierce, but is actually friendly",
      "其实 (qíshí)",["一定 (yídìng)","终于 (zhōngyú)","本来 (běnlái)"],
      "其实 = 'actually, in fact', correcting a surface impression: 其实很友好 = 'is actually friendly'.",
      "其实 = 'en realidad, de hecho', corrigiendo una impresión superficial: 其实很友好 = 'en realidad es amable'.",
      "He's actually friendly. (Which adverb = 'actually'?)",
      "'其实' = actually / in fact → 其实很友好.","'其实' = en realidad → 其实很友好."),
    C("B1","他没接电话,___不在家。(Tā méi jiē diànhuà, ___ bú zài jiā.) — he didn't answer, he's probably not home",
      "大概 (dàgài)",["一定 (yídìng)","终于 (zhōngyú)","其实 (qíshí)"],
      "大概 = 'probably, roughly', a hedged guess: 大概不在家 = 'probably not home'.",
      "大概 = 'probablemente, más o menos', una conjetura moderada: 大概不在家 = 'probablemente no está en casa'.",
      "He's probably not home. (Which adverb = 'probably'?)",
      "'大概' = probably → 大概不在家.","'大概' = probablemente → 大概不在家."),
    C("B2","你___去还是不去?快点决定!(Nǐ ___ qù háishì bú qù? Kuài diǎn juédìng!) — are you going or not, get to the point!",
      "到底 (dàodǐ)",["一直 (yìzhí)","终于 (zhōngyú)","本来 (běnlái)"],
      "到底 in a question = 'on earth / after all', pressing for a definite answer: 你到底去不去? = 'ARE you going or not?'.",
      "到底 en una pregunta = 'al fin y al cabo / en definitiva', exigiendo respuesta clara: 你到底去不去? = '¿VAS o no vas?'.",
      "Are you going or not?! (Which adverb presses 'on earth'?)",
      "'到底' = on earth (pressing) → 你到底去不去?","'到底' = al fin y al cabo → 你到底去不去?"),

@family
def f_coverb():
    # COVERBS / prepositions: 给/跟/对/为/为了/替/离/往/向/用/关于/按照/在/朝.
    C("A2","妈妈___我做了一个大蛋糕。(Māma ___ wǒ zuò le yí ge dà dàngāo.) — mom made me a big cake",
      "给 (gěi)",["对 (duì)","跟 (gēn)","把 (bǎ)"],
      "给 as a coverb marks the BENEFICIARY ('for / to'): 给我做蛋糕 = 'make a cake for me', 给你打电话 = 'call you'.",
      "给 como coverbo marca al BENEFICIARIO ('para / a'): 给我做蛋糕 = 'hacerme un pastel', 给你打电话 = 'llamarte'.",
      "Mom made me a cake. (Which coverb marks the beneficiary?)",
      "'给' = for / to (beneficiary) → 给我做.","'给' = para / a (beneficiario) → 给我做."),
    C("A1","周末我常常___朋友一起打球。(Zhōumò wǒ chángcháng ___ péngyou yìqǐ dǎqiú.) — I often play ball with friends",
      "跟 (gēn)",["给 (gěi)","对 (duì)","从 (cóng)"],
      "跟 = 'with (someone)', marking a companion: 跟朋友一起 = 'together with friends', 跟他说 = 'talk with him'.",
      "跟 = 'con (alguien)', marcando compañía: 跟朋友一起 = 'junto con amigos', 跟他说 = 'hablar con él'.",
      "I play with friends. (Which coverb = 'with'?)",
      "'跟' = with (someone) → 跟朋友一起.","'跟' = con (alguien) → 跟朋友一起."),
    C("A2","见到我,他友好地___我笑了笑。(Jiàndào wǒ, tā yǒuhǎo de ___ wǒ xiào le xiào.) — seeing me, he smiled at me",
      "对 (duì)",["给 (gěi)","跟 (gēn)","把 (bǎ)"],
      "对 = 'to / toward / at (someone)', the target a manner is directed at: 对我笑 = 'smile at me', 对他好 = 'be good to him'.",
      "对 = 'a / hacia (alguien)', el destinatario de una actitud: 对我笑 = 'sonreírme', 对他好 = 'ser bueno con él'.",
      "He smiled at me. (Which coverb = 'at / toward' a person?)",
      "'对' = toward / at (someone) → 对我笑.","'对' = hacia / a (alguien) → 对我笑."),
    C("B1","父母___孩子付出了很多。(Fùmǔ ___ háizi fùchū le hěn duō.) — parents give a lot for their children",
      "为 (wèi)",["对 (duì)","给 (gěi)","跟 (gēn)"],
      "为 (wèi) = 'for the sake of / on behalf of': 为孩子付出 = 'give for one's children', 为你高兴 = 'be happy for you'.",
      "为 (wèi) = 'por / en beneficio de': 为孩子付出 = 'entregarse por los hijos', 为你高兴 = 'alegrarse por ti'.",
      "Parents give for their children. (Which coverb = 'for the sake of'?)",
      "'为' = for the sake of → 为孩子付出.","'为' = por / en beneficio de → 为孩子付出."),
    C("B1","___学好中文,他每天听中文广播。(___ xué hǎo Zhōngwén, tā měitiān tīng Zhōngwén guǎngbō.) — to learn Chinese well, he listens to the radio daily",
      "为了 (wèile)",["因为 (yīnwèi)","为 (wèi)","对 (duì)"],
      "为了 introduces a PURPOSE ('in order to'): 为了学好中文 = 'in order to master Chinese'. Contrast 因为 = 'because' (a reason, not a goal).",
      "为了 introduce un PROPÓSITO ('para / a fin de'): 为了学好中文 = 'para dominar el chino'. Contrasta con 因为 = 'porque' (razón, no meta).",
      "To learn Chinese well, he… (Which coverb = 'in order to'?)",
      "'为了' = in order to (purpose) → 为了学好中文.","'为了' = para (propósito) → 为了学好中文."),
    C("B2","我今天没空,请你___我去开会。(Wǒ jīntiān méi kòng, qǐng nǐ ___ wǒ qù kāihuì.) — I'm busy today, please attend the meeting for me",
      "替 (tì)",["给 (gěi)","为 (wèi)","跟 (gēn)"],
      "替 = 'in place of / on behalf of (doing the task)': 替我去 = 'go instead of me'. It stresses substitution more than 为 or 给.",
      "替 = 'en lugar de / por (haciendo la tarea)': 替我去 = 'ir en mi lugar'. Enfatiza la sustitución más que 为 o 给.",
      "Please go to the meeting for me. (Which coverb = 'in place of'?)",
      "'替' = in place of / instead of → 替我去.","'替' = en lugar de → 替我去."),
    C("A2","我家___学校很近,走路十分钟就到。(Wǒ jiā ___ xuéxiào hěn jìn, zǒulù shí fēnzhōng jiù dào.) — my home is close to school",
      "离 (lí)",["从 (cóng)","到 (dào)","在 (zài)"],
      "离 marks DISTANCE between two points ('from, apart from'): A 离 B 很近/很远 = 'A is near/far from B'. It measures a gap, not motion.",
      "离 marca la DISTANCIA entre dos puntos ('de, respecto a'): A 离 B 很近/很远 = 'A está cerca/lejos de B'. Mide una separación, no movimiento.",
      "My home is close to school. (Which coverb marks distance?)",
      "'离' = distance from → 离学校很近.","'离' = distancia respecto a → 离学校很近."),
    C("A2","一直___前走,银行就在右边。(Yìzhí ___ qián zǒu, yínháng jiù zài yòubian.) — keep walking straight ahead",
      "往 (wǎng)",["向 (xiàng)","到 (dào)","从 (cóng)"],
      "往 marks the DIRECTION of motion ('toward, in the direction of'): 往前走 = 'walk forward', 往左拐 = 'turn left'.",
      "往 marca la DIRECCIÓN del movimiento ('hacia'): 往前走 = 'caminar hacia adelante', 往左拐 = 'girar a la izquierda'.",
      "Keep walking straight ahead. (Which coverb marks direction of motion?)",
      "'往' = toward (direction of motion) → 往前走.","'往' = hacia (dirección del movimiento) → 往前走."),
    C("B1","我们应该___优秀的人学习。(Wǒmen yīnggāi ___ yōuxiù de rén xuéxí.) — we should learn from outstanding people",
      "向 (xiàng)",["跟 (gēn)","对 (duì)","给 (gěi)"],
      "向 = 'toward / from (a person, for learning or requesting)': 向他学习 = 'learn from him', 向老师提问 = 'put a question to the teacher'.",
      "向 = 'hacia / de (una persona, para aprender o pedir)': 向他学习 = 'aprender de él', 向老师提问 = 'preguntar al profesor'.",
      "We should learn from the best. (Which coverb = 'from (a person)'?)",
      "'向' = toward / from a person → 向他学习.","'向' = hacia / de una persona → 向他学习."),
    C("A2","中国人常常___筷子吃饭。(Zhōngguórén chángcháng ___ kuàizi chī fàn.) — Chinese people often eat with chopsticks",
      "用 (yòng)",["拿 (ná)","把 (bǎ)","给 (gěi)"],
      "用 marks the INSTRUMENT ('with, using'): 用筷子吃饭 = 'eat with chopsticks', 用中文写 = 'write in Chinese'.",
      "用 marca el INSTRUMENTO ('con, usando'): 用筷子吃饭 = 'comer con palillos', 用中文写 = 'escribir en chino'.",
      "Eat with chopsticks. (Which coverb marks the instrument?)",
      "'用' = with / using (instrument) → 用筷子吃.","'用' = con / usando (instrumento) → 用筷子吃."),
    C("B1","这是一本___中国历史的书。(Zhè shì yì běn ___ Zhōngguó lìshǐ de shū.) — this is a book about Chinese history",
      "关于 (guānyú)",["对于 (duìyú)","为了 (wèile)","按照 (ànzhào)"],
      "关于 = 'about / concerning (a topic)': 关于历史的书 = 'a book about history'. It frames the subject matter.",
      "关于 = 'sobre / acerca de (un tema)': 关于历史的书 = 'un libro sobre historia'. Enmarca el tema.",
      "A book about history. (Which coverb = 'about / concerning'?)",
      "'关于' = about / concerning → 关于历史的书.","'关于' = sobre / acerca de → 关于历史的书."),
    C("B2","请___老师的要求写这篇作文。(Qǐng ___ lǎoshī de yāoqiú xiě zhè piān zuòwén.) — write this essay per the teacher's requirements",
      "按照 (ànzhào)",["关于 (guānyú)","为了 (wèile)","对于 (duìyú)"],
      "按照 = 'according to / in accordance with (a rule, plan)': 按照要求做 = 'do as required', 按照计划 = 'as planned'.",
      "按照 = 'según / conforme a (una regla, plan)': 按照要求做 = 'hacer según lo pedido', 按照计划 = 'según lo planeado'.",
      "Write per the requirements. (Which coverb = 'according to'?)",
      "'按照' = according to → 按照要求写.","'按照' = según / conforme a → 按照要求写."),
    C("A1","爸爸___家看电视呢。(Bàba ___ jiā kàn diànshì ne.) — dad is at home watching TV",
      "在 (zài)",["到 (dào)","从 (cóng)","往 (wǎng)"],
      "在 as a coverb marks static LOCATION ('at, in'): 在家看电视 = 'watch TV at home', 在学校学习 = 'study at school'.",
      "在 como coverbo marca UBICACIÓN estática ('en'): 在家看电视 = 'ver la tele en casa', 在学校学习 = 'estudiar en la escuela'.",
      "Dad is at home watching TV. (Which coverb = 'at / in' a location?)",
      "'在' = at / in (location) → 在家看电视.","'在' = en (ubicación) → 在家看电视."),
    C("B2","这个房间的窗户___南,很暖和。(Zhège fángjiān de chuānghu ___ nán, hěn nuǎnhuo.) — this room's windows face south",
      "朝 (cháo)",["向 (xiàng)","往 (wǎng)","到 (dào)"],
      "朝 = 'facing / toward (an orientation)': 窗户朝南 = 'windows face south', 朝我点头 = 'nod toward me'. It marks the way something faces.",
      "朝 = 'de cara a / hacia (una orientación)': 窗户朝南 = 'ventanas orientadas al sur', 朝我点头 = 'asentir hacia mí'. Marca la orientación.",
      "The windows face south. (Which coverb = 'facing'?)",
      "'朝' = facing / toward → 窗户朝南.","'朝' = de cara a / hacia → 窗户朝南."),

@family
def f_question():
    # QUESTION WORDS: 几/多少/怎么/怎么样/为什么/什么时候/哪儿/谁/多长时间/多远.
    C("A1","你家有___口人?(Nǐ jiā yǒu ___ kǒu rén?) — how many people are in your family?",
      "几 (jǐ)",["多少 (duōshao)","多 (duō)","什么 (shénme)"],
      "几 asks 'how many' for a SMALL expected number and REQUIRES a measure word: 几口人, 几本书. For large numbers or prices, use 多少.",
      "几 pregunta 'cuántos' para un número PEQUEÑO esperado y EXIGE clasificador: 几口人, 几本书. Para números grandes o precios, usa 多少.",
      "How many people in your family? (Which question word takes a measure word?)",
      "'几' + measure word = how many (small) → 几口人.","'几' + clasificador = cuántos (pocos) → 几口人."),
    C("A1","这件衣服___钱?(Zhè jiàn yīfu ___ qián?) — how much is this piece of clothing?",
      "多少 (duōshao)",["几 (jǐ)","多 (duō)","什么 (shénme)"],
      "多少 asks 'how much / how many' for any amount (esp. prices) and needs NO measure word: 多少钱? = 'how much?', 多少人? = 'how many people?'.",
      "多少 pregunta 'cuánto / cuántos' para cualquier cantidad (esp. precios) y NO necesita clasificador: 多少钱? = '¿cuánto?', 多少人? = '¿cuánta gente?'.",
      "How much is this? (Which question word = 'how much', no measure word?)",
      "'多少' = how much / many (no MW) → 多少钱?","'多少' = cuánto (sin clasificador) → 多少钱?"),
    C("A2","这个汉字___读?(Zhège Hànzì ___ dú?) — how do you read this character?",
      "怎么 (zěnme)",["什么 (shénme)","怎么样 (zěnmeyàng)","为什么 (wèishénme)"],
      "怎么 + verb asks the MANNER or means ('how (to do)'): 怎么读 = 'how to read', 怎么去 = 'how to get there'.",
      "怎么 + verbo pregunta el MODO o medio ('cómo (hacer)'): 怎么读 = 'cómo se lee', 怎么去 = 'cómo llegar'.",
      "How do you read this character? (Which = 'how (to do)'?)",
      "'怎么' + verb = how (manner) → 怎么读.","'怎么' + verbo = cómo (modo) → 怎么读."),
    C("A2","你觉得这家饭馆的菜___?(Nǐ juéde zhè jiā fànguǎn de cài ___?) — what do you think of the food here?",
      "怎么样 (zěnmeyàng)",["怎么 (zěnme)","什么 (shénme)","为什么 (wèishénme)"],
      "怎么样 asks for an ASSESSMENT ('how is it / how about'): 菜怎么样? = 'how's the food?'. It stands where an adjective would.",
      "怎么样 pide una VALORACIÓN ('qué tal / cómo está'): 菜怎么样? = '¿qué tal la comida?'. Ocupa el lugar de un adjetivo.",
      "How's the food here? (Which = 'how is it / how about'?)",
      "'怎么样' = how is it / how about → 菜怎么样?","'怎么样' = qué tal → 菜怎么样?"),
    C("A1","你昨天___没来上课?(Nǐ zuótiān ___ méi lái shàngkè?) — why didn't you come to class yesterday?",
      "为什么 (wèishénme)",["怎么 (zěnme)","什么 (shénme)","哪儿 (nǎr)"],
      "为什么 asks the REASON ('why'): 为什么没来? = 'why didn't (you) come?'. The answer is typically 因为… ('because…').",
      "为什么 pregunta la RAZÓN ('por qué'): 为什么没来? = '¿por qué no viniste?'. La respuesta suele ser 因为… ('porque…').",
      "Why didn't you come? (Which = 'why'?)",
      "'为什么' = why → 为什么没来?","'为什么' = por qué → 为什么没来?"),
    C("A1","你___去中国?(Nǐ ___ qù Zhōngguó?) — when are you going to China?",
      "什么时候 (shénme shíhou)",["几点 (jǐ diǎn)","哪儿 (nǎr)","多少 (duōshao)"],
      "什么时候 asks 'when' about a DAY/period: 你什么时候去? = 'when are you going?'. 几点 asks a clock time specifically.",
      "什么时候 pregunta 'cuándo' sobre un DÍA/período: 你什么时候去? = '¿cuándo vas?'. 几点 pregunta la hora del reloj.",
      "When are you going? (Which = 'when' (day/period)?)",
      "'什么时候' = when → 什么时候去?","'什么时候' = cuándo → 什么时候去?"),
    C("A1","下课以后你去___?(Xiàkè yǐhòu nǐ qù ___?) — where do you go after class?",
      "哪儿 (nǎr)",["哪个 (nǎge)","什么 (shénme)","几 (jǐ)"],
      "哪儿 (=哪里) asks 'where' about a PLACE: 你去哪儿? = 'where are you going?'.",
      "哪儿 (=哪里) pregunta 'dónde' sobre un LUGAR: 你去哪儿? = '¿a dónde vas?'.",
      "Where do you go after class? (Which = 'where'?)",
      "'哪儿' = where → 你去哪儿?","'哪儿' = dónde → 你去哪儿?"),
    C("A1","___是你们的班长?(___ shì nǐmen de bānzhǎng?) — who is your class monitor?",
      "谁 (shéi)",["什么 (shénme)","哪儿 (nǎr)","几 (jǐ)"],
      "谁 asks 'who' about a PERSON: 谁是班长? = 'who is the monitor?'. It can be subject or object.",
      "谁 pregunta 'quién' sobre una PERSONA: 谁是班长? = '¿quién es el delegado?'. Puede ser sujeto u objeto.",
      "Who is your class monitor? (Which = 'who'?)",
      "'谁' = who → 谁是班长?","'谁' = quién → 谁是班长?"),
    C("A2","你学中文学了___了?(Nǐ xué Zhōngwén xué le ___ le?) — how long have you been studying Chinese?",
      "多长时间 (duō cháng shíjiān)",["什么时候 (shénme shíhou)","几点 (jǐ diǎn)","多少 (duōshao)"],
      "多长时间 asks about DURATION ('how long'): 学了多长时间? = 'for how long?'. 什么时候 asks a point in time, not a span.",
      "多长时间 pregunta por la DURACIÓN ('cuánto tiempo'): 学了多长时间? = '¿por cuánto tiempo?'. 什么时候 pregunta un momento, no un lapso.",
      "How long have you studied Chinese? (Which = 'how long' (duration)?)",
      "'多长时间' = how long (duration) → 学了多长时间?","'多长时间' = cuánto tiempo → 学了多长时间?"),
    C("B1","你家离公司___?(Nǐ jiā lí gōngsī ___?) — how far is your home from work?",
      "多远 (duō yuǎn)",["多长 (duō cháng)","多少 (duōshao)","几 (jǐ)"],
      "多 + adjective asks 'how (adj)': 多远 = 'how far', 多高 = 'how tall', 多重 = 'how heavy'. For distance apart, use 多远 with 离.",
      "多 + adjetivo pregunta 'qué tan (adj)': 多远 = 'qué tan lejos', 多高 = 'qué tan alto', 多重 = 'cuánto pesa'. Para distancia, 多远 con 离.",
      "How far is your home from work? (Which = 'how far'?)",
      "'多远' = how far → 离公司多远?","'多远' = qué tan lejos → 离公司多远?"),

@family
def f_causative():
    # CAUSATIVE 让/叫/使/请 (make/let/tell/invite someone do). Existing teaches 让/叫 as PASSIVE — distinct function.
    C("A2","妈妈不___我玩电子游戏。(Māma bù ___ wǒ wán diànzǐ yóuxì.) — mom won't let me play video games",
      "让 (ràng)",["被 (bèi)","把 (bǎ)","给 (gěi)"],
      "Causative 让 = 'let / make (someone do)': 让我玩 = 'let me play', 不让我去 = 'won't let me go'. (Distinct from the PASSIVE 让 = 'by'.)",
      "El causativo 让 = 'dejar / hacer (que alguien haga)': 让我玩 = 'dejarme jugar', 不让我去 = 'no dejarme ir'. (Distinto del 让 PASIVO = 'por'.)",
      "Mom won't let me play. (Which word = causative 'let / make'?)",
      "Causative '让' = let / make someone → 不让我玩.","Causativo '让' = dejar / hacer que alguien → 不让我玩."),
    C("A2","老师___我们背这篇课文。(Lǎoshī ___ wǒmen bèi zhè piān kèwén.) — the teacher told us to memorize this text",
      "叫 (jiào)",["被 (bèi)","把 (bǎ)","给 (gěi)"],
      "Causative 叫 = 'tell / order (someone to do)': 叫我们背课文 = 'told us to memorize the text'. Slightly more directive than 让.",
      "El causativo 叫 = 'mandar / ordenar (que alguien haga)': 叫我们背课文 = 'nos mandó memorizar el texto'. Algo más imperativo que 让.",
      "The teacher told us to memorize the text. (Which = causative 'tell / order'?)",
      "Causative '叫' = tell / order someone → 叫我们背.","Causativo '叫' = mandar que alguien → 叫我们背."),
    C("B2","这个好消息___大家都很高兴。(Zhège hǎo xiāoxi ___ dàjiā dōu hěn gāoxìng.) — this good news made everyone happy",
      "使 (shǐ)",["被 (bèi)","把 (bǎ)","对 (duì)"],
      "使 = 'cause / make (a state result)', more formal and abstract than 让: 使大家高兴 = 'make everyone happy', 使人感动 = 'move people'.",
      "使 = 'causar / hacer (que resulte un estado)', más formal y abstracto que 让: 使大家高兴 = 'alegrar a todos', 使人感动 = 'conmover'.",
      "The news made everyone happy. (Which = formal causative 'cause / make'?)",
      "'使' = cause / make (formal) → 使大家高兴.","'使' = causar / hacer (formal) → 使大家高兴."),
    C("A2","今天我___你吃饭,你别客气。(Jīntiān wǒ ___ nǐ chī fàn, nǐ bié kèqi.) — today I'm treating you to a meal",
      "请 (qǐng)",["让 (ràng)","叫 (jiào)","给 (gěi)"],
      "请 = 'invite / treat (someone to)': 请你吃饭 = 'treat you to a meal', 请他来 = 'invite him over'. It is the polite, hospitable causative.",
      "请 = 'invitar / convidar (a alguien a)': 请你吃饭 = 'invitarte a comer', 请他来 = 'invitarlo a venir'. Es el causativo cortés y hospitalario.",
      "I'm treating you to a meal. (Which = 'invite / treat'?)",
      "'请' = invite / treat → 请你吃饭.","'请' = invitar / convidar → 请你吃饭."),

@family
def f_conjpair():
    # CONJUNCTION PAIRS not already taught: 不但…而且 / 只要…就 / 只有…才 / 越…越 /
    # 不是…就是 / 不管…都 / 即使…也.
    C("B1","他___会说中文,___会写汉字。(Tā ___ huì shuō Zhōngwén, ___ huì xiě Hànzì.) — he can not only speak but also write Chinese",
      "不但…而且 (búdàn…érqiě)",["虽然…但是 (suīrán…dànshì)","因为…所以 (yīnwèi…suǒyǐ)","不是…而是 (búshì…érshì)"],
      "不但…而且 = 'not only…but also', adding a second, stronger point: 不但会说,而且会写 = 'not only speaks but also writes'.",
      "不但…而且 = 'no solo…sino también', añadiendo un segundo punto más fuerte: 不但会说,而且会写 = 'no solo habla, sino que también escribe'.",
      "Not only speaks but also writes. (Which pair = 'not only…but also'?)",
      "'not only…but also' = 不但…而且.","'no solo…sino también' = 不但…而且."),
    C("B1","___你努力,___一定能成功。(___ nǐ nǔlì, ___ yídìng néng chénggōng.) — as long as you work hard, you'll surely succeed",
      "只要…就 (zhǐyào…jiù)",["只有…才 (zhǐyǒu…cái)","虽然…但是 (suīrán…dànshì)","因为…所以 (yīnwèi…suǒyǐ)"],
      "只要…就 = 'as long as…, then…' — a SUFFICIENT condition: 只要努力就能成功 = 'hard work is enough to succeed'.",
      "只要…就 = 'con tal de que…, …' — condición SUFICIENTE: 只要努力就能成功 = 'basta esforzarse para triunfar'.",
      "As long as you try, you'll succeed. (Which pair = sufficient 'as long as…then'?)",
      "'as long as…then' (sufficient) = 只要…就.","'con tal de que…entonces' (suficiente) = 只要…就."),
    C("B2","___多听多说,___能学好一门外语。(___ duō tīng duō shuō, ___ néng xué hǎo yì mén wàiyǔ.) — only by listening and speaking a lot can you master a language",
      "只有…才 (zhǐyǒu…cái)",["只要…就 (zhǐyào…jiù)","如果…就 (rúguǒ…jiù)","虽然…但是 (suīrán…dànshì)"],
      "只有…才 = 'only if…, (then and only then)…' — a NECESSARY condition, paired with 才: 只有多练才能学好 = 'only by practicing can you master it'. Contrast the sufficient 只要…就.",
      "只有…才 = 'solo si…, (solo entonces)…' — condición NECESARIA, con 才: 只有多练才能学好 = 'solo practicando se domina'. Contrasta con la suficiente 只要…就.",
      "Only by practicing can you master it. (Which pair = necessary 'only if…then'?)",
      "'only if…then' (necessary) = 只有…才.","'solo si…entonces' (necesaria) = 只有…才."),
    C("B1","雨___下___大,我们只好回家了。(Yǔ ___ xià ___ dà, wǒmen zhǐhǎo huí jiā le.) — the harder it rained, so we had to go home",
      "越…越 (yuè…yuè)",["又…又 (yòu…yòu)","一…就 (yī…jiù)","一边…一边 (yìbiān…yìbiān)"],
      "越 A 越 B = 'the more A, the more B', two variables rising together: 越下越大 = 'the more it fell, the harder it got'. (越来越 is the one-clause 'more and more'.)",
      "越 A 越 B = 'cuanto más A, más B', dos variables que suben juntas: 越下越大 = 'cuanto más llovía, más fuerte'. (越来越 es el 'cada vez más' de una sola cláusula.)",
      "The harder it rained… (Which pair = 'the more…the more'?)",
      "'the more…the more' = 越…越 → 越下越大.","'cuanto más…más' = 越…越 → 越下越大."),
    C("B2","他周末___在家看书,___去图书馆。(Tā zhōumò ___ zài jiā kàn shū, ___ qù túshūguǎn.) — on weekends he's either home reading or at the library",
      "不是…就是 (búshì…jiùshì)",["不但…而且 (búdàn…érqiě)","又…又 (yòu…yòu)","越…越 (yuè…yuè)"],
      "不是 A 就是 B = 'either A or B' (one of two, nothing else): 不是看书就是去图书馆 = 'either reading or off to the library'.",
      "不是 A 就是 B = 'o A o B' (uno de dos, nada más): 不是看书就是去图书馆 = 'o lee o va a la biblioteca'.",
      "Either reading or at the library. (Which pair = 'either…or'?)",
      "'either…or' = 不是…就是.","'o…o' = 不是…就是."),
    C("B2","___天气怎么样,他___坚持每天跑步。(___ tiānqì zěnmeyàng, tā ___ jiānchí měitiān pǎobù.) — no matter the weather, he keeps running daily",
      "不管…都 (bùguǎn…dōu)",["因为…所以 (yīnwèi…suǒyǐ)","虽然…但是 (suīrán…dànshì)","只要…就 (zhǐyào…jiù)"],
      "不管…都 = 'no matter (how/what)…, (still)…', pairing a question-word clause with 都/也: 不管天气怎么样都跑步 = 'runs whatever the weather'.",
      "不管…都 = 'no importa (cómo/qué)…, (aun así)…', une una cláusula con palabra interrogativa y 都/也: 不管天气怎么样都跑步 = 'corre haga el tiempo que haga'.",
      "No matter the weather, he runs. (Which pair = 'no matter…still'?)",
      "'no matter…still' = 不管…都.","'no importa…aun así' = 不管…都."),
    C("C1","___明天下雨,我们___要去爬山。(___ míngtiān xià yǔ, wǒmen ___ yào qù páshān.) — even if it rains tomorrow, we'll still go hiking",
      "即使…也 (jíshǐ…yě)",["因为…所以 (yīnwèi…suǒyǐ)","只要…就 (zhǐyào…jiù)","不但…而且 (búdàn…érqiě)"],
      "即使…也 = 'even if…, still…', conceding a hypothetical yet holding firm: 即使下雨也要去 = 'even if it rains, (we'll) still go'.",
      "即使…也 = 'aunque / incluso si…, aun así…', concede una hipótesis pero se mantiene firme: 即使下雨也要去 = 'aunque llueva, iremos igual'.",
      "Even if it rains, we'll still go. (Which pair = 'even if…still'?)",
      "'even if…still' = 即使…也.","'aunque / incluso si…aun así' = 即使…也."),

@family
def f_aspect():
    # ASPECT (new nuances): 起来(inception) / 下去(continuative) / 正在…呢 / 着(existential) /
    # 来着(recent-past) / 要…了(imminent).
    C("B2","听到这个消息,她突然哭___了。(Tīngdào zhège xiāoxi, tā tūrán kū ___ le.) — hearing the news, she suddenly burst into tears",
      "起来 (qǐlái)",["下去 (xiàqù)","出来 (chūlái)","过来 (guòlái)"],
      "起来 marks INCEPTION — an action/state starting up: 哭起来 = 'burst out crying', 笑起来 = 'break into laughter', 热起来 = 'start to get hot'.",
      "起来 marca el INICIO — una acción/estado que arranca: 哭起来 = 'romper a llorar', 笑起来 = 'echarse a reír', 热起来 = 'empezar a hacer calor'.",
      "She burst into tears. (Which marks the start of the action?)",
      "Inceptive '起来' = start to → 哭起来.","'起来' incoativo = empezar a → 哭起来."),
    C("B2","别放弃,一定要坚持___!(Bié fàngqì, yídìng yào jiānchí ___!) — don't give up, keep going!",
      "下去 (xiàqù)",["起来 (qǐlái)","下来 (xiàlái)","出去 (chūqù)"],
      "下去 after a verb marks CONTINUATION of an ongoing action into the future: 坚持下去 = 'keep persevering', 说下去 = 'go on speaking', 活下去 = 'go on living'.",
      "下去 tras un verbo marca la CONTINUACIÓN de una acción en curso hacia el futuro: 坚持下去 = 'seguir persistiendo', 说下去 = 'seguir hablando', 活下去 = 'seguir viviendo'.",
      "Keep going! (Which marks 'continue' an ongoing action?)",
      "Continuative '下去' = keep V-ing → 坚持下去.","'下去' continuativo = seguir V → 坚持下去."),
    C("B1","小声点,他___睡觉___。(Xiǎoshēng diǎn, tā ___ shuìjiào ___.) — keep it down, he's (in the middle of) sleeping",
      "正在…呢 (zhèngzài…ne)",["已经…了 (yǐjīng…le)","刚…过 (gāng…guo)","正…着 (zhèng…zhe)"],
      "正在 + verb + 呢 emphasizes an action IN PROGRESS right now: 正在睡觉呢 = 'is sleeping (right now)'. The 呢 reinforces the ongoing moment.",
      "正在 + verbo + 呢 enfatiza una acción EN CURSO ahora mismo: 正在睡觉呢 = 'está durmiendo (ahora)'. El 呢 refuerza el momento en marcha.",
      "He's in the middle of sleeping. (Which frame marks 'right in progress'?)",
      "'正在…呢' = right in progress → 正在睡觉呢.","'正在…呢' = justo en curso → 正在睡觉呢."),
    C("B1","墙上挂___一幅漂亮的中国画。(Qiáng shàng guà ___ yì fú piàoliang de Zhōngguó huà.) — a beautiful Chinese painting hangs on the wall",
      "着 (zhe)",["了 (le)","过 (guo)","在 (zài)"],
      "In an existential 'place + V着 + thing' sentence, 着 marks the resulting STATE that persists: 挂着一幅画 = '(there) hangs a painting', 放着 = 'is (lying) placed'.",
      "En la oración existencial 'lugar + V着 + cosa', 着 marca el ESTADO resultante que persiste: 挂着一幅画 = '(ahí) cuelga un cuadro', 放着 = 'está colocado'.",
      "A painting hangs on the wall. (Which particle marks the persisting state?)",
      "Existential '着' = persisting state → 墙上挂着一幅画.","'着' existencial = estado persistente → 墙上挂着一幅画."),
    C("C1","你刚才说什么___?我没听清楚。(Nǐ gāngcái shuō shénme ___? Wǒ méi tīng qīngchu.) — what were you saying just now? I didn't catch it",
      "来着 (láizhe)",["了 (le)","呢 (ne)","吧 (ba)"],
      "Sentence-final 来着 recalls a RECENT past event, often when confirming or having half-forgotten it: 你说什么来着? = 'what was it you just said?'. Colloquial.",
      "El 来着 final rememora un evento reciente, a menudo al confirmar o haberlo medio olvidado: 你说什么来着? = '¿qué era lo que decías?'. Coloquial.",
      "What were you just saying? (Which final particle recalls the recent past?)",
      "'来着' = recent-past recall → 说什么来着?","'来着' = recuerdo del pasado reciente → 说什么来着?"),
    C("A2","快走吧,电影___开始___。(Kuài zǒu ba, diànyǐng ___ kāishǐ ___.) — let's hurry, the movie is about to start",
      "要…了 (yào…le)",["在…呢 (zài…ne)","已经…过 (yǐjīng…guo)","正…着 (zhèng…zhe)"],
      "要…了 marks an IMMINENT event ('about to'): 要开始了 = 'about to start', 要下雨了 = 'about to rain'. The 快…了 frame is a close cousin.",
      "要…了 marca un evento INMINENTE ('a punto de'): 要开始了 = 'a punto de empezar', 要下雨了 = 'a punto de llover'. El marco 快…了 es primo cercano.",
      "The movie is about to start. (Which frame marks 'about to'?)",
      "'要…了' = about to → 电影要开始了.","'要…了' = a punto de → 电影要开始了."),

@family
def f_structural():
    # NUMERALS / REDUPLICATION / structural: 两/半/第/多/来/AA的/AABB/V一V/每/们/的-RC/之一/各/所.
    C("A1","请给我___个苹果。(Qǐng gěi wǒ ___ ge píngguǒ.) — please give me two apples",
      "两 (liǎng)",["二 (èr)","双 (shuāng)","俩 (liǎ)"],
      "Before a measure word, 'two' is 两, not 二: 两个, 两本, 两杯. 二 is used for counting, ordinals, and in larger numbers (二十).",
      "Ante un clasificador, 'dos' es 两, no 二: 两个, 两本, 两杯. 二 se usa para contar, ordinales y en números mayores (二十).",
      "Please give me two apples. (Which 'two' goes before a measure word?)",
      "Before a measure word, two = 两 → 两个苹果.","Ante un clasificador, dos = 两 → 两个苹果."),
    C("A2","我等了他一个___小时。(Wǒ děng le tā yí ge ___ xiǎoshí.) — I waited for him an hour and a half",
      "半 (bàn)",["双 (shuāng)","两 (liǎng)","二 (èr)"],
      "半 = 'half'. For 'one and a half units', it goes AFTER the measure word: 一个半小时 = 'an hour and a half', 两块半 = 'two and a half kuai'.",
      "半 = 'medio'. Para 'una unidad y media', va DESPUÉS del clasificador: 一个半小时 = 'una hora y media', 两块半 = 'dos kuai y medio'.",
      "An hour and a half. (Which word = 'half' after the measure word?)",
      "'半' after the measure word = and a half → 一个半小时.","'半' tras el clasificador = y medio → 一个半小时."),
    C("A1","这是我___一次来北京。(Zhè shì wǒ ___ yī cì lái Běijīng.) — this is my first time in Beijing",
      "第 (dì)",["号 (hào)","次 (cì)","们 (men)"],
      "第 + number makes an ORDINAL: 第一 = 'first', 第三课 = 'lesson three', 第一次 = 'the first time'.",
      "第 + número forma el ORDINAL: 第一 = 'primero', 第三课 = 'lección tres', 第一次 = 'la primera vez'.",
      "My first time in Beijing. (Which prefix makes an ordinal?)",
      "'第' + number = ordinal → 第一次.","'第' + número = ordinal → 第一次."),
    C("B1","他今年三十___岁,还没结婚。(Tā jīnnián sānshí ___ suì, hái méi jiéhūn.) — he's thirty-odd this year",
      "多 (duō)",["几 (jǐ)","半 (bàn)","来 (lái)"],
      "多 after a round number = 'odd / more than': 三十多岁 = 'thirty-odd years old', 一百多 = 'over a hundred'. It marks an open surplus above the round figure.",
      "多 tras un número redondo = 'y pico / más de': 三十多岁 = 'treinta y tantos', 一百多 = 'más de cien'. Marca un excedente abierto sobre la cifra redonda.",
      "He's thirty-odd. (Which word = '-odd / more than' after a round number?)",
      "'多' after a round number = -odd → 三十多岁.","'多' tras número redondo = y pico → 三十多岁."),
    C("B2","礼堂里坐了二十___个人。(Lǐtáng lǐ zuò le èrshí ___ ge rén.) — about twenty people sat in the hall",
      "来 (lái)",["多 (duō)","几 (jǐ)","半 (bàn)"],
      "来 between a round number and a measure word = 'approximately': 二十来个人 = 'about twenty people', 十来天 = 'about ten days'. Unlike 多 ('more than'), 来 means 'around'.",
      "来 entre un número redondo y un clasificador = 'aproximadamente': 二十来个人 = 'unas veinte personas', 十来天 = 'unos diez días'. A diferencia de 多 ('más de'), 来 significa 'alrededor de'.",
      "About twenty people. (Which word = 'approximately' before the measure word?)",
      "'来' before a measure word = approximately → 二十来个.","'来' ante el clasificador = alrededor de → 二十来个."),
    C("B1","她有一双___的大眼睛。(Tā yǒu yì shuāng ___ de dà yǎnjing.) — she has big, round eyes",
      "圆圆 (yuányuán)",["圆的 (yuán de)","很圆 (hěn yuán)","太圆 (tài yuán)"],
      "Reduplicating a one-syllable adjective (AA) + 的 gives a vivid, descriptive feel: 圆圆的 = 'nice and round', 红红的 = 'bright red'. It softens and enlivens the description.",
      "Reduplicar un adjetivo monosílabo (AA) + 的 da un matiz vívido y descriptivo: 圆圆的 = 'redondito', 红红的 = 'bien rojo'. Suaviza y anima la descripción.",
      "She has big round eyes. (Which reduplicated adjective form fits?)",
      "AA + 的 = vivid description → 圆圆的.","AA + 的 = descripción vívida → 圆圆的."),
    C("B2","他把房间打扫得___。(Tā bǎ fángjiān dǎsǎo de ___.) — he cleaned the room spotless",
      "干干净净 (gāngānjìngjìng)",["干净干净 (gānjìng gānjìng)","很干净 (hěn gānjìng)","干净的 (gānjìng de)"],
      "A two-syllable adjective reduplicates as AABB, not ABAB: 干净 → 干干净净 = 'spick and span', 高兴 → 高高兴兴 = 'all cheerful'.",
      "Un adjetivo bisílabo se reduplica como AABB, no ABAB: 干净 → 干干净净 = 'reluciente', 高兴 → 高高兴兴 = 'muy contento'.",
      "He cleaned it spotless. (Which is the correct AABB reduplication?)",
      "Two-syllable adjective → AABB → 干干净净.","Adjetivo bisílabo → AABB → 干干净净."),
    C("B1","这件事让我___,明天再答复你。(Zhè jiàn shì ràng wǒ ___, míngtiān zài dáfù nǐ.) — let me think it over a bit, I'll reply tomorrow",
      "想一想 (xiǎng yi xiǎng)",["想想想 (xiǎng xiǎng xiǎng)","想了想 (xiǎng le xiǎng)","很想 (hěn xiǎng)"],
      "The V一V pattern (想一想, 看一看, 试一试) softens a verb to 'have a little V / give it a go', gentler than the plain verb. The middle 一 is toneless.",
      "El patrón V一V (想一想, 看一看, 试一试) suaviza el verbo a 'V un poquito / probar', más suave que el verbo simple. El 一 central es átono.",
      "Let me think it over. (Which V一V form softens 'think'?)",
      "V一V softens the verb → 想一想.","V一V suaviza el verbo → 想一想."),
    C("A1","___个学生都有一个学号。(___ ge xuésheng dōu yǒu yí ge xuéhào.) — every student has a student number",
      "每 (měi)",["各 (gè)","某 (mǒu)","全 (quán)"],
      "每 = 'every / each' and typically pairs with 都 later: 每个学生都… = 'every student…'. It scans the members one by one.",
      "每 = 'cada / todo' y suele emparejarse luego con 都: 每个学生都… = 'cada estudiante…'. Recorre los miembros uno a uno.",
      "Every student has a number. (Which word = 'every / each', pairs with 都?)",
      "'每'…都 = every / each → 每个学生都.","'每'…都 = cada / todo → 每个学生都."),
    C("A1","同学___,早上好!(Tóngxué ___, zǎoshang hǎo!) — good morning, classmates!",
      "们 (men)",["些 (xiē)","家 (jiā)","个 (gè)"],
      "们 makes a PERSON noun or pronoun plural: 同学们 = 'classmates', 老师们 = 'teachers', 我们 = 'we'. It is used only with people, and not after a number.",
      "们 pluraliza un sustantivo o pronombre de PERSONA: 同学们 = 'compañeros', 老师们 = 'profesores', 我们 = 'nosotros'. Solo con personas y nunca tras un número.",
      "Good morning, classmates! (Which suffix makes 'classmates' plural?)",
      "'们' pluralizes people → 同学们.","'们' pluraliza personas → 同学们."),
    C("B1","桌子上那本___书是我的。(Zhuōzi shàng nà běn ___ shū shì wǒ de.) — that book on the table, the one I bought, is mine",
      "我买的 (wǒ mǎi de)",["我买了 (wǒ mǎi le)","我买过 (wǒ mǎi guo)","我买得 (wǒ mǎi de)"],
      "A relative clause modifies a noun with 的 at its end: 我买的书 = 'the book (that) I bought'. The whole clause + 的 sits before the noun, where English puts a 'that/which' clause after it.",
      "Una oración de relativo modifica al sustantivo con 的 al final: 我买的书 = 'el libro que compré'. Toda la cláusula + 的 va antes del sustantivo, donde el inglés pone 'that/which' después.",
      "The book I bought is mine. (Which relative-clause form + 的 fits?)",
      "Relative clause + 的 before the noun → 我买的书.","Oración de relativo + 的 antes del sustantivo → 我买的书."),
    C("B1","他是这个国家最有名的作家___。(Tā shì zhège guójiā zuì yǒumíng de zuòjiā ___.) — he is one of this country's most famous writers",
      "之一 (zhī yī)",["的一 (de yī)","一个 (yí ge)","们 (men)"],
      "…之一 = 'one of (the …)', appended after a superlative-type noun phrase: 最有名的作家之一 = 'one of the most famous writers'.",
      "…之一 = 'uno de (los …)', se añade tras un sintagma nominal de tipo superlativo: 最有名的作家之一 = 'uno de los escritores más famosos'.",
      "One of the most famous writers. (Which phrase = 'one of'?)",
      "'…之一' = one of → 作家之一.","'…之一' = uno de → 作家之一."),
    C("B2","___位来宾,欢迎光临!(___ wèi láibīn, huānyíng guānglín!) — welcome, honored guests, one and all!",
      "各 (gè)",["每 (měi)","某 (mǒu)","们 (men)"],
      "各 = 'each / every (one of a set), various': 各位 = 'everyone (addressing a group)', 各国 = 'each country', 各种 = 'all kinds'. More formal than 每.",
      "各 = 'cada uno (de un conjunto), diversos': 各位 = 'todos (dirigiéndose a un grupo)', 各国 = 'cada país', 各种 = 'toda clase'. Más formal que 每.",
      "Welcome, everyone! (Which word = formal 'each / every one', as in 各位?)",
      "'各' = each / every one (formal) → 各位来宾.","'各' = cada uno (formal) → 各位来宾."),
    C("C1","这就是我___知道的全部情况了。(Zhè jiùshì wǒ ___ zhīdào de quánbù qíngkuàng le.) — this is all that I know",
      "所 (suǒ)",["的 (de)","得 (de)","地 (de)"],
      "The literary frame 所 + verb + 的 nominalizes 'that which is V-ed': 我所知道的 = 'what I know', 大家所关心的 = 'what everyone cares about'. 所 is optional but adds a formal register.",
      "El marco literario 所 + verbo + 的 nominaliza 'lo que se V': 我所知道的 = 'lo que sé', 大家所关心的 = 'lo que a todos preocupa'. 所 es opcional pero da registro formal.",
      "This is all that I know. (Which literary word fits 我__知道的?)",
      "Literary '所' + V + 的 = that which → 我所知道的.","'所' literario + V + 的 = lo que → 我所知道的."),

@family
def f_advanced():
    # C2 — advanced/literary constructions (distinct, not reskins).
    C("C2","我们都___他的精神___感动了。(Wǒmen dōu ___ tā de jīngshén ___ gǎndòng le.) — we were all moved by his spirit",
      "被…所 (bèi…suǒ)",["把…给 (bǎ…gěi)","让…所 (ràng…suǒ)","被…把 (bèi…bǎ)"],
      "被…所 + verb is a LITERARY passive: 被他的精神所感动 = 'be moved by his spirit'. The 所 (optional, formal) sits before the verb; only 被 (not 让/叫) takes it.",
      "被…所 + verbo es una pasiva LITERARIA: 被他的精神所感动 = 'ser conmovido por su espíritu'. El 所 (opcional, formal) va antes del verbo; solo 被 (no 让/叫) lo admite.",
      "We were moved by his spirit. (Which is the literary passive frame?)",
      "Literary passive = 被…所 + verb → 被他的精神所感动.","Pasiva literaria = 被…所 + verbo → 被他的精神所感动."),
    C("C2","他一不小心___我的手机___摔坏了。(Tā yí bù xiǎoxīn ___ wǒ de shǒujī ___ shuāihuài le.) — he accidentally smashed my phone",
      "把…给 (bǎ…gěi)",["被…把 (bèi…bǎ)","给…把 (gěi…bǎ)","把…被 (bǎ…bèi)"],
      "In a colloquial 把-sentence, an extra 给 before the verb adds emphasis (often adverse): 把手机给摔坏了 = '(went and) smashed the phone'. The object still fronts with 把; 给 is the optional intensifier.",
      "En una oración coloquial con 把, un 给 extra antes del verbo añade énfasis (a menudo adverso): 把手机给摔坏了 = '(fue y) rompió el móvil'. El objeto sigue antepuesto con 把; 给 es el intensificador opcional.",
      "He smashed my phone. (Which frame adds colloquial 给 to a 把 sentence?)",
      "Colloquial 把…给 + verb intensifies disposal → 把手机给摔坏了.","Coloquial 把…给 + verbo intensifica la disposición → 把手机给摔坏了."),
    C("C2","他___自己吃亏,___愿意去麻烦别人。(Tā ___ zìjǐ chīkuī, ___ yuànyì qù máfan biérén.) — he'd rather lose out himself than trouble others",
      "宁可…也不 (nìngkě…yěbù)",["不但…而且 (búdàn…érqiě)","只要…就 (zhǐyào…jiù)","即使…也 (jíshǐ…yě)"],
      "宁可 A 也不 B = 'would rather A than B' — choosing the lesser evil A to avoid B: 宁可自己吃亏也不麻烦别人 = 'rather lose out than bother others'.",
      "宁可 A 也不 B = 'preferir A antes que B' — elegir el mal menor A para evitar B: 宁可自己吃亏也不麻烦别人 = 'prefiere salir perdiendo antes que molestar a otros'.",
      "He'd rather lose out than trouble others. (Which pair = 'would rather…than'?)",
      "'would rather…than' = 宁可…也不.","'preferir…antes que' = 宁可…也不."),

if __name__ == "__main__":
    main()



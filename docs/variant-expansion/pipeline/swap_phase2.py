# -*- coding: utf-8 -*-
"""
Phase-2 tense-swap generator (bulk) for the depth verbo banks.

Per 00-methodology.md §6 Phase 2: takes FLEXIBLE present-tense pronoun-subject
items and recasts them into other tenses, adding a leading time-marker so the
sentence reads naturally. Person is held fixed (person-swap is Phase 1's job);
the tense is what varies. Distractors = the same verb+person across tenses, so
the learner must pick the tense the marker signals.

Targets (leading marker → verbecc tense), same base person:
  past-compound (Yesterday), imperfect (In the past), future (Tomorrow).

Bulk run per Sean's call (2026-07-20) — overrides the methodology's
"sample-only until Phase-1 review returns" hold. Quality is inherently shakier
than Phase 1 (a present sentence recast to the past can read oddly for statives);
ships to beta pre-review, flagged for native review. verbecc gate ON for
fr/frCa/it, OFF for pt (unreliable pt model) — same policy as Phase 1.

ID: <code>-verb-<NNN>-t-<tenseKey>.
"""
import json, re, os, sys, unicodedata
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import swap_phase1 as s1

norm, eq, tbl, form_from = s1.norm, s1.eq, s1.tbl, s1.form_from
extract_lemma, reflexive, find_subject = s1.extract_lemma, s1.reflexive, s1.find_subject
LANG, TRACK, GEN = s1.LANG, s1.TRACK, s1.TRACK  # note: TRACK map
GENDIR = s1.GEN

# present tag key + verbecc present cell + target tenses + distractor pool, per code
FR_TARGETS = [
    ('passeCompose', ('indicatif', 'passé-composé'), 'Hier', 'Yesterday'),
    ('imparfait',    ('indicatif', 'imparfait'),     'Autrefois', 'In the past'),
    ('futur',        ('indicatif', 'futur-simple'),  'Demain', 'Tomorrow'),
]
FR_POOL = [('indicatif', 'présent'), ('indicatif', 'passé-composé'), ('indicatif', 'imparfait'),
           ('indicatif', 'futur-simple'), ('conditionnel', 'présent')]
IT_TARGETS = [
    ('passatoProssimo', ('indicativo', 'passato-prossimo'), 'Ieri', 'Yesterday'),
    ('imperfetto',      ('indicativo', 'imperfetto'),       'Una volta', 'In the past'),
    ('futuro',          ('indicativo', 'futuro'),           'Domani', 'Tomorrow'),
]
IT_POOL = [('indicativo', 'presente'), ('indicativo', 'passato-prossimo'), ('indicativo', 'imperfetto'),
           ('indicativo', 'futuro'), ('condizionale', 'presente')]
PT_TARGETS = [
    ('pretPerfeito', ('indicativo', 'pretérito-perfeito'),   'Ontem', 'Yesterday'),
    ('imperfeito',   ('indicativo', 'pretérito-imperfeito'), 'Antigamente', 'In the past'),
    ('futuro',       ('indicativo', 'futuro-do-presente'),   'Amanhã', 'Tomorrow'),
]
PT_POOL = [('indicativo', 'presente'), ('indicativo', 'pretérito-perfeito'), ('indicativo', 'pretérito-imperfeito'),
           ('indicativo', 'futuro-do-presente'), ('condicional', 'futuro-do-pretérito')]

P2 = {
    'fr':   dict(present_tag='present',  present_vt=('indicatif', 'présent'), targets=FR_TARGETS, pool=FR_POOL),
    'frCa': dict(present_tag='present',  present_vt=('indicatif', 'présent'), targets=FR_TARGETS, pool=FR_POOL),
    'it':   dict(present_tag='presente', present_vt=('indicativo', 'presente'), targets=IT_TARGETS, pool=IT_POOL),
    'ptBr': dict(present_tag='presente', present_vt=('indicativo', 'presente'), targets=PT_TARGETS, pool=PT_POOL),
    'ptPt': dict(present_tag='presente', present_vt=('indicativo', 'presente'), targets=PT_TARGETS, pool=PT_POOL),
}

# time / aspect markers already present => not "flexible" => skip
MARKERS = {
    'fr': ["hier", "demain", "aujourd'hui", "maintenant", "autrefois", "déjà", "souvent",
           "toujours", "en ce moment", "actuellement", "la semaine dernière", "l'année dernière",
           "l'an dernier", "tous les jours", "chaque", "hier soir", "bientôt", "récemment",
           "en train de", "depuis", "jamais", "ce matin", "ce soir", "l'année prochaine"],
    'it': ["ieri", "domani", "oggi", "ora", "adesso", "una volta", "già", "spesso", "sempre",
           "di solito", "la settimana scorsa", "ogni", "stamattina", "ieri sera", "poco fa",
           "tra poco", "presto", "l'anno scorso", "mai", "stasera", "l'anno prossimo", "da bambino",
           "da piccolo", "in questo momento", "l'altro giorno"],
    'pt': ["ontem", "amanhã", "hoje", "agora", "já", "sempre", "todo dia", "todos os dias",
           "antigamente", "geralmente", "às vezes", "na semana passada", "ano passado", "de manhã",
           "ontem à noite", "daqui a pouco", "logo", "cedo", "nunca", "esta noite", "quando era",
           "quando eu era", "naquele tempo", "ano que vem", "outro dia"],
}

# être/essere auxiliaries: their compound past participle agrees with subject
# gender/number, which verbecc doesn't resolve from our pronoun cell (defaults
# masculine). Skip the compound-past target for these; avoir/avere participles
# are invariable here (no preceding direct object) and stay correct.
AUX_AGREE = {
    'fr': {'suis', 'es', 'est', 'sommes', 'êtes', 'sont'},
    'it': {'sono', 'sei', 'è', 'siamo', 'siete'},
}
COMPOUND_TKEYS = {'passeCompose', 'passatoProssimo'}
def agreeing_compound(tform, verbecc):
    toks = (tform or '').split()
    return len(toks) >= 2 and toks[0].lower() in AUX_AGREE.get(verbecc, set())

def has_marker(prompt, verbecc):
    low = ' ' + norm(prompt).lower() + ' '
    for w in MARKERS.get(verbecc, []):
        if w in low:
            return True
    return False

def build_opts(correct, pool_forms, key):
    import hashlib, random
    cand = [correct] + [f for f in pool_forms if not eq(f, correct)]
    uniq, seen = [], set()
    for o in cand:
        n = norm(o).lower()
        if n and n not in seen:
            seen.add(n); uniq.append(o)
    if len(uniq) < 4:
        return None, None
    opts = uniq[:4]
    rng = random.Random(int(hashlib.md5(key.encode()).hexdigest(), 16)); rng.shuffle(opts)
    return opts, next(i for i, o in enumerate(opts) if eq(o, correct))

def tense_prompt(prompt, marker, verbecc, person, tform, first_sg):
    # lowercase the first alphabetic char (sentence-initial subject moves mid-sentence)
    out = list(prompt)
    for i, ch in enumerate(out):
        if ch.isalpha():
            out[i] = ch.lower()
            break
    new = marker + ', ' + ''.join(out)
    # French je-elision when the target form is vowel/mute-h initial
    if verbecc == 'fr' and person == first_sg and tform and \
       re.match(r"^[aeiouyàâäéèêëîïôöûüh]", tform.strip(), re.IGNORECASE):
        new = re.sub(r"\bje\s+(_+)", r"j'\1", new, count=1)
    return new

def prepend_sub(sub, en_marker):
    if not sub:
        return sub
    return f"{en_marker}, " + sub

def run(code):
    cfg = LANG[code]
    p2 = P2[code]
    verbecc = cfg['verbecc']
    import importlib
    D = importlib.import_module(cfg['defs'])
    T_DEFS, P_DEFS = D.T_DEFS, D.P_DEFS
    verify = (verbecc != 'pt')

    depth = json.load(open(os.path.join(GENDIR, f'{code}_depth_generated.json')))
    tags = s1.load_tags(TRACK[code])
    SEEN = s1.bank_prompts(TRACK[code])

    variants, skips = [], {}
    def skip(r): skips[r] = skips.get(r, 0) + 1

    pmood, pvt = p2['present_vt']
    bases = 0
    for it in depth['verbo']:
        prompt = it['prompt']; correct = it['options'][it['ci']]
        vid = it['vid']; mnum = re.search(r'-verb-(\d+)', vid); NNN = mnum.group(1) if mnum else None
        tkey, pkey = tags.get(norm(prompt), (None, None))
        level = it.get('level', 'A1'); sub = it.get('sub', '')
        if tkey != p2['present_tag']:
            skip('not-present'); continue
        if pkey is None or pkey == 'impersonal' or pkey not in cfg['pr']:
            skip('no-person'); continue
        if has_marker(prompt, verbecc):
            skip('already-time-marked'); continue
        lemma = extract_lemma(sub, prompt)
        if not lemma:
            skip('no-lemma'); continue
        if reflexive(lemma, verbecc):
            skip('reflexive-deferred'); continue
        rows = tbl(lemma, verbecc)
        if not rows:
            skip('no-conjugation'); continue
        # confirm the present cell maps to the native-checked answer (fr/it gate)
        pform = form_from(rows, pmood, pvt, cfg['pr'][pkey])
        if pform is None:
            skip('no-present-form'); continue
        if verify and not eq(pform, correct):
            skip('present-verify-mismatch'); continue
        other = []
        for pk, toks in cfg['detect'].items():
            if pk != pkey:
                other += toks
        span = find_subject(prompt, cfg['detect'][pkey], other)
        if not span:
            skip('implied/ambiguous-subject'); continue
        # distractor pool: same person across tenses
        pool_forms = []
        for m, v in p2['pool']:
            f = form_from(rows, m, v, cfg['pr'][pkey])
            if f:
                pool_forms.append(f)
        bases += 1
        for Tkey, (m, v), marker, en_marker in p2['targets']:
            tform = form_from(rows, m, v, cfg['pr'][pkey])
            if not tform or eq(tform, pform):
                skip('no-tgt-form/syncretic'); continue
            if Tkey in COMPOUND_TKEYS and agreeing_compound(tform, verbecc):
                skip('essere/être-aux-agreement'); continue
            new_prompt = tense_prompt(prompt, marker, verbecc, pkey, tform, cfg['first_sg'])
            nkey = norm(new_prompt).lower()
            if nkey in SEEN:
                skip('dup'); continue
            opts, ci = build_opts(tform, pool_forms, key=vid + '-t-' + Tkey)
            if opts is None:
                skip('opts<4'); continue
            SEEN.add(nkey)
            tname_en = T_DEFS[Tkey][0] if Tkey in T_DEFS else Tkey
            tname_es = T_DEFS[Tkey][1] if Tkey in T_DEFS else Tkey
            en = f"With “{marker}”, use the {tname_en.lower()}: “{tform}”."
            es = f"Con “{marker}”, usa el {tname_es.lower()}: “{tform}”."
            variants.append(dict(
                prompt=new_prompt, options=opts, ci=ci, en=en, es=es, level=level,
                sub=prepend_sub(sub, en_marker), vid=f"{code}-verb-{NNN}-t-{Tkey}",
                base_vid=vid, tense=Tkey, person=pkey, lemma=lemma,
            ))
    return dict(code=code, track=TRACK[code], verify=verify, present_bases=bases,
                n_variants=len(variants), variants=variants, skips=skips)

if __name__ == '__main__':
    code = sys.argv[1]
    r = run(code)
    OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '_out2')
    os.makedirs(OUT, exist_ok=True)
    json.dump(r, open(os.path.join(OUT, f'{code}_phase2_variants.json'), 'w'), ensure_ascii=False, indent=1)
    print(f"[{code}] present_bases={r['present_bases']} tense_variants={r['n_variants']}")
    print("  skips:", json.dumps(r['skips'], ensure_ascii=False))

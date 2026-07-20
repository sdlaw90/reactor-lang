# -*- coding: utf-8 -*-
"""
Phase-1 person-swap generator for the NEW depth `verbo` items.

Reconstructs the generic person-swap from 00-methodology.md §6-9, run against
each track's new deep verbo bank (fr/frCa/it/ptBr/ptPt). NOT the already-swapped
migrated variants.

Source of truth per depth item:
  - generated/<code>_depth_generated.json  -> prompt, options, ci (=> correct = options[ci]),
                                              en, es, level, sub (=> lemma), vid (<code>-verb-NNN)
  - data/tracks/<track>Tags.js             -> per-prompt {grammar: T.<tense>, person: P.<person>}
  - verbecc (via vb.py)                     -> conjugation table for the lemma

Output per run (to OUT dir): <code>_phase1_variants.json  and a skip report.
"""
import json, re, sys, hashlib, random, unicodedata, importlib, os

PIPE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, PIPE)
import vb

GEN = os.path.join(PIPE, "..", "generated")
TRACKS = os.path.abspath(os.path.join(PIPE, "..", "..", "..", "data", "tracks"))

def norm(s):
    return unicodedata.normalize('NFC', re.sub(r'\s+', ' ', str(s)).strip())
def eq(a, b):
    return norm(a).lower() == norm(b).lower()

# --- memoized full conjugation table per lemma (one verbecc call per lemma) ---
_TBL = {}
def tbl(lemma, verbecc):
    k = (verbecc, lemma)
    if k not in _TBL:
        try:
            _TBL[k] = vb._table_full(lemma, verbecc)
        except Exception:
            _TBL[k] = []
    return _TBL[k]
def form_from(rows, mood, vt, pr):
    for r in rows:
        if r['mood'] == mood and r['tense'] == vt and r['pr'] == pr:
            return r['form']
    return None
def pool_from(rows, mood, vt):
    seen = []
    for r in rows:
        if r['mood'] == mood and r['tense'] == vt and r['form'] not in seen:
            seen.append(r['form'])
    return seen

# ---- per-language person model -------------------------------------------
# cells        : grammatical/display person cells to GENERATE (regional convention)
# pr           : person-key -> verbecc pronoun token used by vb._table_full rows
# display      : person-key -> subject word to write into the prompt (sentence-initial cap form)
# detect       : person-key -> surface pronoun tokens to FIND in the source prompt
# en_subj      : person-key -> English subject word for the subtitle
FR = dict(
    verbecc='fr', defs='frdefs',
    cells=['je', 'tu', 'il', 'nous', 'vous', 'ils'],
    pr={'je': 'je', 'tu': 'tu', 'il': 'il', 'nous': 'nous', 'vous': 'vous', 'ils': 'ils'},
    display={'je': 'Je', 'tu': 'Tu', 'il': 'Il', 'nous': 'Nous', 'vous': 'Vous', 'ils': 'Ils'},
    detect={'je': ['je', "j'"], 'tu': ['tu'], 'il': ['il', 'elle', 'on'],
            'nous': ['nous'], 'vous': ['vous'], 'ils': ['ils', 'elles']},
    en_subj={'je': 'I', 'tu': 'You', 'il': 'He/She', 'nous': 'We', 'vous': 'You', 'ils': 'They'},
    first_sg='je',
)
IT = dict(
    verbecc='it', defs='itdefs',
    cells=['io', 'tu', 'lui', 'noi', 'voi', 'loro'],
    pr={'io': 'io', 'tu': 'tu', 'lui': 'lui', 'noi': 'noi', 'voi': 'voi', 'loro': 'loro'},
    display={'io': 'Io', 'tu': 'Tu', 'lui': 'Lui', 'noi': 'Noi', 'voi': 'Voi', 'loro': 'Loro'},
    detect={'io': ['io'], 'tu': ['tu'], 'lui': ['lui', 'lei', 'egli', 'ella', 'esso', 'essa'],
            'noi': ['noi'], 'voi': ['voi'], 'loro': ['loro', 'essi', 'esse']},
    en_subj={'io': 'I', 'tu': 'You', 'lui': 'He/She', 'noi': 'We', 'voi': 'You all', 'loro': 'They'},
    first_sg='io',
)
PTBR = dict(
    verbecc='pt', defs='ptdefs',
    cells=['eu', 'você', 'ele', 'nós', 'eles'],
    pr={'eu': 'eu', 'você': 'ele', 'ele': 'ele', 'nós': 'nós', 'eles': 'eles', 'vocês': 'eles', 'tu': 'tu'},
    display={'eu': 'Eu', 'você': 'Você', 'ele': 'Ele', 'nós': 'Nós', 'eles': 'Eles'},
    detect={'eu': ['eu'], 'você': ['você', 'voce'], 'ele': ['ele', 'ela'],
            'nós': ['nós', 'nos'], 'eles': ['eles', 'elas'], 'vocês': ['vocês', 'voces'], 'tu': ['tu']},
    en_subj={'eu': 'I', 'você': 'You', 'ele': 'He/She', 'nós': 'We', 'eles': 'They'},
    first_sg='eu',
)
PTPT = dict(
    verbecc='pt', defs='ptdefs',
    cells=['eu', 'tu', 'ele', 'nós', 'eles'],
    pr={'eu': 'eu', 'tu': 'tu', 'você': 'ele', 'ele': 'ele', 'nós': 'nós', 'eles': 'eles', 'vocês': 'eles'},
    display={'eu': 'Eu', 'tu': 'Tu', 'ele': 'Ele', 'nós': 'Nós', 'eles': 'Eles'},
    detect={'eu': ['eu'], 'tu': ['tu'], 'ele': ['ele', 'ela'],
            'nós': ['nós', 'nos'], 'eles': ['eles', 'elas'], 'você': ['você', 'voce'], 'vocês': ['vocês', 'voces']},
    en_subj={'eu': 'I', 'tu': 'You', 'ele': 'He/She', 'nós': 'We', 'eles': 'They'},
    first_sg='eu',
)
FRCA = dict(FR)  # Québec: same conjugation/person model, verbecc 'fr'

LANG = {'fr': FR, 'frCa': FRCA, 'it': IT, 'ptBr': PTBR, 'ptPt': PTPT}
TRACK = {'fr': 'frForEn', 'frCa': 'frCaForEn', 'it': 'itForEn', 'ptBr': 'ptBrForEn', 'ptPt': 'ptPtForEn'}

# subjunctive tense keys (for the mood-coreference guard) per defs
SUBJ_TENSES = {'subjPresent', 'subjImparfait', 'congPresente', 'congImperfetto',
               'presSubj', 'impSubj', 'futSubj'}
# tenses to skip outright as bases (no clean person-swap / handled specially)
SKIP_TENSES = {'imperatif', 'imperativo', 'infinitif', 'infinito'}

def reflexive(lemma, verbecc):
    l = lemma.strip().lower()
    if verbecc == 'fr':
        return l.startswith('se ') or l.startswith("s'")
    if verbecc == 'it':
        return l.endswith('si') and len(l) > 3
    if verbecc == 'pt':
        return l.endswith('-se') or l.endswith('se') and l.endswith('r-se')
    return False

def extract_lemma(sub, prompt):
    # primary: "(lemma = to X)" in subtitle
    for txt in (sub or '', prompt or ''):
        m = re.search(r'\(([A-Za-zÀ-ÿ\'’ ]+?)\s*=\s*to\b', txt)
        if m:
            return m.group(1).strip().lower()
    # fallback: first parenthetical token in the prompt "(lemma)" or "(lemma, io)"
    m = re.search(r'\(([A-Za-zÀ-ÿ\'’]+)(?:\s*,[^)]*)?\)', prompt or '')
    if m:
        return m.group(1).strip().lower()
    return None

def load_tags(track):
    """Parse <track>Tags.js RAW map -> {norm(prompt): (tense_key, person_key)}."""
    src = open(os.path.join(TRACKS, track + 'Tags.js'), encoding='utf-8').read()
    out = {}
    # entries look like:  "PROMPT": { themes:[...], grammar: T.xxx, person: P.yyy },
    for m in re.finditer(r'"((?:[^"\\]|\\.)*)":\s*\{([^}]*)\}', src):
        prompt = m.group(1).replace('\\"', '"').replace('\\\\', '\\')
        body = m.group(2)
        g = re.search(r'grammar:\s*T\.(\w+)', body)
        p = re.search(r'person:\s*P\.(\w+)', body)
        if g or p:
            out[norm(prompt)] = (g.group(1) if g else None, p.group(1) if p else None)
    return out

def bank_prompts(track):
    src = open(os.path.join(TRACKS, track + '.js'), encoding='utf-8').read()
    out = set()
    for m in re.finditer(r'\[\s*"((?:[^"\\]|\\.)*)"\s*,', src):
        s = m.group(1).replace('\\"', '"').replace('\\\\', '\\')
        out.add(norm(s).lower())
    return out

def _matches(masked, tokens, end):
    spans = []
    for tok in tokens:
        pat = r"(?<![A-Za-zÀ-ÿ'’])" + re.escape(tok) + r"(?![A-Za-zÀ-ÿ'’])"
        for mt in re.finditer(pat, masked[:end], flags=re.IGNORECASE):
            spans.append((mt.start(), mt.end()))
    return spans

def find_subject(prompt, detect_tokens, other_tokens):
    """Locate the source subject pronoun that owns the blank: the matching pronoun
    NEAREST the blank, with no *other-person* subject pronoun sitting between it and
    the blank (which would mean the blank belongs to a different clause's subject).
    Returns (start, end, surface) into the ORIGINAL prompt, or None."""
    mb = re.search(r'_+', prompt)
    blank = mb.start() if mb else len(prompt)
    masked = re.sub(r'\([^)]*\)', lambda mm: ' ' * len(mm.group()), prompt)
    mine = _matches(masked, detect_tokens, blank)
    if not mine:
        return None
    s, e = max(mine, key=lambda x: x[0])  # nearest to blank
    # any other-person subject pronoun between our subject and the blank => ambiguous
    for os_, oe in _matches(masked, other_tokens, blank):
        if os_ >= e and oe <= blank:
            return None
    return (s, e, prompt[s:e])

def swap_prompt(prompt, span, new_disp, verbecc, tgt_form, tgt_person, first_sg):
    s, e, surface = span
    cap = surface[:1].isupper() or s == 0
    repl = new_disp if cap else (new_disp[0].lower() + new_disp[1:])
    new = prompt[:s] + repl + prompt[e:]
    # French je-elision: "Je ___" -> "J'___" when the form is vowel/mute-h initial
    if verbecc == 'fr' and tgt_person == first_sg and tgt_form and \
       re.match(r"^[aeiouyàâäéèêëîïôöûüh]", tgt_form.strip(), re.IGNORECASE):
        low = "J'" if cap else "j'"
        new = re.sub(r"\b[Jj]e\s+(_+)", low + r"\1", new, count=1)
    return new

def swap_subtitle(sub, src_en, tgt_en):
    if not sub:
        return sub
    # replace a leading English subject phrase (incl. "You all"/"We all"/"They all")
    m = re.match(r'\s*(You all|We all|They all|He/She|I|You|He|She|We|They)\b', sub)
    if m:
        return sub[:m.start(1)] + tgt_en + sub[m.end(1):]
    return sub

def build_opts(correct, pool, base_opts, key):
    cand = [correct] + [f for f in pool if not eq(f, correct)]
    for o in base_opts:
        if not any(eq(o, x) for x in cand):
            cand.append(o)
    uniq, seen = [], set()
    for o in cand:
        n = norm(o).lower()
        if n and n not in seen:
            seen.add(n)
            uniq.append(o)
    if len(uniq) < 4:
        return None, None
    opts = uniq[:4]
    if not any(eq(o, correct) for o in opts):
        opts = [correct] + opts[:3]
    rng = random.Random(int(hashlib.md5(key.encode()).hexdigest(), 16))
    rng.shuffle(opts)
    ci = next(i for i, o in enumerate(opts) if eq(o, correct))
    return opts, ci

def run(code, verify_default=True):
    cfg = LANG[code]
    track = TRACK[code]
    verbecc = cfg['verbecc']
    D = importlib.import_module(cfg['defs'])
    T_DEFS, P_DEFS, VBKEY = D.T_DEFS, D.P_DEFS, D.VBKEY
    verify = verify_default and (verbecc != 'pt')  # pt: skip the verbecc gate

    depth = json.load(open(os.path.join(GEN, f'{code}_depth_generated.json')))
    tags = load_tags(track)
    SEEN = bank_prompts(track)

    variants = []
    skips = {}
    def skip(reason):
        skips[reason] = skips.get(reason, 0) + 1

    eligible_bases = 0
    for it in depth['verbo']:
        prompt = it['prompt']
        correct = it['options'][it['ci']]
        vid = it['vid']                       # <code>-verb-NNN
        mnum = re.search(r'-verb-(\d+)', vid)
        NNN = mnum.group(1) if mnum else None
        tkey, pkey = tags.get(norm(prompt), (None, None))
        base_opts = it['options']
        level = it.get('level', 'A1')
        sub = it.get('sub', '')

        if pkey is None or pkey == 'impersonal' or pkey not in cfg['pr']:
            skip('no-person/impersonal'); continue
        if tkey in SKIP_TENSES:
            skip('imperative/infinitive-tense'); continue
        lemma = extract_lemma(sub, prompt)
        if not lemma:
            skip('no-lemma'); continue
        if reflexive(lemma, verbecc):
            skip('reflexive-deferred'); continue

        rows = tbl(lemma, verbecc)
        if not rows:
            skip('no-conjugation'); continue
        # locate (mood, tense) in verbecc
        mood = vt = None
        if tkey in VBKEY and VBKEY[tkey]:
            mood, vt = VBKEY[tkey]
            sform = form_from(rows, mood, vt, cfg['pr'][pkey])
            if sform is None:
                skip('no-src-form'); continue
            if verify and not eq(sform, correct):
                skip('verify-mismatch'); continue
        else:
            # compound / unmapped tense: locate the cell whose form == correct at source person
            cand = [r for r in rows if eq(r['form'], correct) and r['pr'] == cfg['pr'][pkey]]
            if not cand:
                skip('cannot-locate-tense'); continue
            mood, vt = cand[0]['mood'], cand[0]['tense']

        other_tokens = []
        for pk, toks in cfg['detect'].items():
            if pk != pkey:
                other_tokens += toks
        span = find_subject(prompt, cfg['detect'][pkey], other_tokens)
        if not span:
            skip('implied/ambiguous-subject'); continue

        pool = pool_from(rows, mood, vt)

        eligible_bases += 1
        is_subj = tkey in SUBJ_TENSES
        for tgt in cfg['cells']:
            if tgt == pkey:
                continue
            # mood-coreference guard: don't swap a subjunctive subordinate subject
            # to 1st-person-singular (yields illegal "espero que eu ...", needs infinitive)
            if is_subj and tgt == cfg['first_sg']:
                skip('coref-1sg-subjunctive'); continue
            tform = form_from(rows, mood, vt, cfg['pr'][tgt])
            if not tform:
                skip('no-tgt-form'); continue
            new_prompt = swap_prompt(prompt, span, cfg['display'][tgt], verbecc, tform, tgt, cfg['first_sg'])
            if eq(new_prompt, prompt):
                skip('prompt-unchanged'); continue
            nkey = norm(new_prompt).lower()
            if nkey in SEEN:
                skip('dup'); continue
            opts, ci = build_opts(tform, pool, base_opts, key=vid + '-' + tgt)
            if opts is None:
                skip('opts<4'); continue
            SEEN.add(nkey)
            tname_en = T_DEFS[tkey][0] if tkey in T_DEFS else (vt or '')
            tname_es = T_DEFS[tkey][1] if tkey in T_DEFS else (vt or '')
            pen = P_DEFS[tgt][0] if tgt in P_DEFS else tgt
            pes = P_DEFS[tgt][1] if tgt in P_DEFS else tgt
            en = f"The {pen} form of '{lemma}' in the {tname_en.lower()} is “{tform}”."
            es = f"La forma de {pes} de '{lemma}' en {tname_es.lower()} es “{tform}”."
            nsub = swap_subtitle(sub, cfg['en_subj'].get(pkey, ''), cfg['en_subj'].get(tgt, ''))
            variants.append(dict(
                prompt=new_prompt, options=opts, ci=ci, en=en, es=es, level=level,
                sub=nsub, vid=f"{code}-verb-{NNN}-p-{tgt}",
                base_vid=vid, tense=tkey, person=tgt, lemma=lemma,
            ))
    return dict(code=code, track=track, verify=verify,
                eligible_bases=eligible_bases, n_variants=len(variants),
                variants=variants, skips=skips)

if __name__ == '__main__':
    code = sys.argv[1]
    r = run(code)
    OUT = os.path.join(PIPE, '_out')
    os.makedirs(OUT, exist_ok=True)
    json.dump(r, open(os.path.join(OUT, f'{code}_phase1_variants.json'), 'w'), ensure_ascii=False, indent=1)
    print(f"[{code}] track={r['track']} verify={r['verify']} eligible_bases={r['eligible_bases']} "
          f"variants={r['n_variants']}")
    print("  skips:", json.dumps(r['skips'], ensure_ascii=False))

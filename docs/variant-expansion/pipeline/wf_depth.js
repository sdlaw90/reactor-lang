export const meta = {
  name: 'squirrelingo-depth',
  description: 'Content-depth pass for a track: generate + native-verify vocab/verbo/trad/fono to Spanish standard',
  phases: [
    { title: 'Generate', detail: 'one agent per category × CEFR band' },
    { title: 'Verify', detail: 'native-speaker adversarial check per batch' },
  ],
}
let A = args
if (typeof A === 'string') { try { A = JSON.parse(A) } catch (e) { A = {} } }
A = A || {}
const LANG = A.lang_name
const EX = A.examples || {}
const EXIST = A.existing || {}
const BANDS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
const TENSES = A.tenses
const PERSONS = A.persons

const HOUSE = `You are authoring content for SquirreLingo, an ADHD-friendly ${LANG}-for-English-speakers
learning app. TARGET LANGUAGE = ${LANG}. House style, non-negotiable:
- Each item is a multiple-choice question with EXACTLY 4 options; exactly one is correct.
- The 3 distractors must be plausible-but-wrong (real ${LANG}, a believable trap), never nonsense.
- "explanation" has TWO fields: ex_en (English) and ex_es (Spanish) — a one-sentence "why", friendly, concrete.
- "level" is the CEFR band you were asked for.
- Natural, modern, standard ${LANG}. No archaisms. No offensive/adult content.
- Do NOT duplicate or trivially reword any prompt in the provided EXISTING list.
- "themes" = zero or more of: numbers-time, directions, shopping, restaurant, travel, medical, small-talk, work, emotions. [] is fine.`

const bandVerbFocus = (band) => (A.verb_focus || {})[band] || ''
const S_MC = (extra) => ({ type:'object', additionalProperties:false, required:['items'],
  properties:{ items:{ type:'array', minItems:1, maxItems:30, items:{ type:'object', additionalProperties:false,
    required:['prompt','options','correct','ex_en','ex_es','level','themes',...(extra.req||[])],
    properties:{ prompt:{type:'string'}, options:{type:'array',minItems:4,maxItems:4,items:{type:'string'}},
      correct:{type:'string'}, ex_en:{type:'string'}, ex_es:{type:'string'}, level:{type:'string'},
      subtitle_en:{type:'string'}, themes:{type:'array',items:{type:'string'}}, ...(extra.props||{}) } } } } })
const SCHEMA_VOCAB = S_MC({ req:['subtitle_en'] })
const SCHEMA_TRAD = S_MC({})
const SCHEMA_VERBO = S_MC({ req:['subtitle_en','lemma','tense','person'], props:{
  lemma:{type:'string'}, tense:{type:'string',enum:TENSES.split(', ')}, person:{type:'string',enum:PERSONS.split(', ')} } })
const SCHEMA_FONO = { type:'object', additionalProperties:false, required:['items'], properties:{ items:{ type:'array', minItems:1, maxItems:24, items:{ type:'object', additionalProperties:false,
  required:['text','sound','difficulty','id_options','id_correct','id_ex_en','id_ex_es','re_options','re_correct','re_ex_en','re_ex_es'],
  properties:{ text:{type:'string'}, sound:{type:'string'}, difficulty:{type:'string'},
    id_options:{type:'array',minItems:4,maxItems:4,items:{type:'string'}}, id_correct:{type:'string'}, id_ex_en:{type:'string'}, id_ex_es:{type:'string'},
    re_options:{type:'array',minItems:4,maxItems:4,items:{type:'string'}}, re_correct:{type:'string'}, re_ex_en:{type:'string'}, re_ex_es:{type:'string'} } } } } }

const exBlock = (cat) => '```json\n' + JSON.stringify((EX[cat]||[]), null, 1) + '\n```'
const existBlock = (cat) => (EXIST[cat]||[]).map(p=>'- '+p).join('\n')
function genPrompt(cat, band, n) {
  const common = `${HOUSE}\n\nCEFR band: ${band}. Produce ${n} items at this level.\n\nHOUSE-STYLE EXAMPLES (match shape/tone — real app items):\n${exBlock(cat)}\n\nEXISTING PROMPTS — do NOT duplicate:\n${existBlock(cat)}\n`
  if (cat==='vocab') return common + `\nTASK: ${n} VOCABULARY items at ${band}. Prompt style: "'<${LANG} word>' significa..." or a short usage/false-friend question. Options = 4 English meanings. Include false-friend traps where natural. subtitle_en = short English gloss. Return {items:[...]}.`
  if (cat==='trad') return common + `\nTASK: ${n} IDIOM/EXPRESSION items at ${band}. Prompt style: "Translate: '<English idiom/phrase>'". Options = 4 ${LANG} renderings; correct = idiomatic ${LANG}, distractors = literal calques/near-misses. No subtitle. Return {items:[...]}.`
  if (cat==='verbo') return common + `\nTASK: ${n} VERB-CONJUGATION drills at ${band}. Focus: ${bandVerbFocus(band)}
Each prompt is a natural ${LANG} sentence with a "___" blank for a conjugated verb, infinitive shown inline "(lemma)" or in the subtitle. PREFER an EXPLICIT SUBJECT PRONOUN so we can later auto-generate person variants. 4 options = real ${LANG} verb forms (correct + 3 plausible wrong persons/tenses of the SAME verb). Set lemma (infinitive), tense (one of: ${TENSES}), person (one of: ${PERSONS}). subtitle_en includes "(lemma = to X)". correct must equal one option. Return {items:[...]}.`
}
const fonoPrompt = (tier, n) => `${HOUSE}\n\nTASK: ${n} PHONETICS listening items at difficulty ${tier} for ${LANG}.
Each: a short natural ${LANG} sentence ("text"), English-readable pronunciation ("sound"), and TWO sub-exercises:
- identify: 4 options that are minimal-pair/sound confusions of "text"; id_correct MUST equal text; id_ex explains the sound feature.
- respond: 4 possible spoken replies; re_correct = natural reply; re_ex explains why.
Target real trip-ups for English speakers in ${LANG}: ${A.fono_focus}. Both sub-exercises bilingual (en+es).\n
HOUSE-STYLE EXAMPLES:\n${exBlock('fono')}\nEXISTING — do NOT duplicate:\n${existBlock('fono')}\nReturn {items:[...]} with ${n} items.`

const VERIFY = (cat, payload) => `You are a NATIVE ${LANG} reviewer + language teacher. Adversarially check this batch of auto-generated ${cat} items.
For EACH: (1) ${LANG} is natural, standard, modern, error-free; (2) the marked correct answer is truly correct AND the ONLY correct option; (3) every distractor is genuinely wrong; (4) CEFR level fits; (5) explanations accurate; (6) verbo: right tense+person, spelled correctly.
FIX small errors in place; DROP anything broken/duplicated/off-level/ambiguous. Return {items:[...]} with ONLY kept/corrected items in the SAME schema. Keep good items; drop freely.\n\nBATCH:\n\`\`\`json\n${JSON.stringify(payload)}\n\`\`\``

const MC_CATS = [ {cat:'vocab',schema:SCHEMA_VOCAB,n:20},{cat:'verbo',schema:SCHEMA_VERBO,n:24},{cat:'trad',schema:SCHEMA_TRAD,n:20} ]
phase('Generate')
const jobs = []
for (const c of MC_CATS) for (const band of BANDS) jobs.push({ ...c, band })
for (const tier of ['A2','B1','B2','C1']) jobs.push({ cat:'fono', tier, n:18, schema:SCHEMA_FONO })
const results = await pipeline(jobs,
  (j) => agent(j.cat==='fono'?fonoPrompt(j.tier,j.n):genPrompt(j.cat,j.band,j.n),
    { label:`gen:${j.cat}:${j.band||j.tier}`, phase:'Generate', schema:j.schema, effort:'medium' })
    .then(r=>({job:j, items:(r&&r.items)||[]})),
  (g) => (!g||!g.items.length) ? {job:g&&g.job, items:[]} :
    agent(VERIFY(g.job.cat,{items:g.items}), { label:`verify:${g.job.cat}:${g.job.band||g.job.tier}`, phase:'Verify', schema:g.job.schema, effort:'medium' })
    .then(r=>({job:g.job, items:(r&&r.items)||[]})) )
const out = { vocab:[], verbo:[], trad:[], fono:[] }
for (const r of results) { if (!r||!r.job) continue; for (const it of r.items) out[r.job.cat].push({...it, _band:r.job.band||r.job.tier}) }
log(`verified: vocab ${out.vocab.length}, verbo ${out.verbo.length}, trad ${out.trad.length}, fono ${out.fono.length}`)
return out

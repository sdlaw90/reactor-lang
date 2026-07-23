// #90/#3: Grammar gym content for ko-for-en (Korean for English speakers).
// Companion to the #89 in-quiz training-wheel chips: deliberate practice of the
// conjugation grid. WALLED OFF like the Romance gyms — its own localStorage
// progress, never feeds the main XP/level/mastery tracker.
//
// SCHEMA NOTE: Korean verbs do NOT inflect for person. The gym engine's
// "persons" axis is REPURPOSED here as a SPEECH LEVEL (해요체 / 합니다체 / 한다체);
// "tenses" carry tense + polarity/aspect. Same axis-repurpose as the #89 tag
// layer (koForEnTags.js).
//
// AI-authored + independently form-verified (255-cell adversarial pass, 2026-07-20);
// still PENDING human native review before public (keigo/pitch for ja, speech-level
// nuance for ko). Native script + romanization shown together per the CJK convention.

export const PERSONS = [{"id":"haeyo","en":"polite (informal)","ko":"해요체"},{"id":"hamnida","en":"formal (polite)","ko":"합니다체"},{"id":"plain","en":"plain (declarative)","ko":"한다체"}];

export const TENSES = [{"id":"present","en":"Present","ko":"현재","why":{"en":"Habitual or current actions.","ko":"습관적이거나 현재의 동작."}},{"id":"past","en":"Past","ko":"과거","why":{"en":"A completed past action (-았/었-).","ko":"완료된 과거의 동작 (-았/었-)."}},{"id":"future","en":"Future","ko":"미래","why":{"en":"Will / going to — periphrastic -(으)ㄹ 거.","ko":"-(으)ㄹ 거 — 미래·의도."}},{"id":"presentNeg","en":"Present negative","ko":"부정 (안)","why":{"en":"Short-form negation with 안 before the verb.","ko":"동사 앞에 '안'을 붙이는 짧은 부정."}},{"id":"progressive","en":"Progressive","ko":"진행","why":{"en":"An action in progress — -고 있다.","ko":"진행 중인 동작 — -고 있다."}}];

const VERBS = [
  {"inf":"먹다 (meokda)","gloss":{"en":"to eat"},"group":"regular","forms":{"present":["먹어요 (meogeoyo)","먹습니다 (meokseumnida)","먹는다 (meongneunda)"],"past":["먹었어요 (meogeosseoyo)","먹었습니다 (meogeotseumnida)","먹었다 (meogeotda)"],"future":["먹을 거예요 (meogeul geoyeyo)","먹을 겁니다 (meogeul geomnida)","먹을 거다 (meogeul geoda)"],"presentNeg":["안 먹어요 (an meogeoyo)","안 먹습니다 (an meokseumnida)","안 먹는다 (an meongneunda)"],"progressive":["먹고 있어요 (meokgo isseoyo)","먹고 있습니다 (meokgo itseumnida)","먹고 있다 (meokgo itda)"]}},
  {"inf":"가다 (gada)","gloss":{"en":"to go"},"group":"regular","forms":{"present":["가요 (gayo)","갑니다 (gamnida)","간다 (ganda)"],"past":["갔어요 (gasseoyo)","갔습니다 (gatseumnida)","갔다 (gatda)"],"future":["갈 거예요 (gal geoyeyo)","갈 겁니다 (gal geomnida)","갈 거다 (gal geoda)"],"presentNeg":["안 가요 (an gayo)","안 갑니다 (an gamnida)","안 간다 (an ganda)"],"progressive":["가고 있어요 (gago isseoyo)","가고 있습니다 (gago itseumnida)","가고 있다 (gago itda)"]}},
  {"inf":"읽다 (ikda)","gloss":{"en":"to read"},"group":"regular","forms":{"present":["읽어요 (ilgeoyo)","읽습니다 (ikseumnida)","읽는다 (ingneunda)"],"past":["읽었어요 (ilgeosseoyo)","읽었습니다 (ilgeotseumnida)","읽었다 (ilgeotda)"],"future":["읽을 거예요 (ilgeul geoyeyo)","읽을 겁니다 (ilgeul geomnida)","읽을 거다 (ilgeul geoda)"],"presentNeg":["안 읽어요 (an ilgeoyo)","안 읽습니다 (an ikseumnida)","안 읽는다 (an ingneunda)"],"progressive":["읽고 있어요 (ikgo isseoyo)","읽고 있습니다 (ikgo itseumnida)","읽고 있다 (ikgo itda)"]}},
  {"inf":"보다 (boda)","gloss":{"en":"to see/watch"},"group":"regular","forms":{"present":["봐요 (bwayo)","봅니다 (bomnida)","본다 (bonda)"],"past":["봤어요 (bwasseoyo)","봤습니다 (bwatseumnida)","봤다 (bwatda)"],"future":["볼 거예요 (bol geoyeyo)","볼 겁니다 (bol geomnida)","볼 거다 (bol geoda)"],"presentNeg":["안 봐요 (an bwayo)","안 봅니다 (an bomnida)","안 본다 (an bonda)"],"progressive":["보고 있어요 (bogo isseoyo)","보고 있습니다 (bogo itseumnida)","보고 있다 (bogo itda)"]}},
  {"inf":"하다 (hada)","gloss":{"en":"to do"},"group":"hada","forms":{"present":["해요 (haeyo)","합니다 (hamnida)","한다 (handa)"],"past":["했어요 (haesseoyo)","했습니다 (haetseumnida)","했다 (haetda)"],"future":["할 거예요 (hal geoyeyo)","할 겁니다 (hal geomnida)","할 거다 (hal geoda)"],"presentNeg":["안 해요 (an haeyo)","안 합니다 (an hamnida)","안 한다 (an handa)"],"progressive":["하고 있어요 (hago isseoyo)","하고 있습니다 (hago itseumnida)","하고 있다 (hago itda)"]}},
  {"inf":"공부하다 (gongbuhada)","gloss":{"en":"to study"},"group":"hada","forms":{"present":["공부해요 (gongbuhaeyo)","공부합니다 (gongbuhamnida)","공부한다 (gongbuhanda)"],"past":["공부했어요 (gongbuhaesseoyo)","공부했습니다 (gongbuhaetseumnida)","공부했다 (gongbuhaetda)"],"future":["공부할 거예요 (gongbuhal geoyeyo)","공부할 겁니다 (gongbuhal geomnida)","공부할 거다 (gongbuhal geoda)"],"presentNeg":["공부 안 해요 (gongbu an haeyo)","공부 안 합니다 (gongbu an hamnida)","공부 안 한다 (gongbu an handa)"],"progressive":["공부하고 있어요 (gongbuhago isseoyo)","공부하고 있습니다 (gongbuhago itseumnida)","공부하고 있다 (gongbuhago itda)"]}},
  {"inf":"듣다 (deutda)","gloss":{"en":"to listen"},"group":"irregular","forms":{"present":["들어요 (deureoyo)","듣습니다 (deutseumnida)","듣는다 (deunneunda)"],"past":["들었어요 (deureosseoyo)","들었습니다 (deureotseumnida)","들었다 (deureotda)"],"future":["들을 거예요 (deureul geoyeyo)","들을 겁니다 (deureul geomnida)","들을 거다 (deureul geoda)"],"presentNeg":["안 들어요 (an deureoyo)","안 듣습니다 (an deutseumnida)","안 듣는다 (an deunneunda)"],"progressive":["듣고 있어요 (deutgo isseoyo)","듣고 있습니다 (deutgo itseumnida)","듣고 있다 (deutgo itda)"]}},
  {"inf":"돕다 (dopda)","gloss":{"en":"to help"},"group":"irregular","forms":{"present":["도와요 (dowayo)","돕습니다 (dopseumnida)","돕는다 (domneunda)"],"past":["도왔어요 (dowasseoyo)","도왔습니다 (dowatseumnida)","도왔다 (dowatda)"],"future":["도울 거예요 (doul geoyeyo)","도울 겁니다 (doul geomnida)","도울 거다 (doul geoda)"],"presentNeg":["안 도와요 (an dowayo)","안 돕습니다 (an dopseumnida)","안 돕는다 (an domneunda)"],"progressive":["돕고 있어요 (dopgo isseoyo)","돕고 있습니다 (dopgo itseumnida)","돕고 있다 (dopgo itda)"]}},
  {"inf":"부르다 (bureuda)","gloss":{"en":"to call / sing"},"group":"irregular","forms":{"present":["불러요 (bulleoyo)","부릅니다 (bureumnida)","부른다 (bureunda)"],"past":["불렀어요 (bulleosseoyo)","불렀습니다 (bulleotseumnida)","불렀다 (bulleotda)"],"future":["부를 거예요 (bureul geoyeyo)","부를 겁니다 (bureul geomnida)","부를 거다 (bureul geoda)"],"presentNeg":["안 불러요 (an bulleoyo)","안 부릅니다 (an bureumnida)","안 부른다 (an bureunda)"],"progressive":["부르고 있어요 (bureugo isseoyo)","부르고 있습니다 (bureugo itseumnida)","부르고 있다 (bureugo itda)"]}},
];

export const GROUPS = [{"id":"regular","title":{"en":"Regular verbs","ko":"규칙 동사"},"note":{"en":"Add the ending to the stem with 아/어 vowel harmony (먹다→먹어요, 가다→가요). The plain present uses -는다/-ㄴ다.","ko":"어간에 아/어 모음조화로 어미를 붙임 (먹다→먹어요). 한다체 현재는 -는다/-ㄴ다."}},{"id":"hada","title":{"en":"하다 verbs","ko":"하다 동사"},"note":{"en":"하다 ('to do') and the large noun+하다 family. 하다→해요; the short negative splits the noun off: 공부 안 해요, not 안 공부해요.","ko":"하다와 '명사+하다' 동사들. 하다→해요. 짧은 부정은 명사와 분리: 공부 안 해요."}},{"id":"irregular","title":{"en":"Irregular stems","ko":"불규칙 동사"},"note":{"en":"Stems that change before an ending: ㄷ→ㄹ (듣다→들어요), ㅂ→우 (돕다→도와요), and 르→ㄹㄹ (부르다→불러요).","ko":"어미 앞에서 바뀌는 어간: ㄷ→ㄹ, ㅂ→우, 르→ㄹㄹ 불규칙."}}];

const koForEnGrammar = {
  trackId: "ko-for-en",
  targetLang: "ko",
  nativeLang: "en",
  intro: {"en":"Deliberate conjugation practice — 해요체, 합니다체 and 한다체 across tense, negation and the progressive. Tracked on its own; never touches your main level or streak.","ko":"활용 집중 연습 — 시제·부정·진행에 걸친 해요체, 합니다체, 한다체. 진행 상황은 따로 기록되며 메인 레벨이나 연속 기록에는 영향을 주지 않습니다."},
  persons: PERSONS,
  tenses: TENSES,
  groups: GROUPS,
  verbs: VERBS,
};

export default koForEnGrammar;

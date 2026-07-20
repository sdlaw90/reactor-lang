// #90/#3: Grammar gym content for ja-for-en (Japanese for English speakers).
// Companion to the #89 in-quiz training-wheel chips: deliberate practice of the
// conjugation grid. WALLED OFF like the Romance gyms — its own localStorage
// progress, never feeds the main XP/level/mastery tracker.
//
// SCHEMA NOTE: Japanese verbs do NOT inflect for person. The gym engine's
// "persons" axis is REPURPOSED here as a POLITENESS/FORM register (plain 普通形
// vs. polite 丁寧形); "tenses" carry the tense/aspect/mood + polarity. This is the
// same axis-repurpose used by the #89 tag layer (jaForEnTags.js). Te-form is
// intentionally excluded from the grid — it has no clean plain/polite pair.
//
// AI-authored + independently form-verified (255-cell adversarial pass, 2026-07-20);
// still PENDING human native review before public (keigo/pitch for ja, speech-level
// nuance for ko). Native script + romanization shown together per the CJK convention.

export const PERSONS = [{"id":"plain","en":"plain","ja":"普通形"},{"id":"polite","en":"polite","ja":"丁寧形"}];

export const TENSES = [{"id":"nonpast","en":"Non-past","ja":"非過去","why":{"en":"Present or future — habitual actions and things not yet done.","ja":"現在または未来 — 習慣的な動作やまだしていないこと。"}},{"id":"nonpastNeg","en":"Non-past negative","ja":"非過去・否定","why":{"en":"Doesn't / won't do something.","ja":"〜しない・〜しません。"}},{"id":"past","en":"Past","ja":"過去","why":{"en":"A completed past action ('did').","ja":"完了した過去の動作（〜した）。"}},{"id":"pastNeg","en":"Past negative","ja":"過去・否定","why":{"en":"Didn't do something.","ja":"〜しなかった・〜しませんでした。"}},{"id":"volitional","en":"Volitional","ja":"意向形","why":{"en":"'Let's…' or 'I think I'll…' — plain 〜よう, polite 〜ましょう.","ja":"「〜しよう」「〜ましょう」 — 意志や勧誘。"}},{"id":"potential","en":"Potential","ja":"可能形","why":{"en":"Can / is able to do something.","ja":"〜できる — 能力や可能性。"}}];

const VERBS = [
  {"inf":"食べる (taberu)","gloss":{"en":"to eat"},"group":"ichidan","forms":{"nonpast":["食べる (taberu)","食べます (tabemasu)"],"nonpastNeg":["食べない (tabenai)","食べません (tabemasen)"],"past":["食べた (tabeta)","食べました (tabemashita)"],"pastNeg":["食べなかった (tabenakatta)","食べませんでした (tabemasen deshita)"],"volitional":["食べよう (tabeyou)","食べましょう (tabemashou)"],"potential":["食べられる (taberareru)","食べられます (taberaremasu)"]}},
  {"inf":"見る (miru)","gloss":{"en":"to see"},"group":"ichidan","forms":{"nonpast":["見る (miru)","見ます (mimasu)"],"nonpastNeg":["見ない (minai)","見ません (mimasen)"],"past":["見た (mita)","見ました (mimashita)"],"pastNeg":["見なかった (minakatta)","見ませんでした (mimasen deshita)"],"volitional":["見よう (miyou)","見ましょう (mimashou)"],"potential":["見られる (mirareru)","見られます (miraremasu)"]}},
  {"inf":"起きる (okiru)","gloss":{"en":"to wake up"},"group":"ichidan","forms":{"nonpast":["起きる (okiru)","起きます (okimasu)"],"nonpastNeg":["起きない (okinai)","起きません (okimasen)"],"past":["起きた (okita)","起きました (okimashita)"],"pastNeg":["起きなかった (okinakatta)","起きませんでした (okimasen deshita)"],"volitional":["起きよう (okiyou)","起きましょう (okimashou)"],"potential":["起きられる (okirareru)","起きられます (okiraremasu)"]}},
  {"inf":"飲む (nomu)","gloss":{"en":"to drink"},"group":"godan","forms":{"nonpast":["飲む (nomu)","飲みます (nomimasu)"],"nonpastNeg":["飲まない (nomanai)","飲みません (nomimasen)"],"past":["飲んだ (nonda)","飲みました (nomimashita)"],"pastNeg":["飲まなかった (nomanakatta)","飲みませんでした (nomimasen deshita)"],"volitional":["飲もう (nomou)","飲みましょう (nomimashou)"],"potential":["飲める (nomeru)","飲めます (nomemasu)"]}},
  {"inf":"話す (hanasu)","gloss":{"en":"to speak"},"group":"godan","forms":{"nonpast":["話す (hanasu)","話します (hanashimasu)"],"nonpastNeg":["話さない (hanasanai)","話しません (hanashimasen)"],"past":["話した (hanashita)","話しました (hanashimashita)"],"pastNeg":["話さなかった (hanasanakatta)","話しませんでした (hanashimasen deshita)"],"volitional":["話そう (hanasou)","話しましょう (hanashimashou)"],"potential":["話せる (hanaseru)","話せます (hanasemasu)"]}},
  {"inf":"行く (iku)","gloss":{"en":"to go"},"group":"godan","forms":{"nonpast":["行く (iku)","行きます (ikimasu)"],"nonpastNeg":["行かない (ikanai)","行きません (ikimasen)"],"past":["行った (itta)","行きました (ikimashita)"],"pastNeg":["行かなかった (ikanakatta)","行きませんでした (ikimasen deshita)"],"volitional":["行こう (ikou)","行きましょう (ikimashou)"],"potential":["行ける (ikeru)","行けます (ikemasu)"]}},
  {"inf":"買う (kau)","gloss":{"en":"to buy"},"group":"godan","forms":{"nonpast":["買う (kau)","買います (kaimasu)"],"nonpastNeg":["買わない (kawanai)","買いません (kaimasen)"],"past":["買った (katta)","買いました (kaimashita)"],"pastNeg":["買わなかった (kawanakatta)","買いませんでした (kaimasen deshita)"],"volitional":["買おう (kaou)","買いましょう (kaimashou)"],"potential":["買える (kaeru)","買えます (kaemasu)"]}},
  {"inf":"待つ (matsu)","gloss":{"en":"to wait"},"group":"godan","forms":{"nonpast":["待つ (matsu)","待ちます (machimasu)"],"nonpastNeg":["待たない (matanai)","待ちません (machimasen)"],"past":["待った (matta)","待ちました (machimashita)"],"pastNeg":["待たなかった (matanakatta)","待ちませんでした (machimasen deshita)"],"volitional":["待とう (matou)","待ちましょう (machimashou)"],"potential":["待てる (materu)","待てます (matemasu)"]}},
  {"inf":"する (suru)","gloss":{"en":"to do"},"group":"irregular","forms":{"nonpast":["する (suru)","します (shimasu)"],"nonpastNeg":["しない (shinai)","しません (shimasen)"],"past":["した (shita)","しました (shimashita)"],"pastNeg":["しなかった (shinakatta)","しませんでした (shimasen deshita)"],"volitional":["しよう (shiyou)","しましょう (shimashou)"],"potential":["できる (dekiru)","できます (dekimasu)"]}},
  {"inf":"来る (kuru)","gloss":{"en":"to come"},"group":"irregular","forms":{"nonpast":["来る (kuru)","来ます (kimasu)"],"nonpastNeg":["来ない (konai)","来ません (kimasen)"],"past":["来た (kita)","来ました (kimashita)"],"pastNeg":["来なかった (konakatta)","来ませんでした (kimasen deshita)"],"volitional":["来よう (koyou)","来ましょう (kimashou)"],"potential":["来られる (korareru)","来られます (koraremasu)"]}},
];

export const GROUPS = [{"id":"ichidan","title":{"en":"Ichidan (ru-verbs)","ja":"一段動詞"},"note":{"en":"Vowel-stem verbs: drop 〜る and add the ending directly. The most regular group — 食べる → 食べます / 食べない / 食べた.","ja":"母音幹の動詞：〜るを取って語尾を付けるだけ。最も規則的なグループ。"}},{"id":"godan","title":{"en":"Godan (u-verbs)","ja":"五段動詞"},"note":{"en":"Consonant-stem verbs: the final kana shifts across the u/i/a/e/o row before each ending. Watch the past sound-changes (飲む→飲んだ, 行く→行った — irregular).","ja":"子音幹の動詞：語尾ごとに末尾のかながu/i/a/e/o段で変化。過去の音便に注意（飲む→飲んだ、行く→行った）。"}},{"id":"irregular","title":{"en":"Irregular (する・来る)","ja":"不規則動詞"},"note":{"en":"Only two truly irregular verbs, but they're everywhere. 来る shifts its reading (こない・きます・きた) and する borrows できる for its potential.","ja":"本当に不規則なのは二つだけだが、どこにでも出てくる。来るは読みが変わり、するの可能形はできる。"}}];

const jaForEnGrammar = {
  trackId: "ja-for-en",
  targetLang: "ja",
  nativeLang: "en",
  intro: {"en":"Deliberate conjugation practice — plain vs. polite across tense, negation, the volitional and the potential. Your progress here is tracked on its own and never touches your main level or streak.","ja":"活用の集中練習 — 時制・否定・意向形・可能形にわたる普通形と丁寧形。ここでの進捗は別に記録され、メインのレベルや連続記録には影響しません。"},
  persons: PERSONS,
  tenses: TENSES,
  groups: GROUPS,
  verbs: VERBS,
};

export default jaForEnGrammar;

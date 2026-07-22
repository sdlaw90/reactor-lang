// Tag layer for koForEn (SquirreLingo CJK tag pass, 2026-07-20).
// Mirrors the Romance *Tags.js model (see esForEnTags.js): every item keeps its
// ONE home category; `themes` is a many-to-many filter layer the practice
// picker uses (category ∩ theme), and results still record to the home
// category (no separate theme mastery).
//
// `grammar`/`person` are the #89 training-wheel chips, adapted for Korean:
// Korean verbs/copula/adjectives do NOT inflect for person, so the second
// pill (Romance "person") is REPURPOSED as a FORM/POLITENESS register pill
// (plain vs polite/formal), while `grammar.tense` names the tense/aspect/mood.
// Chips ride only on items whose tested answer is an inflected form that is
// otherwise invisible in the prompt — particle-choice, word-order, counter, and
// measure-word items get themes only. AI-authored; PENDING native review
// (pitch-accent/keigo for ja, honorific/speech-level for ko).
//
// Keyed by PROMPT TEXT (whitespace-normalized), not positional id, so a future
// content splice that shifts indices does not orphan a tag. AI-authored.

export const THEMES = [
  {"id":"numbers-time","en":"Numbers, dates & time","ko":"숫자와 시간"},
  {"id":"directions","en":"Directions","ko":"길 안내"},
  {"id":"shopping","en":"Shopping","ko":"쇼핑"},
  {"id":"restaurant","en":"Restaurant & food","ko":"식사"},
  {"id":"travel","en":"Travel","ko":"여행"},
  {"id":"medical","en":"Medical & doctor","ko":"건강"},
  {"id":"small-talk","en":"Small talk","ko":"잡담"},
  {"id":"work","en":"Work & office","ko":"일과 직장"},
  {"id":"emotions","en":"Emotions","ko":"감정"},
];

// key (prompt text) -> { themes?: [id], grammar?: {tense,why}, person?: {en,ko} }
const RAW = {
  "'안녕하세요 (annyeonghaseyo)'는 무슨 뜻이에요? (neun museun tteusieyo?)": {"themes":["small-talk"]},
  "'감사합니다 (gamsahamnida)'는 무슨 뜻이에요? (neun museun tteusieyo?)": {"themes":["small-talk"]},
  "'물 (mul)'은 무슨 뜻이에요? (eun museun tteusieyo?)": {"themes":["restaurant"]},
  "'네 (ne)'는 무슨 뜻이에요? (neun museun tteusieyo?)": {"themes":["small-talk"]},
  "'일 (il)'은 무슨 뜻이에요? (eun museun tteusieyo?)": {"themes":["work"]},
  "'밥 (bap)'은 무슨 뜻이에요? (eun museun tteusieyo?)": {"themes":["restaurant"]},
  "'사랑 (sarang)'은 무슨 뜻이에요? (eun museun tteusieyo?)": {"themes":["emotions"]},
  "'답답하다 (dapdaphada)'는 무슨 뜻이에요? (neun museun tteusieyo?)": {"themes":["emotions"]},
  "'화이팅 (hwaiting)'은 무슨 뜻이에요? (eun museun tteusieyo?)": {"themes":["small-talk"]},
  "'정 (jeong)'은 무슨 뜻이에요? (eun museun tteusieyo?)": {"themes":["emotions"]},
  "'대박 (daebak)'은 무슨 뜻이에요? (eun museun tteusieyo?)": {"themes":["small-talk"]},
  "'억울하다 (eogulhada)'는 무슨 뜻이에요? (neun museun tteusieyo?)": {"themes":["emotions"]},
  "'한 (han)'은 무슨 뜻이에요? (eun museun tteusieyo?)": {"themes":["emotions"]},
  "'흥 (heung)'은 무슨 뜻이에요? (eun museun tteusieyo?)": {"themes":["emotions"]},
  "'커피 (keopi)'는 무슨 뜻이에요? (neun museun tteusieyo?)": {"themes":["restaurant"]},
  "'시간 (sigan)'은 무슨 뜻이에요? (eun museun tteusieyo?)": {"themes":["numbers-time"]},
  "'오늘 (oneul)'은 무슨 뜻이에요? (eun museun tteusieyo?)": {"themes":["numbers-time"]},
  "'병원 (byeongwon)'은 무슨 뜻이에요? (eun museun tteusieyo?)": {"themes":["medical"]},
  "'날씨 (nalssi)'는 무슨 뜻이에요? (neun museun tteusieyo?)": {"themes":["small-talk"]},
  "'시장 (sijang)'은 무슨 뜻이에요? (eun museun tteusieyo?)": {"themes":["shopping"]},
  "'지하철 (jihacheol)'은 무슨 뜻이에요? (eun museun tteusieyo?)": {"themes":["travel"]},
  "'음식 (eumsik)'은 무슨 뜻이에요? (eun museun tteusieyo?)": {"themes":["restaurant"]},
  "'가게 (gage)'는 무슨 뜻이에요? (neun museun tteusieyo?)": {"themes":["shopping"]},
  "'아깝다 (akkapda)'는 무슨 뜻이에요? (neun museun tteusieyo?)": {"themes":["emotions"]},
  "'서운하다 (seounhada)'는 무슨 뜻이에요? (neun museun tteusieyo?)": {"themes":["emotions"]},
  "'심심하다 (simsimhada)'는 무슨 뜻이에요? (neun museun tteusieyo?)": {"themes":["emotions"]},
  "'반갑다 (bangapda)'는 무슨 뜻이에요? (neun museun tteusieyo?)": {"themes":["emotions"]},
  "'아쉽다 (aswipda)'는 무슨 뜻이에요? (neun museun tteusieyo?)": {"themes":["emotions"]},
  "'갑질 (gapjil)'은 무슨 뜻이에요? (eun museun tteusieyo?)": {"themes":["work"]},
  "'회식 (hoesik)'은 무슨 뜻이에요? (eun museun tteusieyo?)": {"themes":["work","restaurant"]},
  "'뒤끝 (dwikkeut)'은 무슨 뜻이에요? (eun museun tteusieyo?)": {"themes":["emotions"]},
  "'뿌듯하다 (ppudeushada)'는 무슨 뜻이에요? (neun museun tteusieyo?)": {"themes":["emotions"]},
  "'애틋하다 (aeteuthada)'는 무슨 뜻이에요? (neun museun tteusieyo?)": {"themes":["emotions"]},
  "'든든하다 (deundeunhada)'는 무슨 뜻이에요? (neun museun tteusieyo?)": {"themes":["emotions"]},
  "'삐지다 (ppijida)'는 무슨 뜻이에요? (neun museun tteusieyo?)": {"themes":["emotions"]},
  "'애환 (aehwan)'은 무슨 뜻이에요? (eun museun tteusieyo?)": {"themes":["emotions"]},
  "'살갑다 (salgapda)'는 무슨 뜻이에요? (neun museun tteusieyo?)": {"themes":["emotions"]},
  "저는 학생___. (Jeoneun haksaeng___.)": {"grammar":{"tense":{"en":"Present copula (이에요)","ko":"현재 서술격조사 (이에요)"},"why":{"en":"links a noun to the subject — 'am/is/are' after a consonant","ko":"자음 뒤에서 명사에 붙어 '~이다'를 나타냄"}},"person":{"en":"polite (해요체)","ko":"해요체"}},
  "어제 밥을 먹___. — \"yesterday\" (Eoje bapeul meog___.)": {"grammar":{"tense":{"en":"Past","ko":"과거"},"why":{"en":"action completed in the past, cued by 어제 (yesterday)","ko":"과거에 끝난 동작 ('어제')"}},"person":{"en":"polite (해요체)","ko":"해요체"}},
  "날씨___ 좋아요. (Nalssi___ joayo.)": {"themes":["small-talk"]},
  "___ 가요. — simple \"don't go\" (___ gayo.)": {"grammar":{"tense":{"en":"Negative (present)","ko":"부정 (현재)"},"why":{"en":"안 before the verb is simple 'don't/won't' negation","ko":"동사 앞의 '안'으로 하는 단순 부정"}},"person":{"en":"polite (해요체)","ko":"해요체"}},
  "다쳐서 ___ 걸어요. — \"can't walk\" (unable) (Dachyeoseo ___ georeoyo.)": {"themes":["medical"],"grammar":{"tense":{"en":"Negative — inability (못)","ko":"부정 — 불가능 (못)"},"why":{"en":"못 before the verb marks inability ('can't')","ko":"동사 앞의 '못'은 능력 부정 ('할 수 없다')"}},"person":{"en":"polite (해요체)","ko":"해요체"}},
  "저는 물을 마시___ 싶어요. — \"I want to drink water\" (Jeoneun mureul masi___ sipeoyo.)": {"grammar":{"tense":{"en":"Want to (-고 싶다)","ko":"희망 (-고 싶다)"},"why":{"en":"expresses the speaker's own desire to do something","ko":"말하는 이 자신의 하고 싶은 마음을 나타냄"}},"person":{"en":"polite (해요체)","ko":"해요체"}},
  "\"춥다 (chupda, to be cold)\" in polite present becomes ___. (\"it's cold\")": {"grammar":{"tense":{"en":"Present","ko":"현재"},"why":{"en":"polite present of a ㅂ-irregular adjective (춥다→추워요)","ko":"ㅂ불규칙 형용사의 현재형 (춥다→추워요)"}},"person":{"en":"polite (해요체)","ko":"해요체"}},
  "저는 의사___. (Jeoneun uisa___.)": {"grammar":{"tense":{"en":"Present copula (예요)","ko":"현재 서술격조사 (예요)"},"why":{"en":"copula 'am/is/are' after a vowel-final noun","ko":"모음 뒤 서술격조사 '예요'"}},"person":{"en":"polite (해요체)","ko":"해요체"}},
  "9시___ 일해요. -- \"work FROM 9 o'clock\" (Ahop-si___ ilhaeyo.)": {"themes":["work","numbers-time"]},
  "내일 학교에 ___. -- \"will go\" tomorrow (future) (Naeil hakgyoe ___.)": {"grammar":{"tense":{"en":"Future (-(으)ㄹ 거예요)","ko":"미래 (-(으)ㄹ 거예요)"},"why":{"en":"future/intention, cued by 내일 (tomorrow)","ko":"미래·의도, '내일'이 단서"}},"person":{"en":"polite (해요체)","ko":"해요체"}},
  "저는 커피를 마시___ 않아요. -- \"do NOT drink coffee\" (long negation) (Jeoneun keopireul masi___ anayo.)": {"grammar":{"tense":{"en":"Negative — long form (-지 않다)","ko":"부정 — 긴 부정 (-지 않다)"},"why":{"en":"verb stem + 지 않아요 negates ('do not')","ko":"어간 + '-지 않아요' 긴 부정"}},"person":{"en":"polite (해요체)","ko":"해요체"}},
  "Telling the time in Korean, the HOUR (시) uses ___ numbers. (e.g. 두 시 = 2 o'clock)": {"themes":["numbers-time"]},
  "제가 먼저 하___습니다. -- \"I WILL do it (first)\" (intention) (Jega meonjeo ha___seumnida.)": {"grammar":{"tense":{"en":"Volition/intention (-겠-)","ko":"의지 (-겠-)"},"why":{"en":"-겠- signals the speaker's will or firm intention","ko":"'-겠-'은 말하는 이의 의지·의도를 나타냄"}},"person":{"en":"formal (합니다체)","ko":"합니다체"}},
  "선생님이 신문을 읽___. -- respectful present \"reads\" (Seonsaengnimi sinmuneul ilg___.)": {"grammar":{"tense":{"en":"Honorific (present)","ko":"높임 (현재)"},"why":{"en":"-(으)시- elevates the subject being described (the teacher)","ko":"주체 높임 '-(으)시-'로 문장의 주체를 높임"}},"person":{"en":"polite (해요체)","ko":"해요체"}},
  "배고프___ 밥을 먹어요. -- \"BECAUSE (I'm) hungry\" (Baegopeu___ bapeul meogeoyo.)": {"grammar":{"tense":{"en":"Causal connective (-(으)니까)","ko":"이유 연결 (-(으)니까)"},"why":{"en":"links a reason to a result ('because/since')","ko":"이유·근거를 결과에 연결 ('~니까')"}},"person":{"en":"polite (해요체)","ko":"해요체"}},
  "In a diary or written report, \"I am a student\" is written in PLAIN form as: 나는 학생___.": {"grammar":{"tense":{"en":"Plain copula (이다)","ko":"기본형 서술격조사 (이다)"},"why":{"en":"neutral plain declarative for writing and diaries","ko":"글말·일기에 쓰는 중립적 기본형 (한다체)"}},"person":{"en":"plain (한다체)","ko":"한다체"}},
  "피곤하___ 일찍 자세요. — the clause gives the REASON for a command (\"Since you're tired, sleep early\") (Pigonha___ iljjik jaseyo.)": {"grammar":{"tense":{"en":"Causal connective (-(으)니까)","ko":"이유 연결 (-(으)니까)"},"why":{"en":"attaches a reason to a command (only 니까, not 아서)","ko":"명령문에 이유를 붙일 수 있는 연결 ('~니까')"}},"person":{"en":"polite (해요체)","ko":"해요체"}},
  "지금 마트에 가___ 뭐 사다 줄까요? — \"I'm heading to the store now (setup), shall I buy you anything?\" (Jigeum mateue ga___ mwo sada julkkayo?)": {"themes":["shopping"],"grammar":{"tense":{"en":"Background connective (-는데)","ko":"배경 연결 (-는데)"},"why":{"en":"sets up background/soft contrast before an offer or question","ko":"제안·질문 앞에 배경·상황을 제시"}},"person":{"en":"polite (해요체)","ko":"해요체"}},
  "하늘을 보니 비가 오는 것 ___. — \"looking at the sky, it seems like it's raining\" (Haneureul boni biga oneun geot ___.)": {"grammar":{"tense":{"en":"Conjecture (-는 것 같다)","ko":"추측 (것 같다)"},"why":{"en":"'seems / looks like', a guess from impression","ko":"인상에 근거한 추측 ('~인 것 같다')"}},"person":{"en":"polite (해요체)","ko":"해요체"}},
  "Indirect speech — reporting \"내일 올게\" (\"I'll come tomorrow\"): 친구가 내일 ___ 했어요.": {"grammar":{"tense":{"en":"Reported statement (quotative -다고)","ko":"간접 인용 — 평서 (-다고)"},"why":{"en":"reports a plain statement ('says that…')","ko":"평서문을 간접 인용 ('~ㄴ다고 하다')"}},"person":{"en":"polite (해요체)","ko":"해요체"}},
  "선생님이 학생들을 청소하___ 했어요. — \"the teacher MADE the students clean\" (Seonsaengnimi haksaengdeureul cheongsoha___ haesseoyo.)": {"grammar":{"tense":{"en":"Causative (-게 하다)","ko":"사동 (-게 하다)"},"why":{"en":"make/let/have someone do the action","ko":"'~하게 하다'로 시킴을 나타내는 사동"}},"person":{"en":"polite (해요체)","ko":"해요체"}},
  "어제 ___ 영화가 재미있었어요. — \"the movie (I) WATCHED yesterday\" (past relative clause) (Eoje ___ yeonghwaga jaemiisseosseoyo.)": {"grammar":{"tense":{"en":"Past modifier (-(으)ㄴ)","ko":"과거 관형사형 (-(으)ㄴ)"},"why":{"en":"verb modifying a noun in past tense (cued by 어제)","ko":"명사를 수식하는 과거 관형형 ('어제')"}},"person":{"en":"polite (해요체)","ko":"해요체"}},
  "제가 사장님께 커피를 ___. — \"I'll give/serve the boss coffee\" (humble register) (Jega sajangnimkke keopireul ___.)": {"themes":["work"],"grammar":{"tense":{"en":"Humble give + promise (드릴게요)","ko":"겸양 + 약속 (드릴게요)"},"why":{"en":"humble 드리다 elevates the recipient; -ㄹ게요 is the speaker's promise","ko":"겸양어 '드리다'로 상대를 높이고 '-ㄹ게요'로 약속"}},"person":{"en":"humble polite (해요체)","ko":"해요체 (겸양)"}},
  "내일 교수님을 ___. — \"I'll (humbly) meet the professor tomorrow\" (Naeil gyosunimeul ___.)": {"grammar":{"tense":{"en":"Humble meet + intention (뵙겠습니다)","ko":"겸양 + 의지 (뵙겠습니다)"},"why":{"en":"humble 뵙다 + formal -겠습니다 shows deference to a superior","ko":"겸양어 '뵙다' + 격식 '-겠습니다'로 윗사람을 공경"}},"person":{"en":"formal (합니다체)","ko":"합니다체"}},
  "친구가 같이 영화를 ___ 했어요. — reporting a SUGGESTION, \"let's watch a movie together\" (Chinguga gachi yeonghwareul ___ haesseoyo.)": {"grammar":{"tense":{"en":"Reported suggestion (propositive -자고)","ko":"간접 인용 — 청유 (-자고)"},"why":{"en":"reports a 'let's…' suggestion","ko":"청유문(‘~하자’)을 간접 인용"}},"person":{"en":"polite (해요체)","ko":"해요체"}},
  "바람에 문이 ___. — \"the door OPENED / was blown open by the wind\" (passive) (Barame muni ___.)": {"grammar":{"tense":{"en":"Passive (-리-, past)","ko":"피동 (-리-, 과거)"},"why":{"en":"열다→열리다; the subject undergoes the action (by the wind)","ko":"'열다→열리다' 피동, 주어가 동작을 입음"}},"person":{"en":"polite (해요체)","ko":"해요체"}},
  "엄마가 아기에게 밥을 ___. — \"the mother FED the baby\" (made it eat) (Eommaga agiege babeul ___.)": {"grammar":{"tense":{"en":"Causative (-이-, past)","ko":"사동 (-이-, 과거)"},"why":{"en":"먹다→먹이다 'to feed / make eat'","ko":"'먹다→먹이다' 사동 ('먹게 하다')"}},"person":{"en":"polite (해요체)","ko":"해요체"}},
  "한국어는 공부하면 공부___ 재미있어요. — \"the MORE you study Korean, the more fun it is\" (Hangugeoneun gongbuhamyeon gongbu___ jaemiisseoyo.)": {"grammar":{"tense":{"en":"Proportional (-(으)ㄹ수록)","ko":"비례 (-(으)ㄹ수록)"},"why":{"en":"'the more…, the more…' — one rise tracks another","ko":"'~할수록' 비례 관계를 나타냄"}},"person":{"en":"polite (해요체)","ko":"해요체"}},
  "밖에 사람들이 우산을 써요. 비가 오___. — \"people outside have umbrellas up; it must be raining (I infer)\" — most natural: (Bakke saramdeuri usaneul sseoyo. Biga o___.)": {"grammar":{"tense":{"en":"Inference (-나 보다)","ko":"추측 — 근거 기반 (-나 보다)"},"why":{"en":"conjecture inferred from observed external evidence","ko":"관찰된 외부 근거로부터의 추측"}},"person":{"en":"polite (해요체)","ko":"해요체"}},
  "Translate: 'I'll enjoy this meal.' (set phrase, said before eating)": {"themes":["restaurant"]},
  "Translate: 'Thank you for the meal.' (set phrase, said after eating)": {"themes":["restaurant"]},
  "Translate: 'He's blinded by love.'": {"themes":["emotions"]},
  "Translate: 'Thank you for your hard work.' (set phrase, said to someone finishing work)": {"themes":["work"]},
  "Translate: 'Pleased to meet you.' (set phrase, said at a first meeting)": {"themes":["small-talk"]},
  "Translate: 'I look forward to working with you. / Please take care of me.' (set phrase)": {"themes":["work","small-talk"]},
  "Translate: 'Long time no see.'": {"themes":["small-talk"]},
  "Translate: 'You can do it! / Go for it!' (word of encouragement)": {"themes":["small-talk"]},
  "Translate: 'Don't mention it.' (modest reply to a thank-you)": {"themes":["small-talk"]},
  "Translate: 'I'm so jealous (of someone else's good fortune).'": {"themes":["emotions"]},
  "Translate: 'First things first — eat before sightseeing.' (a full stomach comes first)": {"themes":["restaurant","travel"]},
  "Translate: 'I got ripped off / overcharged.'": {"themes":["shopping"]},
  "Translate: 'Now it's urgent / the deadline is right on top of me.'": {"themes":["work"]},

  // ---- #88 theme coverage pass (2026-07-22, L4/E2 standardization; AI-authored, flag #41) ----
  "'친구 (chingu)'는 무슨 뜻이에요? (neun museun tteusieyo?)": { themes: ["small-talk"] },
  "'시원하다 (siwonhada)'는 무슨 뜻이에요? (neun museun tteusieyo?)": { themes: ["restaurant"] },
  "'사과 (sagwa)'는 무슨 뜻이에요? (neun museun tteusieyo?)": { themes: ["restaurant", "small-talk"] },
  "'꼰대 (kkondae)'는 무슨 뜻이에요? (neun museun tteusieyo?)": { themes: ["work"] },
  "'손 (son)'은 무슨 뜻이에요? (eun museun tteusieyo?)": { themes: ["medical"] },
  "'발 (bal)'은 무슨 뜻이에요? (eun museun tteusieyo?)": { themes: ["medical"] },
  "'옷 (ot)'은 무슨 뜻이에요? (eun museun tteusieyo?)": { themes: ["shopping"] },
  "'신발 (sinbal)'은 무슨 뜻이에요? (eun museun tteusieyo?)": { themes: ["shopping"] },
  "'우유 (uyu)'는 무슨 뜻이에요? (neun museun tteusieyo?)": { themes: ["restaurant", "shopping"] },
  "'빵 (ppang)'은 무슨 뜻이에요? (eun museun tteusieyo?)": { themes: ["restaurant", "shopping"] },
  "'얼굴 (eolgul)'은 무슨 뜻이에요? (eun museun tteusieyo?)": { themes: ["medical"] },
  "'머리 (meori)'는 무슨 뜻이에요? (neun museun tteusieyo?)": { themes: ["medical"] },
  "'바지 (baji)'는 무슨 뜻이에요? (neun museun tteusieyo?)": { themes: ["shopping"] },
  "'모자 (moja)'는 무슨 뜻이에요? (neun museun tteusieyo?)": { themes: ["shopping"] },
  "'부엌 (bueok)'은 무슨 뜻이에요? (eun museun tteusieyo?)": { themes: ["restaurant"] },
  "'공원 (gongwon)'은 무슨 뜻이에요? (eun museun tteusieyo?)": { themes: ["directions"] },
  "'아침 (achim)'은 무슨 뜻이에요? (eun museun tteusieyo?)": { themes: ["numbers-time"] },
  "'저녁 (jeonyeok)'은 무슨 뜻이에요? (eun museun tteusieyo?)": { themes: ["numbers-time"] },
  "'웃다 (utda)'는 무슨 뜻이에요? (neun museun tteusieyo?)": { themes: ["emotions"] },
  "'지갑 (jigap)'은 무슨 뜻이에요? (eun museun tteusieyo?)": { themes: ["shopping"] },
  "'공항 (gonghang)'은 무슨 뜻이에요? (eun museun tteusieyo?)": { themes: ["travel"] },
  "'횡단보도 (hoengdanbodo)'는 무슨 뜻이에요? (neun museun tteusieyo?)": { themes: ["directions"] },
  "'계절 (gyejeol)'은 무슨 뜻이에요? (eun museun tteusieyo?)": { themes: ["numbers-time"] },
  "'어지럽다 (eojireopda)'는 무슨 뜻이에요? (neun museun tteusieyo?)": { themes: ["medical"] },
  "'예약 (yeyak)'은 무슨 뜻이에요? (eun museun tteusieyo?)": { themes: ["travel"] },
  "Translate: 'Speak of the devil.' (the person you were discussing appears)": { themes: ["small-talk"] },
  "Translate: 'She's very generous (with food/portions).'": { themes: ["restaurant"] },
  "Translate: 'Kill two birds with one stone.' (four-character idiom)": { themes: ["work"] },
  "Translate: 'Goodbye.' (set phrase, said to the person who is staying)": { themes: ["small-talk"] },
  "Translate: 'Goodbye.' (set phrase, said to the person who is leaving)": { themes: ["small-talk"] },
  "Translate: 'Hello?' (set phrase, said when answering the phone)": { themes: ["small-talk"] },
  "Translate: 'Welcome!' (set phrase, said by a shopkeeper greeting a customer)": { themes: ["small-talk"] },
  "Translate: 'Excuse me.' (set phrase, to get attention or squeeze past)": { themes: ["small-talk"] },
  "Translate: 'Congratulations!'": { themes: ["small-talk"] },
  "Translate: 'Happy New Year!' (set phrase, lit. receive lots of luck in the new year)": { themes: ["small-talk"] },
  "Translate: 'Just a moment, please.'": { themes: ["small-talk"] },
  "Translate: 'Enjoy your meal.' (set phrase, said TO the person about to eat)": { themes: ["restaurant"] },
  "Translate: 'I feel the weight of responsibility on me.'": { themes: ["emotions"] },
  "Translate: 'Word travels fast / rumors spread far.'": { themes: ["small-talk"] },
};

const norm = (s) => String(s).replace(/\s+/g, " ").trim();
const MAP = new Map(Object.entries(RAW).map(([k, v]) => [norm(k), v]));

// Returns { themes?, grammar? } for a prompt, or null if untagged.
export function tagFor(prompt) {
  if (!prompt) return null;
  return MAP.get(norm(prompt)) || null;
}

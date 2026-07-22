// Bump CURRENT_VERSION and add an entry here whenever you ship a meaningful
// change. Shown as a small tag in the footer, linking to the full changelog.
//
// STANDING PRACTICE: whenever a change here affects anything a person would
// notice or need explained (a new setting, a new page, a changed icon/label,
// a changed flow), also update app/help/page.js in the same pass. The Help
// page fell out of sync with reality once already (see the 2026-07-06 "Help
// page revisit" entry below) — treat keeping it current as part of shipping
// the feature, not a follow-up task.

export const CURRENT_VERSION = "2.33.0-beta.15";

// STANDING PRACTICE (revised 2026-07-08): every entry should read like
// something a user actually experiences. Three categories get their own
// descriptive bullet: UI/gameplay bug fixes, new features released, and
// updates to existing features. Everything else -- CI/deployment fixes,
// database migrations, admin-only tooling, internal refactors, dev-process
// changes, testing infrastructure -- gets folded into a single line: "Other
// general bug fixes and code changes." Don't itemize technical mechanism
// details a regular user has no reason to care about (e.g. don't explain
// *why* a GitHub Actions secret was misconfigured -- if it's worth
// mentioning at all, it's one bullet, not a paragraph). CURRENT_VERSION
// still bumps for internal-only releases; the generic line just goes in
// alone rather than the version disappearing from the log entirely.

export const CHANGELOG = [
  {
    version: "2.33.0-beta.15",
    date: "2026-07-20",
    changes: [
      "Japanese and Korean grammar practice went much deeper — about 350 new questions on each (Japanese grammar to roughly 484, Korean to roughly 494, spanning A1 to C2), drilling the parts of each language English speakers wrestle with most. For Japanese: the -masu / -ta / -te forms, plain vs. polite, negatives, the potential, passive, causative and causative-passive, the volitional, the -ba and -tara conditionals, commands, the i-adjective endings and the core particles. For Korean: the -아/어요 polite style, formal -습니다 and casual speech, past and future, the honorific -(으)세요, the -고 and -(으)면 connectives, formal questions, and the 은/는 · 이/가 · 을/를 particles that switch form depending on a word's final letter — plus every irregular verb (ㅂ, ㄷ, ㅅ, 르, ㄹ). Every verb form is produced by a conjugation engine, so it's machine-verified for correctness, and a wrong answer tells you exactly which form you picked (for example 'that's the polite past form' or 'that's the casual style')",
      "The topic filter now works on Japanese, Korean and Mandarin — every vocabulary and idiom question is tagged with its theme (food, travel, work, emotions and so on) — along with the grammar questions that carry a real topic — so you can practice a whole topic at once, just like on the European tracks. On Japanese and Korean, verb and copula questions also show a small hint chip naming the form you’re being asked for — its tense and its politeness level (plain vs. polite or formal) — so you always know which form to produce",
      "Japanese and Korean now have the Grammar Gym — the standalone conjugation trainer the European tracks already had. Because Japanese and Korean verbs don’t change by person the way Spanish or French do, the gym is built around politeness and form instead: drill each verb across plain, polite and (for Korean) formal styles, in the present, past, future, negative and more. Its progress is tracked on its own and never touches your main level or streak. Mandarin doesn’t conjugate, so it doesn’t get a gym",
      "German and Russian got a big content expansion — many more Vocabulary, Grammar, Idiom and Pronunciation questions across every level (A1–C2), roughly 2–3× the previous depth on each track. Expect more everyday words and famous false friends, more of the tricky grammar (German’s cases, genders and word order; Russian’s six cases, verb aspect and motion verbs), more real idioms and proverbs, and more pronunciation practice",
      "German and Russian now have the topic filter and the Grammar Gym too — the same tools the other tracks already had. Every vocabulary and idiom question is tagged with its theme (food, travel, work, emotions and so on) — along with the grammar questions that carry a real topic — so you can practice a whole topic at once, and verb questions show a small hint chip naming the form you’re being asked for: its tense, and — since German and Russian really do change their verbs by person — who’s doing the action (ich, du, wir…). The Grammar Gym is the standalone conjugation trainer: German drills its verbs across six everyday tenses (present, the spoken and the written past, past perfect, future, and the würde/wäre conditional) with the sein-vs-haben split; Russian is built around its aspect pairs, drilling the present against both the completed and the ongoing future. As always, its progress is tracked on its own and never touches your main level or streak",
      "A navigation-consistency pass: the Home button now appears everywhere it should — on the Alphabet, the Grammar Gym, your progress page, the feedback screens and the legal pages — and you can jump straight between Quick Quiz, Lessons, Alphabet and the Grammar Gym from any of them (before, the Alphabet couldn’t reach the Grammar Gym, and the Grammar Gym had no way to switch modes at all)",
      "Readability and visual polish across the whole app: muted text that was too dim to read comfortably is now darker and meets accessibility-contrast guidelines, the placement test uses the same themed animated background as the rest of the app, and buttons, cards, corners and page widths now line up consistently from screen to screen",
      "More Pronunciation practice on the Japanese, Korean and Mandarin tracks — new questions aimed at the sounds English speakers find hardest: the Japanese small-ゃ/ゅ/ょ contrast that separates 病院 “hospital” from 美容院 “beauty salon,” Korean’s plain / tense / aspirated consonant trios (불 “fire” · 뿔 “horn” · 풀 “grass”), and — for Mandarin — the consonants and vowels beyond the tones: the j/q/x and b/p, d/t distinctions, the retroflex “r,” and the ü and bare-“e” vowels",
      "Sixteen more Idiom questions on the Japanese track — everyday set phrases and proverbs like 大丈夫 (“it's okay / no problem”), しょうがない (“it can't be helped”), 猫舌 (“I can't handle food while it's hot”), 朝飯前 (“a piece of cake”), 目から鱗 (“a real eye-opener”) and 切磋琢磨 (“friendly rivals who sharpen each other”)",
      "Idioms & set phrases just got a huge build-out across five languages — hundreds of new proverbs, four-character idioms and everyday expressions added to Japanese, Korean, Mandarin, German and Russian, each with a literal breakdown and a note on when it's used. The Japanese, Korean and Mandarin idiom sets are now at full depth; German and Russian are nearly there",
      "The vocabulary sets just got a major expansion — 62 new words on each of Japanese, Korean, Mandarin, German and Russian (about 310 in all), spanning every level from A1 to C2. They fill the everyday gaps — parts of the body, clothing, food and drink, the home, places around town, weather, time, travel, technology, money and work — plus a handful of richer, harder-to-translate words at the top levels, each with a short usage or culture note. This brings all five tracks’ vocabulary to the same depth as the Spanish track",
      "Answer choices can now be read aloud on the Spanish (Latin America) track. In review mode, tap the little speaker on an idiom or verb answer to hear how it’s pronounced — handy for checking a word you weren’t sure how to say. It’s off by default; turn on “Answer choice audio” in Settings to use it",
      "Tracks whose content is still awaiting a native-speaker check now carry a small “Community review in progress” note — on the home tiles and at the top of each track — so it’s clear which languages have been human-reviewed and which are still community-reviewed. The note disappears from a track once its review is logged",
      "Clearer question audio on a few Korean, Mandarin and Russian grammar questions: a handful of prompts that put a word in quotation marks now read that word aloud cleanly instead of tripping over the quotes",
      "Pronunciation practice is now at full depth on Japanese, Korean, Mandarin, German and Russian — about 200 new listening questions (roughly 37–44 per language) bring every one of these tracks up to 79 pronunciation items, spread evenly across all six levels. The new questions target exactly the sounds English speakers find hardest, each with a short bilingual explanation: for German, the ich/ach split, the -ig ending, long-vs-short vowels, the glottal stop and clusters like pf/kn/pf; for Russian, hard-vs-soft consonants, the ы vowel, ё, stress-shift pairs like за́мок/замо́к, and voicing assimilation; for Japanese, pure vowels, dakuten voicing, small-っ length, rendaku and casual-speech contractions; for Korean, the vowel system, batchim linking, tensing, nasalization and the double-batchim rules; and for Mandarin, the full range of finals (-uo, -ui, -iu, -üe, -ang/-eng/-ong…), the z/c/s vs zh/ch/sh split, and the finer points of tone sandhi and the neutral tone",
      "Spanish (Spain) now has a full verb-conjugation deck, on par with the Latin American track — the verb drills have more than tripled (about 365 new questions, to roughly 515), heavy on the vosotros forms and Spain's habit of using the present perfect for things done earlier today, and covering every tense from the present through the preterite, imperfect, future and conditional to both subjunctives, plus affirmative and negative commands. Every verb form was machine-verified for correctness",
      "Grammar practice got a major expansion on Japanese, Korean, Mandarin, German and Russian — about 335 new grammar questions across the five tracks (roughly tripling each track's grammar set, to 100–134 items apiece), targeting the structures learners struggle with most: for German, the four cases, two-way prepositions, main-vs-subordinate word order, comparatives, modal verbs and Konjunktiv; for Russian, the six cases, verbal aspect (perfective vs imperfective) and the verbs of motion; for Japanese, the core particles, the four conditionals, giving-and-receiving verbs and keigo politeness; for Korean, particles, the connective endings (-아서/-니까/-는데…) and honorifics; and for Mandarin, measure words, the aspect particles 了/过/着, the 把 and 被 constructions, and result/direction/potential complements",
      "On the Spanish (Spain) verb drills, picking a wrong answer now gives you a quick 'Heads up' note that tells you which form you actually chose — for example 'that's the ellos/ellas form' or 'that's the tú form' — so a wrong tap teaches you the difference instead of just being marked wrong",
      "The same 'Heads up' help now covers every grammar question on Japanese, Korean, Mandarin, German and Russian — pick a wrong answer and you get a one-line reminder of the rule and the form you were after (for example 'Mann is the direct object, so der becomes den', or 'は marks the topic, so 私は…'), turning a wrong tap into a quick lesson instead of just a red mark",
      "Russian grammar practice went much deeper — about 365 new questions (bringing the grammar set to 490, spanning A1 to C2) that drill the parts of Russian English speakers wrestle with most: the six noun cases (which ending after which preposition or verb), verb conjugation by person and tense, past-tense gender agreement, the perfective future, adjective agreement, and finer points like the instrumental after 'стать', the genitive plural after 'много', and choosing the imperfective infinitive after 'начать'. Every form is checked by a Russian grammar engine, and a wrong answer tells you exactly which form you picked (for example 'that's the dative form' or 'that's the ты form')",
      "German grammar practice went much deeper — about 360 new questions (bringing the grammar set to roughly 494, spanning A1 to C2), built by a new German grammar engine. They drill the parts of German English speakers wrestle with most: the four cases across der/die/das and the ein-words, the strong/weak/mixed adjective endings, verb conjugation by person and tense (the present, the spoken Perfekt with the right sein-or-haben helper, the simple past, the past perfect, the future, and the würde/wäre Konjunktiv II), two-way prepositions (accusative for motion vs dative for a fixed location), comparatives and superlatives, plural forms, modal verbs and reflexive pronouns. Every form is built from grammar rules plus a checked table of strong-verb parts, so it's machine-verified for correctness, and a wrong answer tells you exactly which form you picked (for example 'that's the dative form' or 'that's the du form'). Verb questions also show the little hint chip naming the tense and the real subject (ich, du, wir…)",
      "Under the hood: the way Korean grammar questions are generated was rebuilt on a fully in-house engine, replacing the outside conjugation library it relied on before. This is a plumbing change only — the Korean questions themselves are exactly the same as before, and every verb form is still machine-verified for correctness.",
      "Chinese grammar practice went deeper — about 147 new questions (bringing the grammar set to roughly 249, spanning A1 to C2), drilling more of the everyday patterns English speakers wrestle with: the measure words that pair a classifier to each noun (一件衣服, 一张纸, 一辆车, 一位老师…), the aspect particles 了 / 过 / 着, the 把 and 被 constructions, comparatives, the result / direction / potential complements (找到, 站起来, 买不起…), the 让 / 叫 / 使 causatives, the paired conjunctions (不但…而且, 只要…就, 越…越, 即使…也…), coverbs and question words, verb and adjective reduplication, and the 两 / 半 / 第 number patterns. Because Mandarin has no verb conjugation, this track is built from a hand-checked pattern generator rather than a conjugation engine, and it stays the one track deliberately below the depth bar the others reach — that’s a feature of the language (breadth of patterns, not conjugation), not a gap in the practice. As on the other tracks, a wrong answer still gives you a one-line “Heads up” explaining the rule and what you actually picked",
    ],
  },
  {
    version: "2.33.0-beta.14",
    date: "2026-07-20",
    changes: [
      "Japanese, Korean and Mandarin each got a big content expansion — many more Vocabulary, Grammar, Idiom and Pronunciation questions across every level (A1–C2), roughly 2–3× the previous depth on each track. Expect more everyday and culturally-loaded words, more grammar patterns (particles and politeness for Japanese and Korean; measure words and aspect for Mandarin), more real idioms and proverbs, and more pronunciation practice — pitch accent for Japanese, the sound-change rules for Korean, and tones and tone sandhi for Mandarin",
      "The Alphabet pages now match the rest of the app: a themed animated background, a proper Back button that stands out instead of blending into the page, and the language name shown at the top before the practice toggles",
    ],
  },
  {
    version: "2.33.0-beta.13",
    date: "2026-07-20",
    changes: [
      "Spanish (Spain) is now a full-depth track, on par with the Latin American one \u2014 many more Vocabulary, Verbs, Translation and Pronunciation questions across every level (A1\u2013C2). The verb drills are built around the vosotros forms and Spain\u2019s grammar, and the pronunciation practice is written for the Castilian sound system: the \u201cth\u201d sound (distinci\u00f3n), the strong \u201cj\u201d, vosotros endings by ear, and the sound pairs only Spain keeps apart (plaza/playa, casa/caza). This was the last Romance track still catching up",
      "The theme filter and the tense hints now work on the Spain track too \u2014 every vocabulary and idiom question is tagged with its topic (and grammar questions where one applies) and, for verbs, its tense and the person it\u2019s asking for (including vosotros)",
    ],
  },
  {
    version: "2.33.0-beta.12",
    date: "2026-07-20",
    changes: [
      "Spanish (Spain) now has a Word Bank and the Grammar Gym too — a background layer of ~600 common words (with articles and gender), and a standalone conjugation trainer that includes the vosotros forms. A first step toward bringing the Spain track up to the same depth as the Latin American one",
    ],
  },
  {
    version: "2.33.0-beta.11",
    date: "2026-07-20",
    changes: [
      "French, Italian and Portuguese now have the Grammar Gym — a standalone conjugation trainer that Spanish already had. Learn the patterns for regular, irregular and helper verbs across six tenses, then drill them. Its progress is tracked on its own and never touches your main level or streak. Covers French (France & Québec), Italian, and Portuguese (Brazil & Portugal)",
      "Tidied the practice categories on those tracks so they match Spanish: the small leftover \"grammar\" grab-bag was folded into Vocabulary and Verbs, so every Romance track now has the same clean set of categories",
    ],
  },
  {
    version: "2.33.0-beta.10",
    date: "2026-07-20",
    changes: [
      "French, Italian and Portuguese now have a Word Bank — a big background layer of the ~570–590 most common words (with articles and gender), the same feature Spanish already has. It mixes into your practice rounds so there's far more everyday vocabulary to draw on. Covers French (France & Québec), Italian, and Portuguese (Brazil & Portugal)",
      "More verb practice on those tracks: many present-tense verb questions now also appear in the past, the imperfect and the future — each with a time-word cue like \"Yesterday\" or \"Tomorrow\" — so you drill the tense, not just one fixed form",
    ],
  },
  {
    version: "2.33.0-beta.9",
    date: "2026-07-20",
    changes: [
      "French, Italian and Portuguese — even more verb practice: the newer verb questions now also show up in their other subject forms (I / you / he·she / we / they), so a round drills the whole conjugation instead of repeating the same sentence. Covers French (France & Québec), Italian, and Portuguese (Brazil & Portugal), across every tense — present, past, future, conditional and the subjunctive",
    ],
  },
  {
    version: "2.33.0-beta.8",
    date: "2026-07-20",
    changes: [
      "Other general bug fixes and code changes.",
    ],
  },
  {
    version: "2.33.0-beta.7",
    date: "2026-07-20",
    changes: [
      "Portuguese (Brazil), Portuguese (Portugal) and French (Québec) — each got a big content expansion: far more Vocabulary, Verb, Idiom and Pronunciation questions (roughly 400–500 per track, up from ~55), spanning beginner to advanced. Verbs are now their own practice category on each, with regional flavor (Brazilian vs European Portuguese; Québécois vocabulary and pronunciation), and the theme filter and per-verb tense hints now work on all of them — completing the Romance set alongside Spanish, French and Italian",
    ],
  },
  {
    version: "2.33.0-beta.6",
    date: "2026-07-19",
    changes: [
      "Italian — a big content expansion: far more Vocabulary, Verb, Idiom and Pronunciation questions (roughly 450 across the four, up from ~55), spanning beginner to advanced. Verbs are now their own practice category, and the theme filter and per-verb tense hints work on Italian just like they do on Spanish and French",
    ],
  },
  {
    version: "2.33.0-beta.5",
    date: "2026-07-19",
    changes: [
      "French (France) — a big content expansion: far more Vocabulary, Verb, Idiom and Pronunciation questions (roughly 475 across the four, up from ~55), spanning beginner to advanced. Verbs are now their own practice category, and the theme filter and per-verb tense hints work on French just like they do on Spanish",
      "Other general bug fixes and code changes.",
    ],
  },
  {
    version: "2.33.0-beta.4",
    date: "2026-07-19",
    changes: [
      "French, Italian, and Portuguese — more verb practice: existing verb questions now also show up in their other subject forms (I / you / he·she / we / they), so a round drills the whole conjugation instead of repeating the same sentence. Covers French (France & Québec), Italian, and Portuguese (Brazil & Portugal)",
    ],
  },
  {
    version: "2.33.0-beta.3",
    date: "2026-07-19",
    changes: [
      "Spanish (Latin America) — lots more verb practice: many existing verb questions now also show up in their other subject forms (I / you / he·she / we / they), so a round drills the full conjugation instead of serving the same sentence every time",
    ],
  },
  {
    version: "2.33.0-beta.2",
    date: "2026-07-19",
    changes: [
      "Spanish (Latin America) — Round focus and Theme now work together: pick a category like Grammar and a theme like Shopping in the same round and you'll get exactly that mix, instead of one choice replacing the other. The screen shows how many questions match your combination, and if it's too small to fill a round it quietly uses the whole theme instead",
      "Spanish (Latin America) — the tense reminder now shows up on every verb question instead of just some of them, and lots more Vocabulary, Grammar, and Idiom questions have been tagged by theme, so the theme filter has far more to pull from",
      "Other general bug fixes and code changes.",
    ],
  },
  {
    version: "2.33.0-beta.1",
    date: "2026-07-19",
    changes: [
      "Spanish (Latin America) — a lot more to play before you run out: Vocabulary, Grammar, Idioms, and Phonetics have each been expanded to roughly 130–160 items (up from ~30–40). Grammar now spans commands, the subjunctive, and the perfect and conditional tenses; Idioms adds a big batch of everyday expressions and sayings; Phonetics adds listening challenges built around the Latin American sound system — rolled \"rr,\" seseo, yeísmo, silent \"h,\" the soft \"d,\" and fast-speech contractions like \"pa'l\"",
      "Mastery bars now grow with your level: each category's bar fills based on the content at your current level (beginner / intermediate / advanced) instead of the whole pile at once, so even a big category stays achievable — and the harder material shows up dimmed as your next goal until you level up into it",
      "Other general bug fixes and code changes.",
    ],
  },
  {
    version: "2.32.0-beta.1",
    date: "2026-07-19",
    changes: [
      "Help is now one tap away: a new \"?\" button sits in the top-right corner of the home screen, right next to your profile picture — no need to open the menu to find it anymore",
      "A Home button now appears next to Back once you're a couple of pages deep, so you can jump straight back to the home screen instead of tapping Back over and over",
      "Spanish (Latin America) — practice by theme: a new optional theme filter on the Quick Quiz screen gathers questions on a single topic (travel, restaurant, work, shopping, directions, and more) from across every category",
      "Spanish (Latin America) — verb questions now tell you which tense they're asking for, with a one-line reminder of what that tense is used for. It's on by default, and you can switch it off once you're at an advanced level (Settings → Gameplay, or dismiss it right in a round)",
      "Spanish (Latin America) — new Grammar gym: a dedicated place to learn and drill verb conjugations across the main tenses — regular patterns, ser/estar, common irregulars, and stem-changers. It keeps its own separate progress and never touches your main level or streak",
      "Other general bug fixes and code changes.",
    ],
  },
  {
    version: "2.31.0-beta.2",
    date: "2026-07-14",
    changes: [
      "Question audio now covers the German and Japanese tracks too \u2014 tap the speaker button beside a question to hear it read aloud in the track's own voice, just like the Spanish and Canadian French tracks, and toggle it anytime in Settings \u2192 Gameplay",
      "The \"update available\" prompt now waits until a release is fully live \u2014 code, database, and audio all deployed \u2014 before it appears, instead of showing the moment new code ships",
      "Other general bug fixes and code changes.",
    ],
  },
  {
    version: "2.31.0-beta.1",
    date: "2026-07-13",
    changes: [
      "Japanese goes deep: the Japanese track grows from 36 to 792 questions, with all six difficulty tiers covered, English subtitles under every Japanese prompt, eight new pronunciation pairs (the obaasan/obasan long-vowel trap, kitte/kite double consonants, rain-vs-candy pitch accent, and a C2 read-the-air finale), and its own 713-word Word Bank in the new \u300c\u8a00\u8449 (Kotoba)\u300d category \u2014 every word with kanji, romaji, and teaching notes on the tricky readings",
    ],
  },
  {
    version: "2.30.0-beta.2",
    date: "2026-07-12",
    changes: [
      "German goes deep: the German track grows from 36 to 715 questions, with all six difficulty tiers covered, English subtitles under every German prompt, five new pronunciation pairs (final devoicing, the heiße/hasse trap, and the Eichhörnchen final boss), and its own 637-word Word Bank in the new \"Wörter\" category",
    ],
  },
  {
    version: "2.30.0-beta.1",
    date: "2026-07-12",
    changes: [
      "Question audio arrives on the Latin American Spanish track: tap the new speaker button beside a question to hear it read aloud in the track's own dialect — and turn it off anytime with the new question audio toggle in Settings → Gameplay",
      "Canadian French goes deep: the Québécois track grows from 32 to 712 questions, with all six difficulty tiers covered, English subtitles under every French prompt, five new pronunciation pairs (moé/toé, icitte, and friends), and its own 636-word Word Bank in the new \"Mots\" category",
      "Running out of time now pauses on the explanation with a \"Time's up\" notice instead of skipping ahead, and timed-out questions are labeled \"No answer given\" in your history",
      "Exiting mid-round is clearer: Lessons' Exit returns to the lesson picker, and Quick Quiz now shows a single prominent Exit button during rounds",
      "Other general bug fixes and code changes.",
    ],
  },
  {
    version: "2.29.1-beta.2",
    date: "2026-07-12",
    changes: [
      "Other general bug fixes and code changes.",
    ],
  },
  {
    version: "2.29.1-beta.1",
    date: "2026-07-12",
    changes: [
      "Beta application polish: the username rules now show right under the username field, and the confirm-password field tells you live whether your passwords match",
      "Other general bug fixes and code changes.",
    ],
  },
  {
    version: "2.29.0-beta.2",
    date: "2026-07-12",
    changes: [
      "Alphabet mode now covers Korean, Russian, and Mandarin too! Korean gets all 40 hangul jamo plus a syllable-block reading sampler; Russian gets all 33 Cyrillic letters grouped by how they relate to the alphabet you know (false friends called out); Mandarin gets a 46-character foundational set with pinyin and meanings. Same deal as Japanese kana: charts, short practice quizzes, no timer, no pressure",
    ],
  },
  {
    version: "2.29.0-beta.1",
    date: "2026-07-12",
    changes: [
      "New for Japanese: an Alphabet mode! Learn hiragana and katakana with full charts grouped by row, then drill yourself with short practice quizzes (symbol → sound and sound → symbol). Totally optional, no timer, no XP pressure — and symbols you've nailed glow green in the charts",
      "Japanese learners at beginner levels get a gentle pointer to the new Alphabet mode — dismiss it once and it stays gone",
      "Other general bug fixes and code changes.",
    ],
  },
  {
    version: "2.28.0-beta.1",
    date: "2026-07-12",
    changes: [
      "Skill levels now explain themselves — each option in the level picker has a one-line description of what it actually means for your rounds",
      "Cleaner progress display: your level is front and center with a simple fill bar underneath — no more staring at XP arithmetic",
      "Change your round focus right from the round-complete screen — no need to go back to the start screen to switch categories",
      "Smarter round variety: rounds now favor questions at (or slightly above) your level over ones far below it, and Word Bank words mix into rounds in a balanced share instead of taking over",
      "The placement quiz now speaks your language — every screen in the placement flow shows in your native language",
      "Other general bug fixes and code changes.",
    ],
  },
  {
    version: "2.27.0-beta.2",
    date: "2026-07-12",
    changes: [
      "SquirreLingo now has a Facebook group! Find the link on the About page — release news, tips, and tester chat. It's a private group during the beta, so request to join and you'll be approved",
    ],
  },
  {
    version: "2.27.0-beta.1",
    date: "2026-07-12",
    changes: [
      "New: reset a forgotten password yourself — answer 2 of your 3 security questions on the reset page and set a new password on the spot. Set up your questions (plus an optional password hint) in Settings → Password recovery, or when applying for the beta. No questions on file? You can request an admin reset from the same page instead",
      "The beta application's account step now offers password recovery setup (hint + security questions) — optional, but strongly recommended since email reset links can't be delivered during the beta",
      "Other general bug fixes and code changes.",
    ],
  },
  {
    version: "2.26.0-beta.3",
    date: "2026-07-11",
    changes: [
      "Errors now report themselves: problems that don't crash the app get logged automatically in the background, so issues can be fixed without you ever needing to file a report",
      "Admin tooling improvements (internal)",
    ],
  },
  {
    version: "2.26.0-beta.2",
    date: "2026-07-11",
    changes: [
      "Version housekeeping only — reconciles two parallel release lines into one. No gameplay changes.",
    ],
  },
  {
    version: "2.26.0-beta.1",
    date: "2026-07-10",
    changes: [
      "Other general bug fixes and code changes.",
    ],
  },
  {
    version: "2.25.0-beta.9",
    date: "2026-07-10",
    changes: [
      "PILOT — Latin American Spanish gets a new Word Bank category: 609 of the highest-frequency Spanish words, tiered from beginner to advanced, with gender built into every noun and teaching notes on the tricky ones (why it's el día but la mano, the jalar/tirar split, ahorita). This takes the track from 139 to 748 questions. Rounds now include two Word Bank questions; tell us how the new category feels — this pilot decides whether every language gets one",
    ],
  },
  {
    version: "2.25.0-beta.8",
    date: "2026-07-10",
    changes: [
      "Applying for the beta now sets up your whole account in one go — pick your own username and password on the last step and you're signed in immediately. No more copying a generated password",
    ],
  },
  {
    version: "2.25.0-beta.7",
    date: "2026-07-10",
    changes: [
      "Beta applications are now approved instantly — you'll get your login right after applying",
    ],
  },
  {
    version: "2.25.0-beta.6",
    date: "2026-07-10",
    changes: [
      "European Portuguese deepened to full parity: 36 → 78 questions across all six difficulty tiers, with native-language subtitles throughout. Where the Brazilian track teaches you Brazil, this one teaches you Portugal — tu forms everywhere, the future subjunctive in its visible tu shape, mesoclisis (dar-te-ei, the pronoun INSIDE the verb), the cross-Atlantic traps (rapariga, propina, constipado), desenrascar-se and Pessoa's desassossego, ordering a bica and a pastel de nata properly, and phonetics built on Portugal's swallowed vowels and sh-sounds",
      "Fixed: the same duplicated answer option in the European Portuguese pão question (shared with the Brazilian track and fixed there in the previous release)",
    ],
  },
  {
    version: "2.25.0-beta.5",
    date: "2026-07-10",
    changes: [
      "Brazilian Portuguese deepened to full parity: 36 → 78 questions across all six difficulty tiers, with native-language subtitles under every Portuguese question. The new content showcases what makes Portuguese special — the future subjunctive and the personal infinitive (tenses no other major Romance language kept), saudade, cafuné, gambiarra and the jeitinho, the PUXE-means-PULL door trap, 'a gente' as the everyday Brazilian we, and phonetics from Rio's R-as-H to decoding real spoken 'cê vai pra festa?'",
      "Fixed: one Brazilian Portuguese question (the pão plural) accidentally listed the same answer option twice",
    ],
  },
  {
    version: "2.25.0-beta.4",
    date: "2026-07-10",
    changes: [
      "Italian deepened to full parity: 36 → 75 questions across all six difficulty tiers, with native-language subtitles under every Italian question. New content leans into what makes Italian tick — the false friends that bite hardest (morbido means soft!, eventualmente means possibly!), fluency-marker words like magari and mica, the passato remoto you'll meet in every novel, double consonants that change meaning (cappello vs capelli), the ch=k reversal, and idioms from 'dai, andiamo!' to 'lupus in fabula'",
    ],
  },
  {
    version: "2.25.0-beta.3",
    date: "2026-07-10",
    changes: [
      "Spanish (Spain) built out from a starter set to full depth: 12 → 72 questions across all six difficulty tiers, with native-language subtitles throughout. Peninsular Spanish is the teaching spine — vosotros in every mood, distinción (why plaza and playa sound different in Madrid), the present-perfect-for-today register, coger/apetecer/quedar, and slang from ¡qué guay! to ¡es la leche! — always contrasted with the Latin American side so the two Spanish tracks teach the split from both directions",
      "Spanish (Spain) rounds now include two phonetics pairs per round (up from one), matching the other deepened tracks",
    ],
  },
  {
    version: "2.25.0-beta.2",
    date: "2026-07-10",
    changes: [
      "French (France) brought to full parity with Latin American Spanish: every French question now shows the native-language translation subtitle, and the track gains new C1 content plus its first C2 content (the expletive 'ne', 'dont', recognizing the literary passé simple, and proverbs like 'vendre la peau de l'ours') — 69 → 75 questions, with all six difficulty tiers now covered for placement",
    ],
  },
  {
    version: "2.25.0-beta.1",
    date: "2026-07-10",
    changes: [
      "Latin American Spanish more than doubled: 65 → 139 questions across all four categories, now reaching C1 and the track's first C2 content — with regional variation taught as real content (carro/coche, celular/móvil, chévere/chido/bacán, seseo, yeísmo, and the fast-speech pa' contraction)",
      "New: questions can now show a small translation in your native language right under the prompt — starting with Latin American Spanish and rolling out track-by-track with each deeper content pass. It follows your skill level like the rest of the page: visible at No experience/Beginner/Intermediate, hidden at Advanced/Native to keep the view immersive",
    ],
  },
  {
    version: "2.24.0-beta.5",
    date: "2026-07-10",
    changes: [
      "Fixed: the Feedback chooser page was visible without being signed in — old /feedback links now send signed-out visitors to the sign-in page, matching the bug/feature forms",
    ],
  },
  {
    version: "2.24.0-beta.4",
    date: "2026-07-09",
    changes: [
      "Fixed: opening the explanations screen crashed the app every time (for anyone with explanation history)",
      "Fixed: streak milestone celebrations (3/7/14/30/60/100/180/365 days) now actually appear when you hit one",
      "New: 'Report a bug' and 'Suggest a feature' forms in Settings, replacing the old feedback survey — bug reports can include a screenshot and an error code",
      "New: if something does crash, you'll now see a proper error screen with a reload button and an error code instead of a dead end",
      "Other general bug fixes and code changes.",
    ],
  },
  {
    version: "2.24.0-beta.3",
    date: "2026-07-09",
    changes: [
      "Accessibility: the beta application form's text fields are now properly linked to their labels for screen readers",
      "Other general bug fixes and code changes.",
    ],
  },
  {
    version: "2.24.0-beta.2",
    date: "2026-07-09",
    changes: [
      "Other general bug fixes and code changes.",
    ],
  },
  {
    version: "2.24.0-beta.1",
    date: "2026-07-08",
    changes: [
      "New: streaks never break on a missed day anymore — instead, hitting each streak milestone (3, 7, 14, 30+ days) now triggers a celebration with bonus XP",
      "New: English is now available for Italian speakers — the first language pairing built the other direction, with more native-language options coming incrementally",
      "The native language picker (Settings and first-time setup) is now a searchable dropdown instead of a plain list, and language names throughout the app now correctly show in your own native language rather than defaulting to English",
      "Accessibility improvements: visible keyboard focus indicators app-wide, all form fields properly labeled for screen readers, and popups/menus can now be closed with the Escape key",
    ],
  },
  {
    version: "2.23.0-beta.3",
    date: "2026-07-08",
    changes: [
      "Other general bug fixes and code changes.",
    ],
  },
  {
    version: "2.23.0-beta.2",
    date: "2026-07-08",
    changes: [
      "Other general bug fixes and code changes.",
    ],
  },
  {
    version: "2.23.0-beta.1",
    date: "2026-07-08",
    changes: [
      "Other general bug fixes and code changes.",
    ],
  },
  {
    version: "2.22.5",
    date: "2026-07-08",
    changes: [
      "Other general bug fixes and code changes.",
    ],
  },
  {
    version: "2.22.4",
    date: "2026-07-08",
    changes: [
      "Removed the \"open to a follow-up chat or video call\" question from the beta application — one less thing to ask up front",
    ],
  },
  {
    version: "2.22.3",
    date: "2026-07-08",
    changes: [
      "Fixed the feedback and beta-application forms showing the same generic \"something went wrong\" message no matter what actually failed — a real beta tester hit this with no way to tell either of us what actually happened. Both now show the real underlying error.",
    ],
  },
  {
    version: "2.22.2",
    date: "2026-07-08",
    changes: [
      "Other general bug fixes and code changes.",
    ],
  },
  {
    version: "2.22.1",
    date: "2026-07-08",
    changes: [
      "Other general bug fixes and code changes.",
    ],
  },
  {
    version: "2.22.0",
    date: "2026-07-07",
    changes: [
      "Fixed a real bug: Lessons mode never shuffled answer options, so the correct answer was in the first position on nearly every question — confirmed empirically (all answers landing on position 0 before the fix, spread naturally across all positions after)",
      "Closed beta: self-serve sign-up is temporarily disabled — the sign-in page now only shows an \"Apply to beta test\" link for newcomers, alongside sign-in for people who already have an invite",
      "Other general bug fixes and code changes.",
    ],
  },
  {
    version: "2.21.2",
    date: "2026-07-07",
    changes: [
      "Other general bug fixes and code changes.",
    ],
  },
  {
    version: "2.21.1",
    date: "2026-07-07",
    changes: [
      "Other general bug fixes and code changes.",
    ],
  },
  {
    version: "2.21.0",
    date: "2026-07-07",
    changes: [
      "Both the beta application and feedback forms were rebuilt with a much fuller question set, based on the original Google Forms design (device/browser, native language and current level, practice habits, time commitment, session-by-session experience, bugs, NPS-style likelihood-to-recommend, and more) — presented as short multi-step wizards (3-4 questions per step) rather than one long scrolling form",
    ],
  },
  {
    version: "2.20.0",
    date: "2026-07-07",
    changes: [
      "New: a public beta-test application page (/beta-apply) — no account needed, since applicants don't have one yet. This is the other half of #48 (\"in-app application/feedback forms\") that got dropped along the way when only the feedback half was built; caught via direct user feedback. Linked from the sign-in page and the About page.",
      "Fixed a real bug: the home screen briefly showed your email address before your username loaded, because the page only waited for the session to resolve, not the profile — now it waits for both, so there's no flash of the wrong name",
      "Other general bug fixes and code changes.",
    ],
  },
  {
    version: "2.19.1",
    date: "2026-07-07",
    changes: [
      "Settings is now always visible in the drawer, right below a divider under Dashboard — no extra tap needed to reveal it, replacing the previous click-to-expand sub-view",
    ],
  },
  {
    version: "2.19.0",
    date: "2026-07-07",
    changes: [
      "Settings now lives inside the profile-picture drawer itself, not as a separate page — tap Settings in the menu to see it right there, with a back arrow to return to the menu. The old /settings link still works and redirects home.",
      "Fixed a real bug: Lessons mode was passing the wrong value to its background theme, so the colorful animated background never rendered — the whole page looked flat and overly dark compared to Quick Quiz mode",
      "Fixed: esForEn and esSpainForEn's grammar category (\"Verbos\") wasn't switching to native-language chrome for beginners, since those two tracks use a legacy \"verbo\" category key instead of \"gram\" — added the missing translation entry after auditing all 14 tracks to confirm this was the only gap",
      "\"What's on this page?\" is now a full-width, bordered, higher-contrast button with a real icon, not small subtle text — more noticeable, and a better touch target for accessibility too",
      "Moved the placement quiz link to appear before the skill-level list (not after), so it's not missed at the bottom, especially on mobile",
    ],
  },
  {
    version: "2.18.0",
    date: "2026-07-07",
    changes: [
      "Fixed a real bug: Lessons mode now saves XP and streak progress after every answer, not just at full lesson completion — stopping partway through a lesson no longer silently loses earned XP",
      "Fixed: category names (Vocabulary/Grammar/Idioms/Phonetics) now correctly switch to your native language at low skill levels, matching the rest of the play page's chrome — previously only worked for the English US/UK cross-dialect case",
      "Fixed: Help page no longer hardcodes \"Mixto\" as if that's always the literal button text",
      "Quick Quiz ↔ Lessons switching is now a proper toggle at the top of each mode's screen, not a small link at the bottom",
      "Added collapsible \"What's on this page?\" instructions directly on both the Quick Quiz and Lessons start screens",
      "Replaced the top icon row (language badge, What's New, Help, Dashboard, Settings) with a single slide-out menu from the profile picture — much less cluttered, especially on mobile. The What's New notification dot now lives on the profile picture itself; the language badge was dropped entirely since Settings (right there in the menu) already covers it.",
      "New: an in-app feedback form (Settings → Feedback) — replaces external Google Forms, which weren't importing/styling well. Responses go straight into the database.",
    ],
  },
  {
    version: "2.17.0",
    date: "2026-07-07",
    changes: [
      "New: Lessons mode — a calmer alternative to Quick Quiz, with no timer and no combo pressure. Walks through one topic at a time, easiest items first, showing the explanation right after each answer. Switch between Quick Quiz and Lessons any time from either mode's start screen — both share the same XP, level, and mastery progress.",
      "New: an About the App page explaining what SquirreLingo is and how both modes work, linked from Help",
      "New: a one-time welcome popup on first login after onboarding, introducing both modes and linking to the About page",
    ],
  },
  {
    version: "2.16.0",
    date: "2026-07-06",
    changes: [
      "Language bubble names now show in YOUR native language instead of the target language's own name for itself — e.g. an English speaker sees \"Italian\" instead of \"Italiano\", a Spanish speaker sees \"Inglés (Reino Unido)\" instead of \"English (UK)\". Applies on the home screen, dashboard, and the play page title.",
      "First installment of a deeper-content pass: French (France) nearly doubled from 36 to 69 items, including the first C1-tier content of any track (the reversed-subject 'manquer' construction — 'tu me manques')",
    ],
  },
  {
    version: "2.15.0",
    date: "2026-07-06",
    changes: [
      "Three new languages, all at full depth (36 items each): Japanese, Mandarin Chinese, and Korean — completing the original 8-language expansion list",
      "Native script (kanji/hanzi/hangul) shown together with romanization in every question, per explicit design decision — required zero engine changes, just careful content authoring",
      "Mandarin's tones are represented with standard pinyin diacritics (ā á ǎ à) — the established way to write tones, so no new phonetic system was needed",
      "Japanese covers SOV word order, grammatical particles, no person/number verb conjugation, i- vs. na-adjectives, politeness levels, and pitch accent (見た目上 identical words distinguished only by pitch)",
      "Mandarin covers zero verb conjugation at all, aspect particles instead of tense, required measure words/classifiers, topic-comment structure, and tone sandhi (the nǐhǎo → níhǎo rule)",
      "Korean covers SOV order, particles, adjectives that conjugate like verbs with no linking \"to be\", elaborate honorific speech levels, and batchim (final-consonant) linking",
      "14 tracks now, across 10 language families — completes the original new-language backlog item",
    ],
  },
  {
    version: "2.14.0",
    date: "2026-07-06",
    changes: [
      "Two new languages, both at full depth (36 items each): German and Russian",
      "German: the biggest grammatical leap of any track so far — three genders, the full case system (nominative/accusative/dative), verb-second word order, separable verbs, modal-verb clause structure, and subordinate-clause verb-final order, plus classic false friends (Gift, Handy, Rat)",
      "Russian: no architecture changes needed for Cyrillic (just a different alphabet, no tone system) — covers zero articles at all, the 6-case system, verb aspect (perfective/imperfective), gender-agreeing past tense, and vowel-reduction phonetics (akanye)",
      "11 tracks now, across 7 language families",
    ],
  },
  {
    version: "2.13.0",
    date: "2026-07-06",
    changes: [
      "Four new languages, all at full depth (36 items each, matching Italian/France French): Canadian French, Brazilian Portuguese, and European Portuguese",
      "Canadian French is genuinely distinct from France French — the déjeuner/dîner/souper meal-name shift, false-friends-within-French (char, liqueur), the -tu question particle, \"chu\" contraction, and t/d affrication phonetics",
      "Brazilian and European Portuguese are genuinely distinct from each other — different everyday vocabulary almost across the board (ônibus/autocarro, celular/telemóvel), gerund vs. infinitive construction, você vs. tu, object pronoun placement, and very different phonetics (Brazilian palatalizes d/t before i; European Portuguese reduces vowels heavily and turns final 's' into \"sh\")",
      "The language roster now covers 9 tracks across 5 language families",
    ],
  },
  {
    version: "2.12.0",
    date: "2026-07-06",
    changes: [
      "New language: French — France French, for English speakers. Built at full depth from the start this time (36 items — same bar as Italian's expanded content, not a starter set): false friends (librairie, actuellement, coin), gendered/plural agreement, required ne...pas negation, être/avoir auxiliary choice, subjunctive triggers, y/en pronouns, 7 idioms, and liaison/nasal-vowel/silent-letter phonetics.",
    ],
  },
  {
    version: "2.11.1",
    date: "2026-07-06",
    changes: [
      "Italian content nearly tripled (13 → 36 items) after the mastery tracker made the starter-set depth feel too thin — now spans A1 through B2 across all categories, including 6 false-friend traps, 9 grammar points (essere/avere auxiliary choice, required possessive articles, subjunctive trigger phrases), and 7 idioms",
    ],
  },
  {
    version: "2.11.0",
    date: "2026-07-06",
    changes: [
      "New language: Italian (for English speakers) — starter-set content covering false friends (camera, parenti), gendered articles, city/country prepositions, required double negatives, idioms, and vowel/double-consonant phonetics. First of the new-language expansion — French (France/Canada) and Portuguese (Brazil/Portugal) are next.",
    ],
  },
  {
    version: "2.10.2",
    date: "2026-07-06",
    changes: [
      "Help page cleanup: added the missing icons for the native language badge and What's New in the icon list; removed the \"Signing up & usernames\" and \"Settings, organized\" sections as unnecessary reference detail",
    ],
  },
  {
    version: "2.10.1",
    date: "2026-07-06",
    changes: [
      "Placement quiz is now much more comprehensive: samples all six CEFR tiers (A1-C2) instead of just the middle four, with 3 questions per tier instead of 2 — should place true beginners and advanced learners more accurately, not just people in the B1-C1 middle",
      "Tightened the pass threshold per tier (60% instead of 50%) to reduce noise from a single lucky or unlucky guess now that there are more questions per tier",
    ],
  },
  {
    version: "2.10.0",
    date: "2026-07-06",
    changes: [
      "Added breathing room between the Sign out button and the fixed footer at the bottom of Settings, so they don't feel clumped together",
      "New per-category mastery tracker on each language's start screen: learned vs. total items per category, plus a breakdown by difficulty level for smaller, less-daunting progress chunks",
    ],
  },
  {
    version: "2.9.0",
    date: "2026-07-06",
    changes: [
      "Terms of Service and Privacy Policy links added to the Settings footer, anchored just above the version tag",
      "Play page UI now switches language based on skill level: No experience/Beginner/Intermediate shows all chrome (buttons, labels, stats) in your native language; Advanced/Native shows it in the language you're learning",
      "Category picker is now genuine mix-and-match — select any combination of categories to focus a round on, and picking \"Mixto\" clears other selections back to the full blend",
    ],
  },
  {
    version: "2.8.2",
    date: "2026-07-06",
    changes: [
      "Actually fixed the profile picture ring this time — the previous fix addressed an ellipse/circle mismatch, but the button's 8px padding around the smaller avatar was still leaving a visible ring of background behind it. The avatar now fills its button completely (zero padding, exact same footprint as the other top-row icons), so there's nothing left to show through.",
    ],
  },
  {
    version: "2.8.1",
    date: "2026-07-06",
    changes: [
      "Fixed the profile picture's remaining border — traced to the surrounding button using asymmetric padding, making its round shape an ellipse that peeked out around the perfectly circular avatar inside it",
      "Language bubbles now use their country icon as a large background element instead of a small side icon, and are laid out in an equal-size 2-column grid instead of variable-width flex wrapping",
      "Redesigned the squirrel logo/favicon with a proper body, two-tone ears, a more natural curled tail, and a little paw — replacing the simpler head-and-tail-only version",
      "Welcome greeting is now clearly bigger (30px) than \"Pick your next quick win\" (22px)",
    ],
  },
  {
    version: "2.8.0",
    date: "2026-07-06",
    changes: [
      "Profile picture is now a clean full circle everywhere — removed the extra border ring",
      "New: Terms of Service and Privacy Policy pages, with a required acknowledgement checkbox at sign-up and a one-time re-acknowledgement popup for existing accounts (mirrors how the required-username gate works)",
      "Language bubbles are more compact and denser, each now showing a small illustrated icon for its country/region (Statue of Liberty for US, Big Ben for UK, Spain's flag, a sun motif for Latin America)",
      "Native English speakers (not based in the UK) can now also learn English (UK) — its content is genuinely comparative (British vs. American), so prompts, category labels, and the sublabel automatically switch to English-native phrasing instead of the Spanish-learner phrasing used for the track's original audience",
    ],
  },
  {
    version: "2.7.0",
    date: "2026-07-06",
    changes: [
      "Fixed: the native language/country badge could show stale data after changing it in Settings — Home now re-fetches your session whenever you land back on it, instead of only on first load",
      "Welcome greeting is now bigger than \"Pick your next quick win\" (was backwards), with a waving-hand animation and a one-time shimmer sweep across your username on load",
      "Removed the boxy borders around the top-row icons — softer, borderless circles/pills instead",
      "Added the SquirreLingo logo (matching the favicon) next to the wordmark on the home screen and sign-in page",
    ],
  },
  {
    version: "2.6.0",
    date: "2026-07-06",
    changes: [
      "Native language/country moved from a bottom footer tag to a compact badge (country code + flag) in the top icon row — resolves the earlier alignment issue by removing it from the bottom entirely",
      "Version tag is now fixed to the bottom of the viewport at all times, instead of sitting in normal page flow",
      "Removed the redundant large avatar from the welcome header (profile picture already shows via the Settings icon)",
      "\"Pick your next quick win\" is now noticeably bigger and bolder",
      "Help page revisited top to bottom: now covers the category picker, review mode, configurable rounds/timer, required usernames + verify/alternatives, onboarding, and the grouped Settings sections — all previously undocumented",
      "Other general bug fixes and code changes.",
    ],
  },
  {
    version: "2.5.0",
    date: "2026-07-06",
    changes: [
      "Username is now required at sign-up (previously optional)",
      "New username availability field with an explicit \"Verify\" button — if taken, shows a few auto-generated available alternatives to pick from with one tap. Used at sign-up, in Settings, and in the forced-username popup",
      "Settings page reorganized into clear sections: Profile, Account, Language & Learning, and Subscription (placeholder for later)",
    ],
  },
  {
    version: "2.4.0",
    date: "2026-07-06",
    changes: [
      "New: any signed-in account without a username now gets a mandatory popup to create one before continuing — covers both existing accounts and anyone who skipped it at sign-up",
      "Home screen: the Settings icon is now your actual profile picture; hover text changed to \"User Settings\"",
      "Centered welcome greeting with your username, localized by native language (\"Welcome\" / \"¡Bienvenido/a\"), with a little pop-in animation and a wave",
      "\"What do you want to learn?\" replaced with \"Pick your next quick win ⚡\"",
      "Back buttons across every page (play, Settings, Dashboard, Help, Changelog, What's New) are now higher-contrast and more noticeable, not just a faint gray outline",
      "Help page updated to describe the new profile-picture icon and \"User Settings\" label",
    ],
  },
  {
    version: "2.3.0",
    date: "2026-07-06",
    changes: [
      "Sign out moved from the home screen to the bottom of Settings; remaining home-screen icons shift right",
      "New pre-round category picker — practice vocab-only, verbs/grammar-only, translation-only, or phonetics-only, instead of always mixed",
      "New \"review mode\" setting (Settings → Gameplay): pause after each answer, read the bilingual explanation inline, tap \"Next\" to continue — for anyone who'd rather review immediately than wait",
      "Questions-per-category, phonetics-pairs-per-round, and per-question timer are now all configurable in Settings → Gameplay, with the option to use one timer for everything or set phonetics separately",
      "New guided onboarding flow right after first sign-up: native language (required), native country (optional), and profile picture (optional) in one short wizard, replacing the old \"just show every track\" fallback for brand-new accounts",
    ],
  },
  {
    version: "2.2.0",
    date: "2026-07-06",
    changes: [
      "New \"What's New\" page (! icon, home screen) — shows just the latest release's notes; the version tag at the bottom still opens the full changelog",
      "A small red notification dot appears on the ! icon whenever there's a version you haven't seen yet — clears once you open the page",
    ],
  },
  {
    version: "2.1.1",
    date: "2026-07-06",
    changes: [
      "Fixed: the region/flag tag and version tag were sitting side-by-side instead of stacked — switched to a flex-column layout so they reliably stack and center regardless of their own width",
      "Help page wording generalized beyond English/Spanish, since more language pairs keep getting added",
      "Removed the redundant \"Help\" entry from the Help page's own icon list",
      "Removed the \"Updates\" section from the Help page",
    ],
  },
  {
    version: "2.1.0",
    date: "2026-07-06",
    changes: [
      "Right/wrong answer feedback is now much more noticeable: a green pulse-glow on correct, a red shake on wrong, thicker borders, bolder colors, and bigger check/X icons",
      "New Help page (? icon on home screen) — a full walkthrough covering icons, language selection, rounds, missed-question review, explanations/archive, skill levels, profile pictures, and account security",
      "Native country and flag-avatar pickers are now searchable dropdowns — full list shown by default, filters live as you type",
      "Simplified language cards on the home screen: just skill level + XP progress now, no more sublabel text clutter",
      "Fixed alignment between the region/flag tag and the version tag at the bottom of the home screen — both now use the same centering approach",
      "Added a proper favicon — a little squirrel mascot icon for the browser tab",
    ],
  },
  {
    version: "2.0.1",
    date: "2026-07-06",
    changes: [
      "Fixed: sign-up now works correctly whether email confirmation is on or off in Supabase — previously always showed \"check your email,\" even when confirmation was disabled and a session came back immediately",
      "Other general bug fixes and code changes.",
    ],
  },
  {
    version: "2.0.0",
    date: "2026-07-05",
    changes: [
      "Renamed the app from Reactor Lang to SquirreLingo — fun, memorable, and honest about who it's built for",
    ],
  },
  {
    version: "1.9.2",
    date: "2026-07-05",
    changes: [
      "Renamed \"Update\" to \"Reload\" throughout the version-check popup — more accurate wording for a website",
      "Removed \"Signed in as\" prefix on the home screen — just your username now, styled with a bit more personality",
    ],
  },
  {
    version: "1.9.1",
    date: "2026-07-05",
    changes: [
      "Update popup now forces a mandatory update on the sign-in screen specifically (blocking, no 'Wait' option) — same idea as a mobile app requiring an update before launch",
      "Everywhere else (already inside the app), it stays a dismissible soft prompt, exactly as before",
    ],
  },
  {
    version: "1.9.0",
    date: "2026-07-05",
    changes: [
      "New: soft-prompt update popup — checks for a newer deployed version every minute (and whenever the tab regains focus), showing an \"Update now / Wait\" popup rather than forcing a reload",
      "Nothing is interrupted if you pick 'Wait' — finish your round, come back to it whenever",
      "Other general bug fixes and code changes.",
    ],
  },
  {
    version: "1.8.1",
    date: "2026-07-05",
    changes: [
      "Fixed: flags now render as real images (via a flag CDN) instead of emoji — Windows doesn't ship flag emoji glyphs, so they were showing as plain two-letter codes",
      "Native country changed from a button grid to a searchable dropdown, now listing all ~195 countries instead of just Spanish/English-speaking ones",
      "Same for the flag-avatar picker in Profile picture settings — full country list, real flag image preview",
    ],
  },
  {
    version: "1.8.0",
    date: "2026-07-05",
    changes: [
      "Progress dashboard: total XP/streak/rounds across all languages, plus a per-language breakdown (bar-chart icon on home screen)",
      "Skill levels added to every track (No experience/Beginner/Intermediate/Advanced/Native), based on the real CEFR framework (A1-C2)",
      "Every existing question (~90 across all 4 tracks) tagged with a CEFR difficulty level",
      "Rounds now bias toward your current skill level without ever leaving a round short on content",
      "Accuracy tracking + a \"ready to advance?\" prompt once you're consistently doing well at your level",
      "New placement quiz (per track) for anyone unsure where they fall — untimed, samples across difficulty tiers",
    ],
  },
  {
    version: "1.7.0",
    date: "2026-07-05",
    changes: [
      "\"Signed in as\" now shows your username if you've set one, otherwise your email",
      "Profile pictures: upload a photo, pick a generic icon, or use a country flag as your avatar (Settings → Profile picture)",
      "Added a Native country setting; combined with native language, infers a regional label + flag (e.g. Spanish + Venezuela → \"Español (Latinoamérica)\" 🇻🇪) shown on the home screen just above the version tag",
      "Split the English track into English (US) and English (UK) — genuinely distinct content: different everyday vocabulary, idioms, and non-rhotic phonetics for UK",
    ],
  },
  {
    version: "1.6.0",
    date: "2026-07-05",
    changes: [
      "Other general bug fixes and code changes.",
    ],
  },
  {
    version: "1.5.0",
    date: "2026-07-05",
    changes: [
      "Other general bug fixes and code changes.",
    ],
  },
  {
    version: "1.4.0",
    date: "2026-07-05",
    changes: [
      "Current-password re-entry required before changing email or password in Settings",
      "Show/hide toggle (eye icon) on every password field, app-wide",
      "Password strength meter while typing a new password",
      "Changing your password now signs out any other devices you're logged in on elsewhere, for security",
    ],
  },
  {
    version: "1.3.0",
    date: "2026-07-05",
    changes: [
      "Friendlier color palette (warm plum/pink instead of the original near-black HUD look)",
      "Animated per-track background themes; home screen cycles seamlessly through all of them",
      "Settings moved behind a gear icon on the home screen (with hover tooltip)",
      "Added a version log and version tag (this page!)",
    ],
  },
  {
    version: "1.2.0",
    date: "2026-07-05",
    changes: [
      "Optional username sign-up/sign-in (alongside email) — usernames never expose emails",
      "Forgot password flow (email reset link)",
      "Existing-email detection on sign-up, with a clear error instead of a silent no-op",
      "All account settings (username, email, password, native language) editable via an Edit/Save/Cancel pattern",
      "Security notification emails on username/email/password changes, via Resend",
    ],
  },
  {
    version: "1.1.0",
    date: "2026-07-05",
    changes: [
      "Native/base language selection moved out of sign-up, chosen on first home-screen load instead",
      "Bubble-style picker for target language, filtered by native language",
      "Added Spain (Castilian) Spanish as its own track — vosotros, distinción, peninsular vocabulary",
    ],
  },
  {
    version: "1.0.0",
    date: "2026-07-05",
    changes: [
      "Initial release: real accounts + database sync across devices (Supabase)",
      "Full Latin American Spanish track, ported from the original prototype",
      "Starter English (for Spanish speakers) track",
      "Mixed rounds: vocab, verbs, translation, phonetics (readable respelling, not IPA)",
      "Missed-question review mode, with bilingual explanations",
      "Explanation history + archive (paginated, never silently deleted)",
      "\"Don't repeat too soon\" freshness rotation across questions",
    ],
  },
];

// #91: INTERNAL changelog. The user-facing CHANGELOG above is deliberately
// cleaned — anything internal (CI, migrations, admin tooling, refactors, dev
// process) is folded into a single "Other general bug fixes and code changes"
// line by standing practice. That means the dev/staging site showed exactly
// the same cleaned list as prod, with no way to see the real detail.
//
// INTERNAL_CHANGELOG carries the folded-away detail, keyed by version. The
// changelog view (app/changelog/page.js) renders these extra notes ON TOP of
// the user-facing changes when it's running on a non-production deploy OR the
// viewer is an admin (see isNonProdEnv() below); production shows only the
// cleaned CHANGELOG. This is additive, so nothing user-facing is lost.
//
// KEEP IN SYNC AT RELEASE: the docs/changelog rollup already produces both a
// user-facing half and an internal half — the internal half lands here, the
// cleaned half lands in CHANGELOG. Full historical internal detail for
// releases before #91 lives in docs/changelog/released/**.
export const INTERNAL_CHANGELOG = [
  {
    version: "2.33.0-beta.15",
    date: "2026-07-20",
    notes: [
      "THREE-PART dev session: (A) CJK tag layer, (B) ja/ko Grammar Gym, (C) German+Russian depth pass. All AI-authored + adversarially self-verified, PENDING human native review; written uncommitted on dev, NOT deployed. Per Sean’s plan these roll up to v3.0.0 (dev→main) once every language is fully built — no beta release this session.",
      "(A) CJK TAG LAYER (#88/#89 for ja/ko/zh). NEW data/tracks/{jaForEn,koForEn,zhForEn}Tags.js mirroring esForEnTags.js (THEMES {id,en,<lang>} + RAW keyed by normalized prompt + tagFor); wired into each track (import { THEMES, tagFor }; themes/tagFor on the export). Shared 9-theme catalog. Themed vocab/gram/trad: ja 47 / ko 56 / zh 36 items. GRAMMAR/POLITENESS chips: the #89 person pill REPURPOSED as a form/politeness register (ja/ko have no person inflection) — ja 28 + ko 26 gram items carry {grammar:{tense,why}, person:<register>}; zh themes-only (no tense/person inflection in Mandarin). Chips ride only on conjugation-bearing gram items; particle/word-order/counter items get themes only. Keys built from an index→prompt map so CJK strings can’t drift; 0 orphan keys. Verify: adversarial native pass over all 54 ja+ko chips (keigo honorific/humble, tense/aspect, register) → 0 defects. esbuild ESM parse clean; tagFor coverage re-checked at runtime.",
      "(B) ja/ko GRAMMAR GYM (#3). NEW data/grammar/{jaForEn,koForEn}.js registered in data/grammar/index.js (auto-enables the gym toggle via grammarForTrack; zh intentionally absent). SCHEMA DECISION (the piece flagged for Sean): the engine’s person×tense grid is repurposed — ‘persons’ becomes a POLITENESS/FORM register, ‘tenses’ stay tense/aspect/mood. ja persons=[plain 普通形, polite 丁寧形]; tenses=nonpast/nonpastNeg/past/pastNeg/volitional/potential (te-form excluded — no clean plain/polite pair); 10 verbs (ichidan/godan/irregular) × 6 × 2 = 120 cells. ko persons=[해요체/합니다체/한다체]; tenses=present/past/future(-(으)ㄹ 거)/presentNeg(안)/progressive(-고 있다); 9 verbs (regular/hada/irregular) × 5 × 3 = 135 cells. Native script + romanization per cell. Grammar page + lib/grammarGym.js already fully generic (read gym.targetLang/persons/tenses/groups) — NO code changes. Verify: independent adversarial 255-cell form check → 2 defects (듣는다 romanization deumneunda→deunneunda ×2; script correct), fixed; also swapped 모르다 (nonsensical 안-negative)→부르다 and 공부하다 presentNeg→idiomatic 공부 안 해요. buildDrill validated end-to-end (answers match correctIdx, distractors are same-verb confusable forms, 0 dup options).",
      "(C) GERMAN+RUSSIAN DEPTH PASS (#4). Same orchestrated method as the CJK depth pass (parallel authoring subagents vocab+trad / gram+fono per language → adversarial native verify per language → dedup + splice + validate). deForEn 25/20/15/9 → 72/55/53/35 (+47 vocab / +35 gram / +38 trad / +26 fono); ruForEn 25/19/14/9 → 72/55/52/35 (+47/+36/+38/+26). ~290 new items, even A1–C2 spread. Conventions matched: de ‘bedeutet’ frame + dictionary noun casing (no auto-lowercase) + false-friend/untranslatable focus; ru ‘значит’ frame, Cyrillic-only (no romanization), lowercase common-noun headwords. Correct-answer-first / correctIdx 0. Dedup dropped 1 de gram collision (Das ist ___ Buch.). Verify caught 4 defects, all fixed: de als-clause ‘sei’ (Konj I also valid) distractor→‘wird’; de ‘Stadt’ explain falsely cited an ä; de ‘strong as an ox’ had two also-idiomatic animal distractors (Ochse/Pferd)→Stein/Baum; ru genitive-of-negation ‘письмо’ (acc also acceptable)→‘письме’. Validation: esbuild parse both tracks + runtime literal-extract (option-count / correctIdx-range / explain en+es / fono identify[0]===text / no-dup-prompt) → 0 problems. CARRIED: de/ru still have NO tag layer or Grammar Gym (future increments); all this session’s content still owes human native review.",
      "(D) VISUAL + NAV COHESION PASS (design-audit follow-through; #63 + #92 + Alphabet/Grammar nav). Repo-wide, from 4 project audit docs (visual_sweep / design_cohesion_audit / v3_gap_analysis / parity_plan_per_language). (1) #7C7395 — the WCAG-AA-failing faint gray (#63) — swept to #9B93B8 across 25 files (60 occurrences incl. the theme.js textFaint token + a stray #8A7FA3). (2) lib/theme.js gained real token exports GRAY{dim,faint} / RADIUS{sm,md,lg,xl,pill} / SURFACE{card,cardBorder,inset,optionDefault/Correct/Wrong}, now consumed by ModeToggle + SectionToggle (fixes the ‘three segmented controls disagree’ drift at the source). (3) NAV: Alphabet (script) ModeToggle now passes grammarLabel, and the Grammar Gym page now renders the full ModeToggle — Alphabet↔Grammar reachable both ways (previously neither). BackHome (Back + depth-aware Home, #92) migrated onto dashboard / feedback / feedback-bug / feedback-feature / learn-start-screen / script(Alphabet) / privacy / terms → BackHome now on 13 pages, 0 bespoke ‘← Back’ buttons remaining (in-round play + in-lesson learn ‘exit’ buttons intentionally kept — abort-session semantics, not navigation). (4) One-offs: SectionToggle off-palette #2B2740 → panelBorder #3A3452; ComingSoon card #1F1B30 → #221E33 & r14→16; StreakMilestone r20→16; WelcomePopup backdrop-click dismissal; feedback/bug, feedback/feature, error.js secondary buttons cyan #3DDBFF → standard gray; quiz option-state surfaces unified (default #1D212B / correct #1E4A32 / wrong #4A1E24) across play/learn/script/placement/grammar; placement given the animated track-gradient background + 480 container (was flat + 420); home/play maxWidth 460→480; play top back button given aria-label. 31 files total; esbuild JSX-parse clean on each + full `next build` green (38/38 pages, lint pass). DEFERRED (flagged, not bugs): full page-level literal→token migration — values are already consistent, but wholesale conversion is best done incrementally against a running dev server since an undefined token ref fails silently (no build error); the title-size scale (22/26/28/30) and the off-palette ‘purple notice’ surface family left as deliberate design calls. Committed on dev under the beta.15 label — no version bump (Sean’s call: fold into beta.15).",
      "(E) GERMAN+RUSSIAN TAG LAYER + GRAMMAR GYM (#88/#89/#90 for de/ru — the item (C) flagged CARRIED). Closes the structural gap on the two ‘not fully built’ languages. NEW data/tracks/{deForEn,ruForEn}Tags.js mirroring esForEnTags/jaForEnTags (THEMES {id,en,<lang>} + RAW keyed by whitespace-normalized prompt + tagFor); wired into each track (import { THEMES, tagFor }; themes/tagFor on the export object, placed after wbCatId). Shared 9-theme catalog (numbers-time/directions/shopping/restaurant/travel/medical/small-talk/work/emotions). Themed vocab/gram/trad: de 66 / ru 64 tagged prompts. #89 CHIPS: unlike ja/ko’s repurposed politeness pill, de/ru inflect for person for real, so `person` names the ACTUAL subject. de: 17 gram conjugation items carry {grammar:{tense,why}, person} (Präsens / Perfekt with sein-vs-haben / Präteritum-subordinate / Konjunktiv I reported speech / Konjunktiv II incl. als-ob & wenn-drop inversion / present+past passive / modal+infinitive / möchten polite). ru: 16 carry tense/aspect/mood chips (present / perfective+imperfective past / perfective future / reflexive -ся / imperfective imperative / чтобы-subjunctive / бы-conditional / motion verbs ходить-vs-ездить & при- prefix), with PAST items’ `person` naming the gender/number agreement target (она fem., они plur.). Case/article/adjective-ending drills get themes only or nothing. Keys copied verbatim from the tracks — verified older bank items keep the English hint in promptNative (clean prompt) while newer depth-pass items inline it in the prompt string; mismatched keys are harmless (tagFor→null → no chip, no crash). NEW data/grammar/{deForEn,ruForEn}.js registered in data/grammar/index.js (auto-enables the gym toggle via grammarForTrack; grammar page + lib/grammarGym.js already fully generic — read gym.targetLang/persons/tenses/groups — so NO code changes). de gym: persons=[ich,du,er,wir,ihr,sie] (Romance template drops straight in); tenses=Präsens/Perfekt/Präteritum/Plusquamperfekt/Futur I/Konjunktiv II; 11 verbs (weak/strong/aux/modal) × 6 × 6 = 396 cells; Perfekt/Plusquam carry the correct sein-vs-haben aux, K II synthetic for aux+modals+high-freq strong (wäre/hätte/würde/könnte/ginge/spräche/führe) and würde-periphrasis for weak verbs (whose synthetic K II collapses onto the Präteritum). ru gym: SCHEMA DECISION (the piece flagged for Sean) — Russian’s past inflects by GENDER/NUMBER not person, so like ja/ko excluding the te-form, PAST is deliberately left OUT of the person grid; the ‘tenses’ axis is instead the aspect system: imperfective present / perfective simple future / imperfective compound future (буду + inf). persons=[я,ты,он/она,мы,вы,они]; 9 aspect-pair verbs (conj1/conj2/mutation/irregular) × 3 × 6 = 162 cells; Cyrillic-only, no romanization (matches ruForEn convention). Verify: node --check all 7 changed files as ESM → clean; runtime import validation → 0 problems (every verb×tense cell has exactly persons.length non-empty forms, no stray tense keys, all verb.group refs resolve; all referenced theme ids ∈ the 9-theme set, 0 field errors). PENDING human native review (established gate): de participle/aux choice + Konjunktiv usage, ru aspect-partner choice + stress. Written uncommitted on dev, NOT deployed; rolls into v3.0.0 per plan — no version bump.",
      "(F) PHONETICS GAP-FILL (fono deepen ja/ko/zh). DATA CORRECTION: the parity plan listed CJK fono at 12/12/10 and called it the worst gap — the actual FONO_BANK arrays hold 37/37/35 (string-aware bracket parse + node-validated; the “12” was a bad `{ text:` regex undercount). vocab/gram/trad match the doc exactly (72 / 60-62 / 53-59), so fono was the ONLY miscounted category and is NOT the worst gap — vocab (72→134) and trad (~55→127) are the larger holes. Added only NON-DUPLICATIVE items filling verified gaps (checked against all 37/37/35 existing): ja +3 (拗音 palatalization 病院/美容院 + きょう/きよう; moraic-ん→ŋ before velars, りんご) → 40; ko +6 (systematic plain/tense/aspirated triples 불뿔풀·자짜차·달탈·굴꿀; intervocalic voicing 아버지; cascaded assimilation 백로→뱅노) → 43; zh +7 (the segmental inventory the tone-only bank lacked: j/q/x series, b/p & d/t aspiration-not-voicing, Mandarin retroflex r 日/人, apical-vs-bright i 是/西, -ian fronting 天, bare-e vowel 饿/鹅) → 42. Schema matches existing FONO_BANK (text/sound/difficulty/identify/respond, en+es explain, 4 options each). node --check clean on all three; structural validation 0 problems. PENDING human native review. Uncommitted on dev; rolls into v3.0.0 — no version bump.",
      "(F cont.) TRAD DEEPEN batch 1 — Japanese. +16 idioms/set-phrases/yojijukugo appended to jaForEn trad (57→73), checked non-duplicative against the full 57-prompt existing list. Mix: everyday (大丈夫 / しょうがない / お世話になっております / 一生懸命 / 猫舌 / 朝飯前), idiomatic (目から鱗 / 猫をかぶる / 腹を割って話す / 後の祭り / 馬の耳に念仏 / 一目惚れ), C1–C2 (口は災いの元 / 初心忘るべからず / 一寸先は闇 / 切磋琢磨). Schema = existing trad BANK item [prompt, 4 opts, correctIdx 0, {en,es}, level]; new items are untagged (no tagFor entry — the engine attaches no theme, which is acceptable). node --check + full structural validation → 0 problems (every item: string prompt, 4 options, idx∈0-3, en+es explain, valid CEFR level). trad is the worst %-gap category — ko/zh/de/ru trad (+68–75 each) still owed. PENDING native review.",
      "(F cont. 2026-07-21) TRAD DEEPEN batch 2 — parallel authoring across 5 tracks. +53 ja / +68 ko / +74 zh / +82 de / +73 ru = 350 new idioms/proverbs/set-phrases. Totals: ja trad 73→126, ko 59→127, zh 53→127, de 53→135, ru 52→125 (ko/zh AT the 127 target, de over, ja/ru 1–2 short). Authored by 5 parallel subagents (one per language), then CENTRALLY validated — not on self-report: node eval + structural check (4 opts, correctIdx 0, en+es, valid CEFR) → 0 problems; programmatic dedup against each track's FULL existing prompt + correct-answer sets caught and removed 3 collisions the agents missed (ja 猫の手も借りたい ×1; ru Семь раз отмерь + Глаза боятся ×2). Schema = existing trad BANK item [prompt, 4 opts, idx0, {en,es}, level]; new items untagged. Per-track format: ja kanji+wapuro romaji, zh hanzi+toned pinyin, ko/de/ru native-script only. Batch-F fono preserved (ja 40 / ko 43 / zh 42). Biggest single content drop of the parity effort. PENDING native review.",
      "(G 2026-07-21) VOCAB DEEPEN — parallel authoring across the 5 recent tracks (ja/ko/zh/de/ru), each 72→134 (+62; +310 total), the biggest remaining pre-v3.0.0 content gap. Method mirrors the trad batch: 5 parallel authoring subagents (one per language) emitting STRUCTURED JSON (headword, romanization, 4 options correct-first, en+es note, CEFR level), then CENTRAL programmatic validation — NOT self-report: structural check (4 distinct non-blank options, level ∈ A1–C2, en+es present, romanization present for CJK) + dedup by normalized headword vs each track’s FULL existing 72 vocab AND within-batch → 0 collisions / 0 dups across all five. Target CEFR spread hit exactly per track (A1×12 / A2×14 / B1×14 / B2×10 / C1×7 / C2×5). Prompt[0] and the TTS ‘means…’ stub SYNTHESIZED deterministically per-language (ja はどういう意味ですか / ko 무슨 뜻이에요 with batchim-correct 은/는 particle computed from the final syllable / zh 是什么意思 / de bedeutet… / ru значит…) so format cannot drift; items serialized via JSON.stringify → guaranteed-valid JS 7-element array [prompt,[4 opts],0,{en,es},level,null,{en:tts}], correctIdx 0, untagged (null tag slot, engine attaches no theme — acceptable). Cross-category check caught 3 ja items already present as trad idiom entries (以心伝心 / 三日坊主 / 猫舌) → swapped for genuine C2 vocab (面影 / 未練 / 気まずい). node --check clean on all 5 tracks; runtime literal-extract recount = 134 vocab each. Domains: body / clothing / food-drink / home / places / weather / time / tech / travel / health / money / work, plus a C1–C2 hard-to-translate tail. Also feeds the frequency Word Bank. PENDING human native review (this is now part of the largest unreviewed pile, alongside the F fono gap-fill + 350-idiom trad batch). Written uncommitted on dev; rolls into v3.0.0 — no version bump.",
      "(H 2026-07-21) ENGINEERING / POLISH BATCH — no content authored in this sub-batch; all engineering, all verifiable, all under the beta.15 label (no bump). (1) #93 TTS grammar-prompt quoted-span cleanup: the 31 gram prompts (ko 10 / zh 19 / ru 2) that the native-voice parser flagged with ‘unrecognized quoted spans’ are fixed. Root cause reproduced by REPLICATING generate-tts.mjs’s exact detector in-sandbox (LANG_RULES quoteDetect + knownQuoted + the toSSML translate/nativeWhenNoTarget/production/asis branch order + the ko/zh/ru deriveSpoken strippers + normalizeSpokenText) — the replica matched the ko10/zh19/ru2 counts exactly. Fix = convert the flagging ASCII single-quote spans in those prompts to ASCII DOUBLE quotes (the codebase’s own accepted embedded-span convention — quoteDetect only matches single quotes, so double quotes clear the flag with ZERO meaning/display change; zh English ‘— tail’ glosses stay English-voiced via the quote-agnostic nativeTail rule; ru gender items become whole-Russian target-voice). Applied programmatically (balanced `'…'`→`\"…\"`, leaving stray contraction apostrophes untouched); re-ran the replica → 0 flags on all three tracks; node --check clean. NOTE: these prompt strings change, so their audioKey changes → clips regenerate on the next deploy’s TTS auto-run (expected). (2) #87 answer-choice audio: added the deferred user-facing CHANGELOG line. Deploy-command analysis (see handoff): a single `npm run deploy dev` will NOT synthesize the esForEn option clips this deploy, because tts-on-deploy.mjs only runs generate-tts for tracks whose content changed in the pushed diff, and esForEn.js is NOT changing here — so a separate `node scripts/generate-tts.mjs --track esForEn --upload` is required (idempotent; synthesizes the trad+verbo CHOICE_AUDIO option clips + any missing esForEn prompt clips). (3) #41 community-review flag UI: NEW lib/reviewStatus.js (REVIEW_STATUS map + reviewStatusFor/isUnderReview; every track defaults ‘in-progress’, flip an id to ‘reviewed’ to hide) + NEW lib/ReviewBadge.js (‘bubble’ icon-only micro-pill + ‘full’ labeled pill, purple ‘notice’ theme tokens, renders null when reviewed). Wired: home track bubbles (app/page.js, bubble variant, top-right) + play start screen under the track title (app/play/[trackId]/page.js, full variant). esbuild JSX-parse clean on all four touched files. (4) Housekeeping confirmed (no change needed): buildFrequencyBank Word Bank is already wired on fr/frCa/it/ptBr/ptPt AND esSpain (import + call + wbCatId + fvocab all present). Uncommitted on dev; rolls into v3.0.0 — no version bump.",
      "(I 2026-07-21) FONO TOP-UP — the last curated-count content gap, now closed. All five recent tracks brought to fono 79: de 35→79 (+44), ru 35→79 (+44), ja 40→79 (+39), ko 43→79 (+36), zh 42→79 (+37) = +200 items. Authored INLINE (no multi-agent workflow — that path was stopped this session) and CENTRALLY validated programmatically, not on self-report: per-item structural check (text/sound/difficulty∈A1–C2, identify+respond each with EXACTLY 4 distinct non-blank options, correctIdx===0 on BOTH, explain.en+explain.es present) + dedup by normalized `text` AND by identify.options[0] vs each track's FULL existing FONO_BANK and within-batch → 0 dupes / 0 collisions across all five. Every track lands the same even tier spread (A1 6 / A2 15 / B1 19 / B2 17 / C1 12 / C2 10 = 79). Schema matches existing FONO_BANK exactly ({text, sound, difficulty, identify{options[4],correctIdx 0,explain{en,es}}, respond{…}}); CJK items carry native script + romanization together; spliced before each FONO_BANK's closing bracket as JSON-serialized literals (consistent with the file's existing mixed style). node --check clean on all five; runtime literal-extract recount = 79 each, correctIdx 0 verified. Phenomena chosen to be genuinely NON-duplicative of the existing bank and to teach real, attested contrasts (no invented minimal pairs). PENDING human native review (the #41 flag UI now surfaces this per-track). Uncommitted on dev; rolls into v3.0.0 — no version bump.",
      "(J 2026-07-21) es-SPAIN VERBO 152 → 517 (+365) — the biggest single-track lift, now done. The 'hold until Phase-1 native review' gate was WAIVED for this run (still flagged for review). Method: rather than reconfigure the multi-agent variant-expansion pipeline for a new variant, generated the drills DIRECTLY with verbecc (the same conjugation library the pipeline's assemble step uses; `pip install verbecc`, CompleteConjugator lang='es'), so EVERY verb form is library-verified — no hand-conjugation. ~54 verbs (regular -ar/-er/-ir, stem-changers, irregulars, + Spain-flavored coger/aparcar/conducir) × the tenses present/preterite/imperfect/present-perfect/future/conditional/present-subj/imperfect-subj + affirmative & negative imperatives × persons (heavy vosotros, and Spain's present-perfect-for-today register cued by 'Hoy…'). Each drill: a cloze sentence '[cue] [subject] _____ (inf) [complement].' with the correct verbecc form as option[0] and 3 SAME-verb, SAME-tense other-person forms as confusable distractors (correctIdx 0), a bilingual explain (with targeted notes on vosotros, the Spain present-perfect register, subjunctive triggers, and the -ad/-ed/-id vosotros command), a CEFR level assigned by tense×regularity, and an English promptNative. Over-generated (~2700 candidates), then dedup vs the FULL existing 152 prompts + within-batch (normalized NFC/lowercased/space-stripped) and sampled to a balanced spread. Central programmatic validation → 0 problems (cloze present, exactly 4 distinct non-blank options, correctIdx 0, explain.en+es, valid CEFR, promptNative, no dup prompts). node --check clean; runtime BANK recount = verbo 517, levels A1 81 / A2 96 / B1 106 / B2 89 / C1 78 / C2 67. Matches/exceeds the Spanish standard's 515. PENDING native (peninsular) review — flag prominently. Uncommitted on dev; rolls into v3.0.0 — no version bump.",
      "(K 2026-07-21) GRAM EXPANSION + PARITY RE-COMPARISON (#7). Recomputed TOTAL curated counts (vocab+gram+trad+fono) vs the Spanish standard 855 after the fono + verbo work: es-Spain is now 850 = 99% (the verbo lift did it). The five recent tracks: authored a diverse, in-quiz `gram`-category expansion (NOT Grammar-Gym conjugation tables — the Gym stays separate; these are varied grammar POINTS), roughly doubling each: de 55→102 (+47: cases, two-way vs dative/accusative prepositions, V2 & subordinate word order, relative pronouns, Konjunktiv I/II, passive, genitive, comparatives), ru 55→93 (+38: the six cases incl. genitive-of-negation & animacy, aspect perfective/imperfective, verbs of motion идти/ходить·ехать/ездить, чтобы+past, бы-conditional, number+case, dative verbs), ja 60→99 (+39: particles を/に/で/から/と/の/が, the four conditionals たら/ば/と/なら, ~たい/~ている/~てしまう/~ておく, giving-receiving あげる/くれる/もらう/くださる, sonkeigo/kenjougo keigo, passive/causative), ko 62→101 (+39: object/location/recipient/means particles, 도/만/부터·까지, connective endings -아서/-니까/-는데/-지만, -고 싶다/-아어야 하다/-지 마세요/-(으)세요, -(으)려고 vs -(으)러, subject honorific 께서+주무시다 & humble 여쭤보다, 반말), zh 30 (56→86: measure words 本/杯/位, aspect 了/过/着, 正在, 把 & 被, 是…的, 比, degree/potential/resultative/directional complements, 会/能/想, 就/才, 一…就, 越来越, 因为…所以/虽然…但是/如果…就, existential 有, 从…到, 对…来说). Each item: cloze/MC with correct-first (correctIdx 0), 4 distinct non-blank options, bilingual explain, CEFR level, promptNative; CJK native-script+romanization. Central programmatic validation (structure, correctIdx 0, distinct options, explain en+es, valid CEFR, promptNative) + dedup vs each track's FULL existing gram + within-batch (3 collisions caught & replaced: 1 ja possessive-の, 1 ko 도, 1 de separable-verb option). node --check clean on all five. **QUALITY-GUARD SHORTFALL — FLAGGED, NOT PADDED:** reaching ≥90% (~770 total) requires gram ≈ 430 per track (~+340 MORE each, ~1700 items). That is not achievable at honest, non-redundant quality in one session, and **zh in particular structurally cannot reach it** — Mandarin has no conjugation morphology, so its in-quiz grammar-point space is finite; padding it to 430 would mean filler, which the guard forbids. New TOTALS after this pass: ja 438 (51%), ko 441 (52%), zh 426 (50%), de 450 (53%), ru 431 (50%) — a genuine lift from ~46–47%, but NOT at 90%. The honest remaining path is a much larger, natively-reviewed grammar-authoring effort (and, for de/ru, no verbecc-style engine exists — verbecc covers only Romance). All new gram is AI-authored, PENDING native review (the #41 flag surfaces it). Uncommitted on dev; rolls into v3.0.0 — no version bump.",
      "(K cont. 2026-07-21) GRAM BATCH 2 — a second fresh, non-overlapping round on the four tracks with the most grammar space left, plus a smaller zh top-up toward its ceiling: de +32 (→134: genitive prepositions trotz/während, indirect ob/wo questions, nachdem/seitdem, damit vs um…zu, da-/wo-compounds, entweder…oder / nicht nur…sondern auch, lassen, nominalized zum+Inf), ru +32 (→125: age dative, instrumental of time, negative pronouns никто/ничего + double negative, -то vs -нибудь, себя, synthetic comparative + genitive, position verbs лежать/стоять, за/под/перед/между + case, каждый/весь, назад, давай(те), ли, через), ja +31 (→130: transitivity pairs, てある, のに, し, ばかり, しか…ない, ように vs ために, はず/べき/つもり, かもしれない/でしょう, ないで, まま, とき/前に/後で/ところ, quotation と, みたい/そうだ, ~がる, より/ほど), ko +31 (→132: -는 것/-기 nominalizers, past/present/future relative clauses, -아어도, (이)나/-거나, -(으)ㄹ까요/-(으)ㅂ시다, -네요/-잖아요, -게 하다, -아어지다, 만큼/처럼/밖에/마다, -(으)ㄹ 때/-기 전에/-(으)ㄴ 후에/-는 동안/-자마자, 드리다, -(으)ㄴ 지, -았었으면 좋겠다, -기로 하다, -(으)면서, -(으)려면, retrospective -던), zh +16 (→102: 有没有/是不是 questions, 太…了/快…了, 也 placement, 除了/连…都, the three de 得/的/地, 会 prediction, 多+adj, 有点儿 vs 一点儿, 又…又/一边…一边, 从来没). All central-validated + dedup vs existing + batch 1 (one de case-insensitive option collision + one garbled zh option caught & fixed); node --check clean on all five. **NEW TOTALS after both gram rounds:** ja 469 (55%), ko 472 (55%), zh 442 (52%), de 482 (56%), ru 463 (54%) — up from ~46–47% at the start of the run; gram roughly TRIPLED per track (from 55–62 to 100–134). **STILL below 90%** — the shortfall stands and is unchanged in nature: reaching it needs gram ≈ 430 each (~+300 more), zh cannot get there structurally, and de/ru/ja/ko would need a large natively-reviewed push (no verbecc engine for de/ru). This second round pushed as far as genuine, non-redundant grammar points allowed without padding. Uncommitted on dev; rolls into v3.0.0 — no version bump.",
      "(L 2026-07-21) #69 wrongNote BACKFILL — first + highest-value slice. Backfilled the 365 verbecc-generated es-Spain verbo drills (item J) with BOTH a general `wrongNote` and per-option `distractorNotes`, all mechanically DERIVED (not hand-guessed) and therefore correct: for every wrong option the note names exactly what it is — e.g. {'hablas': 'the tú form', 'habla': 'the él/ella/usted form', 'hablamos': 'the nosotros form'} — computed by matching each distractor against verbecc's full conjugation table for that verb (same-tense other-person first, neighbouring-tense fallback). The general wrongNote tells the learner to match the ending to BOTH subject and tense. Implemented by extending the J generator (label_form + build_notes), regenerating deterministically (verified the 365 prompts/options are IDENTICAL to what's already on dev), and SURGICALLY replacing just that block (the 152 hand-authored originals untouched). distractorNotes are keyed by option TEXT so they survive shuffleOptions (the engine reads q[7]); validated: keys ⊆ options, correct option never noted, wrongNote en+es present → 0 problems; node --check clean. Then EXTENDED to the 152 hand-authored es-Spain verbo ORIGINALS by reverse-lookup: extract each original's char-span from the file, parse its verb from the '(inf)' in the prompt, build verbecc's full conjugation table for that verb, and label each distractor by matching it back (person(s) in the correct answer's tense; else person+tense; else a clean generic note for the ~13% idiomatic/reflexive forms that don't map). 456 distractor notes generated for the originals — 398 specifically labeled, 58 generic — inserted SURGICALLY before each original item's closing bracket (originals' formatting/comments preserved). RESULT: es-Spain verbo is now 517/517 = 100% wrongNote-covered (validate-wrongnotes.mjs: esSpain curated 517/771 = 67%; the remaining 254 are vocab 127 + trad 127). node --check clean; 0 shape problems. REMAINING backfill (flagged): the 5 recent tracks' gram/vocab/trad and esSpain vocab/trad — mostly lower-value (vocab/trad distractors are other words/meanings, not confusable forms) or item-specific authoring. The conjugation-drill category (the highest-value target for wrongNotes) is now COMPLETE. Uncommitted on dev; rolls into v3.0.0 — no version bump.",
      "(L cont. 2026-07-21) #69 GRAM wrongNote backfill — the five recent tracks' gram categories, now 100% covered. Authored an item-specific bilingual `wrongNote` {en,es} for EVERY gram item across all five: de 134, ru 125, ja 130, ko 132, zh 102 = 623 notes. Each note is a concise 'Heads up' nudge that names the correct form and states the one-line rule (e.g. de #1 'Mann is the direct object, so masculine der shifts to accusative den → Ich sehe den Mann'), grounded in — and condensed from — the item's own already-authored bilingual `explain`, so the nudges stay faithful rather than invented. These gram items don't get per-option `distractorNotes` (unlike the es-Spain verbo drills, whose distractors are confusable conjugations mechanically labelable by person/tense): a gram item's wrong options are heterogeneous (wrong particle vs wrong case vs wrong word order), so a single well-aimed wrongNote pointing at the correct rule is the right unit. Method: extracted each track's gram array by balanced-bracket parse + literal-eval (pulling prompt/options/correctIdx/level/explain), hand-authored the 623 notes indexed to gram order, then SURGICALLY inserted `, {wrongNote}` as slot 7 before each item's closing bracket (last-to-first so indices stay valid) — no re-serialization, so slots 0–6 stay byte-identical. Deep verification: for all five tracks, the file OUTSIDE the gram array is byte-identical to before, every gram item's slots 0–6 are byte-identical, correctIdx still 0, and all 623 notes have non-empty en+es → ALL CHECKS PASS; node --check clean on all five. The engine already reads q[7] (item L wiring), so these render as the soft 'Heads up' note on a wrong pick with no further engine change. RESULT: gram wrongNote coverage for the five recent tracks goes 0% → 100%. REMAINING #69 backfill (flagged, lower-value): the five tracks' vocab/trad and esSpain vocab/trad — vocab/trad distractors are other words/meanings rather than confusable forms, so the payoff is smaller. All gram wrongNotes are AI-authored, PENDING native review (the #41 flag surfaces the track). Uncommitted on dev; rolls into v3.0.0 — no version bump.",
      "(M 2026-07-21) RUSSIAN GRAMMAR ENGINE — first non-Romance morphology engine; ru gram 125 → 490 (+365). Answers Sean's 'build the different engines' direction (see claude/squirrelingo_grammar_engines_plan.md): rather than hand-author toward 90% (the shortfall flagged in K), generated the drills with **pymorphy3** (Russian/Ukrainian morphological analyzer + inflection generator) — the exact verbecc-analog for Russian, so EVERY form is library-verified, not hand-inflected. Built as the reusable harness the plan describes (lexicon → `inflect(lemma,features)` → carrier templates → same-paradigm confusable distractors → mechanical bilingual distractorNotes + explain → CEFR band → validate → splice), deterministic (no RNG). Generator committed at `scripts/grammar-engines/ru_pymorphy3_gen.py` (dev tool; `pip install pymorphy3`). Coverage: 6-case noun declension under real governors (accusative object, genitive of negation/possession, dative recipient, instrumental after интересоваться/с, prepositional after о/в, к+dat, из/с government, motion-в+acc vs location-в+prep), verb person in the present, past-tense gender/number agreement, perfective future by person, imperative, adjective agreement (all genders + plural), plus C1/C2 tiers: profession/predicate instrumental after стать, genitive plural after много, genitive singular after 2/3/4, and the aspect rule (imperfective infinitive after начать). Each drill: cloze with the base-form cue in parens (e.g. 'Я вижу ___ (книга).'), correct form option[0] (correctIdx 0), 3 same-lemma other-paradigm distractors, bilingual explain, CEFR level, promptNative{en}, and a slot-7 wrongNote + **3 mechanically-derived distractorNotes** labeling each wrong option exactly ('the genitive form' / 'the ты (you) form' / 'the perfective infinitive'). Central validation → 0 problems (blank present, 4 distinct non-blank options, correctIdx 0, bilingual explain, valid CEFR, promptNative, distractorNotes keys ⊆ distractors & correct never noted); dedup vs the existing 125 + within-batch (NFC/ё-folded) → 0 collisions. Surgical splice appended after the existing 125 (which stay byte-identical, incl. their L-cont wrongNotes); node --check clean; deep-verify: file outside gram byte-identical, first 125 items unchanged, gram now 490 all 8-slot, full spread A1 23 / A2 145 / B1 177 / B2 81 / C1 45 / C2 19. NEW ru TOTAL: vocab 134 / gram 490 / trad 125 / fono 79 = 828 = **97%** (from 54%) — clears the ≥90% bar the K shortfall flagged, WITHOUT padding (each drill is a distinct lemma×paradigm-cell, engine-verified). PENDING native review (naturalness/register; forms are library-correct but not auto-natural — a few carriers like 'Каждый день я люблю' are grammatical-but-plain). The harness generalizes: Ukrainian rides pymorphy3 next; ja/ko have off-the-shelf conjugators; de a rule-table; zh stays the structural exception (no morphology). Uncommitted on dev; rolls into v3.0.0 — no version bump.",
      "(N 2026-07-21) JAPANESE + KOREAN GRAMMAR ENGINES — the 2nd & 3rd per-language engines (after ru/pymorphy3, item M). ja gram 130 → 484 (+354); ko gram 132 → 494 (+362). Both follow the reusable harness from claude/squirrelingo_grammar_engines_plan.md (tiered lexicon w/ en+es glosses → engine form(lemma,cell) → cloze carrier w/ base-form cue in 〔〕 → same-lemma confusable distractors → mechanically-derived bilingual distractorNotes + explain → CEFR band → dedup vs existing+within-batch → central validate → surgical splice APPENDED after existing gram), deterministic (no RNG). JAPANESE engine: japanese-verb-conjugator-v2 (pip) for verbs + a regular rule-table for i-adjectives + templated particle/copula drills. 47-verb × 18-cell grid (godan/ichidan/irregular; potential/passive/causative restricted to godan so potential≠passive; kanji-output forms like する-potential 出来る auto-dropped): polite present/past/neg, plain past/neg, te+ください, potential, passive, causative, causative-passive (composed), plain & polite volitional, -ba, -tara, imperative, prohibitive; i-adj past/neg/pastneg/-kute/-ku; 16 particle + 6 copula/na drills. Engine emits KANA only → mechanically romanized (wapuro Hepburn, macron-free per track standard) by NEW ja_romaji.py (battery-verified). Committed scripts/grammar-engines/ja_conjugator_gen.py + ja_romaji.py; `pip install japanese-verb-conjugator-v2`. KOREAN engine: max-christian/korean_conjugation (AGPL-3.0, 2010, Python-2) — NOT vendored (AGPL); py3-ported into a git-ignored scripts/grammar-engines/ko_engine/ (lib2to3 + unicode→str + de-relativize imports; exact steps in the generator header, guarded by a new .gitignore line). 40-verb + 22-adjective grid across 14 cells: polite/casual/formal present, polite/formal past, future -(으)ㄹ 거예요, honorific -(으)세요, -고, -(으)면, formal propositive -읍시다, nominal -(으)ㅁ, formal intention -겠습니다, formal present & past questions -습니까?/-었습니까? — ALL ㅂ/ㄷ/ㅅ/르/ㄹ/ㅎ irregulars library-verified (듣→들어, 돕→도와, 짓→지어, 부르→불러, 팔→팝니다); irregular stems front-loaded in the lexicon so per-cell caps include them. Particle allomorphs (은/는, 이/가, 을/를, 과/와) derived MECHANICALLY from 받침 via hangeul.padchim, the wrong allomorph included as a labeled distractor. Revised Romanization via NEW ko_romaji.py = korean-romanizer + a nasalization (p/k/t before n/m) & lateralization (ㄹㄹ→ll) post-processor, battery-verified 36/36 against known track romanizations (합니다 hamnida, 불러요 bulleoyo, 먹었습니다 meogeotseumnida…). Committed scripts/grammar-engines/ko_conjugation_gen.py + ko_romaji.py; `pip install korean-romanizer`. VALIDATION both tracks: central validator → 0 problems (8-slot, correctIdx 0, 4 distinct non-blank romanized options, bilingual explain, valid CEFR, slot5 null, promptNative present, wrongNote + 3 distractorNotes each with keys ⊆ distractors & the correct option never noted); dedup → 0 collisions. node --check clean; deep-verify: file OUTSIDE gram byte-identical, pre-existing 130 (ja) / 132 (ko) gram items byte-identical, gram now 484/494 all 8-slot correctIdx 0. Spreads — ja A1 48 / A2 129 / B1 140 / B2 75 / C1 63 / C2 29; ko A1 43 / A2 131 / B1 182 / B2 63 / C1 52 / C2 23. NEW TOTALS: ja vocab 134 / gram 484 / trad 126 / fono 79 = 823 = 96% (from 55%); ko vocab 134 / gram 494 / trad 127 / fono 79 = 834 = 98% (from 55%) — both clear ≥90% WITHOUT padding (each drill a distinct lemma×paradigm-cell, engine-verified). PENDING native review (forms library-correct but not auto-natural — carriers/register need a native pass; #41 flag surfaces both tracks; no ja/ko reviewer lined up). Remaining engines: German (rule-table we build), Ukrainian (rides pymorphy3), Chinese (structural exception — no inflectional morphology). Uncommitted on dev; rolls into v3.0.0 — no version bump.",
      "(O 2026-07-21) GERMAN GRAMMAR ENGINE — the 4th per-language engine and the FIRST rule-table one (ru=pymorphy3 M, ja/ko=off-the-shelf conjugators N). de gram 134 → 494 (+360). German has no clean permissively-licensed inflection GENERATOR, so the engine is a hand-authored RULE-TABLE we build (the plan's §3/§6 'German = rule-table') — fully committable, NO license wrinkle (unlike ko's AGPL engine). Committed scripts/grammar-engines/de_rules_gen.py (self-contained; deterministic, no RNG; ~660 lines). Two data classes per the plan: (a) RULE TABLES for everything systematic — der/ein-word/der-word article paradigms (case×gender×number), the strong/weak/mixed adjective-ending tables, weak-verb present/Präteritum/Partizip rules — encoded verbatim from the standard Duden/Hammer paradigm tables; (b) a CURATED table for everything NOT rule-derivable — strong/mixed verb principal parts (present du/er ablaut, Präteritum, Partizip II, sein-vs-haben aux, one-word Konjunktiv II) for 61 verbs, and noun gender/nominative-plural/genitive-sg/weak-oblique for 49 nouns. No strong participle or plural is guessed. The curated noun genders+plurals are VERIFIED at generate time against the `german-nouns` pip package (Wiktionary data) via `--verify` → all match (Milch's contested mass-noun plural aligned to the oracle; never emitted). Coverage by block: definite-article case declension (acc/dat/gen, the cells that actually change from nom, with the nominative form shown in-parens as gender scaffolding) 37; ein-word (ein/kein/mein) 11; adjective endings weak/mixed/strong across cases+genders+plural 66; verb Präsens by person (6 persons, ablaut in du/er) 64; Perfekt participle + sein/haben aux choice 42; Präteritum by person 28; Plusquamperfekt 10; Futur I 12; Konjunktiv II (one-word for strong+modals, würde+inf for weak) 12; two-way prepositions (acc motion vs dat location) 19; comparative/superlative + 'so…wie' equality 18; plural formation (curated) 20; modal+bare-infinitive, personal-pronoun case, reflexive/dative pronouns, dative verbs 17; der-words (dieser/jeder/welcher) + kein-plural 8. Harness identical to ru/ja/ko: tiered lexicon (en+es glosses) → inflect via rules+curated tables → cloze carrier with a base-form cue in parens (e.g. 'Ich sehe ___ Mann. (der Mann)' / 'Ich ___ heute. (arbeiten)') → same-paradigm confusable distractors (same noun other case; same verb other person/tense; wrong adjective ending) → mechanically-derived bilingual distractorNotes labeling each wrong option exactly ('the dative (indirect-object) form' / 'the du (you sing.) form' / 'the -en ending (weak oblique, dative or plural)') → CEFR band → dedup vs existing 134 + within-batch → central validate → surgical splice APPENDED after existing gram. German conventions honored: Latin script NO romanization; dictionary noun capitalization PRESERVED (cap() is a no-op here — sentence-initial article options are the only capitalization); drills land in the EXISTING gram category (no new per-case category). #89 chips: 166 chip entries emitted to deForEnTags.js RAW for the conjugation-bearing items — German inflects for person for real, so the person chip names the ACTUAL subject (ich/du/er/wir/ihr/sie), matching the existing de tense-chip convention (NOT a repurposed register as in ja/ko). VALIDATION: central validator → 0 problems (8-slot, correctIdx 0, 4 distinct non-blank options, bilingual explain, valid CEFR, slot5 null, promptNative present, wrongNote + distractorNotes with keys ⊆ distractors & correct never noted); dedup vs existing+within-batch → 0 collisions. Deep-verify after splice: file OUTSIDE the gram array byte-identical, all pre-existing 134 gram items byte-identical, gram now 494 all 8-slot correctIdx 0; node --check clean on deForEn.js AND deForEnTags.js; tagFor() re-checked at runtime (verb items return the chip, declension items return null). Total gram level spread A1 19 / A2 138 / B1 138 / B2 142 / C1 47 / C2 10. NEW de TOTAL: vocab 134 / gram 494 / trad 135 / fono 79 = 842 = 98% (from 56%) — clears ≥90% WITHOUT padding (each drill a distinct lemma×paradigm-cell, rule/table-verified). PENDING native review (forms are table/library-correct but not auto-natural — carrier naturalness/register need a native pass; #41 flag surfaces the track; no de reviewer lined up). Per §6/§8, next is the Korean permissive rule-table RE-IMPLEMENTATION (reusing this German rule-table pattern, with the AGPL ko engine as a form-for-form correctness oracle) — pure licensing cleanup, output unchanged; then Chinese (capped template generator, no morphology). Uncommitted on dev; rolls into v3.0.0 — no version bump.",
      "(P 2026-07-21) KOREAN PERMISSIVE RULE-TABLE REWRITE — §6 step 4 / §8 licensing cleanup, now DONE. Re-implemented the Korean conjugation engine as a hand-authored PERMISSIVE rule-table (scripts/grammar-engines/ko_rules_gen.py), retiring the AGPL max-christian/korean_conjugation dependency from the toolchain. NOT a content change: the shipped ko gram block (362 engine items; gram total 494) is BYTE-IDENTICAL to what the AGPL generator produced — the pipeline (same 40-verb + 22-adjective lexicon, 14 cells, carrier templates, distractor logic, CEFR bands, 받침-derived particle allomorphs 은/는·이/가·을/를·과/와) is unchanged; only the conjugator behind form() was swapped. The new conjugator is CLEAN-ROOM: built from the public Unicode Hangul composition algorithm + standard published conjugation rules (own decompose/compose + a 받침 padchim helper — no hangeul.py copied), with curated irregular-stem lists — ㅂ (돕→도와, 춥→추워), ㄷ (듣→들어), ㅅ (짓→지어), 르 (부르→불러), ㄹ-stem (팔→팝니다/파세요), ㅎ (그렇→그래; rule present, none in this lexicon), 하다→해, plus the -아/어 vowel-harmony/contraction rules. CORRECTNESS METHOD: the AGPL engine was py3-ported into a THROWAWAY, gitignored oracle (never vendored, never on the shipped path) and run over the FULL 62-lemma × 14-cell grid (868 forms); the rule-table was diffed form-for-form against it and iterated to a 100% match (0/868 mismatches). The generator was then run STANDALONE with no AGPL module importable and reproduced the shipped 362-item block byte-for-byte. VALIDATION: oracle diff 100% clean; regenerated gram items byte-identical to dev; node --check clean on koForEn.js; the ONLY non-item diff is the provenance comment at koForEn.js gram line 464 (now names ko_rules_gen.py instead of the retired AGPL engine — a documented, justified diff). §8 licensing is now FULLY CLEAN: no AGPL code anywhere in dev or the repo; the oracle and any ko_engine/ on dev machines can be scrubbed. The old AGPL-dependent generator ko_conjugation_gen.py is superseded and can be git-removed. After Korean, the only current-track engine item left is Chinese (capped template generator). No version bump — stays 2.33.0-beta.15.",
      "(Q 2026-07-21) CHINESE CAPPED TEMPLATE GENERATOR — §6 step 5, the LAST current-track engine item; the grammar-engine program is now complete (ru/ja/ko/de engines + zh capped template gen). zh gram 102 → 249 (+147). Chinese is the HONEST STRUCTURAL EXCEPTION: Mandarin has no inflectional morphology, so there is no conjugation engine and zh CANNOT reach the ≥90% bar — its number comes from pattern×vocab BREADTH, not conjugation, and it was NOT padded to chase 430 (the guardrail). NEW scripts/grammar-engines/zh_template_gen.py — a hand-authored PATTERN/TEMPLATE library × curated FILLER lexicons, reusing the SAME proven harness as the four inflected engines (over-generate → dedup vs the full existing zh gram + within-batch → CEFR band A1–C2 → same-pattern confusable distractors → mechanical bilingual distractorNotes (#69) → central validate → surgical splice APPENDED after existing gram), deterministic (no RNG). TWO generation modes: (a) MECHANICAL — the measure-word family (37 items): a curated noun↔classifier list × a carrier frame (我有一/我要一 ___ N), with 一-sandhi (yì before tone 1/2/3, yí before tone 4) applied deterministically, options built from a classifier metadata table, and 3 mechanically-derived distractorNotes per item labeling each wrong classifier — exactly the ko_rules_gen 받침-particle-section pattern. (b) CURATED — 110 authored, textbook-standard, non-redundant points across A1–C2: resultative complements (到/好/错/会/住/成/掉/干净/清楚/饱), compound directionals (过来/过去/起来/下去/回来/回去/上来/进来), potentials (买不起/来不及/搬不动/睡不着/受不了/看得见), frequency/duration (次/遍/下/顿/一会儿 + object-repeat duration), modals (应该/得děi/可以/要/能/愿意/敢 + 会-vs-能), adverbs/scope (都/再/又/还/只/一直/一起/一定/差不多/差点儿/终于/其实/大概/到底), coverbs (给/跟/对/为/为了/替/离/往/向/用/关于/按照/在/朝), question words (几/多少/怎么/怎么样/为什么/什么时候/哪儿/谁/多长时间/多远), causatives (让/叫/使/请 — distinct from the existing 让/叫 PASSIVE), new conjunction pairs (不但…而且/只要…就/只有…才/越…越/不是…就是/不管…都/即使…也), aspect nuances (起来 inception / 下去 continuative / 正在…呢 / 着 existential / 来着 recent-past / 要…了 imminent), and numerals/reduplication/structural (两-vs-二/半/第/多-odd/来-approx/AA的/AABB/V一V/每/们/的-relative-clause/之一/各/所). Each curated item carries native script (汉字) + toned pinyin, a bilingual explain, CEFR band, promptNative{en}, and a wrongNote (matching the existing zh gram convention; distractorNotes are scoped to the mechanical measure-word family, as ko scopes them). VALIDATION: central validator → 0 problems (8-slot, correctIdx 0, 4 distinct non-blank options, bilingual explain, valid CEFR, slot5 null, promptNative present, wrongNote bilingual, distractorNote keys ⊆ distractors); dedup vs the full existing 102 (prompt AND correct-answer normalized) + within-batch → 0 collisions; 249/249 unique prompts. Deep-verify after splice: file OUTSIDE the gram array byte-identical, all pre-existing 102 gram items byte-identical (only a separator comma added after the last one), gram now 249 all 8-slot correctIdx 0; node --check clean on zhForEn.js. Full gram CEFR spread A1 31 / A2 75 / B1 74 / B2 50 / C1 11 / C2 8. NEW zh TOTAL: vocab 134 / gram 249 / trad 127 / fono 79 = 589 = ~69% (from 442 = 52%) — a genuine breadth lift; zh REMAINS the accepted sub-90% structural exception, reported honestly (no padding). zhForEnTags.js unchanged (Mandarin has no tense/person chips — themes only). zh_template_gen.py lands UNTRACKED on dev like the other four generators (the whole scripts/grammar-engines/ folder rolls into the v3.0.0 git add). AI-authored → PENDING native review (#41 surfaces it; forms/patterns structurally checkable but naturalness/register need a zh native pass; no zh reviewer lined up). With this, the current-track grammar-engine program is FINISHED (ru pymorphy3 / ja+ko conjugators / de rule-table / ko permissive rewrite / zh capped template gen); Ukrainian rides pymorphy3 whenever it lands. Uncommitted on dev; rolls into v3.0.0 — no version bump.",
    ],
  },
  {
    version: "2.33.0-beta.14",
    date: "2026-07-20",
    notes: [
      "CJK CONTENT DEPTH PASS (ja/ko/zh) + Alphabet-page restyle. (1) CONTENT: brought jaForEn/koForEn/zhForEn toward the Spanish visible-depth standard via an orchestrated authoring pass — parallel generation subagents per language×category×CEFR-band, then an adversarial native-level verify pass per language×category, then programmatic dedup + splice + validation. New authored items spliced into each track’s BANK (vocab/gram/trad) and FONO_BANK: ja +46 vocab / +37 gram / +39 trad / +25 fono; ko +47 / +38 / +41 / +25; zh +48 / +38 / +37 / +25 (~446 items). New per-track totals: ja vocab 72 / gram 60 / trad 57 / fono 37 (from 26/23/18/12); ko 72 / 62 / 59 / 37 (from 25/24/18/12); zh 72 / 56 / 53 / 35 (from 24/18/16/10) — even A1–C2 spread. Conventions matched exactly per file: ja macron-free wapuro Hepburn + はどういう意味 frame; ko Revised Romanization + batchim-agreeing 은/는 recognition particle + fono sound-change hints; zh pinyin tone diacritics + 是什么意思 frame + citation-tone headwords. gram kept as the mixed structural category (NOT split into a verbo cat) — ja/ko particles+politeness+conjugation, zh measure words / aspect (了过着) / 把被 / complements, no invented conjugation. Correct-answer-first / correctIdx 0 preserved (engine shuffles at runtime). Dedup dropped cross-agent collisions including idiom-level trad duplicates (ja 5 / ko 2 / zh 7 by normalized headword). Verify pass caught few defects (ja: 1 gram たら/と ambiguity replaced, 1 exact-duplicate gram dropped, 1 trad 猫に小判 ambiguity distractor swapped; ko/zh: 0) — same-model verification, NOT a substitute for human native review. Validation: esbuild parse of all three ESM tracks + literal-extract count/dup/correctIdx checks; 0 schema problems. (2) UI: app/script/[trackId]/page.js restyled to match the Spanish learn/grammar pages — added the themed animated background (TRACK_THEMES + animatedBackgroundStyle), replaced the transparent borderless back button (blended into the page) with the standard pink bordered back-pill, and added the missing language header (trackDisplayName as an h1 + the writing-system name as a subtitle) above the mode toggles; esbuild JSX parse clean. NOT deployed — written uncommitted on dev. PENDING native review (established gate): all new ja/ko/zh content is AI-authored + internally verified, flagged pending human native review before real-prod (no ja/ko/zh reviewers lined up yet). NOT done this pass, the where-applicable follow-ons: the theme/tense TAG layer for ja/ko/zh, and the Grammar Gym — the gym’s person×tense schema is built for Romance conjugation and does not fit CJK (Mandarin doesn’t conjugate; ja/ko conjugate by form/politeness, not person), so it needs a schema decision before authoring.",
    ],
  },
  {
    version: "2.33.0-beta.13",
    date: "2026-07-20",
    notes: [
      "Spain Spanish DEPTH BUILD (#38 esSpain parity) \u2014 the last Romance gap, the ~40-agent depth-workflow effort, now done (orchestrated as 7 parallel category\u00d7band subagents + a 5-agent adversarial native-level verify pass, not the full gated workflow). Brings esSpainForEn from shallow (vocab 22 / verbo 18 / trad 14 / fono 9) to full depth: vocab 127, verbo 152 (authored; feeds the later Phase-1 person-swap \u00d7~3.3 + Phase-2 tense-swap to ~500), trad 127, fono 79 \u2014 matching esForEn\u2019s 134/\u2026/127/79 standard. Method: adapted esForEn as the base but Peninsularized (coche/m\u00f3vil/zumo/ordenador/patatas/gafas/melocot\u00f3n/conducir/piso/vale/t\u00edo/guay), verbo AUTHORED FRESH (no vosotros existed in the LatAm source) with heavy vosotros coverage (~57%: present, preterite, commands -ad/-ed/-id + reflexive drop-d, negative subj, present + advanced subjunctive -\u00e9is/-\u00e1is), Spain present-perfect-for-today register, and full A1\u2013C2 subjunctive/conditional/compound range; trad = Peninsular idioms/refranes (es la leche, me importa un pimiento, en el quinto pino, a buenas horas mangas verdes) + universals; fono re-authored for distinci\u00f3n (c/z=\u201cth\u201d), ceceo awareness, strong j (kh), relaxed final -d, vosotros by ear, and the seseo-merged minimal pairs distinci\u00f3n keeps audible (plaza/playa, casa/caza, cocer/coser). NEW FILE data/tracks/esSpainForEnTags.js mirrors esForEnTags exactly (THEMES + T tense defs + P person defs, with vosotros ADDED to P and presPerfect\u2019s why noting the Spain today-register); RAW keyed by prompt text; wired into esSpainForEn.js (import { THEMES, tagFor }; themes/tagFor on the track object). All 152 verbo items tense-tagged (150 with person), vocab 112/127 & trad 86/127 themed (idioms often theme-neutral, as in esForEn). Options keep correct-answer-first / correctIdx 0 (engine shuffleOptions randomizes at runtime). VERIFY pass caught 12 genuine defects, all fixed: 7 conditional-perfect apodosis items where the -ra pluperfect-subjunctive distractor is a RAE-sanctioned second correct answer (swapped for clearly-wrong future-perfect indicative distractors), 1 \u201cSupongo que\u2026\u201d indicative-vs-future-perfect ambiguity, 1 \u201cme extra\u00f1a que\u2026 antes\u201d imperf-subj-also-valid, the tirar/echar la casa por la ventana idiom (both RAE-valid \u2192 botar swapped in), and 2 false phonetics notes (spurious rr-trill on \u2018coraz\u00f3n\u2019; \u2018quinto\u2019/\u2018cinto\u2019 mislabeled as th-vs-s). Validation: node --check both files; runtime import \u2014 counts confirmed, 0 structural errors, no dup prompts, fono identify[0]===text. STILL PENDING native review (#41 / 41b, no confirmed peninsular reviewer yet): all depth content + the fresh vosotros/subjunctive verbo (flag prominently \u2014 authored, not human-checked) + the tense/person tags. NOT the Word Bank (shipped beta.12) and NOT the Phase-1/2 variant re-run (deferred until Phase-1 review returns). NOT deployed \u2014 written uncommitted on dev.",
    ],
  },
  {
    version: "2.33.0-beta.12",
    date: "2026-07-20",
    notes: [
      "Spain Spanish (esSpainForEn) — the two BOUNDED parity pieces (Sean's call: bounded first, defer the full depth build). (1) WORD BANK: data/vocab/esSpainWords.js, 609 words adapted from esLatAmWords by a subagent — the backbone was already largely pan-Hispanic so only 3 genuine Peninsular swaps (boleto→billete, jalar→tirar, pastel→tarta) plus ~9 distinción (/θ/) pronunciation notes and LatAm-vs-Spain contrast notes (138 notes total). Wired into esSpainForEn.js like the others (import buildFrequencyBank + WORDS; fvocab CATS entry 'Palabras' #7BE495; bank {...BANK, fvocab: buildFrequencyBank(WORDS,{seed:20260720})} — uses the DEFAULT Spanish formulas, no custom FORMULAS needed; wbCatId 'fvocab'). fvocab = 609 questions, 0 thin/bad. (2) GRAMMAR GYM: data/grammar/esSpainForEn.js generated via gen_grammar_gym.py (new es config) — 11 verbs (hablar/comer/vivir/ser/estar/ir/tener/hacer/querer/poder/pedir) × 6 tenses × 6 persons INCLUDING vosotros (yo/tú/él/nosotros/vosotros/ellos), grouped regular/serestar/irregular/stem with the stem-note tweaked for vosotros. Spanish verbecc is reliable (unlike pt) — all forms verified correct incl. vosotros (sois/vais/tenéis/habláis) and stem-changers. Registered 'es-spain-for-en' in data/grammar/index.js. Tooling: added 'es' to vb.py PRON/COMPL (safe generalization; benefits future es variant-expansion) and an es config + optional track-filter arg to gen_grammar_gym.py. Verified: node --check all; node import of the esSpain track (cats vocab/fvocab/verbo/trad/fono, wbCatId, fvocab 609) + grammar module (contract satisfied, 6 persons). STILL PENDING for full esSpain parity: the depth content build (vocab 22→~130, verbo 18→~500 with vosotros + Phase-1/2 variants, trad 14→~130, fono 0→~79 with distinción) + tags — the ~40-agent depth-workflow effort, deferred. NOT deployed — uncommitted on dev.",
    ],
  },
  {
    version: "2.33.0-beta.11",
    date: "2026-07-20",
    notes: [
      "Grammar parity with Spanish, two parts. (1) GRAMMAR GYM (#90) ported to fr/frCa/it/ptBr/ptPt — previously Spanish-only. New data/grammar/{track}.js modules (same schema as esForEn.js): 11 verbs × 6 tenses × 5–6 persons, grouped (regular / auxiliaries or ser-estar / irregular / modal), with authored intro/tense-why/group-notes. Conjugation FORMS from verbecc + targeted corrections: dropped verbecc archaic alternates (Italian 'faccio/fo'→faccio, 'voglio/vò'→voglio), normalized être/essere-aux compound past participles to a consistent masculine (verbecc mixed genders — je suis allée next to il est allé), fixed verbecc-pt errors (ir present 'imos'→'vamos'), applied pt-PT -ámos vs pt-BR -amos 1pl preterite spelling, modernized 'vêem'→'veem'. Generator committed at docs/variant-expansion/pipeline/gen_grammar_gym.py. Registered all five in data/grammar/index.js. Generalized app/grammar/[trackId]/page.js: the two hardcoded person-label refs p.es / item.person.es → p[gym.targetLang] (backward-compatible; Spanish targetLang='es'). The grammar link auto-surfaces via ModeToggle's grammarLabel when grammarForTrack(id) is non-null. buildDrill/progress in lib/grammarGym.js were already language-neutral — unchanged. AI-generated forms flagged for native review. (2) GRAM CATEGORY RETIRED on the 5 tracks to match Spanish's category set (Spanish has no gram category). The leftover gram grab-bag (11–17 items/track) was split: verb-conjugation drills + verb-tense-trivia → verbo, everything else (articles, agreement, prepositions, pronouns, relatives, Québécois register) → vocab; gram removed from BANK and CATS. Counts now: fr vocab 152/verbo 689, frCa 131/695, it 137/664, ptBr 133/785, ptPt 135/702. All five now expose cats vocab/verbo/trad/fono/fvocab — identical to esForEn. Verified: node --check on all tracks + page + index; node import of all 5 tracks (gram absent from cats/bank, counts match) and all 5 grammar modules (page contract satisfied: persons carry targetLang key, tenses have why, every verb has forms for every tense/person, 0 thin drill cells). `gameEngine.js` unchanged. NOT deployed — uncommitted on dev. (esSpainForEn still untouched — full-parity pass is the open follow-on.)",
    ],
  },
  {
    version: "2.33.0-beta.10",
    date: "2026-07-20",
    notes: [
      "TWO workstreams (Sean opted into full scope). (1) WORD BANKS for fr/it/ptBr/ptPt — resolves the parked WB-pilot verdict toward curated-plus-Word-Bank as the standard. New frequency lists data/vocab/{fr,it,ptBr,ptPt}Words.js authored by 4 parallel subagents off the 609-word esLatAmWords backbone (same English glosses/pos/tier, translated with correct article+gender, dialect-appropriate forms, ~20-37% teaching notes), excluding each track's curated-deck words: fr 588, it 580, ptBr 572, ptPt 582 words. Wired each track like frCaForEn: import buildFrequencyBank + WORDS, per-language FORMULAS (FR_FORMULAS reused for fr; new IT_FORMULAS 'Come si dice…in italiano?', PT_FORMULAS 'Como se diz…em português?'), fvocab CATS entry (Mots/Parole/Palavras, #7BE495), bank:{...BANK, fvocab: buildFrequencyBank(WORDS,{seed:20260720,formulas})}, wbCatId:'fvocab'. buildFrequencyBank unchanged (language-neutral since the frCa pass). fvocab question counts = word counts (0 thin, 0 bad options). frCa already had its 636 Word Bank. (2) PHASE-2 TENSE-SWAP (BULK) on all 5 tracks — overrides the methodology's sample-only hold (Sean's call). Present-tense flexible depth items recast into past-compound / imperfect / future with a leading time-marker (Hier/Autrefois/Demain, Ieri/Una volta/Domani, Ontem/Antigamente/Amanhã), person held fixed, distractors = same verb+person across tenses. Per-track: fr 78, frCa 68, it 58, ptBr 87, ptPt 90 = 381 (from 21-30 present bases each × 3 tenses). Compound-past SKIPPED for être/essere-auxiliary verbs (past participle agrees with subject gender/number, which verbecc doesn't resolve from our pronoun cell — pt pretérito perfeito is synthetic so unaffected). Excludes already-time-marked, reflexive, impersonal, implied/ambiguous-subject. verbecc gate ON fr/frCa/it, OFF pt (same as Phase 1). IDs `// <code>-verb-<NNN>-t-<tenseKey>`. Verbo bank totals now: frForEn 608→686, frCaForEn 625→693, itForEn 598→656, ptBrForEn 692→779, ptPtForEn 607→697. New tooling committed: docs/variant-expansion/pipeline/{swap_phase2.py, apply_phase2.py} + word lists. Round-trip generated/{code}_depth_tenseswap.json; native packets review-packets/{code}-depth-tenseswap.xlsx (flagged: tense-swaps can read oddly for stative sentences — that's what review is for). `gameEngine.js` unchanged. Verified: node import of all 5 fully-wired tracks (verbo counts, fvocab counts, wbCatId, tags resolve, 0 bad fvocab), node --check all, structural checks on all 381 tense variants (4 unique options, valid ci, subject/person agreement, marker present, no dup prompts/vids). AI-authored → beta pre-review; native review (Word Bank words + tense-swaps) gates real-prod. NOT yet deployed — uncommitted on dev.",
    ],
  },
  {
    version: "2.33.0-beta.9",
    date: "2026-07-20",
    notes: [
      "Variant-expansion Phase 1 (person-swap) re-run against the NEW deep verbo banks — FINISHES the Romance set (Spanish did this in beta.3; the other five had only the migrated pre-depth variants). Per-track NEW variants: fr 463 (97 eligible bases), frCa 474 (100), it 457 (97), ptBr 513 (137), ptPt 427 (114) = 2,334 total. Verbo bank totals now: frForEn 145→608, frCaForEn 151→625, itForEn 141→598, ptBrForEn 179→692, ptPtForEn 180→607. Method: mechanical person-swap of pronoun-subject standard depth verbo items into the other subject persons, same sentence + tense; conjugations via verbecc; options = sibling person-forms in that tense; deduped vs the whole bank. Excluded (documented in the round-trip JSON skip counts): reflexive/progressive/impersonal, noun-subject/implied-subject, ambiguous two-clause subjects, and the 1st-person-singular cell of subjunctive items (coreference trap — 'espero que eu…' needs the infinitive). Portuguese verbecc gate OFF (verify_verbo:false; pt model unreliable) — pt forms are verbecc-generated but NOT gated; rely on generate + native review. fr/frCa/it forms verbecc-verified against the native-checked base answer. Stable IDs `// <code>-verb-<NNN>-p-<person>` (base depth id + -p-<person>; distinct from the migrated `-v-<NNN>-p-` namespace, so no collisions). New per-verb tags (grammar+person, themes inherited from base) appended to each <track>Tags.js. `gameEngine.js` unchanged (category-agnostic). Phase-1 tooling reconstructed from 00-methodology.md §6–9 and committed at docs/variant-expansion/pipeline/ (swap_phase1.py + apply_phase1.py) alongside the depth pipeline. Round-trip generated/{fr,frCa,it,ptBr,ptPt}_depth_variants.json; native-review packets review-packets/{fr,frCa,it,ptBr,ptPt}-depth-variants.xlsx. AI-authored → beta pre-review; native review gates real-prod promotion. Verified: node --check on all 10 track/tags files, structural checks (4 unique options, valid correctIndex, subject-pronoun/person agreement, no duplicate prompts/vids), verbo item counts match expected. NOT yet deployed — files written uncommitted to dev.",
    ],
  },
  {
    version: "2.33.0-beta.8",
    date: "2026-07-20",
    notes: [
      "Committed the generalized content-depth pipeline into the repo at docs/variant-expansion/pipeline/ (wf_depth.js, assemble_g.py, emit_g.py, deliv_g.py, vb.py, frdefs/itdefs/ptdefs.py, example configs, README) — previously it lived only in the ephemeral cloud session. Durable + reusable for future language depth passes (de/ru/ja/ko/zh). No app-code or content change; gameEngine and all tracks untouched. This release also served as the first end-to-end test of `npm run deploy dev` (prior beta.5–7 commits were done by hand, one step at a time); a tooling/doc-only change means the deploy-time TTS auto-sync maps to zero content tracks and does no synth (no API key needed).",
    ],
  },
  {
    version: "2.33.0-beta.7",
    date: "2026-07-20",
    notes: [
      "Romance depth rollout COMPLETE — ptBrForEn, ptPtForEn, frCaForEn brought to the Spanish standard in one batch (same generalized pipeline: wf_depth.js args-driven + assemble_g.py + emit_g.py + per-language config/defs). Results: ptBr vocab 24→127, verbo (NEW 'Verbos') 182 (141 depth + 38 migrated: 8 base + 30 variants, IDs preserved), gram 12, trad 16→113, fono 9→81, 306 tags. ptPt vocab 24→129, verbo (NEW 'Verbos') 180 (138 depth + 42 migrated), gram 11, trad 16→110, fono 9→81, 307 tags. frCa vocab 24→116, verbo (NEW 'Verbes') 151 (133 depth + 18 migrated), gram 17, trad 14→118, fono 9→76, 266 tags; its `fvocab` Word Bank preserved (bank:{...BANK,fvocab} — emitter matches any bank: line). New tag files ptBrForEnTags.js / ptPtForEnTags.js / frCaForEnTags.js. Generated by the ~44-agent per-(category×CEFR band) workflow + native-speaker adversarial verify. Portuguese verbecc gate DISABLED (verify_verbo:false) — verbecc's pt model is unreliable (flags correct 'vamos'/'comprámos', returns truncated stems); pt verbs rely on generate + native-verify. frCa/fr/it keep the verbecc gate. Index-style `correct` values ('0'-'3') some agents returned are resolved to option text in assemble_g. Regional distinctions honored: Brazilian (você, palatalization, 'estou comendo') vs European (tu, syllable-final s→/ʃ/, 'estou a comer', mesoclisis); Québécois vocabulary (piastre, gougounes, poutine, débarbouillette) + affrication phonetics. `gameEngine.js` unchanged (category-agnostic). ALL AI-authored + native-verified → beta pre-review; pt-BR/pt-PT/fr-CA native review gates real-prod. Packets docs/variant-expansion/review-packets/{ptBr,ptPt,frCa}-depth-review.xlsx; round-trip generated/{ptBr,ptPt,frCa}_depth_generated.json; refs {ptBr,ptPt,frCa}-depth-reference.md. OPERATIONAL NOTE: hit the account session usage limit mid-run (reset 01:30 UTC) which killed the verify agents on the first pass; recovered the cached generate output from the workflow journals, then resumed all three after the reset to run the verify pass (cached generate replayed free). Verified: node import of all 3 (+tags), 5 categories each, 0 malformed, 0 bad correctIndex, tags resolve, 0 malformed fono. This completes the Romance set (es/fr/frCa/it/ptBr/ptPt). Next: re-run variant-expansion Phase 1 against each new verbo base; then de/ru, then ja/ko/zh.",
    ],
  },
  {
    version: "2.33.0-beta.6",
    date: "2026-07-19",
    notes: [
      "Italian (itForEn) content-depth pass — 2nd Romance track after French, same generalized pipeline (wf_depth.js, args-driven; assemble_g.py + emit_g.py + config_it.json). Brought to the Spanish standard: vocab 23→129, NEW dedicated `verbo` category (\"Verbi\") at 141 (117 depth items + 24 migrated: 4 base drills + 20 person-variants, IDs preserved), gram 20→16 (verb drills moved to verbo), trad 14→104, fono 9→80. New `data/tracks/itForEnTags.js` (themes + per-verb tense/person, keyed by prompt text), 253 tagged. Generated by a ~44-agent workflow (per category×CEFR band A1–C2 + native-Italian adversarial verify). Post-processing: verbecc-verified simple-tense verb forms (dropped gerunds mislabeled as presente + strict reflexive checks; 16 verbo, 14 vocab, 29 trad, 1 fono dropped incl. dups), resolved index-style `correct` values some agents returned (\"0\"–\"3\" → option text; 60 vocab + 39 trad affected), deduped, stable IDs (it-vocab/verb/trad-NNN). `gameEngine.js` unchanged (category-agnostic). AI-authored → beta pre-review; it-IT native review gates real-prod. Packet docs/variant-expansion/review-packets/it-depth-review.xlsx; round-trip docs/variant-expansion/generated/it_depth_generated.json; notes docs/variant-expansion/it-depth-reference.md. Verified: node import of itForEn (+itForEnTags), 5 categories, 0 malformed, 0 bad correctIndex, 253 tag resolutions, 0 malformed fono. Workflow arg-handling hardened (accept string-or-object args). Next: ptBr → ptPt → frCa depth, then re-run variant-expansion against each new verbo base.",
    ],
  },
  {
    version: "2.33.0-beta.5",
    date: "2026-07-19",
    notes: [
      "REGRESSION FIX: the beta.4 commit (633c6e2 on dev) shipped the version bump + CHANGELOG but NOT the actual variant content — all five track files had reverted to pristine by the time `git add -A` ran, so the 115 person-swap variants were never committed (main was still on beta.3, so no beta tester received the empty release). This commit RESTORES the full variant content to all five tracks (frForEn/frCaForEn/itForEn/ptBrForEn/ptPtForEn) from the local source of record. Root cause of the revert unknown (an IDE revert or a stray checkout between the file write and the deploy commit); verify post-commit with `git show HEAD:data/tracks/frForEn.js | Select-String \"fr-v-\"`.",
      "French content-depth pass (frForEn) — pilot for the Romance depth rollout. Brought to the Spanish standard: vocab 24→139, NEW dedicated `verbo` category at 145 (124 depth items + 21 migrated: 4 base drills + 17 person-variants, IDs preserved), gram 20→16 (verb drills moved to verbo; non-verb grammar kept), trad 15→118, fono 8→76. New `data/tracks/frForEnTags.js` (mirrors esForEnTags: THEMES + per-verb tense/person, keyed by normalized prompt) wired via `import { THEMES, tagFor }` + `themes/tagFor` on the track; 300 items tagged. Generated by a ~44-agent workflow (one generator per category×CEFR band A1–C2 + a native-French adversarial verify stage). Post-processing (deterministic): verbecc-verified every simple-tense verb form (dropped 2 real tense-mislabels + a few over-strict reflexive checks; 9 verbo, 5 vocab, 14 trad, 4 fono dropped incl. dups), deduped vs the existing bank, assigned stable IDs (fr-vocab/verb/trad-NNN). `gameEngine.js` needed NO change (category-agnostic; verified). ALL AI-authored + internally native-verified → shipped to beta pre-review; fr-FR native review gates real-prod. Packet docs/variant-expansion/review-packets/fr-depth-review.xlsx; round-trip docs/variant-expansion/generated/fr_depth_generated.json; notes docs/variant-expansion/05-french-depth-reference.md. Verified: node import of frForEn (+frForEnTags), 5 categories, 0 malformed items, 0 bad correctIndex, 300 tag resolutions, 0 malformed fono. Next: fan out depth to it/ptBr/ptPt/frCa, then re-run variant-expansion against each new ~145-item verbo base.",
    ],
  },
  {
    version: "2.33.0-beta.4",
    date: "2026-07-19",
    notes: [
      "Variant-expansion Phase 1 (person-swaps) rolled to the Romance pairs fr/frCa/it/ptBr/ptPt. 115 new gram items added (frForEn +17, frCaForEn +15, itForEn +20, ptBrForEn +30, ptPtForEn +33), generated by reworking the conjugation-drill subset of each track's `gram` category into other subject-person forms. These tracks have no dedicated `verbo` category (unlike esForEn) — the drill items were located by structure (a ___ blank + a parenthesized lemma gloss), 28 transformable base items in all. Forms via verbecc (rule-based; reliable on irregulars). Per-track regional person sets: fr/frCa = je/tu/il/nous/vous/ils; it = io/tu/lui/noi/voi/loro; ptBr = eu/você/ele/nós/eles; ptPt = eu/tu/ele/nós/eles. EXCLUDED and documented in each packet's 'Not transformed' tab: noun/implied-subject (3rd-person locked), progressive (estar/être + gerund — auxiliary axis), impersonal/weather, auxiliary-choice judgments, and two-clause hypotheticals where the blank is a subordinate verb but the main clause is fixed (subject mismatch). Coreferential subjunctive eu-cell dropped for 'Espero que…' (PT uses the infinitive). Predicate-number agreement applied on copular items (italiano→italiani, brasileiro→brasileiros, português→portugueses, bem-vindo↔bem-vindos). Regional orthography honored (ptBr preterite nós 'falamos' vs ptPt 'falámos'; ir present nós forced to 'vamos' over verbecc's archaic 'imos'; imperatives authored to modern forms). Portuguese-specific axes (future subjunctive after quando/se, personal infinitive, imperative person-swap) generated and flagged High-risk. Options = sibling person-forms, deduped to distinct 4, deterministically shuffled so the answer isn't always first. Each entry carries an inline // <lang>-v-NNN-p-<person> ID + a per-track block marker. ALL AI-generated and PENDING native review — reviewer packets at docs/variant-expansion/review-packets/{fr,frCa,it,ptBr,ptPt}-verb-variants.xlsx; round-trip data in docs/variant-expansion/generated/{fr,frCa,it,ptBr,ptPt}_generated.json. Per the decided gate policy, shipped to beta-prod BEFORE review; native review gates only the future real-prod promotion. Tense-swaps (Phase 2) intentionally not generated this pass. Method + per-language references in docs/variant-expansion/ (00-methodology, 02-french, 03-italian, 04-portuguese). Verified: node import parse of all 5 tracks, 115/115 correct-index + distinct-4-options, every non-imperative form independently re-checked against verbecc.",
    ],
  },
  {
    version: "2.33.0-beta.3",
    date: "2026-07-19",
    notes: [
      "Variant-expansion Phase 1 (person-swaps): 358 new verbo items in data/tracks/esForEn.js, generated by reworking the 157 existing verb questions into their other subject-person forms. Verbo bank 157\u2192515. Conjugated with verbecc (rule-based, reliable on irregulars); LatAm 5-person set (no vosotros). Scope = pronoun-subject standard/reflexive items only; EXCLUDED noun/implied-subject (person-locked to 3rd), gustar-type, progressive, impersonal-se, infinitive-slot, impersonal weather verbs; coreferential subjunctive variants ('Quiero que yo\u2026') dropped. Options deduped (yo=\u00e9l share forms in imperfect/conditional/subjunctive); shuffled so the answer isn't always first. Each entry carries an inline // es-v-NNN-p-<person> ID + a block marker. ALL AI-generated and PENDING LatAm review (#41) \u2014 reviewer packet at docs/variant-expansion/review-packets/es-verb-variants.xlsx; round-trip data in docs/variant-expansion/generated/es_generated.json. Tense-swaps (13-row sample) intentionally NOT shipped. Method + rollout plan in docs/variant-expansion/00-methodology.md. Verified: node --check parse, 358/358 correct-index + distinct-4-options, 0 coreference residual.",
    ],
  },
  {
    version: "2.33.0-beta.2",
    date: "2026-07-19",
    notes: [
      "#88 combined focus (category ∩ theme): buildRound now intersects a category filter with a theme filter when BOTH are set, gated by COMBINED_MIN=4 — below that it falls through to the theme-only round (never a stub). Previously the theme silently overrode the category (the reported 'Grammar + Shopping resets to Mixed' — it was working as originally built; now they combine). UI no longer clears the opposite filter; new live-viability note on the play start screen (comboReady/comboThin strings). New exports in gameEngine.js: themeCoverage(), combinedPoolSize(), COMBINED_MIN. Files: gameEngine.js, playStrings.js, app/play/[trackId]/page.js.",
      "esForEn tag-coverage pass (data/tracks/esForEnTags.js rewrite): tense tags 35→157 of 157 verbo items — every verb now carries a tense (added Pluperfect, Future perfect, Conditional perfect defs). Theme tags 90→255 of 418 curated items (vocab 25→88, verbo 27→59, trad 38→108). Combined-round viability 10→20 of 27 category×theme cells; Grammar×Shopping 1→5. ALL AI-authored — PENDING LatAm review (#41), the advanced subjunctive / como-si items especially. Verified: syntax, re-bundle, coverage recount, engine end-to-end (blend + graceful fallback), tense-signal lint (0 flags). Remaining thin cells: verbo×emotions (0), trad×directions (0); Directions is the weakest theme overall.",
      "Deploy TTS auto-sync: npm run deploy now runs scripts/tts-on-deploy.mjs after the push — it maps the deploy's changed content files to their audio track(s), dry-runs generate-tts to count NEW spoken clips (no API cost/key), and for any track with new clips runs generate-tts --upload (synth + upload to the dev tts-audio bucket). Non-blocking: audio never aborts the code push (warns and continues; the script always exits 0). Doc-only deploys do no TTS work and need no key. Closes the manual 'remember to regenerate TTS after adding content' gap; sync-tts.mjs still mirrors dev→prod at release.",
    ],
  },
  {
    version: "2.33.0-beta.1",
    date: "2026-07-19",
    notes: [
      "#38 follow-up (content depth) — esForEn curated banks expanded across two passes to ~130–160 items/category: vocab 40→~134, verbo 35→~157, trad 33→~127, fono 18→79 items (~158 phonetics exercises). Curated total 126→~500 (plus the unchanged 609-item fvocab Word Bank). Pass 2 generated via a 46-agent workflow (per category × CEFR band) with a native-level Spanish verification stage; items deduped against existing banks. New items span A1–C2. ALL AI-authored — flagged PENDING LatAm native review (#41) via inline marker comments in data/tracks/esForEn.js.",
      "CEFR-banded mastery bars: computeMastery already returned byDifficulty; the play-page mastery card now sums only bands ≤ the player's skill level (new masteryBandsForSkillLevel() in skillLevels.js — none/beginner→A1-A2, intermediate→A1-B2, advanced/native→all). Bar + learned/total are cumulative-to-level; above-band difficulty rows render dimmed as the next goal. No new i18n strings. Track-agnostic (helps every track once its content is banded).",
      "Vocab depth lever confirmed already live: fvocab Word Bank replaces up to 30% of every mixed round (wbShareCap 0.3). Open recommendation: consider raising esForEn wbShareCap (e.g. 0.4) and/or surfacing a dedicated \"Palabras\" practice entry — but that touches the parked cross-track WB pilot verdict, so left unchanged this session.",
    ],
  },
  {
    version: "2.32.0-beta.1",
    date: "2026-07-19",
    notes: [
      "#85 Help relocated out of the nav drawer to a '?' icon on the home top bar (NavDrawer.js, app/page.js, help copy).",
      "#91 Internal changelog source added (this array) + non-prod/admin gating in the changelog view; public/version.json regenerated to match CURRENT_VERSION.",
      "#92 Shared Back/Home control (lib/BackHome.js) backed by a maintained nav-depth stack (lib/navDepth.js + NavDepthTracker in the root layout); Home shows only 2+ pages deep. Migrated changelog / what's-new / about / help / grammar pages.",
      "#87 Answer-choice tap-to-play audio for esForEn — review/pause mode only, excluded from progress aggregates; new choice-audio setting; generate-tts.mjs now emits target-language option clips for the trad + verbo categories (esForEn only).",
      "#88 Thematic tag/filter layer for esForEn — many-to-many theme tags over an unchanged home category; theme picker on the play start screen; results still record to the home category (no new mastery bar).",
      "#89 Tense training-wheels toggle for esForEn — surfaces the tense + a one-line why on grammar-tagged verb items; on by default, dismissable at advanced levels.",
      "#90 Grammar gym for esForEn — standalone conjugation module with its own walled-off localStorage tracker; never feeds the main tracker or the mix-and-match picker.",
    ],
  },
  {
    version: "2.31.0-beta.2",
    date: "2026-07-14",
    notes: [
      "TTS sync CI chain (sync-tts → smoke-check → publish-ready) so prod audio is carried automatically at release with zero manual upload.",
      "Update-prompt gating: the \"update available\" poll now waits on publish-ready (code + DB + audio all live) before firing.",
      "Migration 014 (tts_audio_bucket) live.",
    ],
  },
];

// #91: may the fuller internal changelog render on THIS deploy? True on any
// non-production environment. Unknown/unset env is treated as production
// (safe default — never leak internal notes to prod). The changelog view ORs
// this with an admin check so admins always see the detail wherever they are.
export function isNonProdEnv() {
  const env = (process.env.NEXT_PUBLIC_APP_ENV || process.env.NEXT_PUBLIC_VERCEL_ENV || "").toLowerCase();
  return env === "development" || env === "dev" || env === "staging" || env === "preview";
}

// Flatten INTERNAL_CHANGELOG to a { version -> notes[] } lookup for the view.
export function internalNotesByVersion() {
  const map = {};
  INTERNAL_CHANGELOG.forEach((e) => {
    map[e.version] = e.notes;
  });
  return map;
}

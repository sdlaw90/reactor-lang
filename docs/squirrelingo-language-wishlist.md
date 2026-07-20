# SquirreLingo — Master Language List & Grouping Map

_Created 2026-07-20. Purpose: one authoritative catalog of **every** language — built, planned, and fantasy/constructed — with its **grouping (family)** and **development status**. Two jobs this serves: (1) see at a glance what still needs building, and (2) have the family classification settled **ahead of** the #86 home-page reconfigure (family-grouped "Explore" + pinned "Your languages")._

> **Sourcing note.** Section 1 (built tracks) is authoritative — pulled from the track registry (`data/tracks/index.js`) and the state-of-app parity matrix. Sections 2–3 (candidates + fantasy) are a **planning catalog to prune**, not a committed roadmap. There is no `squirrelingo-language-wishlist.md` in the repo or project yet — this doc replaces that referenced-but-missing file as the candidate pipeline (#86/#40).

## Status legend

| Mark | Meaning |
|---|---|
| ✅ | **Developed — deep.** Full depth standard (vocab/verbo/trad/fono + tags/WB where noted). |
| 🟡 | **Stub only.** Track exists in the app but is starter-content, not deepened (#38/#40 owed). |
| ⬜ | **Not developed.** Candidate — no track yet. |
| 🎭 | **Fantasy / constructed.** See IP flag per entry. |

## "Grouping type" = linguistic family

The grouping column below is the **linguistic family** (Romance, Germanic, Slavic…) — the same sense as "Romance parity" in the state-of-app doc. This is the bucket to group the home page by. Note the two-level structure the #86 tile design implies:

- **Family** (e.g. Romance) → the grouping/parity bucket used here.
- **Macro-language tile** (e.g. Spanish) → opens into **dialect variants** (LatAm / Spain). The #86 tile is per-macro-language; the family is the shelf those tiles sit on.

⚠️ **No `family` field exists in track metadata today** (`id/label/nameEn/nameEs/nativeLang/targetLang/theme` only). The #86 reconfigure will need to derive family from `targetLang` via a lookup map — this doc is that map.

---

## 1. Built tracks (15) — authoritative

All 15 tracks currently registered in the app. 12 target-for-English tracks are at full depth; the 3 English native-direction tracks are stubs still owed a depth pass (#38/#40).

| Track ID | Language (variant) | Direction | Family (grouping) | Status |
|---|---|---|---|---|
| `es-for-en` | Spanish — Latin American | for English speakers | **Romance** | ✅ Deep — the pilot/template track (vocab 134 / verbo 515 / trad 127 / fono 79 + 609 WB + full tags) |
| `es-spain-for-en` | Spanish — Spain/Peninsular | for English speakers | **Romance** | ✅ Deep (127/152/127/79 + WB + tags; verbo variant-expansion deferred) |
| `fr-for-en` | French — France | for English speakers | **Romance** | ✅ Deep |
| `fr-ca-for-en` | French — Canadian | for English speakers | **Romance** | ✅ Deep |
| `it-for-en` | Italian | for English speakers | **Romance** | ✅ Deep |
| `pt-br-for-en` | Portuguese — Brazil | for English speakers | **Romance** | ✅ Deep |
| `pt-pt-for-en` | Portuguese — Portugal | for English speakers | **Romance** | ✅ Deep |
| `de-for-en` | German | for English speakers | **Germanic** | ✅ Deep — shipped (v2.30.0-beta.2) |
| `ja-for-en` | Japanese | for English speakers | **Japonic** | ✅ Deep — shipped (v2.31.0-beta.1); native script + romaji |
| `ko-for-en` | Korean | for English speakers | **Koreanic** | ✅ Deep — in dev (ru/ko/zh ledger) |
| `ru-for-en` | Russian | for English speakers | **Slavic** (Balto-Slavic) | ✅ Deep — in dev (ledger) |
| `zh-for-en` | Mandarin Chinese | for English speakers | **Sinitic** (Sino-Tibetan) | ✅ Deep — in dev (ledger); hanzi + pinyin |
| `en-for-it` | English | for Italian speakers | **Germanic** | 🟡 Stub — 36 items, shipped as first native-direction track; not at depth standard |
| `en-us-for-es` | English — American | for Spanish speakers | **Germanic** | 🟡 Stub — starter set only |
| `en-gb-for-es` | English — British | for Spanish speakers | **Germanic** | 🟡 Stub — starter set only |

**Grouping snapshot (built):** Romance ×7 · Germanic ×4 (1 German + 3 English) · Japonic ×1 · Koreanic ×1 · Slavic ×1 · Sinitic ×1.

**Still to develop among built tracks:** the 3 English native-direction stubs (`en-for-it`, `en-us-for-es`, `en-gb-for-es`) — gated on #71 (respellings) + #72 (UI-string sweep) before the next one.

---

## 2. Candidate real languages — comprehensive catalog by family

Everything not yet a track. Organized by the same family buckets so the home-page grouping is settled in advance. Built languages are shown ✅ in-line so each family shelf reads complete; ⬜ = candidate.

### Romance (Indo-European › Italic)
| Language | Status | Notes |
|---|---|---|
| Spanish, Portuguese, French, Italian | ✅ | built (see §1; each with dialect variants) |
| Romanian | ⬜ | most-different Romance; Latin + Slavic influence |
| Catalan | ⬜ | strong learner base (Catalonia) |
| Galician | ⬜ | bridges Spanish/Portuguese |
| Occitan / Romansh / Sardinian | ⬜ | minority — low priority |
| Latin | ⬜ | classical (see §2 note on dead languages) |

### Germanic (Indo-European)
| Language | Status | Notes |
|---|---|---|
| English, German | ✅ | built |
| Dutch | ⬜ | high-value next Germanic; close to English+German |
| Afrikaans | ⬜ | simplified grammar; easy for Dutch/English |
| Swedish, Norwegian, Danish | ⬜ | North Germanic trio — share scaffolding like the Romance dialect pairs |
| Icelandic | ⬜ | conservative morphology; harder |
| Yiddish | ⬜ | Hebrew script; niche |

### Balto-Slavic (Indo-European)
| Language | Status | Notes |
|---|---|---|
| Russian | ✅ | built; Cyrillic block already exists (#62) |
| Polish | ⬜ | large learner base; Latin script |
| Ukrainian | ⬜ | Cyrillic; high current interest |
| Czech, Slovak | ⬜ | pair-able |
| Serbian / Croatian / Bosnian | ⬜ | BCS continuum; dual-script (Serbian) |
| Bulgarian | ⬜ | Cyrillic |
| Lithuanian, Latvian | ⬜ | Baltic branch; archaic morphology |

### Hellenic / Celtic (Indo-European)
| Language | Status | Notes |
|---|---|---|
| Greek (Modern) | ⬜ | own script; strong "prestige" pull |
| Irish, Welsh, Scottish Gaelic | ⬜ | Celtic; committed hobbyist audience |

### Indo-Iranian (Indo-European)
| Language | Status | Notes |
|---|---|---|
| Hindi | ⬜ | Devanagari; huge speaker base |
| Urdu | ⬜ | Hindi's Perso-Arabic-script counterpart — dialect-pair-able with Hindi |
| Bengali, Punjabi, Gujarati, Marathi, Nepali | ⬜ | Indo-Aryan; each own/shared script |
| Persian (Farsi) | ⬜ | Iranian; Perso-Arabic script |
| Pashto, Kurdish | ⬜ | Iranian; niche |

### Semitic (Afro-Asiatic)
| Language | Status | Notes |
|---|---|---|
| Arabic — Modern Standard | ⬜ | RTL script; MSA + dialects = natural dialect-variant tiles (Egyptian, Levantine, Gulf, Maghrebi) |
| Hebrew (Modern) | ⬜ | RTL; own script |
| Amharic | ⬜ | Ge'ez script; niche |
| Maltese | ⬜ | Semitic in Latin script — unusual bridge |

### Turkic
| Language | Status | Notes |
|---|---|---|
| Turkish | ⬜ | agglutinative; Latin script; strong learner base |
| Azerbaijani, Kazakh, Uzbek | ⬜ | secondary Turkic |

### East Asian
| Language | Status | Notes |
|---|---|---|
| Japanese, Korean, Mandarin | ✅ | built |
| Cantonese | ⬜ | Sinitic; dialect-variant-able with Mandarin (shared hanzi, different tones/readings) |
| Other Chinese varieties (Hokkien, Shanghainese) | ⬜ | long tail |
| Tibetan, Burmese | ⬜ | Sino-Tibetan, non-Sinitic; own scripts |

### Southeast Asian & Pacific
| Language | Status | Notes |
|---|---|---|
| Vietnamese | ⬜ | Austroasiatic; Latin script + tones — accessible entry |
| Thai, Lao | ⬜ | Tai-Kadai; own scripts + tones |
| Khmer | ⬜ | Austroasiatic; own script |
| Indonesian / Malay | ⬜ | Austronesian; Latin script, easy grammar — high ROI |
| Tagalog / Filipino | ⬜ | Austronesian; Latin script |
| Hawaiian, Māori | ⬜ | Austronesian; revitalization audiences |

### Dravidian (South India)
| Language | Status | Notes |
|---|---|---|
| Tamil, Telugu, Kannada, Malayalam | ⬜ | each own script; large speaker bases |

### Uralic / Kartvelian / other
| Language | Status | Notes |
|---|---|---|
| Finnish, Hungarian, Estonian | ⬜ | Uralic; agglutinative, no IE relation — popular "hard mode" picks |
| Georgian | ⬜ | Kartvelian; own script |
| Basque | ⬜ | **isolate** — no family; would be its own bucket |

### African (sub-Saharan)
| Language | Status | Notes |
|---|---|---|
| Swahili | ⬜ | Niger-Congo/Bantu; Latin script, regular — strong entry point |
| Zulu, Xhosa, Yoruba, Hausa, Igbo | ⬜ | large speaker bases; some (Xhosa/Zulu) with click consonants |

### Classical / dead (own bucket — not fantasy, but not "living")
| Language | Status | Notes |
|---|---|---|
| Latin, Ancient Greek, Sanskrit, Biblical Hebrew, Old Norse | ⬜ | academic/hobbyist demand; no "native speaker review" gate possible — flag as its own review model |

### Sign languages (structurally different — flag separately)
| Language | Status | Notes |
|---|---|---|
| ASL, BSL, etc. | ⬜ | **not text/audio** — video-first modality; would need the parked video-question work (#2). Own product lane, not a normal track. |

---

## 3. Fantasy & constructed languages 🎭

Split by whether we could actually **ship** them. The grouping type for all of these is **"Constructed (conlang)"** — subdivided into *media/IP* vs *neutral/auxiliary*.

### 3a. Media conlangs — ⚠️ IP-RESTRICTED
The language systems, names, and associated marks are owned/licensed. We **cannot build or market these without a license** (Sean is aware). Listed for completeness + so they're pre-classified if a licensing path ever opens. Precedent: licensed courses for some of these have existed on other platforms (e.g. Klingon, High Valyrian), so deals are possible but are deals.

| Language | Franchise / Owner | Status |
|---|---|---|
| Klingon (tlhIngan Hol) | Star Trek — Paramount/CBS (Klingon Language Institute) | ⬜ 🎭 IP |
| High Valyrian | Game of Thrones / ASOIAF — HBO / G.R.R. Martin | ⬜ 🎭 IP |
| Dothraki | Game of Thrones / ASOIAF — HBO / G.R.R. Martin | ⬜ 🎭 IP |
| Elvish — Quenya & Sindarin | Tolkien / Middle-earth — Tolkien Estate | ⬜ 🎭 IP |
| Na'vi | Avatar — Disney/20th Century | ⬜ 🎭 IP |
| Trigedasleng | The 100 — Warner Bros. | ⬜ 🎭 IP |
| Simlish / Minionese | The Sims / Minions — mostly nonsense phonology | ⬜ 🎭 IP (and not a real learnable grammar) |

### 3b. Neutral / auxiliary conlangs — ✅ FREE TO BUILD
No IP restriction — public-domain or open-licensed. These are the fantasy/constructed languages we could actually ship, and several are strong ADHD fits.

| Language | Grouping | Status | Notes |
|---|---|---|---|
| Esperanto | Constructed (auxiliary) | ⬜ | Largest, most-learned conlang; fully documented; huge free corpus. The obvious first conlang. |
| Toki Pona | Constructed (minimalist) | ⬜ | ~120–137 words total. **Excellent ADHD fit** — the entire language is learnable in the depth budget of one normal track. CC-licensed. |
| Interlingua | Constructed (naturalistic auxiliary) | ⬜ | Romance-family-adjacent; near-instantly readable to Spanish/Italian/Portuguese learners — pairs thematically with the Romance shelf. |
| Ido | Constructed (auxiliary) | ⬜ | Esperanto reform; niche |
| Lojban | Constructed (logical) | ⬜ | Logic-based; steep but a devoted audience |
| Volapük | Constructed (auxiliary) | ⬜ | Historic; mostly novelty |

---

## 4. Grouping types — the full bucket set for the #86 home page

The complete list of family/grouping buckets this catalog produces (use as the home-page family map):

**Romance · Germanic · Balto-Slavic · Hellenic · Celtic · Indo-Iranian · Semitic · Turkic · Japonic · Koreanic · Sinitic (Sino-Tibetan) · Tai-Kadai · Austroasiatic · Austronesian · Dravidian · Uralic · Kartvelian · Niger-Congo (Bantu) · Isolates (Basque) · Classical/Dead · Sign languages · Constructed (conlang).**

Built product touches only 6 of these today (Romance, Germanic, Japonic, Koreanic, Balto-Slavic, Sinitic). Dialect variants (LatAm/Spain, France/Canada, Brazil/Portugal, US/UK, and future MSA-Arabic dialects / Hindi-Urdu / Mandarin-Cantonese) collapse under one macro-language tile per #86 — that's the "opens into variants" behavior, not extra family buckets.

---

## 5. Build sequencing by complexity (next-wave planning)

> **Gate:** this ordering kicks in **after** the in-flight builds land — i.e. the ru/ko/zh ledger promoted to prod **and** the three English native-direction stubs (`en-for-it`, `en-us-for-es`, `en-gb-for-es`) deepened. Until "all the ones we've started" are full-build complete, no new §2 candidate starts.

**Two independent axes** — rank a candidate on both, don't conflate them:

- **Build complexity (our effort):** driven by (a) **new writing system** — does it need a #62-style script block? (b) **TTS availability + quality** for the sync pipeline (#37), (c) **native reviewer** reachable for the #41 gate, (d) **scaffolding reuse** — can it dialect-diff off an existing track (Romance/Slavic/CJK) or must it be authored from zero?
- **Learner difficulty (FSI-style distance from English):** script, phonology (tones, new sounds), morphology (cases, agglutination), grammatical distance. Useful for the placement/onboarding copy and for an in-app "difficulty" badge later — **not** the same as our build cost.

### First-pass tiering of §2 candidates by BUILD complexity (prune this)

**Tier A — lowest build cost / fastest (Latin script, TTS easy, reuses scaffolding):**
Dutch, Afrikaans · Swedish/Norwegian/Danish (share one North-Germanic scaffold, like the Romance dialect pairs) · Romanian, Catalan, Galician (reuse Romance scaffold) · Indonesian/Malay · Swahili · **Esperanto, Toki Pona, Interlingua** (regular by design; Toki Pona is near-trivial to reach full depth).

**Tier B — moderate (one hard factor: a known script, RTL, tones, or heavy morphology):**
Polish, Czech, Ukrainian (Ukrainian reuses the existing Cyrillic block) · Greek (new script) · Turkish (agglutinative) · Vietnamese (Latin + tones) · Hebrew, Arabic (RTL; Arabic adds diglossia → MSA + dialect variants) · Hindi/Urdu (Devanagari / Perso-Arabic) · Finnish, Hungarian (case-heavy agglutinative).

**Tier C — highest build cost (new script AND tones/heavy morphology, thin TTS/reviewer pool, or far from any existing content):**
Cantonese (more tones than Mandarin) · Thai, Lao, Khmer (own scripts + tones) · Tamil/Telugu/Kannada/Malayalam (own scripts) · Georgian (own script) · Classical/dead languages (Latin, Ancient Greek, Sanskrit — **no native-reviewer gate possible**, needs a different review model) · **Sign languages (own lane entirely — video-first, blocked on #2).**

**ADHD-fit flag (cuts across tiers):** Toki Pona and the naturalistic auxiliaries (Esperanto/Interlingua) are unusually low-friction to learn — worth weighing alongside build cost, since a fast-to-ship + easy-to-learn combo is a strong closed-beta showcase.

> _Populate real per-language build estimates here once the in-flight wave is done and we pick the first new-wave batch._

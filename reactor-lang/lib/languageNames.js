// Shared "what is language X called, as read by a native speaker of
// language Y" matrix -- replaces needing per-track nameEn/nameEs (and would
// eventually need nameIt/nameFr/... etc.) fields on every track. Language
// names are a bounded, reusable concept, same as category names
// (lib/playStrings.js's CATEGORY_NAMES) -- one shared table serves every
// current and future track, rather than fields multiplying per track.
//
// Good-faith translations for less-common directions (e.g. a language name
// as read by a Korean speaker) should get a native-speaker sanity check
// eventually, same as the rest of this project's content (see the to-do
// list's native-speaker content review item) -- these aren't guaranteed
// perfect, just genuinely researched.

export const LANGUAGE_NAMES = {
  en: { en: "English", es: "Inglés", it: "Inglese", fr: "Anglais", de: "Englisch", pt: "Inglês", ru: "Английский", ja: "英語", zh: "英语", ko: "영어" },
  es: { en: "Spanish", es: "Español", it: "Spagnolo", fr: "Espagnol", de: "Spanisch", pt: "Espanhol", ru: "Испанский", ja: "スペイン語", zh: "西班牙语", ko: "스페인어" },
  it: { en: "Italian", es: "Italiano", it: "Italiano", fr: "Italien", de: "Italienisch", pt: "Italiano", ru: "Итальянский", ja: "イタリア語", zh: "意大利语", ko: "이탈리아어" },
  fr: { en: "French", es: "Francés", it: "Francese", fr: "Français", de: "Französisch", pt: "Francês", ru: "Французский", ja: "フランス語", zh: "法语", ko: "프랑스어" },
  de: { en: "German", es: "Alemán", it: "Tedesco", fr: "Allemand", de: "Deutsch", pt: "Alemão", ru: "Немецкий", ja: "ドイツ語", zh: "德语", ko: "독일어" },
  pt: { en: "Portuguese", es: "Portugués", it: "Portoghese", fr: "Portugais", de: "Portugiesisch", pt: "Português", ru: "Португальский", ja: "ポルトガル語", zh: "葡萄牙语", ko: "포르투갈어" },
  ru: { en: "Russian", es: "Ruso", it: "Russo", fr: "Russe", de: "Russisch", pt: "Russo", ru: "Русский", ja: "ロシア語", zh: "俄语", ko: "러시아어" },
  ja: { en: "Japanese", es: "Japonés", it: "Giapponese", fr: "Japonais", de: "Japanisch", pt: "Japonês", ru: "Японский", ja: "日本語", zh: "日语", ko: "일본어" },
  zh: { en: "Mandarin Chinese", es: "Chino Mandarín", it: "Cinese Mandarino", fr: "Chinois Mandarin", de: "Mandarin-Chinesisch", pt: "Chinês Mandarim", ru: "Китайский", ja: "中国語", zh: "中文", ko: "중국어" },
  ko: { en: "Korean", es: "Coreano", it: "Coreano", fr: "Coréen", de: "Koreanisch", pt: "Coreano", ru: "Корейский", ja: "韓国語", zh: "韩语", ko: "한국어" },
};

// Regional-variant labels (e.g. "Spanish (Latin America)") aren't a clean
// single language code -- kept as an explicit override map, checked first.
const VARIANT_NAMES = {
  "es-latam-for-en": { en: "Spanish (Latin America)", es: "Español (Latinoamérica)", it: "Spagnolo (America Latina)", fr: "Espagnol (Amérique latine)", de: "Spanisch (Lateinamerika)", pt: "Espanhol (América Latina)", ru: "Испанский (Латинская Америка)", ja: "スペイン語（ラテンアメリカ）", zh: "西班牙语（拉丁美洲）", ko: "스페인어 (라틴 아메리카)" },
  "es-spain-for-en": { en: "Spanish (Spain)", es: "Español (España)", it: "Spagnolo (Spagna)", fr: "Espagnol (Espagne)", de: "Spanisch (Spanien)", pt: "Espanhol (Espanha)", ru: "Испанский (Испания)", ja: "スペイン語（スペイン）", zh: "西班牙语（西班牙）", ko: "스페인어 (스페인)" },
  "en-us-for-es": { en: "English (US)", es: "Inglés (EE. UU.)", it: "Inglese (USA)", fr: "Anglais (États-Unis)", de: "Englisch (USA)", pt: "Inglês (EUA)", ru: "Английский (США)", ja: "英語（アメリカ）", zh: "英语（美国）", ko: "영어 (미국)" },
  "en-gb-for-es": { en: "English (UK)", es: "Inglés (Reino Unido)", it: "Inglese (Regno Unito)", fr: "Anglais (Royaume-Uni)", de: "Englisch (UK)", pt: "Inglês (Reino Unido)", ru: "Английский (Великобритания)", ja: "英語（イギリス）", zh: "英语（英国）", ko: "영어 (영국)" },
  "fr-ca-for-en": { en: "French (Canada)", es: "Francés (Canadá)", it: "Francese (Canada)", fr: "Français (Canada)", de: "Französisch (Kanada)", pt: "Francês (Canadá)", ru: "Французский (Канада)", ja: "フランス語（カナダ）", zh: "法语（加拿大）", ko: "프랑스어 (캐나다)" },
  "pt-br-for-en": { en: "Portuguese (Brazil)", es: "Portugués (Brasil)", it: "Portoghese (Brasile)", fr: "Portugais (Brésil)", de: "Portugiesisch (Brasilien)", pt: "Português (Brasil)", ru: "Португальский (Бразилия)", ja: "ポルトガル語（ブラジル）", zh: "葡萄牙语（巴西）", ko: "포르투갈어 (브라질)" },
  "pt-pt-for-en": { en: "Portuguese (Portugal)", es: "Portugués (Portugal)", it: "Portoghese (Portogallo)", fr: "Portugais (Portugal)", de: "Portugiesisch (Portugal)", pt: "Português (Portugal)", ru: "Португальский (Португалия)", ja: "ポルトガル語（ポルトガル）", zh: "葡萄牙语（葡萄牙）", ko: "포르투갈어 (포르투갈)" },
};

// The single function every screen should use to show a track's name in
// the viewer's own native language -- replaces the old
// `nativeLang === "es" ? t.nameEs || t.label : t.nameEn || t.label` pattern,
// which only ever handled two native languages. Falls back sensibly: exact
// variant name > generic language name for the track's targetLang > the
// track's own self-label (immersive, last resort).
export function trackDisplayName(track, viewerNativeLang) {
  const lang = viewerNativeLang || "en";
  if (VARIANT_NAMES[track.id]) {
    return VARIANT_NAMES[track.id][lang] || VARIANT_NAMES[track.id].en || track.label;
  }
  if (LANGUAGE_NAMES[track.targetLang]) {
    return LANGUAGE_NAMES[track.targetLang][lang] || LANGUAGE_NAMES[track.targetLang].en || track.label;
  }
  return track.label;
}

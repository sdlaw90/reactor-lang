// Tag layer for zhForEn (SquirreLingo CJK tag pass, 2026-07-20).
// Mirrors the Romance *Tags.js model (see esForEnTags.js): every item keeps its
// ONE home category; `themes` is a many-to-many filter layer the practice
// picker uses (category ∩ theme), and results still record to the home
// category (no separate theme mastery).
//
// Mandarin does not conjugate, so this is a THEMES-ONLY layer — no tense/
// person chips (Mandarin has no tense/person inflection).
//
// Keyed by PROMPT TEXT (whitespace-normalized), not positional id, so a future
// content splice that shifts indices does not orphan a tag. AI-authored.

export const THEMES = [
  {"id":"numbers-time","en":"Numbers, dates & time","zh":"数字与时间"},
  {"id":"directions","en":"Directions","zh":"方向"},
  {"id":"shopping","en":"Shopping","zh":"购物"},
  {"id":"restaurant","en":"Restaurant & food","zh":"餐厅"},
  {"id":"travel","en":"Travel","zh":"旅行"},
  {"id":"medical","en":"Medical & doctor","zh":"健康"},
  {"id":"small-talk","en":"Small talk","zh":"闲聊"},
  {"id":"work","en":"Work & office","zh":"工作"},
  {"id":"emotions","en":"Emotions","zh":"情绪"},
];

// key (prompt text) -> { themes?: [id] }
const RAW = {
  "'你好 (nǐ hǎo)' 是什么意思？(shì shénme yìsi?)": {"themes":["small-talk"]},
  "'谢谢 (xièxiè)' 是什么意思？(shì shénme yìsi?)": {"themes":["small-talk"]},
  "'水 (shuǐ)' 是什么意思？(shì shénme yìsi?)": {"themes":["restaurant"]},
  "'再见 (zàijiàn)' 是什么意思？(shì shénme yìsi?)": {"themes":["small-talk"]},
  "'工作 (gōngzuò)' 是什么意思？(shì shénme yìsi?)": {"themes":["work"]},
  "'米饭 (mǐfàn)' 是什么意思？(shì shénme yìsi?)": {"themes":["restaurant"]},
  "'没关系 (méi guānxi)' 是什么意思？(shì shénme yìsi?)": {"themes":["small-talk"]},
  "'加油 (jiāyóu)' 是什么意思？(shì shénme yìsi?)": {"themes":["small-talk"]},
  "'客气 (kèqi)' 是什么意思？(shì shénme yìsi?)": {"themes":["small-talk"]},
  "'委屈 (wěiqu)' 是什么意思？(shì shénme yìsi?)": {"themes":["emotions"]},
  "'舍不得 (shěbude)' 是什么意思？(shì shénme yìsi?)": {"themes":["emotions"]},
  "'吃 (chī)' 是什么意思？(shì shénme yìsi?)": {"themes":["restaurant"]},
  "'喝 (hē)' 是什么意思？(shì shénme yìsi?)": {"themes":["restaurant"]},
  "'茶 (chá)' 是什么意思？(shì shénme yìsi?)": {"themes":["restaurant"]},
  "'医院 (yīyuàn)' 是什么意思？(shì shénme yìsi?)": {"themes":["medical"]},
  "'火车 (huǒchē)' 是什么意思？(shì shénme yìsi?)": {"themes":["travel"]},
  "'便宜 (piányi)' 是什么意思？(shì shénme yìsi?)": {"themes":["shopping"]},
  "'高兴 (gāoxìng)' 是什么意思？(shì shénme yìsi?)": {"themes":["emotions"]},
  "'医生 (yīshēng)' 是什么意思？(shì shénme yìsi?)": {"themes":["medical"]},
  "'钱 (qián)' 是什么意思？(shì shénme yìsi?)": {"themes":["shopping"]},
  "'加班 (jiābān)' 是什么意思？(shì shénme yìsi?)": {"themes":["work"]},
  "'上火 (shànghuǒ)' 是什么意思？(shì shénme yìsi?)": {"themes":["medical"]},
  "'心疼 (xīnténg)' 是什么意思？(shì shénme yìsi?)": {"themes":["emotions"]},
  "这件衣服___贵。(Zhè jiàn yīfú ___ guì.) — 'This clothing is a bit (too) expensive' (a complaint)": {"themes":["shopping"]},
  "你喝茶___喝咖啡?(Nǐ hē chá ___ hē kāfēi?) — 'Do you want tea or coffee?' (pick one)": {"themes":["restaurant"]},
  "这么多菜,我们两个人吃___。(Zhème duō cài, wǒmen liǎng ge rén chī ___.) — we two can't possibly finish this much food": {"themes":["restaurant"]},
  "会议九点开始,他九点半___到。(Huìyì jiǔ diǎn kāishǐ, tā jiǔ diǎn bàn ___ dào.) — the meeting started at 9, and he didn't arrive until 9:30": {"themes":["work"]},
  "这个菜___很好吃。(Zhège cài ___ hěn hǎochī.) — this dish looks/seems delicious": {"themes":["restaurant"]},
  "Translate: 'Congratulations!'": {"themes":["small-talk"]},
  "Translate: 'Take care.' (said to a departing guest)": {"themes":["small-talk"]},
  "Translate: 'When in Rome, do as the Romans do.'": {"themes":["travel"]},
  "Translate: 'Come on! / Keep it up! (cheering someone on)'": {"themes":["small-talk"]},
  "Translate: 'Long time no see.'": {"themes":["small-talk"]},
  "Translate: 'Have a safe trip. / Bon voyage.'": {"themes":["travel"]},
  "Translate: 'Thanks for your hard work. / You've worked hard.'": {"themes":["small-talk"]},
  "Translate: 'Love at first sight.'": {"themes":["emotions"]},
};

const norm = (s) => String(s).replace(/\s+/g, " ").trim();
const MAP = new Map(Object.entries(RAW).map(([k, v]) => [norm(k), v]));

// Returns { themes? } for a prompt, or null if untagged.
export function tagFor(prompt) {
  if (!prompt) return null;
  return MAP.get(norm(prompt)) || null;
}

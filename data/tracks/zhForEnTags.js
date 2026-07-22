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
  "这件衣服___贵。(Zhè jiàn yīfú ___ guì.) — \"This clothing is a bit (too) expensive\" (a complaint)": {"themes":["shopping"]},
  "你喝茶___喝咖啡?(Nǐ hē chá ___ hē kāfēi?) — \"Do you want tea or coffee?\" (pick one)": {"themes":["restaurant"]},
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

  // ---- #88 theme coverage pass (2026-07-22, L4/E2 standardization; AI-authored, flag #41) ----
  "'朋友 (péngyǒu)' 是什么意思？(shì shénme yìsi?)": { themes: ["small-talk"] },
  "'天气 (tiānqì)' 是什么意思？(shì shénme yìsi?)": { themes: ["small-talk"] },
  "'累 (lèi)' 是什么意思？(shì shénme yìsi?)": { themes: ["emotions", "medical"] },
  "'舒服 (shūfu)' 是什么意思？(shì shénme yìsi?)": { themes: ["emotions"] },
  "'磨蹭 (móceng)' 是什么意思？(shì shénme yìsi?)": { themes: ["emotions"] },
  "'别扭 (bièniu)' 是什么意思？(shì shénme yìsi?)": { themes: ["emotions"] },
  "'情怀 (qínghuái)' 是什么意思？(shì shénme yìsi?)": { themes: ["emotions"] },
  "'手 (shǒu)' 是什么意思？(shì shénme yìsi?)": { themes: ["medical"] },
  "'衣服 (yī fu)' 是什么意思？(shì shénme yìsi?)": { themes: ["shopping"] },
  "'鞋子 (xié zi)' 是什么意思？(shì shénme yìsi?)": { themes: ["shopping"] },
  "'面包 (miàn bāo)' 是什么意思？(shì shénme yìsi?)": { themes: ["restaurant", "shopping"] },
  "'头 (tóu)' 是什么意思？(shì shénme yìsi?)": { themes: ["medical"] },
  "'裤子 (kù zi)' 是什么意思？(shì shénme yìsi?)": { themes: ["shopping"] },
  "'帽子 (mào zi)' 是什么意思？(shì shénme yìsi?)": { themes: ["shopping"] },
  "'鸡蛋 (jī dàn)' 是什么意思？(shì shénme yìsi?)": { themes: ["restaurant"] },
  "'牛奶 (niú nǎi)' 是什么意思？(shì shénme yìsi?)": { themes: ["restaurant", "shopping"] },
  "'厨房 (chú fáng)' 是什么意思？(shì shénme yìsi?)": { themes: ["restaurant"] },
  "'公园 (gōng yuán)' 是什么意思？(shì shénme yìsi?)": { themes: ["directions"] },
  "'星期 (xīng qī)' 是什么意思？(shì shénme yìsi?)": { themes: ["numbers-time"] },
  "'飞机 (fēi jī)' 是什么意思？(shì shénme yìsi?)": { themes: ["travel"] },
  "'药 (yào)' 是什么意思？(shì shénme yìsi?)": { themes: ["medical"] },
  "'超市 (chāo shì)' 是什么意思？(shì shénme yìsi?)": { themes: ["shopping"] },
  "'森林 (sēn lín)' 是什么意思？(shì shénme yìsi?)": { themes: ["travel"] },
  "'世纪 (shì jì)' 是什么意思？(shì shénme yìsi?)": { themes: ["numbers-time"] },
  "'电脑 (diàn nǎo)' 是什么意思？(shì shénme yìsi?)": { themes: ["work"] },
  "'护照 (hù zhào)' 是什么意思？(shì shénme yìsi?)": { themes: ["travel"] },
  "'感冒 (gǎn mào)' 是什么意思？(shì shénme yìsi?)": { themes: ["medical"] },
  "'打折 (dǎ zhé)' 是什么意思？(shì shénme yìsi?)": { themes: ["shopping"] },
  "'血压 (xuè yā)' 是什么意思？(shì shénme yìsi?)": { themes: ["medical"] },
  "'郊区 (jiāo qū)' 是什么意思？(shì shénme yìsi?)": { themes: ["travel"] },
  "'行李 (xíng li)' 是什么意思？(shì shénme yìsi?)": { themes: ["travel"] },
  "'预算 (yù suàn)' 是什么意思？(shì shénme yìsi?)": { themes: ["shopping"] },
  "'应聘 (yìng pìn)' 是什么意思？(shì shénme yìsi?)": { themes: ["work"] },
  "'惋惜 (wǎn xī)' 是什么意思？(shì shénme yìsi?)": { themes: ["emotions"] },
  "'乡愁 (xiāng chóu)' 是什么意思？(shì shénme yìsi?)": { themes: ["emotions"] },
  "Translate: 'To kill two birds with one stone.'": { themes: ["work"] },
  "Translate: 'Better late than never.' (fix it after the loss)": { themes: ["numbers-time"] },
  "Translate: 'To console yourself with illusions and false hopes.'": { themes: ["emotions"] },
  "Translate: 'Welcome!' (greeting a customer entering a shop)": { themes: ["small-talk"] },
  "Translate: 'Cheers!' (raising a glass to toast)": { themes: ["restaurant", "small-talk"] },
  "Translate: 'You're welcome. / Don't mention it.'": { themes: ["small-talk"] },
  "Translate: 'Good night.'": { themes: ["small-talk"] },
  "Translate: 'Happy birthday!'": { themes: ["small-talk"] },
  "Translate: 'One moment, please. / Please wait a moment.'": { themes: ["small-talk"] },
  "Translate: 'Check, please. / The bill.' (at a restaurant)": { themes: ["restaurant"] },
  "Translate: 'Excuse me, may I ask...?'": { themes: ["small-talk"] },
  "Translate: 'The early bird catches the worm.'": { themes: ["work"] },
  "Translate: 'On tenterhooks / anxious and unsettled.'": { themes: ["emotions"] },
  "Translate: 'Speak of the devil!' (the person just mentioned appears)": { themes: ["small-talk"] },
  "Translate: 'You get what you pay for.'": { themes: ["shopping"] },
};

const norm = (s) => String(s).replace(/\s+/g, " ").trim();
const MAP = new Map(Object.entries(RAW).map(([k, v]) => [norm(k), v]));

// Returns { themes? } for a prompt, or null if untagged.
export function tagFor(prompt) {
  if (!prompt) return null;
  return MAP.get(norm(prompt)) || null;
}

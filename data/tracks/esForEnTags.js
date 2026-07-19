// Shared tag model for esForEn (#88 themes + #89 tense training-wheels).
//
// Design (both features ride ONE tag model, per the backlog note):
//   - Every item keeps its ONE home category (mastery counts there, unchanged).
//   - `themes` is a MANY-TO-MANY tag layer (#88). The practice picker's theme
//     filter pulls every tagged item from any category; results still record
//     to the home category, so there is NO new theme mastery bar.
//   - `grammar` carries the tense/mood + a one-line "why" (#89). It's surfaced
//     as an on-by-default, dismissable training-wheels chip on verb items,
//     where the tested skill is producing the tense-correct conjugation but
//     the tense itself is otherwise invisible in the prompt.
//
// Tags are keyed by the item's PROMPT TEXT (normalized), not its positional id
// ("verbo-3") — same rationale as the audio keys: inserting an item during a
// content pass shifts every id after it, but the prompt text is stable. Lookup
// is whitespace-normalized so cosmetic edits don't orphan a tag.
//
// This is a CURATED STARTER set (#88 says ship ~10–12 themes, not all ~40 —
// choice paralysis hits ADHD users hard). Grow coverage as content gets tagged;
// untagged items simply carry no themes and never appear under a theme filter.

// ---- #88: theme catalog (starter set) ----
// Starter set = only themes with real coverage in the current curated bank, so
// every chip yields a real round. Greetings/directions-heavy themes grow as
// content gets tagged (the todo's grow-later list).
export const THEMES = [
  { id: "numbers-time", en: "Numbers, dates & time", es: "Números y tiempo" },
  { id: "directions", en: "Directions", es: "Direcciones" },
  { id: "shopping", en: "Shopping", es: "Compras" },
  { id: "restaurant", en: "Restaurant & food", es: "Restaurante" },
  { id: "travel", en: "Travel", es: "Viajes" },
  { id: "medical", en: "Medical & doctor", es: "Salud" },
  { id: "small-talk", en: "Small talk", es: "Conversación" },
  { id: "work", en: "Work & office", es: "Trabajo" },
  { id: "emotions", en: "Emotions", es: "Emociones" },
];

// ---- #89: tense/mood definitions (each item references one) ----
// { tense: {en, es}, why: {en, es} } — the chip shows the tense name plus the
// one-line "why" in the viewer's language.
const T = {
  present: { tense: { en: "Present", es: "Presente" }, why: { en: "Habitual or current actions.", es: "Acciones habituales o actuales." } },
  preterite: { tense: { en: "Preterite", es: "Pretérito" }, why: { en: "A completed action at a specific point in the past.", es: "Una acción completada en un momento concreto del pasado." } },
  imperfect: { tense: { en: "Imperfect", es: "Imperfecto" }, why: { en: "Ongoing, habitual, or background past actions.", es: "Acciones pasadas en curso, habituales o de fondo." } },
  future: { tense: { en: "Simple future", es: "Futuro simple" }, why: { en: "What will happen.", es: "Lo que ocurrirá." } },
  conditional: { tense: { en: "Conditional", es: "Condicional" }, why: { en: "What would happen — often paired with a hypothetical 'si'.", es: "Lo que ocurriría — suele ir con un 'si' hipotético." } },
  presSubj: { tense: { en: "Present subjunctive", es: "Presente de subjuntivo" }, why: { en: "Triggered by wishes, doubt, emotion, or 'cuando' about the future.", es: "Lo activan deseos, dudas, emociones o 'cuando' sobre el futuro." } },
  presPerfect: { tense: { en: "Present perfect", es: "Pretérito perfecto" }, why: { en: "A past action with present relevance ('have done').", es: "Una acción pasada con relevancia presente ('he hecho')." } },
  presPerfectSubj: { tense: { en: "Present perfect subjunctive", es: "Pretérito perfecto de subjuntivo" }, why: { en: "A completed action seen through doubt or disbelief.", es: "Una acción completada vista con duda o incredulidad." } },
  imperfectSubj: { tense: { en: "Imperfect subjunctive", es: "Imperfecto de subjuntivo" }, why: { en: "Wishes/hypotheticals about the past, or softened requests.", es: "Deseos/hipótesis sobre el pasado o peticiones suavizadas." } },
  pluperfectSubj: { tense: { en: "Pluperfect subjunctive", es: "Pluscuamperfecto de subjuntivo" }, why: { en: "An unreal past condition ('had I known…').", es: "Una condición irreal del pasado ('si hubiera sabido…')." } },
  progressive: { tense: { en: "Present progressive", es: "Presente progresivo" }, why: { en: "estar + gerund — an action happening right now.", es: "estar + gerundio — una acción que ocurre ahora mismo." } },
  cmdAff: { tense: { en: "Affirmative command", es: "Imperativo afirmativo" }, why: { en: "Telling someone to do something.", es: "Decirle a alguien que haga algo." } },
  cmdNeg: { tense: { en: "Negative command", es: "Imperativo negativo" }, why: { en: "'no' + the subjunctive form.", es: "'no' + la forma del subjuntivo." } },
  infinitive: { tense: { en: "Infinitive", es: "Infinitivo" }, why: { en: "The unconjugated verb, used after expressions like 'hay que' or 'de'.", es: "El verbo sin conjugar, tras expresiones como 'hay que' o 'de'." } },
};

// key (prompt text) -> { themes?: [id], grammar?: {tense, why} }
const RAW = {
  // ————— vocab —————
  "¿Cómo se dice 'deadline' en español?": { themes: ["work"] },
  "¿Cómo se dice 'keyboard' en español?": { themes: ["work"] },
  "¿Cómo se dice 'stubborn' en español?": { themes: ["emotions"] },
  "'La factura' significa...": { themes: ["shopping", "work"] },
  "'Chismear' significa...": { themes: ["small-talk"] },
  "'La pereza' significa...": { themes: ["emotions"] },
  "¿Cómo se dice 'coworker' en español?": { themes: ["work"] },
  "¿Cómo se dice 'to overthink' en español?": { themes: ["emotions"] },
  "'Comer' significa...": { themes: ["restaurant"] },
  "¿Cómo se dice 'car' en español (Latinoamérica)?": { themes: ["travel", "directions"] },
  "¿Cómo se dice 'juice' en español (Latinoamérica)?": { themes: ["restaurant", "shopping"] },
  "¿Cómo se dice 'computer' en español (Latinoamérica)?": { themes: ["work"] },
  "'La ropa' significa...": { themes: ["shopping"] },
  "¿Cómo se dice 'avocado' en español?": { themes: ["restaurant", "shopping"] },
  "'Embarazada' significa...": { themes: ["medical"] },
  "'El éxito' significa...": { themes: ["work"] },
  "'Extrañar (a alguien)' significa... (Latinoamérica)": { themes: ["emotions"] },
  "'Realizar' significa...": { themes: ["work"] },
  "'Asistir a' significa...": { themes: ["work"] },
  "'Desvelarse' significa...": { themes: ["medical"] },
  "'La plata' significa... (coloquial, Sudamérica)": { themes: ["shopping"] },
  "'La chamba' significa... (coloquial)": { themes: ["work"] },
  "'Platicar' significa... (México y Centroamérica)": { themes: ["small-talk"] },
  "'Apapachar' significa... (coloquial, México y Centroamérica)": { themes: ["emotions"] },
  "'Ningunear' significa...": { themes: ["emotions"] },

  // ————— verbo (tense on every item; themes where they fit) —————
  "Yo _____ (tener) mucha hambre ahora mismo.": { themes: ["restaurant"], grammar: T.present },
  "Nosotros _____ (querer) salir esta noche.": { themes: ["small-talk"], grammar: T.present },
  "Ella _____ (dormir) ocho horas anoche.": { themes: ["medical"], grammar: T.preterite },
  "¿Tú _____ (poder) ayudarme mañana?": { themes: ["small-talk"], grammar: T.present },
  "Ayer yo _____ (ir) al gimnasio.": { themes: ["directions"], grammar: T.preterite },
  "Ellos _____ (estar) trabajando cuando llamé.": { themes: ["work"], grammar: T.imperfect },
  "Mañana nosotros _____ (llegar) tarde, seguro.": { themes: ["numbers-time"], grammar: T.future },
  "Si tuviera tiempo, _____ (viajar) más.": { themes: ["travel"], grammar: T.conditional },
  "Espero que tú _____ (venir) a la fiesta.": { themes: ["small-talk"], grammar: T.presSubj },
  "Yo ya _____ (terminar) el proyecto.": { themes: ["work"], grammar: T.presPerfect },
  "Ella _____ (decir) que llegaría a las ocho.": { themes: ["numbers-time"], grammar: T.preterite },
  "Nosotros _____ (ver) esa película tres veces.": { themes: ["small-talk"], grammar: T.presPerfect },
  "¿Qué _____ (hacer) tú si ganaras la lotería?": { grammar: T.conditional },
  "Cuando era niño, _____ (jugar) fútbol todos los días.": { grammar: T.imperfect },
  "Es importante que ellos _____ (llegar) temprano.": { themes: ["work", "numbers-time"], grammar: T.presSubj },
  "Yo _____ (levantarse) a las seis todos los días.": { themes: ["numbers-time"], grammar: T.present },
  "Ella _____ (ser) doctora.": { themes: ["work", "medical"], grammar: T.present },
  "Nosotros _____ (estar) en el cine ahora.": { themes: ["small-talk"], grammar: T.present },
  "Hay que _____ (estudiar) para el examen.": { themes: ["work"], grammar: T.infinitive },
  "Ella está _____ (correr) en el parque.": { grammar: T.progressive },
  "A mí me _____ (gustar) los tacos.": { themes: ["restaurant"], grammar: T.present },
  "Ellos _____ (vivir) en Bogotá desde 2020.": { themes: ["travel"], grammar: T.present },
  "No _____ (tocar) eso, por favor.": { grammar: T.cmdNeg },
  "_____ (venir) acá, hijo, la cena está lista.": { themes: ["restaurant"], grammar: T.cmdAff },
  "Cuando _____ (llegar) a casa, te llamo.": { themes: ["directions"], grammar: T.presSubj },
  "Dudo que él lo _____ (saber).": { grammar: T.presSubj },
  "Ojalá _____ (poder, nosotros) ir mañana.": { themes: ["travel"], grammar: T.presSubj },
  "Se _____ (vender) casas en este barrio.": { themes: ["shopping"], grammar: T.present },
  "Se me _____ (olvidar) las llaves.": { grammar: T.preterite },
  "Si lo _____ (saber) antes, te habría avisado.": { grammar: T.pluperfectSubj },
  "No creo que ellos _____ (llegar) todavía.": { themes: ["travel"], grammar: T.presPerfectSubj },
  "Quisiera que me lo _____ (decir) con más tiempo.": { themes: ["small-talk"], grammar: T.imperfectSubj },
  "De _____ (haber) sabido, no habría venido.": { grammar: T.infinitive },
  "Sea como _____, hay que terminarlo hoy.": { themes: ["work"], grammar: T.presSubj },

  // ————— trad (idioms) —————
  "Translate: 'I'm running late.'": { themes: ["numbers-time", "travel"] },
  "Translate: 'It doesn't matter.'": { themes: ["small-talk"] },
  "Translate: 'She just left.'": { themes: ["small-talk"] },
  "Translate: 'What a pain.'": { themes: ["emotions"] },
  "Translate: 'I'm dying to see you.'": { themes: ["emotions"] },
  "Translate: 'Let's get to the point.'": { themes: ["work"] },
  "Translate: 'He's in a bad mood.'": { themes: ["emotions"] },
  "Translate: 'I couldn't care less.'": { themes: ["emotions"] },
  "Translate: 'That's none of your business.'": { themes: ["small-talk"] },
  "Translate: 'I have a lot on my plate.'": { themes: ["work"] },
  "Translate: 'Long story short...'": { themes: ["small-talk"] },
  "Translate: 'I'm on it.'": { themes: ["work"] },
  "Translate: 'It's up to you.'": { themes: ["small-talk"] },
  "Translate: 'No worries.'": { themes: ["small-talk"] },
  "Translate: 'I'll keep that in mind.'": { themes: ["small-talk", "work"] },
  "Translate: 'Better late than never.'": { themes: ["numbers-time"] },
  "Translate: 'It's a piece of cake.'": { themes: ["small-talk"] },
  "Translate: 'You're pulling my leg!'": { themes: ["small-talk"] },
  "Translate: 'No big deal.'": { themes: ["small-talk"] },
  "Translate: 'Can you give me a hand?'": { themes: ["small-talk"] },
  "Translate: 'I'm broke.'": { themes: ["shopping", "emotions"] },
  "Translate: 'Cool!' / 'Awesome!' (coloquial)": { themes: ["emotions"] },
  "Translate: 'I slept like a log.'": { themes: ["medical"] },
  "Translate: 'It costs an arm and a leg.'": { themes: ["shopping"] },
  "Translate: 'Speak of the devil!'": { themes: ["small-talk"] },
  "Translate: 'You hit the nail on the head.'": { themes: ["work"] },
  "Translate: 'Stop beating around the bush.'": { themes: ["work"] },
  "Translate: 'The early bird catches the worm.'": { themes: ["work"] },
  "Translate: 'once in a blue moon'": { themes: ["numbers-time"] },
  "Translate: 'He makes a mountain out of a molehill.'": { themes: ["emotions"] },
  "Translate: 'You snooze, you lose.'": { themes: ["small-talk"] },
  "Translate: 'There's no use crying over spilled milk.'": { themes: ["emotions"] },
};

const norm = (s) => String(s).replace(/\s+/g, " ").trim();
const MAP = new Map(Object.entries(RAW).map(([k, v]) => [norm(k), v]));

// Returns { themes?, grammar? } for a prompt, or null if untagged.
export function tagFor(prompt) {
  if (!prompt) return null;
  return MAP.get(norm(prompt)) || null;
}

// #90: grammar-gym practice engine. Pure and dependency-light (only borrows
// shuffle from the game engine) so it can be unit-checked in isolation. Builds
// multiple-choice conjugation drills from a grammar module's verb dataset.
//
// A drill item asks: "given this pronoun + infinitive + tense, which is the
// correct conjugated form?" Distractors are drawn from the SAME verb — other
// persons of the same tense, and the same person in other tenses — because
// those are the forms a learner actually confuses. Falls back to other verbs'
// matching cells only if a verb somehow can't supply three distinct distractors.

import { shuffle } from "./gameEngine";

// Every (verb, tense, personIdx) cell of a module, flattened.
function allCells(module) {
  const cells = [];
  module.verbs.forEach((v) => {
    module.tenses.forEach((t) => {
      const forms = v.forms[t.id];
      if (!forms) return;
      forms.forEach((form, pi) => {
        cells.push({ verb: v, tense: t, personIdx: pi, form });
      });
    });
  });
  return cells;
}

// Distractor candidates for one cell: same verb, same tense (other persons) +
// same person (other tenses). Deduped and stripped of the correct answer.
function distractorPool(module, cell) {
  const v = cell.verb;
  const pool = new Set();
  const sameTense = v.forms[cell.tense.id] || [];
  sameTense.forEach((f, pi) => {
    if (pi !== cell.personIdx) pool.add(f);
  });
  module.tenses.forEach((t) => {
    if (t.id === cell.tense.id) return;
    const forms = v.forms[t.id];
    if (forms && forms[cell.personIdx]) pool.add(forms[cell.personIdx]);
  });
  pool.delete(cell.form);
  return Array.from(pool);
}

// Build `count` drill items. `filter` (optional) is a group id or verb inf to
// scope the drill; omit for the whole module.
export function buildDrill(module, count = 8, filter = {}) {
  let cells = allCells(module);
  if (filter.group) cells = cells.filter((c) => c.verb.group === filter.group);
  if (filter.verb) cells = cells.filter((c) => c.verb.inf === filter.verb);
  if (filter.tense) cells = cells.filter((c) => c.tense.id === filter.tense);
  if (cells.length === 0) return [];

  const picks = shuffle(cells).slice(0, Math.min(count, cells.length));
  return picks.map((cell) => {
    let distractors = shuffle(distractorPool(module, cell)).slice(0, 3);
    // Pad from other verbs' matching cells if a tiny pool came up short.
    if (distractors.length < 3) {
      const extra = allCells(module)
        .filter((c) => c.form !== cell.form && !distractors.includes(c.form))
        .map((c) => c.form);
      distractors = distractors.concat(shuffle(Array.from(new Set(extra))).slice(0, 3 - distractors.length));
    }
    const options = shuffle([cell.form, ...distractors]);
    const person = module.persons[cell.personIdx];
    return {
      id: `${cell.verb.inf}-${cell.tense.id}-${cell.personIdx}`,
      verbInf: cell.verb.inf,
      gloss: cell.verb.gloss,
      group: cell.verb.group,
      person,
      tense: cell.tense,
      answer: cell.form,
      options,
      correctIdx: options.indexOf(cell.form),
    };
  });
}

// ---- walled-off progress (localStorage; never touches the main tracker) ----
const key = (trackId) => `sq-grammar-${trackId}`;

export function loadGrammarProgress(trackId) {
  try {
    const raw = localStorage.getItem(key(trackId));
    const p = raw ? JSON.parse(raw) : null;
    return { practiced: 0, correct: 0, seenVerbs: [], ...(p || {}) };
  } catch {
    return { practiced: 0, correct: 0, seenVerbs: [] };
  }
}

export function saveGrammarProgress(trackId, progress) {
  try {
    localStorage.setItem(key(trackId), JSON.stringify(progress));
  } catch {}
}

// Generic engine shared by every track (Spanish-for-English-speakers,
// English-for-Spanish-speakers, or any future track). A "track" is a plain
// object shaped like the exports in data/tracks/*.js — see that folder for
// the concrete content. Nothing in this file is language-specific.

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function shuffleOptions(item) {
  const { options, correctIdx, ...rest } = item;
  const correctAnswer = options[correctIdx];
  const idxArr = shuffle(options.map((_, i) => i));
  const newOptions = idxArr.map((i) => options[i]);
  const newCorrectIdx = newOptions.indexOf(correctAnswer);
  return { ...rest, options: newOptions, correctIdx: newCorrectIdx };
}

// Flattens a track's category banks into one array with stable ids: "vocab-3", etc.
export function flattenBank(bank) {
  const flat = [];
  Object.keys(bank).forEach((cat) => {
    bank[cat].forEach((q, i) => {
      flat.push({ id: `${cat}-${i}`, cat, prompt: q[0], options: q[1], correctIdx: q[2], explain: q[3], difficulty: q[4] || null });
    });
  });
  return flat;
}

// Raw (unshuffled) sub-questions for one "extra" bank item (phonetics, listening, etc.)
// that produces a linked pair: [identify-it, respond-to-it].
export function buildPairRaw(extraBank, i, catId) {
  const item = extraBank[i];
  return [
    {
      id: `${catId}-${i}-a`,
      cat: catId,
      kind: `${catId}_identify`,
      sound: item.sound,
      difficulty: item.difficulty || null,
      prompt: item.identifyPrompt,
      options: item.identify.options,
      correctIdx: item.identify.correctIdx,
      explain: item.identify.explain,
    },
    {
      id: `${catId}-${i}-b`,
      cat: catId,
      kind: `${catId}_respond`,
      sound: item.sound,
      difficulty: item.difficulty || null,
      prompt: item.respondPrompt(item),
      options: item.respond.options,
      correctIdx: item.respond.correctIdx,
      explain: item.respond.explain,
    },
  ];
}

export function flattenPairs(extraBank, catId) {
  const flat = [];
  extraBank.forEach((_, i) => flat.push(...buildPairRaw(extraBank, i, catId)));
  return flat;
}

// Picks `count` items biased toward whichever were seen longest ago (or never).
// Draws from the least-recently-seen half of the pool, so repeats spread out
// across many rounds instead of clustering, without hard-blocking anything.
export function pickFreshest(items, seenAt, count) {
  const sorted = [...items].sort((a, b) => (seenAt[a.id] || 0) - (seenAt[b.id] || 0));
  const freshPoolSize = Math.max(count, Math.ceil(sorted.length / 2));
  const freshPool = sorted.slice(0, freshPoolSize);
  return shuffle(freshPool).slice(0, count);
}

// Same freshness bias as pickFreshest, but ALSO prefers items matching the
// person's current skill level (a set of CEFR codes, e.g. ["A1","A2"]).
// Items at the right level always sort ahead of items outside it; freshness
// breaks ties within each group. Falls back gracefully — if there aren't
// enough items at the right level, off-level items still fill the round
// rather than leaving it short.
export function pickForLevelAndFreshness(items, seenAt, count, cefrSet) {
  if (!cefrSet) return pickFreshest(items, seenAt, count);
  const scored = items.map((item) => ({
    item,
    matches: !item.difficulty || cefrSet.includes(item.difficulty),
    seen: seenAt[item.id] || 0,
  }));
  scored.sort((a, b) => {
    if (a.matches !== b.matches) return a.matches ? -1 : 1;
    return a.seen - b.seen;
  });
  const poolSize = Math.max(count, Math.ceil(scored.length / 2));
  const pool = scored.slice(0, poolSize).map((s) => s.item);
  return shuffle(pool).slice(0, count);
}

export function buildRound(track, mode, missedIds, seenAt, cefrSet) {
  const flatBank = flattenBank(track.bank);
  const flatExtra = track.extraBank ? flattenPairs(track.extraBank, track.extraCatId) : [];
  const flatAll = flatBank.concat(flatExtra);

  if (mode === "review") {
    const pool = flatAll.filter((item) => missedIds.includes(item.id));
    const picks = shuffle(pool).slice(0, Math.min(pool.length, 9));
    return picks.map((item) => shuffleOptions(item));
  }

  const perCat = track.perCat || 2;
  const blocks = [];

  Object.keys(track.bank).forEach((cat) => {
    const items = flatBank.filter((item) => item.cat === cat);
    const picks = pickForLevelAndFreshness(items, seenAt, perCat, cefrSet);
    picks.forEach((item) => blocks.push([shuffleOptions(item)]));
  });

  if (track.extraBank && track.extraBank.length > 0) {
    const pseudoItems = track.extraBank.map((_, i) => ({
      id: `${track.extraCatId}-pair-${i}`,
      index: i,
      difficulty: track.extraBank[i].difficulty || null,
    }));
    const pairsPerRound = Math.min(track.extraPairsPerRound || 2, track.extraBank.length);
    const picks = pickForLevelAndFreshness(pseudoItems, seenAt, pairsPerRound, cefrSet);
    picks.forEach(({ index }) => {
      blocks.push(buildPairRaw(track.extraBank, index, track.extraCatId).map((raw) => shuffleOptions(raw)));
    });
  }

  return shuffle(blocks).flat();
}

// Ids "seen" in a round, used to update freshness tracking. Paired items (e.g.
// phonetics) are tracked under one pair-level id so both halves count as one event.
export function seenIdsForRound(round, extraCatId) {
  const ids = new Set();
  round.forEach((q) => {
    if (extraCatId && q.cat === extraCatId) {
      const i = q.id.split("-")[1];
      ids.add(`${extraCatId}-pair-${i}`);
    } else {
      ids.add(q.id);
    }
  });
  return Array.from(ids);
}

export function timeFor(track, q) {
  if (track.extraCatId && q && q.cat === track.extraCatId) {
    return track.extraQuestionTime || track.questionTime || 30;
  }
  return track.questionTime || 30;
}

// Samples a handful of questions per CEFR tier (ascending) for the placement
// quiz. Used to estimate a starting skill level for someone unsure where they fall.
export function buildPlacementQuiz(track, perTier = 2) {
  const flatBank = flattenBank(track.bank);
  const flatExtra = track.extraBank ? flattenPairs(track.extraBank, track.extraCatId) : [];
  const flatAll = flatBank.concat(flatExtra);
  const tiers = ["A2", "B1", "B2", "C1"];
  const quiz = [];
  tiers.forEach((tier) => {
    const items = flatAll.filter((i) => i.difficulty === tier);
    const picks = shuffle(items).slice(0, Math.min(perTier, items.length));
    picks.forEach((item) => quiz.push({ tier, ...shuffleOptions(item) }));
  });
  return quiz;
}

export function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

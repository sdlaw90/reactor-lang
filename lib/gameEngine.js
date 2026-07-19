// Generic engine shared by every track (Spanish-for-English-speakers,
// English-for-Spanish-speakers, or any future track). A "track" is a plain
// object shaped like the exports in data/tracks/*.js — see that folder for
// the concrete content. Nothing in this file is language-specific.

import { CEFR_ORDER } from "./skillLevels";
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
// #88/#89: `tagFor(prompt)` (optional, per-track) attaches a many-to-many
// `themes` list and a `grammar` (tense/mood) object onto each item. Untagged
// items get `themes: []` and `grammar: null`, so every consumer can read the
// fields uniformly and tracks without a tag layer are unaffected.
export function flattenBank(bank, tagFor) {
  const flat = [];
  Object.keys(bank).forEach((cat) => {
    bank[cat].forEach((q, i) => {
      // Slot 6 (promptNative) is an optional { en: "...", es: "..." } object —
      // a native-language rendering of the prompt shown as a small subtitle
      // under the question (distinct from slot 5's promptEn, which *replaces*
      // the prompt for cross-native viewers). Authored per-track during the
      // content-deepening passes; pages simply skip the subtitle when absent.
      const tag = tagFor ? tagFor(q[0]) : null;
      flat.push({ id: `${cat}-${i}`, cat, prompt: q[0], options: q[1], correctIdx: q[2], explain: q[3], difficulty: q[4] || null, promptEn: q[5] || null, promptNative: q[6] || null, themes: (tag && tag.themes) || [], grammar: (tag && tag.grammar) || null });
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
      promptEn: item.identifyPromptEn || null,
      promptNative: item.identifyPromptNative || null,
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
      promptEn: item.respondPromptEn ? item.respondPromptEn(item) : null,
      promptNative: item.respondPromptNative ? item.respondPromptNative(item) : null,
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

// Per-category mastery: how many of a track's own items has this person
// learned vs. how many exist in total, broken down by CEFR difficulty too so
// progress shows in smaller, less-daunting chunks. "Learned" here means seen
// at least once AND not currently sitting in the missed-questions pool —
// using data the app already tracks, rather than an external word-frequency
// list (which the app doesn't have access to).
export function computeMastery(track, seenAt, missedIds) {
  const flatBank = flattenBank(track.bank, track.tagFor);
  const flatExtra = track.extraBank ? flattenPairs(track.extraBank, track.extraCatId) : [];
  const flatAll = flatBank.concat(flatExtra);
  const missedSet = new Set(missedIds);

  const result = {};
  flatAll.forEach((item) => {
    if (!result[item.cat]) result[item.cat] = { total: 0, learned: 0, byDifficulty: {} };
    const bucket = result[item.cat];
    bucket.total += 1;

    const diff = item.difficulty || "—";
    if (!bucket.byDifficulty[diff]) bucket.byDifficulty[diff] = { total: 0, learned: 0 };
    bucket.byDifficulty[diff].total += 1;

    const seen = !!seenAt[item.id];
    const missed = missedSet.has(item.id);
    if (seen && !missed) {
      bucket.learned += 1;
      bucket.byDifficulty[diff].learned += 1;
    }
  });

  return result;
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
// #78 skill-bias de-weighting: items sort in three groups — at-level first,
// then ABOVE level (a slight stretch beats rehashing), then BELOW level
// (de-weighted hardest: a B1/B2 learner shouldn't get flooded with A1s just
// because the A1 bank is deep). Freshness breaks ties within each group, and
// untagged items count as at-level. Falls back gracefully — if there aren't
// enough items at the right level, off-level items still fill the round
// rather than leaving it short.
export function pickForLevelAndFreshness(items, seenAt, count, cefrSet) {
  if (!cefrSet) return pickFreshest(items, seenAt, count);
  const maxLevelIdx = Math.max(...cefrSet.map((c) => CEFR_ORDER.indexOf(c)));
  const groupOf = (item) => {
    if (!item.difficulty || cefrSet.includes(item.difficulty)) return 0; // at level
    return CEFR_ORDER.indexOf(item.difficulty) > maxLevelIdx ? 1 : 2; // above : below
  };
  const scored = items.map((item) => ({
    item,
    group: groupOf(item),
    seen: seenAt[item.id] || 0,
  }));
  scored.sort((a, b) => {
    if (a.group !== b.group) return a.group - b.group;
    return a.seen - b.seen;
  });
  const poolSize = Math.max(count, Math.ceil(scored.length / 2));
  const pool = scored.slice(0, poolSize).map((s) => s.item);
  return shuffle(pool).slice(0, count);
}

export function buildRound(track, mode, missedIds, seenAt, cefrSet, options = {}) {
  const flatBank = flattenBank(track.bank, track.tagFor);
  const flatExtra = track.extraBank ? flattenPairs(track.extraBank, track.extraCatId) : [];
  const flatAll = flatBank.concat(flatExtra);

  if (mode === "review") {
    const pool = flatAll.filter((item) => missedIds.includes(item.id));
    const picks = shuffle(pool).slice(0, Math.min(pool.length, 9));
    return picks.map((item) => shuffleOptions(item));
  }

  // #88 theme filter: pull every item tagged with the selected theme from ANY
  // category into one round. This deliberately overrides the category filter
  // (a theme cuts across categories) and still records to each item's HOME
  // category, so there's no separate theme mastery. Level/freshness bias still
  // applies. Falls back to a normal round if nothing is tagged for the theme.
  const themeFilter = options.themeFilter || null;
  const hasCategoryFilter = Array.isArray(options.categoryFilter) && options.categoryFilter.length > 0;
  if (themeFilter && !hasCategoryFilter) {
    const pool = flatAll.filter((item) => Array.isArray(item.themes) && item.themes.includes(themeFilter));
    if (pool.length > 0) {
      const count = Math.min(pool.length, 9);
      const picks = pickForLevelAndFreshness(pool, seenAt, count, cefrSet);
      return picks.map((item) => shuffleOptions(item));
    }
  }

  const perCat = options.perCat || track.perCat || 2;
  const extraPairsPerRound = options.extraPairs || track.extraPairsPerRound || 2;
  // categoryFilter is an array of selected category ids (e.g. ["vocab","fono"]).
  // Empty/undefined = "Mixto" (every category, the default). One or more
  // selected = pull only from that mix-and-match subset.
  const categoryFilter = Array.isArray(options.categoryFilter) ? options.categoryFilter : [];

  if (categoryFilter.length > 0) {
    const includesExtra = categoryFilter.includes(track.extraCatId);
    const normalCats = categoryFilter.filter((c) => c !== track.extraCatId);
    const bucketCount = normalCats.length + (includesExtra ? 1 : 0);
    const blocks = [];
    const perBucketCount = Math.max(2, Math.round(8 / bucketCount));

    normalCats.forEach((cat) => {
      const items = flatBank.filter((item) => item.cat === cat);
      const count = Math.min(perBucketCount, items.length);
      const picks = pickForLevelAndFreshness(items, seenAt, count, cefrSet);
      picks.forEach((item) => blocks.push([shuffleOptions(item)]));
    });

    if (includesExtra && track.extraBank && track.extraBank.length > 0) {
      const pseudoItems = track.extraBank.map((_, i) => ({
        id: `${track.extraCatId}-pair-${i}`,
        index: i,
        difficulty: track.extraBank[i].difficulty || null,
      }));
      const pairsCount = Math.max(1, Math.min(Math.round(perBucketCount / 2), track.extraBank.length));
      const picks = pickForLevelAndFreshness(pseudoItems, seenAt, pairsCount, cefrSet);
      picks.forEach(({ index }) => {
        blocks.push(buildPairRaw(track.extraBank, index, track.extraCatId).map((raw) => shuffleOptions(raw)));
      });
    }

    return shuffle(blocks).flat();
  }

  // Mixed mode (default): a bit of every CURATED category, plus a phonetics
  // pair, plus (#78) a CAPPED share of Word Bank items mixed in.
  //
  // #78 round draw pacing: the round size a person configured (perCat ×
  // curated categories + pairs) must not inflate just because a track gains
  // a huge Word Bank category. So the WB category (track.wbCatId) is pulled
  // OUT of the per-category loop, and WB items REPLACE a capped share of the
  // curated draw (default cap 30%, tunable via track.wbShareCap or
  // options.wbShareCap) instead of adding on top. Word Bank verdict
  // (2026-07-11): WB mixes into rounds — it never gets rounds to itself
  // unless the person explicitly picks it in the category filter above.
  const blocks = [];
  const wbCatId = track.wbCatId && track.bank[track.wbCatId] ? track.wbCatId : null;
  const curatedCats = Object.keys(track.bank).filter((cat) => cat !== wbCatId);
  const curatedPicks = [];

  curatedCats.forEach((cat) => {
    const items = flatBank.filter((item) => item.cat === cat);
    const picks = pickForLevelAndFreshness(items, seenAt, perCat, cefrSet);
    picks.forEach((item) => curatedPicks.push(item));
  });

  if (wbCatId) {
    const cap = options.wbShareCap ?? track.wbShareCap ?? 0.3;
    const wbItems = flatBank.filter((item) => item.cat === wbCatId);
    const wbCount = Math.min(Math.floor(curatedPicks.length * cap), wbItems.length);
    if (wbCount > 0) {
      // Replace, don't append: drop wbCount curated picks at random so the
      // round stays the configured size, then mix WB picks in.
      const kept = shuffle(curatedPicks).slice(0, curatedPicks.length - wbCount);
      const wbPicks = pickForLevelAndFreshness(wbItems, seenAt, wbCount, cefrSet);
      kept.forEach((item) => blocks.push([shuffleOptions(item)]));
      wbPicks.forEach((item) => blocks.push([shuffleOptions(item)]));
    } else {
      curatedPicks.forEach((item) => blocks.push([shuffleOptions(item)]));
    }
  } else {
    curatedPicks.forEach((item) => blocks.push([shuffleOptions(item)]));
  }

  if (track.extraBank && track.extraBank.length > 0) {
    const pseudoItems = track.extraBank.map((_, i) => ({
      id: `${track.extraCatId}-pair-${i}`,
      index: i,
      difficulty: track.extraBank[i].difficulty || null,
    }));
    const pairsPerRound = Math.min(extraPairsPerRound, track.extraBank.length);
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

export function timeFor(track, q, timerOverrides = {}) {
  const isExtra = track.extraCatId && q && q.cat === track.extraCatId;
  if (isExtra && timerOverrides.extraQuestionTime) return timerOverrides.extraQuestionTime;
  if (!isExtra && timerOverrides.questionTime) return timerOverrides.questionTime;
  if (isExtra) return track.extraQuestionTime || track.questionTime || 30;
  return track.questionTime || 30;
}

// Samples a handful of questions per CEFR tier (ascending) for the placement
// quiz. Used to estimate a starting skill level for someone unsure where they
// fall. Covers the full A1-C2 range so someone at either extreme (a true
// beginner, or someone who's actually fluent) gets placed correctly too, not
// just people who land in the B1-C1 middle.
export function buildPlacementQuiz(track, perTier = 3) {
  const flatBank = flattenBank(track.bank, track.tagFor);
  const flatExtra = track.extraBank ? flattenPairs(track.extraBank, track.extraCatId) : [];
  const flatAll = flatBank.concat(flatExtra);
  const tiers = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const quiz = [];
  tiers.forEach((tier) => {
    const items = flatAll.filter((i) => i.difficulty === tier);
    const picks = shuffle(items).slice(0, Math.min(perTier, items.length));
    picks.forEach((item) => quiz.push({ tier, ...shuffleOptions(item) }));
  });
  return quiz;
}

// Builds a full, ordered sequence of every item in one category for Lessons
// mode — easiest (by CEFR tier) first, in stable array order within a tier
// (not shuffled), rather than a small randomized round sample. This lets
// Lessons mode walk through a topic methodically instead of drawing a
// randomized subset like buildRound does for Quick Quiz mode.
export function buildLessonSequence(track, catId) {
  const isExtra = catId === track.extraCatId;
  const items = isExtra
    ? flattenPairs(track.extraBank, track.extraCatId)
    : flattenBank(track.bank, track.tagFor).filter((item) => item.cat === catId);

  const tierIndex = (item) => {
    const idx = CEFR_ORDER.indexOf(item.difficulty);
    return idx === -1 ? CEFR_ORDER.length : idx; // untagged items sort last
  };
  return [...items].sort((a, b) => tierIndex(a) - tierIndex(b)).map((item) => shuffleOptions(item));
}

export function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

// Streak milestones and their one-time bonus XP. Escalating rewards lean
// into approach-motivation (chasing the next reward) rather than
// loss-aversion (fear of losing what you have) -- decision confirmed: the
// streak itself never resets/breaks on a missed day, so milestones are the
// dopamine-driving mechanic instead of streak preservation anxiety.
export const STREAK_MILESTONES = [
  { days: 3, bonusXP: 25 },
  { days: 7, bonusXP: 50 },
  { days: 14, bonusXP: 100 },
  { days: 30, bonusXP: 250 },
  { days: 60, bonusXP: 500 },
  { days: 100, bonusXP: 1000 },
  { days: 180, bonusXP: 2000 },
  { days: 365, bonusXP: 5000 },
];

// Shared by both Quick Quiz and Lessons mode so the "never breaks" rule
// can't drift out of sync between the two. A missed day (or several) no
// longer resets the streak to 1 -- it simply holds steady at its current
// value (you don't get credit for days you didn't play, but you don't lose
// what you'd already built either), then resumes climbing on the next
// genuinely consecutive day. Returns the new streak plus milestone info if
// this update just crossed one, so the caller can show a celebration.
export function computeStreakUpdate(progress, today) {
  let newStreak = progress.streak;
  let milestone = null;

  if (progress.last_played !== today) {
    if (progress.last_played) {
      const last = new Date(progress.last_played);
      const diffDays = Math.round((new Date(today) - last) / 86400000);
      newStreak = diffDays === 1 ? progress.streak + 1 : progress.streak;
    } else {
      newStreak = 1;
    }
    const crossed = STREAK_MILESTONES.find((m) => progress.streak < m.days && newStreak >= m.days);
    if (crossed) milestone = crossed;
  }

  return { newStreak, milestone };
}

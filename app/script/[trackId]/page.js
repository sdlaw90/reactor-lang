"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import { supabase } from "../../../lib/supabaseClient";
import { getTrack } from "../../../data/tracks";
import { scriptForTrack, glyphPracticeId } from "../../../data/scripts";
import { shuffle } from "../../../lib/gameEngine";
import { loadSeenAt, markSeen, loadMissedIds, addMissed, resolveMissed } from "../../../lib/db";
import { t } from "../../../lib/playStrings";
import ModeToggle from "../../../lib/ModeToggle";
import { TRACK_THEMES, animatedBackgroundStyle } from "../../../lib/theme";
import { trackDisplayName } from "../../../lib/languageNames";

// #62 — the generic writing-system teaching block (kana pilots it; hangul,
// Cyrillic, and the Mandarin curated set are future data files in
// data/scripts, no page changes needed).
//
// Design rules (decisions 2026-07-11):
//   * NEVER a blocker — this is a third mode reachable from the toggle;
//     regular content doesn't gate on it.
//   * Own lane — no XP, no streaks, no progress-table writes, nothing that
//     can be "lost." Per-glyph familiarity rides the existing seen/missed
//     tables under namespaced ids ("script-..."), which the round engine and
//     mastery tracker never look at. A missed glyph just stays unfamiliar
//     until it's answered right — never-punish by construction.
//   * Chrome renders in the viewer's NATIVE language — the audience by
//     definition can't read the target script yet.
//
// Two tabs per system: Learn (charts, grouped, with familiarity counts) and
// Practice (short 8-question quizzes over whichever groups are selected,
// both directions: glyph→sound and sound→glyph).

const QUIZ_LENGTH = 8;

function buildScriptQuiz(system, groupIds) {
  const groups = system.groups.filter((g) => groupIds.length === 0 || groupIds.includes(g.id));
  const pool = [];
  groups.forEach((g) => {
    g.glyphs.forEach(([glyph, roman], i) => {
      pool.push({ id: glyphPracticeId(system.id, g.id, i), glyph, roman, groupId: g.id });
    });
  });
  if (pool.length < 4) return [];

  const questions = shuffle(pool).slice(0, Math.min(QUIZ_LENGTH, pool.length)).map((item) => {
    // Distractors: same group first (visually/aurally closest — the real
    // confusions), padded from the whole selected pool if the group is small.
    const sameGroup = pool.filter((p) => p.groupId === item.groupId && p.id !== item.id);
    const others = pool.filter((p) => p.groupId !== item.groupId);
    const candidates = shuffle(sameGroup).concat(shuffle(others));
    const distractors = [];
    const usedRomans = new Set([item.roman]);
    const usedGlyphs = new Set([item.glyph]);
    for (const c of candidates) {
      if (distractors.length === 3) break;
      if (usedRomans.has(c.roman) || usedGlyphs.has(c.glyph)) continue;
      usedRomans.add(c.roman);
      usedGlyphs.add(c.glyph);
      distractors.push(c);
    }
    const direction = Math.random() < 0.5 ? "toSound" : "toGlyph";
    const options = shuffle([item, ...distractors]);
    return {
      id: item.id,
      direction,
      prompt: direction === "toSound" ? item.glyph : item.roman,
      options: options.map((o) => (direction === "toSound" ? o.roman : o.glyph)),
      correctIdx: options.findIndex((o) => o.id === item.id),
    };
  });
  return questions;
}

export default function ScriptPracticePage({ params }) {
  const router = useRouter();
  const track = getTrack(params.trackId);
  const script = track ? scriptForTrack(track.id) : null;

  const [userId, setUserId] = useState(null);
  const [nativeLang, setNativeLang] = useState(null);
  const [systemId, setSystemId] = useState(script?.systems[0]?.id || null);
  const [tab, setTab] = useState("learn"); // learn | practice | done
  const [groupIds, setGroupIds] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [seenAt, setSeenAt] = useState({});
  const [missedIds, setMissedIds] = useState([]);

  const T = (key, vars) => t(nativeLang || track?.nativeLang || "en", key, vars);
  const L = (obj) => (obj && (obj[nativeLang] || obj.en)) || "";

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/auth");
        return;
      }
      setUserId(data.session.user.id);
      setNativeLang(data.session.user.user_metadata?.native_lang || null);
      try {
        const [seen, missed] = await Promise.all([
          loadSeenAt(data.session.user.id, track.id),
          loadMissedIds(data.session.user.id, track.id),
        ]);
        setSeenAt(seen);
        setMissedIds(missed);
      } catch (e) {
        console.error("script practice: failed to load familiarity", e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const system = useMemo(() => script?.systems.find((s) => s.id === systemId) || null, [script, systemId]);

  const familiarIn = (group) => {
    let n = 0;
    group.glyphs.forEach((_, i) => {
      const id = glyphPracticeId(system.id, group.id, i);
      if (seenAt[id] && !missedIds.includes(id)) n += 1;
    });
    return n;
  };

  if (!track || !script) {
    return (
      <div style={styles.bg}>
        <p style={{ color: "#FF7B8A" }}>No script practice for this track.</p>
      </div>
    );
  }

  const startPractice = () => {
    const q = buildScriptQuiz(system, groupIds);
    if (q.length === 0) return;
    setQuiz(q);
    setQIndex(0);
    setSelected(null);
    setFeedback(null);
    setSessionCorrect(0);
    setTab("practice");
  };

  const answer = async (optIdx) => {
    if (feedback) return;
    const q = quiz[qIndex];
    const isCorrect = optIdx === q.correctIdx;
    setSelected(optIdx);
    setFeedback(isCorrect ? "correct" : "wrong");
    if (isCorrect) setSessionCorrect((c) => c + 1);

    // Familiarity bookkeeping — same tables the quiz uses, namespaced ids.
    // Fire-and-forget with local state kept in sync; a network hiccup here
    // never interrupts practice.
    try {
      if (userId) {
        markSeen(userId, track.id, [q.id]).catch(() => {});
        setSeenAt((prev) => ({ ...prev, [q.id]: Date.now() }));
        if (isCorrect) {
          if (missedIds.includes(q.id)) {
            resolveMissed(userId, track.id, q.id).catch(() => {});
            setMissedIds((prev) => prev.filter((id) => id !== q.id));
          }
        } else {
          if (!missedIds.includes(q.id)) {
            addMissed(userId, track.id, q.id).catch(() => {});
            setMissedIds((prev) => [...prev, q.id]);
          }
        }
      }
    } catch {
      // never let bookkeeping break practice
    }

    setTimeout(() => {
      if (qIndex + 1 < quiz.length) {
        setQIndex((i) => i + 1);
        setSelected(null);
        setFeedback(null);
      } else {
        setTab("done");
      }
    }, 750);
  };

  const toggleGroup = (gid) =>
    setGroupIds((prev) => (prev.includes(gid) ? prev.filter((g) => g !== gid) : [...prev, gid]));

  const trackTheme = TRACK_THEMES[track.theme];

  return (
    <div style={styles.bg}>
      {trackTheme && <div style={animatedBackgroundStyle(trackTheme.gradient)} />}
      <div style={styles.container}>
        <div style={styles.hudRow}>
          <button className="rj" style={styles.backBtn} onClick={() => router.push(`/play/${track.id}`)}>
            ← {T("exit")}
          </button>
        </div>

        <div style={styles.header}>
          <h1 className="rj" style={styles.title}>{trackDisplayName(track, nativeLang)}</h1>
          <p style={styles.subtitle}>{script.name}</p>
        </div>

        <ModeToggle
          trackId={track.id}
          active="script"
          quickQuizLabel={T("modeQuickQuiz")}
          lessonsLabel={T("modeLessons")}
          scriptLabel={script.name}
        />

        {tab === "learn" && (
          <>
            <p style={styles.intro}>{L(script.intro)}</p>

            <div style={styles.systemToggle}>
              {script.systems.map((s) => (
                <button
                  key={s.id}
                  className="rj"
                  style={{ ...styles.systemBtn, ...(s.id === systemId ? styles.systemBtnActive : {}) }}
                  onClick={() => {
                    setSystemId(s.id);
                    setGroupIds([]);
                  }}
                >
                  {s.name}
                </button>
              ))}
            </div>
            <p style={styles.blurb}>{L(system.blurb)}</p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
              <button
                className="rj"
                style={{ ...styles.groupChip, borderColor: groupIds.length === 0 ? "#FF8FB1" : "#3A3452", color: groupIds.length === 0 ? "#FF8FB1" : "#B4ABC9" }}
                onClick={() => setGroupIds([])}
              >
                {T("scriptAllGroups")}
              </button>
              {system.groups.map((g) => (
                <button
                  key={g.id}
                  className="rj"
                  style={{ ...styles.groupChip, borderColor: groupIds.includes(g.id) ? "#B98EFF" : "#3A3452", color: groupIds.includes(g.id) ? "#B98EFF" : "#B4ABC9" }}
                  onClick={() => toggleGroup(g.id)}
                >
                  {g.title}
                </button>
              ))}
            </div>

            <button className="rj" style={styles.primaryBtn} onClick={startPractice}>
              {T("scriptCheckAnswers")}
            </button>

            {system.groups
              .filter((g) => groupIds.length === 0 || groupIds.includes(g.id))
              .map((g) => (
                <div key={g.id} style={styles.groupCard}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span className="rj" style={styles.groupTitle}>{g.title}</span>
                    <span className="jm" style={styles.familiar}>
                      {T("scriptFamiliar", { n: familiarIn(g), total: g.glyphs.length })}
                    </span>
                  </div>
                  <div style={styles.glyphGrid}>
                    {g.glyphs.map(([glyph, roman], i) => {
                      const id = glyphPracticeId(system.id, g.id, i);
                      const familiar = seenAt[id] && !missedIds.includes(id);
                      return (
                        <div key={i} style={{ ...styles.glyphCell, borderColor: familiar ? "#5EE0A0" : "#3A3452" }}>
                          <div style={styles.glyph}>{glyph}</div>
                          <div className="jm" style={styles.roman}>{roman}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
          </>
        )}

        {tab === "practice" && quiz && (
          <>
            <p style={{ color: "#9B93B8", fontSize: 12 }} className="jm">
              {qIndex + 1} / {quiz.length} · {T("placementNoTimer")}
            </p>
            <div style={{ ...styles.card, borderColor: feedback === "correct" ? "#5EE0A0" : feedback === "wrong" ? "#FF7B8A" : "#3A3452" }}>
              <p style={styles.practiceLabel}>
                {quiz[qIndex].direction === "toSound" ? T("scriptWhichSound") : T("scriptWhichGlyph")}
              </p>
              <p style={quiz[qIndex].direction === "toSound" ? styles.bigGlyph : styles.bigRoman} className={quiz[qIndex].direction === "toSound" ? undefined : "rj"}>
                {quiz[qIndex].prompt}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {quiz[qIndex].options.map((opt, i) => {
                  let bg = "#171423";
                  let border = "#3A3452";
                  if (feedback) {
                    if (i === quiz[qIndex].correctIdx) {
                      bg = "#1B3A2A";
                      border = "#5EE0A0";
                    } else if (i === selected) {
                      bg = "#3A1B1F";
                      border = "#FF7B8A";
                    }
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => answer(i)}
                      disabled={!!feedback}
                      className="rj"
                      style={{ ...styles.optionBtn, background: bg, borderColor: border, fontSize: quiz[qIndex].direction === "toGlyph" ? 24 : 15 }}
                    >
                      <span>{opt}</span>
                      {feedback && i === quiz[qIndex].correctIdx && <Check size={16} color="#5EE0A0" />}
                      {feedback && i === selected && i !== quiz[qIndex].correctIdx && <X size={16} color="#FF7B8A" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {tab === "done" && quiz && (
          <div style={{ ...styles.card, textAlign: "center" }}>
            <h2 className="rj" style={{ color: "#F3F0FA", fontSize: 22, marginTop: 0 }}>
              {T("scriptRoundDone")}
            </h2>
            <p className="jm" style={{ color: "#5EE0A0", fontSize: 26, fontWeight: 700, margin: "6px 0 14px" }}>
              {sessionCorrect}/{quiz.length}
            </p>
            <button className="rj" style={styles.primaryBtn} onClick={startPractice}>
              {T("scriptGoAgain")}
            </button>
            <button className="rj" style={styles.secondaryBtn} onClick={() => setTab("learn")}>
              {T("scriptBackToLearn")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  bg: { position: "relative", minHeight: "100vh", width: "100%", display: "flex", justifyContent: "center", padding: "24px 16px 60px", background: "#171423", overflow: "hidden" },
  container: { position: "relative", zIndex: 1, width: "100%", maxWidth: 480 },
  hudRow: { display: "flex", alignItems: "center", marginBottom: 16 },
  header: { marginBottom: 18 },
  title: { fontSize: 22, fontWeight: 700, color: "#F3F0FA", margin: "0 0 4px", textAlign: "center" },
  subtitle: { color: "#B98EFF", fontSize: 13, fontWeight: 600, margin: 0, textAlign: "center" },
  backBtn: { background: "rgba(255,143,177,0.12)", color: "#FF8FB1", border: "1px solid #FF8FB1", borderRadius: 8, padding: "7px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer" },
  intro: { color: "#B4ABC9", fontSize: 13.5, lineHeight: 1.6, marginBottom: 16 },
  systemToggle: { display: "flex", gap: 8, marginBottom: 10 },
  systemBtn: { flex: 1, background: "#221E33", color: "#B4ABC9", border: "1px solid #3A3452", borderRadius: 10, padding: "10px 8px", fontSize: 14, fontWeight: 700, cursor: "pointer" },
  systemBtnActive: { borderColor: "#FF8FB1", color: "#FF8FB1" },
  blurb: { color: "#9B93B8", fontSize: 12.5, lineHeight: 1.5, marginBottom: 14 },
  groupChip: { background: "transparent", border: "1px solid", borderRadius: 999, padding: "5px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer" },
  groupCard: { background: "#221E33", border: "1px solid #3A3452", borderRadius: 12, padding: "14px 14px 10px", marginTop: 12 },
  groupTitle: { color: "#F3F0FA", fontSize: 14, fontWeight: 700 },
  familiar: { color: "#9B93B8", fontSize: 11 },
  glyphGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(58px, 1fr))", gap: 8, marginTop: 10 },
  glyphCell: { background: "#171423", border: "1px solid", borderRadius: 8, padding: "8px 4px", textAlign: "center" },
  glyph: { color: "#F3F0FA", fontSize: 22, lineHeight: 1.2 },
  roman: { color: "#9B93B8", fontSize: 10.5, marginTop: 3 },
  card: { background: "#221E33", border: "1px solid", borderRadius: 16, padding: "22px 20px", marginTop: 8 },
  practiceLabel: { color: "#9B93B8", fontSize: 13, marginTop: 0, marginBottom: 10 },
  bigGlyph: { color: "#F3F0FA", fontSize: 56, textAlign: "center", margin: "6px 0 18px", lineHeight: 1.2 },
  bigRoman: { color: "#F3F0FA", fontSize: 34, fontWeight: 700, textAlign: "center", margin: "10px 0 18px" },
  optionBtn: { border: "1px solid", borderRadius: 10, padding: "12px 14px", fontWeight: 600, color: "#F3F0FA", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" },
  primaryBtn: { width: "100%", background: "#FF8FB1", color: "#171423", border: "none", borderRadius: 10, padding: "13px", fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 4 },
  secondaryBtn: { width: "100%", background: "transparent", color: "#B4ABC9", border: "1px solid #3A3452", borderRadius: 10, padding: "10px", fontSize: 13, fontWeight: 600, cursor: "pointer", marginTop: 8 },
};

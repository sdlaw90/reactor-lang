"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, ChevronRight, ChevronDown, RotateCcw, Info } from "lucide-react";
import { supabase } from "../../../lib/supabaseClient";
import { getTrack } from "../../../data/tracks";
import { TRACK_THEMES, animatedBackgroundStyle } from "../../../lib/theme";
import { buildLessonSequence, computeMastery, todayStr, computeStreakUpdate } from "../../../lib/gameEngine";
import { uiLangForSkill, t, categoryDisplayName } from "../../../lib/playStrings";
import ModeToggle from "../../../lib/ModeToggle";
import { trackDisplayName } from "../../../lib/languageNames";
import StreakMilestoneCelebration from "../../../lib/StreakMilestoneCelebration";
import {
  loadProgress,
  saveProgress,
  loadMissedIds,
  addMissed,
  resolveMissed,
  loadSeenAt,
  markSeen,
  insertExplanations,
} from "../../../lib/db";

const XP_PER_CORRECT = 10; // flat, on purpose -- no combo mechanic in Lessons mode

export default function LessonsPage({ params }) {
  const router = useRouter();
  const track = getTrack(params.trackId);

  const [session, setSession] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(null);
  const [missedIds, setMissedIds] = useState([]);
  const [seenAt, setSeenAt] = useState({});

  const [screen, setScreen] = useState("start"); // start | lesson | complete
  const [selectedCat, setSelectedCat] = useState(null);
  const [sequence, setSequence] = useState([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionXP, setSessionXP] = useState(0);
  const [streakApplied, setStreakApplied] = useState(false);
  const [milestoneHit, setMilestoneHit] = useState(null);
  const [showPageHelp, setShowPageHelp] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/auth");
        return;
      }
      setSession(data.session);
      setUserId(data.session.user.id);
      const [p, missed, seen] = await Promise.all([
        loadProgress(data.session.user.id, params.trackId),
        loadMissedIds(data.session.user.id, params.trackId),
        loadSeenAt(data.session.user.id, params.trackId),
      ]);
      setProgress(p);
      setMissedIds(missed);
      setSeenAt(seen);
      setLoaded(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.trackId]);

  if (!track) {
    return (
      <div style={styles.bg}>
        <p style={{ color: "#FF7B8A" }}>Unknown track: {params.trackId}</p>
      </div>
    );
  }

  const viewerNativeLang = session?.user?.user_metadata?.native_lang;
  const useAltPrompt = viewerNativeLang === "en" && track.nativeLang !== "en";
  const displayPrompt = (q) => (useAltPrompt && q.promptEn ? q.promptEn : q.prompt);
  const displayCatLabel = (catId) => categoryDisplayName(uiLang, viewerNativeLang, track, catId);
  const uiLang = progress ? uiLangForSkill(progress.skill_level, viewerNativeLang, track) : "en";
  const T = (key, vars) => t(uiLang, key, vars);
  // Native-language subtitle under the question — same rule as Quick Quiz:
  // shown while the chrome is in the viewer's native language, hidden at
  // Advanced/Native (immersive), skipped when unauthored or duplicative.
  const displayPromptNative = (q) => {
    if (!q.promptNative) return null;
    const nativeLang = viewerNativeLang || track.nativeLang;
    if (uiLang !== nativeLang) return null;
    const txt = q.promptNative[nativeLang] || q.promptNative[track.nativeLang];
    return txt && txt !== displayPrompt(q) ? txt : null;
  };

  if (!loaded || !progress) {
    return (
      <div style={styles.bg}>
        <p style={{ color: "#7C7395" }} className="jm">
          {T("loading")}
        </p>
      </div>
    );
  }

  const mastery = computeMastery(track, seenAt, missedIds);

  const startLesson = (catId) => {
    const seq = buildLessonSequence(track, catId);
    setSelectedCat(catId);
    setSequence(seq);
    setIndex(0);
    setSelected(null);
    setAnswered(false);
    setSessionCorrect(0);
    setSessionXP(0);
    setScreen("lesson");
  };

  const q = sequence[index];

  const handleAnswer = async (i) => {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    const isCorrect = i === q.correctIdx;

    // Build the updated progress incrementally and save immediately, the
    // same way Quick Quiz mode does -- this was a real bug: previously XP
    // (and streak) only saved once, at full lesson completion, so stopping
    // partway through (which the app is explicitly designed to allow)
    // silently lost any progress already earned.
    let nextProgress = progress;
    if (!streakApplied) {
      const today = todayStr();
      const { newStreak, milestone } = computeStreakUpdate(progress, today);
      nextProgress = { ...nextProgress, streak: newStreak, last_played: today };
      if (milestone) {
        nextProgress = { ...nextProgress, xp: nextProgress.xp + milestone.bonusXP };
        setMilestoneHit(milestone);
      }
      setStreakApplied(true);
    }

    if (isCorrect) {
      const totalXP = nextProgress.xp + XP_PER_CORRECT;
      nextProgress = { ...nextProgress, xp: totalXP, level: Math.floor(totalXP / 100) + 1 };
      setSessionCorrect((c) => c + 1);
      setSessionXP((xp) => xp + XP_PER_CORRECT);
      if (missedIds.includes(q.id)) {
        resolveMissed(userId, track.id, q.id).catch((e) => console.error("resolveMissed failed", e));
        setMissedIds((prev) => prev.filter((id) => id !== q.id));
      }
    } else {
      if (!missedIds.includes(q.id)) {
        addMissed(userId, track.id, q.id).catch((e) => console.error("addMissed failed", e));
        setMissedIds((prev) => [...prev, q.id]);
      }
    }
    setProgress(nextProgress);
    saveProgress(userId, track.id, nextProgress).catch((e) => console.error("saveProgress failed", e));

    markSeen(userId, track.id, [q.id]).catch((e) => console.error("markSeen failed", e));
    setSeenAt((prev) => ({ ...prev, [q.id]: Date.now() }));
    insertExplanations(userId, track.id, [
      {
        cat: q.cat,
        prompt: q.prompt,
        options: q.options,
        correct_idx: q.correctIdx,
        selected_idx: i,
        is_correct: isCorrect,
        sound: q.sound || null,
        explain_en: q.explain?.en || "",
        explain_es: q.explain?.es || "",
      },
    ]).catch((e) => console.error("insertExplanations failed", e));
  };

  const handleNext = async () => {
    if (index + 1 < sequence.length) {
      setIndex((i) => i + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      // XP/streak are already saved incrementally above -- only
      // rounds_completed still needs finalizing, since a "round" here means
      // an actually-finished lesson, not a partial one.
      const next = { ...progress, rounds_completed: progress.rounds_completed + 1 };
      setProgress(next);
      saveProgress(userId, track.id, next).catch((e) => console.error("saveProgress failed", e));
      setScreen("complete");
    }
  };

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

        {screen === "start" && (
          <div style={styles.centerCol} className="fadein">
            <h1 className="rj" style={styles.title}>
              {trackDisplayName(track, viewerNativeLang)}
            </h1>
            <p style={styles.subtitle}>Lessons mode — no timer, step by step.</p>

            <ModeToggle trackId={track.id} active="lessons" quickQuizLabel={T("modeQuickQuiz")} lessonsLabel={T("modeLessons")} />

            <button className="rj" style={styles.pageHelpToggle} onClick={() => setShowPageHelp((v) => !v)}>
              <Info size={16} />
              <span style={{ flex: 1, textAlign: "left" }}>What's on this page?</span>
              <ChevronDown size={16} style={{ transform: showPageHelp ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
            </button>
            {showPageHelp && (
              <div style={styles.pageHelpBox}>
                <p style={styles.pageHelpLine}>Pick a topic below to work through it, easiest items first.</p>
                <p style={styles.pageHelpLine}>
                  The number next to each topic (like "3/12") shows how many items you've already learned there.
                </p>
                <p style={styles.pageHelpLine}>
                  No timer, no combo scoring here — answer at your own pace, and the explanation shows right
                  after each question.
                </p>
              </div>
            )}

            <p style={{ ...styles.chooseText }}>{T("chooseLesson")}</p>
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
              {Object.keys(track.cats).map((catId) => {
                const m = mastery[catId];
                return (
                  <button key={catId} className="rj" style={styles.lessonCard} onClick={() => startLesson(catId)}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: track.cats[catId].color, fontWeight: 700 }}>{displayCatLabel(catId)}</span>
                      {m && (
                        <span className="jm" style={{ color: "#7C7395", fontSize: 12 }}>
                          {m.learned}/{m.total}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {screen === "lesson" && q && (
          <div style={styles.centerCol} className="fadein">
            <p className="jm" style={styles.itemProgress}>
              {T("itemProgress", { current: index + 1, total: sequence.length })}
            </p>
            <div className="rj" style={{ ...styles.catTag, color: track.cats[q.cat].color, borderColor: track.cats[q.cat].color }}>
              {displayCatLabel(q.cat)}
            </div>
            <p style={styles.prompt}>{displayPrompt(q)}</p>
            {displayPromptNative(q) && <p style={styles.promptNative}>{displayPromptNative(q)}</p>}

            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
              {q.options.map((opt, i) => {
                let bg = "#221E33";
                let border = "#3A3452";
                let borderWidth = 1;
                let textColor = "#F3F0FA";
                if (answered) {
                  if (i === q.correctIdx) {
                    bg = "#0F3324";
                    border = "#5EE0A0";
                    borderWidth = 3;
                    textColor = "#B9FFDA";
                  } else if (i === selected) {
                    bg = "#4A1E24";
                    border = "#FF7B8A";
                    borderWidth = 3;
                    textColor = "#FFC7CD";
                  }
                }
                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    disabled={answered}
                    className="rj"
                    style={{ ...styles.optionBtn, background: bg, borderColor: border, borderWidth, color: textColor }}
                  >
                    <span>{opt}</span>
                    {answered && i === q.correctIdx && <Check size={20} color="#5EE0A0" strokeWidth={3} />}
                    {answered && i === selected && i !== q.correctIdx && <X size={20} color="#FF7B8A" strokeWidth={3} />}
                  </button>
                );
              })}
            </div>

            {answered && q.explain && (
              <div style={styles.explainBox}>
                <div style={styles.explainLangRow}>
                  <span style={styles.explainLangTag}>EN</span>
                  <p style={styles.explainText}>{q.explain.en}</p>
                </div>
                <div style={{ ...styles.explainLangRow, marginTop: 8 }}>
                  <span style={styles.explainLangTag}>ES</span>
                  <p style={styles.explainText}>{q.explain.es}</p>
                </div>
              </div>
            )}

            {answered && (
              <button className="rj" style={styles.nextBtn} onClick={handleNext}>
                {T("next")} <ChevronRight size={18} style={{ verticalAlign: "middle" }} />
              </button>
            )}
          </div>
        )}

        {screen === "complete" && (
          <div style={styles.centerCol} className="fadein">
            <h2 className="rj" style={styles.title}>
              {T("lessonComplete")}
            </h2>
            <div style={styles.statRow} className="jm">
              <StatChip label={T("statCorrect")} value={`${sessionCorrect}/${sequence.length}`} color="#5EE0A0" />
              <StatChip label={T("statXpEarned")} value={`+${sessionXP}`} color="#3DDBFF" />
            </div>
            <button className="rj" style={styles.primaryBtn} onClick={() => startLesson(selectedCat)}>
              <RotateCcw size={18} style={{ verticalAlign: "middle", marginRight: 8 }} />
              {T("startLesson")}
            </button>
            <button className="rj" style={styles.secondaryBtn} onClick={() => setScreen("start")}>
              {T("backToLessons")}
            </button>
          </div>
        )}
      </div>
      <StreakMilestoneCelebration milestone={milestoneHit} onClose={() => setMilestoneHit(null)} />
    </div>
  );
}

function StatChip({ label, value, color }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 20, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 11, color: "#7C7395", marginTop: 2 }}>{label}</div>
    </div>
  );
}

const styles = {
  pageHelpToggle: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "rgba(61,219,255,0.1)",
    color: "#3DDBFF",
    border: "1px solid #3DDBFF",
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    padding: "12px 14px",
    marginBottom: 12,
  },
  pageHelpBox: {
    width: "100%",
    background: "#1C1830",
    border: "1px solid #3A3452",
    borderRadius: 10,
    padding: "12px 14px",
    marginBottom: 16,
  },
  pageHelpLine: { color: "#B4ABC9", fontSize: 12.5, lineHeight: 1.5, margin: "0 0 6px", textAlign: "left" },
  bg: { position: "relative", minHeight: "100vh", width: "100%", background: "#171423", display: "flex", justifyContent: "center", overflow: "hidden" },
  container: { position: "relative", zIndex: 1, width: "100%", maxWidth: 480, padding: "20px 20px 60px" },
  hudRow: { display: "flex", alignItems: "center", marginBottom: 16 },
  backBtn: {
    background: "rgba(255,143,177,0.12)",
    color: "#FF8FB1",
    border: "1px solid #FF8FB1",
    borderRadius: 8,
    padding: "7px 14px",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
  },
  centerCol: { display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" },
  title: { fontSize: 22, fontWeight: 700, color: "#F3F0FA", margin: "0 0 4px" },
  subtitle: { color: "#B98EFF", fontSize: 13, fontWeight: 600, marginBottom: 24 },
  chooseText: { color: "#7C7395", fontSize: 13, marginBottom: 10, alignSelf: "flex-start" },
  lessonCard: {
    width: "100%",
    background: "#221E33",
    border: "1px solid #3A3452",
    borderRadius: 12,
    padding: "14px 16px",
    cursor: "pointer",
    textAlign: "left",
  },
  switchModeBtn: {
    marginTop: 26,
    background: "transparent",
    color: "#7C7395",
    border: "none",
    fontSize: 12.5,
    cursor: "pointer",
    textDecoration: "underline",
  },
  itemProgress: { color: "#7C7395", fontSize: 12, marginBottom: 10 },
  catTag: {
    display: "inline-block",
    fontSize: 11,
    fontWeight: 700,
    padding: "4px 10px",
    borderRadius: 999,
    border: "1px solid",
    marginBottom: 12,
  },
  prompt: { fontSize: 18, fontWeight: 600, color: "#F3F0FA", lineHeight: 1.4, marginBottom: 4 },
  promptNative: { fontSize: 13, fontWeight: 400, lineHeight: 1.45, margin: "0 0 4px", color: "#9B93B8" },
  optionBtn: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 16px",
    borderRadius: 12,
    border: "1px solid",
    cursor: "pointer",
    fontSize: 14.5,
    textAlign: "left",
  },
  explainBox: { width: "100%", background: "#1C1830", border: "1px solid #3A3452", borderRadius: 12, padding: 14, marginTop: 16 },
  explainLangRow: { display: "flex", gap: 8, alignItems: "flex-start" },
  explainLangTag: {
    fontSize: 10,
    fontWeight: 800,
    color: "#7C7395",
    background: "#171423",
    borderRadius: 6,
    padding: "2px 6px",
    flexShrink: 0,
  },
  explainText: { fontSize: 13, color: "#B4ABC9", lineHeight: 1.5, margin: 0, textAlign: "left" },
  nextBtn: {
    marginTop: 18,
    width: "100%",
    background: "#FF8FB1",
    color: "#171423",
    border: "none",
    borderRadius: 12,
    padding: "14px",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
  },
  statRow: { display: "flex", gap: 32, marginBottom: 24 },
  primaryBtn: {
    width: "100%",
    background: "#FF8FB1",
    color: "#171423",
    border: "none",
    borderRadius: 12,
    padding: "14px",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    marginBottom: 10,
  },
  secondaryBtn: {
    width: "100%",
    background: "transparent",
    color: "#B4ABC9",
    border: "1px solid #3A3452",
    borderRadius: 12,
    padding: "12px",
    fontSize: 14,
    cursor: "pointer",
  },
};

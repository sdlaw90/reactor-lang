"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Flame, Zap, Check, X, ChevronRight, RotateCcw, Trophy } from "lucide-react";
import { supabase } from "../../../lib/supabaseClient";
import { getTrack } from "../../../data/tracks";
import { TRACK_THEMES, animatedBackgroundStyle } from "../../../lib/theme";
import {
  buildRound,
  seenIdsForRound,
  timeFor,
  todayStr,
} from "../../../lib/gameEngine";
import { cefrSetForSkillLevel, nextSkillLevel, readyToAdvance, skillLevelInfo, SKILL_LEVELS } from "../../../lib/skillLevels";
import {
  loadProgress,
  saveProgress,
  loadMissedIds,
  addMissed,
  resolveMissed,
  loadSeenAt,
  markSeen,
  insertExplanations,
  fetchRecentExplanations,
  fetchArchivedExplanations,
  countArchivedExplanations,
  clearExplanations,
} from "../../../lib/db";

export default function PlayPage({ params }) {
  const router = useRouter();
  const track = getTrack(params.trackId);

  const [userId, setUserId] = useState(null);
  const [session, setSession] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [screen, setScreen] = useState("start"); // start | playing | result | explain | archive
  const [progress, setProgress] = useState({
    xp: 0,
    level: 1,
    streak: 0,
    best_combo: 0,
    last_played: null,
    rounds_completed: 0,
    skill_level: "none",
    level_correct_count: 0,
    level_total_count: 0,
  });
  const [missedIds, setMissedIds] = useState([]);
  const [seenAt, setSeenAt] = useState({});
  const [explanationLog, setExplanationLog] = useState([]);
  const [archiveLog, setArchiveLog] = useState([]);
  const [archiveCount, setArchiveCount] = useState(0);
  const [archiveLoading, setArchiveLoading] = useState(false);
  const [showLevelPicker, setShowLevelPicker] = useState(false);
  const [advanceDismissed, setAdvanceDismissed] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState(null); // null = mixed
  const [awaitingNext, setAwaitingNext] = useState(false); // review-mode: paused after answer, waiting for "Next"

  const [round, setRound] = useState([]);
  const [roundMode, setRoundMode] = useState("daily");
  const [qIndex, setQIndex] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [feedback, setFeedback] = useState(null);
  const [selected, setSelected] = useState(null);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionXP, setSessionXP] = useState(0);
  const [resolvedCount, setResolvedCount] = useState(0);
  const [sessionLog, setSessionLog] = useState([]);

  const timerRef = useRef(null);
  const newlyMissed = useRef(new Set());
  const newlyResolved = useRef(new Set());
  const levelAnswered = useRef({ correct: 0, total: 0 });

  // ---- auth + initial load ----
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/auth");
        return;
      }
      const uid = data.session.user.id;
      setUserId(uid);
      setSession(data.session);
      const [p, missed, seen, recent] = await Promise.all([
        loadProgress(uid, track.id),
        loadMissedIds(uid, track.id),
        loadSeenAt(uid, track.id),
        fetchRecentExplanations(uid, track.id),
      ]);
      setProgress(p);
      setMissedIds(missed);
      setSeenAt(seen);
      setExplanationLog(recent);
      setLoaded(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const reviewMode = session?.user?.user_metadata?.review_mode ?? false;
  const roundSettings = session?.user?.user_metadata?.round_settings || {};
  const buildOptions = { perCat: roundSettings.perCat, extraPairs: roundSettings.extraPairs, categoryFilter };
  const timerOverrides = { questionTime: roundSettings.questionTime, extraQuestionTime: roundSettings.extraQuestionTime };

  const startRound = (mode = "daily") => {
    newlyMissed.current = new Set();
    newlyResolved.current = new Set();
    levelAnswered.current = { correct: 0, total: 0 };
    setRoundMode(mode);
    const cefrSet = mode === "daily" ? cefrSetForSkillLevel(progress.skill_level) : null;
    const newRound = buildRound(track, mode, missedIds, seenAt, cefrSet, mode === "daily" ? buildOptions : {});
    setRound(newRound);

    if (mode === "daily") {
      const ids = seenIdsForRound(newRound, track.extraCatId);
      const now = Date.now();
      const updated = { ...seenAt };
      ids.forEach((id) => (updated[id] = now));
      setSeenAt(updated);
      markSeen(userId, track.id, ids).catch((e) => console.error("markSeen failed", e));
    }

    setQIndex(0);
    setCombo(0);
    setSessionCorrect(0);
    setSessionXP(0);
    setResolvedCount(0);
    setSessionLog([]);
    setFeedback(null);
    setSelected(null);
    setAwaitingNext(false);
    setTimeLeft(timeFor(track, newRound[0], timerOverrides));
    setScreen("playing");
  };

  useEffect(() => {
    if (screen !== "playing" || feedback) return;
    clearTimer();
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearTimer();
          handleAnswer(-1);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return clearTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qIndex, screen, feedback]);

  const handleAnswer = (optIdx) => {
    if (feedback) return;
    clearTimer();
    const q = round[qIndex];
    const isCorrect = optIdx === q.correctIdx;
    setSelected(optIdx);
    setFeedback(isCorrect ? "correct" : "wrong");

    let newCombo = combo;
    let gained = 0;
    if (isCorrect) {
      newCombo = combo + 1;
      gained = 10 + Math.min(newCombo - 1, 8) * 2;
      setSessionCorrect((c) => c + 1);
      setSessionXP((x) => x + gained);
      setCombo(newCombo);
      if (missedIds.includes(q.id) || newlyMissed.current.has(q.id)) {
        newlyMissed.current.delete(q.id);
        newlyResolved.current.add(q.id);
        setResolvedCount((c) => c + 1);
      }
    } else {
      setCombo(0);
      if (!newlyResolved.current.has(q.id)) {
        newlyMissed.current.add(q.id);
      }
    }

    if (roundMode === "daily" && progress.skill_level !== "none") {
      levelAnswered.current.total += 1;
      if (isCorrect) levelAnswered.current.correct += 1;
    }

    setSessionLog((log) => [
      ...log,
      {
        id: q.id,
        cat: q.cat,
        prompt: q.prompt,
        options: q.options,
        correctIdx: q.correctIdx,
        selectedIdx: optIdx,
        isCorrect,
        sound: q.sound,
        explain: q.explain,
      },
    ]);

    if (reviewMode) {
      setAwaitingNext(true);
      return;
    }

    setTimeout(() => {
      if (qIndex + 1 < round.length) {
        setQIndex((i) => i + 1);
        setFeedback(null);
        setSelected(null);
        setTimeLeft(timeFor(track, round[qIndex + 1], timerOverrides));
      } else {
        endRound(true, newCombo, sessionXP + gained, sessionCorrect + (isCorrect ? 1 : 0));
      }
    }, 750);
  };

  // Review mode: called when the person taps "Next" after reading the explanation.
  // Reads combo/sessionXP/sessionCorrect directly since they're already updated by
  // handleAnswer by the time this can be clicked (a render has already happened).
  const handleNext = () => {
    setAwaitingNext(false);
    if (qIndex + 1 < round.length) {
      setQIndex((i) => i + 1);
      setFeedback(null);
      setSelected(null);
      setTimeLeft(timeFor(track, round[qIndex + 1], timerOverrides));
    } else {
      endRound(true, combo, sessionXP, sessionCorrect);
    }
  };

  const endRound = async (completed, finalCombo, finalXP, finalCorrect) => {
    clearTimer();
    const today = todayStr();
    let newStreak = progress.streak;
    if (progress.last_played !== today) {
      if (progress.last_played) {
        const last = new Date(progress.last_played);
        const diffDays = Math.round((new Date(today) - last) / 86400000);
        newStreak = diffDays === 1 ? progress.streak + 1 : 1;
      } else {
        newStreak = 1;
      }
    }
    const totalXP = progress.xp + finalXP;
    const newLevel = Math.floor(totalXP / 100) + 1;
    const next = {
      xp: totalXP,
      level: newLevel,
      streak: newStreak,
      best_combo: Math.max(progress.best_combo, finalCombo),
      last_played: today,
      rounds_completed: progress.rounds_completed + (completed ? 1 : 0),
      skill_level: progress.skill_level,
      level_correct_count: progress.level_correct_count + levelAnswered.current.correct,
      level_total_count: progress.level_total_count + levelAnswered.current.total,
    };
    setProgress(next);
    saveProgress(userId, track.id, next).catch((e) => console.error("saveProgress failed", e));

    // Persist missed/resolved question state
    const missedArr = Array.from(newlyMissed.current);
    const resolvedArr = Array.from(newlyResolved.current);
    if (missedArr.length > 0) {
      Promise.all(missedArr.map((id) => addMissed(userId, track.id, id))).catch((e) => console.error("addMissed failed", e));
    }
    if (resolvedArr.length > 0) {
      Promise.all(resolvedArr.map((id) => resolveMissed(userId, track.id, id))).catch((e) => console.error("resolveMissed failed", e));
    }
    setMissedIds((prev) => {
      const s = new Set(prev);
      resolvedArr.forEach((id) => s.delete(id));
      missedArr.forEach((id) => s.add(id));
      return Array.from(s);
    });

    // Persist this round's answers as new explanation rows; optimistically prepend locally.
    if (sessionLog.length > 0) {
      insertExplanations(userId, track.id, sessionLog).catch((e) => console.error("insertExplanations failed", e));
      setExplanationLog((log) => [...sessionLog].reverse().concat(log).slice(0, 150));
    }

    setScreen(completed ? "result" : "start");
  };

  const exitRound = () => endRound(false, combo, sessionXP, sessionCorrect);

  const changeSkillLevel = (newLevel) => {
    const next = { ...progress, skill_level: newLevel, level_correct_count: 0, level_total_count: 0 };
    setProgress(next);
    saveProgress(userId, track.id, next).catch((e) => console.error("saveProgress failed", e));
    setShowLevelPicker(false);
    setAdvanceDismissed(false);
  };

  const openArchive = async () => {
    setScreen("archive");
    setArchiveLoading(true);
    try {
      const [rows, count] = await Promise.all([
        fetchArchivedExplanations(userId, track.id, 0, 50),
        countArchivedExplanations(userId, track.id),
      ]);
      setArchiveLog(rows);
      setArchiveCount(count);
    } catch (e) {
      console.error("archive load failed", e);
    } finally {
      setArchiveLoading(false);
    }
  };

  const loadMoreArchive = async () => {
    setArchiveLoading(true);
    try {
      const rows = await fetchArchivedExplanations(userId, track.id, archiveLog.length, 50);
      setArchiveLog((prev) => [...prev, ...rows]);
    } catch (e) {
      console.error("archive load-more failed", e);
    } finally {
      setArchiveLoading(false);
    }
  };

  if (!track) {
    return (
      <div style={styles.bg}>
        <p style={{ color: "#FF7B8A" }}>Unknown track: {params.trackId}</p>
      </div>
    );
  }

  if (!loaded) {
    return (
      <div style={styles.bg}>
        <p style={{ color: "#7C7395" }} className="jm">
          Cargando…
        </p>
      </div>
    );
  }

  const q = round[qIndex];
  const xpIntoLevel = progress.xp % 100;
  const trackTheme = TRACK_THEMES[track.theme];

  return (
    <div style={styles.bg}>
      {trackTheme && <div style={animatedBackgroundStyle(trackTheme.gradient)} />}
      <div style={styles.wrap}>
        <div style={styles.hud} className="jm">
          <button className="rj" style={styles.backBtn} onClick={() => router.push("/")}>
            ←
          </button>
          <div style={styles.hudItem}>
            <Trophy size={14} color="#FFB84D" />
            <span style={{ marginLeft: 6 }}>Nv.{progress.level}</span>
          </div>
          <div style={styles.xpBarOuter}>
            <div style={{ ...styles.xpBarInner, width: `${xpIntoLevel}%` }} />
          </div>
          <div style={styles.hudItem}>
            <Flame size={14} color="#FF7B8A" />
            <span style={{ marginLeft: 6 }}>{progress.streak}d</span>
          </div>
        </div>

        {screen === "start" && (
          <div style={styles.centerCol} className="fadein">
            <h1 className="rj" style={styles.title}>
              {track.label}
            </h1>
            <p style={styles.subtitle}>{track.sublabel}</p>

            <div style={styles.statRow} className="jm">
              <StatChip label="XP total" value={progress.xp} color="#3DDBFF" />
              <StatChip label="Mejor combo" value={progress.best_combo} color="#FF8FB1" />
              <StatChip label="Rondas" value={progress.rounds_completed} color="#FFB84D" />
            </div>

            <div style={styles.skillCard}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#B4ABC9", fontSize: 12 }}>
                  Nivel: <strong style={{ color: "#F3F0FA" }}>{skillLevelInfo(progress.skill_level).label}</strong>
                </span>
                <button className="rj" style={styles.skillEditBtn} onClick={() => setShowLevelPicker((v) => !v)}>
                  {showLevelPicker ? "Cerrar" : "Cambiar"}
                </button>
              </div>

              {showLevelPicker && (
                <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                  {SKILL_LEVELS.map((s) => (
                    <button
                      key={s.id}
                      className="rj"
                      onClick={() => changeSkillLevel(s.id)}
                      style={{ ...styles.skillOption, borderColor: progress.skill_level === s.id ? "#FF8FB1" : "#3A3452" }}
                    >
                      {s.label}
                    </button>
                  ))}
                  <button className="rj" style={styles.placementLinkBtn} onClick={() => router.push(`/placement/${track.id}`)}>
                    ¿No estás seguro? Hacer prueba de nivel
                  </button>
                </div>
              )}

              {!showLevelPicker && !advanceDismissed && readyToAdvance(progress.level_correct_count, progress.level_total_count) && nextSkillLevel(progress.skill_level) && (
                <div style={styles.advanceBanner}>
                  <span>¿Listo para subir a {skillLevelInfo(nextSkillLevel(progress.skill_level)).label}?</span>
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <button className="rj" style={styles.advanceYesBtn} onClick={() => changeSkillLevel(nextSkillLevel(progress.skill_level))}>
                      Sí, avanzar
                    </button>
                    <button className="rj" style={styles.advanceNoBtn} onClick={() => setAdvanceDismissed(true)}>
                      Todavía no
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div style={styles.categoryPicker}>
              <span style={{ color: "#7C7395", fontSize: 12 }}>Enfoque de la ronda:</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                <button
                  className="rj"
                  style={{ ...styles.catChip, borderColor: !categoryFilter ? "#FF8FB1" : "#3A3452", color: !categoryFilter ? "#FF8FB1" : "#B4ABC9" }}
                  onClick={() => setCategoryFilter(null)}
                >
                  Mixto
                </button>
                {Object.keys(track.cats).map((catId) => (
                  <button
                    key={catId}
                    className="rj"
                    style={{
                      ...styles.catChip,
                      borderColor: categoryFilter === catId ? track.cats[catId].color : "#3A3452",
                      color: categoryFilter === catId ? track.cats[catId].color : "#B4ABC9",
                    }}
                    onClick={() => setCategoryFilter(catId)}
                  >
                    {track.cats[catId].label}
                  </button>
                ))}
              </div>
            </div>

            <button className="rj" style={styles.primaryBtn} onClick={() => startRound("daily")}>
              EMPEZAR RONDA <ChevronRight size={20} style={{ verticalAlign: "middle" }} />
            </button>

            {missedIds.length > 0 && (
              <button className="rj" style={styles.reviewBtn} onClick={() => startRound("review")}>
                <RotateCcw size={16} style={{ verticalAlign: "middle", marginRight: 8 }} />
                REPASAR FALLOS
                <span style={styles.missedBadge} className="jm">
                  {missedIds.length}
                </span>
              </button>
            )}

            {explanationLog.length > 0 && (
              <button className="rj" style={styles.explainOpenBtn} onClick={() => setScreen("explain")}>
                Ver explicaciones ({explanationLog.length})
              </button>
            )}
          </div>
        )}

        {screen === "playing" && q && (
          <div style={styles.centerCol}>
            <div style={styles.topRow}>
              <button onClick={exitRound} className="rj" style={styles.exitBtn}>
                <X size={14} />
                <span style={{ marginLeft: 4 }}>Salir</span>
              </button>
              <div className="jm" style={{ color: "#7C7395", fontSize: 13 }}>
                {qIndex + 1} / {round.length}
              </div>
              <div style={styles.comboWrap}>
                <Zap size={16} color={combo > 0 ? "#FFB84D" : "#3A3F4C"} />
                <span className="jm" style={{ color: combo > 0 ? "#FFB84D" : "#3A3F4C", marginLeft: 4, fontWeight: 600 }}>
                  x{combo}
                </span>
              </div>
              <TimerRing timeLeft={timeLeft} total={timeFor(track, q, timerOverrides)} />
            </div>

            <div
              key={qIndex}
              className={`fadein${feedback === "correct" ? " pulse-correct" : feedback === "wrong" ? " pulse-wrong" : ""}`}
              style={{
                ...styles.card,
                borderColor: feedback === "correct" ? "#5EE0A0" : feedback === "wrong" ? "#FF7B8A" : track.cats[q.cat].color,
                borderWidth: feedback ? 3 : 1,
                boxShadow:
                  feedback === "correct" ? "0 0 0 3px #5EE0A0" : feedback === "wrong" ? "0 0 0 3px #FF7B8A" : `0 0 0 1px ${track.cats[q.cat].color}55`,
              }}
            >
              <div className="rj" style={{ ...styles.catTag, color: track.cats[q.cat].color, borderColor: track.cats[q.cat].color }}>
                {track.cats[q.cat].label}
              </div>
              <p style={styles.prompt}>{q.prompt}</p>

              {q.cat === track.extraCatId && q.sound && (
                <div style={styles.soundBox}>
                  <p className="rj" style={styles.soundText}>
                    {q.sound}
                  </p>
                  <p style={styles.soundLegend}>MAYÚSCULAS = sílaba con más fuerza · ‿ = las palabras se unen al hablar rápido</p>
                </div>
              )}

              <div style={styles.optionsGrid}>
                {q.options.map((opt, i) => {
                  let bg = "#1D212B";
                  let border = "#3A3452";
                  let borderWidth = 1;
                  let textColor = "#F3F0FA";
                  if (feedback) {
                    if (i === q.correctIdx) {
                      bg = "#1E4A32";
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
                      disabled={!!feedback}
                      className="rj"
                      style={{ ...styles.optionBtn, background: bg, borderColor: border, borderWidth, color: textColor }}
                    >
                      <span>{opt}</span>
                      {feedback && i === q.correctIdx && <Check size={22} color="#5EE0A0" strokeWidth={3} />}
                      {feedback && i === selected && i !== q.correctIdx && <X size={22} color="#FF7B8A" strokeWidth={3} />}
                    </button>
                  );
                })}
              </div>

              {awaitingNext && q.explain && (
                <div style={styles.reviewExplainBox}>
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

              {awaitingNext && (
                <button className="rj" style={styles.nextBtn} onClick={handleNext}>
                  Siguiente <ChevronRight size={18} style={{ verticalAlign: "middle" }} />
                </button>
              )}
            </div>
          </div>
        )}

        {screen === "result" && (
          <div style={styles.centerCol} className="fadein">
            <h2 className="rj" style={styles.title}>
              {roundMode === "review" ? "REPASO COMPLETO" : "RONDA COMPLETA"}
            </h2>
            <div style={styles.statRow} className="jm">
              <StatChip label="Correctas" value={`${sessionCorrect}/${round.length}`} color="#5EE0A0" />
              <StatChip label="XP ganado" value={`+${sessionXP}`} color="#3DDBFF" />
              {roundMode === "review" ? (
                <StatChip label="Fallos resueltos" value={resolvedCount} color="#FF8FB1" />
              ) : (
                <StatChip label="Racha diaria" value={`${progress.streak}d`} color="#FF7B8A" />
              )}
            </div>
            <button className="rj" style={styles.primaryBtn} onClick={() => startRound("daily")}>
              <RotateCcw size={18} style={{ verticalAlign: "middle", marginRight: 8 }} />
              OTRA RONDA
            </button>
            {explanationLog.length > 0 && (
              <button className="rj" style={styles.explainOpenBtn} onClick={() => setScreen("explain")}>
                Ver explicaciones ({explanationLog.length})
              </button>
            )}
            {missedIds.length > 0 && (
              <button className="rj" style={styles.reviewBtn} onClick={() => startRound("review")}>
                REPASAR FALLOS
                <span style={styles.missedBadge} className="jm">
                  {missedIds.length}
                </span>
              </button>
            )}
            <button className="rj" style={{ ...styles.secondaryBtn, marginTop: 8 }} onClick={() => setScreen("start")}>
              Volver al inicio
            </button>
          </div>
        )}

        {screen === "explain" && (
          <div style={styles.centerCol} className="fadein">
            <h2 className="rj" style={{ ...styles.title, fontSize: 24 }}>
              EXPLICACIONES
            </h2>
            <p style={styles.subtitle}>Tu historial reciente — se acumula con cada ronda. Sin cronómetro.</p>
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
              {explanationLog.map((item, i) => (
                <ExplanationCard item={item} track={track} key={item.id || i} />
              ))}
              {explanationLog.length === 0 && <p style={{ color: "#7C7395", fontSize: 14 }}>Aún no hay explicaciones — juega una ronda primero.</p>}
            </div>
            <button className="rj" style={{ ...styles.secondaryBtn, marginTop: 18 }} onClick={() => setScreen("start")}>
              Cerrar
            </button>
            {archiveCount > 0 && (
              <button className="rj" style={{ ...styles.explainOpenBtn, marginTop: 10 }} onClick={openArchive}>
                Ver archivo ({archiveCount})
              </button>
            )}
            {explanationLog.length > 0 && (
              <button
                className="rj"
                style={{ ...styles.secondaryBtn, marginTop: 8, color: "#FF7B8A", borderColor: "#3A1B1F" }}
                onClick={async () => {
                  await clearExplanations(userId, track.id);
                  setExplanationLog([]);
                  setArchiveLog([]);
                  setArchiveCount(0);
                }}
              >
                Limpiar todo (historial + archivo)
              </button>
            )}
          </div>
        )}

        {screen === "archive" && (
          <div style={styles.centerCol} className="fadein">
            <h2 className="rj" style={{ ...styles.title, fontSize: 24 }}>
              ARCHIVO
            </h2>
            <p style={styles.subtitle}>Explicaciones más antiguas.</p>
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
              {archiveLog.map((item, i) => (
                <ExplanationCard item={item} track={track} key={item.id || i} />
              ))}
              {archiveLog.length === 0 && !archiveLoading && <p style={{ color: "#7C7395", fontSize: 14 }}>El archivo está vacío.</p>}
            </div>
            {archiveLog.length < archiveCount && (
              <button className="rj" style={{ ...styles.secondaryBtn, marginTop: 12 }} onClick={loadMoreArchive} disabled={archiveLoading}>
                {archiveLoading ? "Cargando…" : "Cargar más"}
              </button>
            )}
            <button className="rj" style={{ ...styles.secondaryBtn, marginTop: 18 }} onClick={() => setScreen("explain")}>
              Volver al historial
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ExplanationCard({ item, track }) {
  const catInfo = track.cats[item.cat] || { label: item.cat, color: "#7C7395" };
  return (
    <div style={{ ...styles.card, borderColor: item.isCorrect || item.is_correct ? "#5EE0A0" : "#FF7B8A", textAlign: "left" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div className="rj" style={{ ...styles.catTag, color: catInfo.color, borderColor: catInfo.color, marginBottom: 0 }}>
          {catInfo.label}
        </div>
        {item.isCorrect || item.is_correct ? <Check size={18} color="#5EE0A0" /> : <X size={18} color="#FF7B8A" />}
      </div>
      <p style={{ ...styles.prompt, fontSize: 17 }}>{item.prompt}</p>

      {item.cat === track.extraCatId && item.sound && (
        <div style={{ ...styles.soundBox, marginBottom: 14 }}>
          <p className="rj" style={styles.soundText}>
            {item.sound}
          </p>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
        {item.options.map((opt, oi) => {
          const correctIdx = item.correctIdx ?? item.correct_idx;
          const selectedIdx = item.selectedIdx ?? item.selected_idx;
          const isCorrect = item.isCorrect ?? item.is_correct;
          const isCorrectOpt = oi === correctIdx;
          const isYourWrongPick = oi === selectedIdx && !isCorrect;
          if (!isCorrectOpt && !isYourWrongPick) return null;
          return (
            <div
              key={oi}
              className="rj"
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                background: isCorrectOpt ? "#1B3A2A" : "#3A1B1F",
                border: `1px solid ${isCorrectOpt ? "#5EE0A0" : "#FF7B8A"}`,
              }}
            >
              {isCorrectOpt ? "✓ " : "✗ "}
              {opt}
              {isYourWrongPick && <span style={{ color: "#B4ABC9", fontWeight: 500 }}> — tu respuesta</span>}
            </div>
          );
        })}
      </div>

      {(item.explain || item.explain_en) && (
        <div style={styles.explainBox}>
          <div style={styles.explainLangRow}>
            <span style={styles.explainLangTag}>EN</span>
            <p style={styles.explainText}>{item.explain ? item.explain.en : item.explain_en}</p>
          </div>
          <div style={{ ...styles.explainLangRow, marginTop: 8 }}>
            <span style={styles.explainLangTag}>ES</span>
            <p style={styles.explainText}>{item.explain ? item.explain.es : item.explain_es}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function StatChip({ label, value, color }) {
  return (
    <div style={{ ...styles.chip, borderColor: color + "55" }}>
      <div style={{ fontSize: 20, fontWeight: 600, color }}>{value}</div>
      <div style={{ fontSize: 10, color: "#7C7395", marginTop: 2, textTransform: "uppercase" }}>{label}</div>
    </div>
  );
}

function TimerRing({ timeLeft, total }) {
  const pct = (timeLeft / total) * 100;
  const color = pct > 50 ? "#3DDBFF" : pct > 20 ? "#FFB84D" : "#FF7B8A";
  return (
    <div style={{ width: 34, height: 34, borderRadius: "50%", background: `conic-gradient(${color} ${pct}%, #23272F ${pct}%)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="jm" style={{ width: 26, height: 26, borderRadius: "50%", background: "#171423", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>
        {timeLeft}
      </div>
    </div>
  );
}

const styles = {
  skillCard: { width: "100%", background: "#221E33", border: "1px solid #3A3452", borderRadius: 12, padding: "12px 16px", marginBottom: 16 },
  categoryPicker: { width: "100%", background: "#221E33", border: "1px solid #3A3452", borderRadius: 12, padding: "12px 16px", marginBottom: 16 },
  catChip: {
    background: "#171423",
    border: "1px solid",
    borderRadius: 999,
    padding: "6px 14px",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
  },
  skillEditBtn: { background: "transparent", color: "#FF8FB1", border: "1px solid #FF8FB1", borderRadius: 8, padding: "4px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer" },
  skillOption: { textAlign: "left", background: "#171423", border: "1px solid", borderRadius: 8, padding: "8px 12px", color: "#F3F0FA", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  placementLinkBtn: { background: "transparent", color: "#3DDBFF", border: "1px solid #3DDBFF", borderRadius: 8, padding: "8px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer", marginTop: 4 },
  advanceBanner: { marginTop: 10, background: "#241B36", border: "1px solid #B98EFF", borderRadius: 10, padding: "10px 12px", color: "#E4D6FF", fontSize: 13 },
  advanceYesBtn: { flex: 1, background: "#B98EFF", color: "#171423", border: "none", borderRadius: 8, padding: "7px 0", fontSize: 12, fontWeight: 700, cursor: "pointer" },
  advanceNoBtn: { flex: 1, background: "transparent", color: "#B4ABC9", border: "1px solid #3A3452", borderRadius: 8, padding: "7px 0", fontSize: 12, fontWeight: 600, cursor: "pointer" },
  bg: { position: "relative", minHeight: "100vh", width: "100%", background: "#171423", display: "flex", justifyContent: "center", padding: "20px 14px", overflow: "hidden" },
  wrap: { position: "relative", zIndex: 1, width: "100%", maxWidth: 460 },
  hud: { display: "flex", alignItems: "center", gap: 10, marginBottom: 22, fontSize: 12 },
  backBtn: { background: "rgba(255,143,177,0.12)", color: "#FF8FB1", border: "1px solid #FF8FB1", borderRadius: 8, padding: "6px 14px", fontSize: 15, fontWeight: 700, cursor: "pointer" },
  hudItem: { display: "flex", alignItems: "center", whiteSpace: "nowrap" },
  xpBarOuter: { flex: 1, height: 6, background: "#1D212B", borderRadius: 3, overflow: "hidden" },
  xpBarInner: { height: "100%", background: "linear-gradient(90deg,#3DDBFF,#FFB84D)", borderRadius: 3, transition: "width 0.4s ease" },
  centerCol: { display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" },
  title: { fontSize: 30, fontWeight: 700, margin: "10px 0 4px" },
  subtitle: { color: "#B4ABC9", fontSize: 14, margin: "0 0 20px", maxWidth: 340 },
  statRow: { display: "flex", gap: 10, marginBottom: 26, width: "100%" },
  chip: { flex: 1, border: "1px solid", borderRadius: 12, padding: "10px 6px", background: "#221E33" },
  primaryBtn: { background: "#FF8FB1", color: "#171423", border: "none", padding: "14px 28px", borderRadius: 10, fontSize: 18, fontWeight: 700, cursor: "pointer", width: "100%" },
  reviewBtn: { background: "transparent", color: "#FF8FB1", border: "1px solid #FF8FB1", padding: "12px 24px", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer", width: "100%", marginTop: 10, display: "flex", alignItems: "center", justifyContent: "center" },
  missedBadge: { marginLeft: 10, background: "#FF8FB1", color: "#171423", borderRadius: 20, padding: "1px 8px", fontSize: 12, fontWeight: 700 },
  explainOpenBtn: { background: "transparent", color: "#3DDBFF", border: "1px solid #3DDBFF", padding: "12px 24px", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer", width: "100%", marginTop: 10 },
  secondaryBtn: { background: "transparent", color: "#7C7395", border: "1px solid #3A3452", padding: "10px 20px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", width: "100%" },
  topRow: { display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", marginBottom: 14, gap: 10 },
  exitBtn: { display: "flex", alignItems: "center", background: "transparent", color: "#7C7395", border: "1px solid #3A3452", borderRadius: 8, padding: "5px 10px", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  comboWrap: { display: "flex", alignItems: "center" },
  card: { width: "100%", background: "#221E33", border: "1px solid", borderRadius: 16, padding: "22px 20px", textAlign: "left" },
  catTag: { display: "inline-block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", border: "1px solid", borderRadius: 20, padding: "3px 10px", marginBottom: 14 },
  prompt: { fontSize: 19, fontWeight: 500, lineHeight: 1.4, marginBottom: 18 },
  soundBox: { background: "#241B36", border: "1px solid #B98EFF", borderRadius: 10, padding: "16px 14px", marginBottom: 16, textAlign: "center" },
  soundText: { color: "#E4D6FF", fontSize: 21, fontWeight: 600, margin: 0, lineHeight: 1.6 },
  soundLegend: { color: "#8A7FA3", fontSize: 11, marginTop: 10, marginBottom: 0 },
  optionsGrid: { display: "flex", flexDirection: "column", gap: 10 },
  optionBtn: { border: "1px solid", borderRadius: 10, padding: "13px 16px", fontSize: 16, fontWeight: 600, textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" },
  explainBox: { background: "#11141B", border: "1px solid #3A3452", borderRadius: 10, padding: "12px 14px" },
  reviewExplainBox: { background: "#11141B", border: "1px solid #3A3452", borderRadius: 10, padding: "12px 14px", marginTop: 16 },
  nextBtn: {
    width: "100%",
    background: "#FF8FB1",
    color: "#171423",
    border: "none",
    borderRadius: 10,
    padding: "12px",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    marginTop: 14,
  },
  explainLangRow: { display: "flex", alignItems: "flex-start", gap: 8 },
  explainLangTag: { flexShrink: 0, fontSize: 10, fontWeight: 700, color: "#7C7395", border: "1px solid #3A3452", borderRadius: 4, padding: "1px 5px", marginTop: 2 },
  explainText: { color: "#C7CAD3", fontSize: 13.5, lineHeight: 1.5, margin: 0 },
};

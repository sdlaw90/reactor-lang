"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import { supabase } from "../../../lib/supabaseClient";
import { getTrack } from "../../../data/tracks";
import { buildPlacementQuiz } from "../../../lib/gameEngine";
import { loadProgress, saveProgress } from "../../../lib/db";
import { SKILL_LEVELS } from "../../../lib/skillLevels";

const TIER_ORDER = ["A1", "A2", "B1", "B2", "C1", "C2"];

// Highest tier passed (>=60% correct — comfortably 2/3 with the new 3-per-tier
// sampling) determines the recommendation; if even A1 isn't cleared,
// "beginner" is still the floor — everyone starts somewhere. Tiers with no
// available questions (a track with no C1/C2 content yet, for instance) are
// simply skipped rather than counted as failed.
function recommendLevel(tierResults) {
  let highestPassed = null;
  TIER_ORDER.forEach((tier) => {
    const r = tierResults[tier];
    if (r && r.total > 0 && r.correct / r.total >= 0.6) {
      highestPassed = tier;
    }
  });
  if (!highestPassed) return "beginner";
  if (highestPassed === "A1" || highestPassed === "A2") return "beginner";
  if (highestPassed === "B1" || highestPassed === "B2") return "intermediate";
  return "expert";
}

export default function PlacementQuizPage({ params }) {
  const router = useRouter();
  const track = getTrack(params.trackId);
  const [userId, setUserId] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [tierResults, setTierResults] = useState({});
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);
  const [viewerNativeLang, setViewerNativeLang] = useState(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/auth");
        return;
      }
      setUserId(data.session.user.id);
      setViewerNativeLang(data.session.user.user_metadata?.native_lang || null);
      setQuiz(buildPlacementQuiz(track, 3));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!track) {
    return (
      <div style={styles.wrap}>
        <p style={{ color: "#FF7B8A" }}>Unknown track: {params.trackId}</p>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div style={styles.wrap}>
        <p style={{ color: "#B4ABC9" }}>Cargando…</p>
      </div>
    );
  }

  if (quiz.length === 0) {
    return (
      <div style={styles.wrap}>
        <div style={{ maxWidth: 420 }}>
          <p style={{ color: "#B4ABC9" }}>
            This track doesn't have enough difficulty-tagged content yet for a placement quiz. Pick a level manually instead.
          </p>
          <button className="rj" style={styles.primaryBtn} onClick={() => router.push(`/play/${track.id}`)}>
            Volver
          </button>
        </div>
      </div>
    );
  }

  const q = quiz[qIndex];
  const useAltPrompt = viewerNativeLang === "en" && track.nativeLang !== "en";
  const displayPrompt = q && useAltPrompt && q.promptEn ? q.promptEn : q?.prompt;

  const answer = (optIdx) => {
    if (feedback) return;
    const isCorrect = optIdx === q.correctIdx;
    setSelected(optIdx);
    setFeedback(isCorrect ? "correct" : "wrong");
    setTierResults((prev) => {
      const cur = prev[q.tier] || { correct: 0, total: 0 };
      return { ...prev, [q.tier]: { correct: cur.correct + (isCorrect ? 1 : 0), total: cur.total + 1 } };
    });

    setTimeout(() => {
      if (qIndex + 1 < quiz.length) {
        setQIndex((i) => i + 1);
        setSelected(null);
        setFeedback(null);
      } else {
        setDone(true);
      }
    }, 650);
  };

  const recommended = done ? recommendLevel(tierResults) : null;

  const acceptRecommendation = async () => {
    setSaving(true);
    try {
      const current = await loadProgress(userId, track.id);
      await saveProgress(userId, track.id, {
        ...current,
        skill_level: recommended,
        level_correct_count: 0,
        level_total_count: 0,
      });
      router.push(`/play/${track.id}`);
    } catch (e) {
      console.error("failed to save placement result", e);
      setSaving(false);
    }
  };

  return (
    <div style={styles.wrap}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        {!done ? (
          <>
            <p style={{ color: "#7C7395", fontSize: 12 }} className="jm">
              {qIndex + 1} / {quiz.length} · sin cronómetro
            </p>
            <div style={{ ...styles.card, borderColor: feedback === "correct" ? "#5EE0A0" : feedback === "wrong" ? "#FF7B8A" : "#3A3452" }}>
              <p style={styles.prompt}>{displayPrompt}</p>
              {q.sound && (
                <div style={styles.soundBox}>
                  <p className="rj" style={styles.soundText}>
                    {q.sound}
                  </p>
                </div>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {q.options.map((opt, i) => {
                  let bg = "#171423";
                  let border = "#3A3452";
                  if (feedback) {
                    if (i === q.correctIdx) {
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
                      style={{ ...styles.optionBtn, background: bg, borderColor: border }}
                    >
                      <span>{opt}</span>
                      {feedback && i === q.correctIdx && <Check size={16} color="#5EE0A0" />}
                      {feedback && i === selected && i !== q.correctIdx && <X size={16} color="#FF7B8A" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <div style={styles.card}>
            <h2 className="rj" style={{ color: "#F3F0FA", fontSize: 22, marginTop: 0 }}>
              Resultado
            </h2>
            <p style={{ color: "#B4ABC9", fontSize: 14, lineHeight: 1.6 }}>
              Nivel recomendado: <strong style={{ color: "#FF8FB1" }}>{SKILL_LEVELS.find((s) => s.id === recommended)?.label}</strong>
            </p>
            <button className="rj" style={styles.primaryBtn} onClick={acceptRecommendation} disabled={saving}>
              {saving ? "..." : "Usar este nivel"}
            </button>
            <button className="rj" style={styles.secondaryBtn} onClick={() => router.push(`/play/${track.id}`)}>
              Volver sin guardar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrap: { minHeight: "100vh", display: "flex", justifyContent: "center", padding: "40px 20px", background: "#171423" },
  card: { background: "#221E33", border: "1px solid", borderRadius: 16, padding: "22px 20px" },
  prompt: { color: "#F3F0FA", fontSize: 18, fontWeight: 500, lineHeight: 1.4, marginBottom: 16 },
  soundBox: { background: "#241B36", border: "1px solid #B98EFF", borderRadius: 10, padding: "14px", marginBottom: 16, textAlign: "center" },
  soundText: { color: "#E4D6FF", fontSize: 18, fontWeight: 600, margin: 0 },
  optionBtn: { border: "1px solid", borderRadius: 10, padding: "12px 14px", fontSize: 15, fontWeight: 600, color: "#F3F0FA", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" },
  primaryBtn: { width: "100%", background: "#FF8FB1", color: "#171423", border: "none", borderRadius: 10, padding: "13px", fontSize: 16, fontWeight: 700, cursor: "pointer", marginTop: 16 },
  secondaryBtn: { width: "100%", background: "transparent", color: "#B4ABC9", border: "1px solid #3A3452", borderRadius: 10, padding: "10px", fontSize: 13, fontWeight: 600, cursor: "pointer", marginTop: 8 },
};

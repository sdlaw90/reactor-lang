"use client";

// #90: Grammar gym — standalone conjugation gym. Walled off from the main
// tracker: progress lives in localStorage (lib/grammarGym.js) and never touches
// XP / level / streak / mastery or the mix-and-match picker.

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, ChevronRight, ChevronDown, RotateCcw, Dumbbell, BookOpen } from "lucide-react";
import { supabase } from "../../../lib/supabaseClient";
import BackHome from "../../../lib/BackHome";
import ModeToggle from "../../../lib/ModeToggle";
import { getTrack } from "../../../data/tracks";
import { grammarForTrack } from "../../../data/grammar";
import { scriptForTrack } from "../../../data/scripts";
import { t } from "../../../lib/playStrings";
import { TRACK_THEMES, animatedBackgroundStyle } from "../../../lib/theme";
import { trackDisplayName } from "../../../lib/languageNames";
import { buildDrill, loadGrammarProgress, saveGrammarProgress } from "../../../lib/grammarGym";

const DRILL_SIZE = 10;

export default function GrammarGymPage({ params }) {
  const router = useRouter();
  const track = getTrack(params.trackId);
  const gym = grammarForTrack(params.trackId);

  const [lang, setLang] = useState("en");
  const [progress, setProgress] = useState({ practiced: 0, correct: 0, seenVerbs: [] });
  const [screen, setScreen] = useState("start"); // start | learn | practice
  const [groupFilter, setGroupFilter] = useState(null);

  // learn state
  const [openVerb, setOpenVerb] = useState(null);
  const [learnTense, setLearnTense] = useState("present");

  // practice state
  const [drill, setDrill] = useState([]);
  const [dIndex, setDIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [sessionCorrect, setSessionCorrect] = useState(0);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      setLang(data?.session?.user?.user_metadata?.native_lang || "en");
    })();
    setProgress(loadGrammarProgress(params.trackId));
  }, [params.trackId]);

  const L = (obj) => (obj ? obj[lang] || obj.en : "");

  const verbs = useMemo(() => {
    if (!gym) return [];
    return groupFilter ? gym.verbs.filter((v) => v.group === groupFilter) : gym.verbs;
  }, [gym, groupFilter]);

  if (!track || !gym) {
    return (
      <div style={styles.bg}>
        <div style={styles.wrap}>
          <BackHome />
          <p style={{ color: "#FF7B8A" }}>No grammar module for this track.</p>
        </div>
      </div>
    );
  }

  const startPractice = () => {
    setDrill(buildDrill(gym, DRILL_SIZE, groupFilter ? { group: groupFilter } : {}));
    setDIndex(0);
    setSelected(null);
    setAnswered(false);
    setSessionCorrect(0);
    setScreen("practice");
  };

  const answer = (i) => {
    if (answered) return;
    const item = drill[dIndex];
    const isCorrect = i === item.correctIdx;
    setSelected(i);
    setAnswered(true);
    if (isCorrect) setSessionCorrect((c) => c + 1);
    // Walled-off progress: persist immediately (own lane, localStorage only).
    setProgress((prev) => {
      const next = {
        practiced: prev.practiced + 1,
        correct: prev.correct + (isCorrect ? 1 : 0),
        seenVerbs: prev.seenVerbs.includes(item.verbInf) ? prev.seenVerbs : [...prev.seenVerbs, item.verbInf],
      };
      saveGrammarProgress(params.trackId, next);
      return next;
    });
  };

  const nextDrill = () => {
    if (dIndex + 1 < drill.length) {
      setDIndex((n) => n + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setScreen("done");
    }
  };

  const trackTheme = TRACK_THEMES[track.theme];
  const accuracy = progress.practiced > 0 ? Math.round((progress.correct / progress.practiced) * 100) : null;
  const item = drill[dIndex];

  return (
    <div style={styles.bg}>
      {trackTheme && <div style={animatedBackgroundStyle(trackTheme.gradient)} />}
      <div style={styles.wrap}>
        <BackHome />

        <ModeToggle
          trackId={track.id}
          active="grammar"
          quickQuizLabel={t(lang, "modeQuickQuiz")}
          lessonsLabel={t(lang, "modeLessons")}
          scriptLabel={scriptForTrack(track.id) ? t(lang, "modeScript") : null}
          grammarLabel={t(lang, "modeGrammar")}
        />

        {screen === "start" && (
          <div style={styles.col} className="fadein">
            <div style={styles.badge}>
              <Dumbbell size={22} color="#171423" />
            </div>
            <h1 className="rj" style={styles.title}>Grammar gym</h1>
            <p style={styles.subtitle}>{trackDisplayName(track, lang)}</p>
            <p style={styles.intro}>{L(gym.intro)}</p>

            <div style={styles.statCard}>
              <span style={{ color: "#9B93B8", fontSize: 12 }}>Your grammar-gym progress (separate from your main level)</span>
              <div className="jm" style={{ color: "#F3F0FA", fontSize: 14, marginTop: 6 }}>
                {progress.practiced} practiced
                {accuracy !== null ? ` · ${accuracy}% correct` : ""}
                {` · ${progress.seenVerbs.length}/${gym.verbs.length} verbs seen`}
              </div>
            </div>

            <div style={styles.filterWrap}>
              <button className="rj" style={chipStyle(!groupFilter)} onClick={() => setGroupFilter(null)}>All</button>
              {gym.groups.map((g) => (
                <button key={g.id} className="rj" style={chipStyle(groupFilter === g.id)} onClick={() => setGroupFilter(g.id)}>
                  {L(g.title)}
                </button>
              ))}
            </div>

            <button className="rj" style={styles.primaryBtn} onClick={() => setScreen("learn")}>
              <BookOpen size={18} style={{ verticalAlign: "middle", marginRight: 8 }} />
              Learn the patterns
            </button>
            <button className="rj" style={styles.secondaryBtn} onClick={startPractice}>
              <Dumbbell size={18} style={{ verticalAlign: "middle", marginRight: 8 }} />
              Practice conjugations
            </button>
          </div>
        )}

        {screen === "learn" && (
          <div style={styles.col} className="fadein">
            <h2 className="rj" style={styles.title}>Learn</h2>
            <div style={styles.filterWrap}>
              <button className="rj" style={chipStyle(!groupFilter)} onClick={() => setGroupFilter(null)}>All</button>
              {gym.groups.map((g) => (
                <button key={g.id} className="rj" style={chipStyle(groupFilter === g.id)} onClick={() => setGroupFilter(g.id)}>
                  {L(g.title)}
                </button>
              ))}
            </div>

            {gym.groups
              .filter((g) => !groupFilter || g.id === groupFilter)
              .map((g) => (
                <p key={g.id} style={styles.note}>{L(g.note)}</p>
              ))}

            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
              {verbs.map((v) => {
                const open = openVerb === v.inf;
                return (
                  <div key={v.inf} style={styles.verbCard}>
                    <button className="rj" style={styles.verbHeader} onClick={() => setOpenVerb(open ? null : v.inf)}>
                      <span>
                        <b style={{ color: "#F3F0FA" }}>{v.inf}</b>{" "}
                        <span style={{ color: "#9B93B8", fontSize: 12 }}>{L(v.gloss)}</span>
                      </span>
                      <ChevronDown size={16} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s", color: "#9B93B8" }} />
                    </button>
                    {open && (
                      <div style={{ padding: "0 12px 12px" }}>
                        <div style={{ ...styles.filterWrap, marginBottom: 8 }}>
                          {gym.tenses.map((t) => (
                            <button key={t.id} className="rj" style={chipStyle(learnTense === t.id, true)} onClick={() => setLearnTense(t.id)}>
                              {L(t)}
                            </button>
                          ))}
                        </div>
                        <p style={styles.tenseWhy}>{L(gym.tenses.find((t) => t.id === learnTense)?.why)}</p>
                        <table style={styles.table}>
                          <tbody>
                            {gym.persons.map((p, pi) => (
                              <tr key={p.id}>
                                <td style={styles.tdPerson}>{p[gym.targetLang] || p.es}<span style={styles.tdPersonEn}> · {p.en}</span></td>
                                <td style={styles.tdForm} className="jm">{v.forms[learnTense]?.[pi]}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button className="rj" style={{ ...styles.primaryBtn, marginTop: 18 }} onClick={startPractice}>
              <Dumbbell size={18} style={{ verticalAlign: "middle", marginRight: 8 }} />
              Practice these
            </button>
            <button className="rj" style={styles.secondaryBtn} onClick={() => setScreen("start")}>Back to grammar gym</button>
          </div>
        )}

        {screen === "practice" && item && (
          <div style={styles.col} className="fadein">
            <p className="jm" style={{ color: "#9B93B8", fontSize: 12, marginBottom: 10 }}>
              {dIndex + 1} / {drill.length}
            </p>
            <div style={styles.qCard}>
              <div style={styles.qTense}>{L(item.tense)}</div>
              <p style={styles.qPrompt}>
                <b className="jm" style={{ color: "#E4D6FF" }}>{item.person[gym.targetLang] || item.person.es}</b>{" "}
                <span style={{ color: "#9B93B8", fontSize: 13 }}>({item.person.en})</span>
                <br />
                <span style={{ color: "#F3F0FA" }}>{item.verbInf}</span>{" "}
                <span style={{ color: "#9B93B8", fontSize: 13 }}>— {L(item.gloss)}</span>
              </p>
              <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
                {item.options.map((opt, i) => {
                  let bg = "#1D212B";
                  let border = "#3A3452";
                  let borderWidth = 1;
                  let color = "#F3F0FA";
                  if (answered) {
                    if (i === item.correctIdx) { bg = "#1E4A32"; border = "#5EE0A0"; borderWidth = 3; color = "#B9FFDA"; }
                    else if (i === selected) { bg = "#4A1E24"; border = "#FF7B8A"; borderWidth = 3; color = "#FFC7CD"; }
                  }
                  return (
                    <button
                      key={i}
                      className="rj jm"
                      disabled={answered}
                      onClick={() => answer(i)}
                      style={{ ...styles.optionBtn, background: bg, borderColor: border, borderWidth, color }}
                    >
                      <span>{opt}</span>
                      {answered && i === item.correctIdx && <Check size={20} color="#5EE0A0" strokeWidth={3} />}
                      {answered && i === selected && i !== item.correctIdx && <X size={20} color="#FF7B8A" strokeWidth={3} />}
                    </button>
                  );
                })}
              </div>
              {answered && (
                <p style={styles.whyLine}>{L(item.tense)} — {L(item.tense.why)}</p>
              )}
            </div>
            {answered && (
              <button className="rj" style={styles.primaryBtn} onClick={nextDrill}>
                {dIndex + 1 < drill.length ? "Next" : "Finish"} <ChevronRight size={18} style={{ verticalAlign: "middle" }} />
              </button>
            )}
            <button className="rj" style={styles.secondaryBtn} onClick={() => setScreen("start")}>Exit</button>
          </div>
        )}

        {screen === "done" && (
          <div style={styles.col} className="fadein">
            <h2 className="rj" style={styles.title}>Nice work!</h2>
            <div style={styles.statCard}>
              <div className="jm" style={{ color: "#F3F0FA", fontSize: 18, textAlign: "center" }}>
                {sessionCorrect} / {drill.length} correct this round
              </div>
              <div style={{ color: "#9B93B8", fontSize: 12, textAlign: "center", marginTop: 6 }}>
                All-time: {progress.practiced} practiced{accuracy !== null ? ` · ${accuracy}% correct` : ""}
              </div>
            </div>
            <button className="rj" style={styles.primaryBtn} onClick={startPractice}>
              <RotateCcw size={18} style={{ verticalAlign: "middle", marginRight: 8 }} />
              Another round
            </button>
            <button className="rj" style={styles.secondaryBtn} onClick={() => setScreen("start")}>Back to grammar gym</button>
          </div>
        )}
      </div>
    </div>
  );
}

function chipStyle(active, green) {
  const on = green ? "#B98EFF" : "#7BE495";
  return {
    background: "#171423",
    border: `1px solid ${active ? on : "#3A3452"}`,
    color: active ? on : "#B4ABC9",
    borderRadius: 999,
    padding: "6px 12px",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
  };
}

const styles = {
  bg: { position: "relative", minHeight: "100vh", width: "100%", background: "#171423", display: "flex", justifyContent: "center", padding: "20px 16px 60px", overflow: "hidden" },
  wrap: { position: "relative", zIndex: 1, width: "100%", maxWidth: 480 },
  col: { display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" },
  badge: { width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #7BE495, #B98EFF)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 },
  title: { fontSize: 26, fontWeight: 800, color: "#F3F0FA", margin: "0 0 4px" },
  subtitle: { color: "#B98EFF", fontSize: 13, fontWeight: 600, margin: "0 0 14px" },
  intro: { color: "#B4ABC9", fontSize: 13.5, lineHeight: 1.5, margin: "0 0 18px" },
  statCard: { width: "100%", background: "#221E33", border: "1px solid #3A3452", borderRadius: 12, padding: "12px 16px", marginBottom: 16 },
  filterWrap: { display: "flex", flexWrap: "wrap", gap: 6, width: "100%", marginBottom: 14, justifyContent: "center" },
  note: { color: "#B4ABC9", fontSize: 12.5, lineHeight: 1.5, background: "#1C1830", border: "1px solid #3A3452", borderRadius: 10, padding: "10px 12px", width: "100%", boxSizing: "border-box", marginBottom: 10, textAlign: "left" },
  verbCard: { width: "100%", background: "#221E33", border: "1px solid #3A3452", borderRadius: 12, overflow: "hidden" },
  verbHeader: { width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "transparent", border: "none", padding: "14px 12px", cursor: "pointer", fontSize: 15, textAlign: "left" },
  tenseWhy: { color: "#9B93B8", fontSize: 12, lineHeight: 1.4, margin: "0 0 10px", textAlign: "left" },
  table: { width: "100%", borderCollapse: "collapse" },
  tdPerson: { color: "#B4ABC9", fontSize: 13, padding: "6px 8px", borderBottom: "1px solid #2A2740", textAlign: "left", whiteSpace: "nowrap" },
  tdPersonEn: { color: "#9B93B8", fontSize: 11 },
  tdForm: { color: "#7BE495", fontSize: 15, fontWeight: 600, padding: "6px 8px", borderBottom: "1px solid #2A2740", textAlign: "right" },
  qCard: { width: "100%", background: "#221E33", border: "1px solid #B98EFF", borderRadius: 16, padding: "20px 18px", marginBottom: 14 },
  qTense: { display: "inline-block", color: "#E4D6FF", background: "#241B36", border: "1px solid #B98EFF", borderRadius: 999, fontSize: 11, fontWeight: 800, padding: "3px 10px", marginBottom: 12 },
  qPrompt: { color: "#F3F0FA", fontSize: 20, fontWeight: 600, lineHeight: 1.5, margin: 0 },
  optionBtn: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 16px", borderRadius: 10, border: "1px solid", cursor: "pointer", fontSize: 16, fontWeight: 600, textAlign: "left" },
  whyLine: { color: "#B4ABC9", fontSize: 12.5, lineHeight: 1.5, marginTop: 14, marginBottom: 0, textAlign: "left" },
  primaryBtn: { width: "100%", background: "#FF8FB1", color: "#171423", border: "none", borderRadius: 12, padding: "14px", fontSize: 15, fontWeight: 700, cursor: "pointer", marginTop: 8 },
  secondaryBtn: { width: "100%", background: "transparent", color: "#B4ABC9", border: "1px solid #3A3452", borderRadius: 12, padding: "12px", fontSize: 14, fontWeight: 600, cursor: "pointer", marginTop: 10 },
};

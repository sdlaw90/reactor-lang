"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { submitFeedback } from "../../lib/db";

const STEPS = ["The Basics", "First Impressions", "Core Experience", "Bugs & Performance", "The Big Picture"];

const SESSIONS_OPTIONS = ["1–2", "3–5", "6–10", "More than 10"];
const UNDERSTOOD_SCORING_OPTIONS = ["Yes, immediately", "Mostly, after a round or two", "It took a while", "Still not sure how it all works"];
const CATEGORY_OPTIONS = ["Vocabulary", "Grammar", "Idioms", "Phonetics"];
const DIFFICULTY_OPTIONS = ["Too easy", "Slightly easy", "Just right", "Slightly hard", "Too hard"];
const SESSION_LENGTH_FEEL_OPTIONS = ["Too short — I wanted longer rounds", "Just right", "Too long — I lost focus before the end"];
const PHONETICS_HELPFUL_OPTIONS = ["Very helpful", "Somewhat helpful", "Not helpful", "Didn't use them"];
const BUGS_OPTIONS = ["No, everything worked", "A few minor issues", "Several issues", "Major issues that blocked me from using the app"];
const DISAPPEAR_OPTIONS = ["Very disappointed", "Somewhat disappointed", "Not disappointed — I'd use something else"];

export default function FeedbackPage() {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    deviceBrowser: "",
    sessionsCompleted: "",
    signupEase: null,
    confusionAtStart: "",
    understoodScoring: "",
    categoriesUsed: [],
    favoriteCategoryWhy: "",
    difficultyFeel: "",
    comboSatisfaction: null,
    sessionLengthFeel: "",
    phoneticsHelpfulness: "",
    progressTrackingFeedback: "",
    bugsEncountered: "",
    bugDescription: "",
    speedRating: null,
    visualIssues: "",
    continuedUseLikelihood: null,
    recommendLikelihood: null,
    oneThingToFix: "",
    dailyUseFeature: "",
    disappearFeeling: "",
    anythingElse: "",
  });

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/auth");
        return;
      }
      setUserId(data.session.user.id);
    })();
  }, [router]);

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));
  const toggleMulti = (key) => (value) =>
    setForm((f) => ({ ...f, [key]: f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value] }));

  const validateStep = () => {
    if (step === 0 && (!form.name.trim() || !form.deviceBrowser.trim() || !form.sessionsCompleted)) {
      return "Name, device/browser, and sessions completed are needed to move on.";
    }
    if (step === 2 && form.categoriesUsed.length === 0) {
      return "Which categories you used is needed to move on.";
    }
    if (step === 3 && !form.bugsEncountered) {
      return "Whether you hit any bugs is needed to move on.";
    }
    return "";
  };

  const next = () => {
    const err = validateStep();
    if (err) {
      setError(err);
      return;
    }
    setError("");
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const back = () => {
    setError("");
    setStep((s) => Math.max(s - 1, 0));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.oneThingToFix.trim()) {
      setError("The one thing you'd fix first is needed before submitting.");
      return;
    }
    setError("");
    setBusy(true);
    try {
      await submitFeedback(userId, "beta_survey", form.oneThingToFix.trim(), typeof window !== "undefined" ? document.referrer : null, {
        sessionsCompleted: form.sessionsCompleted,
        continuedUseLikelihood: form.continuedUseLikelihood,
        recommendLikelihood: form.recommendLikelihood,
        details: {
          name: form.name.trim(),
          device_browser: form.deviceBrowser.trim(),
          signup_ease: form.signupEase,
          confusion_at_start: form.confusionAtStart.trim(),
          understood_scoring: form.understoodScoring,
          categories_used: form.categoriesUsed,
          favorite_category_why: form.favoriteCategoryWhy.trim(),
          difficulty_feel: form.difficultyFeel,
          combo_satisfaction: form.comboSatisfaction,
          session_length_feel: form.sessionLengthFeel,
          phonetics_helpfulness: form.phoneticsHelpfulness,
          progress_tracking_feedback: form.progressTrackingFeedback.trim(),
          bugs_encountered: form.bugsEncountered,
          bug_description: form.bugDescription.trim(),
          speed_rating: form.speedRating,
          visual_issues: form.visualIssues.trim(),
          daily_use_feature: form.dailyUseFeature.trim(),
          disappear_feeling: form.disappearFeeling,
          anything_else: form.anythingElse.trim(),
        },
      });
      setSubmitted(true);
    } catch (e) {
      console.error("submitFeedback failed", e);
      setError(`Something went wrong sending that: ${e?.message || "unknown error"} — mind trying again? If this keeps happening, screenshot this message and send it to the developer.`);
    } finally {
      setBusy(false);
    }
  };

  if (submitted) {
    return (
      <div style={styles.wrap}>
        <div style={{ width: "100%", maxWidth: 440, textAlign: "center" }}>
          <h1 className="rj" style={styles.title}>
            Thank you! 🐿️
          </h1>
          <p style={styles.body}>Your feedback was sent. It really does help shape what gets built next.</p>
          <button className="rj" style={styles.secondaryBtn} onClick={() => router.push("/")}>
            Back to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.wrap}>
      <div style={{ width: "100%", maxWidth: 460 }}>
        <button className="rj" style={styles.backBtn} onClick={() => router.back()}>
          ← Back
        </button>
        <h1 className="rj" style={styles.title}>
          Beta Feedback
        </h1>
        <p style={styles.subtitle}>Takes about 5–7 minutes. Your honest feedback — especially the critical stuff — is what makes this better.</p>

        <div style={styles.progressRow}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ ...styles.progressDot, ...(i <= step ? styles.progressDotActive : {}) }} />
          ))}
        </div>
        <p style={styles.stepLabel}>
          {step + 1}. {STEPS[step]}
        </p>

        <form onSubmit={step === STEPS.length - 1 ? submit : (e) => e.preventDefault()}>
          {step === 0 && (
            <>
              <Field label="Name or nickname" required>
                <input value={form.name} onChange={(e) => set("name")(e.target.value)} style={styles.input} />
              </Field>
              <Field label="What device and browser did you mainly use?" required>
                <input value={form.deviceBrowser} onChange={(e) => set("deviceBrowser")(e.target.value)} style={styles.input} placeholder="e.g. iPhone, Safari" aria-label="What device and browser did you mainly use?" />
              </Field>
              <Field label="Roughly how many sessions did you complete during the beta?" required>
                <RadioGroup options={SESSIONS_OPTIONS} value={form.sessionsCompleted} onChange={set("sessionsCompleted")} />
              </Field>
            </>
          )}

          {step === 1 && (
            <>
              <Field label="How easy was it to sign up and get started?">
                <ScaleInput value={form.signupEase} onChange={set("signupEase")} min={1} max={5} lowLabel="Confusing" highLabel="Effortless" />
              </Field>
              <Field label="Did anything confuse you or slow you down when you first opened the app?">
                <textarea value={form.confusionAtStart} onChange={(e) => set("confusionAtStart")(e.target.value)} style={styles.textarea} rows={3} />
              </Field>
              <Field label="Within your first session, did you understand how rounds and scoring worked?">
                <RadioGroup options={UNDERSTOOD_SCORING_OPTIONS} value={form.understoodScoring} onChange={set("understoodScoring")} />
              </Field>
            </>
          )}

          {step === 2 && (
            <>
              <Field label="Which question categories did you use?" required>
                <CheckboxGroup options={CATEGORY_OPTIONS} value={form.categoriesUsed} onToggle={toggleMulti("categoriesUsed")} />
              </Field>
              <Field label="Which category was your favorite, and why?">
                <textarea value={form.favoriteCategoryWhy} onChange={(e) => set("favoriteCategoryWhy")(e.target.value)} style={styles.textarea} rows={3} />
              </Field>
              <Field label="How did the difficulty feel overall?">
                <RadioGroup options={DIFFICULTY_OPTIONS} value={form.difficultyFeel} onChange={set("difficultyFeel")} />
              </Field>
              <Field label="How satisfying were the combo/streak mechanics?">
                <ScaleInput value={form.comboSatisfaction} onChange={set("comboSatisfaction")} min={1} max={5} lowLabel="Didn't care" highLabel="Kept me coming back" />
              </Field>
              <Field label="Did the session length feel right for you?">
                <RadioGroup options={SESSION_LENGTH_FEEL_OPTIONS} value={form.sessionLengthFeel} onChange={set("sessionLengthFeel")} />
              </Field>
              <Field label="If you used the phonetics features, how helpful were the simplified respellings?">
                <RadioGroup options={PHONETICS_HELPFUL_OPTIONS} value={form.phoneticsHelpfulness} onChange={set("phoneticsHelpfulness")} />
              </Field>
              <Field label="Did your progress tracking (scores, streaks, review of missed questions) work correctly and feel motivating?">
                <textarea value={form.progressTrackingFeedback} onChange={(e) => set("progressTrackingFeedback")(e.target.value)} style={styles.textarea} rows={3} />
              </Field>
            </>
          )}

          {step === 3 && (
            <>
              <Field label="Did you hit any bugs, glitches, or errors?" required>
                <RadioGroup options={BUGS_OPTIONS} value={form.bugsEncountered} onChange={set("bugsEncountered")} />
              </Field>
              <Field label="Describe any bugs you found — what you did, what you expected, and what actually happened.">
                <textarea value={form.bugDescription} onChange={(e) => set("bugDescription")(e.target.value)} style={styles.textarea} rows={4} />
              </Field>
              <Field label="How was the app's speed and responsiveness?">
                <ScaleInput value={form.speedRating} onChange={set("speedRating")} min={1} max={5} lowLabel="Slow / laggy" highLabel="Fast and smooth" />
              </Field>
              <Field label="Did anything look broken or awkward visually (layout, text overflow, buttons, mobile sizing)?">
                <textarea value={form.visualIssues} onChange={(e) => set("visualIssues")(e.target.value)} style={styles.textarea} rows={3} />
              </Field>
            </>
          )}

          {step === 4 && (
            <>
              <Field label="How likely are you to keep using SquirreLingo after the beta?" required>
                <ScaleInput value={form.continuedUseLikelihood} onChange={set("continuedUseLikelihood")} min={1} max={5} lowLabel="Definitely not" highLabel="Definitely yes" />
              </Field>
              <Field label="How likely are you to recommend SquirreLingo to a friend learning a language?" required>
                <ScaleInput value={form.recommendLikelihood} onChange={set("recommendLikelihood")} min={0} max={10} lowLabel="Not at all likely" highLabel="Extremely likely" />
              </Field>
              <Field label="What's the ONE thing you'd fix or change first?" required>
                <textarea value={form.oneThingToFix} onChange={(e) => set("oneThingToFix")(e.target.value)} style={styles.textarea} rows={3} />
              </Field>
              <Field label="What feature would make you use SquirreLingo every day?">
                <textarea value={form.dailyUseFeature} onChange={(e) => set("dailyUseFeature")(e.target.value)} style={styles.textarea} rows={3} />
              </Field>
              <Field label="If SquirreLingo disappeared tomorrow, how would you feel?">
                <RadioGroup options={DISAPPEAR_OPTIONS} value={form.disappearFeeling} onChange={set("disappearFeeling")} />
              </Field>
              <Field label="Anything else — praise, complaints, wild ideas?">
                <textarea value={form.anythingElse} onChange={(e) => set("anythingElse")(e.target.value)} style={styles.textarea} rows={3} />
              </Field>
            </>
          )}

          {error && <p style={styles.error}>{error}</p>}

          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            {step > 0 && (
              <button type="button" className="rj" style={styles.secondaryBtn} onClick={back}>
                Back
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button type="button" className="rj" style={styles.primaryBtn} onClick={next}>
                Next
              </button>
            ) : (
              <button type="submit" className="rj" style={styles.primaryBtn} disabled={busy}>
                {busy ? "Sending..." : "Send feedback"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={styles.label}>
        {label} {required && <span style={{ color: "#FF7B8A" }}>*</span>}
      </label>
      {children}
    </div>
  );
}

function RadioGroup({ options, value, onChange }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          className="rj"
          style={{ ...styles.choiceBtn, ...(value === opt ? styles.choiceBtnActive : {}) }}
          onClick={() => onChange(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function CheckboxGroup({ options, value, onToggle }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          className="rj"
          style={{ ...styles.choiceBtn, ...(value.includes(opt) ? styles.choiceBtnActive : {}) }}
          onClick={() => onToggle(opt)}
        >
          {value.includes(opt) ? "☑ " : "☐ "}
          {opt}
        </button>
      ))}
    </div>
  );
}

function ScaleInput({ value, onChange, min, max, lowLabel, highLabel }) {
  const nums = [];
  for (let i = min; i <= max; i++) nums.push(i);
  return (
    <div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {nums.map((n) => (
          <button
            key={n}
            type="button"
            className="rj"
            style={{ ...styles.scaleBtn, ...(value === n ? styles.scaleBtnActive : {}) }}
            onClick={() => onChange(n)}
          >
            {n}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
        <span style={styles.scaleLabel}>{lowLabel}</span>
        <span style={styles.scaleLabel}>{highLabel}</span>
      </div>
    </div>
  );
}

const styles = {
  wrap: { minHeight: "100vh", display: "flex", justifyContent: "center", padding: "40px 20px", background: "#171423" },
  backBtn: {
    background: "rgba(255,143,177,0.12)",
    color: "#FF8FB1",
    border: "1px solid #FF8FB1",
    borderRadius: 8,
    padding: "7px 14px",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    marginBottom: 16,
  },
  title: { fontSize: 22, fontWeight: 700, color: "#F3F0FA", margin: "0 0 6px", textAlign: "center" },
  subtitle: { color: "#B4ABC9", fontSize: 13, lineHeight: 1.5, marginBottom: 20, textAlign: "center" },
  body: { color: "#B4ABC9", fontSize: 14, lineHeight: 1.6, margin: "12px 0 24px" },
  progressRow: { display: "flex", gap: 6, justifyContent: "center", marginBottom: 10 },
  progressDot: { width: 22, height: 4, borderRadius: 2, background: "#3A3452" },
  progressDotActive: { background: "#FF8FB1" },
  stepLabel: { color: "#7C7395", fontSize: 12, fontWeight: 700, textAlign: "center", marginBottom: 20, textTransform: "uppercase", letterSpacing: 0.5 },
  label: { display: "block", color: "#B4ABC9", fontSize: 13, fontWeight: 600, marginBottom: 8, lineHeight: 1.4 },
  input: {
    width: "100%",
    background: "#221E33",
    border: "1px solid #3A3452",
    borderRadius: 10,
    padding: "11px 14px",
    color: "#F3F0FA",
    fontSize: 14,
    fontFamily: "inherit",
  },
  textarea: {
    width: "100%",
    background: "#221E33",
    border: "1px solid #3A3452",
    borderRadius: 12,
    padding: "12px 14px",
    color: "#F3F0FA",
    fontSize: 14,
    lineHeight: 1.5,
    resize: "vertical",
    fontFamily: "inherit",
  },
  choiceBtn: {
    textAlign: "left",
    background: "#221E33",
    color: "#B4ABC9",
    border: "1px solid #3A3452",
    borderRadius: 10,
    padding: "10px 14px",
    fontSize: 13.5,
    cursor: "pointer",
  },
  choiceBtnActive: { background: "rgba(255,143,177,0.12)", color: "#FF8FB1", borderColor: "#FF8FB1" },
  scaleBtn: {
    minWidth: 36,
    flex: 1,
    background: "#221E33",
    color: "#B4ABC9",
    border: "1px solid #3A3452",
    borderRadius: 8,
    padding: "10px 0",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
  },
  scaleBtnActive: { background: "#FF8FB1", color: "#171423", borderColor: "#FF8FB1" },
  scaleLabel: { color: "#7C7395", fontSize: 11 },
  error: { color: "#FF7B8A", fontSize: 13, marginTop: 14 },
  primaryBtn: {
    flex: 1,
    background: "#FF8FB1",
    color: "#171423",
    border: "none",
    borderRadius: 12,
    padding: "14px",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
  },
  secondaryBtn: {
    flex: 1,
    background: "transparent",
    color: "#3DDBFF",
    border: "1px solid #3DDBFF",
    borderRadius: 12,
    padding: "12px",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
  },
};

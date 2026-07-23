"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "../../lib/Logo";
import { supabase } from "../../lib/supabaseClient";
import PasswordInput from "../../lib/PasswordInput";
import PasswordStrengthMeter from "../../lib/PasswordStrengthMeter";
import UsernameAvailabilityField from "../../lib/UsernameAvailabilityField";
import { isUsernameTaken } from "../../lib/db";
import { SECURITY_QUESTIONS } from "../../lib/securityQuestions";
import { FACEBOOK_GROUP_URL } from "../../lib/community";

const STEPS = ["About You", "Language Background", "Practice Habits & Fit", "Beta Commitment", "Your Account"];

const DEVICE_OPTIONS = ["Android phone", "iPhone", "Tablet (Android or iPad)", "Desktop/laptop browser (Windows or Mac)", "Chromebook"];
const BROWSER_OPTIONS = ["Chrome", "Safari", "Firefox", "Edge", "Samsung Internet", "Other"];
const AGE_OPTIONS = ["Under 18", "18–24", "25–34", "35–44", "45–54", "55+"];
const LEVEL_OPTIONS = [
  "Complete beginner (a few words at most)",
  "Beginner (basic phrases, simple vocabulary)",
  "Intermediate (can hold simple conversations)",
  "Advanced (comfortable in most conversations)",
  "Native/fluent",
];
const APPS_OPTIONS = ["Duolingo", "Babbel", "Rosetta Stone", "Anki / flashcards", "Classes or tutoring", "Immersion (family, friends, travel, work)", "None — this would be my first"];
const FREQUENCY_OPTIONS = ["Multiple times a day", "Once a day", "A few times a week", "Once a week", "Sporadically"];
const SESSION_LENGTH_OPTIONS = ["Under 5 minutes", "5–10 minutes", "10–20 minutes", "20+ minutes"];
const FOCUS_OPTIONS = ["Yes, very much", "Somewhat", "Not really", "Not sure"];
const COMMITMENT_OPTIONS = ["15+ minutes most days", "A few sessions per week", "One or two sessions per week", "Only occasional use"];
const PRIOR_BETA_OPTIONS = ["Yes, several times", "Once or twice", "No, this would be my first"];

export default function BetaApplyPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  // Auto-approve flow (#65 workaround): the applicant chooses their own
  // username + password on the last step and is signed in immediately.
  // accountCreated covers the rare case where the account exists but the
  // automatic sign-in failed — they can sign in manually with what they chose.
  const [accountCreated, setAccountCreated] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    passwordConfirm: "",
    passwordHint: "",
    securityQuestions: [
      { key: "", answer: "" },
      { key: "", answer: "" },
      { key: "", answer: "" },
    ],
    ageRange: "",
    devices: [],
    browser: "",
    nativeLanguage: "",
    targetLanguages: "",
    currentLevel: "",
    dialectPreference: "",
    appsUsed: [],
    biggestFrustration: "",
    practiceFrequency: "",
    sessionLengthPref: "",
    appealScore: null,
    focusDifficulty: "",
    timeCommitment: "",
    priorBetaExperience: "",
    bugReportComfort: null,
    reason: "",
    anythingElse: "",
  });

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));
  const toggleMulti = (key) => (value) =>
    setForm((f) => ({ ...f, [key]: f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value] }));

  const validateStep = () => {
    if (step === 0) {
      if (!form.name.trim() || !form.email.trim() || form.devices.length === 0) {
        return "Name, email, and at least one device are needed to move on.";
      }
    }
    if (step === 1) {
      if (!form.nativeLanguage.trim() || !form.targetLanguages.trim() || !form.currentLevel) {
        return "Your native language, target language(s), and current level are needed to move on.";
      }
    }
    if (step === 2) {
      if (!form.practiceFrequency || !form.sessionLengthPref) {
        return "Practice frequency and session length are needed to move on.";
      }
    }
    if (step === 3) {
      if (!form.timeCommitment) {
        return "How much time you could commit is needed to move on.";
      }
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
    const uname = form.username.trim();
    if (uname.length < 3 || !/^[A-Za-z0-9_]+$/.test(uname)) {
      setError("Username must be at least 3 characters (letters, numbers, and _ only).");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.passwordConfirm) {
      setError("Passwords don't match.");
      return;
    }
    // Password recovery (#79) is optional, but all-or-nothing: three complete
    // question+answer pairs with distinct questions, or none at all.
    const sqFilled = form.securityQuestions.filter((q) => q.key || q.answer.trim());
    const sqComplete = form.securityQuestions.every((q) => q.key && q.answer.trim());
    if (sqFilled.length > 0 && !sqComplete) {
      setError("Security questions: fill in all three questions and answers, or leave all three empty to skip.");
      return;
    }
    if (sqComplete && new Set(form.securityQuestions.map((q) => q.key)).size !== 3) {
      setError("Security questions: pick three different questions.");
      return;
    }
    setError("");
    setBusy(true);
    try {
      // Best-effort availability pre-check (the API re-checks authoritatively).
      try {
        if (await isUsernameTaken(uname)) {
          setError("That username is already taken — try Verify above for available alternatives.");
          setBusy(false);
          return;
        }
      } catch {
        // Non-fatal: the server performs the authoritative check.
      }

      const resp = await fetch("/api/beta-apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          username: uname,
          password: form.password,
          passwordHint: form.passwordHint.trim(),
          securityQuestions: sqComplete
            ? form.securityQuestions.map((q) => ({ key: q.key, answer: q.answer }))
            : null,
          reason: form.reason.trim(),
          languagesInterested: form.targetLanguages.trim(),
          nativeLanguage: form.nativeLanguage.trim(),
          currentLevel: form.currentLevel,
          details: {
            age_range: form.ageRange,
            devices: form.devices,
            browser: form.browser,
            dialect_preference: form.dialectPreference.trim(),
            apps_used: form.appsUsed,
            biggest_frustration: form.biggestFrustration.trim(),
            practice_frequency: form.practiceFrequency,
            session_length_pref: form.sessionLengthPref,
            appeal_score: form.appealScore,
            focus_difficulty: form.focusDifficulty,
            time_commitment: form.timeCommitment,
            prior_beta_experience: form.priorBetaExperience,
            bug_report_comfort: form.bugReportComfort,
            anything_else: form.anythingElse.trim(),
          },
        }),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        setError(data.error || "Something went wrong submitting your application — please try again.");
        setBusy(false);
        return;
      }
      if (data.autoApproved) {
        // Account exists with the password they chose — sign them straight in.
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: form.email.trim(),
          password: form.password,
        });
        if (!signInError) {
          router.push("/");
          return;
        }
        // Account created but auto sign-in hiccuped: they know their own
        // credentials, so hand them to the sign-in page instead of erroring.
        console.error("auto sign-in after beta apply failed", signInError);
        setAccountCreated(true);
        setSubmitted(true);
        setBusy(false);
        return;
      }
      setSubmitted(true);
      setBusy(false);
    } catch (e2) {
      console.error("beta application submit failed", e2);
      setError("Something went wrong submitting your application — please try again.");
      setBusy(false);
    }
  };


  if (submitted && accountCreated) {
    return (
      <div style={styles.wrap}>
        <div style={{ width: "100%", maxWidth: 440, textAlign: "center" }}>
          <Logo size={44} />
          <h1 className="rj" style={styles.title}>
            You're in! 🐿️
          </h1>
          <p style={styles.body}>
            Your beta account is ready — sign in with the email and password you just chose.
          </p>
          <p style={styles.body}>
            While you're at it: the{" "}
            <a href={FACEBOOK_GROUP_URL} target="_blank" rel="noopener noreferrer" style={{ color: "#FF8FB1" }}>
              SquirreLingo Facebook group
            </a>{" "}
            is where release news and tester chat happen — it's private during the beta, so request to join and
            you'll be approved.
          </p>
          <button className="rj" style={{ ...styles.primaryBtn, width: "100%" }} onClick={() => router.push("/auth")}>
            Go to sign in
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={styles.wrap}>
        <div style={{ width: "100%", maxWidth: 440, textAlign: "center" }}>
          <Logo size={44} />
          <h1 className="rj" style={styles.title}>
            Thanks for applying! 🐿️
          </h1>
          <p style={styles.body}>
            Your application was received. If you're a good fit for the current round of testing, you'll hear
            back at the email you provided.
          </p>
          <p style={styles.body}>
            While you're at it: the{" "}
            <a href={FACEBOOK_GROUP_URL} target="_blank" rel="noopener noreferrer" style={{ color: "#FF8FB1" }}>
              SquirreLingo Facebook group
            </a>{" "}
            is where release news and tester chat happen — it's private during the beta, so request to join and
            you'll be approved.
          </p>
          <button className="rj" style={styles.secondaryBtn} onClick={() => router.push("/auth")}>
            Already have an invite? Sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.wrap}>
      <div style={{ width: "100%", maxWidth: 460 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
          <Logo size={36} />
        </div>
        <h1 className="rj" style={styles.title}>
          Apply to beta test
        </h1>
        <p style={styles.subtitle}>Takes about 3 minutes. Tell us about you and how you like to practice.</p>

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
              <Field label="Name or nickname" required htmlFor="ba-name">
                <input id="ba-name" value={form.name} onChange={(e) => set("name")(e.target.value)} style={styles.input} />
              </Field>
              <Field label="Email" required htmlFor="ba-email">
                <input id="ba-email" type="email" value={form.email} onChange={(e) => set("email")(e.target.value)} style={styles.input} />
              </Field>
              <Field label="How old are you?">
                <RadioGroup options={AGE_OPTIONS} value={form.ageRange} onChange={set("ageRange")} />
              </Field>
              <Field label="What device(s) would you test SquirreLingo on?" required>
                <CheckboxGroup options={DEVICE_OPTIONS} value={form.devices} onToggle={toggleMulti("devices")} />
              </Field>
              <Field label="Which browser do you use most on that device?">
                <RadioGroup options={BROWSER_OPTIONS} value={form.browser} onChange={set("browser")} />
              </Field>
            </>
          )}

          {step === 1 && (
            <>
              <Field label="What is your native language (or strongest language)?" required htmlFor="ba-native-language">
                <input id="ba-native-language" value={form.nativeLanguage} onChange={(e) => set("nativeLanguage")(e.target.value)} style={styles.input} />
              </Field>
              <Field label="Which language(s) do you want to practice with SquirreLingo?" required htmlFor="ba-target-languages">
                <input id="ba-target-languages" value={form.targetLanguages} onChange={(e) => set("targetLanguages")(e.target.value)} style={styles.input} />
              </Field>
              <Field label="How would you rate your current level in that language?" required>
                <RadioGroup options={LEVEL_OPTIONS} value={form.currentLevel} onChange={set("currentLevel")} />
              </Field>
              <Field label="Any preference for a specific regional variety or dialect (e.g. Latin American vs. European Spanish)?" htmlFor="ba-dialect">
                <input id="ba-dialect" value={form.dialectPreference} onChange={(e) => set("dialectPreference")(e.target.value)} style={styles.input} />
              </Field>
              <Field label="Which language-learning apps or methods have you used before?">
                <CheckboxGroup options={APPS_OPTIONS} value={form.appsUsed} onToggle={toggleMulti("appsUsed")} />
              </Field>
              <Field label="What's your biggest frustration with the language apps you've tried?" htmlFor="ba-frustration">
                <textarea id="ba-frustration" value={form.biggestFrustration} onChange={(e) => set("biggestFrustration")(e.target.value)} style={styles.textarea} rows={3} />
              </Field>
            </>
          )}

          {step === 2 && (
            <>
              <Field label="How often do you realistically see yourself practicing?" required>
                <RadioGroup options={FREQUENCY_OPTIONS} value={form.practiceFrequency} onChange={set("practiceFrequency")} />
              </Field>
              <Field label="How long is your ideal practice session?" required>
                <RadioGroup options={SESSION_LENGTH_OPTIONS} value={form.sessionLengthPref} onChange={set("sessionLengthPref")} />
              </Field>
              <Field label="SquirreLingo uses short rounds, instant feedback, and streak/combo mechanics instead of penalties (plus a calmer no-timer mode). How appealing does that sound?">
                <ScaleInput value={form.appealScore} onChange={set("appealScore")} min={1} max={5} lowLabel="Not my style" highLabel="Exactly what I want" />
              </Field>
              <Field label="Do you find it hard to stay focused or consistent with traditional study methods?">
                <RadioGroup options={FOCUS_OPTIONS} value={form.focusDifficulty} onChange={set("focusDifficulty")} />
              </Field>
            </>
          )}

          {step === 3 && (
            <>
              <Field label="During the beta period (about 2–4 weeks), how much time could you commit to testing?" required>
                <RadioGroup options={COMMITMENT_OPTIONS} value={form.timeCommitment} onChange={set("timeCommitment")} />
              </Field>
              <Field label="Have you beta tested apps or software before?">
                <RadioGroup options={PRIOR_BETA_OPTIONS} value={form.priorBetaExperience} onChange={set("priorBetaExperience")} />
              </Field>
              <Field label="How comfortable are you reporting bugs with details (what you did, what happened, screenshots)?">
                <ScaleInput value={form.bugReportComfort} onChange={set("bugReportComfort")} min={1} max={5} lowLabel="Not comfortable" highLabel="Very comfortable" />
              </Field>
              <Field label="Why do you want to beta test SquirreLingo?" htmlFor="ba-reason">
                <textarea id="ba-reason" value={form.reason} onChange={(e) => set("reason")(e.target.value)} style={styles.textarea} rows={3} />
              </Field>
              <Field label="Anything else we should know about you?" htmlFor="ba-anything-else">
                <textarea id="ba-anything-else" value={form.anythingElse} onChange={(e) => set("anythingElse")(e.target.value)} style={styles.textarea} rows={3} />
              </Field>
            </>
          )}

          {step === 4 && (
            <>
              <p style={styles.body}>
                Last step — set up your login. Your account is created the moment you submit, and you'll be
                signed in right away.
              </p>
              <Field label="Pick a username" required>
                <UsernameAvailabilityField value={form.username} onChange={set("username")} />
                <p style={styles.fieldHint}>At least 3 characters — letters, numbers, and _ only.</p>
              </Field>
              <Field label="Choose a password" required>
                <PasswordInput
                  placeholder="Password (min 6 characters)"
                  value={form.password}
                  onChange={(e) => set("password")(e.target.value)}
                  style={styles.input}
                />
                <PasswordStrengthMeter password={form.password} />
              </Field>
              <Field label="Confirm password" required>
                <PasswordInput
                  placeholder="Repeat password"
                  value={form.passwordConfirm}
                  onChange={(e) => set("passwordConfirm")(e.target.value)}
                  style={{
                    ...styles.input,
                    ...(form.passwordConfirm
                      ? { borderColor: form.passwordConfirm === form.password ? "#5EE0A0" : "#FF7B8A" }
                      : {}),
                  }}
                />
                {form.passwordConfirm && form.passwordConfirm !== form.password && (
                  <p style={styles.fieldError}>Passwords don&apos;t match yet.</p>
                )}
                {form.passwordConfirm && form.passwordConfirm === form.password && (
                  <p style={styles.fieldOk}>Passwords match ✓</p>
                )}
              </Field>

              <p style={{ ...styles.body, marginTop: 18 }}>
                <strong>Password recovery (optional, recommended):</strong> we can&apos;t email reset links during the
                beta, so a password hint and three security questions are the only way to reset a forgotten password
                yourself. Skip them and you&apos;d have to request an admin reset instead. You can also set these up
                later in Settings.
              </p>
              <Field label="Password hint" htmlFor="ba-password-hint">
                <input
                  id="ba-password-hint"
                  type="text"
                  placeholder="A hint only you understand (shown on the reset page)"
                  value={form.passwordHint}
                  onChange={(e) => set("passwordHint")(e.target.value)}
                  maxLength={200}
                  style={styles.input}
                />
              </Field>
              {form.securityQuestions.map((q, idx) => {
                const takenElsewhere = new Set(
                  form.securityQuestions.filter((_, i) => i !== idx).map((sq) => sq.key)
                );
                const setSq = (patch) =>
                  set("securityQuestions")(
                    form.securityQuestions.map((sq, i) => (i === idx ? { ...sq, ...patch } : sq))
                  );
                return (
                  <Field key={idx} label={`Security question ${idx + 1}`}>
                    <select
                      aria-label={`Security question ${idx + 1}`}
                      value={q.key}
                      onChange={(e) => setSq({ key: e.target.value })}
                      style={{ ...styles.input, marginBottom: 8 }}
                    >
                      <option value="">— Choose a question —</option>
                      {SECURITY_QUESTIONS.filter((opt) => !takenElsewhere.has(opt.key)).map((opt) => (
                        <option key={opt.key} value={opt.key}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      aria-label={`Answer to security question ${idx + 1}`}
                      placeholder="Answer (not case-sensitive)"
                      value={q.answer}
                      onChange={(e) => setSq({ answer: e.target.value })}
                      autoComplete="off"
                      style={styles.input}
                    />
                  </Field>
                );
              })}
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
                {busy ? "Sending..." : "Submit application"}
              </button>
            )}
          </div>
        </form>

        <p style={styles.footer}>
          Already have an account? <a href="/auth" style={styles.link}>Sign in instead</a>.
        </p>
      </div>
    </div>
  );
}

function Field({ label, required, htmlFor, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label htmlFor={htmlFor} style={styles.label}>
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
      <div style={{ display: "flex", gap: 6 }}>
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
  title: { fontSize: 22, fontWeight: 700, color: "#F3F0FA", margin: "0 0 6px", textAlign: "center" },
  subtitle: { color: "#B4ABC9", fontSize: 13, lineHeight: 1.5, marginBottom: 20, textAlign: "center" },
  body: { color: "#B4ABC9", fontSize: 14, lineHeight: 1.6, margin: "12px 0 24px" },
  fieldHint: { color: "#9B93B8", fontSize: 12, margin: "6px 0 0" },
  fieldError: { color: "#FF7B8A", fontSize: 12, margin: "6px 0 0" },
  fieldOk: { color: "#5EE0A0", fontSize: 12, margin: "6px 0 0" },
  progressRow: { display: "flex", gap: 6, justifyContent: "center", marginBottom: 10 },
  progressDot: { width: 28, height: 4, borderRadius: 2, background: "#3A3452" },
  progressDotActive: { background: "#FF8FB1" },
  stepLabel: { color: "#9B93B8", fontSize: 12, fontWeight: 700, textAlign: "center", marginBottom: 20, textTransform: "uppercase", letterSpacing: 0.5 },
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
  scaleLabel: { color: "#9B93B8", fontSize: 11 },
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
  credentialsBox: {
    background: "#221E33",
    border: "1px solid #3A3452",
    borderRadius: 12,
    padding: "14px 16px",
    margin: "0 0 14px",
    textAlign: "left",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  credentialRow: { display: "flex", flexDirection: "column", gap: 2 },
  credentialLabel: { color: "#9B93B8", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 },
  credentialValue: {
    color: "#F3F0FA",
    fontSize: 15,
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
    wordBreak: "break-all",
    userSelect: "all",
  },
  credentialHint: { color: "#9B93B8", fontSize: 12, margin: "10px 0 14px" },
  footer: { color: "#9B93B8", fontSize: 12.5, textAlign: "center", marginTop: 20 },
  link: { color: "#3DDBFF", textDecoration: "underline" },
};

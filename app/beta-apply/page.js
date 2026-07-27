"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "../../lib/Logo";
import { supabase } from "../../lib/supabaseClient";
import PasswordInput from "../../lib/PasswordInput";
import PasswordStrengthMeter from "../../lib/PasswordStrengthMeter";
import UsernameAvailabilityField from "../../lib/UsernameAvailabilityField";
import { isUsernameTaken } from "../../lib/db";
import { SECURITY_QUESTIONS, questionLabel } from "../../lib/securityQuestions";
import { FACEBOOK_GROUP_URL } from "../../lib/community";
import { t } from "../../lib/playStrings";
import { useUiLang } from "../../lib/uiLang";
import LangSwitcher from "../../lib/LangSwitcher";

const STEPS = ["About You", "Language Background", "Practice Habits & Fit", "Beta Commitment", "Your Account"];
const STEP_KEYS = ["baStepAboutYou", "baStepLangBg", "baStepHabits", "baStepCommitment", "baStepAccount"];

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

// Each option's English string stays the canonical stored/POSTed value; this
// maps it to a playStrings key so ONLY the displayed label is localized. Values,
// comparisons, and the request body are untouched.
const OPTION_KEY = {
  "Under 18": "baAgeUnder18", "18–24": "baAge18_24", "25–34": "baAge25_34",
  "35–44": "baAge35_44", "45–54": "baAge45_54", "55+": "baAge55plus",
  "Android phone": "baDevAndroid", "iPhone": "baDevIphone", "Tablet (Android or iPad)": "baDevTablet",
  "Desktop/laptop browser (Windows or Mac)": "baDevDesktop", "Chromebook": "baDevChromebook",
  "Chrome": "baBrowChrome", "Safari": "baBrowSafari", "Firefox": "baBrowFirefox",
  "Edge": "baBrowEdge", "Samsung Internet": "baBrowSamsung", "Other": "baBrowOther",
  "Complete beginner (a few words at most)": "baLvlComplete",
  "Beginner (basic phrases, simple vocabulary)": "baLvlBeginner",
  "Intermediate (can hold simple conversations)": "baLvlIntermediate",
  "Advanced (comfortable in most conversations)": "baLvlAdvanced",
  "Native/fluent": "baLvlNative",
  "Duolingo": "baAppDuolingo", "Babbel": "baAppBabbel", "Rosetta Stone": "baAppRosetta",
  "Anki / flashcards": "baAppAnki", "Classes or tutoring": "baAppClasses",
  "Immersion (family, friends, travel, work)": "baAppImmersion", "None — this would be my first": "baAppNone",
  "Multiple times a day": "baFreqMulti", "Once a day": "baFreqDaily", "A few times a week": "baFreqFewWeek",
  "Once a week": "baFreqWeekly", "Sporadically": "baFreqSporadic",
  "Under 5 minutes": "baSlenUnder5", "5–10 minutes": "baSlen5_10", "10–20 minutes": "baSlen10_20", "20+ minutes": "baSlen20plus",
  "Yes, very much": "baFocusVery", "Somewhat": "baFocusSomewhat", "Not really": "baFocusNotReally", "Not sure": "baFocusNotSure",
  "15+ minutes most days": "baCommitDaily", "A few sessions per week": "baCommitFew",
  "One or two sessions per week": "baCommitOneTwo", "Only occasional use": "baCommitOccasional",
  "Yes, several times": "baPriorSeveral", "Once or twice": "baPriorOnceTwice", "No, this would be my first": "baPriorFirst",
};
const optLabel = (uiLang, opt) => (OPTION_KEY[opt] ? t(uiLang, OPTION_KEY[opt]) : opt);

export default function BetaApplyPage() {
  const router = useRouter();
  const [uiLang] = useUiLang();
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
        return t(uiLang, "baErrStep0");
      }
    }
    if (step === 1) {
      if (!form.nativeLanguage.trim() || !form.targetLanguages.trim() || !form.currentLevel) {
        return t(uiLang, "baErrStep1");
      }
    }
    if (step === 2) {
      if (!form.practiceFrequency || !form.sessionLengthPref) {
        return t(uiLang, "baErrStep2");
      }
    }
    if (step === 3) {
      if (!form.timeCommitment) {
        return t(uiLang, "baErrStep3");
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
      setError(t(uiLang, "baErrUsername"));
      return;
    }
    if (form.password.length < 6) {
      setError(t(uiLang, "baErrPwLen"));
      return;
    }
    if (form.password !== form.passwordConfirm) {
      setError(t(uiLang, "baErrPwMismatch"));
      return;
    }
    // Password recovery (#79) is optional, but all-or-nothing: three complete
    // question+answer pairs with distinct questions, or none at all.
    const sqFilled = form.securityQuestions.filter((q) => q.key || q.answer.trim());
    const sqComplete = form.securityQuestions.every((q) => q.key && q.answer.trim());
    if (sqFilled.length > 0 && !sqComplete) {
      setError(t(uiLang, "baErrSqPartial"));
      return;
    }
    if (sqComplete && new Set(form.securityQuestions.map((q) => q.key)).size !== 3) {
      setError(t(uiLang, "baErrSqDistinct"));
      return;
    }
    setError("");
    setBusy(true);
    try {
      // Best-effort availability pre-check (the API re-checks authoritatively).
      try {
        if (await isUsernameTaken(uname)) {
          setError(t(uiLang, "baErrUserTaken"));
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
        setError(data.error || t(uiLang, "baErrGeneric"));
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
      setError(t(uiLang, "baErrGeneric"));
      setBusy(false);
    }
  };


  if (submitted && accountCreated) {
    return (
      <div style={styles.wrap}>
        <LangSwitcher />
        <div style={{ width: "100%", maxWidth: 440, textAlign: "center" }}>
          <Logo size={44} />
          <h1 className="rj" style={styles.title}>
            {t(uiLang, "baOkTitle")}
          </h1>
          <p style={styles.body}>
            {t(uiLang, "baOkBody1")}
          </p>
          <p style={styles.body}>
            {t(uiLang, "baFbPre")}
            <a href={FACEBOOK_GROUP_URL} target="_blank" rel="noopener noreferrer" style={{ color: "#FFA6BE" }}>
              {t(uiLang, "baFbLink")}
            </a>
            {t(uiLang, "baFbPost")}
          </p>
          <button className="rj" style={{ ...styles.primaryBtn, width: "100%" }} onClick={() => router.push("/auth")}>
            {t(uiLang, "baOkBtn")}
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={styles.wrap}>
        <LangSwitcher />
        <div style={{ width: "100%", maxWidth: 440, textAlign: "center" }}>
          <Logo size={44} />
          <h1 className="rj" style={styles.title}>
            {t(uiLang, "baThanksTitle")}
          </h1>
          <p style={styles.body}>
            {t(uiLang, "baThanksBody1")}
          </p>
          <p style={styles.body}>
            {t(uiLang, "baFbPre")}
            <a href={FACEBOOK_GROUP_URL} target="_blank" rel="noopener noreferrer" style={{ color: "#FFA6BE" }}>
              {t(uiLang, "baFbLink")}
            </a>
            {t(uiLang, "baFbPost")}
          </p>
          <button className="rj" style={styles.secondaryBtn} onClick={() => router.push("/auth")}>
            {t(uiLang, "baThanksBtn")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.wrap}>
      <LangSwitcher />
      <div style={{ width: "100%", maxWidth: 460 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
          <Logo size={36} />
        </div>
        <h1 className="rj" style={styles.title}>
          {t(uiLang, "baTitle")}
        </h1>
        <p style={styles.subtitle}>{t(uiLang, "baSubtitle")}</p>

        <div style={styles.progressRow}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ ...styles.progressDot, ...(i <= step ? styles.progressDotActive : {}) }} />
          ))}
        </div>
        <p style={styles.stepLabel}>
          {step + 1}. {t(uiLang, STEP_KEYS[step])}
        </p>

        <form onSubmit={step === STEPS.length - 1 ? submit : (e) => e.preventDefault()}>
          {step === 0 && (
            <>
              <Field label={t(uiLang, "baFieldName")} required htmlFor="ba-name">
                <input id="ba-name" value={form.name} onChange={(e) => set("name")(e.target.value)} style={styles.input} />
              </Field>
              <Field label={t(uiLang, "baFieldEmail")} required htmlFor="ba-email">
                <input id="ba-email" type="email" value={form.email} onChange={(e) => set("email")(e.target.value)} style={styles.input} />
              </Field>
              <Field label={t(uiLang, "baFieldAge")}>
                <RadioGroup options={AGE_OPTIONS} value={form.ageRange} onChange={set("ageRange")} uiLang={uiLang} />
              </Field>
              <Field label={t(uiLang, "baFieldDevices")} required>
                <CheckboxGroup options={DEVICE_OPTIONS} value={form.devices} onToggle={toggleMulti("devices")} uiLang={uiLang} />
              </Field>
              <Field label={t(uiLang, "baFieldBrowser")}>
                <RadioGroup options={BROWSER_OPTIONS} value={form.browser} onChange={set("browser")} uiLang={uiLang} />
              </Field>
            </>
          )}

          {step === 1 && (
            <>
              <Field label={t(uiLang, "baFieldNative")} required htmlFor="ba-native-language">
                <input id="ba-native-language" value={form.nativeLanguage} onChange={(e) => set("nativeLanguage")(e.target.value)} style={styles.input} />
              </Field>
              <Field label={t(uiLang, "baFieldTarget")} required htmlFor="ba-target-languages">
                <input id="ba-target-languages" value={form.targetLanguages} onChange={(e) => set("targetLanguages")(e.target.value)} style={styles.input} />
              </Field>
              <Field label={t(uiLang, "baFieldLevel")} required>
                <RadioGroup options={LEVEL_OPTIONS} value={form.currentLevel} onChange={set("currentLevel")} uiLang={uiLang} />
              </Field>
              <Field label={t(uiLang, "baFieldDialect")} htmlFor="ba-dialect">
                <input id="ba-dialect" value={form.dialectPreference} onChange={(e) => set("dialectPreference")(e.target.value)} style={styles.input} />
              </Field>
              <Field label={t(uiLang, "baFieldApps")}>
                <CheckboxGroup options={APPS_OPTIONS} value={form.appsUsed} onToggle={toggleMulti("appsUsed")} uiLang={uiLang} />
              </Field>
              <Field label={t(uiLang, "baFieldFrustration")} htmlFor="ba-frustration">
                <textarea id="ba-frustration" value={form.biggestFrustration} onChange={(e) => set("biggestFrustration")(e.target.value)} style={styles.textarea} rows={3} />
              </Field>
            </>
          )}

          {step === 2 && (
            <>
              <Field label={t(uiLang, "baFieldFrequency")} required>
                <RadioGroup options={FREQUENCY_OPTIONS} value={form.practiceFrequency} onChange={set("practiceFrequency")} uiLang={uiLang} />
              </Field>
              <Field label={t(uiLang, "baFieldSessionLen")} required>
                <RadioGroup options={SESSION_LENGTH_OPTIONS} value={form.sessionLengthPref} onChange={set("sessionLengthPref")} uiLang={uiLang} />
              </Field>
              <Field label={t(uiLang, "baFieldAppeal")}>
                <ScaleInput value={form.appealScore} onChange={set("appealScore")} min={1} max={5} lowLabel={t(uiLang, "baAppealLow")} highLabel={t(uiLang, "baAppealHigh")} />
              </Field>
              <Field label={t(uiLang, "baFieldFocus")}>
                <RadioGroup options={FOCUS_OPTIONS} value={form.focusDifficulty} onChange={set("focusDifficulty")} uiLang={uiLang} />
              </Field>
            </>
          )}

          {step === 3 && (
            <>
              <Field label={t(uiLang, "baFieldCommit")} required>
                <RadioGroup options={COMMITMENT_OPTIONS} value={form.timeCommitment} onChange={set("timeCommitment")} uiLang={uiLang} />
              </Field>
              <Field label={t(uiLang, "baFieldPrior")}>
                <RadioGroup options={PRIOR_BETA_OPTIONS} value={form.priorBetaExperience} onChange={set("priorBetaExperience")} uiLang={uiLang} />
              </Field>
              <Field label={t(uiLang, "baFieldBugComfort")}>
                <ScaleInput value={form.bugReportComfort} onChange={set("bugReportComfort")} min={1} max={5} lowLabel={t(uiLang, "baBugLow")} highLabel={t(uiLang, "baBugHigh")} />
              </Field>
              <Field label={t(uiLang, "baFieldReason")} htmlFor="ba-reason">
                <textarea id="ba-reason" value={form.reason} onChange={(e) => set("reason")(e.target.value)} style={styles.textarea} rows={3} />
              </Field>
              <Field label={t(uiLang, "baFieldAnything")} htmlFor="ba-anything-else">
                <textarea id="ba-anything-else" value={form.anythingElse} onChange={(e) => set("anythingElse")(e.target.value)} style={styles.textarea} rows={3} />
              </Field>
            </>
          )}

          {step === 4 && (
            <>
              <p style={styles.body}>
                {t(uiLang, "baAcctIntro")}
              </p>
              <Field label={t(uiLang, "baFieldUsername")} required>
                <UsernameAvailabilityField value={form.username} onChange={set("username")} />
                <p style={styles.fieldHint}>{t(uiLang, "baUsernameHint")}</p>
              </Field>
              <Field label={t(uiLang, "baFieldPassword")} required>
                <PasswordInput
                  placeholder={t(uiLang, "baPhPassword")}
                  value={form.password}
                  onChange={(e) => set("password")(e.target.value)}
                  style={styles.input}
                />
                <PasswordStrengthMeter password={form.password} />
              </Field>
              <Field label={t(uiLang, "baFieldConfirm")} required>
                <PasswordInput
                  placeholder={t(uiLang, "baPhConfirm")}
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
                  <p style={styles.fieldError}>{t(uiLang, "baPwNoMatch")}</p>
                )}
                {form.passwordConfirm && form.passwordConfirm === form.password && (
                  <p style={styles.fieldOk}>{t(uiLang, "baPwMatch")}</p>
                )}
              </Field>

              <p style={{ ...styles.body, marginTop: 18 }}>
                <strong>{t(uiLang, "baRecoveryLead")}</strong>{t(uiLang, "baRecoveryBody")}
              </p>
              <Field label={t(uiLang, "baFieldHint")} htmlFor="ba-password-hint">
                <input
                  id="ba-password-hint"
                  type="text"
                  placeholder={t(uiLang, "baPhHint")}
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
                  <Field key={idx} label={t(uiLang, "baSecQLabel", { n: idx + 1 })}>
                    <select
                      aria-label={t(uiLang, "baSecQLabel", { n: idx + 1 })}
                      value={q.key}
                      onChange={(e) => setSq({ key: e.target.value })}
                      style={{ ...styles.input, marginBottom: 8 }}
                    >
                      <option value="">{t(uiLang, "baSecQChoose")}</option>
                      {SECURITY_QUESTIONS.filter((opt) => !takenElsewhere.has(opt.key)).map((opt) => (
                        <option key={opt.key} value={opt.key}>
                          {questionLabel(opt.key, uiLang)}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      aria-label={t(uiLang, "baAriaAnswer", { n: idx + 1 })}
                      placeholder={t(uiLang, "baPhAnswer")}
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
                {t(uiLang, "baBack")}
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button type="button" className="rj" style={styles.primaryBtn} onClick={next}>
                {t(uiLang, "baNext")}
              </button>
            ) : (
              <button type="submit" className="rj" style={styles.primaryBtn} disabled={busy}>
                {busy ? t(uiLang, "baSending") : t(uiLang, "baSubmit")}
              </button>
            )}
          </div>
        </form>

        <p style={styles.footer}>
          {t(uiLang, "baFooterPre")}<a href="/auth" style={styles.link}>{t(uiLang, "baFooterLink")}</a>.
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

function RadioGroup({ options, value, onChange, uiLang }) {
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
          {optLabel(uiLang, opt)}
        </button>
      ))}
    </div>
  );
}

function CheckboxGroup({ options, value, onToggle, uiLang }) {
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
          {optLabel(uiLang, opt)}
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
  progressDotActive: { background: "#FFA6BE" },
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
  choiceBtnActive: { background: "rgba(255,166,190,0.12)", color: "#FFA6BE", borderColor: "#FFA6BE" },
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
  scaleBtnActive: { background: "#FFA6BE", color: "#171423", borderColor: "#FFA6BE" },
  scaleLabel: { color: "#9B93B8", fontSize: 11 },
  error: { color: "#FF7B8A", fontSize: 13, marginTop: 14 },
  primaryBtn: {
    flex: 1,
    background: "#FFA6BE",
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

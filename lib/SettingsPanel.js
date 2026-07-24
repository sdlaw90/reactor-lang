"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./supabaseClient";
import { listNativeLanguages } from "../data/tracks";
import { loadProfile, isUsernameTaken, setUsername as saveUsername, saveAvatar } from "./db";
import { notifyAccountChange } from "./notify";
import { verifyCurrentPassword } from "./reauth";
import { COUNTRIES, flagImageUrl, countryName } from "./countries";
import SearchableSelect from "./SearchableSelect";
import UsernameAvailabilityField from "./UsernameAvailabilityField";
import { uploadAvatarPhoto, AVATAR_EMOJIS } from "./avatarUpload";
import Avatar from "./Avatar";
import PasswordInput from "./PasswordInput";
import PasswordStrengthMeter from "./PasswordStrengthMeter";
import { SECURITY_QUESTIONS, questionLabel } from "./securityQuestions";
import { t } from "./playStrings";

export default function SettingsPanel() {
  const router = useRouter();
  const [session, setSession] = useState(undefined);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/auth");
        return;
      }
      setSession(data.session);
      try {
        const p = await loadProfile(data.session.user.id);
        setProfile(p);
      } catch (e) {
        console.error("failed to load profile", e);
      }
    })();
  }, [router]);

  const uiLang = session?.user?.user_metadata?.native_lang || "en";

  if (session === undefined) {
    return <p style={{ color: "#B4ABC9" }}>{t(uiLang, "loading")}</p>;
  }

  return (
    <div>
      <GroupHeader label={t(uiLang, "setGroupProfile")} />
      <ProfilePictureSection session={session} profile={profile} setProfile={setProfile} />
      <UsernameSection session={session} profile={profile} setProfile={setProfile} />

      <GroupHeader label={t(uiLang, "setGroupAccount")} />
      <EmailSection session={session} setSession={setSession} />
        <PasswordSection session={session} />
        <PasswordRecoverySection session={session} />

        <GroupHeader label={t(uiLang, "setGroupLang")} />
        <NativeLanguageSection session={session} setSession={setSession} />
        <NativeCountrySection session={session} setSession={setSession} />
        <GameplaySettingsSection session={session} setSession={setSession} />

        <GroupHeader label={t(uiLang, "setGroupSub")} />
        <div style={styles.comingSoonCard}>
          <p style={{ color: "#9B93B8", fontSize: 13, margin: 0 }}>{t(uiLang, "setComingSoon")}</p>
        </div>

        <GroupHeader label={t(uiLang, "setGroupFeedback")} />
        <button className="rj" style={styles.feedbackBtn} onClick={() => router.push("/feedback/bug")}>
          {t(uiLang, "setFbBug")}
        </button>
        <button className="rj" style={styles.feedbackBtn} onClick={() => router.push("/feedback/feature")}>
          {t(uiLang, "setFbFeature")}
        </button>

        <button
          className="rj"
          style={styles.signOutBtn}
          onClick={async () => {
            await supabase.auth.signOut();
            router.push("/auth");
          }}
        >
          {t(uiLang, "setSignOut")}
        </button>

        <div style={styles.inlineFooter}>
          <a href="/terms" style={styles.legalFooterLink}>
            {t(uiLang, "setTos")}
          </a>
          <span style={{ color: "#3A3452" }}>·</span>
          <a href="/privacy" style={styles.legalFooterLink}>
            {t(uiLang, "setPrivacy")}
          </a>
        </div>
    </div>
  );
}

// ---------------- Profile picture ----------------

function ProfilePictureSection({ session, profile, setProfile }) {
  const uiLang = session?.user?.user_metadata?.native_lang || "en";
  const [editing, setEditing] = useState(false);
  const [mode, setMode] = useState("emoji"); // 'photo' | 'emoji' | 'flag'
  const [emojiChoice, setEmojiChoice] = useState("");
  const [flagChoice, setFlagChoice] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const startEdit = () => {
    setMode(profile?.avatar_type || "emoji");
    setEmojiChoice(profile?.avatar_type === "emoji" ? profile.avatar_value : "");
    setFlagChoice(profile?.avatar_type === "flag" ? profile.avatar_value : "");
    setPhotoFile(null);
    setPhotoPreview(profile?.avatar_type === "photo" ? profile.avatar_value : "");
    setError("");
    setSaved(false);
    setEditing(true);
  };

  const onPickPhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      setError(t(uiLang, "setErrPhotoSize"));
      return;
    }
    setError("");
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const save = async () => {
    setError("");
    setBusy(true);
    try {
      let avatarType = mode;
      let avatarValue = "";

      if (mode === "emoji") {
        if (!emojiChoice) {
          setError(t(uiLang, "setErrPickIcon"));
          setBusy(false);
          return;
        }
        avatarValue = emojiChoice;
      } else if (mode === "flag") {
        if (!flagChoice) {
          setError(t(uiLang, "setErrPickFlag"));
          setBusy(false);
          return;
        }
        avatarValue = flagChoice;
      } else if (mode === "photo") {
        if (photoFile) {
          avatarValue = await uploadAvatarPhoto(session.user.id, photoFile);
        } else if (profile?.avatar_type === "photo") {
          avatarValue = profile.avatar_value; // keep existing photo
        } else {
          setError(t(uiLang, "setErrChoosePhoto"));
          setBusy(false);
          return;
        }
      }

      await saveAvatar(session.user.id, avatarType, avatarValue);
      setProfile((p) => ({ ...(p || {}), avatar_type: avatarType, avatar_value: avatarValue }));
      setSaved(true);
      setEditing(false);
    } catch (e) {
      setError(e.message || t(uiLang, "setErrGeneric"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Section title={t(uiLang, "setTitlePic")} saved={saved} savedLabel={t(uiLang, "setSaved")}>
      {!editing ? (
        <div style={styles.row}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Avatar type={profile?.avatar_type} value={profile?.avatar_value} fallbackText={profile?.username || session.user.email} size={40} />
            <span style={styles.rowValue}>
              {profile?.avatar_type === "photo"
                ? t(uiLang, "setAvatarPhoto")
                : profile?.avatar_type === "flag"
                  ? t(uiLang, "setAvatarFlag")
                  : profile?.avatar_type === "emoji"
                    ? t(uiLang, "setAvatarIcon")
                    : t(uiLang, "setNotSet")}
            </span>
          </div>
          <button className="rj" style={styles.editBtn} onClick={startEdit}>
            {t(uiLang, "setBtnEdit")}
          </button>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            {["photo", "emoji", "flag"].map((m) => (
              <button
                key={m}
                type="button"
                className="rj"
                onClick={() => setMode(m)}
                style={{ ...styles.modeTab, ...(mode === m ? styles.modeTabActive : {}) }}
              >
                {m === "photo" ? t(uiLang, "setTabPhoto") : m === "emoji" ? t(uiLang, "setTabIcon") : t(uiLang, "setTabFlag")}
              </button>
            ))}
          </div>

          {mode === "photo" && (
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <Avatar type={photoPreview ? "photo" : null} value={photoPreview} size={56} />
              <label className="rj" style={styles.uploadBtn}>
                {t(uiLang, "setBtnChooseFile")}
                <input type="file" accept="image/*" onChange={onPickPhoto} style={{ display: "none" }} />
              </label>
            </div>
          )}

          {mode === "emoji" && (
            <div style={styles.emojiGrid}>
              {AVATAR_EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmojiChoice(e)}
                  style={{ ...styles.emojiBtn, borderColor: emojiChoice === e ? "#FF8FB1" : "#3A3452" }}
                >
                  {e}
                </button>
              ))}
            </div>
          )}

          {mode === "flag" && (
            <div style={{ marginBottom: 12 }}>
              <SearchableSelect
                options={COUNTRIES.map((c) => ({ value: c.code, label: c.name }))}
                value={flagChoice}
                onChange={setFlagChoice}
                placeholder={t(uiLang, "setPhSearchCountry")}
                renderOption={(o) => (
                  <>
                    <img src={flagImageUrl(o.value)} alt={o.value} style={{ width: 20, height: 14, objectFit: "cover", borderRadius: 2, flexShrink: 0 }} />
                    {o.label}
                  </>
                )}
              />
              {flagChoice && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                  <img src={flagImageUrl(flagChoice)} alt={flagChoice} style={{ width: 32, height: 22, objectFit: "cover", borderRadius: 3 }} />
                  <span style={{ color: "#B4ABC9", fontSize: 13 }}>{countryName(flagChoice)}</span>
                </div>
              )}
            </div>
          )}

          {error && <p style={styles.error}>{error}</p>}
          <EditActions busy={busy} onSave={save} onCancel={() => setEditing(false)} saveLabel={t(uiLang, "setBtnSave")} cancelLabel={t(uiLang, "setBtnCancel")} busyLabel={t(uiLang, "setBtnBusy")} />
        </>
      )}
    </Section>
  );
}

// ---------------- Username ----------------

function UsernameSection({ session, profile, setProfile }) {
  const uiLang = session?.user?.user_metadata?.native_lang || "en";
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const startEdit = () => {
    setValue(profile?.username || "");
    setError("");
    setSaved(false);
    setEditing(true);
  };

  const save = async () => {
    setError("");
    const trimmed = value.trim();
    if (!trimmed) {
      setError(t(uiLang, "setErrUsernameEmpty"));
      return;
    }
    if (trimmed === profile?.username) {
      setEditing(false);
      return;
    }
    setBusy(true);
    try {
      const taken = await isUsernameTaken(trimmed);
      if (taken) {
        setError(t(uiLang, "setErrUsernameTaken"));
        setBusy(false);
        return;
      }
      await saveUsername(session.user.id, trimmed);
      setProfile((p) => ({ ...(p || {}), username: trimmed }));
      notifyAccountChange("username_changed", session.user.email, { newUsername: trimmed });
      setSaved(true);
      setEditing(false);
    } catch (e) {
      setError(e.message || t(uiLang, "setErrGeneric"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Section title={t(uiLang, "setTitleUsername")} saved={saved} savedLabel={t(uiLang, "setSaved")}>
      {!editing ? (
        <Row value={profile?.username || t(uiLang, "setNotSet")} onEdit={startEdit} editLabel={t(uiLang, "setBtnEdit")} />
      ) : (
        <>
          <UsernameAvailabilityField value={value} onChange={setValue} placeholder={t(uiLang, "setPhUsername")} />
          {error && <p style={styles.error}>{error}</p>}
          <EditActions busy={busy} onSave={save} onCancel={() => setEditing(false)} saveLabel={t(uiLang, "setBtnSave")} cancelLabel={t(uiLang, "setBtnCancel")} busyLabel={t(uiLang, "setBtnBusy")} />
        </>
      )}
    </Section>
  );
}

// ---------------- Email ----------------

function EmailSection({ session, setSession }) {
  const uiLang = session?.user?.user_metadata?.native_lang || "en";
  const [editing, setEditing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [confirmNewEmail, setConfirmNewEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const startEdit = () => {
    setCurrentPassword("");
    setNewEmail("");
    setConfirmNewEmail("");
    setError("");
    setSaved(false);
    setEditing(true);
  };

  const save = async () => {
    setError("");
    if (!newEmail || newEmail !== confirmNewEmail) {
      setError(t(uiLang, "setErrEmailsMismatch"));
      return;
    }
    if (newEmail === session.user.email) {
      setEditing(false);
      return;
    }
    if (!currentPassword) {
      setError(t(uiLang, "setErrCurPwRequired"));
      return;
    }
    setBusy(true);
    try {
      const ok = await verifyCurrentPassword(session.user.email, currentPassword);
      if (!ok) {
        setError(t(uiLang, "setErrCurPwWrong"));
        setBusy(false);
        return;
      }
      const oldEmail = session.user.email;
      const { data, error: err } = await supabase.auth.updateUser({ email: newEmail });
      if (err) throw err;
      setSession((s) => ({ ...s, user: data.user }));
      notifyAccountChange("email_changed", oldEmail, { newEmail });
      setSaved(true);
      setEditing(false);
    } catch (e) {
      setError(e.message || t(uiLang, "setErrGeneric"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Section title={t(uiLang, "setTitleEmail")} saved={saved} savedLabel={t(uiLang, "setSaved")} savedNote={t(uiLang, "setNoteEmailSaved")}>
      {!editing ? (
        <Row value={session.user.email} onEdit={startEdit} editLabel={t(uiLang, "setBtnEdit")} />
      ) : (
        <>
          <input className="jm" style={styles.input} value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder={t(uiLang, "setPhNewEmail")} aria-label={t(uiLang, "setPhNewEmail")} type="email" />
          <input
            className="jm"
            style={styles.input}
            value={confirmNewEmail}
            onChange={(e) => setConfirmNewEmail(e.target.value)}
            placeholder={t(uiLang, "setPhConfirmEmail")}
            aria-label={t(uiLang, "setPhConfirmEmail")}
            type="email"
          />
          <PasswordInput
            className="jm"
            style={styles.input}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder={t(uiLang, "setPhCurPwConfirm")}
          />
          {error && <p style={styles.error}>{error}</p>}
          <EditActions busy={busy} onSave={save} onCancel={() => setEditing(false)} saveLabel={t(uiLang, "setBtnSave")} cancelLabel={t(uiLang, "setBtnCancel")} busyLabel={t(uiLang, "setBtnBusy")} />
        </>
      )}
    </Section>
  );
}

// ---------------- Password ----------------

function PasswordSection({ session }) {
  const uiLang = session?.user?.user_metadata?.native_lang || "en";
  const [editing, setEditing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [signedOutOthers, setSignedOutOthers] = useState(false);

  const startEdit = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setError("");
    setSaved(false);
    setSignedOutOthers(false);
    setEditing(true);
  };

  const save = async () => {
    setError("");
    if (!currentPassword) {
      setError(t(uiLang, "setErrCurPwRequired"));
      return;
    }
    if (newPassword.length < 6) {
      setError(t(uiLang, "setErrPwLen"));
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError(t(uiLang, "setErrPwMismatch"));
      return;
    }
    setBusy(true);
    try {
      const ok = await verifyCurrentPassword(session.user.email, currentPassword);
      if (!ok) {
        setError(t(uiLang, "setErrCurPwWrong"));
        setBusy(false);
        return;
      }
      const { error: err } = await supabase.auth.updateUser({ password: newPassword });
      if (err) throw err;
      notifyAccountChange("password_changed", session.user.email);

      // Security nicety: kick out any other signed-in devices/browsers now
      // that the password has changed, without logging out this session.
      try {
        await supabase.auth.signOut({ scope: "others" });
        setSignedOutOthers(true);
      } catch (e) {
        console.error("sign-out-others failed", e);
      }

      setSaved(true);
      setEditing(false);
    } catch (e) {
      setError(e.message || t(uiLang, "setErrGeneric"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Section title={t(uiLang, "setTitlePassword")} saved={saved} savedLabel={t(uiLang, "setSaved")} savedNote={signedOutOthers ? t(uiLang, "setNotePwSaved") : ""}>
      {!editing ? (
        <Row value="••••••••" onEdit={startEdit} editLabel={t(uiLang, "setBtnEdit")} />
      ) : (
        <>
          <PasswordInput
            className="jm"
            style={styles.input}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder={t(uiLang, "setPhCurPw")}
          />
          <PasswordInput
            className="jm"
            style={styles.input}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder={t(uiLang, "setPhNewPw")}
            minLength={6}
          />
          <PasswordStrengthMeter password={newPassword} />
          <PasswordInput
            className="jm"
            style={styles.input}
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            placeholder={t(uiLang, "setPhConfirmPw")}
            minLength={6}
          />
          {error && <p style={styles.error}>{error}</p>}
          <EditActions busy={busy} onSave={save} onCancel={() => setEditing(false)} saveLabel={t(uiLang, "setBtnSave")} cancelLabel={t(uiLang, "setBtnCancel")} busyLabel={t(uiLang, "setBtnBusy")} />
        </>
      )}
    </Section>
  );
}

// ---------------- Password recovery (#79) ----------------
// Password hint + three security questions — the self-serve reset path,
// since email reset can't reach external addresses until #65. Retroactive
// home for existing accounts (sign-up also offers it). All reads/writes go
// through /api/account-security: answers are hashed server-side and never
// come back down, so the UI only ever knows WHICH questions are on file.

function PasswordRecoverySection({ session }) {
  const uiLang = session?.user?.user_metadata?.native_lang || "en";
  const [loaded, setLoaded] = useState(false);
  const [hint, setHint] = useState("");
  const [onFileKeys, setOnFileKeys] = useState([]);
  const [editing, setEditing] = useState(false);
  const [draftHint, setDraftHint] = useState("");
  const [draftQuestions, setDraftQuestions] = useState([
    { key: "", answer: "" },
    { key: "", answer: "" },
    { key: "", answer: "" },
  ]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const authedFetch = async (options = {}) => {
    const { data } = await supabase.auth.getSession();
    const token = data?.session?.access_token;
    if (!token) throw new Error("Not signed in");
    const res = await fetch("/api/account-security", {
      headers: {
        Authorization: `Bearer ${token}`,
        ...(options.body ? { "Content-Type": "application/json" } : {}),
      },
      ...options,
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body.error || "Request failed");
    return body;
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const body = await authedFetch();
        if (cancelled) return;
        setHint(body.hint || "");
        setOnFileKeys(body.questionKeys || []);
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id]);

  const startEdit = () => {
    setDraftHint(hint);
    // Answers are never fetched back — editing always (re)enters all three.
    setDraftQuestions([
      { key: "", answer: "" },
      { key: "", answer: "" },
      { key: "", answer: "" },
    ]);
    setError("");
    setSaved(false);
    setEditing(true);
  };

  const setDraft = (idx, patch) =>
    setDraftQuestions((qs) => qs.map((q, i) => (i === idx ? { ...q, ...patch } : q)));

  const save = async () => {
    setError("");
    const filled = draftQuestions.filter((q) => q.key || q.answer.trim());
    const complete = draftQuestions.every((q) => q.key && q.answer.trim());
    if (filled.length > 0 && !complete) {
      setError(t(uiLang, "setErrRecoveryIncomplete"));
      return;
    }
    const keys = draftQuestions.map((q) => q.key);
    if (complete && new Set(keys).size !== 3) {
      setError(t(uiLang, "setErrRecoveryDupes"));
      return;
    }
    setBusy(true);
    try {
      const payload = { hint: draftHint };
      if (complete) {
        payload.questions = draftQuestions.map((q) => ({ key: q.key, answer: q.answer }));
      }
      await authedFetch({ method: "POST", body: JSON.stringify(payload) });
      setHint(draftHint);
      if (complete) setOnFileKeys(keys);
      setSaved(true);
      setEditing(false);
    } catch (e) {
      setError(e.message || t(uiLang, "setErrGeneric"));
    } finally {
      setBusy(false);
    }
  };

  const takenElsewhere = (idx) =>
    new Set(draftQuestions.filter((_, i) => i !== idx).map((q) => q.key));

  const status =
    onFileKeys.length > 0
      ? `${t(uiLang, "setRecStatusQuestions", { n: onFileKeys.length })}${hint ? t(uiLang, "setRecHintSuffix") : ""}`
      : hint
        ? t(uiLang, "setRecStatusHintOnly")
        : t(uiLang, "setRecNotSetUp");

  return (
    <Section title={t(uiLang, "setTitleRecovery")} saved={saved} savedLabel={t(uiLang, "setSaved")}>
      {!loaded ? (
        <p style={styles.recoveryNote}>{t(uiLang, "loading")}</p>
      ) : !editing ? (
        <>
          <Row value={status} onEdit={startEdit} editLabel={t(uiLang, "setBtnEdit")} />
          {onFileKeys.length === 0 && (
            <p style={styles.recoveryNote}>{t(uiLang, "setRecNoteNone")}</p>
          )}
        </>
      ) : (
        <>
          <p style={styles.recoveryNote}>{t(uiLang, "setRecNoteEdit")}</p>
          <input
            className="jm"
            style={styles.input}
            value={draftHint}
            onChange={(e) => setDraftHint(e.target.value)}
            placeholder={t(uiLang, "setPhHint")}
            maxLength={200}
            aria-label={t(uiLang, "setAriaHint")}
          />
          {draftQuestions.map((q, idx) => (
            <div key={idx} style={{ marginBottom: 10 }}>
              <select
                className="jm"
                style={styles.input}
                value={q.key}
                onChange={(e) => setDraft(idx, { key: e.target.value })}
                aria-label={t(uiLang, "setAriaSecurityQuestion", { n: idx + 1 })}
              >
                <option value="">{t(uiLang, "setOptQuestion", { n: idx + 1 })}</option>
                {SECURITY_QUESTIONS.filter((opt) => !takenElsewhere(idx).has(opt.key)).map((opt) => (
                  <option key={opt.key} value={opt.key}>
                    {questionLabel(opt.key, uiLang)}
                  </option>
                ))}
              </select>
              <input
                className="jm"
                style={{ ...styles.input, marginBottom: 0 }}
                value={q.answer}
                onChange={(e) => setDraft(idx, { answer: e.target.value })}
                placeholder={t(uiLang, "setPhAnswer")}
                autoComplete="off"
                aria-label={t(uiLang, "setAriaAnswer", { n: idx + 1 })}
              />
            </div>
          ))}
          {error && <p style={styles.error}>{error}</p>}
          <EditActions busy={busy} onSave={save} onCancel={() => setEditing(false)} saveLabel={t(uiLang, "setBtnSave")} cancelLabel={t(uiLang, "setBtnCancel")} busyLabel={t(uiLang, "setBtnBusy")} />
        </>
      )}
    </Section>
  );
}

// ---------------- Native language ----------------

function NativeLanguageSection({ session, setSession }) {
  const uiLang = session?.user?.user_metadata?.native_lang || "en";
  const [editing, setEditing] = useState(false);
  const [choice, setChoice] = useState(null);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const options = listNativeLanguages();
  const current = session.user.user_metadata?.native_lang ?? null;
  const currentLabel = options.find((o) => o.code === current)?.label || t(uiLang, "setNotSet");

  const startEdit = () => {
    setChoice(current);
    setSaved(false);
    setEditing(true);
  };

  const save = async () => {
    if (!choice) {
      setEditing(false);
      return;
    }
    setBusy(true);
    try {
      const { data, error } = await supabase.auth.updateUser({ data: { native_lang: choice } });
      if (error) throw error;
      setSession((s) => ({ ...s, user: data.user }));
      setSaved(true);
      setEditing(false);
    } catch (e) {
      console.error("failed to save native language", e);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Section title={t(uiLang, "setTitleNative")} saved={saved} savedLabel={t(uiLang, "setSaved")}>
      {!editing ? (
        <Row value={currentLabel} onEdit={startEdit} editLabel={t(uiLang, "setBtnEdit")} />
      ) : (
        <>
          <div style={{ marginBottom: 12 }}>
            <SearchableSelect
              options={options.map((o) => ({ value: o.code, label: o.label }))}
              value={choice}
              onChange={setChoice}
              placeholder={t(uiLang, "setPhSearchLang")}
            />
          </div>
          <EditActions busy={busy} onSave={save} onCancel={() => setEditing(false)} saveLabel={t(uiLang, "setBtnSave")} cancelLabel={t(uiLang, "setBtnCancel")} busyLabel={t(uiLang, "setBtnBusy")} />
        </>
      )}
      <p style={{ color: "#9B93B8", fontSize: 12, marginTop: 8 }}>{t(uiLang, "setNativeNote")}</p>
    </Section>
  );
}

// ---------------- Native country ----------------

function NativeCountrySection({ session, setSession }) {
  const uiLang = session?.user?.user_metadata?.native_lang || "en";
  const [editing, setEditing] = useState(false);
  const [choice, setChoice] = useState(null);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  const nativeLang = session.user.user_metadata?.native_lang ?? null;
  const currentCountry = session.user.user_metadata?.native_country ?? null;

  const startEdit = () => {
    setChoice(currentCountry);
    setSaved(false);
    setEditing(true);
  };

  const save = async () => {
    if (!choice) {
      setEditing(false);
      return;
    }
    setBusy(true);
    try {
      const { data, error } = await supabase.auth.updateUser({ data: { native_country: choice } });
      if (error) throw error;
      setSession((s) => ({ ...s, user: data.user }));
      setSaved(true);
      setEditing(false);
    } catch (e) {
      console.error("failed to save native country", e);
    } finally {
      setBusy(false);
    }
  };

  if (!nativeLang) {
    return (
      <Section title={t(uiLang, "setTitleCountry")}>
        <p style={{ color: "#9B93B8", fontSize: 13 }}>{t(uiLang, "setNeedNativeFirst")}</p>
      </Section>
    );
  }

  return (
    <Section title={t(uiLang, "setTitleCountry")} saved={saved} savedLabel={t(uiLang, "setSaved")}>
      {!editing ? (
        <Row
          value={
            currentCountry ? (
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <img src={flagImageUrl(currentCountry)} alt={currentCountry} style={{ width: 24, height: 17, objectFit: "cover", borderRadius: 2 }} />
                {countryName(currentCountry)}
              </span>
            ) : (
              t(uiLang, "setNotSet")
            )
          }
          onEdit={startEdit}
          editLabel={t(uiLang, "setBtnEdit")}
        />
      ) : (
        <>
          <SearchableSelect
            options={COUNTRIES.map((c) => ({ value: c.code, label: c.name }))}
            value={choice}
            onChange={setChoice}
            placeholder={t(uiLang, "setPhSearchCountry")}
            renderOption={(o) => (
              <>
                <img src={flagImageUrl(o.value)} alt={o.value} style={{ width: 20, height: 14, objectFit: "cover", borderRadius: 2, flexShrink: 0 }} />
                {o.label}
              </>
            )}
          />
          {choice && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0 12px" }}>
              <img src={flagImageUrl(choice)} alt={choice} style={{ width: 32, height: 22, objectFit: "cover", borderRadius: 3 }} />
              <span style={{ color: "#B4ABC9", fontSize: 13 }}>{countryName(choice)}</span>
            </div>
          )}
          <EditActions busy={busy} onSave={save} onCancel={() => setEditing(false)} saveLabel={t(uiLang, "setBtnSave")} cancelLabel={t(uiLang, "setBtnCancel")} busyLabel={t(uiLang, "setBtnBusy")} />
        </>
      )}
      <p style={{ color: "#9B93B8", fontSize: 12, marginTop: 8 }}>{t(uiLang, "setCountryNote")}</p>
    </Section>
  );
}

// ---------------- Gameplay settings (review mode + round length/timer) ----------------

function GameplaySettingsSection({ session, setSession }) {
  const uiLang = session?.user?.user_metadata?.native_lang || "en";
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  const currentReviewMode = session.user.user_metadata?.review_mode ?? false;
  const rs = session.user.user_metadata?.round_settings || {};
  const currentPerCat = rs.perCat ?? 2;
  const currentExtraPairs = rs.extraPairs ?? 2;
  const currentQuestionTime = rs.questionTime ?? 30;
  const currentExtraQuestionTime = rs.extraQuestionTime ?? 30;
  const currentSameTimer = currentQuestionTime === currentExtraQuestionTime;

  const currentQuestionAudio = session?.user?.user_metadata?.question_audio ?? true;
  // #87: answer-choice audio (default off). #89: tense training-wheels (default on).
  const currentChoiceAudio = session?.user?.user_metadata?.choice_audio ?? false;
  const currentTenseHints = session?.user?.user_metadata?.tense_hints ?? true;

  const [reviewMode, setReviewMode] = useState(currentReviewMode);
  const [questionAudio, setQuestionAudio] = useState(currentQuestionAudio);
  const [choiceAudio, setChoiceAudio] = useState(currentChoiceAudio);
  const [tenseHints, setTenseHints] = useState(currentTenseHints);
  const [perCat, setPerCat] = useState(currentPerCat);
  const [extraPairs, setExtraPairs] = useState(currentExtraPairs);
  const [sameTimer, setSameTimer] = useState(currentSameTimer);
  const [questionTime, setQuestionTime] = useState(currentQuestionTime);
  const [extraQuestionTime, setExtraQuestionTime] = useState(currentExtraQuestionTime);

  const startEdit = () => {
    setReviewMode(currentReviewMode);
    setQuestionAudio(currentQuestionAudio);
    setChoiceAudio(currentChoiceAudio);
    setTenseHints(currentTenseHints);
    setPerCat(currentPerCat);
    setExtraPairs(currentExtraPairs);
    setSameTimer(currentSameTimer);
    setQuestionTime(currentQuestionTime);
    setExtraQuestionTime(currentExtraQuestionTime);
    setSaved(false);
    setEditing(true);
  };

  const save = async () => {
    setBusy(true);
    try {
      const finalExtraTime = sameTimer ? questionTime : extraQuestionTime;
      const { data, error } = await supabase.auth.updateUser({
        data: {
          review_mode: reviewMode,
          question_audio: questionAudio,
          choice_audio: choiceAudio,
          tense_hints: tenseHints,
          round_settings: {
            perCat: Math.max(1, Math.min(10, Number(perCat) || 2)),
            extraPairs: Math.max(0, Math.min(10, Number(extraPairs) || 2)),
            questionTime: Math.max(5, Math.min(120, Number(questionTime) || 30)),
            extraQuestionTime: Math.max(5, Math.min(120, Number(finalExtraTime) || 30)),
          },
        },
      });
      if (error) throw error;
      setSession((s) => ({ ...s, user: data.user }));
      setSaved(true);
      setEditing(false);
    } catch (e) {
      console.error("failed to save gameplay settings", e);
    } finally {
      setBusy(false);
    }
  };

  const summary = t(uiLang, "setGpSummary", {
    perCat: currentPerCat,
    pairs: currentExtraPairs,
    qAudio: t(uiLang, currentQuestionAudio ? "setGpOn" : "setGpOff"),
    cAudio: t(uiLang, currentChoiceAudio ? "setGpOn" : "setGpOff"),
    tHints: t(uiLang, currentTenseHints ? "setGpOnF" : "setGpOffF"),
    time: currentQuestionTime,
    phon:
      currentQuestionTime !== currentExtraQuestionTime
        ? t(uiLang, "setGpSummaryPhon", { time: currentExtraQuestionTime })
        : "",
  });

  return (
    <Section title={t(uiLang, "setTitleGameplay")} saved={saved} savedLabel={t(uiLang, "setSaved")}>
      {!editing ? (
        <>
          <Row value={currentReviewMode ? t(uiLang, "setGpReviewOn") : t(uiLang, "setGpReviewOff")} onEdit={startEdit} editLabel={t(uiLang, "setBtnEdit")} />
          <p style={{ color: "#9B93B8", fontSize: 12, marginTop: 8 }}>{summary}</p>
        </>
      ) : (
        <>
          <label style={styles.toggleRow}>
            <input type="checkbox" checked={reviewMode} onChange={(e) => setReviewMode(e.target.checked)} />
            <span>{t(uiLang, "setGpTogReview")}</span>
          </label>

          <label style={{ ...styles.toggleRow, marginTop: 14 }}>
            <input type="checkbox" checked={questionAudio} onChange={(e) => setQuestionAudio(e.target.checked)} />
            <span>{t(uiLang, "setGpTogQaudio")}</span>
          </label>

          <label style={{ ...styles.toggleRow, marginTop: 14 }}>
            <input type="checkbox" checked={choiceAudio} onChange={(e) => setChoiceAudio(e.target.checked)} />
            <span>{t(uiLang, "setGpTogCaudio")}</span>
          </label>

          <label style={{ ...styles.toggleRow, marginTop: 14 }}>
            <input type="checkbox" checked={tenseHints} onChange={(e) => setTenseHints(e.target.checked)} />
            <span>{t(uiLang, "setGpTogTense")}</span>
          </label>

          <div style={{ marginTop: 14 }}>
            <label style={styles.numberLabel}>{t(uiLang, "setGpPerCat")}</label>
            <input
              type="number"
              min={1}
              max={10}
              className="jm"
              style={styles.input}
              value={perCat}
              onChange={(e) => setPerCat(e.target.value)}
            />
          </div>

          <div style={{ marginTop: 10 }}>
            <label style={styles.numberLabel}>{t(uiLang, "setGpPairs")}</label>
            <input
              type="number"
              min={0}
              max={10}
              className="jm"
              style={styles.input}
              value={extraPairs}
              onChange={(e) => setExtraPairs(e.target.value)}
            />
          </div>

          <label style={{ ...styles.toggleRow, marginTop: 14 }}>
            <input type="checkbox" checked={sameTimer} onChange={(e) => setSameTimer(e.target.checked)} />
            <span>{t(uiLang, "setGpSameTimer")}</span>
          </label>

          <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
            <div style={{ flex: 1 }}>
              <label style={styles.numberLabel}>{sameTimer ? t(uiLang, "setGpSecSame") : t(uiLang, "setGpSecRegular")}</label>
              <input
                type="number"
                min={5}
                max={120}
                className="jm"
                style={styles.input}
                value={questionTime}
                onChange={(e) => setQuestionTime(e.target.value)}
              />
            </div>
            {!sameTimer && (
              <div style={{ flex: 1 }}>
                <label style={styles.numberLabel}>{t(uiLang, "setGpSecPhon")}</label>
                <input
                  type="number"
                  min={5}
                  max={120}
                  className="jm"
                  style={styles.input}
                  value={extraQuestionTime}
                  onChange={(e) => setExtraQuestionTime(e.target.value)}
                />
              </div>
            )}
          </div>

          <div style={{ marginTop: 14 }}>
            <EditActions busy={busy} onSave={save} onCancel={() => setEditing(false)} saveLabel={t(uiLang, "setBtnSave")} cancelLabel={t(uiLang, "setBtnCancel")} busyLabel={t(uiLang, "setBtnBusy")} />
          </div>
        </>
      )}
    </Section>
  );
}

// ---------------- shared bits ----------------

function GroupHeader({ label }) {
  return (
    <div style={styles.groupHeader}>
      <span className="rj" style={styles.groupHeaderText}>
        {label}
      </span>
      <div style={styles.groupHeaderLine} />
    </div>
  );
}

function Section({ title, children, saved, savedNote, savedLabel }) {
  return (
    <div style={styles.section}>
      <h2 className="rj" style={styles.sectionTitle}>
        {title}
      </h2>
      {children}
      {saved && <p style={styles.saved}>{savedLabel || "Saved."}{savedNote ? ` ${savedNote}` : ""}</p>}
    </div>
  );
}

function Row({ value, onEdit, editLabel }) {
  return (
    <div style={styles.row}>
      <span style={styles.rowValue}>{value}</span>
      <button className="rj" style={styles.editBtn} onClick={onEdit}>
        {editLabel || "Edit"}
      </button>
    </div>
  );
}

function EditActions({ busy, onSave, onCancel, saveLabel, cancelLabel, busyLabel }) {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <button className="rj" style={styles.saveBtn} onClick={onSave} disabled={busy}>
        {busy ? (busyLabel || "...") : (saveLabel || "Save")}
      </button>
      <button className="rj" style={styles.cancelBtn} onClick={onCancel} disabled={busy}>
        {cancelLabel || "Cancel"}
      </button>
    </div>
  );
}

const styles = {
  inlineFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    fontSize: 11,
    marginTop: 24,
    paddingTop: 16,
    borderTop: "1px solid #3A3452",
  },
  legalFooterLink: { color: "#9B93B8", textDecoration: "underline" },
  groupHeader: { display: "flex", alignItems: "center", gap: 10, margin: "22px 0 10px" },
  groupHeaderText: { color: "#FF8FB1", fontSize: 12, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", whiteSpace: "nowrap" },
  groupHeaderLine: { flex: 1, height: 1, background: "#3A3452" },
  comingSoonCard: {
    background: "#221E33",
    border: "1px dashed #3A3452",
    borderRadius: 12,
    padding: "16px 18px",
    marginBottom: 14,
  },
  toggleRow: { display: "flex", alignItems: "flex-start", gap: 10, color: "#F3F0FA", fontSize: 13.5, lineHeight: 1.4, cursor: "pointer" },
  numberLabel: { display: "block", color: "#9B93B8", fontSize: 12, marginBottom: 4 },
  feedbackBtn: {
    width: "100%",
    background: "transparent",
    color: "#3DDBFF",
    border: "1px solid #3DDBFF",
    borderRadius: 10,
    padding: "12px",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    marginBottom: 14,
  },
  signOutBtn: {
    width: "100%",
    background: "transparent",
    color: "#FF7B8A",
    border: "1px solid #4A1E24",
    borderRadius: 10,
    padding: "12px",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    marginBottom: 14,
  },
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
  title: { fontSize: 24, fontWeight: 700, color: "#F3F0FA", margin: "0 0 20px" },
  section: { background: "#221E33", border: "1px solid #3A3452", borderRadius: 12, padding: "16px 18px", marginBottom: 14 },
  sectionTitle: { fontSize: 15, fontWeight: 700, color: "#F3F0FA", margin: "0 0 10px" },
  row: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  rowValue: { color: "#F3F0FA", fontSize: 15 },
  editBtn: {
    background: "transparent",
    color: "#FF8FB1",
    border: "1px solid #FF8FB1",
    borderRadius: 8,
    padding: "6px 14px",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
  },
  input: {
    width: "100%",
    background: "#171423",
    color: "#F3F0FA",
    border: "1px solid #3A3452",
    borderRadius: 8,
    padding: "10px 12px",
    fontSize: 14,
    marginBottom: 10,
  },
  saveBtn: {
    background: "#FF8FB1",
    color: "#171423",
    border: "none",
    borderRadius: 8,
    padding: "8px 18px",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
  },
  cancelBtn: {
    background: "transparent",
    color: "#B4ABC9",
    border: "1px solid #3A3452",
    borderRadius: 8,
    padding: "8px 18px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },
  radioOption: {
    display: "flex",
    alignItems: "center",
    background: "#171423",
    border: "1px solid",
    borderRadius: 8,
    padding: "10px 12px",
    color: "#F3F0FA",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
  error: { color: "#FF7B8A", fontSize: 13, marginBottom: 8 },
  recoveryNote: { color: "#9B93B8", fontSize: 13, lineHeight: 1.5, margin: "6px 0 10px" },
  saved: { color: "#5EE0A0", fontSize: 12, marginTop: 8 },
  modeTab: {
    flex: 1,
    background: "#171423",
    color: "#B4ABC9",
    border: "1px solid #3A3452",
    borderRadius: 8,
    padding: "8px 0",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
  },
  modeTabActive: { background: "#FF8FB1", color: "#171423", borderColor: "#FF8FB1" },
  uploadBtn: {
    background: "transparent",
    color: "#FF8FB1",
    border: "1px solid #FF8FB1",
    borderRadius: 8,
    padding: "8px 14px",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
  },
  emojiGrid: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 },
  emojiBtn: {
    width: 44,
    height: 44,
    fontSize: 20,
    background: "#171423",
    border: "1px solid",
    borderRadius: 10,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

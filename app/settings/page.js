"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { listNativeLanguages } from "../../data/tracks";
import { loadProfile, isUsernameTaken, setUsername as saveUsername, saveAvatar } from "../../lib/db";
import { notifyAccountChange } from "../../lib/notify";
import { verifyCurrentPassword } from "../../lib/reauth";
import { COUNTRIES, flagImageUrl, countryName } from "../../lib/countries";
import SearchableSelect from "../../lib/SearchableSelect";
import UsernameAvailabilityField from "../../lib/UsernameAvailabilityField";
import { uploadAvatarPhoto, AVATAR_EMOJIS } from "../../lib/avatarUpload";
import Avatar from "../../lib/Avatar";
import PasswordInput from "../../lib/PasswordInput";
import PasswordStrengthMeter from "../../lib/PasswordStrengthMeter";
import VersionFooter from "../../lib/VersionFooter";

export default function SettingsPage() {
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

  if (session === undefined) {
    return (
      <div style={styles.wrap}>
        <p style={{ color: "#B4ABC9" }}>Loading…</p>
      </div>
    );
  }

  return (
    <div style={styles.wrap}>
      <div style={{ width: "100%", maxWidth: 460 }}>
        <button className="rj" style={styles.backBtn} onClick={() => router.push("/")}>
          ← Back
        </button>
        <h1 className="rj" style={styles.title}>
          Settings
        </h1>

        <GroupHeader label="Profile" />
        <ProfilePictureSection session={session} profile={profile} setProfile={setProfile} />
        <UsernameSection session={session} profile={profile} setProfile={setProfile} />

        <GroupHeader label="Account" />
        <EmailSection session={session} setSession={setSession} />
        <PasswordSection session={session} />

        <GroupHeader label="Language & Learning" />
        <NativeLanguageSection session={session} setSession={setSession} />
        <NativeCountrySection session={session} setSession={setSession} />
        <GameplaySettingsSection session={session} setSession={setSession} />

        <GroupHeader label="Subscription" />
        <div style={styles.comingSoonCard}>
          <p style={{ color: "#7C7395", fontSize: 13, margin: 0 }}>Coming soon.</p>
        </div>

        <button
          className="rj"
          style={styles.signOutBtn}
          onClick={async () => {
            await supabase.auth.signOut();
            router.push("/auth");
          }}
        >
          Sign out
        </button>

        <VersionFooter />
      </div>
    </div>
  );
}

// ---------------- Profile picture ----------------

function ProfilePictureSection({ session, profile, setProfile }) {
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
      setError("Photo must be under 3MB.");
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
          setError("Pick an icon.");
          setBusy(false);
          return;
        }
        avatarValue = emojiChoice;
      } else if (mode === "flag") {
        if (!flagChoice) {
          setError("Pick a flag.");
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
          setError("Choose a photo to upload.");
          setBusy(false);
          return;
        }
      }

      await saveAvatar(session.user.id, avatarType, avatarValue);
      setProfile((p) => ({ ...(p || {}), avatar_type: avatarType, avatar_value: avatarValue }));
      setSaved(true);
      setEditing(false);
    } catch (e) {
      setError(e.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Section title="Profile picture" saved={saved}>
      {!editing ? (
        <div style={styles.row}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Avatar type={profile?.avatar_type} value={profile?.avatar_value} fallbackText={profile?.username || session.user.email} size={40} />
            <span style={styles.rowValue}>
              {profile?.avatar_type === "photo" ? "Custom photo" : profile?.avatar_type === "flag" ? "Flag" : profile?.avatar_type === "emoji" ? "Icon" : "(not set)"}
            </span>
          </div>
          <button className="rj" style={styles.editBtn} onClick={startEdit}>
            Edit
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
                {m === "photo" ? "Photo" : m === "emoji" ? "Icon" : "Flag"}
              </button>
            ))}
          </div>

          {mode === "photo" && (
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <Avatar type={photoPreview ? "photo" : null} value={photoPreview} size={56} />
              <label className="rj" style={styles.uploadBtn}>
                Choose file…
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
                placeholder="Search countries…"
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
          <EditActions busy={busy} onSave={save} onCancel={() => setEditing(false)} />
        </>
      )}
    </Section>
  );
}

// ---------------- Username ----------------

function UsernameSection({ session, profile, setProfile }) {
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
      setError("Username can't be empty.");
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
        setError("That username is already taken.");
        setBusy(false);
        return;
      }
      await saveUsername(session.user.id, trimmed);
      setProfile((p) => ({ ...(p || {}), username: trimmed }));
      notifyAccountChange("username_changed", session.user.email, { newUsername: trimmed });
      setSaved(true);
      setEditing(false);
    } catch (e) {
      setError(e.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Section title="Username" saved={saved}>
      {!editing ? (
        <Row value={profile?.username || "(not set)"} onEdit={startEdit} />
      ) : (
        <>
          <UsernameAvailabilityField value={value} onChange={setValue} placeholder="Username" />
          {error && <p style={styles.error}>{error}</p>}
          <EditActions busy={busy} onSave={save} onCancel={() => setEditing(false)} />
        </>
      )}
    </Section>
  );
}

// ---------------- Email ----------------

function EmailSection({ session, setSession }) {
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
      setError("Emails don't match.");
      return;
    }
    if (newEmail === session.user.email) {
      setEditing(false);
      return;
    }
    if (!currentPassword) {
      setError("Enter your current password to confirm this change.");
      return;
    }
    setBusy(true);
    try {
      const ok = await verifyCurrentPassword(session.user.email, currentPassword);
      if (!ok) {
        setError("Current password is incorrect.");
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
      setError(e.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Section title="Email" saved={saved} savedNote="Check your new email to confirm the change.">
      {!editing ? (
        <Row value={session.user.email} onEdit={startEdit} />
      ) : (
        <>
          <input className="jm" style={styles.input} value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="New email" type="email" />
          <input
            className="jm"
            style={styles.input}
            value={confirmNewEmail}
            onChange={(e) => setConfirmNewEmail(e.target.value)}
            placeholder="Confirm new email"
            type="email"
          />
          <PasswordInput
            className="jm"
            style={styles.input}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Current password (to confirm it's you)"
          />
          {error && <p style={styles.error}>{error}</p>}
          <EditActions busy={busy} onSave={save} onCancel={() => setEditing(false)} />
        </>
      )}
    </Section>
  );
}

// ---------------- Password ----------------

function PasswordSection({ session }) {
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
      setError("Enter your current password to confirm this change.");
      return;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError("New passwords don't match.");
      return;
    }
    setBusy(true);
    try {
      const ok = await verifyCurrentPassword(session.user.email, currentPassword);
      if (!ok) {
        setError("Current password is incorrect.");
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
      setError(e.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Section title="Password" saved={saved} savedNote={signedOutOthers ? "Other signed-in devices have been logged out for security." : ""}>
      {!editing ? (
        <Row value="••••••••" onEdit={startEdit} />
      ) : (
        <>
          <PasswordInput
            className="jm"
            style={styles.input}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Current password"
          />
          <PasswordInput
            className="jm"
            style={styles.input}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
            minLength={6}
          />
          <PasswordStrengthMeter password={newPassword} />
          <PasswordInput
            className="jm"
            style={styles.input}
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            placeholder="Confirm new password"
            minLength={6}
          />
          {error && <p style={styles.error}>{error}</p>}
          <EditActions busy={busy} onSave={save} onCancel={() => setEditing(false)} />
        </>
      )}
    </Section>
  );
}

// ---------------- Native language ----------------

function NativeLanguageSection({ session, setSession }) {
  const [editing, setEditing] = useState(false);
  const [choice, setChoice] = useState(null);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const options = listNativeLanguages();
  const current = session.user.user_metadata?.native_lang ?? null;
  const currentLabel = options.find((o) => o.code === current)?.label || "(not set)";

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
    <Section title="Native / base language" saved={saved}>
      {!editing ? (
        <Row value={currentLabel} onEdit={startEdit} />
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
            {options.map((o) => (
              <label key={o.code} style={{ ...styles.radioOption, borderColor: choice === o.code ? "#FF8FB1" : "#3A3452" }}>
                <input type="radio" name="nativeLang" checked={choice === o.code} onChange={() => setChoice(o.code)} style={{ marginRight: 10 }} />
                {o.label}
              </label>
            ))}
          </div>
          <EditActions busy={busy} onSave={save} onCancel={() => setEditing(false)} />
        </>
      )}
      <p style={{ color: "#7C7395", fontSize: 12, marginTop: 8 }}>
        Changing this only changes which languages show up to learn — progress in tracks you've already played is kept.
      </p>
    </Section>
  );
}

// ---------------- Native country ----------------

function NativeCountrySection({ session, setSession }) {
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
      <Section title="Native country">
        <p style={{ color: "#7C7395", fontSize: 13 }}>Set your native language above first.</p>
      </Section>
    );
  }

  return (
    <Section title="Native country" saved={saved}>
      {!editing ? (
        <Row
          value={
            currentCountry ? (
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <img src={flagImageUrl(currentCountry)} alt={currentCountry} style={{ width: 24, height: 17, objectFit: "cover", borderRadius: 2 }} />
                {countryName(currentCountry)}
              </span>
            ) : (
              "(not set)"
            )
          }
          onEdit={startEdit}
        />
      ) : (
        <>
          <SearchableSelect
            options={COUNTRIES.map((c) => ({ value: c.code, label: c.name }))}
            value={choice}
            onChange={setChoice}
            placeholder="Search countries…"
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
          <EditActions busy={busy} onSave={save} onCancel={() => setEditing(false)} />
        </>
      )}
      <p style={{ color: "#7C7395", fontSize: 12, marginTop: 8 }}>
        Combined with your native language, this determines the regional label shown on the home screen (e.g. Spanish + Venezuela → "Español (Latinoamérica)").
      </p>
    </Section>
  );
}

// ---------------- Gameplay settings (review mode + round length/timer) ----------------

function GameplaySettingsSection({ session, setSession }) {
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

  const [reviewMode, setReviewMode] = useState(currentReviewMode);
  const [perCat, setPerCat] = useState(currentPerCat);
  const [extraPairs, setExtraPairs] = useState(currentExtraPairs);
  const [sameTimer, setSameTimer] = useState(currentSameTimer);
  const [questionTime, setQuestionTime] = useState(currentQuestionTime);
  const [extraQuestionTime, setExtraQuestionTime] = useState(currentExtraQuestionTime);

  const startEdit = () => {
    setReviewMode(currentReviewMode);
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

  return (
    <Section title="Gameplay" saved={saved}>
      {!editing ? (
        <>
          <Row value={currentReviewMode ? "Review mode: on" : "Review mode: off"} onEdit={startEdit} />
          <p style={{ color: "#7C7395", fontSize: 12, marginTop: 8 }}>
            {currentPerCat} questions/category · {currentExtraPairs} phonetics pairs · {currentQuestionTime}s
            {currentQuestionTime !== currentExtraQuestionTime ? ` (${currentExtraQuestionTime}s phonetics)` : ""} per question
          </p>
        </>
      ) : (
        <>
          <label style={styles.toggleRow}>
            <input type="checkbox" checked={reviewMode} onChange={(e) => setReviewMode(e.target.checked)} />
            <span>Pause after each answer to review the explanation (tap "Next" to continue)</span>
          </label>

          <div style={{ marginTop: 14 }}>
            <label style={styles.numberLabel}>Questions per category (mixed rounds)</label>
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
            <label style={styles.numberLabel}>Phonetics pairs per round</label>
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
            <span>Same time limit for every question type</span>
          </label>

          <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
            <div style={{ flex: 1 }}>
              <label style={styles.numberLabel}>{sameTimer ? "Seconds per question" : "Seconds (regular)"}</label>
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
                <label style={styles.numberLabel}>Seconds (phonetics)</label>
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
            <EditActions busy={busy} onSave={save} onCancel={() => setEditing(false)} />
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

function Section({ title, children, saved, savedNote }) {
  return (
    <div style={styles.section}>
      <h2 className="rj" style={styles.sectionTitle}>
        {title}
      </h2>
      {children}
      {saved && <p style={styles.saved}>Saved.{savedNote ? ` ${savedNote}` : ""}</p>}
    </div>
  );
}

function Row({ value, onEdit }) {
  return (
    <div style={styles.row}>
      <span style={styles.rowValue}>{value}</span>
      <button className="rj" style={styles.editBtn} onClick={onEdit}>
        Edit
      </button>
    </div>
  );
}

function EditActions({ busy, onSave, onCancel }) {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <button className="rj" style={styles.saveBtn} onClick={onSave} disabled={busy}>
        {busy ? "..." : "Save"}
      </button>
      <button className="rj" style={styles.cancelBtn} onClick={onCancel} disabled={busy}>
        Cancel
      </button>
    </div>
  );
}

const styles = {
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
  numberLabel: { display: "block", color: "#7C7395", fontSize: 12, marginBottom: 4 },
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

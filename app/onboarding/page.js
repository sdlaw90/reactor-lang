"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { listNativeLanguages } from "../../data/tracks";
import { COUNTRIES, flagImageUrl, countryName } from "../../lib/countries";
import { AVATAR_EMOJIS, uploadAvatarPhoto } from "../../lib/avatarUpload";
import { saveAvatar } from "../../lib/db";
import SearchableSelect from "../../lib/SearchableSelect";
import Avatar from "../../lib/Avatar";
import { t } from "../../lib/playStrings";
import { useUiLang } from "../../lib/uiLang";
import LangSwitcher from "../../lib/LangSwitcher";

const STEPS = ["language", "country", "picture"];

export default function OnboardingPage() {
  const router = useRouter();
  const [uiLang] = useUiLang();
  const [session, setSession] = useState(undefined);
  const [step, setStep] = useState(0);

  const [nativeLang, setNativeLang] = useState(null);
  const [nativeCountry, setNativeCountry] = useState(null);
  const [avatarMode, setAvatarMode] = useState("emoji");
  const [emojiChoice, setEmojiChoice] = useState("");
  const [flagChoice, setFlagChoice] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push("/auth");
      } else {
        setSession(data.session);
      }
    });
  }, [router]);

  // Pre-select the native-language picker from the bootstrap UI language
  // (browser locale or the switcher choice) so a Spanish-locale user lands on
  // Spanish already selected. They can still change it.
  useEffect(() => {
    setNativeLang((cur) => {
      if (cur) return cur;
      const opts = listNativeLanguages();
      return opts.some((o) => o.code === uiLang) ? uiLang : cur;
    });
  }, [uiLang]);

  if (session === undefined) {
    return (
      <div style={styles.wrap}>
        <LangSwitcher />
        <p style={{ color: "#B4ABC9" }}>{t(uiLang, "loading")}</p>
      </div>
    );
  }

  const langOptions = listNativeLanguages();

  const finishStepLanguage = async () => {
    if (!nativeLang) return;
    setBusy(true);
    try {
      const { data, error } = await supabase.auth.updateUser({ data: { native_lang: nativeLang } });
      if (error) throw error;
      setSession((s) => ({ ...s, user: data.user }));
      setStep(1);
    } catch (e) {
      console.error("failed to save native language", e);
    } finally {
      setBusy(false);
    }
  };

  const finishStepCountry = async (skip) => {
    if (skip || !nativeCountry) {
      setStep(2);
      return;
    }
    setBusy(true);
    try {
      const { data, error } = await supabase.auth.updateUser({ data: { native_country: nativeCountry } });
      if (error) throw error;
      setSession((s) => ({ ...s, user: data.user }));
      setStep(2);
    } catch (e) {
      console.error("failed to save native country", e);
    } finally {
      setBusy(false);
    }
  };

  const onPickPhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const finishStepPicture = async (skip) => {
    if (skip) {
      router.push("/");
      return;
    }
    setBusy(true);
    try {
      let avatarValue = "";
      if (avatarMode === "emoji" && emojiChoice) avatarValue = emojiChoice;
      else if (avatarMode === "flag" && flagChoice) avatarValue = flagChoice;
      else if (avatarMode === "photo" && photoFile) avatarValue = await uploadAvatarPhoto(session.user.id, photoFile);

      if (avatarValue) {
        await saveAvatar(session.user.id, avatarMode, avatarValue);
      }
      router.push("/");
    } catch (e) {
      console.error("failed to save profile picture", e);
      router.push("/");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={styles.wrap}>
      <LangSwitcher />
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={styles.stepIndicator}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ ...styles.stepDot, background: i <= step ? "#FF8FB1" : "#3A3452" }} />
          ))}
        </div>

        {step === 0 && (
          <div className="fadein">
            <h1 className="rj" style={styles.title}>
              {t(uiLang, "obLangTitle")}
            </h1>
            <p style={styles.subtitle}>{t(uiLang, "obLangSub")}</p>
            <div style={{ marginTop: 20 }}>
              <SearchableSelect
                options={langOptions.map((o) => ({ value: o.code, label: o.label }))}
                value={nativeLang}
                onChange={setNativeLang}
                placeholder={t(uiLang, "obSearchLang")}
              />
            </div>
            <button className="rj" style={styles.primaryBtn} disabled={!nativeLang || busy} onClick={finishStepLanguage}>
              {busy ? "..." : t(uiLang, "obContinue")}
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="fadein">
            <h1 className="rj" style={styles.title}>
              {t(uiLang, "obCountryTitle")}
            </h1>
            <p style={styles.subtitle}>{t(uiLang, "obCountrySub")}</p>
            <div style={{ marginTop: 20 }}>
              <SearchableSelect
                options={COUNTRIES.map((c) => ({ value: c.code, label: c.name }))}
                value={nativeCountry}
                onChange={setNativeCountry}
                placeholder={t(uiLang, "obSearchCountry")}
                renderOption={(o) => (
                  <>
                    <img src={flagImageUrl(o.value)} alt={o.value} style={{ width: 20, height: 14, objectFit: "cover", borderRadius: 2, flexShrink: 0 }} />
                    {o.label}
                  </>
                )}
              />
              {nativeCountry && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
                  <img src={flagImageUrl(nativeCountry)} alt={nativeCountry} style={{ width: 28, height: 19, objectFit: "cover", borderRadius: 3 }} />
                  <span style={{ color: "#B4ABC9", fontSize: 13 }}>{countryName(nativeCountry)}</span>
                </div>
              )}
            </div>
            <button className="rj" style={styles.primaryBtn} disabled={busy} onClick={() => finishStepCountry(false)}>
              {busy ? "..." : t(uiLang, "obContinue")}
            </button>
            <button className="rj" style={styles.skipBtn} onClick={() => finishStepCountry(true)}>
              {t(uiLang, "obSkip")}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="fadein">
            <h1 className="rj" style={styles.title}>
              {t(uiLang, "obPicTitle")}
            </h1>
            <p style={styles.subtitle}>{t(uiLang, "obPicSub")}</p>

            <div style={{ display: "flex", gap: 8, marginTop: 20, marginBottom: 14 }}>
              {["photo", "emoji", "flag"].map((m) => (
                <button
                  key={m}
                  className="rj"
                  onClick={() => setAvatarMode(m)}
                  style={{ ...styles.modeTab, ...(avatarMode === m ? styles.modeTabActive : {}) }}
                >
                  {m === "photo" ? t(uiLang, "obTabPhoto") : m === "emoji" ? t(uiLang, "obTabIcon") : t(uiLang, "obTabFlag")}
                </button>
              ))}
            </div>

            {avatarMode === "photo" && (
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Avatar type={photoPreview ? "photo" : null} value={photoPreview} size={56} />
                <label className="rj" style={styles.uploadBtn}>
                  {t(uiLang, "obChooseFile")}
                  <input type="file" accept="image/*" onChange={onPickPhoto} style={{ display: "none" }} />
                </label>
              </div>
            )}

            {avatarMode === "emoji" && (
              <div style={styles.emojiGrid}>
                {AVATAR_EMOJIS.map((e) => (
                  <button
                    key={e}
                    onClick={() => setEmojiChoice(e)}
                    style={{ ...styles.emojiBtn, borderColor: emojiChoice === e ? "#FF8FB1" : "#3A3452" }}
                  >
                    {e}
                  </button>
                ))}
              </div>
            )}

            {avatarMode === "flag" && (
              <SearchableSelect
                options={COUNTRIES.map((c) => ({ value: c.code, label: c.name }))}
                value={flagChoice}
                onChange={setFlagChoice}
                placeholder={t(uiLang, "obSearchCountry")}
                renderOption={(o) => (
                  <>
                    <img src={flagImageUrl(o.value)} alt={o.value} style={{ width: 20, height: 14, objectFit: "cover", borderRadius: 2, flexShrink: 0 }} />
                    {o.label}
                  </>
                )}
              />
            )}

            <button className="rj" style={styles.primaryBtn} disabled={busy} onClick={() => finishStepPicture(false)}>
              {busy ? "..." : t(uiLang, "obFinish")}
            </button>
            <button className="rj" style={styles.skipBtn} onClick={() => finishStepPicture(true)}>
              {t(uiLang, "obSkip")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrap: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: "#171423" },
  stepIndicator: { display: "flex", gap: 6, justifyContent: "center", marginBottom: 24 },
  stepDot: { width: 8, height: 8, borderRadius: "50%" },
  title: { fontSize: 22, fontWeight: 700, color: "#F3F0FA", margin: "0 0 6px", textAlign: "center" },
  subtitle: { color: "#B4ABC9", fontSize: 13, textAlign: "center", lineHeight: 1.5 },
  optionCard: {
    textAlign: "left",
    background: "#221E33",
    border: "1px solid",
    borderRadius: 12,
    padding: "16px 18px",
    color: "#F3F0FA",
    fontSize: 17,
    fontWeight: 700,
    cursor: "pointer",
  },
  primaryBtn: {
    width: "100%",
    background: "#FF8FB1",
    color: "#171423",
    border: "none",
    borderRadius: 10,
    padding: "13px",
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
    marginTop: 24,
  },
  skipBtn: {
    width: "100%",
    background: "transparent",
    color: "#9B93B8",
    border: "none",
    fontSize: 13,
    cursor: "pointer",
    marginTop: 10,
    textDecoration: "underline",
  },
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
  emojiGrid: { display: "flex", flexWrap: "wrap", gap: 8 },
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

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { listNativeLanguages } from "../../data/tracks";

export default function SettingsPage() {
  const router = useRouter();
  const [session, setSession] = useState(undefined);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push("/auth");
      } else {
        setSession(data.session);
      }
    });
  }, [router]);

  const currentNativeLang = session?.user?.user_metadata?.native_lang ?? null;

  const chooseNativeLang = async (code) => {
    setSaving(true);
    setSaved(false);
    try {
      const { data, error } = await supabase.auth.updateUser({ data: { native_lang: code } });
      if (error) throw error;
      setSession((s) => ({ ...s, user: data.user }));
      setSaved(true);
    } catch (e) {
      console.error("failed to update native language", e);
    } finally {
      setSaving(false);
    }
  };

  if (session === undefined) {
    return (
      <div style={styles.wrap}>
        <p style={{ color: "#7A7F8C" }}>Loading…</p>
      </div>
    );
  }

  const options = listNativeLanguages();

  return (
    <div style={styles.wrap}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <button className="rj" style={styles.backBtn} onClick={() => router.push("/")}>
          ← Back
        </button>
        <h1 className="rj" style={styles.title}>
          Settings
        </h1>

        <p style={styles.label}>Native / base language</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
          {options.map((o) => (
            <button
              key={o.code}
              className="rj"
              style={{
                ...styles.option,
                borderColor: currentNativeLang === o.code ? "#FF3D7F" : "#2A2F3B",
              }}
              disabled={saving}
              onClick={() => chooseNativeLang(o.code)}
            >
              {o.label}
              {currentNativeLang === o.code && <span style={styles.currentTag}>current</span>}
            </button>
          ))}
        </div>
        {saved && <p style={styles.saved}>Saved.</p>}

        <p style={{ ...styles.label, marginTop: 28 }}>
          Changing this changes which languages show up to learn on the home screen. Your
          progress in any track you've already played is kept — nothing is deleted.
        </p>
      </div>
    </div>
  );
}

const styles = {
  wrap: { minHeight: "100vh", display: "flex", justifyContent: "center", padding: "40px 20px", background: "#0E1016" },
  backBtn: {
    background: "transparent",
    color: "#7A7F8C",
    border: "1px solid #2A2F3B",
    borderRadius: 8,
    padding: "6px 12px",
    fontSize: 13,
    cursor: "pointer",
    marginBottom: 16,
  },
  title: { fontSize: 24, fontWeight: 700, color: "#EDEDF2", margin: "0 0 20px" },
  label: { color: "#7A7F8C", fontSize: 13, lineHeight: 1.5 },
  option: {
    textAlign: "left",
    background: "#171B24",
    border: "1px solid",
    borderRadius: 10,
    padding: "14px 16px",
    color: "#EDEDF2",
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  currentTag: {
    fontSize: 11,
    fontWeight: 700,
    color: "#FF3D7F",
    border: "1px solid #FF3D7F",
    borderRadius: 20,
    padding: "2px 8px",
  },
  saved: { color: "#4ADE80", fontSize: 13, marginTop: 10 },
};

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { CURRENT_VERSION, CHANGELOG } from "../../lib/version";

export default function WhatsNewPage() {
  const router = useRouter();
  const [marked, setMarked] = useState(false);
  const latest = CHANGELOG[0];

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!data.session) return;
        const lastSeen = data.session.user.user_metadata?.last_seen_version;
        if (lastSeen !== CURRENT_VERSION) {
          await supabase.auth.updateUser({ data: { last_seen_version: CURRENT_VERSION } });
        }
      } catch (e) {
        console.error("failed to mark what's-new as seen", e);
      } finally {
        setMarked(true);
      }
    })();
  }, []);

  return (
    <div style={styles.wrap}>
      <div style={{ width: "100%", maxWidth: 460 }}>
        <button className="rj" style={styles.backBtn} onClick={() => router.push("/")}>
          ← Back
        </button>

        <div style={styles.badge}>!</div>
        <h1 className="rj" style={styles.title}>
          What's new
        </h1>
        <p className="jm" style={styles.versionLine}>
          v{latest.version} <span style={{ color: "#7C7395" }}>&middot; {latest.date}</span>
        </p>

        <ul style={styles.list}>
          {latest.changes.map((c, i) => (
            <li key={i} style={styles.listItem}>
              <span style={styles.bullet}>•</span>
              {c}
            </li>
          ))}
        </ul>

        <button className="rj" style={styles.secondaryBtn} onClick={() => router.push("/changelog")}>
          See full changelog
        </button>
      </div>
    </div>
  );
}

const styles = {
  wrap: { minHeight: "100vh", display: "flex", justifyContent: "center", padding: "40px 20px", background: "#171423" },
  backBtn: {
    background: "transparent",
    color: "#B4ABC9",
    border: "1px solid #3A3452",
    borderRadius: 8,
    padding: "6px 12px",
    fontSize: 13,
    cursor: "pointer",
    marginBottom: 20,
  },
  badge: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #FF8FB1, #B98EFF)",
    color: "#171423",
    fontWeight: 800,
    fontSize: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  title: { fontSize: 24, fontWeight: 700, color: "#F3F0FA", margin: "0 0 4px" },
  versionLine: { color: "#FF8FB1", fontSize: 13, fontWeight: 700, marginBottom: 20 },
  list: { margin: "0 0 24px", padding: 0, listStyle: "none" },
  listItem: {
    color: "#D9D3EC",
    fontSize: 14.5,
    lineHeight: 1.6,
    marginBottom: 12,
    paddingLeft: 20,
    position: "relative",
  },
  bullet: { position: "absolute", left: 0, color: "#FF8FB1", fontWeight: 700 },
  secondaryBtn: {
    width: "100%",
    background: "transparent",
    color: "#B4ABC9",
    border: "1px solid #3A3452",
    borderRadius: 10,
    padding: "11px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },
};

"use client";

import { useRouter } from "next/navigation";
import { CURRENT_VERSION, CHANGELOG } from "../../lib/version";

export default function ChangelogPage() {
  const router = useRouter();

  return (
    <div style={styles.wrap}>
      <div style={{ width: "100%", maxWidth: 460 }}>
        <button className="rj" style={styles.backBtn} onClick={() => router.push("/")}>
          ← Back
        </button>
        <h1 className="rj" style={styles.title}>
          Changelog
        </h1>
        <p style={styles.subtitle}>
          Currently published: <span className="jm" style={{ color: "#FF8FB1", fontWeight: 700 }}>v{CURRENT_VERSION}</span>
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 20 }}>
          {CHANGELOG.map((entry) => (
            <div key={entry.version} style={styles.entry}>
              <div style={styles.entryHeader}>
                <span className="jm" style={styles.entryVersion}>
                  v{entry.version}
                </span>
                <span style={styles.entryDate}>{entry.date}</span>
              </div>
              <ul style={styles.list}>
                {entry.changes.map((c, i) => (
                  <li key={i} style={styles.listItem}>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
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
    marginBottom: 16,
  },
  title: { fontSize: 24, fontWeight: 700, color: "#F3F0FA", margin: "0 0 6px" },
  subtitle: { color: "#B4ABC9", fontSize: 13 },
  entry: { background: "#221E33", border: "1px solid #3A3452", borderRadius: 12, padding: "14px 18px" },
  entryHeader: { display: "flex", alignItems: "baseline", gap: 10, marginBottom: 8 },
  entryVersion: { color: "#FF8FB1", fontSize: 15, fontWeight: 700 },
  entryDate: { color: "#7C7395", fontSize: 12 },
  list: { margin: 0, paddingLeft: 18 },
  listItem: { color: "#D9D3EC", fontSize: 13.5, lineHeight: 1.6, marginBottom: 4 },
};

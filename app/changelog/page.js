"use client";

import { useEffect, useState } from "react";
import BackHome from "../../lib/BackHome";
import { supabase } from "../../lib/supabaseClient";
import { loadProfile } from "../../lib/db";
import {
  CURRENT_VERSION,
  CHANGELOG,
  INTERNAL_CHANGELOG,
  isNonProdEnv,
  internalNotesByVersion,
} from "../../lib/version";

const ADMIN_EMAIL = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "").toLowerCase();

export default function ChangelogPage() {
  // #91: internal mode surfaces the fuller INTERNAL_CHANGELOG detail. On by
  // default on any non-production deploy; also on for admins anywhere. Prod
  // non-admins see only the cleaned user-facing CHANGELOG.
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!data.session) return;
        const email = data.session.user.email?.toLowerCase();
        if (ADMIN_EMAIL && email === ADMIN_EMAIL) {
          setIsAdmin(true);
          return;
        }
        const profile = await loadProfile(data.session.user.id).catch(() => null);
        if (profile?.is_admin === true) setIsAdmin(true);
      } catch (e) {
        console.error("changelog admin check failed", e);
      }
    })();
  }, []);

  const internalMode = isNonProdEnv() || isAdmin;
  const internalNotes = internalMode ? internalNotesByVersion() : {};
  // Internal-only entries (e.g. the "unreleased" dev cycle) have no user-facing
  // CHANGELOG counterpart, so surface them at the top when in internal mode.
  const changelogVersions = new Set(CHANGELOG.map((e) => e.version));
  const internalOnlyEntries = internalMode
    ? INTERNAL_CHANGELOG.filter((e) => !changelogVersions.has(e.version))
    : [];

  return (
    <div style={styles.wrap}>
      <div style={{ width: "100%", maxWidth: 460 }}>
        {/* #92: Back always; Home appears too when reached 2+ deep (e.g.
            home → What's New → full changelog). */}
        <BackHome />
        <h1 className="rj" style={styles.title}>
          Changelog
        </h1>
        <p style={styles.subtitle}>
          Currently published: <span className="jm" style={{ color: "#FF8FB1", fontWeight: 700 }}>v{CURRENT_VERSION}</span>
        </p>
        {internalMode && (
          <p style={styles.internalBanner}>
            Internal view — showing developer/release detail that's hidden on production.
          </p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 20 }}>
          {internalOnlyEntries.map((entry) => (
            <div key={`internal-${entry.version}`} style={{ ...styles.entry, ...styles.internalEntry }}>
              <div style={styles.entryHeader}>
                <span className="jm" style={{ ...styles.entryVersion, color: "#B98EFF" }}>
                  {entry.version}
                </span>
                <span style={styles.entryDate}>{entry.date}</span>
              </div>
              <div style={styles.internalTag}>INTERNAL</div>
              <ul style={styles.list}>
                {entry.notes.map((n, i) => (
                  <li key={i} style={styles.listItem}>
                    {n}
                  </li>
                ))}
              </ul>
            </div>
          ))}

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
              {internalNotes[entry.version] && (
                <>
                  <div style={{ ...styles.internalTag, marginTop: 10 }}>INTERNAL DETAIL</div>
                  <ul style={styles.list}>
                    {internalNotes[entry.version].map((n, i) => (
                      <li key={i} style={{ ...styles.listItem, color: "#B4ABC9" }}>
                        {n}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrap: { minHeight: "100vh", display: "flex", justifyContent: "center", padding: "40px 20px", background: "#171423" },
  title: { fontSize: 24, fontWeight: 700, color: "#F3F0FA", margin: "0 0 6px" },
  subtitle: { color: "#B4ABC9", fontSize: 13 },
  internalBanner: {
    color: "#E4D6FF",
    background: "#241B36",
    border: "1px solid #B98EFF",
    borderRadius: 8,
    padding: "8px 12px",
    fontSize: 12.5,
    marginTop: 10,
  },
  entry: { background: "#221E33", border: "1px solid #3A3452", borderRadius: 12, padding: "14px 18px" },
  internalEntry: { borderColor: "#B98EFF", background: "#201A31" },
  entryHeader: { display: "flex", alignItems: "baseline", gap: 10, marginBottom: 8 },
  entryVersion: { color: "#FF8FB1", fontSize: 15, fontWeight: 700 },
  entryDate: { color: "#9B93B8", fontSize: 12 },
  internalTag: { color: "#B98EFF", fontSize: 10, fontWeight: 800, letterSpacing: 1, marginBottom: 4 },
  list: { margin: 0, paddingLeft: 18 },
  listItem: { color: "#D9D3EC", fontSize: 13.5, lineHeight: 1.6, marginBottom: 4 },
};

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trophy, Flame, Target } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { getTrack, listTracks } from "../../data/tracks";
import { loadAllProgress } from "../../lib/db";
import { skillLevelInfo } from "../../lib/skillLevels";
import { trackDisplayName as sharedTrackDisplayName } from "../../lib/languageNames";

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState(undefined);
  const [rows, setRows] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/auth");
        return;
      }
      setSession(data.session);
      try {
        const all = await loadAllProgress(data.session.user.id);
        setRows(all);
      } catch (e) {
        console.error("failed to load dashboard progress", e);
      } finally {
        setLoaded(true);
      }
    })();
  }, [router]);

  if (session === undefined || !loaded) {
    return (
      <div style={styles.wrap}>
        <p style={{ color: "#B4ABC9" }}>Loading…</p>
      </div>
    );
  }

  const nativeLang = session?.user?.user_metadata?.native_lang ?? null;
  const trackDisplayName = (t) => sharedTrackDisplayName(t, nativeLang);
  const totalXP = rows.reduce((sum, r) => sum + (r.xp || 0), 0);
  const totalRounds = rows.reduce((sum, r) => sum + (r.rounds_completed || 0), 0);
  const bestStreak = rows.reduce((max, r) => Math.max(max, r.streak || 0), 0);
  const playedTracks = rows
    .map((r) => ({ ...r, trackInfo: getTrack(r.track_id) }))
    .filter((r) => r.trackInfo)
    .sort((a, b) => b.xp - a.xp);

  return (
    <div style={styles.wrap}>
      <div style={{ width: "100%", maxWidth: 460 }}>
        <button className="rj" style={styles.backBtn} onClick={() => router.push("/")}>
          ← Back
        </button>
        <h1 className="rj" style={styles.title}>
          Your progress
        </h1>

        <div style={styles.overallCard}>
          <div style={styles.overallRow}>
            <div style={styles.overallStat}>
              <Trophy size={16} color="#FFB84D" />
              <span className="jm" style={styles.overallValue}>
                {totalXP}
              </span>
              <span style={styles.overallLabel}>Total XP</span>
            </div>
            <div style={styles.overallStat}>
              <Flame size={16} color="#FF7B8A" />
              <span className="jm" style={styles.overallValue}>
                {bestStreak}d
              </span>
              <span style={styles.overallLabel}>Best streak</span>
            </div>
            <div style={styles.overallStat}>
              <Target size={16} color="#5EE0A0" />
              <span className="jm" style={styles.overallValue}>
                {totalRounds}
              </span>
              <span style={styles.overallLabel}>Rounds</span>
            </div>
          </div>
        </div>

        <h2 className="rj" style={styles.sectionTitle}>
          By language
        </h2>

        {playedTracks.length === 0 && (
          <p style={{ color: "#7C7395", fontSize: 14 }}>Play a round in any language to see your breakdown here.</p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {playedTracks.map((r) => (
            <button key={r.track_id} className="rj" style={styles.trackRow} onClick={() => router.push(`/play/${r.track_id}`)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 700, color: "#F3F0FA" }}>{trackDisplayName(r.trackInfo)}</span>
                <span style={{ color: "#7C7395", fontSize: 11 }}>{skillLevelInfo(r.skill_level).label}</span>
              </div>
              <div className="jm" style={styles.trackStatsRow}>
                <span>Nv.{r.level}</span>
                <span>{r.xp} XP</span>
                <span>🔥{r.streak}d</span>
                <span>{r.rounds_completed} rondas</span>
              </div>
            </button>
          ))}

          {listTracks()
            .filter((t) => !rows.find((r) => r.track_id === t.id))
            .map((t) => (
              <button key={t.id} className="rj" style={{ ...styles.trackRow, opacity: 0.6 }} onClick={() => router.push(`/play/${t.id}`)}>
                <span style={{ fontWeight: 700, color: "#F3F0FA" }}>{trackDisplayName(t)}</span>
                <div style={{ color: "#7C7395", fontSize: 12, marginTop: 4 }}>Not started yet</div>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrap: { minHeight: "100vh", display: "flex", justifyContent: "center", padding: "40px 20px", background: "#171423" },
  backBtn: { background: "rgba(255,143,177,0.12)", color: "#FF8FB1", border: "1px solid #FF8FB1", borderRadius: 8, padding: "7px 14px", fontSize: 14, fontWeight: 700, cursor: "pointer", marginBottom: 16 },
  title: { fontSize: 24, fontWeight: 700, color: "#F3F0FA", margin: "0 0 16px" },
  overallCard: { background: "#221E33", border: "1px solid #3A3452", borderRadius: 14, padding: "18px 16px", marginBottom: 24 },
  overallRow: { display: "flex", justifyContent: "space-around" },
  overallStat: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4 },
  overallValue: { fontSize: 20, fontWeight: 700, color: "#F3F0FA" },
  overallLabel: { fontSize: 11, color: "#7C7395" },
  sectionTitle: { fontSize: 15, fontWeight: 700, color: "#F3F0FA", margin: "0 0 10px" },
  trackRow: { textAlign: "left", background: "#221E33", border: "1px solid #3A3452", borderRadius: 12, padding: "14px 16px", cursor: "pointer" },
  trackStatsRow: { display: "flex", gap: 14, marginTop: 6, color: "#B4ABC9", fontSize: 12 },
};

"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, TriangleAlert, TrendingUp, Users, BellOff, SlidersHorizontal } from "lucide-react";
import { adminFetch, adminColors as c } from "./adminApi";

// Admin → Progress: per-user / per-language progress insight. A top toggle picks
// the entry point, then progressive-disclosure drilldowns:
//   Overview  → whole beta at a glance + "needs attention" (the content-bug
//               finder) → click a language → its categories/items/learners
//   Learners  → searchable list of every learner → click a user → all their
//               languages, coverage, and per-category weak spots
// Both paths share the same track/user drilldowns. All data comes from the
// migration-015 analytics views via /api/admin/progress/*.

// ---- shared helpers ---------------------------------------------------------

// Accuracy → colour. Conservative bands so "red" genuinely means "look at this."
function accColor(pct) {
  if (pct === null || pct === undefined) return c.muted;
  if (pct >= 80) return c.green;
  if (pct >= 60) return c.amber;
  return c.red;
}
const pct = (v) => (v === null || v === undefined ? "—" : `${v}%`);
const num = (v) => (v === null || v === undefined ? "—" : Number(v).toLocaleString());

function timeAgo(iso) {
  if (!iso) return "never";
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 0) return "just now";
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}
// milliseconds since an ISO time, or Infinity when absent (sorts "never" last).
const sinceMs = (iso) => (iso ? Date.now() - new Date(iso).getTime() : Infinity);

const SKILL_LABEL = { none: "No exp.", beginner: "Beginner", intermediate: "Intermediate", expert: "Advanced", native: "Native" };

function Bar({ pct: p, color }) {
  const width = p === null || p === undefined ? 0 : Math.max(0, Math.min(100, p));
  return (
    <div style={styles.barTrack} aria-hidden="true">
      <div style={{ ...styles.barFill, width: `${width}%`, background: color || accColor(p) }} />
    </div>
  );
}

// ---- root -------------------------------------------------------------------

export default function ProgressSection() {
  // root = which top toggle is selected ('overview' | 'learners').
  // view = what's actually shown; drilldowns keep the root highlighted.
  const [root, setRoot] = useState("overview");
  const [view, setView] = useState({ name: "overview" });

  // "Needs a nudge" thresholds, persisted in the DB (admin_settings). Loaded
  // once; falls back to defaults if the settings route/table isn't there yet.
  const [nudgeCfg, setNudgeCfg] = useState(DEFAULT_NUDGE);
  useEffect(() => {
    adminFetch("/api/admin/progress/settings")
      .then((s) => setNudgeCfg({ minAnswers: s.minAnswers, quietDays: s.quietDays }))
      .catch(() => setNudgeCfg(DEFAULT_NUDGE));
  }, []);
  const saveNudgeCfg = async (next) => {
    const s = await adminFetch("/api/admin/progress/settings", { method: "POST", body: next });
    setNudgeCfg({ minAnswers: s.minAnswers, quietDays: s.quietDays });
  };

  const selectRoot = (r) => {
    setRoot(r);
    setView({ name: r });
  };

  return (
    <div>
      <div style={styles.modeBar}>
        <ModeButton icon={TrendingUp} label="Overview" active={root === "overview"} onClick={() => selectRoot("overview")} />
        <ModeButton icon={Users} label="Learners" active={root === "learners"} onClick={() => selectRoot("learners")} />
      </div>

      {view.name === "overview" && <Overview onOpenTrack={(trackId) => setView({ name: "track", trackId })} />}
      {view.name === "learners" && (
        <LearnersList
          cfg={nudgeCfg}
          onSaveCfg={saveNudgeCfg}
          onOpenUser={(userId) => setView({ name: "user", userId, from: { name: "learners" } })}
        />
      )}
      {view.name === "track" && (
        <TrackView
          trackId={view.trackId}
          onBack={() => setView({ name: "overview" })}
          onOpenUser={(userId) => setView({ name: "user", userId, from: { name: "track", trackId: view.trackId } })}
        />
      )}
      {view.name === "user" && <UserView userId={view.userId} onBack={() => setView(view.from || { name: root })} />}
    </div>
  );
}

// ---- overview ---------------------------------------------------------------

function Overview({ onOpenTrack }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminFetch("/api/admin/progress/overview").then(setData).catch((e) => setError(e.message));
  }, []);

  if (error) return <p style={styles.error}>{error}</p>;
  if (!data) return <p style={{ color: c.body }}>Loading…</p>;

  const t = data.tiles;
  const tiles = t
    ? [
        { label: "Learners", value: num(t.learners), color: c.green },
        { label: "Answers logged", value: num(t.totalAnswers), color: c.purple },
        { label: "Overall accuracy", value: pct(t.overallAccuracy), color: accColor(t.overallAccuracy) },
        { label: "Active last 7d", value: num(t.activeLast7Days), color: c.green },
        { label: "Active last 30d", value: num(t.activeLast30Days), color: c.body },
      ]
    : [];

  const hasData = t && t.totalAnswers > 0;

  return (
    <div>
      {!hasData && (
        <p style={styles.emptyNote}>
          No answered questions have been logged yet, so most panels below are empty. They fill in as
          beta users play.
        </p>
      )}

      <div style={styles.tileGrid}>
        {tiles.map((tile) => (
          <div key={tile.label} style={styles.tile}>
            <div style={{ ...styles.tileValue, color: tile.color }}>{tile.value}</div>
            <div style={styles.tileLabel}>{tile.label}</div>
          </div>
        ))}
      </div>

      {/* Needs attention — the content-bug finder, surfaced first by design. */}
      <SectionHeader icon={TriangleAlert} color={c.red} title="Needs attention" />
      <p style={styles.sectionSub}>
        Lowest-accuracy items and categories across all learners (min {data.thresholds?.minItemAnswers}/
        {data.thresholds?.minCategoryAnswers} answers). A single item everyone gets wrong is often a broken
        answer key or a confusing distractor.
      </p>

      <div style={styles.attnGrid}>
        <div>
          <div style={styles.attnColTitle}>Hardest items</div>
          {(data.needsAttention?.items || []).length === 0 && <p style={styles.muted}>Nothing flagged yet.</p>}
          {(data.needsAttention?.items || []).map((it, i) => (
            <button key={i} className="rj" style={styles.attnItem} onClick={() => onOpenTrack(it.trackId)} title="Open this language">
              <div style={{ ...styles.accPill, color: accColor(it.accuracyPct), borderColor: accColor(it.accuracyPct) }}>
                {pct(it.accuracyPct)}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={styles.attnPrompt}>{it.prompt}</div>
                <div style={styles.attnMeta}>
                  {it.label} · {it.cat} · {num(it.answers)} answers · {num(it.learners)} learners
                </div>
              </div>
            </button>
          ))}
        </div>

        <div>
          <div style={styles.attnColTitle}>Weakest categories</div>
          {(data.needsAttention?.categories || []).length === 0 && <p style={styles.muted}>Nothing flagged yet.</p>}
          {(data.needsAttention?.categories || []).map((cat, i) => (
            <button key={i} className="rj" style={styles.attnItem} onClick={() => onOpenTrack(cat.trackId)} title="Open this language">
              <div style={{ ...styles.accPill, color: accColor(cat.accuracyPct), borderColor: accColor(cat.accuracyPct) }}>
                {pct(cat.accuracyPct)}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={styles.attnPrompt}>
                  {cat.label} — <span style={{ color: c.body }}>{cat.cat}</span>
                </div>
                <div style={styles.attnMeta}>
                  {num(cat.answers)} answers · {num(cat.learners)} learners
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Activity trend */}
      <SectionHeader icon={TrendingUp} color={c.purple} title={`Activity — last ${data.thresholds?.trendDays || 30} days`} />
      <ActivityChart trend={data.trend || []} />

      {/* Per-track table */}
      <SectionHeader title="Languages" />
      <div style={styles.trackTable}>
        <div style={{ ...styles.trackRow, ...styles.trackHead }}>
          <div style={styles.tCellName}>Language</div>
          <div style={styles.tCell}>Learners</div>
          <div style={styles.tCell}>Answers</div>
          <div style={styles.tCell}>Accuracy</div>
          <div style={styles.tCell}>Last active</div>
        </div>
        {(data.tracks || []).length === 0 && <p style={styles.muted}>No track activity yet.</p>}
        {(data.tracks || []).map((tr) => (
          <button key={tr.trackId} className="rj" style={styles.trackRow} onClick={() => onOpenTrack(tr.trackId)}>
            <div style={styles.tCellName}>
              <span style={styles.trackName}>{tr.label}</span>
              {tr.totalItems ? <span style={styles.trackItems}>{num(tr.totalItems)} items</span> : null}
            </div>
            <div style={styles.tCell}>{num(tr.learners)}</div>
            <div style={styles.tCell}>{num(tr.answers)}</div>
            <div style={{ ...styles.tCell, color: accColor(tr.accuracyPct), fontWeight: 700 }}>{pct(tr.accuracyPct)}</div>
            <div style={{ ...styles.tCell, color: c.muted }}>{timeAgo(tr.lastActivity)}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ActivityChart({ trend }) {
  const max = useMemo(() => Math.max(1, ...trend.map((d) => d.answers)), [trend]);
  if (!trend.length) return <p style={styles.muted}>No activity in this window yet.</p>;
  const W = 640, H = 120, pad = 6;
  const barW = (W - pad * 2) / trend.length;
  return (
    <div style={styles.chartWrap}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} role="img" aria-label="Answers logged per day over the last 30 days" preserveAspectRatio="none">
        <line x1={pad} y1={H - 16} x2={W - pad} y2={H - 16} stroke={c.border} strokeWidth="1" />
        {trend.map((d, i) => {
          const h = Math.round(((H - 26) * d.answers) / max);
          return (
            <rect key={i} x={pad + i * barW + barW * 0.15} y={H - 16 - h} width={barW * 0.7} height={h} rx="1.5" fill={c.purple} opacity={0.85}>
              <title>{`${d.day}: ${d.answers} answers, ${d.activeUsers} active`}</title>
            </rect>
          );
        })}
      </svg>
      <div style={styles.chartAxis}>
        <span>{trend[0]?.day}</span>
        <span>peak {num(max)}/day</span>
        <span>{trend[trend.length - 1]?.day}</span>
      </div>
    </div>
  );
}

// ---- learners list (user-first entry point) ---------------------------------

const LEARNER_SORTS = [
  { key: "active", label: "Most active" },
  { key: "accuracy", label: "Highest accuracy" },
  { key: "recent", label: "Recently active" },
  { key: "weak", label: "Lowest accuracy" },
  { key: "nudge", label: "Needs a nudge" },
];

// "Needs a nudge" = a learner who was genuinely engaged (>= minAnswers) but has
// gone quiet for >= quietDays. Admin-side signal only — it never becomes an
// in-app message to the learner (never-punish philosophy). Thresholds are
// admin-tunable and DB-persisted (Nudge settings control below); these are just
// the fallback defaults until the saved values load.
const DEFAULT_NUDGE = { minAnswers: 20, quietDays: 7 };
const DAY_MS = 86400000;
const daysQuiet = (u) => (u.lastActive ? Math.floor(sinceMs(u.lastActive) / DAY_MS) : null);
const needsNudge = (u, cfg) => u.answers >= cfg.minAnswers && u.lastActive && daysQuiet(u) >= cfg.quietDays;

function LearnersList({ onOpenUser, cfg, onSaveCfg }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("active");

  // Inline "Nudge settings" panel.
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [draftDays, setDraftDays] = useState(cfg.quietDays);
  const [draftAnswers, setDraftAnswers] = useState(cfg.minAnswers);
  const [saving, setSaving] = useState(false);
  const [saveErr, setSaveErr] = useState("");

  useEffect(() => {
    adminFetch("/api/admin/progress/users").then(setData).catch((e) => setError(e.message));
  }, []);

  // Keep the drafts in sync when the saved config loads/changes while closed.
  useEffect(() => {
    if (!settingsOpen) {
      setDraftDays(cfg.quietDays);
      setDraftAnswers(cfg.minAnswers);
    }
  }, [cfg, settingsOpen]);

  const rows = useMemo(() => {
    const list = data?.learners || [];
    const q = search.trim().toLowerCase();
    const filtered = q
      ? list.filter((u) => (u.username || "").toLowerCase().includes(q) || (u.email || "").toLowerCase().includes(q))
      : list;
    const sorted = [...filtered];
    sorted.sort((a, b) => {
      if (sort === "accuracy") return (b.accuracyPct ?? -1) - (a.accuracyPct ?? -1);
      if (sort === "weak") return (a.accuracyPct ?? 101) - (b.accuracyPct ?? 101);
      if (sort === "recent") return sinceMs(a.lastActive) - sinceMs(b.lastActive);
      if (sort === "nudge") {
        const na = needsNudge(a, cfg), nb = needsNudge(b, cfg);
        if (na !== nb) return na ? -1 : 1; // flagged learners first
        if (na && nb) return daysQuiet(b) - daysQuiet(a); // most stale first
        return b.answers - a.answers;
      }
      return b.answers - a.answers;
    });
    return sorted;
  }, [data, search, sort, cfg]);

  const saveSettings = async () => {
    setSaving(true);
    setSaveErr("");
    try {
      await onSaveCfg({ minAnswers: Number(draftAnswers), quietDays: Number(draftDays) });
      setSettingsOpen(false);
    } catch (e) {
      setSaveErr(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (error) return <p style={styles.error}>{error}</p>;
  if (!data) return <p style={{ color: c.body }}>Loading…</p>;

  const nudgeCount = (data.learners || []).filter((u) => needsNudge(u, cfg)).length;
  const draftValid = Number(draftDays) >= 1 && Number(draftAnswers) >= 1;

  return (
    <div>
      <input
        style={styles.searchBox}
        placeholder="Search learners by username or email…"
        aria-label="Search learners"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div style={styles.sortRow}>
        <span style={styles.sortLbl}>Sort:</span>
        {LEARNER_SORTS.map((s) => (
          <button
            key={s.key}
            className="rj"
            style={{ ...styles.chip, ...(sort === s.key ? styles.chipActive : {}) }}
            onClick={() => setSort(s.key)}
          >
            {s.label}
          </button>
        ))}
        <button
          className="rj"
          style={{ ...styles.settingsBtn, ...(settingsOpen ? styles.settingsBtnActive : {}) }}
          onClick={() => setSettingsOpen((o) => !o)}
          title="Adjust the 'needs a nudge' thresholds"
        >
          <SlidersHorizontal size={13} /> Nudge settings
        </button>
      </div>

      {settingsOpen && (
        <div style={styles.settingsPanel}>
          <div style={styles.settingsTitle}>“Needs a nudge” thresholds</div>
          <div style={styles.settingsGrid}>
            <label style={styles.settingsField}>
              <span style={styles.settingsLbl}>Quiet for at least (days)</span>
              <input type="number" min="1" max="365" style={styles.numInput} value={draftDays} onChange={(e) => setDraftDays(e.target.value)} />
            </label>
            <label style={styles.settingsField}>
              <span style={styles.settingsLbl}>After at least (answers)</span>
              <input type="number" min="1" max="100000" style={styles.numInput} value={draftAnswers} onChange={(e) => setDraftAnswers(e.target.value)} />
            </label>
          </div>
          <p style={styles.settingsHint}>
            Flags learners who answered ≥ {Number(draftAnswers) || "—"} questions but have gone quiet for ≥ {Number(draftDays) || "—"} days. Saved for all admins.
          </p>
          {saveErr && <p style={styles.error}>{saveErr}</p>}
          <div style={styles.settingsActions}>
            <button className="rj" style={{ ...styles.saveBtn, ...(saving || !draftValid ? styles.btnDisabled : {}) }} disabled={saving || !draftValid} onClick={saveSettings}>
              {saving ? "Saving…" : "Save"}
            </button>
            <button className="rj" style={styles.cancelBtn} disabled={saving} onClick={() => { setSettingsOpen(false); setSaveErr(""); }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {nudgeCount > 0 && (
        <button className="rj" style={styles.nudgeNote} onClick={() => setSort("nudge")}>
          <BellOff size={13} />
          {nudgeCount} {nudgeCount === 1 ? "learner was" : "learners were"} active but have gone quiet for {cfg.quietDays}+ days — could use a nudge.
        </button>
      )}

      <div style={styles.uHead}>
        <div>Learner</div>
        <div>Answers</div>
        <div>Accuracy</div>
        <div>Languages</div>
        <div>Last active</div>
      </div>
      {rows.length === 0 && <p style={styles.muted}>{(data.learners || []).length ? "No learners match." : "No learner activity yet."}</p>}
      {rows.map((u) => (
        <button key={u.userId} className="rj" style={styles.uRow} onClick={() => onOpenUser(u.userId)}>
          <div style={{ minWidth: 0 }}>
            <div style={styles.uName}>
              {u.username || shortId(u.userId)}
              {u.isAdmin && <span style={styles.adminTag}>admin</span>}
            </div>
            <div style={styles.uEmail}>{u.email || "—"}</div>
          </div>
          <div style={styles.uCell}>{num(u.answers)}</div>
          <div style={{ ...styles.uCell, color: accColor(u.accuracyPct), fontWeight: 700 }}>{pct(u.accuracyPct)}</div>
          <div style={styles.uCell}>{num(u.tracksPlayed)}</div>
          {needsNudge(u, cfg) ? (
            <div style={styles.nudgeCell} title={`Was active, quiet for ${daysQuiet(u)} days`}>
              <BellOff size={12} />
              quiet {daysQuiet(u)}d
            </div>
          ) : (
            <div style={{ ...styles.uCell, color: c.muted }}>{timeAgo(u.lastActive)}</div>
          )}
        </button>
      ))}
    </div>
  );
}

// ---- track view -------------------------------------------------------------

function TrackView({ trackId, onBack, onOpenUser }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setData(null);
    setError("");
    adminFetch(`/api/admin/progress/track?trackId=${encodeURIComponent(trackId)}`)
      .then(setData)
      .catch((e) => setError(e.message));
  }, [trackId]);

  return (
    <div>
      <BackBar onBack={onBack} label="All languages" />
      {error && <p style={styles.error}>{error}</p>}
      {!data && !error && <p style={{ color: c.body }}>Loading…</p>}
      {data && (
        <>
          <h2 style={styles.h2}>
            {data.label}
            {data.totalItems ? <span style={styles.h2sub}>{num(data.totalItems)} items</span> : null}
          </h2>

          <SectionHeader title="Accuracy by category" />
          {(data.categories || []).length === 0 && <p style={styles.muted}>No answers logged for this language yet.</p>}
          {(data.categories || []).map((cat) => (
            <div key={cat.cat} style={styles.catRow}>
              <div style={styles.catName}>{cat.cat}</div>
              <div style={{ flex: 1 }}>
                <Bar pct={cat.accuracyPct} />
              </div>
              <div style={{ ...styles.catPct, color: accColor(cat.accuracyPct) }}>{pct(cat.accuracyPct)}</div>
              <div style={styles.catMeta}>{num(cat.answers)} ans · {num(cat.learners)} ppl</div>
            </div>
          ))}

          <SectionHeader icon={TriangleAlert} color={c.red} title="Hardest items" />
          <p style={styles.sectionSub}>Lowest accuracy first (min {data.thresholds?.minItemAnswers} answers).</p>
          {(data.worstItems || []).length === 0 && <p style={styles.muted}>Nothing flagged yet.</p>}
          {(data.worstItems || []).map((it, i) => (
            <div key={i} style={styles.itemRow}>
              <div style={{ ...styles.accPill, color: accColor(it.accuracyPct), borderColor: accColor(it.accuracyPct) }}>
                {pct(it.accuracyPct)}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={styles.attnPrompt}>{it.prompt}</div>
                <div style={styles.attnMeta}>{it.cat} · {num(it.answers)} answers · {num(it.learners)} learners</div>
              </div>
            </div>
          ))}

          <SectionHeader title={`Learners (${(data.learners || []).length})`} />
          {(data.learners || []).length === 0 && <p style={styles.muted}>No one has started this language yet.</p>}
          {(data.learners || []).map((u) => (
            <button key={u.userId} className="rj" style={styles.learnerRow} onClick={() => onOpenUser(u.userId)}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={styles.learnerName}>{u.username || shortId(u.userId)}</div>
                <div style={styles.attnMeta}>
                  {num(u.answers)} answers · {SKILL_LABEL[u.skillLevel] || u.skillLevel} · streak {num(u.streak)} · last {timeAgo(u.lastActivity || u.lastPlayed)}
                </div>
              </div>
              <div style={styles.learnerStats}>
                <div style={{ color: accColor(u.accuracyPct), fontWeight: 700 }}>{pct(u.accuracyPct)}</div>
                <div style={styles.coverageMini}>
                  <Bar pct={u.coveragePct} color={c.purple} />
                  <span style={styles.coverageTxt}>{u.coveragePct === null ? "—" : `${u.coveragePct}% seen`}</span>
                </div>
              </div>
            </button>
          ))}
        </>
      )}
    </div>
  );
}

// ---- user view --------------------------------------------------------------

function UserView({ userId, onBack }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setData(null);
    setError("");
    adminFetch(`/api/admin/progress/user?userId=${encodeURIComponent(userId)}`)
      .then(setData)
      .catch((e) => setError(e.message));
  }, [userId]);

  return (
    <div>
      <BackBar onBack={onBack} label="Back" />
      {error && <p style={styles.error}>{error}</p>}
      {!data && !error && <p style={{ color: c.body }}>Loading…</p>}
      {data && (
        <>
          <h2 style={styles.h2}>
            {data.username || "(no username)"}
            {data.isAdmin && <span style={{ ...styles.h2sub, color: c.purple }}>admin</span>}
          </h2>
          <div style={styles.userMeta}>
            <span>{data.email || "—"}</span>
            <span>· joined {data.createdAt ? new Date(data.createdAt).toLocaleDateString() : "—"}</span>
            <span>· last sign-in {data.lastSignInAt ? timeAgo(data.lastSignInAt) : "never"}</span>
          </div>
          <div style={styles.tileGrid}>
            <div style={styles.tile}>
              <div style={{ ...styles.tileValue, color: c.purple }}>{num(data.totals?.xp)}</div>
              <div style={styles.tileLabel}>Total XP</div>
            </div>
            <div style={styles.tile}>
              <div style={{ ...styles.tileValue, color: c.body }}>{num(data.totals?.answers)}</div>
              <div style={styles.tileLabel}>Answers</div>
            </div>
            <div style={styles.tile}>
              <div style={{ ...styles.tileValue, color: c.green }}>{num(data.totals?.bestStreak)}</div>
              <div style={styles.tileLabel}>Best streak</div>
            </div>
            <div style={styles.tile}>
              <div style={{ ...styles.tileValue, color: c.body }}>{num((data.tracks || []).length)}</div>
              <div style={styles.tileLabel}>Languages</div>
            </div>
          </div>

          <SectionHeader title="Per language" />
          {(data.tracks || []).length === 0 && <p style={styles.muted}>This learner hasn't played anything yet.</p>}
          {(data.tracks || []).map((tr) => (
            <div key={tr.trackId} style={styles.userTrackCard}>
              <div style={styles.userTrackHead}>
                <span style={styles.trackName}>{tr.label}</span>
                <span style={{ color: accColor(tr.accuracyPct), fontWeight: 700, fontSize: 13 }}>{pct(tr.accuracyPct)} acc.</span>
              </div>
              <div style={styles.userTrackStats}>
                Lv {num(tr.level)} · {SKILL_LABEL[tr.skillLevel] || tr.skillLevel} · {num(tr.xp)} XP · streak {num(tr.streak)} ·
                {" "}{num(tr.answers)} answers · {num(tr.roundsCompleted)} rounds · last {timeAgo(tr.lastActivity || tr.lastPlayed)}
              </div>
              <div style={styles.coverageRow}>
                <span style={styles.coverageLabel}>Coverage</span>
                <div style={{ flex: 1 }}>
                  <Bar pct={tr.coveragePct} color={c.purple} />
                </div>
                <span style={styles.coverageTxt}>
                  {tr.coveragePct === null ? "—" : `${tr.coveragePct}%`} ({num(tr.itemsSeen)}
                  {tr.totalItems ? `/${num(tr.totalItems)}` : ""} seen)
                  {tr.itemsMissed ? `, ${num(tr.itemsMissed)} in review` : ""}
                </span>
              </div>
              {(tr.categories || []).length > 0 && (
                <div style={styles.userCats}>
                  {tr.categories.map((cat) => (
                    <div key={cat.cat} style={styles.userCatRow}>
                      <span style={styles.userCatName}>{cat.cat}</span>
                      <div style={{ flex: 1 }}>
                        <Bar pct={cat.accuracyPct} />
                      </div>
                      <span style={{ color: accColor(cat.accuracyPct), fontSize: 11.5, width: 38, textAlign: "right" }}>
                        {pct(cat.accuracyPct)}
                      </span>
                      <span style={{ color: c.muted, fontSize: 11, width: 60, textAlign: "right" }}>{num(cat.answers)} ans</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

// ---- small shared bits ------------------------------------------------------

function ModeButton({ icon: Icon, label, active, onClick }) {
  return (
    <button className="rj" style={{ ...styles.modeBtn, ...(active ? styles.modeBtnActive : {}) }} onClick={onClick}>
      <Icon size={14} />
      {label}
    </button>
  );
}

function SectionHeader({ icon: Icon, color, title }) {
  return (
    <div style={styles.sectionHeader}>
      {Icon && <Icon size={15} color={color || c.body} />}
      <span>{title}</span>
    </div>
  );
}

function BackBar({ onBack, label }) {
  return (
    <button className="rj" style={styles.backBtn} onClick={onBack}>
      <ChevronLeft size={15} /> {label}
    </button>
  );
}

function shortId(id) {
  return id ? `user ${id.slice(0, 8)}` : "unknown";
}

const styles = {
  error: { color: c.red, fontSize: 13.5, margin: "8px 0" },
  muted: { color: c.muted, fontSize: 12.5, margin: "8px 0" },
  emptyNote: { color: c.body, fontSize: 12.5, background: c.cardInner, border: `1px solid ${c.border}`, borderRadius: 10, padding: "10px 12px", marginBottom: 16, lineHeight: 1.5 },

  modeBar: { display: "flex", gap: 8, marginBottom: 18 },
  modeBtn: {
    display: "flex", alignItems: "center", gap: 6, background: c.card, color: c.body, border: `1px solid ${c.border}`,
    borderRadius: 999, padding: "7px 16px", fontSize: 12.5, fontWeight: 700, cursor: "pointer",
  },
  modeBtnActive: { background: c.purple, color: c.bg, borderColor: c.purple },

  tileGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 10, marginBottom: 6 },
  tile: { background: c.card, border: `1px solid ${c.border}`, borderRadius: 12, padding: "14px 14px" },
  tileValue: { fontSize: 23, fontWeight: 800, lineHeight: 1 },
  tileLabel: { color: c.body, fontSize: 11.5, marginTop: 6 },

  sectionHeader: { display: "flex", alignItems: "center", gap: 7, color: c.text, fontSize: 14, fontWeight: 700, margin: "24px 0 4px" },
  sectionSub: { color: c.muted, fontSize: 12, margin: "0 0 12px", lineHeight: 1.5 },

  attnGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 },
  attnColTitle: { color: c.body, fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 8 },
  attnItem: {
    display: "flex", gap: 10, alignItems: "center", width: "100%", textAlign: "left",
    background: c.card, border: `1px solid ${c.border}`, borderRadius: 10, padding: "9px 11px", marginBottom: 7, cursor: "pointer",
  },
  accPill: { flexShrink: 0, minWidth: 44, textAlign: "center", fontSize: 12.5, fontWeight: 800, border: "1px solid", borderRadius: 7, padding: "3px 4px" },
  attnPrompt: { color: c.text, fontSize: 12.5, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  attnMeta: { color: c.muted, fontSize: 11, marginTop: 2 },

  chartWrap: { background: c.card, border: `1px solid ${c.border}`, borderRadius: 12, padding: "12px 12px 8px" },
  chartAxis: { display: "flex", justifyContent: "space-between", color: c.muted, fontSize: 10.5, marginTop: 4 },

  trackTable: { display: "flex", flexDirection: "column", gap: 6, marginTop: 6 },
  trackRow: {
    display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1.2fr", alignItems: "center", gap: 8,
    background: c.card, border: `1px solid ${c.border}`, borderRadius: 10, padding: "11px 13px", cursor: "pointer", textAlign: "left", width: "100%",
  },
  trackHead: { background: "transparent", border: "none", padding: "2px 13px", cursor: "default" },
  tCell: { color: c.body, fontSize: 12.5 },
  tCellName: { display: "flex", flexDirection: "column", gap: 2, minWidth: 0 },
  trackName: { color: c.text, fontSize: 13.5, fontWeight: 700 },
  trackItems: { color: c.muted, fontSize: 10.5 },

  // learners list
  searchBox: {
    width: "100%", boxSizing: "border-box", background: c.card, border: `1px solid ${c.border}`,
    borderRadius: 10, color: c.text, fontSize: 14, padding: "11px 14px", marginBottom: 12,
  },
  sortRow: { display: "flex", gap: 8, alignItems: "center", marginBottom: 12, flexWrap: "wrap" },
  sortLbl: { color: c.muted, fontSize: 11.5 },
  chip: { background: c.card, color: c.body, border: `1px solid ${c.border}`, borderRadius: 999, padding: "5px 12px", fontSize: 11.5, fontWeight: 600, cursor: "pointer" },
  chipActive: { background: c.pink, color: c.bg, borderColor: c.pink },
  nudgeNote: {
    display: "flex", alignItems: "center", gap: 7, width: "100%", textAlign: "left", cursor: "pointer",
    background: "rgba(255,196,107,0.1)", color: c.amber, border: `1px solid ${c.amber}`,
    borderRadius: 10, padding: "9px 12px", fontSize: 12, fontWeight: 600, marginBottom: 12, lineHeight: 1.4,
  },
  nudgeCell: { display: "flex", alignItems: "center", gap: 4, color: c.amber, fontSize: 12, fontWeight: 700 },
  settingsBtn: {
    display: "inline-flex", alignItems: "center", gap: 5, marginLeft: "auto", background: c.cardInner, color: c.body,
    border: `1px solid ${c.border}`, borderRadius: 999, padding: "5px 12px", fontSize: 11.5, fontWeight: 600, cursor: "pointer",
  },
  settingsBtnActive: { background: c.purple, color: c.bg, borderColor: c.purple },
  settingsPanel: { background: c.card, border: `1px solid ${c.border}`, borderRadius: 12, padding: "14px 15px", marginBottom: 12 },
  settingsTitle: { color: c.text, fontSize: 13, fontWeight: 700, marginBottom: 10 },
  settingsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 },
  settingsField: { display: "flex", flexDirection: "column", gap: 5 },
  settingsLbl: { color: c.body, fontSize: 11.5, fontWeight: 600 },
  numInput: {
    boxSizing: "border-box", background: c.cardInner, border: `1px solid ${c.border}`, borderRadius: 8,
    color: c.text, fontSize: 14, padding: "9px 12px", width: "100%",
  },
  settingsHint: { color: c.muted, fontSize: 11.5, margin: "10px 0 0", lineHeight: 1.5 },
  settingsActions: { display: "flex", gap: 8, marginTop: 12 },
  saveBtn: { background: c.pink, color: c.bg, border: "none", borderRadius: 8, padding: "8px 18px", fontSize: 12.5, fontWeight: 700, cursor: "pointer" },
  cancelBtn: { background: c.cardInner, color: c.body, border: `1px solid ${c.border}`, borderRadius: 8, padding: "8px 16px", fontSize: 12.5, fontWeight: 700, cursor: "pointer" },
  btnDisabled: { opacity: 0.5, cursor: "not-allowed" },
  uHead: { display: "grid", gridTemplateColumns: "2.2fr 1fr 1fr 1fr 1.1fr", gap: 8, padding: "2px 13px", color: c.muted, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.3 },
  uRow: {
    display: "grid", gridTemplateColumns: "2.2fr 1fr 1fr 1fr 1.1fr", alignItems: "center", gap: 8, background: c.card,
    border: `1px solid ${c.border}`, borderRadius: 10, padding: "11px 13px", cursor: "pointer", textAlign: "left", width: "100%", marginBottom: 7,
  },
  uName: { color: c.text, fontSize: 13.5, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 },
  uEmail: { color: c.muted, fontSize: 11, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  uCell: { color: c.body, fontSize: 12.5 },
  adminTag: { fontSize: 9.5, fontWeight: 700, color: c.purple, background: "rgba(185,142,255,0.15)", padding: "2px 6px", borderRadius: 999, textTransform: "uppercase" },

  h2: { color: c.text, fontSize: 18, fontWeight: 700, margin: "14px 0 4px", display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" },
  h2sub: { color: c.muted, fontSize: 12, fontWeight: 600 },
  userMeta: { color: c.muted, fontSize: 12, display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 },

  catRow: { display: "flex", alignItems: "center", gap: 10, padding: "6px 0" },
  catName: { color: c.body, fontSize: 12.5, width: 74, flexShrink: 0, fontWeight: 600 },
  catPct: { fontSize: 12.5, fontWeight: 700, width: 44, textAlign: "right" },
  catMeta: { color: c.muted, fontSize: 11, width: 118, textAlign: "right", flexShrink: 0 },

  barTrack: { height: 8, background: c.cardInner, borderRadius: 999, overflow: "hidden", border: `1px solid ${c.border}` },
  barFill: { height: "100%", borderRadius: 999 },

  itemRow: {
    display: "flex", gap: 10, alignItems: "center", background: c.card, border: `1px solid ${c.border}`,
    borderRadius: 10, padding: "9px 11px", marginBottom: 7,
  },

  learnerRow: {
    display: "flex", gap: 12, alignItems: "center", width: "100%", textAlign: "left",
    background: c.card, border: `1px solid ${c.border}`, borderRadius: 10, padding: "11px 13px", marginBottom: 7, cursor: "pointer",
  },
  learnerName: { color: c.text, fontSize: 13.5, fontWeight: 700 },
  learnerStats: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, minWidth: 120 },
  coverageMini: { display: "flex", alignItems: "center", gap: 6, width: 120 },
  coverageTxt: { color: c.muted, fontSize: 10.5, whiteSpace: "nowrap" },

  userTrackCard: { background: c.card, border: `1px solid ${c.border}`, borderRadius: 12, padding: "13px 14px", marginBottom: 10 },
  userTrackHead: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 },
  userTrackStats: { color: c.body, fontSize: 11.5, marginTop: 5, lineHeight: 1.5 },
  coverageRow: { display: "flex", alignItems: "center", gap: 10, marginTop: 10 },
  coverageLabel: { color: c.muted, fontSize: 11, width: 60, flexShrink: 0 },
  userCats: { marginTop: 10, paddingTop: 10, borderTop: `1px solid ${c.border}`, display: "flex", flexDirection: "column", gap: 5 },
  userCatRow: { display: "flex", alignItems: "center", gap: 8 },
  userCatName: { color: c.body, fontSize: 11.5, width: 60, flexShrink: 0 },

  backBtn: {
    display: "inline-flex", alignItems: "center", gap: 4, background: "transparent", color: c.pink,
    border: `1px solid ${c.pink}`, borderRadius: 8, padding: "6px 12px", fontSize: 12.5, fontWeight: 700, cursor: "pointer", marginBottom: 12,
  },
};

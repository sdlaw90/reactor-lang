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

// ---- inline translations ----------------------------------------------------

const T = {
  en: {
    overview: "Overview",
    learners: "Learners",
    loading: "Loading…",

    // overview tiles
    tileLearners: "Learners",
    tileAnswersLogged: "Answers logged",
    tileOverallAccuracy: "Overall accuracy",
    tileActive7d: "Active last 7d",
    tileActive30d: "Active last 30d",

    emptyNote:
      "No answered questions have been logged yet, so most panels below are empty. They fill in as beta users play.",

    needsAttention: "Needs attention",
    needsAttentionSub: (mi, mc) =>
      `Lowest-accuracy items and categories across all learners (min ${mi}/${mc} answers). A single item everyone gets wrong is often a broken answer key or a confusing distractor.`,
    hardestItems: "Hardest items",
    nothingFlagged: "Nothing flagged yet.",
    openThisLanguage: "Open this language",
    weakestCategories: "Weakest categories",
    attnItemMeta: (label, cat, answers, learners) =>
      `${label} · ${cat} · ${answers} answers · ${learners} learners`,
    attnCatMeta: (answers, learners) => `${answers} answers · ${learners} learners`,

    activityTitle: (days) => `Activity — last ${days} days`,
    noActivityWindow: "No activity in this window yet.",
    chartAria: "Answers logged per day over the last 30 days",
    chartBarTitle: (day, answers, active) => `${day}: ${answers} answers, ${active} active`,
    peakPerDay: (n) => `peak ${n}/day`,

    languages: "Languages",
    thLanguage: "Language",
    thLearners: "Learners",
    thAnswers: "Answers",
    thAccuracy: "Accuracy",
    thLastActive: "Last active",
    noTrackActivity: "No track activity yet.",
    itemsCount: (n) => `${n} items`,

    // learner sorts
    sortActive: "Most active",
    sortAccuracy: "Highest accuracy",
    sortRecent: "Recently active",
    sortWeak: "Lowest accuracy",
    sortNudge: "Needs a nudge",

    searchPlaceholder: "Search learners by username or email…",
    searchAria: "Search learners",
    sortLabel: "Sort:",
    nudgeSettingsTitleAttr: "Adjust the 'needs a nudge' thresholds",
    nudgeSettings: "Nudge settings",
    nudgeThresholdsTitle: "“Needs a nudge” thresholds",
    quietForDays: "Quiet for at least (days)",
    afterAnswers: "After at least (answers)",
    settingsHint: (a, d) =>
      `Flags learners who answered ≥ ${a} questions but have gone quiet for ≥ ${d} days. Saved for all admins.`,
    saving: "Saving…",
    save: "Save",
    cancel: "Cancel",
    nudgeNote: (count, days) =>
      `${count} ${count === 1 ? "learner was" : "learners were"} active but have gone quiet for ${days}+ days — could use a nudge.`,

    uhLearner: "Learner",
    uhAnswers: "Answers",
    uhAccuracy: "Accuracy",
    uhLanguages: "Languages",
    uhLastActive: "Last active",
    noLearnersMatch: "No learners match.",
    noLearnerActivity: "No learner activity yet.",
    quietTitle: (days) => `Was active, quiet for ${days} days`,
    quietBadge: (days) => `quiet ${days}d`,

    // track view
    allLanguages: "All languages",
    accuracyByCategory: "Accuracy by category",
    noAnswersLang: "No answers logged for this language yet.",
    catMetaAnsPpl: (ans, ppl) => `${ans} ans · ${ppl} ppl`,
    hardestSub: (min) => `Lowest accuracy first (min ${min} answers).`,
    itemMetaCat: (cat, ans, learners) => `${cat} · ${ans} answers · ${learners} learners`,
    learnersCount: (n) => `Learners (${n})`,
    noOneStarted: "No one has started this language yet.",
    learnerMeta: (ans, skill, streak, last) =>
      `${ans} answers · ${skill} · streak ${streak} · last ${last}`,
    pctSeen: (p) => `${p}% seen`,

    // user view
    back: "Back",
    noUsername: "(no username)",
    joined: (date) => `· joined ${date}`,
    lastSignIn: (val) => `· last sign-in ${val}`,
    never: "never",
    tileTotalXP: "Total XP",
    tileAnswers: "Answers",
    tileBestStreak: "Best streak",
    tileLanguages: "Languages",
    perLanguage: "Per language",
    notPlayedYet: "This learner hasn't played anything yet.",
    accSuffix: (p) => `${p} acc.`,
    userTrackStats: (level, skill, xp, streak, answers, rounds, last) =>
      `Lv ${level} · ${skill} · ${xp} XP · streak ${streak} · ${answers} answers · ${rounds} rounds · last ${last}`,
    coverage: "Coverage",
    coverageDetail: (pctStr, itemsSeen, totalItems, itemsMissed) =>
      `${pctStr} (${num(itemsSeen)}${totalItems ? `/${num(totalItems)}` : ""} seen)${itemsMissed ? `, ${num(itemsMissed)} in review` : ""}`,
    userCatAns: (n) => `${n} ans`,

    // skill levels
    skillLabel: { none: "No exp.", beginner: "Beginner", intermediate: "Intermediate", expert: "Advanced", native: "Native" },

    // time-ago
    timeJustNow: "just now",
    timeMins: (n) => `${n}m ago`,
    timeHrs: (n) => `${n}h ago`,
    timeDays: (n) => `${n}d ago`,
    timeMonths: (n) => `${n}mo ago`,
    timeYears: (n) => `${n}y ago`,

    // short id
    userShort: (id) => `user ${id}`,
    unknown: "unknown",
  },
  es: {
    overview: "Resumen",
    learners: "Estudiantes",
    loading: "Cargando…",

    // overview tiles
    tileLearners: "Estudiantes",
    tileAnswersLogged: "Respuestas registradas",
    tileOverallAccuracy: "Precisión general",
    tileActive7d: "Activos últimos 7d",
    tileActive30d: "Activos últimos 30d",

    emptyNote:
      "Aún no se han registrado preguntas respondidas, así que la mayoría de los paneles de abajo están vacíos. Se van llenando a medida que los usuarios beta juegan.",

    needsAttention: "Requiere atención",
    needsAttentionSub: (mi, mc) =>
      `Ítems y categorías con menor precisión entre todos los estudiantes (mín. ${mi}/${mc} respuestas). Un solo ítem que todos responden mal suele ser una clave de respuesta rota o un distractor confuso.`,
    hardestItems: "Ítems más difíciles",
    nothingFlagged: "Nada marcado todavía.",
    openThisLanguage: "Abrir este idioma",
    weakestCategories: "Categorías más débiles",
    attnItemMeta: (label, cat, answers, learners) =>
      `${label} · ${cat} · ${answers} respuestas · ${learners} estudiantes`,
    attnCatMeta: (answers, learners) => `${answers} respuestas · ${learners} estudiantes`,

    activityTitle: (days) => `Actividad — últimos ${days} días`,
    noActivityWindow: "Aún no hay actividad en esta ventana.",
    chartAria: "Respuestas registradas por día en los últimos 30 días",
    chartBarTitle: (day, answers, active) => `${day}: ${answers} respuestas, ${active} activos`,
    peakPerDay: (n) => `pico ${n}/día`,

    languages: "Idiomas",
    thLanguage: "Idioma",
    thLearners: "Estudiantes",
    thAnswers: "Respuestas",
    thAccuracy: "Precisión",
    thLastActive: "Última actividad",
    noTrackActivity: "Aún no hay actividad de idiomas.",
    itemsCount: (n) => `${n} ítems`,

    // learner sorts
    sortActive: "Más activos",
    sortAccuracy: "Mayor precisión",
    sortRecent: "Activos recientemente",
    sortWeak: "Menor precisión",
    sortNudge: "Necesita un empujón",

    searchPlaceholder: "Busca estudiantes por nombre de usuario o correo…",
    searchAria: "Buscar estudiantes",
    sortLabel: "Ordenar:",
    nudgeSettingsTitleAttr: "Ajusta los umbrales de 'necesita un empujón'",
    nudgeSettings: "Ajustes de empujón",
    nudgeThresholdsTitle: "Umbrales de “necesita un empujón”",
    quietForDays: "Inactivo al menos (días)",
    afterAnswers: "Después de al menos (respuestas)",
    settingsHint: (a, d) =>
      `Marca a los estudiantes que respondieron ≥ ${a} preguntas pero llevan inactivos ≥ ${d} días. Se guarda para todos los admins.`,
    saving: "Guardando…",
    save: "Guardar",
    cancel: "Cancelar",
    nudgeNote: (count, days) =>
      `${count} ${count === 1 ? "estudiante estuvo activo pero lleva" : "estudiantes estuvieron activos pero llevan"} ${days}+ días inactivo${count === 1 ? "" : "s"} — les vendría bien un empujón.`,

    uhLearner: "Estudiante",
    uhAnswers: "Respuestas",
    uhAccuracy: "Precisión",
    uhLanguages: "Idiomas",
    uhLastActive: "Última actividad",
    noLearnersMatch: "Ningún estudiante coincide.",
    noLearnerActivity: "Aún no hay actividad de estudiantes.",
    quietTitle: (days) => `Estuvo activo, inactivo por ${days} días`,
    quietBadge: (days) => `inactivo ${days}d`,

    // track view
    allLanguages: "Todos los idiomas",
    accuracyByCategory: "Precisión por categoría",
    noAnswersLang: "Aún no hay respuestas registradas para este idioma.",
    catMetaAnsPpl: (ans, ppl) => `${ans} resp · ${ppl} pers`,
    hardestSub: (min) => `Menor precisión primero (mín. ${min} respuestas).`,
    itemMetaCat: (cat, ans, learners) => `${cat} · ${ans} respuestas · ${learners} estudiantes`,
    learnersCount: (n) => `Estudiantes (${n})`,
    noOneStarted: "Nadie ha comenzado este idioma todavía.",
    learnerMeta: (ans, skill, streak, last) =>
      `${ans} respuestas · ${skill} · racha ${streak} · última ${last}`,
    pctSeen: (p) => `${p}% visto`,

    // user view
    back: "Volver",
    noUsername: "(sin nombre de usuario)",
    joined: (date) => `· se unió ${date}`,
    lastSignIn: (val) => `· último inicio de sesión ${val}`,
    never: "nunca",
    tileTotalXP: "XP total",
    tileAnswers: "Respuestas",
    tileBestStreak: "Mejor racha",
    tileLanguages: "Idiomas",
    perLanguage: "Por idioma",
    notPlayedYet: "Este estudiante aún no ha jugado nada.",
    accSuffix: (p) => `${p} prec.`,
    userTrackStats: (level, skill, xp, streak, answers, rounds, last) =>
      `Nv ${level} · ${skill} · ${xp} XP · racha ${streak} · ${answers} respuestas · ${rounds} rondas · última ${last}`,
    coverage: "Cobertura",
    coverageDetail: (pctStr, itemsSeen, totalItems, itemsMissed) =>
      `${pctStr} (${num(itemsSeen)}${totalItems ? `/${num(totalItems)}` : ""} visto)${itemsMissed ? `, ${num(itemsMissed)} en repaso` : ""}`,
    userCatAns: (n) => `${n} resp`,

    // skill levels
    skillLabel: { none: "Sin exp.", beginner: "Principiante", intermediate: "Intermedio", expert: "Avanzado", native: "Nativo" },

    // time-ago
    timeJustNow: "hace un momento",
    timeMins: (n) => `hace ${n}m`,
    timeHrs: (n) => `hace ${n}h`,
    timeDays: (n) => `hace ${n}d`,
    timeMonths: (n) => `hace ${n}mes`,
    timeYears: (n) => `hace ${n}a`,

    // short id
    userShort: (id) => `usuario ${id}`,
    unknown: "desconocido",
  },
};

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

function timeAgo(iso, lang = "en") {
  const t = T[lang] || T.en;
  if (!iso) return t.never;
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 0) return t.timeJustNow;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return t.timeJustNow;
  if (mins < 60) return t.timeMins(mins);
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return t.timeHrs(hrs);
  const days = Math.floor(hrs / 24);
  if (days < 30) return t.timeDays(days);
  const months = Math.floor(days / 30);
  if (months < 12) return t.timeMonths(months);
  return t.timeYears(Math.floor(months / 12));
}
// milliseconds since an ISO time, or Infinity when absent (sorts "never" last).
const sinceMs = (iso) => (iso ? Date.now() - new Date(iso).getTime() : Infinity);

function Bar({ pct: p, color }) {
  const width = p === null || p === undefined ? 0 : Math.max(0, Math.min(100, p));
  return (
    <div style={styles.barTrack} aria-hidden="true">
      <div style={{ ...styles.barFill, width: `${width}%`, background: color || accColor(p) }} />
    </div>
  );
}

// ---- root -------------------------------------------------------------------

export default function ProgressSection({ lang = "en" }) {
  // root = which top toggle is selected ('overview' | 'learners').
  // view = what's actually shown; drilldowns keep the root highlighted.
  const t = T[lang] || T.en;
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
        <ModeButton icon={TrendingUp} label={t.overview} active={root === "overview"} onClick={() => selectRoot("overview")} />
        <ModeButton icon={Users} label={t.learners} active={root === "learners"} onClick={() => selectRoot("learners")} />
      </div>

      {view.name === "overview" && <Overview lang={lang} onOpenTrack={(trackId) => setView({ name: "track", trackId })} />}
      {view.name === "learners" && (
        <LearnersList
          lang={lang}
          cfg={nudgeCfg}
          onSaveCfg={saveNudgeCfg}
          onOpenUser={(userId) => setView({ name: "user", userId, from: { name: "learners" } })}
        />
      )}
      {view.name === "track" && (
        <TrackView
          lang={lang}
          trackId={view.trackId}
          onBack={() => setView({ name: "overview" })}
          onOpenUser={(userId) => setView({ name: "user", userId, from: { name: "track", trackId: view.trackId } })}
        />
      )}
      {view.name === "user" && <UserView lang={lang} userId={view.userId} onBack={() => setView(view.from || { name: root })} />}
    </div>
  );
}

// ---- overview ---------------------------------------------------------------

function Overview({ onOpenTrack, lang = "en" }) {
  const t = T[lang] || T.en;
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminFetch("/api/admin/progress/overview").then(setData).catch((e) => setError(e.message));
  }, []);

  if (error) return <p style={styles.error}>{error}</p>;
  if (!data) return <p style={{ color: c.body }}>{t.loading}</p>;

  const tl = data.tiles;
  const tiles = tl
    ? [
        { label: t.tileLearners, value: num(tl.learners), color: c.green },
        { label: t.tileAnswersLogged, value: num(tl.totalAnswers), color: c.purple },
        { label: t.tileOverallAccuracy, value: pct(tl.overallAccuracy), color: accColor(tl.overallAccuracy) },
        { label: t.tileActive7d, value: num(tl.activeLast7Days), color: c.green },
        { label: t.tileActive30d, value: num(tl.activeLast30Days), color: c.body },
      ]
    : [];

  const hasData = tl && tl.totalAnswers > 0;

  return (
    <div>
      {!hasData && (
        <p style={styles.emptyNote}>{t.emptyNote}</p>
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
      <SectionHeader icon={TriangleAlert} color={c.red} title={t.needsAttention} />
      <p style={styles.sectionSub}>
        {t.needsAttentionSub(data.thresholds?.minItemAnswers, data.thresholds?.minCategoryAnswers)}
      </p>

      <div style={styles.attnGrid}>
        <div>
          <div style={styles.attnColTitle}>{t.hardestItems}</div>
          {(data.needsAttention?.items || []).length === 0 && <p style={styles.muted}>{t.nothingFlagged}</p>}
          {(data.needsAttention?.items || []).map((it, i) => (
            <button key={i} className="rj" style={styles.attnItem} onClick={() => onOpenTrack(it.trackId)} title={t.openThisLanguage}>
              <div style={{ ...styles.accPill, color: accColor(it.accuracyPct), borderColor: accColor(it.accuracyPct) }}>
                {pct(it.accuracyPct)}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={styles.attnPrompt}>{it.prompt}</div>
                <div style={styles.attnMeta}>
                  {t.attnItemMeta(it.label, it.cat, num(it.answers), num(it.learners))}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div>
          <div style={styles.attnColTitle}>{t.weakestCategories}</div>
          {(data.needsAttention?.categories || []).length === 0 && <p style={styles.muted}>{t.nothingFlagged}</p>}
          {(data.needsAttention?.categories || []).map((cat, i) => (
            <button key={i} className="rj" style={styles.attnItem} onClick={() => onOpenTrack(cat.trackId)} title={t.openThisLanguage}>
              <div style={{ ...styles.accPill, color: accColor(cat.accuracyPct), borderColor: accColor(cat.accuracyPct) }}>
                {pct(cat.accuracyPct)}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={styles.attnPrompt}>
                  {cat.label} — <span style={{ color: c.body }}>{cat.cat}</span>
                </div>
                <div style={styles.attnMeta}>
                  {t.attnCatMeta(num(cat.answers), num(cat.learners))}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Activity trend */}
      <SectionHeader icon={TrendingUp} color={c.purple} title={t.activityTitle(data.thresholds?.trendDays || 30)} />
      <ActivityChart lang={lang} trend={data.trend || []} />

      {/* Per-track table */}
      <SectionHeader title={t.languages} />
      <div style={styles.trackTable}>
        <div style={{ ...styles.trackRow, ...styles.trackHead }}>
          <div style={styles.tCellName}>{t.thLanguage}</div>
          <div style={styles.tCell}>{t.thLearners}</div>
          <div style={styles.tCell}>{t.thAnswers}</div>
          <div style={styles.tCell}>{t.thAccuracy}</div>
          <div style={styles.tCell}>{t.thLastActive}</div>
        </div>
        {(data.tracks || []).length === 0 && <p style={styles.muted}>{t.noTrackActivity}</p>}
        {(data.tracks || []).map((tr) => (
          <button key={tr.trackId} className="rj" style={styles.trackRow} onClick={() => onOpenTrack(tr.trackId)}>
            <div style={styles.tCellName}>
              <span style={styles.trackName}>{tr.label}</span>
              {tr.totalItems ? <span style={styles.trackItems}>{t.itemsCount(num(tr.totalItems))}</span> : null}
            </div>
            <div style={styles.tCell}>{num(tr.learners)}</div>
            <div style={styles.tCell}>{num(tr.answers)}</div>
            <div style={{ ...styles.tCell, color: accColor(tr.accuracyPct), fontWeight: 700 }}>{pct(tr.accuracyPct)}</div>
            <div style={{ ...styles.tCell, color: c.muted }}>{timeAgo(tr.lastActivity, lang)}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ActivityChart({ trend, lang = "en" }) {
  const t = T[lang] || T.en;
  const max = useMemo(() => Math.max(1, ...trend.map((d) => d.answers)), [trend]);
  if (!trend.length) return <p style={styles.muted}>{t.noActivityWindow}</p>;
  const W = 640, H = 120, pad = 6;
  const barW = (W - pad * 2) / trend.length;
  return (
    <div style={styles.chartWrap}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} role="img" aria-label={t.chartAria} preserveAspectRatio="none">
        <line x1={pad} y1={H - 16} x2={W - pad} y2={H - 16} stroke={c.border} strokeWidth="1" />
        {trend.map((d, i) => {
          const h = Math.round(((H - 26) * d.answers) / max);
          return (
            <rect key={i} x={pad + i * barW + barW * 0.15} y={H - 16 - h} width={barW * 0.7} height={h} rx="1.5" fill={c.purple} opacity={0.85}>
              <title>{t.chartBarTitle(d.day, d.answers, d.activeUsers)}</title>
            </rect>
          );
        })}
      </svg>
      <div style={styles.chartAxis}>
        <span>{trend[0]?.day}</span>
        <span>{t.peakPerDay(num(max))}</span>
        <span>{trend[trend.length - 1]?.day}</span>
      </div>
    </div>
  );
}

// ---- learners list (user-first entry point) ---------------------------------

const LEARNER_SORTS = [
  { key: "active", labelKey: "sortActive" },
  { key: "accuracy", labelKey: "sortAccuracy" },
  { key: "recent", labelKey: "sortRecent" },
  { key: "weak", labelKey: "sortWeak" },
  { key: "nudge", labelKey: "sortNudge" },
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

function LearnersList({ onOpenUser, cfg, onSaveCfg, lang = "en" }) {
  const t = T[lang] || T.en;
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
  if (!data) return <p style={{ color: c.body }}>{t.loading}</p>;

  const nudgeCount = (data.learners || []).filter((u) => needsNudge(u, cfg)).length;
  const draftValid = Number(draftDays) >= 1 && Number(draftAnswers) >= 1;

  return (
    <div>
      <input
        style={styles.searchBox}
        placeholder={t.searchPlaceholder}
        aria-label={t.searchAria}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div style={styles.sortRow}>
        <span style={styles.sortLbl}>{t.sortLabel}</span>
        {LEARNER_SORTS.map((s) => (
          <button
            key={s.key}
            className="rj"
            style={{ ...styles.chip, ...(sort === s.key ? styles.chipActive : {}) }}
            onClick={() => setSort(s.key)}
          >
            {t[s.labelKey]}
          </button>
        ))}
        <button
          className="rj"
          style={{ ...styles.settingsBtn, ...(settingsOpen ? styles.settingsBtnActive : {}) }}
          onClick={() => setSettingsOpen((o) => !o)}
          title={t.nudgeSettingsTitleAttr}
        >
          <SlidersHorizontal size={13} /> {t.nudgeSettings}
        </button>
      </div>

      {settingsOpen && (
        <div style={styles.settingsPanel}>
          <div style={styles.settingsTitle}>{t.nudgeThresholdsTitle}</div>
          <div style={styles.settingsGrid}>
            <label style={styles.settingsField}>
              <span style={styles.settingsLbl}>{t.quietForDays}</span>
              <input type="number" min="1" max="365" style={styles.numInput} value={draftDays} onChange={(e) => setDraftDays(e.target.value)} />
            </label>
            <label style={styles.settingsField}>
              <span style={styles.settingsLbl}>{t.afterAnswers}</span>
              <input type="number" min="1" max="100000" style={styles.numInput} value={draftAnswers} onChange={(e) => setDraftAnswers(e.target.value)} />
            </label>
          </div>
          <p style={styles.settingsHint}>
            {t.settingsHint(Number(draftAnswers) || "—", Number(draftDays) || "—")}
          </p>
          {saveErr && <p style={styles.error}>{saveErr}</p>}
          <div style={styles.settingsActions}>
            <button className="rj" style={{ ...styles.saveBtn, ...(saving || !draftValid ? styles.btnDisabled : {}) }} disabled={saving || !draftValid} onClick={saveSettings}>
              {saving ? t.saving : t.save}
            </button>
            <button className="rj" style={styles.cancelBtn} disabled={saving} onClick={() => { setSettingsOpen(false); setSaveErr(""); }}>
              {t.cancel}
            </button>
          </div>
        </div>
      )}

      {nudgeCount > 0 && (
        <button className="rj" style={styles.nudgeNote} onClick={() => setSort("nudge")}>
          <BellOff size={13} />
          {t.nudgeNote(nudgeCount, cfg.quietDays)}
        </button>
      )}

      <div style={styles.uHead}>
        <div>{t.uhLearner}</div>
        <div>{t.uhAnswers}</div>
        <div>{t.uhAccuracy}</div>
        <div>{t.uhLanguages}</div>
        <div>{t.uhLastActive}</div>
      </div>
      {rows.length === 0 && <p style={styles.muted}>{(data.learners || []).length ? t.noLearnersMatch : t.noLearnerActivity}</p>}
      {rows.map((u) => (
        <button key={u.userId} className="rj" style={styles.uRow} onClick={() => onOpenUser(u.userId)}>
          <div style={{ minWidth: 0 }}>
            <div style={styles.uName}>
              {u.username || shortId(u.userId, lang)}
              {u.isAdmin && <span style={styles.adminTag}>admin</span>}
            </div>
            <div style={styles.uEmail}>{u.email || "—"}</div>
          </div>
          <div style={styles.uCell}>{num(u.answers)}</div>
          <div style={{ ...styles.uCell, color: accColor(u.accuracyPct), fontWeight: 700 }}>{pct(u.accuracyPct)}</div>
          <div style={styles.uCell}>{num(u.tracksPlayed)}</div>
          {needsNudge(u, cfg) ? (
            <div style={styles.nudgeCell} title={t.quietTitle(daysQuiet(u))}>
              <BellOff size={12} />
              {t.quietBadge(daysQuiet(u))}
            </div>
          ) : (
            <div style={{ ...styles.uCell, color: c.muted }}>{timeAgo(u.lastActive, lang)}</div>
          )}
        </button>
      ))}
    </div>
  );
}

// ---- track view -------------------------------------------------------------

function TrackView({ trackId, onBack, onOpenUser, lang = "en" }) {
  const t = T[lang] || T.en;
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
      <BackBar onBack={onBack} label={t.allLanguages} />
      {error && <p style={styles.error}>{error}</p>}
      {!data && !error && <p style={{ color: c.body }}>{t.loading}</p>}
      {data && (
        <>
          <h2 style={styles.h2}>
            {data.label}
            {data.totalItems ? <span style={styles.h2sub}>{t.itemsCount(num(data.totalItems))}</span> : null}
          </h2>

          <SectionHeader title={t.accuracyByCategory} />
          {(data.categories || []).length === 0 && <p style={styles.muted}>{t.noAnswersLang}</p>}
          {(data.categories || []).map((cat) => (
            <div key={cat.cat} style={styles.catRow}>
              <div style={styles.catName}>{cat.cat}</div>
              <div style={{ flex: 1 }}>
                <Bar pct={cat.accuracyPct} />
              </div>
              <div style={{ ...styles.catPct, color: accColor(cat.accuracyPct) }}>{pct(cat.accuracyPct)}</div>
              <div style={styles.catMeta}>{t.catMetaAnsPpl(num(cat.answers), num(cat.learners))}</div>
            </div>
          ))}

          <SectionHeader icon={TriangleAlert} color={c.red} title={t.hardestItems} />
          <p style={styles.sectionSub}>{t.hardestSub(data.thresholds?.minItemAnswers)}</p>
          {(data.worstItems || []).length === 0 && <p style={styles.muted}>{t.nothingFlagged}</p>}
          {(data.worstItems || []).map((it, i) => (
            <div key={i} style={styles.itemRow}>
              <div style={{ ...styles.accPill, color: accColor(it.accuracyPct), borderColor: accColor(it.accuracyPct) }}>
                {pct(it.accuracyPct)}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={styles.attnPrompt}>{it.prompt}</div>
                <div style={styles.attnMeta}>{t.itemMetaCat(it.cat, num(it.answers), num(it.learners))}</div>
              </div>
            </div>
          ))}

          <SectionHeader title={t.learnersCount((data.learners || []).length)} />
          {(data.learners || []).length === 0 && <p style={styles.muted}>{t.noOneStarted}</p>}
          {(data.learners || []).map((u) => (
            <button key={u.userId} className="rj" style={styles.learnerRow} onClick={() => onOpenUser(u.userId)}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={styles.learnerName}>{u.username || shortId(u.userId, lang)}</div>
                <div style={styles.attnMeta}>
                  {t.learnerMeta(num(u.answers), t.skillLabel[u.skillLevel] || u.skillLevel, num(u.streak), timeAgo(u.lastActivity || u.lastPlayed, lang))}
                </div>
              </div>
              <div style={styles.learnerStats}>
                <div style={{ color: accColor(u.accuracyPct), fontWeight: 700 }}>{pct(u.accuracyPct)}</div>
                <div style={styles.coverageMini}>
                  <Bar pct={u.coveragePct} color={c.purple} />
                  <span style={styles.coverageTxt}>{u.coveragePct === null ? "—" : t.pctSeen(u.coveragePct)}</span>
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

function UserView({ userId, onBack, lang = "en" }) {
  const t = T[lang] || T.en;
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
      <BackBar onBack={onBack} label={t.back} />
      {error && <p style={styles.error}>{error}</p>}
      {!data && !error && <p style={{ color: c.body }}>{t.loading}</p>}
      {data && (
        <>
          <h2 style={styles.h2}>
            {data.username || t.noUsername}
            {data.isAdmin && <span style={{ ...styles.h2sub, color: c.purple }}>admin</span>}
          </h2>
          <div style={styles.userMeta}>
            <span>{data.email || "—"}</span>
            <span>{t.joined(data.createdAt ? new Date(data.createdAt).toLocaleDateString() : "—")}</span>
            <span>{t.lastSignIn(data.lastSignInAt ? timeAgo(data.lastSignInAt, lang) : t.never)}</span>
          </div>
          <div style={styles.tileGrid}>
            <div style={styles.tile}>
              <div style={{ ...styles.tileValue, color: c.purple }}>{num(data.totals?.xp)}</div>
              <div style={styles.tileLabel}>{t.tileTotalXP}</div>
            </div>
            <div style={styles.tile}>
              <div style={{ ...styles.tileValue, color: c.body }}>{num(data.totals?.answers)}</div>
              <div style={styles.tileLabel}>{t.tileAnswers}</div>
            </div>
            <div style={styles.tile}>
              <div style={{ ...styles.tileValue, color: c.green }}>{num(data.totals?.bestStreak)}</div>
              <div style={styles.tileLabel}>{t.tileBestStreak}</div>
            </div>
            <div style={styles.tile}>
              <div style={{ ...styles.tileValue, color: c.body }}>{num((data.tracks || []).length)}</div>
              <div style={styles.tileLabel}>{t.tileLanguages}</div>
            </div>
          </div>

          <SectionHeader title={t.perLanguage} />
          {(data.tracks || []).length === 0 && <p style={styles.muted}>{t.notPlayedYet}</p>}
          {(data.tracks || []).map((tr) => (
            <div key={tr.trackId} style={styles.userTrackCard}>
              <div style={styles.userTrackHead}>
                <span style={styles.trackName}>{tr.label}</span>
                <span style={{ color: accColor(tr.accuracyPct), fontWeight: 700, fontSize: 13 }}>{t.accSuffix(pct(tr.accuracyPct))}</span>
              </div>
              <div style={styles.userTrackStats}>
                {t.userTrackStats(num(tr.level), t.skillLabel[tr.skillLevel] || tr.skillLevel, num(tr.xp), num(tr.streak), num(tr.answers), num(tr.roundsCompleted), timeAgo(tr.lastActivity || tr.lastPlayed, lang))}
              </div>
              <div style={styles.coverageRow}>
                <span style={styles.coverageLabel}>{t.coverage}</span>
                <div style={{ flex: 1 }}>
                  <Bar pct={tr.coveragePct} color={c.purple} />
                </div>
                <span style={styles.coverageTxt}>
                  {t.coverageDetail(tr.coveragePct === null ? "—" : `${tr.coveragePct}%`, tr.itemsSeen, tr.totalItems, tr.itemsMissed)}
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
                      <span style={{ color: c.muted, fontSize: 11, width: 60, textAlign: "right" }}>{t.userCatAns(num(cat.answers))}</span>
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

function shortId(id, lang = "en") {
  const t = T[lang] || T.en;
  return id ? t.userShort(id.slice(0, 8)) : t.unknown;
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

import { adminGate } from "../../../../../lib/adminAuth";

// GET/POST /api/admin/progress/settings
// Reads/writes the admin-tunable Progress settings from the admin_settings
// key/value table (migration 016). Currently: the "needs a nudge" thresholds.
// Any admin may read or change them (low-stakes display setting). adminGate
// first → service role (RLS bypassed).

const KEY = "progress_nudge";
const DEFAULTS = { minAnswers: 20, quietDays: 7 };
const BOUNDS = { minAnswers: [1, 100000], quietDays: [1, 365] };

function clampInt(v, [lo, hi], fallback) {
  const n = Math.round(Number(v));
  if (!Number.isFinite(n)) return fallback;
  return Math.max(lo, Math.min(hi, n));
}

export async function GET(req) {
  const { response, ctx } = await adminGate(req);
  if (response) return response;
  const db = ctx.supabaseAdmin;

  try {
    const { data, error } = await db.from("admin_settings").select("value").eq("key", KEY).maybeSingle();
    if (error) throw error;
    const v = data?.value || {};
    return Response.json({
      minAnswers: clampInt(v.minAnswers, BOUNDS.minAnswers, DEFAULTS.minAnswers),
      quietDays: clampInt(v.quietDays, BOUNDS.quietDays, DEFAULTS.quietDays),
    });
  } catch (e) {
    console.error("admin progress settings GET failed", e);
    // Fall back to defaults rather than break the page (e.g. table not migrated yet).
    return Response.json({ ...DEFAULTS });
  }
}

export async function POST(req) {
  const { response, ctx } = await adminGate(req);
  if (response) return response;
  const db = ctx.supabaseAdmin;

  const body = await req.json().catch(() => ({}));
  const value = {
    minAnswers: clampInt(body.minAnswers, BOUNDS.minAnswers, DEFAULTS.minAnswers),
    quietDays: clampInt(body.quietDays, BOUNDS.quietDays, DEFAULTS.quietDays),
  };

  try {
    const { error } = await db
      .from("admin_settings")
      .upsert(
        { key: KEY, value, updated_at: new Date().toISOString(), updated_by: ctx.user.id },
        { onConflict: "key" }
      );
    if (error) throw error;
    return Response.json({ ...value });
  } catch (e) {
    console.error("admin progress settings POST failed", e);
    return Response.json({ error: e?.message || "Could not save settings" }, { status: 500 });
  }
}

import { adminGate } from "../../../../lib/adminAuth";

// GET: browse error_logs, newest first. Filters: ?code=SQ-XXXXXX (exact),
// ?reviewed=true|false. Capped at 200 rows — the SQ-code filter is the
// intended way to chase a specific report (the bug form prefills the code).
export async function GET(req) {
  const { response, ctx } = await adminGate(req);
  if (response) return response;
  const db = ctx.supabaseAdmin;

  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const reviewed = url.searchParams.get("reviewed");

  let query = db.from("error_logs").select("*").order("created_at", { ascending: false }).limit(200);
  if (code) query = query.eq("error_code", code.trim().toUpperCase());
  if (reviewed === "true") query = query.eq("reviewed", true);
  if (reviewed === "false") query = query.eq("reviewed", false);

  const { data, error } = await query;
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ errors: data || [] });
}

// PATCH: mark one log (by id) or a whole code's logs (by errorCode) as
// reviewed/unreviewed. Marking by code exists because one crash usually
// produces several identical rows across reloads.
export async function PATCH(req) {
  const { response, ctx } = await adminGate(req);
  if (response) return response;
  const db = ctx.supabaseAdmin;

  const { id, errorCode, reviewed } = await req.json().catch(() => ({}));
  if (typeof reviewed !== "boolean" || (!id && !errorCode)) {
    return Response.json({ error: "Missing reviewed flag, and one of id or errorCode" }, { status: 400 });
  }

  let query = db.from("error_logs").update({ reviewed });
  if (id) query = query.eq("id", id);
  else query = query.eq("error_code", errorCode.trim().toUpperCase());

  const { error } = await query;
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}

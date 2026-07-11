import { adminGate } from "../../../../lib/adminAuth";

const VALID_STATUSES = ["new", "in_progress", "resolved", "wont_fix"];

// GET: list feedback submissions (bug reports, feature requests, and the
// older survey types), newest first, optionally filtered by ?type= and
// ?status=. Screenshot paths are turned into short-lived signed URLs here
// (the bucket is private; users are write-only — reads only ever happen via
// the service role, same pattern as the notification emails).
export async function GET(req) {
  const { response, ctx } = await adminGate(req);
  if (response) return response;
  const db = ctx.supabaseAdmin;

  const url = new URL(req.url);
  const type = url.searchParams.get("type");
  const status = url.searchParams.get("status");

  let query = db.from("feedback_submissions").select("*").order("created_at", { ascending: false }).limit(200);
  if (type) query = query.eq("type", type);
  if (status && VALID_STATUSES.includes(status)) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) return Response.json({ error: error.message }, { status: 500 });

  const rows = await Promise.all(
    (data || []).map(async (row) => {
      let screenshotUrl = null;
      if (row.screenshot_path) {
        try {
          const { data: signed } = await db.storage.from("bug-screenshots").createSignedUrl(row.screenshot_path, 60 * 60);
          screenshotUrl = signed?.signedUrl || null;
        } catch (e) {
          console.error("signed screenshot URL failed", e);
        }
      }
      return { ...row, screenshotUrl };
    })
  );

  return Response.json({ feedback: rows });
}

// PATCH: triage — update status and/or admin notes on one submission.
export async function PATCH(req) {
  const { response, ctx } = await adminGate(req);
  if (response) return response;
  const db = ctx.supabaseAdmin;

  const { id, status, adminNotes } = await req.json().catch(() => ({}));
  if (!id || (status === undefined && adminNotes === undefined)) {
    return Response.json({ error: "Missing id, or nothing to update" }, { status: 400 });
  }
  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    return Response.json({ error: `Invalid status — expected one of: ${VALID_STATUSES.join(", ")}` }, { status: 400 });
  }

  const patch = { reviewed_at: new Date().toISOString() };
  if (status !== undefined) patch.status = status;
  if (adminNotes !== undefined) patch.admin_notes = adminNotes || null;

  const { error } = await db.from("feedback_submissions").update(patch).eq("id", id);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}

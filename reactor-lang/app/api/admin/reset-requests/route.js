import { adminGate } from "../../../../lib/adminAuth";

// Admin view of password reset requests (#79): the recovery path for
// accounts with no security questions on file. Admins see who asked, set a
// temporary password (via the existing users set_password action from the
// Users tab pattern — the section calls it directly), and mark the request
// resolved or rejected here.

// GET: all requests, newest first, joined with email/username so the admin
// knows who's asking without cross-referencing.
export async function GET(req) {
  const { response, ctx } = await adminGate(req);
  if (response) return response;
  const db = ctx.supabaseAdmin;

  const { data: requests, error } = await db
    .from("password_reset_requests")
    .select("id, user_id, status, requested_at, resolved_at, note")
    .order("requested_at", { ascending: false })
    .limit(200);
  if (error) return Response.json({ error: error.message }, { status: 500 });

  const userIds = [...new Set((requests || []).map((r) => r.user_id))];
  let emailById = new Map();
  let usernameById = new Map();
  if (userIds.length > 0) {
    // Same closed-beta-scale listUsers trade-off as the users route.
    const { data: usersPage } = await db.auth.admin.listUsers({ page: 1, perPage: 1000 });
    emailById = new Map((usersPage?.users || []).map((u) => [u.id, u.email]));
    const { data: profiles } = await db.from("profiles").select("user_id, username").in("user_id", userIds);
    usernameById = new Map((profiles || []).map((p) => [p.user_id, p.username]));
  }

  return Response.json({
    requests: (requests || []).map((r) => ({
      ...r,
      email: emailById.get(r.user_id) || "(deleted account)",
      username: usernameById.get(r.user_id) || null,
    })),
  });
}

// POST { requestId, action: "resolve" | "reject", note? }
// The password itself is set through /api/admin/users set_password (already
// server-enforced); this endpoint only manages request status.
export async function POST(req) {
  const { response, ctx } = await adminGate(req);
  if (response) return response;
  const db = ctx.supabaseAdmin;

  const { requestId, action, note } = await req.json().catch(() => ({}));
  if (!requestId || !["resolve", "reject"].includes(action)) {
    return Response.json({ error: "Missing requestId or invalid action" }, { status: 400 });
  }

  const { error } = await db
    .from("password_reset_requests")
    .update({
      status: action === "resolve" ? "resolved" : "rejected",
      resolved_at: new Date().toISOString(),
      resolved_by: ctx.user.id,
      note: typeof note === "string" && note.trim() ? note.trim().slice(0, 500) : null,
    })
    .eq("id", requestId);
  if (error) return Response.json({ error: error.message }, { status: 500 });

  return Response.json({ ok: true });
}

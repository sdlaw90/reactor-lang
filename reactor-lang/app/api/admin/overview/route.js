import { adminGate } from "../../../../lib/adminAuth";

// At-a-glance counts for the admin dashboard. Each count is independent and
// failure-isolated: one broken query shows as null in the UI rather than
// taking the whole dashboard down.
export async function GET(req) {
  const { response, ctx } = await adminGate(req);
  if (response) return response;
  const db = ctx.supabaseAdmin;

  const safeCount = async (builder) => {
    try {
      const { count, error } = await builder;
      if (error) throw error;
      return count ?? 0;
    } catch (e) {
      console.error("admin overview count failed", e);
      return null;
    }
  };

  const [pendingApplications, totalApplications, newBugs, newFeatures, otherNewFeedback, unreviewedErrors] =
    await Promise.all([
      safeCount(db.from("beta_applications").select("id", { count: "exact", head: true }).eq("status", "pending")),
      safeCount(db.from("beta_applications").select("id", { count: "exact", head: true })),
      safeCount(db.from("feedback_submissions").select("id", { count: "exact", head: true }).eq("status", "new").eq("type", "bug")),
      safeCount(db.from("feedback_submissions").select("id", { count: "exact", head: true }).eq("status", "new").eq("type", "feature")),
      safeCount(
        db
          .from("feedback_submissions")
          .select("id", { count: "exact", head: true })
          .eq("status", "new")
          .not("type", "in", "(bug,feature)")
      ),
      safeCount(db.from("error_logs").select("id", { count: "exact", head: true }).eq("reviewed", false)),
    ]);

  // User counts come from Auth, not a table. listUsers with a generous page
  // is fine at closed-beta scale (same trade-off the approve route makes).
  let totalUsers = null;
  let activeLast7Days = null;
  let bannedUsers = null;
  try {
    const { data: usersPage, error } = await db.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (error) throw error;
    const users = usersPage?.users || [];
    totalUsers = users.length;
    const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
    activeLast7Days = users.filter((u) => u.last_sign_in_at && new Date(u.last_sign_in_at).getTime() >= cutoff).length;
    bannedUsers = users.filter((u) => u.banned_until && new Date(u.banned_until).getTime() > Date.now()).length;
  } catch (e) {
    console.error("admin overview user counts failed", e);
  }

  return Response.json({
    pendingApplications,
    totalApplications,
    newBugs,
    newFeatures,
    otherNewFeedback,
    unreviewedErrors,
    totalUsers,
    activeLast7Days,
    bannedUsers,
  });
}

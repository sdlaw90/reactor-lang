import { createClient } from "@supabase/supabase-js";

// Verifies the caller is signed in AND is the configured admin -- this route
// uses the service role key (full DB access, bypasses RLS), so it must never
// be reachable by anyone else.
async function getRequestingAdmin(req) {
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "");
  if (!token) return null;
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) return null;
  const adminEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "").toLowerCase();
  if (!adminEmail || data.user.email?.toLowerCase() !== adminEmail) return null;
  return data.user;
}

export async function GET(req) {
  const admin = await getRequestingAdmin(req);
  if (!admin) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    return Response.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY is not set — see README for setup instructions." },
      { status: 500 }
    );
  }
  const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data, error } = await supabaseAdmin
    .from("beta_applications")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  return Response.json({ applications: data });
}

export async function POST(req) {
  const admin = await getRequestingAdmin(req);
  if (!admin) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { applicationId, email, action } = await req.json().catch(() => ({}));
  if (!applicationId || (action === "approve" && !email)) {
    return Response.json({ error: "Missing applicationId (or email, for approval)" }, { status: 400 });
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    return Response.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY is not set — see README for setup instructions." },
      { status: 500 }
    );
  }

  // Service-role client: full admin access, only ever used server-side here.
  const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  if (action === "reject") {
    const { error: updateError } = await supabaseAdmin
      .from("beta_applications")
      .update({ status: "rejected", reviewed_at: new Date().toISOString() })
      .eq("id", applicationId);
    if (updateError) {
      return Response.json({ error: updateError.message }, { status: 500 });
    }
    return Response.json({ ok: true });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  try {
    // Creates the account (with this exact email) and sends Supabase's own
    // invite email -- accepting it requires setting a password, so that's
    // handled for free, no custom email-sending needed.
    const { error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${siteUrl}/`,
    });
    if (inviteError) {
      return Response.json({ error: `Invite failed: ${inviteError.message}` }, { status: 500 });
    }

    const { error: updateError } = await supabaseAdmin
      .from("beta_applications")
      .update({ status: "approved", reviewed_at: new Date().toISOString() })
      .eq("id", applicationId);
    if (updateError) {
      return Response.json({ error: `Invite sent, but status update failed: ${updateError.message}` }, { status: 500 });
    }

    return Response.json({ ok: true });
  } catch (e) {
    console.error("approve-beta-application failed", e);
    return Response.json({ error: "Unexpected error approving application" }, { status: 500 });
  }
}

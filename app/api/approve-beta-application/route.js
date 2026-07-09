import { createClient } from "@supabase/supabase-js";
import { cleanEmail, looksLikeEmail } from "../../../lib/emailUtils";

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

  try {
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
  } catch (e) {
    console.error("approve-beta-application GET failed", e);
    return Response.json({ error: `Unexpected error: ${e?.message || String(e)}` }, { status: 500 });
  }
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

  try {
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

    // Clean the email before it touches Supabase Auth -- invisible
    // characters or stray whitespace in the stored application row would
    // otherwise surface as a confusing "invalid email" invite failure.
    const cleanedEmail = cleanEmail(email);
    if (!looksLikeEmail(cleanedEmail)) {
      return Response.json(
        { error: `That email doesn't look valid after cleanup ("${cleanedEmail}") — check the application row for typos or stray characters.` },
        { status: 400 }
      );
    }

    // A returning tester may already have an account (e.g. from pre-beta
    // testing). inviteUserByEmail refuses already-registered addresses, so
    // check first and approve WITHOUT re-inviting in that case. listUsers
    // with a generous page size is fine at closed-beta scale.
    const { data: usersPage, error: listError } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (listError) {
      return Response.json({ error: `Could not check for an existing account: ${listError.message}` }, { status: 500 });
    }
    const existingUser = usersPage?.users?.find((u) => u.email?.toLowerCase() === cleanedEmail) || null;

    if (!existingUser) {
      // Creates the account (with this exact email) and sends Supabase's own
      // invite email -- accepting it requires setting a password, so that's
      // handled for free, no custom email-sending needed.
      const { error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(cleanedEmail, {
        redirectTo: `${siteUrl}/`,
      });
      if (inviteError) {
        return Response.json({ error: `Invite failed: ${inviteError.message}` }, { status: 500 });
      }
    }

    const { error: updateError } = await supabaseAdmin
      .from("beta_applications")
      .update({ status: "approved", reviewed_at: new Date().toISOString() })
      .eq("id", applicationId);
    if (updateError) {
      return Response.json(
        { error: `${existingUser ? "Account already exists" : "Invite sent"}, but status update failed: ${updateError.message}` },
        { status: 500 }
      );
    }

    return Response.json({
      ok: true,
      alreadyRegistered: !!existingUser,
      ...(existingUser && {
        note: "This email already has an account — application approved without sending an invite. The tester can sign in with their existing credentials (or use Forgot password if needed).",
      }),
    });
  } catch (e) {
    console.error("approve-beta-application POST failed", e);
    return Response.json({ error: `Unexpected error: ${e?.message || String(e)}` }, { status: 500 });
  }
}

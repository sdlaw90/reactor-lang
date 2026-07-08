import { createClient } from "@supabase/supabase-js";

// Deliberately NOT gated by "must already be signed in as admin" -- that
// would be useless for the exact scenario this exists for (the admin is
// locked out of their own account). Gated by a separate secret instead,
// checked via header, so it works independently of any app session state.
export async function POST(req) {
  const providedSecret = req.headers.get("x-admin-secret") || "";
  const expectedSecret = process.env.ADMIN_API_SECRET || "";
  if (!expectedSecret || providedSecret !== expectedSecret) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { email, newPassword } = await req.json().catch(() => ({}));
  if (!email || !newPassword) {
    return Response.json({ error: "Missing email or newPassword" }, { status: 400 });
  }
  if (newPassword.length < 6) {
    return Response.json({ error: "Password must be at least 6 characters" }, { status: 400 });
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    return Response.json({ error: "SUPABASE_SERVICE_ROLE_KEY is not set" }, { status: 500 });
  }

  try {
    const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // No direct "get user by email" in the stable admin API -- list and
    // match. Fine at beta scale; paginate if this ever needs to scale up.
    const { data: listData, error: listError } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
    if (listError) {
      return Response.json({ error: listError.message }, { status: 500 });
    }
    const user = listData.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (!user) {
      return Response.json({ error: `No account found for ${email}` }, { status: 404 });
    }

    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(user.id, { password: newPassword });
    if (updateError) {
      return Response.json({ error: updateError.message }, { status: 500 });
    }

    return Response.json({ ok: true });
  } catch (e) {
    console.error("admin-set-password failed", e);
    return Response.json({ error: `Unexpected error: ${e?.message || String(e)}` }, { status: 500 });
  }
}

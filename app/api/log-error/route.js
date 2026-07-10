import { createClient } from "@supabase/supabase-js";

// Records client-side crashes reported by the error boundaries. Always
// answers 200: error logging must never create a second error for the user.
// Prefers the service role key; falls back to the anon key (error_logs has
// an insert-only anon RLS policy), mirroring app/api/beta-apply/route.js.

const MAX_LEN = { message: 2000, stack: 8000, url: 1000, userAgent: 500 };
const clip = (v, max) => (typeof v === "string" ? v.slice(0, max) : null);

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const code = typeof body.code === "string" ? body.code.slice(0, 20) : null;
    if (!code) return Response.json({ ok: false });

    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { error } = await supabase.from("error_logs").insert({
      error_code: code,
      message: clip(body.message, MAX_LEN.message),
      // Next.js production builds redact client error messages; the digest
      // correlates with Vercel's server logs, so keep it with the stack.
      stack: [body.digest ? `digest: ${clip(body.digest, 100)}` : null, clip(body.stack, MAX_LEN.stack)]
        .filter(Boolean)
        .join("\n"),
      url: clip(body.url, MAX_LEN.url),
      user_agent: clip(body.userAgent, MAX_LEN.userAgent),
    });
    if (error) console.error("error_logs insert failed", error);

    return Response.json({ ok: true });
  } catch (e) {
    console.error("log-error POST failed", e);
    return Response.json({ ok: true });
  }
}

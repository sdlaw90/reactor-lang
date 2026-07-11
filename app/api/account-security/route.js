import { createClient } from "@supabase/supabase-js";
import {
  REQUIRED_QUESTION_COUNT,
  isValidQuestionKey,
  normalizeAnswer,
} from "../../../lib/securityQuestions";
import { hashAnswer } from "../../../lib/securityAnswerHash";

// Signed-in management of password recovery (#79): the password hint and the
// three security questions. Lives server-side because (a) answers must be
// hashed before storage and (b) security_questions + profiles.password_hint
// are service-role-only surfaces (see migration 011).
//
// Auth: Bearer token, verified the same way lib/adminAuth.js does — but any
// signed-in user qualifies; they can only ever touch their OWN rows (the
// user id comes from the verified token, never from the request body).

async function requireUser(req) {
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "");
  if (!token) return null;
  const anonClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  const { data, error } = await anonClient.auth.getUser(token);
  if (error || !data?.user) return null;
  return data.user;
}

function serviceClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set — password recovery management requires it.");
  }
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// GET: current recovery setup — hint text + which question keys are on file.
// Answers (even hashed) are never returned.
export async function GET(req) {
  const user = await requireUser(req);
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const db = serviceClient();
    const [{ data: profile }, { data: questions }] = await Promise.all([
      db.from("profiles").select("password_hint").eq("user_id", user.id).maybeSingle(),
      db.from("security_questions").select("question_key").eq("user_id", user.id),
    ]);
    return Response.json({
      hint: profile?.password_hint || "",
      questionKeys: (questions || []).map((q) => q.question_key),
    });
  } catch (e) {
    return Response.json({ error: e?.message || "Failed to load recovery settings" }, { status: 500 });
  }
}

// POST: save recovery setup.
//   { hint }                      — hint alone (questions untouched)
//   { hint, questions: [...] }    — hint + full replacement question set:
//                                   exactly 3 entries of { key, answer },
//                                   distinct valid keys, non-empty answers
//   { hint, clearQuestions: true }— remove all questions (self-serve reset
//                                   then falls back to the admin path)
export async function POST(req) {
  const user = await requireUser(req);
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const hint = typeof body.hint === "string" ? body.hint.trim().slice(0, 200) : "";
  const questions = Array.isArray(body.questions) ? body.questions : null;
  const clearQuestions = body.clearQuestions === true;

  if (questions) {
    if (questions.length !== REQUIRED_QUESTION_COUNT) {
      return Response.json(
        { error: `Exactly ${REQUIRED_QUESTION_COUNT} security questions are required (or none at all).` },
        { status: 400 }
      );
    }
    const keys = questions.map((q) => q?.key);
    if (new Set(keys).size !== keys.length || !keys.every(isValidQuestionKey)) {
      return Response.json({ error: "Pick three different questions from the list." }, { status: 400 });
    }
    if (!questions.every((q) => normalizeAnswer(q?.answer).length > 0)) {
      return Response.json({ error: "Every chosen question needs an answer." }, { status: 400 });
    }
  }

  try {
    const db = serviceClient();

    // Hint lives on profiles; upsert so accounts predating the profiles
    // table still work (same pattern as the admin set_admin action).
    const { error: hintError } = await db
      .from("profiles")
      .upsert(
        { user_id: user.id, password_hint: hint || null, updated_at: new Date().toISOString() },
        { onConflict: "user_id" }
      );
    if (hintError) return Response.json({ error: hintError.message }, { status: 500 });

    if (questions || clearQuestions) {
      // Full replacement: delete-then-insert keeps the "exactly 3 or none"
      // invariant without diffing.
      const { error: delError } = await db.from("security_questions").delete().eq("user_id", user.id);
      if (delError) return Response.json({ error: delError.message }, { status: 500 });

      if (questions) {
        const rows = questions.map((q) => ({
          user_id: user.id,
          question_key: q.key,
          answer_hash: hashAnswer(normalizeAnswer(q.answer)),
        }));
        const { error: insError } = await db.from("security_questions").insert(rows);
        if (insError) return Response.json({ error: insError.message }, { status: 500 });
      }

      // Fresh question set = fresh lockout state.
      await db
        .from("profiles")
        .update({ sq_failed_attempts: 0, sq_locked_until: null })
        .eq("user_id", user.id);
    }

    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: e?.message || "Failed to save recovery settings" }, { status: 500 });
  }
}

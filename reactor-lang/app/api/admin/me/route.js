import { adminGate } from "../../../../lib/adminAuth";

// Answers one question for the client: "is the current session an admin?"
// The /admin page gates on this instead of comparing emails in the browser,
// so profiles.is_admin works without shipping any admin identity client-side.
export async function GET(req) {
  const { response, ctx } = await adminGate(req);
  if (response) return response;
  return Response.json({ admin: true, email: ctx.user.email });
}

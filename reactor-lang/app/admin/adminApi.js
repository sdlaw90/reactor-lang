"use client";

import { supabase } from "../../lib/supabaseClient";

// Authorized fetch for the admin panel: attaches the current session token
// and normalizes non-JSON responses (route not deployed, platform error
// page) into readable errors instead of a generic parse failure — same
// hardening the original beta-applications page had.
export async function adminFetch(path, { method = "GET", body } = {}) {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  if (!token) throw new Error("Not signed in");

  const res = await fetch(path, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const rawText = await res.text();
  let parsed;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    throw new Error(
      `Server returned HTTP ${res.status} with a non-JSON response (likely a route/deployment issue): ${rawText.slice(0, 120)}`
    );
  }
  if (!res.ok) throw new Error(parsed.error || `Request failed (HTTP ${res.status})`);
  return parsed;
}

// Shared palette for the admin sections — matches the app's dark theme.
// Muted text is #9B93B8 (AA-passing), deliberately not the #63-flagged
// #7C7395 (standing decision: new UI must not add more of that color).
export const adminColors = {
  bg: "#171423",
  card: "#221E33",
  cardInner: "#1B1729",
  border: "#3A3452",
  text: "#F3F0FA",
  body: "#B4ABC9",
  muted: "#9B93B8",
  pink: "#FF8FB1",
  purple: "#B98EFF",
  green: "#5EE0A0",
  red: "#FF7B8A",
  amber: "#FFC46B",
};

// Client-side crash reporting used by app/error.js and app/global-error.js.
// Generates a short human-readable code (e.g. SQ-M3K7X2), POSTs the crash to
// /api/log-error (plain fetch -- deliberately no Supabase client import, so
// it still works when the crash IS a broken module), and remembers the code
// in localStorage so the bug report form can prefill it later, even after
// the user closes the tab to escape.

const CODE_ALPHABET = "23456789ABCDEFGHJKMNPQRSTVWXYZ"; // no 0/O/1/I/L/U lookalikes
export const LAST_ERROR_STORAGE_KEY = "sq_last_error";

export function generateErrorCode() {
  let out = "";
  const rand =
    typeof crypto !== "undefined" && crypto.getRandomValues
      ? crypto.getRandomValues(new Uint32Array(6))
      : Array.from({ length: 6 }, () => Math.floor(Math.random() * 0xffffffff));
  for (let i = 0; i < 6; i++) out += CODE_ALPHABET[rand[i] % CODE_ALPHABET.length];
  return `SQ-${out}`;
}

// Returns the generated code synchronously; logging happens in the background.
export function logClientError(error) {
  const code = generateErrorCode();

  try {
    localStorage.setItem(LAST_ERROR_STORAGE_KEY, JSON.stringify({ code, at: Date.now() }));
  } catch {
    /* storage unavailable -- fine, the code is still on screen */
  }

  try {
    fetch("/api/log-error", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true, // survives the user immediately reloading/leaving
      body: JSON.stringify({
        code,
        message: error?.message || String(error) || null,
        stack: error?.stack || null,
        digest: error?.digest || null,
        url: typeof window !== "undefined" ? window.location.href : null,
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : null,
      }),
    }).catch(() => {});
  } catch {
    /* even if logging fails, the on-screen code still identifies the report */
  }

  return code;
}

// For the bug report form: returns { code, at } if a crash happened in the
// last 24h, else null.
export function getRecentErrorCode() {
  try {
    const raw = localStorage.getItem(LAST_ERROR_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.code || !parsed?.at) return null;
    if (Date.now() - parsed.at > 24 * 60 * 60 * 1000) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearRecentErrorCode() {
  try {
    localStorage.removeItem(LAST_ERROR_STORAGE_KEY);
  } catch {
    /* noop */
  }
}

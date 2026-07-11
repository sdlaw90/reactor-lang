"use client";

import { useEffect } from "react";
import { logClientError } from "./errorReporting";

// Auto-logs errors that never reach a React error boundary — failures inside
// event handlers and unhandled promise rejections from async calls. Boundary
// crashes were already auto-logged (app/error.js / global-error.js); this
// closes the gap for errors that don't take the render tree down, with zero
// user action required. Mounted once in the root layout, renders nothing.
//
// Noise control:
// - Session cap (5): one flapping network call can't flood error_logs.
// - Dedupe: the same message only logs once per session.
// - Skips the useless cross-origin "Script error." (no message, no stack)
//   and the benign ResizeObserver loop warning browsers emit.
// - Dev note: in development React re-throws boundary-caught errors, so a
//   crash can double-log there. Production boundaries swallow them, so
//   prod rows stay one-crash-one-source.

const SESSION_CAP = 5;

export default function GlobalErrorLogger() {
  useEffect(() => {
    let logged = 0;
    const seen = new Set();

    const shouldLog = (message) => {
      if (logged >= SESSION_CAP) return false;
      const msg = String(message || "");
      if (!msg || msg === "Script error.") return false;
      if (msg.includes("ResizeObserver loop")) return false;
      if (seen.has(msg)) return false;
      seen.add(msg);
      logged += 1;
      return true;
    };

    const onError = (event) => {
      const err = event?.error || new Error(event?.message || "Unknown window error");
      if (!shouldLog(err?.message || event?.message)) return;
      logClientError(err);
    };

    const onRejection = (event) => {
      const reason = event?.reason;
      const err = reason instanceof Error ? reason : new Error(typeof reason === "string" ? reason : "Unhandled promise rejection");
      if (!shouldLog(err.message)) return;
      logClientError(err);
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return null;
}

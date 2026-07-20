"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";
import { submitBugReport } from "../../../lib/db";
import { getRecentErrorCode, clearRecentErrorCode } from "../../../lib/errorReporting";
import BackHome from "../../../lib/BackHome";

// Single-screen bug report (deliberately not a wizard -- ADHD-friendly:
// one required field, everything else optional). Identity is derived from
// the signed-in session server-side; the form only shows who it will be
// sent as. If an error boundary caught a crash in the last 24h, its code is
// prefilled automatically.
export default function BugReportPage() {
  const router = useRouter();
  const [session, setSession] = useState(undefined);
  const [username, setUsername] = useState("");
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [prefilledCode, setPrefilledCode] = useState(false);

  const [message, setMessage] = useState("");
  const [steps, setSteps] = useState("");
  const [errorCode, setErrorCode] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [preview, setPreview] = useState("");
  const fileRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/auth");
        return;
      }
      setSession(data.session);
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("username")
          .eq("user_id", data.session.user.id)
          .maybeSingle();
        if (profile?.username) setUsername(profile.username);
      } catch {
        /* display nicety only */
      }
      const recent = getRecentErrorCode();
      if (recent?.code) {
        setErrorCode(recent.code);
        setPrefilledCode(true);
      }
    })();
  }, [router]);

  const pickScreenshot = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    if (!file.type.startsWith("image/")) {
      setError("Screenshots need to be an image file (a photo or screen capture).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("That image is over 5 MB — a normal screenshot should be well under that.");
      return;
    }
    setScreenshot(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeScreenshot = () => {
    setScreenshot(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setError("A quick description of what went wrong is needed.");
      return;
    }
    setError("");
    setBusy(true);
    try {
      await submitBugReport({
        message: message.trim(),
        steps: steps.trim(),
        errorCode: errorCode.trim(),
        screenshot,
      });
      if (errorCode.trim()) clearRecentErrorCode();
      setSubmitted(true);
    } catch (err) {
      console.error("submitBugReport failed", err);
      setError(`Something went wrong sending that: ${err?.message || "unknown error"} — mind trying again?`);
    } finally {
      setBusy(false);
    }
  };

  if (session === undefined) {
    return (
      <div style={styles.wrap}>
        <p style={{ color: "#B4ABC9" }}>Loading…</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={styles.wrap}>
        <div style={{ width: "100%", maxWidth: 440, textAlign: "center" }}>
          <h1 className="rj" style={styles.title}>Got it — thank you! 🐿️</h1>
          <p style={styles.body}>
            Your bug report was sent{errorCode ? ` (code ${errorCode})` : ""}. Squashing it is now on the list.
          </p>
          <button className="rj" style={styles.secondaryBtn} onClick={() => router.push("/")}>
            Back to home
          </button>
        </div>
      </div>
    );
  }

  const identity = [username, session?.user?.email].filter(Boolean).join(" · ");

  return (
    <div style={styles.wrap}>
      <div style={{ width: "100%", maxWidth: 460 }}>
        <BackHome />
        <h1 className="rj" style={styles.title}>Report a bug</h1>
        <p style={styles.subtitle}>Only the first box is required — send it the moment you've written that.</p>
        {identity && <p style={styles.identity}>Submitting as {identity}</p>}

        <form onSubmit={submit}>
          <Field label="What happened?" required>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={styles.textarea}
              rows={4}
              placeholder="e.g. The explanations page shows an error screen every time I open it"
              aria-label="What happened?"
            />
          </Field>

          <Field label="How can it be reproduced? (optional)">
            <textarea
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              style={styles.textarea}
              rows={3}
              placeholder={"1. Open ...\n2. Tap ..."}
              aria-label="How can it be reproduced?"
            />
          </Field>

          <Field label="Error code (optional)">
            <input
              value={errorCode}
              onChange={(e) => {
                setErrorCode(e.target.value.toUpperCase());
                setPrefilledCode(false);
              }}
              style={{ ...styles.input, fontFamily: "monospace", letterSpacing: 1 }}
              placeholder="SQ-______"
              maxLength={20}
              aria-label="Error code"
            />
            {prefilledCode && (
              <p style={styles.prefillNote}>Filled in from the error you hit recently — clear it if this report is about something else.</p>
            )}
          </Field>

          <Field label="Screenshot (optional)">
            {!screenshot ? (
              <>
                <button className="rj" type="button" style={styles.uploadBtn} onClick={() => fileRef.current?.click()}>
                  Add a screenshot
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={pickScreenshot}
                  style={{ display: "none" }}
                  aria-label="Screenshot file"
                />
              </>
            ) : (
              <div style={styles.previewBox}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="Screenshot preview" style={styles.previewImg} />
                <button className="rj" type="button" style={styles.removeBtn} onClick={removeScreenshot}>
                  Remove
                </button>
              </div>
            )}
          </Field>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" className="rj" style={styles.primaryBtn} disabled={busy}>
            {busy ? "Sending..." : "Send bug report"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={styles.label}>
        {label} {required && <span style={{ color: "#FF7B8A" }}>*</span>}
      </label>
      {children}
    </div>
  );
}

const styles = {
  wrap: { minHeight: "100vh", display: "flex", justifyContent: "center", padding: "40px 20px", background: "#171423" },
  backBtn: {
    background: "rgba(255,143,177,0.12)",
    color: "#FF8FB1",
    border: "1px solid #FF8FB1",
    borderRadius: 8,
    padding: "7px 14px",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    marginBottom: 16,
  },
  title: { fontSize: 22, fontWeight: 700, color: "#F3F0FA", margin: "0 0 6px", textAlign: "center" },
  subtitle: { color: "#B4ABC9", fontSize: 13, lineHeight: 1.5, marginBottom: 8, textAlign: "center" },
  identity: { color: "#9B93B8", fontSize: 12, textAlign: "center", marginBottom: 20 },
  body: { color: "#B4ABC9", fontSize: 14, lineHeight: 1.6, margin: "12px 0 24px" },
  label: { display: "block", color: "#B4ABC9", fontSize: 13, fontWeight: 600, marginBottom: 8, lineHeight: 1.4 },
  input: {
    width: "100%",
    background: "#221E33",
    border: "1px solid #3A3452",
    borderRadius: 10,
    padding: "11px 14px",
    color: "#F3F0FA",
    fontSize: 14,
    fontFamily: "inherit",
  },
  textarea: {
    width: "100%",
    background: "#221E33",
    border: "1px solid #3A3452",
    borderRadius: 12,
    padding: "12px 14px",
    color: "#F3F0FA",
    fontSize: 14,
    lineHeight: 1.5,
    resize: "vertical",
    fontFamily: "inherit",
  },
  prefillNote: { color: "#9B93B8", fontSize: 12, margin: "6px 0 0", lineHeight: 1.4 },
  uploadBtn: {
    width: "100%",
    background: "#221E33",
    color: "#B4ABC9",
    border: "1px dashed #3A3452",
    borderRadius: 10,
    padding: "12px",
    fontSize: 13.5,
    cursor: "pointer",
  },
  previewBox: { display: "flex", flexDirection: "column", gap: 8 },
  previewImg: { width: "100%", borderRadius: 10, border: "1px solid #3A3452" },
  removeBtn: {
    alignSelf: "flex-start",
    background: "transparent",
    color: "#FF7B8A",
    border: "1px solid #4A1E24",
    borderRadius: 8,
    padding: "7px 14px",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
  },
  error: { color: "#FF7B8A", fontSize: 13, marginTop: 14 },
  primaryBtn: {
    width: "100%",
    background: "#FF8FB1",
    color: "#171423",
    border: "none",
    borderRadius: 12,
    padding: "14px",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    marginTop: 6,
  },
  secondaryBtn: {
    background: "transparent",
    color: "#B4ABC9",
    border: "1px solid #3A3452",
    borderRadius: 10,
    padding: "12px 24px",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
  },
};

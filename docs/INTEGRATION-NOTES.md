# Feedback rework + error codes + email theming — integration notes

Built against v2.24.0-beta.3 file snapshots (feedback page, SettingsPanel,
NavDrawer, db.js, beta-apply route). New files drop in as-is; two existing
files are full replacements; one needs a small manual edit.

## New files (drop in at these exact paths)

| Path | What it is |
|---|---|
| `app/feedback/bug/page.js` | Bug report form (single screen, screenshot, error-code prefill) |
| `app/feedback/feature/page.js` | Feature request form (single screen) |
| `app/error.js` | Route error boundary — branded screen, error code, Try again / Go home |
| `app/global-error.js` | Root-layout error boundary — self-contained, Reload button |
| `app/api/submit-feedback/route.js` | Handles both forms: session-derived identity, screenshot upload, branded admin email |
| `app/api/log-error/route.js` | Records crashes from the boundaries into `error_logs` |
| `lib/errorReporting.js` | Code generation (SQ-XXXXXX), crash POST, localStorage handoff to the bug form |
| `lib/emailTemplate.js` | Shared branded HTML wrapper for all Resend emails |
| `supabase/migrations/00000000000009_feedback_rework_and_error_logs.sql` | Columns + error_logs + bug-screenshots bucket (follows ...008_beta_application_status) |

## Replaced files (full replacements included)

- `app/feedback/page.js` — old survey wizard → bug/feature chooser
- `lib/db.js` — adds `submitBugReport` / `submitFeatureRequest`; old `submitFeedback` kept but marked retired (delete once you confirm nothing else imports it)
- `app/api/beta-apply/route.js` — admin notification now uses the branded template (text fallback kept)

## Manual edit: lib/SettingsPanel.js

Replace the single feedback button (around line 64) with two:

```jsx
        <GroupHeader label="Feedback" />
        <button className="rj" style={styles.feedbackBtn} onClick={() => router.push("/feedback/bug")}>
          🐞 Report a bug
        </button>
        <button className="rj" style={styles.feedbackBtn} onClick={() => router.push("/feedback/feature")}>
          💡 Suggest a feature
        </button>
```

(The old block routed to `/feedback` with the label "Send feedback or report
a bug". `styles.feedbackBtn` already has `marginBottom: 14`, so two stacked
buttons space correctly with no style changes.)

## Dashboard steps (not code)

1. **Run migration 00000000000009**.
2. **Invite email**: Supabase Dashboard → Authentication → Email Templates →
   Invite user → paste `docs/supabase-invite-email.html`. Subject suggestion
   inside the file. Same wrapper reusable for Confirm/Reset/Magic-link
   templates.
3. `SUPABASE_SERVICE_ROLE_KEY` should be set in Vercel env (both new routes
   fall back to the anon key, but signed screenshot links in admin emails
   need the service role).

## Behavior notes

- **Identity**: both forms send the session access token; the route derives
  user_id/email from it and snapshots the username — nothing typed, nothing
  spoofable. Forms display "Submitting as {username} · {email}".
- **Error-code loop**: crash → boundary shows `SQ-XXXXXX` + logs to
  `error_logs` → code saved in localStorage → bug form auto-prefills it for
  24h → report and log join on the code. Works even if the tester closes the
  tab first (the old trap).
- **Next.js redacts** client error messages in production; the log stores the
  `digest` (correlates with Vercel function logs) plus whatever stack the
  browser had.
- **Screenshots** live in the private `bug-screenshots` bucket (5 MB, images
  only, enforced in the route AND the bucket). Users can write, never read;
  admin email gets a 7-day signed URL.
- A failed screenshot upload never loses the report — it's noted in
  `details.screenshot_note` instead.
- **E2E suggestions for the suite**: submit each form via `getByLabel`
  (labels are programmatically associated), assert the thank-you screen; and
  a spec that forces a route error and asserts the branded boundary renders
  with a code.

## Not included (deliberate)

- Admin in-app list for bug/feature submissions — at 2 testers the emails
  carry the full content; build a review page when volume justifies it.
- Rate limiting (#47) — `app/api/submit-feedback/route.js` is a natural
  second home for it alongside beta-apply when #33 ships.
- The explanations-page crash fix — still open, needs that page's component.

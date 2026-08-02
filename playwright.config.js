// @ts-check
const fs = require("node:fs");
const path = require("node:path");
const { defineConfig, devices } = require("@playwright/test");

// Load .env.local into process.env for LOCAL runs.
//
// Playwright runs as its own Node process and does NOT read .env.local -- that
// file is a Next.js convention, loaded by `next build` / `next start`. So the
// app under test saw E2E_TEST_EMAIL there while the spec that needs it never
// did, and the authenticated tests skipped no matter what you put in the file.
// Parsed by hand rather than adding a dotenv dependency for nine lines.
// Existing env vars always win, so CI (which sets them from secrets, and has no
// .env.local anyway) is unaffected.
for (const line of (() => {
  try {
    return fs.readFileSync(path.join(__dirname, ".env.local"), "utf8").split("\n");
  } catch {
    return []; // absent in CI and on a fresh clone -- not an error
  }
})()) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/i);
  if (!m) continue; // comments, blanks, malformed lines
  const value = m[2].trim().replace(/^(['"])(.*)\1$/, "$2");
  if (value && process.env[m[1]] === undefined) process.env[m[1]] = value;
}

module.exports = defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // "github" gives inline annotations on the PR/run; "html" is what actually
  // writes playwright-report/, which the workflow uploads as an artifact. With
  // "github" alone that upload step silently found nothing, every run, so a
  // failure left no screenshot, no trace and no error-context to diagnose from.
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: process.env.E2E_BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-chrome", use: { ...devices["Pixel 7"] } },
  ],
  // Starts the app automatically for local runs; in CI, start it yourself
  // first (build + start) and set E2E_BASE_URL instead, since a fresh build
  // needs real env vars this config can't supply.
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: "npm run start",
        url: "http://localhost:3000",
        reuseExistingServer: true,
        timeout: 30000,
      },
});

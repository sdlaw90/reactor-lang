// Authenticated-flow tests -- these need a real dedicated test account
// (never use a real personal or beta-tester account for this).
//
// Set up: create one throwaway account DIRECTLY IN THE SUPABASE DASHBOARD
// (Authentication -> Users -> Add user, auto-confirm), then sign in as it once
// by hand and clear the username / legal / onboarding gates -- they're all
// self-service, so nothing needs seeding into user metadata. Then set:
//   E2E_TEST_EMAIL=you+e2etest@example.com
//   E2E_TEST_PASSWORD=<a real password for that account>
//
// Do NOT flip SIGNUPS_ENABLED to do this, whatever older comments said. It is
// a hardcoded const in app/auth/page.js that only shows/hides the sign-up
// link, so changing it means a source edit plus a deploy to main -- and it
// would put public self-serve sign-up on the live beta site meanwhile.
//
// Full procedure, including the GitHub secrets: docs/manual-runbook.md §9.
//
// CREDENTIAL POLICY -- deliberately asymmetric:
//   * LOCALLY, missing credentials SKIP. You should be able to run the
//     public-pages suite without a test account.
//   * In CI, missing credentials FAIL. These six tests skipped silently in
//     every CI run for months, so the suite reported green while testing
//     roughly a third of what it claims to. A suite that quietly tests
//     nothing is worse than no suite, because it buys false confidence --
//     the v3.1.1 production bug (raw string keys shipped to every user in
//     every language) went out under a green-looking board. If the secrets
//     go missing again, the board goes red and says why.

const { test, expect } = require("@playwright/test");

const EMAIL = process.env.E2E_TEST_EMAIL;
const PASSWORD = process.env.E2E_TEST_PASSWORD;
const HAVE_CREDS = Boolean(EMAIL && PASSWORD);

// Runs as its own test so the failure is visible in the report as a named
// check rather than a collection-time crash. Outside CI this never registers.
if (process.env.CI && !HAVE_CREDS) {
  const missing = [!EMAIL && "E2E_TEST_EMAIL", !PASSWORD && "E2E_TEST_PASSWORD"]
    .filter(Boolean)
    .join(" and ");
  test("authenticated-suite credentials are configured", () => {
    throw new Error(
      `${missing} not set in CI, so the authenticated suite (6 tests) would skip ` +
        `silently and the run would look green while covering only the public pages. ` +
        `Add the secret(s) under the repository's "Production" Environment ` +
        `(Settings -> Environments -> Production -> Environment secrets). ` +
        `Setup procedure: docs/manual-runbook.md §9.`
    );
  });
}

test.describe("Authenticated flow", () => {
  test.skip(!HAVE_CREDS, "E2E_TEST_EMAIL / E2E_TEST_PASSWORD not set -- skipping authenticated tests");

  test.beforeEach(async ({ page }) => {
    await page.goto("/auth");
    await page.getByPlaceholder(/email or username/i).fill(EMAIL);
    await page.getByPlaceholder(/^password$/i).fill(PASSWORD);
    await page.getByRole("button", { name: /sign in/i }).click();
    // Lands on home once signed in (possibly via onboarding/username gates
    // first, for a genuinely fresh account -- this test account should
    // already be fully set up to avoid re-testing onboarding here).
    await expect(page).toHaveURL(/\/$/, { timeout: 15000 });
  });

  test("home page loads with no console errors and shows language bubbles", async ({ page }) => {
    const errors = [];
    page.on("pageerror", (err) => errors.push(err.message));
    await page.reload();
    await page.waitForLoadState("networkidle");
    expect(errors).toEqual([]);
    // At least one language bubble should be visible.
    await expect(page.locator("body")).toContainText(/spanish|italian|french|german|japanese/i);
  });

  test("profile drawer opens and Settings is visible without an extra click", async ({ page }) => {
    await page.locator('button[aria-label="Open menu"]').click();
    await expect(page.getByText(/settings/i).first()).toBeVisible();
    // Regression check for the "Settings requires a click to reveal" fix --
    // it should already be showing, not behind a second toggle.
    await expect(page.getByText(/profile|username/i).first()).toBeVisible();
  });

  test("Quick Quiz mode: start a round and answer without a crash", async ({ page }) => {
    // This test used to be VACUOUS and green, which is worse than red. It did:
    //   await page.locator("button").filter({ hasText: /.+/ }).nth(0).click();
    // -- the first button with any text, clicked without waiting for the round
    // to render. On the play start screen that's the HUD back arrow ("←"),
    // which navigates home; if the round had rendered it's the exit button
    // ("← Exit"), which leaves the round. Either way it never answered a
    // question, and the only assertion (no pageerror) is trivially true on the
    // home page. Same bug class as the explanations test below: a too-broad
    // locator doesn't fail, it succeeds at something else.
    const errors = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await page.locator("a, button").filter({ hasText: /spanish|italian|french/i }).first().click();
    await expect(page).toHaveURL(/\/play\//);
    await page.getByTestId("start-round").click();

    // The round must actually be on screen, with real options, before we touch it.
    const options = page.getByTestId("answer-option");
    await expect(options.first()).toBeVisible({ timeout: 10_000 });
    expect(await options.count()).toBeGreaterThanOrEqual(2);

    await options.first().click();

    // Answering must not navigate away -- that's precisely what the old version
    // did without noticing.
    await expect(page).toHaveURL(/\/play\//);

    // The round either moved to another question or finished. Both prove the
    // answer was accepted; neither is reachable from the home screen. Written as
    // an either/or rather than asserting the disabled state, because default
    // (non-review) pacing auto-advances in well under a second and that assertion
    // would flake.
    await expect(options.first().or(page.getByTestId("round-complete"))).toBeVisible({ timeout: 10_000 });

    expect(errors).toEqual([]);
  });

  test("Lessons mode: category names respect native-language chrome", async ({ page }) => {
    await page.goto("/learn/it-for-en");
    // Regression check for the categoryDisplayName fix -- a low-skill
    // English-native viewer should see "Vocabulary", not "Vocabolario".
    await expect(page.locator("body")).toContainText(/vocabulary|grammar/i);
  });

  test("Dashboard loads with no console errors", async ({ page }) => {
    const errors = [];
    page.on("pageerror", (err) => errors.push(err.message));
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");
    expect(errors).toEqual([]);
  });

  // 60s: a full round is many question->answer->advance cycles plus the
  // sign-in in beforeEach, and the default 30s was not enough even when the
  // round was progressing normally.
  test("explanations view opens without crashing after a completed round", async ({ page }) => {
    test.setTimeout(60_000);
    // Regression for v2.24.0-beta.4: a component referencing PlayPage state
    // was accidentally rendered inside ExplanationCard, so the explanations
    // view crashed for ANY account with at least one history row -- and the
    // suite stayed green because no spec ever completed a round and opened
    // it. This one does both, seeding its own history in the process.
    //
    // Driven by data-testid, NOT by visible copy or the shared .rj button
    // class. Both of those bit us:
    //   * .rj is on every styled button in the app -- the HUD home arrow, the
    //     help toggle, the exit button. `locator("button.rj").first()` picked
    //     the home arrow off the play start screen (the round had not rendered
    //     yet), navigated away, and then spent its 40 iterations wandering
    //     home -> help -> back. The failure surfaced as "ROUND COMPLETE never
    //     appeared", which pointed at the round rather than at the selector.
    //   * matching on English/Spanish strings breaks the moment this runs
    //     under a different native language -- v3.3 French is next.
    const errors = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await page.locator("a, button").filter({ hasText: /spanish|italian|french/i }).first().click();
    await expect(page).toHaveURL(/\/play\//);
    await page.getByTestId("start-round").click();

    // Wait for the round to actually be on screen before touching anything.
    // Without this the loop races the state transition and clicks whatever
    // chrome is still mounted.
    await expect(page.getByTestId("answer-option").first()).toBeVisible({ timeout: 10_000 });

    // Play to completion. Bounded so a stuck round fails the assertion below
    // rather than hanging. Generous enough for a long round: the loop exits as
    // soon as the result screen appears.
    const roundComplete = page.getByTestId("round-complete");
    for (let i = 0; i < 60; i++) {
      if (await roundComplete.isVisible().catch(() => false)) break;
      // Review pacing shows a Next between questions; default pacing does not.
      const next = page.getByTestId("next-question");
      if (await next.isVisible().catch(() => false)) {
        await next.click();
        await page.waitForTimeout(100);
        continue;
      }
      const option = page.getByTestId("answer-option").first();
      if (await option.isEnabled().catch(() => false)) {
        await option.click();
      }
      await page.waitForTimeout(200);
    }
    await expect(roundComplete).toBeVisible({ timeout: 5000 });

    // Now the part that used to crash: open the explanations view, which
    // renders one ExplanationCard per history row.
    await page.getByTestId("view-explanations").click();
    await expect(page.getByText(/explanations|explicaciones|explicações/i).first()).toBeVisible();
    expect(errors).toEqual([]);
  });
});

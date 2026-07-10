// Authenticated-flow tests -- these need a real dedicated test account
// (never use a real personal or beta-tester account for this). Skips
// entirely if credentials aren't supplied, rather than failing, so the
// public-pages suite can still run cleanly without them.
//
// Set up: create one throwaway account through the normal sign-up flow
// (temporarily flip SIGNUPS_ENABLED to true, create it, flip back to
// false), then set these as environment variables before running:
//   E2E_TEST_EMAIL=you+e2etest@example.com
//   E2E_TEST_PASSWORD=<a real password for that account>

const { test, expect } = require("@playwright/test");

const EMAIL = process.env.E2E_TEST_EMAIL;
const PASSWORD = process.env.E2E_TEST_PASSWORD;

test.describe("Authenticated flow", () => {
  test.skip(!EMAIL || !PASSWORD, "E2E_TEST_EMAIL / E2E_TEST_PASSWORD not set -- skipping authenticated tests");

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
    const errors = [];
    page.on("pageerror", (err) => errors.push(err.message));
    // Click the first visible language bubble.
    await page.locator("a, button").filter({ hasText: /spanish|italian|french/i }).first().click();
    await expect(page).toHaveURL(/\/play\//);
    await page.getByRole("button", { name: /start round/i }).click();
    // Answer the first question with whatever option is first -- this is a
    // smoke test for "does the round render and accept an answer", not a
    // correctness check.
    await page.locator("button").filter({ hasText: /.+/ }).nth(0).click();
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

  test("explanations view opens without crashing after a completed round", async ({ page }) => {
    // Regression for v2.24.0-beta.4: a component referencing PlayPage state
    // was accidentally rendered inside ExplanationCard, so the explanations
    // view crashed for ANY account with at least one history row -- and the
    // suite stayed green because no spec ever completed a round and opened
    // it. This one does both, seeding its own history in the process.
    const errors = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await page.locator("a, button").filter({ hasText: /spanish|italian|french/i }).first().click();
    await expect(page).toHaveURL(/\/play\//);
    await page.getByRole("button", { name: /start round/i }).click();

    // Play the round to completion: answer with the first option; in
    // Lessons/review pacing a "Next" button appears between questions.
    // Bounded loop -- if the round somehow never ends, the assertion below
    // fails rather than hanging.
    for (let i = 0; i < 40; i++) {
      if (await page.getByText(/round complete|ronda completa/i).isVisible().catch(() => false)) break;
      const next = page.getByRole("button", { name: /^(next|siguiente)/i });
      if (await next.isVisible().catch(() => false)) {
        await next.click();
        await page.waitForTimeout(150);
        continue;
      }
      const option = page
        .locator("button.rj")
        .filter({ hasNotText: /exit|salir|start round|empezar/i })
        .first();
      if (await option.isVisible().catch(() => false)) await option.click();
      await page.waitForTimeout(250);
    }
    await expect(page.getByText(/round complete|ronda completa/i)).toBeVisible({ timeout: 5000 });

    // Now the part that used to crash: open the explanations view, which
    // renders one ExplanationCard per history row.
    await page.getByRole("button", { name: /view explanations|ver explicaciones/i }).click();
    await expect(page.getByText(/explanations|explicaciones/i).first()).toBeVisible();
    expect(errors).toEqual([]);
  });
});

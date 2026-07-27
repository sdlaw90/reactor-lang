// Public-page smoke tests -- no test account needed. These catch the class
// of bug that curl-based "returns HTTP 200" checks structurally cannot:
// client-side JS errors, React hydration mismatches, and broken interactive
// elements that only surface once a real browser actually runs the page.

const { test, expect } = require("@playwright/test");

// Fails the test if the page logs any console error during the test run --
// this is the core thing curl/HTTP-status checks can never catch.
function trackConsoleErrors(page) {
  const errors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(err.message));
  return errors;
}

test.describe("Public pages load without JS errors", () => {
  for (const path of ["/auth", "/about", "/beta-apply", "/terms", "/privacy", "/forgot-password"]) {
    test(`${path} loads cleanly`, async ({ page }) => {
      const errors = trackConsoleErrors(page);
      const response = await page.goto(path);
      expect(response.status()).toBeLessThan(400);
      await page.waitForLoadState("networkidle");
      expect(errors, `Console/page errors on ${path}: ${errors.join("; ")}`).toEqual([]);
    });
  }
});

test.describe("Sign-in page", () => {
  test("shows sign-in form, not sign-up (closed beta)", async ({ page }) => {
    await page.goto("/auth");
    await expect(page.getByPlaceholder(/email or username/i)).toBeVisible();
    // SIGNUPS_ENABLED = false during closed beta -- this toggle should not exist.
    await expect(page.getByText(/need an account\? sign up/i)).toHaveCount(0);
    await expect(page.getByText(/apply to beta test/i)).toBeVisible();
  });

  test("beta-apply link actually navigates to the application form", async ({ page }) => {
    await page.goto("/auth");
    await page.getByText(/apply to beta test/i).click();
    await expect(page).toHaveURL(/\/beta-apply/);
    await expect(page.getByText(/apply to beta test/i)).toBeVisible();
  });
});

test.describe("Beta application form", () => {
  test("multi-step navigation works: Next/Back move between steps", async ({ page }) => {
    await page.goto("/beta-apply");
    await expect(page.getByText(/1\. about you/i)).toBeVisible();

    // Required-field validation should block advancing with an empty form.
    await page.getByRole("button", { name: /^next$/i }).click();
    await expect(page.getByText(/1\. about you/i)).toBeVisible(); // still on step 1

    await page.getByLabel(/^name or nickname/i).fill("Test User");
    await page.getByLabel(/^email/i).fill("test@example.com");
    await page.getByText("Desktop/laptop browser").click();
    await page.getByRole("button", { name: /^next$/i }).click();
    await expect(page.getByText(/2\. language background/i)).toBeVisible();

    await page.getByRole("button", { name: /^back$/i }).click();
    await expect(page.getByText(/1\. about you/i)).toBeVisible();
    // Values should persist across Back/Next, not reset.
    await expect(page.getByLabel(/^name or nickname/i)).toHaveValue("Test User");
  });

  test("radio selection updates correctly when changed", async ({ page }) => {
    await page.goto("/beta-apply");
    await page.getByLabel(/^name or nickname/i).fill("Test User");
    await page.getByLabel(/^email/i).fill("test@example.com");
    await page.getByText("Desktop/laptop browser").click();
    await page.getByRole("button", { name: /^next$/i }).click();
    await page.getByLabel(/native language/i).fill("English");
    await page.getByLabel(/language\(s\) do you want/i).fill("Spanish");
    await page.getByText("Beginner (basic phrases").click();
    await page.getByRole("button", { name: /^next$/i }).click();
    await page.getByText("A few times a week").click();
    await page.getByText("5–10 minutes").click();
    await page.getByRole("button", { name: /^next$/i }).click();

    // This is the specific regression class flagged by a real beta tester:
    // clicking a different option should un-highlight the previous one.
    //
    // Deliberately COLOUR-AGNOSTIC: it compares a selected option's background
    // against an unselected sibling's rather than hardcoding a brand hex. Two
    // reasons, both learned the hard way in v3.2.0:
    //   1. The old assertion pinned the literal accent `255, 143, 177`, so the
    //      accent repalette turned this into a false failure with no real bug.
    //   2. The old un-highlight check was `not.toBe("rgb(255, 143, 177)")`, but
    //      the active background is `rgba(<accent>, 0.12)` — never that exact
    //      string — so it passed VACUOUSLY. The actual regression this test
    //      exists to catch was not being tested at all.
    const commitmentOptions = page.getByRole("button", { name: /sessions per week|most days|occasional/i });
    const bgOf = (n) => commitmentOptions.nth(n).evaluate((el) => getComputedStyle(el).backgroundColor);

    const restingBg = await bgOf(1); // nothing selected yet
    await commitmentOptions.first().click();
    const selectedBg = await bgOf(0);
    expect(selectedBg).not.toBe(restingBg); // clicking actually highlights

    await commitmentOptions.nth(1).click();
    expect(await bgOf(0)).toBe(restingBg); // the previous option returns to resting
    expect(await bgOf(1)).toBe(selectedBg); // and the new one takes the highlight
  });
});

test.describe("Feedback and admin routes redirect when signed out", () => {
  test("/feedback redirects to /auth", async ({ page }) => {
    await page.goto("/feedback");
    await expect(page).toHaveURL(/\/auth/);
  });

  test("/admin/beta-applications redirects away", async ({ page }) => {
    await page.goto("/admin/beta-applications");
    await expect(page).not.toHaveURL(/\/admin\/beta-applications$/);
  });

  test("/admin hub redirects to /auth when signed out", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/auth/);
  });

  test("/settings redirects to home", async ({ page }) => {
    await page.goto("/settings");
    await expect(page).toHaveURL(/\/$|\/auth/);
  });
});

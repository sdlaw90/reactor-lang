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
  for (const path of ["/auth", "/about", "/beta-apply", "/terms", "/privacy"]) {
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
    const commitmentOptions = page.getByRole("button", { name: /sessions per week|most days|occasional/i });
    await commitmentOptions.first().click();
    await expect(commitmentOptions.first()).toHaveCSS("background-color", /255, 143, 177|rgb\(255, 143, 177\)/);
    await commitmentOptions.nth(1).click();
    // The first option should no longer show the active/highlighted background.
    const firstBg = await commitmentOptions.first().evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(firstBg).not.toBe("rgb(255, 143, 177)");
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

  test("/settings redirects to home", async ({ page }) => {
    await page.goto("/settings");
    await expect(page).toHaveURL(/\/$|\/auth/);
  });
});

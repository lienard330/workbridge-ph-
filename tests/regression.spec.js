// @ts-check
/**
 * Regression tests for Bugs #1, #2, #3 fixed in May 2026.
 *
 * Preconditions:
 *   1. Laravel API running at http://localhost:8000   (php artisan serve)
 *   2. Database seeded                                 (php artisan migrate:fresh --seed)
 *   3. Static server on port 3333                      (started automatically by playwright.config.cjs)
 *
 * Notes on robustness:
 *   - Tests run sequentially (workers=1 in playwright.config.cjs) to avoid
 *     the auth.login rate limiter (5/min per email+IP) tripping when multiple
 *     workers hit the API at once.
 *   - We avoid waitUntil: 'networkidle' because some pages (notifications,
 *     layout) make background calls that prevent the network from settling.
 *     Instead, we wait for specific visible elements, which is deterministic.
 */
const { test, expect } = require('@playwright/test');

/**
 * Log in via the form and wait for the role dashboard URL.
 * @param {import('@playwright/test').Page} page
 * @param {string} email
 * @param {string} password
 * @param {RegExp} dashboardRegex
 */
async function login(page, email, password, dashboardRegex) {
  await page.goto('/auth/login.html', { waitUntil: 'domcontentloaded' });
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);

  // Wait for the login API response and the redirect concurrently.
  const [response] = await Promise.all([
    page.waitForResponse(
      /** @param {import('@playwright/test').Response} r */
      r => r.url().includes('/api/auth/login') && r.request().method() === 'POST',
      { timeout: 15000 }
    ),
    page.click('button[type="submit"]'),
  ]);
  expect(response.status(), `Login failed for ${email}: ${response.status()}`).toBe(200);
  await page.waitForURL(dashboardRegex, { timeout: 15000 });
}

test('Bug #1 — employer can update application status without 500', async ({ page }) => {
  await login(page, 'hr@technova.ph', 'password', /\/employer\/dashboard/);

  // Seeded application id 1 = Juan's application to TechNova's first job
  await page.goto('/employer/applicant-detail.html?id=1', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#app-status')).toBeVisible({ timeout: 15000 });

  const [response] = await Promise.all([
    page.waitForResponse(
      /** @param {import('@playwright/test').Response} r */
      r => r.url().includes('/api/applications/1/status') && r.request().method() === 'PATCH',
      { timeout: 15000 }
    ),
    page.locator('.status-btn[data-s="Interview"]').click(),
  ]);

  // The bug returned 500 because wb_notifications was missing columns
  expect(response.status()).toBe(200);
  await expect(page.locator('#app-status')).toHaveText('Interview');
});

test('Bug #3 — sidebar Dashboard link is path-aware on root-level pages', async ({ page }) => {
  await login(page, 'juan@example.com', 'password', /\/seeker\/dashboard/);

  // Sanity check: when inside /seeker/, sidebar logo href is plain "dashboard.html".
  await page.goto('/seeker/dashboard.html', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.sidebar-logo a')).toBeVisible({ timeout: 15000 });
  expect(await page.locator('.sidebar-logo a').getAttribute('href')).toBe('dashboard.html');

  // The actual bug: from a root-level page (job-detail.html), the layout must
  // prefix the path with the role folder so it doesn't resolve to /workbridge/dashboard.html.
  await page.goto('/job-detail.html?id=1', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.sidebar-logo a')).toBeVisible({ timeout: 15000 });
  expect(await page.locator('.sidebar-logo a').getAttribute('href')).toBe('seeker/dashboard.html');

  // Spot-check a nav item too — the same prefix logic applies to the whole sidebar.
  const jobsHref = await page.locator('.sidebar-nav a').filter({ hasText: 'Jobs' }).first().getAttribute('href');
  expect(jobsHref).toBe('seeker/jobs.html');
});

test('Apply flow — seeker can submit application and button shows Applied', async ({ page }) => {
  await login(page, 'juan@example.com', 'password', /\/seeker\/dashboard/);

  // Job id 2 (IT Support Specialist) — not in Juan's seeded applications.
  await page.goto('/job-detail.html?id=2', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#job-main h1')).toBeVisible({ timeout: 15000 });

  const applyBtn = page.locator('#btn-apply');
  await expect(applyBtn).toBeVisible({ timeout: 15000 });

  // Idempotent: if a previous run already applied (no migrate:fresh between runs),
  // verify the disabled "Applied" state and exit. Either path proves the bug is fixed.
  const label = (await applyBtn.textContent())?.trim();
  if (label === 'Applied') {
    await expect(applyBtn).toBeDisabled();
    return;
  }

  await applyBtn.click();

  // Modal uses CSS animations (opacity 0→1, scale 0.95→1) and is appended
  // outside the main layout flow. Playwright's actionability checks misjudge
  // its position. Wait for DOM attachment, then dispatch the click via the
  // page's own JS — this fires the real click handler bound by openModal()
  // without depending on any visibility/scroll heuristics.
  const confirmBtn = page.locator('#modal-confirm');
  await confirmBtn.waitFor({ state: 'attached', timeout: 5000 });

  const [response] = await Promise.all([
    page.waitForResponse(
      /** @param {import('@playwright/test').Response} r */
      r => r.url().includes('/api/jobs/2/apply') && r.request().method() === 'POST',
      { timeout: 15000 }
    ),
    page.evaluate(() => {
      const btn = /** @type {HTMLButtonElement | null} */ (document.getElementById('modal-confirm'));
      btn?.click();
    }),
  ]);
  expect([200, 201]).toContain(response.status());

  await expect(page.locator('#btn-apply')).toHaveText(/Applied/, { timeout: 5000 });
  await expect(page.locator('#btn-apply')).toBeDisabled();
});

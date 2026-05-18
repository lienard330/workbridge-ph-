// @ts-check
const { test, expect } = require('@playwright/test');

test('Landing pages load', async ({ page }) => {
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  await page.route('**/favicon.ico', (route) =>
    route.fulfill({ status: 204, body: '', headers: { 'Content-Type': 'image/x-icon' } })
  );
  // Relative URLs use `use.baseURL` from playwright.config.cjs. Use /index.html so `serve` does not list the directory for `/`.
  const nav = { waitUntil: 'load' };
  await page.goto('/index.html', nav);
  await expect(page).toHaveTitle(/WorkBridge/);
  await page.goto('/jobs.html', nav);
  await page.goto('/companies.html', nav);
  await page.goto('/job-detail.html#id=1', nav);
  await page.goto('/company-detail.html#id=1', nav);
  if (errors.length) console.log('Console errors:', errors);
  expect(errors).toHaveLength(0);
});

test('Login seeker redirects to seeker dashboard', async ({ page }) => {
  await page.goto('/auth/login.html', { waitUntil: 'networkidle' });
  await page.fill('input[name="email"]', 'juan@example.com');
  await page.fill('input[name="password"]', 'password');
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/seeker\/dashboard(\.html)?(\?|$)/, { timeout: 15000 });
});

test('Router: logged out access to seeker dashboard', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.context().clearCookies();
  await page.evaluate(() => localStorage.clear());
  await page.goto('/seeker/dashboard.html', { waitUntil: 'networkidle' });
  expect(page.url().includes('login')).toBe(true);
});

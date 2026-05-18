const { test, expect } = require('@playwright/test');

test('Router: fresh context visit seeker dashboard when logged out', async ({ browser }) => {
  const baseURL = test.info().project.use.baseURL;
  const ctx = await browser.newContext({ baseURL });
  const page = await ctx.newPage();
  await page.goto('/seeker/dashboard.html', { waitUntil: 'networkidle' });
  expect(page.url().includes('login')).toBe(true);
  await ctx.close();
});

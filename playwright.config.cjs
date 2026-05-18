const { defineConfig } = require('@playwright/test');

/** Dedicated port so tests never reuse an old `serve` process started before serve.json existed */
const STATIC_PORT = 3333;
const STATIC_ORIGIN = `http://localhost:${STATIC_PORT}`;

module.exports = defineConfig({
  testDir: './tests',
  // Serialize: tests share a single Laravel API + DB. Parallel runs collide on
  // login rate limit (5/min per email+ip) and on data state.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: STATIC_ORIGIN,
    trace: 'on-first-retry',
  },
  webServer: {
    // Use `serve .` with cwd = project root (avoids Windows quoting issues with absolute paths)
    command: `npx --yes serve . -l ${STATIC_PORT}`,
    cwd: __dirname,
    url: STATIC_ORIGIN,
    reuseExistingServer: false,
    timeout: 120 * 1000,
  },
});

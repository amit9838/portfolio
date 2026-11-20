import { defineConfig, devices } from '@playwright/test';

// A port the dev server (4321+) won't take, so tests always hit the production build.
const PORT = 4399;

// Runs against the production build (`npm run build` first), served like GitHub Pages.
export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${PORT}/portfolio/`,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: `node scripts/serve-dist.mjs ${PORT}`,
    url: `http://localhost:${PORT}/portfolio/`,
    reuseExistingServer: false,
  },
});

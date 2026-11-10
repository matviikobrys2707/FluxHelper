import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  testMatch: ['test_*.js', 'test_*.py'],
  timeout: 120000,
  expect: { timeout: 10000 },
  fullyParallel: false,
  reporter: [['list'], ['json', { outputFile: 'test-results.json' }]],
  use: {
    baseURL: 'http://localhost:8127',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'python -m http.server 8127',
    url: 'http://localhost:8127',
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
});
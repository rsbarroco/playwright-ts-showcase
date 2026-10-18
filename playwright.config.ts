import { defineConfig, devices } from '@playwright/test';
import { config } from './src/config/config';

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? config.run.ciRetries : config.run.retries,
  workers: config.run.workers,
  timeout: config.run.timeoutMs,
  expect: { timeout: config.run.expectTimeoutMs },
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ...(isCI ? [['github'] as ['github']] : []),
  ],
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'ui',
      testDir: './tests/ui',
      use: { ...devices['Desktop Chrome'], baseURL: config.ui.baseUrl },
    },
    {
      name: 'api',
      testDir: './tests/api',
    },
  ],
});

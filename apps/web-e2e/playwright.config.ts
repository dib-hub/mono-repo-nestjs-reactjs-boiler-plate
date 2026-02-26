import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.BASE_URL || 'http://localhost:4200';

export default defineConfig({
  testDir: './src',
  testMatch: '**/*.e2e-spec.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  webServer: process.env.CI
    ? undefined
    : {
        command: 'nx serve web',
        port: 4200,
        reuseExistingServer: !process.env.CI,
      },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['chromium'] },
    },
    {
      name: 'firefox',
      use: { ...devices['firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['webkit'] },
    },
  ],
});

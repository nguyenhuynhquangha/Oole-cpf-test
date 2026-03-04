import { defineConfig, devices } from '@playwright/test';
import { ENV } from './config/env'

export default defineConfig({
  testDir: './tests',           // Where your tests live
  fullyParallel: true,          // Run tests in parallel
  retries: process.env.CI ? 2 : 0, // Retry on CI only
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',             // HTML report at playwright-report/index.html

  use: {
    baseURL: ENV.BASE_URL + '/cpf-test', // ← Update this to your app's URL
    trace: 'on-first-retry',         // Record trace on first retry
    screenshot: 'only-on-failure',   // Screenshot on failure
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
});
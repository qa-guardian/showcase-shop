/**
 * Local/CI run config for the Acme Orders Playwright suite.
 *
 * Specs live under specs/{flow}/*.spec.ts, one folder per flow — the
 * layout QA Guardian's repo-native test source import expects. QA Guardian
 * injects BASE_URL itself when it runs this suite; for a local run, copy
 * .env.example to .env.local.
 */
import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '.env.local') });

export default defineConfig({
  testDir: './specs',
  timeout: 30_000,
  expect: { timeout: 15_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'html',
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:4173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});

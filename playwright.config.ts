import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  timeout: 80 * 1000,
  expect: {
    timeout: 15000,
  },
  fullyParallel: true,
  forbidOnly: true,
  retries: 3,
  workers: 1,
  reporter: "html",
  use: {
    actionTimeout: 0,
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    headless: false,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  outputDir: "test-results",
});
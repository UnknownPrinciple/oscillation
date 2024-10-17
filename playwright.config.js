import { defineConfig } from "@playwright/test";

export default defineConfig({
  use: { headless: false },
  testMatch: /.*\.spec\.js/,
  reporter: [["list"], ["rollwright/coverage-reporter"]],
});

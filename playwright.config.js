import { defineConfig } from "@playwright/test";

let CI = process.env.CI != null;

export default defineConfig({
  use: { headless: CI },
  testMatch: /.*\.spec\.js/,
  reporter: [["list"], ["rollwright/coverage-reporter"]],
});

import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tools/test/fixtures",
  retries: 0,
  use: {
    baseURL: "http://localhost:3000",
    headless: true,
  },
});

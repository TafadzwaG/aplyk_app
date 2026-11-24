import { defineConfig } from "@playwright/test"
export default defineConfig({
  testDir: "./tests/e2e",
  outputDir: "./test-results",
  use: { baseURL: "http://localhost:5186", browserName: "chromium", channel: "chrome", screenshot: "only-on-failure" },
  webServer: { command: "npm run dev -- --host localhost --port 5186 --strictPort", url: "http://localhost:5186", reuseExistingServer: false },
})

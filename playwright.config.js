import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests', // Folder for test files
  timeout: 30000, // 30s timeout
  expect: { timeout: 5000 }, // 5s timeout for assertions
  reporter: 'html', // Generates an HTML report
  use: {
    baseURL: 'http://localhost:3000', // Your React app URL
    trace: 'on', // Enables tracing for debugging
  },
});

import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  webServer: {
    command: 'node tests/dev-with-mock.js',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});

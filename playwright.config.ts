import { defineConfig, devices } from '@playwright/test';

/**
 * Healthcare-Optimized Playwright Configuration
 * 
 * Configured for healthcare component screenshot testing with:
 * - Multiple healthcare-relevant devices (mobile, tablet, clinical desktop)
 * - Extended timeouts for medical data loading
 * - Visual regression testing for healthcare UI compliance
 * - CI-friendly settings for automated healthcare testing
 */
export default defineConfig({
  testDir: './tests',
  
  // Healthcare components may need longer loading times due to medical data
  timeout: 30000,
  expect: {
    // Visual comparison timeout for healthcare screenshots
    timeout: 10000,
    // Healthcare color accuracy is critical - use higher threshold
    toHaveScreenshot: {
      threshold: 0.2,
      maxDiffPixels: 500,
      webServer: [
        {
          command: 'PLAYWRIGHT_USE_START=1 node tests/dev-with-mock.js',
          port: 3000,
          reuseExistingServer: !process.env.CI,
          timeout: 180000,
        },
      ],
    },
    toMatchSnapshot: {
      threshold: 0.2,
      maxDiffPixels: 500,
    },
  },
  
  // Parallel testing - limit for healthcare screenshot consistency
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined, // Conservative for screenshot consistency
  
  // Reporter configuration for healthcare team
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/healthcare-test-results.json' }]
  ],
  
  use: {
    // Default to Next.js app; projects can override to Storybook
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    
    // Healthcare accessibility settings
    colorScheme: 'light', // Healthcare prefers light mode for clinical clarity
    
    // Extended action timeout for healthcare users (may have mobility issues)
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },

  projects: [
    // E2E/API tests against Next.js
    {
      name: 'e2e',
      testMatch: ['**/*.spec.ts'],
      testIgnore: ['**/screenshots/**'],
      use: {
        baseURL: 'http://localhost:3000',
      },
      webServer: [
        {
          command: 'npm run storybook',
          port: 6006,
          reuseExistingServer: !process.env.CI,
          timeout: 300000,
        },
      ],
    },
    // Screenshot projects against Storybook
    {
      name: 'healthcare-mobile',
      testMatch: ['**/screenshots/**/*.spec.ts'],
      use: {
        ...devices['iPhone SE'], // Common healthcare user device
        // Override for better healthcare mobile testing
        viewport: { width: 375, height: 667 },
        baseURL: 'http://localhost:6006',
      },
      webServer: [
        {
          command: 'npm run storybook',
          port: 6006,
          reuseExistingServer: !process.env.CI,
          timeout: 300000,
        },
      ],
    },
    {
      name: 'healthcare-tablet',
      testMatch: ['**/screenshots/**/*.spec.ts'],
      use: {
        ...devices['iPad'],
        // Clinical tablet dimensions
        viewport: { width: 768, height: 1024 },
        baseURL: 'http://localhost:6006',
      },
      webServer: [
        {
          command: 'npm run storybook',
          port: 6006,
          reuseExistingServer: !process.env.CI,
          timeout: 300000,
        },
      ],
    },
    {
      name: 'healthcare-desktop',
      testMatch: ['**/screenshots/**/*.spec.ts'],
      use: {
        ...devices['Desktop Chrome'],
        // Clinical workstation dimensions
        viewport: { width: 1440, height: 900 },
        baseURL: 'http://localhost:6006',
      },
    },
    {
      name: 'healthcare-accessibility',
      testMatch: ['**/screenshots/**/*.spec.ts'],
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1200, height: 800 },
        // High contrast for healthcare accessibility
        colorScheme: 'light',
        extraHTTPHeaders: {
          'prefers-reduced-motion': 'reduce'
        },
        baseURL: 'http://localhost:6006',
      },
      webServer: [
        {
          command: 'npm run storybook',
          port: 6006,
          reuseExistingServer: !process.env.CI,
          timeout: 300000,
        },
      ],
    },
  ],

  
  // Output directories for healthcare test artifacts
  outputDir: 'test-results/',
  
  // Global test settings for healthcare components
  globalTimeout: 600000, // 10 minutes for full healthcare component suite
  
  // (expect already configured above)
});

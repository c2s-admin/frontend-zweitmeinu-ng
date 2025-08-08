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
    // Healthcare-specific browser settings
    baseURL: 'http://localhost:6006', // Storybook for component testing
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
    {
      name: 'healthcare-mobile',
      use: {
        ...devices['iPhone SE'], // Common healthcare user device
        // Override for better healthcare mobile testing
        viewport: { width: 375, height: 667 },
      },
    },
    {
      name: 'healthcare-tablet', 
      use: {
        ...devices['iPad'],
        // Clinical tablet dimensions
        viewport: { width: 768, height: 1024 },
      },
    },
    {
      name: 'healthcare-desktop',
      use: {
        ...devices['Desktop Chrome'],
        // Clinical workstation dimensions
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: 'healthcare-accessibility',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1200, height: 800 },
        // Accessibility testing with reduced motion
        reducedMotion: 'reduce',
        // High contrast for healthcare accessibility
        colorScheme: 'light',
        extraHTTPHeaders: {
          'prefers-reduced-motion': 'reduce'
        }
      },
    },
  ],

  webServer: [
    {
      // Main Next.js application for integration tests
      command: 'node tests/dev-with-mock.js',
      port: 3000,
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
    {
      // Storybook server for component screenshot tests
      command: 'npm run storybook',
      port: 6006,
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
      // Healthcare Storybook needs time to build all components
    },
  ],
  
  // Output directories for healthcare test artifacts
  outputDir: 'test-results/',
  
  // Global test settings for healthcare components
  globalTimeout: 600000, // 10 minutes for full healthcare component suite
  
  // Screenshot comparison settings optimized for healthcare UI
  expect: {
    // Healthcare color accuracy is critical - use higher threshold
    toHaveScreenshot: {
      threshold: 0.2, // Allow for slight variations in healthcare colors
      maxDiffPixels: 500, // Reasonable diff for healthcare components
    },
    toMatchSnapshot: {
      threshold: 0.2,
      maxDiffPixels: 500,
    },
  },
});

import { test, expect } from '@playwright/test';

/**
 * Healthcare Screenshot System Smoke Test
 * 
 * Validates that the screenshot testing system is working correctly
 * before running the full healthcare component suite.
 */

test.describe('Healthcare Screenshot System Validation', () => {
  
  test('Storybook is accessible and healthcare components load', async ({ page }) => {
    // Navigate to Storybook homepage
    await page.goto('http://localhost:6006');
    
    // Wait for Storybook to load
    await page.waitForSelector('[data-testid="storybook-ui"]', { timeout: 30000 });
    
    // Verify healthcare components are listed in sidebar
    await expect(page.locator('text=Healthcare')).toBeVisible();
    
    // Take basic screenshot to validate system works
    const smokeScreenshot = await page.screenshot({
      fullPage: false,
      clip: { x: 0, y: 0, width: 1200, height: 600 }
    });
    
    expect(smokeScreenshot).toMatchSnapshot('healthcare-storybook-smoke.png');
  });
  
  test('Healthcare Button component renders correctly', async ({ page }) => {
    // Test one core healthcare component
    await page.goto('http://localhost:6006/?path=/story/healthcare-button--default');
    await page.waitForSelector('[data-testid="storybook-story"]', { timeout: 15000 });
    await page.waitForTimeout(1000);
    
    // Verify component is visible
    const buttonComponent = page.locator('button');
    await expect(buttonComponent).toBeVisible();
    
    // Take component screenshot
    const componentScreenshot = await page.screenshot({
      fullPage: false,
      clip: { x: 0, y: 0, width: 800, height: 400 }
    });
    
    expect(componentScreenshot).toMatchSnapshot('healthcare-button-smoke.png');
  });
  
  test('Healthcare mobile viewport works correctly', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Load healthcare component in mobile
    await page.goto('http://localhost:6006/?path=/story/healthcare-button--default');
    await page.waitForSelector('[data-testid="storybook-story"]');
    await page.waitForTimeout(500);
    
    // Verify mobile rendering
    const mobileScreenshot = await page.screenshot({
      fullPage: false,
      clip: { x: 0, y: 0, width: 375, height: 300 }
    });
    
    expect(mobileScreenshot).toMatchSnapshot('healthcare-mobile-smoke.png');
  });
});
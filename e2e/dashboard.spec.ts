import { test, expect } from '@playwright/test';

test.describe('Dashboard Feature Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test('should display dashboard with statistics', async ({ page }) => {
    await expect(page.locator('h2')).toHaveText('Dashboard');
    
    // Check if statistics cards are present
    await expect(page.locator('.card:has-text("Total Events")')).toBeVisible();
    await expect(page.locator('.card:has-text("Audio Clips")')).toBeVisible();
  });

  test('should display chart component', async ({ page }) => {
    // Check if mini chart component is rendered
    await expect(page.locator('app-mini-chart')).toBeVisible();
  });

  test('should show correct initial values', async ({ page }) => {
    // Initially should show 0 for both metrics
    await expect(page.locator('.card:has-text("Total Events") .value')).toHaveText('0');
    await expect(page.locator('.card:has-text("Audio Clips") .value')).toHaveText('0');
  });

  test('should update statistics when data changes', async ({ page }) => {
    // Mock timeline data
    await page.addInitScript(() => {
      // Mock TimelineService with test data
      window['mockTimelineEvents'] = [
        { timestamp: Date.now(), type: 'audio' },
        { timestamp: Date.now() - 1000, type: 'sensor' },
        { timestamp: Date.now() - 2000, type: 'audio' }
      ];
    });

    // Refresh page to apply mock data
    await page.reload();
    
    // Check if statistics are updated
    await expect(page.locator('.card:has-text("Total Events") .value')).toHaveText('3');
    await expect(page.locator('.card:has-text("Audio Clips") .value')).toHaveText('2');
  });
});

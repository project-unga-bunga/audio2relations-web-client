import { test, expect } from '@playwright/test';

test.describe('Navigation Tests', () => {
  test('should navigate to all main features', async ({ page }) => {
    await page.goto('/');
    
    // Check if we're on the record page (default route)
    await expect(page.locator('h2')).toHaveText('Record');
    
    // Test navigation to all features
    const features = [
      { path: '/record', title: 'Record' },
      { path: '/timeline', title: 'Timeline' },
      { path: '/calendar', title: 'Calendar' },
      { path: '/sensors', title: 'Sensors' },
      { path: '/transcription', title: 'Transcription' },
      { path: '/dashboard', title: 'Dashboard' },
      { path: '/diagram', title: 'Diagram' }
    ];

    for (const feature of features) {
      await page.goto(feature.path);
      await expect(page.locator('h2')).toHaveText(feature.title);
    }
  });

  test('should handle login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h2')).toHaveText('Login');
  });

  test('should redirect invalid routes to home', async ({ page }) => {
    await page.goto('/invalid-route');
    // Should redirect to record page (default)
    await expect(page.locator('h2')).toHaveText('Record');
  });
});

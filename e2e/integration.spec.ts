import { test, expect } from '@playwright/test';

test.describe('Integration Tests', () => {
  test('should complete full recording workflow', async ({ page }) => {
    // Start from record page
    await page.goto('/record');
    await expect(page.locator('h2')).toHaveText('Record');

    // Mock recording functionality
    await page.addInitScript(() => {
      window['mockAudioService'] = {
        startRecording: async () => Promise.resolve(),
        stopRecording: async () => Promise.resolve(new Blob(['test'], { type: 'audio/wav' })),
        saveLastRecordingToTimeline: () => {
          // Add event to timeline
          if (!window['mockTimelineEvents']) {
            window['mockTimelineEvents'] = [];
          }
          window['mockTimelineEvents'].push({
            timestamp: Date.now(),
            type: 'audio',
            title: 'Test Recording'
          });
        }
      };
    });

    // Start recording
    await page.locator('button:has-text("Start")').click();
    await expect(page.locator('button:has-text("Start")')).toBeDisabled();

    // Stop recording
    await page.locator('button:has-text("Stop")').click();
    await expect(page.locator('audio')).toBeVisible();

    // Save to timeline
    await page.locator('button:has-text("Save to Timeline")').click();

    // Navigate to timeline to verify recording was saved
    await page.goto('/timeline');
    await expect(page.locator('h2')).toHaveText('Timeline');
    await expect(page.locator('li:has-text("Test Recording")')).toBeVisible();

    // Navigate to dashboard to verify statistics updated
    await page.goto('/dashboard');
    await expect(page.locator('h2')).toHaveText('Dashboard');
    await expect(page.locator('.card:has-text("Total Events") .value')).toHaveText('1');
    await expect(page.locator('.card:has-text("Audio Clips") .value')).toHaveText('1');
  });

  test('should navigate through all features seamlessly', async ({ page }) => {
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
      
      // Verify page loads without errors
      await expect(page.locator('body')).not.toContainText('Error');
    }
  });

  test('should maintain data consistency across features', async ({ page }) => {
    // Mock timeline data
    await page.addInitScript(() => {
      const testTime = Date.now();
      window['mockTimelineEvents'] = [
        { timestamp: testTime, type: 'audio', title: 'Test Audio' },
        { timestamp: testTime - 1000, type: 'sensor', title: 'Test Sensor' }
      ];
    });

    // Check timeline
    await page.goto('/timeline');
    await expect(page.locator('li:has-text("Test Audio")')).toBeVisible();
    await expect(page.locator('li:has-text("Test Sensor")')).toBeVisible();

    // Check dashboard statistics
    await page.goto('/dashboard');
    await expect(page.locator('.card:has-text("Total Events") .value')).toHaveText('2');
    await expect(page.locator('.card:has-text("Audio Clips") .value')).toHaveText('1');

    // Check calendar for today's events
    await page.goto('/calendar');
    await expect(page.locator('li:has-text("Test Audio")')).toBeVisible();
    await expect(page.locator('li:has-text("Test Sensor")')).toBeVisible();
  });

  test('should handle authentication flow', async ({ page }) => {
    // Start from login
    await page.goto('/login');
    await expect(page.locator('h2')).toHaveText('Login');

    // Mock successful authentication
    await page.addInitScript(() => {
      window['mockAuthService'] = {
        login: async (email: string, password: string) => {
          if (email === 'test@example.com' && password === 'password123') {
            return { success: true, token: 'mock-token' };
          }
          throw new Error('Invalid credentials');
        }
      };
    });

    // Login
    await page.locator('input[type="email"]').fill('test@example.com');
    await page.locator('input[type="password"]').fill('password123');
    await page.locator('button[type="submit"]').click();

    // Should redirect to main app
    await expect(page).toHaveURL('/record');
    await expect(page.locator('h2')).toHaveText('Record');

    // Should be able to access all features after login
    await page.goto('/dashboard');
    await expect(page.locator('h2')).toHaveText('Dashboard');
  });

  test('should handle responsive design across features', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    const features = [
      { path: '/record', title: 'Record' },
      { path: '/dashboard', title: 'Dashboard' },
      { path: '/timeline', title: 'Timeline' },
      { path: '/calendar', title: 'Calendar' }
    ];

    for (const feature of features) {
      await page.goto(feature.path);
      await expect(page.locator('h2')).toHaveText(feature.title);
      
      // Verify page is usable on mobile
      await expect(page.locator('body')).toBeVisible();
    }

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });

    for (const feature of features) {
      await page.goto(feature.path);
      await expect(page.locator('h2')).toHaveText(feature.title);
    }
  });
});

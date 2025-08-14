import { test, expect } from '@playwright/test';

test.describe('Record Feature Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/record');
  });

  test('should display record page with controls', async ({ page }) => {
    await expect(page.locator('h2')).toHaveText('Record');
    
    // Check if all buttons are present
    await expect(page.locator('button:has-text("Start")')).toBeVisible();
    await expect(page.locator('button:has-text("Stop")')).toBeVisible();
    await expect(page.locator('button:has-text("Play")')).toBeVisible();
    await expect(page.locator('button:has-text("Save to Timeline")')).toBeVisible();
  });

  test('should handle recording controls state', async ({ page }) => {
    // Initially, Start should be enabled, Stop should be disabled
    await expect(page.locator('button:has-text("Start")')).toBeEnabled();
    await expect(page.locator('button:has-text("Stop")')).toBeDisabled();
    await expect(page.locator('button:has-text("Play")')).toBeDisabled();
    await expect(page.locator('button:has-text("Save to Timeline")')).toBeDisabled();
  });

  test('should simulate recording workflow', async ({ page }) => {
    // Mock the audio recording functionality
    await page.addInitScript(() => {
      // Mock AudioService methods
      window['mockAudioService'] = {
        startRecording: async () => Promise.resolve(),
        stopRecording: async () => Promise.resolve(new Blob(['test'], { type: 'audio/wav' })),
        saveLastRecordingToTimeline: () => {}
      };
    });

    // Click start recording
    await page.locator('button:has-text("Start")').click();
    
    // Wait for recording state
    await expect(page.locator('button:has-text("Start")')).toBeDisabled();
    await expect(page.locator('button:has-text("Stop")')).toBeEnabled();
    
    // Click stop recording
    await page.locator('button:has-text("Stop")').click();
    
    // Check if audio controls appear
    await expect(page.locator('audio')).toBeVisible();
    await expect(page.locator('button:has-text("Play")')).toBeEnabled();
    await expect(page.locator('button:has-text("Save to Timeline")')).toBeEnabled();
  });

  test('should handle audio playback', async ({ page }) => {
    // Mock audio URL
    await page.addInitScript(() => {
      window['mockAudioUrl'] = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT';
    });

    // Simulate having recorded audio
    await page.evaluate(() => {
      const audioElement = document.createElement('audio');
      audioElement.src = window['mockAudioUrl'];
      document.body.appendChild(audioElement);
    });

    await expect(page.locator('button:has-text("Play")')).toBeEnabled();
  });
});

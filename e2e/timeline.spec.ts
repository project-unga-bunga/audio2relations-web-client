import { test, expect } from '@playwright/test';

test.describe('Timeline Feature Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/timeline');
  });

  test('should display timeline page', async ({ page }) => {
    await expect(page.locator('h2')).toHaveText('Timeline');
  });

  test('should show timeline events when available', async ({ page }) => {
    // Mock timeline events
    await page.addInitScript(() => {
      window['mockTimelineEvents'] = [
        { 
          timestamp: Date.now() - 3600000, 
          type: 'audio',
          title: 'Recording 1'
        },
        { 
          timestamp: Date.now() - 7200000, 
          type: 'sensor',
          title: 'Sensor Data'
        },
        { 
          timestamp: Date.now() - 10800000, 
          type: 'transcription',
          title: 'Transcribed Text'
        }
      ];
    });

    // Refresh page to apply mock data
    await page.reload();
    
    // Check if events are displayed
    await expect(page.locator('li:has-text("Recording 1")')).toBeVisible();
    await expect(page.locator('li:has-text("Sensor Data")')).toBeVisible();
    await expect(page.locator('li:has-text("Transcribed Text")')).toBeVisible();
  });

  test('should display events in chronological order', async ({ page }) => {
    // Mock timeline events with specific timestamps
    await page.addInitScript(() => {
      const now = Date.now();
      window['mockTimelineEvents'] = [
        { timestamp: now - 1000, type: 'audio', title: 'Latest' },
        { timestamp: now - 2000, type: 'sensor', title: 'Middle' },
        { timestamp: now - 3000, type: 'transcription', title: 'Oldest' }
      ];
    });

    // Refresh page to apply mock data
    await page.reload();
    
    // Get all event titles
    const eventTitles = await page.locator('li').allTextContents();
    
    // Check order (should be newest first)
    expect(eventTitles[0]).toContain('Latest');
    expect(eventTitles[1]).toContain('Middle');
    expect(eventTitles[2]).toContain('Oldest');
  });

  test('should show empty state when no events', async ({ page }) => {
    // Mock empty timeline
    await page.addInitScript(() => {
      window['mockTimelineEvents'] = [];
    });

    // Refresh page to apply mock data
    await page.reload();
    
    // Should show empty timeline
    await expect(page.locator('ul')).toBeVisible();
    await expect(page.locator('ul li')).toHaveCount(0);
  });

  test('should display event timestamps correctly', async ({ page }) => {
    // Mock timeline event with specific timestamp
    await page.addInitScript(() => {
      const testTime = new Date('2024-01-15T10:30:00');
      window['mockTimelineEvents'] = [
        { timestamp: testTime.getTime(), type: 'audio', title: 'Test Event' }
      ];
    });

    // Refresh page to apply mock data
    await page.reload();
    
    // Check if timestamp is displayed
    await expect(page.locator('li:has-text("Test Event")')).toBeVisible();
    await expect(page.locator('li:has-text("10:30")')).toBeVisible();
  });
});

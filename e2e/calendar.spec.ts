import { test, expect } from '@playwright/test';

test.describe('Calendar Feature Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/calendar');
  });

  test('should display calendar with navigation', async ({ page }) => {
    await expect(page.locator('h2')).toHaveText('Calendar');
    
    // Check if navigation buttons are present
    await expect(page.locator('button:has-text("Prev")')).toBeVisible();
    await expect(page.locator('button:has-text("Next")')).toBeVisible();
  });

  test('should show current date by default', async ({ page }) => {
    const today = new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    await expect(page.locator('.calendar-nav div')).toContainText(today);
  });

  test('should navigate between days', async ({ page }) => {
    // Get initial date
    const initialDate = await page.locator('.calendar-nav div').textContent();
    
    // Click next day
    await page.locator('button:has-text("Next")').click();
    
    // Date should change
    const nextDate = await page.locator('.calendar-nav div').textContent();
    expect(nextDate).not.toBe(initialDate);
    
    // Click previous day
    await page.locator('button:has-text("Prev")').click();
    
    // Should be back to initial date
    const prevDate = await page.locator('.calendar-nav div').textContent();
    expect(prevDate).toBe(initialDate);
  });

  test('should display events for selected day', async ({ page }) => {
    // Add test events to localStorage to simulate TimelineService data
    await page.addInitScript(() => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const testEvents = [
        { 
          id: '1',
          timestamp: today.getTime() + 3600000, // 1 hour from start of day
          type: 'audio',
          payload: {}
        },
        { 
          id: '2',
          timestamp: today.getTime() + 7200000, // 2 hours from start of day
          type: 'sensor',
          payload: {}
        }
      ];
      
      localStorage.setItem('timeline-events-v1', JSON.stringify(testEvents));
    });

    // Refresh page to load the test data
    await page.reload();
    
    // Wait for events to be displayed
    await page.waitForTimeout(1000);
    
    // Check if events are displayed
    await expect(page.locator('li:has-text("audio")')).toBeVisible();
    await expect(page.locator('li:has-text("sensor")')).toBeVisible();
  });

  test('should show no events for empty day', async ({ page }) => {
    // Clear localStorage to simulate empty timeline
    await page.addInitScript(() => {
      localStorage.removeItem('timeline-events-v1');
    });

    // Refresh page to apply empty data
    await page.reload();
    
    // Wait for page to load
    await page.waitForTimeout(1000);
    
    // Should show empty list (ul exists but no li elements)
    await expect(page.locator('ul')).toBeVisible();
    await expect(page.locator('ul li')).toHaveCount(0);
  });

  test('should filter events by selected day', async ({ page }) => {
    // Add test events for different days
    await page.addInitScript(() => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const testEvents = [
        { 
          id: '1',
          timestamp: today.getTime() + 3600000, // Today
          type: 'audio',
          payload: {}
        },
        { 
          id: '2',
          timestamp: tomorrow.getTime() + 3600000, // Tomorrow
          type: 'sensor',
          payload: {}
        }
      ];
      
      localStorage.setItem('timeline-events-v1', JSON.stringify(testEvents));
    });

    // Refresh page to load the test data
    await page.reload();
    await page.waitForTimeout(1000);
    
    // Should show only today's events initially
    await expect(page.locator('li:has-text("audio")')).toBeVisible();
    await expect(page.locator('li:has-text("sensor")')).not.toBeVisible();
    
    // Navigate to tomorrow
    await page.locator('button:has-text("Next")').click();
    await page.waitForTimeout(500);
    
    // Should show only tomorrow's events
    await expect(page.locator('li:has-text("audio")')).not.toBeVisible();
    await expect(page.locator('li:has-text("sensor")')).toBeVisible();
  });
});

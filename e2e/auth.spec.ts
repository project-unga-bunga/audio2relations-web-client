import { test, expect } from '@playwright/test';

test.describe('Authentication Feature Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display login page', async ({ page }) => {
    await expect(page.locator('h2')).toHaveText('Login');
  });

  test('should have login form elements', async ({ page }) => {
    // Check if login form elements are present
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should validate form inputs', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const submitButton = page.locator('button[type="submit"]');

    // Test invalid email format
    await emailInput.fill('invalid-email');
    await passwordInput.fill('password123');
    await submitButton.click();

    // Should show validation error or prevent submission
    await expect(page.locator('.error, [aria-invalid="true"]')).toBeVisible();

    // Test valid email format
    await emailInput.clear();
    await emailInput.fill('test@example.com');
    await submitButton.click();

    // Should proceed with valid email
    await expect(page.locator('.error, [aria-invalid="true"]')).not.toBeVisible();
  });

  test('should handle successful login', async ({ page }) => {
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

    // Fill in valid credentials
    await page.locator('input[type="email"]').fill('test@example.com');
    await page.locator('input[type="password"]').fill('password123');
    await page.locator('button[type="submit"]').click();

    // Should redirect to main app after successful login
    await expect(page).toHaveURL('/record');
  });

  test('should handle failed login', async ({ page }) => {
    // Mock failed authentication
    await page.addInitScript(() => {
      window['mockAuthService'] = {
        login: async () => {
          throw new Error('Invalid credentials');
        }
      };
    });

    // Fill in invalid credentials
    await page.locator('input[type="email"]').fill('wrong@example.com');
    await page.locator('input[type="password"]').fill('wrongpassword');
    await page.locator('button[type="submit"]').click();

    // Should show error message
    await expect(page.locator('.error, .alert, [role="alert"]')).toBeVisible();
  });

  test('should maintain form state on failed submission', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');

    // Fill form
    await emailInput.fill('test@example.com');
    await passwordInput.fill('password123');

    // Mock failed submission
    await page.addInitScript(() => {
      window['mockAuthService'] = {
        login: async () => {
          throw new Error('Network error');
        }
      };
    });

    await page.locator('button[type="submit"]').click();

    // Form values should be preserved
    await expect(emailInput).toHaveValue('test@example.com');
    await expect(passwordInput).toHaveValue('password123');
  });
});

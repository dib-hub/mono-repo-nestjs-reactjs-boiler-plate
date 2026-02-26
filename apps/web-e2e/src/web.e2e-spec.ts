import { test, expect } from '@playwright/test';

test.describe('Web Application', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the home page', async ({ page }) => {
    await expect(page).toHaveTitle(/My Monorepo/);
  });

  test('should have a welcome heading', async ({ page }) => {
    const heading = page.locator('h2', {
      hasText: 'Welcome to the Monorepo!',
    });
    await expect(heading).toBeVisible();
  });

  test('should display API status section', async ({ page }) => {
    const section = page.locator('h3', { hasText: 'API Status' });
    await expect(section).toBeVisible();
  });

  test('should display feature cards', async ({ page }) => {
    const backendCard = page.locator('text=Backend');
    const frontendCard = page.locator('text=Frontend');
    const databaseCard = page.locator('text=Database');

    await expect(backendCard).toBeVisible();
    await expect(frontendCard).toBeVisible();
    await expect(databaseCard).toBeVisible();
  });
});

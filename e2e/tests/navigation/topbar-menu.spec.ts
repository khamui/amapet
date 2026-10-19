import { test, expect } from '@playwright/test';

test.describe('Topbar user menu', () => {
  test('desktop: user button opens menu with Profile item', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const userButton = page.locator('p-button:has(i.pi-user)').first();
    await expect(userButton).toBeVisible({ timeout: 10000 });
    await userButton.click();

    const menu = page.locator('.p-menu-overlay, .p-menu').filter({ hasText: 'Profile' }).first();
    await expect(menu).toBeVisible({ timeout: 5000 });
    await expect(menu.getByText('Profile')).toBeVisible();
  });

  test('mobile: overflow ellipsis opens menu with Profile and Logout', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const overflowButton = page.locator('p-button:has(i.pi-ellipsis-v)').first();
    await expect(overflowButton).toBeVisible({ timeout: 10000 });
    await overflowButton.click();

    const menu = page.locator('.p-menu-overlay, .p-menu').filter({ hasText: 'Logout' }).first();
    await expect(menu).toBeVisible({ timeout: 5000 });
    await expect(menu.getByText('Profile')).toBeVisible();
    await expect(menu.getByText('Logout')).toBeVisible();
  });
});

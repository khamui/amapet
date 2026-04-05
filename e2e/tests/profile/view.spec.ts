import { test, expect } from '@playwright/test';
import { ApiHelper } from '../../support/helpers/api.helper';

test.describe('Profile - View', () => {
  test.use({ storageState: '.auth/user.json' });

  test('profile page displays user info', async ({ page }) => {
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');

    // Profile page should load
    await expect(page.locator('body')).toBeVisible();

    // Should show the username somewhere
    await expect(page.locator('text=e2e_test_user')).toBeVisible();
  });

  test('profile shows users circles', async ({ page, request }) => {
    const api = new ApiHelper(request);

    // Create a circle owned by the auth user
    const testUser = await api.createTestUser({
      email: 'e2e-user@test.com',
      username: 'e2e_test_user',
    });
    const circle = await api.createCircle(
      testUser.token,
      `profile-${Date.now() % 100000}`,
      testUser.user._id
    );

    await page.goto('/profile/circles');
    await page.waitForLoadState('networkidle');

    // My Circles heading should be visible (use h1 selector for precision)
    await expect(page.locator('h1:has-text("My Circles")')).toBeVisible({ timeout: 10000 });

    // The test circle should appear in the list
    
    await expect(page.locator(`text=${circle.name}`)).toBeVisible({ timeout: 10000 });
  });
});

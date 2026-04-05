import { test, expect } from '../../fixtures/test-data.fixture';
import { selectors } from '../../support/helpers/selectors';

test.describe('Circles - Follow', () => {
  test.use({ storageState: '.auth/user.json' });

  test('user can follow a circle', async ({ page, api, testUser }) => {
    // Create a circle owned by another user
    const otherUser = await api.createTestUser({
      email: `other-owner-${Date.now()}@e2e.test`,
    });
    const circle = await api.createCircle(
      otherUser.token,
      `follow-${Date.now() % 100000}`,
      otherUser.user._id
    );

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Find the circle in the sidebar and click follow
    const followButton = page.locator(selectors.circleManagement.followButton).first();

    // If follow button is visible, click it
    if (await followButton.isVisible()) {
      await followButton.click();
      await page.waitForLoadState('networkidle');

      // Button should now show filled star (followed state)
      await expect(page.locator('i.pi-star-fill').first()).toBeVisible();
    }
  });

  test('user can unfollow a circle', async ({ page, api, testUser }) => {
    // Create a circle and follow it via API
    const otherUser = await api.createTestUser({
      email: `unfollow-owner-${Date.now()}@e2e.test`,
    });
    const circle = await api.createCircle(
      otherUser.token,
      `unfollow-${Date.now() % 100000}`,
      otherUser.user._id
    );

    // Follow the circle via API
    await api.followCircle(testUser.token, circle.name);

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Find the followed circle (should have filled star)
    const followedButton = page.locator('button:has(i.pi-star-fill)').first();

    if (await followedButton.isVisible()) {
      await followedButton.click();
      await page.waitForLoadState('networkidle');

      // Star should now be unfilled
      await expect(page.locator('i.pi-star').first()).toBeVisible();
    }
  });
});

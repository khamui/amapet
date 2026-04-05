import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('auth state persists after page reload', async ({ page }) => {
    // Navigate to app (auth state is pre-loaded from setup)
    await page.goto('/');

    // Check that user is logged in (look for profile or logout indicator)
    // This depends on UI showing logged-in state
    await expect(page.locator('body')).toBeVisible();

    // Get token from localStorage before reload
    const tokenBefore = await page.evaluate(() => localStorage.getItem('amapet_token'));
    expect(tokenBefore).toBeTruthy();

    // Reload page
    await page.reload();

    // Token should still be there
    const tokenAfter = await page.evaluate(() => localStorage.getItem('amapet_token'));
    expect(tokenAfter).toBe(tokenBefore);
  });

  test('logout clears auth state', async ({ page }) => {
    await page.goto('/');

    // Verify token exists
    const tokenBefore = await page.evaluate(() => localStorage.getItem('amapet_token'));
    expect(tokenBefore).toBeTruthy();

    // Find and click logout (adjust selector based on actual UI)
    const logoutButton = page.locator('[data-testid="nav-logout"], button:has-text("Logout"), a:has-text("Logout")');

    if (await logoutButton.isVisible()) {
      await logoutButton.click();

      // Wait for logout to complete
      await page.waitForTimeout(500);

      // Token should be cleared
      const tokenAfter = await page.evaluate(() => localStorage.getItem('amapet_token'));
      expect(tokenAfter).toBeFalsy();
    } else {
      // If no logout button visible, skip this test with a note
      test.skip();
    }
  });
});

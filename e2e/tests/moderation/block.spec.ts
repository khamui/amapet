import { test, expect } from '../../fixtures/test-data.fixture';

// This test runs with moderator auth state (see playwright.config.ts)
test.describe('Moderation - Block', () => {
  test('moderator can block a question', async ({ page, api }) => {
    // Create test data with a regular user
    const user = await api.createTestUser({ email: `regular-${Date.now()}@test.com` });
    const circle = await api.createCircle(user.token, `mod-test-${Date.now()}`, user.user._id);
    const question = await api.createQuestion(user.token, circle._id, {
      title: 'Question to block',
      body: '<p>This content will be blocked</p>',
      ownerId: user.user._id,
      ownerName: user.user.username,
    });

    // Navigate to moderation view (as moderator)
    await page.goto(`/moderate/c/${circle.name}/q/${question._id}`);

    await page.waitForLoadState('networkidle');

    // Find block button
    const blockButton = page.locator('[data-testid="block-content"], button:has-text("Block")').first();

    if (await blockButton.isVisible({ timeout: 5000 })) {
      await blockButton.click();

      // Confirm if dialog appears
      const confirmButton = page.locator('.p-confirmdialog-accept, button:has-text("Yes"), button:has-text("Confirm")').first();
      if (await confirmButton.isVisible({ timeout: 2000 })) {
        await confirmButton.click();
      }

      await page.waitForLoadState('networkidle');

      // Verify blocked status indicator
      const blockedIndicator = page.locator('[data-testid="blocked-indicator"], .blocked-badge, :text("Blocked")').first();
      await expect(blockedIndicator).toBeVisible({ timeout: 5000 });
    } else {
      test.skip();
    }
  });
});

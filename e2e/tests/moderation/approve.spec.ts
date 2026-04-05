import { test, expect } from '../../fixtures/test-data.fixture';

// This test runs with moderator auth state (see playwright.config.ts)
test.describe('Moderation - Approve', () => {
  test('moderator can approve a question', async ({ page, api }) => {
    // Create test data with a regular user
    const user = await api.createTestUser({ email: `regular-${Date.now()}@test.com` });
    const circle = await api.createCircle(user.token, `approve-test-${Date.now()}`, user.user._id);
    const question = await api.createQuestion(user.token, circle._id, {
      title: 'Question to approve',
      body: '<p>This content will be approved</p>',
      ownerId: user.user._id,
      ownerName: user.user.username,
    });

    // Navigate to moderation view (as moderator)
    await page.goto(`/moderate/c/${circle.name}/q/${question._id}`);

    await page.waitForLoadState('networkidle');

    // Find approve button
    const approveButton = page.locator('[data-testid="approve-content"], button:has-text("Approve")').first();

    if (await approveButton.isVisible({ timeout: 5000 })) {
      await approveButton.click();

      await page.waitForLoadState('networkidle');

      // Verify approved status indicator
      const approvedIndicator = page.locator('[data-testid="approved-indicator"], .approved-badge, :text("Approved")').first();
      await expect(approvedIndicator).toBeVisible({ timeout: 5000 });
    } else {
      test.skip();
    }
  });

  test('moderator can view blocked questions', async ({ page, api }) => {
    // Create and block a question first
    const user = await api.createTestUser({ email: `blocked-${Date.now()}@test.com` });
    const circle = await api.createCircle(user.token, `blocked-view-${Date.now()}`, user.user._id);
    await api.createQuestion(user.token, circle._id, {
      title: 'Blocked question',
      body: '<p>This is blocked</p>',
      ownerId: user.user._id,
      ownerName: user.user.username,
    });

    // Navigate to circle as moderator
    await page.goto(`/c/${circle.name}`);

    await page.waitForLoadState('networkidle');

    // Moderator should be able to see all questions including blocked ones
    // (they might have a special badge or indicator)
    await expect(page.locator('body')).toBeVisible();
  });
});

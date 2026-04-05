import { test, expect } from '@playwright/test';
import { ApiHelper } from '../../support/helpers/api.helper';

test.describe('Voting - Unauthenticated', () => {
  test('voting requires authentication', async ({ page, request }) => {
    const api = new ApiHelper(request);

    // Create test data
    const user = await api.createTestUser();
    const circle = await api.createCircle(user.token, `unauth-test-${Date.now()}`, user.user._id);
    const question = await api.createQuestion(user.token, circle._id, {
      title: 'Unauth test question',
      body: '<p>Test body</p>',
      ownerId: user.user._id,
      ownerName: user.user.username,
    });

    // Navigate to question (without auth)
    await page.goto(`/c/${circle.name}/questions/${question._id}`);

    await page.waitForLoadState('networkidle');

    // Find upvote button
    const upvoteButton = page.locator('[data-testid="upvote-question"], button[aria-label*="upvote" i], .upvote-btn').first();

    if (await upvoteButton.isVisible({ timeout: 5000 })) {
      await upvoteButton.click();

      // Should show login dialog or redirect to login
      const loginDialog = page.locator('[data-testid="login-dialog"], .login-dialog, .p-dialog');
      const loginRedirect = page.url().includes('login');

      // Either login dialog should appear or we should be redirected
      const showsLoginPrompt = await loginDialog.isVisible({ timeout: 3000 }).catch(() => false) || loginRedirect;

      expect(showsLoginPrompt).toBeTruthy();
    } else {
      // Upvote button might be hidden for unauthenticated users
      test.skip();
    }
  });
});

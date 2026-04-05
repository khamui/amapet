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

    // Navigate to question without auth
    await page.goto(`/${circle.name}/questions/${question._id}`);
    await page.waitForLoadState('networkidle');

    // Click upvote button
    const upvoteButton = page.locator('ama-vote p-button[icon="pi pi-chevron-up"]').first();
    await expect(upvoteButton).toBeVisible({ timeout: 10000 });
    await upvoteButton.click();

    // Login dialog should appear
    const loginDialog = page.getByRole('dialog', { name: 'Sign In' });
    await expect(loginDialog).toBeVisible({ timeout: 5000 });
  });
});

import { test, expect } from '@playwright/test';
import { ApiHelper } from '../../support/helpers/api.helper';
import { selectors } from '../../support/helpers/selectors';

test.describe('Moderation - Close Comments', () => {
  test.use({ storageState: '.auth/moderator.json' });

  test('moderator can close comments on question', async ({ page, request }) => {
    const api = new ApiHelper(request);

    // Create moderator user (same as auth state)
    const moderator = await api.createTestUser({
      email: 'e2e-moderator@test.com',
      username: 'e2e_test_moderator',
    });

    // Create circle owned by moderator (so they have moderation rights)
    const circle = await api.createCircle(
      moderator.token,
      `closecom-${Date.now() % 100000}`,
      moderator.user._id
    );
    const question = await api.createQuestion(moderator.token, circle._id, {
      title: `Close Comments Test ${Date.now()}`,
      body: '<p>Question to close comments</p>',
      ownerId: moderator.user._id,
      ownerName: moderator.user.username,
    });

    await page.goto(`/moderate/${circle.name}/q/${question._id}`);
    await page.waitForLoadState('networkidle');

    // Toggle the close comments switch
    const closeToggle = page.locator(selectors.moderationDetail.closeComments);
    await expect(closeToggle).toBeVisible({ timeout: 5000 });
    await closeToggle.click();
    await page.waitForLoadState('networkidle');

    // Navigate to question detail to verify
    await page.goto(`/${circle.name}/questions/${question._id}`);
    await page.waitForLoadState('networkidle');

    // Should see "Comments are closed" message
    await expect(page.locator(selectors.questionDetail.commentsClosed)).toBeVisible();
  });

  test('closed question shows comments closed message', async ({
    page,
    request,
  }) => {
    const api = new ApiHelper(request);

    const moderator = await api.createTestUser({
      email: 'e2e-moderator@test.com',
      username: 'e2e_test_moderator',
    });

    const circle = await api.createCircle(
      moderator.token,
      `closedq-${Date.now() % 100000}`,
      moderator.user._id
    );
    const question = await api.createQuestion(moderator.token, circle._id, {
      title: `Already Closed Test ${Date.now()}`,
      body: '<p>Question already closed</p>',
      ownerId: moderator.user._id,
      ownerName: moderator.user.username,
    });

    // Close the question via API
    await api.closeQuestion(moderator.token, circle._id, question._id, true);

    await page.goto(`/${circle.name}/questions/${question._id}`);
    await page.waitForLoadState('networkidle');

    // Should see "Comments are closed" message
    await expect(page.locator(selectors.questionDetail.commentsClosed)).toBeVisible();

    // Main editor should not be visible
    await expect(
      page.locator(selectors.questionDetail.mainAnswerEditor)
    ).not.toBeVisible();
  });
});

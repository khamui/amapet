import { test, expect } from '@playwright/test';
import { ApiHelper } from '../../support/helpers/api.helper';
import { selectors } from '../../support/helpers/selectors';

test.describe('Moderation - Approve', () => {
  test.use({ storageState: '.auth/moderator.json' });

  test('moderator can approve a question', async ({ page, request }) => {
    const api = new ApiHelper(request);

    const moderator = await api.createTestUser({
      email: 'e2e-moderator@test.com',
      username: 'e2e_test_moderator',
    });

    const circle = await api.createCircle(
      moderator.token,
      `appq-${Date.now() % 100000}`,
      moderator.user._id
    );
    const question = await api.createQuestion(moderator.token, circle._id, {
      title: `Approve Question Test ${Date.now()}`,
      body: '<p>This content will be approved</p>',
      ownerId: moderator.user._id,
      ownerName: moderator.user.username,
    });

    await page.goto(`/moderate/${circle.name}/q/${question._id}`);
    await page.waitForLoadState('networkidle');

    // Click approve button
    const approveButton = page.locator(selectors.moderationDetail.approveQuestion);
    await expect(approveButton).toBeVisible({ timeout: 5000 });
    await expect(approveButton).toContainText('Approve');
    await approveButton.click();
    await page.waitForLoadState('networkidle');

    // Button should now show "Unapprove"
    await expect(approveButton).toContainText('Unapprove');

    // Navigate to question detail and verify approved badge
    await page.goto(`/${circle.name}/questions/${question._id}`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=Approved').first()).toBeVisible({ timeout: 5000 });
  });

  test('moderator can approve an answer', async ({ page, request }) => {
    const api = new ApiHelper(request);

    const moderator = await api.createTestUser({
      email: 'e2e-moderator@test.com',
      username: 'e2e_test_moderator',
    });

    const circle = await api.createCircle(
      moderator.token,
      `appans-${Date.now() % 100000}`,
      moderator.user._id
    );
    const question = await api.createQuestion(moderator.token, circle._id, {
      title: `Approve Answer Test ${Date.now()}`,
      body: '<p>Question body</p>',
      ownerId: moderator.user._id,
      ownerName: moderator.user.username,
    });
    await api.createAnswer(moderator.token, {
      parentId: question._id,
      parentType: 'question',
      answerText: '<p>Answer to approve</p>',
      questionId: question._id,
      circleId: circle._id,
      ownerId: moderator.user._id,
      ownerName: moderator.user.username,
    });

    await page.goto(`/moderate/${circle.name}/q/${question._id}`);
    await page.waitForLoadState('networkidle');

    // Click approve answer button
    const approveButton = page.locator(selectors.moderationDetail.approveAnswer).first();
    await expect(approveButton).toBeVisible({ timeout: 5000 });
    await approveButton.click();
    await page.waitForLoadState('networkidle');

    // Verify approved badge appears on the answer
    await expect(page.locator('text=Approved').first()).toBeVisible({ timeout: 5000 });
  });
});

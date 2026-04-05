import { test, expect } from '@playwright/test';
import { ApiHelper } from '../../support/helpers/api.helper';
import { selectors } from '../../support/helpers/selectors';

test.describe('Moderation - Block', () => {
  test.use({ storageState: '.auth/moderator.json' });

  test('moderator can block a question', async ({ page, request }) => {
    const api = new ApiHelper(request);

    const moderator = await api.createTestUser({
      email: 'e2e-moderator@test.com',
      username: 'e2e_test_moderator',
    });

    const circle = await api.createCircle(
      moderator.token,
      `blkq-${Date.now() % 100000}`,
      moderator.user._id
    );
    const question = await api.createQuestion(moderator.token, circle._id, {
      title: `Block Question Test ${Date.now()}`,
      body: '<p>This content will be blocked</p>',
      ownerId: moderator.user._id,
      ownerName: moderator.user.username,
    });

    await page.goto(`/moderate/${circle.name}/q/${question._id}`);
    await page.waitForLoadState('networkidle');

    // Click block button
    const blockButton = page.locator(selectors.moderationDetail.blockQuestion);
    await expect(blockButton).toBeVisible({ timeout: 5000 });
    await expect(blockButton).toContainText('Block');
    await blockButton.click();
    await page.waitForLoadState('networkidle');

    // Button should now show "Unblock"
    await expect(blockButton).toContainText('Unblock');
  });

  test('moderator can block an answer', async ({ page, request }) => {
    const api = new ApiHelper(request);

    const moderator = await api.createTestUser({
      email: 'e2e-moderator@test.com',
      username: 'e2e_test_moderator',
    });

    const circle = await api.createCircle(
      moderator.token,
      `blkans-${Date.now() % 100000}`,
      moderator.user._id
    );
    const question = await api.createQuestion(moderator.token, circle._id, {
      title: `Block Answer Test ${Date.now()}`,
      body: '<p>Question body</p>',
      ownerId: moderator.user._id,
      ownerName: moderator.user.username,
    });
    await api.createAnswer(moderator.token, {
      parentId: question._id,
      parentType: 'question',
      answerText: '<p>Answer to block</p>',
      questionId: question._id,
      circleId: circle._id,
      ownerId: moderator.user._id,
      ownerName: moderator.user.username,
    });

    await page.goto(`/moderate/${circle.name}/q/${question._id}`);
    await page.waitForLoadState('networkidle');

    // Click block answer button
    const blockButton = page.locator(selectors.moderationDetail.blockAnswer).first();
    await expect(blockButton).toBeVisible({ timeout: 5000 });
    await blockButton.click();
    await page.waitForLoadState('networkidle');

    // Verify blocked badge appears on the answer
    await expect(page.locator('text=Blocked').first()).toBeVisible({ timeout: 5000 });
  });

  test('blocked answer hidden from non-moderators', async ({ page, request, browser }) => {
    const api = new ApiHelper(request);

    const moderator = await api.createTestUser({
      email: 'e2e-moderator@test.com',
      username: 'e2e_test_moderator',
    });

    const circle = await api.createCircle(
      moderator.token,
      `blkhide-${Date.now() % 100000}`,
      moderator.user._id
    );
    const question = await api.createQuestion(moderator.token, circle._id, {
      title: `Hidden Answer Test ${Date.now()}`,
      body: '<p>Question body</p>',
      ownerId: moderator.user._id,
      ownerName: moderator.user.username,
    });
    const answer = await api.createAnswer(moderator.token, {
      parentId: question._id,
      parentType: 'question',
      answerText: '<p>This answer will be blocked</p>',
      questionId: question._id,
      circleId: circle._id,
      ownerId: moderator.user._id,
      ownerName: moderator.user.username,
    });

    // Block the answer via API
    await api.updateAnswerStatus(moderator.token, answer._id, 'blocked');

    // As moderator, the blocked answer should still be visible
    await page.goto(`/${circle.name}/questions/${question._id}`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=This answer will be blocked')).toBeVisible({ timeout: 10000 });

    // As a non-moderator (regular user), the blocked answer should be hidden
    const userContext = await browser.newContext({ storageState: '.auth/user.json' });
    const userPage = await userContext.newPage();
    await userPage.goto(`/${circle.name}/questions/${question._id}`);
    await userPage.waitForLoadState('networkidle');
    await expect(userPage.locator('text=This answer will be blocked')).not.toBeVisible({ timeout: 5000 });
    await userContext.close();
  });
});

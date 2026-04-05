import { test, expect } from '@playwright/test';
import { ApiHelper } from '../../support/helpers/api.helper';

test.describe('Voting - Downvote', () => {
  test.use({ storageState: '.auth/user.json' });

  test('user can downvote a question', async ({ page, request }) => {
    const api = new ApiHelper(request);

    // Create a question by another user
    const otherUser = await api.createTestUser({
      email: `downvote-q-${Date.now()}@e2e.test`,
    });
    const circle = await api.createCircle(
      otherUser.token,
      `dvoteq-${Date.now() % 100000}`,
      otherUser.user._id
    );
    const question = await api.createQuestion(otherUser.token, circle._id, {
      title: `Downvote Test Question ${Date.now()}`,
      body: '<p>Question to downvote</p>',
      ownerId: otherUser.user._id,
      ownerName: otherUser.user.username,
    });

    await page.goto(`/${circle.name}/questions/${question._id}`);
    await page.waitForLoadState('networkidle');

    // Vote count should start at 1 (auto-upvoted by creator)
    const voteDisplay = page.locator('ama-vote .font-bold').first();
    await expect(voteDisplay).toHaveText('1');

    // Click the downvote button
    const downvoteButton = page.locator('ama-vote p-button[icon="pi pi-chevron-down"]').first();
    await downvoteButton.evaluate((el) => el.scrollIntoView({ block: 'center' }));
    await downvoteButton.click();
    await page.waitForLoadState('networkidle');

    // Vote count should decrease to 0
    await expect(voteDisplay).toHaveText('0');

    // Downvote button should now be disabled
    await expect(downvoteButton.locator('button')).toBeDisabled();
  });

  test('user can downvote an answer', async ({ page, request }) => {
    const api = new ApiHelper(request);

    const testUser = await api.createTestUser({
      email: 'e2e-user@test.com',
      username: 'e2e_test_user',
    });

    // Create an answer by another user
    const otherUser = await api.createTestUser({
      email: `downvote-a-${Date.now()}@e2e.test`,
    });

    const circle = await api.createCircle(
      testUser.token,
      `dvotea-${Date.now() % 100000}`,
      testUser.user._id
    );
    const question = await api.createQuestion(testUser.token, circle._id, {
      title: `Downvote Answer Test ${Date.now()}`,
      body: '<p>Question body</p>',
      ownerId: testUser.user._id,
      ownerName: testUser.user.username,
    });
    await api.createAnswer(otherUser.token, {
      parentId: question._id,
      parentType: 'question',
      answerText: '<p>Answer to downvote</p>',
      questionId: question._id,
      circleId: circle._id,
      ownerId: otherUser.user._id,
      ownerName: otherUser.user.username,
    });

    await page.goto(`/${circle.name}/questions/${question._id}`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('p-progressBar')).not.toBeVisible({ timeout: 10000 });

    // Answer vote count should start at 1 (auto-upvoted by creator)
    const answerVoteDisplay = page.locator('ama-answers ama-vote .font-bold').first();
    await expect(answerVoteDisplay).toHaveText('1', { timeout: 10000 });

    // Click the downvote button on the answer
    const answerDownvote = page.locator('ama-answers ama-vote p-button[icon="pi pi-chevron-down"]').first();
    await answerDownvote.evaluate((el) => el.scrollIntoView({ block: 'center' }));
    await answerDownvote.click();
    await page.waitForLoadState('networkidle');

    // Vote count should decrease to 0
    await expect(answerVoteDisplay).toHaveText('0');

    // Downvote button should now be disabled
    await expect(answerDownvote.locator('button')).toBeDisabled();
  });
});

import { test, expect } from '@playwright/test';
import { ApiHelper } from '../../support/helpers/api.helper';
import { selectors } from '../../support/helpers/selectors';

test.describe('Voting - Upvote', () => {
  test.use({ storageState: '.auth/user.json' });

  test('can upvote a question', async ({ page, request }) => {
    const api = new ApiHelper(request);

    // Create a question by another user (can't upvote own in some setups)
    const otherUser = await api.createTestUser({
      email: `upvote-q-${Date.now()}@e2e.test`,
    });
    const circle = await api.createCircle(
      otherUser.token,
      `upvoteq-${Date.now() % 100000}`,
      otherUser.user._id
    );
    const question = await api.createQuestion(otherUser.token, circle._id, {
      title: `Upvote Test Question ${Date.now()}`,
      body: '<p>Question to upvote</p>',
      ownerId: otherUser.user._id,
      ownerName: otherUser.user.username,
    });

    await page.goto(`/${circle.name}/questions/${question._id}`);
    await page.waitForLoadState('networkidle');

    // Vote count should start at 1 (auto-upvoted by creator)
    const voteDisplay = page.locator('ama-vote .font-bold').first();
    await expect(voteDisplay).toHaveText('1');

    // Click the upvote button
    const upvoteButton = page.locator('ama-vote p-button[icon="pi pi-chevron-up"]').first();
    await upvoteButton.click();
    await page.waitForLoadState('networkidle');

    // Vote count should increase to 2
    await expect(voteDisplay).toHaveText('2');

    // Upvote button should now be disabled (already voted)
    await expect(upvoteButton.locator('button')).toBeDisabled();
  });

  test('can upvote an answer', async ({ page, request }) => {
    const api = new ApiHelper(request);

    const otherUser = await api.createTestUser({
      email: `upvote-a-${Date.now()}@e2e.test`,
    });
    const testUser = await api.createTestUser({
      email: 'e2e-user@test.com',
      username: 'e2e_test_user',
    });

    const circle = await api.createCircle(
      testUser.token,
      `upvotea-${Date.now() % 100000}`,
      testUser.user._id
    );
    const question = await api.createQuestion(testUser.token, circle._id, {
      title: `Upvote Answer Test ${Date.now()}`,
      body: '<p>Question body</p>',
      ownerId: testUser.user._id,
      ownerName: testUser.user.username,
    });
    await api.createAnswer(otherUser.token, {
      parentId: question._id,
      parentType: 'question',
      answerText: '<p>Answer to upvote</p>',
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

    // Click the upvote button on the answer
    const answerUpvote = page.locator('ama-answers ama-vote p-button[icon="pi pi-chevron-up"]').first();
    await answerUpvote.evaluate((el) => el.scrollIntoView({ block: 'center' }));
    await answerUpvote.click();
    await page.waitForLoadState('networkidle');

    // Vote count should increase to 2
    await expect(answerVoteDisplay).toHaveText('2');

    // Upvote button should now be disabled
    await expect(answerUpvote.locator('button')).toBeDisabled();
  });
});

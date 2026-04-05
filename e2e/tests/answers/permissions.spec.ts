import { test, expect } from '../../fixtures/test-data.fixture';
import { selectors } from '../../support/helpers/selectors';

test.describe('Answers - Permissions', () => {
  test.use({ storageState: '.auth/user.json' });

  test('non-owner cannot see edit/delete buttons on others answers', async ({
    page,
    api,
    testUser,
    testCircle,
    testQuestion,
  }) => {
    // Create answer by a different user
    const otherUser = await api.createTestUser({
      email: `other-${Date.now()}@e2e.test`,
    });

    await api.createAnswer(otherUser.token, {
      parentId: testQuestion._id,
      parentType: 'question',
      answerText: '<p>Answer from other user</p>',
      questionId: testQuestion._id,
      circleId: testCircle._id,
      ownerId: otherUser.user._id,
      ownerName: otherUser.user.username,
    });

    const circleName = testCircle.name.replace('c/', '');
    await page.goto(`/c/${circleName}/questions/${testQuestion._id}`);
    await page.waitForLoadState('networkidle');

    // Find the answer from the other user
    const otherUserAnswer = page.locator(`text=Answer from other user`);
    await expect(otherUserAnswer).toBeVisible();

    // Edit/Delete buttons should not be visible for the other user's answer
    // The logged-in user (testUser) is not the owner of this answer
    const answerSection = page.locator('div').filter({ hasText: 'Answer from other user' }).first();

    // These buttons should not exist for non-owner
    await expect(answerSection.locator(selectors.answer.editButton)).not.toBeVisible();
    await expect(answerSection.locator(selectors.answer.deleteButton)).not.toBeVisible();
  });
});

import { test, expect } from '@playwright/test';
import { ApiHelper } from '../../support/helpers/api.helper';
import { selectors } from '../../support/helpers/selectors';

test.describe('Answers - Mark Solution', () => {
  test.use({ storageState: '.auth/user.json' });

  test('question owner can mark an answer as solution', async ({ page, request }) => {
    const api = new ApiHelper(request);

    // Create test user that matches auth state
    const testUser = await api.createTestUser({
      email: 'e2e-user@test.com',
      username: 'e2e_test_user',
    });

    // Create circle owned by this user
    const circle = await api.createCircle(
      testUser.token,
      `mark-sol-${Date.now() % 100000}`,
      testUser.user._id
    );

    // Create question owned by this user
    const question = await api.createQuestion(testUser.token, circle._id, {
      title: `Mark Solution Test ${Date.now()}`,
      body: '<p>Question for mark solution test</p>',
      ownerId: testUser.user._id,
      ownerName: testUser.user.username,
    });

    // Create answer (can be by same or different user)
    const answer = await api.createAnswer(testUser.token, {
      parentId: question._id,
      parentType: 'question',
      answerText: '<p>This is the answer to mark as solution</p>',
      questionId: question._id,
      circleId: circle._id,
      ownerId: testUser.user._id,
      ownerName: testUser.user.username,
    });

    // circle.name already includes 'c/' prefix from API
    await page.goto(`/${circle.name}/questions/${question._id}`);
    await page.waitForLoadState('networkidle');

    // Verify answer is visible (wait longer for client-side rendering)
    await expect(page.locator(selectors.answer.text).first()).toBeVisible({ timeout: 15000 });

    // Click "Mark as Solution" button
    const markButton = page.locator(selectors.answer.solutionButton);
    await expect(markButton).toBeVisible({ timeout: 10000 });
    await markButton.click();

    await page.waitForLoadState('networkidle');

    // Verify solution badge appears
    await expect(page.locator(selectors.answer.solutionBadge)).toBeVisible();

    // Verify solution preview appears at top
    await expect(page.locator(selectors.questionDetail.solutionPreview)).toBeVisible();
  });

  test('question owner can unmark a solution', async ({ page, request }) => {
    const api = new ApiHelper(request);

    // Create test user that matches auth state
    const testUser = await api.createTestUser({
      email: 'e2e-user@test.com',
      username: 'e2e_test_user',
    });

    // Create circle owned by this user
    const circle = await api.createCircle(
      testUser.token,
      `unmark-sol-${Date.now() % 100000}`,
      testUser.user._id
    );

    // Create question owned by this user
    const question = await api.createQuestion(testUser.token, circle._id, {
      title: `Unmark Solution Test ${Date.now()}`,
      body: '<p>Question for unmark solution test</p>',
      ownerId: testUser.user._id,
      ownerName: testUser.user.username,
    });

    // Create answer
    const answer = await api.createAnswer(testUser.token, {
      parentId: question._id,
      parentType: 'question',
      answerText: '<p>This is the answer already marked</p>',
      questionId: question._id,
      circleId: circle._id,
      ownerId: testUser.user._id,
      ownerName: testUser.user.username,
    });

    // Mark the solution via API
    await api.markSolution(testUser.token, circle._id, question._id, answer._id);

    
    // circle.name already includes 'c/' prefix from API
    await page.goto(`/${circle.name}/questions/${question._id}`);
    await page.waitForLoadState('networkidle');

    // Verify solution badge exists
    await expect(page.locator(selectors.answer.solutionBadge)).toBeVisible({ timeout: 10000 });

    // Click "Unmark" button
    const unmarkButton = page.locator(selectors.answer.unmarkSolutionButton);
    await expect(unmarkButton).toBeVisible();
    await unmarkButton.click();

    await page.waitForLoadState('networkidle');

    // Verify solution badge is gone
    await expect(page.locator(selectors.answer.solutionBadge)).not.toBeVisible();

    // Verify solution preview box is removed
    await expect(page.locator(selectors.questionDetail.solutionPreview)).not.toBeVisible();

    // Verify "Mark as Solution" button reappears
    await expect(page.locator(selectors.answer.solutionButton)).toBeVisible();
  });
});

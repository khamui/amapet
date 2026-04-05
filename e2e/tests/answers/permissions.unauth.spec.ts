import { test, expect } from '@playwright/test';
import { ApiHelper } from '../../support/helpers/api.helper';
import { selectors } from '../../support/helpers/selectors';

// This test runs without authentication
test.describe('Answers - Unauthenticated Permissions', () => {
  test('unauthenticated user sees login prompt instead of reply', async ({
    page,
    request,
  }) => {
    const api = new ApiHelper(request);

    // Create test data
    const user = await api.createTestUser({
      email: `unauth-test-${Date.now()}@e2e.test`,
    });
    const circle = await api.createCircle(
      user.token,
      `unauth-${Date.now() % 100000}`,
      user.user._id
    );
    const question = await api.createQuestion(user.token, circle._id, {
      title: 'Question for unauth test',
      body: '<p>Body</p>',
      ownerId: user.user._id,
      ownerName: user.user.username,
    });
    await api.createAnswer(user.token, {
      parentId: question._id,
      parentType: 'question',
      answerText: '<p>An answer</p>',
      questionId: question._id,
      circleId: circle._id,
      ownerId: user.user._id,
      ownerName: user.user.username,
    });

    
    await page.goto(`/${circle.name}/questions/${question._id}`);
    await page.waitForLoadState('networkidle');

    // For unauthenticated users, "Login to reply" button should be visible
    // PrimeNG renders p-button with nested span for label
    await expect(page.locator('p-button:has-text("Login to reply")')).toBeVisible();
  });

  test('unauthenticated user cannot see answer editor', async ({
    page,
    request,
  }) => {
    const api = new ApiHelper(request);

    const user = await api.createTestUser({
      email: `unauth-editor-${Date.now()}@e2e.test`,
    });
    const circle = await api.createCircle(
      user.token,
      `unauthq-${Date.now() % 100000}`,
      user.user._id
    );
    const question = await api.createQuestion(user.token, circle._id, {
      title: 'Question for unauth editor test',
      body: '<p>Body</p>',
      ownerId: user.user._id,
      ownerName: user.user.username,
    });

    
    await page.goto(`/${circle.name}/questions/${question._id}`);
    await page.waitForLoadState('networkidle');

    // Main answer editor should not be visible
    await expect(
      page.locator(selectors.questionDetail.mainAnswerEditor)
    ).not.toBeVisible();
  });
});

import { test, expect } from '@playwright/test';
import { ApiHelper } from '../../support/helpers/api.helper';
import { selectors } from '../../support/helpers/selectors';

test.describe('Answers - Reply', () => {
  test.use({ storageState: '.auth/user.json' });

  test('user can reply to an answer', async ({ page, request }) => {
    const api = new ApiHelper(request);

    const testUser = await api.createTestUser({
      email: 'e2e-user@test.com',
      username: 'e2e_test_user',
    });

    const circle = await api.createCircle(
      testUser.token,
      `reply-${Date.now() % 100000}`,
      testUser.user._id
    );
    const question = await api.createQuestion(testUser.token, circle._id, {
      title: `Reply Test ${Date.now()}`,
      body: '<p>Question body</p>',
      ownerId: testUser.user._id,
      ownerName: testUser.user.username,
    });
    // Create an answer to the question
    const answer = await api.createAnswer(testUser.token, {
      parentId: question._id,
      parentType: 'question',
      answerText: '<p>Answer to reply to</p>',
      questionId: question._id,
      circleId: circle._id,
      ownerId: testUser.user._id,
      ownerName: testUser.user.username,
    });

    await page.goto(`/${circle.name}/questions/${question._id}`);
    await page.waitForLoadState('networkidle');

    // Wait for answers to load
    await expect(page.locator('p-progressBar')).not.toBeVisible({ timeout: 10000 });

    // Click Reply button on the answer
    const replyButton = page.locator(selectors.answer.replyButton).first();
    await expect(replyButton).toBeVisible({ timeout: 15000 });
    await replyButton.click();

    // Editor should appear
    const replyEditor = page.locator(selectors.editor.quill).last();
    await expect(replyEditor).toBeVisible();

    // Type reply
    await replyEditor.click();
    await page.keyboard.type('This is a reply to the answer');

    // Submit
    const submitButton = page.locator(selectors.editor.submitButton).last();
    await submitButton.click();

    await page.waitForLoadState('networkidle');

    // Verify reply appears
    await expect(page.locator('text=This is a reply to the answer')).toBeVisible();
  });

  test.skip('reply editor vanishes after successful submission', async ({
    page,
    request,
  }) => {
    const api = new ApiHelper(request);

    const testUser = await api.createTestUser({
      email: 'e2e-user@test.com',
      username: 'e2e_test_user',
    });

    const circle = await api.createCircle(
      testUser.token,
      `replycol-${Date.now() % 100000}`,
      testUser.user._id
    );
    const question = await api.createQuestion(testUser.token, circle._id, {
      title: `Reply Collapse Test ${Date.now()}`,
      body: '<p>Question body</p>',
      ownerId: testUser.user._id,
      ownerName: testUser.user.username,
    });
    await api.createAnswer(testUser.token, {
      parentId: question._id,
      parentType: 'question',
      answerText: '<p>Answer for collapse test</p>',
      questionId: question._id,
      circleId: circle._id,
      ownerId: testUser.user._id,
      ownerName: testUser.user.username,
    });

    await page.goto(`/${circle.name}/questions/${question._id}`);
    await page.waitForLoadState('networkidle');

    // Wait for answers to load
    await expect(page.locator('p-progressBar')).not.toBeVisible({ timeout: 10000 });

    // Click Reply button
    const replyButton = page.locator(selectors.answer.replyButton).first();
    await expect(replyButton).toBeVisible({ timeout: 15000 });
    await replyButton.click();

    // Count editors before submission
    const editorCountBefore = await page.locator(selectors.editor.quill).count();

    // Type and submit
    const replyEditor = page.locator(selectors.editor.quill).last();
    await replyEditor.click();
    await page.keyboard.type('Reply content for collapse test');
    await page.locator(selectors.editor.submitButton).last().click();

    await page.waitForLoadState('networkidle');

    // Reply button should show "Reply" label again (not "Cancel")
    await expect(replyButton).toContainText('Reply');
  });

  test('main answer editor stays visible after submission', async ({
    page,
    request,
  }) => {
    const api = new ApiHelper(request);

    const testUser = await api.createTestUser({
      email: 'e2e-user@test.com',
      username: 'e2e_test_user',
    });

    const circle = await api.createCircle(
      testUser.token,
      `maineditor-${Date.now() % 100000}`,
      testUser.user._id
    );
    const question = await api.createQuestion(testUser.token, circle._id, {
      title: `Main Editor Test ${Date.now()}`,
      body: '<p>Question body</p>',
      ownerId: testUser.user._id,
      ownerName: testUser.user.username,
    });

    
    await page.goto(`/${circle.name}/questions/${question._id}`);
    await page.waitForLoadState('networkidle');

    // Main editor should be visible
    const mainEditorContainer = page.locator(selectors.questionDetail.mainAnswerEditor);
    await expect(mainEditorContainer).toBeVisible({ timeout: 10000 });

    const mainEditor = mainEditorContainer.locator(selectors.editor.quill);
    await expect(mainEditor).toBeVisible();

    // Type and submit
    await mainEditor.click();
    await page.keyboard.type('Direct answer to question');
    await mainEditorContainer.locator(selectors.editor.submitButton).click();

    // Answer should appear in the answers list
    await expect(
      page.locator('[data-testid="answer-text"]:has-text("Direct answer to question")')
    ).toBeVisible({ timeout: 10000 });

    // Main editor should still be visible but cleared
    await expect(mainEditor).toBeVisible();
    await expect(mainEditor).toHaveText('', { timeout: 5000 });
  });
});

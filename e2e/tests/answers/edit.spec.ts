import { test, expect } from '@playwright/test';
import { ApiHelper } from '../../support/helpers/api.helper';
import { selectors } from '../../support/helpers/selectors';

test.describe('Answers - Edit', () => {
  test.use({ storageState: '.auth/user.json' });

  test('answer owner can access edit mode', async ({ page, request }) => {
    const api = new ApiHelper(request);

    // Get/create test user that matches auth state
    const testUser = await api.createTestUser({
      email: 'e2e-user@test.com',
      username: 'e2e_test_user',
    });

    // Create test data
    const circle = await api.createCircle(
      testUser.token,
      `edit-ans-${Date.now() % 100000}`,
      testUser.user._id
    );
    const question = await api.createQuestion(testUser.token, circle._id, {
      title: `Edit Answer Test ${Date.now()}`,
      body: '<p>Question body</p>',
      ownerId: testUser.user._id,
      ownerName: testUser.user.username,
    });
    await api.createAnswer(testUser.token, {
      parentId: question._id,
      parentType: 'question',
      answerText: '<p>Original answer text</p>',
      questionId: question._id,
      circleId: circle._id,
      ownerId: testUser.user._id,
      ownerName: testUser.user.username,
    });

    await page.goto(`/${circle.name}/questions/${question._id}`);
    await page.waitForLoadState('networkidle');

    // Wait for answers to load (progress bar disappears)
    await expect(page.locator('p-progressBar')).not.toBeVisible({ timeout: 10000 });

    // Edit button should be visible for answer owner
    const editButton = page.locator(selectors.answer.editButton);
    await expect(editButton).toBeVisible({ timeout: 15000 });

    // Click Edit button
    await editButton.click();

    // Editor should appear with buttons
    const editorContainer = page.locator('ama-texteditor').first();
    await expect(editorContainer).toBeVisible({ timeout: 5000 });

    // Save button should be visible
    const saveButton = editorContainer.locator('[data-testid="submit-editor"]');
    await expect(saveButton).toBeVisible();

    // Quill editor should be present
    const quillEditor = editorContainer.locator('.ql-editor');
    await expect(quillEditor).toBeVisible();
  });

  test('answer owner can trigger delete confirmation', async ({ page, request }) => {
    const api = new ApiHelper(request);

    // Get/create test user that matches auth state
    const testUser = await api.createTestUser({
      email: 'e2e-user@test.com',
      username: 'e2e_test_user',
    });

    // Create test data
    const circle = await api.createCircle(
      testUser.token,
      `del-ans-${Date.now() % 100000}`,
      testUser.user._id
    );
    const question = await api.createQuestion(testUser.token, circle._id, {
      title: `Delete Answer Test ${Date.now()}`,
      body: '<p>Question body</p>',
      ownerId: testUser.user._id,
      ownerName: testUser.user.username,
    });
    await api.createAnswer(testUser.token, {
      parentId: question._id,
      parentType: 'question',
      answerText: '<p>Answer to delete</p>',
      questionId: question._id,
      circleId: circle._id,
      ownerId: testUser.user._id,
      ownerName: testUser.user.username,
    });

    await page.goto(`/${circle.name}/questions/${question._id}`);
    await page.waitForLoadState('networkidle');

    // Wait for answers to load
    await expect(page.locator('p-progressBar')).not.toBeVisible({ timeout: 10000 });

    // Delete button should be visible for answer owner
    const deleteButton = page.locator(selectors.answer.deleteButton);
    await expect(deleteButton).toBeVisible({ timeout: 15000 });

    // Click Delete button
    await deleteButton.click();

    // Confirm dialog should appear with the delete question
    const dialog = page.locator(selectors.common.confirmDialog);
    await expect(dialog).toBeVisible({ timeout: 5000 });
    await expect(dialog).toContainText('Delete');
  });
});

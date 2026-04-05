import { test, expect } from '../../fixtures/test-data.fixture';
import { ApiHelper } from '../../support/helpers/api.helper';
import { selectors } from '../../support/helpers/selectors';

test.describe('Questions - Edit', () => {
  test.use({ storageState: '.auth/user.json' });

  test('question edit page is accessible', async ({ page, testCircle, testQuestion }) => {
    const circleName = testCircle.name.replace('c/', '');

    await page.goto(`/c/${circleName}/questions/${testQuestion._id}/edit`);
    await page.waitForLoadState('networkidle');

    // Title input should be pre-filled with the question title
    const titleInput = page.locator('input[formcontrolname="titleInput"]');
    await expect(titleInput).toBeVisible({ timeout: 10000 });
    await expect(titleInput).toHaveValue(testQuestion.title);
  });

  test('question can be deleted via UI', async ({ page, request }) => {
    const api = new ApiHelper(request);

    // Create user matching the auth state
    const testUser = await api.createTestUser({
      email: 'e2e-user@test.com',
      username: 'e2e_test_user',
    });

    // Create a circle and question specifically for deletion
    const circle = await api.createCircle(
      testUser.token,
      `del-q-${Date.now() % 100000}`,
      testUser.user._id
    );
    const question = await api.createQuestion(testUser.token, circle._id, {
      title: `Question to delete ${Date.now()}`,
      body: '<p>This will be deleted</p>',
      ownerId: testUser.user._id,
      ownerName: testUser.user.username,
    });

    // Navigate to question detail
    await page.goto(`/${circle.name}/questions/${question._id}`);
    await page.waitForLoadState('networkidle');

    // Click the Delete button
    const deleteButton = page.getByRole('button', { name: 'Delete' });
    await expect(deleteButton).toBeVisible({ timeout: 10000 });
    await deleteButton.click();

    // Confirm dialog should appear
    const dialog = page.locator(selectors.common.confirmDialog);
    await expect(dialog).toBeVisible({ timeout: 5000 });
    await expect(dialog).toContainText('Are you sure that you want to delete this question?');

    // Confirm deletion
    await page.locator(selectors.common.confirmYes).click();

    // Should navigate back to the circle page
    await page.waitForURL(new RegExp(`/${circle.name}`), { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    // Reload to get fresh data after the async delete
    await page.reload();
    await page.waitForLoadState('networkidle');

    // The deleted question should no longer appear
    await expect(page.locator(`text=${question.title}`)).not.toBeVisible({ timeout: 5000 });
  });
});

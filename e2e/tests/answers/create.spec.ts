import { test, expect } from '../../fixtures/test-data.fixture';
import { selectors } from '../../support/helpers/selectors';

test.describe('Answers - Create', () => {
  test.use({ storageState: '.auth/user.json' });

  test('can create an answer via UI', async ({ page, testCircle, testQuestion }) => {
    const answerText = `E2E test answer ${Date.now()}`;
    const circleName = testCircle.name.replace('c/', '');

    // Navigate to question detail
    await page.goto(`/c/${circleName}/questions/${testQuestion._id}`);
    await page.waitForLoadState('networkidle');

    // Main answer editor should be visible
    const mainEditorContainer = page.locator(selectors.questionDetail.mainAnswerEditor);
    await expect(mainEditorContainer).toBeVisible({ timeout: 10000 });

    // Type answer in the quill editor
    const editor = mainEditorContainer.locator(selectors.editor.quill);
    await editor.click();
    await page.keyboard.type(answerText);

    // Submit the answer
    await mainEditorContainer.locator(selectors.editor.submitButton).click();
    await page.waitForLoadState('networkidle');

    // Verify the answer appears on the page
    await expect(page.locator(`text=${answerText}`)).toBeVisible({ timeout: 10000 });
  });

  test('can view question with answer', async ({ page, testCircle, testQuestion, testAnswer }) => {
    const circleName = testCircle.name.replace('c/', '');

    // Navigate to question detail
    await page.goto(`/c/${circleName}/questions/${testQuestion._id}`);
    await page.waitForLoadState('networkidle');

    // Verify the answer text is visible on the page
    await expect(page.locator(`text=${testAnswer.answerText.replace(/<[^>]*>/g, '')}`)).toBeVisible({ timeout: 10000 });
  });
});

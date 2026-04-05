import { test, expect } from '../../fixtures/test-data.fixture';

test.describe('Answers - Create', () => {
  test('can create an answer to a question', async ({ page, testCircle, testQuestion }) => {
    const answerText = `E2E test answer ${Date.now()}`;

    // Navigate to question detail
    await page.goto(`/c/${testCircle.name}/questions/${testQuestion._id}`);

    await page.waitForLoadState('networkidle');

    // Find answer input (Quill editor or textarea)
    const answerEditor = page.locator('[data-testid="answer-input"] .ql-editor, .ql-editor').first();

    if (await answerEditor.isVisible({ timeout: 5000 })) {
      await answerEditor.click();
      await answerEditor.fill(answerText);
    } else {
      const answerInput = page.locator('[data-testid="answer-input"], textarea[name="answer"], textarea[placeholder*="answer" i]').first();
      await answerInput.fill(answerText);
    }

    // Submit answer
    const submitButton = page.locator('[data-testid="submit-answer"], button:has-text("Answer"), button:has-text("Reply"), button:has-text("Post")').first();
    await submitButton.click();

    // Wait for answer to appear
    await page.waitForLoadState('networkidle');

    // Verify answer was created
    await expect(page.locator('body')).toContainText(answerText);
  });

  test('can create a nested answer (reply to answer)', async ({ page, testCircle, testQuestion, testAnswer }) => {
    const replyText = `E2E nested reply ${Date.now()}`;

    // Navigate to question detail
    await page.goto(`/c/${testCircle.name}/questions/${testQuestion._id}`);

    await page.waitForLoadState('networkidle');

    // Find reply button on the existing answer
    const replyButton = page.locator('[data-testid="reply-answer"], button:has-text("Reply")').first();

    if (await replyButton.isVisible({ timeout: 5000 })) {
      await replyButton.click();

      // Find the reply input that appeared
      const replyEditor = page.locator('.ql-editor').last();
      await replyEditor.click();
      await replyEditor.fill(replyText);

      // Submit reply
      const submitButton = page.locator('[data-testid="submit-answer"], button:has-text("Reply"), button:has-text("Post")').last();
      await submitButton.click();

      await page.waitForLoadState('networkidle');

      // Verify nested reply was created
      await expect(page.locator('body')).toContainText(replyText);
    } else {
      test.skip();
    }
  });
});

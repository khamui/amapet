import { test, expect } from '../../fixtures/test-data.fixture';

test.describe('Questions - Create', () => {
  test('can create a new question', async ({ page, testCircle }) => {
    const questionTitle = `E2E Test Question ${Date.now()}`;
    const questionBody = 'This is a test question body created by E2E tests';

    // Navigate to question creation page
    await page.goto(`/c/${testCircle._id}/questions/create`);

    await page.waitForLoadState('networkidle');

    // Fill in title
    const titleInput = page.locator('[data-testid="question-title-input"], input[name="title"], input[placeholder*="title" i]').first();
    await titleInput.fill(questionTitle);

    // Fill in body (Quill editor)
    const bodyEditor = page.locator('.ql-editor').first();
    if (await bodyEditor.isVisible({ timeout: 5000 })) {
      await bodyEditor.click();
      await bodyEditor.fill(questionBody);
    } else {
      // Fallback to textarea
      const bodyInput = page.locator('textarea[name="body"], [data-testid="question-body-input"]').first();
      await bodyInput.fill(questionBody);
    }

    // Submit
    const submitButton = page.locator('[data-testid="submit-question"], button[type="submit"], button:has-text("Create"), button:has-text("Post")').first();
    await submitButton.click();

    // Wait for navigation (should redirect to question detail or circle)
    await page.waitForLoadState('networkidle');

    // Verify question was created
    await expect(page.locator('body')).toContainText(questionTitle);
  });
});

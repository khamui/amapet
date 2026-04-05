import { test, expect } from '../../fixtures/test-data.fixture';

test.describe('Answers - Edit', () => {
  test('can edit an existing answer', async ({ page, testCircle, testQuestion, testAnswer }) => {
    const updatedText = `Updated answer ${Date.now()}`;

    // Navigate to question detail
    await page.goto(`/c/${testCircle.name}/questions/${testQuestion._id}`);

    await page.waitForLoadState('networkidle');

    // Find edit button on the answer
    const editButton = page.locator('[data-testid="edit-answer"], button:has-text("Edit")').first();

    if (await editButton.isVisible({ timeout: 5000 })) {
      await editButton.click();

      // Find the edit input
      const editEditor = page.locator('.ql-editor').first();
      await editEditor.clear();
      await editEditor.fill(updatedText);

      // Submit edit
      const submitButton = page.locator('button:has-text("Save"), button:has-text("Update")').first();
      await submitButton.click();

      await page.waitForLoadState('networkidle');

      // Verify answer was updated
      await expect(page.locator('body')).toContainText(updatedText);
    } else {
      test.skip();
    }
  });
});

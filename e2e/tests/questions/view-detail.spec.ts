import { test, expect } from '../../fixtures/test-data.fixture';

test.describe('Questions - View Detail', () => {
  test('displays question detail page with title and body', async ({ page, testCircle, testQuestion }) => {
    // Navigate to question detail
    await page.goto(`/c/${testCircle.name}/questions/${testQuestion._id}`);

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Question title should be visible
    await expect(page.locator('body')).toContainText(testQuestion.title);
  });

  test('shows answers on question detail page', async ({ page, testCircle, testQuestion, testAnswer }) => {
    // Navigate to question detail
    await page.goto(`/c/${testCircle.name}/questions/${testQuestion._id}`);

    await page.waitForLoadState('networkidle');

    // Answer text should be visible (strip HTML tags for comparison)
    const answerText = testAnswer.answerText.replace(/<[^>]*>/g, '');
    await expect(page.locator('body')).toContainText(answerText);
  });
});

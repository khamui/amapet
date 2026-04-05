import { test, expect } from '../../fixtures/test-data.fixture';
import { selectors } from '../../support/helpers/selectors';

test.describe('Questions - View Detail', () => {
  test('displays question detail page with title and body', async ({ page, testCircle, testQuestion }) => {
    const circleName = testCircle.name.replace('c/', '');

    await page.goto(`/c/${circleName}/questions/${testQuestion._id}`);
    await page.waitForLoadState('networkidle');

    // Question title should be displayed
    await expect(page.locator('h4', { hasText: testQuestion.title })).toBeVisible();

    // Question body should be rendered
    await expect(page.locator('.prose', { hasText: 'This is a test question body' })).toBeVisible();

    // Answer count should be shown
    await expect(page.locator('text=/\\d+ answers/')).toBeVisible();
  });

  test('shows answers on question detail page', async ({ page, testCircle, testQuestion, testAnswer }) => {
    const circleName = testCircle.name.replace('c/', '');

    await page.goto(`/c/${circleName}/questions/${testQuestion._id}`);
    await page.waitForLoadState('networkidle');

    // Wait for answers to finish loading
    await expect(page.locator('p-progressBar')).not.toBeVisible({ timeout: 10000 });

    // Answer text should be visible
    await expect(page.locator(selectors.answer.text, { hasText: 'This is a test answer' })).toBeVisible({ timeout: 10000 });
  });
});

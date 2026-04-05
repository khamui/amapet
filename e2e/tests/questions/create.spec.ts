import { test, expect } from '../../fixtures/test-data.fixture';
import { selectors } from '../../support/helpers/selectors';

test.describe('Questions - Create', () => {
  test.use({ storageState: '.auth/user.json' });

  test('can create a new question via UI and view it', async ({ page, testCircle }) => {
    const questionTitle = `E2E Test Question ${Date.now()}`;
    const circleName = testCircle.name.replace('c/', '');

    // Navigate to question creation form
    await page.goto(`/c/${circleName}/questions/create`);
    await page.waitForLoadState('networkidle');

    // Fill in the question title
    await page.fill(selectors.question.titleInput, questionTitle);

    // Submit the question
    await page.click(selectors.question.submitCreate);

    // Wait for navigation to the question detail page (not "create")
    await page.waitForURL(/\/c\/[^/]+\/questions\/(?!create)[^/]+/, { timeout: 10000 });

    // Verify question title is visible on the detail page
    await expect(page.locator(`text=${questionTitle}`)).toBeVisible({ timeout: 5000 });
  });

  test('newly created question appears on circle page without refresh', async ({ page, testCircle }) => {
    const questionTitle = `UI Test Question ${Date.now()}`;
    const circleName = testCircle.name.replace('c/', '');

    // Navigate to question creation form
    await page.goto(`/c/${circleName}/questions/create`);
    await page.waitForLoadState('networkidle');

    // Fill in the question title
    await page.fill(selectors.question.titleInput, questionTitle);

    // Submit the question
    await page.click(selectors.question.submitCreate);

    // Wait for navigation to the question detail page (not "create")
    await page.waitForURL(/\/c\/[^/]+\/questions\/(?!create)[^/]+/, { timeout: 10000 });

    // Navigate to circle page
    await page.goto(`/c/${circleName}`);
    await page.waitForLoadState('networkidle');

    // Verify the new question appears in the list
    const questionTitleElement = page.locator(`text=${questionTitle}`);
    await expect(questionTitleElement).toBeVisible({ timeout: 10000 });
  });
});

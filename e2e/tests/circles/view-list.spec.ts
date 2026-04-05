import { test, expect } from '../../fixtures/test-data.fixture';

test.describe('Circles - View List', () => {
  test('displays circles on explore page', async ({ page }) => {
    // Navigate to explore page
    await page.goto('/explore');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // The page should have "Explore" heading
    await expect(page.getByRole('heading', { name: 'Explore', exact: true })).toBeVisible();

    // Should show questions or "No posts found" message
    const hasQuestions = page.locator('ama-question');
    const noPostsMessage = page.locator('text=No posts found.');
    await expect(hasQuestions.first().or(noPostsMessage)).toBeVisible({ timeout: 10000 });
  });

  test('circle detail page shows circle info', async ({ page, testCircle }) => {
    const circleName = testCircle.name.replace('c/', '');

    // Navigate to circle detail
    await page.goto(`/c/${circleName}`);

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Circle name should be visible as heading
    await expect(page.getByRole('heading', { name: testCircle.name })).toBeVisible();
  });
});

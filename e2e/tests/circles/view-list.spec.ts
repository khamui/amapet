import { test, expect } from '../../fixtures/test-data.fixture';

test.describe('Circles - View List', () => {
  test('displays circles on explore page', async ({ page, api, testUser }) => {
    // Create a test circle first
    const circleName = `e2e-circle-${Date.now()}`;
    await api.createCircle(testUser.token, circleName, testUser.user._id);

    // Navigate to explore page
    await page.goto('/explore');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Should show circles (page should have content)
    await expect(page.locator('body')).toBeVisible();

    // Look for the circle we created (by name in the page content)
    const circleElement = page.locator(`text=${circleName}`).first();
    await expect(circleElement).toBeVisible({ timeout: 10000 });
  });

  test('circle detail page shows circle info', async ({ page, testCircle }) => {
    // Navigate to circle detail
    await page.goto(`/c/${testCircle.name}`);

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Circle name should be visible somewhere on page
    await expect(page.locator('body')).toContainText(testCircle.name);
  });
});

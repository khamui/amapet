import { test, expect } from '../../fixtures/test-data.fixture';
import { selectors } from '../../support/helpers/selectors';

test.describe('Circles - Create via UI', () => {
  test.use({ storageState: '.auth/user.json' });

  test('newly created circle appears in My Circles sidebar', async ({ page }) => {
    const circleName = `ui-circle-${Date.now()}`;

    // Navigate to home page
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Click "Create Circle" button
    await page.click(selectors.circle.createButton);

    // Fill in the circle name
    await page.fill(selectors.circle.createInput, circleName);

    // Submit the form
    await page.click(selectors.circle.submitCreate);

    // Wait for navigation to the new circle page
    await page.waitForURL(`/c/${circleName}`, { timeout: 10000 });

    // Verify the circle appears in "My Circles" section
    const myCirclesSection = page.locator(selectors.circle.myCirclesSection);
    await expect(myCirclesSection).toBeVisible({ timeout: 5000 });

    // Verify the circle name is visible within My Circles
    const circleLink = myCirclesSection.locator(`text=${circleName}`);
    await expect(circleLink).toBeVisible({ timeout: 5000 });
  });
});

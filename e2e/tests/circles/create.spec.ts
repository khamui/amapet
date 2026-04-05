import { test, expect } from '@playwright/test';
import { selectors } from '../../support/helpers/selectors';

test.describe('Circles - Create', () => {
  test.use({ storageState: '.auth/user.json' });

  test('can create a new circle via UI and view it', async ({ page }) => {
    const circleName = `new-circle-${Date.now()}`;

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

    // Page should load without errors
    const response = await page.goto(`/c/${circleName}`);
    expect(response?.status()).toBeLessThan(400);
  });
});

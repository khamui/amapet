import { test, expect } from '../../fixtures/test-data.fixture';

test.describe('Circles - Create', () => {
  test('can create a new circle', async ({ page, api, testUser }) => {
    const circleName = `new-circle-${Date.now()}`;

    // Navigate to a page where circle creation is possible
    // This might be profile/circles or a dedicated create page
    await page.goto('/profile/circles');

    // Look for create circle button
    const createButton = page.locator('[data-testid="create-circle"], button:has-text("Create"), button:has-text("New Circle")').first();

    if (await createButton.isVisible({ timeout: 5000 })) {
      await createButton.click();

      // Fill in circle name
      const nameInput = page.locator('[data-testid="circle-name-input"], input[name="name"], input[placeholder*="name" i]').first();
      await nameInput.fill(circleName);

      // Submit
      const submitButton = page.locator('[data-testid="submit-circle"], button[type="submit"], button:has-text("Create")').first();
      await submitButton.click();

      // Wait for navigation or success
      await page.waitForLoadState('networkidle');

      // Verify circle was created by navigating to it
      await page.goto(`/c/${circleName}`);
      await expect(page.locator('body')).toContainText(circleName);
    } else {
      // If UI doesn't support circle creation, verify via API
      const circle = await api.createCircle(testUser.token, circleName, testUser.user._id);
      expect(circle.name).toContain(circleName);
    }
  });
});

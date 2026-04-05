import { test, expect } from '@playwright/test';

test.describe('Navigation - Critical Routes', () => {
  const routes = [
    { path: '/', name: 'Home' },
    { path: '/explore', name: 'Explore' },
    { path: '/profile', name: 'Profile' },
    { path: '/profile/circles', name: 'Profile Circles' },
    { path: '/imprint', name: 'Imprint' },
    { path: '/privacy', name: 'Privacy' },
    { path: '/terms', name: 'Terms' },
    { path: '/disclaimer', name: 'Disclaimer' },
  ];

  for (const route of routes) {
    test(`${route.name} page (${route.path}) renders without errors`, async ({ page }) => {
      // Navigate to route
      const response = await page.goto(route.path);

      // Should not return error status
      expect(response?.status()).toBeLessThan(400);

      // Wait for page to be interactive
      await page.waitForLoadState('networkidle');

      // Page should have content
      await expect(page.locator('body')).toBeVisible();

      // No uncaught errors in console
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));

      // Small wait to catch any delayed errors
      await page.waitForTimeout(500);

      expect(errors).toHaveLength(0);
    });
  }

  test('404 page for unknown routes', async ({ page }) => {
    await page.goto('/this-route-does-not-exist-12345');

    // Should display the 404 heading
    await expect(page.getByRole('heading', { name: '404' })).toBeVisible();

    // Should show helpful message
    await expect(page.getByText("The page you're looking for doesn't exist")).toBeVisible();

    // Should have a back button
    await expect(page.getByRole('button', { name: 'Back to Explore' })).toBeVisible();
  });
});

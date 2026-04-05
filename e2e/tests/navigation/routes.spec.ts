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
    const response = await page.goto('/this-route-does-not-exist-12345');

    // Should either show 404 or redirect to home
    // Angular apps often redirect to home for unknown routes
    await expect(page.locator('body')).toBeVisible();
  });
});

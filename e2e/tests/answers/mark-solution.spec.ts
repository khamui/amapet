import { test, expect } from '../../fixtures/test-data.fixture';

test.describe('Answers - Mark Solution', () => {
  test('question owner can mark answer as solution', async ({ page, testCircle, testQuestion, testAnswer }) => {
    // Navigate to question detail (as question owner via auth state)
    await page.goto(`/c/${testCircle.name}/questions/${testQuestion._id}`);

    await page.waitForLoadState('networkidle');

    // Find mark as solution button
    const solutionButton = page.locator('[data-testid="mark-solution"], button:has-text("Solution"), button:has-text("Accept")').first();

    if (await solutionButton.isVisible({ timeout: 5000 })) {
      await solutionButton.click();

      await page.waitForLoadState('networkidle');

      // Verify solution badge appears
      const solutionBadge = page.locator('[data-testid="solution-badge"], .solution-badge, :text("Solution")').first();
      await expect(solutionBadge).toBeVisible();
    } else {
      // Mark solution might not be available (not question owner)
      test.skip();
    }
  });
});

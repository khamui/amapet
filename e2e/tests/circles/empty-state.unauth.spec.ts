import { test, expect } from '../../fixtures/test-data.fixture';

test.describe('Circles - Empty State (unauthenticated)', () => {
  test('empty circle shows message and login prompt for unauthenticated user', async ({
    page,
    testCircle,
  }) => {
    const circleName = testCircle.name.replace('c/', '');

    await page.goto(`/c/${circleName}`);
    await page.waitForLoadState('networkidle');

    await expect(page.getByText(`No questions yet in circle ${testCircle.name}.`)).toBeVisible();
    await expect(page.getByText('Log in to ask the first question!')).toBeVisible();
  });
});

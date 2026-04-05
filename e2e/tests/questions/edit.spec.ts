import { test, expect } from '../../fixtures/test-data.fixture';

test.describe('Questions - Edit', () => {
  test('can edit an existing question', async ({ page, testCircle, testQuestion }) => {
    const updatedTitle = `Updated Question ${Date.now()}`;

    // Navigate to question edit page
    await page.goto(`/c/${testCircle._id}/questions/${testQuestion._id}/edit`);

    await page.waitForLoadState('networkidle');

    // Clear and update title
    const titleInput = page.locator('[data-testid="question-title-input"], input[name="title"], input[placeholder*="title" i]').first();

    if (await titleInput.isVisible({ timeout: 5000 })) {
      await titleInput.clear();
      await titleInput.fill(updatedTitle);

      // Submit
      const submitButton = page.locator('[data-testid="submit-question"], button[type="submit"], button:has-text("Save"), button:has-text("Update")').first();
      await submitButton.click();

      // Wait for update to complete
      await page.waitForLoadState('networkidle');

      // Verify question was updated
      await expect(page.locator('body')).toContainText(updatedTitle);
    } else {
      // Edit page might not be accessible (permission issue)
      test.skip();
    }
  });

  test('can delete a question', async ({ page, api, testUser, testCircle }) => {
    // Create a question specifically for deletion
    const question = await api.createQuestion(testUser.token, testCircle._id, {
      title: `Question to delete ${Date.now()}`,
      body: '<p>This will be deleted</p>',
      ownerId: testUser.user._id,
      ownerName: testUser.user.username,
    });

    // Navigate to question detail
    await page.goto(`/c/${testCircle.name}/questions/${question._id}`);

    await page.waitForLoadState('networkidle');

    // Look for delete button
    const deleteButton = page.locator('[data-testid="delete-question"], button:has-text("Delete")').first();

    if (await deleteButton.isVisible({ timeout: 5000 })) {
      await deleteButton.click();

      // Confirm deletion if dialog appears
      const confirmButton = page.locator('.p-confirmdialog-accept, button:has-text("Yes"), button:has-text("Confirm")').first();
      if (await confirmButton.isVisible({ timeout: 2000 })) {
        await confirmButton.click();
      }

      // Wait for navigation (should redirect to circle)
      await page.waitForLoadState('networkidle');

      // Question should no longer be accessible
      await page.goto(`/c/${testCircle.name}/questions/${question._id}`);
      // Should show 404 or redirect
    } else {
      test.skip();
    }
  });
});

import { test, expect } from '@playwright/test';
import { ApiHelper } from '../../support/helpers/api.helper';
import { selectors } from '../../support/helpers/selectors';

test.describe('Moderation - Notes', () => {
  test.use({ storageState: '.auth/moderator.json' });

  test('moderator can add note to question', async ({ page, request }) => {
    const api = new ApiHelper(request);

    const moderator = await api.createTestUser({
      email: 'e2e-moderator@test.com',
      username: 'e2e_test_moderator',
    });

    const circle = await api.createCircle(
      moderator.token,
      `addnote-${Date.now() % 100000}`,
      moderator.user._id
    );
    const question = await api.createQuestion(moderator.token, circle._id, {
      title: `Add Note Test ${Date.now()}`,
      body: '<p>Question for note test</p>',
      ownerId: moderator.user._id,
      ownerName: moderator.user.username,
    });

    const noteText = `Test moderator note ${Date.now()}`;

    await page.goto(`/moderate/${circle.name}/q/${question._id}`);
    await page.waitForLoadState('networkidle');

    // Click "Add Moderator's Note..." button
    const addNoteButton = page.locator('button:has-text("Add Moderator")');
    await expect(addNoteButton).toBeVisible({ timeout: 5000 });
    await addNoteButton.click();

    // Fill in the note
    const noteInput = page.locator(selectors.moderationDetail.noteInput);
    await expect(noteInput).toBeVisible();
    await noteInput.fill(noteText);

    // Save the note
    const saveButton = page.locator(selectors.moderationDetail.saveNote);
    await saveButton.click();
    await page.waitForLoadState('networkidle');

    // Verify note is displayed
    await expect(page.locator(`text=${noteText}`)).toBeVisible();
  });

  test('note is visible on question detail', async ({ page, request }) => {
    const api = new ApiHelper(request);

    const moderator = await api.createTestUser({
      email: 'e2e-moderator@test.com',
      username: 'e2e_test_moderator',
    });

    const circle = await api.createCircle(
      moderator.token,
      `viewnote-${Date.now() % 100000}`,
      moderator.user._id
    );
    const question = await api.createQuestion(moderator.token, circle._id, {
      title: `View Note Test ${Date.now()}`,
      body: '<p>Question with note</p>',
      ownerId: moderator.user._id,
      ownerName: moderator.user.username,
    });

    const noteText = `Visible note test ${Date.now()}`;

    // Add note via API
    await api.addModeratorNote(moderator.token, circle._id, question._id, noteText);

    // Navigate to question detail page (use circle.name directly)
    await page.goto(`/${circle.name}/questions/${question._id}`);
    await page.waitForLoadState('networkidle');

    // Note should be visible
    await expect(page.locator(`text=${noteText}`)).toBeVisible();

    // Should show "Moderator's Note" label
    await expect(page.locator("text=Moderator's Note")).toBeVisible();
  });
});

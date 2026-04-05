import { test, expect } from '@playwright/test';
import { ApiHelper } from '../../support/helpers/api.helper';
import { selectors } from '../../support/helpers/selectors';

test.describe('Notifications', () => {
  test.use({ storageState: '.auth/user.json' });

  test('notification bell is visible', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Notification bell should be visible in the topbar
    const notificationBell = page.locator(selectors.notifications.bell);
    await expect(notificationBell).toBeVisible({ timeout: 10000 });
  });

  test('notification shows badge and opens menu with link', async ({ page, request }) => {
    const api = new ApiHelper(request);

    // Create the main test user (question owner who will receive the notification)
    const testUser = await api.createTestUser({
      email: 'e2e-user@test.com',
      username: 'e2e_test_user',
    });

    // Create a second user who will answer the question (triggering a notification)
    const otherUser = await api.createTestUser({
      email: `e2e-other-${Date.now()}@e2e.test`,
      username: `e2e_other_${Date.now()}`,
    });

    // Create circle and question owned by the test user
    const circle = await api.createCircle(
      testUser.token,
      `notif-${Date.now() % 100000}`,
      testUser.user._id
    );
    const question = await api.createQuestion(testUser.token, circle._id, {
      title: `Notification Test ${Date.now()}`,
      body: '<p>Question to trigger notification</p>',
      ownerId: testUser.user._id,
      ownerName: testUser.user.username,
    });

    // Other user answers the question → triggers registerComment → notification for testUser
    await api.createAnswer(otherUser.token, {
      parentId: question._id,
      parentType: 'question',
      answerText: '<p>An answer that triggers notification</p>',
      questionId: question._id,
      circleId: circle._id,
      ownerId: otherUser.user._id,
      ownerName: otherUser.user.username,
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Badge should be visible with a count
    const badge = page.locator(selectors.notifications.badge);
    await expect(badge).toBeVisible({ timeout: 10000 });

    // PrimeNG pBadge renders the count as text content inside a child span
    const badgeText = await badge.textContent();
    expect(Number(badgeText?.trim())).toBeGreaterThan(0);

    // Click the bell to open the popover
    const notificationBell = page.locator(selectors.notifications.bell);
    await notificationBell.click();

    // Notification item should be visible in the popover
    const notificationItem = page.locator(selectors.notifications.item).first();
    await expect(notificationItem).toBeVisible();

    // Notification should contain text about the new answer
    await expect(notificationItem).toContainText('New answer to your post');
  });
});

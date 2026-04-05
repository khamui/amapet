import { test as setup, expect } from '@playwright/test';
import { ApiHelper } from './helpers/api.helper';

const authFile = {
  user: '.auth/user.json',
  moderator: '.auth/moderator.json',
};

setup('create user auth state', async ({ request, browser }) => {
  const api = new ApiHelper(request);

  // Create a regular test user
  const { token, user } = await api.createTestUser({
    email: 'e2e-user@test.com',
    username: 'e2e_test_user',
    permLevel: 0,
  });

  // Create a browser context and set the token in localStorage
  const context = await browser.newContext();
  const page = await context.newPage();

  // Navigate to the app to set localStorage
  await page.goto('/');
  await page.evaluate((authToken) => {
    localStorage.setItem('amapet_token', authToken);
  }, token);

  // Save the storage state
  await context.storageState({ path: authFile.user });
  await context.close();

  console.log(`Created user auth state for: ${user.username}`);
});

setup('create moderator auth state', async ({ request, browser }) => {
  const api = new ApiHelper(request);

  // Create a moderator test user (permLevel=1 for platform maintainer)
  const { token, user } = await api.createTestUser({
    email: 'e2e-moderator@test.com',
    username: 'e2e_test_moderator',
    permLevel: 1,
  });

  // Create a browser context and set the token in localStorage
  const context = await browser.newContext();
  const page = await context.newPage();

  // Navigate to the app to set localStorage
  await page.goto('/');
  await page.evaluate((authToken) => {
    localStorage.setItem('amapet_token', authToken);
  }, token);

  // Save the storage state
  await context.storageState({ path: authFile.moderator });
  await context.close();

  console.log(`Created moderator auth state for: ${user.username}`);
});

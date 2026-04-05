import { test as base, expect } from '@playwright/test';

// Fixture for authenticated tests that need fresh auth per test
export const test = base.extend<{
  authenticatedPage: typeof base.prototype.page;
}>({
  authenticatedPage: async ({ page }, use) => {
    // The storage state is already loaded from playwright.config.ts
    // This fixture just provides a semantic name
    await use(page);
  },
});

export { expect };

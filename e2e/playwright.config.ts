import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.BASE_URL || 'http://localhost:4200';
const apiURL = process.env.API_URL || 'http://localhost:3000';

// NixOS: use system browser instead of Playwright's bundled one (in CI, use default)
const chromiumExecutable = process.env.CI
  ? undefined
  : (process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || '/run/current-system/sw/bin/google-chrome');

export default defineConfig({
  testDir: './tests',
  globalSetup: require.resolve('./support/global-setup'),
  globalTeardown: require.resolve('./support/global-teardown'),
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'html',
  timeout: 30000,

  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },

  projects: [
    // Setup project for authentication
    {
      name: 'setup',
      testDir: './support',
      testMatch: /.*\.setup\.ts/,
      use: {
        ...(chromiumExecutable && { launchOptions: { executablePath: chromiumExecutable } }),
      },
    },
    // Main test project (excludes moderation and unauthenticated tests - they have their own projects)
    {
      name: 'chromium',
      testIgnore: [/moderation\/.*/, /.*\.unauth\.spec\.ts/],
      use: {
        ...devices['Desktop Chrome'],
        storageState: '.auth/user.json',
        ...(chromiumExecutable && { launchOptions: { executablePath: chromiumExecutable } }),
      },
      dependencies: ['setup'],
    },
    // Moderator tests
    {
      name: 'chromium-moderator',
      testMatch: /moderation\/.*/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: '.auth/moderator.json',
        ...(chromiumExecutable && { launchOptions: { executablePath: chromiumExecutable } }),
      },
      dependencies: ['setup'],
    },
    // Unauthenticated tests
    {
      name: 'chromium-unauthenticated',
      testMatch: /.*\.unauth\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: {
          cookies: [],
          origins: [
            {
              origin: baseURL,
              localStorage: [{ name: 'amapet_consent', value: 'accepted' }],
            },
          ],
        },
        ...(chromiumExecutable && { launchOptions: { executablePath: chromiumExecutable } }),
      },
    },
  ],

  // In CI: auto-start servers. Locally: start servers manually before running tests.
  webServer: process.env.CI
    ? [
        {
          command: 'npm run start --prefix ../backend',
          port: 3000,
          reuseExistingServer: false,
          env: { ...process.env, NODE_ENV: 'test' },
          timeout: 60000,
        },
        {
          command: 'npm run serve:ssr:frontend --prefix ../frontend',
          port: 4200,
          reuseExistingServer: false,
          env: { ...process.env, PORT: '4200', API_URL: apiURL },
          timeout: 120000,
        },
      ]
    : undefined,
});

export { baseURL, apiURL };

import * as fs from 'fs';
import * as path from 'path';

const apiURL = process.env.API_URL || 'http://localhost:3000';

async function globalTeardown() {
  // Skip cleanup in CI - containers are ephemeral
  if (process.env.CI) {
    console.log('[Global Teardown] Skipping cleanup in CI environment');
    return;
  }

  const stateFile = path.join(__dirname, '.test-state.json');

  // Check if state file exists
  if (!fs.existsSync(stateFile)) {
    console.log('[Global Teardown] No test state file found, skipping cleanup');
    return;
  }

  try {
    const { startTimestamp } = JSON.parse(fs.readFileSync(stateFile, 'utf-8'));
    console.log(`[Global Teardown] Cleaning up test data created after timestamp: ${startTimestamp}`);

    const response = await fetch(`${apiURL}/test-cleanup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        collections: ['users', 'circles', 'answers'],
        afterTimestamp: startTimestamp,
        // Exclude the main auth users (e2e-user@test.com, e2e-moderator@test.com)
        emailPattern: '^(?!e2e-(user|moderator)@test\\.com$).*@(e2e\\.test|test\\.com)$',
      }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('[Global Teardown] Cleanup complete:', result.deleted);
    } else {
      console.error('[Global Teardown] Cleanup request failed:', response.status);
    }

    // Clean up state file
    fs.unlinkSync(stateFile);
  } catch (error) {
    console.error('[Global Teardown] Error during cleanup:', error);
  }
}

export default globalTeardown;

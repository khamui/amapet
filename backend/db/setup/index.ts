import { ensurePlatformSettings } from './settings.js';
import { ensurePlatformAdmin } from './admin.js';

export async function runInitialSetup(): Promise<void> {
  console.log('[Setup] Running initial setup...');

  await ensurePlatformSettings();
  await ensurePlatformAdmin();

  console.log('[Setup] Initial setup complete.');
}

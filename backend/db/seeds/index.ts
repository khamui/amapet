import { ensurePlatformSettings } from '../setup/settings.js';
import { seedDevelopmentData } from './dev-data.seed.js';

export { ensurePlatformSettings, seedDevelopmentData };

export async function runSeeds(includeDev: boolean = false): Promise<void> {
  console.log('[Seed] Running seeds...');

  // Always seed platform settings
  await ensurePlatformSettings();

  // Optionally seed development data
  if (includeDev) {
    await seedDevelopmentData();
  }

  console.log('[Seed] Seeding complete.');
}

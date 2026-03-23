import { isApplied, markApplied, getAppliedMigrations } from './registry.js';

// Import all migrations
import * as migration001 from './versions/001_owner-names.js';

interface Migration {
  version: string;
  name: string;
  up: () => Promise<void>;
}

// Register all migrations in order
const migrations: Migration[] = [migration001];

export async function runPendingMigrations(): Promise<void> {
  console.log('[Migrations] Checking for pending migrations...');

  let appliedCount = 0;

  for (const migration of migrations) {
    const applied = await isApplied(migration.version);
    if (!applied) {
      console.log(`[Migrations] Running: ${migration.version} - ${migration.name}`);
      await migration.up();
      await markApplied(migration.version, migration.name);
      console.log(`[Migrations] Completed: ${migration.version}`);
      appliedCount++;
    }
  }

  if (appliedCount === 0) {
    console.log('[Migrations] No pending migrations.');
  } else {
    console.log(`[Migrations] Applied ${appliedCount} migration(s).`);
  }
}

export async function showMigrationStatus(): Promise<void> {
  const applied = await getAppliedMigrations();

  console.log('\n=== Migration Status ===\n');

  if (applied.length === 0) {
    console.log('No migrations have been applied yet.\n');
  } else {
    console.log('Applied migrations:');
    for (const m of applied) {
      console.log(`  ${m.version} - ${m.name} (${m.appliedAt.toISOString()})`);
    }
    console.log();
  }

  console.log('Available migrations:');
  for (const m of migrations) {
    const isAppliedMigration = applied.some((a) => a.version === m.version);
    const status = isAppliedMigration ? '[applied]' : '[pending]';
    console.log(`  ${m.version} - ${m.name} ${status}`);
  }
  console.log();
}

export { getAppliedMigrations };

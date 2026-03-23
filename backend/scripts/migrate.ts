import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { runPendingMigrations, showMigrationStatus } from '../db/migrations/index.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function main(): Promise<void> {
  if (!MONGO_URI) {
    console.error('MONGO_URI environment variable is not set');
    process.exit(1);
  }

  const showStatus = process.argv.includes('--status');
  const runUp = process.argv.includes('--up') || (!showStatus && process.argv.length === 2);

  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  try {
    if (showStatus) {
      await showMigrationStatus();
    } else if (runUp) {
      await runPendingMigrations();
    } else {
      console.log('Usage: tsx scripts/migrate.ts [--status] [--up]');
      console.log('  --status  Show migration status');
      console.log('  --up      Run pending migrations (default)');
    }
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

main().catch((error) => {
  console.error('Migration script failed:', error);
  process.exit(1);
});

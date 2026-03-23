import mongoose from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const BACKUP_DIR = process.env.BACKUP_DIR || path.join(process.cwd(), 'backups');

interface BackupData {
  version: string;
  createdAt: string;
  collections: {
    users: unknown[];
    circles: unknown[];
    answers: unknown[];
    notifications: unknown[];
    platform_settings: unknown[];
  };
}

async function restore(backupName: string): Promise<void> {
  if (!MONGO_URI) {
    throw new Error('MONGO_URI environment variable is not set');
  }

  const backupPath = path.join(BACKUP_DIR, backupName);

  if (!fs.existsSync(backupPath)) {
    throw new Error(`Backup not found: ${backupPath}`);
  }

  // Connect to MongoDB
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  console.log(`Restoring from: ${backupPath}`);
  console.log('WARNING: This will replace existing data!\n');

  const backupContent = fs.readFileSync(backupPath, 'utf-8');
  const backupData: BackupData = JSON.parse(backupContent);

  if (!backupData.version || !backupData.collections) {
    throw new Error('Invalid backup format');
  }

  console.log(`Backup version: ${backupData.version}`);
  console.log(`Backup created: ${backupData.createdAt}\n`);

  const db = mongoose.connection.db;
  if (!db) {
    throw new Error('Database connection not available');
  }

  // Drop existing collections and restore from backup
  const collections = [
    { name: 'users', data: backupData.collections.users },
    { name: 'circles', data: backupData.collections.circles },
    { name: 'answers', data: backupData.collections.answers },
    { name: 'notifications', data: backupData.collections.notifications },
    { name: 'platform_settings', data: backupData.collections.platform_settings },
  ];

  for (const { name, data } of collections) {
    if (data && data.length > 0) {
      // Drop existing collection
      try {
        await db.collection(name).drop();
      } catch {
        // Collection might not exist, ignore error
      }

      // Insert backup data
      await db.collection(name).insertMany(data as Document[]);
      console.log(`Restored ${data.length} documents to ${name}`);
    } else {
      console.log(`Skipped ${name} (no data in backup)`);
    }
  }

  await mongoose.disconnect();
  console.log('\nDisconnected from MongoDB');
}

// Get backup name from command line arguments
const backupName = process.argv[2];

if (!backupName) {
  console.log('Usage: tsx scripts/restore.ts <backup-name>');
  console.log('\nAvailable backups:');

  if (fs.existsSync(BACKUP_DIR)) {
    const backups = fs.readdirSync(BACKUP_DIR).filter((name) => name.startsWith('backup-') && name.endsWith('.json'));
    if (backups.length === 0) {
      console.log('  No backups found');
    } else {
      backups.sort().reverse();
      for (const name of backups) {
        console.log(`  ${name}`);
      }
    }
  } else {
    console.log('  No backups directory found');
  }

  process.exit(1);
}

restore(backupName)
  .then(() => {
    console.log('\nRestore completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Restore failed:', error.message);
    process.exit(1);
  });

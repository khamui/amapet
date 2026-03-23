import mongoose from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { User } from '../db/models/user.js';
import { Circle } from '../db/models/circle.js';
import { Answer } from '../db/models/answer.js';
import { Notification } from '../db/models/notification.js';
import { Settings } from '../db/models/settings.js';

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

async function backup(): Promise<string> {
  if (!MONGO_URI) {
    throw new Error('MONGO_URI environment variable is not set');
  }

  // Connect to MongoDB
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // Ensure backup directory exists
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupName = `backup-${timestamp}.json`;
  const backupPath = path.join(BACKUP_DIR, backupName);

  console.log(`Creating backup at: ${backupPath}`);

  // Export all collections
  const [users, circles, answers, notifications, settings] = await Promise.all([
    User.find({}).lean(),
    Circle.find({}).lean(),
    Answer.find({}).lean(),
    Notification.find({}).lean(),
    Settings.find({}).lean(),
  ]);

  const backupData: BackupData = {
    version: '1.0',
    createdAt: new Date().toISOString(),
    collections: {
      users,
      circles,
      answers,
      notifications,
      platform_settings: settings,
    },
  };

  fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2));

  console.log(`Exported:`);
  console.log(`  - ${users.length} users`);
  console.log(`  - ${circles.length} circles`);
  console.log(`  - ${answers.length} answers`);
  console.log(`  - ${notifications.length} notifications`);
  console.log(`  - ${settings.length} settings`);

  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');

  return backupName;
}

backup()
  .then((name) => {
    console.log(`\nBackup completed: ${name}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error('Backup failed:', error.message);
    process.exit(1);
  });

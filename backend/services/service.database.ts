import * as fs from 'fs';
import * as path from 'path';
import mongoose from 'mongoose';

import { Circle } from '../db/models/circle.js';
import { Answer } from '../db/models/answer.js';
import { User } from '../db/models/user.js';
import { Settings } from '../db/models/settings.js';
import { Notification } from '../db/models/notification.js';
import { seedDevelopmentData } from '../db/seeds/dev-data.seed.js';

const BACKUP_DIR = process.env.BACKUP_DIR || path.join(process.cwd(), 'backups');

// Helper to convert string _id to ObjectId
const toObjectId = (id: string | mongoose.Types.ObjectId): mongoose.Types.ObjectId => {
  if (id instanceof mongoose.Types.ObjectId) return id;
  return new mongoose.Types.ObjectId(id);
};

// Convert _id fields in documents for restore
const convertUserIds = (docs: unknown[]): unknown[] => {
  return docs.map((doc: any) => ({
    ...doc,
    _id: toObjectId(doc._id),
  }));
};

const convertCircleIds = (docs: unknown[]): unknown[] => {
  return docs.map((doc: any) => ({
    ...doc,
    _id: toObjectId(doc._id),
    questions: doc.questions?.map((q: any) => ({
      ...q,
      _id: q._id ? toObjectId(q._id) : new mongoose.Types.ObjectId(),
    })) || [],
  }));
};

const convertAnswerIds = (docs: unknown[]): unknown[] => {
  return docs.map((doc: any) => ({
    ...doc,
    _id: toObjectId(doc._id),
    children: doc.children?.map((childId: string | mongoose.Types.ObjectId) => toObjectId(childId)) || [],
  }));
};

const convertNotificationIds = (docs: unknown[]): unknown[] => {
  return docs.map((doc: any) => ({
    ...doc,
    _id: toObjectId(doc._id),
  }));
};

const convertSettingsIds = (docs: unknown[]): unknown[] => {
  return docs.map((doc: any) => ({
    ...doc,
    _id: toObjectId(doc._id),
  }));
};

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

export const serviceDatabase = {
  canSeed: async (): Promise<boolean> => {
    const count = await Circle.countDocuments();
    return count === 0;
  },

  seed: async (): Promise<void> => {
    await seedDevelopmentData();
  },

  createBackup: async (): Promise<string> => {
    // Ensure backup directory exists
    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupName = `backup-${timestamp}.json`;
    const backupPath = path.join(BACKUP_DIR, backupName);

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

    return backupName;
  },

  listBackups: async (): Promise<Array<{ name: string; createdAt: string }>> => {
    if (!fs.existsSync(BACKUP_DIR)) {
      return [];
    }

    const entries = fs.readdirSync(BACKUP_DIR, { withFileTypes: true });
    const backups = entries
      .filter((entry) => entry.isFile() && entry.name.startsWith('backup-') && entry.name.endsWith('.json'))
      .map((entry) => {
        const stat = fs.statSync(path.join(BACKUP_DIR, entry.name));
        return {
          name: entry.name,
          createdAt: stat.mtime.toISOString(),
        };
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    return backups;
  },

  getBackupPath: (backupName: string): string | null => {
    // Validate backup name to prevent path traversal
    if (!backupName.startsWith('backup-') || !backupName.endsWith('.json') || backupName.includes('..')) {
      return null;
    }

    const backupPath = path.join(BACKUP_DIR, backupName);

    if (!fs.existsSync(backupPath)) {
      return null;
    }

    return backupPath;
  },

  restore: async (backupName: string): Promise<void> => {
    const backupPath = path.join(BACKUP_DIR, backupName);

    if (!fs.existsSync(backupPath)) {
      throw new Error(`Backup not found: ${backupName}`);
    }

    const backupContent = fs.readFileSync(backupPath, 'utf-8');
    const backupData: BackupData = JSON.parse(backupContent);

    if (!backupData.version || !backupData.collections) {
      throw new Error('Invalid backup format');
    }

    // Use a transaction-like approach: drop and restore each collection
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not available');
    }

    // Drop existing collections and restore from backup
    // Each collection needs its own ID conversion function
    const collections = [
      { name: 'users', data: backupData.collections.users, convert: convertUserIds },
      { name: 'circles', data: backupData.collections.circles, convert: convertCircleIds },
      { name: 'answers', data: backupData.collections.answers, convert: convertAnswerIds },
      { name: 'notifications', data: backupData.collections.notifications, convert: convertNotificationIds },
      { name: 'platform_settings', data: backupData.collections.platform_settings, convert: convertSettingsIds },
    ];

    for (const { name, data, convert } of collections) {
      if (data && data.length > 0) {
        // Drop existing collection
        try {
          await db.collection(name).drop();
        } catch {
          // Collection might not exist, ignore error
        }

        // Convert string IDs to ObjectIds and insert
        const convertedData = convert(data);
        await db.collection(name).insertMany(convertedData as Document[]);
        console.log(`[Restore] Restored ${data.length} documents to ${name}`);
      }
    }
  },
};

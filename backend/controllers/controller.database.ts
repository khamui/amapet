import { Request, Response } from 'express';
import { serviceDatabase } from '../services/service.database.js';

export const controllerDatabase = {
  canSeed: async (req: Request, res: Response): Promise<void> => {
    try {
      const canSeed = await serviceDatabase.canSeed();
      res.status(200).json({ canSeed });
    } catch (error) {
      console.error('Error checking seed status:', error);
      res.status(500).json({ error: 'Failed to check seed status' });
    }
  },

  seed: async (req: Request, res: Response): Promise<void> => {
    try {
      const canSeed = await serviceDatabase.canSeed();
      if (!canSeed) {
        res.status(400).json({ error: 'Cannot seed: circles collection is not empty' });
        return;
      }

      await serviceDatabase.seed();
      res.status(200).json({ message: 'Seed completed successfully' });
    } catch (error) {
      console.error('Error seeding database:', error);
      res.status(500).json({ error: 'Failed to seed database' });
    }
  },

  createBackup: async (req: Request, res: Response): Promise<void> => {
    try {
      const backupName = await serviceDatabase.createBackup();
      res.status(200).json({ backupName });
    } catch (error) {
      console.error('Error creating backup:', error);
      res.status(500).json({ error: 'Failed to create backup' });
    }
  },

  listBackups: async (req: Request, res: Response): Promise<void> => {
    try {
      const backups = await serviceDatabase.listBackups();
      res.status(200).json({ backups });
    } catch (error) {
      console.error('Error listing backups:', error);
      res.status(500).json({ error: 'Failed to list backups' });
    }
  },

  restore: async (req: Request, res: Response): Promise<void> => {
    try {
      const { backupName } = req.body;
      if (!backupName) {
        res.status(400).json({ error: 'backupName is required' });
        return;
      }

      await serviceDatabase.restore(backupName);
      res.status(200).json({ message: 'Restore completed successfully' });
    } catch (error) {
      console.error('Error restoring database:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to restore database';
      res.status(500).json({ error: errorMessage });
    }
  },

  downloadBackup: async (req: Request, res: Response): Promise<void> => {
    try {
      const name = req.params.name as string;
      if (!name) {
        res.status(400).json({ error: 'Backup name is required' });
        return;
      }

      const backupPath = serviceDatabase.getBackupPath(name);
      if (!backupPath) {
        res.status(404).json({ error: 'Backup not found' });
        return;
      }

      res.download(backupPath, name, (err) => {
        if (err) {
          console.error('Error sending file:', err);
        }
      });
    } catch (error) {
      console.error('Error downloading backup:', error);
      res.status(500).json({ error: 'Failed to download backup' });
    }
  },
};

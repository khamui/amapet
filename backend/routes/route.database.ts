import express from 'express';
import cors from 'cors';
import { controllerDatabase } from '../controllers/controller.database.js';
import { corsOptions } from '../dbaccess.js';
import { middlewareAuth } from '../middlewares/middleware.auth.js';

const router = express.Router();

/**
 * GET /database/can-seed
 * Check if database can be seeded (circles collection is empty)
 * Requires platform maintainer access
 */
router.get('/database/can-seed', cors(corsOptions), [
  middlewareAuth.isPlatformMaintainer,
  controllerDatabase.canSeed,
]);

/**
 * POST /database/seed
 * Seed the database with sample development data
 * Requires platform maintainer access
 */
router.post('/database/seed', cors(corsOptions), [
  middlewareAuth.isPlatformMaintainer,
  controllerDatabase.seed,
]);

/**
 * POST /database/backup
 * Create a new database backup
 * Requires platform maintainer access
 */
router.post('/database/backup', cors(corsOptions), [
  middlewareAuth.isPlatformMaintainer,
  controllerDatabase.createBackup,
]);

/**
 * GET /database/backups
 * List all available backups
 * Requires platform maintainer access
 */
router.get('/database/backups', cors(corsOptions), [
  middlewareAuth.isPlatformMaintainer,
  controllerDatabase.listBackups,
]);

/**
 * POST /database/restore
 * Restore database from a backup
 * Requires platform maintainer access
 * Body: { backupName: string }
 */
router.post('/database/restore', cors(corsOptions), [
  middlewareAuth.isPlatformMaintainer,
  controllerDatabase.restore,
]);

/**
 * GET /database/backups/:name/download
 * Download a backup file
 * Requires platform maintainer access
 */
router.get('/database/backups/:name/download', cors(corsOptions), [
  middlewareAuth.isPlatformMaintainer,
  controllerDatabase.downloadBackup,
]);

export default router;

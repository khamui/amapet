import express from 'express';
import cors from 'cors';

import { controllerSitemap } from '../controllers/controller.sitemap.js';
import { corsOptions } from '../dbaccess.js';

const router = express.Router();

/*
 * GET sitemap data as JSON.
 */
router.get('/sitemap/data', cors(corsOptions), [controllerSitemap.getData]);

export default router;

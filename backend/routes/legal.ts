import express from 'express';
import cors from 'cors';

import { controllerLegal } from '../controllers/controller.legal.js';
import { corsOptions } from '../dbaccess.js';

const router = express.Router();

/*
 * GET legal info (imprint data from env vars).
 */
router.get('/legal-info', cors(corsOptions), [controllerLegal.getLegalInfo]);

export default router;

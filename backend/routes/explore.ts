import express from 'express';
import cors from 'cors';

import { controllerExplore } from '../controllers/controller.explore.js';
import { corsOptions } from '../dbaccess.js';
import { middlewareExplore } from '../middlewares/middleware.explore.js';
import { middlewareAuth } from '../middlewares/middleware.auth.js';

const router = express.Router();

/*
 * GET explore questions with popularity sorting.
 * Query params: ?skip=0&limit=30
 * Auth: optional (favorites boost applied if logged in)
 */
router.get('/explore', cors(corsOptions), [
  middlewareAuth.optionalUserFromToken,
  middlewareExplore.paginationCheck,
  controllerExplore.readQuestions,
]);

export default router;

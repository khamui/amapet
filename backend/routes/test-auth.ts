import express from 'express';
import cors from 'cors';
import { testAuth, testCleanup } from '../controllers/test-auth.js';
import { corsOptions } from '../dbaccess.js';

const router = express.Router();

router.post('/test-auth', cors(corsOptions), (req, res) => {
  testAuth(req, res);
});

router.post('/test-cleanup', cors(corsOptions), (req, res) => {
  testCleanup(req, res);
});

export default router;

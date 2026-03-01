import express from 'express';
import cors from 'cors';

// import controllers
import { signin as googleSignin } from '../controllers/signin-google.js';
import { signin as microsoftSignin } from '../controllers/signin-microsoft.js';

// import db functions
import { corsOptions } from '../dbaccess.js';

const router = express.Router();

// signin with google
router.post('/google-signin', cors(corsOptions), (req, res) => {
  googleSignin(req, res);
});

// signin with microsoft
router.post('/microsoft-signin', cors(corsOptions), (req, res) => {
  microsoftSignin(req, res);
});

export default router;

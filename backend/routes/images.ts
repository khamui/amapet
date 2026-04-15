import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { controllerImages } from '../controllers/controller.images.js';
import { corsOptions } from '../dbaccess.js';
import { middlewareAuth } from '../middlewares/middleware.auth.js';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 5,
  },
});

router.post('/images/upload', cors(corsOptions), [
  middlewareAuth.isAuthorized,
  upload.array('images', 5),
  controllerImages.upload,
]);

export default router;

import { Request, Response } from 'express';
import { uploadToImgBB } from '../services/service.images.js';

const ALLOWED_MIMETYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 5;

export const controllerImages = {
  upload: async (req: Request, res: Response): Promise<void> => {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      res.status(400).json({ error: 'No files provided' });
      return;
    }

    if (files.length > MAX_FILES) {
      res.status(400).json({ error: `Maximum ${MAX_FILES} files allowed` });
      return;
    }

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        res
          .status(400)
          .json({ error: `File "${file.originalname}" exceeds 5MB limit` });
        return;
      }
      if (!ALLOWED_MIMETYPES.includes(file.mimetype)) {
        res.status(400).json({
          error: `File "${file.originalname}" has unsupported type. Allowed: JPG, PNG, GIF, WebP`,
        });
        return;
      }
    }

    try {
      const urls = await Promise.all(
        files.map((file) => uploadToImgBB(file.buffer))
      );
      res.status(201).json({ urls });
    } catch (error) {
      res
        .status(500)
        .json({
          error:
            error instanceof Error ? error.message : 'Image upload failed',
        });
    }
  },
};

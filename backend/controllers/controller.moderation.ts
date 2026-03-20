import { Request, Response } from 'express';
import { Circle } from '../db/models/circle.js';
import { retrieveModel } from '../dbaccess.js';
import type { ICircleDocument } from '../db/models/circle.js';

export const controllerModeration = {
  getModeratedCircleIds: async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = req.userPayload?._id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const circles = (await retrieveModel(Circle, { $or: [{ moderators: userId }, { ownerId: userId }] })) as ICircleDocument[];
      const moderatedCircleIds = circles.map((c) => String(c._id));

      return res.status(200).json({ moderatedCircleIds });
    } catch (error) {
      console.error('Error retrieving moderated circle IDs:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
  getModeratedCircles: async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = req.userPayload?._id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const moderatedCircles = (await retrieveModel(Circle, { $or: [{ moderators: userId }, { ownerId: userId }] })) as ICircleDocument[];

      return res.status(200).json({ moderatedCircles });
    } catch (error) {
      console.error('Error retrieving moderated circles:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
};

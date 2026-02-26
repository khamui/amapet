import { Request, Response } from 'express';
import { User } from '../db/models/user.js';
import { Circle } from '../db/models/circle.js';
import { retrieveModelById } from '../dbaccess.js';
import type { IUserDocument } from '../db/models/user.js';
import type { ICircleDocument } from '../db/models/circle.js';

export const controllerModeration = {
  getModeratedCircleIds: async (req: Request, res: Response): Promise<Response> => {
    try {
      const id = req.userPayload?._id;
      if (!id) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const dbUser = (await retrieveModelById(User, id)) as IUserDocument | null;
      if (!dbUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      const { moderatedCircleIds } = dbUser;

      return res.status(200).json({ moderatedCircleIds });
    } catch (error) {
      console.error('Error retrieving profile:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
  getModeratedCircles: async (req: Request, res: Response): Promise<Response> => {
    try {
      // get users' moderated circles
      const id = req.userPayload?._id;
      if (!id) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const dbUser = (await retrieveModelById(User, id)) as IUserDocument | null;
      if (!dbUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      const { moderatedCircleIds } = dbUser;
      const moderatedCircles: ICircleDocument[] = [];

      // get circle details from moderatedCirclesIds
      for (const circleId of moderatedCircleIds) {
        const foundCircle = (await retrieveModelById(Circle, circleId)) as ICircleDocument | null;
        if (foundCircle) {
          moderatedCircles.push(foundCircle);
        }
      }
      return res.status(200).json({ moderatedCircles });
    } catch {
      return res.status(500).send("couldn't retrieve model");
    }
  },
};

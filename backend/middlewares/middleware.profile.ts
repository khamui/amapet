import { Request, Response, NextFunction } from 'express';
import { Circle } from '../db/models/circle.js';
import { aboutUpdateSchema, moderatorAddSchema } from './validators/validator.profile.js';

export const middlewareProfile = {
  isCircleOwner: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { circleId } = req.params;
    const userId = req.userPayload?._id;

    const circle = await Circle.findById(circleId);
    if (!circle) {
      res.status(404).send('Circle not found');
      return;
    }

    if (circle.ownerId !== userId) {
      res.status(403).send('Only circle owner can perform this action');
      return;
    }

    next();
  },

  aboutUpdateCheck: (req: Request, res: Response, next: NextFunction): void => {
    const { error } = aboutUpdateSchema.validate(req.body);
    if (error) {
      res.status(400).send(error.message);
    } else {
      next();
    }
  },

  moderatorAddCheck: (req: Request, res: Response, next: NextFunction): void => {
    const { error } = moderatorAddSchema.validate(req.body);
    if (error) {
      res.status(400).send(error.message);
    } else {
      next();
    }
  },
};

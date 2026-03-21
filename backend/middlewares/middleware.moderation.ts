import { Request, Response, NextFunction } from 'express';
import { Circle } from '../db/models/circle.js';
import { Answer } from '../db/models/answer.js';
import {
  moderationStatusSchema,
  moderationCloseSchema,
  moderationNoteSchema,
} from './validators/validator.moderation.js';

export const middlewareModeration = {
  isCircleModerator: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { circleId } = req.params;
    const userId = req.userPayload?._id;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const circle = await Circle.findById(circleId);

    if (!circle) {
      res.status(404).json({ error: 'Circle not found' });
      return;
    }

    const isModerator =
      circle.moderators.includes(userId) || circle.ownerId === userId;

    if (!isModerator) {
      res.status(403).json({ error: 'Forbidden: moderator access required' });
      return;
    }

    req.circle = circle;
    next();
  },

  isAnswerCircleModerator: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { answerId } = req.params;
    const userId = req.userPayload?._id;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const answer = await Answer.findById(answerId);
    if (!answer) {
      res.status(404).json({ error: 'Answer not found' });
      return;
    }

    const circle = await Circle.findOne({
      'questions._id': answer.parentId,
    });

    if (!circle) {
      const parentAnswer = await Answer.findById(answer.parentId);
      if (parentAnswer) {
        const parentCircle = await Circle.findOne({
          'questions._id': parentAnswer.parentId,
        });
        if (parentCircle) {
          const isModerator =
            parentCircle.moderators.includes(userId) ||
            parentCircle.ownerId === userId;
          if (!isModerator) {
            res
              .status(403)
              .json({ error: 'Forbidden: moderator access required' });
            return;
          }
          req.circle = parentCircle;
          next();
          return;
        }
      }
      res.status(404).json({ error: 'Circle not found for answer' });
      return;
    }

    const isModerator =
      circle.moderators.includes(userId) || circle.ownerId === userId;

    if (!isModerator) {
      res.status(403).json({ error: 'Forbidden: moderator access required' });
      return;
    }

    req.circle = circle;
    next();
  },

  statusCheck: (req: Request, res: Response, next: NextFunction): void => {
    const { error } = moderationStatusSchema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.message });
    } else {
      next();
    }
  },

  closeCheck: (req: Request, res: Response, next: NextFunction): void => {
    const { error } = moderationCloseSchema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.message });
    } else {
      next();
    }
  },

  noteCheck: (req: Request, res: Response, next: NextFunction): void => {
    const { error } = moderationNoteSchema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.message });
    } else {
      next();
    }
  },
};

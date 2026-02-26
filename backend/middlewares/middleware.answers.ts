import { Request, Response, NextFunction } from 'express';
import { answerCreateSchema, answerEditSchema } from './validators/validator.answers.js';

export const middlewareAnswers = {
  answerCreateCheck: (req: Request, res: Response, next: NextFunction): void => {
    const { error } = answerCreateSchema.validate(req.body);

    if (error) {
      console.log(error);
      res.status(500).send(error.message);
    } else {
      next();
    }
  },
  answerEditCheck: (req: Request, res: Response, next: NextFunction): void => {
    const { error } = answerEditSchema.validate(req.body);

    if (error) {
      console.log(error);
      res.status(500).send(error.message);
    } else {
      next();
    }
  },
};

import { Request, Response, NextFunction } from 'express';
import {
  circleCreateSchema,
  questionCreateSchema,
  questionEditSchema,
  questionSolutionSchema,
} from './validators/validator.circles.js';

export const middlewareCircles = {
  circleCreateCheck: (req: Request, res: Response, next: NextFunction): void => {
    const { error } = circleCreateSchema.validate(req.body);

    if (error) {
      console.log(error);
      res.status(500).send(error.message);
    } else {
      next();
    }
  },
  questionCreateCheck: (req: Request, res: Response, next: NextFunction): void => {
    const { error } = questionCreateSchema.validate(req.body);

    if (error) {
      console.log(error);
      res.status(500).send(error.message);
    } else {
      next();
    }
  },
  questionEditCheck: (req: Request, res: Response, next: NextFunction): void => {
    const { error } = questionEditSchema.validate(req.body);

    if (error) {
      console.log(error);
      res.status(500).send(error.message);
    } else {
      next();
    }
  },
  solutionUpdateCheck: (req: Request, res: Response, next: NextFunction): void => {
    const { error } = questionSolutionSchema.validate(req.body);

    if (error) {
      console.log(error);
      res.status(400).send(error.message);
    } else {
      next();
    }
  },
};

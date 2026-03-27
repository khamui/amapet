import { Request, Response, NextFunction } from 'express';
import { explorePaginationSchema } from './validators/validator.explore.js';

export const middlewareExplore = {
  paginationCheck: (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = explorePaginationSchema.validate(req.query);

    if (error) {
      res.status(400).send(error.message);
    } else {
      req.query = value;
      next();
    }
  },
};

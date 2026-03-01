import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../server.js';
import type { UserPayload } from '../types/express.js';

export const middlewareAuth = {
  isAuthorized: (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).send('Not authorized, token missing.');
      return;
    }

    const token = authHeader.split(' ')[1];

    if (token) {
      try {
        jwt.verify(token, JWT_SECRET || '');
        next();
      } catch (error) {
        res.status(401).send(error);
      }
    } else {
      res.status(401).send('Not authorized, token missing.');
    }
  },
  getUserIdFromToken: (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).send('Not authorized, token missing.');
      return;
    }

    const token = authHeader.split(' ')[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET || '') as UserPayload;
        req.userPayload = decoded;
        next();
      } catch (error) {
        res.status(401).send(error);
      }
    } else {
      res.status(401).send('Not authorized, token missing.');
    }
  },
};

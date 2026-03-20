import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../server.js';
import type { UserPayload } from '../types/express.js';
import { User } from '../db/models/user.js';

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
  isPlatformMaintainer: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).send('Not authorized, token missing.');
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      res.status(401).send('Not authorized, token missing.');
      return;
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET || '') as UserPayload;
      const user = await User.findById(decoded._id).select('permLevel');

      if (!user || user.permLevel !== 1) {
        res.status(403).send('Forbidden: platform maintainer access required.');
        return;
      }

      req.userPayload = decoded;
      next();
    } catch {
      res.status(401).send('Invalid token.');
    }
  },
};

import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { JWT_SECRET } from '../server.js';
import { User } from '../db/models/user.js';
import { generateModel, retrieveOneModelByQuery } from '../dbaccess.js';

const EXP_IN_S = 604800; // 7 days

interface TestAuthPayload {
  email?: string;
  username?: string;
  permLevel?: number;
  asModerator?: boolean;
  circleToModerate?: string;
}

export const testAuth = async (req: Request, res: Response): Promise<void> => {
  if (process.env.NODE_ENV !== 'test') {
    res.status(403).json({ error: 'Test auth endpoint only available in test environment' });
    return;
  }

  try {
    const payload: TestAuthPayload = req.body;
    const email = payload.email || `test-${Date.now()}@e2e.test`;
    const username = payload.username || `testuser_${Date.now()}`;

    let user = await retrieveOneModelByQuery(User, { email });

    if (!user) {
      const newUser = {
        email,
        username,
        firstname: 'Test',
        lastname: 'User',
        authProvider: 'google' as const,
        followedCircles: [],
        followedQuestions: [],
        aura: 0,
        permLevel: payload.permLevel || 0,
      };
      user = await generateModel(User, newUser);
    } else if (payload.permLevel !== undefined) {
      user.permLevel = payload.permLevel;
      await user.save();
    }

    const token = jwt.sign(user.toJSON(), JWT_SECRET || '', {
      expiresIn: EXP_IN_S,
    });

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        permLevel: user.permLevel,
      },
    });
  } catch (error) {
    console.error('Test auth error:', error);
    res.status(500).json({ error: 'Test auth failed' });
  }
};

interface TestCleanupPayload {
  collections?: string[];
  afterTimestamp?: number; // For circles/answers - delete where created_at > timestamp
  emailPattern?: string; // For users - delete where email matches regex
}

export const testCleanup = async (req: Request, res: Response): Promise<void> => {
  if (process.env.NODE_ENV !== 'test') {
    res.status(403).json({ error: 'Test cleanup endpoint only available in test environment' });
    return;
  }

  try {
    const { collections, afterTimestamp, emailPattern }: TestCleanupPayload = req.body;
    const deleted: Record<string, number> = {};

    if (collections && Array.isArray(collections)) {
      const dbCollections = mongoose.connection?.collections;

      if (!dbCollections) {
        res.status(503).json({ error: 'Database connection not ready' });
        return;
      }

      for (const collection of collections) {
        if (dbCollections[collection]) {
          let filter: Record<string, unknown> = {};

          // Apply selective filters based on collection type
          if (collection === 'users' && emailPattern) {
            filter = { email: { $regex: emailPattern } };
          } else if (afterTimestamp && collection !== 'users') {
            filter = { created_at: { $gt: afterTimestamp } };
          }

          const result = await dbCollections[collection].deleteMany(filter);
          deleted[collection] = result.deletedCount;
        }
      }
    }

    res.status(200).json({ success: true, deleted });
  } catch (error) {
    console.error('Test cleanup error:', error);
    res.status(500).json({ error: 'Test cleanup failed' });
  }
};

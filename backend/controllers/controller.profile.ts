import { Request, Response } from 'express';
import { Circle } from '../db/models/circle.js';
import { User } from '../db/models/user.js';
import { retrieveModelById, retrieveModel, retrieveOneModelByQuery } from '../dbaccess.js';
import type { IUserDocument } from '../db/models/user.js';
import type { ICircleDocument } from '../db/models/circle.js';

interface IUserProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  followedCircles: string[];
  followedQuestions: string[];
  respectPoints?: number;
  numOfCircles?: number;
  numOfQuestions?: number;
}

interface IOwnedCircle {
  _id: string;
  name: string;
  about: string;
  created_at: number;
  memberCount: number;
  questionCount: number;
  ownerId: string;
  moderators: { _id: string; username: string }[];
}

export const controllerProfile = {
  getProfile: async (req: Request, res: Response): Promise<Response> => {
    try {
      const id = req.userPayload?._id;
      if (!id) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const dbUser = (await retrieveModelById(User, id)) as IUserDocument | null;
      if (!dbUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      const userProfile: IUserProfile = {
        firstName: dbUser.firstname,
        lastName: dbUser.lastname,
        email: dbUser.email,
        followedCircles: dbUser.followedCircles,
        followedQuestions: dbUser.followedQuestions,
        respectPoints: dbUser.respectPoints,
      };

      // query get extra fields { numOfCircles, numOfQuestions, level }
      const dbCircles = (await retrieveModel(Circle, { ownerId: id })) as ICircleDocument[];
      userProfile.numOfCircles = dbCircles.length;
      userProfile.numOfQuestions = dbCircles.reduce((a, c) => a + c.questions.length, 0);

      return res.status(200).json({ profile: userProfile });
    } catch (error) {
      console.error('Error retrieving profile:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
  followCircle: async (req: Request, res: Response): Promise<Response> => {
    const { circleName } = req.body;
    const userId = req.userPayload?._id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const user = (await retrieveModelById(User, userId)) as IUserDocument | null;
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (!user.followedCircles.includes(circleName)) {
        // follow the circle
        user.followedCircles.push(circleName);
        await user.save();
        return res.status(200).json({
          message: 'Circle followed successfully',
          action: 'followed',
        });
      } else {
        // unfollow the circle
        user.followedCircles = user.followedCircles.filter((circle) => circle !== circleName);
        await user.save();
        return res.status(200).json({
          message: 'Circle unfollowed successfully',
          action: 'unfollowed',
        });
      }
    } catch (error) {
      console.error('Error following circle:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  getOwnedCircles: async (req: Request, res: Response): Promise<Response> => {
    const userId = req.userPayload?._id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const circles = (await retrieveModel(Circle, { ownerId: userId })) as ICircleDocument[];

      const moderatorIds = [...new Set(circles.flatMap((c) => c.moderators))];
      const moderatorUsers = (await User.find({ _id: { $in: moderatorIds } })) as IUserDocument[];
      const moderatorMap = new Map(moderatorUsers.map((u) => [u._id.toString(), u.username || '']));

      const ownedCircles: IOwnedCircle[] = circles.map((circle) => ({
        _id: circle._id.toString(),
        name: circle.name || '',
        about: circle.about || '',
        created_at: circle.created_at || 0,
        memberCount: circle.memberCount || 0,
        questionCount: circle.questions.length,
        ownerId: circle.ownerId || '',
        moderators: circle.moderators.map((modId) => ({
          _id: modId,
          username: moderatorMap.get(modId) || '',
        })),
      }));

      return res.status(200).json({ circles: ownedCircles });
    } catch (error) {
      console.error('Error retrieving owned circles:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  updateCircleAbout: async (req: Request, res: Response): Promise<Response> => {
    const { circleId } = req.params;
    const { about } = req.body;

    try {
      const circle = await Circle.findByIdAndUpdate(circleId, { about }, { new: true });
      if (!circle) {
        return res.status(404).json({ error: 'Circle not found' });
      }
      return res.status(200).json({ circle });
    } catch (error) {
      console.error('Error updating circle about:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  addModerator: async (req: Request, res: Response): Promise<Response> => {
    const { circleId } = req.params;
    const { username } = req.body;

    try {
      const user = (await retrieveOneModelByQuery(User, { username })) as IUserDocument | null;
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const userId = user._id.toString();

      const circle = await Circle.findById(circleId);
      if (!circle) {
        return res.status(404).json({ error: 'Circle not found' });
      }

      if (circle.moderators.includes(userId)) {
        return res.status(400).json({ error: 'User is already a moderator' });
      }

      circle.moderators.push(userId);
      await circle.save();

      return res.status(200).json({
        moderator: { _id: userId, username: user.username },
      });
    } catch (error) {
      console.error('Error adding moderator:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  removeModerator: async (req: Request, res: Response): Promise<Response> => {
    const { circleId, moderatorId } = req.params;

    try {
      const circle = await Circle.findById(circleId);
      if (!circle) {
        return res.status(404).json({ error: 'Circle not found' });
      }

      if (circle.ownerId === moderatorId) {
        return res.status(400).json({ error: 'Cannot remove the owner from moderators' });
      }

      circle.moderators = circle.moderators.filter((id) => id !== moderatorId);
      await circle.save();

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error removing moderator:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  searchUsers: async (req: Request, res: Response): Promise<Response> => {
    const { username } = req.query;

    if (!username || typeof username !== 'string' || username.length < 2) {
      return res.status(400).json({ error: 'Username query must be at least 2 characters' });
    }

    try {
      const users = await User.find({
        username: { $regex: `^${username}`, $options: 'i' },
      })
        .limit(10)
        .select('_id username firstname lastname');

      return res.status(200).json({ users });
    } catch (error) {
      console.error('Error searching users:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
};

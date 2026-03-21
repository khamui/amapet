import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Circle } from '../db/models/circle.js';
import { Answer } from '../db/models/answer.js';
import { retrieveModel, updateModel } from '../dbaccess.js';
import type { ICircleDocument } from '../db/models/circle.js';

export const controllerModeration = {
  getModeratedCircleIds: async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const userId = req.userPayload?._id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const circles = (await retrieveModel(Circle, {
        $or: [{ moderators: userId }, { ownerId: userId }],
      })) as ICircleDocument[];
      const moderatedCircleIds = circles.map((c) => String(c._id));

      return res.status(200).json({ moderatedCircleIds });
    } catch (error) {
      console.error('Error retrieving moderated circle IDs:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  getModeratedCircles: async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const userId = req.userPayload?._id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const moderatedCircles = (await retrieveModel(Circle, {
        $or: [{ moderators: userId }, { ownerId: userId }],
      })) as ICircleDocument[];

      return res.status(200).json({ moderatedCircles });
    } catch (error) {
      console.error('Error retrieving moderated circles:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  updateQuestionModerationStatus: async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const circleId = req.params.circleId as string;
      const questionId = req.params.questionId as string;
      const { status } = req.body;
      const userId = req.userPayload?._id;

      const updated = await updateModel(
        Circle,
        {
          _id: circleId,
          'questions._id': new mongoose.Types.ObjectId(questionId),
        },
        {
          $set: {
            'questions.$.moderationInfo.status': status,
            'questions.$.moderationInfo.lastModeratedBy': userId,
            'questions.$.moderationInfo.lastModeratedAt': Date.now(),
          },
        }
      );

      if (!updated) {
        return res.status(404).json({ error: 'Question not found' });
      }

      const question = updated.questions.find(
        (q) => q._id?.toString() === questionId
      );

      return res.status(200).json({
        success: true,
        moderationInfo: question?.moderationInfo,
      });
    } catch (error) {
      console.error('Error updating question moderation status:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  updateQuestionClosed: async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const circleId = req.params.circleId as string;
      const questionId = req.params.questionId as string;
      const { closed } = req.body;
      const userId = req.userPayload?._id;

      const updated = await updateModel(
        Circle,
        {
          _id: circleId,
          'questions._id': new mongoose.Types.ObjectId(questionId),
        },
        {
          $set: {
            'questions.$.moderationInfo.closed': closed,
            'questions.$.moderationInfo.lastModeratedBy': userId,
            'questions.$.moderationInfo.lastModeratedAt': Date.now(),
          },
        }
      );

      if (!updated) {
        return res.status(404).json({ error: 'Question not found' });
      }

      const question = updated.questions.find(
        (q) => q._id?.toString() === questionId
      );

      return res.status(200).json({
        success: true,
        moderationInfo: question?.moderationInfo,
      });
    } catch (error) {
      console.error('Error updating question closed status:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  updateQuestionNote: async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const circleId = req.params.circleId as string;
      const questionId = req.params.questionId as string;
      const { noteText } = req.body;
      const userId = req.userPayload?._id;

      const updated = await updateModel(
        Circle,
        {
          _id: circleId,
          'questions._id': new mongoose.Types.ObjectId(questionId),
        },
        {
          $set: {
            'questions.$.moderationInfo.noteText': noteText,
            'questions.$.moderationInfo.lastModeratedBy': userId,
            'questions.$.moderationInfo.lastModeratedAt': Date.now(),
          },
        }
      );

      if (!updated) {
        return res.status(404).json({ error: 'Question not found' });
      }

      const question = updated.questions.find(
        (q) => q._id?.toString() === questionId
      );

      return res.status(200).json({
        success: true,
        moderationInfo: question?.moderationInfo,
      });
    } catch (error) {
      console.error('Error updating question note:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  updateAnswerModerationStatus: async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const { answerId } = req.params;
      const { status } = req.body;
      const userId = req.userPayload?._id;

      const updated = await Answer.findByIdAndUpdate(
        answerId,
        {
          $set: {
            'moderationInfo.status': status,
            'moderationInfo.lastModeratedBy': userId,
            'moderationInfo.lastModeratedAt': Date.now(),
          },
        },
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({ error: 'Answer not found' });
      }

      return res.status(200).json({
        success: true,
        moderationInfo: updated.moderationInfo,
      });
    } catch (error) {
      console.error('Error updating answer moderation status:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  updateAnswerNote: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { answerId } = req.params;
      const { noteText } = req.body;
      const userId = req.userPayload?._id;

      const updated = await Answer.findByIdAndUpdate(
        answerId,
        {
          $set: {
            'moderationInfo.noteText': noteText,
            'moderationInfo.lastModeratedBy': userId,
            'moderationInfo.lastModeratedAt': Date.now(),
          },
        },
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({ error: 'Answer not found' });
      }

      return res.status(200).json({
        success: true,
        moderationInfo: updated.moderationInfo,
      });
    } catch (error) {
      console.error('Error updating answer note:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
};

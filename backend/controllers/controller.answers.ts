import { Request, Response } from 'express';
import { generateModel, retrieveModel, updateModel } from '../dbaccess.js';
import { Answer } from '../db/models/answer.js';
import { Circle } from '../db/models/circle.js';
import { User } from '../db/models/user.js';
import mongoose from 'mongoose';
import type { IAnswerDocument } from '../db/models/answer.js';
import type { IModerationInfo } from '../types/models.js';

interface IAnswerWithChildren {
  _id: unknown;
  parentId?: string;
  parentType?: string;
  ownerId?: string;
  ownerName?: string;
  created_at?: number;
  modded_at?: number;
  answerText?: string;
  upvotes: string[];
  downvotes: string[];
  deleted?: boolean;
  children: IAnswerWithChildren[];
  moderationInfo?: IModerationInfo;
}

const makeAnswersTree = async (
  answersOfQuestion: IAnswerDocument[],
  isModerator: boolean
): Promise<IAnswerWithChildren[]> => {
  const nestedAnswers: IAnswerWithChildren[] = [];
  for (const answer of answersOfQuestion) {
    // Skip blocked answers for non-moderators
    if (!isModerator && answer.moderationInfo?.status === 'blocked') {
      continue;
    }

    const subAnswers = (await retrieveModel(Answer, {
      parentId: answer._id,
    })) as IAnswerDocument[];
    const answerWithChildren: IAnswerWithChildren = {
      ...answer.toObject(),
      children: [],
    };
    if (subAnswers?.length > 0) {
      answerWithChildren.children = await makeAnswersTree(
        subAnswers,
        isModerator
      );
    }
    nestedAnswers.push(answerWithChildren);
  }
  return nestedAnswers;
};

const findQuestionIdFromAnswer = async (
  parentId: string,
  parentType: string
): Promise<string | null> => {
  if (parentType === 'question') {
    return parentId;
  }

  // Traverse up to find the question
  let currentParentId = parentId;
  let depth = 0;
  const maxDepth = 50; // Prevent infinite loops

  while (depth < maxDepth) {
    const parentAnswer = await Answer.findById(currentParentId);
    if (!parentAnswer) {
      return null;
    }
    if (parentAnswer.parentType === 'question') {
      return parentAnswer.parentId || null;
    }
    currentParentId = parentAnswer.parentId || '';
    depth++;
  }
  return null;
};

export const controllerAnswers = {
  readAll: async (req: Request, res: Response): Promise<void> => {
    const parentId = req.params.parentId as string;
    const userId = req.userPayload?._id;

    try {
      // Check if user is a moderator of the circle this question belongs to
      let isModerator = false;

      const circle = await Circle.findOne({
        'questions._id': new mongoose.Types.ObjectId(parentId),
      });

      if (circle && userId) {
        isModerator =
          circle.moderators.includes(userId) || circle.ownerId === userId;
      }

      const answers = (await retrieveModel(Answer, {
        parentId,
      })) as IAnswerDocument[];
      const answersWithSub = await makeAnswersTree(answers, isModerator);
      res.status(200).json(answersWithSub);
    } catch (error) {
      res.status(500).send(error);
    }
  },

  createOne: async (req: Request, res: Response): Promise<void> => {
    const { parentId, parentType, ownerId, ownerName, answerText } = req.body;

    try {
      // Check if the question is closed
      const questionId = await findQuestionIdFromAnswer(parentId, parentType);

      if (questionId) {
        const circle = await Circle.findOne({
          'questions._id': new mongoose.Types.ObjectId(questionId),
        });

        if (circle) {
          const question = circle.questions.find(
            (q) => q._id?.toString() === questionId
          );

          if (question?.moderationInfo?.closed) {
            res
              .status(400)
              .json({ error: 'Comments are closed on this question' });
            return;
          }
        }
      }

      const payload = {
        _id: new mongoose.Types.ObjectId(),
        created_at: Date.now(),
        parentId,
        parentType,
        ownerId,
        ownerName,
        answerText,
        upvotes: [ownerId],
        downvotes: [],
      };

      const newAnswer = await generateModel(Answer, payload);
      res.status(201).json(newAnswer);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  updateOneAnswer: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { toBeUpdated } = req.body;
    const filter = { _id: id };
    const updateExpr: Record<string, unknown> = {};

    for (const field of toBeUpdated as Record<string, unknown>[]) {
      Object.assign(updateExpr, field);
    }
    updateExpr['modded_at'] = Date.now();

    try {
      const updated = await updateModel(Answer, filter, updateExpr);
      res.status(200).json(updated);
    } catch (error) {
      res.status(500).send(error instanceof Error ? error.message : 'Unknown error');
    }
  },
  deleteOneAnswerContent: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const filter = { _id: id };
    const updateExpr: Record<string, unknown> = {};

    updateExpr['answerText'] = '';
    updateExpr['deleted'] = true;
    updateExpr['modded_at'] = Date.now();

    try {
      // updating here, as we keep the post, but not its content
      await updateModel(Answer, filter, updateExpr);

      // Clear solutionId from any questions that reference this answer
      await Circle.updateMany(
        { 'questions.solutionId': id },
        { $set: { 'questions.$.solutionId': null } }
      );

      res.status(204).send();
    } catch (error) {
      res.status(500).send(error instanceof Error ? error.message : 'Unknown error');
    }
  },
  updateVoteAnswer: async (
    req: Request,
    res: Response,
    direction: 'up' | 'down'
  ): Promise<void> => {
    const { id } = req.params;
    const userId = req.userPayload?._id;

    const filter = { _id: id };

    const upvoteExpr = {
      $addToSet: {
        upvotes: userId,
      },
      $pull: {
        downvotes: userId,
      },
    };

    const downvoteExpr = {
      $addToSet: {
        downvotes: userId,
      },
      $pull: {
        upvotes: userId,
      },
    };

    const updateExpr = direction === 'up' ? upvoteExpr : downvoteExpr;

    try {
      const updated = await updateModel(Answer, filter, updateExpr);

      // Update answer owner's Aura (skip self-votes)
      if (updated?.ownerId && updated.ownerId !== userId) {
        const auraChange = direction === 'up' ? 1 : -1;
        await User.findByIdAndUpdate(updated.ownerId, [
          { $set: { aura: { $max: [0, { $add: [{ $ifNull: ['$aura', 0] }, auraChange] }] } } },
        ]);
      }

      res.status(200).json(updated);
    } catch (error) {
      res.status(500).send(error instanceof Error ? error.message : 'Unknown error');
    }
  },
};

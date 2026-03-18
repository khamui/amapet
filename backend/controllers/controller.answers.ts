import { Request, Response } from 'express';
import { generateModel, retrieveModel, updateModel } from '../dbaccess.js';
import { Answer } from '../db/models/answer.js';
import { Circle } from '../db/models/circle.js';
import mongoose from 'mongoose';
import type { IAnswerDocument } from '../db/models/answer.js';

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
}

const makeAnswersTree = async (
  answersOfQuestion: IAnswerDocument[]
): Promise<IAnswerWithChildren[]> => {
  const nestedAnswers: IAnswerWithChildren[] = [];
  for (const answer of answersOfQuestion) {
    const subAnswers = (await retrieveModel(Answer, { parentId: answer._id })) as IAnswerDocument[];
    const answerWithChildren: IAnswerWithChildren = {
      ...answer.toObject(),
      children: [],
    };
    if (subAnswers?.length > 0) {
      answerWithChildren.children = await makeAnswersTree(subAnswers);
    }
    nestedAnswers.push(answerWithChildren);
  }
  return nestedAnswers;
};

export const controllerAnswers = {
  readAll: async (req: Request, res: Response): Promise<void> => {
    const { parentId } = req.params;
    try {
      const answers = (await retrieveModel(Answer, { parentId })) as IAnswerDocument[];
      const answersWithSub = await makeAnswersTree(answers);
      res.status(200).json(answersWithSub);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  createOne: async (req: Request, res: Response): Promise<void> => {
    const { parentId, parentType, ownerId, ownerName, answerText } = req.body;

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

    try {
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
      res.status(200).json(updated);
    } catch (error) {
      res.status(500).send(error instanceof Error ? error.message : 'Unknown error');
    }
  },
};

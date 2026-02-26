import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Circle } from '../db/models/circle.js';
import { Answer } from '../db/models/answer.js';
import { Notification } from '../db/models/notification.js';
import { retrieveModel, generateModel } from '../dbaccess.js';
import type { ICircleDocument } from '../db/models/circle.js';
import type { IAnswerDocument } from '../db/models/answer.js';
import type { INotification } from '../types/models.js';

const NOTIFY_THRESH_LOW = 5;
const NOTIFY_THRESH_MID = 10;
const NOTIFY_THRESH_HIGH = 20;

export const middlewareNotifications = {
  registerQuestionUpvote: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const circleId = req.params.id as string;
    const questionId = req.params.qid as string;

    const filter = {
      _id: circleId,
      'questions._id': new mongoose.Types.ObjectId(questionId),
    };

    const foundCircle = (await retrieveModel(Circle, filter)) as ICircleDocument[];
    const foundQuestion = foundCircle[0].questions.find((q) => q._id?.toString() === questionId);
    if (!foundQuestion) {
      next();
      return;
    }

    const { upvotes, downvotes } = foundQuestion;
    const totalVotes = upvotes.length - downvotes.length + 1;

    if (typeof totalVotes === 'number') {
      const payload: INotification = {
        userId: foundQuestion.ownerId,
        type: 'upvote',
        unread: true,
        originCircleId: circleId,
        originCircleName: foundCircle[0].name,
        originQuestionId: questionId,
        created_at: Date.now(),
      };

      if (totalVotes === NOTIFY_THRESH_LOW) {
        payload.value = { amount: 5 };
        await generateModel(Notification, payload);
      } else if (totalVotes === NOTIFY_THRESH_MID) {
        payload.value = { amount: 10 };
        await generateModel(Notification, payload);
      } else if (totalVotes === NOTIFY_THRESH_HIGH) {
        payload.value = { amount: 15 };
        await generateModel(Notification, payload);
      }
    }
    next();
  },
  registerAnswerUpvote: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { circleId, questionId } = req.body;
    const { id } = req.params;

    const circleFilter = { _id: circleId };
    const answerFilter = { _id: id };

    const foundCircle = (await retrieveModel(Circle, circleFilter)) as ICircleDocument[];
    const foundAnswer = (await retrieveModel(Answer, answerFilter)) as IAnswerDocument[];
    const { upvotes, downvotes } = foundAnswer[0];
    const totalVotes = upvotes.length - downvotes.length + 1;

    if (typeof totalVotes === 'number') {
      const payload: INotification = {
        userId: foundAnswer[0].ownerId,
        type: 'upvote',
        unread: true,
        originCircleId: circleId,
        originCircleName: foundCircle[0].name,
        originQuestionId: questionId,
        created_at: Date.now(),
      };

      if (totalVotes === NOTIFY_THRESH_LOW) {
        payload.value = { amount: 5 };
        await generateModel(Notification, payload);
      } else if (totalVotes === NOTIFY_THRESH_MID) {
        payload.value = { amount: 10 };
        await generateModel(Notification, payload);
      } else if (totalVotes === NOTIFY_THRESH_HIGH) {
        payload.value = { amount: 15 };
        await generateModel(Notification, payload);
      }
    }
    next();
  },
  registerComment: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const circleId = req.body.circleId;
    const questionId = req.body.questionId;
    const { parentId, parentType, answerText } = req.body;

    const filter = { _id: circleId };
    const foundCircle = (await retrieveModel(Circle, filter)) as ICircleDocument[];

    let foundParent: { ownerId?: string } | undefined;
    if (parentType === 'question') {
      foundParent = foundCircle[0].questions.find((q) => q._id?.toString() === questionId);
    } else {
      const answerFilter = { _id: parentId };
      const foundAnswer = (await retrieveModel(Answer, answerFilter)) as IAnswerDocument[];
      foundParent = foundAnswer[0];
    }

    if (!foundParent) {
      next();
      return;
    }

    const payload: INotification = {
      userId: foundParent.ownerId,
      type: 'comment',
      unread: true,
      value: { text: answerText },
      originCircleId: circleId,
      originCircleName: foundCircle[0].name,
      originQuestionId: questionId,
      created_at: Date.now(),
    };

    await generateModel(Notification, payload);
    next();
  },
};

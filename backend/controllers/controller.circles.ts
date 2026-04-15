import { Request, Response } from 'express';
import { generateModel, deleteModel, retrieveModel, updateModel } from '../dbaccess.js';
import { Circle } from '../db/models/circle.js';
import { User } from '../db/models/user.js';
import { Answer } from '../db/models/answer.js';
import { Notification } from '../db/models/notification.js';
import mongoose from 'mongoose';
import type { ICircleDocument, IQuestion } from '../db/models/circle.js';
import type { INotification } from '../types/models.js';
import { generateUniqueSlug } from '../utils/slug.utils.js';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:4000';

function invalidateSitemapCache(): void {
  fetch(`${FRONTEND_URL}/api/sitemap/invalidate`, { method: 'POST' }).catch(() => {});
}

export const controllerCircles = {
  readOne: async (req: Request, res: Response): Promise<void> => {
    const { name: circleName } = req.params;
    const userId = req.userPayload?._id;

    try {
      const filter = {
        name: `c/${circleName}`,
      };
      const foundCircles = (await retrieveModel(
        Circle,
        filter
      )) as ICircleDocument[];

      if (!foundCircles[0]) {
        res.status(404).send('Circle not found');
        return;
      }

      const circle = foundCircles[0];
      const isModerator =
        userId &&
        (circle.moderators.includes(userId) || circle.ownerId === userId);

      if (!isModerator) {
        const filteredQuestions = circle.questions.filter(
          (q) => q.moderationInfo?.status !== 'blocked'
        );
        const circleResponse = circle.toObject();
        circleResponse.questions = filteredQuestions;
        res.status(200).json(circleResponse);
        return;
      }

      res.status(200).json(circle);
    } catch {
      res.status(500).send("couldn't retrieve model");
    }
  },
  readQuestions: async (req: Request, res: Response): Promise<void> => {
    const { name: circleName } = req.params;
    const skip = parseInt(req.query.skip as string) || 0;
    const limit = parseInt(req.query.limit as string) || 50;
    const userId = req.userPayload?._id;

    try {
      // Check circle exists first
      const circle = await Circle.findOne({ name: `c/${circleName}` });
      if (!circle) {
        res.status(404).send('Circle not found');
        return;
      }

      // If no questions, return early with empty array
      if (!circle.questions || circle.questions.length === 0) {
        res.status(200).json({
          questions: [],
          pagination: { skip, limit, total: 0, hasMore: false },
        });
        return;
      }

      const pipeline = [
        { $match: { name: `c/${circleName}` } },
        { $unwind: '$questions' },
        {
          $lookup: {
            from: 'answers',
            let: { qId: { $toString: '$questions._id' } },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$parentId', '$$qId'] },
                  deleted: { $ne: true },
                },
              },
              { $count: 'count' },
            ],
            as: 'answerData',
          },
        },
        {
          $addFields: {
            'questions.answerCount': {
              $ifNull: [{ $arrayElemAt: ['$answerData.count', 0] }, 0],
            },
          },
        },
        { $sort: { 'questions.created_at': -1 as const } },
        {
          $group: {
            _id: '$_id',
            ownerId: { $first: '$ownerId' },
            moderators: { $first: '$moderators' },
            questions: { $push: '$questions' },
          },
        },
        {
          $project: {
            ownerId: 1,
            moderators: 1,
            totalQuestions: { $size: '$questions' },
            questions: { $slice: ['$questions', skip, limit] },
          },
        },
      ];

      const results = await Circle.aggregate(pipeline);
      const { questions, totalQuestions, ownerId, moderators } = results[0];

      const isModerator =
        userId && (moderators.includes(userId) || ownerId === userId);

      const filteredQuestions = isModerator
        ? questions
        : questions.filter((q: IQuestion) => q.moderationInfo?.status !== 'blocked');

      const hasMore = skip + limit < totalQuestions;

      res.status(200).json({
        questions: filteredQuestions,
        pagination: {
          skip,
          limit,
          total: totalQuestions,
          hasMore,
        },
      });
    } catch {
      res.status(500).send("couldn't retrieve questions");
    }
  },
  readAll: async (req: Request, res: Response): Promise<void> => {
    try {
      const circles = await retrieveModel(Circle);
      res.status(200).json(circles);
    } catch {
      res.status(500).send("couldn't retrieve model");
    }
  },
  existsOne: async (req: Request, res: Response): Promise<void> => {
    const { name: circleName } = req.params;
    try {
      const filter = {
        name: `c/${circleName}`,
      };
      const foundCircle = (await retrieveModel(Circle, filter)) as ICircleDocument[];
      res.status(200).json({ exists: !!foundCircle[0] });
    } catch {
      res.status(500).send("couldn't retrieve model");
    }
  },
  createOne: async (req: Request, res: Response): Promise<void> => {
    const { ownerId, name, questions } = req.body;

    const payload = {
      created_at: Date.now(),
      ownerId,
      name: `c/${name}`,
      about: '',
      questions,
      memberCount: 1,
      moderators: [ownerId],
    };
    try {
      const newCircle = (await generateModel(Circle, payload)) as ICircleDocument;
      // register owner as first moderator in User
      const userFilter = { _id: new mongoose.Types.ObjectId(ownerId) };
      const addExpr = { $push: { moderatedCircleIds: newCircle._id } };
      await updateModel(User, userFilter, addExpr);
      // Invalidate sitemap cache
      invalidateSitemapCache();
      res.status(201).json(newCircle);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  readOneQuestion: async (req: Request, res: Response): Promise<void> => {
    const circleName = req.params.name as string;
    const qidOrSlug = req.params.qid as string;
    const userId = req.userPayload?._id;

    try {
      const isObjectId = mongoose.Types.ObjectId.isValid(qidOrSlug);

      const filter = isObjectId
        ? {
            name: `c/${circleName}`,
            'questions._id': new mongoose.Types.ObjectId(qidOrSlug),
          }
        : {
            name: `c/${circleName}`,
            'questions.slug': qidOrSlug,
          };

      const foundCircles = (await retrieveModel(
        Circle,
        filter
      )) as ICircleDocument[];

      if (!foundCircles[0]) {
        res.status(404).send('Question not found');
        return;
      }

      const circle = foundCircles[0];
      const foundQuestion = isObjectId
        ? Array.from(circle.questions).find(
            (q: IQuestion) => q._id?.toString() === qidOrSlug
          )
        : Array.from(circle.questions).find(
            (q: IQuestion) => q.slug === qidOrSlug
          );

      if (!foundQuestion) {
        res.status(404).send('Question not found');
        return;
      }

      const isModerator =
        userId &&
        (circle.moderators.includes(userId) || circle.ownerId === userId);

      if (!isModerator && foundQuestion.moderationInfo?.status === 'blocked') {
        res.status(404).send('Question not found');
        return;
      }

      // 301 redirect if accessed via ObjectId and question has a slug
      if (isObjectId && foundQuestion.slug) {
        res.redirect(301, `/c/${circleName}/questions/${foundQuestion.slug}`);
        return;
      }

      res.status(200).json(foundQuestion);
    } catch {
      res.status(500).send("couldn't retrieve model");
    }
  },
  createOneQuestion: async (req: Request, res: Response): Promise<void> => {
    const circleId = req.params.id as string;
    const slug = await generateUniqueSlug(circleId, req.body.title as string);

    const payload = {
      ...req.body,
      _id: new mongoose.Types.ObjectId(),
      slug,
      created_at: Date.now(),
      circleId,
      upvotes: [req.body.ownerId],
      downvotes: [],
    };
    const filter = { _id: circleId };
    const addExpr = { $push: { questions: payload } };
    try {
      await updateModel(Circle, filter, addExpr);
      // Invalidate sitemap cache
      invalidateSitemapCache();
      res.status(201).json(payload);
    } catch (error) {
      res.status(500).send(error instanceof Error ? error.message : 'Unknown error');
    }
  },
  updateOneQuestion: async (req: Request, res: Response): Promise<void> => {
    const circleId = req.params.id as string;
    const questionId = req.params.qid as string;

    try {
      // Get current question to check if title changed
      const circle = await Circle.findById(circleId);
      const currentQuestion = circle?.questions.find(
        (q) => q._id?.toString() === questionId
      );

      if (!currentQuestion) {
        res.status(404).send('Question not found');
        return;
      }

      // Regenerate slug if title changed
      const newSlug =
        req.body.title !== currentQuestion.title
          ? await generateUniqueSlug(circleId, req.body.title, questionId)
          : currentQuestion.slug;

      const filter = {
        _id: circleId,
        'questions._id': new mongoose.Types.ObjectId(questionId),
      };

      const updateExpr = {
        $set: {
          'questions.$.title': req.body.title,
          'questions.$.body': req.body.body,
          'questions.$.images': req.body.images,
          'questions.$.slug': newSlug,
          'questions.$.modded_at': Date.now(),
        },
      };

      await updateModel(Circle, filter, updateExpr);

      // Return updated question
      const updatedQuestion = {
        _id: currentQuestion._id,
        slug: newSlug,
        circleId: currentQuestion.circleId,
        ownerId: currentQuestion.ownerId,
        ownerName: currentQuestion.ownerName,
        created_at: currentQuestion.created_at,
        modded_at: Date.now(),
        title: req.body.title,
        body: req.body.body,
        images: req.body.images,
        upvotes: currentQuestion.upvotes,
        downvotes: currentQuestion.downvotes,
        intentionId: currentQuestion.intentionId,
        solutionId: currentQuestion.solutionId,
        moderationInfo: currentQuestion.moderationInfo,
      };

      res.status(200).json(updatedQuestion);
    } catch (error) {
      res.status(500).send(error instanceof Error ? error.message : 'Unknown error');
    }
  },
  deleteOneQuestion: async (req: Request, res: Response): Promise<void> => {
    const circleId = req.params.id as string;
    const questionId = req.params.qid as string;

    try {
      await deleteModel(Circle, circleId, 'questions', questionId);
      res.status(204).send();
    } catch (error) {
      res.status(500).send(error instanceof Error ? error.message : 'Unknown error');
    }
  },
  updateVoteQuestion: async (
    req: Request,
    res: Response,
    direction: 'up' | 'down'
  ): Promise<void> => {
    const circleId = req.params.id as string;
    const questionId = req.params.qid as string;
    const userId = req.userPayload?._id;

    const filter = {
      _id: circleId,
      'questions._id': new mongoose.Types.ObjectId(questionId),
    };

    const upvoteExpr = {
      $addToSet: {
        'questions.$.upvotes': userId,
      },
      $pull: {
        'questions.$.downvotes': userId,
      },
    };

    const downvoteExpr = {
      $addToSet: {
        'questions.$.downvotes': userId,
      },
      $pull: {
        'questions.$.upvotes': userId,
      },
    };

    const updateExpr = direction === 'up' ? upvoteExpr : downvoteExpr;

    try {
      const updated = await updateModel(Circle, filter, updateExpr);
      const updatedQuestion = updated?.questions.find(
        (q: IQuestion) => q._id?.toString() === questionId
      );

      // Update question owner's Aura (skip self-votes)
      if (updatedQuestion?.ownerId && updatedQuestion.ownerId !== userId) {
        const auraChange = direction === 'up' ? 1 : -1;
        await User.findByIdAndUpdate(updatedQuestion.ownerId, [
          { $set: { aura: { $max: [0, { $add: [{ $ifNull: ['$aura', 0] }, auraChange] }] } } },
        ]);
      }

      res.status(200).json(updatedQuestion);
    } catch (error) {
      res.status(500).send(error instanceof Error ? error.message : 'Unknown error');
    }
  },
  updateQuestionSolution: async (req: Request, res: Response): Promise<void> => {
    const circleId = req.params.id as string;
    const questionId = req.params.qid as string;
    const { answerId } = req.body;
    const userId = req.userPayload?._id;

    try {
      const filter = {
        _id: circleId,
        'questions._id': new mongoose.Types.ObjectId(questionId),
      };

      const foundCircle = (await retrieveModel(Circle, filter)) as ICircleDocument[];

      if (!foundCircle[0]) {
        res.status(404).send('Question not found');
        return;
      }

      const question = foundCircle[0].questions.find(
        (q: IQuestion) => q._id?.toString() === questionId
      );

      if (!question) {
        res.status(404).send('Question not found');
        return;
      }

      if (question.ownerId !== userId) {
        res.status(403).send('Only question owner can mark solution');
        return;
      }

      if (question.intentionId !== 'question') {
        res.status(400).send('Solution marking only available for questions');
        return;
      }

      // Store previous solutionId for Aura adjustment
      const previousSolutionId = question.solutionId;

      let answer = null;
      if (answerId) {
        answer = await Answer.findById(answerId);
        if (!answer || answer.deleted) {
          res.status(400).send('Answer not found or deleted');
          return;
        }
      }

      const updateExpr = {
        $set: {
          'questions.$.solutionId': answerId,
          'questions.$.modded_at': Date.now(),
        },
      };

      const updated = await updateModel(Circle, filter, updateExpr);
      const updatedQuestion = updated?.questions.find(
        (q: IQuestion) => q._id?.toString() === questionId
      );

      // Aura adjustments for solution marking/unmarking
      // -50 from previous solution owner (if exists and different from new)
      if (previousSolutionId && previousSolutionId !== answerId) {
        const previousAnswer = await Answer.findById(previousSolutionId);
        if (previousAnswer?.ownerId) {
          await User.findByIdAndUpdate(previousAnswer.ownerId, [
            { $set: { aura: { $max: [0, { $add: [{ $ifNull: ['$aura', 0] }, -50] }] } } },
          ]);
        }
      }

      // +50 to new solution owner (if marking and not same as previous)
      if (answerId && answer && answerId !== previousSolutionId) {
        await User.findByIdAndUpdate(answer.ownerId, [
          { $set: { aura: { $add: [{ $ifNull: ['$aura', 0] }, 50] } } },
        ]);
      }

      // Create notification for answer owner (if marking solution and not own answer)
      if (answerId && answer && answer.ownerId !== userId) {
        const notifPayload: INotification = {
          userId: answer.ownerId,
          type: 'solution',
          unread: true,
          originCircleId: circleId,
          originCircleName: foundCircle[0].name,
          originQuestionId: questionId,
          created_at: Date.now(),
        };
        await generateModel(Notification, notifPayload);
      }

      res.status(200).json(updatedQuestion);
    } catch (error) {
      res.status(500).send(error instanceof Error ? error.message : 'Unknown error');
    }
  },
};

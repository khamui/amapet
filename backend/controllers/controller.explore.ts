import { Request, Response } from 'express';
import { Circle } from '../db/models/circle.js';
import { User } from '../db/models/user.js';

export const controllerExplore = {
  readQuestions: async (req: Request, res: Response): Promise<void> => {
    const skip = parseInt(req.query.skip as string) || 0;
    const limit = parseInt(req.query.limit as string) || 30;
    const userId = req.userPayload?._id;

    try {
      let userFavorites: string[] = [];
      if (userId) {
        const user = await User.findById(userId).select('followedQuestions');
        userFavorites = user?.followedQuestions || [];
      }

      const now = Date.now();

      const pipeline = [
        { $unwind: '$questions' },
        { $match: { 'questions.moderationInfo.status': { $ne: 'blocked' } } },
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
            'questions.circleName': '$name',
            'questions.answerCount': {
              $ifNull: [{ $arrayElemAt: ['$answerData.count', 0] }, 0],
            },
            'questions.baseScore': {
              $add: [
                {
                  $subtract: [
                    { $size: '$questions.upvotes' },
                    { $size: '$questions.downvotes' },
                  ],
                },
                {
                  $multiply: [
                    { $ifNull: [{ $arrayElemAt: ['$answerData.count', 0] }, 0] },
                    2,
                  ],
                },
                {
                  $cond: [
                    { $in: [{ $toString: '$questions._id' }, userFavorites] },
                    25,
                    0,
                  ],
                },
              ],
            },
            'questions.ageInDays': {
              $divide: [
                { $subtract: [now, '$questions.created_at'] },
                86400000,
              ],
            },
            'questions.isFavorite': {
              $in: [{ $toString: '$questions._id' }, userFavorites],
            },
          },
        },
        {
          $addFields: {
            'questions.popularityScore': {
              $divide: [
                '$questions.baseScore',
                {
                  $add: [1, { $multiply: ['$questions.ageInDays', 0.1] }],
                },
              ],
            },
          },
        },
        {
          $sort: {
            'questions.popularityScore': -1 as const,
            'questions.created_at': -1 as const,
          },
        },
        {
          $facet: {
            questions: [
              { $skip: skip },
              { $limit: limit },
              { $replaceRoot: { newRoot: '$questions' } },
            ],
            total: [{ $count: 'count' }],
          },
        },
      ];

      const results = await Circle.aggregate(pipeline);

      const questions = results[0]?.questions || [];
      const total = results[0]?.total[0]?.count || 0;
      const hasMore = skip + limit < total;

      res.status(200).json({
        questions,
        pagination: {
          skip,
          limit,
          total,
          hasMore,
        },
      });
    } catch (error) {
      console.error('Explore error:', error);
      res.status(500).send("couldn't retrieve explore questions");
    }
  },
};

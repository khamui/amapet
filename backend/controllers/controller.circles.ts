import { Request, Response } from 'express';
import { generateModel, deleteModel, retrieveModel, updateModel } from '../dbaccess.js';
import { Circle } from '../db/models/circle.js';
import { User } from '../db/models/user.js';
import mongoose from 'mongoose';
import type { ICircleDocument, IQuestion } from '../db/models/circle.js';

export const controllerCircles = {
  readOne: async (req: Request, res: Response): Promise<void> => {
    const { name: circleName } = req.params;
    try {
      const filter = {
        name: `c/${circleName}`,
      };
      const foundCircle = (await retrieveModel(Circle, filter)) as ICircleDocument[];
      res.status(200).json(foundCircle[0]);
    } catch {
      res.status(500).send("couldn't retrieve model");
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
      res.status(201).json(newCircle);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  readOneQuestion: async (req: Request, res: Response): Promise<void> => {
    const circleName = req.params.name as string;
    const questionId = req.params.qid as string;
    try {
      const filter = {
        name: `c/${circleName}`,
        'questions._id': new mongoose.Types.ObjectId(questionId),
      };
      const foundCircle = (await retrieveModel(Circle, filter)) as ICircleDocument[];
      const foundQuestion = Array.from(foundCircle[0].questions).find(
        (q: IQuestion) => q._id?.toString() === questionId
      );
      res.status(200).json(foundQuestion);
    } catch {
      res.status(500).send("couldn't retrieve model");
    }
  },
  createOneQuestion: async (req: Request, res: Response): Promise<void> => {
    const payload = {
      ...req.body,
      _id: new mongoose.Types.ObjectId(),
      created_at: Date.now(),
      circleId: req.params.id,
      upvotes: [req.body.ownerId],
      downvotes: [],
    };
    const filter = { _id: req.params.id };
    const addExpr = { $push: { questions: payload } };
    try {
      await updateModel(Circle, filter, addExpr);
      res.status(201).json(payload);
    } catch (error) {
      res.status(500).send(error instanceof Error ? error.message : 'Unknown error');
    }
  },
  updateOneQuestion: async (req: Request, res: Response): Promise<void> => {
    const circleId = req.params.id as string;
    const questionId = req.params.qid as string;

    const filter = {
      _id: circleId,
      'questions._id': new mongoose.Types.ObjectId(questionId),
    };

    const updateExpr = {
      $set: {
        'questions.$.title': req.body.title,
        'questions.$.body': req.body.body,
        'questions.$.modded_at': Date.now(),
      },
    };

    try {
      const updated = await updateModel(Circle, filter, updateExpr);
      res.status(200).json(updated);
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
      res.status(200).json(updatedQuestion);
    } catch (error) {
      res.status(500).send(error instanceof Error ? error.message : 'Unknown error');
    }
  },
};

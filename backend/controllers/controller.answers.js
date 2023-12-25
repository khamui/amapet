import {
  generateModel,
  retrieveModel,
  updateModel,
} from "../dbaccess.js";
import { Answer } from "../db/models/answer.js";
import mongoose from "mongoose";

const makeAnswersTree = async (answersOfQuestion) => {
  const nestedAnswers = [];
  for (const answer of answersOfQuestion) {
    const subAnswers = await retrieveModel(Answer, { parentId: answer._id });
    if (subAnswers?.length > 0) {
      answer.children = await makeAnswersTree(subAnswers);
    }
    nestedAnswers.push(answer)
  }
  return nestedAnswers;
}

export const controllerAnswers = {
  readAll: async (req, res) => {
    const { parentId } = req.params;
    try {
      const answers = await retrieveModel(Answer, { parentId });
      const answersWithSub = await makeAnswersTree(answers, parentId);
      res.status(200).json(answersWithSub);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  createOne: async (req, res) => {
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
  updateOneAnswer: async (req, res) => {
    const { id } = req.params;
    const { toBeUpdated } = req.body;
    const filter = { _id: id };
    const updateExpr = {};

    for (const field of toBeUpdated) {
      Object.assign(updateExpr, field);
    }
    updateExpr['modded_at'] = Date.now();

    try {
      const updated = await updateModel(Answer, filter, updateExpr);
      res.status(200).json(updated);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
  deleteOneAnswerContent: async (req, res) => {
    const { id } = req.params;
    const filter = { _id: id };
    const updateExpr = {};

    updateExpr['answerText'] = '';
    updateExpr['deleted'] = true;
    updateExpr['modded_at'] = Date.now();

    try {
      // udating here, as we keep the post, but not its content
      await updateModel(Answer, filter, updateExpr);
      res.status(204).send();
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
  updateVoteAnswer: async (req, res, direction) => {
    const { id } = req.params;

    const filter = { _id: id };

    const upvoteExpr = {
      $addToSet: {
        "upvotes": req.userPayload._id
      },
      $pull: {
        "downvotes": req.userPayload._id
      },
    };

    const downvoteExpr = {
      $addToSet: {
        "downvotes": req.userPayload._id
      },
      $pull: {
        "upvotes": req.userPayload._id
      },
    };

    const updateExpr = direction === 'up'
      ? upvoteExpr
      : downvoteExpr;

    try {
      const updated = await updateModel(Answer, filter, updateExpr);
      res.status(200).json(updated);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
};

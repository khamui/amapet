import {
  generateModel,
  deleteModel,
  retrieveModel,
  retrieveModelById,
  updateModel,
} from "../dbaccess.js";
import { Answer } from "../db/models/answer.js";
import mongoose from "mongoose";

const accumSubAnswers = async (answers) => {
  const answersCopy = [...answers];
  for (const answer of answersCopy) {
    const subAnswer = await retrieveModel(Answer, { parentId: answer._id });
    answer["totalSubAnswers"] = subAnswer.length;
  }
  return answersCopy;
};

export const controllerAnswers = {
  readAll: async (req, res) => {
    const { parentId } = req.params;
    try {
      const answers = await retrieveModel(Answer, { parentId });
      const answersWithSub = await accumSubAnswers(answers);
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
      upvotes: 0,
      downvotes: 0,
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
  deleteOneAnswerAndChildren: async (req, res) => {
    const circleId = req.params.id;
    const questionId = req.params.qid;

    try {
      await deleteModel(Answer, circleId, "questions", questionId);
      res.status(204).send();
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
};

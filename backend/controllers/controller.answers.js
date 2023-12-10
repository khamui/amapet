import {
  generateModel,
  deleteModel,
  retrieveModel,
  updateModel,
} from "../dbaccess.js";
import { Answer } from "../db/models/answer.js";
import mongoose from "mongoose";

const accumSubAnswers = async (answers) => {
  const answersCopy = [...answers];
  for (const answer of answersCopy) {
    const subAnswer = await retrieveModel(Answer, { parentId: answer._id });
    answer['totalSubAnswers'] = subAnswer.length;
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
    const circleId = req.params.id;
    const questionId = req.params.qid;

    const filter = {
      _id: circleId,
      "questions._id": new mongoose.Types.ObjectId(questionId),
    };

    const updateExpr = {
      $set: {
        "questions.$.title": req.body.title,
        "questions.$.body": req.body.body,
        "questions.$.modded_at": Date.now(),
      },
    };

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

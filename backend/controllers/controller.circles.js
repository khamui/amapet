import {
  generateModel,
  deleteModel,
  retrieveModel,
  updateModel,
} from "../dbaccess.js";
import { Circle } from "../db/models/circle.js";
import mongoose from "mongoose";

export const controllerCircles = {
  readOne: async (req, res) => {
    const { name: circleName } = req.params;
    try {
      const filter = {
        name: `c/${circleName}`,
      };
      const foundCircle = await retrieveModel(Circle, filter);
      res.status(200).json(foundCircle[0]);
    } catch (error) {
      res.status(500).send("couldn't retrieve model");
    }
  },
  readAll: async (req, res) => {
    try {
      const circles = await retrieveModel(Circle);
      res.status(200).json(circles);
    } catch (error) {
      res.status(500).send("couldn't retrieve model");
    }
  },
  createOne: async (req, res) => {
    const { ownerId, name, questions } = req.body;

    const payload = {
      created_at: Date.now(),
      ownerId,
      name: `c/${name}`,
      about: "",
      questions,
      memberCount: 1,
      moderators: [ownerId],
    };

    try {
      const newCircle = await generateModel(Circle, payload);
      res.status(201).json(newCircle);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  readOneQuestion: async (req, res) => {
    const { name: circleName, qid: questionId } = req.params;
    try {
      const filter = {
        name: `c/${circleName}`,
        "questions._id": new mongoose.Types.ObjectId(questionId),
      };
      const foundCircle = await retrieveModel(Circle, filter);
      const foundQuestion = Array.from(foundCircle[0].questions).find(
        (q) => q._id.toString() === questionId,
      );
      res.status(200).json(foundQuestion);
    } catch (error) {
      res.status(500).send("couldn't retrieve model");
    }
  },
  createOneQuestion: async (req, res) => {
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
      res.status(500).send(error.message);
    }
  },
  updateOneQuestion: async (req, res) => {
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
      const updated = await updateModel(Circle, filter, updateExpr);
      res.status(200).json(updated);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
  deleteOneQuestion: async (req, res) => {
    const circleId = req.params.id;
    const questionId = req.params.qid;

    try {
      await deleteModel(Circle, circleId, "questions", questionId);
      res.status(204).send();
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
  updateVoteQuestion: async (req, res, direction) => {
    const circleId = req.params.id;
    const questionId = req.params.qid;

    const filter = {
      _id: circleId,
      "questions._id": new mongoose.Types.ObjectId(questionId),
    };

    const upvoteExpr = {
      $addToSet: {
        "questions.$.upvotes": req.userPayload._id,
      },
      $pull: {
        "questions.$.downvotes": req.userPayload._id,
      },
    };

    const downvoteExpr = {
      $addToSet: {
        "questions.$.downvotes": req.userPayload._id,
      },
      $pull: {
        "questions.$.upvotes": req.userPayload._id,
      },
    };

    const updateExpr = direction === "up" ? upvoteExpr : downvoteExpr;

    try {
      const updated = await updateModel(Circle, filter, updateExpr);
      res.status(200).json(updated);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
};

import { generateModel, updateModel } from "../dbaccess.js";
import { Circle } from "../db/models/circle.js";
import mongoose from "mongoose";

export const controllerCircles = {
  createOne: async (req, res) => {
    const { ownerId, name } = req.body;

    const payload = {
      created_at: Date.now(),
      ownerId,
      name: `c/${name}`,
      about: "",
      questions: [],
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
  createOneQuestion: async (req, res) => {
    const payload = {
      ...req.body,
      _id: new mongoose.Types.ObjectId(),
      created_at: Date.now(),
      circleId: req.params.id,
      answers: []
    };
    const mongoExpr = { $push: { 'questions': payload }};
    try {
      const newQuestion = await updateModel(Circle, req.params.id, mongoExpr);
      res.status(201).json(newQuestion);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
};

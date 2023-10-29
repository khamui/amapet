import { generateModel, updateModel } from "../dbaccess.js";
import { Circle } from "../db/models/circle.js";

export const controllerCircles = {
  createOne: async (req, res) => {
    const { ownerId, name } = req.body;

    const payload = {
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
      circleId: req.params.id,
    };
    const mongoExpr = { $push: { 'questions': payload }};
    try {
      const newQuestion = await updateModel(Circle, req.params.id, payload);
      res.status(201).json(newQuestion);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
};

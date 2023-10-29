import { generateModel } from "../dbaccess.js";
import { Circle } from "../db/models/circle.js";
import { Question } from "../db/models/question.js";

export const controllerCircles = {
  createOne: async (req, res) => {
    const {
      ownerId,
      name
    } = req.body;

    const payload = {
      ownerId,
      name: `c/${name}`,
      about: '',
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
      circleId: req.params.id
    };
    try {
      const newQuestion = await generateModel(Question, payload);
      res.status(201).json(newQuestion);
    } catch (error) {
      res.status(500).send(error);
    }
  }

}

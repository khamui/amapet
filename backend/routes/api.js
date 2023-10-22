import express from "express";
import cors from "cors";

// import models
import { Question } from "../db/models/question.js";

// import controllers
import { signin } from "../controllers/signin-google.js";
import { controllerCircles } from "../controllers/controller.circles.js";

// import db functions
import {
  corsOptions,
  retrieveModel,
  retrieveModelById,
  generateModel,
} from "../dbaccess.js";
import { Circle } from "../db/models/circle.js";

// import middlewares
import { middlewareCircles } from "../middlewares/middleware.circles.js";
import { middlewareAuth } from "../middlewares/middleware.auth.js";

// prepare endpoints
export const api = express.Router();

/*
 * GET all questions.
 */
api.get("/questions", cors(corsOptions), async (req, res) => {
  try {
    const questions = await retrieveModel(Question);
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).send(error);
  }
});

/*
 * GET all posts of topic.
 */
// tbd

/*
 * GET one post
 */
api.get("/questions/:id", cors(corsOptions), async (req, res) => {
  try {
    const question = await retrieveModelById(Question, req.param.id);
    res.status(200).json(question);
  } catch (error) {
    res.status(500).send(error);
  }
});

/*
 * Create a post.
 */
api.post("/questions", cors(corsOptions), async (req, res) => {
  const payload = {
    circleId: req.circleId,
    ownerId: req.ownerId,
    title: req.body.title,
    body: req.body.body,
    upvotes: req.body.upvotes,
    downvotes: req.body.downvotes
  };
  try {
    const newQuestion = await generateModel(Question, payload);
    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(500).send(error);
  }
});

/*
 * GET all posts.
 */
api.get("/circles", cors(corsOptions),
  async (req, res) => {
    try {
      const circles = await retrieveModel(Circle);
      res.status(200).json(circles);
    } catch (error) {
      res.status(500).send(error);
    }
  },
);

/*
 * Create a circle.
 */
api.post("/circles", cors(corsOptions), [
  middlewareAuth.isAuthorized,
  middlewareCircles.hasRequired,
  controllerCircles.createOne,
]);
//api.post("/circles", cors(corsOptions), async (req, res) => {
//});

// signin with google
api.post("/google-signin", cors(corsOptions), (req, res) => {
  signin(req, res);
});

import express from "express";
import cors from "cors";
// import controllers
import { controllerAnswers } from "../controllers/controller.answers.js";

// import db functions
import { corsOptions } from "../dbaccess.js";

// import middlewares
import { middlewareAnswers } from "../middlewares/middleware.answers.js";
import { middlewareAuth } from "../middlewares/middleware.auth.js";

const router = express.Router();

/*
 * GET all answers and subanswers of question.
 */
router.get("/answers/:parentId", cors(corsOptions), [
  controllerAnswers.readAll,
]);

/*
 * Create an answer in question.
 */
router.post("/answers/create", cors(corsOptions), [
  middlewareAuth.isAuthorized,
  middlewareAnswers.answerCreateCheck,
  controllerAnswers.createOne,
]);

/*
 * Update an answer in question.
 */
router.put("/answers/:id/update", cors(corsOptions), [
  middlewareAuth.isAuthorized,
  // add is owner middleware!
  middlewareAnswers.answerEditCheck,
  controllerAnswers.updateOneAnswer,
]);

/*
 * Delete an answer and its children-answers in question.
 */
router.delete("/answers/:id/delete", cors(corsOptions), [
  middlewareAuth.isAuthorized,
  controllerAnswers.deleteOneAnswerContent,
]);

/*
 * Update a question's votes value. Upvote increment.
 */
router.put("/answers/:id/upvote", cors(corsOptions), [
  middlewareAuth.isAuthorized,
  middlewareAuth.getUserIdFromToken,
  (req, res) => controllerAnswers.updateVoteAnswer(req, res, 'up')
])

/*
 * Update a question's votes value. Downvote increment.
 */
router.put("/answers/:id/downvote", cors(corsOptions), [
  middlewareAuth.isAuthorized,
  middlewareAuth.getUserIdFromToken,
  (req, res) => controllerAnswers.updateVoteAnswer(req, res, 'down')
])

export default router;

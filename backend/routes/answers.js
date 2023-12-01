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
  middlewareAnswers.answerEditCheck,
  controllerAnswers.updateOneAnswer,
]);

/*
 * Delete an answer and its children-answers in question.
 */
router.delete("/answers/:id/delete", cors(corsOptions), [
  middlewareAuth.isAuthorized,
  controllerAnswers.deleteOneAnswerAndChildren,
]);

export default router;
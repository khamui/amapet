import express from "express";
import cors from "cors";

// import controllers
import { signin } from "../controllers/signin-google.js";
import { controllerCircles } from "../controllers/controller.circles.js";

// import db functions
import { corsOptions } from "../dbaccess.js";

// import middlewares
import { middlewareCircles } from "../middlewares/middleware.circles.js";
import { middlewareAuth } from "../middlewares/middleware.auth.js";

const router = express.Router();

/*
 * GET all circles.
 */
router.get("/circles", cors(corsOptions), [
  controllerCircles.readAll
]);

/*
 * Create a circle.
 */
router.post("/circles", cors(corsOptions), [
  middlewareAuth.isAuthorized,
  middlewareCircles.circleCreateCheck,
  controllerCircles.createOne,
]);

/*
 * Create a question in circle.
 */
router.post("/circles/:id/questions/create", cors(corsOptions), [
  middlewareAuth.isAuthorized,
  middlewareCircles.questionCreateCheck,
  controllerCircles.createOneQuestion,
]);

/*
 * Update a question in circle.
 */
router.put("/circles/:id/questions/:qid/update", cors(corsOptions), [
  middlewareAuth.isAuthorized,
  middlewareCircles.questionEditCheck,
  controllerCircles.updateOneQuestion,
]);

/*
 * Delete a question in circle.
 */
router.delete("/circles/:id/questions/:qid/delete", cors(corsOptions), [
  middlewareAuth.isAuthorized,
  controllerCircles.deleteOneQuestion,
]);

// signin with google
router.post("/google-signin", cors(corsOptions), (req, res) => {
  signin(req, res);
});

export default router;

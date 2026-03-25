import express, { Request, Response } from 'express';
import cors from 'cors';

// import controllers
import { controllerCircles } from '../controllers/controller.circles.js';

// import db functions
import { corsOptions } from '../dbaccess.js';

// import middlewares
import { middlewareCircles } from '../middlewares/middleware.circles.js';
import { middlewareAuth } from '../middlewares/middleware.auth.js';
import { middlewareNotifications } from '../middlewares/middleware.notifications.js';

const router = express.Router();

// ############ CIRCLES #############
/*
 * GET a circle by circle name.
 */
router.get('/circles/:name', cors(corsOptions), [
  middlewareAuth.optionalUserFromToken,
  controllerCircles.readOne,
]);

/*
 * GET all circles.
 */
router.get('/circles', cors(corsOptions), [controllerCircles.readAll]);

/*
 * GET exists circle by circle name.
 */
router.get('/circles/:name/exists', cors(corsOptions), [controllerCircles.existsOne]);

/*
 * Create a circle.
 */
router.post('/circles', cors(corsOptions), [
  middlewareAuth.isAuthorized,
  middlewareCircles.circleCreateCheck,
  controllerCircles.createOne,
]);

// ############ QUESTIONS #############

/*
 * GET paginated questions in a circle by circle name.
 * Query params: ?skip=0&limit=50
 */
router.get('/circles/:name/questions', cors(corsOptions), [
  middlewareAuth.optionalUserFromToken,
  middlewareCircles.questionsPaginationCheck,
  controllerCircles.readQuestions,
]);

/*
 * GET a question in circle by circle name.
 */
router.get('/circles/:name/questions/:qid', cors(corsOptions), [
  middlewareAuth.optionalUserFromToken,
  controllerCircles.readOneQuestion,
]);

/*
 * Create a question in circle by circle id.
 */
router.post('/circles/:id/questions/create', cors(corsOptions), [
  middlewareAuth.isAuthorized,
  middlewareCircles.questionCreateCheck,
  controllerCircles.createOneQuestion,
]);

/*
 * Update a question in circle by circle id.
 */
router.put('/circles/:id/questions/:qid/update', cors(corsOptions), [
  middlewareAuth.isAuthorized,
  middlewareCircles.questionEditCheck,
  controllerCircles.updateOneQuestion,
]);

/*
 * Delete a question in circle by circle id.
 */
router.delete('/circles/:id/questions/:qid/delete', cors(corsOptions), [
  middlewareAuth.isAuthorized,
  controllerCircles.deleteOneQuestion,
]);

/*
 * Update a question's votes value. Upvote increment.
 */
router.put('/circles/:id/questions/:qid/upvote', cors(corsOptions), [
  middlewareAuth.isAuthorized,
  middlewareAuth.getUserIdFromToken,
  middlewareNotifications.registerQuestionUpvote,
  (req: Request, res: Response) => controllerCircles.updateVoteQuestion(req, res, 'up'),
]);

/*
 * Update a question's votes value. Downvote increment.
 */
router.put('/circles/:id/questions/:qid/downvote', cors(corsOptions), [
  middlewareAuth.isAuthorized,
  middlewareAuth.getUserIdFromToken,
  (req: Request, res: Response) => controllerCircles.updateVoteQuestion(req, res, 'down'),
]);

/*
 * Set/unset solution for a question.
 */
router.put('/circles/:id/questions/:qid/solution', cors(corsOptions), [
  middlewareAuth.isAuthorized,
  middlewareAuth.getUserIdFromToken,
  middlewareCircles.solutionUpdateCheck,
  controllerCircles.updateQuestionSolution,
]);

export default router;

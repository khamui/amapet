import express from 'express';
import cors from 'cors';

// import controllers
import { controllerModeration } from '../controllers/controller.moderation.js';

// import middlewares
import { middlewareAuth } from '../middlewares/middleware.auth.js';
import { middlewareModeration } from '../middlewares/middleware.moderation.js';

// import db functions
import { corsOptions } from '../dbaccess.js';

const router = express.Router();

// get moderated circle IDs
router.get('/moderatedCircleIds', cors(corsOptions), [
  middlewareAuth.isAuthorized,
  middlewareAuth.getUserIdFromToken,
  controllerModeration.getModeratedCircleIds,
]);

// get moderated circles with full data
router.get('/moderatedCircles', cors(corsOptions), [
  middlewareAuth.isAuthorized,
  middlewareAuth.getUserIdFromToken,
  controllerModeration.getModeratedCircles,
]);

// Question moderation endpoints
router.put('/moderation/circles/:circleId/questions/:questionId/status', cors(corsOptions), [
  middlewareAuth.isAuthorized,
  middlewareAuth.getUserIdFromToken,
  middlewareModeration.isCircleModerator,
  middlewareModeration.statusCheck,
  controllerModeration.updateQuestionModerationStatus,
]);

router.put('/moderation/circles/:circleId/questions/:questionId/close', cors(corsOptions), [
  middlewareAuth.isAuthorized,
  middlewareAuth.getUserIdFromToken,
  middlewareModeration.isCircleModerator,
  middlewareModeration.closeCheck,
  controllerModeration.updateQuestionClosed,
]);

router.put('/moderation/circles/:circleId/questions/:questionId/note', cors(corsOptions), [
  middlewareAuth.isAuthorized,
  middlewareAuth.getUserIdFromToken,
  middlewareModeration.isCircleModerator,
  middlewareModeration.noteCheck,
  controllerModeration.updateQuestionNote,
]);

// Answer moderation endpoints
router.put('/moderation/answers/:answerId/status', cors(corsOptions), [
  middlewareAuth.isAuthorized,
  middlewareAuth.getUserIdFromToken,
  middlewareModeration.isAnswerCircleModerator,
  middlewareModeration.statusCheck,
  controllerModeration.updateAnswerModerationStatus,
]);

router.put('/moderation/answers/:answerId/note', cors(corsOptions), [
  middlewareAuth.isAuthorized,
  middlewareAuth.getUserIdFromToken,
  middlewareModeration.isAnswerCircleModerator,
  middlewareModeration.noteCheck,
  controllerModeration.updateAnswerNote,
]);

export default router;

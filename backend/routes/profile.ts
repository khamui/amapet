import express from 'express';
import cors from 'cors';

// import controllers
import { controllerProfile } from '../controllers/controller.profile.js';

// import middlewares
import { middlewareAuth } from '../middlewares/middleware.auth.js';
import { middlewareProfile } from '../middlewares/middleware.profile.js';

// import db functions
import { corsOptions } from '../dbaccess.js';

const router = express.Router();

// get profile information from db & db queries
router.get('/profile', cors(corsOptions), [
  middlewareAuth.isAuthorized,
  middlewareAuth.getUserIdFromToken,
  controllerProfile.getProfile,
]);

/*
 * Follow a circle.
 */
router.post('/follow-circle', cors(corsOptions), [
  middlewareAuth.isAuthorized,
  middlewareAuth.getUserIdFromToken,
  controllerProfile.followCircle,
]);

/*
 * Get circles owned by current user.
 */
router.get('/profile/circles', cors(corsOptions), [
  middlewareAuth.isAuthorized,
  middlewareAuth.getUserIdFromToken,
  controllerProfile.getOwnedCircles,
]);

/*
 * Update circle about field.
 */
router.patch('/profile/circles/:circleId/about', cors(corsOptions), [
  middlewareAuth.isAuthorized,
  middlewareAuth.getUserIdFromToken,
  middlewareProfile.isCircleOwner,
  middlewareProfile.aboutUpdateCheck,
  controllerProfile.updateCircleAbout,
]);

/*
 * Add moderator to circle.
 */
router.post('/profile/circles/:circleId/moderators', cors(corsOptions), [
  middlewareAuth.isAuthorized,
  middlewareAuth.getUserIdFromToken,
  middlewareProfile.isCircleOwner,
  middlewareProfile.moderatorAddCheck,
  controllerProfile.addModerator,
]);

/*
 * Remove moderator from circle.
 */
router.delete('/profile/circles/:circleId/moderators/:moderatorId', cors(corsOptions), [
  middlewareAuth.isAuthorized,
  middlewareAuth.getUserIdFromToken,
  middlewareProfile.isCircleOwner,
  controllerProfile.removeModerator,
]);

/*
 * Search users by username.
 */
router.get('/users/search', cors(corsOptions), [
  middlewareAuth.isAuthorized,
  controllerProfile.searchUsers,
]);

export default router;

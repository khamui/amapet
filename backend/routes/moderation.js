import express from "express";
import cors from "cors";

// import controllers
import { controllerModeration } from "../controllers/controller.moderation.js";

// import middlewares
import { middlewareAuth } from "../middlewares/middleware.auth.js";

// import db functions
import { corsOptions } from "../dbaccess.js";

const router = express.Router();

// get profile information from db & db queries
router.get("/moderatedCircleIds", cors(corsOptions), [
  middlewareAuth.isAuthorized,
  middlewareAuth.getUserIdFromToken,
  controllerModeration.getModeratedCircleIds,
]);

// get profile information from db & db queries
router.get("/moderatedCircles", cors(corsOptions), [
  middlewareAuth.isAuthorized,
  middlewareAuth.getUserIdFromToken,
  controllerModeration.getModeratedCircles,
]);

/*
 * Add user as moderator of a circle.
 */
//router.post("/moderate-circle", cors(corsOptions), [
//  middlewareAuth.isAuthorized,
//  middlewareAuth.getUserIdFromToken,
//  //middlewareCircles.circleCreateCheck,
//  controllerProfile.followCircle,
//]);

export default router;

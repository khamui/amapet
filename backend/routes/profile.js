import express from "express";
import cors from "cors";

// import controllers
import { controllerProfile } from "../controllers/controller.profile.js";

// import middlewares
import { middlewareAuth } from "../middlewares/middleware.auth.js";

// import db functions
import { corsOptions } from "../dbaccess.js";

const router = express.Router();

// get profile information from db & db queries
router.get("/profile", cors(corsOptions), [
  middlewareAuth.isAuthorized,
  middlewareAuth.getUserIdFromToken,
  controllerProfile.getProfile,
]);

/*
 * Follow a circle.
 */
router.post("/follow-circle", cors(corsOptions), [
  middlewareAuth.isAuthorized,
  middlewareAuth.getUserIdFromToken,
  //middlewareCircles.circleCreateCheck,
  controllerProfile.followCircle,
]);

export default router;

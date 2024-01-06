import express from "express";
import cors from "cors";
// import controllers
import { controllerNotifications } from "../controllers/controller.notifications.js";

// import db functions
import { corsOptions } from "../dbaccess.js";

// import middlewares
import { middlewareAuth } from "../middlewares/middleware.auth.js";

const router = express.Router();

/*
 * GET all notifications for user in jwt.
 */
router.get("/notifications", cors(corsOptions), [
  middlewareAuth.isAuthorized,
  middlewareAuth.getUserIdFromToken,
  controllerNotifications.readAll,
]);

export default router;

import express from "express";
import cors from "cors";

// import controllers
import { controllerSettings } from "../controllers/controller.settings.js";

// import db functions
import { corsOptions } from "../dbaccess.js";

// import middlewares
//import { middlewareCircles } from "../middlewares/middleware.circles.js";
import { middlewareAuth } from "../middlewares/middleware.auth.js";
//import { middlewareNotifications } from "../middlewares/middleware.notifications.js";

const router = express.Router();

/*
 * GET settings value by settings key.
 */
router.get("/settings/:key", cors(corsOptions), [
  middlewareAuth.isAuthorized,
  controllerSettings.readValuesByKey,
]);

/*
 * GET all settings.
 */
router.get("/settings", cors(corsOptions), [
  middlewareAuth.isAuthorized,
  controllerSettings.readSettings,
]);


export default router;

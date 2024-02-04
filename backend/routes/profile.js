import express from "express";
import cors from "cors";

// import controllers
import { getProfile } from "../controllers/profile.js";

// import middlewares
import { middlewareAuth } from "../middlewares/middleware.auth.js";

// import db functions
import { corsOptions } from "../dbaccess.js";

const router = express.Router();

// get profile information from db & db queries
router.get("/profile", cors(corsOptions), [
  middlewareAuth.isAuthorized,
  middlewareAuth.getUserIdFromToken,
  (req, res) => getProfile(req, res)
]);

export default router;

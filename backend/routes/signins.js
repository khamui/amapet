import express from "express";
import cors from "cors";

// import controllers
import { signin } from "../controllers/signin-google.js";

// import db functions
import { corsOptions } from "../dbaccess.js";

const router = express.Router();

// signin with google
router.post("/google-signin", cors(corsOptions), (req, res) => {
  signin(req, res);
});

export default router;

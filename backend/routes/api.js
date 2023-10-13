import * as dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// import models
import { Post } from "../db/models/post.js";

// import controllers
import { signin } from "../controllers/signin-google.js";

// load from .env
dotenv.config();

// mongodb initialization
const corsOptions = { origin: ["http://localhost:8181"] };
const { ATLAS_URI } = process.env;
mongoose.connect(ATLAS_URI);

// prepare endpoints
export const api = express.Router();

// db operating functions
const retrieveModel = async (model) => {
  const results = await model.find({});
  return results;
};

const retrieveModelById = async (model, id) => {
  const result = await model.findById(id);
  return result;
};

const generateModel = async (model, payload) => {
  const generated = await model.create(payload);
  const result = await generated.save();
  return result;
};

/*
 * GET all posts.
 */
api.get("/posts", cors(corsOptions), async (req, res) => {
  try {
    const posts = await retrieveModel(Post);
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).send(error);
  }
});

/*
 * GET all posts of topic.
 */
// tbd

/*
 * GET one post
 */
api.get("/posts/:id", cors(corsOptions), async (req, res) => {
  try {
    const post = await retrieveModelById(Post, req.param.id);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).send(error);
  }
});

/*
 * Create a post.
 */
api.post("/posts", cors(corsOptions), async (req, res) => {
  const payload = {
    topic: "global",
    title: req.body.title,
    body: req.body.body,
  };
  try {
    const newPost = await generateModel(Post, payload);
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).send(error);
  }
});

// signin with google
api.post("/google-signin", cors(corsOptions), (req, res) => { 
  signin(req, res); 
});

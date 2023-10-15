import express from "express";
import cors from "cors";

// import models
import { Post } from "../db/models/post.js";

// import controllers
import { signin } from "../controllers/signin-google.js";

// import db functions
import {
  corsOptions,
  retrieveModel,
  retrieveModelById,
  generateModel,
} from "../connection.js";

// prepare endpoints
export const api = express.Router();

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

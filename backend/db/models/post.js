import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  topic: String,
  title: String,
  body: String,
});

export const Post = mongoose.model("Post", postSchema);

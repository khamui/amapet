import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  id: String,
  topics: String,
  title: String,
  body: String,
  author: String,
  created: {
    type: Date,
    default: new Date()
  }
});

export const Post = mongoose.model("Post", postSchema);

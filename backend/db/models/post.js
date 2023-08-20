import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  id: string,
  topics: string,
  title: string,
  body: string,
  author: string,
  created: {
    type: Date,
    default: new Date()
  }
});

export const Post = mongoose.model("Post", postSchema);

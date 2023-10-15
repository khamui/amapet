import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
  respect: Number,
  level: String,
  questions: Array,
  comments: Array,
  subcomments: Array,
  circles: Array,
  followedQuestions: Array,
  followedCircles: Array
});

export const User = mongoose.model("User", userSchema);

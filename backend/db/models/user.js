import { Schema, model } from "mongoose";

const userSchema = new Schema({
  firstname: String,
  lastname: String,
  email: String,
  respect: Number,
  level: String,
  questions: Array,
  answers: Array,
  circles: Array,
  followedQuestions: Array,
  followedCircles: Array
});

export const User = model("User", userSchema);

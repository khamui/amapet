import { Schema, model } from "mongoose";

const userSchema = new Schema({
  firstname: String,
  lastname: String,
  email: String,
  followedCircles: Array,
  followedQuestions: Array,
  respectPoints: Number
});

export const User = model("User", userSchema);

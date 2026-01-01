import { Schema, model } from "mongoose";

const userSchema = new Schema({
  firstname: String,
  lastname: String,
  email: String,
  followedCircles: Array,
  followedQuestions: Array,
  respectPoints: Number,
  permLevel: Number, // 1 = platform maintainer
  moderatedCircleIds: Array,
});

export const User = model("User", userSchema);

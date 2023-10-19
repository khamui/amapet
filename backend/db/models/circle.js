import mongoose from "mongoose";

const circleSchema = new mongoose.Schema({
  ownerId: String,
  name: String,
  about: String,
  questions: Array,
  memberCount: Number,
  moderators: Array,
});

export const Circle = mongoose.model("Circle", circleSchema);

import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  id: String,
  circleId: String,
  ownerId: String,
  title: String,
  body: String,
  upvotes: Number,
  downvotes: Number,
  created_at: {
    type: Date,
    default: new Date()
  },
});

export const Question = mongoose.model("Question", questionSchema);

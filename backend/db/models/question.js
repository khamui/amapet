import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  circleId: String,
  ownerId: String,
  ownerName: String,
  title: String,
  body: String,
  upvotes: Number,
  downvotes: Number,
  created_at: Number,
  modded_at: Number,
});

export const Question = mongoose.model("Question", questionSchema);

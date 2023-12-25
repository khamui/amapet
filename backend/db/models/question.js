import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  circleId: String,
  ownerId: String,
  ownerName: String,
  created_at: Number,
  modded_at: Number,
  title: String,
  body: String,
  upvotes: Array,
  downvotes: Array,
});

export const Question = mongoose.model("Question", questionSchema);

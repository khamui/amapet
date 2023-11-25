import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  parentId: String,
  parentType: String,
  ownerId: String,
  ownerName: String,
  answerText: String,
  upvotes: Number,
  downvotes: Number,
  created_at: Number,
  modded_at: Number,
});

export const Answer = mongoose.model("Answer", answerSchema);

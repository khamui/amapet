import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  parentId: String,
  parentType: String,
  ownerId: String,
  ownerName: String,
  created_at: Number,
  modded_at: Number,
  answerText: String,
  upvotes: Array,
  downvotes: Array,
  deleted: Boolean,
  children: Array,
  questionId: String,
  circleId: String,
});

export const Answer = mongoose.model("Answer", answerSchema);

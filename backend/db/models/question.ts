import mongoose, { Schema } from 'mongoose';
import type { IQuestion, IQuestionDocument } from '../../types/models.js';

const questionSchema = new Schema<IQuestionDocument>({
  _id: { type: mongoose.Schema.Types.ObjectId },
  circleId: String,
  ownerId: String,
  ownerName: String,
  created_at: Number,
  modded_at: Number,
  title: String,
  body: String,
  upvotes: { type: [String], default: [] },
  downvotes: { type: [String], default: [] },
  intentionId: String,
});

export const Question = mongoose.model<IQuestionDocument>('Question', questionSchema);
export type { IQuestion, IQuestionDocument };

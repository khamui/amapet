import mongoose, { Schema } from 'mongoose';
import type { IAnswer, IAnswerDocument } from '../../types/models.js';

const answerSchema = new Schema<IAnswerDocument>({
  _id: { type: mongoose.Schema.Types.ObjectId },
  parentId: String,
  parentType: String,
  ownerId: String,
  ownerName: String,
  created_at: Number,
  modded_at: Number,
  answerText: String,
  upvotes: { type: [String], default: [] },
  downvotes: { type: [String], default: [] },
  deleted: Boolean,
  children: { type: [mongoose.Schema.Types.ObjectId], default: [] },
});

export const Answer = mongoose.model<IAnswerDocument>('Answer', answerSchema);
export type { IAnswer, IAnswerDocument };

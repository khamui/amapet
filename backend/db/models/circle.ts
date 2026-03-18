import mongoose, { Schema } from 'mongoose';
import type { ICircle, ICircleDocument, IQuestion } from '../../types/models.js';

const questionSubSchema = new Schema<IQuestion>(
  {
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
    solutionId: { type: String, default: null },
  },
  { _id: false }
);

const circleSchema = new Schema<ICircleDocument>({
  created_at: Number,
  ownerId: String,
  name: String,
  about: String,
  questions: { type: [questionSubSchema], default: [] },
  memberCount: Number,
  moderators: { type: [String], default: [] },
});

export const Circle = mongoose.model<ICircleDocument>('Circle', circleSchema);
export type { ICircle, ICircleDocument, IQuestion };

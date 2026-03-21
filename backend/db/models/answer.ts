import mongoose, { Schema } from 'mongoose';
import type { IAnswer, IAnswerDocument } from '../../types/models.js';

const answerModerationInfoSchema = new Schema(
  {
    status: {
      type: String,
      enum: ['unread', 'approved', 'blocked'],
      default: 'unread',
    },
    noteText: { type: String, default: '' },
    lastModeratedBy: { type: String, default: null },
    lastModeratedAt: { type: Number, default: null },
  },
  { _id: false }
);

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
  moderationInfo: {
    type: answerModerationInfoSchema,
    default: () => ({ status: 'unread' }),
  },
});

export const Answer = mongoose.model<IAnswerDocument>('Answer', answerSchema);
export type { IAnswer, IAnswerDocument };

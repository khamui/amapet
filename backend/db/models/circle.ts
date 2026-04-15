import mongoose, { Schema } from 'mongoose';
import type {
  ICircle,
  ICircleDocument,
  IModerationInfo,
  IQuestion,
} from '../../types/models.js';

const moderationInfoSubSchema = new Schema<IModerationInfo>(
  {
    status: {
      type: String,
      enum: ['unread', 'approved', 'blocked'],
      default: 'unread',
    },
    closed: { type: Boolean, default: false },
    noteText: { type: String, default: '' },
    lastModeratedBy: { type: String, default: null },
    lastModeratedAt: { type: Number, default: null },
  },
  { _id: false }
);

const questionSubSchema = new Schema<IQuestion>(
  {
    _id: { type: mongoose.Schema.Types.ObjectId },
    slug: String,
    circleId: String,
    ownerId: String,
    ownerName: String,
    created_at: Number,
    modded_at: Number,
    title: String,
    body: String,
    upvotes: { type: [String], default: [] },
    downvotes: { type: [String], default: [] },
    images: { type: [String], default: [] },
    intentionId: String,
    solutionId: { type: String, default: null },
    moderationInfo: {
      type: moderationInfoSubSchema,
      default: () => ({ status: 'unread' }),
    },
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
  moderators: { type: [String], default: [], index: true },
});

export const Circle = mongoose.model<ICircleDocument>('Circle', circleSchema);
export type { ICircle, ICircleDocument, IQuestion };

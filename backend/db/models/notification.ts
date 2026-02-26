import mongoose, { Schema } from 'mongoose';
import type { INotification, INotificationDocument } from '../../types/models.js';

const notificationSchema = new Schema<INotificationDocument>({
  userId: String,
  type: String,
  value: { type: Schema.Types.Mixed },
  unread: Boolean,
  originCircleId: String,
  originCircleName: String,
  originQuestionId: String,
  created_at: Number,
});

export const Notification = mongoose.model<INotificationDocument>(
  'Notification',
  notificationSchema
);
export type { INotification, INotificationDocument };

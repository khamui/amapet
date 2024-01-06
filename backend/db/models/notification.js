import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: String,
  type: String,
  value: {},
  unread: Boolean,
  originCircleId: String,
  originCircleName: String,
  originQuestionId: String,
  created_at: Number,
});

export const Notification = mongoose.model(
  "Notification",
  notificationSchema,
);

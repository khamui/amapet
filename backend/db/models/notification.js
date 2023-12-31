import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: String,
  type: String,
  value: {},
  originCircleId: String,
  originQuestionId: String,
  created_at: Number,
});

export const Notification = mongoose.model(
  "Notification",
  notificationSchema,
);

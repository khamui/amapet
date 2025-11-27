import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  key: { type: String, required: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
});

// The third parameter is the name of the collection in MongoDB
export const Settings = mongoose.model(
  "Settings",
  settingsSchema,
  "platform_settings",
);

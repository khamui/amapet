import mongoose, { Schema } from 'mongoose';
import type { ISettings, ISettingsDocument } from '../../types/models.js';

const settingsSchema = new Schema<ISettingsDocument>({
  key: { type: String, required: true },
  value: { type: Schema.Types.Mixed, required: true },
});

// The third parameter is the name of the collection in MongoDB
export const Settings = mongoose.model<ISettingsDocument>(
  'Settings',
  settingsSchema,
  'platform_settings'
);
export type { ISettings, ISettingsDocument };

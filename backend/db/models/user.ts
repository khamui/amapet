import { Schema, model } from 'mongoose';
import type { IUser, IUserDocument } from '../../types/models.js';

const userSchema = new Schema<IUserDocument>({
  username: { type: String, unique: true, sparse: true, index: true },
  firstname: String,
  lastname: String,
  email: String,
  authProvider: { type: String, enum: ['google', 'microsoft'], default: 'google' },
  followedCircles: { type: [String], default: [] },
  followedQuestions: { type: [String], default: [] },
  aura: Number,
  permLevel: Number, // 1 = platform maintainer
});

export const User = model<IUserDocument>('User', userSchema);
export type { IUser, IUserDocument };

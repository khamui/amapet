import { Types, Document } from 'mongoose';

// ============ Moderation ============
export interface IModerationInfo {
  status?: 'unread' | 'approved' | 'blocked';
  closed?: boolean; // only for questions
  noteText?: string;
  lastModeratedBy?: string;
  lastModeratedAt?: number;
}

// ============ User ============
export type AuthProvider = 'google' | 'microsoft';

export interface IUser {
  username?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  authProvider?: AuthProvider;
  followedCircles: string[];
  followedQuestions: string[];
  aura?: number;
  permLevel?: number; // 1 = platform maintainer
}

export interface IUserDocument extends IUser, Document {}

// ============ Question (embedded in Circle and standalone) ============
export interface IQuestion {
  _id?: Types.ObjectId;
  slug?: string;
  circleId?: string;
  ownerId?: string;
  ownerName?: string;
  created_at?: number;
  modded_at?: number;
  title?: string;
  body?: string;
  upvotes: string[];
  downvotes: string[];
  images?: string[];
  intentionId?: string;
  solutionId?: string;
  moderationInfo?: IModerationInfo;
}

export type IQuestionDocument = IQuestion & Document;

// ============ Circle ============
export interface ICircle {
  created_at?: number;
  ownerId?: string;
  name?: string;
  about?: string;
  questions: IQuestion[];
  memberCount?: number;
  moderators: string[];
}

export interface ICircleDocument extends ICircle, Document {}

// ============ Answer ============
export interface IAnswer {
  _id?: Types.ObjectId;
  parentId?: string;
  parentType?: string;
  ownerId?: string;
  ownerName?: string;
  created_at?: number;
  modded_at?: number;
  answerText?: string;
  upvotes: string[];
  downvotes: string[];
  deleted?: boolean;
  children: Types.ObjectId[];
  moderationInfo?: IModerationInfo;
}

export type IAnswerDocument = IAnswer & Document;

// ============ Notification ============
export type INotificationValue = Record<string, unknown>;

export interface INotification {
  userId?: string;
  type?: string;
  value?: INotificationValue;
  unread?: boolean;
  originCircleId?: string;
  originCircleName?: string;
  originQuestionId?: string;
  created_at?: number;
}

export interface INotificationDocument extends INotification, Document {}

// ============ Settings ============
export interface ISettings {
  key: string;
  value: unknown;
}

export interface ISettingsDocument extends ISettings, Document {}

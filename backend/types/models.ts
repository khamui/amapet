import { Types, Document } from 'mongoose';

// ============ User ============
export type AuthProvider = 'google' | 'microsoft';

export interface IUser {
  firstname?: string;
  lastname?: string;
  email?: string;
  authProvider?: AuthProvider;
  followedCircles: string[];
  followedQuestions: string[];
  respectPoints?: number;
  permLevel?: number; // 1 = platform maintainer
  moderatedCircleIds: string[];
}

export interface IUserDocument extends IUser, Document {}

// ============ Question (embedded in Circle and standalone) ============
export interface IQuestion {
  _id?: Types.ObjectId;
  circleId?: string;
  ownerId?: string;
  ownerName?: string;
  created_at?: number;
  modded_at?: number;
  title?: string;
  body?: string;
  upvotes: string[];
  downvotes: string[];
  intentionId?: string;
  solutionId?: string;
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

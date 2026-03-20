import { Question } from "./Question.typedef";

export type Circle = {
  _id?: string;
  ownerId: string;
  created_at?: string
  name: string;
  about?: string,
  questions: Question[],
  memberCount?: number,
  moderators?: [],
}

export type Moderator = {
  _id: string;
  username: string;
}

export type OwnedCircle = {
  _id: string;
  name: string;
  about: string;
  created_at: number;
  memberCount: number;
  questionCount: number;
  ownerId: string;
  moderators: Moderator[];
}

export type UserSearchResult = {
  _id: string;
  username: string;
  firstname?: string;
  lastname?: string;
}

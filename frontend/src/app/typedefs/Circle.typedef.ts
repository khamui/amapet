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

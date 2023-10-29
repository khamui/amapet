import { Answer } from "./Answer.typedef";

export type Question = {
  id?: string;
  circleId: string;
  ownerId: string;
  created_at?: string,
  title: string,
  body: string,
  upvotes: number,
  downvotes: number,
  answers?: Answer[]
}

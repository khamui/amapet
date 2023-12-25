export type Answer = {
  _id?: string;
  parentId: string;
  parentType: 'question' | 'answer';
  ownerId: string;
  ownerName: string;
  created_at?: Date;
  modded_at?: Date;
  answerText: string;
  upvotes?: string[];
  downvotes?: string[];
  deleted?: boolean;
  children?: Answer[];
}

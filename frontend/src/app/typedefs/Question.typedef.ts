export type Question = {
  _id?: string;
  circleId: string;
  ownerId: string;
  ownerName: string;
  created_at?: string,
  modded_at?: string,
  title: string,
  body: string,
  upvotes?: string[],
  downvotes?: string[],
  intentionId?: string
  moderationInfo?: ModerationInfo;
}

export type ModerationInfo = {
  status?: 'unread' | 'approved' | 'blocked';
  closed?: boolean;
  noteText?: string;
}

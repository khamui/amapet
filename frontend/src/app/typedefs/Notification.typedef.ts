export type Notification = {
  _id?: string;
  userId: string;
  type: 'upvote' | 'comment';
  value: number | string;
  unread: boolean;
  originCircleId: string;
  originCircleName: string;
  originQuestionId: string;
  created_at: Date;
}

export type Question = {
  _id?: string;
  circleId: string;
  ownerId: string;
  ownerName: string;
  created_at?: string,
  title: string,
  body: string,
  upvotes: number,
  downvotes: number,
}

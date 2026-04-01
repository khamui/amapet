export type Question = {
  _id?: string;
  slug?: string;
  circleId: string;
  ownerId: string;
  ownerName: string;
  created_at?: string,
  modded_at?: string,
  title: string,
  body: string,
  upvotes?: string[],
  downvotes?: string[],
  intentionId?: string;
  solutionId?: string;
  moderationInfo?: ModerationInfo;
}

export type ModerationInfo = {
  status?: 'unread' | 'approved' | 'blocked';
  closed?: boolean;
  noteText?: string;
}

export type PaginatedQuestionsResponse = {
  questions: Question[];
  pagination: {
    skip: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

export type ExploreQuestion = Question & {
  circleName: string;
  answerCount: number;
  popularityScore: number;
  isFavorite: boolean;
};

export type PaginatedExploreResponse = {
  questions: ExploreQuestion[];
  pagination: {
    skip: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

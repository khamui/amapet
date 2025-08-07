export type FollowResponse = {
  result: {
    message: string;
    action: 'followed' | 'unfollowed';
  };
};

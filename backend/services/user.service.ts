import { User } from '../db/models/user.js';
import { generateModel, retrieveOneModelByQuery } from '../dbaccess.js';
import type { IUserDocument } from '../db/models/user.js';
import type { AuthProvider } from '../types/models.js';

export interface SocialUserPayload {
  email?: string;
  firstname?: string;
  lastname?: string;
}

export const findOrCreateUser = async (
  payload: SocialUserPayload,
  provider: AuthProvider
): Promise<IUserDocument> => {
  let result = await retrieveOneModelByQuery(User, {
    email: payload.email,
  });

  if (!result) {
    const newUser = {
      ...payload,
      authProvider: provider,
      followedCircles: [],
      followedQuestions: [],
      moderatedCircleIds: [],
      respectPoints: 0,
    };
    result = await generateModel(User, newUser);
  }

  return result as IUserDocument;
};

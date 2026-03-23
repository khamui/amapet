import { User } from '../db/models/user.js';
import { generateModel, retrieveOneModelByQuery } from '../dbaccess.js';
import type { IUserDocument } from '../db/models/user.js';
import type { AuthProvider } from '../types/models.js';

export interface ISocialUserPayload {
  email?: string;
  firstname?: string;
  lastname?: string;
}

const CONSONANTS = [
  'b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'w',
  'br', 'cr', 'dr', 'fl', 'gl', 'gr', 'pl', 'pr', 'sc', 'sk', 'sl', 'sm', 'sn', 'sp', 'st', 'sw', 'tr', 'th', 'ch', 'sh'
];
const VOWELS = ['a', 'e', 'i', 'o', 'u', 'ai', 'ea', 'ou'];
const ENDINGS = ['n', 't', 's', 'r', 'l', 'd', 'm', 'p', 'k', 'x', 'rt', 'nt', 'nd', 'st', 'ck'];

const randomFrom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const generatePseudoWord = (): string => {
  const consonant = randomFrom(CONSONANTS);
  const vowel = randomFrom(VOWELS);
  const ending = randomFrom(ENDINGS);
  return consonant + vowel + ending;
};

export const generateUsername = async (): Promise<string> => {
  const maxRetries = 10;
  for (let i = 0; i < maxRetries; i++) {
    const word1 = generatePseudoWord();
    const word2 = generatePseudoWord();
    const number = Math.floor(Math.random() * 90) + 10;
    const username = `${word1}_${word2}_${number}`;

    const existing = await retrieveOneModelByQuery(User, { username });
    if (!existing) {
      return username;
    }
  }
  const word1 = generatePseudoWord();
  const word2 = generatePseudoWord();
  return `${word1}_${word2}_${Date.now()}`;
};

export const findOrCreateUser = async (
  payload: ISocialUserPayload,
  provider: AuthProvider
): Promise<IUserDocument> => {
  let result = await retrieveOneModelByQuery(User, {
    email: payload.email,
  });

  if (!result) {
    const username = await generateUsername();
    const newUser = {
      ...payload,
      username,
      authProvider: provider,
      followedCircles: [],
      followedQuestions: [],
      respectPoints: 0,
    };
    result = await generateModel(User, newUser);
  } else if (!result.username) {
    const username = await generateUsername();
    result.username = username;
    await result.save();
  }

  return result as IUserDocument;
};

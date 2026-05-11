import { Request, Response } from 'express';
import { OAuth2Client, LoginTicket } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  JWT_SECRET,
} from '../server.js';
import { findOrCreateUser, ISocialUserPayload } from '../services/user.service.js';

const EXP_IN_S = 604800; // 7 days expiration time

export const signin = (req: Request, res: Response): void => {
  async function verify(): Promise<string> {
    const { code, redirectUri } = req.body as {
      code?: string;
      redirectUri?: string;
    };
    if (!code || !redirectUri) {
      throw new Error('Missing code or redirectUri');
    }

    const client = new OAuth2Client(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      redirectUri,
    );

    const { tokens } = await client.getToken(code);
    if (!tokens.id_token) {
      throw new Error('No id_token returned from Google');
    }

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: GOOGLE_CLIENT_ID,
    });
    const userPayload = extractPayload(ticket);
    const user = await findOrCreateUser(userPayload, 'google');

    const token = jwt.sign(user.toJSON(), JWT_SECRET || '', {
      expiresIn: EXP_IN_S,
    });
    return token;
  }

  verify()
    .then((token) => res.status(200).json({ token }))
    .catch((error) => {
      console.error('Google signin error:', error);
      res.status(401).json({ error: 'Authentication failed' });
    });
};

const extractPayload = (ticket: LoginTicket): ISocialUserPayload => {
  const payload = ticket.getPayload();
  return {
    email: payload?.email,
    firstname: payload?.given_name,
    lastname: payload?.family_name,
  };
};

import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { MICROSOFT_CLIENT_ID, JWT_SECRET } from '../server.js';
import { findOrCreateUser, SocialUserPayload } from '../services/user.service.js';

const EXP_IN_S = 604800; // 7 days expiration time

const client = jwksClient({
  jwksUri: 'https://login.microsoftonline.com/common/discovery/v2.0/keys',
  cache: true,
  rateLimit: true,
});

interface IMicrosoftTokenPayload {
  email?: string;
  preferred_username?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  aud?: string;
  iss?: string;
}

const getSigningKey = async (header: jwt.JwtHeader): Promise<string> => {
  const key = await client.getSigningKey(header.kid);
  const signingKey = key?.getPublicKey();
  if (!signingKey) throw new Error('Unable to get signing key');
  return signingKey;
};

const verifyMicrosoftToken = async (token: string): Promise<IMicrosoftTokenPayload> => {
  const decodedHeader = jwt.decode(token, { complete: true });
  if (!decodedHeader || !decodedHeader.header) {
    throw new Error('Invalid token format');
  }

  const signingKey = await getSigningKey(decodedHeader.header);

  const payload = jwt.verify(token, signingKey, {
    audience: MICROSOFT_CLIENT_ID,
  }) as IMicrosoftTokenPayload;

  if (!payload.iss?.startsWith('https://login.microsoftonline.com/')) {
    throw new Error('Invalid token issuer');
  }

  return payload;
};

const extractUserPayload = (msPayload: IMicrosoftTokenPayload): SocialUserPayload => {
  return {
    email: msPayload.email || msPayload.preferred_username,
    firstname: msPayload.given_name || msPayload.name?.split(' ')[0],
    lastname: msPayload.family_name || msPayload.name?.split(' ').slice(1).join(' '),
  };
};

export const signin = (req: Request, res: Response): void => {
  async function verify(): Promise<string> {
    const msPayload = await verifyMicrosoftToken(req.body.token);
    const userPayload = extractUserPayload(msPayload);
    const user = await findOrCreateUser(userPayload, 'microsoft');

    const token = jwt.sign(user.toJSON(), JWT_SECRET || '', {
      expiresIn: EXP_IN_S,
    });
    return token;
  }

  verify()
    .then((token) => res.status(200).json({ token }))
    .catch((error) => {
      console.error('Microsoft signin error:', error);
      res.status(401).json({ error: 'Authentication failed' });
    });
};

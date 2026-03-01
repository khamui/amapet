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

interface MicrosoftTokenPayload {
  email?: string;
  preferred_username?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  aud?: string;
  iss?: string;
}

const getSigningKey = (header: jwt.JwtHeader): Promise<string> => {
  return new Promise((resolve, reject) => {
    client.getSigningKey(header.kid, (err, key) => {
      if (err) {
        reject(err);
        return;
      }
      const signingKey = key?.getPublicKey();
      if (signingKey) {
        resolve(signingKey);
      } else {
        reject(new Error('Unable to get signing key'));
      }
    });
  });
};

const verifyMicrosoftToken = async (token: string): Promise<MicrosoftTokenPayload> => {
  const decodedHeader = jwt.decode(token, { complete: true });
  if (!decodedHeader || !decodedHeader.header) {
    throw new Error('Invalid token format');
  }

  const signingKey = await getSigningKey(decodedHeader.header);

  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      signingKey,
      { audience: MICROSOFT_CLIENT_ID },
      (err: jwt.VerifyErrors | null, decoded: unknown) => {
        if (err) {
          reject(err);
          return;
        }
        const payload = decoded as MicrosoftTokenPayload;
        // Validate issuer starts with Microsoft login URL
        if (!payload.iss?.startsWith('https://login.microsoftonline.com/')) {
          reject(new Error('Invalid token issuer'));
          return;
        }
        resolve(payload);
      }
    );
  });
};

const extractUserPayload = (msPayload: MicrosoftTokenPayload): SocialUserPayload => {
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

import { JwtPayload } from 'jsonwebtoken';

export interface UserPayload extends JwtPayload {
  _id: string;
  email?: string;
  firstname?: string;
  lastname?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload | string;
      userPayload?: UserPayload;
    }
  }
}

export {};

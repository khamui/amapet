import { JwtPayload } from 'jsonwebtoken';
import { ICircleDocument } from './models.js';

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
      circle?: ICircleDocument;
    }
  }
}

export {};

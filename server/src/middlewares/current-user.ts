import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayloadInterface {
  id: number;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayloadInterface;
    }
  }
}

export const currentUser = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.jwt) {
    next();
    return;
  }

  try {
    const payload = jwt.verify(req.session?.jwt, process.env.JWT_KEY!) as UserPayloadInterface;
    req.currentUser = payload;
  } catch (err) {}

  next();
};

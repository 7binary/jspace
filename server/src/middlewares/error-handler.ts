import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors';

const isProd = process.env.NODE_ENV === 'production';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({
      errors: err.serializeErrors(),
    });
  }

  throw err;

  if (!isProd) {
    throw err;
  }

  return res.status(400).send({
    errors: [{ message: 'Something went wrong.' }],
  });
};

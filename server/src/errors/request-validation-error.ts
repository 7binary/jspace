import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error';

export class RequestValidationError extends CustomError {
  statusCode = 400;

  constructor(public errors: ValidationError[]) {
    super('Invalid request parameters');
  }

  serializeErrors = () => {
    return this.errors.map(e => ({ message: `${e.msg}`, field: e.param }));
  }
}
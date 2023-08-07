import { NextFunction, Request, Response } from 'express';
import CustomError from '../helpers/CustomError';

export default class UniversalErrorMiddleware {
  public static handleErrors(error: CustomError, req: Request, res: Response, _next: NextFunction) {
    const { message, status } = error;

    if (status) {
      return res.status(status).json({ message });
    }

    console.error(error);

    return res.status(500).json({ message: 'Internal server error' });
  }
}

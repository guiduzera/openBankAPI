import { NextFunction, Request, Response } from 'express';
import registerZodSchema from '../helpers/registerZodSchema';
import CustomError from '../helpers/CustomError';

export default class UserMiddlewares {
  public static async verifyFields(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { name, email, password, cpf, cnpj } = req.body;

      if (!name || !email || !password || !cpf && !cnpj) {
        return res.status(400).json({ message: 'Preencha todos os campos!' });
      }

      if (cpf.length > 0 && cpf.length !== 11 || cnpj.length > 0 && cnpj.length !== 14) {
        return res.status(400).json({ message: 'O campo cpf ou cnpj deve conter 11 ou 14 caracteres!' });
      }

      const parsed = registerZodSchema.safeParse({ name, email, password, cpf, cnpj });

      if (!parsed.success) {
        const { error } = parsed;
        const parsedError = JSON.parse(error.message);
        throw new CustomError(parsedError[0].message, 400);
      }

      return next();
    } catch (error) {
      next(error);
    }
  }

  public static async verifyLoginFields(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { accountNumber, agency, password } = req.body;

      if (!accountNumber || !agency || !password) {
        return res.status(400).json({ message: 'Preencha todos os campos!' });
      }

      return next();
    } catch (error) {
      next(error);
    }
  }
}

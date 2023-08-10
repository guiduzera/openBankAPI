import { NextFunction, Request, Response } from 'express';
import registerZodSchema from '../helpers/registerZodSchema';
import CustomError from '../helpers/CustomError';
import ICustomRequest from '../interfaces/CustomRequest.interface';
import { IJwt } from '../interfaces/security.interfaces';

export default class UserMiddlewares {
  public jwt: IJwt;

  constructor(jwt: IJwt) {
    this.jwt = jwt;
    this.tokenVerify = this.tokenVerify.bind(this);
  }

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

      // accountNumber deve seguri o padrão 00000-0
      if (accountNumber.length !== 7 || accountNumber[5] !== '-') {
        return res.status(400).json({ message: 'O campo accountNumber deve seguir o padrão 00000-0!' });
      }

      return next();
    } catch (error) {
      next(error);
    }
  }

  public async tokenVerify(req: ICustomRequest, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { authorization } = req.headers;

      if (!authorization) throw new CustomError('Token não encontrado!', 401);

      const tokenVerify = this.jwt.verifyToken(authorization);

      req.user = tokenVerify;

      return next();
    } catch (error) {
      next(error);
    }
  }

  public static async verifyDeleteFields(req: ICustomRequest,
    res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { password } = req.body;

      if (!password) {
        return res.status(400).json({ message: 'Senha não informada!' });
      }

      return next();
    } catch (error) {
      next(error);
    }
  }
}

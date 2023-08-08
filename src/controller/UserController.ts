import { NextFunction, Request, Response } from 'express';
import { IUserService } from '../interfaces/User.interfaces';

export default class UserController {
  public userService: IUserService;

  constructor(userService: IUserService) {
    this.userService = userService;
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
  }

  public async register(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { name, email, password, cpf, cnpj } = req.body;

      const token = await this.userService.register({ name, email, password, cpf, cnpj });

      return res.status(201).json({ token });
    } catch (error) {
      next(error);
    }
  }

  public async login(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { accountNumber, agency, password } = req.body;

      const token = await this.userService.login({ accountNumber, agency, password });

      return res.status(200).json({ token });
    } catch (error) {
      next(error);
    }
  }
}

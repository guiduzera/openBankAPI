import express from 'express';
import UserController from '../controller/UserController';
import UserService from '../service/UserService';
import UserModel from '../model/UserModel';
import Jwt from '../helpers/Jwt';
import Bcrypt from '../helpers/Bcrypt';
import { IUserService } from '../interfaces/User.interfaces';
import { IUserModel } from '../interfaces/User.interfaces';
import { IAccountModel } from '../interfaces/Account.interfaces';
import AccountModel from '../model/AccountModel';
import UserMiddlewares from '../middlewares/UserMiddlewares';
import prismaClient from '../client';

export default class UserRoutes {
  public router = express.Router();
  private userController: UserController;
  private userService: IUserService;
  private userModel: IUserModel;
  private accountModel: IAccountModel;
  private prismaClient = prismaClient;
  private jwt = new Jwt();
  private bcrypt = new Bcrypt();
  private userMiddlewares: UserMiddlewares;

  constructor() {
    this.userMiddlewares = new UserMiddlewares(this.jwt);
    this.accountModel = new AccountModel(this.prismaClient);
    this.userModel = new UserModel(this.prismaClient);
    this.userService = new UserService(this.userModel, this.accountModel, this.jwt, this.bcrypt);
    this.userController = new UserController(this.userService);
    this.userRoutes();
  }

  private userRoutes(): void {
    this.router.post('/register', UserMiddlewares.verifyFields, this.userController.register);
    this.router.post('/login', UserMiddlewares.verifyLoginFields, this.userController.login);
    this.router.put('/update', this.userMiddlewares.tokenVerify,
      UserMiddlewares.verifyFields, this.userController.updateUser);
    this.router.delete('/delete', this.userMiddlewares.tokenVerify, UserMiddlewares.verifyDeleteFields,
      this.userController.deleteUser);
  }
}

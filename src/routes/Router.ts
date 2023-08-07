import express from 'express';
import UserRoutes from './UserRoutes';

export default class Router {
  public router = express.Router();
  private userRoutes: UserRoutes;

  constructor() {
    this.userRoutes = new UserRoutes();
    this.routes();
  }

  private routes(): void {
    this.router.use('/users', this.userRoutes.router);
  }
}

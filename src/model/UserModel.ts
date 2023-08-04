import { PrismaClient, User } from '@prisma/client';
import { IUserModel, IUserRegister } from '../interfaces/User.interfaces';

export default class UserModel implements IUserModel {
  public prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  public async register(registerReq: IUserRegister): Promise<number | null> {
    const { name, email, password, cpf, cnpj } = registerReq;
    const create = await this.prismaClient.user.create({
      data: {
        name,
        email,
        password,
        cpf,
        cnpj
      }
    });

    return create.id;
  }

  public async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.prismaClient.user.findUnique({
      where: {
        email
      }
    });

    return user;
  }
}

import { PrismaClient, User } from '@prisma/client';
import { IUserModel, IUserRegister, IUserUpdate } from '../interfaces/User.interfaces';

export default class UserModel implements IUserModel {
  public prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  public async updateUser(user: IUserUpdate): Promise<boolean> {
    const { name, email, newEmail } = user;
    const update = await this.prismaClient.user.update({
      where: { email },
      data: { name, email: newEmail }
    });

    return !!update;
  }

  public async register(registerReq: IUserRegister): Promise<number | null> {
    const { name, email, password, cpf, cnpj } = registerReq;
    const create = await this.prismaClient.user.create({
      data: { name, email, password, cpf, cnpj }
    });

    return create.id;
  }

  public async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.prismaClient.user.findUnique({ where: { email } });

    return user;
  }

  public async getUserByCpfOrCnpj(cpfOrCnpj: string): Promise<User[]> {
    const user = await this.prismaClient.user.findMany({ where: { cpf: cpfOrCnpj } });

    if (!user.length) return await this.prismaClient.user.findMany({ where: { cnpj: cpfOrCnpj } });

    return user;
  }
}

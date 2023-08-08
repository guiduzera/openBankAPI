import { PrismaClient } from '@prisma/client';
import { IAccount, IAccountModel, IcreateAccountResponse } from '../interfaces/Account.interfaces';

export default class AccountModel implements IAccountModel {
  public prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  public async getByAccountNumber(accountNumber: string): Promise<IAccount | null> {
    const account = await this.prismaClient.account.findUnique({ where: { accountNumber }, include: { user: true } });

    return account;
  }

  generateAccountNumber(): string {
    // numero da conta deve ser gerado de forma aleatoria contendo 7 digitos exatos nesse formato: 00000-0
    const min = 1000000;
    const max = 9999999;
    const accountNumber = (Math.floor(Math.random() * (max - min + 1)) + min).toString();
    const splitAccountNumber = accountNumber.split('');
    splitAccountNumber[5] = '-';
    const newAccountNumber = splitAccountNumber.join('');
    return newAccountNumber;
  }

  public async createAccount(userId: number): Promise<IcreateAccountResponse | null> {
    const accountNumber = this.generateAccountNumber();
    const agency = '0001';
    const create = await this.prismaClient.account.create({
      data: { accountNumber, agency, status: true, balance: 0, limit: 1000, userId }
    });

    if (!create) return null;

    return { accountNumber: create.accountNumber, agency: create.agency };
  }
}

import { PrismaClient } from '@prisma/client';

export interface IAccountService {
    accountModel: IAccountModel;
    createAccount(userId: number): Promise<IcreateAccountResponse | null>;
}

export interface IAccountModel {
    prismaClient: PrismaClient;
    generateAccountNumber(): string;
    createAccount(userId: number): Promise<IcreateAccountResponse | null>;
}

export interface IcreateAccountResponse {
    accountNumber: string;
    agency: string;
}

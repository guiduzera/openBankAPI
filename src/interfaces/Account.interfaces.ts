import { Account, PrismaClient, User } from '@prisma/client';

export interface IAccountService {
    accountModel: IAccountModel;
    createAccount(userId: number): Promise<IcreateAccountResponse | null>;
}

export interface IAccountModel {
    prismaClient: PrismaClient;
    generateAccountNumber(): string;
    createAccount(userId: number): Promise<IcreateAccountResponse | null>;
    getByAccountNumber(accountNumber: string): Promise<IAccount | null>;
    deleteAccount(accountNumber: string): Promise<boolean>;
}

export interface IcreateAccountResponse {
    accountNumber: string;
    agency: string;
}

export interface IAccount extends Account {
    user: User | null;
}

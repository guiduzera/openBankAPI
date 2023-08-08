import { PrismaClient, User } from '@prisma/client'
import { IBycript, IJwt } from './security.interfaces';
import { IAccountModel } from './Account.interfaces';

export interface IUserService {
    userModel: IUserModel;
    accountModel: IAccountModel;
    jwt: IJwt;
    bcrypt: IBycript;
    register(registerReq: IUserRegister): Promise<string>;
    login(loginReq: IUserLogin): Promise<string>;
}

export interface IUserModel {
    prismaClient: PrismaClient;
    register(registerReq: IUserRegister): Promise<number | null>;
    getUserByEmail(email: string): Promise<User | null>;
    getUserByCpfOrCnpj(cpfOrCnpj: string): Promise<User[]>;
}

export interface IUserRegister {
    name: string;
    email: string;
    password: string;
    cpf: string;
    cnpj: string;
}

export interface IUserLogin {
    accountNumber: string;
    agency: string;
    password: string;
}

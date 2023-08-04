import { PrismaClient, User } from '@prisma/client'
import { IBycript, IJwt } from './security.interfaces';

export interface IUserService {
    userModel: IUserModel;
    accountModel: unknown;
    jwt: IJwt;
    bcrypt: IBycript;
    register(registerReq: IUserRegister): Promise<string>;
}

export interface IUserModel {
    prismaClient: PrismaClient;
    register(registerReq: IUserRegister): Promise<number | null>;
    getUserByEmail(email: string): Promise<User | null>;
}

export interface IUserRegister {
    name: string;
    email: string;
    password: string;
    cpf: string;
    cnpj: string;
}

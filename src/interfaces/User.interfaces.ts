import { PrismaClient, User } from '@prisma/client'
import { IBycript, IJwt } from './security.interfaces';
import { IAccountModel } from './Account.interfaces';

export interface IUserService {
    userModel: IUserModel;
    accountModel: IAccountModel;
    jwt: IJwt;
    bcrypt: IBycript;
    bcryptVerify(password: string, hash: string): Promise<boolean>;
    register(registerReq: IUserRegister): Promise<string>;
    login(loginReq: IUserLogin): Promise<string>;
    updateUser(user: IUserUpdateService): Promise<boolean>;
    deleteUser(deleteReq: IUserDelete): Promise<boolean>;
}

export interface IUserModel {
    prismaClient: PrismaClient;
    register(registerReq: IUserRegister): Promise<number | null>;
    getUserByEmail(email: string): Promise<User | null>;
    getUserByCpfOrCnpj(cpfOrCnpj: string): Promise<User[]>;
    updateUser(user: IUserUpdate): Promise<boolean>;
}

export interface IUserUpdate {
    name: string;
    newEmail: string;
    email: string;
}

export interface IUserRegister {
    name: string;
    email: string;
    cpf: string;
    cnpj: string;
    password: string;
}

export interface IUserUpdateService extends IUserRegister {
    accountNumber: string;
}

export interface IUserDelete {
    accountNumber: string;
    password: string;
}

export interface IUserLogin {
    accountNumber: string;
    agency: string;
    password: string;
}

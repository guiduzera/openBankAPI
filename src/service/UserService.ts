import CustomError from '../helpers/CustomError';
import { IUserModel, IUserRegister, IUserService } from '../interfaces/User.interfaces';
import { IBycript, IJwt } from '../interfaces/security.interfaces';

export default class UserService implements IUserService {
  public userModel: IUserModel;
  public accountModel: unknown;
  public jwt: IJwt;
  public bcrypt: IBycript;

  constructor(userModel: IUserModel, accountModel: unknown, jwt: IJwt, bcrypt: IBycript) {
    this.userModel = userModel;
    this.accountModel = accountModel;
    this.jwt = jwt;
    this.bcrypt = bcrypt;
  }

  public async register(registerReq: IUserRegister): Promise<string> {
    const { name, email, password, cpf, cnpj } = registerReq;

    const user = await this.userModel.getUserByEmail(email);

    if (user) throw new CustomError('usuário já existe!', 400);

    const encryptedPassword = await this.bcrypt.encryptPassword(password);

    const createdId = await this.userModel.register({ name, email, password: encryptedPassword, cpf, cnpj });

    if (!createdId) throw new CustomError('Erro ao criar usuário!', 500);

    //criar account

    const token = this.jwt.createToken(name);

    return token;
  }
}

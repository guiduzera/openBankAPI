import { IAccountModel } from '../interfaces/Account.interfaces';
import CustomError from '../helpers/CustomError';
import { IUserLogin, IUserModel, IUserRegister, IUserService, IUserUpdateService } from '../interfaces/User.interfaces';
import { IBycript, IJwt } from '../interfaces/security.interfaces';

export default class UserService implements IUserService {
  public userModel: IUserModel;
  public accountModel: IAccountModel;
  public jwt: IJwt;
  public bcrypt: IBycript;

  constructor(userModel: IUserModel, accountModel: IAccountModel, jwt: IJwt, bcrypt: IBycript) {
    this.userModel = userModel;
    this.accountModel = accountModel;
    this.jwt = jwt;
    this.bcrypt = bcrypt;
  }

  public async updateUser(user: IUserUpdateService): Promise<boolean> {
    const { name, email, password, accountNumber } = user;
    const account = await this.accountModel.getByAccountNumber(accountNumber);
    const userData = await this.userModel.getUserByEmail(email);

    if (userData) throw new CustomError('Esse email já esá em uso!!', 404);

    const hashPasword = account?.user?.password || '';
    const isPasswordValid = await this.bcrypt.comparePassword(password, hashPasword);

    if (!isPasswordValid) throw new CustomError('Senha inválida!', 401);

    const userEmail = account?.user?.email || '';
    const update = await this.userModel.updateUser({ name, email: userEmail, newEmail: email });

    if (update) return true;

    return false;
  }

  public async login(loginReq: IUserLogin): Promise<string> {
    const { accountNumber, agency, password } = loginReq;
    const account = await this.accountModel.getByAccountNumber(accountNumber);

    if (!account || account.agency !== agency) throw new CustomError('Conta não encontrada!', 404);

    const isPasswordValid = await this.bcrypt.comparePassword(password, account.user?.password || '');

    if (!isPasswordValid) throw new CustomError('Senha inválida!', 401);

    const { name } = account.user || { name: '' };

    const token = this.jwt.createToken({ name, ...account });

    return token;
  }

  public async register(registerReq: IUserRegister): Promise<string> {
    const { name, email, password, cpf, cnpj } = registerReq;
    const cpfOrCnpj = cpf || cnpj;
    const user = await this.userModel.getUserByEmail(email);
    const userByCpfOrCnpj = await this.userModel.getUserByCpfOrCnpj(cpfOrCnpj);

    if (user || userByCpfOrCnpj.length) throw new CustomError('usuário já existe!', 400);

    const encryptedPassword = await this.bcrypt.encryptPassword(password);
    const createdId = await this.userModel.register({ name, email, password: encryptedPassword, cpf, cnpj });

    if (!createdId) throw new CustomError('Erro ao criar usuário!', 500);

    const createdAccount = await this.accountModel.createAccount(createdId);

    if (!createdAccount) throw new CustomError('Erro ao criar conta!', 500);

    const token = this.jwt.createToken({ name, ...createdAccount });

    return token;
  }
}

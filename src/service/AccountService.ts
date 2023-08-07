import { IAccountModel, IAccountService, IcreateAccountResponse } from '../interfaces/Account.interfaces';

export default class AccountService implements IAccountService {
  public accountModel: IAccountModel;

  constructor(accountModel: IAccountModel) {
    this.accountModel = accountModel;
  }

  createAccount(userId: number): Promise<IcreateAccountResponse | null> {
    return this.accountModel.createAccount(userId);
  }
}

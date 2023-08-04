import { sign, verify } from 'jsonwebtoken';
import CustomError from './CustomError';
import { IJwt } from '../interfaces/security.interfaces';

export default class Jwt implements IJwt {
  private _secret: string;
  private _options: Record<string, string>;

  constructor() {
    this._secret = process.env.JWT_SECRET || 'secret';
    this._options = { expiresIn: '24h', algorithm: 'HS256' };
  }

  public createToken(payload: string): string {
    return sign({ data: payload }, this._secret, this._options);
  }

  public verifyToken(token: string): string {
    try {
      const { data } = verify(token, this._secret) as { data: string };
      return data;
    } catch (error) {
      throw new CustomError('Token inválido', 401);
    }
  }
}

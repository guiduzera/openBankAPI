import { Request } from 'express';

export default interface ICustomRequest extends Request {
  user?: {
    accountNumber: string;
    agency: string;
    name: string;
  };
}

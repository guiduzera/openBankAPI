export interface IJwt {
    createToken(payload: string): string,
    verifyToken(token: string): string,
  }

export interface IBycript {
    encryptPassword(password: string): Promise<string>,
    comparePassword(password: string, encrypted: string): Promise<boolean>,
  }

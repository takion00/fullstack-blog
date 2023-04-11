export interface IAuthService {
  createHash(password: string): Promise<string>;
  comparePassword(password: string, hash: string): Promise<boolean>;
}

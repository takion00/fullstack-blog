export interface ITokenService {
  createToken(id: string, email: string): string;
}

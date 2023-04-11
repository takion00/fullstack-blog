import { User } from '@prisma/client';
import { ErrorReturn } from 'src/types/error-return';
import { IdInToken } from 'src/types/idInToken';
import { SearchByUserName } from 'src/types/userSearch';

export interface IUserService {
  createUser(user: User): Promise<string>;
  getUserByUsername(userName: string, isLogin: boolean): Promise<User>;
  getUserByEmail(email: string): Promise<User>;
  updateUser(id: string, data: User): Promise<User>;
  deleteUser(id: string): Promise<User>;
}

export interface IUserController {
  create(body: User): Promise<string | ErrorReturn>;
  update(body: User & IdInToken): Promise<User | ErrorReturn>;
  delete(body: User & IdInToken): Promise<any>;
  search(body: SearchByUserName): Promise<User[] | ErrorReturn>;
}

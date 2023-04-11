import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { IUserService } from 'src/interfaces/user.interface';
import { User } from 'prisma';
// import { User, Prisma } from '@prisma/client';

@Injectable()
export class UserService implements IUserService {
  constructor(private prismaService: PrismaService) {}

  // This function is used to create a new user.
  async createUser(user: User) {
    const createdUser = await this.prismaService.user.create({
      data: user,
    });

    return createdUser.id;
  }

  // This function is used to find a user by userName
  async getUserByUsername(userName: string, isLogin: boolean): Promise<User> {
    if (isLogin) {
      const users = await this.prismaService.$queryRawUnsafe(
        'SELECT * FROM "User" WHERE "userName" ILIKE $1',
        `${userName}%`,
      );

      return users;
    } else {
      const users = await this.prismaService.$queryRawUnsafe(
        'SELECT "userName", "email" FROM "User" WHERE "userName" ILIKE $1',
        `${userName}%`,
      );

      return users as User;
    }
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  }

  // This function is used to update a user
  async updateUser(id: string, data: User): Promise<User> {
    const userUpdated = await this.prismaService.user.update({
      where: {
        id: id,
      },
      data: data,
    });

    return userUpdated;
  }

  // This function is used to delete a user
  async deleteUser(id: string): Promise<User> {
    const result = await this.prismaService.user.delete({
      where: {
        id,
      },
    });

    return result;
  }
}

import { Controller, Post, Get, Delete, Body, Put } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import * as z from 'zod';

import { IUserController } from 'src/interfaces/user.interface';
import { UserService } from '../services/user.service';
import { AuthService } from 'src/auth/auth.service';
import { userSchema } from 'src/utils/validator';
import { SearchByUserName } from 'src/types/userSearch';
import { ErrorReturn } from 'src/types/error-return';
import { IdInToken } from 'src/types/idInToken';

@Controller('user')
export class UserController implements IUserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  // This method is used to create a new user
  @Post()
  async create(@Body() body: User) {
    try {
      userSchema.parse(body);

      body.password = await this.authService.createHash(body.password);
      const { userName, email, password } = body;

      const id = await this.userService.createUser({
        userName,
        email,
        password,
      });

      return id;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          return {
            errors:
              err.meta.target[0] === 'email'
                ? ['Email already exists']
                : ['UserName already exists'],
          };
        }
      }

      if (err instanceof z.ZodError) {
        return {
          errors: err.issues.map((arrayError) => arrayError.message),
        };
      }

      return {
        errors: [err.message],
      };
    }
  }

  // This method is used to update an existing user
  @Put()
  async update(@Body() body: User & IdInToken): Promise<User | ErrorReturn> {
    try {
      const userSchemaUpdate = userSchema.partial();
      body.id = body.idInToken;
      userSchemaUpdate.parse(body);

      if (body.password) {
        body.password = await this.authService.createHash(body.password);
      }

      return this.userService.updateUser(body.id, body);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          return {
            errors:
              err.meta.target[0] === 'email'
                ? ['Email already exists']
                : ['UserName already exists'],
          };
        }
      }

      if (err instanceof z.ZodError) {
        return {
          errors: err.issues.map((arrayError) => arrayError.message),
        };
      }

      return {
        errors: [err.message],
      };
    }
  }

  //This method is used to delete an existing user
  @Delete()
  async delete(@Body() body: User & IdInToken) {
    try {
      const id = body.idInToken;
      await this.userService.deleteUser(id);
      return {
        status: 'ok',
      };
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          return {
            errors: [err.meta.cause],
          };
        }
      }

      return {
        errors: err,
      };
    }
  }

  // This method is used to get users by username
  @Get()
  async search(@Body() body: SearchByUserName) {
    try {
      const user = await this.userService.getUserByUsername(
        body.userName,
        false,
      );

      if (user) return user;
      else throw new Error('User not found');
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        return {
          errors: [err.meta.message],
        };
      }

      return {
        errors: [err.message],
      };
    }
  }
}

import { Body, Controller, Post } from '@nestjs/common';
import * as z from 'zod';

import { AuthService } from 'src/auth/auth.service';
import { ILoginController } from 'src/interfaces/login.interface';
import { UserService } from 'src/services/user.service';
import { TokenService } from 'src/token/token.service';
import { UserLogin } from 'src/types/userLogin';
import { loginSchema } from 'src/utils/validator';

@Controller('login')
export class LoginController implements ILoginController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private tokenService: TokenService,
  ) {}

  @Post()
  async login(@Body() body: UserLogin) {
    try {
      loginSchema.parse(body);
      const user = await this.userService.getUserByEmail(body.email);

      if (!user) {
        return {
          errors: ['User not exist'],
        };
      }

      const isEqual = await this.authService.comparePassword(
        body.password,
        user.password,
      );

      if (!isEqual) {
        return {
          errors: ['Password not match'],
        };
      }

      const token = this.tokenService.createToken(user.id, user.email);

      return {
        token,
      };
    } catch (err) {
      if (err instanceof z.ZodError) {
        return {
          errors: err.issues.map((error) => error.message),
        };
      }

      return {
        errors: [err.message],
      };
    }
  }
}

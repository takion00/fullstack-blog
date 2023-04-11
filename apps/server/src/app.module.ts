import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { PrismaService } from './database/prisma.service';
import { AuthService } from './auth/auth.service';
import { TokenService } from './token/token.service';
import { LoginController } from './controllers/login.controller';
import { TokenMiddleware } from './middleware/token.middleware';
import { PostController } from './controllers/post.controller';
import { PostService } from './services/post.service';

@Module({
  imports: [],
  controllers: [UserController, LoginController, PostController],
  providers: [
    UserService,
    PrismaService,
    AuthService,
    TokenService,
    PostService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TokenMiddleware)
      .exclude(
        { path: 'user', method: RequestMethod.POST },
        { path: 'user', method: RequestMethod.GET },
        { path: 'post', method: RequestMethod.GET },
      )
      .forRoutes(UserController, PostController);
  }
}

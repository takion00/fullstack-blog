import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class TokenMiddleware implements NestMiddleware {
  constructor(private tokenService: TokenService) {}

  use(req: Request, res: Response, next: NextFunction) {
    try {
      const { authorization } = req.headers;
      const token = authorization.split(' ')[1];

      if (!token) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          error: ['Login request'],
        });
      }

      const payload = this.tokenService.verifyToken(token);

      const id = <any>payload;

      if (!id) {
        return res.status(HttpStatus.FORBIDDEN).json({
          errors: ['User not authenticated'],
        });
      }

      req.body.idInToken = id.id;
      next();
    } catch (err) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ errors: ['UNAUTHORIZED'] });
    }
  }
}

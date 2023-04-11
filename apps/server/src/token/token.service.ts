import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class TokenService {
  createToken(id: string, email: string) {
    const hash = jwt.sign({ id, email }, process.env.TOKEN_SECRET, {
      expiresIn: '30d',
      algorithm: 'HS256',
    });
    return hash;
  }

  verifyToken(token: string) {
    const payload = jwt.verify(token, process.env.TOKEN_SECRET);

    return payload;
  }
}

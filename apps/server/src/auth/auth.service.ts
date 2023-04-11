import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { IAuthService } from 'src/interfaces/auth.interface';

@Injectable()
export class AuthService implements IAuthService {
  // This method creates a hash of the user's password
  async createHash(password: string): Promise<string> {
    const passwordHash = await bcrypt.hash(password, bcrypt.genSaltSync(12));
    return passwordHash;
  }

  // This method verifies if the password is correct
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}

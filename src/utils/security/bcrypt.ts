import bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class SecurityUtil {
  async hashPass(plainPass: string): Promise<string> {
    const saltLvl: number = 10;

    const hash = await bcrypt.hash(plainPass, saltLvl);
    return hash;
  }

  async comparePass(
    newPassPlain: string,
    hashedPass: string,
  ): Promise<Boolean> {
    const comparePass = await bcrypt.compare(newPassPlain, hashedPass);
    return comparePass;
  }
}

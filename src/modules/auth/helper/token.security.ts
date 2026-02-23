import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserTokenInterface } from 'src/modules/users/interface/usertoken.interface';
import { VerificationTokenPayload } from 'src/common/interface/auth.interface';

@Injectable()
export class JwtUtil {
  constructor(private jwtService: JwtService) {}

  generateToken(payload: VerificationTokenPayload): string {
    return this.jwtService.sign(payload);
  }

  decodeToken(token: string, user: UserTokenInterface) {
    this.jwtService.decode(token);
  }

  verifyToken(token: string) {
    try {
      const verify = this.jwtService.verify(token);
      return verify;
    } catch (e) {
      throw new UnauthorizedException('invalid token');
    }
  }

  verifyAsync(token: string) {
    return this.jwtService.verifyAsync(token);
  }
}

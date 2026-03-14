  import { JwtService } from '@nestjs/jwt';
  import { Injectable, UnauthorizedException } from '@nestjs/common';
  import { UserTokenInterface } from 'src/modules/admin/interface/usertoken.interface';
  import { VerificationTokenPayload } from 'src/common/interface/auth.interface';
  import { JwtSignOptions } from '@nestjs/jwt';

  @Injectable()
  export class JwtUtil {
    // private opts: JwtSignOptions;
    constructor(private jwtService: JwtService) {}

    verificationToken(payload: VerificationTokenPayload): string {
      return this.jwtService.sign(payload, { expiresIn: '15m' });
    }

    generateSessionToken(payload: VerificationTokenPayload): string {
      return this.jwtService.sign(payload, { expiresIn: '1d' });
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

    async verifyAsync(token: string) {
      return await this.jwtService.verifyAsync(token);
    }
  }

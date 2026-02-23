import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { TokenExtractionType } from '../types/extract-token.types';
import { Request } from 'express';
import { JwtUtil } from '../helper/token.security';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly jwtToken: JwtUtil,
  ) {}

  //token extraction
  private extractToken(req: Request): TokenExtractionType {
    //extact the token by destructuring
    //type and token
    const [type, token] = req.headers.authorization?.split(' ') ?? []; //if undefined token empty array fallback
    return type === 'bearer' ? token : undefined;
  }

  //method of the parent
  //any method that returns a promise needs to be async
  async canActivate(context: ExecutionContext): Promise<boolean> {
    //get request
    const getReq = context.switchToHttp().getRequest();
    const token = this.extractToken(getReq);

    if (!token) {
      throw new UnauthorizedException('missing or invalid token');
    }

    try {
      const payload = this.jwtToken.verifyToken(token);

      //attached the paylaod to the user
      getReq['user'] = payload;
    } catch (e) {
      throw new UnauthorizedException('invalid payload or missing payload');
    }

    return true;
  }
}

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { TokenExtractionType } from '../types/extract-token.types';
import { Request } from 'express';
import { JwtUtil } from '../helper/token.security';
import { PrismaService } from 'src/prisma_global/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtUtil,
  ) {}

  private extractToken(req: Request): TokenExtractionType {
    //bearer & token
    //const [type, token] = req.headers.authorization?.split(' ') ?? []; //if undefined token empty array fallback
    //return type.toLowerCase() === 'bearer' ? token : undefined;
    return req.cookies?.['session_token'];
  }
  //parent method
  async canActivate(context: ExecutionContext): Promise<boolean> {
    //get request
    const getReq = context.switchToHttp().getRequest();
    const token = this.extractToken(getReq);

    if (!token) {
      throw new UnauthorizedException('missing or invalid token');
    }
    await this.jwt.verifyAsync(token);

    return true;
  }
}

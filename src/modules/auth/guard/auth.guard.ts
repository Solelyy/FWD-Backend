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
import { JwtHelper } from '../../../common/helper/token.security';
import { PrismaService } from 'src/prisma_global/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtHelper,
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
    const decoded = await this.jwt.verifyAsync(token);

    const user = await this.prisma.user.findUnique({
      where: { employeeId: decoded.sub },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    if (decoded.role !== user.role) {
      throw new UnauthorizedException('Invalid role');
    }

    //attached the user to request
    getReq.user = {
      id: user.id,
      employeeId: user.employeeId,
      email: user.email,
      role: user.role,
    };

    return true;
  }
}

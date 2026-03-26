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
    const getReq = context.switchToHttp().getRequest();
    const token = this.extractToken(getReq);

    console.log('1. Token extracted:', token ? 'YES' : 'NO');

    if (!token) {
      console.log('❌ No token');
      throw new UnauthorizedException('missing or invalid token');
    }

    const decoded = await this.jwt.verifyAsync(token);
    console.log('2. Decoded token:', decoded);
    console.log('   - sub (employeeId):', decoded.sub);
    console.log('   - role from token:', decoded.role);

    const user = await this.prisma.user.findUnique({
      where: { employeeId: decoded.sub },
    });

    console.log('3. User from DB:', user);
    console.log('   - Found:', !!user);
    console.log('   - DB role:', user?.role);

    if (!user) {
      console.log('❌ User not found in database for employeeId:', decoded.sub);
      throw new UnauthorizedException();
    }

    if (decoded.role !== user.role) {
      console.log(
        '❌ Role mismatch - Token role:',
        decoded.role,
        'DB role:',
        user.role,
      );
      throw new UnauthorizedException('Invalid role');
    }

    getReq.user = {
      id: user.id,
      employeeId: user.employeeId,
      email: user.email,
      role: user.role,
    };

    console.log('✅ AuthGuard passed! User attached:', getReq.user);
    return true;
  }
}

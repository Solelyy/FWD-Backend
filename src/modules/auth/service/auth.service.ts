import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginDto } from 'src/modules/auth/dto/login.dto';
import { PrismaService } from 'src/prisma_global/prisma.service';
import { JwtUtil } from 'src/modules/auth/helper/token.security';
import { UnauthorizedException } from '@nestjs/common';
import SecurityUtil from '../helper/bcrypt.security';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtUtil,
    private readonly util: SecurityUtil,
  ) {}

  async userLogin(login: LoginDto) {
    const expiration = new Date();
    expiration.setDate(expiration.getDate() + 1);

    const findEmployeeId = await this.prisma.user.findUnique({
      where: { employeeId: login.employeeId },
    });

    if (!findEmployeeId) {
      throw new UnauthorizedException('user not found');
    }

    const comparePassword = await this.util.comparePass(
      login.passwordHash,
      findEmployeeId.passwordHash,
    );

    if (!comparePassword) {
      throw new BadRequestException('passwords do not match');
    }

    const token = this.jwt.generateToken({
      email: findEmployeeId.email,
      sub: findEmployeeId.employeeId,
      role: findEmployeeId.role,
    });

    const updateEmployee = await this.prisma.user.update({
      where: { employeeId: login.employeeId },
      data: {
        authTokenExpiresAt: expiration,
        authCurrentToken: token,
      },
    });

    return updateEmployee;
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginSuperAdminDto } from 'src/dto/superadmin/login.dto';
import { PrismaService } from 'src/prisma_global/prisma.service';
import { JwtUtil } from 'src/utils/security/token.security';
import { UnauthorizedException } from '@nestjs/common';
import SecurityUtil from '../../utils/security/bcrypt';

@Injectable()
export class SuperadminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtUtil,
    private readonly util: SecurityUtil,
  ) {}

  async getToken(login: LoginSuperAdminDto) {
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

    return token;
  }
}

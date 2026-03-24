import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LoginDto } from 'src/modules/auth/dto/login.dto';
import { PrismaService } from 'src/prisma_global/prisma.service';
import { JwtHelper } from 'src/common/helper/token.security';
import { UnauthorizedException } from '@nestjs/common';
import SecurityUtil from '../../../common/helper/bcrypt.security';
import { Status } from '@prisma/client';
import { SetPasswordDto } from '../dto/setup-pass.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtHelper,
    private readonly util: SecurityUtil,
  ) {}

  async userLogin(login: LoginDto) {
    const userStatus: Status[] = ['SUSPENDED', 'INACTIVE', 'EXPIRED'];

    const findEmployeeId = await this.prisma.user.findFirst({
      where: { employeeId: login.employeeId },
    });

    if (!findEmployeeId) {
      throw new NotFoundException('user not found');
    } else if (!findEmployeeId.password) {
      throw new BadRequestException();
      // includes() method checks if the value exists on the array
    } else if (userStatus.includes(findEmployeeId.status)) {
      throw new UnauthorizedException(
        "user can't login, contact IT Support for information",
      );
    }

    const comparePassword = await this.util.comparePass(
      login.password,
      findEmployeeId.password,
    );

    if (!comparePassword) {
      throw new BadRequestException('passwords do not match');
    }

    const token = this.jwt.generateSessionToken({
      email: findEmployeeId.email,
      sub: findEmployeeId.employeeId,
      role: findEmployeeId.role,
    });

    const updateEmployee = await this.prisma.user.update({
      where: { employeeId: login.employeeId },
      data: {
        session: token,
      },
    });

    return {
      id: updateEmployee.id,
      employeeId: updateEmployee.employeeId,
      firstname: updateEmployee.firstname,
      lastname: updateEmployee.lastname,
      role: updateEmployee.role,
      email: updateEmployee.email,
      session: updateEmployee.session,
      isDataPolicyAccepted: updateEmployee.isDataPolicyAccepted,
    };
  }

  async getMe(token: string) {
    const user = await this.prisma.user.findFirst({
      where: { session: token },
    });

    if (!user) {
      throw new NotFoundException('token do not match');
    }

    const { id, employeeId, firstname, lastname, role, email, ...others } =
      user;

    return {
      id,
      employeeId,
      firstname,
      lastname,
      role,
      email,
    };
  }

  async setPassword(token: string, setPass: SetPasswordDto) {
    const verifiedToken = this.jwt.verifyToken(token);

    const user = await this.prisma.user.findFirst({
      where: { verificationToken: token },
    });

    if (!user) {
      throw new BadRequestException('token invalid or do not ex');
    }

    const hashedPassword = await this.util.hashPass(setPass.password);

    const updatedUser = await this.prisma.user.update({
      where: { email: user.email },
      data: {
        password: hashedPassword,
        verificationToken: null,
        status: Status.ACTIVE,
      },
    });

    return updatedUser;
  }

  async verifyToken(token: string) {
    const verifiedToken = this.jwt.verifyToken(token);
    const user = await this.prisma.user.findFirst({
      where: { verificationToken: token },
    });

    if (!user) {
      throw new UnauthorizedException('invalid token or token doesnt exists');
    }

    const { employeeId } = user;

    return employeeId;
  }
}

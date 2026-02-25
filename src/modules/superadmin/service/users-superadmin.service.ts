import {
  Body,
  Injectable,
  Post,
  UseGuards,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { CreateAdminUser } from '../dto/create-superadmin.dto';
//import { UpdateSuperadminDto } from '../dto/update-superadmin.dto';
import { PrismaService } from 'src/prisma_global/prisma.service';
import { EmailService } from 'src/email/service/email.service';
import { JwtUtil } from 'src/modules/auth/helper/token.security';
import { Role } from '@prisma/client';
import { FilterQueryHelper } from 'src/utils/filter-query.utils';

@Injectable()
export class SuperAdminUsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly email: EmailService,
    private readonly jwt: JwtUtil,
    private readonly filter: FilterQueryHelper,
  ) {}

  async createUserAdmin(createUser: CreateAdminUser) {
    //when filtering use conditionals
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: createUser.email },
          { employeeId: createUser.employeeId },
        ],
      },
    });

    if (existingUser) {
      this.filter.filterQuery(createUser, existingUser);
    }

    const generatedToken = this.jwt.generateToken({
      email: createUser.email,
      sub: createUser.employeeId,
      role: Role.ADMIN,
    });

    const createAdmin = await this.prisma.user.create({
      data: {
        email: createUser.email,
        employeeId: createUser.employeeId,
        firstname: createUser.firstname,
        lastname: createUser.lastname,
        role: Role.ADMIN,
        verificationToken: generatedToken,
      },
    });

    await this.email.sendVerificationEmail(createAdmin.email, generatedToken);

    return createAdmin;
  }
}

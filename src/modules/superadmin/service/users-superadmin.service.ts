import {
  Body,
  Injectable,
  Post,
  UseGuards,
  ConflictException,
} from '@nestjs/common';
import { CreateAdminUser } from '../dto/create-superadmin.dto';
//import { UpdateSuperadminDto } from '../dto/update-superadmin.dto';
import { AuthGuard } from 'src/modules/auth/guard/auth.guard';
import { CustomValidationPipe } from 'src/common/custom-pipes/pipes.custom-pipes';
import { PrismaService } from 'src/prisma_global/prisma.service';
import { EmailService } from 'src/email/service/email.service';
import { JwtUtil } from 'src/modules/auth/helper/token.security';
import { Role } from '@prisma/client';
import { FilterQueryHelper } from 'src/utils/filter-query.utils';
import { CookieHelper } from 'src/utils/cookie';
import { Response } from '@nestjs/common';

@Injectable()
export class SuperAdminUsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly email: EmailService,
    private readonly jwt: JwtUtil,
    private readonly filter: FilterQueryHelper,
    private readonly cookie: CookieHelper,
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

    const createAdmin = await this.prisma.user.create({
      data: {
        email: createUser.email,
        employeeId: createUser.employeeId,
        firstname: createUser.firstname,
        lastname: createUser.lastname,
        role: Role.ADMIN,
      },
    });

    const generatedToken = this.jwt.generateToken({
      email: createAdmin.email,
      sub: createAdmin.id,
      role: createAdmin.role,
    });

    this.cookie.setAuthCookies({});
    await this.email.sendVerificationEmail(createAdmin.email, generatedToken);
  }

  findOne(id: number) {
    return `This action returns a #${id} superadmin`;
  }

  //update(id: number, updateSuperadminDto: UpdateSuperadminDto) {
  //return `This action updates a #${id} superadmin`;
  // }

  remove(id: number) {
    return `This action removes a #${id} superadmin`;
  }
}

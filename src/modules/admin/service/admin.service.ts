import { Injectable } from '@nestjs/common';
import { UserRequestInterface } from '../interface/admin-request.interface';
import { UpdateUserDto } from '../dto/update-admin.dto';
import { PrismaService } from 'src/prisma_global/prisma.service';
import SecurityUtil from 'src/modules/auth/helper/bcrypt.security';
import { UserTokenInterface } from 'src/modules/admin/interface/usertoken.interface';
import { UserResponseInterface } from '../interface/admin-response.interface';
import { FilterQueryHelper } from 'src/utils/filter-query.utils';
import { JwtUtil } from 'src/modules/auth/helper/token.security';
import { Role } from '@prisma/client';
import { EmailService } from 'src/email/service/email.service';
@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private secUtil: SecurityUtil,
    private readonly filterError: FilterQueryHelper,
    private readonly jwt: JwtUtil,
    private readonly email: EmailService,
  ) {}

  async createUser(createUser: UserRequestInterface) {
    const ifExists = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: createUser.email },
          { employeeId: createUser.employeeId },
        ],
      },
    });

    // if true run this block
    if (ifExists) {
      this.filterError.filterQuery(createUser, ifExists);
    }

    const token = this.jwt.verificationToken({
      email: createUser.email,
      sub: createUser.employeeId,
      role: Role.EMPLOYEE,
    });

    const user = await this.prisma.user.create({
      data: {
        email: createUser.email,
        employeeId: createUser.employeeId,
        firstname: createUser.firstname,
        lastname: createUser.lastname,
        role: Role.EMPLOYEE,
        verificationToken: token,
      },
    });

    this.email.sendVerificationEmail(user.email, token);
  }

  async updateUser(user: UserResponseInterface) {
    const { id, passwordHash, isVerified, ...others } = user;

    const updateUser = await this.prisma.user.update({
      where: { id },
      data: {
        ...others,
        //isVerified: true,
      },
    });

    return updateUser;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

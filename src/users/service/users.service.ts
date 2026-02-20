import { Injectable } from '@nestjs/common';
import { UserRequestInterface } from '../interface/user-request.interface';
import { UpdateUserDto } from '../dto/update-user.dto';
import { PrismaService } from 'src/prisma_global/prisma.service';
import SecurityUtil from 'src/utils/security/bcrypt';
import { UserTokenInterface } from 'src/users/interface/usertoken.interface';
import { UserResponseInterface } from '../interface/user-response.interface';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private secUtil: SecurityUtil,
  ) {}

  async createUser(createUser: UserRequestInterface) {
    try {
      const hashedPass = await this.secUtil.hashPass(createUser.passwordHash);

      const user = await this.prisma.user.create({
        data: {
          ...createUser,
          passwordHash: hashedPass,
        },
      });

      const { passwordHash, ...other } = user;
      return other;
    } catch (e) {
      throw new Error(`error at: ${e.message}`); //passed the error message to controller via e.message
    }
  }

  async updateUser(user: UserResponseInterface) {
    const { id, passwordHash, isVerified, ...others } = user;

    const updateUser = await this.prisma.user.update({
      where: { id },
      data: {
        ...others,
        isVerified: true,
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

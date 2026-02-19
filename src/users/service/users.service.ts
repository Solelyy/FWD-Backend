import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { PrismaService } from 'src/prisma_global/prisma.service';
import SecurityUtil from 'src/utils/security/bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private secUtil: SecurityUtil,
  ) {}

  async createUser(createUser: CreateUserDto) {
    try {
      const hashedPass = await this.secUtil.hashPass(createUser.passwordHash);

      const user = await this.prisma.user.create({
        data: {
          ...createUser,
          passwordHash: hashedPass,
        },
      });

      const { passwordHash, id, ...other } = user;
      //return other; remove the slash if testing
    } catch (e) {
      throw new Error(`error at: ${e.message}`); //passed the error message to controller via e.message
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

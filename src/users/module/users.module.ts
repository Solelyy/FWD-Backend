import { Module } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { UsersController } from '../controller/users.controller';
import SecurityUtil from 'src/utils/security/bcrypt';

@Module({
  controllers: [UsersController],
  providers: [UsersService, SecurityUtil], //using
})
export class UsersModule {}

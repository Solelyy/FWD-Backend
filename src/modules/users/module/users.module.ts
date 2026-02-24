import { Module } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { UsersController } from '../controller/users.controller';
import SecurityUtil from 'src/modules/auth/helper/bcrypt.security';
import { AuthModule } from 'src/modules/auth/module/auth.module';
@Module({
  imports: [AuthModule],
  controllers: [UsersController],
  providers: [UsersService, SecurityUtil],
  exports: [UsersService], //using
})
export class UsersModule {}

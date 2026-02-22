import { Module } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { UsersController } from '../controller/users.controller';
import SecurityUtil from 'src/utils/security/bcrypt';
import { UtilModule } from 'src/utils/security/utils.module';

@Module({
  imports: [UtilModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], //using
})
export class UsersModule {}

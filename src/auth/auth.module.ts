import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/module/users.module';
import { AuthService } from './auth.service';
import { UtilModule } from 'src/utils/security/utils.module';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [UsersModule, UtilModule, EmailModule],
  providers: [AuthService],
})
export class AuthModule {}

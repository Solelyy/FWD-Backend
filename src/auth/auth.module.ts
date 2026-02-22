import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/module/users.module';
import { AuthService } from './user/auth.service';
import { UtilModule } from 'src/utils/security/utils.module';
import { EmailModule } from 'src/email/email.module';
import { SuperadminService } from './superadmin/superadmin.service';
import { SuperadminController } from './superadmin/superadmin.controller';
import { CustomValidationPipe } from './custom-pipes/pipes.custom-pipes';

@Module({
  imports: [UsersModule, UtilModule, EmailModule],
  providers: [AuthService, SuperadminService, CustomValidationPipe],
  controllers: [SuperadminController],
})
export class AuthModule {}

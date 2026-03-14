import { Module } from '@nestjs/common';
import { AdminService } from '../service/admin.service';
import { AdminController } from '../controller/users.controller';
import SecurityUtil from 'src/modules/auth/helper/bcrypt.security';
import { AuthModule } from 'src/modules/auth/module/auth.module';
import { UtilModule } from 'src/utils/util.module';
import { EmailModule } from 'src/email/module/email.module';
import { ManagementServiceFeature } from '../service/management.service';
import { ManagementControllerFeature } from '../controller/management.controller';

@Module({
  imports: [AuthModule, UtilModule, EmailModule],
  controllers: [AdminController, ManagementControllerFeature],
  providers: [AdminService, SecurityUtil, ManagementServiceFeature],
})
export class AdminModule {}

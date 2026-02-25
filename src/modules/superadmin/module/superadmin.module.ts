import { Module } from '@nestjs/common';
//import { SuperadminService } from '../service/users-superadmin.service';
import { SuperadminController } from '../controller/superadmin.controller';
import { EmailModule } from 'src/email/module/email.module';
import { JwtModule } from '@nestjs/jwt';
import env from 'dotenv';
import { AuthModule } from '../../auth/module/auth.module';
import { UtilModule } from 'src/utils/util.module';
import { SuperAdminUsersService } from '../service/users-superadmin.service';

const envi = process.env.NODE_ENV || 'development';
const path = `.env.${envi}`;

env.config({ path: path });

const { SECRET_KEY } = process.env;
@Module({
  imports: [
    UtilModule,
    EmailModule,
    JwtModule.register({
      global: true,
      secret: SECRET_KEY,
      signOptions: {
        expiresIn: '15m',
      },
    }),
    AuthModule,
  ],
  controllers: [SuperadminController],
  providers: [SuperAdminUsersService],
})
export class SuperadminModule {}

import { Module } from '@nestjs/common';
import { AdminModule } from 'src/modules/admin/module/admin.module';
//import { AuthService } from '../lilipat pa/auth.service';
import { EmailModule } from 'src/email/module/email.module';
import { AuthService } from '../service/auth.service';
import { AuthController } from '../controller/auth.controller';
import { CustomValidationPipe } from '../../../common/custom-pipes/pipes.custom-pipes';
import { JwtModule } from '@nestjs/jwt';
import env from 'dotenv';
import SecurityUtil from '../../../common/helper/bcrypt.security';
import { JwtHelper } from '../../../common/helper/token.security';
import { UtilModule } from 'src/utils/util.module';
import { AuthGuard } from '../guard/auth.guard';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CustomThrottleGuard } from '../guard/custom-throttle.guard';
import { RolesGuard } from '../guard/roles.guard';
const environment = process.env.NODE_ENV || 'development';
const path = `.env.${environment}`;

env.config({ path: path });

const { SECRET_KEY } = process.env;
@Module({
  imports: [
    JwtModule.register({
      //register a token life
      global: true,
      secret: SECRET_KEY,
    }),
    ThrottlerModule.forRoot({
      // throttler must be configured at module, where rate limiting is gonna be used for
      throttlers: [
        {
          name: 'login',
          ttl: 900000,
          limit: 5,
        },
      ],
    }),
    EmailModule,
    UtilModule,
  ],
  providers: [
    //AuthService,
    AuthService,
    CustomValidationPipe,
    SecurityUtil,
    JwtHelper,
    AuthGuard,
    CustomThrottleGuard,
    RolesGuard,
    // disable appguard to not set it globally,
    // if specific routes only need rate limiting, not all
  ],

  controllers: [AuthController],
  exports: [
    JwtHelper,
    SecurityUtil,
    AuthGuard,
    CustomThrottleGuard,
    RolesGuard,
  ],
})
export class AuthModule {}

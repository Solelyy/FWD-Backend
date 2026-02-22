import { Module } from '@nestjs/common';
import { UsersModule } from 'src/modules/users/module/users.module';
//import { AuthService } from '../lilipat pa/auth.service';
import { EmailModule } from 'src/email/module/email.module';
import { AuthService } from '../service/auth.service';
import { AuthController } from '../controller/auth.controller';
import { CustomValidationPipe } from '../../../common/custom-pipes/pipes.custom-pipes';
import { JwtModule } from '@nestjs/jwt';

import env from 'dotenv';
import SecurityUtil from '../helper/bcrypt.security';
import { JwtUtil } from '../helper/token.security';

const environment = process.env.NODE_ENV || 'development';
const path = `.env.${environment}`;

env.config({ path: path });

const { SECRET_KEY } = process.env;
@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      //register a token life
      global: true,
      secret: SECRET_KEY,
      signOptions: { expiresIn: '1d' },
    }),
    EmailModule,
  ],
  providers: [
    //AuthService,
    AuthService,
    CustomValidationPipe,
    SecurityUtil,
    JwtUtil,
  ],
  controllers: [AuthController],
})
export class AuthModule {}

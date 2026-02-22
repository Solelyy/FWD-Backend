import { Module, Global } from '@nestjs/common';
import { JwtUtil } from './token.security';
import { JwtService } from '@nestjs/jwt';
import SecurityUtil from './bcrypt';

@Global()
@Module({
  providers: [JwtUtil, JwtService, SecurityUtil],
  exports: [JwtUtil, SecurityUtil],
})
export class UtilModule {}

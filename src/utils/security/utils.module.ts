import { Module, Global } from '@nestjs/common';
import { JwtUtil } from './token.security';
import { JwtService } from '@nestjs/jwt';

@Global()
@Module({
  providers: [JwtUtil, JwtService],
  exports: [JwtUtil],
})
export class UtilModule {}

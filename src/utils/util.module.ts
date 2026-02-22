import { Module } from '@nestjs/common';
import { CookieHelper } from './cookie';
@Module({
  providers: [CookieHelper],
  exports: [CookieHelper],
})
export class UtilModule {}

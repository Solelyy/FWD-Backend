import { Module } from '@nestjs/common';
import { CookieHelper } from './cookie';
import { FilterQueryHelper } from './filter-query.utils';
@Module({
  providers: [CookieHelper, FilterQueryHelper],
  exports: [CookieHelper, FilterQueryHelper],
})
export class UtilModule {}

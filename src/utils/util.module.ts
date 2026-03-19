import { Module } from '@nestjs/common';
import { CookieHelper } from './cookie';
import { FilterQueryHelper } from './filter-query.utils';
import { DateHelper } from './date.utils';
import { CronCheckerHelper } from './cron.utils';
// import { RateLimiter } from './custom-ratelimiter';

@Module({
  imports: [],
  providers: [
    CookieHelper,
    FilterQueryHelper,
    DateHelper,
    CronCheckerHelper,
    // RateLimiter,
  ],
  exports: [CookieHelper, FilterQueryHelper, DateHelper],
})
export class UtilModule {}

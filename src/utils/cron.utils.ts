import { Cron } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CronChecker {
  @Cron('0 * * * * *')
  async dateChecker() {}
}

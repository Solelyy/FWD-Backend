import { Cron } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma_global/prisma.service';
import { Status } from '@prisma/client';
@Injectable()
export class CronCheckerHelper {
  constructor(private readonly prisma: PrismaService) {}
  //  test, remove one asterisk to check every hour
  // this checks every minute
  @Cron('0 * * * * *')
  async dateChecker() {
    const date = new Date();

    const findMany = await this.prisma.user.updateMany({
      where: {
        endDate: { lt: date }, // lt means, less than
        status: Status.SUSPENDED,
      },
      data: {
        startDate: null,
        endDate: null,
        status: Status.ACTIVE,
      },
    });

    console.log(`user set as active from suspended: ${findMany.count}`);
  }
}

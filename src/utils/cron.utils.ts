import { Cron } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma_global/prisma.service';
import { Role, Status } from '@prisma/client';
import { DateHelper } from './date.utils';
@Injectable()
export class CronCheckerHelper {
  constructor(
    private readonly prisma: PrismaService,
    private readonly date: DateHelper,
  ) {}
  //  test, remove one asterisk to check every hour
  @Cron('0 * * * *')
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

  /**
   * * This adds or update leave balances yearly
   * * to decrement and increment are used inside of an attribute
   * @memberof CronCheckerHelper
   */
  @Cron('0 0 1 1 *')
  async generateNewLeaveBalances() {
    //
    const update = this.prisma.user.updateMany({
      where: {
        role: Role.EMPLOYEE,
      },
      data: {
        sickLeaveBalance: {
          increment: 6,
        },
        vacationLeaveBalance: {
          increment: 6,
        },
        otherBalance: {
          increment: 6,
        },
        accumulatedLeave: {
          increment: 6,
        },
      },
    });
  }
}

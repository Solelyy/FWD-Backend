import { Cron } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma_global/prisma.service';
@Injectable()
export class CronCheckerHelper {
  constructor(private readonly prisma: PrismaService) {}
  @Cron('0 * * * *')
  async dateChecker() {
    const date = new Date();

    const findMany = await this.prisma.user.updateMany({
      where: {
        endDate: { lt: date },
      },
      data: {
        startDate: null,
        endDate: null,
      },
    });

    console.log(`Lifted up users: ${findMany.count}`);
  }
}

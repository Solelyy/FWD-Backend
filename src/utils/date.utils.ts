import { PrismaService } from 'src/prisma_global/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class DateHelper {
  workStart: Date;
  workEnd: Date;
  graceMin: Date;

  constructor(private readonly prisma: PrismaService) {
    this.workStart = new Date('1970-01-01T07:00:00Z');
    this.workEnd = new Date('1970-01-01T17:00:00Z');
    this.graceMin = new Date(this.workStart.getTime() + 15 * 60 * 1000);
  }

  async LocaleSetDateHelper(email: string, token: string) {
    const date = new Date();

    const setEmailCreationDate = date.toLocaleString('en-PH', {
      timeZone: 'Asia/Manila',
      dateStyle: 'full',
      timeStyle: 'medium',
    });

    try {
      const user = await this.prisma.user.update({
        where: {
          email: email,
        },
        data: {
          invitationDate: setEmailCreationDate,
          verificationToken: token,
        },
      });
    } catch (e) {
      throw new BadRequestException('User invalid or user not found');
    }
  }

  getWorkingConstraints() {
    return {
      startHour: this.workStart.getUTCHours(),
      startMinute: this.workStart.getUTCMinutes(),
      endHour: this.workEnd.getUTCHours(),
      endMinute: this.workEnd.getUTCMinutes(),
      graceHour: this.graceMin.getUTCHours(),
      graceMinute: this.graceMin.getUTCMinutes(),
    };
  }
}

import { PrismaService } from 'src/prisma_global/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class DateHelper {
  workStart: Date;
  workEnd: Date;
  graceMin: Date;
  overtimeEnd: Date;
  constructor(private readonly prisma: PrismaService) {
    this.workStart = new Date('1970-01-01T07:00:00Z');
    this.workEnd = new Date('1970-01-01T17:00:00Z');
    this.graceMin = new Date(this.workStart.getTime() + 15 * 60 * 1000);
    this.overtimeEnd = new Date(this.workEnd.getTime() + 30 * 60 * 1000);
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
      overtimeHour: this.overtimeEnd.getUTCHours(),
      overtimeMinute: this.overtimeEnd.getUTCMinutes(),
    };
  }

  getSpanAttendanceDatesLogs(year: number, month: number, day?: number) {
    let date = {};

    if (year && month && day) {
      const startDate = new Date(year, month - 1, day); // first day
      const endDate = new Date(year, month - 1, day + 1); // last day since dates are zero index esp in js

      return {
        date: {
          gte: startDate,
          lte: endDate,
        },
      };
    } else if (year && month) {
      const startDate = new Date(year, month - 1, 0); // first day
      const endDate = new Date(year, month, 1); // last day since dates are zero index esp in js

      return {
        date: {
          gte: startDate,
          lte: endDate,
        },
      };
    } else if (year) {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31);

      return {
        date: {
          gte: startDate,
          lte: endDate,
        },
      };
    }
  }

  getEmployeeToday(): { gte: Date; lte: Date } {
    const date = new Date();
    const phTime = new Date(
      // param, options
      date.toLocaleString('en-US', { timeZone: 'Asia/Manila' }),
    );

    // set to todays start Hour or zero Hour of the day
    const startDate = new Date(phTime);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(phTime);
    endDate.setDate(endDate.getDate() + 1); // add one day for today
    endDate.setHours(0, 0, 0, 0);

    return {
      gte: startDate,
      lte: endDate,
    };
  }

  calculateHoursWorked(timeIn: Date, timeOut: Date): number {
    // set span
    const diffMs = timeOut.getTime() - timeIn.getTime();

    //convert to hours
    const diffHours = diffMs / (1000 * 60 * 60);

    const total = Number(diffHours.toFixed(2));
    // decimal
    return total;
  }

  calculateRequestedHours(timeIn: Date, timeOut: Date) {
    let regularWorkingHours = 10; // set work span in hours which is a whole num
    const totalMs = timeOut.getTime() - timeIn.getTime(); // get ms

    const WorkHours = totalMs / (1000 * 60 * 60); // convert to hours

    const overtimeWorkingHours = Math.max(0, WorkHours - regularWorkingHours);

    return overtimeWorkingHours;
  }

  leaveSpan(startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const calMS = end.getTime() - start.getTime();
    const convertToDaysDecimal = calMS / (1000 * 60 * 60 * 24);

    return convertToDaysDecimal;
  }
}

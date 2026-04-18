import { Injectable, NotFoundException } from '@nestjs/common';
import { OvertimeStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma_global/prisma.service';
import { DateHelper } from 'src/utils/date.utils';

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly date: DateHelper,
  ) {}

  async acceptDataPolicy(employeeId: string) {
    const update = await this.prisma.user.update({
      where: { employeeId: employeeId },
      data: {
        isDataPolicyAccepted: true,
      },
    });
  }

  async getAttendanceSummary(year: number, month: number, employeeId: string) {
    let presentDays = 0;
    let totalHours = 0;

    const find = await this.prisma.tbl_attendance.findFirst({
      where: { employeeId: employeeId },
    });

    if (!find) {
      throw new NotFoundException('User not found');
    }

    const date = this.date.getSpanAttendanceDatesLogs(year, month);

    const attendances = await this.prisma.tbl_attendance.findMany({
      where: {
        employeeId: employeeId,
        date: {
          gte: date?.date.gte,
          lte: date?.date.lte,
        },
      },
    });

    for (let attendance of attendances) {
      if (attendance.timeOut != null) {
        const total = this.date.calculateHoursWorked(
          attendance.timeIn,
          attendance.timeOut,
        );
        totalHours += total;
        presentDays++;
      }
    }

    const totalLogs = await this.prisma.tbl_attendance.count({
      where: {
        employeeId: employeeId,
      },
    });

    const accumulatedOvertime = await this.prisma.tbl_overtime.aggregate({
      where: {
        overtime_status: OvertimeStatus.APPROVED,
      },
      _sum: {
        requested_hours: true,
      },
    });

    return {
      presentDays: presentDays,
      totalHours: totalHours,
      totalLogs: totalLogs,
      accumulatedOvertime: accumulatedOvertime._sum.requested_hours,
    };
  }

  isOvertime() {
    let isOvertime = false;
    const date = new Date();
    const workHours = this.date.getWorkingConstraints();

    const nowDateHours = date.getHours();
    const nowDateMinutes = date.getMinutes();

    if (
      nowDateHours > workHours.overtimeHour ||
      (nowDateHours === workHours.overtimeHour &&
        nowDateMinutes > workHours.overtimeMinute)
    ) {
      isOvertime = true;
    } else {
      isOvertime = false;
    }

    return {
      isOvertime,
    };
  }
}

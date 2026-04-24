import { Injectable, NotFoundException } from '@nestjs/common';
import { OvertimeStatus, Role } from '@prisma/client';
import { PrismaService } from 'src/prisma_global/prisma.service';
import { DateHelper } from 'src/utils/date.utils';

@Injectable()
export class AdminLeaveService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly date: DateHelper,
  ) {}

  async getLeaveBalances() {
    const getAll = await this.prisma.user.findMany({
      where: { role: Role.EMPLOYEE },
      select: {
        id: true,
        employeeId: true,
        firstname: true,
        lastname: true,
        sickLeaveBalance: true,
        vacationLeaveBalance: true,
        accumulatedLeave: true,
      },
    });

    return getAll;
  }

  async getAllLeaveRequests(
    page: number,
    limit: number,
    year: number,
    month: number,
    filter: string,
  ) {
    const dates = this.date.getSpanAttendanceDatesLogs(year, month);
    const statusFilter = filter as OvertimeStatus | undefined;

    const allLogs = await this.prisma.user.findMany({
      include: {
        leave_records: {
          where: {
            ...(statusFilter && { status: statusFilter }),
            submittedAt: {
              lte: dates?.date.lte,
              gte: dates?.date.gte,
            },
          },
          skip: (page - 1) * limit,
          take: limit,
          orderBy: {
            submittedAt: 'desc',
          },
        },
      },
    });

    if (!allLogs) {
      throw new NotFoundException('No attendance logs for this month and year');
    }

    const total = await this.prisma.tbl_leave.count({
      where: {
        ...(statusFilter && { status: statusFilter }),
        submittedAt: {
          lte: dates?.date.lte,
          gte: dates?.date.gte,
        },
      },
    });

    const leaveRecords = allLogs.flatMap((user) =>
      user.leave_records.map((leave) => ({
        id: leave.id,
        employeeId: user.employeeId,
        firstname: user.firstname,
        lastname: user.lastname,
        leaveType: leave.leaveType,
        startDate: leave.startDate,
        endDate: leave.endDate,
        status: leave.status,
      })),
    );

    return {
      requests: leaveRecords,
      meta: {
        page: page,
        limit: limit,
        total: total,
      },
    };
  }
}

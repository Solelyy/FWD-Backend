import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LeaveStatus, OvertimeStatus, Role } from '@prisma/client';
import { LeaveHelper } from 'src/common/helper/leave-helper';
import { LeaveEnum } from 'src/modules/employee/types/create-leave';
import { PrismaService } from 'src/prisma_global/prisma.service';
import { DateHelper } from 'src/utils/date.utils';

@Injectable()
export class AdminLeaveService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly date: DateHelper,
    private readonly leaveHelper: LeaveHelper,
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
    const statusFilter = filter === 'ALL' ? undefined : (filter as LeaveStatus);

    const allLogs = await this.prisma.user.findMany({
      include: {
        leave_records: {
          where: {
            ...(statusFilter && { status: statusFilter }),
            date: {
              lte: dates?.date.lte,
              gte: dates?.date.gte,
            },
          },
          skip: (page - 1) * limit,
          take: limit,
          orderBy: {
            date: 'desc',
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
        date: {
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
        date: leave.date,
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

  async getEmployeeLeaveSummary(year: number, month: number) {
    let pending: number = 0;
    let approved: number = 0;
    let rejected: number = 0;

    const date = this.date.getSpanAttendanceDatesLogs(year, month);

    const leaveRecords = await this.prisma.tbl_leave.findMany({
      where: {
        date: {
          gte: date?.date.gte,
          lte: date?.date.lte,
        },
      },
    });

    if (leaveRecords.length === 0) {
      throw new NotFoundException('No leave records for this month');
    }

    for (let record of leaveRecords) {
      if (record.status === LeaveStatus.APPROVE) {
        approved++;
      } else if (record.status === LeaveStatus.PENDING) {
        pending++;
      } else if (record.status === LeaveStatus.REJECT) {
        rejected++;
      }
    }

    const total = await this.prisma.tbl_leave.count({
      where: {
        date: {
          gte: date?.date.gte,
          lte: date?.date.lte,
        },
      },
    });

    return {
      totalRequests: total,
      pending: pending,
      approved: approved,
      rejected: rejected,
    };
  }

  async approveLeave(employeeId: string, leaveId: number, status: string) {
    const findRecord = await this.prisma.tbl_leave.findUnique({
      where: {
        id: leaveId,
      },
    });

    if (!findRecord) {
      throw new BadRequestException('Record doesnt exists');
    }

    const updateRec = await this.prisma.tbl_leave.update({
      where: {
        id: findRecord.id,
      },
      data: {
        status: status as LeaveStatus,
        validated_by: employeeId,
        validateAt: new Date(),
      },
    });

    if (updateRec.status === LeaveStatus.APPROVE) {
      await this.leaveHelper.getLeaveBal(
        updateRec.employeeId,
        updateRec.days_requested!,
        updateRec.leaveType as LeaveEnum,
      );
    }

    return updateRec;
  }
}

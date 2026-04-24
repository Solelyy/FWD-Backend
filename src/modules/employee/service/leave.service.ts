import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma_global/prisma.service';
import { EmployeeLeaveDTO } from '../dto/create-leave';
import { LeaveQuery } from 'src/common/queries/leave';
import { OvertimeStatus, tbl_leave } from '@prisma/client';
import { LeaveHelper } from 'src/common/helper/leave-helper';
import { DateHelper } from 'src/utils/date.utils';
@Injectable()
export class LeaveService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly leaveQuery: LeaveQuery,
    private readonly date: DateHelper,
    private readonly leaveHelper: LeaveHelper,
  ) {}

  async createLeave(employeeId: string, employee: EmployeeLeaveDTO) {
    const findLeave = await this.prisma.tbl_leave.findFirst({
      where: { status: OvertimeStatus.PENDING, employeeId: employeeId },
      orderBy: {
        submittedAt: 'desc',
      },
    });

    if (findLeave) {
      throw new BadRequestException(
        "user can't request a leave, user still has a pending request",
      );
    }
    const leaveDays = this.date.leaveSpan(employee.startDate, employee.endDate);

    const checkBal = await this.leaveHelper.getLeaveBal(
      employeeId,
      leaveDays,
      employee.leaveType,
    );

    const { leaveType, ...employeeData } = employee;

    const createLeave = await this.leaveQuery.createLeave<tbl_leave>(
      'tbl_leave',
      {
        employeeId: employeeId,
        leaveType: leaveType,
        days_requested: leaveDays,
        ...employeeData,
      },
    );

    return checkBal.remainingBalance;
  }

  async getLeaveBalances(employeeId: string) {
    const get = await this.prisma.user.findUnique({
      where: { employeeId: employeeId },
      select: {
        sickLeaveBalance: true,
        vacationLeaveBalance: true,
        accumulatedLeave: true,
      },
    });

    return get;
  }

  async getLeaveRequests(employeeId: string) {
    const get = await this.prisma.tbl_leave.findMany({
      where: { employeeId: employeeId },
      select: {
        id: true,
        submittedAt: true,
        leaveType: true,
        startDate: true,
        endDate: true,
        status: true,
      },
    });

    return get;
  }
}

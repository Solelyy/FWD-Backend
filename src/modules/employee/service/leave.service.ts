import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma_global/prisma.service';
import { EmployeeLeaveDTO } from '../dto/create-leave';
import { QueryHelper } from 'src/common/queries/leave';
import { LeaveStatus, tbl_leave } from '@prisma/client';
import { LeaveHelper } from 'src/common/helper/leave-helper';
import { DateHelper } from 'src/utils/date.utils';
@Injectable()
export class LeaveService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly QueryHelper: QueryHelper,
    private readonly date: DateHelper,
    private readonly leaveHelper: LeaveHelper,
  ) {}

  async createLeave(employeeId: string, employee: EmployeeLeaveDTO) {
    const findLeave = await this.prisma.tbl_leave.findFirst({
      where: { status: LeaveStatus.PENDING, employeeId: employeeId },
      orderBy: {
        date: 'desc',
      },
    });

    if (findLeave) {
      throw new BadRequestException(
        "user can't request a leave, user still has a pending request",
      );
    }
    const leaveDays = this.date.leaveSpan(employee.startDate, employee.endDate);

    const { leaveType, ...employeeData } = employee;

    const createLeave = await this.QueryHelper.createLeave<tbl_leave>(
      'tbl_leave',
      {
        employeeId: employeeId,
        leaveType: leaveType,
        days_requested: leaveDays,
        status: LeaveStatus.PENDING,
        ...employeeData,
      },
    );
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
        date: true,
        leaveType: true,
        startDate: true,
        endDate: true,
        status: true,
      },
    });
    return get;
  }
}

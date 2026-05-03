import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CashAdvanceStatus,
  LeaveStatus,
  OvertimeStatus,
  ReimbursmentStatus,
  Role,
} from '@prisma/client';
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

    return {
      id: update.id,
      employeeId: update.employeeId,
      firstname: update.firstname,
      lastname: update.lastname,
      role: update.role,
      email: update.email,
      isDataPolicyAccepted: update.isDataPolicyAccepted,
    };
  }

  async getAttendanceSummary(year: number, month: number, employeeId: string) {
    let presentDays = 0;
    let totalHours = 0;

    const find = await this.prisma.tbl_attendance.findFirst({
      where: { employeeId: employeeId },
    });

    if (!find) {
      throw new NotFoundException('etst');
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
        date: {
          gte: date?.date.gte,
          lte: date?.date.lte,
        },
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

  async getCoworkerAttendance() {
    const date = this.date.getEmployeeToday();

    const getAll = await this.prisma.user.findMany({
      where: {
        role: Role.EMPLOYEE,
      },
      include: {
        attendance: {
          where: {
            date: {
              lte: date.lte,
              gte: date.gte,
            },
          },
        },
      },
    });

    if (!getAll) {
      throw new NotFoundException('No coworker record attendance yet');
    }

    const res = getAll.flatMap((user) =>
      user.attendance.map((attendance) => ({
        employeeId: user.employeeId,
        firstname: user.firstname,
        lastname: user.lastname,
        timeIn: {
          timeStamp: attendance.timeIn,
          location: attendance.timeInLoc,
        },
        timeOut: {
          timeStamp: attendance.timeOut,
          location: attendance.timeOutLoc,
        },
        status: attendance.status,
      })),
    );

    return res;
  }

  async getAllMyRequests(employeeId: string, year: number, month: number) {
    const date = this.date.getSpanAttendanceDatesLogs(year, month);
    const user = await this.prisma.user.findUnique({
      where: {
        employeeId: employeeId,
      },
      include: {
        leave_records: {
          where: {
            date: {
              lte: date?.date.lte,
              gte: date?.date.gte,
            },
            status: LeaveStatus.PENDING,
          },
        },
        cas: {
          where: {
            dateSubmitted: {
              lte: date?.date.lte,
              gte: date?.date.gte,
            },
            status: CashAdvanceStatus.PENDING,
          },
        },
        reimbursements: {
          where: {
            dateSubmitted: {
              lte: date?.date.lte,
              gte: date?.date.gte,
            },
            status: ReimbursmentStatus.PENDING,
          },
        },
        approved_overtime: true,
      },
    });

    if (!user) {
      throw new NotFoundException('user doenst have requests in this month');
    }

    // spread operators are same level
    // declared a an array cause its not loop by an array method
    const requests = [
      ...user.leave_records.map((leave) => ({
        id: leave.id,
        type: leave.leaveType,
        leaveType: leave.leaveType,
        submittedAt: leave.date,
        startDate: leave.startDate,
        endDate: leave.endDate,
        status: leave.status,
      })),
      ...user.cas.map((ca) => ({
        id: ca.id,
        type: 'CASH_ADVANCE',
        submittedAt: ca.dateSubmitted,
        status: ca.status,
        amount: ca.amountApproved,
      })),
      ...user.reimbursements.map((reimbursement) => ({
        id: reimbursement.id,
        type: 'REIMBURSEMENT',
        submittedAt: reimbursement.dateSubmitted,
        reimbursementType: reimbursement.type,
        status: 'PENDING',
        amount: reimbursement.amountApproved,
      })),
      ...user.approved_overtime.map((ot) => ({
        id: ot.id,
        type: 'OVERTIME',
        //submittedAt: ot.,
        status: ot.overtime_status,
      })),
    ];

    return requests;
  }
}

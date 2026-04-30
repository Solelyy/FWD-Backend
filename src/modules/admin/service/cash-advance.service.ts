import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { LeaveStatus, Role } from '@prisma/client';
import { PrismaService } from 'src/prisma_global/prisma.service';
import { DateHelper } from 'src/utils/date.utils';
@Injectable()
export class AdminCashAdvanceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly date: DateHelper,
  ) {}

  async getAllCashAdvanceReq() {
    const get = await this.prisma.user.findMany({
      where: {
        role: Role.EMPLOYEE,
      },
      include: {
        cas: {
          select: {
            id: true,
            dateSubmitted: true,
            amountRequested: true,
            amountApproved: true,
            status: true,
          },
        },
      },
    });

    /**
     * * transforms into one array removing nested
     * * explicit {}, implicit ({}) or =>
     */
    const res = get.flatMap((record) =>
      record.cas.map((ca) => ({
        id: ca.id,
        dateSubmitted: ca.dateSubmitted,
        amountRequested: ca.amountRequested,
        amountApproved: ca.amountApproved || 0,
        status: ca.status,
      })),
    );

    return res;
  }

  /**
   * @param {number} page
   * @param {number} limit
   * @param {number} year
   * @param {number} month
   * @param {string} filter
   * @return {*}
   * @memberof AdminCashAdvanceService
   */
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
        cas: {
          where: {
            ...(statusFilter && { status: statusFilter }),
            dateSubmitted: {
              lte: dates?.date.lte,
              gte: dates?.date.gte,
            },
          },
          skip: (page - 1) * limit,
          take: limit,
          orderBy: {
            dateSubmitted: 'desc',
          },
        },
      },
    });

    if (!allLogs) {
      throw new NotFoundException(
        'No cash advance logs for this month and year',
      );
    }

    const total = await this.prisma.tbl_cashadvance.count({
      where: {
        ...(statusFilter && { status: statusFilter }),
        dateSubmitted: {
          lte: dates?.date.lte,
          gte: dates?.date.gte,
        },
      },
    });

    const leaveRecords = allLogs.flatMap((user) =>
      user.cas.map((cas) => ({
        id: cas.id,
        employeeId: cas.employeeId,
        firstname: user.firstname,
        lastname: user.lastname,
        dateSubmitted: cas.dateSubmitted,
        requestedAmount: cas.amountRequested,
        approvedAmount: cas.amountApproved,
        status: cas.status,
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

  async getEmployeeCashAdvanceSummary(year: number, month: number) {
    let totalPendingRequests: number = 0;

    const date = this.date.getSpanAttendanceDatesLogs(year, month);

    const cashAdvc = await this.prisma.tbl_cashadvance.findMany({
      where: {
        dateSubmitted: {
          gte: date?.date.gte,
          lte: date?.date.lte,
        },
      },
    });

    if (cashAdvc.length === 0) {
      throw new NotFoundException('No leave records for this month');
    }

    for (let record of cashAdvc) {
      if (record.status === LeaveStatus.PENDING) {
        totalPendingRequests++;
      }
    }

    const totalReq = await this.prisma.tbl_cashadvance.count({
      where: {
        dateSubmitted: {
          gte: date?.date.gte,
          lte: date?.date.lte,
        },
      },
    });

    const totalCashAdvc = await this.prisma.tbl_cashadvance.aggregate({
      where: {
        status: LeaveStatus.APPROVED,
        dateSubmitted: {
          gte: date?.date.gte,
          lte: date?.date.lte,
        },
      },
      _sum: {
        amountApproved: true,
      },
    });

    return {
      totalRequests: totalReq,
      totalCashAdvance: totalCashAdvc._sum.amountApproved,
      totalPendingRequests: totalPendingRequests,
    };
  }

  async approveRequest(
    employeeId: string,
    cashAdvanceId: number,
    status: string,
  ) {
    const findCaRecord = await this.prisma.tbl_cashadvance.findUnique({
      where: {
        id: cashAdvanceId,
      },
    });

    if (!findCaRecord) {
      throw new BadRequestException('Record doesnt exists');
    }

    const updateRec = await this.prisma.tbl_cashadvance.update({
      where: {
        id: findCaRecord.id,
      },
      data: {
        status: status as LeaveStatus,
        approved_by: employeeId,
        approvedAt: new Date(),
        amountApproved: findCaRecord.amountRequested,
      },
    });

    return updateRec;
  }
}

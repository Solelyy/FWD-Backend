import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  LeaveStatus,
  ReimbursmentStatus,
  Role,
  tbl_reimbursements,
} from '@prisma/client';
import { PrismaService } from 'src/prisma_global/prisma.service';
import { DateHelper } from 'src/utils/date.utils';
@Injectable()
export class AdminReimbursementService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly date: DateHelper,
  ) {}

  /**
   * @param {number} page
   * @param {number} limit
   * @param {number} year
   * @param {number} month
   * @param {string} filter
   * @return {*}
   * @memberof AdminCashAdvanceService
   */
  async getAllReimbursements(
    page: number,
    limit: number,
    year: number,
    month: number,
    filter: string,
  ) {
    const dates = this.date.getSpanAttendanceDatesLogs(year, month);
    const statusFilter =
      filter === 'ALL' ? undefined : (filter as ReimbursmentStatus);

    const allLogs = await this.prisma.user.findMany({
      include: {
        reimbursements: {
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
        'No reimbursement logs for this month and year',
      );
    }

    const total = await this.prisma.tbl_reimbursements.count({
      where: {
        ...(statusFilter && { status: statusFilter }),
        dateSubmitted: {
          lte: dates?.date.lte,
          gte: dates?.date.gte,
        },
      },
    });

    const reimbursementRecords = allLogs.flatMap((user) =>
      user.reimbursements.map((record) => ({
        id: record.id,
        employeeId: record.employeeId,
        firstname: user.firstname,
        lastname: user.lastname,
        dateSubmitted: record.dateSubmitted,
        requestedAmount: record.amountRequested,
        approvedAmount: record.amountApproved,
        status: record.status,
      })),
    );

    return {
      requests: reimbursementRecords,
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

    const reimburseRec = await this.prisma.tbl_reimbursements.findMany({
      where: {
        dateSubmitted: {
          gte: date?.date.gte,
          lte: date?.date.lte,
        },
      },
    });

    if (reimburseRec.length === 0) {
      throw new NotFoundException('No reimbursement records for this month');
    }

    for (let record of reimburseRec) {
      if (record.status === ReimbursmentStatus.PENDING) {
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

    const totalReimbursements = await this.prisma.tbl_reimbursements.aggregate({
      where: {
        status: ReimbursmentStatus.APPROVED,
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
      totalPending: totalPendingRequests,
      totalReimbursed: totalReimbursements._sum.amountApproved,
    };
  }

  async approveRequest(
    employeeId: string,
    reimbursementId: number,
    status: string,
  ) {
    const findReimbursement = await this.prisma.tbl_reimbursements.findUnique({
      where: {
        id: reimbursementId,
      },
    });

    if (!findReimbursement) {
      throw new BadRequestException('Record doesnt exists');
    }

    const updateRec = await this.prisma.tbl_reimbursements.update({
      where: {
        id: findReimbursement.id,
      },
      data: {
        status: status as LeaveStatus,
        approved_by: employeeId,
        approvedAt: new Date(),
        amountApproved: findReimbursement.amountRequested,
      },
    });

    return updateRec;
  }
}

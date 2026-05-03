import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma_global/prisma.service';
import { QueryHelper } from 'src/common/queries/leave';
import {
  ReimbursmentStatus,
  tbl_cashadvance,
  tbl_reimbursements,
} from '@prisma/client';
import { CreateReimbursement } from '../types/reimbursements';
@Injectable()
export class ReimbursementService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly query: QueryHelper,
  ) {}

  async createReimbursementRec(employeeId: string, req: CreateReimbursement) {
    const createRec = await this.query.createLeave<tbl_reimbursements>(
      'tbl_reimbursements',
      {
        employeeId: employeeId,
        ...req,
      },
    );

    return createRec;
  }

  async getMyRecords(employeId: string) {
    const get = await this.prisma.tbl_reimbursements.findMany({
      where: { employeeId: employeId },
      select: {
        id: true,
        dateSubmitted: true,
        type: true,
        amountRequested: true,
        amountApproved: true,
        status: true,
      },
    });

    return get;
  }

  async totalCashAdvance(employeeId: string) {
    const totalApproved = await this.prisma.tbl_reimbursements.aggregate({
      where: {
        employeeId: employeeId,
        status: ReimbursmentStatus.APPROVED,
      },
      _sum: {
        amountApproved: true,
      },
    });

    const totalPending = await this.prisma.tbl_reimbursements.aggregate({
      where: {
        employeeId: employeeId,
        status: ReimbursmentStatus.PENDING,
      },
      _sum: {
        amountRequested: true,
      },
    });

    return {
      totalApproved: totalApproved._sum.amountApproved,
      totalPending: totalPending._sum.amountRequested,
    };
  }
}

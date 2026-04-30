import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma_global/prisma.service';
import { CreateCashAdvanceDTO } from '../dto/cash-advance';
import { QueryHelper } from 'src/common/queries/leave';
import { tbl_cashadvance } from '@prisma/client';
import { CreateCashAdvance } from '../types/cash';
@Injectable()
export class CashAdvanceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly query: QueryHelper,
  ) {}

  async createCashAdvance(employeeId: string, req: CreateCashAdvance) {
    const isExists = await this.prisma.tbl_cashadvance.findFirst({
      where: {
        employeeId: employeeId,
        status: 'PENDING',
      },
      orderBy: {
        dateSubmitted: 'desc',
      },
    });

    if (isExists) {
      throw new BadRequestException(
        'User have a pending requests, cant request one more cash advance',
      );
    }

    const createRec = await this.query.createLeave<tbl_cashadvance>(
      'tbl_cashadvance',
      {
        employeeId: employeeId,
        ...req,
      },
    );

    return createRec;
  }

  async getMyRecords(employeId: string) {
    const get = await this.prisma.tbl_cashadvance.findMany({
      where: { employeeId: employeId },
      select: {
        id: true,
        dateSubmitted: true,
        amountRequested: true,
        amountApproved: true,
        status: true,
      },
    });

    return get;
  }

  async totalCashAdvance(employeeId: string) {
    const count = await this.prisma.tbl_cashadvance.aggregate({
      where: {
        employeeId: employeeId,
      },
      _sum: {
        amountApproved: true,
      },
    });

    return count._sum.amountApproved;
  }
}

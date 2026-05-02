import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma_global/prisma.service';
import {
  CashAdvanceStatus,
  ReimbursmentStatus,
  Role,
  Status,
} from '@prisma/client';
import { EmployeeStatusDTO } from '../dto/admin.status.dto';
import { EmployeeStatusSuspendedDTO } from '../dto/admin.status.suspended.dto';
import { DateHelper } from 'src/utils/date.utils';
@Injectable()
export class ManagementServiceFeature {
  constructor(
    private readonly prisma: PrismaService,
    private readonly date: DateHelper,
  ) {}

  async viewAdmins() {
    // refer to crud operations at prisma orm queries
    // to filterize a wuery use where, but to select some attributes within the filter use
    // select
    const allAdmins = await this.prisma.user.findMany({
      where: { role: Role.EMPLOYEE },
      select: {
        employeeId: true,
        firstname: true,
        lastname: true,
        email: true,
        status: true,
        invitationDate: true,
        role: true,
      },
    });

    return allAdmins;
  }

  async updateStatus(admin: EmployeeStatusDTO) {
    const user = await this.prisma.user.findFirst({
      where: { employeeId: admin.employeeId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const update = await this.prisma.user.update({
      where: { employeeId: admin.employeeId },
      data: {
        status: admin.status,
      },
    });

    return update.status;
  }

  async setStatusSuspended(
    employeeId: string,
    admin: EmployeeStatusSuspendedDTO,
  ) {
    const date = new Date();
    const user = await this.prisma.user.findFirst({
      where: { employeeId: employeeId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const startDate = new Date(admin.startDate);
    const endDate = new Date(admin.endDate);

    const update = await this.prisma.user.update({
      where: { employeeId: employeeId },
      data: {
        startDate: startDate,
        endDate: endDate,
        status: admin.status,
      },
    });

    return {
      status: update.status,
      startDate: update.startDate,
      endDate: update.endDate,
    };
  }

  async softDelete(employeeId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        employeeId: employeeId,
      },
    });

    if (!user) {
      throw new NotFoundException('User does not exists');
    }

    return await this.prisma.user.update({
      where: {
        employeeId: user.employeeId,
      },
      data: {
        isDeleted: true,
        status: Status.REMOVED,
      },
    });
  }

  async getAllEmployees() {
    let totalActive: number = 0;
    let totalInactive: number = 0;
    let totalPending: number = 0;
    let totalExpired: number = 0;
    let totalSuspended: number = 0;

    const getAll = await this.prisma.user.findMany({
      where: {
        role: Role.EMPLOYEE,
      },
    });

    for (let users of getAll) {
      if (users.status === Status.ACTIVE) {
        totalActive++;
      } else if (users.status === Status.INACTIVE) {
        totalInactive++;
      } else if (users.status === Status.PENDING) {
        totalPending++;
      } else if (users.status === Status.EXPIRED) {
        totalExpired++;
      } else if (users.status === Status.SUSPENDED) {
        totalSuspended;
      }
    }

    const total = await this.prisma.user.count({
      where: { role: Role.EMPLOYEE },
    });

    return {
      totalAccounts: total,
      totalActive: totalActive,
      totalInactive: totalInactive,
      totalPending: totalPending,
      totalExpired: totalExpired,
      totalSuspended: totalSuspended,
    };
  }

  async getSummaryDashboardEmployeeRecords() {
    const date = this.date.getEmployeeToday();

    const getTotal = await this.prisma.user.count({
      where: {
        role: Role.EMPLOYEE,
      },
    });

    const getPresentToday = await this.prisma.tbl_attendance.count({
      where: {
        date: {
          lte: date.lte,
          gte: date.gte,
        },
      },
    });

    const getLeaveToday = await this.prisma.tbl_leave.count({
      where: {
        date: {
          lte: date.lte,
          gte: date.gte,
        },
      },
    });

    const getPendingReimbursements = await this.prisma.tbl_reimbursements.count(
      {
        where: {
          status: ReimbursmentStatus.PENDING,
        },
      },
    );

    const getPendingCashAdvance = await this.prisma.tbl_cashadvance.count({
      where: {
        status: CashAdvanceStatus.PENDING,
      },
    });

    return {
      totalEmployees: getTotal,
      presentToday: getPresentToday,
      onLeaveToday: getLeaveToday,
      pendingReimbursementRequests: getPendingReimbursements,
      pendingCashAdvanceRequests: getPendingCashAdvance,
    };
  }
}

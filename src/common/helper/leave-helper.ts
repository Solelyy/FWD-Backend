import { EmployeeLeaveDTO } from 'src/modules/employee/dto/create-leave';
import { LeaveEnum } from 'src/modules/employee/types/create-leave';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma_global/prisma.service';
@Injectable()
export class LeaveHelper {
  constructor(private readonly prisma: PrismaService) {}

  async getLeaveBal(employeeId: string, span: number, leaveType: LeaveEnum) {
    const userBalance = await this.prisma.user.findFirst({
      where: {
        employeeId: employeeId,
      },
    });

    // explicitly determine key
    const balance = {
      [LeaveEnum.SICK]: userBalance?.sickBalance,
      [LeaveEnum.VACATION]: userBalance?.vacationBalance,
      [LeaveEnum.OTHER]: userBalance?.otherBalance,
      [LeaveEnum.ACCUMULATED]: userBalance?.accumulatedBal,
    };

    // can be treat as params the object
    const currentBalance = balance[leaveType]!;

    if (span > currentBalance) {
      throw new BadRequestException(
        `Insufficient ${leaveType} leave balance. Available: ${currentBalance}, Requested: ${span}`,
      );
    }

    const remainingBal = currentBalance - span;
    return remainingBal;
  }
}

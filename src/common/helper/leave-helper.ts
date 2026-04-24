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
    // by the value of self
    // with squarebracket this uses the value of a passed variable
    // eg. test = 123 [test] : 456
    const leaveData = {
      [LeaveEnum.SICK]: {
        value: userBalance?.sickBalance,
        field: 'sickBalance',
      },
      [LeaveEnum.VACATION]: {
        value: userBalance?.vacationBalance,
        field: 'vacationBalance',
      },
      [LeaveEnum.OTHER]: {
        value: userBalance?.otherBalance,
        field: 'otherBalance',
      },
      [LeaveEnum.ACCUMULATED]: {
        value: userBalance?.accumulatedBal,
        field: 'accumulatedBal',
      },
    };

    // can be treat as params the object
    const currentBalance = leaveData[leaveType].value!;
    const fieldname = leaveData[leaveType].field;

    if (span > currentBalance) {
      throw new BadRequestException(
        `Insufficient ${leaveType} leave balance. Available: ${currentBalance}, Requested: ${span}`,
      );
    }

    const updatedUser = await this.prisma.user.update({
      where: { employeeId: employeeId },
      data: {
        [fieldname]: {
          decrement: span,
        },
      },
    });

    return {
      remainingBalance: updatedUser[fieldname],
      deductedAmount: span,
    };
  }
}

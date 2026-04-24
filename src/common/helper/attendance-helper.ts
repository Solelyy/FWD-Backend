import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma_global/prisma.service';

@Injectable()
export class AttendanceHelper {
  constructor(private readonly prisma: PrismaService) {}

  async sumRequestedLeave(employeeId: string) {
    let remainingBal: number = 0;
    const findRemainingOvertime = await this.prisma.user.findUnique({
      where: { employeeId: employeeId },
    });

    let totalHours: number = findRemainingOvertime?.remainingOvertimeHours || 0;
    let accumulatedLeave: number = findRemainingOvertime?.accumulatedLeave || 0;
    const sum = await this.prisma.tbl_attendance.findMany({
      where: { employeeId: employeeId },
      select: {
        overtime: {
          select: {
            requested_hours: true,
          },
        },
      },
    });

    for (let attendance of sum) {
      totalHours += attendance.overtime?.requested_hours || 0;
    }
    // this divides the totalHours to 8 if met or more
    // than then accumulated leave is store
    accumulatedLeave += Math.floor(totalHours / 8);
    remainingBal = totalHours % 8; // get leftover

    const updateRecord = await this.prisma.user.update({
      where: { employeeId: employeeId },
      data: {
        accumulatedLeave: accumulatedLeave,
        remainingOvertimeHours: remainingBal,
      },
    });

    return {
      accumulatedLeave: updateRecord.accumulatedLeave,
      remainingBal: updateRecord.remainingOvertimeHours,
    };
  }
}

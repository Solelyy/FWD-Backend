import { PrismaService } from 'src/prisma_global/prisma.service';
import { DateHelper } from 'src/utils/date.utils';
import { EmployeeAttendanceLog } from 'src/modules/employee/types/attendancelog.types';
import { NotFoundException } from '@nestjs/common';
import { attendance_Status, OvertimeStatus } from '@prisma/client';
export class AttendanceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly date: DateHelper,
  ) {}

  async getEmployeeAttendance(
    year: number,
    month: number,
    day: number,
    employeeId: string,
  ) {
    let presentToday = 0;
    let absentToday = 0;
    let onLeave = 0;
    let pendingOvertime = 0;

    const date = this.date.getSpanAttendanceDatesLogs(year, month, day);

    const attendances = await this.prisma.tbl_attendance.findMany({
      where: {
        employeeId: employeeId,
        date: {
          gte: date?.date.gte,
          lte: date?.date.lte,
        },
      },
    });

    if (!attendances) {
      throw new NotFoundException('No attendance records');
    }

    for (const attendance of attendances) {
      if (
        attendance.timeOut != null &&
        attendance.status === attendance_Status.COMPLETED
      ) {
        presentToday++;
      } else if (attendance.status === attendance_Status.ABSENT) {
        absentToday++;
      } else if (attendance.status === attendance_Status.ON_LEAVE) {
        onLeave++;
      } else if (attendance.status === attendance_Status.OVERTIME_REQUEST) {
        pendingOvertime++;
      }
    }

    return {
      presentToday: presentToday,
      absentToday: absentToday,
      onLeave: onLeave,
      pendingOvertime: pendingOvertime,
    };
  }

  async getEmployeeAttendanceLogs(
    employeeId: string,
    page: number,
    limit: number,
    year: number,
    month: number,
    filter: string,
  ): Promise<EmployeeAttendanceLog> {
    const dates = this.date.getSpanAttendanceDatesLogs(year, month);

    const employee = await this.prisma.user.findUnique({
      where: { employeeId: employeeId },
      include: {
        attendance: {
          // skip and take are top level for arrays like findMany
          // if single object (findUnique) then skip and take params are called inside of the nessted attribute
          where: {
            date: {
              gte: dates?.date.gte,
              lte: dates?.date.lte,
            },
          },
          skip: (page - 1) * limit,
          take: limit,
          orderBy: {
            date: 'desc',
          },
          include: { overtime: true },
        },
      },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const total = await this.prisma.tbl_attendance.count({
      where: {
        employeeId: employeeId,
        ...(dates && { date: dates.date }),
      },
    });

    const logs = employee.attendance.map((attendance) => ({
      id: attendance.attendanceId,
      employeeId: attendance.employeeId,
      date: attendance.date,
      timeIn: {
        timestamp: attendance.timeIn,
      },
      timeOut: {
        timestamp: attendance.timeOut,
      },
      status: attendance.status,
      overtimeStatus: attendance.overtime?.overtime_status || 'NONE', // default fallback since overtimeStatus can only have a value when a record is created
      totalHours: attendance.totalHours,
    }));

    return {
      logs: logs,
      meta: {
        page: page,
        limit: limit,
        total: total,
      },
    };
  }
}

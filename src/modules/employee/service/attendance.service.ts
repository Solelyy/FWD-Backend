import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma_global/prisma.service';
import { AttendanceDTO } from '../dto/attendance.dto';
import { DateHelper } from 'src/utils/date.utils';
import { WorkingConstraints } from '../interface/get-time.interface';
import { EmployeeAttendanceLog } from '../types/attendancelog.types';
import { attendance_Status } from '@prisma/client';
@Injectable()
export class EmployeeAttendanceService {
  private isLate: boolean;
  private getTime: WorkingConstraints;

  constructor(
    private readonly prisma: PrismaService,
    private readonly date: DateHelper,
  ) {
    this.getTime = date.getWorkingConstraints();
  }

  async EmployeeTimein(employeeId: string, employee: AttendanceDTO) {
    const date = new Date();
    const Euser = await this.prisma.user.findUnique({
      where: { employeeId: employeeId },
    });

    if (!Euser) {
      throw new NotFoundException("User didn't exists.");
    }

    const timeHour = date.getHours();
    const timeInMin = date.getMinutes();
    if (
      timeHour > this.getTime.graceHour ||
      (timeHour === this.getTime.graceHour &&
        timeInMin > this.getTime.graceMinute)
    ) {
      this.isLate = true;
    } else {
      this.isLate = false;
    }

    const storeAttendance = await this.prisma.tbl_attendance.create({
      data: {
        employeeId: Euser.employeeId,
        timeIn: date,
        timeInLoc: employee.location,
        timeInImg: employee.imageUrl,
        isLate: this.isLate,
        status: attendance_Status.IN_PROGRESS,
      },
    });

    return {
      isLate: storeAttendance.isLate,
      timeIn: new Date(storeAttendance.timeIn).toLocaleString('en-PH', {
        timeZone: 'Asia/Manila',
        hour12: true,
      }),
      status: storeAttendance.status,
    };
  }

  async RegularEmployeeTimeOut() {}

  async getEmployeeToday(employeeId: string) {
    const date = this.date.getEmployeeToday();

    const user = await this.prisma.tbl_attendance.findFirst({
      where: {
        employeeId: employeeId,
        date: {
          gte: date.gte,
          lte: date.lte,
        },
      },
      orderBy: {
        timeIn: 'desc',
      },
      include: {
        overtime: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User doesnt exists');
    }

    const timeIn = new Date(user.timeIn).toLocaleString('en-US', {
      timeZone: 'Asia/manila',
      hour12: true,
    });

    const timeOut = user.timeOut
      ? new Date(user.timeOut).toLocaleString('en-US', {
          timeZone: 'Asia/manila',
          hour12: true,
        })
      : null;

    return {
      ...user,
      timeIn: timeIn,
      timeOut: timeOut,
    };
  }

  async getEmployeeAttendanceLogs(
    employeeId: string,
    page: number,
    limit: number,
    year: number,
    month: number,
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

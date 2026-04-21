import { PrismaService } from 'src/prisma_global/prisma.service';
import { DateHelper } from 'src/utils/date.utils';
import { EmployeeAttendanceLog } from 'src/modules/employee/types/attendancelog.types';
import {
  NotFoundException,
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { attendance_Status, OvertimeStatus } from '@prisma/client';
import { AddAttendanceDTO } from '../dto/add-attendance.dto';

@Injectable()
export class AdminAttendanceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly date: DateHelper,
  ) {}

  async getEmployeeAttendance(year: number, month: number, day: number) {
    let presentToday = 0;
    let absentToday = 0;
    let onLeave = 0;
    let pendingOvertime = 0;
    let message: string = 'Attendance succesfully retrieved';

    const date = this.date.getSpanAttendanceDatesLogs(year, month, day);

    // array
    const attendances = await this.prisma.tbl_attendance.findMany({
      where: {
        date: {
          gte: date?.date.gte,
          lte: date?.date.lte,
        },
      },
      include: {
        overtime: true,
      },
    });

    //ensures response if no records for attendance for that specific day
    if (attendances.length === 0) {
      message = 'No attendance records today';
    }

    for (const attendance of attendances) {
      if (attendance.status === attendance_Status.COMPLETED) {
        presentToday++;
      } else if (attendance.status === attendance_Status.NO_RECORD) {
        absentToday++;
      } else if (attendance.status === attendance_Status.ON_LEAVE) {
        onLeave++;
      } else if (
        attendance.overtime?.overtime_status === OvertimeStatus.PENDING
      ) {
        pendingOvertime++;
      }
    }

    return {
      message: message,
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

  async addAttedance(employee: AddAttendanceDTO) {
    const existingEmployee = await this.prisma.tbl_attendance.findFirst({
      where: { employeeId: employee.employeeId },
    });

    if (existingEmployee) {
      throw new ConflictException('attendance already exists');
    }

    const createUserAttendance = await this.prisma.tbl_attendance.create({
      data: {
        employeeId: employee.employeeId,
        timeIn: employee.timeIn,
        timeOut: employee.timeOut,
        status: attendance_Status.COMPLETED,
      },
    });

    return;
  }

  async markAbsent(employeeId: string, status: string) {
    const date = this.date.getEmployeeToday();

    // any rs that is one to many is always returns an array depends what attribute is decalred as array
    const existingEmployee = await this.prisma.user.findUnique({
      where: { employeeId: employeeId },
      include: {
        attendance: {
          where: {
            employeeId: employeeId,
            date: {
              lte: date.lte,
              gte: date.gte,
            },
          },
        },
      },
    });

    if (!existingEmployee) {
      throw new ConflictException('User doesnt exists');
    }

    const attendanceRecord = existingEmployee.attendance[0];

    if (!attendanceRecord) {
      throw new NotFoundException('User doesnt have an attendance for today');
    }

    // always use a unique att to update
    const updateEmployeeRecord = await this.prisma.tbl_attendance.update({
      where: { attendanceId: attendanceRecord.attendanceId },
      data: {
        status: status as attendance_Status, // type assertion, ovveriding
        updatedAt: new Date(),
      },
    });

    return;
  }
}

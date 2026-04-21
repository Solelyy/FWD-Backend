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
import { AttendanceFilterHelper } from '../../../common/helper/filter';

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

  async getAllAttendance(
    page: number,
    limit: number,
    year: number,
    month: number,
    filter: string,
  ) {
    const dates = this.date.getSpanAttendanceDatesLogs(year, month);
    const statusFilter = AttendanceFilterHelper(filter);

    const allLogs = await this.prisma.user.findMany({
      include: {
        attendance: {
          where: {
            ...(statusFilter && { status: statusFilter }),
            date: {
              lte: dates?.date.lte,
              gte: dates?.date.gte,
            },
          },
          skip: (page - 1) * limit,
          take: limit,
          orderBy: {
            date: 'desc',
          },
          include: {
            overtime: true,
          },
        },
      },
    });

    if (!allLogs) {
      throw new NotFoundException('No attendance logs for this month and year');
    }

    const total = await this.prisma.tbl_attendance.count({
      where: {
        ...(statusFilter && { status: statusFilter }),
        date: {
          lte: dates?.date.lte,
          gte: dates?.date.gte,
        },
      },
    });

    const logs = allLogs.flatMap((user) =>
      user.attendance.map((attendance) => ({
        id: attendance.attendanceId,
        attendanceId: attendance.attendanceId,
        employeeId: user.employeeId,
        firstname: user.firstname,
        lastname: user.lastname,
        timeIn: {
          timestamp: attendance.timeIn,
        },
        timeOut: {
          timestamp: attendance.timeOut,
        },
        status: attendance.status,
        overtimeStatus: attendance.overtime?.overtime_status || 'NONE',
        totalHours: attendance.totalHours,
      })),
    );

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

  async markAbsent(attendanceId: number, status: string) {
    const date = this.date.getEmployeeToday();

    // any rs that is one to many is always returns an array depends what attribute is decalred as array
    const findAttendance = await this.prisma.tbl_attendance.findUnique({
      where: { attendanceId: attendanceId },
    });

    if (!findAttendance) {
      throw new ConflictException('no attendance record');
    }

    // always use a unique att to update
    const updateEmployeeRecord = await this.prisma.tbl_attendance.update({
      where: { attendanceId: findAttendance.attendanceId },
      data: {
        status: status as attendance_Status, // type assertion, ovveriding
        updatedAt: new Date(),
      },
    });

    return {
      status: updateEmployeeRecord.status,
      employeeId: updateEmployeeRecord.employeeId,
    };
  }

  async updateAttendance(employee: AddAttendanceDTO) {
    const date = this.date.getEmployeeToday();

    const findEmployee = await this.prisma.tbl_attendance.findFirst({
      where: {
        employeeId: employee.employeeId,
        date: {
          lte: date.lte,
          gte: date.gte,
        },
      },
    });

    if (!findEmployee) {
      throw new NotFoundException('User doesnt have any attendance for today');
    }

    const update = await this.prisma.tbl_attendance.update({
      where: {
        attendanceId: findEmployee.attendanceId,
      },
      data: {
        timeIn: employee.timeIn,
        timeOut: employee.timeOut,
        updatedAt: new Date(),
        status: attendance_Status.COMPLETED,
      },
    });

    return;
  }

  async approveOvertime(adminId: string, attendanceId: number, status: string) {
    const date = this.date.getEmployeeToday();

    const findEmployee = await this.prisma.tbl_attendance.findUnique({
      where: {
        attendanceId: attendanceId,
      },
      include: {
        overtime: {
          select: {
            attendance_id: true,
          },
        },
      },
    });

    if (!findEmployee) {
      throw new NotFoundException('this attendance doesnt exists');
    }

    if (!findEmployee.overtime) {
      throw new NotFoundException('no overtime record for this attendance');
    }

    const update = await this.prisma.tbl_overtime.update({
      where: { attendance_id: findEmployee.overtime.attendance_id },
      data: {
        overtime_status: status as OvertimeStatus,
        approved_by: adminId,
        approved_at: new Date(),
      },
    });

    return {
      update: update.approved_by,
    };
  }
}

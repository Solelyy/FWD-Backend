import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma_global/prisma.service';
import { AttendanceDTO } from '../dto/attendance.dto';
import { DateHelper } from 'src/utils/date.utils';
import { WorkingConstraints } from '../types/get-time.types';
@Injectable()
export class EmployeeAttendanceService {
  isLate: boolean;
  getTime: WorkingConstraints;

  constructor(
    private readonly prisma: PrismaService,
    private readonly date: DateHelper,
  ) {
    this.getTime = date.getWorkingConstraints();
  }

  async EmployeeTimein(employeeId: string, employee: AttendanceDTO) {
    const Euser = await this.prisma.user.findUnique({
      where: { employeeId: employeeId },
    });

    if (!Euser) {
      throw new NotFoundException("User didn't exists.");
    }

    const timeIn = new Date(employee.timeStamp);
    const timeHour = timeIn.getHours();
    const timeInMin = timeIn.getMinutes();
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
        timeIn: employee.timeStamp,
        timeInLoc: employee.location,
        timeInImg: employee.imageUrl,
        overtimeHours: null,
        isLate: this.isLate,
      },
    });
  }
}

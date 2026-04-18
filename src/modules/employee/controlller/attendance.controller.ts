import {
  Controller,
  Post,
  Query,
  Get,
  UseGuards,
  Req,
  NotFoundException,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from 'src/modules/auth/guard/auth.guard';
import type { RequestData } from 'src/modules/auth/interface/reqdata';
import { EmployeeAttendanceService } from '../service/attendance.service';
import { AttendanceDTO } from '../dto/attendance.dto';
import { CustomValidationPipe } from '../../../common/custom-pipes/pipes.custom-pipes';
import type { AttendanceLogsQueries } from '../interface/log-queries.interface';
import { RolesGuard } from 'src/modules/auth/guard/roles.guard';
import { Roles } from 'src/common/custom-decorators/Roles.decorator';
@Controller('employee')
export class AttendanceController {
  constructor(private readonly service: EmployeeAttendanceService) {}

  @Post('attendance/time-in')
  @Roles('EMPLOYEE')
  @UseGuards(AuthGuard, RolesGuard)
  async employeeTimeIn(
    @Req() req: RequestData,
    @Body(CustomValidationPipe) user: AttendanceDTO,
  ) {
    const data = req.user?.employeeId;

    if (!data) {
      throw new NotFoundException('User not found');
    }

    const service = await this.service.EmployeeTimein(data, user);

    return {
      success: true,
      message: 'user time in successfully',
      isLate: service.isLate,
      timeIn: service.timeIn,
      status: service.status,
    };
  }

  @Post('attendance/time-out')
  @Roles('EMPLOYEE')
  @UseGuards(AuthGuard, RolesGuard)
  async employeeTimeOut(
    @Req() req: RequestData,
    @Body(CustomValidationPipe) employee: AttendanceDTO,
  ) {
    const employeeId = req.user?.employeeId;

    if (!employeeId) {
      throw new NotFoundException('User not found');
    }

    const service = await this.service.RegularEmployeeTimeOut(
      employee,
      employeeId,
    );

    return {
      success: true,
      message: 'user time out successfully',
      status: service.status,
    };
  }

  @Post('attendance/overtime/time-out')
  @Roles('EMPLOYEE')
  @UseGuards(AuthGuard, RolesGuard)
  async employeeTimeOutOvertime(
    @Req() req: RequestData,
    @Body(CustomValidationPipe) employee: AttendanceDTO,
  ) {
    const employeeId = req.user?.employeeId;

    if (!employeeId) {
      throw new NotFoundException('User not found');
    }

    const service = await this.service.overtimeEmployeeTimeOut(
      employee,
      employeeId,
    );

    return {
      success: true,
      message: 'user time out successfully, waiting for overtime approval',
      status: service.status,
    };
  }

  @Get('attendance/today')
  @Roles('EMPLOYEE')
  @UseGuards(AuthGuard, RolesGuard)
  async getEmployeeAttendanceToday(@Req() user: RequestData) {
    const employeeId = user.user?.employeeId;

    if (!employeeId) {
      throw new NotFoundException('User not found');
    }

    const results = await this.service.getEmployeeToday(employeeId);

    return {
      message: "employee's today attendance retrieved succcesfully",
      success: true,
      status: results.status,
      canTimeIn: results.canTimeIn,
      isLate: results.isLate,
      isUndertime: results.isUndertime,
      timeIn: results.timeIn,
      timeOut: results.timeOut,
      timeInLocation: results.timeInLoc,
      timeOutLocation: results.timeOutLoc,
      timeInImage: results.timeInImg,
      timeOutImage: results.timeOutImg,
      overtimeStatus: results.overtime?.overtime_status,
    };
  }

  @Get('attendance-logs')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('EMPLOYEE')
  async getAttendanceLogs(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
    @Req() user: RequestData,
  ) {
    const employeeId = user.user?.employeeId;

    if (!employeeId) {
      throw new NotFoundException('User not found');
    }

    const logs = await this.service.getEmployeeAttendanceLogs(
      employeeId,
      page,
      limit,
      year,
      month,
    );

    return logs;
  }
}

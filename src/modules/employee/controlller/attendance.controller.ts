import {
  Controller,
  Post,
  Query,
  Get,
  UseGuards,
  Req,
  NotFoundException,
  Body,
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
  @UseGuards(AuthGuard)
  async setDataPolicy(
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
    };
  }

  @Get('attendance-logs')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('EMPLOYEE')
  async getAttendanceLogs(
    @Query() queries: AttendanceLogsQueries,
    @Req() user: RequestData,
  ) {
    const { page, limit, year, month } = queries;
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

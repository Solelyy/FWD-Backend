import {
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Body,
  Query,
  Req,
  UseGuards,
  Patch,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from 'src/modules/auth/guard/auth.guard';
import { ExternalService } from '../service/external-admin.service';
import { Roles } from 'src/common/custom-decorators/Roles.decorator';
import { RolesGuard } from 'src/modules/auth/guard/roles.guard';
import { AdminAttendanceService } from '../service/attendance.service';
import { CustomValidationPipe } from 'src/common/custom-pipes/pipes.custom-pipes';
import { AddAttendanceDTO } from '../dto/add-attendance.dto';
import type { RequestData } from 'src/modules/auth/interface/reqdata';
import { OvertimeStatusDTO } from '../dto/overtime-status.dto';
import { AttendanceStatusFilter } from '../interface/filter.interface';

@Controller('admin')
export class AdminAttendanceController {
  constructor(private readonly service: AdminAttendanceService) {}

  @Roles('ADMIN')
  @UseGuards(AuthGuard, RolesGuard)
  @Get('employee-attendance')
  async resendEmail(
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
    @Query('day', ParseIntPipe) day: number,
  ) {
    const service = await this.service.getEmployeeAttendance(year, month, day);

    return {
      success: true,
      message: service.message,
      presentToday: service.presentToday,
      absentToday: service.absentToday,
      onLeave: service.onLeave,
      pendingOvertime: service.pendingOvertime,
    };
  }

  @Roles('ADMIN')
  @UseGuards(AuthGuard, RolesGuard)
  @Get('employee/attendance')
  async getAllAttendance(
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('filter') filter: string,
  ) {
    const service = await this.service.getAllAttendance(
      page,
      limit,
      year,
      month,
      filter,
    );

    return {
      success: true,
      message: 'Attendance logs retrieved successfully',
      logs: service.logs,
      meta: {
        page: service.meta.page,
        limit: service.meta.limit,
        total: service.meta.total,
      },
    };
  }

  @Roles('ADMIN')
  @UseGuards(AuthGuard, RolesGuard)
  @Post('employee/add-attendance')
  async addEmployeeAttenadance(
    @Body(CustomValidationPipe) employee: AddAttendanceDTO,
  ) {
    const service = await this.service.addAttedance(employee);

    return {
      success: true,
      message: 'Successfully added attendance for employee',
    };
  }

  @Roles('ADMIN')
  @UseGuards(AuthGuard, RolesGuard)
  @Patch('employee/absent')
  async markAbsent(@Body(CustomValidationPipe) employee: OvertimeStatusDTO) {
    const service = await this.service.markAbsent(
      employee.attendanceId,
      employee.status,
    );

    return {
      success: true,
      message: 'employee marked as an absent for today',
      status: service.status,
      employeeId: service.employeeId,
    };
  }

  @Roles('ADMIN')
  @UseGuards(AuthGuard, RolesGuard)
  @Patch('employee/update-attendance')
  async updateAttendance(
    @Body(CustomValidationPipe) employee: AddAttendanceDTO,
  ) {
    const service = await this.service.updateAttendance(employee);

    return {
      success: true,
      message: 'Successfully updated employee attendance',
    };
  }

  @Roles('ADMIN')
  @UseGuards(AuthGuard, RolesGuard)
  @Patch('employee/overtime/status')
  async approveOvertime(
    @Body(CustomValidationPipe) employee: OvertimeStatusDTO,
    @Req() req: RequestData,
  ) {
    const admin = req.user?.employeeId;

    if (!admin) {
      throw new BadRequestException('Invalid Id');
    }
    const service = await this.service.approveOvertime(
      admin,
      employee.attendanceId,
      employee.status,
    );

    return {
      success: true,
      message: 'Successfully updated overtime status attendance',
      approvedBy: service.update,
    };
  }
}

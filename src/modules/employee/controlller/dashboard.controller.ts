import {
  Controller,
  Patch,
  Get,
  UseGuards,
  Req,
  Query,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from 'src/modules/auth/guard/auth.guard';
import { DashboardService } from '../service/dashboard.service';
import type { RequestData } from 'src/modules/auth/interface/reqdata';
import { RolesGuard } from 'src/modules/auth/guard/roles.guard';
import { Roles } from 'src/common/custom-decorators/Roles.decorator';
@Controller('employee')
export class DashboardController {
  constructor(private readonly service: DashboardService) {}

  @Patch('data-policy')
  @Roles('EMPLOYEE')
  @UseGuards(AuthGuard, RolesGuard)
  async setDataPolicy(@Req() req: RequestData) {
    const data = req.user?.employeeId;

    if (!data) {
      throw new NotFoundException('User not found');
    }

    const update = await this.service.acceptDataPolicy(data);

    return {
      success: true,
      message: 'data policy accepted',
      id: update.id,
      employeeId: update.employeeId,
      firstname:update.firstname,
      lastname: update.lastname,
      role: update.role,
      email: update.email,
      isDataPolicyAccepted: update.isDataPolicyAccepted
    };
  }

  @Get('attendance-summary')
  @Roles('EMPLOYEE')
  @UseGuards(AuthGuard, RolesGuard)
  async getAttendanceEmployeeSummary(
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
    @Req() req: RequestData,
  ) {
    const employeeId = req.user?.employeeId;
    if (!employeeId) {
      throw new NotFoundException('User not found');
    }
    const summary = await this.service.getAttendanceSummary(
      year,
      month,
      employeeId,
    );

    return {
      totalLogs: summary.totalLogs,
      totalWorkedHours: summary.totalHours,
      presentDays: summary.presentDays,
      accumulatedOvertime: summary.accumulatedOvertime,
    };
  }

  @Get('is-overtime')
  isOvertime() {
    const service = this.service.isOvertime();

    return {
      success: true,
      message: 'Overtime fetched',
      isOvertime: service.isOvertime,
    };
  }
}
